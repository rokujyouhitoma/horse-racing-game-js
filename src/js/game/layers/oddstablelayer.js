"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var OddsTableLayer = function(scene){
    this.scene = scene;
    this.dom = null;
    this.events = [
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
OddsTableLayer.prototype.OnEnter = function(e){
    var raceDirector = Game.SceneDirector.CurrentScene().directors["RaceDirector"];
    if(!raceDirector){
        return;
    }
    var race = raceDirector.race;
    if(!race){
        return;
    }
    var oddstable = race.gameBoard.oddstable;
    console.log(oddstable);
    var table = this.dom.children[1];
    var templates = Game.Locator.locate(Templates);
    var new_table = templates.Generate("oddstable", {"oddstable": oddstable});
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        table.parentNode.removeChild(table);
        this.dom.appendChild(new_table);
    }.bind(this)));
};

/**
 * @param {ExEvent} e The event object.
 */
OddsTableLayer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};
