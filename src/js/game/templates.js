"use strict";

/**
 * @constructor
 */
var Templates = function(){
    this.loader = new DictLoader(/** @dict */{
        "titlescenelayer": "<section class='title'><h1>{{title}}</h1><button>{{start}}</button></section>",
    });
};

/**
 * @param {string} name .
 * @param {Object} namespace .
 * @return {DocumentFragment} .
 */
Templates.prototype.Generate = function(name, namespace){
    var template = this.loader.load(name);
    var tmp = document.createElement("template");
    tmp.innerHTML = template.generate(namespace);
    return tmp.content;
};
