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

/**
 * For debug.
 * @constructor
 * @extends {GameObject}
 */
var ValueChecker = function(){
    GameObject.call(this);
};
inherits(ValueChecker, GameObject);

/**
 * @param {string} modelName A model name.
 */
ValueChecker.prototype.Check = function(modelName){
    var masterData = Game.Locator.locate(MasterData);
    var meta = masterData.GetMeta(modelName);
    if(!(meta["validations"])){
        return;
    }
    var validations = meta["validations"];
    var rows = masterData.Get(modelName);
    var errorMessages = [];

    rows.forEach(function(row){
        meta.names.forEach(function(colName, colIdx){
            var rawValue = row[colIdx];
            var type = meta.types[colIdx];
            var value = Model.Cast(type, rawValue);
            var validation = validations[colName];
            if(!validation){
                return;
            }

            // 1. Min validation (for numeric fields)
            if("min" in validation){
                if(typeof value !== "number" || value < validation["min"]){
                    errorMessages.push(["ValueChecker Error: ", modelName, ".", colName,
                                        " value=", value, " is less than min=", validation["min"]].join(""));
                }
            }

            // 2. Non-empty string validation
            if("nonEmpty" in validation && validation["nonEmpty"]){
                if(typeof value !== "string" || value.trim() === ""){
                    errorMessages.push(["ValueChecker Error: ", modelName, ".", colName,
                                        " value is empty"].join(""));
                }
            }

            // 3. Regex validation (for string format)
            if("regex" in validation){
                var regex = new RegExp(validation["regex"]);
                if(typeof value !== "string" || !regex.test(value)){
                    errorMessages.push(["ValueChecker Error: ", modelName, ".", colName,
                                        " value=", value, " does not match regex=", validation["regex"]].join(""));
                }
            }

            // 4. Allowed list validation (in: Array)
            if("in" in validation){
                var allowed = validation["in"];
                if(allowed.indexOf(value) === -1){
                    errorMessages.push(["ValueChecker Error: ", modelName, ".", colName,
                                        " value=", value, " is not in allowed list=", JSON.stringify(allowed)].join(""));
                }
            }
        });
    });

    if(0 < errorMessages.length){
        errorMessages.forEach(function(message){
            console.error(message);
        });
    } else {
        Game.Log(["ValueChecker: ", modelName, " ok"].join(""));
    }
};

/**
 * @param {Array<string>} modelNames The model names.
 */
ValueChecker.prototype.CheckAll = function(modelNames){
    modelNames.forEach(function(modelName){
        this.Check(modelName);
    }, this);
};
