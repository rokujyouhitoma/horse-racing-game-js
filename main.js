"use strict";

var Utility = {};

/**
 * Fisher–Yates shuffle
 * @param {Array<Object>} array The array.
 * @return {Array<Object>} The shuffled array.
 */
Utility.FisherYatesShuffle = function(array){
    var shuffled = array.slice();
    for(var i = array.length - 1; 0 < i; i--){
        var r = Math.floor((Utility.FisherYatesShuffle.Random.rand() / Xorshift.MAX_VALUE) * (i + 1));
        var tmp = shuffled[i];
        shuffled[i] = shuffled[r];
        shuffled[r] = tmp;
    }
    return shuffled;
};

Utility.FisherYatesShuffle.Random = new Xorshift();

/**
 * @constructor
 * @extends {GameObject}
 * @implements {IGameObject}
 */
var Game = function(){
    this.fps = new FPS();
    this.objects = [
        this.fps,
        Game.Locator.locate(GameDirector),
    ];
    Game.Publisher.Subscribe(Events.Game.OnLastUpdate, this.OnLastUpdate.bind(this));
};
Game.prototype = new GameObject();

Game.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    Game.Publisher.Publish(Events.Game.OnStart, this);
};

Game.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, deltaTime);
    Game.Publisher.Publish(Events.Game.OnUpdate, this, {deltaTime: deltaTime});
};

Game.prototype.LastUpdate = function(deltaTime){
    GameObject.prototype.LastUpdate.call(this, deltaTime);
    Game.Publisher.Publish(Events.Game.OnLastUpdate, this, {deltaTime: deltaTime});
};

Game.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    Game.Publisher.Publish(Events.Game.OnDestroy, this);
};

Game.prototype.OnLastUpdate = function(e){
    Game.LastUpdateTask.ExecuteAll();
};

Game.LocatorContainer = {};
Game.Locator = new Locator(Game.LocatorContainer);

Game.Publisher = Game.Locator.locate(Publisher);

Game.SceneDirector = Game.Locator.locate(SceneDirector);

Game.LastUpdateTask = new BasicExecuter();

Game.Model = function(name){
    var meta = Game.Locator.locate(MasterData).GetMeta(name);
    return new Model(meta);
};

Game.Entity = function(name, model){
    return new ({
        "StepCard": StepCard,
        "RankCard": RankCard,
        "DashCard": DashCard,
        "PlayCard": PlayCard,
        //TODO: xxx
    }[name])(model);
};

Game.Log = function(message){
    Game.Publisher.Publish(Events.GameDirector.OnLogMessage, Game, {message: message});
    console.log(message);
};

var Events = {
    Game: {
        OnStart: "Events.Game.OnStart",
        OnUpdate: "Events.Game.OnUpdate",
        OnLastUpdate: "Events.Game.OnLastUpdate",
        OnDestroy: "Events.Game.OnDestroy",
    },
    GameScene: {
        OnEnter: "Events.GameScene.OnEnter",
        OnExit: "Events.GameScene.OnExit",
        OnPause: "Events.GameScene.OnPause",
        OnResume: "Events.GameScene.OnResume",
    },
    GameDirector: {
        OnResetGame: "Events.GameDirector.OnResetGame",
        OnNewRace: "Events.GameDirector.OnNewRace",
        OnLogMessage: "Events.GameDirector.OnLogMessage",
    },
    Race: {
        OnPlacingFirst: "Events.Race.OnPlacingFirst",
        OnPlacingSecond: "Events.Race.OnPlacingSecond",
        OnPlayCard: "Events.Race.OnPlayCard",
        OnUndoPlayCard: "Events.Race.OnUndoPlayCard", // For debug?
    },
    // For debug.
    Debug: {
        OnResetGame: "Events.Debug.OnResetGame",
        OnResetRace: "Events.Debug.OnResetRace",
        OnPlayCard: "Events.Debug.OnPlayCard",
        OnUndoPlayCard: "Events.Debug.OnUndoPlayCard",
        OnPlayRankCard: "Events.Debug.OnPlayRankCard",
        OnPlayDashCard: "Events.Debug.OnPlayDashCard",
        OnMove: "Events.Debug.OnMove",
        OnCheckRelationship: "Events.Debug.OnCheckRelationship",
    },
};

