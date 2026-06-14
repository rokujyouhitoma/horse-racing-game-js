"use strict";

/**
 * @constructor
 * @param {!Map<string|Function, Object>} container The container.
 */
var Locator = function(container){
    this.container = container;
};

/**
 * @param {Function} obj The object class.
 * @return {Object} The instantiated object.
 */
Locator.prototype.locate = function(obj){
    if(!this.container.has(obj)){
        this.container.set(obj, new obj());
    }
    return this.container.get(obj);
};
