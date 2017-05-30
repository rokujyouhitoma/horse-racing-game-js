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
 - [x] レンダラーオブジェクトがどうしてもモデル、ディレクターオブジェクトと密結合してしまうので、疎結合に
 - [x] マスターデータのリレーションチェッカー(RelationshipChecker)
 - [ ] マスターデータのバリューチェッカー(ValueChecker)
 - [x] Utility/Fisher–Yates shuffle(Utility.FisherYatesShuffle)
 - [x] Xorshift(シードベースの乱数生成器ならなんでもいい) ただし、分布を未検証(Xorshift)
 - [x] ディスパッチャ(Router, Matcher)
 - [x] 主にHTML向けテンプレートエンジン(Template)

## ゲーム

### ゲームオブジェクト

 - [x] マスターデータ(MasterData)
 - [x] マスターデータ/スタブデータ(Stub)
 - [x] レース(Race)
 - [ ] ゲームボード(GameBoard)
 - [x] ゲームボード/スタート~道中~ゴール
 - [x] ゲームボード/レーストラック(Racetrack)
 - [x] ゲームボード/レーストラック/レーン(Lane)
 - [ ] ゲームボード/オッズ表
 - [ ] ゲームボード/ポイント表
 - [x] フィギュア
 - [ ] モンスターコイン
 - [ ] モンスターフィギュア
 - [x] プレイカード(PlayCard)
 - [x] プレイカード/ステップカード(StepCard)
 - [x] プレイカード/順位カード(RankCard)
 - [x] プレイカード/ダッシュカード(DashCard)
 - [ ] オッズシート/オッズ表
 - [ ] ゲームプレイヤー
 - [ ] ゲーム
 - [x] ゲーム/リセット

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
 - [x] レース終了条件の判定
 - [ ] ポイント計算

### ゲームシステム基本機能

 - [x] ゲームリセット

# History

## 2017.5.30

 - オッズテーブルの表示部分をすすめる

## 2017.5.29

 - テンプレートを整理

## 2017.5.28

 - テンプレートを整理

## 2017.5.27

 - OddsTableLayerを追加

## 2017.5.26

 - Betオブジェクトを仮実装
 - GamePlayerオブジェクトを仮実装

## 2017.5.25

 - オッズテーブルを仮実装

## 2017.5.24

 - Templateでwhile構文をサポート
 - Templateでraw構文をサポート

## 2017.5.23

 - Templateでapplyブロックをサポート

## 2017.5.22

 - Tempalteを改善
 - Templatesを追加
 - Templateを適用

## 2017.5.21

 - Templateを部分的に適用し使い勝手を確認
 - Add template engine.
 - entityオブジェクトをentities.jsに分離
 - レース結果のオッズを計算

## 2017.5.20

 - オッズ表を仮実装

## 2017.5.19

 - Add closure stylesheets

## 2017.5.18

 - リザルトシーン
 - Add Auto Play Card機能 for Debug
 - Add UICustomCheckbox

## 2017.5.17

 - CCのlintを有効にしてCC向けのアノテーション追加
 - リザルトシーンの追加
 - SceneDirector.prototype.Replace(scene)を追加

## 2017.5.16

 - デバッグのためにSampleBallLayerを追加
 - ExEventInfoを追加し、整理

## 2017.5.15

 - RouterをCustomeSceneDirectorに組み込みwindows.history, locationをサポート
 - Router, Matcherオブジェクトを追加
 - デバッグ目的でXorshiftのシード値を表示する
 - Xorshift.s（シード)をpublicにする

## 2017.5.14

 - window.historyを仮サポート

## 2017.5.13

 - 不要なコードをバッサリ整理
 - 起動直後のブート処理を整理
 - レイアウト修正。Debug Buttonを仮配置

## 2017.5.12

 - Add RenderLayers for レイヤーのHTML描画処理を整理
 - Engine.Loopを改修

## 2017.5.11

 - Engine.Loop()を改修
 - Add NoneCardEffect object
 - Xorshiftのseed値は内部で保持する。デバッグ目的

## 2017.5.10

 - Add Game.DOMTaskExecuter for DOM操作タスクをOnLastUpdate時に行いたい場合
 - Add FunctionCommand, BasicExecuter
 - Add IGameObject interface
 - Add GameObject.prototype.LastUpdate
 - CC向けのアノテーション追加

## 2017.5.9

 - Undo機能の追加。レース中にプレイカードをUndoできる（ただ、ゴール判定周りは未サポート）
 - CardEffectインタフェース、StepCardEffectを追加
 - PlayCardCommandを追加
 - CommandExecuterを追加
 - Command Interface, SimpleCommandExecuter objectを追加
 - Makefileを整理
 - main.jsで定義されているPublisherオブジェクトをsrc/game/lib/publisher.jsに分ける
 - MasterMetaオブジェクトを追加
 - CC向けのアノテーション追加

## 2017.5.8

 - MenuUIオブジェクトを追加
 - fixed: SceneDirectorのバグ
 - fixed: PlayCardDirectorのバグ
 - LogMessageUI, Game.Logを追加
 - 適当にmain.cssでデザインをでっち上げる
 - CC向けアノテーションをExEvent, ExEventTarget, ExEventListener, Locator, Xorshiftに適用
 - MasterDataにローダーオブジェクトの概念を追加。スタブデータはStubLoderから読み込む
 - Loader, StubLoaderを追加
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

## エンジン

### Engine

ゲームのメインループ、更新関数の呼び出しを担当。
以下を選択。

 - 固定間隔で更新処理
 - 可変間隔で描画処理

#### 既知の問題点

