# [MNG-02] 開発プロセス定義書 (Development Process Definition) - horse-racing-game-js

本ドキュメントは、「`horse-racing-game-js`」開発における設計方針、プロセス（工程）、用語定義（用語集）、およびこれまでの開発歴史（開発ログ）をまとめたものです。

---

## 1. 開発方針 (Development Policies)

迅速な開発とコード品質の維持のため、以下の基本方針を適用しています。

### 1.1 優先順位の定義
ゲームシステムの基本動作を早急に検証するため、以下の優先順位を徹底します。
1. **ゲームロジックおよびエンジン基盤の完成** (優先度: 高)
2. **デザインや装飾（見た目）の作り込み** (優先度: 低・初期段階はスタブやダミー表示で対応)

### 1.2 TOGAF EA（エンタープライズアーキテクチャ）の適用
システムの整合性を整理するため、TOGAFに基づき以下のアーキテクチャドメインで成果物を整理します。
* **ビジネスアーキテクチャ (BA)**: 競馬ボードゲームとしての楽しさ、戦略的な駆け引き。 [REQ-01](REQ-01-user_requirements.md) にて表現。
* **情報システムアーキテクチャ (機能・データ要件)**: オッズ、カードのパース、Undo機能などのゲーム仕様。 [REQ-03](REQ-03-system_requirements.md) にて定義。
* **アプリケーションアーキテクチャ (AA)**: シーンディレクター、パブリッシャー、サービスロケーターなどの疎結合設計。 [DSN-01](DSN-01-high_level_design.md) にて定義。
* **データアーキテクチャ (DA)**: スタブデータ形式、キャスト処理、モデル定義。 [DSN-02](DSN-02-low_level_design.md) にて定義。
* **テクノロジーアーキテクチャ (TA)**: HTML5、バニラJS、Closure Compiler、CSS HSLによる色管理。 [DSN-01](DSN-01-high_level_design.md) および [DSN-02](DSN-02-low_level_design.md) にて定義。

---

## 2. 用語集 (Glossary)

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

## 3. 開発歴史ログ (Development History Log)

プロジェクト開始からこれまでのマイルストーン別のコミット・開発内容の記録です（旧 `memo-ja.md` からの移植）。

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
