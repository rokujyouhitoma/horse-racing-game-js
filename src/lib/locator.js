"use strict";

/**
 * @constructor
 * @param {Object<string|Function, Object>} container The container.
 */
var Locator = function(container){
    this.container = container;
};

/**
 * @param {Function} obj The object class.
 * @return {Object} The instantiated object.
 */
Locator.prototype.create = function(obj){
    if(!(obj in this.container)){
        // TODO: key using Function objct...
        this.container[obj] = new obj();
    }
    return this.container[obj];
};
