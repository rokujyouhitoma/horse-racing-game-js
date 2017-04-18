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
    console.log("Update");
    this.objects.forEach(function(value, index, array){
	//TODO: 呼び出しをeventモデルにしたほうがよい
	value.Update(deltaTime);
    }, this);
};

var GameObject = function(){};
GameObject.prototype.Start = function(){};
GameObject.prototype.Update = function(deltaTime){};

var BaseFigure = function(){
    this.color;
};

var SlimeFigure = function(type){
    this.type = type;
    this.color = SlimeFigure.Color[type];
};
SlimeFigure.prototype = new BaseFigure();

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
    Object.keys(SlimeFigure.Type).forEach(function(value, index, array){
	this.slimes[value] = new SlimeFigure(value);
    }, this);
};

// main
(function(){
    var engine = new Engine([
        new SlimeFigureDirector(),
    ]);
    engine.Start();
    engine.Loop();
})();
