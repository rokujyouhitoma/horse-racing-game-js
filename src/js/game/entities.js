"use strict";

/**
 * @constructor
 * @extends {GameObject}
 * @param {Model} model The model.
 */
var HorseFigure = function(model){
    GameObject.call(this);
    /** @type {Model} */
    this.model = model;
    /** @type {Lane} */
    this.lane = null;
};
inherits(HorseFigure, GameObject);

/**
 * @constructor
 * @extends {GameObject}
 * @param {Model} model The model.
 */
var MonsterCoin = function(model){
    GameObject.call(this);
    /** @type {Model} */
    this.model = model;
};
inherits(MonsterCoin, GameObject);

/**
 * @constructor
 * @extends {GameObject}
 * @param {Model} model The model.
 */
var MonsterFigure = function(model){
    GameObject.call(this);
    /** @type {Model} */
    this.model = model;
};
inherits(MonsterFigure, GameObject);

/**
 * @constructor
 * @param {Model} model The model.
 */
var Race = function(model){
    /** @type {Model} */
    this.model = model;
    var master = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var m = /** @type {!Object<string,*>} */ (model);
    var racetrack = new Racetrack(master.Get("HorseFigure").map(function(/** !Array<string> */ row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    }), /** @type {number} */ (m["len"]));
    var oddsTable = new OddsTable(master.Get("Odds").map(function(/** !Array<string> */ row){
        return new Odds(Game.Model("Odds").Set(row));
    }));
    /** @type {!GameBoard} */
    this.gameBoard = new GameBoard(this, racetrack, oddsTable);
};

/**
 * @param {ICard} card A card.
 * @return {ICardEffect} card effect.
 */
Race.prototype.Apply = function(card){
    return card.Play(this);
};

/**
 * @return {!Object<number, !Array<!Lane>>} The ranks object. key=-1 means last, key=0 means goals.
 */
Race.prototype.Ranks = function(){
    var lanes = this.gameBoard.racetrack.lanes;
    var sorted = lanes.slice().sort(function(/** !Lane */ a, /** !Lane */ b){
        return a.position - b.position;
    }).reverse();
    /** @type {number|undefined} */
    var position;
    /** @type {number} */
    var rank = 0;
    /** @type {!Array<!Lane>} */
    var goals = [];
    /** @type {!Object<number, !Array<!Lane>>} */
    var ranks = {};
    sorted.forEach(function(/** !Lane */ lane){
        if(lane.IsGolePosition()){
            goals.push(lane);
        } else {
            if(position !== lane.position){
                rank += 1;
            }
            if(!(rank in ranks)){
                ranks[rank] = [];
            }
            ranks[rank].push(lane);
            position = lane.position;
        }
    });
    // -1 means last
    ranks[-1] = ranks[rank];
    // 0 means goals
    ranks[0] = goals;
    return ranks;
};

/**
 * @constructor
 * @implements {ICard}
 * @param {Model} model The model.
 */
var PlayCard = function(model){
    /** @type {Model} */
    this.model = model;
    /** @type {ICard} */
    this.card = this.GetCard();
};

/**
 * @enum {number}
 */
PlayCard.CardType = {
    StepCard: 1,
    RankCard: 2,
    DashCard: 3,
};

/**
 * @return {ICard} card.
 */
PlayCard.prototype.GetCard = function(){
    var m = /** @type {!Object<string,*>} */ (this.model);
    var detail_id = /** @type {number} */ (m["detail_id"]);
    var name = this.GetCardName();
    var repositoryDirector = /** @type {!RepositoryDirector} */ (Game.Locator.locate(RepositoryDirector));
    var repository = /** @type {!Repository} */ (repositoryDirector.Get(name));
    return /** @type {ICard} */ (repository.Find(detail_id));
};

/**
 * @return {string} card type.
 */
PlayCard.prototype.GetCardName = function(){
    var m = /** @type {!Object<string,*>} */ (this.model);
    var card_type = m["card_type"];
    switch(card_type){
    case PlayCard.CardType.StepCard:
        return "StepCard";
    case PlayCard.CardType.RankCard:
        return "RankCard";
    case PlayCard.CardType.DashCard:
        return "DashCard";
    }
    return "";
};

/**
 * @param {Race} race A race.
 * @return {ICardEffect} card effect.
 */
PlayCard.prototype.Play = function(race){
    return this.card.Play(race);
};

/**
 * @return {string} log message.
 */
PlayCard.prototype.LogMessage = function(){
    return this.card.LogMessage();
};

/**
 * @constructor
 * @implements {ICard}
 * @param {Model} model The model.
 */
var StepCard = function(model){
    /** @type {Model} */
    this.model = model;
};

