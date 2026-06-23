# [ISSUE-16] 初期化処理の順序不整合による directors 取得失敗エラー (Cannot read properties of null) (Severity: High)

* **ステータス**: 解決済 (Resolved)
* **内容**: 
  レースシーンへの遷移時、`GameScene` のコンストラクタ内でレイヤー (`MenuLayer`) のインスタンス化と描画（`Render`）が実行されます。しかし、この段階では新シーンが `CustomSceneDirector` のアクティブシーンとして登録されていない（`CurrentScene` が `null` または遷移前の古いシーンを返す）ため、`MenuLayer` 内で `sceneDirector.CurrentScene()` から directors（`PlayCardDirector` など）を取得しようとすると `Cannot read properties of null (reading 'directors')` の TypeError が発生しゲームがクラッシュする問題。

* **対応内容**:
  問題の発生していたコード（`MenuLayer` における手札やベット情報の詳細表示部）を削除し、当初のシンプルなUIへとロールバックしました。これにより、初期化タイミングの依存関係によるクラッシュが解消されました。
