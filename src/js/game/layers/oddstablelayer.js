"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var OddsTableLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.Race.OnBet, this.OnBet.bind(this), null],
        [Events.Race.OnChanged, this.OnUpdate.bind(this), null],
    ];
    this.events.forEach(function(/** !Array<*> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};

/**
 * @return {DocumentFragment}
 */
OddsTableLayer.prototype.Render = function(){
    var templates = Game.Locator.locate(Templates);
    var fragment = templates.Generate("oddstablelayer", {
        title: "Odds Table",
    });
    this.dom = fragment.children[0];
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
OddsTableLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
OddsTableLayer.prototype.OnUpdate = function(e){
    var payload = e.payload;
    if(!payload || !payload.oddstable){
        return;
    }
    /** @type {OddsTable} */
    var oddstable = payload.oddstable;
    var templates = Game.Locator.locate(Templates);
    var newTable = templates.Generate("oddstable", {"oddstable": oddstable});
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        if(this.dom){
            var table = this.dom.children[1];
            if(table && table.parentNode) {
                table.parentNode.removeChild(table);
            }
            this.dom.appendChild(newTable);
        }
    }.bind(this)));
};

/**
 * @param {ExEvent} e The event object.
 */
OddsTableLayer.prototype.OnExit = function(e){
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
 * @param {ExEvent} e The event object.
 */
OddsTableLayer.prototype.OnBet = function(e){
    console.log(e);
};
