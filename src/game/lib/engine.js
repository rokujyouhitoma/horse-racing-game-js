"use strict";

/**
 * @interface
 */
var IGameObject = function(){};

/**
 * Start.
 */
IGameObject.prototype.Start = function(){};

/**
 * Update
 */
IGameObject.prototype.Update = function(){};

/**
 * Last update.
 */
IGameObject.prototype.LastUpdate = function(){};

/**
 * @param {number} delta The delta.
 */
IGameObject.prototype.Render = function(delta){};

/**
 * Destroy.
 */
IGameObject.prototype.Destroy = function(){};

/**
 * @constructor
 * @implements {IGameObject}
 */
var GameObject = function(){
    this.objects = [];
};

/**
 * Start.
 */
GameObject.prototype.Start = function(){
    this.objects.forEach(function(value){
        value.Start();
    });
};

/**
 * Update.
 */
GameObject.prototype.Update = function(){
    this.objects.forEach(function(value){
        value.Update();
    });
};

/**
 * Last update.
 */
GameObject.prototype.LastUpdate = function(){
    this.objects.forEach(function(value){
        value.LastUpdate();
    });
};

/**
 * @param {number} delta The delta.
 */
GameObject.prototype.Render = function(delta){
    this.objects.forEach(function(value){
        value.Render(delta);
    });
};

/**
 * Destroy.
 */
GameObject.prototype.Destroy = function(){
    this.objects.forEach(function(value){
        value.Destroy();
    });
};

/**
 * @constructor
 * @param {Array<GameObject>} objects GameObjects.
 */
var Engine = function(objects){
    this.objects = objects;
    this.count = 0;
    this.FPS = 60;
    this.lastUpdate = Date.now();
};

/**
 * The main loop.
 */
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
        //TODO: xxx
        if(LIMIT_LAG < lag){
            lag = 0;
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

/**
 * Start.
 */
Engine.prototype.Start = function(){
    this.objects.forEach(function(value){
        value.Start();
    });
};

/**
 * Update.
 */
Engine.prototype.Update = function(){
    this.objects.forEach(function(value){
        value.Update();
    });
};

/**
 * Last update after update.
 */
Engine.prototype.LastUpdate = function(){
    this.objects.forEach(function(value){
        value.LastUpdate();
    });
};

/**
 * @param {number} delta The delta. range is 0-1.
 */
Engine.prototype.Render = function(delta){
    this.objects.forEach(function(value){
        value.Render(delta);
    });
};
