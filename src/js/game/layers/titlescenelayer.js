"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var TitleSceneLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    this.events.forEach(function(/** !Array<*> */ event){
        publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
    /** @type {function(Event)} */
    this.onClickListener = this.OnClick.bind(this);
};

/**
 * @return {DocumentFragment} document fragment.
 */
TitleSceneLayer.prototype.Render = function(){
    var templates = /** @type {!Templates} */ (Game.Locator.locate(Templates));
    var fragment = /** @type {!DocumentFragment} */ (templates.Generate("titlescenelayer", {
        title: "\uD83C\uDFC7 -> \uD83C\uDFAE",
        start: "Start \uD83C\uDFC7",
    }));
    this.dom = /** @type {Element} */ ((/** @type {!ParentNode} */ (fragment)).children[0]);
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
TitleSceneLayer.prototype.OnEnter = function(e){
    if (this.dom) {
        var child = /** @type {!Element} */ (this.dom.children[1]);
        child.addEventListener("click", this.onClickListener);
    }
};

/**
 * @param {ExEvent} e The event object.
 */
TitleSceneLayer.prototype.OnExit = function(e){
    if(this.dom && this.dom.children && this.dom.children[1]){
        var child = /** @type {!Element} */ (this.dom.children[1]);
        child.removeEventListener("click", this.onClickListener);
    }
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        if(this.dom && this.dom.parentNode){
            this.dom.parentNode.removeChild(this.dom);
        }
    }.bind(this)));
    var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    this.events.forEach(function(/** !Array<*> */ event){
        publisher.UnSubscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};

/**
 * @param {Event} e Type event object.
 */
TitleSceneLayer.prototype.OnClick = function(e){
    var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    publisher.Publish(Events.GameDirector.OnToRaceScene, this);
};
