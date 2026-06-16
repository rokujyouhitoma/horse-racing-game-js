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
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var meta = masterData.GetMeta(modelName);
    if(!(meta["relationships"])){
        return;
    }
    var relationships = /** @type {!Array<!Object<string,*>>} */ (meta["relationships"]);
    /** @type {!Array<string>} */
    var errorMessages = [];
    relationships.forEach(function(/** !Object<string,*> */ relationship){
        /** @type {!Array<!Array<string>>} */
        var fromRows = masterData.Get(modelName);
        if("filters" in relationship){
            var filters = /** @type {!Array<!Object<string,*>>} */ (relationship["filters"]);
            filters.forEach(function(/** !Object<string,*> */ filter){
                if(!("name" in filter)){
                    return;
                }
                if(!("value" in filter)){
                    return;
                }
                var condition = /** @type {string} */ (filter["condition"]);
                var name = /** @type {string} */ (filter["name"]);
                var value = filter["value"];
                var index = meta.names.findIndex(function(/** string */ v){
                    return v === name;
                });
                fromRows = /** @type {!Array<!Array<string>>} */ (fromRows.filter(function(/** !Array<string> */ row){
                    if(condition === RelationshipChecker.Conditions.Equal){
                        return /** @type {string} */ (row[index]) === value;
                    }
                    return false;
                }));
            });
        }
        var from = /** @type {!Object<string,*>} */ (relationship["from"]);
        var fromName = /** @type {string} */ (from["name"]);
        var fromIndex = meta.names.findIndex(function(/** string */ v){
            return v === fromName;
        });
        var to = /** @type {!Object<string,*>} */ (relationship["to"]);
        var toObject = /** @type {string} */ (to["object"]);
        var toName = /** @type {string} */ (to["name"]);
        var toIndex = meta.names.findIndex(function(/** string */ v){
            return v === toName;
        });
        var toRows = masterData.Get(toObject);
        /** @type {!Object<string, !Array<string>>} */
        var toMap = {};
        toRows.forEach(function(/** !Array<string> */ row){
            var key = row[toIndex];
            toMap[key] = row;
        });
        fromRows.forEach(function(/** !Array<string> */ row){
            var value = /** @type {string} */ (row[fromIndex]);
            if(!(value in toMap)){
                errorMessages.push(["RelationshipChecker Error:",
                                    " from: ", modelName, ".", fromName,
                                    " value=", value,
                                    " to: ", toObject, ".", toName].join(""));
            }
        });
    });
    if(0 < errorMessages.length){
        errorMessages.forEach(function(/** string */ message){
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
    modelNames.forEach(function(/** string */ modelName){
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
    var masterData = /** @type {!MasterData} */ (Game.Locator.locate(MasterData));
    var meta = masterData.GetMeta(modelName);
    if(!(meta["validations"])){
        return;
    }
    var validations = /** @type {!Object<string, !Object<string,*>>} */ (meta["validations"]);
    var rows = masterData.Get(modelName);
    /** @type {!Array<string>} */
    var errorMessages = [];

    rows.forEach(function(/** !Array<string> */ row){
        meta.names.forEach(function(/** string */ colName, /** number */ colIdx){
            var rawValue = row[colIdx];
            var type = meta.types[colIdx];
            var value = Model.Cast(type, rawValue);
            var validation = /** @type {Object<string,*>} */ (validations[colName]);
            if(!validation){
                return;
            }

            // 1. Min validation (for numeric fields)
            if("min" in validation){
                if(typeof value !== "number" || value < /** @type {number} */ (validation["min"])){
                    errorMessages.push(["ValueChecker Error: ", modelName, ".", colName,
                                        " value=", String(value), " is less than min=", String(validation["min"])].join(""));
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
                var regex = new RegExp(/** @type {string} */ (validation["regex"]));
                if(typeof value !== "string" || !regex.test(value)){
                    errorMessages.push(["ValueChecker Error: ", modelName, ".", colName,
                                        " value=", String(value), " does not match regex=", String(validation["regex"])].join(""));
                }
            }

            // 4. Allowed list validation (in: Array)
            if("in" in validation){
                var allowed = /** @type {!Array} */ (validation["in"]);
                if(allowed.indexOf(value) === -1){
                    errorMessages.push(["ValueChecker Error: ", modelName, ".", colName,
                                        " value=", String(value), " is not in allowed list=", JSON.stringify(allowed)].join(""));
                }
            }
        });
    });

    if(0 < errorMessages.length){
        errorMessages.forEach(function(/** string */ message){
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
    modelNames.forEach(function(/** string */ modelName){
        this.Check(modelName);
    }, this);
};
