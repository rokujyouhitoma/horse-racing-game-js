"use strict";

/**
 * Support for brower API(windows.history and windows.location).
 * @constructor
 */
var CustomSceneDirector = function(){
    this.director = new SceneDirector();
    this.router = new Router();
    this.router.Registers([
        new Matcher(/^Race$/, this.Routing.bind(this)),
        new Matcher(/^Title$/, this.Routing.bind(this)),
        new Matcher(/^Result$/, this.Routing.bind(this)),
        new Matcher(/.*/, this.RoutingDefault.bind(this)),
    ]);
    window.addEventListener("popstate", this.RoutingLocationHash.bind(this));
};

/**
 * Routing default.
 */
CustomSceneDirector.prototype.RoutingDefault = function(){
    Game.Publisher.Publish(Events.GameDirector.OnResetGame, this);
};

/**
 * @param {string} name A game scene name.
 */
CustomSceneDirector.prototype.Routing = function(name){
    this.ToDepth(0);
    this.Push(new GameScene(name));
};

/**
 * Routing by used of window.location.hash.
 */
CustomSceneDirector.prototype.RoutingLocationHash = function(){
    var hash = window.location.hash;
    if(hash){
        var name = hash.charAt(1).toUpperCase() + hash.substring(2);
        this.router.Route(name);
    } else {
        Game.Publisher.Publish(Events.GameDirector.OnResetGame, this);
    }
};

/**
 * @return {IScene} The current scene.
 */
CustomSceneDirector.prototype.CurrentScene = function(){
    return this.director.CurrentScene();
};

/**
 * @param {IScene} scene A scene.
 */
CustomSceneDirector.prototype.Push = function(scene){
    window.history.pushState({name: scene.name}, scene.name, "#" + scene.name);
    this.director.Push(scene);
};

/**
 * @return {IScene} A scene.
 */
CustomSceneDirector.prototype.Pop = function(){
    return this.director.Pop();
};

/**
 * @param {number|null} toDepth To depth number.
 */
CustomSceneDirector.prototype.ToDepth = function(toDepth){
    this.director.ToDepth(toDepth);
};

/**
 * @param {IScene} scene A scene.
 */
CustomSceneDirector.prototype.Replace = function(scene){
    window.history.pushState({name: scene.name}, scene.name, "#" + scene.name);
    this.director.Replace(scene);
};

/**
 * @constructor
 * @extends {GameObject}
 * @implements {IGameObject}
 */
var Game = function(){
    GameObject.call(this);
    /** @type {!FPS} */
    this.fps = new FPS();
    this.objects = [
        this.fps,
    ];
    Game.Publisher.Subscribe(Events.Game.OnRender, this.OnRender.bind(this));
    Game.Publisher.Publish(Events.Game.OnAwake, this);
};
inherits(Game, GameObject);

/**
 * Start.
 */
Game.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    Game.Publisher.Publish(Events.Game.OnStart, this);
};

/**
 * Update.
 */
Game.prototype.Update = function(){
    GameObject.prototype.Update.call(this);
    Game.Publisher.Publish(Events.Game.OnUpdate, this);
};

/**
 * Last Update.
 */
Game.prototype.LastUpdate = function(){
    GameObject.prototype.LastUpdate.call(this);
};

/**
 * @param {number} delta The delta. range is 0-1.
 */
Game.prototype.Render = function(delta){
    GameObject.prototype.Render.call(this, delta);
    Game.Publisher.Publish(Events.Game.OnRender, this, {delta: delta});
};

/**
 * Destroy.
 */
Game.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    Game.Publisher.Publish(Events.Game.OnDestroy, this);
};

/**
 * @param {ExEvent} e The event object.
 */
Game.prototype.OnRender = function(e){
    // This is different from Start/Update/LastUpdate/Destroy
    Game.RenderCommandExecuter.ExecuteAll();
};

Game.LocatorContainer = new Map();
/** @type {!Locator} */
Game.Locator = new Locator(Game.LocatorContainer);

/** @type {!Publisher} */
Game.Publisher;
Object.defineProperty(Game, "Publisher", {
    get: function(){
        return /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    },
    configurable: true
});

/** @type {!CustomSceneDirector} */
Game.SceneDirector;
Object.defineProperty(Game, "SceneDirector", {
    get: function(){
        return /** @type {!CustomSceneDirector} */ (Game.Locator.locate(CustomSceneDirector));
    },
    configurable: true
});

/** @type {!BasicExecuter} */
Game.RenderCommandExecuter = new BasicExecuter();

/**
 * @param {string} name The meta name.
 * @return {!Model} . 
 */
