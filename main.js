console.log("main.js");

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
        now = Date.now();
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

var ServiceLocator = function(container){
    this.container = container;
};

ServiceLocator.prototype.Create = function(obj){
    if(!(obj in this.container)){
        this.container[obj] = new obj();
    }
    return this.container[obj];
}

var Model = function(definitions, row){
    for(var i=0; i < definitions.length; i++){
        Object.defineProperty(this, definitions[i], (function(){
            var value = row[i];
            return {
                get: function(){
                    return value;
                }
            }
        }()));
    }
};

var MasterData = function(){
    this.stub = {
        "SlimeFigure": [
            // id, type, color
            ["1", "Red", "FF0000"],
            ["2", "Orange", "FFA500"],
            ["3", "Green", "008000"],
            ["4", "Blue", "0000FF"],
            ["5", "Purple", "800080"],
        ],
        "MonsterCoin": [
            // id, type
            ["1", "Dragon"],
            ["2", "Daemon"],
            ["3", "Drakee"],
            ["4", "Golem"],
            ["5", "Ghost"],
        ],
        "MonsterFigure": [
            // id, type
            ["1", "Dragon"],
            ["2", "Daemon"],
            ["3", "Drakee"],
            ["4", "Golem"],
            ["5", "Ghost"],
        ],
        "Race": [
            // id, length
            ["1", "70"]
        ]
    };
};

MasterData.prototype.Get = function(key){
    return this.stub[key];
}

var SlimeFigure = function(row){
    this.model = new Model(["id","type","color"], row);
};
SlimeFigure.prototype = new GameObject();

var SlimeFigureDirector = function(){
    this.slimes = {};
};
SlimeFigureDirector.prototype = new GameObject();

SlimeFigureDirector.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
    Game.ServiceLocator.Create(MasterData).Get("SlimeFigure").forEach(function(value, index, array){
        var slime = new SlimeFigure(value);
        this.slimes[value] = slime;
        slime.OnStart();
    }, this);
};

SlimeFigureDirector.prototype.OnUpdate = function(deltaTime){
    GameObject.prototype.OnUpdate.call(this, arguments);
};

SlimeFigureDirector.prototype.OnDestroy = function(){
    GameObject.prototype.OnDestroy.call(this, arguments);
    this.slime = {};
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
    Game.ServiceLocator.Create(MasterData).Get("MonsterCoin").forEach(function(value, index, array){
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
    Game.ServiceLocator.Create(MasterData).Get("MonsterCoin").forEach(function(value, index, array){
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

var Lane = function(number, runner, length){
    this.number = number;
    this.runner = runner;
    this.length = length;
    this.position = Lane.GatePosition;
};
Lane.prototype = new GameObject();

Lane.GatePosition = -1;

var Course = function(fullField, length){
    this.fullField = fullField;
    this.length = length;
};
Course.prototype = new GameObject();

Course.prototype.OnStart = function(){
    this.fullField.forEach(function(value, index, array){
        var lane = new Lane(index, value, this.length);
        this.objects.push(lane);
    }.bind(this));
    GameObject.prototype.OnStart.call(this, arguments);
};

Course.prototype.Positions = function(){
    console.log(this.objects);
};

var GameBoard = function(race){
    this.race = race;
};
GameBoard.prototype = new GameObject();

GameBoard.prototype.OnStart = function(){
    var master = Game.ServiceLocator.Create(MasterData);
    var slimes = master.Get("SlimeFigure");
    this.course = new Course(slimes, this.race.model.length);
    this.objects = [
        this.course,
    ];
    GameObject.prototype.OnStart.call(this, arguments);
};

var Race = function(row){
    this.model = new Model(["id","length"], row);
};
Race.prototype = new GameObject();

Race.prototype.OnStart = function(){
    this.objects = [
        new GameBoard(this),
    ];
    GameObject.prototype.OnStart.call(this, arguments);
};

var Game = function(){
    this.race = null;
    // TODO: find系のクエリの仕組みないと辛い
    var row = Game.ServiceLocator.Create(MasterData).Get("Race")[0];
    this.objects = [
        new Race(row),
        Game.ServiceLocator.Create(SlimeFigureDirector),
        Game.ServiceLocator.Create(MonsterCoinDirector),
        Game.ServiceLocator.Create(MonsterFigureDirector),
    ];
};
Game.prototype = new GameObject();

Game.prototype.Reset = function(){
    this.OnDestroy();
    this.OnStart();
};

Game.ServiceLocatorContainer = {};
Game.ServiceLocator = new ServiceLocator(Game.ServiceLocatorContainer);

// For debug.
var DebugUIDirector = function(engine){
    this.engine = engine;
    this.dom;
    this.baseTime = engine.lastUpdate;
    this.baseCount = 0;
    this.currentFPS = 0;
};
DebugUIDirector.prototype = new GameObject();

DebugUIDirector.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var dom = document.createElement("h1");
        body.appendChild(dom);
        this.dom = dom;
    }
};

DebugUIDirector.prototype.OnUpdate = function(deltaTime){
    GameObject.prototype.OnUpdate.call(this, arguments);
    if(1000 <= this.engine.lastUpdate - this.baseTime){
        this.currentFPS = ((this.engine.count - this.baseCount) * 1000) / (this.engine.lastUpdate - this.baseTime);
        this.baseTime = this.engine.lastUpdate;
        this.baseCount = this.engine.count;
    }
    this.dom.innerText = Math.floor(this.currentFPS * 100) / 100;
};

// main
(window.onload = function(){
    var engine = new Engine([Game.ServiceLocator.Create(Game)]);
    // For debug.
    engine.objects.push(new DebugUIDirector(engine));
    engine.Start();
    engine.Loop();
    console.log(engine);
});
