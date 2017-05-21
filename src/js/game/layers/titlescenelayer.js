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
    var templates = Game.Locator.locate(Templates);
    var fragment = templates.Generate("titlescenelayer", {
        title: "\uD83C\uDFC7 -> \uD83C\uDFAE",
        start: "Start \uD83C\uDFC7",
    });
    fragment.children[0].children[1].addEventListener("click", this.onClickListener);
    this.dom = fragment.children[0];
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