/**
 * @constructor
 */
var GameDirector = function(){
    this.objects = [
        Game.Locator.locate(RepositoryDirector),
        Game.Locator.locate(HorseFigureDirector),
        Game.Locator.locate(MonsterCoinDirector),
        Game.Locator.locate(MonsterFigureDirector),
    ];
    this.events = [
        [Events.GameDirector.OnLogMessage, this.OnLogMessage.bind(this), null],
        [Events.GameDirector.OnNewRace, this.OnNewRace.bind(this), null],
        [Events.GameDirector.OnResetGame, this.OnResetGame.bind(this), null],
    ];
    Game.Publisher.Subscribe(Events.Game.OnStart, this.OnStart.bind(this));
    Game.Publisher.Subscribe(Events.Game.OnDestroy, this.OnDestroy.bind(this));
};
GameDirector.prototype = new GameObject();

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnStart = function(e){
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
    Game.Publisher.Publish(Events.GameDirector.OnResetGame, this);
};

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnDestroy = function(e){
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnLogMessage = function(e){
    var message = e.payload["message"];
//    console.log(message);
    //TODO: xxx
};

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnResetGame = function(e){
    Game.SceneDirector.ToDepth(0);
    Game.SceneDirector.Push(new GameScene("Title"));
};

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnNewRace = function(e){
    //TODO: xxx, priority high.
    Game.SceneDirector.ToDepth(0);
    Game.SceneDirector.Push(new GameScene("Menu"));
    Game.SceneDirector.Push(new GameScene("Race"));
    Game.SceneDirector.Push(new GameScene("Debug"));
    var row = Game.Locator.locate(MasterData).Get("Race")[0];
    var model = Game.Model("Race").Set(row);
    var race = new Race(model);
    race.Start();
    this.objects.push(race);
    this.race = race;
};

/**
 * @constructor
 */
var CommandExecuter = function(){
    /** type {Array<ICommand>} */
    this.commands_ = [];
    /** type {number} */
    this.position_ = 0;
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
CommandExecuter.prototype.OnUpdate = function(e){
    for(var command of this.Generator()){
        command.Execute();
    }
};

CommandExecuter.prototype.Execute = function(command){
    this.commands_.push(command);
};

CommandExecuter.prototype.Undo = function(){
    if(this.commands_.length <= 0){
        return;
    }
    var command = this.commands_.pop();
    command.Undo();
    this.position_ -= 1
};

/**
 * @return {!Iterator<ICommand>}
 */
CommandExecuter.prototype.Generator = function*(){
    var position = this.position_;
    var commands = this.commands_;
    var length = this.commands_.length;
    for(var i = position; i < length; i++){
        this.position_ += 1;
        yield commands[i];
    }
};

/**
 * @constructor
 */
var Model = function(meta){
    /** @private */
    this.meta_ = meta;
};

Model.prototype.Set = function(value){
    var names = this.meta_.names;
    var types = this.meta_.types;
    for(var i = 0; i < names.length; i++){
        var type = types[i];
        this[names[i]] = Model.Cast(type, value[i]);
    }
    return this;
};

Model.Cast = function(type, string){
    switch(type){
    case Model.Types.Int:
        return parseInt(string, 10);
    case Model.Types.String:
        return string;
    }
};

/**
 * @enum {string}
 */
Model.Types = {
    Int: "int",
    String: "string",
};

/**
 * @interface
 */
var Loader = function(){};

/**
 * @param {string} key The key.
 * @return {Array<Array<string>>} The rows.
 */
Loader.prototype.Load = function(key){};

/**
 * @constructor
 * @implements {Loader}
 */
var StubLoader = function(){
    this.stub = {
        "HorseFigure": [
            ["id", "type", "color"],
            ["int", "string", "string"],
            ["1", "Red", "FF0000"],
            ["2", "Orange", "FFA500"],
            ["3", "Green", "008000"],
            ["4", "Blue", "0000FF"],
            ["5", "Purple", "800080"],
        ],
        "MonsterCoin": [
            ["id", "type"],
            ["int", "string"],
            ["1", "Dragon"],
            ["2", "Daemon"],
            ["3", "Drakee"],
            ["4", "Golem"],
            ["5", "Ghost"],
        ],
        "MonsterFigure": [
            ["id", "type"],
            ["int", "string"],
            ["1", "Dragon"],
            ["2", "Daemon"],
            ["3", "Drakee"],
            ["4", "Golem"],
            ["5", "Ghost"],
        ],
        "Race": [
            ["id", "len"],
            ["int", "int"],
            ["1", "70"],
        ],
        "PlayCard": [
            ["id", "card_type", "detail_id"],
            ["int", "int", "int"],
            ["1", "1", "1"],
            ["2", "1", "1"],
            ["3", "1", "1"],
            ["4", "1", "2"],
            ["5", "1", "2"],
            ["6", "1", "2"],
            ["7", "1", "3"],
            ["8", "1", "3"],
            ["9", "1", "3"],
            ["10", "1", "4"],
            ["11", "1", "4"],
            ["12", "1", "4"],
            ["13", "1", "5"],
            ["14", "1", "5"],
            ["15", "1", "5"],
            ["16", "1", "6"],
            ["17", "1", "6"],
            ["18", "1", "6"],
            ["19", "1", "7"],
            ["20", "1", "7"],
            ["21", "1", "7"],
            ["22", "1", "8"],
            ["23", "1", "8"],
            ["24", "1", "8"],
            ["25", "1", "9"],
            ["26", "1", "9"],
            ["27", "1", "9"],
            ["28", "1", "10"],
            ["29", "1", "10"],
            ["30", "1", "10"],
            ["31", "1", "11"],
            ["32", "1", "11"],
            ["33", "1", "11"],
            ["34", "1", "12"],
            ["35", "1", "12"],
            ["36", "1", "12"],
            ["37", "1", "13"],
            ["38", "1", "13"],
            ["39", "1", "13"],
            ["40", "1", "14"],
            ["41", "1", "14"],
            ["42", "1", "14"],
            ["43", "1", "15"],
            ["44", "1", "15"],
            ["45", "1", "15"],
            ["46", "2", "1"],
            ["47", "2", "2"],
            ["48", "2", "3"],
            ["49", "2", "4"],
            ["50", "2", "5"],
            ["51", "2", "6"],
            ["52", "2", "7"],
            ["53", "2", "8"],
            ["54", "2", "9"],
            ["55", "2", "10"],
            ["56", "2", "11"],
            ["57", "2", "12"],
            ["58", "2", "13"],
            ["59", "3", "1"],
            ["60", "3", "2"],
        ],
        "StepCard": [
            ["id", "target_id", "step"],
            ["int", "int", "int"],
            ["1", "1", "5"],
            ["2", "1", "9"],
            ["3", "1", "10"],
            ["4", "2", "5"],
            ["5", "2", "6"],
            ["6", "2", "8"],
            ["7", "3", "4"],
            ["8", "3", "5"],
            ["9", "3", "7"],
            ["10", "4", "4"],
            ["11", "4", "5"],
            ["12", "4", "6"],
            ["13", "5", "3"],
            ["14", "5", "4"],
            ["15", "5", "5"],
        ],
        "RankCard": [
            ["id", "target_rank", "step"],
            ["int", "int", "int"],
            ["1", "1", "5"],
            ["2", "1", "10"],
            ["3", "1", "15"],
            ["4", "2", "5"],
            ["5", "2", "10"],
            ["6", "2", "15"],
            ["7", "3", "5"],
            ["8", "3", "10"],
            ["9", "3", "15"],
            ["10", "4", "5"],
            ["11", "4", "10"],
            ["12", "4", "15"],
            ["13", "-1", "35"],
        ],
        "DashCard": [
            ["id", "target_rank", "dash_type"],
            ["int", "int", "int"],
            ["1", "1", "1"],
            ["2", "2", "2"],
        ],
    };
};

/**
 * @param {string} key The key.
 * @return {Array<Array<string>>} The rows.
 */
StubLoader.prototype.Load = function(key){
    return this.stub[key];
};

/**
 * @constructor
 * @param {Array<string>} names The columns name.
 * @param {Array<string>} types The columns type.
 * @param {Object=} opt_relationships The relationships definition.
 */
var MasterMeta = function(names, types, opt_relationships){
    this.names = names;
    this.types = types;
    this.relationships = opt_relationships;
};

/**
 * @constructor
 */
var MasterData = function(){
    /** @private */
    this.loader_ = new StubLoader();
    /** @private */
    this.meta_ = {
        "HorseFigure": {},
        "MonsterCoin": {},
        "MonsterFigure": {},
        "Race": {},
        "PlayCard": {
            "relationships": [
                {
                    "filters": [
                        {
                            "condition": "Equal",
                            "name": "card_type",
                            "value": 1,
                        },
                    ],
                    "from": {
                        "name": "detail_id",
                    },
                    "to": {
                        "object": "StepCard",
                        "name": "id",
                    },
                },
                {
                    "filters": [
                        {
                            "condition": "equal",
                            "name": "card_type",
                            "value": 2,
                        },
                    ],
                    "from": {
                        "name": "detail_id",
                    },
                    "to": {
                        "object": "RankCard",
                        "name": "id",
                    },
                },
                {
                    "filters": [
                        {
                            "condition": "equal",
                            "name": "card_type",
                            "value": 3,
                        },
                    ],
                    "from": {
                        "name": "detail_id",
                    },
                    "to": {
                        "object": "RankCard",
                        "name": "id",
                    },
                },
            ],
        },
        "StepCard": {},
        "RankCard": {},
        "DashCard": {},
    };
};

/**
 * @param {string} key The Master name.
 * @return {Array<Array<string>>} The raw row data.
 */
MasterData.prototype.Get = function(key){
    var rows = this.loader_.Load(key);
    return rows.slice(2);
};

/**
 * @param {string} key The MasterMeta name.
 * @return {MasterMeta} The master meta object.
 */
MasterData.prototype.GetMeta = function(key){
    /** @type {Array<Array<string>>} */
    var rows = this.loader_.Load(key);
    /** @type {Array<Array<string>>} */
    var header = rows.slice(0, 2);
    /** @type {Array<string>} */
    var names = header[0];
    /** @type {Array<string>} */
    var types = header[1];
    /** @type {MasterMeta} */
    var meta = new MasterMeta(names, types);
    if(this.meta_[key] && this.meta_[key]["relationships"]){
        meta["relationships"] = this.meta_[key]["relationships"];
    }
    return meta;
};

/**
 * @constructor
 */
var HorseFigure = function(model){
    /** @type {Model} */
    this.model = model;
};
HorseFigure.prototype = new GameObject();

/**
 * @constructor
 */
var HorseFigureDirector = function(){
    this.figures = {};
};
HorseFigureDirector.prototype = new GameObject();

HorseFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    var figures = Game.Locator.locate(MasterData).Get("HorseFigure").map(function(row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    });
    figures.forEach(function(figure){
        this.figures[figure.model["id"]] = figure;
        figure.Start();
    }, this);
};

HorseFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    this.figure = {};
};

