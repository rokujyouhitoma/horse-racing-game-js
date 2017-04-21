console.log("main.js");

var Engine = function(objects){
    this.objects = objects;
    this.count = 0;
    this.FPS = 1000 / 60;
    this.lastUpdate = Date.now();
};

Engine.prototype.Loop = function(){
    console.log("Loop");
    var self = this;
    var loop = function(){
        if(0 <= self.count){
            setTimeout(loop, self.FPS);
            self.count++;
        }
        now = Date.now();
        var deltaTime = (now - self.lastUpdate) / 1000;
        self.lastUpdate = now;
        self.Update(deltaTime);
    };
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

var MasterData = function(){
    this.stub = {
        "SlimeFigure": [
            // type, color
            ["Red", "FF0000"],
            ["Orange", "FFA500"],
            ["Green", "008000"],
            ["Blue", "0000FF"],
            ["Purple", "800080"],
        ],
        "MonsterCoin": [
            // type
            ["Dragon"],
            ["Daemon"],
            ["Drakee"],
            ["Golem"],
            ["Ghost"],
        ],
        "MonsterFigure": [
            // type
            ["Dragon"],
            ["Daemon"],
            ["Drakee"],
            ["Golem"],
            ["Ghost"],
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
    this.type = row[0];
    this.color = row[1];
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
    this.type = row[0];
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
    this.type = row[0];
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

var Lane = function(length){
    this.length = length;
    this.squares = [];
};
Lane.prototype = new GameObject();

Lane.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
    for(var l = 0; l < this.length; l++){
        this.squares[l] = Lane.Enable;
    }
};

Lane.Enable = 1; //TODO: xxx

var Course = function(number, length){
    this.number = number;
    this.length = length;
};
Course.prototype = new GameObject();

Course.prototype.OnStart = function(){
    //TODO: Is it necessity process? Im not sure.
    for(var n = 0; n < this.number; n++){
        this.objects[n] = new Lane(this.length);
    }
    GameObject.prototype.OnStart.call(this, arguments);
};

var GameBoard = function(){};
GameBoard.prototype = new GameObject();

GameBoard.prototype.OnStart = function(){
    var master = Game.ServiceLocator.Create(MasterData);
    var number = master.Get("SlimeFigure").length;
    // TODO: find系のクエリの仕組みないと辛い
    var length =  master.Get("Race").filter(function(element, index, array){
        // TODO: 素のデータrowを扱うのは、限界。エンティティオブジェクトとして扱わないと辛い
        // id=1の際にその要素に決定
        var length = (element[0] == 1) ? element[1] : -1;
        if (length < 0){
            console.error("xxx");
        }
        return true;
    })[0][1];
    this.course = new Course(number, length);
    this.objects = [
        this.course,
    ];
    GameObject.prototype.OnStart.call(this, arguments);
};

var Race = function(){};
Race.prototype = new GameObject();

Race.prototype.OnStart = function(){
    this.objects = [
        new GameBoard(),
    ];
    GameObject.prototype.OnStart.call(this, arguments);
};

var Game = function(){
    this.race = null;
    this.objects = [
        Game.ServiceLocator.Create(SlimeFigureDirector),
        Game.ServiceLocator.Create(MonsterCoinDirector),
        Game.ServiceLocator.Create(MonsterFigureDirector),
    ];
};
Game.prototype = new GameObject();

Game.prototype.OnStart = function(){
    GameObject.prototype.OnStart.call(this, arguments);
    this.StartRace();
};

Game.prototype.StartRace = function(){
    this.race = new Race();
    this.race.OnStart();
};

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
