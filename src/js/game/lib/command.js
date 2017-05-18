"use strict";

/**
 * @interface
 */
var ICommand = function(){};

/**
 * Execute.
 */
ICommand.prototype.Execute = function(){};

/**
 * Undo.
 */
ICommand.prototype.Undo = function(){};

/**
 * @constructor
 * @implements {ICommand}
 * @param {Function} func The function.
 */
var FunctionCommand = function(func){
    this.func_ = func;
};

/**
 * Execute.
 */
FunctionCommand.prototype.Execute = function(){
    this.func_();
};

/**
 * Undo.
 */
FunctionCommand.prototype.Undo = function(){};

/**
 * @constructor
 */
var BasicExecuter = function(){
    /** type {Array<ICommand>} */
    this.commands_ = [];
};

/**
 * @param {ICommand} command The command.
 */
BasicExecuter.prototype.Push = function(command){
    this.commands_.push(command);
};

/**
 * Execute all command.
 */
BasicExecuter.prototype.ExecuteAll = function(){
    for(var command of this.Generator()){
        command.Execute();
    }
};

/**
 * @return {!Iterator<ICommand>}
 */
BasicExecuter.prototype.Generator = function*(){
    while(0 < this.commands_.length){
        yield this.commands_.shift();
    }
};

/**
 * @constructor
 */
var SimpleCommandExecuter = function(){
    /** type {Array<ICommand>} */
    this.commands_ = [];
    /** type {number} */
    this.position_ = 0;
};

/**
 * @param {ICommand} command The command.
 */
SimpleCommandExecuter.prototype.Execute = function(command){
    this.commands_.push(command);
    command.Execute();
    this.position_ += 1;
};

/**
 * Undo command.
 */
SimpleCommandExecuter.prototype.Undo = function(){
    if(this.commands_.length <= 0){
        return;
    }
    var command = this.commands_.pop();
    command.Undo();
    this.position_ -= 1;
};
