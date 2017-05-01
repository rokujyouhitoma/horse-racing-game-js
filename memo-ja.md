# TODO

## エンジン

 - [x] エンジンのメインループ
 - [x] デバッグUIとしてエンジンのFPSを表示
 - [x] 基底クラスとなるゲームオブジェクトの定義

## コアライブラリs

 - [x] Observerパターンによるイベントシステム。DOM Level2参考
 - [x] ServiceLocator
 - [x] モデルオブジェクト
 - [ ] データ集合に対するFindById系のクエリシステム
 - [x] レンダラーオブジェクト
 - [ ] レンダラーオブジェクトがどうしてもモデル、ディレクターオブジェクトと密結合してしまうので、疎結合に
 - [ ] マスターデータのリレーション、バリューチェッカー
 - [x] Utility/Fisher–Yates shuffle
 - [ ] Utility/Xorshift(シードベースの乱数生成器ならなんでもいい)

## ゲーム

### ゲームオブジェクト

 - [ ] マスターデータ(MasterData)
 - [ ] マスターデータ/スタブデータ(Stub)
 - [ ] レース(Race)
 - [ ] ゲームボード(GameBoard)
 - [ ] ゲームボード/-1(スタート)~71(ゴール)
 - [ ] ゲームボード/レーストラック(RaceTrack)
 - [ ] ゲームボード/レーストラック/レーン(Lane)
 - [ ] ゲームボード/オッズ表
 - [ ] ゲームボード/ポイント表
 - [ ] フィギュア
 - [ ] モンスターコイン
 - [ ] モンスターフィギュア
 - [ ] プレイカード(PlayCard)
 - [x] プレイカード/ステップカード(StepCard)
 - [ ] プレイカード/順位カード(RankCard)
 - [ ] プレイカード/ダッシュカード(DashCard)
 - [ ] オッズシート/オッズ表
 - [ ] ゲームプレイヤー
 - [ ] ゲーム
 - [ ] ゲーム/リセット

### ゲームシステム

 - [ ] フィギュアの配置
 - [ ] プレイヤー人数の決定
 - [ ] プレイカード/手持ちカードを配布
 - [ ] プレイカード/山札
 - [ ] プレイヤー/自分のモンスターを決める
 - [ ] プレイヤー/順番の決定
 - [ ] プレイヤー/コインを賭ける
 - [ ] プレイ/プレイヤーの順番
 - [ ] プレイ/山札の一番上からカードを引く
 - [ ] プレイ/手持ちカードに加える
 - [ ] プレイ/手持ちカードから一枚プレイ
 - [ ] プレイ/プレイされたカードの適用
 - [ ] レース終了条件の判定
 - [ ] ポイント計算

### ゲームシステム基本機能

 - [x] ゲームリセット

# History

## 2017.5.1

 - Fisher–Yates shuffleをUtilityに切り出す
 - EventTargetのEventListenerの探索がO(n)だったのをO(1)に改善

## 2017.4.30

 - 順位カードの効果を実装
 - DebugButtonオブジェクトを追加

## 2017.4.29

 - ステップカードの効果を実装
 - プレイカードを適用
 - PlayCardオブジェクトの機能を改善
 - Repositoryオブジェクトを追加

## 2017.4.28

 - CardDetailオブジェクトを追加
 - StepCardDetailオブジェクトを追加
 - RankCardDetailオブジェクトを追加
 - DashCardDetailオブジェクトを追加
 - PlayCardオブジェクトを追加

## 2017.4.27

 - MasterDataにStepCardDetail、RankCardDetail、DashCardDetailを追加
 - イベントの仕組みを整理

## 2017.4.26

 - イベントの仕組みを追加（コアライブラリ）

## 2017.4.25

 - 着順を計算
 - デバッグメニューにゲームリセット機能を追加

## 2017.4.24

 - デバッグメニューを追加
 - 味気ない見栄えを少々改善
 - JavaScriptの"use strict"を宣言する

## 2017.4.23

 - レーストラックをデバッグ用途でレンダリング
 - CourseRendererオブジェクトのドラフトを実装
 - LaneRendererオブジェクトのドラフトを仮実装
 - Rendererオブジェクトを実装
 - FPSを表示するオブジェクト(FPSRenderer)を整理

## 2017.4.22

 - モデルオブジェクトのドラフトを実装
 - マスターデータのフォーマットを変更。idカラムを足す

## 2017.4.21

 - レーン(Lane)には走者(Runner)がいる
 - GameObject.DestroyをOnDestroyにリネーム
 - GameObject.UpdateをOnUpdateにリネーム
 - GameObject.StartをOnStartにリネーム
 - レースオブジェクトのドラフトを実装
 - レーンオブジェクトのドラフトを実装
 - ゲームオブジェクトはStart/Update/Destrory時に子のthis.objectsの同じメソッドを呼び出す

## 2017.4.20

 - レーストラックオブジェクトのドラフトを実装
 - ゲームボードオブジェクトはレーストラックオブジェクトを内包する
 - TODO.mdをmemo-ja.mdにリネーム

## 2017.4.19

 - マスターデータのスタブ
 - ゲームオブジェクトのドラフトを実装
 - ゲームオブジェクトにリセット機能を仮実装
 - TODO.mdの追加

## 2017.4.18

 - FPSの表示
 - フィギュアオブジェクトのドラフトを実装
 - モンスターコインオブジェクトのドラフトを実装
 - モンスターフィギュアオブジェクトのドラフトを実装

## 2017.4.17

 - Engineのメインループを実装

# 設計

## コアライブラリs

### イベントシステム

インスパイヤDOM Level2のEvent。

 - https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event
 - https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 - https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener
 - https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

# 用語集

一部競馬用語から借用。

 - 馬番(horse number)相当、ゼッケン
 - フルフィールド(full field)。フルフィールド、全頭、全出走馬
 - ゲート(gate)。...省略...
 - 走者(runner)。レーンの走者
 - 着順(order of finish)

# 雑感

## KPT

### Keep

 - DOMLevel2インスパイヤのEvent(Event, EventTarget, EventListener)はすばらしい
 - Fisher-Yates shuffleはすばらしい

### Problem

 - xxx

### Try

 - xxx