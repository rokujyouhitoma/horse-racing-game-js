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

var Model = function(definitions, row){
    for(var i=0; i < definitions.length; i++){
        this[definitions[i]] = row[i];
    }
};

var Renderer = function(){};
Renderer.prototype = new GameObject();
Renderer.prototype.Render = function(dictionary){};

var MasterData = function(){
    this.stub = {
        "HorseFigure": [
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
        ],
        "HorseCard": [
            // id, target_id, step
            // int, int, int
            [1, 1, 5],
            [2, 1, 5],
            [3, 1, 5],
            [4, 1, 9],
            [5, 1, 9],
            [6, 1, 9],
            [7, 1, 10],
            [8, 1, 10],
            [9, 1, 10],
            [10, 2, 5],
            [11, 2, 5],
            [12, 2, 5],
            [13, 2, 6],
            [14, 2, 6],
            [15, 2, 6],
            [16, 2, 8],
            [17, 2, 8],
            [18, 2, 8],
            [19, 3, 4],
            [20, 3, 4],
            [21, 3, 4],
            [22, 3, 5],
            [23, 3, 5],
            [24, 3, 5],
            [25, 3, 7],
            [26, 3, 7],
            [27, 3, 7],
            [28, 4, 4],
            [29, 4, 4],
            [30, 4, 4],
            [31, 4, 5],
            [32, 4, 5],
            [33, 4, 5],
            [34, 4, 6],
            [35, 4, 6],
            [36, 4, 6],
            [37, 5, 3],
            [38, 5, 3],
            [39, 5, 3],
            [40, 5, 4],
            [41, 5, 4],
            [42, 5, 4],
            [43, 5, 5],
            [44, 5, 5],
            [45, 5, 5],
        ],
        "RankCard": [
            // id, target_rank, step
            // int, int, int
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
        "DashCard": [
            // id, target_rank, type
            // int, int, int
            [1, 1, 1],
            [1, 2, 2],
        ],
    };
};

MasterData.prototype.Get = function(key){
    return this.stub[key];
}

var HorseFigure = function(row){
    this.model = new Model(["id","type","color"], row);
};
HorseFigure.prototype = new GameObject();

var HorseFigureDirector = function(){
    this.figures = {};
};
HorseFigureDirector.prototype = new GameObject();

HorseFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    Game.ServiceLocator.create(MasterData).Get("HorseFigure").forEach(function(value, index, array){
        var figure = new HorseFigure(value);
        this.figures[value] = figure;
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

var MonsterCoin = function(row){
    this.model = new Model(["id","type"], row);
};
MonsterCoin.prototype = new GameObject();

var MonsterCoinDirector = function(){
    this.coins = {};
};
MonsterCoinDirector.prototype = new GameObject();

MonsterCoinDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    Game.ServiceLocator.create(MasterData).Get("MonsterCoin").forEach(function(value, index, array){
        var coin = new MonsterCoin(value);
        this.coins[value] = coin;
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

var MonsterFigure = function(row){
    this.model = new Model(["id","type"], row);
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
    Game.ServiceLocator.create(MasterData).Get("MonsterCoin").forEach(function(value, index, array){
        var figure = new MonsterFigure(value);
        this.figures[value] = figure;
        figure.Start();
    }, this);
};

MonsterFigureDirector.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

MonsterFigureDirector.prototype.Destroy = function(){
    GameObject.prototype.Destroy.call(this, arguments);
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
    var figures = master.Get("HorseFigure");
    this.racetrack = new Racetrack(figures.map(function(figure){
        return new HorseFigure(figure);
    }), this.race.model.len);
    this.objects = [
        this.racetrack,
    ];
    GameObject.prototype.Start.call(this, arguments);
};

var Race = function(row){
    this.model = new Model(["id","len"], row);
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
    this.race = new Race(row);
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
