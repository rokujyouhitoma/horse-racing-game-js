"use strict";

/**
 * @constructor
 * @param {RegExp} regex A regular expression object.
 * @param {function(string)} callback A function object.
 */
var Matcher = function(regex, callback){
    this.regex_ = regex;
    this.callback_ = callback;
};

/** 
 * @param {string} query A query string.
 * @return {boolean} match or not.
 */
Matcher.prototype.Match = function(query){
    return this.regex_.test(query);
};

/**
 * @param {string} query A query string.
 */
Matcher.prototype.Call = function(query){
    this.callback_(query);
};

/**
 * @constructor
 */
var Router = function(){
    /** @type {Array<Matcher>} */
    this.matchers_ = [];
};

/**
 * @param {Matcher} matcher A matcher.
 */
Router.prototype.Register = function(matcher){
    this.matchers_.push(matcher);
};

/**
 * @param {Array<Matcher>} matchers A matchers array.
 */
Router.prototype.Registers = function(matchers){
    matchers.forEach(function(matcher){
        this.Register(matcher);
    }, this);
};

/**
 * @param {string} query A query string.
 */
Router.prototype.Route = function(query){
    var matchers = this.matchers_;
    var length = matchers.length;
    var matched = false;
    for(var i = 0; i < length; i++){
        var matcher = matchers[i];
        if(matcher.Match(query)){
            matcher.Call(query);
            matched = true;
            break;
        }
    }
    if(!matched){
        console.info("Not matched. query: " + query);
    }
};
