"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var RacetrackLayer = function(scene){
    this.dom = null;
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
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
    var raceDirector = Game.SceneDirector.CurrentScene().directors["RaceDirector"];
    if(!raceDirector){
        return;
    }
    var race = raceDirector.race;
    if(!race){
        return;
    }
    var container = this.dom.children[1];
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    container.appendChild(this.DOM(race.gameBoard.racetrack));
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
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
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