/**
 * @param {Race} race The race object.
 * @return {ICardEffect} The card effect object.
 */
StepCard.prototype.Play = function(race){
    var m = /** @type {!Object<string,*>} */ (this.model);
    var target_id = m["target_id"];
    var step = /** @type {number} */ (m["step"]);
    var lanes = race.gameBoard.racetrack.lanes.filter(function(/** !Lane */ lane){
        return (/** @type {!Object<string,*>} */ (lane.runner.model))["id"] === target_id;
    }).filter(function(/** !Lane */ lane){
        return !lane.IsGolePosition();
    });
    var lane = lanes[0];
    if(!lane){
        return new NoneCardEffect();
    }
    return new StepCardEffect(race, lane, step);
};

/**
 * @return {string} log message.
 */
StepCard.prototype.LogMessage = function(){
    var m = /** @type {!Object<string,*>} */ (this.model);
    var target_id = m["target_id"];
    var step = m["step"];
    var currentScene = /** @type {!GameScene} */ (Game.SceneDirector.CurrentScene());
    var directors = /** @type {!Object<string,*>} */ (currentScene.directors);
    var raceDirector = /** @type {RaceDirector} */ (directors["RaceDirector"]);
    if(!raceDirector){
        return "";
    }
    var race = raceDirector.race;
    if(!race){
        return "";
    }
    var racetrack = race.gameBoard.racetrack;
    var figures = racetrack.lanes.filter(function(/** !Lane */ lane){
        return (/** @type {!Object<string,*>} */ (lane.runner.model))["id"] === target_id;
    }).map(function(/** !Lane */ lane){
        return lane.runner;
    });
    var target = figures.map(function(/** !HorseFigure */ figure){
        return (/** @type {!Object<string,*>} */ (figure.model))["type"];
    }).join(",");
    return ["[Step ", target, " +", step, "]"].join("");
};

/**
 * @constructor
 * @implements {ICard}
 * @param {Model} model The model.
 */
var RankCard = function(model){
    /** @type {Model} */
    this.model = model;
};

/**
 * @param {Race} race The race object.
 * @return {ICardEffect} The card effect object.
 */
RankCard.prototype.Play = function(race){
    var m = /** @type {!Object<string,*>} */ (this.model);
    var target_rank = /** @type {number} */ (m["target_rank"]);
    var step = /** @type {number} */ (m["step"]);
    var ranks = race.Ranks();
    if(!(target_rank in ranks)){
        return new NoneCardEffect();
    }
    var lanes = ranks[target_rank];
    if(0 < lanes.length && lanes.length < 2){
        var lane = lanes[0];
        return new StepCardEffect(race, lane, step);
    } else {
        return new NoneCardEffect();
    }
};

/**
 * @return {string} log message.
 */
RankCard.prototype.LogMessage = function(){
    var m = /** @type {!Object<string,*>} */ (this.model);
    var target_rank = m["target_rank"];
    var step = m["step"];
    return [
        "[Rank ", target_rank, " +", step, "]"
    ].join("");
};

/**
 * @constructor
 * @implements {ICard}
 * @param {Model} model The model.
 */
var DashCard = function(model){
    /** @type {Model} */
    this.model = model;
    var m = /** @type {!Object<string,*>} */ (model);
    var dashType = /** @type {DashCard.DashType} */ (m["dash_type"]);
    /** @type {ICard} */
    this.behavior = this.GetBehavior(dashType);
};

/**
 * @enum {number}
 */
DashCard.DashType = {
    Boost: 1,
    CatchUp: 2,
};

/**
 * @param {Race} race A race.
 * @return {ICardEffect} card effect.
 */
DashCard.prototype.Play = function(race){
    return this.behavior.Play(race);
};

/**
 * @return {string} log message.
 */
DashCard.prototype.LogMessage = function(){
    var m = /** @type {!Object<string,*>} */ (this.model);
    var target_rank = m["target_rank"];
    return [
        "[Dash ", target_rank, "]"
    ].join("");
};

/**
 * @param {DashCard.DashType} dashType The dash type.
 * @return {ICard} card.
 */
DashCard.prototype.GetBehavior = function(dashType){
    switch(dashType){
    case DashCard.DashType.Boost:
        return new DashCardTypeBoost();
    case DashCard.DashType.CatchUp:
        return new DashCardTypeCatchUp();
    default:
        throw new Error("Not support DashCard.DashType:" + dashType);
    }
};

/**
 * @constructor
 * @param {Model} model The model.
 */
var Odds = function(model){
    /** @type {Model} */
    this.model = model;
    /** @type {Model} */
    this["model"] = model; //for template.
};
