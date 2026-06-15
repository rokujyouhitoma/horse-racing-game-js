# [ISSUE-05] コーディング規約の混在 (Severity: Low)

* **ステータス**: 解決済 (Resolved)
* **内容**: キャメルケースとスネークケースの混在、オブジェクト指向の継承方法に一貫性がない（`GameObject` の継承スタイルなど）ため、リファクタリングによる整理が必要。
* **対応内容 (2026.6.15)**: 
  * プロトタイプ継承構造を `inherits` ユーティリティによる形式に統一し、サブクラス（`Game`, `FPS`, `GameScene` 各種ディレクターやエンティティなど）のコンストラクタ内で `GameObject.call(this)` または `Scene.call(this)` を明示的に呼び出すよう変更。これにより、不要なプロトタイプ共有によるメンバ変数の共有バグ（例：`this.objects`）を防ぎました。
  * Google Closure Compiler ビルド時の型不整合警告（`JSC_TYPE_MISMATCH`）を防ぐため、コンストラクタの JSDoc に `@extends {GameObject}` の記述を追加しました。
  * `checker.js` 内のローカル変数 (`from_rows` 等) や `oddstablelayer.js` 内の `new_table` 変数をキャメルケース（`fromRows`, `newTable` 等）にリファクタリングし、コーディング規約を統一しました。
