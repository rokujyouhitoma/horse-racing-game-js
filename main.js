"use strict";

var Event = function(type, target, payload){
    this.type = type;
    this.target = target;
    this.payload = payload;
};

var EventTarget = function(){
    this.eventListeners = {};
};

EventTarget.prototype.addEventListener = function(type, listener){
    var self = this;
    var wrapper = function(e) {
        if (typeof listener.handleEvent != 'undefined') {
            listener.handleEvent(e);
        } else {
            listener.call(self, e);
        }
    };
    if(!(type in this.eventListeners)){
        this.eventListeners[type] = [];
    }
    this.eventListeners[type].push({
        object: this,
        type: type,
        listener: listener,
        wrapper: wrapper
    });
};

EventTarget.prototype.removeEventListener = function(type, listener){
    if(!(type in this.eventListeners)){
        return;
    }
    var eventListeners = this.eventListeners[type];
    var counter = 0;
    while(counter < eventListeners.length){
        var eventListener = eventListeners[counter];
        if (eventListener.object == this &&
            eventListener.type == type &&
            eventListener.listener == listener){
            eventListeners.splice(counter, 1);
            break;
        }
        ++counter;
    }
};

EventTarget.prototype.dispatchEvent = function(type, payload){
    if(!(type in this.eventListeners)){
        return;
    }
    var eventListeners = this.eventListeners[type];
    var counter = 0;
    while(counter < eventListeners.length){
        var eventListener = eventListeners[counter];
        if (eventListener.object == this &&
            eventListener.type == type){
            if(type instanceof Event){
                type.target = this;
                type.payload = payload;
                eventListener.wrapper(type);
            } else {
                eventListener.wrapper(new Event(type, this, payload));
            }
        }
        ++counter;
    }
};

var EventListener = function(callback){
    this.callback = callback;
};

EventListener.prototype.handleEvent = function(event){
    this.callback(event);
};

var ServiceLocator = function(container){
    this.container = container;
};

ServiceLocator.prototype.create = function(obj){
    if(!(obj in this.container)){
        this.container[obj] = new obj();
    }
    return this.container[obj];
};

var Utility = {};

Utility.FisherYatesShuffle = function(array){
    // Fisher–Yates shuffle
    var g = new Xorshift();
    var result = array.slice();
    for(var i = array.length - 1; 0 < i; i--){
        var r = Math.floor((g.rand() / Xorshift.MAX_VALUE) * (i + 1));
        var tmp = result[i];
        result[i] = result[r];
        result[r] = tmp;
    }
    return result;
};

var Xorshift = function(){
    this.seed(Date.now());
};

Xorshift.MIN_VALUE = 0;
Xorshift.MAX_VALUE = 0xffffffff / 2;

Xorshift.prototype.seed = function(seed){
    this.x = (seed & 0x66666666) >>> 0;
    this.y = (seed ^ 0xffffffff) >>> 0;
    this.z = ((seed & 0x0000ffff << 16) | (seed >> 16) & 0x0000ffff) >>> 0;
    this.w = this.x ^ this.y;
};

Xorshift.prototype.rand = function(){
    var t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
    return this.w; /* 0 to 0xFFFFFFFF / 2 */
};

var GameObject = function(){
    this.objects = [];
};

GameObject.prototype.Start = function(){
    this.objects.forEach(function(value, index, array){
        value.Start();
    }, this);
};

GameObject.prototype.Update = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        value.Update(deltaTime);
    }, this);
};

GameObject.prototype.Destroy = function(){
    this.objects.forEach(function(value, index, array){
        value.Destroy();
    }, this);
};

var Engine = function(objects){
    this.objects = objects;
    this.count = 0;
    this.FPS = 1000 / 60;
    this.lastUpdate = Date.now();
};

Engine.prototype.Loop = function(){
    console.log("Loop");
    var loop = function(){
        if(0 <= this.count){
            setTimeout(loop, this.FPS);
            this.count++;
        }
        var now = Date.now();
        var deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        this.Update(deltaTime);
    }.bind(this);
    loop();
};

Engine.prototype.Start = function(){
    console.log("Start");
    this.objects.forEach(function(value, index, array){
        value.Start();
    }, this);
};

Engine.prototype.Update = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        value.Update(deltaTime);
    }, this);
};

var Model = function(meta){
    this.meta = meta;
};

