"use strict";

/**
 * @constructor
 * @implements {ILayer}
 * @param {IScene} scene A scene.
 */
var DebugMenuLayer = function(scene){
    /** @type {IScene} */
    this.scene = scene;
    /** @type {Element} */
    this.dom = null;
    /** @type {!Array<!Element>} */
    this.checkboxs = [];
    /** @type {!Array<!Element>} */
    this.buttons = [];
    /** @type {!Array<!Array<*>>} */
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.Race.OnPlacingFirst, this.OnPlacingFirst.bind(this), null],
        [Events.Race.OnPlacingSecond, this.OnPlacingSecond.bind(this), null],
        [Events.Debug.OnResetGame, this.OnResetGame.bind(this), null],
        [Events.Debug.OnResetRace, this.OnResetRace.bind(this), null],
        [Events.Debug.OnPlayCard, this.OnPlayCard.bind(this), null],
        [Events.Debug.OnUndoPlayCard, this.OnUndoPlayCard.bind(this), null],
        [Events.Debug.OnPlayRankCard, this.OnPlayRankCard.bind(this), null],
        [Events.Debug.OnPlayDashCard, this.OnPlayDashCard.bind(this), null],
        [Events.Debug.OnMove, this.OnMove.bind(this), null],
        [Events.Debug.OnCheckRelationship, this.OnCheckRelationship.bind(this), null],
        [Events.Debug.OnAutoPlayCard, this.OnAutoPlayCard.bind(this), null],
    ];
    this.events.forEach(function(/** !Array<*> */ event){
        Game.Publisher.Subscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
    /** @type {boolean} */
    this.IsAutoPlayCard = false;
};

/**
 * @return {DocumentFragment}
 */
DebugMenuLayer.prototype.Render = function(){
    var fragment = document.createDocumentFragment();
    var section = document.createElement("section");
    section.className = "debugmenu";
    var h1 = document.createElement("h1");
    h1.innerText = "Debug Menu";
    section.appendChild(h1);
    fragment.appendChild(section);
    this.dom = section;
    if (this.dom) {
        var domElement = /** @type {!Element} */ (this.dom);
        var self = this;
        this.checkboxs = [
            ["Auto PlayCard", "change", /** @type {function(Event)} */ (function(/** Event */ e){var t = /** @type {!HTMLInputElement} */ (/** @type {!Event} */ (e).target); Game.Publisher.Publish(Events.Debug.OnAutoPlayCard, self, {"checked": t.checked});})],
        ].map(function(/** !Array<*> */ value){
            var checkbox = (new UICustomCheckbox(/** @type {string} */ (value[0]))).DOM();
            checkbox.addEventListener(/** @type {string} */ (value[1]), /** @type {function(Event)} */ (value[2]));
            domElement.appendChild(checkbox);
            return checkbox;
        });
        domElement.appendChild(document.createElement("br"));
        this.buttons = [
            ["Reset \uD83C\uDFAE", "click", /** @type {function(Event)} */ (function(){Game.Publisher.Publish(Events.Debug.OnResetGame, self);})],
            ["Reset \uD83C\uDFC7", "click", /** @type {function(Event)} */ (function(){Game.Publisher.Publish(Events.Debug.OnResetRace, self);})],
            ["Play PlayCard", "click", /** @type {function(Event)} */ (function(){Game.Publisher.Publish(Events.Debug.OnPlayCard, self);})],
            ["Play Undo PlayCard", "click", /** @type {function(Event)} */ (function(){Game.Publisher.Publish(Events.Debug.OnUndoPlayCard, self);})],
            ["Play RankCard", "click", /** @type {function(Event)} */ (function(){Game.Publisher.Publish(Events.Debug.OnPlayRankCard, self);})],
            ["Play DashCard", "click", /** @type {function(Event)} */ (function(){Game.Publisher.Publish(Events.Debug.OnPlayDashCard, self);})],
            ["Check Relationship", "click", /** @type {function(Event)} */ (function(){Game.Publisher.Publish(Events.Debug.OnCheckRelationship, self);})],
        ].map(function(/** !Array<*> */ value){
            var button = (new UIButton(/** @type {string} */ (value[0]))).DOM();
            button.addEventListener(/** @type {string} */ (value[1]), /** @type {function(Event)} */ (value[2]));
            domElement.appendChild(button);
            return button;
        });
        var seed = document.createElement("p");
        seed.innerText = "seed: " + PlayCardDirector.Xorshift.s;
        domElement.appendChild(seed);
    }
    return fragment;
};

/**
 * Turn off Auto play card.
 */
DebugMenuLayer.prototype.TurnOffAutoPlayCard = function(){
    this.IsAutoPlayCard = false;
    if (this.checkboxs && this.checkboxs[0]) {
        var input = /** @type {!HTMLInputElement} */ (this.checkboxs[0].children[0]);
        input.checked = false;
    }
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnEnter = function(e){};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        if(this.dom && this.dom.parentNode){
            this.dom.parentNode.removeChild(this.dom);
        }
    }.bind(this)));
    this.events.forEach(function(/** !Array<*> */ event){
        Game.Publisher.UnSubscribe(
            /** @type {string} */ (event[0]),
            /** @type {function(ExEvent)} */ (event[1]),
            /** @type {Object} */ (event[2])
        );
    });
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnPlacingFirst = function(e){
    this.TurnOffAutoPlayCard();
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnPlacingSecond = function(e){
    this.TurnOffAutoPlayCard();
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnResetGame = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnResetGame, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnResetRace = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnToRaceScene, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnPlayCard = function(e){
    Game.Publisher.Publish(Events.Race.OnPlayCard, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnUndoPlayCard = function(e){
    Game.Publisher.Publish(Events.Race.OnUndoPlayCard, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnPlayRankCard = function(e){
    var currentScene = /** @type {!GameScene} */ (Game.SceneDirector.CurrentScene());
    var directors = /** @type {!Object<string,*>} */ (currentScene.directors);
    var raceDirector = /** @type {!RaceDirector} */ (directors["RaceDirector"]);
    var race = /** @type {!Race} */ (raceDirector.race);
    var repositoryDirector = /** @type {!RepositoryDirector} */ (Game.Locator.locate(RepositoryDirector));
    var name = "RankCard";
    var repository = /** @type {!Repository} */ (repositoryDirector.Get(name));
    var detail_id = 1;
    var card = /** @type {!ICard} */ (repository.Find(detail_id));
    var cardEffect = /** @type {!ICardEffect} */ (race.Apply(card));
    cardEffect.Apply();
    Game.Log(card.LogMessage());
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnPlayDashCard = function(e){
    var currentScene = /** @type {!GameScene} */ (Game.SceneDirector.CurrentScene());
    var directors = /** @type {!Object<string,*>} */ (currentScene.directors);
    var raceDirector = /** @type {!RaceDirector} */ (directors["RaceDirector"]);
    var race = /** @type {!Race} */ (raceDirector.race);
    var repositoryDirector = /** @type {!RepositoryDirector} */ (Game.Locator.locate(RepositoryDirector));
    var name = "DashCard";
    var repository = /** @type {!Repository} */ (repositoryDirector.Get(name));
    var detail_id = 1 + 1;
    var card = /** @type {!ICard} */ (repository.Find(detail_id));
    var cardEffect = /** @type {!ICardEffect} */ (race.Apply(card));
    cardEffect.Apply();
    Game.Log(card.LogMessage());
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnMove = function(e){
    var payload = /** @type {!Object<string,*>} */ (e.payload);
    var index = /** @type {number} */ (payload["index"]);
    var currentScene = /** @type {!GameScene} */ (Game.SceneDirector.CurrentScene());
    var directors = /** @type {!Object<string,*>} */ (currentScene.directors);
    var raceDirector = /** @type {!RaceDirector} */ (directors["RaceDirector"]);
    var race = /** @type {!Race} */ (raceDirector.race);
    var gameBoard = /** @type {!GameBoard} */ (race.gameBoard);
    var racetrack = /** @type {!Racetrack} */ (gameBoard.racetrack);
    var lane = /** @type {!Lane} */ (racetrack.lanes[index]);
    lane.position += 1;
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnCheckRelationship = function(e){
    var checker = new RelationshipChecker();
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

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuLayer.prototype.OnAutoPlayCard = function(e){
    var payload = /** @type {!Object<string,*>} */ (e.payload);
    this.IsAutoPlayCard = /** @type {boolean} */ (payload["checked"]);
    /** @type {number} */
    var interval = 100;
    var listener = function(){
        if(this.IsAutoPlayCard){
            Game.Publisher.Publish(Events.Race.OnPlayCard, this);
            setTimeout(listener, interval);
        }
//        console.info("AutoPlay is: " + this.IsAutoPlayCard);
    }.bind(this);
    if(this.IsAutoPlayCard){
        setTimeout(listener, interval);
    }
};