一点明確な問題点があり、ラグが大きくある場合（例えば、ブラウザタブのJS処理が一定時間停止ブラウザによって停止していて、復帰した場合）は、更新関数を呼ぶ出すことなくラグをリセットして、処理を再開する実装としている。

これは、ラグをなくすために入れているwhileループがラグが大きい場合には、
ループ回数が大きいのを避けるためではあるが、ゲームそれ自体に問題を及ぼす。

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

### Xorshift

 - [野良C++erの雑記帳 2010-09-26 定量的な考え方は割と工学の基礎。今回は乱暴だけど。 Xorshift アルゴリズムの偏りを除去するのに必要な「読み飛ばし」回数を見積もる](http://d.hatena.ne.jp/gintenlabo/20100926/1285521107)
 - [野良C++erの雑記帳 2010-09-28 いくらなんでも乱暴すぎた。てか記事にするなら実際に試せと（ｒｙ Xorshift の初期値読み飛ばしについて検証してみた。](http://d.hatena.ne.jp/gintenlabo/20100928/1285702435)

### Template

 - Tornado(Python)のtornado.templateをJavaScriptに移植
 - import, from, module構文はJavaScriptで不要、そぐわないのでサポート範囲から外す

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

# Special Thanks

 - [mizchi's blog GWの進捗としてRPG作った / redux-saga でメインループ処理、JSONSchemaからのコード生成](http://mizchi.hatenablog.com/entry/2017/05/08/013632) の記事が僕のやる気を飛躍的にアップさせる薬となった。謝謝だぜmizchiちゃん おかげでひとつ強くなれた

# 不具合

## 仕様バグ？

元の仕様はプレイカードを使い切った場合に1,2位が必ず決まるとのレベルデザインがなされているとのこと。
だが、下記の順番でカードが実行された際には、1位は決定するが、2位は決定せず。

もしかして、仕様バグ？...どうやら実装バグのような...

Note: 乱数生成器のシードを取得し忘れた...。

card_id=57
[Step]: Purple +3 card_id=38
main.js:87 [Step]: Green +5 card_id=23
main.js:87 [Step]: Blue +5 card_id=32

48?

main.js:87 [Step]: Purple +4 card_id=41
main.js:87 [Step]: Blue +4 card_id=29
main.js:87 [Rank]: 2 +5 card_id=49
main.js:87 [Step]: Purple +3 card_id=37
main.js:87 [Step]: Green +5 card_id=24
main.js:87 [Step]: Green +4 card_id=21
main.js:87 [Rank]: 1 +10 card_id=47
main.js:87 [Step]: Orange +5 card_id=11
main.js:87 [Rank]: 2 +10 card_id=50
main.js:87 [Step]: Green +4 card_id=19
main.js:87 [Step]: Orange +5 card_id=12
main.js:87 [Step]: Blue +4 card_id=30
main.js:87 [Step]: Blue +6 card_id=35
main.js:87 [Step]: Blue +6 card_id=34
main.js:87 [Step]: Red +9 card_id=5

51?

main.js:87 [Step]: Green +4 card_id=20
main.js:87 [Step]: Red +5 card_id=3
main.js:87 [Step]: Blue +4 card_id=28
main.js:87 [Step]: Red +9 card_id=4
main.js:87 [Step]: Purple +5 card_id=43
main.js:87 [Rank]: 3 +10 card_id=53
main.js:87 [Rank]: 4 +5 card_id=55
main.js:87 [Step]: Blue +5 card_id=31
main.js:87 [Rank]: 1 +5 card_id=46
main.js:87 [Step]: Orange +8 card_id=17
main.js:87 [Step]: Green +5 card_id=22
main.js:87 [Step]: Green +7 card_id=25
main.js:87 [Step]: Red +5 card_id=2
main.js:87 [Step]: Purple +5 card_id=44
main.js:87 [Step]: Purple +4 card_id=42
main.js:87 [Step]: Purple +3 card_id=39
main.js:87 [Step]: Orange +6 card_id=13
main.js:87 [Dash]: 2 card_id=60
main.js:87 [Step]: Purple +5 card_id=45
main.js:87 [Step]: Red +10 card_id=7
main.js:87 [Step]: Red +10 card_id=9
main.js:87 [Step]: Red +9 card_id=6
main.js:87 [Dash]: 1 card_id=59
main.js:87 [Step]: Orange +8 card_id=16
main.js:87 [Step]: Orange +8 card_id=18
main.js:87 [Step]: Orange +5 card_id=10
main.js:87 [Step]: Green +7 card_id=27
main.js:87 [Step]: Purple +4 card_id=40
main.js:87 [Step]: Blue +6 card_id=36
main.js:87 [Step]: Orange +6 card_id=14

54?
56?
1?

main.js:87 [Step]: Blue +5 card_id=33
main.js:87 [Step]: Orange +6 card_id=15
main.js:87 [Rank]: 3 +5 card_id=52
main.js:87 [Step]: Green +7 card_id=26

> Game.SceneDirector.scenes[1].directors[1].playCards.map(function(v){return v.model.id;})
[57, 38, 23, 32, 48, 41, 58, 29, 49, 37, 24, 21, 47, 11, 50, 19, 12, 30, 35, 34, 5, 51, 20, 3, 28, 4, 43, 53, 55, 31, 46, 17, 22, 25, 2, 44, 42, 39, 13, 60, 45, 7, 9, 6, 59, 16, 18, 10, 27, 40, 36, 14, 54, 56, 1, 8, 33, 15, 52, 26]

# 参考文献

 - [ブラウザの履歴を操作する](https://developer.mozilla.org/ja/docs/Web/Guide/DOM/Manipulating_the_browser_history)
 - [Simple Easing Functions in Javascript](https://gist.github.com/gre/1650294)
