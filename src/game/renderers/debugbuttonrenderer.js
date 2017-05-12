"use strict";

/**
 * @constructor
 */
var DebugButtonRenderer = function(scene){
    this.scene = scene;
    this.dom = null;
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.Debug.OnShowDebugMenu, this.OnShowDebugMenu.bind(this), null],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
DebugButtonRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = this.scene.name.toLowerCase() + " " + "debugbutton";
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
    var buttons = [
        ["Debug", function(){Game.Publisher.Publish(Events.Debug.OnShowDebugMenu, this);}],
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
DebugButtonRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

DebugButtonRenderer.prototype.OnShowDebugMenu = function(e){
    Game.SceneDirector.Push(new GameScene("Debug"));
};
