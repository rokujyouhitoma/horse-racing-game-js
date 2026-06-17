# [MNG-04] ソフトウェアテスト計画書 (Software Test Plan) - horse-racing-game-js

本ドキュメントは、「`horse-racing-game-js`」の品質保証戦略を定義します。JavaScriptベースのブラウザゲーム特有のリスク（端末ごとの解像度差、非同期処理の競合、メモリリーク、フレームレート低下等）を踏まえ、テストカテゴリごとに基準・手法・担当を明確にし、リリース時の致命的な不具合を未然に防ぎます。

---

## 1. テスト方針 (Test Policy)

### 1.1 テストの目的

- **回帰防止**: コード変更が既存の動作を破壊していないことを継続的に検証する。
- **品質ゲート**: リリース前に最低限のテスト基準を満たすことを保証する。
- **ゲームバランス検証**: 乱数パラメータ（カード枚数・移動量・オッズ）の変更がバランスを著しく崩していないことを統計的に確認する。

### 1.2 テストの基本方針

- テストはソースコードと同じリポジトリ内に配置し、Git管理を行う。
- 自動化可能なテストは `make test` コマンドで実行できるようにする。
- テストの失敗はマージ・リリースのブロック要因とする。

---

## 2. テストカテゴリ一覧 (Test Categories)

| カテゴリ | 目的 | 自動化 | 主な担当 |
| :--- | :--- | :---: | :--- |
| **単体テスト (Unit Test)** | 個々のクラス・関数のロジック検証 | ✅ | 開発者 |
| **統合テスト (Integration Test)** | UIと状態管理の連携検証 | 一部 | 開発者 |
| **パフォーマンステスト (Performance Test)** | 60FPS維持・メモリリーク検出 | 一部 | 開発者 |
| **ゲームバランステスト (Balance Test)** | 統計的なゲームバランス計測 | ✅ | ゲームデザイナー/開発者 |
| **プレイフィールテスト (Playfeel Test)** | 人間の感覚評価・UX品質確認 | ❌ | QA担当/プレイヤー |

---

## 3. 単体テスト (Unit Test)

### 3.1 テスト対象

| 対象モジュール | ファイル | テスト内容 |
| :--- | :--- | :--- |
| テンプレートエンジン | `src/js/lib/template.js` | `{% if %}`, `{% for %}`, `{% while %}`, `{{ var }}` の構文展開 |
| カスタムイベント | `src/js/lib/event.js` | `addEventListener`, `dispatchEvent`, `removeEventListener`, bubbling/capturing |
| 乱数生成器 | `src/js/lib/xorshift.js` | シード固定による再現性検証、数値範囲の確認 |
| データ検証 | `src/js/game/checker.js` | `RelationshipChecker`・`ValueChecker` による制約エラーの検出 |
| レーンレンダラー | `src/js/game/renderers/lanerenderer.js` | DOM生成・更新の正確性 |
| ブートストラップ | `src/js/game/main.js` | `Game.Bootstrap` の初期化フロー |
| エンティティ | `src/js/game/entities.js` | `Race.prototype.Ranks` などの着順計算ロジック |

### 3.2 テスト実行方法

```bash
make test
```

現在のテストランナーは `src/js/lib/template_test.js` に実装された自作の簡易テストランナーです。Node.jsで実行されます。

> [!NOTE]
> **[ISSUE-08]** 将来的に Jest や Mocha などの本格的なテストフレームワークへの移行を予定しています。詳細は [ISSUE-08-modernizing_test_framework.md](issue/ISSUE-08-modernizing_test_framework.md) を参照してください。

### 3.3 合格基準

- 全テストケースが **PASS** であること（0件のFAIL）。
- Closure Compilerによるコンパイル時に **エラー0件** であること。
- `make test` コマンドが正常終了（exit code 0）すること。

### 3.4 テストケース命名規則

```
describe('[テスト対象クラス/機能]', function() {
  it('[期待される動作の説明]', function() { ... });
});
```

---

## 4. 統合テスト (Integration Test)

### 4.1 テスト対象シナリオ

| シナリオID | シナリオ概要 | 検証ポイント |
| :--- | :--- | :--- |
| **INT-01** | タイトル画面 → レース画面への遷移 | シーン切り替え時のDOM状態・イベント購読の引き継ぎ |
| **INT-02** | カードプレイによる馬の移動 | カード効果がレーントラックのDOM表示に正しく反映されること |
| **INT-03** | Undoによる状態巻き戻し | `CommandExecuter` が直前のカード効果を正確に元に戻すこと |
| **INT-04** | ゴール判定 → リザルト画面遷移 | 70マス超で着順確定・シーン自動遷移が発生すること |
| **INT-05** | `Events.Race.OnChanged` イベントによるView更新 | Pub/Sub経由でレンダラーが正しくデータを受信・描画すること |

### 4.2 現在の実施方法

現時点では、統合テストの一部は `make test` の単体テスト内で模擬的に実施しています（`BootstrapTest`, `LaneRendererTest`）。フル統合テストはブラウザ上での手動確認によります。

