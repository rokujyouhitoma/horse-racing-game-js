# Changelog

本ドキュメントは、「`horse-racing-game-js`」のすべての注目すべき変更を記録します。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づき、
バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) （メジャー.マイナー.パッチ）に準拠します。

---

## バージョニングポリシー

| バージョン種別 | 変更内容 |
| :--- | :--- |
| **メジャー** (`X.0.0`) | 後方互換性のない大規模な変更（ゲームルールの根本的な変更、アーキテクチャの全面刷新等） |
| **マイナー** (`0.X.0`) | 後方互換性のある新機能の追加（新カード種追加、新シーン実装、新API追加等） |
| **パッチ** (`0.0.X`) | 後方互換性のあるバグ修正・小改善（クラッシュ修正、パフォーマンス改善、ドキュメント更新等） |

### 変更カテゴリ

- `[Added]` — 新機能の追加
- `[Changed]` — 既存機能の変更
- `[Deprecated]` — 将来削除予定の機能の案内
- `[Removed]` — 機能の削除
- `[Fixed]` — バグ修正
- `[Security]` — セキュリティ関連の修正
- `[Balanced]` — ゲームバランスの調整（パラメータ変更・乱数ロジック修正等）
- `[Docs]` — ドキュメントの追加・更新

---

## [Unreleased]

### [Added]
- デバッグメニューから任意のシード値（seed）を指定して、レースとカード山札を同一シードでリセット（再現実行）できる機能を追加
- デバッグメニュー「Debug Menu」のトグル開閉メニュー「≡」をRace画面の右上に設置
  - 新規UIレイヤー `HamburgerMenuLayer` を実装し、ドキュメント外クリックでの自動クローズに対応
  - `DebugMenuLayer` の初期表示を表示（`display: block`）に設定し、`Events.Debug.OnShowDebugMenu` イベント受信時に表示を切り替えるよう変更
  - キャッシュクリアを強制するためのキャッシュバスティングクエリパラメータを `index.html` および `compiled.html` のCSS/JSリンクへ追加
- ゲームデザインドキュメント (GDD-01) の新規作成
- ソフトウェアテスト計画書 (MNG-04) の新規作成
- 実行計画書フォーマット定義 (MNG-05) の新規作成
- コントリビューション・ガイドライン (CONTRIBUTING.md) の新規作成
- チェンジログ (CHANGELOG.md) の新規作成
- `EngineLoopTest` スイート追加（3件）: lag-clamp動作のリグレッションテスト

### [Fixed]
- Closure Compilerの `ADVANCED_OPTIMIZATIONS` によるプロパティ名圧縮と動的CSVデータの不一致（`first_id`, `second_id`, `odds`, `type`, `id` 等のモデルプロパティ）により、コンパイル後の環境でレース終了時（OnFinishedRace）に TypeError (Cannot read properties of undefined (reading 'model')) が発生しクラッシュするバグを修正。モデルプロパティへのアクセスをブラケット記法（`m["first_id"]` 等）に修正。
  - 上記OnFinishedRaceの動作保証およびクラッシュの再発防止のため、テストスイート `RaceDirectorTest` に `test_on_finished_race_success` テストケースを追加。
- **[ISSUE-12]** Google Closure Compiler の `ADVANCED_OPTIMIZATIONS` によるプロパティ名圧縮（`racetrack`, `oddstable`）の不一致により、コンパイル後の環境でRacetrackおよびオッズテーブルの中身が表示されなくなるバグを修正
  - `main.js` での `Events.Race.OnChanged` パブリッシュ時のオブジェクトキーを文字列キー（`"racetrack"`, `"oddstable"`)に変更
- **[ISSUE-06]** タブ切り替え等のスリープ復帰時におけるエンジン状態更新の不整合を修正
  - `engine.js` `Engine.prototype.Loop` 内の `lag > LIMIT_LAG` 処理を変更
  - 旧: `lag = 0; return;`（Update全スキップ → 状態マシン不整合リスク）
  - 新: `lag = MPU;`（1フレーム分にクランプ → 非現実的な時間ジャンプを破棄しつつUpdate1回を保証）
  - `LIMIT_LAG` の意図 and 設計根拠を詳細コメントとして追記（"Fix Your Timestep!" 参照）

---

## [1.1.0] - 2026-06-16

### [Fixed]
- **[ISSUE-11]** 未使用ローカル変数の警告解消 (`JSC_UNUSED_LOCAL_ASSIGNMENT`)
  - `entities.js` の `Race.prototype.Ranks` 内の `len` を削除
  - `main.js` の `GameDirector.prototype.OnLogMessage` 内の `message` を削除
  - `main.js` の `OddsTable` コンストラクタ内の `o` を削除
  - Closure Compiler 警告を0件に解消

### [Added]
- **[ISSUE-10]** `--jscomp_warning=reportUnknownTypes` による型定義チェックの厳格化
  - 型カバレッジ 97.0% を達成（全48テストがPASS）

