# [ISSUE-15] テンプレートエンジン内部における innerHTML 使用の代替・安全化 (Severity: Low)

* **ステータス**: 解決済 (Resolved)
* **内容**: 
  [DSN-03-game_programming_patterns_and_coding_constraints.md](../DSN-03-game_programming_patterns_and_coding_constraints.md) および [CONTRIBUTING.md](../../CONTRIBUTING.md) では、「XSS脆弱性の完全排除」のために `innerHTML` への直接代入が全面的に禁止されています。
  しかし現在、HTML文字列を DOM フラグメントにコンパイルするコア機能の一部として、`src/js/game/templates.js` L93 にて `<template>` 要素の `innerHTML` プロパティに対する代入処理が行われていました。

  ```javascript
  Templates.GenerateFragment = function(template, namespace) {
      var tmp = /** @type {!HTMLTemplateElement} */ (document.createElement("template"));
      tmp.innerHTML = template.generate(namespace);  // innerHTML の使用箇所
      return /** @type {!DocumentFragment} */ (tmp.content);
  };
  ```

  `<template>` タグに対する `innerHTML` 代入は、ブラウザ標準により即時スクリプト実行はトリガーされない安全性の高い仕様となっています。ただし、静的コード解析やセキュリティスキャンツール等において「innerHTMLの使用」として警告フラグが立つ原因となります。

* **対応方針**:
  * セキュリティ監査上のポリシーに適合させるため、`DOMParser`（`parseFromString`）を用いた DOM 木構築への切り替えを完了しました。

* **解決詳細**:
  * `Templates.GenerateFragment` において、`new DOMParser().parseFromString(htmlString, "text/html")` を用いてHTML文字列から `doc` オブジェクトを構築。
  * `doc.body` 内の全子ノードを明示的に detach して `DocumentFragment` に追加する形へと書き換えました。
  * テスト環境（`src/js/lib/template_test.js`）向けに、`DOMParser` の簡易 Mock を実装し、テスト実行を通過するように対応しました。

* **関連箇所**:
  * [DSN-03-game_programming_patterns_and_coding_constraints.md](../DSN-03-game_programming_patterns_and_coding_constraints.md)
  * [CONTRIBUTING.md](../../CONTRIBUTING.md)
  * `src/js/game/templates.js` (L91–105)
  * `src/js/lib/template_test.js` (L12–34, L874–884)