/**
 * @constructor
 */
var MonsterCoin = function(model){
    /** @type {Model} */
    this.model = model;
};
MonsterCoin.prototype = new GameObject();

/**
 * @constructor
 */
var MonsterCoinDirector = function(){
    this.coins = {};
};
MonsterCoinDirector.prototype = new GameObject();

MonsterCoinDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    var coins = Game.Locator.locate(MasterData).Get("MonsterCoin").map(function(row){
        return new MonsterCoin(Game.Model("MonsterCoin").Set(row));
    });
    coins.forEach(function(coin){
        this.coins[coin.model["id"]] = coin;
        coin.Start();
    }, this);
};

MonsterCoinDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    this.coins = {};
};

/**
 * @constructor
 */
var MonsterFigure = function(model){
    /** @type {Model} */
    this.model = model;
};
MonsterFigure.prototype = new GameObject();

/**
 * @constructor
 */
var MonsterFigureDirector = function(){
    this.figures = {};
};
MonsterFigureDirector.prototype = new GameObject();

MonsterFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    var figures = Game.Locator.locate(MasterData).Get("MonsterFigure").map(function(row){
        return new MonsterFigure(Game.Model("MonsterFigure").Set(row));
    });
    figures.forEach(function(figure){
        this.figures[figure.model["id"]] = figure;
        figure.Start();
    }, this);
};

MonsterFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    this.figures = {};
};

/**
 * @interface
 */
var Card = function(){};

/**
 * @param {Race} racetrack The racetrack.
 * @return {?CardEffect} The object.
 */
Card.prototype.Play = function(racetrack){};

/**
 * @return {string} The message string.
 */
Card.prototype.LogMessage = function(){};

/**
 * @interface
 */
var CardEffect = function(){};

/**
 * 
 */
CardEffect.prototype.Apply = function(){};

/**
 * 
 */
CardEffect.prototype.UnApply = function(){};

/**
 * @constructor
 * @implements {CardEffect}
 * @param {Race} race The race.
 * @param {Lane} lane The lane.
 * @param {number} step The stap.
 */
var StepCardEffect = function(race, lane, step){
    this.race_ = race;
    this.lane_ = lane;
    this.step_ = step;
};

/**
 * 
 */
StepCardEffect.prototype.Apply = function(){
    var race = Game.Locator.locate(GameDirector).race;
    if(race === this.race_){
        this.lane_.position += this.step_;
    }
};

/**
 *
 */
StepCardEffect.prototype.UnApply = function(){
    var race = Game.Locator.locate(GameDirector).race;
    if(race === this.race_){
        this.lane_.position -= this.step_;
    }
};

/**
 * @constructor
 * @implements {Card}
 */
