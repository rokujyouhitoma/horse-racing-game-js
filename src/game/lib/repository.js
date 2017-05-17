"use strict";

/**
 * @constructor
 */
var Repository = function(){
    this.storage = {};
};

/**
 * @param {string} key The key.
 * @param {Object} value The value.
 */
Repository.prototype.Store = function(key, value){
    this.storage[key] = value;
};

/**
 * @param {string} key The key.
 * @return {Object} object.
 */
Repository.prototype.Find = function(key){
    return this.storage[key];
};

/**
 * @return {Array<Object>} values.
 */
Repository.prototype.All = function(){
    return Object.values(this.storage);
};
