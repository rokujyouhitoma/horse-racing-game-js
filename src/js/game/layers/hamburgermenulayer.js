"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var HamburgerMenuLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
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
    /** @type {function(Event)} */
    this.outsideClickListener = this.OnOutsideClick.bind(this);
};

/**
 * @return {DocumentFragment}
 */
HamburgerMenuLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "hamburger-menu";
    
    var button = document.createElement("button");
    button.className = "hamburger-button";
    button.innerText = "\u2261"; // "≡"
    section.appendChild(button);
    
    var dropdown = document.createElement("div");
    dropdown.className = "hamburger-dropdown";
    
    var debugItem = document.createElement("button");
    debugItem.className = "hamburger-item";
    debugItem.innerText = "Debug";
    dropdown.appendChild(debugItem);
    
    section.appendChild(dropdown);
    this.dom = section;
    fragment.appendChild(section);
    
    var self = this;
    
    button.addEventListener("click", function(/** Event */ e){
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });
    
    debugItem.addEventListener("click", function(/** Event */ e){
        e.stopPropagation();
        var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
        publisher.Publish(Events.Debug.OnShowDebugMenu, self);
        dropdown.classList.remove("show");
    });
    
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
HamburgerMenuLayer.prototype.OnEnter = function(e){
    document.addEventListener("click", this.outsideClickListener);
};

/**
 * @param {ExEvent} e The event object.
 */
HamburgerMenuLayer.prototype.OnExit = function(e){
    document.removeEventListener("click", this.outsideClickListener);
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
 * @param {Event} e The event object.
 */
HamburgerMenuLayer.prototype.OnOutsideClick = function(e){
    if (this.dom) {
        var dropdown = this.dom.querySelector(".hamburger-dropdown");
        if (dropdown && dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
        }
    }
};
