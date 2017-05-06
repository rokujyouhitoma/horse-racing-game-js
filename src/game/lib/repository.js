"use strict";

/**
 * @constructor
 */
var Repository = function(){
    this.storage = {};
};

Repository.prototype.Store = function(key, value){
    this.storage[key] = value;
};

Repository.prototype.Find = function(key){
    return this.storage[key];
};

Repository.prototype.All = function(){
    return Object.values(this.storage);
};
