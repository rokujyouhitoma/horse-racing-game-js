# [ISSUE-15] テンプレートエンジン内部における innerHTML 使用の代替・安全化 (Severity: Low)

* **ステータス**: 新規 (New)
* **内容**: 
  [DSN-03-game_programming_patterns_and_coding_constraints.md](../DSN-03-game_programming_patterns_and_coding_constraints.md) および [CONTRIBUTING.md](../../CONTRIBUTING.md) では、「XSS脆弱性の完全排除」のために `innerHTML` への直接代入が全面的に禁止されています。
  しかし現在、HTML文字列を DOM フラグメントにコンパイルするコア機能の一部として、`src/js/game/templates.js` L93 にて `<template>` 要素の `innerHTML` プロパティに対する代入処理が行われています。

  ```javascript
  Templates.GenerateFragment = function(template, namespace) {
      var tmp = /** @type {!HTMLTemplateElement} */ (document.createElement("template"));
      tmp.innerHTML = template.generate(namespace);  // innerHTML の使用箇所
      return /** @type {!DocumentFragment} */ (tmp.content);
  };
  ```

  `<template>` タグに対する `innerHTML` 代入は、ブラウザ標準により即時スクリプト実行はトリガーされない安全性の高い仕様となっています。ただし、静的コード解析やセキュリティスキャンツール等において「innerHTMLの使用」として警告フラグが立つ原因となります。

* **対応方針**:
  * セキュリティ監査上のポリシーに適合させるため、`DOMParser`（`parseFromString`）を用いた DOM 木構築への切り替えを検討する。
  * あるいは、現在の `<template>` に対する innerHTML 処理がプロジェクトにとって安全な例外ルールであることを明確にするため、`DSN-03` に例外許容ルールを明文化し、ソースコードには警告抑制アノテーションを明記する。

* **関連箇所**:
  * [DSN-03-game_programming_patterns_and_coding_constraints.md](../DSN-03-game_programming_patterns_and_coding_constraints.md)
  * [CONTRIBUTING.md](../../CONTRIBUTING.md)
  * `src/js/game/templates.js` (L91–95)
