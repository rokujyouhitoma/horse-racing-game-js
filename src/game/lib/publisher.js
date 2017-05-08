"use strict";

/**
 * @constructor
 */
var Publisher = function(){
    this.targets = {};
};

Publisher.prototype.GetOrCreateTarget = function(key){
    if(!(key in this.targets)){
        this.targets[key] = new ExEventTarget();
    }
    return this.targets[key];
};

Publisher.prototype.Subscribe = function(type, listener, publisher){
    this.GetOrCreateTarget(type).addEventListener(type, listener, publisher);
};

Publisher.prototype.UnSubscribe = function(type, listener, publisher){
    this.GetOrCreateTarget(type).removeEventListener(type, listener, publisher);
};

Publisher.prototype.Publish = function(type, publisher, payload){
//    console.log("[Event]: " + type);
    this.GetOrCreateTarget(type).dispatchEvent(type, publisher, payload);
};
