"use strict";

var Events = {
    Game: {
        OnStart: "Events.Game.OnStart",
        OnUpdate: "Events.Game.OnUpdate",
        OnLastUpdate: "Events.Game.OnLastUpdate",
        OnRender: "Events.Game.OnRender",
        OnDestroy: "Events.Game.OnDestroy",
    },
    GameScene: {
        OnEnter: "Events.GameScene.OnEnter",
        OnExit: "Events.GameScene.OnExit",
        OnPause: "Events.GameScene.OnPause",
        OnResume: "Events.GameScene.OnResume",
    },
    GameDirector: {
        OnBootGame: "Events.GameDirector.OnBootGame",
        OnResetGame: "Events.GameDirector.OnResetGame",
        OnNewRace: "Events.GameDirector.OnNewRace",
        OnLogMessage: "Events.GameDirector.OnLogMessage",
    },
    Race: {
        OnPlacingFirst: "Events.Race.OnPlacingFirst",
        OnPlacingSecond: "Events.Race.OnPlacingSecond",
        OnPlayCard: "Events.Race.OnPlayCard",
        OnUndoPlayCard: "Events.Race.OnUndoPlayCard", // For debug?
    },
    // For debug.
    Debug: {
        OnShowDebugMenu: "Events.Deubg.OnShowDebugMenu",
        OnResetGame: "Events.Debug.OnResetGame",
        OnResetRace: "Events.Debug.OnResetRace",
        OnPlayCard: "Events.Debug.OnPlayCard",
        OnUndoPlayCard: "Events.Debug.OnUndoPlayCard",
        OnPlayRankCard: "Events.Debug.OnPlayRankCard",
        OnPlayDashCard: "Events.Debug.OnPlayDashCard",
        OnMove: "Events.Debug.OnMove",
        OnCheckRelationship: "Events.Debug.OnCheckRelationship",
    },
};
