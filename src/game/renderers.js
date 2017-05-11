"use strict";

/**
 * @constructor
 * @param {string} label The label.
 */
var UIButton = function(label){
    this.label = label;
};

/**
 * @return {Element} The button element.
 */
UIButton.prototype.DOM = function(){
    var button = document.createElement("button");
    button.innerText = this.label;
    return button;
};

/**
 * @constructor
 */
var LogMessageRenderer = function(scene){
    this.dom = null;
    this.messages = [];
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.GameDirector.OnLogMessage, this.OnLogMessage.bind(this), null],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "history";
        var h1 = document.createElement("h1");
        h1.innerText = "History";
        section.appendChild(h1);
        for(var i =0; i < 5; i++){
            var p = document.createElement("p");
            p.innerText = "\uD83C\uDFC7";
            this.messages.push(p);
            section.appendChild(p);
        }
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
LogMessageRenderer.prototype.OnLogMessage = function(e){
    var message = e.payload["message"];
    for(var i = this.messages.length - 1; 0 < i; i--){
        this.messages[i].innerText = this.messages[i - 1].innerText;
    }
    this.messages[0].innerText = message;
};

/**
 * @constructor
 */
var MenuRenderer = function(scene){
    this.dom = null;
    this.events = [
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
MenuRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "menu";
        var h1 = document.createElement("h1");
        h1.innerText = "Menu";
        section.appendChild(h1);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
    var buttons = [
        ["Play PlayCard Random", function(){Game.Publisher.Publish(Events.Debug.OnPlayCard, this);}],
        ["Reset \uD83C\uDFAE", function(){Game.Publisher.Publish(Events.Debug.OnResetGame, this);}],
    ].map(function(value){
        var button = (new UIButton(value[0])).DOM();
        button.addEventListener("click", value[1]);
        return button;
    }).forEach(function(dom){
        this.dom.appendChild(dom);
    }, this);
};

/**
 * @param {ExEvent} e The event object.
 */
MenuRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @constructor
 */
var FPSRenderer = function(scene){
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
    this.Render({
        "fps": fps,
    });
};

/**
 * @param {ExEvent} e The event object.
 */
FPSRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "fps";
        var h1 = document.createElement("h1");
        h1.innerText = "FPS";
        section.appendChild(h1);
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

FPSRenderer.prototype.Render = function(dictionary){
    this.dom.children[1].innerText = dictionary["fps"];
};

/**
 * @constructor
 */
var LaneRenderer = function(){};

LaneRenderer.prototype.Render = function(dictionary){
    var lane = dictionary["lane"];
    var color = lane.runner.model["color"];
    return [
        this.ToArray(lane).reverse().join(""),
        ["<span style='background-color:#", color, ";'>", lane.number, "</span>"].join(""),
        lane.position,
    ].join("|");
};

LaneRenderer.prototype.ToArray = function(lane){
    var array = [];
    var length = lane.len;
    for(var i=0; i < length + 1; i++){
        array.push((lane.position === i) ? LaneRenderer.CurrentPosition : LaneRenderer.EmptyPosition);
    }
    return array;
};

LaneRenderer.CurrentPosition = "\uD83C\uDFC7"; //Unicode Character 'HORSE RACING' (U+1F3C7)
LaneRenderer.EmptyPosition = "_";

/**
 * @constructor
 */
var RacetrackRenderer = function(scene){
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
RacetrackRenderer.prototype.OnUpdate = function(e){
    var game = Game.Locator.locate(GameDirector);
    //TODO: xxx
    if(!game.race){
        return;
    }
    //TODO: innerHTMLは手抜き。createElementによるDOM操作が望ましい
    this.dom.children[1].innerHTML = this.Render({
        "racetrack": game.race.gameBoard.racetrack,
    });
};

/**
 * @param {ExEvent} e The event object.
 */
RacetrackRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "racetrack";
        var h1 = document.createElement("h1");
        h1.innerText = "Racetrack";
        section.appendChild(h1);
        var div = document.createElement("div");
        section.appendChild(div);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
RacetrackRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

RacetrackRenderer.prototype.Render = function(dictionary){
    var laneRenderer = new LaneRenderer();
    var racetrack = dictionary["racetrack"];
    var lanes = racetrack.lanes;
    var text = [
        lanes.reduce(function(a, b, index){
            if(index == 1){
                return [a, b].map(function(lane){
                    return laneRenderer.Render({"lane": lane});
                }).join("<br />");
            }
            return [a, laneRenderer.Render({"lane": b})].join("<br />");
        })
    ].join("");
    return text;
};

/**
 * @constructor
 */
var TitleSceneRenderer = function(scene){
    this.dom = null;
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
    this.onClickListener = this.OnClick.bind(this);
};

/**
 * @param {ExEvent} e The event object.
 */
TitleSceneRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "";
        var h1 = document.createElement("h1");
        h1.innerText = "\uD83C\uDFC7 -> \uD83C\uDFAE";
        section.appendChild(h1);
        var button = document.createElement("button");
        button.innerText = "Start \uD83C\uDFC7";
        button.addEventListener("click", this.onClickListener);
        section.appendChild(button);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
};

/**
 * @param {ExEvent} e The event object.
 */
TitleSceneRenderer.prototype.OnExit = function(e){
    this.dom.children[1].removeEventListener("click", this.onClickListener);
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {Event} e Type event object.
 */
TitleSceneRenderer.prototype.OnClick = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnNewRace, this);
};

