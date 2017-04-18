console.log("main.js");

var Engine = function(objects){
    this.objects = objects;
    this.count = 0;
    this.FPS = 1000 / 60;
    this.now = Date.now();
    this.lastUpdate = this.now;
    this.baseTime = this.now;
    this.baseCount = 0;
    this.currentFPS = 0;
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
	if(1000 <= now - self.baseTime){
	    self.currentFPS = ((self.count - self.baseCount) * 1000) / (now - self.baseTime);
	    self.baseTime = now;
	    self.baseCount = self.count;
	}
	self.lastUpdate = now;
	self.now = now;
	var dt = now - self.lastUpdate;
	self.Update(dt);
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

var GameBoard = function(){};
GameBoard.prototype = new GameObject();

var SlimeFigure = function(type){
    this.type = type;
    this.color = SlimeFigure.Color[type];
};
SlimeFigure.prototype = new GameObject();

SlimeFigure.Type = {
    "Red": "Red",
    "Orange": "Orange",
    "Green": "Green",
    "Blue": "Blue",
    "Purple": "Purple",
};

SlimeFigure.Color = {
    "Red": "FF0000",
    "Orange": "FFA500",
    "Green": "008000",
    "Blue": "0000FF",
    "Purple": "800080"
};

var SlimeFigureDirector = function(){
    this.slimes = {};
};
SlimeFigureDirector.prototype = new GameObject();

SlimeFigureDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    Object.keys(SlimeFigure.Type).forEach(function(value, index, array){
	var slime = new SlimeFigure(value);
	this.slimes[value] = slime;
	slime.Start();
    }, this);
};

SlimeFigureDirector.prototype.Update = function(){
    GameObject.prototype.Update.call(this, arguments);
};

var MonsterCoin = function(type){
    this.type = type;
};
MonsterCoin.prototype = new GameObject();

MonsterCoin.Type = {
    "Dragon": "Dragon",
    "Daemon": "Daemon",
    "Drakee": "Drakee",
    "Golem": "Golem",
    "Ghost": "Ghost",
};

var MonsterCoinDirector = function(){
    this.coins = {};
};
MonsterCoinDirector.prototype = new GameObject();

MonsterCoinDirector.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
    Object.keys(MonsterCoin.Type).forEach(function(value, index, array){
	var coin = new MonsterCoin(value);
	this.coins[value] = coin;
	coin.Start();
    }, this);
};

MonsterCoinDirector.prototype.Update = function(){
    GameObject.prototype.Update.call(this, arguments);
};

var MonsterFigure = function(type){
    this.type = type;
};
MonsterFigure.prototype = new GameObject();

MonsterFigure.Type = {
    "Dragon": "Dragon",
    "Daemon": "Daemon",
    "Drakee": "Drakee",
    "Golem": "Golem",
    "Ghost": "Ghost",
};

MonsterFigure.prototype.Start = function(){
    GameObject.prototype.Start.call(this, arguments);
};

MonsterFigure.prototype.Update = function(){
    GameObject.prototype.Update.call(this, arguments);
};

// For debug.
var DebugUIDirector = function(engine){
    this.engine = engine;
    this.dom;
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

DebugUIDirector.prototype.Update = function(){
    GameObject.prototype.Update.call(this, arguments);
    this.dom.innerText = this.engine.currentFPS;
};

// main
(window.onload = function(){
    var engine = new Engine([
        new SlimeFigureDirector(),
	new MonsterCoinDirector(),
    ]);
    // For debug.
    engine.objects.push(new DebugUIDirector(engine));

    engine.Start();
    engine.Loop();
    console.log(engine);
});