var StepCard = function(model){
    /** @type {Model} */
    this.model = model;
};

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
        return null;
    }
    return new StepCardEffect(race, lane, step);
};

StepCard.prototype.LogMessage = function(){
    var target_id = this.model["target_id"];
    var step = this.model["step"];
    var racetrack = Game.Locator.locate(GameDirector).race.gameBoard.racetrack;
    var figures = racetrack.lanes.filter(function(lane){
        return lane.runner.model["id"] === target_id;
    }).map(function(lane){
        return lane.runner;
    });
    var target = figures.map(function(figure){
        return figure.model["type"];
    }).join(",");
    return ["[Step]: ", target, " +", step,].join("");
};

/**
 * @constructor
 * @implements {Card}
 */
var RankCard = function(model){
    /** @type {Model} */
    this.model = model;
};

RankCard.prototype.Play = function(race){
    var target_rank = this.model["target_rank"];
    var step = this.model["step"];
    var ranks = race.Ranks();
    if(!(target_rank in ranks)){
        return null;
    }
    var lanes = ranks[target_rank];
    if(0 < lanes.length && lanes.length < 2){
        var lane = lanes[0];
        return new StepCardEffect(race, lane, step);
    } else {
        return null;
    }
};

RankCard.prototype.LogMessage = function(){
    var target_rank = this.model["target_rank"];
    var step = this.model["step"];
    return [
        "[Rank]: ", target_rank, " +", step,
    ].join("");
};

/**
 * @constructor
 * @implements {Card}
 */
var DashCardTypeBoost = function(){};
DashCardTypeBoost.prototype.Play = function(race){
    var ranks = race.Ranks();
    // for defensive.
    if(!(1 in ranks)){
        //TODO: xxx
        return null;
    }
    if(1 < ranks[1].length){
        //TODO: xxx
        return null;
    }
    if(!(2 in ranks)){
        //TODO: xxx
        return null;
    }
    var first = ranks[1][0];
    var second = ranks[2][0];
    var step = (first.position - second.position) * 2;
    return new StepCardEffect(race, first, step);
};

DashCardTypeBoost.prototype.LogMessage = function(){};

/**
 * @constructor
 * @implements {Card}
 */
var DashCardTypeCatchUp = function(){};
DashCardTypeCatchUp.prototype.Play = function(race){
    var ranks = race.Ranks();
    // for defensive.
    if(!(1 in ranks)){
        //TODO: xxx
        return null;
    }
    if(1 < ranks[1].length){
        //TODO: xxx
        return null;
    }
    if(!(2 in ranks)){
        //TODO: xxx
        return null;
    }
    var first = ranks[1][0];
    var second = ranks[2][0];
    var step = (first.position - 1) - second.position;
    return new StepCardEffect(race, second, step);
};

