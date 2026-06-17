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
 *
 * Uses a fixed-timestep update loop with variable-rate rendering.
 * Reference: "Fix Your Timestep!" by Glenn Fiedler.
 */
Engine.prototype.Loop = function(){
    var self = this;
    /** @type {number} */
    var lag = 0;
    /** @type {number} */
    var MPU = 1000 / self.FPS;
    /**
     * Maximum accumulated lag before clamping.
     * LIMIT_LAG = 1000 * MPU ≈ 16,667ms (about 16.7 seconds at 60FPS).
     * When the browser tab is backgrounded or the JS thread is suspended for
     * longer than this threshold, the accumulated lag would cause the while-loop
     * to run hundreds of Update() calls at once upon resumption, causing a
     * "spiral of death" or an inconsistent state jump.
     *
     * Fix (ISSUE-06): Instead of discarding all accumulated lag (lag = 0; return),
     * we clamp lag to exactly one MPU. This guarantees that:
     *   1. The unrealistic time-jump is discarded (no runaway catch-up loop).
     *   2. Exactly one Update() + LastUpdate() cycle is still executed per frame,
     *      preserving state machine consistency (e.g. scene transitions, card
     *      commands, and render-layer event subscriptions remain coherent).
     * @type {number}
     */
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
        if(LIMIT_LAG < lag){
            // Clamp to one step instead of skipping entirely (ISSUE-06).
            // Discards the unrealistic time-jump while still running one
            // Update cycle to keep game state coherent.
            lag = MPU;
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
