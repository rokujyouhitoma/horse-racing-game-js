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
 * @param {number} delta The delta.
 */
IGameObject.prototype.LastUpdate = function(delta){};

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

GameObject.prototype.Update = function(){
    this.objects.forEach(function(value, index, array){
        value.Update();
    });
};

GameObject.prototype.LastUpdate = function(delta){
    this.objects.forEach(function(value, index, array){
        value.LastUpdate(delta);
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
    this.FPS = 60;
    this.lastUpdate = Date.now();
};

Engine.prototype.Loop = function(){
    var lag = 0;
    var MPU = 1000 / this.FPS;
    var loop = function(){
        if(0 <= this.count){
            setTimeout(loop, MPU);
            this.count++;
        }
        var now = Date.now();
        var elapsed = now - this.lastUpdate;
        this.lastUpdate = now;
        lag += elapsed;
        while(MPU <= lag){
            this.Update();
            lag -= MPU;
        }
        this.LastUpdate(lag / MPU);
    }.bind(this);
    loop();
};

Engine.prototype.Start = function(){
    this.objects.forEach(function(value, index, array){
        value.Start();
    });
};

Engine.prototype.Update = function(){
    this.objects.forEach(function(value, index, array){
        value.Update();
    });
};

Engine.prototype.LastUpdate = function(delta){
    this.objects.forEach(function(value, index, array){
        value.LastUpdate(delta);
    });
};