Game.Model = function(name){
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var meta = masterData.GetMeta(name);
    return new Model(meta);
};

/**
 * @param {string} name Entity name.
 * @param {Model} model The model.
 * @return {ICard} .
 */
Game.Entity = function(name, model){
    var ctor = /** @type {function(new:Object, Model)} */ ({
        "StepCard": StepCard,
        "RankCard": RankCard,
        "DashCard": DashCard,
        "PlayCard": PlayCard,
        "Odds": Odds,
    }[name]);
    return /** @type {!ICard} */ (new ctor(model));
};

/**
 * @param {string} message The message.
 */
Game.Log = function(message){
    Game.Publisher.Publish(Events.GameDirector.OnLogMessage, Game, {message: message});
//    console.log(message);
};

/**
 * @constructor
 */
var GameDirector = function(){
    /** @type {!Array<!GameObject>} */
    this.objects = [
        /** @type {!GameObject} */ (Game.Locator.locate(HorseFigureDirector)),
        /** @type {!GameObject} */ (Game.Locator.locate(MonsterCoinDirector)),
        /** @type {!GameObject} */ (Game.Locator.locate(MonsterFigureDirector)),
    ];
    /** @type {!Array<!Array<(string|function(ExEvent)|Object)>>} */
    this.events = [
        [Events.GameDirector.OnResetGame, this.OnResetGame.bind(this), null],
        [Events.GameDirector.OnToRaceScene, this.OnToRaceScene.bind(this), null],
        [Events.GameDirector.OnLogMessage, this.OnLogMessage.bind(this), null],
    ];
    Game.Publisher.Subscribe(Events.Game.OnStart, this.OnStart.bind(this));
    Game.Publisher.Subscribe(Events.Game.OnDestroy, this.OnDestroy.bind(this));
};

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnStart = function(e){
    this.events.forEach(function(/** !Array<(string|function(ExEvent)|Object)> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
    Game.SceneDirector.RoutingLocationHash();
};

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnDestroy = function(e){
    this.events.forEach(function(/** !Array<(string|function(ExEvent)|Object)> */ event){
        Game.Publisher.UnSubscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
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
GameDirector.prototype.OnToRaceScene = function(e){
    Game.SceneDirector.ToDepth(0);
    Game.SceneDirector.Replace(new GameScene("Race"));
};

/**
 * @param {ExEvent} e The event object.
 */
GameDirector.prototype.OnLogMessage = function(e){
    //TODO: xxx
};

/**
 * @constructor
 */
var CommandExecuter = function(){
    /** @type {!Array<!ICommand>} */
    this.commands_ = [];
    /** @type {number} */
    this.position_ = 0;
    /** @type {!Array<!Array<(string|function(ExEvent)|Object)>>} */
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
    ];
    this.events.forEach(function(/** !Array<(string|function(ExEvent)|Object)> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
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

/**
 * @param {!ICommand} command The command.
 */
CommandExecuter.prototype.Execute = function(command){
    this.commands_.push(command);
};

/**
 * Undo.
 */
CommandExecuter.prototype.Undo = function(){
    if(this.commands_.length <= 0){
        return;
    }
    var command = this.commands_.pop();
    command.Undo();
    this.position_ -= 1;
};

/**
 * @return {!Iterable<!ICommand>}
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
 * @param {!MasterMeta} meta The meta. 
 */
var Model = function(meta){
    /** @type {!MasterMeta} */
    this.meta_ = meta;
};

/**
 * @param {!Array<string>} value The value.
 * @return {!Model} .
 */
Model.prototype.Set = function(value){
    var names = this.meta_.names;
    var types = this.meta_.types;
    for(var i = 0; i < names.length; i++){
        var type = types[i];
        (/** @type {!Object<string, *>} */ (this))[names[i]] = Model.Cast(type, value[i]);
    }
    return this;
};

/**
 * @param {Model.Types} type The type.
 * @param {string} string The string.
 * @return {string|number} .
 */
Model.Cast = function(type, string){
    switch(type){
    case Model.Types.Int:
        return parseInt(string, 10);
    case Model.Types.String:
        return string;
    }
    throw Error("Not support: " + type);
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
var ILoader = function(){};

/**
 * @param {string} key The key.
 * @return {Array<Array<string>>} The rows.
 */
ILoader.prototype.Load = function(key){};

/**
 * @constructor
 * @implements {ILoader}
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
            ["1", "Salamander"],
            ["2", "Phoenix"],
            ["3", "Griffin"],
            ["4", "Kelpie"],
            ["5", "Wyvern"],
        ],
        "MonsterFigure": [
            ["id", "type"],
            ["int", "string"],
            ["1", "Salamander"],
            ["2", "Phoenix"],
            ["3", "Griffin"],
            ["4", "Kelpie"],
            ["5", "Wyvern"],
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
        "Odds": [
            ["id", "first_id", "second_id", "odds"],
            ["int", "int", "int", "int"],
            ["1", "1", "2", "5"],
            ["2", "1", "3", "7"],
            ["3", "1", "4", "10"],
            ["4", "1", "5", "14"],
            ["5", "2", "3", "8"],
            ["6", "2", "4", "11"],
            ["7", "2", "5", "15"],
            ["8", "3", "4", "13"],
            ["9", "3", "5", "17"],
            ["10", "4", "5", "20"],
            // ["11", "2", "1", "5"],
            // ["12", "3", "1", "7"],
            // ["13", "4", "1", "10"],
            // ["14", "5", "1", "14"],
            // ["15", "3", "2", "8"],
            // ["16", "4", "2", "11"],
            // ["17", "5", "2", "15"],
            // ["18", "4", "3", "13"],
            // ["19", "5", "3", "17"],
            // ["20", "5", "4", "20"],
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
 * @param {!Array<string>} names The columns name.
 * @param {!Array<Model.Types>} types The columns type.
 * @param {Object=} opt_relationships The relationships definition.
 * @param {Object=} opt_validations The validations definition.
 */
var MasterMeta = function(names, types, opt_relationships, opt_validations){
    /** @type {!Array<string>} */
    this.names = names;
    /** @type {!Array<Model.Types>} */
    this.types = types;
    /** @type {Object|undefined} */
    this.relationships = opt_relationships;
    /** @type {Object|undefined} */
    this.validations = opt_validations;
};

/**
 * @constructor
 */
var MasterData = function(){
    /** @private */
    /** @const */ this.loader_ = new StubLoader();
    /** @private @const {!Object<string, !Object<string, *>>} */
    this.meta_ = {
        "HorseFigure": {
            "validations": {
                "id": { "min": 1 },
                "type": { "nonEmpty": true },
                "color": { "regex": "^[0-9A-Fa-f]{6}$" }
            }
        },
        "MonsterCoin": {
            "validations": {
                "id": { "min": 1 },
                "type": { "nonEmpty": true }
            }
        },
        "MonsterFigure": {
            "validations": {
                "id": { "min": 1 },
                "type": { "nonEmpty": true }
            }
        },
        "Race": {
            "validations": {
                "id": { "min": 1 },
                "len": { "min": 1 }
            }
        },
        "PlayCard": {
            "validations": {
                "id": { "min": 1 },
                "card_type": { "in": [1, 2, 3] },
                "detail_id": { "min": 1 }
            },
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
        "StepCard": {
            "validations": {
                "id": { "min": 1 },
                "target_id": { "min": 1 },
                "step": { "min": 1 }
            }
        },
        "RankCard": {
            "validations": {
                "id": { "min": 1 },
                "target_rank": { "in": [-1, 1, 2, 3, 4] },
                "step": { "min": 1 }
            }
        },
        "DashCard": {
            "validations": {
                "id": { "min": 1 },
                "target_rank": { "min": 1 },
                "dash_type": { "in": [1, 2] }
            }
        },
        "Odds": {
            "validations": {
                "id": { "min": 1 },
                "first_id": { "min": 1 },
                "second_id": { "min": 1 },
                "odds": { "min": 1 }
            }
        }
    };
};

/**
 * @param {string} key The Master name.
 * @return {!Array<!Array<string>>} The raw row data.
 */
MasterData.prototype.Get = function(key){
    var rows = /** @type {!Array<!Array<string>>} */ (this.loader_.Load(key));
    return rows.slice(2);
};

/**
 * @param {string} key The MasterMeta name.
 * @return {!MasterMeta} The master meta object.
 */
MasterData.prototype.GetMeta = function(key){
    /** @type {!Array<!Array<string>>} */
    var rows = /** @type {!Array<!Array<string>>} */ (this.loader_.Load(key));
    /** @type {!Array<!Array<string>>} */
    var header = rows.slice(0, 2);
    /** @type {!Array<string>} */
    var names = /** @type {!Array<string>} */ (header[0]);
    /** @type {!Array<Model.Types>} */
    var types = /** @type {!Array<Model.Types>} */ (header[1]);
    /** @type {!MasterMeta} */
    var meta = new MasterMeta(names, types);
    if(this.meta_[key] && this.meta_[key]["relationships"]){
        meta["relationships"] = this.meta_[key]["relationships"];
    }
    if(this.meta_[key] && this.meta_[key]["validations"]){
        meta["validations"] = this.meta_[key]["validations"];
    }
    return meta;
};

/**
 * @constructor
 * @extends {GameObject}
 */
var HorseFigureDirector = function(){
    GameObject.call(this);
    /** @type {!Object<string, !HorseFigure>} */
    this.figures = {};
};
inherits(HorseFigureDirector, GameObject);

/**
 * Start.
 */
HorseFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var figures = /** @type {!Array<!HorseFigure>} */ (masterData.Get("HorseFigure").map(function(/** !Array<string> */ row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    }));
    figures.forEach(function(/** !HorseFigure */ figure){
        this.figures[figure.model["id"]] = figure;
        figure.Start();
    }, this);
};

/**
 * Destroy.
 */
HorseFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    this.figure = {};
};

/**
 * @constructor
 * @extends {GameObject}
 */
var MonsterCoinDirector = function(){
    GameObject.call(this);
    /** @type {!Object<string, !MonsterCoin>} */
    this.coins = {};
};
inherits(MonsterCoinDirector, GameObject);

/**
 * Start.
 */
MonsterCoinDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var coins = /** @type {!Array<!MonsterCoin>} */ (masterData.Get("MonsterCoin").map(function(/** !Array<string> */ row){
        return new MonsterCoin(Game.Model("MonsterCoin").Set(row));
    }));
    coins.forEach(function(/** !MonsterCoin */ coin){
        this.coins[coin.model["id"]] = coin;
        coin.Start();
    }, this);
};

/**
 * Destory.
 */
MonsterCoinDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    /** @type {!Object<string, !MonsterCoin>} */
    this.coins = {};
};

/**
 * @constructor
 * @extends {GameObject}
 */
var MonsterFigureDirector = function(){
    GameObject.call(this);
    /** @type {!Object<string, !MonsterFigure>} */
    this.figures = {};
};
inherits(MonsterFigureDirector, GameObject);

/**
 * Start.
 */
MonsterFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this);
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var figures = /** @type {!Array<!MonsterFigure>} */ (masterData.Get("MonsterFigure").map(function(/** !Array<string> */ row){
        return new MonsterFigure(Game.Model("MonsterFigure").Set(row));
    }));
    figures.forEach(function(/** !MonsterFigure */ figure){
        this.figures[figure.model["id"]] = figure;
        figure.Start();
    }, this);
};

/**
 * Destroy.
 */
MonsterFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this);
    this.figures = {};
};

