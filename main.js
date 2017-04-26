"use strict";

console.log("main.js");

var Event = function(type, target){
    this.type = type;
    this.target = target;
};

var EventTarget = function(){
    this.eventListeners = [];
};

EventTarget.prototype.listen = function(type, listener){
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

EventTarget.prototype.unlisten = function(type, listener){
    var eventListeners = this.eventListeners;
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

EventTarget.prototype.dispatch = function(type){
    var eventListeners = this.eventListeners;
    var counter = 0;
    while(counter < eventListeners.length){
        var eventListener = eventListeners[counter];
        if (eventListener.object == this &&
            eventListener.type == type){
            if(type instanceof Event){
                type.target = this;
                eventListener.wrapper(type);
            } else {
                eventListener.wrapper(new Event(type, this));
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

GameObject.prototype.OnStart = function(){
    this.objects.forEach(function(value, index, array){
        value.OnStart();
    }, this);
};

GameObject.prototype.OnUpdate = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        value.OnUpdate(deltaTime);
    }, this);
};

GameObject.prototype.OnDestroy = function(){
    this.objects.forEach(function(value, index, array){
        value.OnDestroy();
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
        //TODO: 呼び出しをeventモデルにしたほうがよい
        value.OnStart();
    }, this);
};

Engine.prototype.Update = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        //TODO: 呼び出しをeventモデルにしたほうがよい
        value.OnUpdate(deltaTime);
    }, this);
};

var Model = function(definitions, row){
    for(var i=0; i < definitions.length; i++){
        this[definitions[i]] = row[i];
        // Object.defineProperty(this, definitions[i], (function(){
        //     var value = row[i];
        //     return {
        //         get: function(){
        //             return value;
        //         }
        //     }
        // }()));
    }
};

var Renderer = function(){};
Renderer.prototype = new GameObject();
Renderer.prototype.Render = function(dictionary){};

var MasterData = function(){
    this.stub = {
        "Figure": [
            // id, type, color
            // int, string, string
            [1, "Red", "FF0000"],
            [2, "Orange", "FFA500"],
            [3, "Green", "008000"],
            [4, "Blue", "0000FF"],
            [5, "Purple", "800080"],
        ],
        "MonsterCoin": [
            // id, type
            // int, string
            [1, "Dragon"],
            [2, "Daemon"],
            [3, "Drakee"],
            [4, "Golem"],
            [5, "Ghost"],
        ],
        "MonsterFigure": [
            // id, type
            // int, string
            [1, "Dragon"],
            [2, "Daemon"],
            [3, "Drakee"],
            [4, "Golem"],
            [5, "Ghost"],
        ],
        "Race": [
            // id, len
            // int, int
            [1, 70],
        ]
    };
};

MasterData.prototype.Get = function(key){
    return this.stub[key];
}

var Figure = function(row){
    this.model = new Model(["id","type","color"], row);
};
Figure.prototype = new GameObject();

var FigureDirector = function(){
    this.figures = {};
};
FigureDirector.prototype = new GameObject();

FigureDirector.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
    Game.ServiceLocator.create(MasterData).Get("Figure").forEach(function(value, index, array){
        var figure = new Figure(value);
        this.figures[value] = figure;
        figure.OnStart();
    }, this);
};

FigureDirector.prototype.OnUpdate = function(deltaTime){
    GameObject.prototype.OnUpdate.call(this, arguments);
};

FigureDirector.prototype.OnDestroy = function(){
    GameObject.prototype.OnDestroy.call(this, arguments);
    this.figure = {};
};

var MonsterCoin = function(row){
    this.model = new Model(["id","type"], row);
};
MonsterCoin.prototype = new GameObject();

var MonsterCoinDirector = function(){
    this.coins = {};
};
MonsterCoinDirector.prototype = new GameObject();

MonsterCoinDirector.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
    Game.ServiceLocator.create(MasterData).Get("MonsterCoin").forEach(function(value, index, array){
        var coin = new MonsterCoin(value);
        this.coins[value] = coin;
        coin.OnStart();
    }, this);
};

MonsterCoinDirector.prototype.OnUpdate = function(deltaTime){
    GameObject.prototype.OnUpdate.call(this, arguments);
};

MonsterCoinDirector.prototype.OnDestroy = function(){
    GameObject.prototype.OnDestroy.call(this, arguments);
    this.coins = {};
};

var MonsterFigure = function(row){
    this.model = new Model(["id","type"], row);
};
MonsterFigure.prototype = new GameObject();

MonsterFigure.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
};

MonsterFigure.prototype.OnUpdate = function(deltaTime){
    GameObject.prototype.OnUpdate.call(this, arguments);
};

var MonsterFigureDirector = function(){
    this.figures = {};
};
MonsterFigureDirector.prototype = new GameObject();

MonsterFigureDirector.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
    Game.ServiceLocator.create(MasterData).Get("MonsterCoin").forEach(function(value, index, array){
        var figure = new MonsterFigure(value);
        this.figures[value] = figure;
        figure.OnStart();
    }, this);
};

MonsterFigureDirector.prototype.OnUpdate = function(deltaTime){
    GameObject.prototype.OnUpdate.call(this, arguments);
};

MonsterFigureDirector.prototype.OnDestroy = function(){
    GameObject.prototype.OnDestroy.call(this, arguments);
    this.figures = {};
};

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

