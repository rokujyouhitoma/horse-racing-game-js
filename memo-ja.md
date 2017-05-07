# 指針

 - ゲームシステムを早めに試すためにゲームループを早急に。プリプロ工程を意識
 - 優先順位は、ゲームシステム > 基盤の仕組みを優先 > 見栄え。見栄えは後回しにしてダミーでよい
 - （...基盤の仕組みは気になるよねー。ある程度作っちゃう）
 - コードの綺麗さは捨てて良い(...ま、気になるからある程度は...)

# TODO

## エンジン

 - [x] エンジンのメインループ(Engine)
 - [x] デバッグUIとしてエンジンのFPSを表示
 - [x] 基底クラスとなるゲームオブジェクトの定義

## コアライブラリs

 - [x] シーンとシーンを管理する仕組み => シーン(Scene)、シーンディレクター(Scene, SceneDirector)
 - [x] Observerパターンによるイベントシステム。DOM Level2参考(ExEvent, ExEventTarget, ExEventListener)
 - [x] クラスを一度だけインスタンス化して、格納する仕組み(Locator)
 - [x] モデルオブジェクト(Model)
 - [x] データ集合に対するFindById系のクエリシステム => Repositoryオブジェクトで代用(Repository)
 - [x] レンダラーオブジェクト
 - [ ] レンダラーオブジェクトがどうしてもモデル、ディレクターオブジェクトと密結合してしまうので、疎結合に
 - [x] マスターデータのリレーションチェッカー(RelationshipChecker)
 - [ ] マスターデータのバリューチェッカー(ValueChecker)
 - [x] Utility/Fisher–Yates shuffle(Utility.FisherYatesShuffle)
 - [x] Xorshift(シードベースの乱数生成器ならなんでもいい) ただし、分布を未検証(Xorshift)

## ゲーム

### ゲームオブジェクト

 - [x] マスターデータ(MasterData)
 - [x] マスターデータ/スタブデータ(Stub)
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
 - [x] プレイカード/順位カード(RankCard)
 - [x] プレイカード/ダッシュカード(DashCard)
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

## 2017.5.8

 - タイトルシーンを追加

## 2017.5.7

 - Gameオブジェクトのゲーム固有の処理をGameDirectorオブジェクトに移譲。ゲーム非固有の処理をGameオブジェクトの責務とする
 - GameDirectorオブジェクトを追加
 - ExEventTarget.dispatchEvent時の条件を修正。合わせてPublisher.Publishのインタフェースも回収。ユーザーコードも修正
 - GameSceneのOnEnter/OnExit/OnPause/OnResume時は、publisherにGameSceneオブジェクトを指定
 - 不要なロギングコードの削除 at engine.js
 - fixed: ExEventTarget.removeEventListenerのバグ

## 2017.5.6

 - GameオブジェクトのGameスタート関連の処理を見直し
 - src/lib/event.jsのバグ修正
 - モジュールの整理。ディレクトリを分けて、htmlからの参照を整理し、CCのコンパイル設定を修正
 - SceneDirector.ToDepth()を実装

## 2017.5.5

 - Closure Compilerを導入した（開発の長期化が予想されるので、強制ギブスが必要だった）
 - EventTargetを改修し、reveiverに対応

## 2017.5.4

 - GameSceneを追加
 - Scene, SceneDirectorを追加

## 2017.5.3

 - MasterDataのデータフォーマットを修正。よりCSVで管理することを意識した形式に変更した
 - RelationshipChecker.Conditions.Equalをサポート
 - Publisher.Subscribeでチャンネルをオプション指定できるようにする

## 2017.5.2

 - RelationshipCheckerを仮実装

## 2017.5.1

 - Xorshiftを実装
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

### Event, EventTarget, EventListener

イベントシステム。
インスパイヤDOM Level2のEvent。

 - https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event
 - https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 - https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener
 - https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

### Scene, SceneDirector

シーン管理システム。
SceneDirectorはSceneの

 1. state管理
 2. OnEnter/OnExit/OnPause/OnResumeの呼び出し管理

を行う。

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
 - ServiceLocator(もっとふさわしい名称有るきがするが)は良い仕組み
 - フルスクラッチのJSコード書く上では、ClosureCompilerは素晴らしい

### Problem

 - コーディング規約とか定めずにガン無視したコードを書いたために統一感がまるでない
 - 各オブジェクトの責務が曖昧な箇所が多数
 - レンダラー全般がゲームオブジェクトと密結合しすぎており、ゲームオブジェクトの影響をレンダラー側が受けやすい。レンダラーオブジェクトはゲームオブジェクトを継承すべきではなかった?クライアント/サーバモデルぐらいに疎結合化すべきであった??

### Try

 - あとn回作り直して(n=1は行ったほうがよい)抽象化すべきところを抽象化する。責務の切り分けを行う