/**
 * @interface
 */
var ICard = function(){};

/** @type {Model} */
ICard.prototype.model;

/**
 * @param {Race} racetrack The racetrack.
 * @return {?ICardEffect} The object.
 */
ICard.prototype.Play = function(racetrack){};

/**
 * @return {string} The message string.
 */
ICard.prototype.LogMessage = function(){};

/**
 * @interface
 */
var ICardEffect = function(){};

/**
 * Apply.
 */
ICardEffect.prototype.Apply = function(){};

/**
 * Un Apply.
 */
ICardEffect.prototype.UnApply = function(){};

/**
 * @constructor
 * @implements {ICardEffect}
 */
var NoneCardEffect = function(){};

/**
 * Apply.
 */
NoneCardEffect.prototype.Apply = function(){};

/**
 * Un Apply.
 */
NoneCardEffect.prototype.UnApply = function(){};

/**
 * @constructor
 * @implements {ICardEffect}
 * @param {Race} race The race.
 * @param {Lane} lane The lane.
 * @param {number} step The stap.
 */
var StepCardEffect = function(race, lane, step){
    /** @type {Race} */
    this.race_ = race;
    /** @type {Lane} */
    this.lane_ = lane;
    /** @type {number} */
    this.step_ = step;
};

/**
 *  Apply.
 */
