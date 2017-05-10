
JAVA = java

CLOSURE_COMPIER = tools/closure-compiler/closure-compiler-v20170423.jar

SOURCES = src/lib/xorshift.js \
	src/lib/event.js \
	src/lib/locator.js \
	src/game/lib/scene.js \
	src/game/lib/engine.js \
	src/game/lib/repository.js \
	src/game/lib/publisher.js \
	src/game/lib/command.js \
	src/game/renderers.js \
	src/game/checker.js \
	main.js

all: main-min.js

main-min.js: $(SOURCES)
	$(JAVA) -jar $(CLOSURE_COMPIER) \
	--compilation_level ADVANCED_OPTIMIZATIONS \
	--use_types_for_optimization \
	--warning_level=VERBOSE \
	--js_output_file $@ \
	--js $(SOURCES)
