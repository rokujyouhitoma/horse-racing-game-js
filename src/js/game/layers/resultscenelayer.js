"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var ResultSceneLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(/** !Array<*> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
    /** @type {function(Event)} */
    this.onClickListener = this.OnClick.bind(this);
};

/**
 * @return {DocumentFragment} document fragment.
 */
ResultSceneLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "layer result";
    var h1 = document.createElement("h1");
    h1.innerText = "\uD83C\uDFC7 Result";
    section.appendChild(h1);
    var content = this.scene.content;
    if(content && content["odds"]){
        var p = document.createElement("p");
        p.innerText = "odds: " + content["odds"];
        section.appendChild(p);
    }
    if(content && content["placings"]){
        var placings = /** @type {!Array<!HorseFigure>} */ (content["placings"]);
        var p = document.createElement("p");
        p.innerText = placings.map(function(/** !HorseFigure */ horse){
            return horse.lane.number;
        }).join("-");
        section.appendChild(p);
        placings.forEach(function(/** !HorseFigure */ horse, index){
            var p = document.createElement("p");
            p.innerText = (index+1) + ": " + (/** @type {!Object<string,*>} */ (horse.model))["type"];
            section.appendChild(p);
        });
    }
    var button = document.createElement("button");
    button.innerText = "Next \uD83C\uDFC7";
    button.addEventListener("click", this.onClickListener);
    section.appendChild(button);
    fragment.appendChild(section);
    //modal
    var modal = (new UIModal()).DOM();
    modal.className = "modal";
    fragment.appendChild(modal);
    this.dom = section;
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
ResultSceneLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
ResultSceneLayer.prototype.OnExit = function(e){
    if(this.dom && this.dom.children && this.dom.children[1]){
        this.dom.children[1].removeEventListener("click", this.onClickListener);
    }
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
 * @param {Event} e Type event object.
 */
ResultSceneLayer.prototype.OnClick = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnToRaceScene, this);
};
