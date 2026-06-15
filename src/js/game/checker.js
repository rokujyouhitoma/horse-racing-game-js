"use strict";

/**
 * For debug.
 * @constructor
 * @extends {GameObject}
 */
var RelationshipChecker = function(){
    GameObject.call(this);
};
inherits(RelationshipChecker, GameObject);

RelationshipChecker.Conditions = {
    Equal: "Equal",
};

/**
 * @param {string} modelName A model name.
 */
RelationshipChecker.prototype.Check = function(modelName){
    var masterData = Game.Locator.locate(MasterData);
    var meta = masterData.GetMeta(modelName);
    if(!(meta["relationships"])){
        return;
    }
    var relationships = meta["relationships"];
    var errorMessages = [];
    relationships.forEach(function(relationship){
        var fromRows = masterData.Get(modelName);
        if("filters" in relationship){
            var filters = relationship["filters"];
            filters.forEach(function(filter){
                if(!("name" in filter)){
                    return;
                }
                if(!("value" in filter)){
                    return;
                }
                var condition = filter["condition"];
                var name = filter["name"];
                var value = filter["value"];
                var index = meta.names.findIndex(function(v){
                    return v === name;
                });
                fromRows = fromRows.filter(function(row){
                    if(condition === RelationshipChecker.Conditions.Equal){
                        return row[index] === value;
                    }
                    return false;
                });
            });
        }
        var from = relationship["from"];
        var fromName = from["name"];
        var fromIndex = meta.names.findIndex(function(v){
            return v === fromName;
        });
        var to = relationship["to"];
        var toObject = to["object"];
        var toName = to["name"];
        var toIndex = meta.names.findIndex(function(v){
            return v === toName;
        });
        var toRows = masterData.Get(toObject);
        var toMap = {};
        toRows.forEach(function(row){
            var key = row[toIndex];
            toMap[key] = row;
        });
        fromRows.forEach(function(row){
            var value = row[fromIndex];
            if(!(value in toMap)){
                errorMessages.push(["RelationshipChecker Error:",
                                    " from: ", modelName, ".", fromName,
                                    " value=", value,
                                    " to: ", toObject, ".", toName].join(""));
            }
        });
    });
    if(0 < errorMessages.length){
        errorMessages.forEach(function(message){
            console.error(message);
        });
    } else {
        Game.Log("RelationshipChecker: ok");
    }
};

/**
 * @param {Array<string>} modelNames The model names.
 */
RelationshipChecker.prototype.CheckAll = function(modelNames){
    modelNames.forEach(function(modelName){
        this.Check(modelName);
    }, this);
};
