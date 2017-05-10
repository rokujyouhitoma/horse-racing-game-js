"use strict";

/**
 * @interface
 */
var IGameObject = function(){};

/**
 *
 */
IGameObject.prototype.Start = function(){};

/**
 * @param {number} deltaTime The delta time.
 */
IGameObject.prototype.Update = function(deltaTime){};

/**
 * @param {number} deltaTime The delta time.
 */
IGameObject.prototype.LastUpdate = function(deltaTime){};

/**
 *
 */
IGameObject.prototype.Destroy = function(){};

/**
 * @constructor
 * @implements {IGameObject}
 */
var GameObject = function(){
    this.objects = [];
};

GameObject.prototype.Start = function(){
    this.objects.forEach(function(value, index, array){
        value.Start();
    });
};

GameObject.prototype.Update = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        value.Update(deltaTime);
    });
};

GameObject.prototype.LastUpdate = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        value.LastUpdate(deltaTime);
    });
};

GameObject.prototype.Destroy = function(){
    this.objects.forEach(function(value, index, array){
        value.Destroy();
    });
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
    var loop = function(){
        if(0 <= this.count){
            setTimeout(loop, this.FPS);
            this.count++;
        }
        var now = Date.now();
        var deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        this.Update(deltaTime);
        this.LastUpdate(deltaTime);
    }.bind(this);
    loop();
};

Engine.prototype.Start = function(){
    this.objects.forEach(function(value, index, array){
        value.Start();
    });
};

Engine.prototype.Update = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        value.Update(deltaTime);
    });
};

Engine.prototype.LastUpdate = function(deltaTime){
    this.objects.forEach(function(value, index, array){
        value.LastUpdate(deltaTime);
    });
};