/**
 * @constructor
 */
var DebugMenuRenderer = function(scene){
    this.dom = null;
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.Debug.OnResetGame, this.OnResetGame.bind(this), null],
        [Events.Debug.OnResetRace, this.OnResetRace.bind(this), null],
        [Events.Debug.OnPlayCard, this.OnPlayCard.bind(this), null],
        [Events.Debug.OnUndoPlayCard, this.OnUndoPlayCard.bind(this), null],
        [Events.Debug.OnPlayRankCard, this.OnPlayRankCard.bind(this), null],
        [Events.Debug.OnPlayDashCard, this.OnPlayDashCard.bind(this), null],
        [Events.Debug.OnMove, this.OnMove.bind(this), null],
        [Events.Debug.OnCheckRelationship, this.OnCheckRelationship.bind(this), null],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "debug_menu";
        var h1 = document.createElement("h1");
        h1.innerText = "Debug Menu";
        section.appendChild(h1);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
    var buttons = [
        ["Reset \uD83C\uDFAE", function(){Game.Publisher.Publish(Events.Debug.OnResetGame, this);}],
        ["Reset \uD83C\uDFC7", function(){Game.Publisher.Publish(Events.Debug.OnResetRace, this);}],
        ["Play PlayCard", function(){Game.Publisher.Publish(Events.Debug.OnPlayCard, this);}],
        ["Play Undo PlayCard", function(){Game.Publisher.Publish(Events.Debug.OnUndoPlayCard, this);}],
        ["Play RankCard", function(){Game.Publisher.Publish(Events.Debug.OnPlayRankCard, this);}],
        ["Play DashCard", function(){Game.Publisher.Publish(Events.Debug.OnPlayDashCard, this);}],
        ["Check Relationship", function(){Game.Publisher.Publish(Events.Debug.OnCheckRelationship, this);}],
    ].map(function(value){
        var button = (new UIButton(value[0])).DOM();
        button.addEventListener("click", value[1]);
        return button;
    }).forEach(function(dom){
        this.dom.appendChild(dom);
    }, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnResetGame = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnResetGame, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnResetRace = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnNewRace, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnPlayCard = function(e){
    Game.Publisher.Publish(Events.Race.OnPlayCard, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnUndoPlayCard = function(e){
    Game.Publisher.Publish(Events.Race.OnUndoPlayCard, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnPlayRankCard = function(e){
    var race = Game.Locator.locate(GameDirector).race;
    var repositoryDirector = Game.Locator.locate(RepositoryDirector);
    var name = "RankCard";
    var repository = repositoryDirector.Get(name);
    var detail_id = 1;
    var card = repository.Find(detail_id);
    var cardEffect = race.Apply(card);
    cardEffect.Apply();
    Game.Log(card.LogMessage());
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnPlayDashCard = function(e){
    var race = Game.Locator.locate(GameDirector).race;
    var repositoryDirector = Game.Locator.locate(RepositoryDirector);
    var name = "DashCard";
    var repository = repositoryDirector.Get(name);
    var detail_id = 1 + 1;
    var card = repository.Find(detail_id);
    var cardEffect = race.Apply(card);
    cardEffect.Apply();
    Game.Log(card.LogMessage());
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnMove = function(e){
    var index = e.payload["index"];
    Game.Locator.locate(GameDirector).race.gameBoard.racetrack.lanes[index].position += 1;
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnCheckRelationship = function(e){
    var checker = new RelationshipChecker()
    checker.CheckAll([
        "HorseFigure",
        "MonsterCoin",
        "MonsterFigure",
        "Race",
        "PlayCard",
        "StepCard",
        "RankCard",
        "DashCard",
    ]);
};
