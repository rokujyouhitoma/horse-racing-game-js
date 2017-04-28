"use strict";

var Event = function(type, target, payload){
    this.type = type;
    this.target = target;
    this.payload = payload;
};

var EventTarget = function(){
    this.eventListeners = [];
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
    this.eventListeners.push({
        object: this,
        type: type,
        listener: listener,
        wrapper: wrapper
    });
};

EventTarget.prototype.removeEventListener = function(type, listener){
    var eventListeners = this.eventListeners;
    var counter = 0;
    //TODO: O(n)探索は改善しよう
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
    var eventListeners = this.eventListeners;
    var counter = 0;
    //TODO: O(n)探索は改善しよう
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
}

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
}

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
}

var Renderer = function(){};
Renderer.prototype = new GameObject();
Renderer.prototype.Render = function(dictionary){};

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
        "StepCardDetail": [
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
        "RankCardDeail": [
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
            [13, 5, 35],
        ],
        "DashCardDetail": [
            [1, 1, 1],
            [1, 2, 2],
        ],
    };

    this.meta = {
        "HorseFigure": {
            "names": ["id", "type", "color"],
            "types": ["int", "int", "string"],
        },
        "MonsterCoin": {
            "names": ["id", "type"],
            "types": ["int", "string"],
        },
        "MonsterFigure": {
            "names": ["id", "type"],
            "types": ["int", "string"],
        },
        "Race": {
            "names": ["id", "len"],
            "types": ["int", "int"],
        },
        "PlayCard": {
            "names": ["id", "card_type", "detail_id"],
            "types": ["int", "int", "int"],
        },
        "StepCardDetail": {
            "names": ["id", "target_id", "step"],
            "types": ["int", "int", "int"],
        },
        "RankCardDeail": {
            "names": ["id", "target_rank", "step"],
            "types": ["int", "int", "int"],
        },
        "DashCardDetail": {
            "names": ["id", "target_rank", "dash_type"],
            "types": ["int", "int", "int"],
        },
    };

};

MasterData.prototype.Get = function(key){
    return this.stub[key];
}

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

MonsterCoinDirector.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

MonsterCoinDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this, arguments);
    this.coins = {};
};

var MonsterFigure = function(model){
    this.model = model;
};
MonsterFigure.prototype = new GameObject();

MonsterFigure.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
};

MonsterFigure.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

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

MonsterFigureDirector.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

MonsterFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this, arguments);
    this.figures = {};
};

var CardDetail = function(){};
CardDetail.prototype = new GameObject();
CardDetail.prototype.Apply = function(){};

var StepCardDetail = function(model){
};
StepCardDetail.prototype = new CardDetail();

var DashCardDetail = function(model){
};
DashCardDetail.prototype = new CardDetail();

var RankCardDetail = function(model){
};
RankCardDetail.prototype = new CardDetail();

var PlayCard = function(model){
    this.model = model;
};
PlayCard.prototype = new GameObject();

var Lane = function(index, number, runner, len){
    this.index = index;
    this.number = number;
    this.runner = runner;
    this.len = len;
    this.position = Lane.GatePosition;
};
Lane.prototype = new GameObject();

Lane.prototype.IsGatePosition = function(){
    return this.position === Lane.GatePosition
};

Lane.prototype.IsGolePosition = function(){
    return this.len < this.position;
};

Lane.GatePosition = 0;

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
    this.racetrack = new Racetrack(master.Get("HorseFigure").map(function(row){
        return new HorseFigure(Game.Model("HorseFigure").Set(row));
    }), this.race.model.len);
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

var RaceDirector = function(){
    this.orderOfFinish = [];
    this.IsFinish = false;
    Game.Publisher.Subscribe("OnFinish", this.OnFinish.bind(this));
};
RaceDirector.prototype = new GameObject();

RaceDirector.prototype.Update = function(){
    if(2 <= this.orderOfFinish.length && !this.IsFinish){
        Game.Publisher.Publish("OnFinish");
        this.IsFinish = true;
    }
    var game = Game.ServiceLocator.create(Game);
    var lanes = game.race.gameBoard.racetrack.lanes;
    var runners = lanes.filter(function(lane){
        return !this.orderOfFinish.includes(lane.runner) && lane.IsGolePosition();
    }.bind(this)).map(function(lane){
        return lane.runner;
    });
    if(0 < runners.length){
        this.orderOfFinish.push(runners[0]);
    }
};

