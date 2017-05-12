/**
 * @constructor
 */
var FPSRenderer = function(scene){
    this.scene = scene;
    this.dom = null;
    this.events = [
        [Events.Game.OnUpdate, this.OnUpdate.bind(this), null],
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
FPSRenderer.prototype.OnUpdate = function(e){
    var fps = Math.floor(Game.Locator.locate(Game).fps.currentFPS * 100) / 100;
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.children[0].innerText = fps;
    }.bind(this)));
};

/**
 * @param {ExEvent} e The event object.
 */
FPSRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = this.scene.name.toLowerCase() + " " + "fps";
        var p = document.createElement("p");
        section.appendChild(p);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
FPSRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};
