
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
	src/game/renderers/guiparts.js \
	src/game/renderers/titlescenerenderer.js \
	src/game/renderers/menurenderer.js \
	src/game/renderers/racetrackrenderer.js \
	src/game/renderers/logmessagerenderer.js \
	src/game/renderers/debugbuttonrenderer.js \
	src/game/renderers/debugmenurenderer.js \
	src/game/renderers/fpsrenderer.js \
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