RaceDirector.prototype.OnFinish = function(){
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

var FPSRenderer = function(){
    this.dom;
};
FPSRenderer.prototype = new Renderer();

FPSRenderer.prototype.Start = function(){
    Renderer.prototype.Start.call(this, arguments);
    this.CreateDOM();
};

FPSRenderer.prototype.Update = function(deltaTime){
    Renderer.prototype.Update.call(this, arguments);
    var fps = Math.floor(Game.ServiceLocator.create(Game).fps.currentFPS * 100) / 100;
    this.Render({
        "fps": fps,
    });
};

FPSRenderer.prototype.CreateDOM = function(){
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
}

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
    this.CreateDOM();
};

RacetrackRenderer.prototype.Update = function(deltaTime){
    Renderer.prototype.Update.call(this, arguments);
    var game = Game.ServiceLocator.create(Game);
    // TODO: innerHTMLは手抜き。createElementによるDOM操作が望ましい
    this.dom.innerHTML = this.Render({
        "racetrack": game.race.gameBoard.racetrack,
    });
};

RacetrackRenderer.prototype.CreateDOM = function(){
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
}

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
}

var DebugMenu = function(){
    this.dom;
    Game.Publisher.Subscribe("OnMove", this.OnMove.bind(this));
    Game.Publisher.Subscribe("OnReset", this.OnReset.bind(this));
    Game.Publisher.Subscribe("OnCheckWinners", this.OnCheckWinners.bind(this));
};
DebugMenu.prototype = new Renderer();

DebugMenu.prototype.Start = function(){
    Renderer.prototype.Start.call(this, arguments);
    this.CreateDOM();
    var game = Game.ServiceLocator.create(Game);
    // TODO: innerHTMLは手抜き。createElementによるDOM操作が望ましい
    this.dom.innerHTML = this.Render({
        "racetrack": game.race.gameBoard.racetrack,
    });
};

DebugMenu.prototype.CreateDOM = function(){
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
};

DebugMenu.prototype.Render = function(dictionary){
    var racetrack = dictionary["racetrack"];
    var lanes = racetrack.lanes;
    return [
        [
            "<button onClick='",
            "(function(){Game.ServiceLocator.create(DebugMenu).Random(", lanes.length ,")})()'>",
            "Random",
            "</button>",
        ].join(""),
        lanes.map(function(lane){
            var text = "+1";
            var index = lane.index;
            var color = lane.runner.model.color;
            return [
                "<button onClick='",
                "(function(){Game.Publisher.Publish(\"OnMove\", {index: ", index, "})})()'>",
                "<span style='background-color:#", color, ";'>", text, "</span>",
                "</button>",
            ].join("");
        }).join(""),
        [
            "<button onClick='",
            "(function(){Game.Publisher.Publish(\"OnCheckWinners\");})()'>",
            "Winners",
            "</button>",
        ].join(""),
        [
            "<button onClick='",
            "(function(){Game.Publisher.Publish(\"OnReset\");})()'>",
            "Reset Game",
            "</button>",
        ].join(""),
    ].join("<br />");
};

DebugMenu.prototype.Random = function(len){
    var index = Math.floor(Math.random() * len);
    var step = 1;
    Game.ServiceLocator.create(Game).race.gameBoard.racetrack.lanes[index].position += step;
};

DebugMenu.prototype.OnMove = function(e){
    var index = e.payload["index"];
    Game.ServiceLocator.create(Game).race.gameBoard.racetrack.lanes[index].position += 1;
};

DebugMenu.prototype.OnReset = function(e){
    Game.ServiceLocator.create(Game).Reset();
};

DebugMenu.prototype.OnCheckWinners = function(e){
    console.log(Game.ServiceLocator.create(RaceDirector).orderOfFinish.map(function(figure){
        return figure.model.type;
    }));
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
