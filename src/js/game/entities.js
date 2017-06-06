"use strict";

/**
 * @constructor
 * @param {Model} model The model.
 */
var HorseFigure = function(model){
    this.model = model;
    /** @type {Lane} */
    this.lane = null;
};
HorseFigure.prototype = new GameObject();

/**
 * @constructor
 * @param {Model} model The model.
 */
var MonsterCoin = function(model){
    this.model = model;
};
MonsterCoin.prototype = new GameObject();

/**
 * @constructor
 * @param {Model} model The model.
 */
var MonsterFigure = function(model){
    this.model = model;
};
MonsterFigure.prototype = new GameObject();

/**
 * @constructor
 * @param {Model} model The model.
 */
var Race = function(model){
    this.model = model;
    var master = Game.Locator.locate(MasterData);
    var racetrack = new Racetrack(master.Get("HorseFigure").map(function(row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    }), model["len"]);
    var oddsTable = new OddsTable(master.Get("Odds").map(function(row){
        return new Odds(Game.Model("Odds").Set(row));
    }));
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
 * @return {Object} The ranks object. key=-1 means last, key=0 means goals.
 */
Race.prototype.Ranks = function(){
    var lanes = this.gameBoard.racetrack.lanes;
    var len = this.model["len"];
    var sorted = lanes.slice().sort(function(a, b){
        return a.position - b.position;
    }).reverse();
    var position;
    var rank = 0;
    var goals = [];
    var ranks = {};
    sorted.forEach(function(lane){
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
    this.model = model;
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
    var detail_id = this.model["detail_id"];
    var name = this.GetCardName();
    var repositoryDirector = Game.Locator.locate(RepositoryDirector);
    var repository = repositoryDirector.Get(name);
    return repository.Find(detail_id);
};

/**
 * @return {string} card type.
 */
PlayCard.prototype.GetCardName = function(){
    var card_type = this.model["card_type"];
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
    this.model = model;
};

/**
 * @param {Race} race The race object.
 * @return {ICardEffect} The card effect object.
 */
StepCard.prototype.Play = function(race){
    var target_id = this.model["target_id"];
    var step = this.model["step"];
    var lanes = race.gameBoard.racetrack.lanes.filter(function(lane){
        return lane.runner.model["id"] === target_id;
    }).filter(function(lane){
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
    var target_id = this.model["target_id"];
    var step = this.model["step"];
    var raceDirector = Game.SceneDirector.CurrentScene().directors["RaceDirector"];
    if(!raceDirector){
        return "";
    }
    var race = raceDirector.race;
    if(!race){
        return "";
    }
    var racetrack = race.gameBoard.racetrack;
    var figures = racetrack.lanes.filter(function(lane){
        return lane.runner.model["id"] === target_id;
    }).map(function(lane){
        return lane.runner;
    });
    var target = figures.map(function(figure){
        return figure.model["type"];
    }).join(",");
    return ["[Step ", target, " +", step, "]"].join("");
};

/**
 * @constructor
 * @implements {ICard}
 * @param {Model} model The model.
 */
var RankCard = function(model){
    this.model = model;
};

/**
 * @param {Race} race The race object.
 * @return {ICardEffect} The card effect object.
 */
RankCard.prototype.Play = function(race){
    var target_rank = this.model["target_rank"];
    var step = this.model["step"];
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
    var target_rank = this.model["target_rank"];
    var step = this.model["step"];
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
    this.model = model;
    var dashType = model["dash_type"];
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
    var target_rank = this.model["target_rank"];
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
    this.model = model;
    this["model"] = model; //for template.
};
