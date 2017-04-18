console.log("main.js");

var Engine = function(objects){
    this.objects = objects;
    this.count = 0;
    this.fps = 1000 / 60;
    this.lastUpdate = Date.now();
};

Engine.prototype.Loop = function(){
    console.log("Loop");
    var self = this;
    var loop = function() {
	if(self.count >= 0) {
	    setTimeout(loop, self.fps);
	    self.count++;
	}
	var now = Date.now();
	var dt = now - self.lastUpdate;
	self.lastUpdate = now;
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

// main
(function(){
    var engine = new Engine([
        new SlimeFigureDirector(),
	new MonsterCoinDirector(),
    ]);
    engine.Start();
    engine.Loop();
    console.log(engine);
})();
