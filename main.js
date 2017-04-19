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
		value.Start();
    }, this);
};

Engine.prototype.Update = function(deltaTime){
    this.objects.forEach(function(value, index, array){
		//TODO: 呼び出しをeventモデルにしたほうがよい
		value.Update(deltaTime);
    }, this);
};

var GameObject = function(){};
GameObject.prototype.Start = function(){};
GameObject.prototype.Update = function(deltaTime){};
GameObject.prototype.Destroy = function(){};

var ServiceLocator = function(container){
	this.container = container;
};

ServiceLocator.prototype.Create = function(obj){
    if(!(obj in this.container)){
        this.container[obj] = new obj();
    }
    return this.container[obj];
}

var Game = function(){
	this.objects = [
		Game.ServiceLocator.Create(SlimeFigureDirector),
		Game.ServiceLocator.Create(MonsterCoinDirector),
	];
};
Game.prototype = new GameObject();

Game.prototype.Start = function(){
    this.objects.forEach(function(value, index, array){
		value.Start();
    }, this);
    GameObject.prototype.Start.call(this, arguments);
};

Game.prototype.Update = function(deltaTime){
    this.objects.forEach(function(value, index, array){
		value.Update(deltaTime);
    }, this);
    GameObject.prototype.Update.call(this, arguments);
};

Game.prototype.Reset = function(){
    this.objects.forEach(function(value, index, array){
		value.Destroy();
    }, this);
    this.Start();
};

Game.ServiceLocatorContainer = {};
Game.ServiceLocator = new ServiceLocator(Game.ServiceLocatorContainer);

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
		]
	};
};

MasterData.prototype.Get = function(key){
	return this.stub[key];
}

var GameBoard = function(){};
GameBoard.prototype = new GameObject();

GameBoard.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
};

GameBoard.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

var SlimeFigure = function(row){
    this.type = row[0];
    this.color = row[1];
};
SlimeFigure.prototype = new GameObject();

var SlimeFigureDirector = function(){
    this.slimes = {};
};
SlimeFigureDirector.prototype = new GameObject();

SlimeFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    Game.ServiceLocator.Create(MasterData).Get("SlimeFigure").forEach(function(value, index, array){
		var slime = new SlimeFigure(value);
		this.slimes[value] = slime;
		slime.Start();
    }, this);
};

SlimeFigureDirector.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

SlimeFigureDirector.prototype.Destroy = function(){
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

MonsterCoinDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
	Game.ServiceLocator.Create(MasterData).Get("MonsterCoin").forEach(function(value, index, array){
		var coin = new MonsterCoin(value);
		this.coins[value] = coin;
		coin.Start();
    }, this);
};

MonsterCoinDirector.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

MonsterCoinDirector.prototype.Destroy = function(){
	this.coins = {};
};

var MonsterFigure = function(row){
    this.type = row[0];
};
MonsterFigure.prototype = new GameObject();

MonsterFigure.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
};

MonsterFigure.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
};

// For debug.
var DebugUIDirector = function(engine){
    this.engine = engine;
    this.dom;
    this.baseTime = engine.lastUpdate;
    this.baseCount = 0;
    this.currentFPS = 0;
};
DebugUIDirector.prototype = new GameObject();

DebugUIDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
		var body = elements[0];
		var dom = document.createElement("h1");
		body.appendChild(dom);
		this.dom = dom;
    }
};

DebugUIDirector.prototype.Update = function(deltaTime){
    GameObject.prototype.Update.call(this, arguments);
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