StepCardEffect.prototype.Apply = function(){
    var currentScene = /** @type {GameScene} */ (Game.SceneDirector.CurrentScene());
    if (currentScene) {
        var raceDirector = /** @type {RaceDirector} */ (currentScene.directors["RaceDirector"]);
        if (raceDirector && raceDirector.race === this.race_) {
            this.lane_.position += this.step_;
        }
    }
};

/**
 * Un Apply.
 */
StepCardEffect.prototype.UnApply = function(){
    var currentScene = /** @type {GameScene} */ (Game.SceneDirector.CurrentScene());
    if (currentScene) {
        var raceDirector = /** @type {RaceDirector} */ (currentScene.directors["RaceDirector"]);
        if (raceDirector && raceDirector.race === this.race_) {
            this.lane_.position -= this.step_;
        }
    }
};

/**
 * @constructor
 * @implements {ICard}
 */
var DashCardTypeBoost = function(){
    /** @type {Model} */
    this.model = null;
};

/**
 * @param {Race} race The race object.
 * @return {ICardEffect} The card effect object.
 */
DashCardTypeBoost.prototype.Play = function(race){
    var ranks = race.Ranks();
    // for defensive.
    if(!(1 in ranks)){
        return new NoneCardEffect();
    }
    if(1 < ranks[1].length){
        return new NoneCardEffect();
    }
    if(!(2 in ranks)){
        return new NoneCardEffect();
    }
    var first = ranks[1][0];
    var second = ranks[2][0];
    var step = (first.position - second.position) * 2;
    return new StepCardEffect(race, first, step);
};

