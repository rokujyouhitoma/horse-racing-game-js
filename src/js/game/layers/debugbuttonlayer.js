"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var DebugButtonLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.Debug.OnShowDebugMenu, this.OnShowDebugMenu.bind(this), null],
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
DebugButtonLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    section.className = "debugbutton";
    this.dom = section;
    fragment.appendChild(section);
    if (this.dom) {
        var domElement = /** @type {!Element} */ (this.dom);
        var self = this;
        [
            ["Debug", function(){publisher.Publish(Events.Debug.OnShowDebugMenu, self);}],
        ].map(function(/** !Array<*> */ value){
            var button = (new UIButton(/** @type {string} */ (value[0]))).DOM();
            button.addEventListener("click", /** @type {function(Event)} */ (value[1]));
            return button;
        }).forEach(function(/** !Element */ dom){
            domElement.appendChild(dom);
        });
    }
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
 * @param {ExEvent} e The event object.
 */
DebugButtonLayer.prototype.OnShowDebugMenu = function(e){
//    var sceneDirector = /** @type {!CustomSceneDirector} */ (Game.Locator.locate(CustomSceneDirector));
//    sceneDirector.Push(new GameScene("Debug"));
};
