"use strict";

/**
 * For debug.
 * @constructor
 */
var RelationshipChecker = function(){};
RelationshipChecker.prototype = new GameObject();

RelationshipChecker.Conditions = {
    Equal: "Equal",
};

RelationshipChecker.prototype.Check = function(modelName){
    var masterData = Game.Locator.locate(MasterData);
    var meta = masterData.GetMeta(modelName);
    if(!(meta["relationships"])){
        return;
    }
    var relationships = meta["relationships"];
    var errorMessages = [];
    relationships.forEach(function(relationship){
        var from_rows = masterData.Get(modelName)
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
                from_rows = from_rows.filter(function(row){
                    if(condition === RelationshipChecker.Conditions.Equal){
                        return row[index] === value;
                    }
                    return false;
                });
            });
        }
        var from = relationship["from"];
        var from_name = from["name"];
        var from_index = meta.names.findIndex(function(v){
            return v === from_name;
        });
        var to = relationship["to"];
        var to_object = to["object"]
        var to_name = to["name"];
        var to_index = meta.names.findIndex(function(v){
            return v === to_name;
        });
        var to_rows = masterData.Get(to_object);
        var to_map = {};
        to_rows.forEach(function(row){
            var key = row[to_index];
            to_map[key] = row;
        });
        from_rows.forEach(function(row){
            var value = row[from_index];
            if(!(value in to_map)){
                errorMessages.push(["RelationshipChecker Error:",
                                    " from: ", modelName, ".", from_name,
                                    " value=", value,
                                    " to: ", to_object, ".", to_name].join(""));
            }
        })
    });
    if(0 < errorMessages.length){
        errorMessages.forEach(function(message){
            console.error(message)
        });
    } else {
        Game.Log("RelationshipChecker: ok");
    }
};

RelationshipChecker.prototype.CheckAll = function(modelNames){
    modelNames.forEach(function(modelName){
        this.Check(modelName);
    }, this);
};

// TODO: xxx
// For debug.
(new RelationshipChecker()).CheckAll([
    "HorseFigure",
    "MonsterCoin",
    "MonsterFigure",
    "Race",
    "PlayCard",
    "StepCard",
    "RankCard",
    "DashCard",
]);