/**
 * @return {string} log message.
 */
DashCardTypeBoost.prototype.LogMessage = function(){
    return "";
};

/**
 * @constructor
 * @implements {ICard}
 */
var DashCardTypeCatchUp = function(){
    /** @type {Model} */
    this.model = null;
};

/**
 * @param {Race} race The race object.
 * @return {ICardEffect} The card effect object.
 */
DashCardTypeCatchUp.prototype.Play = function(race){
    var ranks = race.Ranks();
    // for defensive.
    if(!(1 in ranks)){
        return new NoneCardEffect();
    }
    if(1 < ranks[1].length){
        return new NoneCardEffect();
    }
    if(!(2 in ranks)){
        return new NoneCardEffect();
    }
    var first = ranks[1][0];
    var second = ranks[2][0];
    var step = (first.position - 1) - second.position;
    return new StepCardEffect(race, second, step);
};

/**
 * @return {string} log message.
 */
DashCardTypeCatchUp.prototype.LogMessage = function(){
    return "";
};

/**
 * @constructor
 * @implements {ICommand}
 * @param {Race} race The race.
 * @param {ICard} card The card.
 */
var PlayCardCommand = function(race, card){
    /** @type {Race} */
    this.race_ = race;
    /** @type {ICard} */
    this.card_ = card;
    /** @type {?ICardEffect} */
    this.cardEffect_ = null;
};

/**
 * Execute.
 */
PlayCardCommand.prototype.Execute = function(){
    var race = this.race_;
    var card = this.card_;
    var cardEffect = race.Apply(card);
    cardEffect.Apply();
    this.cardEffect_ = cardEffect;
    var stepVal = (/** @type {{step_: (number|undefined)}} */ (cardEffect)).step_ || 0;
    Game.Log([
        "card_id=",
        (/** @type {{id: number}} */ (card.model)).id,
        " ",
        card.LogMessage(),
        " => +",
        stepVal,
    ].join(""));
};

/**
 * Undo.
 */
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
        (/** @type {{id: number}} */ (card.model)).id,
    ].join(""));
};

/**
 * @constructor
 * @param {number} index .
 * @param {number} number .
 * @param {!HorseFigure} runner .
 * @param {number} len .
 */
var Lane = function(index, number, runner, len){
    /** @type {number} */
    this.index = index;
    /** @type {number} */
    this.number = number;
    /** @type {!HorseFigure} */
    this.runner = runner;
    /** @type {number} */
    this.len = len;
    /** @type {number} */
    this.position = Lane.GatePosition;
    runner.lane = this;
};

Lane.GatePosition = 0;

/**
 * @return {boolean} Is gate position.
 */
Lane.prototype.IsGatePosition = function(){
    return this.position === Lane.GatePosition;
};

/**
 * @return {boolean} Is goal position.
 */
Lane.prototype.IsGolePosition = function(){
    return this.len < this.position;
};

/**
 * @constructor
 * @param {Array<HorseFigure>} runners The runners.
 * @param {number} len The len.
 */
var Racetrack = function(runners, len){
    /** @type {Array<HorseFigure>} */
    this.runners = runners;
    /** @type {number} */
    this.len = len;
    /** @type {!Array<!Lane>} */
    this.lanes = [];
    this.lanes = this.runners.map(function(/** (HorseFigure|null) */ runner, /** number */ index){
        var number = index + 1;
        return new Lane(index, number, /** @type {!HorseFigure} */ (runner), this.len);
    }.bind(this));
};

/**
 * @constructor
 * @param {Race} race The race.
 * @param {!Racetrack} racetrack The race track.
 * @param {OddsTable} oddstable The odds table.
 */
var GameBoard = function(race, racetrack, oddstable){
    /** @type {Race} */
    this.race = race;
    /** @type {!Racetrack} */
    this.racetrack = racetrack;
    /** @type {OddsTable} */
    this.oddstable = oddstable;
};

/**
 * Game Player.
 * @constructor
 */
var GamePlayer = function(){
};

/**
 * @constructor
 */
