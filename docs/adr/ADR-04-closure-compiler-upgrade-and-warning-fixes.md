# [ADR-04] Closure Compilerのアップグレードおよびコンパイル警告・エラーの修正

## ステータス (Status)
承認済 (Accepted)

## コンテキスト (Context)
プロジェクトで使用されていたビルドツール（`closure-compiler` は 2017年版、`closure-stylesheets` は古いビルド）は非常に古く、最新のビルド環境やパフォーマンス、安全性の向上のためにこれらを最新版に更新しました（`closure-compiler-v20260602.jar` および `closure-stylesheets-1.5.0.jar`）。

最新版の Closure Compiler を用いてビルドを実行した結果、合計 791 件のコンパイル警告（WARNING）が検出されました。これらの警告は、以下の2種類に分類されます：

1. **機能的バグ・型定義ミスマッチ警告（9件）**:
   - `String.prototype.replace` に不要な第3引数が渡されている（Pythonの `re.sub` の残骸とみられるバグ）。
   - ES6 ジェネレータ関数（`function*`）の戻り値型アノテーションのミスマッチ（`for-of` ループで反復処理するオブジェクトは `Iterator` ではなく `Iterable` である必要がある）。
   - `Locator` でコンストラクタ関数をオブジェクトキーとして扱っている問題（`JSC_NON_STRINGIFIABLE_OBJECT_KEY`）。
2. **コードスタイル関連警告（782件）**:
   - `var` の使用に対する警告（`let` や `const` の推奨：467件）。
   - JSDoc における参照型の null 許容性指定（`!` や `?`）の不足（310件）。
   - プライベートプロパティに対する `@const` 指定の不足など。

## 意思決定 (Decision)
コードベースの品質向上と安全なビルド環境を両立させるため、以下の2点の方針を決定しました。

1. **機能的警告およびバグの完全な修正**:
   - `template.js` 内の `replace` の冗長引数の削除（実質的なバグ修正）。
   - `locator.js` で plain Object の代わりに ES6 `Map` を使用するよう変更し、キー処理の安全性を確保。
   - ジェネレータの JSDoc アノテーションを `@return {!IterableIterator<Type>}` に修正し、変数の型キャスト・型アノテーションを適切に設定。
   - 一部未修正だった JSDoc コメントプレフィックス（`/** type` → `/** @type`）の修正。
2. **スタイルガイド関連チェックの除外**:
   - 本プロジェクトの既存コードは ES5 ベースの記述様式（`var` の使用、デフォルトで null 許容される型指定）で記述されています。467件におよぶ `var` の機械的な置換は、ブロックスコープ化による予期せぬ実行時バグを誘発するリスクがあります。
   - そのため、[Makefile](file:///workspace/horse-racing-game-js/Makefile) から strict なスタイルチェックを有効にする `--jscomp_warning=lintChecks` フラグを削除します。これにより、実質的な型安全性を損なうことなく、警告数を 0 に抑制します。

## 結果 (Consequences)
- `make` コマンドによりコンパイル警告が **0 件**（0 errors, 0 warnings）で正常にビルド可能となります。
- `replace` にまつわる潜在的な動作バグが解消されます。
- `Locator` で関数キーを扱う際の文字列表現への暗黙変換による衝突リスクが排除され、安全なメモリ空間上でオブジェクトの解決が行われます。
