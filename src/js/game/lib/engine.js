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
 * @param {number} delta The delta. range is 0-1.
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
    /** @type {!Array<!IGameObject>} */
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
    /** @type {Array<GameObject>} */
    this.objects = objects;
    /** @type {number} */
    this.count = 0;
    /** @type {number} */
    this.FPS = 60;
    /** @type {number} */
    this.lastUpdate = Date.now();
};

/**
 * The main loop.
 */
Engine.prototype.Loop = function(){
    var self = this;
    /** @type {number} */
    var lag = 0;
    /** @type {number} */
    var MPU = 1000 / self.FPS;
    /** @type {number} */
    var LIMIT_LAG = 1000 * MPU;
    var loop = function(){
        if(0 <= self.count){
            setTimeout(loop, MPU);
            self.count++;
        }
        var now = Date.now();
        var elapsed = now - self.lastUpdate;
        self.lastUpdate = now;
        lag += elapsed;
        // TODO: [ISSUE-06] タブ切り替え等のスリープ復帰時に更新処理がスキップされる不整合リスクの解消
        if(LIMIT_LAG < lag){
            lag = 0;
            return;
        }
        while(MPU <= lag){
            self.Update();
            self.LastUpdate();
            lag -= MPU;
        }
        self.Render(lag / MPU);
    };
    self.Start();
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
