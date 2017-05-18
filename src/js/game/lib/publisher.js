"use strict";

/**
 * @constructor
 */
var Publisher = function(){
    this.targets = {};
};

/**
 * @param {string} key The key.
 * @return {ExEventTarget} the ExEventTarget.
 */
Publisher.prototype.GetOrCreateTarget = function(key){
    if(!(key in this.targets)){
        this.targets[key] = new ExEventTarget();
    }
    return this.targets[key];
};

/**
 * @param {string} type The event type.
 * @param {function(ExEvent)} listener The event listener function.
 * @param {Object} publisher The publisher object.
*/
Publisher.prototype.Subscribe = function(type, listener, publisher){
    this.GetOrCreateTarget(type).addEventListener(type, listener, publisher);
};

/**
 * @param {string} type The event type.
 * @param {function(ExEvent)} listener The event listener function.
 * @param {Object} publisher The publisher object.
 */
Publisher.prototype.UnSubscribe = function(type, listener, publisher){
    this.GetOrCreateTarget(type).removeEventListener(type, listener, publisher);
};

/**
 * @param {string} type The Event type.
 * @param {Object=} opt_publisher The publisher object (optional).
 * @param {Object=} opt_payload The payload object (optional).
 */
Publisher.prototype.Publish = function(type, opt_publisher, opt_payload){
//    console.log("[Event]: " + type);
    this.GetOrCreateTarget(type).dispatchEvent(type, opt_publisher, opt_payload);
};