Model.prototype.Set = function(value){
    var names = this.meta.names;
    for(var i=0; i < names.length; i++){
        this[names[i]] = value[i];
    }
    return this;
};

var MasterData = function(){
    this.stub = {
        "HorseFigure": [
            [1, "Red", "FF0000"],
            [2, "Orange", "FFA500"],
            [3, "Green", "008000"],
            [4, "Blue", "0000FF"],
            [5, "Purple", "800080"],
        ],
        "MonsterCoin": [
            [1, "Dragon"],
            [2, "Daemon"],
            [3, "Drakee"],
            [4, "Golem"],
            [5, "Ghost"],
        ],
        "MonsterFigure": [
            [1, "Dragon"],
            [2, "Daemon"],
            [3, "Drakee"],
            [4, "Golem"],
            [5, "Ghost"],
        ],
        "Race": [
            [1, 70],
        ],
        "PlayCard": [
            [1, 1, 1],
            [2, 1, 1],
            [3, 1, 1],
            [4, 1, 2],
            [5, 1, 2],
            [6, 1, 2],
            [7, 1, 3],
            [8, 1, 3],
            [9, 1, 3],
            [10, 1, 4],
            [11, 1, 4],
            [12, 1, 4],
            [13, 1, 5],
            [14, 1, 5],
            [15, 1, 5],
            [16, 1, 6],
            [17, 1, 6],
            [18, 1, 6],
            [19, 1, 7],
            [20, 1, 7],
            [21, 1, 7],
            [22, 1, 8],
            [23, 1, 8],
            [24, 1, 8],
            [25, 1, 9],
            [26, 1, 9],
            [27, 1, 9],
            [28, 1, 10],
            [29, 1, 10],
            [30, 1, 10],
            [31, 1, 11],
            [32, 1, 11],
            [33, 1, 11],
            [34, 1, 12],
            [35, 1, 12],
            [36, 1, 12],
            [37, 1, 13],
            [38, 1, 13],
            [39, 1, 13],
            [40, 1, 14],
            [41, 1, 14],
            [42, 1, 14],
            [43, 1, 15],
            [44, 1, 15],
            [45, 1, 15],
            [46, 2, 1],
            [47, 2, 2],
            [48, 2, 3],
            [49, 2, 4],
            [50, 2, 5],
            [51, 2, 6],
            [52, 2, 7],
            [53, 2, 8],
            [54, 2, 9],
            [55, 2, 10],
            [56, 2, 11],
            [57, 2, 12],
            [58, 2, 13],
            [59, 3, 1],
            [60, 3, 2],
        ],
        "StepCard": [
            [1, 1, 5],
            [2, 1, 9],
            [3, 1, 10],
            [4, 2, 5],
            [5, 2, 6],
            [6, 2, 8],
            [7, 3, 4],
            [8, 3, 5],
            [9, 3, 7],
            [10, 4, 4],
            [11, 4, 5],
            [12, 4, 6],
            [13, 5, 3],
            [14, 5, 4],
            [15, 5, 5],
        ],
        "RankCard": [
            [1, 1, 5],
            [2, 1, 10],
            [3, 1, 15],
            [4, 2, 5],
            [5, 2, 10],
            [6, 2, 15],
            [7, 3, 5],
            [8, 3, 10],
            [9, 3, 15],
            [10, 4, 5],
            [11, 4, 10],
            [12, 4, 15],
            [13, -1, 35],
        ],
        "DashCard": [
            [1, 1, 1],
            [2, 2, 2],
        ],
    };

    this.meta = {
        HorseFigure: {
            names: ["id", "type", "color"],
            types: ["int", "int", "string"],
        },
        MonsterCoin: {
            names: ["id", "type"],
            types: ["int", "string"],
        },
        MonsterFigure: {
            names: ["id", "type"],
            types: ["int", "string"],
        },
        Race: {
            names: ["id", "len"],
            types: ["int", "int"],
        },
        PlayCard: {
            names: ["id", "card_type", "detail_id"],
            types: ["int", "int", "int"],
            relationships: [
                {
                    filters: [
                        {
                            condition: "equal",
                            name: "card_type",
                            value: 1,
                        },
                    ],
                    from: {
                        name: "detail_id",
                    },
                    to: {
                        object: "StepCard",
                        name: "id",
                    },
                },
                {
                    filters: [
                        {
                            condition: "equal",
                            name: "card_type",
                            value: 2,
                        },
                    ],
                    from: {
                        name: "detail_id",
                    },
                    to: {
                        object: "RankCard",
                        name: "id",
                    },
                },
                {
                    filters: [
                        {
                            condition: "equal",
                            name: "card_type",
                            value: 3,
                        },
                    ],
                    from: {
                        name: "detail_id",
                    },
                    to: {
                        object: "RankCard",
                        name: "id",
                    },
                },
            ],
        },
        StepCard: {
            names: ["id", "target_id", "step"],
            types: ["int", "int", "int"],
        },
        RankCard: {
            names: ["id", "target_rank", "step"],
            types: ["int", "int", "int"],
        },
        DashCard: {
            names: ["id", "target_rank", "dash_type"],
            types: ["int", "int", "int"],
        },
    };
};

