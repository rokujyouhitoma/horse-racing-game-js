"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var OddsTableLayer = function(scene){
    this.dom = null;
    this.scene = scene;
};

/**
 * @return {DocumentFragment}
 */
OddsTableLayer.prototype.Render = function(){
    var templates = Game.Locator.locate(Templates);
    var fragment = templates.Generate("oddstablelayer", {
        title: "Odds Table",
    });
    this.dom = fragment.children[0];
    return fragment;
};
