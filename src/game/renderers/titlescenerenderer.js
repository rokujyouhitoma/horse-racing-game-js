"use strict";

/**
 * @constructor
 */
var TitleSceneRenderer = function(scene){
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
 * @param {ExEvent} e The event object.
 */
TitleSceneRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "";
        var h1 = document.createElement("h1");
        h1.innerText = "\uD83C\uDFC7 -> \uD83C\uDFAE";
        section.appendChild(h1);
        var button = document.createElement("button");
        button.innerText = "Start \uD83C\uDFC7";
        button.addEventListener("click", this.onClickListener);
        section.appendChild(button);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
TitleSceneRenderer.prototype.OnExit = function(e){
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
TitleSceneRenderer.prototype.OnClick = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnNewRace, this);
};