MasterData.prototype.Get = function(key){
    return this.stub[key];
};

MasterData.prototype.GetMeta = function(key){
    return this.meta[key];
};

var HorseFigure = function(model){
    this.model = model;
};
HorseFigure.prototype = new GameObject();

var HorseFigureDirector = function(){
    this.figures = {};
};
HorseFigureDirector.prototype = new GameObject();

HorseFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    var figures = Game.ServiceLocator.create(MasterData).Get("HorseFigure").map(function(row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    });
    figures.forEach(function(figure){
        this.figures[figure.model.id] = figure;
        figure.Start();
    }, this);
};

HorseFigureDirector.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

HorseFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this, arguments);
    this.figure = {};
};

var MonsterCoin = function(model){
    this.model = model;
};
MonsterCoin.prototype = new GameObject();

var MonsterCoinDirector = function(){
    this.coins = {};
};
MonsterCoinDirector.prototype = new GameObject();

MonsterCoinDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    var coins = Game.ServiceLocator.create(MasterData).Get("MonsterCoin").map(function(row){
        return new MonsterCoin(Game.Model("MonsterCoin").Set(row));
    });
    coins.forEach(function(coin){
        this.coins[coin.model.id] = coin;
        coin.Start();
    }, this);
};

MonsterCoinDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this, arguments);
    this.coins = {};
};

var MonsterFigure = function(model){
    this.model = model;
};
MonsterFigure.prototype = new GameObject();

var MonsterFigureDirector = function(){
    this.figures = {};
};
MonsterFigureDirector.prototype = new GameObject();

MonsterFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    var figures = Game.ServiceLocator.create(MasterData).Get("MonsterFigure").map(function(row){
        return new MonsterFigure(Game.Model("MonsterFigure").Set(row));
    });
    figures.forEach(function(figure){
        this.figures[figure.model.id] = figure;
        figure.Start();
    });
};

MonsterFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this, arguments);
    this.figures = {};
};

var Card = function(){};
Card.prototype = new GameObject();
Card.prototype.Play = function(racetrack){};
Card.prototype.LogMessage = function(){};

var StepCard = function(model){
    this.model = model;
};
StepCard.prototype = new Card();

StepCard.prototype.Play = function(race){
    var target_id = this.model.target_id;
    var step = this.model.step;
    race.gameBoard.racetrack.lanes.filter(function(lane){
        return lane.runner.model.id === target_id;
    }).forEach(function(lane){
        if(!lane.IsGolePosition()){
            lane.position += step;
        }
    });
};

StepCard.prototype.LogMessage = function(){
    var target_id = this.model.target_id;
    var step = this.model.step;
    var racetrack = Game.ServiceLocator.create(Game).race.gameBoard.racetrack;
    var figures = racetrack.lanes.filter(function(lane){
        return lane.runner.model.id === target_id;
    }).map(function(lane){
        return lane.runner;
    });
    var target = figures.map(function(figure){
        return figure.model.type;
    }).join(",");
    return [
        "[Step]:", target, " ", step,
    ].join("");
};

var RankCard = function(model){
    this.model = model;
};
RankCard.prototype = new Card();

RankCard.prototype.Play = function(race){
    var target_rank = this.model.target_rank;
    var step = this.model.step;
    var ranks = race.Ranks();
    if(!(target_rank in ranks)){
        return;
    }
    var lanes = ranks[target_rank];
    if(0 < lanes.length && lanes.length < 2){
        var lane = lanes[0];
        lane.position += step;
    } else {
        //無効
    }
};

