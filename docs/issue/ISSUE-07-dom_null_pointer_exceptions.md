# [ISSUE-07] シーン遷移やテスト実行時におけるDOM非存在エラー (Cannot read properties of null) (Severity: Medium)

* **ステータス**: 解決済 (Resolved)
* **内容**: レンダリングレイヤー（`FPSLayer`、`ResultSceneLayer`、`TitleSceneLayer` など）の `OnExit` や `OnUpdate` メソッドにおいて、すでにDOM要素（`this.dom` やその親・子要素）が破棄されている状態でDOM操作を行おうとした際、`Cannot read properties of null (reading 'parentNode')` などのエラーが発生し、ゲームがクラッシュまたはテストが異常終了する問題。
* **対応内容 (2026.6.15)**: `OnExit` や `OnUpdate` 時に `this.dom`、`this.dom.parentNode`、`this.dom.children` の存在確認（ヌルチェック）を徹底するよう修正。また、テストコード (`template_test.js`) において、テスト終了時に `layer.OnExit()` を呼び出し、不要なDOM要素とイベントリスナーが適切にクリーンアップされるように修正しました。
