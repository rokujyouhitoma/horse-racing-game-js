# [ISSUE-06] エンジンラグ処理時の不整合 (Severity: Low)

* **ステータス**: 新規 (New)
* **内容**: タブ切り替えなどでJSスリープから復帰した際のラグ解消処理（whileループのスキップ）により、シミュレーションゲームとしての状態更新に不整合が生じるリスクがある。
* **関連コード**: [engine.js:L113](file:///workspace/horse-racing-game-js/src/js/game/lib/engine.js#L113) の TODO コメント箇所。