RankCard.prototype.LogMessage = function(race){
    var target_rank = this.model.target_rank;
    var step = this.model.step;
    return [
        "[Rank]:", target_rank, " ", step,
    ].join("");
};

var DashCardTypeBoost = function(){};
DashCardTypeBoost.prototype = new Card();
DashCardTypeBoost.prototype.Play = function(race){
    var ranks = race.Ranks();
    if(1 < ranks[1].length){
        //TODO: xxx
        return;
    }
    if(!(2 in ranks)){
        //TODO: xxx
        return;
    }
    var first = ranks[1][0];
    var second = ranks[2][0];
    var step = (first.position - second.position) * 2;
    first.position += step;
};

var DashCardTypeCatchUp = function(){};
DashCardTypeCatchUp.prototype = new Card();
DashCardTypeCatchUp.prototype.Play = function(race){
    var ranks = race.Ranks();
    if(1 < ranks[1].length){
        //TODO: xxx
        return;
    }
    if(!(2 in ranks)){
        //TODO: xxx
        return;
    }
    var first = ranks[1][0];
    var second = ranks[2][0];
    var step = (first.position - 1) - second.position;
    second.position += step;
};

var DashCard = function(model){
    this.model = model;
    this.behavior = this.GetBehavior();
};
DashCard.prototype = new Card();

DashCard.DashType = {
    Boost: 1,
    CatchUp: 2,
};

DashCard.prototype.Play = function(race){
    this.behavior.Play(race);
};

DashCard.prototype.LogMessage = function(race){
    //TODO: xxx
    var target_rank = this.model.target_rank;
    return [
        "[Dash]:", target_rank,
    ].join("");
};

DashCard.prototype.GetBehavior = function(){
    var dashType = this.model.dash_type;
    switch(dashType){
    case DashCard.DashType.Boost:
        return new DashCardTypeBoost();
    case DashCard.DashType.CatchUp:
        return new DashCardTypeCatchUp();
    default:
        throw new Error("Not support DashCard.DashType");
    }
    console.log(this.model);
};

var PlayCard = function(model){
    this.model = model;
    this.card = this.GetCard();
};
PlayCard.prototype = new Card();

PlayCard.CardType = {
    StepCard: 1,
    RankCard: 2,
    DashCard: 3,
};

PlayCard.prototype.GetCard = function(){
    var detail_id = this.model.detail_id;
    var name = this.GetCardName();
    var repositoryDirector = Game.ServiceLocator.create(RepositoryDirector);
    var repository = repositoryDirector.Get(name);
    return repository.Find(detail_id);
};

PlayCard.prototype.GetCardName = function(){
    var card_type = this.model.card_type;
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
    this.card.Play(race);
};

PlayCard.prototype.LogMessage = function(){
    return this.card.LogMessage();
};

var PlayCardDirector = function(){
    this.playCards = [];
    this.position = 0;
};
PlayCardDirector.prototype = new GameObject();

PlayCardDirector.prototype.Start = function(){
    var repositoryDirector = Game.ServiceLocator.create(RepositoryDirector);
    var repository = repositoryDirector.Get("PlayCard");
    var array = repository.All();
    this.playCards = Utility.FisherYatesShuffle(array);
};

PlayCardDirector.prototype.NextCard = function(){
    var length = this.playCards.length;
    var position = this.position;
    if(length < position){
        return;
    }
    var card = this.playCards[position];
    this.position++;
    return card;
};

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
    GameObject.prototype.Start.call(this, arguments);
};

var GameBoard = function(race){
    this.race = race;
    this.racetrack;
};
GameBoard.prototype = new GameObject();

GameBoard.prototype.Start = function(){
    var master = Game.ServiceLocator.create(MasterData);
    var length = this.race.model.len;
    this.racetrack = new Racetrack(master.Get("HorseFigure").map(function(row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    }), length);
    this.objects = [
        this.racetrack,
    ];
    GameObject.prototype.Start.call(this, arguments);
};

var Race = function(model){
    this.model = model;
    this.gameBoard = new GameBoard(this);
};
Race.prototype = new GameObject();

Race.prototype.Start = function(){
    this.objects = [
        this.gameBoard,
    ];
    GameObject.prototype.Start.call(this, arguments);
};

Race.prototype.Apply = function(card){
    card.Play(this);
};

