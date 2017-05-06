"use strict";

/**
 * @constructor
 */
var Locator = function(container){
    this.container = container;
};

Locator.prototype.create = function(obj){
    if(!(obj in this.container)){
        this.container[obj] = new obj();
    }
    return this.container[obj];
};
