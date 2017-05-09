"use strict";

/**
 * @interface
 */
var IScene = function(){};
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

SceneDirector.prototype.Push = function(scene){
    this.scenes.push(scene);
    this.TriggerEnter(scene);
    this.PauseScenes();
};

SceneDirector.prototype.Pop = function(){
    var current = this.CurrentScene();
    if(current == null){
        return null;
    }
    this.scenes.pop();
    this.TriggerExit(current);
    this.ResumeScenes();
};

/**
 * @param {number|null} toDepth
 */
SceneDirector.prototype.ToDepth = function(toDepth){
    var count = Math.max(0, this.scenes.length - toDepth);
    for(var i=0; i<count; i++){
        this.Pop();
    }
};

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
        break;
    default:
        console.error("Not support");
        break;
    }
};

SceneDirector.prototype.TriggerResume = function(scene){
    switch(scene.state){
    case Scene.State.Initial:
        console.error("Not support");
        break;
    case Scene.State.Active:
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

SceneDirector.prototype.PauseScenes = function(){
    var current = this.CurrentScene();
    this.scenes.forEach(function(scene){
        if(scene != current){
            this.TriggerPause(scene);
        }
    }, this);
};

SceneDirector.prototype.ResumeScenes = function(){
    var current = this.CurrentScene();
    this.scenes.forEach(function(scene){
        if(current != null){
            this.TriggerResume(current);
        }
    }, this);
};