---

## [1.1.0-rc.1] - 2026-06-15

### [Fixed]
- **[ISSUE-07]** シーン遷移・テスト実行時における `Cannot read properties of null` エラーを修正
  - `FPSLayer`, `ResultSceneLayer`, `TitleSceneLayer` 等の `OnExit` / `OnUpdate` にDOMヌルチェックを追加
  - 単体テストで `layer.OnExit()` を明示的に呼び出し、リソース解放を徹底

### [Added]
- **[ISSUE-03]** マスターデータの値バリデーション機能 `ValueChecker` を `checker.js` に実装
  - バリデーションルール: `min`（最小値）, `nonEmpty`（非空）, `regex`（正規表現）, `in`（列挙値）
  - 単体テストを `template_test.js` に追加
- テストランナーを拡張：実行件数・成否サマリー・個別テスト結果（PASS/FAIL）をコンソール出力

### [Docs]
- リポジトリ内全ドキュメントのファイルリンクを絶対パスから相対パスへ変換 ([ADR-06])

---

## [1.0.1] - 2026-06-14

### [Fixed]
- **[ISSUE-04]** レンダラー（View）とコントローラー/モデルの密結合を解消
  - `Events.Race.OnChanged` イベントによるPub/Sub駆動型アーキテクチャへ移行 ([ADR-05])
  - `RacetrackLayer` / `OddsTableLayer` から `Game.SceneDirector` への直接参照を除去

### [Security]
- テンプレートエンジン (`template.js`) の `eval` を廃止し、`with` ステートメントへ移行 ([ADR-03])
- `innerHTML` の完全廃止: `DocumentFragment` を用いたDOM操作へリファクタリング

### [Changed]
- Google Closure Compiler を最新版 (`closure-compiler-v20260602.jar`) にアップグレード ([ADR-04])
- `Locator` の内部実装を ES6 `Map` に変更（コンストラクタ関数をキーに使用する際の安全性向上）
- `Game.Bootstrap` の明示的な初期化フローを導入（bootstrap処理の整理）
- GitHub Actions での Jekyll ビルドエラー対策として `.nojekyll` を導入

### [Added]
- `LaneRendererTest`, `BootstrapTest` の単体テストを追加・検証
- テンプレートエンジン: `try/except/else/finally` ブロックのサポートを追加 ([ADR-03])
- テンプレートエンジン: `elif` ディレクティブのサポートを追加 ([ADR-03])
- テンプレートエンジン: Tornado v6.6.dev1 との100%の構文互換性を確保

---

## [1.0.0] - 2026-06-13

### [Added]
- リポジトリ全体のドキュメント再編成および文書管理ルールの構築
  - `MNG-01`: ドキュメント台帳の整備
  - `MNG-02`: 開発プロセス定義書の整備（旧 `memo-ja.md` からの移植）
  - `MNG-03`: 問題管理定義書の整備
  - `REQ-01`, `REQ-02`, `REQ-03`: 要件定義書群の整備
  - `DSN-01`, `DSN-02`: 設計書の整備
  - `USR-01`: 公式ルールブック・操作マニュアルの整備
  - `ADR-01`〜`ADR-06`: アーキテクチャ決定記録の整備

---

## 開発初期 (2017年)

> 以下は開発初期の主要な機能追加の記録です。詳細は [MNG-02-development_process.md](docs/MNG-02-development_process.md) の開発歴史ログを参照してください。

### [0.3.0] - 2017-06-01
- `[Added]` ベット機能の着手（`Bet` オブジェクト、`GamePlayer` オブジェクトの仮実装）
- `[Added]` オッズテーブルの表示レイヤー (`OddsTableLayer`) の追加

### [0.2.0] - 2017-05-09
- `[Added]` Undo機能の追加（`CommandExecuter`, `PlayCardCommand` によるコマンドパターン）
- `[Added]` `CardEffect` インターフェースおよび `StepCardEffect` の追加
- `[Added]` StubLoaderによるCSVデータ読み込み

### [0.1.0] - 2017-05-01
- `[Added]` シード値ベース乱数生成器 (Xorshift) の実装
- `[Added]` Fisher–Yates シャッフルアルゴリズムの実装

### [0.0.1] - 2017-04-17
- `[Added]` ゲームエンジンメインループの初期実装
- `[Added]` `requestAnimationFrame` ベースのレンダリングサイクル

[Unreleased]: https://github.com/rokujyouhitoma/horse-racing-game-js/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/rokujyouhitoma/horse-racing-game-js/compare/v1.0.1...v1.1.0
[1.1.0-rc.1]: https://github.com/rokujyouhitoma/horse-racing-game-js/compare/v1.0.1...v1.1.0-rc.1
[1.0.1]: https://github.com/rokujyouhitoma/horse-racing-game-js/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/rokujyouhitoma/horse-racing-game-js/releases/tag/v1.0.0
