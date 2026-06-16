"use strict";

/**
 * @constructor
 */
var LaneRenderer = function(){};

/**
 * @param {Lane} lane The lane.
 * @return {!DocumentFragment} lane fragment.
 */
LaneRenderer.prototype.Render = function(lane){
    var color = /** @type {string} */ (lane.runner.model["color"]);
    var fragment = document.createDocumentFragment();

    var trackText = this.ToArray(lane).reverse().join("");
    fragment.appendChild(document.createTextNode(trackText));
    fragment.appendChild(document.createTextNode("|"));

    var span = document.createElement("span");
    span.style.backgroundColor = "#" + color;
    span.textContent = lane.number;
    fragment.appendChild(span);

    fragment.appendChild(document.createTextNode("|" + lane.position));

    return fragment;
};

/**
 * @param {Lane} lane The lane.
 * @return {Array<string>} lane strings.
 */
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
