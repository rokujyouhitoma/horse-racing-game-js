"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var FPSLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
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
};

/**
 * @return {DocumentFragment}
 */
FPSLayer.prototype.Render = function(){
    var templates = /** @type {!Templates} */ (Game.Locator.locate(Templates));
    var fragment = /** @type {!DocumentFragment} */ (templates.Generate("fpslayer", {}));
    this.dom = /** @type {Element} */ ((/** @type {!ParentNode} */ (fragment)).children[0]);
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
FPSLayer.prototype.OnUpdate = function(e){
    var gameObj = /** @type {!Game} */ (Game.Locator.locate(Game));
    var fps = Math.floor((/** @type {!FPS} */ (gameObj.fps)).currentFPS * 100) / 100;
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        if(this.dom && this.dom.children && this.dom.children[0]){
            this.dom.children[0].innerText = fps;
        }
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