Race.prototype.Ranks = function(){
    var lanes = this.gameBoard.racetrack.lanes;
    var len = this.model.len;
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

var RaceDirector = function(){
    this.orderOfFinish = [];
    this.state = RaceDirector.State.None;
    Game.Publisher.Subscribe(Events.OnPlacingFirst, this.OnPlacingFirst.bind(this));
    Game.Publisher.Subscribe(Events.OnPlacingSecond, this.OnPlacingSecond.bind(this));
};
RaceDirector.prototype = new GameObject();

RaceDirector.State = {
    None: 0b00, // Before race.
    First: 0b01, // official order of placing First.
    Second: 0b10, // official order of placing Second.
};

RaceDirector.prototype.Update = function(){
    var game = Game.ServiceLocator.create(Game);
    var lanes = game.race.gameBoard.racetrack.lanes;
    var runners = lanes.filter(function(lane){
        return !this.orderOfFinish.includes(lane.runner) && lane.IsGolePosition();
    }.bind(this)).map(function(lane){
        return lane.runner;
    });
    if(0 < runners.length){
        this.orderOfFinish.push(runners[0]);
        this.UpdateState();
    }
};

RaceDirector.prototype.UpdateState = function(){
    var state = this.state;
    switch(state){
    case RaceDirector.State.None:
        this.state = state | RaceDirector.State.First;
        Game.Publisher.Publish(Events.OnPlacingFirst);
        break;
    case RaceDirector.State.First:
        this.state = state | RaceDirector.State.Second;
        Game.Publisher.Publish(Events.OnPlacingSecond);
        break;
    case RaceDirector.State.Second:
        break;
    }
};

RaceDirector.prototype.OnPlacingFirst = function(){
    //TODO: xxx
    console.log(this.orderOfFinish.slice(0, 1).map(function(figure){
        return figure.model.type;
    }));
};

RaceDirector.prototype.OnPlacingSecond = function(){
    //TODO: xxx
    console.log(this.orderOfFinish.slice(0, 2).map(function(figure){
        return figure.model.type;
    }));
};

RaceDirector.prototype.Destroy = function(){
    this.orderOfFinish = [];
};

var Publisher = function(){
    this.targets = {};
};

Publisher.prototype.GetOrCreateTarget = function(type){
    var target = this.targets[type];
    if(!target){
        target = this.targets[type] = new EventTarget();
    }
    return target;
}

Publisher.prototype.Subscribe = function(type, listener){
    this.GetOrCreateTarget(type).addEventListener(type, listener);
};

Publisher.prototype.UnSubscribe = function(type, listener){
    this.GetOrCreateTarget(type).removeEventListener(type, listener);
};

Publisher.prototype.Publish = function(type, payload){
    this.GetOrCreateTarget(type).dispatchEvent(type, payload);
};

var Repository = function(obj){
    this.storage = obj || {};
};

Repository.prototype.Store = function(key, value){
    this.storage[key] = value;
};

Repository.prototype.Find = function(key){
    return this.storage[key];
};

Repository.prototype.All = function(){
    return Object.values(this.storage);
};

var RepositoryDirector = function(){
    this.repository = new Repository({
        "StepCard": new Repository(),
        "RankCard": new Repository(),
        "DashCard": new Repository(),
        "PlayCard": new Repository(),
    });
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
        Game.ServiceLocator.create(MasterData).Get(modelName).forEach(function(row){
            var model = Game.Model(modelName).Set(row);
            var entity = Game.Entity(modelName, model);
            this.repository.Find(modelName).Store(model.id, entity);
        }, this);
    }, this);
};

var Game = function(){
    // TODO: find系のクエリの仕組みないと辛い
    var row = Game.ServiceLocator.create(MasterData).Get("Race")[0];
    this.fps = new FPS();
    this.race = new Race(Game.Model("Race").Set(row));
    this.objects = [
        this.fps,
        this.race,
        Game.ServiceLocator.create(RaceDirector),
        Game.ServiceLocator.create(HorseFigureDirector),
        Game.ServiceLocator.create(MonsterCoinDirector),
        Game.ServiceLocator.create(MonsterFigureDirector),
        Game.ServiceLocator.create(RepositoryDirector),
        Game.ServiceLocator.create(PlayCardDirector),
    ];
};
Game.prototype = new GameObject();

Game.prototype.Reset = function(){
    this.Destroy();
    this.Start();
};

