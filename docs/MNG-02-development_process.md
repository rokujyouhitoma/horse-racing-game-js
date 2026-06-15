# [MNG-02] 開発プロセス定義書 (Development Process Definition) - horse-racing-game-js

本ドキュメントは、「`horse-racing-game-js`」開発における設計方針、プロセス（工程）、用語定義（用語集）、およびこれまでの開発歴史（開発ログ）をまとめたものです。

---

## 1. 開発方針 (Development Policies)

本プロジェクトを円滑に進め、プロダクトの持続的な品質と速度を確保するため、以下の開発方針を適用します。

### 1.1 反復的かつインクリメンタルな開発プロセス (Iterative & Incremental)
本システムは単一の完成形を一度に構築するのではないため、コア機能から段階的に構築・検証を繰り返す「反復的かつインクリメンタル」な手法を採用します。
* **インクリメンタル（段階的）**: 
  1. ゲームループとシーン管理・ルーティング（ベースライン）
  2. カードのパースと効果適用（コアロジック）
  3. レース進行とUndo/Redo機能
  4. ベットとオッズ計算（ロジックおよびUI）
  5. データ検証（RelationshipChecker / ValueChecker）
  のように、動作可能なインクリメントを段階的に追加します。
* **反復的（イテレーティブ）**: 
  各インクリメントごとに「要求定義・要件定義・設計・実装・検証」のサイクルを反復的に回し、テスト結果やユーザーレビューに基づくフィードバックを素早く取り込んで設計・実装を磨き上げます。

### 1.2 優先順位の定義
ゲームシステムの基本動作を早急に検証するため、開発初期段階においては以下の優先順位を徹底します。
1. **ゲームロジックおよびエンジン基盤の完成** (優先度: 高)
2. **デザインや装飾（見た目）の作り込み** (優先度: 低・初期段階はスタブやダミー表示で対応)

### 1.3 ドキュメント管理の重要性と一元管理
本プロジェクトにおいて、ドキュメントはソースコードと同等にプロダクトの品質、整合性、および持続可能性を支える極めて重要な成果物であり、文書管理を開発プロセスと一律に扱います。
* **MarkdownによるGit管理**: すべての設計書、要件定義、マニュアル、意思決定書は Markdown 形式で記述し、`docs/` ディレクトリでコードと共に入力・更新管理を行います。
* **分類プレフィックスの適用**: ドキュメントの影響範囲を明確化するため、[MNG-01-document_ledger.md](MNG-01-document_ledger.md) で定義されたプレフィックス（`MNG`, `REQ`, `DSN`, `USR`, `ADR`）を厳格に適用します。

---

## 2. 設計方針 (Design Policies)

保守性、拡張性、および技術的整合性を最大化するため、システム設計において以下の基本方針を適用します。

### 2.1 TOGAF EA（エンタープライズアーキテクチャ）の適用
システムの全体最適とビジネス（ゲーム体験）価値の最大化、将来の拡張性を担保するため、TOGAF（The Open Group Architecture Framework）の考え方に基づき、以下のアーキテクチャドメインで設計を整理します。

1. **ビジネスアーキテクチャ (BA)**:
   - 競馬ボードゲームとしての楽しさ、戦略的な駆け引き、対象とするユースケースや作品の範囲の整理。
   - [REQ-01-user_requirements.md](REQ-01-user_requirements.md) （要求定義書）にて表現。
2. **情報システムアーキテクチャ (機能・データ要件)**:
   - ビジネス要求をシステム仕様に翻訳した機能的・非機能的な要件。オッズ、カードのパース、Undo機能などのゲーム仕様。
   - [REQ-03-system_requirements.md](REQ-03-system_requirements.md) （要件定義書）にて定義。
3. **アプリケーションアーキテクチャ (AA)**:
   - アプリケーションのコンポーネント構成（シーンディレクター、パブリッシャー、サービスロケーターなどの疎結合設計）。
   - [DSN-01-high_level_design.md](DSN-01-high_level_design.md) （基本設計書）にて定義。
4. **データアーキテクチャ (DA)**:
   - スタブデータ形式、キャスト処理、モデル定義、データ検証ルールの物理スキーマ。
   - [DSN-02-low_level_design.md](DSN-02-low_level_design.md) （詳細設計書）にて定義。
