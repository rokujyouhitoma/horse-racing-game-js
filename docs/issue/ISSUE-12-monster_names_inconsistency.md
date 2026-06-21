# [ISSUE-12] モンスター名（出走馬名）の命名不整合の修正 (Severity: Low)

* **ステータス**: 解決済 (Resolved)
* **内容**: 
  ゲームビジョンを定義するゲームデザインドキュメント（[GDD-01-game_design_document.md](../GDD-01-game_design_document.md)）と、プログラムソースコード（`src/` 配下）および要件定義書・ユーザーマニュアル間で、出走モンスター（馬）の名称定義に不整合が発生していました（ドラクエ由来の名称とファンタジー由来の名称の混在）。
  
  | ID | 旧 GDD-01 での名称 | 統一された名称（実装、REQ-03, USR-01 と同期） |
  | :---: | :--- | :--- |
  | **1** | ドラゴン (Dragon) | サラマンダー (Salamander) |
  | **2** | デーモン (Demon) | フェニックス (Phoenix) |
  | **3** | ドラキー (Drakey) | グリフォン (Griffin) |
  | **4** | ゴーレム (Golem) | ケルピー (Kelpie) |
  | **5** | ゴースト (Ghost) | ワイバーン (Wyvern) |

  ゲームコンセプトの統一および外部著作権由来の名称回避のため、実装側に合わせて「サラマンダー等」に統一を決定しました。

* **対応内容 (2026.06.21)**:
  * [GDD-01-game_design_document.md](../GDD-01-game_design_document.md) の StepCard 定義テーブル内に記述されていた「ドラゴン」「デーモン」「ドラキー」「ゴーレム」「ゴースト」を、実装側の定義に合わせて「サラマンダー」「フェニックス」「グリフォン」「ケルピー」「ワイバーン」に書き換え、名称を統一しました。

* **関連箇所**:
  * [GDD-01-game_design_document.md](../GDD-01-game_design_document.md)
  * [REQ-03-system_requirements.md](../REQ-03-system_requirements.md)
  * [USR-01-user_manual.md](../USR-01-user_manual.md)
  * `src/js/game/main.js` (StubLoader 内データ)