Game.ServiceLocatorContainer = {};
Game.ServiceLocator = new ServiceLocator(Game.ServiceLocatorContainer);

Game.Publisher = Game.ServiceLocator.create(Publisher);

Game.Model = function(name){
    var meta = Game.ServiceLocator.create(MasterData).GetMeta(name);
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
}

var Events = {
    OnPlacingFirst: "OnPlacingFirst",
    OnPlacingSecond: "OnPlacingSecond",
    // For debug.
    OnPlayCard: "OnPlayCard",
    OnPlayRankCard: "OnPlayRankCard",
    OnPlayDashCard: "OnPlayDashCard",
    OnMove: "OnMove",
    OnCheckWinners: "OnCheckWinners",
    OnGameReset: "OnGameReset",
    OnCheckRelationship: "OnCheckRelationship",
};

var FPS = function(){
    var engine = Game.ServiceLocator.create(Engine);
    this.baseTime = engine.lastUpdate;
    this.baseCount = 0;
    this.currentFPS = 0;
};
FPS.prototype = new GameObject();

FPS.prototype.Update = function(deltaTime){
    var engine = Game.ServiceLocator.create(Engine);
    if(1000 <= engine.lastUpdate - this.baseTime){
        this.currentFPS = ((engine.count - this.baseCount) * 1000) / (engine.lastUpdate - this.baseTime);
        this.baseTime = engine.lastUpdate;
        this.baseCount = engine.count;
    }
}

var Renderer = function(){};
Renderer.prototype = new GameObject();
Renderer.prototype.Render = function(dictionary){};

var FPSRenderer = function(){
    this.dom;
};
FPSRenderer.prototype = new Renderer();

FPSRenderer.prototype.Start = function(){
    Renderer.prototype.Start.call(this, arguments);
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var h1 = document.createElement("h1");
        h1.innerText = "FPS";
        body.appendChild(h1);
        var dom = document.createElement("p");
        body.appendChild(dom);
        this.dom = dom;
    }
};

FPSRenderer.prototype.Update = function(deltaTime){
    Renderer.prototype.Update.call(this, arguments);
    var fps = Math.floor(Game.ServiceLocator.create(Game).fps.currentFPS * 100) / 100;
    this.Render({
        "fps": fps,
    });
};

FPSRenderer.prototype.Render = function(dictionary){
    Renderer.prototype.Render.call(this, arguments);
    this.dom.innerText = dictionary["fps"];
};

var LaneRenderer = function(){};
LaneRenderer.prototype = new Renderer();

LaneRenderer.prototype.Render = function(dictionary){
    Renderer.prototype.Render.call(this, arguments);
    var lane = dictionary["lane"];
    var color = lane.runner.model.color;
    return [
        this.ToArray(lane).reverse().join(""),
        ["<span style='background-color:#", color, ";'>", lane.number, "</span>"].join(""),
        lane.position,
    ].join("|");
};

LaneRenderer.prototype.ToArray = function(lane){
    var array = new Array(lane.len + 1);
    for(var i=0; i < lane.len + 1; i++){
        array[i] = (lane.position === i) ? LaneRenderer.CurrentPosition : LaneRenderer.EmptyPosition;
    }
    return array;
};

LaneRenderer.CurrentPosition = "\uD83C\uDFC7"; //Unicode Character 'HORSE RACING' (U+1F3C7)
LaneRenderer.EmptyPosition = "_";

var RacetrackRenderer = function(){
    this.dom;
};
RacetrackRenderer.prototype = new Renderer();

RacetrackRenderer.prototype.Start = function(){
    Renderer.prototype.Start.call(this, arguments);
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var h1 = document.createElement("h1");
        h1.innerText = "Racetrack";
        body.appendChild(h1);
        var dom = document.createElement("div");
        body.appendChild(dom);
        this.dom = dom;
    }
};

RacetrackRenderer.prototype.Update = function(deltaTime){
    Renderer.prototype.Update.call(this, arguments);
    var game = Game.ServiceLocator.create(Game);
    // TODO: innerHTMLは手抜き。createElementによるDOM操作が望ましい
    this.dom.innerHTML = this.Render({
        "racetrack": game.race.gameBoard.racetrack,
    });
};

