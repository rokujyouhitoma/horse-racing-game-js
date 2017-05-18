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

/**
 * @constructor
 */
var UICheckbox = function(){};

/**
 * @return {Element} The button element.
 */
UICheckbox.prototype.DOM = function(){
    var dom = document.createElement("input");
    dom.type = "checkbox";
    return dom;
};

/**
 * @constructor
 * @param {string} label The label.
 */
var UICustomCheckbox = function(label){
    this.label = label;
};

/**
 * @return {Element} The button element.
 */
UICustomCheckbox.prototype.DOM = function(){
    var dom = document.createElement("label");
    var checkbox = (new UICheckbox).DOM();
    dom.appendChild(checkbox);
    var span = document.createElement("span");
    span.innerText = this.label;
    dom.appendChild(span);
    return dom;
};

/**
 * @constructor
 */
var UIModal = function(){};

/**
 * @return {Element} The button element.
 */
UIModal.prototype.DOM = function(){
    var dom = document.createElement("div");
    return dom;
};