Racetrack.prototype.OnStart = function(){
    this.lanes = this.runners.map(function(runner, index, array){
        var number = index + 1;
        return new Lane(index, number, runner, this.len);
    }.bind(this));
    this.objects.concat(this.lanes);
    GameObject.prototype.OnStart.call(this, arguments);
};

var GameBoard = function(race){
    this.race = race;
    this.racetrack;
};
GameBoard.prototype = new GameObject();

GameBoard.prototype.OnStart = function(){
    var master = Game.ServiceLocator.create(MasterData);
    var figures = master.Get("Figure");
    this.racetrack = new Racetrack(figures.map(function(x){
        return new Figure(x);
    }), this.race.model.len);
    this.objects = [
        this.racetrack,
    ];
    GameObject.prototype.OnStart.call(this, arguments);
};

var Race = function(row){
    this.model = new Model(["id","len"], row);
    this.gameBoard = new GameBoard(this);
};
Race.prototype = new GameObject();

Race.prototype.OnStart = function(){
    this.objects = [
        this.gameBoard,
    ];
    GameObject.prototype.OnStart.call(this, arguments);
};

var RaceDirector = function(){
    this.orderOfFinish = [];
    this.IsFinish = false;
};
RaceDirector.prototype = new GameObject();

RaceDirector.prototype.OnUpdate = function(){
    if(2 <= this.orderOfFinish.length){
        if(!this.IsFinish){
            this.Finish();
            this.IsFinish = true;
        }
    }
    var game = Game.ServiceLocator.create(Game);
    var lanes = game.race.gameBoard.racetrack.lanes;
    var goalLanes = lanes.filter(function(lane){
        return !(-1 < this.orderOfFinish.indexOf(lane.runner)) && lane.IsGolePosition();
    }.bind(this));
    var runners = goalLanes.map(function(lane){
        return lane.runner;
    });
    if(0 < runners.length){
        this.orderOfFinish.push(runners[0]);
    }
};

RaceDirector.prototype.Finish = function(){
    console.log(this.orderOfFinish.slice(0, 2).map(function(figure){return figure.model.type;}));
};

RaceDirector.prototype.OnDestroy = function(){
    this.orderOfFinish = [];
};

var Publisher = function(){
    this.target = new EventTarget();
};

Publisher.prototype.subscribe = function(message, callback){
    this.target.listen(message, callback);
};

Publisher.prototype.unsubscribe = function(message, callback){
    this.target.unlisten(message, callback);
};

Publisher.prototype.publish = function(message){
    this.target.dispatch(message);
};

var Game = function(){
    // TODO: find系のクエリの仕組みないと辛い
    var row = Game.ServiceLocator.create(MasterData).Get("Race")[0];
    this.fps = new FPS();
    this.race = new Race(row);
    this.objects = [
        this.fps,
        this.race,
        Game.ServiceLocator.create(RaceDirector),
        Game.ServiceLocator.create(FigureDirector),
        Game.ServiceLocator.create(MonsterCoinDirector),
        Game.ServiceLocator.create(MonsterFigureDirector),
    ];
};
Game.prototype = new GameObject();

Game.prototype.Reset = function(){
    this.OnDestroy();
    this.OnStart();
};

Game.ServiceLocatorContainer = {};
Game.ServiceLocator = new ServiceLocator(Game.ServiceLocatorContainer);

Game.Publisher = Game.ServiceLocator.create(Publisher);

var FPS = function(){
    var engine = Game.ServiceLocator.create(Engine);
    this.baseTime = engine.lastUpdate;
    this.baseCount = 0;
    this.currentFPS = 0;
};
FPS.prototype = new GameObject();

FPS.prototype.OnUpdate = function(deltaTime){
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

FPSRenderer.prototype.OnStart = function(){
    Renderer.prototype.OnStart.call(this, arguments);
    this.CreateDOM();
};

FPSRenderer.prototype.OnUpdate = function(deltaTime){
    Renderer.prototype.OnUpdate.call(this, arguments);
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

RacetrackRenderer.prototype.OnStart = function(){
    Renderer.prototype.OnStart.call(this, arguments);
    this.CreateDOM();
};

RacetrackRenderer.prototype.OnUpdate = function(deltaTime){
    Renderer.prototype.OnUpdate.call(this, arguments);
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
};
DebugMenu.prototype = new Renderer();

DebugMenu.prototype.OnStart = function(){
    Renderer.prototype.OnStart.call(this, arguments);
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
                "(function(){Game.ServiceLocator.create(Game).race.gameBoard.racetrack.lanes[", index, "].position += 1;})()'>",
                "<span style='background-color:#", color, ";'>", text, "</span>",
                "</button>",
            ].join("");
        }).join(""),
        [
            "<button onClick='",
            "(function(){Game.ServiceLocator.create(DebugMenu).Winners()})()'>",
            "Winners",
            "</button>",
        ].join(""),
        [
            "<button onClick='",
            "(function(){Game.ServiceLocator.create(DebugMenu).Reset()})()'>",
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

DebugMenu.prototype.Reset = function(){
    Game.ServiceLocator.create(Game).Reset();
};

DebugMenu.prototype.Winners = function(){
    console.log(Game.ServiceLocator.create(RaceDirector).orderOfFinish.map(function(figure){return figure.model.type;}));
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
