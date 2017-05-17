"use strict";

/**
 * @interface
 */
var IScene = function(){
};
/** @type {string} */
IScene.prototype.name;
IScene.prototype.OnEnter = function(){};
IScene.prototype.OnExit = function(){};
IScene.prototype.OnPause = function(){};
IScene.prototype.OnResume = function(){};

/**
 * @constructor
 */
var Scene = function(){
    this.state = Scene.State.Initial;
};

/**
 * @enum {string}
 */
Scene.State = {
    Initial: "Initial",
    Active: "Active",
    Paused: "Paused",
};

/** @type {string} */
Scene.prototype.name;
Scene.prototype.OnEnter = function(){};
Scene.prototype.OnExit = function(){};
Scene.prototype.OnPause = function(){};
Scene.prototype.OnResume = function(){};

/**
 * @constructor
 */
var SceneDirector = function(){
    this.scenes = [];
};

SceneDirector.prototype.CurrentScene = function(){
    var scenes = this.scenes;
    var length = scenes.length;
    return (0 < length) ? scenes[length - 1] : null;
};

/**
 * @param {IScene} scene A scene.
 */
SceneDirector.prototype.Push = function(scene){
    this.scenes.push(scene);
    this.TriggerEnter(scene);
    this.PauseScenes();
};

/**
 * @return {IScene} A poped scene.
 */
SceneDirector.prototype.Pop = function(){
    var last = this.CurrentScene();
    if(last == null){
        return null;
    }
    this.scenes.pop();
    this.TriggerExit(last);
    var current = this.CurrentScene();
    if(current != null){
        this.TriggerResume(current);
    }
    return last;
};

/**
 * @param {number|null} toDepth To depth number.
 */
SceneDirector.prototype.ToDepth = function(toDepth){
    var count = Math.max(0, this.scenes.length - toDepth);
    for(var i = 0; i < count; i++){
        this.Pop();
    }
};

/**
 * @param {IScene} scene A scene.
 */
SceneDirector.prototype.Replace = function(scene){
    this.Pop();
    this.Push(scene);
};

/**
 * @private
 * @param {IScene} scene A scene.
 */
SceneDirector.prototype.TriggerEnter = function(scene){
    switch(scene.state){
    case Scene.State.Initial:
        scene.state = Scene.State.Active;
        scene.OnEnter();
        break;
    case Scene.State.Active:
        console.error("Not support");
        break;
    case Scene.State.Paused:
        console.error("Not support");
        break;
    default:
        console.error("Not support");
        break;
    }
};

/**
 * @private
 * @param {IScene} scene A scene.
 */
SceneDirector.prototype.TriggerExit = function(scene){
    switch(scene.state){
    case Scene.State.Initial:
        console.error("Not support");
        break;
    case Scene.State.Active:
        scene.state = Scene.State.Initial;
        scene.OnExit();
        break;
    case Scene.State.Paused:
        console.error("Not support");
        break;
    default:
        console.error("Not support");
        break;
    }
};

SceneDirector.prototype.TriggerPause = function(scene){
    switch(scene.state){
    case Scene.State.Initial:
        console.error("Not support");
        break;
    case Scene.State.Active:
        scene.state = Scene.State.Paused;
        scene.OnPause();
        break;
    case Scene.State.Paused:
        // pass
        break;
    default:
        console.error("Not support");
        break;
    }
};

/**
 * @private
 * @param {IScene} scene A scene.
 */
SceneDirector.prototype.TriggerResume = function(scene){
    switch(scene.state){
    case Scene.State.Initial:
        console.error("Not support");
        break;
    case Scene.State.Active:
        console.error("Not support");
        break;
    case Scene.State.Paused:
        scene.state = Scene.State.Active;
        scene.OnResume();
        break;
    default:
        console.error("Not support");
        break;
    }
};

/**
 * @private
 */
SceneDirector.prototype.PauseScenes = function(){
    var current = this.CurrentScene();
    this.scenes.forEach(function(scene){
        if(scene != current){
            this.TriggerPause(scene);
        }
    }, this);
};
