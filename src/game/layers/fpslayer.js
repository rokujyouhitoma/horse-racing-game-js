"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var FPSLayer = function(scene){
    this.scene = scene;
    this.dom = null;
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @return {DocumentFragment}
 */
FPSLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "fps";
    var p = document.createElement("p");
    section.appendChild(p);
    fragment.appendChild(section);
    this.dom = section;
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
FPSLayer.prototype.OnUpdate = function(e){
    var fps = Math.floor(Game.Locator.locate(Game).fps.currentFPS * 100) / 100;
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.children[0].innerText = fps;
    }.bind(this)));
};

/**
 * @param {ExEvent} e The event object.
 */
FPSLayer.prototype.OnEnter = function(e){
};

/**
 * @param {ExEvent} e The event object.
 */
FPSLayer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};