### 4.3 合格基準

- 各シナリオにおいてコンソールにエラーが出力されないこと。
- DOM操作の前後でメモリリーク（デタッチされたDOM参照の残存）が検出されないこと。

---

## 5. パフォーマンステスト (Performance Test)

### 5.1 測定指標

| 指標 | 目標値 | 計測方法 |
| :--- | :--- | :--- |
| **描画フレームレート (FPS)** | 60FPS維持（許容最低: 30FPS） | ゲーム内FPSカウンター (`FPSLayer`) の目視確認 |
| **初回ロード時間** | 3秒以内（3G回線相当） | `performance.timing` API による計測 |
| **JSファイルサイズ** | コンパイル後150KB以下 | `ls -lh main-min.js` による確認 |
| **メモリ使用量増加** | 5分間プレイ後のHeap増加が10MB以内 | Chrome DevTools → Memory タブ |

### 5.2 テスト手順（FPS / メモリ）

1. `compiled.html` または `index.html` をブラウザで開く。
2. デバッグオートプレイ機能（FEAT-011）を起動し、5分間以上連続で動作させる。
3. Chrome DevTools の **Performance** タブおよび **Memory** タブで計測する。
4. FPS が30FPS を下回るフレームが連続3フレーム以上続く場合は要因を特定して修正する。

### 5.3 パフォーマンス劣化時のチェックリスト

- [ ] ループ内で `document.querySelector` を繰り返し呼んでいないか？
- [ ] `DocumentFragment` を使わずに個別DOMに逐次 `appendChild` していないか？
- [ ] `OnUpdate` イベントリスナー内で重い計算（O(n²)以上）を行っていないか？
- [ ] `removeEventListener` を忘れてリスナーが蓄積していないか？

---

## 6. ゲームバランステスト (Game Balance Test)

### 6.1 目的

ゲームバランスの調整（カード枚数・移動量・オッズの変更）が、以下のKPIを逸脱していないことを確認します。

| KPI | 目標値 |
| :--- | :--- |
| 平均ゲーム終了ターン数 | 25〜40ターン |
| 1番人気（1-2組み合わせ）の的中率 | 25%〜35% |
| ダッシュカード発動率（単独1位・2位存在時） | 50%以上 |

### 6.2 テスト手順

1. デバッグオートプレイ機能（FEAT-011）を100ゲーム以上連続実行する。
2. コンソールログから着順データ・ターン数を収集する。
3. 上記KPIと比較し、大きく乖離している場合はカードパラメータの調整を [REQ-03-system_requirements.md](REQ-03-system_requirements.md) に記録したうえで変更する。

> [!IMPORTANT]
> ゲームバランスに影響するパラメータ（カード移動量・オッズ倍率）の変更は、必ず **[CHANGELOG.md](../CHANGELOG.md)** の `[Balanced]` カテゴリに記録してください。

---

## 7. プレイフィールテスト (Playfeel Test)

### 7.1 目的

数値では計測できない「ゲームとして気持ちよいか」「UI操作が直感的か」を人間の感覚で評価します。

### 7.2 評価項目

| 評価項目 | 合格基準 |
| :--- | :--- |
| **操作の直感性** | マニュアルなしで3分以内にベット〜レース完了までできる |
| **カードプレイの応答性** | カードプレイ後に馬の動きが0.5秒以内に視覚反映される |
| **Undoの快適性** | Undoボタンが迷わずわかり、直前の状態に戻ったと確認できる |
| **リザルトの明快さ** | 着順と配当額が一目でわかる |

### 7.3 実施タイミング

- 新しいUIコンポーネント追加時
- 主要なゲームバランス変更後
- リリース前の最終確認

---

## 8. テストの管理と記録

### 8.1 テスト結果の記録

- 自動テスト（`make test`）の結果は CI/CD ログに記録する（GitHub Actions 等）。
- 手動テストの結果は問題が検出された場合のみ [MNG-03-problem_management.md](MNG-03-problem_management.md) の Issue として登録する。

### 8.2 テストドキュメントの更新契機

| 更新契機 | 更新内容 |
| :--- | :--- |
| 新機能追加時 | 該当機能の単体テストケースを `template_test.js` に追加 |
| バグ修正時 | バグを再現するリグレッションテストを追加 |
| テストフレームワーク変更時 | 本ドキュメントのセクション3・4を更新 |
| パラメータ調整時 | セクション6のKPI値を再評価・更新 |

---

## 9. 関連ドキュメント

| ドキュメント | 関連内容 |
| :--- | :--- |
| [MNG-03-problem_management.md](MNG-03-problem_management.md) | テストで検出した不具合の管理台帳 |
| [REQ-03-system_requirements.md](REQ-03-system_requirements.md) | テスト対象となるゲーム仕様の数値基準 |
| [GDD-01-game_design_document.md](GDD-01-game_design_document.md) | ゲームバランスKPIの設計根拠 |
| [ISSUE-08-modernizing_test_framework.md](issue/ISSUE-08-modernizing_test_framework.md) | テストフレームワーク近代化の課題 |
