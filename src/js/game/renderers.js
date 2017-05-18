"use strict";

/**
 * @constructor
 * @param {IScene} scene The scene.
 * @param {Array<ILayer>} layers The Layer array.
 */
var RenderLayers = function(scene, layers){
    this.scene = scene;
    this.layers = layers;
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "scene " + scene.name.toLowerCase();
    layers.forEach(function(layer){
        section.appendChild(layer.Render());
    });
    fragment.appendChild(section);
    this.dom = section;
    this.fragment = fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
RenderLayers.prototype.OnEnter = function(e){
    var fragment = this.fragment;
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(fragment);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
RenderLayers.prototype.OnExit = function(e){
    this.dom.parentNode.removeChild(this.dom);    
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};
