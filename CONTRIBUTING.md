# Contributing to horse-racing-game-js

本ドキュメントは、「`horse-racing-game-js`」への開発参加（コントリビューション）ルールを定義します。個人開発からチーム開発・OSS公開へ移行する際に、外部の開発者が迷うことなく円滑に参加できるようにするためのルールブックです。

---

## 目次 (Table of Contents)

1. [開発環境のセットアップ](#1-開発環境のセットアップ)
2. [ディレクトリ構造](#2-ディレクトリ構造)
3. [コーディング規約](#3-コーディング規約)
4. [Gitブランチ戦略](#4-gitブランチ戦略-github-flow)
5. [アセット管理ルール](#5-アセット管理ルール)
6. [ドキュメント管理ルール](#6-ドキュメント管理ルール)
7. [プルリクエストのガイドライン](#7-プルリクエストのガイドライン)
8. [バグ報告・機能提案](#8-バグ報告機能提案)

---

## 1. 開発環境のセットアップ

### 1.1 前提条件

| ツール | バージョン | 用途 |
| :--- | :--- | :--- |
| **Java** | 11以上 | Google Closure Compiler / Closure Stylesheets の実行 |
| **Node.js** | 18以上 | `make test` でのテスト実行 |
| **Git** | 2.x以上 | バージョン管理 |
| **モダンブラウザ** | Chrome / Edge / Firefox / Safari 最新版 | 動作確認・デバッグ |

> [!NOTE]
> npm、webpack等のフロントエンドビルドツールは**不要**です。本プロジェクトはVanilla JSで構築されており、`Makefile` のみでビルドが完結します。

### 1.2 セットアップ手順

```bash
# 1. リポジトリをクローンする
git clone https://github.com/rokujyouhitoma/horse-racing-game-js.git
cd horse-racing-game-js

# 2. 動作確認（インストール不要でブラウザで開くだけ）
# Pythonによる簡易サーバーを起動する場合:
python3 -m http.server 8000
# → ブラウザで http://localhost:8000 を開く

# 3. テストを実行する
make test

# 4. ビルド（コンパイル済み版の生成）
make
# → main-min.js, main-min.css が生成される
# → compiled.html をブラウザで開いて確認する
```

### 1.3 開発時の動作確認

ビルド不要でソースファイルを直接ブラウザで開いて確認できます。

```bash
# index.html を直接開く（推奨：ファイルサーバー経由）
python3 -m http.server 8000
# → http://localhost:8000/index.html
```

ブラウザの開発者ツール（F12）→ **Console** タブでテンプレートエンジンのデバッグログ、バリデーションエラー、FPS値などを確認できます。

---

## 2. ディレクトリ構造

```
horse-racing-game-js/
├── docs/                          # プロジェクト管理・仕様・設計ドキュメント
│   ├── adr/                       # アーキテクチャ決定記録 (ADR-01〜)
│   ├── issue/                     # 課題管理ドキュメント (ISSUE-01〜)
│   ├── GDD-01-game_design_document.md   # ゲームデザインドキュメント
│   ├── MNG-01-document_ledger.md  # ドキュメント台帳（全文書の一覧）
│   ├── MNG-02-development_process.md    # 開発プロセス定義書
│   ├── MNG-03-problem_management.md     # 問題管理定義書
│   ├── MNG-04-test_plan.md        # ソフトウェアテスト計画書
│   ├── REQ-01-user_requirements.md      # 要求定義書
│   ├── REQ-02-feature_list.md     # 機能一覧
│   ├── REQ-03-system_requirements.md    # 要件定義書
│   ├── DSN-01-high_level_design.md      # 基本設計書
│   ├── DSN-02-low_level_design.md       # 詳細設計書
│   └── USR-01-user_manual.md      # 公式ルールブック・操作マニュアル
│
├── src/
│   ├── css/
│   │   └── main.css               # メインスタイルシート（HSLカラー変数管理）
│   └── js/
│       ├── lib/                   # 汎用ライブラリ層（ゲームに非依存）
│       │   ├── xorshift.js        # シード指定乱数生成器
│       │   ├── event.js           # カスタムイベントシステム (ExEvent)
│       │   ├── locator.js         # サービスロケーター
│       │   ├── router.js          # URLハッシュベースのルーター
│       │   ├── template.js        # Tornado互換テンプレートエンジン
│       │   └── template_test.js   # 単体テストスイート（make testで実行）
│       └── game/                  # ゲーム固有ロジック層
│           ├── lib/               # ゲームエンジン基盤
│           │   ├── engine.js      # メインゲームループ
│           │   ├── scene.js       # シーン管理
│           │   ├── repository.js  # データリポジトリ
│           │   ├── publisher.js   # Pub/Subイベントバス
│           │   └── command.js     # コマンドパターン（Undo/Redo）
│           ├── layers/            # UIレイヤー（View層）
│           ├── renderers/         # 描画コンポーネント
│           ├── events.js          # ゲーム固有イベント定義
│           ├── templates.js       # HTMLテンプレート定義
│           ├── entities.js        # ゲームエンティティ（Race, Racetrack等）
│           ├── checker.js         # マスターデータ検証 (RelationshipChecker, ValueChecker)
│           └── main.js            # ゲームメイン・エントリーポイント
│
├── tools/                         # ビルドツール（バイナリ）
│   ├── closure-compiler/          # Google Closure Compiler
│   └── closure-stylesheets/       # Google Closure Stylesheets
│
├── index.html                     # 開発用エントリーポイント（ソースファイル直読み）
├── compiled.html                  # プロダクション用エントリーポイント（minified JS使用）
├── main-min.js                    # [生成物] コンパイル済みJS（make allで生成）
├── main-min.css                   # [生成物] コンパイル済みCSS（make allで生成）
├── Makefile                       # ビルド設定
├── CHANGELOG.md                   # チェンジログ
└── CONTRIBUTING.md                # 本ドキュメント
```

---

## 3. コーディング規約

### 3.1 JavaScript

本プロジェクトは **Vanilla JavaScript (ES6) + Google Closure Compiler** を使用します。

**基本ルール**:

- `"use strict";` を全ファイルの先頭に記述する。
- 変数宣言は `var` を使用（`let`/`const` への移行は [ISSUE-05](docs/issue/ISSUE-05-coding_standards_mixture.md) で計画中）。
- 全クラス・全関数に **JSDocアノテーション**を付与すること（Closure Compilerの型チェックに必要）。

**JSDocの必須タグ**:

```javascript
/**
 * @constructor
 * @param {string} name モンスターの名前
 * @param {number} id 馬番 (1-5)
 */
var HorseFigure = function(name, id) { ... };

/**
 * @param {!Race} race レースオブジェクト
 * @return {number} 着順 (1-5)
 */
HorseFigure.prototype.getRank = function(race) { ... };
```

**禁止事項**:

| 禁止 | 理由 | 代替手段 |
| :--- | :--- | :--- |
| `innerHTML` への直接代入 | XSS脆弱性 | `DocumentFragment` + `createElement` |
| `eval()` の使用 | セキュリティリスク | `new Function()` + `with` ステートメント（テンプレートエンジン内のみ許可） |
| グローバル変数の新規追加 | スコープ汚染 | `Game` 名前空間内に配置 |
| 外部npmパッケージの追加 | ファイルサイズ増大 | 標準ブラウザAPI・自作ライブラリで対応 |

### 3.2 CSS

- CSSカラーは **HSL形式** で管理し、CSS変数（カスタムプロパティ）を使用する。
- クラス名は `BEM記法` を採用する（例: `block__element--modifier`）。
- Closure Stylesheetsでコンパイルされるため、`@def` による変数定義を優先する。

### 3.3 HTML

- `id` 属性はJavaScript連携に使用するため、命名はキャメルケースで一意性を保つこと。
- テンプレートファイルは `src/js/game/templates.js` に定義し、直接HTMLに埋め込まない。

---

## 4. Gitブランチ戦略 (GitHub Flow)

本プロジェクトは **GitHub Flow** を採用します。

```
main ──●──────────────────────────────────● (リリース・マージ)
        \                                /
         ●──●──● feature/your-feature ──●  (機能開発ブランチ)
```

### 4.1 ブランチ命名規則

| 種別 | 命名規則 | 例 |
| :--- | :--- | :--- |
| 新機能追加 | `feature/<機能名>` | `feature/bet-ui` |
| バグ修正 | `fix/<問題ID>-<概要>` | `fix/issue-01-card-stack` |
| ドキュメント更新 | `docs/<内容>` | `docs/update-adr-07` |
| パフォーマンス改善 | `perf/<内容>` | `perf/fps-optimization` |
| リファクタリング | `refactor/<内容>` | `refactor/event-system` |

### 4.2 ワークフロー

1. `main` から新しいブランチを作成する。
2. 変更を加え、`make test` でテストが全件PASSすることを確認する。
3. `make` でビルドが成功することを確認する。
4. プルリクエスト（PR）を作成し、レビューを受ける。
5. 承認後に `main` へマージする。

> [!IMPORTANT]
> `main` ブランチへの直接プッシュは禁止です。必ずPRを経由してください。

### 4.3 コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠します。

```
<type>(<scope>): <summary>

[optional body]
[optional footer]
```

| type | 用途 |
| :--- | :--- |
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `refactor` | 機能変更を伴わないコード変更 |
| `perf` | パフォーマンス改善 |
| `test` | テストの追加・修正 |
| `chore` | ビルドツール・補助ツールの変更 |
| `balance` | ゲームバランスパラメータの調整 |

**例**:
```
feat(bet): ベットUI（コイン選択）の初期実装

FEAT-014 に対応するUI実装。
オッズテーブルの各行にコイン枚数入力フィールドを追加。
```

---

## 5. アセット管理ルール

### 5.1 画像

| 形式 | 用途 | 制限 |
| :--- | :--- | :--- |
| **WebP** | UI画像・モンスターアイコン（推奨） | 1ファイルあたり50KB以下 |
| **PNG** | 透過が必要な画像 | 1ファイルあたり100KB以下 |
| **SVG** | アイコン・ベクター素材 | 外部参照・スクリプト埋め込み禁止 |

- 画像は `src/assets/images/` ディレクトリに配置する（現時点では未作成）。
- 圧縮前後のファイルを両方保存しない。Git管理は圧縮後のみとする。

### 5.2 音声（将来実装時）

| 形式 | 用途 | 制限 |
| :--- | :--- | :--- |
| **OGG** | BGM・SE（優先） | BGMは3MB以下、SE各音源は100KB以下 |
| **MP3** | Safari等OGG非対応ブラウザ向けフォールバック | 同上 |

- 音声ファイルは `src/assets/audio/` に配置する。
- ビットレート: SE は 128kbps、BGM は 192kbps を上限とする。

---

## 6. ドキュメント管理ルール

本プロジェクトのドキュメントは [docs/MNG-01-document_ledger.md](docs/MNG-01-document_ledger.md) で一元管理されています。

### 6.1 基本ルール

- ドキュメントはMarkdown形式で `docs/` ディレクトリに配置する。
- ファイル名のプレフィックス（`MNG`, `REQ`, `DSN`, `USR`, `ADR`, `GDD`）を必ず適用する。
- ドキュメント内のファイルリンクは **相対パス** を使用する（絶対パス禁止 — [ADR-06](docs/adr/ADR-06-document-portability-via-relative-links.md) 参照）。
- 新しいドキュメントを追加したら、必ず [MNG-01-document_ledger.md](docs/MNG-01-document_ledger.md) の台帳に追記する。

### 6.2 ADRの追加手順

アーキテクチャ上の重要な決定を行った場合は、以下の手順でADRを追加してください。

1. `docs/adr/ADR-XX-<概要>.md` を作成する（XX は次の連番）。
2. [MNG-01-document_ledger.md](docs/MNG-01-document_ledger.md) の台帳に追記する。
3. ADRテンプレートに従い、Context / Decision / Consequences を記述する。

---

## 7. プルリクエストのガイドライン

### 7.1 PRチェックリスト

PRを作成する前に、以下を確認してください。

- [ ] `make test` が全件PASSすること
- [ ] `make` でビルドエラーが0件であること
- [ ] 新機能には対応する単体テストを追加していること
- [ ] 変更がゲームバランスに影響する場合、`CHANGELOG.md` に記録していること
- [ ] ドキュメントの変更が必要な場合、対応するMarkdownファイルを更新していること
- [ ] ファイルリンクが相対パスであること（絶対パスを混入させないこと）

### 7.2 PRの記述形式

```markdown
## 概要
<!-- 変更の目的と背景を記述 -->

## 変更内容
<!-- 具体的な変更点をリストアップ -->
- feat: ...
- fix: ...

## テスト結果
<!-- make test の出力を貼り付け -->
```

---

## 8. バグ報告・機能提案

### 8.1 バグ報告

バグを発見した場合は、以下の情報を `docs/issue/` に新規ISSUEドキュメントとして作成し、[MNG-03-problem_management.md](docs/MNG-03-problem_management.md) の台帳に追記してください。

**ISSUEドキュメントに含める情報**:
- 再現手順（ステップバイステップ）
- 期待される動作
- 実際の動作
- ブラウザ・OS情報
- コンソールエラーログ（あれば）
- 乱数シード値（再現に必要な場合）

### 8.2 機能提案

新機能の提案は、以下のプロセスで行います。

1. [REQ-01-user_requirements.md](docs/REQ-01-user_requirements.md) のユースケースとの整合性を確認する。
2. [GDD-01-game_design_document.md](docs/GDD-01-game_design_document.md) のゲームビジョンとコアバリューに沿っているか確認する。
3. GitHubのIssueまたはDiscussionで提案を投稿する。
4. 採用された場合は [REQ-02-feature_list.md](docs/REQ-02-feature_list.md) に追記される。

---

## ライセンス

コントリビューションを行うことで、あなたの提供したコードがプロジェクトのライセンス条件に従って配布されることに同意したものとみなします。詳細はリポジトリのライセンスファイルを参照してください。
