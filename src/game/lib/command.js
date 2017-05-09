"use strict";

/**
 * @interface
 */
var Command = function(){};
Command.prototype.Execute = function(){};
Command.prototype.Undo = function(){};

/**
 * @constructor
 */
var SimpleCommandExecuter = function(){
    /** type {Array<Command>} */
    this.commands_ = [];
    /** type {number} */
    this.position_ = 0;
};

SimpleCommandExecuter.prototype.Execute = function(command){
    this.commands_.push(command);
    command.Execute();
    this.position_ += 1;
};

SimpleCommandExecuter.prototype.Undo = function(){
    if(this.commands_.length <= 0){
        return;
    }
    var command = this.commands_.pop();
    command.Undo();
    this.position_ -= 1
};