var Bet = function(){
    /** @type {number} */
    this.coin = 0;
    /** @type {GamePlayer} */
    this.player = null;
};

/**
 * @param {Odds} odds .
 * @constructor
 */
var OddsEntry = function(odds){
    this["odds"] = odds; //for template
    /** @type {Array<Bet>} */
    this.bets = [];
};

/**
 * @param {Array<Odds>} oddses .
 * @constructor
 */
var OddsTable = function(oddses){
    /** @type {!Array<!Array<!OddsEntry>>} */
    var table = [];
    var length = oddses.length;
    for (var i = 0; i < length; i++){
        var odds = oddses[i];
        var m = /** @type {{first_id: number, second_id: number, odds: number}} */ (odds.model);
        var a = m.first_id;
        var b = m.second_id;
        if (!table[a]) {
            table[a] = [];
        }
        table[a][b] = new OddsEntry(odds);
    }
    this["table"] = table; //for template.
};

/**
 * @constructor
 * @param {IScene} scene A scene.
 */
/**
 * @constructor
 * @param {IScene} scene A scene.
 */
var RepositoryDirector = function(scene){
    /** @type {!Repository} */
    this.repository = new Repository();
    [
        ["StepCard", new Repository()],
        ["RankCard", new Repository()],
        ["DashCard", new Repository()],
        ["PlayCard", new Repository()],
    ].forEach(function(/** !Array<*> */ value){
        this.repository.Store(/** @type {string} */ (value[0]), /** @type {!Repository} */ (value[1]));
    }, this);
    Game.Publisher.Subscribe(Events.Game.OnAwake, this.OnAwake.bind(this));
};

/**
 * Awake.
 */
RepositoryDirector.prototype.OnAwake = function(){
    var names = [
        "StepCard",
        "RankCard",
        "DashCard",
        "PlayCard",
    ];
    names.forEach(function(/** string */ modelName){
        var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
        masterData.Get(modelName).forEach(function(/** !Array<string> */ row){
            var model = Game.Model(modelName).Set(row);
            var entity = Game.Entity(modelName, model);
            var repo = /** @type {!Repository} */ (this.repository.Find(modelName));
            repo.Store((/** @type {{id: number}} */ (model))["id"], entity);
        }, this);
    }, this);
};

/**
 * @param {string} name A name.
 * @return {Object} object.
 */
RepositoryDirector.prototype.Get = function(name){
    return this.repository.Find(name);
};

/**
 * @constructor
 * @extends {GameObject}
 */
var FPS = function(){
    GameObject.call(this);
    var engine = /** @type {!Engine} */ (Game.Locator.locate(Engine));
    /** @type {number} */
    this.baseTime = engine.lastUpdate;
    /** @type {number} */
    this.baseCount = 0;
    /** @type {number} */
    this.currentFPS = 0;
};
inherits(FPS, GameObject);

/**
 * Update.
 */
FPS.prototype.Update = function(){
    var engine = /** @type {!Engine} */ (Game.Locator.locate(Engine));
    if(1000 <= engine.lastUpdate - this.baseTime){
        this.currentFPS = ((engine.count - this.baseCount) * 1000) / (engine.lastUpdate - this.baseTime);
        this.baseTime = engine.lastUpdate;
        this.baseCount = engine.count;
    }
};

/**
 * @constructor
 * @param {IScene} scene A scene.
 */
