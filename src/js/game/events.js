"use strict";

var Events = {
    Game: {
        OnAwake: "Events.Game.OnAwake",
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
        OnResetGame: "Events.GameDirector.OnResetGame",
        OnToRaceScene: "Events.GameDirector.OnToRaceScene",
        OnLogMessage: "Events.GameDirector.OnLogMessage",
    },
    PlayCardDirector: {
        OnReset: "Events.PlayCardDirector.OnReset",
    },
    Race: {
        OnPlacingFirst: "Events.Race.OnPlacingFirst",
        OnPlacingSecond: "Events.Race.OnPlacingSecond",
        OnFinishedRace: "Events.Race.OnFinishedRace",
        OnPlayCard: "Events.Race.OnPlayCard",
        OnBet: "Events.Race.OnBet",
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
        OnAutoPlayCard: "Events.Debug.OnAutoPlayCard",
    },
};