5. **テクノロジーアーキテクチャ (TA)**:
   - 実行プラットフォーム（ブラウザ）、動作環境、開発技術（HTML5、バニラJS、Closure Compiler、CSS HSLによる色管理）。
   - [DSN-01-high_level_design.md](DSN-01-high_level_design.md) および [DSN-02-low_level_design.md](DSN-02-low_level_design.md) にて定義。

### 2.2 HLD（基本設計）とLLD（詳細設計）の明確な分離
アーキテクチャの変更容易性と実装の効率性を高めるため、基本設計（High-Level Design: HLD）と詳細設計（Low-Level Design: LLD）の抽象度と関心領域を明確に分けます。

| 項目 | 基本設計 (HLD) | 詳細設計 (LLD) |
| :--- | :--- | :--- |
| **主な目的** | システム構成・機能分割・論理データフローの決定 | 実装担当者・AIが迷いなくコーディングできる詳細仕様の確立 |
| **抽象度** | 論理レベル（どのようなコンポーネント・データが存在するか） | 物理レベル（実際にどうプログラムで表現し、計算するか） |
| **関心領域** | システム全体構造、画面遷移、カラー変数名、セキュリティ設計方針 | 関数名、状態変数名、具体的な正規表現、計算式、データ構造 |
| **インプット** | 要件定義書 (REQ-03) | 基本設計書 (DSN-01) |
| **アウトプット** | [DSN-01-high_level_design.md](DSN-01-high_level_design.md) | [DSN-02-low_level_design.md](DSN-02-low_level_design.md) |

### 2.3 ADR（Architecture Decision Record）の導入による意思決定の記録
プロジェクトにおける重要な設計上の意思決定（アーキテクチャの選定、技術スタックの採用、複雑なアルゴリズムの選定など）およびその背景・影響を明確に記録し、後から追跡可能にするため、**ADR (Architecture Decision Record)** の概念を導入します。

* **目的**:
  - 設計時のトレードオフや前提条件を明文化し、意思決定のブラックボックス化を防ぐ。
  - 将来のリファクタリングや仕様変更時に、当時の設計意図（コンテキスト）を参照できるようにする。
* **ADRの構成テンプレート**:
  - **タイトル / ID**: 例 `ADR-01: Vanilla JS アーキテクチャの採用`
  - **日付 (Date)**: 意思決定を行った日付
  - **ステータス (Status)**: 提案中 (Proposed) / 承認済 (Accepted) / 却下 (Rejected) / 置き換え済 (Superseded)
  - **コンテキスト (Context)**: 解決すべき課題、制約事項、技術的背景、検討した選択肢
  - **意思決定 (Decision)**: 最終的に選択したアプローチとその具体的な設計内容
  - **結果 (Consequences)**: 意思決定に伴う影響（メリット・デメリット、発生する追加タスク、技術的負債など）
* **管理方法**:
  - ADRは個別のMarkdownファイルとして `docs/adr/` ディレクトリに格納され、ドキュメントの更新履歴とともにGitでバージョン管理されます。

---

## 3. 用語集 (Glossary)

ゲーム内の仕様とコードの変数名・関数名を一致させるため、以下の用語定義を使用します。

| 用語 | 英語表記 | 定義・説明 |
| :--- | :--- | :--- |
| **馬番 (ゼッケン)** | `horse number` | モンスター（出走馬）を識別するための 1 から 5 までの固有 ID。 |
| **フルフィールド** | `full field` | 全出走馬（全5頭）が揃っている状態。 |
| **ゲート** | `gate` | スタート地点 (座標 0)。 |
| **走者** | `runner` | レーン（Lane）を進む対象であるモンスター。 |
| **着順** | `order of finish` | ゴールライン (70マス) を通過した順位。 |
| **馬連** | `quinella` | 1着と2着に入る組み合わせを、着順に関係なく（順不同で）予想するベット方式。 |

---

## 4. 開発歴史ログ (Development History Log)

プロジェクト開始からこれまでのマイルストーン別のコミット・開発内容の記録です（旧 `memo-ja.md` からの移植）。

