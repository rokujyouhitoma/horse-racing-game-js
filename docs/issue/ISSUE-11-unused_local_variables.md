# [ISSUE-11] 未使用ローカル変数の警告解消 (Severity: Low)

* **ステータス**: 解決済 (Resolved)
* **内容**: Closure Compiler のオプション `--jscomp_warning=unusedLocalVariables` を有効にしたところ、`JSC_UNUSED_LOCAL_ASSIGNMENT`（ローカル変数に代入はされているが一度も読まれていない）という警告が3件検出されました。コードの可読性・保守性のために、これらの不要な変数宣言を除去します。
* **対応内容 (2026.6.16)**:
  * [`entities.js` L71–73](../../src/js/game/entities.js) の `Race.prototype.Ranks` 関数内で、`m["len"]` を代入していた変数 `len` がその後一切使用されていなかったため削除しました。
  * [`main.js` L261–264](../../src/js/game/main.js) の `GameDirector.prototype.OnLogMessage` 関数内で、`console.log(message)` がコメントアウトされており参照箇所がなくなっていた変数 `message` を削除しました。
  * [`main.js` L1169–1173](../../src/js/game/main.js) の `OddsTable` コンストラクタ内で、`m.odds` を取り出していた変数 `o` が使用されていなかったため削除しました（`odds` オブジェクト全体が `new OddsEntry(odds)` に直接渡されているため不要）。
* **関連箇所**:
  * [entities.js](../../src/js/game/entities.js) — `Race.prototype.Ranks`
  * [main.js](../../src/js/game/main.js) — `GameDirector.prototype.OnLogMessage`、`OddsTable` コンストラクタ
