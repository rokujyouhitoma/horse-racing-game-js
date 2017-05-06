cc:
	java -jar tools/closure-compiler/closure-compiler-v20170423.jar \
	--js \
	src/lib/xorshift.js \
	src/lib/event.js \
	src/lib/locator.js \
	src/game/lib/scene.js \
	src/game/lib/engine.js \
	src/game/lib/repository.js \
	main.js \
	--js_output_file compiled/main-compiled.js \
	--compilation_level ADVANCED_OPTIMIZATIONS \
#	--debug \
	--formatting=PRETTY_PRINT \
#	--create_source_map compiled/compiled.js.map
