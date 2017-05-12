"use strict";

/**
 * @constructor
 */
var MenuRenderer = function(scene){
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
 * @param {ExEvent} e The event object.
 */
MenuRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "menu";
        var h1 = document.createElement("h1");
        h1.innerText = "Menu";
        section.appendChild(h1);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
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
};

/**
 * @param {ExEvent} e The event object.
 */
MenuRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};
