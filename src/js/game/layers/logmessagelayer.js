"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var LogMessageLayer = function(scene){
    this.dom = null;
    this.messages = [];
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.GameDirector.OnLogMessage, this.OnLogMessage.bind(this), null],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @return {DocumentFragment}
 */
LogMessageLayer.prototype.Render = function(){
    var templates = Game.Locator.locate(Templates);
    var fragment = templates.Generate("logmessagelayer", {
        title: "History",
    });
    this.dom = fragment.children[0];
    this.messages = Array.prototype.slice.call(fragment.children[0].children, 1, 6);
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
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageLayer.prototype.OnLogMessage = function(e){
    var message = e.payload["message"];
    for(var i = this.messages.length - 1; 0 < i; i--){
        this.messages[i].innerText = this.messages[i - 1].innerText;
    }
    this.messages[0].innerText = message;
};
