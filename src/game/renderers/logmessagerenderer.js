"use strict";

/**
 * @constructor
 */
var LogMessageRenderer = function(scene){
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
 * @param {ExEvent} e The event object.
 */
LogMessageRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "history";
        var h1 = document.createElement("h1");
        h1.innerText = "History";
        section.appendChild(h1);
        for(var i =0; i < 5; i++){
            var p = document.createElement("p");
            p.innerText = "\uD83C\uDFC7";
            this.messages.push(p);
            section.appendChild(p);
        }
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageRenderer.prototype.OnExit = function(e){
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
LogMessageRenderer.prototype.OnLogMessage = function(e){
    var message = e.payload["message"];
    for(var i = this.messages.length - 1; 0 < i; i--){
        this.messages[i].innerText = this.messages[i - 1].innerText;
    }
    this.messages[0].innerText = message;
};
