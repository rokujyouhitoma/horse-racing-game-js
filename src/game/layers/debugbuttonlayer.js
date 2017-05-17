"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var DebugButtonLayer = function(scene){
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
 * @return {DocumentFragment}
 */
DebugButtonLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "debugbutton";
    this.dom = section;
    fragment.appendChild(section);
    var buttons = [
        ["Debug", function(){Game.Publisher.Publish(Events.Debug.OnShowDebugMenu, this);}],
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
DebugButtonLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
DebugButtonLayer.prototype.OnExit = function(e){
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
DebugButtonLayer.prototype.OnShowDebugMenu = function(e){
//    Game.SceneDirector.Push(new GameScene("Debug"));
};
