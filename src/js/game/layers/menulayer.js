"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var MenuLayer = function(scene){
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
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
MenuLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    section.className = "menu";
    var h1 = document.createElement("h1");
    h1.innerText = "Menu";
    section.appendChild(h1);
    this.dom = section;
    fragment.appendChild(section);
    if (this.dom) {
        var domElement = /** @type {!Element} */ (this.dom);
        var self = this;
        [
            ["Play PlayCard Random", function(){publisher.Publish(Events.Race.OnPlayCard, self);}],
            ["Reset \uD83C\uDFAE", function(){publisher.Publish(Events.GameDirector.OnResetGame, self);}],
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
MenuLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
MenuLayer.prototype.OnExit = function(e){
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
