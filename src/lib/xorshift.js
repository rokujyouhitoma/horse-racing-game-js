"use strict";

/**
 * @constructor
 */
var Xorshift = function(){
    /** @private */
    this.x_ = 0;
    /** @private */
    this.y_ = 0;
    /** @private */
    this.z_ = 0;
    /** @private */
    this.z_ = 0;
    this.seed(Date.now());
};

/** @const {number} */
Xorshift.MIN_VALUE = 0;
/** @const {number} */
Xorshift.MAX_VALUE = (0xffffffff - 1) / 2;

/**
 * @param {number} seed The seed.
 */
Xorshift.prototype.seed = function(seed){
    this.x_ = (seed & 0x12345678) >>> 0;
    this.y_ = (seed ^ 0x12345678) >>> 0;
    this.z_ = ((seed & 0x0000ffff << 16) | (seed >> 16) & 0x0000ffff) >>> 0;
    this.w_ = this.x_ ^ this.y_;
    // skip number of 16.
    for(var i=0; i < 16; i++){
        this.rand();
    }
};

/**
 * @return {number} The random number.
 */
Xorshift.prototype.rand = function(){
    var t = this.x_ ^ (this.x_ << 11);
    this.x_ = this.y_;
    this.y_ = this.z_;
    this.z_ = this.w_;
    this.w_ = (this.w_ ^ (this.w_ >> 19)) ^ (t ^ (t >> 8));
    return this.w_;
};
