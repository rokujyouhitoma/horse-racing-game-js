
JAVA = java

CLOSURE_COMPIER = tools/closure-compiler/closure-compiler-v20170423.jar
CLOSURE_STYLESHEETS = tools/closure-stylesheets/closure-stylesheets.jar

LIB_SOURCES = src/js/lib/xorshift.js \
	src/js/lib/event.js \
	src/js/lib/locator.js \
	src/js/lib/router.js \
	src/js/lib/template.js

GAME_LIB_SOURCES = src/js/game/lib/scene.js \
	src/js/game/lib/engine.js \
	src/js/game/lib/repository.js \
	src/js/game/lib/publisher.js \
	src/js/game/lib/command.js

SOURCES = $(LIB_SOURCES) \
	$(GAME_LIB_SOURCES) \
	src/js/game/events.js \
	src/js/game/layers/titlescenelayer.js \
	src/js/game/layers/resultscenelayer.js \
	src/js/game/layers/menulayer.js \
	src/js/game/layers/racetracklayer.js \
	src/js/game/layers/logmessagelayer.js \
	src/js/game/layers/debugmenulayer.js \
	src/js/game/layers/fpslayer.js \
	src/js/game/layers/debugbuttonlayer.js \
	src/js/game/layers/sampleballlayer.js \
	src/js/game/renderers.js \
	src/js/game/renderers/guiparts.js \
	src/js/game/renderers/lanerenderer.js \
	src/js/game/entities.js \
	src/js/game/checker.js \
	src/js/game/main.js

STYLESHEETS = src/css/main.css

all: main-min.js main-min.css

main-min.js: $(SOURCES)
	$(JAVA) -jar $(CLOSURE_COMPIER) \
	--compilation_level ADVANCED_OPTIMIZATIONS \
	--use_types_for_optimization \
	--warning_level=VERBOSE \
	--jscomp_warning=lintChecks \
	--js_output_file $@ \
	--js $(SOURCES) \
	--debug \
	--formatting=PRETTY_PRINT
//	--jscomp_warning=reportUnknownTypes \
//	--formatting=PRINT_INPUT_DELIMITER \
//	--compilation_level=WHITESPACE_ONLY \

main-min.css:
	$(JAVA) -jar $(CLOSURE_STYLESHEETS) \
	$(STYLESHEETS) \
	--output-file $@ \
	--pretty-print
