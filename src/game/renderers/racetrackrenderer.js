"use strict";

/**
 * @constructor
 */
var LaneRenderer = function(){};

LaneRenderer.prototype.Render = function(dictionary){
    var lane = dictionary["lane"];
    var color = lane.runner.model["color"];
    return [
        this.ToArray(lane).reverse().join(""),
        ["<span style='background-color:#", color, ";'>", lane.number, "</span>"].join(""),
        lane.position,
    ].join("|");
};

LaneRenderer.prototype.ToArray = function(lane){
    var array = [];
    var length = lane.len;
    for(var i=0; i < length + 1; i++){
        array.push((lane.position === i) ? LaneRenderer.CurrentPosition : LaneRenderer.EmptyPosition);
    }
    return array;
};

LaneRenderer.CurrentPosition = "\uD83C\uDFC7"; //Unicode Character 'HORSE RACING' (U+1F3C7)
LaneRenderer.EmptyPosition = "_";

/**
 * @constructor
 */
var RacetrackRenderer = function(scene){
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
 * @param {ExEvent} e The event object.
 */
RacetrackRenderer.prototype.OnUpdate = function(e){
    var game = Game.Locator.locate(GameDirector);
    //TODO: xxx
    if(!game.race){
        return;
    }
    //TODO: innerHTMLは手抜き。createElementによるDOM操作が望ましい
    this.dom.children[1].innerHTML = this.Render({
        "racetrack": game.race.gameBoard.racetrack,
    });
};

/**
 * @param {ExEvent} e The event object.
 */
RacetrackRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "racetrack";
        var h1 = document.createElement("h1");
        h1.innerText = "Racetrack";
        section.appendChild(h1);
        var div = document.createElement("div");
        section.appendChild(div);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
RacetrackRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

RacetrackRenderer.prototype.Render = function(dictionary){
    var laneRenderer = new LaneRenderer();
    var racetrack = dictionary["racetrack"];
    var lanes = racetrack.lanes;
    var text = [
        lanes.reduce(function(a, b, index){
            if(index == 1){
                return [a, b].map(function(lane){
                    return laneRenderer.Render({"lane": lane});
                }).join("<br />");
            }
            return [a, laneRenderer.Render({"lane": b})].join("<br />");
        })
    ].join("");
    return text;
};
