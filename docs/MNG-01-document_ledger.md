# [MNG-01] 文書管理・ドキュメント台帳 (Document Management & Ledger) - horse-racing-game-js

本ドキュメントは、「`horse-racing-game-js`」プロジェクトにおいて作成・維持されるすべてのドキュメントの台帳であり、ドキュメントごとの目的、分類規則、および更新契機を定義します。

---

## 1. 文書管理方針 (Document Management Policy)

本プロジェクトでは、仕様とコードの整合性を維持し、将来の拡張性や引き継ぎを円滑にするため、文書をコードと同等に管理します。
* **MarkdownによるGit管理**: すべての設計書、要件定義、マニュアル、意思決定書は Markdown 形式で記述し、`docs/` ディレクトリで一元管理します。
* **分類プレフィックスルール**: 変更時の影響範囲を抑え、役割を明確化するため、以下のプレフィックスをファイル名に冠します。
  * **`MNG` (Management)**: 文書管理、開発プロセス、課題管理、テスト管理などのプロジェクト運営文書。
  * **`REQ` (Requirements)**: 要求定義、要件定義、機能一覧などの要件仕様文書。
  * **`DSN` (Design)**: 基本設計 (HLD)、詳細設計 (LLD) などの技術設計文書。
  * **`USR` (User Documentation)**: 一般ユーザー・デバッガー向けの公式ルールブック・操作マニュアル。
  * **`ADR` (Architecture Decision Records)**: アーキテクチャ上の主要な意思決定とその根拠の記録。

---

## 2. ドキュメント台帳 (Document Ledger)

現在プロジェクトで定義・維持されているドキュメントの一覧です。

| 文書コード | 文書名 | ファイルパス | 目的 (Purpose) | 更新契機 (Trigger) |
| :--- | :--- | :--- | :--- | :--- |
| **[MNG-01]** | 文書管理・ドキュメント台帳 | [MNG-01-document_ledger.md](MNG-01-document_ledger.md) | 管理対象ドキュメントの定義・分掌ルールの管理。 | ドキュメントの追加・削除、構成変更時。 |
| **[MNG-02]** | 開発プロセス定義書 | [MNG-02-development_process.md](MNG-02-development_process.md) | 反復型プロセス、アーキテクチャ方針、用語集、および開発履歴の管理。 | 開発方針の変更、マイルストーン完了時。 |
| **[MNG-03]** | 問題管理定義書 | [MNG-03-problem_management.md](MNG-03-problem_management.md) | 不具合の対応フローと、検出された課題・タスクの追跡管理。 | 新たなバグの検知、課題解決時。 |
| **[REQ-01]** | 要求定義書 | [REQ-01-user_requirements.md](REQ-01-user_requirements.md) | ターゲットユーザー、ビジネス価値、および想定ユースケースの整理。 | ビジネス要求やターゲットスコープの変更時。 |
| **[REQ-02]** | 機能一覧 | [REQ-02-feature_list.md](REQ-02-feature_list.md) | 実装済み・未実装機能のトレーサビリティおよび対応ステータスの管理。 | 新機能の設計・実装完了時。 |
| **[REQ-03]** | 要件定義書 | [REQ-03-system_requirements.md](REQ-03-system_requirements.md) | システム要件、オッズ仕様、カード効果などの詳細な数値仕様定義。 | ルールやゲームバランス、動作プラットフォーム要件の変更時。 |
| **[DSN-01]** | 基本設計書 | [DSN-01-high_level_design.md](DSN-01-high_level_design.md) | システム全体構成、Pub/Sub境界、論理アーキテクチャの定義。 | 基本アーキテクチャの変更時。 |
| **[DSN-02]** | 詳細設計書 | [DSN-02-low_level_design.md](DSN-02-low_level_design.md) | クラス構造、ループの仕組み、パース規則、Undo仕様などの物理設計。 | データ構造、クラス構成の変更時。 |
| **[USR-01]** | 公式ルールブック・操作マニュアル | [USR-01-user_manual.md](USR-01-user_manual.md) | ゲームの遊び方、オッズ計算、カード詳細、操作UIの解説。 | ルールの変更やUIの大幅な刷新時。 |
| **[ADR-01]** | Vanilla JS アーキテクチャの採用 | [ADR-01-vanilla-javascript-architecture.md](adr/ADR-01-vanilla-javascript-architecture.md) | フレームワーク非依存による超軽量動作決定の意思決定記録。 | 技術方針の決定時。 |
| **[ADR-02]** | カスタムイベントシステムの導入 | [ADR-02-custom-event-system.md](adr/ADR-02-custom-event-system.md) | DOM非依存の bubbling/capturing イベントの自作に関する記録。 | 技術方針の決定時。 |
| **[ADR-03]** | TornadoテンプレートエンジンのJS移植 | [ADR-03-tornado-template-engine-js-port.md](adr/ADR-03-tornado-template-engine-js-port.md) | HTMLテンプレート解釈の高速化と vanilla 化に関する記録。 | 技術方針の決定時。 |
| **[ADR-04]** | Google Closure Compiler Upgrade and Warning Remediation | [ADR-04-closure-compiler-upgrade-and-warning-fixes.md](adr/ADR-04-closure-compiler-upgrade-and-warning-fixes.md) | Upgrading Closure Compiler and fixing warnings/errors. | Decision on warning levels and compiler configs. |
| **[ADR-05]** | Decoupling Renderers and Models via Pub/Sub Event-Driven Architecture | [ADR-05-decoupling-renderers-and-models.md](adr/ADR-05-decoupling-renderers-and-models.md) | Decoupling view layers from controllers and models using events. | Transition to event-driven unidirectional data flow. |
| **[ADR-06]** | Document Portability via Relative Links | [ADR-06-document-portability-via-relative-links.md](adr/ADR-06-document-portability-via-relative-links.md) | Decision on using relative links in repository documents. | Document structure maintenance. |