### 2026年6月
* **2026.6.15**:
  * **ヌルチェック強化**: レース終了時やシーン遷移、テスト実行時における `Cannot read properties of null` エラー（DOM非存在下での操作）のクラッシュ防止対策。各描画レイヤー（`FPSLayer`, `ResultSceneLayer`, `TitleSceneLayer` など）の `OnExit` および `OnUpdate` メソッドにDOMの存在確認（ヌルチェック）を追加し、堅牢性を向上。また、単体テストで `layer.OnExit()` を明示的に呼び出すことで、テスト終了後のリソース解放とイベント購読解除を徹底。さらに、自作の簡易テストランナー (`template_test.js`) を拡張し、テストの実行件数や成否のサマリー、個々のテスト結果（PASS/FAIL）がコンソールへ詳細に出力されるよう改善。
  * **値バリデータの追加 (ISSUE-03)**: マスターデータの値バリデーション機能である `ValueChecker` クラスを [checker.js](../../src/js/game/checker.js) に実装。メタデータ定義に値検証ルール（`min`, `nonEmpty`, `regex`, `in`）を追加し、起動時に全マスターデータの整合性チェックを走らせるようにしました。あわせて [template_test.js](../../src/js/lib/template_test.js) に単体テストを追加。
  * **文書内ファイルリンクの相対パス化**: プロジェクトの可搬性を高めるため、リポジトリ内の全Issue管理ドキュメントおよび各ツールのREADME内に記載されていた絶対パス形式のファイルリンク（`file:///workspace/...`）を、すべて相対パスリンクへと書き換えるクリーンアップを実施。
* **2026.6.14**: レンダラー（View）とコントローラー/モデル間の疎結合化を目的としたPub/Subイベント駆動型（`Events.Race.OnChanged`）の設計への移行（ADR-05）。Closure Compilerのアップグレードに伴うコンパイル警告およびエラーの修正（ADR-04）とキー安全性向上。テンプレートエンジンでの `eval` 回避（`with` ステートメントへの移行によるセキュリティ・性能改善）、GitHub ActionsのJekyllビルドエラー対策（`.nojekyll` の導入とLiquid類似文字のエスケープ）、`innerHTML` の完全廃止（`DocumentFragment` を用いた DOM 操作へのリファクタリング）、初期化フローの整理（明示的な `Game.Bootstrap` の導入）、および新規単体テスト（`LaneRendererTest`, `BootstrapTest`）の追加・検証。また、テンプレートエンジン（`template.js`）を Tornado v6.6.dev1 のテンプレート構文と100%の互換性を確保（`try/except/else/finally` ブロックのサポート、`elif` マッピング、インクルードスタックを考慮したエラー行番号のトレースバックマッピング機能、`posixpath` 相対パス解決の完全実装、 Closure Compiler 警告の完全解消、およびそれらを検証する `template_test.js` 単体テストの拡充）。

* **2026.6.13**: リポジトリ全体のドキュメント再編成および文書管理ルールの再構築。

### 2017年6月
* **2017.6.1**: ベット機能の着手。


