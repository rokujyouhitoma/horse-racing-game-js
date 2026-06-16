"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var RacetrackLayer = function(scene){
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.Race.OnChanged, this.OnUpdate.bind(this), null],
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
};

/**
 * @return {DocumentFragment}
 */
RacetrackLayer.prototype.Render = function(){
    var templates = Game.Locator.locate(Templates);
    var fragment = templates.Generate("racetracklayer", {
        title: "Racetrack",
    });
    this.dom = fragment.children[0];
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
RacetrackLayer.prototype.OnUpdate = function(e){
    var payload = e.payload;
    if(!payload || !payload.racetrack){
        return;
    }
    /** @type {Racetrack} */
    var racetrack = payload.racetrack;
    if (this.dom) {
        var container = /** @type {!Element} */ (this.dom.children[1]);
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
        container.appendChild(this.DOM(racetrack));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
RacetrackLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
RacetrackLayer.prototype.OnExit = function(e){
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
 * @param {Racetrack} racetrack The racetrack.
 * @return {DocumentFragment} lanes fragment.
 */
RacetrackLayer.prototype.DOM = function(racetrack){
    var laneRenderer = new LaneRenderer();
    /** @type {Array<Lane>} */
    var lanes = racetrack.lanes;
    var fragment = document.createDocumentFragment();
    lanes.forEach(function(lane, index){
        if(index > 0){
            fragment.appendChild(document.createElement("br"));
        }
        fragment.appendChild(laneRenderer.Render(lane));
    });
    return fragment;
};
