cc:
	java -jar tools/closure-compiler/closure-compiler-v20170423.jar --js main.js --js_output_file compiled/main-compiled.js \
#	--compilation_level ADVANCED_OPTIMIZATIONS \
	--debug \
	--formatting=PRETTY_PRINT \
	--create_source_map ./map.js.map