DashCardTypeCatchUp.prototype.LogMessage = function(){};

/**
 * @constructor
 * @implements {Card}
 */
var DashCard = function(model){
    /** @type {Model} */
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

DashCard.prototype.Play = function(race){
    return this.behavior.Play(race);
};

DashCard.prototype.LogMessage = function(){
    var target_rank = this.model["target_rank"];
    return [
        "[Dash]: ", target_rank,
    ].join("");
};

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
 * @implements {Card}
 */
var PlayCard = function(model){
    /** @type {Model} */
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

PlayCard.prototype.GetCard = function(){
    var detail_id = this.model["detail_id"];
    var name = this.GetCardName();
    var repositoryDirector = Game.Locator.locate(RepositoryDirector);
    var repository = repositoryDirector.Get(name);
    return repository.Find(detail_id);
};

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
};

PlayCard.prototype.Play = function(race){
    return this.card.Play(race);
};

PlayCard.prototype.LogMessage = function(){
    return this.card.LogMessage();
};

/**
 * @constructor
 * @implements {ICommand}
 * @param {Race} race The race.
 * @param {Card} card The card.
 */
var PlayCardCommand = function(race, card){
    /** @type {Race} */
    this.race_ = race;
    /** @type {Card} */
    this.card_ = card;
    /** @type {?CardEffect} */
    this.cardEffect_ = null;
};

PlayCardCommand.prototype.Execute = function(){
    var race = this.race_;
    var card = this.card_;
    var cardEffect = race.Apply(card);
    if(!cardEffect) {
        return;
    }
    cardEffect.Apply();
    this.cardEffect_ = cardEffect;
    Game.Log([
//        this.position, " ",
        card.LogMessage(),
        " ",
        "card_id=",
        card.model["id"],
    ].join(""));
};

PlayCardCommand.prototype.Undo = function(){
    var card = this.card_;
    var cardEffect = this.cardEffect_;
    if(!cardEffect){
        return;
    }
    cardEffect.UnApply();
    Game.Log([
        "[Debug] Undo: ",
        card.LogMessage(),
        " ",
        "card_id=",
        card.model["id"],
    ].join(""))
};

/**
 * @constructor
 */
var Lane = function(index, number, runner, len){
    this.index = index;
    this.number = number;
    this.runner = runner;
    this.len = len;
    this.position = Lane.GatePosition;
};
Lane.prototype = new GameObject();

Lane.GatePosition = 0;

Lane.prototype.IsGatePosition = function(){
    return this.position === Lane.GatePosition
};

Lane.prototype.IsGolePosition = function(){
    return this.len < this.position;
};

/**
 * @constructor
 */
var Racetrack = function(runners, len){
    this.runners = runners;
    this.len = len;
    this.lanes = [];
};
Racetrack.prototype = new GameObject();

Racetrack.prototype.Start = function(){
    this.lanes = this.runners.map(function(runner, index, array){
        var number = index + 1;
        return new Lane(index, number, runner, this.len);
    }.bind(this));
    this.objects.concat(this.lanes);
    GameObject.prototype.Start.call(this);
};

/**
 * @constructor
 */
var GameBoard = function(race){
    this.race = race;
    this.racetrack = null;
};
GameBoard.prototype = new GameObject();

GameBoard.prototype.Start = function(){
    var master = Game.Locator.locate(MasterData);
    var length = this.race.model["len"];
    this.racetrack = new Racetrack(master.Get("HorseFigure").map(function(row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    }), length);
    this.objects = [
        this.racetrack,
    ];
    GameObject.prototype.Start.call(this);
};

/**
 * @constructor
 */
var Race = function(model){
    /** @type {Model} */
    this.model = model;
    /** @type {GameBoard} */
    this.gameBoard = new GameBoard(this);
};
Race.prototype = new GameObject();

Race.prototype.Start = function(){
    this.objects = [
        this.gameBoard,
    ];
    GameObject.prototype.Start.call(this);
};

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
 */
var RepositoryDirector = function(){
    this.repository = new Repository();
    [
        ["StepCard", new Repository()],
        ["RankCard", new Repository()],
        ["DashCard", new Repository()],
        ["PlayCard", new Repository()],
    ].forEach(function(value){
        this.repository.Store(value[0], value[1]);
    }, this);
};
RepositoryDirector.prototype = new GameObject();

RepositoryDirector.prototype.Get = function(name){
    return this.repository.Find(name);
};

RepositoryDirector.prototype.Start = function(){
    var names = [
        "StepCard",
        "RankCard",
        "DashCard",
        "PlayCard",
    ];
    names.forEach(function(modelName){
        Game.Locator.locate(MasterData).Get(modelName).forEach(function(row){
            var model = Game.Model(modelName).Set(row);
            var entity = Game.Entity(modelName, model);
            this.repository.Find(modelName).Store(model["id"], entity);
        }, this);
    }, this);
};

/**
 * @constructor
 */
var FPS = function(){
    var engine = Game.Locator.locate(Engine);
    this.baseTime = engine.lastUpdate;
    this.baseCount = 0;
    this.currentFPS = 0;
};
FPS.prototype = new GameObject();

FPS.prototype.Update = function(deltaTime){
    var engine = Game.Locator.locate(Engine);
    if(1000 <= engine.lastUpdate - this.baseTime){
        this.currentFPS = ((engine.count - this.baseCount) * 1000) / (engine.lastUpdate - this.baseTime);
        this.baseTime = engine.lastUpdate;
        this.baseCount = engine.count;
    }
};

/**
 * @constructor
 */
var PlayCardDirector = function(scene){
    /** @type {CommandExecuter} */
    this.executer_ = new CommandExecuter();
    this.playCards = [];
    this.position = 0;
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
    this.OnPlayCardListener = this.OnPlayCard.bind(this);
    this.OnUndoPlayCardListener = this.OnUndoPlayCard.bind(this);
};

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnEnter = function(e){
    var repositoryDirector = Game.Locator.locate(RepositoryDirector);
    var repository = repositoryDirector.Get("PlayCard");
    var playCards = repository.All();
    this.playCards = Utility.FisherYatesShuffle(playCards);
    this.position = 0;
    Game.Publisher.Subscribe(Events.Race.OnPlayCard, this.OnPlayCardListener);
    Game.Publisher.Subscribe(Events.Race.OnUndoPlayCard, this.OnUndoPlayCardListener);
};

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnExit = function(e){
    this.playCards = [];
    this.position = 0;
    Game.Publisher.UnSubscribe(Events.Race.OnPlayCard, this.OnPlayCardListener);
    Game.Publisher.UnSubscribe(Events.Race.OnUndoPlayCard, this.OnUndoPlayCardListener);
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnPlayCard = function(e){
    /** @type {Iterator<PlayCard>} */
    var g = this.Generator();
    /** @type {PlayCard} */
    var card = g.next().value;
    if(!card){
        Game.Log("404 Card Not found.");
        return;
    }
    var race = Game.Locator.locate(GameDirector).race;
    var command = new PlayCardCommand(race, card);
    this.position += 1;
    this.executer_.Execute(command);
};

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnUndoPlayCard = function(e){
    if(0 < this.position){
        this.position -= 1;
        this.executer_.Undo();
    }
};

/**
 * @return {!Iterator<PlayCard>}
 */
PlayCardDirector.prototype.Generator = function*(){
    var position = this.position;
    var playCards = this.playCards;
    var length = this.playCards.length;
    for(var i = position; i < length; i++){
        yield playCards[i];
    }
};

/**
 * @constructor
 */
var RaceDirector = function(scene){
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
    this.OnPlacingFirstListener = this.OnPlacingFirst.bind(this);
    this.OnPlacingSecondListener = this.OnPlacingSecond.bind(this);
};

/**
 * @enum {number}
 */
RaceDirector.State = {
    None: 0b00, // Before race.
    First: 0b01, // official order of placing First.
    Second: 0b10, // official order of placing Second.
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnUpdate = function(e){
    var game = Game.Locator.locate(GameDirector);
    //TODO: xxx
    if(!game.race){
        return;
    }
    var lanes = game.race.gameBoard.racetrack.lanes;
    var runners = lanes.filter(function(lane){
        return !this.goals_.includes(lane.runner) && lane.IsGolePosition();
    }.bind(this)).map(function(lane){
        return lane.runner;
    });
    if(0 < runners.length){
        this.goals_.push(runners[0]);
        this.UpdateState();
    }
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnEnter = function(e){
    Game.Publisher.Subscribe(Events.Race.OnPlacingFirst, this.OnPlacingFirstListener);
    Game.Publisher.Subscribe(Events.Race.OnPlacingSecond, this.OnPlacingSecondListener);
    this.goals_ = [];
    this.state = RaceDirector.State.None;
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnExit = function(e){
    Game.Publisher.UnSubscribe(Events.Race.OnPlacingFirst, this.OnPlacingFirstListener);
    Game.Publisher.UnSubscribe(Events.Race.OnPlacingSecond, this.OnPlacingSecondListener);
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
    this.goals_ = [];
    this.state = RaceDirector.State.None;
};

/**
 *
 */
RaceDirector.prototype.UpdateState = function(){
    var state = this.state;
    switch(state){
    case RaceDirector.State.None:
        this.state = state | RaceDirector.State.First;
        Game.Publisher.Publish(Events.Race.OnPlacingFirst, this);
        break;
    case RaceDirector.State.First:
        this.state = state | RaceDirector.State.Second;
        Game.Publisher.Publish(Events.Race.OnPlacingSecond, this);
        break;
    case RaceDirector.State.Second:
        break;
    }
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnPlacingFirst = function(e){
    var placings = this.goals_.slice(0, 1).map(function(figure){
        return figure.model["type"];
    });
    var first = placings[0];
    Game.Log("The first: " + first);
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnPlacingSecond = function(e){
    var placings = this.goals_.slice(0, 2).map(function(figure){
        return figure.model["type"];
    });
    var first = placings[0];
    var second = placings[1];
    Game.Log("The first: " + first);
    Game.Log("The second: " + second);
};

/**
 * @constructor
 * @param {string} name Scene name.
 * @implements {IScene}
 * @extends {Scene}
 */
var GameScene = function(name){
    this.name = name;
    var directors = {
        "Title": function(scene){
            return [];
        },
        "Menu": function(scene){
            return [];
        },
        "Race": function(scene){
            return [
                new RaceDirector(scene),
                new PlayCardDirector(scene),
            ];
        },
        "Debug": function(scene){
            return [];
        },
    };
    var renderers = {
        "Title": function(scene){
            return [
                new TitleSceneRenderer(scene)
            ];
        },
        "Menu": function(scene){
            return [
                new MenuRenderer(scene)
            ];
        },
        "Race": function(scene){
            return [
                new RacetrackRenderer(scene),
                new LogMessageRenderer(scene),
            ];
        },
        "Debug": function(scene){
            return [
                new DebugMenuRenderer(scene),
                new FPSRenderer(scene),
            ];
        },
    };
    this.directors = directors[name](this);
    this.renderers = renderers[name](this);
};
GameScene.prototype = new Scene();
GameScene.prototype.OnEnter = function(){
    Game.Publisher.Publish(Events.GameScene.OnEnter, this);
};
GameScene.prototype.OnExit = function(){
    Game.Publisher.Publish(Events.GameScene.OnExit, this);
};
GameScene.prototype.OnPause = function(){
    Game.Publisher.Publish(Events.GameScene.OnPause, this);
};
GameScene.prototype.OnResume = function(){
    Game.Publisher.Publish(Events.GameScene.OnResume, this);
};

// TODO: xxx
// For debug.
(new RelationshipChecker()).CheckAll([
    "HorseFigure",
    "MonsterCoin",
    "MonsterFigure",
    "Race",
    "PlayCard",
    "StepCard",
    "RankCard",
    "DashCard",
]);

// main
(window.onload = function(){
    var engine = Game.Locator.locate(Engine);
    engine.FPS = 1000 / 60;
    engine.objects = [
        Game.Locator.locate(Game),
    ];
    engine.Start();
    engine.Loop();
    console.log(engine);
});
