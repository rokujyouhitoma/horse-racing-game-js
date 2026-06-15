# [ISSUE-04] レンダラーとモデルの密結合 (Severity: Low)

* **ステータス**: 解決済 (Resolved)
* **内容**: `RacetrackLayer` や `OddsTableLayer` などの描画レイヤーが、ゲームの内部オブジェクトやディレクターと非常に強く結合している。モデルの変更が描画側へ直接影響するため、Pub/Sub イベントを経由した疎結合データ通信への移行が望まれる。
* **対応内容 (2026.6.14)**: 新しいPub/Subイベント `Events.Race.OnChanged` を定義し、`RaceDirector` 側の状態変更時にモデルデータ（`racetrack`, `oddstable`）をペイロードに載せてパブリッシュするように変更。`RacetrackLayer` と `OddsTableLayer` はこれを購読してペイロードのみで描画を行うよう修正し、密結合を完全に解消しました。
