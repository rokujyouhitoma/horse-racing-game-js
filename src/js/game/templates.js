"use strict";

/**
 * @constructor
 */
var Templates = function(){
    this.loader = new DictLoader(/** @dict */{
        "baselayer": "{% block layer %}" +
            "<section class='{{__layer__}}'>" +
            "{% block title %}<h1>{{title}}</h1>{% end %}" +
            "{% block content%}{% end %}" +
            "</section>" +
            "{% end %}",
        "titlescenelayer": "{% extends 'baselayer' %}" +
            "{% block content %}" +
            "<button>{{start}}</button>" +
            "{% end %}",
        "racetracklayer": "{% extends 'baselayer' %}" +
            "{% block content %}" +
            "<div></div>" +
            "{% end %}",
        "oddstablelayer": "{% extends 'baselayer' %}" +
            "{% block content %}" +
            "<div></div>" +
            "{% end %}",
        "fpslayer": "{% extends 'baselayer' %}" +
            "{% block title %}{% end %}" +
            "{% block content %}" +
            "<p></p>" +
            "{% end %}",
    });
};

/**
 * @param {string} name .
 * @param {Object} namespace .
 * @return {DocumentFragment} .
 */
Templates.prototype.Generate = function(name, namespace){
    var template = this.loader.load(name);
    namespace["__layer__"] = name;
    var tmp = document.createElement("template");
    tmp.innerHTML = template.generate(namespace);
    return tmp.content;
};
