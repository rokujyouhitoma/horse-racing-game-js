"use strict";

/**
 * @constructor
 * @param {string} label The label.
 */
var UIButton = function(label){
    this.label = label;
};

/**
 * @return {Element} The button element.
 */
UIButton.prototype.DOM = function(){
    var button = document.createElement("button");
    button.innerText = this.label;
    return button;
};
