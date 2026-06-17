# [ISSUE-06] エンジンラグ処理時の不整合 (Severity: Low)

* **ステータス**: 解決済 (Resolved)
* **内容**: タブ切り替えなどでJSスリープから復帰した際のラグ解消処理（whileループのスキップ）により、シミュレーションゲームとしての状態更新に不整合が生じるリスクがある。
* **関連コード**: [engine.js](../../src/js/game/lib/engine.js) の `Engine.prototype.Loop`

---

## 問題の詳細

`Engine.prototype.Loop` 内の固定タイムステップ実装において、ブラウザタブのバックグラウンド化・スリープからの復帰時に大量の `lag` が蓄積する問題があった。

**旧実装（問題あり）**:
```javascript
if(LIMIT_LAG < lag){
    lag = 0;   // lagを完全リセット
    return;    // Update/LastUpdate/Render を全スキップ
}
```

旧実装の問題点:
1. `lag = 0; return;` により、その瞬間の `Update()` / `LastUpdate()` が **完全にスキップ** される。
2. シーン遷移（`SceneDirector`）やカードコマンド（`CommandExecuter`）などの状態マシンが、`OnUpdate` イベントを受け取れない状態が発生する。
3. `Events.Race.OnChanged` のようなPub/Sub購読ハンドラも一周スキップされ、View層との同期が一時的に失われるリスクがある。

## 解決策

**新実装（修正済み）**:
```javascript
if(LIMIT_LAG < lag){
    // Clamp to one step instead of skipping entirely (ISSUE-06).
    lag = MPU;
}
```

`lag = 0` にリセットするのではなく `lag = MPU`（1フレーム分）に**クランプ**することで:
1. **大量追い付きループの防止**: `LIMIT_LAG` を超えた非現実的な時間ジャンプは破棄される（"spiral of death" の回避）。
2. **状態整合性の保証**: 1フレーム分の `Update()` + `LastUpdate()` は必ず実行されるため、ゲームの状態マシンが整合した状態を保つ。

この設計は ["Fix Your Timestep!" (Glenn Fiedler)](https://gafferongames.com/post/fix_your_timestep/) のベストプラクティスに基づく。

## 対応内容

* **修正ファイル**: [engine.js](../../src/js/game/lib/engine.js)
  * `lag = 0; return;` を `lag = MPU;` に変更。
  * `LIMIT_LAG` に詳細な説明コメントを追記。
  * `Loop` 関数のJSDocに設計参考文献を明記。
* **テスト追加**: [template_test.js](../../src/js/lib/template_test.js) の `EngineLoopTest` スイート（3件）
  * `test_lag_clamp_executes_one_update_on_sleep_recovery`: スリープ復帰時にUpdateが1回実行されることを確認
  * `test_lag_clamp_does_not_run_multiple_updates_on_sleep_recovery`: 60秒のスリープ後でもUpdateが1回のみ（3600回にならない）ことを確認
  * `test_normal_lag_within_limit_is_not_clamped`: 通常の2フレーム分のlagはクランプされず2回Updateが実行されることを確認
