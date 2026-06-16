"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var LogMessageLayer = function(scene){
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Element>} */
    this.messages = [];
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.GameDirector.OnLogMessage, this.OnLogMessage.bind(this), null],
    ];
    this.events.forEach(function(/** !Array<*> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};

/**
 * @return {DocumentFragment}
 */
LogMessageLayer.prototype.Render = function(){
    var templates = /** @type {!Templates} */ (Game.Locator.locate(Templates));
    var fragment = /** @type {!DocumentFragment} */ (templates.Generate("logmessagelayer", {
        title: "History",
    }));
    this.dom = /** @type {Element} */ ((/** @type {!ParentNode} */ (fragment)).children[0]);
    this.messages = /** @type {!Array<!Element>} */ (Array.prototype.slice.call((/** @type {!Element} */ ((/** @type {!ParentNode} */ (fragment)).children[0])).children, 1, 6));
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageLayer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        if(this.dom && this.dom.parentNode){
            this.dom.parentNode.removeChild(this.dom);
        }
    }.bind(this)));
    this.events.forEach(function(/** !Array<*> */ event){
        Game.Publisher.UnSubscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageLayer.prototype.OnLogMessage = function(e){
    var payload = /** @type {!Object<string,*>} */ (e.payload);
    var message = /** @type {string} */ (payload["message"]);
    for(var i = this.messages.length - 1; 0 < i; i--){
        this.messages[i].innerText = this.messages[i - 1].innerText;
    }
    this.messages[0].innerText = message;
};
