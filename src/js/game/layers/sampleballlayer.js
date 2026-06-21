"use strict";

/**
 * @constructor
 */
/**
 * @constructor
 */
var SampleBall = function(){
    /** @type {number} */
    this.direction = 1;
    /** @type {number} */
    this.n = 0;
    /** @type {function(number): number} */
    this.easingFunction = function(t){ return t*t; };
    /** @type {number} */
    this.movement = 60;
};

/**
 * Tick move.
 */
SampleBall.prototype.TickMove = function(){
    if(0 < this.direction) {
        this.n = Math.min(this.n + 1/this.movement, 1);
        if(1 <= this.n){
            this.direction *= -1;
        }
    } else {
        this.n = Math.max(this.n - 1/this.movement, 0);
        if(this.n <= 0){
            this.direction *= -1;
        }
    }
};

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var SampleBallLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
    /** @type {Element} */
    this.dom = null;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = null;
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    this.events.forEach(function(/** !Array<*> */ event){
        publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
    /** @type {!SampleBall} */
    this.ball = new SampleBall();
};

/**
 * @return {DocumentFragment}
 */
SampleBallLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement("canvas"));
    canvas.height = 320;
    canvas.width = 320;
    fragment.appendChild(canvas);
    this.dom = canvas;
    var ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    this.ctx = ctx;
    return fragment;
};

/**
 * @param {ExEvent} e The event object.
 */
SampleBallLayer.prototype.OnUpdate = function(e){
    var ctx = this.ctx;
    if (ctx) {
        this.ball.TickMove();
        var y = this.ball.easingFunction(this.ball.n) * 200 + 60;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            ctx.beginPath();
            ctx.clearRect(0, 0, 320, 320);
            ctx.arc(160, y, 60, 0, Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
        }.bind(this)));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
SampleBallLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
SampleBallLayer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        if(this.dom && this.dom.parentNode){
            this.dom.parentNode.removeChild(this.dom);
        }
    }.bind(this)));
    var publisher = /** @type {!Publisher} */ (Game.Locator.locate(Publisher));
    this.events.forEach(function(/** !Array<*> */ event){
        publisher.UnSubscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};
