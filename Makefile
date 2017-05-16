
JAVA = java

CLOSURE_COMPIER = tools/closure-compiler/closure-compiler-v20170423.jar

LIB_SOURCES = src/lib/xorshift.js \
	src/lib/event.js \
	src/lib/locator.js \
	src/lib/router.js \

GAME_LIB_SOURCES = src/game/lib/scene.js \
	src/game/lib/engine.js \
	src/game/lib/repository.js \
	src/game/lib/publisher.js \
	src/game/lib/command.js

SOURCES = $(LIB_SOURCES) \
	$(GAME_LIB_SOURCES) \
	src/game/events.js \
	src/game/layers/titlescenelayer.js \
	src/game/layers/menulayer.js \
	src/game/layers/racetracklayer.js \
	src/game/layers/logmessagelayer.js \
	src/game/layers/debugmenulayer.js \
	src/game/layers/fpslayer.js \
	src/game/layers/debugbuttonlayer.js \
	src/game/layers/sampleballlayer.js \
	src/game/renderers.js \
	src/game/renderers/guiparts.js \
	src/game/renderers/lanerenderer.js \
	src/game/checker.js \
	main.js

all: main-min.js

main-min.js: $(SOURCES)
	$(JAVA) -jar $(CLOSURE_COMPIER) \
	--compilation_level ADVANCED_OPTIMIZATIONS \
	--use_types_for_optimization \
	--warning_level=VERBOSE \
	--js_output_file $@ \
	--js $(SOURCES) \
	--debug \
	--formatting=PRETTY_PRINT
\\	--formatting=PRINT_INPUT_DELIMITER \
\\	--compilation_level=WHITESPACE_ONLY \
