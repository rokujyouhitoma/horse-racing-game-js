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
            "<table>" +
            "<tbody>" +
            "<tr><th>xxx</th></tr>" +
            "</tbody>" +
            "</table>" +
            "{% end %}",
        "fpslayer": "{% extends 'baselayer' %}" +
            "{% block title %}{% end %}" +
            "{% block content %}" +
            "<p></p>" +
            "{% end %}",
        "logmessagelayer": "{% extends 'baselayer' %}" +
            "{% block content %}" +
            "<p>\uD83C\uDFC7</p>" +
            "<p>\uD83C\uDFC7</p>" +
            "<p>\uD83C\uDFC7</p>" +
            "<p>\uD83C\uDFC7</p>" +
            "<p>\uD83C\uDFC7</p>" +
            "{% end %}",
        "oddstable": "<table><tbody>" +
            "{% set var table = oddstable.table; %}" +
            "<tr>" +
            "  <th></th>" +
            "  <th>2</th>" +
            "  <th>3</th>" +
            "  <th>4</th>" +
            "  <th>5</th>" +
            "</tr>" +
            "{% set var length = table.length; %}" +
            "{% for (var i = 0; i < length; i++) %}" +
            "  {% set var row = table[i]; %}" +
            "  {% if (!row) %}" +
            "    {% continue %}" +
            "  {% end %}" +
            "<tr>" +
            "  <th>{{i}}</th>" +
            "  {% for (var j = 2; j < row.length; j++) %}" +
            "    {% set var obj = row[j]; %}" +
            "    {% if (obj) %}" +
            "      {% set var odds = obj['odds']; %}" +
            "      <td onclick='(function(){Game.Publisher.Publish(Events.Race.OnBet, this, {\"odds_id\": {{odds.model['id']}}})})()'>x {{odds.model['id']}}</td>" +
            "    {% else %}" +
            "      <td></td>" +
            "    {% end %}" +
            "  {% end %}" +
            "</tr>" +
            "{% end %}" +
            "</tbody></table>",
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
    return Templates.GenerateFragment(template, namespace);
};

/**
 * @param {Template} template .
 * @param {Object} namespace .
 * @return {DocumentFragment} .
 */
Templates.GenerateFragment = function(template, namespace) {
    var tmp = document.createElement("template");
    tmp.innerHTML = template.generate(namespace);
    return tmp.content;
};
