"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var MenuLayer = function(scene){
    this.dom = null;
    this.events = [
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
MenuLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "menu";
    var h1 = document.createElement("h1");
    h1.innerText = "Menu";
    section.appendChild(h1);
    this.dom = section;
    fragment.appendChild(section);
    var buttons = [
        ["Play PlayCard Random", function(){Game.Publisher.Publish(Events.Race.OnPlayCard, this);}],
        ["Reset \uD83C\uDFAE", function(){Game.Publisher.Publish(Events.GameDirector.OnResetGame, this);}],
    ].map(function(value){
        var button = (new UIButton(value[0])).DOM();
        button.addEventListener("click", value[1]);
        return button;
    }).forEach(function(dom){
        this.dom.appendChild(dom);
    }, this);
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
MenuLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
MenuLayer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};
