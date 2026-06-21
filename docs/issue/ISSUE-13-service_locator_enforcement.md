# [ISSUE-13] Service Locator の徹底によるグローバル結合度低減 (Severity: Low)

* **ステータス**: 新規 (New)
* **内容**: 
  [DSN-03-game_programming_patterns_and_coding_constraints.md](../DSN-03-game_programming_patterns_and_coding_constraints.md) において、グローバルシングルトンを廃し **Service Locator** (`Game.Locator`) にアクセスを集約する設計制約が定義されました。
  しかし現在、`src/` 配下の複数のファイル（`entities.js`, `debugmenulayer.js` など）で、グローバル名前空間上のオブジェクト `Game.Publisher` や `Game.SceneDirector` を直接参照する実装が多数存在しています。
  これにより、コンポーネントがグローバル環境の状態に依存してしまい、特定のクラスやレイヤーを個別に切り離してテスト（モック化・スタブ化）することが困難になっています。

* **対応方針**:
  * グローバル空間上の `Game.Publisher` や `Game.SceneDirector` を直接参照している箇所を、すべてサービスロケーターからの動的解決（`Game.Locator.locate(Publisher)` や `Game.Locator.locate(CustomSceneDirector)`）にリファクタリングする。
  * あるいは、各レイヤーやコンポーネントの初期化（コンストラクタ）時に依存インスタンスを明示的に注入（DI）する構造に書き換える。
  * リファクタリング完了後、`main.js` 上のグローバル変数としての `Game.Publisher` および `Game.SceneDirector` の定義を排除する。

* **関連箇所**:
  * [DSN-03-game_programming_patterns_and_coding_constraints.md](../DSN-03-game_programming_patterns_and_coding_constraints.md)
  * `src/js/game/main.js` (定義箇所)
  * `src/js/game/entities.js`
  * `src/js/game/layers/` 配下の各 Layer ファイル (イベント購読、シーン管理時)
