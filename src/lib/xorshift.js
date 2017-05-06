"use strict";

/**
 * @constructor
 */
var Xorshift = function(){
    this.seed(Date.now());
};

Xorshift.MIN_VALUE = 0;
Xorshift.MAX_VALUE = 0xffffffff / 2;

Xorshift.prototype.seed = function(seed){
    this.x = (seed & 0x12345678) >>> 0;
    this.y = (seed ^ 0x12345678) >>> 0;
    this.z = ((seed & 0x0000ffff << 16) | (seed >> 16) & 0x0000ffff) >>> 0;
    this.w = this.x ^ this.y;
    // skip number of 16.
    for(var i=0; i < 16; i++){
        this.rand();
    }
};

Xorshift.prototype.rand = function(){
    var t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
    return this.w;
};