var PlayCardDirector = function(scene){
    this.scene = scene;
    /** @type {CommandExecuter} */
    this.executer_ = new CommandExecuter();
    /** @type {!Array<!PlayCard>} */
    this.playCards = [];
    this.position = 0;
    /** @type {!Array<!Array<(string|function(ExEvent)|Object)>>} */
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.PlayCardDirector.OnReset, this.OnReset.bind(this), null],
        [Events.Race.OnPlayCard, this.OnPlayCard.bind(this), null],
        [Events.Race.OnUndoPlayCard, this.OnUndoPlayCard.bind(this), null],
    ];
    this.events.forEach(function(/** !Array<(string|function(ExEvent)|Object)> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};

PlayCardDirector.Xorshift = new Xorshift();

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnEnter = function(e){
    Game.Publisher.Publish(Events.PlayCardDirector.OnReset, this);
};

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnReset = function(e){
    var repositoryDirector = /** @type {!RepositoryDirector} */ (Game.Locator.locate(RepositoryDirector));
    var repository = /** @type {!Repository} */ (repositoryDirector.Get("PlayCard"));
    var playCards = /** @type {!Array<!PlayCard>} */ (repository.All());
    this.playCards = this.FisherYatesShuffle(playCards);
    this.position = 0;
};

/**
 * Fisher–Yates shuffle
 * @param {!Array<!PlayCard>} array The array.
 * @return {!Array<!PlayCard>} The shuffled array.
 */
PlayCardDirector.prototype.FisherYatesShuffle = function(array){
    var shuffled = array.slice();
    for(var i = shuffled.length - 1; 0 < i; i--){
        var r = Math.floor((PlayCardDirector.Xorshift.rand() / Xorshift.MAX_VALUE) * (i + 1));
        var tmp = shuffled[i];
        shuffled[i] = shuffled[r];
        shuffled[r] = tmp;
    }
    return shuffled;
};

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnExit = function(e){
    this.playCards = [];
    this.position = 0;
    this.events.forEach(function(/** !Array<(string|function(ExEvent)|Object)> */ event){
        Game.Publisher.UnSubscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};

/**
 * @param {ExEvent} e The event object.
 */
PlayCardDirector.prototype.OnPlayCard = function(e){
    /** @type {!Iterator<!PlayCard>} */
    var g = this.Generator();
    /** @type {PlayCard} */
    var card = g.next().value;
    if(!card){
        Game.Log("404 Card Not found.");
        return;
    }
    var currentScene = /** @type {GameScene} */ (Game.SceneDirector.CurrentScene());
    if (!currentScene) {
        return;
    }
    var raceDirector = /** @type {RaceDirector} */ (currentScene.directors["RaceDirector"]);
    if(!raceDirector){
        return;
    }
    var race = raceDirector.race;
    if(!race){
        return;
    }
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
 * @return {!Iterator<!PlayCard>}
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
 * @param {IScene} scene A scene.
 */
var RaceDirector = function(scene){
    /** @type {!Array<!Array<(string|function(ExEvent)|Object)>>} */
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.Race.OnPlacingFirst, this.OnPlacingFirst.bind(this), null],
        [Events.Race.OnPlacingSecond, this.OnPlacingSecond.bind(this), null],
        [Events.Race.OnFinishedRace, this.OnFinishedRace.bind(this), null],
    ];
    this.events.forEach(function(/** !Array<(string|function(ExEvent)|Object)> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
    /** @type {!Array<!HorseFigure>} */
    this.goals_ = [];
    /** @type {number} */
    this.state = RaceDirector.State.None;
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var row = /** @type {!Array<string>} */ (masterData.Get("Race")[0]);
    var model = Game.Model("Race").Set(row);
    /** @type {Race} */
    this.race = new Race(model);
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
    var race = this.race;
    if(!race){
        return;
    }
    var lanes = race.gameBoard.racetrack.lanes;
    var runners = lanes.filter(function(/** !Lane */ lane){
        return !this.goals_.includes(lane.runner) && lane.IsGolePosition();
    }.bind(this)).map(function(/** !Lane */ lane){
        return lane.runner;
    });
    if(0 < runners.length){
        this.goals_.push(runners[0]);
        this.UpdateState();
    }
    Game.Publisher.Publish(Events.Race.OnChanged, this, {
        race: race,
        racetrack: race.gameBoard.racetrack,
        oddstable: race.gameBoard.oddstable
    });
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnEnter = function(e){
    this.goals_ = [];
    this.state = RaceDirector.State.None;
    Game.Publisher.Publish(Events.Race.OnChanged, this, {
        race: this.race,
        racetrack: this.race.gameBoard.racetrack,
        oddstable: this.race.gameBoard.oddstable
    });
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnExit = function(e){
    this.events.forEach(function(/** !Array<(string|function(ExEvent)|Object)> */ event){
        Game.Publisher.UnSubscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
    this.goals_ = [];
    this.state = RaceDirector.State.None;
    this.race = null;
};

/**
 * Update state.
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
    var placings = this.goals_.slice(0, 1).map(function(/** !HorseFigure */ figure){
        return (/** @type {{type: string}} */ (figure.model)).type;
    });
    var first = /** @type {string} */ (placings[0]);
    Game.Log("The first: " + first);
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnPlacingSecond = function(e){
    /** @type {!Array<!HorseFigure>} */
    var placings = this.goals_.slice(0, 2);
    /** @type {!HorseFigure} */
    var first = placings[0];
    /** @type {!HorseFigure} */
    var second = placings[1];
    Game.Log("The first: " + (/** @type {{type: string}} */ (first.model)).type);
    Game.Log("The second: " + (/** @type {{type: string}} */ (second.model)).type);
    Game.Publisher.Publish(Events.Race.OnFinishedRace, this, {
        "race": this.race,
        "placings": placings,
    });
};

/**
 * @param {ExEvent} e The event object.
 */
RaceDirector.prototype.OnFinishedRace = function(e){
    var payload = e.payload;
    var race = /** @type {Race} */ (payload["race"]);
    var placings = /** @type {!Array<!HorseFigure>} */ (payload["placings"]);
    var order = placings.map(function(/** !HorseFigure */ horse){
        return horse.lane.number;
    }).sort(function(/** number */ a, /** number */ b){
        return a - b;
    });
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var oddses = /** @type {!Array<!Odds>} */ (masterData.Get("Odds").map(function(/** !Array<string> */ row){
        var model = Game.Model("Odds").Set(row);
        return /** @type {!Odds} */ (Game.Entity("Odds", model));
    })).filter(function(/** !Odds */ odds){
        var m = /** @type {{first_id: number, second_id: number}} */ (odds.model);
        return m.first_id == order[0] && m.second_id == order[1];
    });
    var odds = oddses[0];
    var mOdds = /** @type {{odds: number}} */ (odds.model);
    Game.SceneDirector.Push(new GameScene("Result", {
        "race": race,
        "placings": placings,
        "odds": mOdds.odds,
    }));
};

/**
 * @interface
 */
var ILayer = function(){};

/**
 * @return {DocumentFragment} The document fragment.
 */
ILayer.prototype.Render = function(){};

/**
 * @constructor
 * @implements {IScene}
 * @extends {Scene}
 * @param {string} name Scene name.
 * @param {Object=} opt_content .
 */
var GameScene = function(name, opt_content){
    Scene.call(this);
    this.name = name;
    /** @type {Object<string,*>|undefined} */
    this.content = opt_content;
    /** @type {!Object<string, function(!GameScene): !Object>} */
    var directors = {
        "Title": function(/** !GameScene */ scene){
            return {};
        },
        "Race": function(/** !GameScene */ scene){
            return {
                "RaceDirector": new RaceDirector(scene),
                "PlayCardDirector": new PlayCardDirector(scene),
            };
        },
        "Result": function(/** !GameScene */ scene){
            return {
            };
        },
    };
    /** @type {!Object<string, function(!GameScene): !RenderLayers>} */
    var renderers = {
        "Title": function(/** !GameScene */ scene){
            return new RenderLayers(scene, [
                new TitleSceneLayer(scene),
            ]);
        },
        "Race": function(/** !GameScene */ scene){
            return new RenderLayers(scene, [
                new MenuLayer(scene),
//                new DebugButtonLayer(scene),
                new RacetrackLayer(scene),
                new OddsTableLayer(scene),
                new LogMessageLayer(scene),
                new DebugMenuLayer(scene),
                new FPSLayer(scene),
                new SampleBallLayer(scene),
            ]);
        },
        "Result": function(/** !GameScene */ scene){
            return new RenderLayers(scene, [
                new ResultSceneLayer(scene),
            ]);
        },
    };
    /** @type {!Object} */
    this.directors = directors[name](this);
    /** @type {!RenderLayers} */
    this.layers = renderers[name](this);
};
inherits(GameScene, Scene);

/**
 * Enter.
 */
GameScene.prototype.OnEnter = function(){
    Game.Publisher.Publish(Events.GameScene.OnEnter, this);
};

/**
 * Exit.
 */
GameScene.prototype.OnExit = function(){
    Game.Publisher.Publish(Events.GameScene.OnExit, this);
};

/**
 * Pause.
 */
GameScene.prototype.OnPause = function(){
    Game.Publisher.Publish(Events.GameScene.OnPause, this);
};

/**
 * Resume.
 */
GameScene.prototype.OnResume = function(){
    Game.Publisher.Publish(Events.GameScene.OnResume, this);
};

// TODO: [ISSUE-09] 起動時データ検証処理の本番実行パスからの分離
// For debug.
var modelsToCheck = [
    "HorseFigure",
    "MonsterCoin",
    "MonsterFigure",
    "Race",
    "PlayCard",
    "StepCard",
    "RankCard",
    "DashCard",
    "Odds"
];
(new RelationshipChecker()).CheckAll(modelsToCheck);
(new ValueChecker()).CheckAll(modelsToCheck);

/**
 * Bootstrap sequence to explicitly instantiate all required directors in the correct order.
 */
Game.Bootstrap = function(){
    Game.Locator.locate(RepositoryDirector);
    Game.Locator.locate(GameDirector);
};

// main
window.addEventListener("load", function(){
    Game.Bootstrap();
    var engine = /** @type {!Engine} */ (Game.Locator.locate(Engine));
    engine.FPS = 60;
    engine.objects = [
        /** @type {!GameObject} */ (Game.Locator.locate(Game)),
    ];
    engine.Loop();
    console.log(engine);
});