RacetrackRenderer.prototype.Render = function(dictionary){
    Renderer.prototype.Render.call(this, arguments);
    var laneRenderer = new LaneRenderer();
    var racetrack = dictionary["racetrack"];
    var lanes = racetrack.lanes;
    var text = [
        lanes.reduce(function(a, b, index){
            if(index == 1){
                return [a, b].map(function(lane){
                    return laneRenderer.Render({"lane": lane});
                }).join("<br />");
            }
            return [a, laneRenderer.Render({"lane": b})].join("<br />");
        })
    ].join("");
    return text;
};

var DebugButton = function(text, onClickText){
    this.text = text;
    this.onClickText = onClickText;
};
DebugButton.prototype = new Renderer();

DebugButton.prototype.Render = function(dictionary){
    return [
        "<button onClick='",
        this.onClickText,
        "'>",
        this.text,
        "</button>",
    ].join("");
};

var DebugMenu = function(){
    this.dom;
    Game.Publisher.Subscribe(Events.OnPlayCard, this.OnPlayCard.bind(this));
    Game.Publisher.Subscribe(Events.OnPlayRankCard, this.OnPlayRankCard.bind(this));
    Game.Publisher.Subscribe(Events.OnPlayDashCard, this.OnPlayDashCard.bind(this));
    Game.Publisher.Subscribe(Events.OnMove, this.OnMove.bind(this));
    Game.Publisher.Subscribe(Events.OnCheckWinners, this.OnCheckWinners.bind(this));
    Game.Publisher.Subscribe(Events.OnGameReset, this.OnGameReset.bind(this));
    Game.Publisher.Subscribe(Events.OnCheckRelationship, this.OnCheckRelationship.bind(this));
};
DebugMenu.prototype = new Renderer();

DebugMenu.prototype.Start = function(){
    Renderer.prototype.Start.call(this, arguments);
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var h1 = document.createElement("h1");
        h1.innerText = "Debug Menu";
        body.appendChild(h1);
        var dom = document.createElement("div");
        body.appendChild(dom);
        this.dom = dom;
    }
    var game = Game.ServiceLocator.create(Game);
    // TODO: innerHTMLは手抜き。createElementによるDOM操作が望ましい
    this.dom.innerHTML = this.Render({
        "racetrack": game.race.gameBoard.racetrack,
    });
};

DebugMenu.prototype.Render = function(dictionary){
    var racetrack = dictionary["racetrack"];
    var lanes = racetrack.lanes;
    return [
        new DebugButton("Play Card", "(function(){Game.Publisher.Publish(Events.OnPlayCard);})()").Render(),
        new DebugButton("Play RankCard", "(function(){Game.Publisher.Publish(Events.OnPlayRankCard);})()").Render(),
        new DebugButton("Play DashCard", "(function(){Game.Publisher.Publish(Events.OnPlayDashCard);})()").Render(),
        [
            "<button onClick='",
            "(function(){Game.ServiceLocator.create(DebugMenu).OnRandom(", lanes.length ,")})()'>",
            "Random",
            "</button>",
        ].join(""),
        lanes.map(function(lane){
            var text = "+1";
            var index = lane.index;
            var color = lane.runner.model.color;
            return [
                "<button onClick='",
                "(function(){Game.Publisher.Publish(Events.OnMove, {index: ", index, "})})()'>",
                "<span style='background-color:#", color, ";'>", text, "</span>",
                "</button>",
            ].join("");
        }).join(""),
        new DebugButton("Winners", "(function(){Game.Publisher.Publish(Events.OnCheckWinners);})()").Render(),
        new DebugButton("Reset Game", "(function(){Game.Publisher.Publish(Events.OnGameReset);})()").Render(),
        new DebugButton("Check Relationship", "(function(){Game.Publisher.Publish(Events.OnCheckRelationship);})()").Render(),
    ].join("<br />");
};

DebugMenu.prototype.OnPlayCard = function(e){
    var race = Game.ServiceLocator.create(Game).race;
    var playCardDirector = Game.ServiceLocator.create(PlayCardDirector);
    var card = playCardDirector.NextCard();
    var position = playCardDirector.position;
    if(!card){
        console.log("404 Card Not found.");
        return;
    }
    race.Apply(card);
    console.log([
        position,
        " ",
        card.LogMessage(),
    ].join(""));
};

