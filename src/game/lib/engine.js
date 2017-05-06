"use strict";

/**
 * @constructor
 */
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

/**
 * @constructor
 */
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
