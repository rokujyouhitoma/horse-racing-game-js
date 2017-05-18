"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var TitleSceneLayer = function(scene){
    this.scene = scene;
    this.dom = null;
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
    this.onClickListener = this.OnClick.bind(this);
};

/**
 * @return {DocumentFragment} document fragment.
 */
TitleSceneLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "title";
    var h1 = document.createElement("h1");
    h1.innerText = "\uD83C\uDFC7 -> \uD83C\uDFAE";
    section.appendChild(h1);
    var button = document.createElement("button");
    button.innerText = "Start \uD83C\uDFC7";
    button.addEventListener("click", this.onClickListener);
    section.appendChild(button);
    fragment.appendChild(section);
    this.dom = section;
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
TitleSceneLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
TitleSceneLayer.prototype.OnExit = function(e){
    this.dom.children[1].removeEventListener("click", this.onClickListener);
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {Event} e Type event object.
 */
TitleSceneLayer.prototype.OnClick = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnToRaceScene, this);
};
