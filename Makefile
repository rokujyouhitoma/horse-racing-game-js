
JAVA = java

CLOSURE_COMPIER = tools/closure-compiler/closure-compiler-v20260602.jar
CLOSURE_STYLESHEETS = tools/closure-stylesheets/closure-stylesheets-1.5.0.jar

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
	src/js/game/templates.js \
	src/js/game/layers/titlescenelayer.js \
	src/js/game/layers/resultscenelayer.js \
	src/js/game/layers/menulayer.js \
	src/js/game/layers/racetracklayer.js \
	src/js/game/layers/oddstablelayer.js \
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
	--js_output_file $@ \
	--js $(SOURCES) \
	--debug \
	--formatting=PRETTY_PRINT \
	--jscomp_error=checkTypes \
	--jscomp_error=invalidCasts \
	--jscomp_warning=reportUnknownTypes
#	--formatting=PRINT_INPUT_DELIMITER \
#	--compilation_level=WHITESPACE_ONLY \

main-min.css:
	$(JAVA) -jar $(CLOSURE_STYLESHEETS) \
	$(STYLESHEETS) \
	--output-file $@ \
	--pretty-print

.PHONY: clean
clean:
	rm -f main-min.js main-min.css

# TODO: [ISSUE-08] 将来的に Jest や Mocha などの本格的なテストフレームワークを導入し、
# 自作の簡易テストランナー（template_test.js 内の describe/it モック）をリプレイスする。
.PHONY: test
test:
	@cat \
	src/js/lib/xorshift.js \
	src/js/lib/event.js \
	src/js/lib/locator.js \
	src/js/lib/router.js \
	src/js/lib/template.js \
	src/js/game/lib/scene.js \
	src/js/game/lib/engine.js \
	src/js/game/lib/repository.js \
	src/js/game/lib/publisher.js \
	src/js/game/lib/command.js \
	src/js/game/events.js \
	src/js/game/templates.js \
	src/js/game/renderers/lanerenderer.js \
	src/js/game/layers/racetracklayer.js \
	src/js/game/entities.js \
	src/js/game/checker.js \
	src/js/game/main.js \
	src/js/lib/template_test.js \
	| node -e "\
	class MockNode { \
	    constructor() { this.childNodes = []; } \
	    get textContent() { return this.childNodes.map(n => n.textContent || '').join(''); } \
	    set textContent(val) { this.childNodes = [new MockTextNode(val)]; } \
	    appendChild(node) { \
	        if (node instanceof MockDocumentFragment) { \
	            this.childNodes.push(...node.childNodes); \
	            node.childNodes = []; \
	        } else { \
	            this.childNodes.push(node); \
	        } \
	        return node; \
	    } \
	    removeChild(node) { \
	        const idx = this.childNodes.indexOf(node); \
	        if (idx !== -1) { \
	            this.childNodes.splice(idx, 1); \
	        } \
	        return node; \
	    } \
	    get firstChild() { return this.childNodes[0] || null; } \
	} \
	class MockElement extends MockNode { \
	    constructor(tagName) { \
	        super(); \
	        this.tagName = tagName; \
	        this.style = {}; \
	    } \
	} \
	class MockTextNode extends MockNode { \
	    constructor(text) { \
	        super(); \
	        this._text = text; \
	    } \
	    get textContent() { return this._text; } \
	} \
	class MockDocumentFragment extends MockNode {} \
	global.document = { \
	    createDocumentFragment() { return new MockDocumentFragment(); }, \
	    createElement(tagName) { return new MockElement(tagName); }, \
	    createTextNode(text) { return new MockTextNode(text); } \
	}; \
	global.DocumentFragment = MockDocumentFragment; \
	global.window = global; \
	global.window.addEventListener = function() {}; \
	const fs = require('fs'); \
	const code = fs.readFileSync(0, 'utf-8'); \
	eval(code); \
	"