### 2017年5月
* **2017.5.31**: テンプレートの整理。
* **2017.5.30**: オッズテーブルの表示部分を進める。
* **2017.5.29**: テンプレートの整理。
* **2017.5.28**: テンプレートの整理。
* **2017.5.27**: `OddsTableLayer` を追加。
* **2017.5.26**: `Bet` オブジェクト、`GamePlayer` オブジェクトを仮実装。
* **2017.5.25**: オッズテーブルを仮実装。
* **2017.5.24**: Templateで `while` 構文、`raw` 構文をサポート。
* **2017.5.23**: Templateで `apply` ブロックをサポート。
* **2017.5.22**: Templateを改善、`Templates` の追加および適用。
* **2017.5.21**: Templateを部分的に適用し使い勝手を確認。パースエンジン追加。entityオブジェクトを `entities.js` に分離。レース結果のオッズを計算。
* **2017.5.20**: オッズ表を仮実装。
* **2017.5.19**: Closure用スタイルシートの導入。
* **2017.5.18**: リザルトシーン追加、デバッグ用オートプレイカード機能追加、`UICustomCheckbox` 追加。
* **2017.5.17**: Closure Compiler (CC) の lint を有効化し、アノテーション追加。リザルトシーン追加。`SceneDirector.prototype.Replace(scene)` を実装。
* **2017.5.16**: デバッグ用 `SampleBallLayer` 追加、`ExEventInfo` 追加によるイベント整理。
* **2017.5.15**: Routerを `CustomSceneDirector` に組み込み、`window.history` および `location` のハッシュ状態をサポート。乱数再現用の Xorshift シード値を表示可能に。
* **2017.5.14**: `window.history` を仮サポート。
* **2017.5.13**: 不要コードの整理、起動時ブート処理のクリーンアップ。デバッグボタン配置。
* **2017.5.12**: HTML描画整理のため `RenderLayers` を導入。`Engine.Loop` を改修。
* **2017.5.11**: `Engine.Loop` を改修。`NoneCardEffect` オブジェクトを追加。Xorshift シード値をデバッグ用に内部保持。
* **2017.5.10**: DOM操作タスクの最終更新処理用 `Game.DOMTaskExecuter` の追加。`FunctionCommand` / `BasicExecuter` 追加。`IGameObject` インターフェースおよび `LastUpdate` の追加。アノテーションの適用。
* **2017.5.9**: Undo機能の追加（レース中のカードプレイを巻き戻し）。`CardEffect` インターフェースおよび `StepCardEffect` 追加。`PlayCardCommand`、`CommandExecuter` 追加。Makefileの整理。Publisherを `src/game/lib/publisher.js` に分離。`MasterMeta` オブジェクト追加。
* **2017.5.8**: `MenuUI` オブジェクト追加。`SceneDirector` および `PlayCardDirector` のバグ修正。`LogMessageUI`、`Game.Log` 追加。`main.css` で基本デザインを構築。アノテーション適用。StubLoaderの概念を追加し、CSVデータをスタブから読み込む。タイトルシーン追加。
* **2017.5.7**: Game固有処理を `GameDirector` に移譲、Gameオブジェクトは共通処理に専念。ExEventTargetのディスパッチ処理修正。Publisherへのマウント切り替え。`ExEventTarget.removeEventListener` のバグ修正。
* **2017.5.6**: ゲームスタート関連処理の見直し、`event.js` のバグ修正。モジュールの整理、ディレクトリ分割およびCCコンパイル設定の修正。`SceneDirector.ToDepth()` を実装。
* **2017.5.5**: Closure Compilerの導入。EventTargetの receiver 対応。
* **2017.5.4**: `GameScene` 追加。`Scene` / `SceneDirector` 追加。
* **2017.5.3**: MasterDataのデータフォーマットをCSV管理しやすい形式に修正。RelationshipCheckerで `Equal` 条件をサポート。Publisher.Subscribeでオプションのチャンネル指定をサポート。
* **2017.5.2**: `RelationshipChecker` を仮実装。
* **2017.5.1**: `Xorshift` 実装。`Fisher–Yates shuffle` をユーティリティに切り出し。EventListenerの探索を $O(n)$ から $O(1)$ へ最適化。

### 2017年4月
* **2017.4.30**: 順位カードの効果を実装。`DebugButton` オブジェクトを追加。
* **2017.4.29**: ステップカードの効果を実装。`Repository` オブジェクトを追加。
* **2017.4.28**: `CardDetail`, `StepCardDetail`, `RankCardDetail`, `DashCardDetail`, `PlayCard` オブジェクトを追加。
* **2017.4.27**: MasterDataに `StepCardDetail` などの定義を追加。イベント処理の整理。
* **2017.4.26**: イベントシステムの追加。
* **2017.4.25**: 着順計算の実装。デバッグメニューにゲームリセット機能を配置。
* **2017.4.24**: デバッグメニュー追加、スタイルシートの適用による見栄えの仮調整。JavaScriptに `"use strict"` を適用。
* **2017.4.23**: レーストラックをレンダリング。`CourseRenderer`, `LaneRenderer`, `Renderer`, `FPSRenderer` などを整理。
* **2017.4.22**: モデルオブジェクトのドラフト実装。MasterDataに `id` カラムを追加。
* **2017.4.21**: `Lane` に走者概念を導入。GameObjectの `Start`/`Update`/`Destroy` を `OnStart`/`OnUpdate`/`OnDestroy` にリネーム。子オブジェクトの再帰呼び出し設計。
* **2017.4.20**: `Racetrack` のドラフト実装。GameBoardがRacetrackを内包。
* **2017.4.19**: スタブデータの構築。`GameObject` のドラフト実装とリセット機能。
* **2017.4.18**: FPS表示機能。`Figure`, `Coin`, `MonsterFigure` のドラフト実装。
* **2017.4.17**: Engineメインループの実装。
