"use strict";

/**
 * Note: Want to use Variable Event. but...Closure Compiler said...
 * > ERROR - Variable Event first declared in externs.zip//w3c_event.js
 * Therefor, Use Ex prefix.
 * @constructor
 */
var ExEvent = function(type, target, payload){
    this.type = type;
    this.target = target;
    this.payload = payload;
};

/**
 * Note: Want to use Variable Event. but...Closure Compiler said...
 * > ERROR - Variable EventTarget first declared in externs.zip//w3c_event.js
 * Therefor, Use Ex prefix.
 * @constructor
 */
var ExEventTarget = function(){
    this.eventListeners = {};
};

ExEventTarget.prototype.addEventListener = function(type, listener, receiver){
    if(!(type in this.eventListeners)){
        this.eventListeners[type] = [];
    }
    var wrapper = function(e) {
        if (typeof listener.handleEvent != 'undefined') {
            listener.handleEvent(e);
        } else {
            listener.call(this, e);
        }
    }.bind(this);
    this.eventListeners[type].push({
        object: this,
        type: type,
        listener: listener,
        receiver: receiver,
        wrapper: wrapper
    });
};

ExEventTarget.prototype.removeEventListener = function(type, listener, receiver){
    if(!(type in this.eventListeners)){
        return;
    }
    var eventListeners = this.eventListeners[type];
    var counter = 0;
    while(counter < eventListeners.length){
        var eventListener = eventListeners[counter];
        if (eventListener.object == this &&
            eventListener.type == type &&
            eventListener.listener == listener &&
            eventListener.receiver == receiver){
            eventListeners.splice(counter, 1);
            break;
        }
        else {
            console.log("not match");
        }
        ++counter;
    }
};

/**
 * @param {string|ExEvent} type The Event type.
 * @param {Object|null} receiver The receiver object.
 * @param {Object|null} payload The payload object.
 */
ExEventTarget.prototype.dispatchEvent = function(type, receiver, payload){
    if(!(type in this.eventListeners)){
        return;
    }
    var eventListeners = this.eventListeners[type];
    var counter = 0;
    while(counter < eventListeners.length){
        var eventListener = eventListeners[counter];
        if (eventListener.object == this &&
            eventListener.type == type &&
            (!receiver || receiver === eventListener.receiver)){
            if(type instanceof ExEvent){
                type.target = this;
                type.payload = payload;
                eventListener.wrapper(type);
            } else {
                eventListener.wrapper(new ExEvent(type, this, payload));
            }
        }
        ++counter;
    }
};

/**
 * Note: Want to use Variable Event. but...Closure Compiler said...
 * > ERROR - Variable EventListener first declared in externs.zip//w3c_event.js
 * Therefor, Use Ex prefix.
 * @constructor
 */
var ExEventListener = function(callback){
    this.callback = callback;
};

ExEventListener.prototype.handleEvent = function(event){
    this.callback(event);
};