DebugMenu.prototype.OnPlayRankCard = function(e){
    var race = Game.ServiceLocator.create(Game).race;
    var repositoryDirector = Game.ServiceLocator.create(RepositoryDirector);
    var name = "RankCard";
    var repository = repositoryDirector.Get(name);
    var detail_id = 1;
    var card = repository.Find(detail_id);
    race.Apply(card);
    console.log(card.LogMessage());
};

DebugMenu.prototype.OnPlayDashCard = function(e){
    var race = Game.ServiceLocator.create(Game).race;
    var repositoryDirector = Game.ServiceLocator.create(RepositoryDirector);
    var name = "DashCard";
    var repository = repositoryDirector.Get(name);
    var detail_id = 1 + 1;
    var card = repository.Find(detail_id);
    race.Apply(card);
    console.log(card.LogMessage());
};

DebugMenu.prototype.OnRandom = function(len){
    var index = Math.floor(Math.random() * len);
    var step = 1;
    Game.ServiceLocator.create(Game).race.gameBoard.racetrack.lanes[index].position += step;
};

DebugMenu.prototype.OnMove = function(e){
    var index = e.payload["index"];
    Game.ServiceLocator.create(Game).race.gameBoard.racetrack.lanes[index].position += 1;
};

DebugMenu.prototype.OnGameReset = function(e){
    Game.ServiceLocator.create(Game).Reset();
};

DebugMenu.prototype.OnCheckWinners = function(e){
    console.log(Game.ServiceLocator.create(RaceDirector).orderOfFinish.map(function(figure){
        return figure.model.type;
    }));
};

DebugMenu.prototype.OnCheckRelationship = function(e){
    var checker = new RelationshipChecker()
    checker.CheckAll([
        "HorseFigure",
        "MonsterCoin",
        "MonsterFigure",
        "Race",
        "PlayCard",
        "StepCard",
        "RankCard",
        "DashCard",
    ]);
};

// For debug.
var DebugUIDirector = function(){
    this.objects = [
        new FPSRenderer(),
        new RacetrackRenderer(),
        Game.ServiceLocator.create(DebugMenu),
    ];
};
DebugUIDirector.prototype = new GameObject();

// For debug.
var RelationshipChecker = function(){};
RelationshipChecker.prototype = new GameObject();

RelationshipChecker.prototype.Check = function(modelName){
    var masterData = Game.ServiceLocator.create(MasterData);
    var meta = masterData.GetMeta(modelName)
    if(!("relationships" in meta)){
        return;
    }
    var relationships = meta["relationships"];
    var errorMessages = [];
    relationships.forEach(function(relationship){
        var from_rows = masterData.Get(modelName)
        if("filters" in relationship){
            var filters = relationship["filters"];
            filters.forEach(function(filter){
                if(!("name" in filter)){
                    return;
                }
                if(!("value" in filter)){
                    return;
                }
                var name = filter["name"];
                var value = filter["value"];
                var index = meta.names.findIndex(function(v){
                    return v === name;
                });
                from_rows = from_rows.filter(function(row){
                    return row[index] === value;
                });
            });
        }
        var from = relationship["from"];
        var from_name = from["name"];
        var from_index = meta.names.findIndex(function(v){
            return v === from_name;
        });
        var to = relationship["to"];
        var to_object = to["object"]
        var to_name = to["name"];
        var to_index = meta.names.findIndex(function(v){
            return v === to_name;
        });
        var to_rows = masterData.Get(to_object);
        var to_map = {};
        to_rows.forEach(function(row){
            var key = row[to_index];
            to_map[key] = row;
        });
        from_rows.forEach(function(row){
            var value = row[from_index];
            if(!(value in to_map)){
                errorMessages.push(["RelationshipChecker Error:",
                                    " from: ", modelName, ".", from_name,
                                    " value=", value,
                                    " to: ", to_object, ".", to_name].join(""));
            }
        })
    });
    if(0 < errorMessages.length){
        errorMessages.forEach(function(message){
            console.error(message)
        });
    } else {
        console.log("RelationshipChecker: ok");
    }
};

RelationshipChecker.prototype.CheckAll = function(modelNames){
    modelNames.forEach(function(modelName){
        this.Check(modelName);
    }, this);
};

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
    var engine = Game.ServiceLocator.create(Engine);
    engine.objects = [
        Game.ServiceLocator.create(Game),
        Game.ServiceLocator.create(DebugUIDirector), //For debug.
    ];
    engine.Start();
    engine.Loop();
    console.log(engine);
});
