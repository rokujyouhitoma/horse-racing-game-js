# [ISSUE-14] Makefile におけるソースファイル重複登録の解消 (Severity: Low)

* **ステータス**: 解決済 (Resolved)
* **内容**: 
  ビルド設定ファイルである [Makefile](../../Makefile) の `SOURCES` 変数定義において、`src/js/game/layers/racetracklayer.js` が重複して登録されていました（L26 と L28）。
  
  ```makefile
  SOURCES = $(LIB_SOURCES) \
      $(GAME_LIB_SOURCES) \
      src/js/game/events.js \
      src/js/game/templates.js \
      src/js/game/layers/titlescenelayer.js \
      src/js/game/layers/resultscenelayer.js \
      src/js/game/layers/menulayer.js \
      src/js/game/layers/racetracklayer.js \       # 重複 (L26)
      src/js/game/layers/oddstablelayer.js \
      src/js/game/layers/racetracklayer.js \       # 重複 (L28)
  ```

  Closure Compiler でのコンパイル自体は重複ファイルが渡されても動作しますが、無駄なファイル解析が発生し、警告・エラー出力のノイズやコンパイル速度の低下を引き起こす可能性があります。また、ビルド資産管理の整合性観点から好ましくありません。

* **対応内容 (2026.06.21)**:
  * [Makefile](../../Makefile) の `SOURCES` 定義から、重複していた2つ目の `src/js/game/layers/racetracklayer.js` の指定行を削除し、不整合を解消しました。

* **関連箇所**:
  * [Makefile](../../Makefile) (L26, L28)
