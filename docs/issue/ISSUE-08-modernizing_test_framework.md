# [ISSUE-08] テスト実行環境の近代化 (Severity: Low)

* **ステータス**: 新規 (New)
* **内容**: 現在、自作の簡易テストランナー（`template_test.js` 内のモック `describe` / `it`）と、`Makefile` 内で定義したインラインの Mock DOM を使用してテストを実行しています。将来的なテストコードの保守性向上、アサーション機能の強化、および非同期テスト対応のため、Jest や Mocha などの標準的かつ本格的なテストフレームワークへの移行を検討します。
* **関連箇所**: 
  * [template_test.js:L1](../../src/js/lib/template_test.js#L1) の TODO コメント箇所。
  * [Makefile:L65](../../Makefile#L65) 付近のテストランナー定義。
