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
 *
 */
IGameObject.prototype.Update = function(){};

/**
 *
 */
IGameObject.prototype.LastUpdate = function(delta){};

/**
 * @param {number} delta The delta.
 */
IGameObject.prototype.Render = function(delta){};

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
    this.objects.forEach(function(value){
        value.Start();
    });
};

GameObject.prototype.Update = function(){
    this.objects.forEach(function(value){
        value.Update();
    });
};

GameObject.prototype.LastUpdate = function(){
    this.objects.forEach(function(value){
        value.LastUpdate();
    });
};

GameObject.prototype.Render = function(delta){
    this.objects.forEach(function(value){
        value.Render(delta);
    });
};

GameObject.prototype.Destroy = function(){
    this.objects.forEach(function(value){
        value.Destroy();
    });
};

/**
 * @constructor
 */
var Engine = function(objects){
    this.objects = objects;
    this.count = 0;
    this.FPS = 60;
    this.lastUpdate = Date.now();
};

Engine.prototype.Loop = function(){
    var lag = 0;
    var MPU = 1000 / this.FPS;
    var LIMIT_LAG = 1000 * MPU;
    var loop = function(){
        if(0 <= this.count){
            setTimeout(loop, MPU);
            this.count++;
        }
        var now = Date.now();
        var elapsed = now - this.lastUpdate;
        this.lastUpdate = now;
        lag += elapsed;
        if(LIMIT_LAG < lag){
            //TODO: xxx
            lag = 0;
            console.error(lag);
            return;
        }
        while(MPU <= lag){
            this.Update();
            this.LastUpdate();
            lag -= MPU;
        }
        this.Render(lag / MPU);
    }.bind(this);
    this.Start();
    loop();
};

Engine.prototype.Start = function(){
    this.objects.forEach(function(value){
        value.Start();
    });
};

Engine.prototype.Update = function(){
    this.objects.forEach(function(value){
        value.Update();
    });
};

Engine.prototype.LastUpdate = function(){
    this.objects.forEach(function(value){
        value.LastUpdate();
    });
};

Engine.prototype.Render = function(delta){
    this.objects.forEach(function(value){
        value.Render(delta);
    });
};
