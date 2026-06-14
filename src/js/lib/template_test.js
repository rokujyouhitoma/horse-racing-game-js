//"use strict";

/**
 * Original code is here.
 * https://raw.githubusercontent.com/rokujyouhitoma/js-templateengine/develop/tests/template_spec.js
 */

var describe = function(dname, func){
    var dname = dname;
    var globalObject = (typeof window !== 'undefined') ? window : global;
    globalObject.it = function(name, func){
        var name = name;
        var expect = function(value){
            var Test = function(value){
                this.value = value;
            };
            Test.prototype.toEqual = function(v){
                if (this.value != v) {
                    console.error(dname, name, this.value, " not equal to ", v);
                    if (typeof process !== 'undefined') {
                        process.exitCode = 1;
                    }
                }
            };
            Test.prototype.toBeTruthy = function(){
                if(!this.value){
                    console.error(dname, name, this.value);
                    if (typeof process !== 'undefined') {
                        process.exitCode = 1;
                    }
                }
            };
            return new Test(value);
        };
        globalObject.expect = expect;
        func.call(globalObject);
    };
    func.call(globalObject);
};

describe('TemplateTest', function() {
    it('test_simple', function() {
        var template = new Template('Hello {{ name}}!');
        expect(template.generate({name:'Ben'})).toEqual('Hello Ben!');
    });

    it('test_expressions', function() {
        var template = new Template('2 + 2 = {{ 2 + 2 }}');
        expect(template.generate()).toEqual('2 + 2 = 4');
    });

    it('test_expressions', function() {
        var template = new Template('2 + 2 = {{ 2 * 2 }}');
        expect(template.generate()).toEqual('2 + 2 = 4');
    });

    it('test_expressions', function() {
        var template = new Template('2 + 2 = {{ 2 / 2 }}');
        expect(template.generate()).toEqual('2 + 2 = 1');
    });

    it('test_expressions', function() {
        var template = new Template('2 + 2 = {{ 2 / 2 + 2 }}');
        expect(template.generate()).toEqual('2 + 2 = 3');
    });

    it('test_comment', function() {
        var template = new Template('Hello{# TODO i18n #} {{ name }}!');
        expect(template.generate({name:'Ben'})).toEqual('Hello Ben!');
    });

    it('test_include', function() {
        var loader = new DictLoader({
            "index.html": '{% include "header.html" %}\nbody text',
            "header.html": "header text"
        });
        expect(loader.load('index.html').generate()
              ).toEqual('header text\nbody text');
    });
        
    it('test_extends', function() {
        var loader = new DictLoader({
            "base.html": '<title>{% block title %}default title{% end %}</title>\n' +
                '<body>{% block body %}default body{% end %}</body>',
            "page.html": '{% extends "base.html" %}' +
                '{% block title %}page title{% end %}' +
                '{% block body %}page body{% end %}'
        });
        expect(loader.load('page.html').generate()
              ).toEqual("<title>page title</title>\n<body>page body</body>");
    });

    it('relative_load', function() {
        var loader = new DictLoader({
            "a/1.html": "{% include 'a/2.html' %}",
            "a/2.html": "{% include 'b/3.html' %}",
            "b/3.html": "ok"
        });
        expect(loader.load("a/1.html").generate()
              ).toEqual("ok");
    });

    it('test_relative_load', function() {
        var loader = new DictLoader({
            "a/1.html": "{% include 'a/2.html' %}",
            "a/2.html": "{% include 'b/3.html' %}",
            "b/3.html": "ok"
        });
        expect(loader.load("a/1.html").generate()
              ).toEqual("ok");
    });

    it('test_escaping', function() {
        var isParseError = function(template) {
            try {
                new Template(template);
            } catch (x) {
                if (x.name === 'ParseError') {
                    return true;
                }
            }
            return false;
        };

        expect(isParseError('{{')).toBeTruthy();
        expect(isParseError('{%')).toBeTruthy();
        expect(new Template('{{!').generate()).toEqual('{{');
        expect(new Template('{%!').generate()).toEqual('{%');
        expect(new Template('{#!').generate()).toEqual('{#');

        //TODO: xxx
        //expect(new Template("{{ 'expr' }} {{ !jquery expr }}").generate()
        //      ).toEqual("expr {{jquery expr}}");
    });

    it('test_unicode_template', function() {
        //TODO: xxx
    });

    it('test_unicode_literal_expression', function() {
        //TODO: xxx
    });

    it('test_custom_namespace', function() {
        var loader = new DictLoader({
            "test.html": "{{ inc(5) }}"
        }, null, {"inc": function(x){ return x + 1; }});
        expect(loader.load("test.html").generate()).toEqual("6");
    });

    it('test_apply', function() {
        function upper(s){
            return s.toUpperCase();
        }
        var template = new Template("{% apply upper %}foo{% end %}");
        expect(template.generate({upper: upper})).toEqual("FOO");
    });

    it('test_if', function() {
        var template = new Template("{% if (x > 4) %}yes{% else %}no{% end %}");
        expect(template.generate({x:5})).toEqual("yes");
        expect(template.generate({x:3})).toEqual("no");
    });

    it('test_if_empty_body', function() {
        var template = new Template("{% if (true) %}{% else %}{% end %}");
        expect(template.generate()).toEqual("");
    });

    it('test_try', function() {
        var template = new Template("{% try %}try{% set y = 1/x; %}" +
                                    "{% catch(e) %}-catch" +
                                    "{% end %}-end");
        expect(template.generate({x:1})).toEqual("try-end");
        expect(template.generate({})).toEqual("try-catch-end");
    });

    it('test_comment_directive', function() {
        var template = new Template("{% comment this is comment. %}");
        expect(template.generate()).toEqual("");
        var template = new Template("{% comment this is comment too. %}xyz");
        expect(template.generate()).toEqual("xyz");
    });

    it('test_break_continue', function() {
        var template = new Template("{% for (var i = 0; i < 10; i++) %}" +
                                    "  {% if (i === 2) %}" +
                                    "    {% continue %}" +
                                    "  {% end %}" +
                                    "  {{ i }}" +
                                    "  {% if (i === 6) %}" +
                                    "    {% break %}" +
                                    "  {% end %}" +
                                    "{% end %}");
        var result = template.generate();
        // remove extraneous whitespace
        result = result.split(" ").join("");
        expect(result).toEqual("013456");
    });

    it('test_break_outside_loop', function() {
        var isParseError = function(template) {
            try {
                new Template(template);
            } catch (x) {
                if (x.name === 'ParseError') {
                    return true;
                }
            }
            return false;
        };
        expect(isParseError('{% break %}')).toBeTruthy();
    });
});

describe('AutoEscapeTest', function() {
    var templates = {
        "raw_expression.html": "{% autoescape xhtml_escape %}" +
            "expr: {{ name }}\n" +
            "raw: {% raw name %}",
    };

    it('test_raw_expression', function() {
        var loader = new DictLoader(templates);
        function render(name) {
            return loader.load(name).generate({name:'<>&"'})
        }
        expect(render("raw_expression.html")).toEqual("expr: &lt;&gt;&amp;&quot;\n" +
                                                      "raw: <>&\"");
    });

    it('test_whitespace_by_loader', function(){
        var templates = {
            "foo.html": "\t\tfoo\n\n",
            "bar.txt": "\t\tbar\n\n",
        };
        var loader = new DictLoader(templates, null, null, 'all');
        expect(loader.load("foo.html").generate()).toEqual('\t\tfoo\n\n');
        expect(loader.load("bar.txt").generate()).toEqual('\t\tbar\n\n');
        var loader = new DictLoader(templates, null, null, 'single');
        expect(loader.load("foo.html").generate()).toEqual(' foo\n');
        expect(loader.load("bar.txt").generate()).toEqual(' bar\n');
        var loader = new DictLoader(templates, null, null, 'oneline');
        expect(loader.load("foo.html").generate()).toEqual(' foo ');
        expect(loader.load("bar.txt").generate()).toEqual(' bar ');
    });

    it('test_whitespace_directive', function(){
        var loader = new DictLoader({
            "foo.html": "{% whitespace oneline %}\n"
                + "{% for (var i=0; i < 3; i++) %}\n"
                + "  {{ i }}\n"
                + "{% end %}\n"
                + "{% whitespace all %}\n"
                + "    pre\tformatted\n"
        });
        expect(loader.load("foo.html").generate()).toEqual('  0  1  2  \n    pre\tformatted\n');
    });
});

describe('Template', function() {
    /*
     * my test code.
     */
    
    it('test_set', function() {
        var template = new Template('{% set var x = 1; %}{{x}}');
        expect(template.generate()).toEqual('1');
    });

    it('test_if_else_if', function() {
        var template = new Template('{% if (x === 1) %}1{% else if (x === 2) %}2{% else %}3{% end %}');
        expect(template.generate({x: 1})).toEqual('1');
        expect(template.generate({x: 2})).toEqual('2');
        expect(template.generate({x: 3})).toEqual('3');
    });

    it('test_while', function() {
        var template = new Template('{% set var i = 0; %}' +
                                    '{% while (i < students.length) %}' +
                                    '<bold>{{ students[i].name }}</bold>' +
                                    '{% set i += 1; %}' +
                                    '{% end %}');
        var students = [{name: 'Ben'}, {name: 'Armin'}];
        expect(template.generate({students: students})).toEqual('<bold>Ben</bold><bold>Armin</bold>');
    });

    it('test_...?', function() {
        var loader = new DictLoader({
            "base.html": ''
                + '<html>'
                + '<head>'
                + '<title>{% block title %}Default title{% end %}</title>'
                + '</head>'
                + '<body>'
                + '<ul>'
                + '{% for (key in students) %}'
                + '{% block student %}'
                + '<li>{{ escape(students[key].name) }}</li>'
                + '{% end %}'
                + '{% end %}'
                + '</ul>'
                + '</body>'
                + '</html>'
                + '',
            "bold.html": ''
                + '{% extends "base.html" %}'
                + '{% block title %}A bolder title{% end %}'
                + '{% block student %}'
                + '<li><span style="bold">{{ escape(students[key].name) }}</span></li>'
                + '{% end %}'
        });

        var students = [{name: 'Ben'}, {name: 'Armin'}];

        expect(loader.load('bold.html').generate({students:students})
              ).toEqual(''
                + '<html>'
                + '<head>'
                + '<title>A bolder title</title>'
                + '</head>'
                + '<body>'
                + '<ul>'
                + '<li><span style="bold">Ben</span></li>'
                + '<li><span style="bold">Armin</span></li>'
                + '</ul>'
                + '</body>'
                + '</html>'
                + '');
    });

    it('test_for and duble quote', function() {
        var loader = new DictLoader({
            "base.html": ''
                + '{% for (key in students) %}'
                + '{% block student %}'
                + '<bold style="">{{ students[key].name }}'
                + '{% end %}'
                + '{% end %}'
                + '',
            "bold.html": ''
                + '{% extends "base.html" %}'
                + '{% block student %}'
                + '  <bold>{{ students[key].name }}</bold>'
                + '{% end %}'
        });

        var students = [{name: 'Ben'}, {name: 'Armin'}];

        expect(loader.load('bold.html').generate({students:students})
              ).toEqual(''
                + ' <bold>Ben</bold>'
                + ' <bold>Armin</bold>'
                + '');
    });

    it('test_for', function() {
        var loader = new DictLoader({
            "base.html": ''
                + '{% for (key in students) %}'
                + '{% block student %}'
                + '{{ students[key].name }}'
                + '{% end %}'
                + '{% end %}'
                + '',
            "bold.html": ''
                + '{% extends "base.html" %}'
                + '{% block student %}'
                + '  <bold>{{ students[key].name }}</bold>'
                + '{% end %}'
        });

        var students = [{name: 'Ben'}, {name: 'Armin'}];

        expect(loader.load('bold.html').generate({students:students})
              ).toEqual(''
                + ' <bold>Ben</bold>'
                + ' <bold>Armin</bold>'
                + '');
    });

    it('test_generate', function() {
        var template = new Template('{{ add(1, 2) }}');

        /**
         * @param {number} x .
         * @param {number} y .
         * @return {string} .
         */
        function add(x, y) {
            return String(x + y);
        }
        expect(template.generate({add:add})).toEqual('3');
    });

    it('test_simple_expression', function() {
        var template = new Template('<html>{{ myvalue }}</html>');
        expect(template.generate({myvalue:'xxx'})).toEqual('<html>xxx</html>');
    });

    it('test_simple_block', function() {
        var template = new Template('{% block title %}Default title{% end %}');
        expect(template.generate()).toEqual('Default title');
    });

    it('test_suffix_quote_stripping', function() {
        var loader = new DictLoader({
            "base_double.html": "Double: {% block content %}{% end %}",
            "base_single.html": "Single: {% block content %}{% end %}",
            "base_none.html": "None: {% block content %}{% end %}",
            "page_double.html": '{% extends "base_double.html" %}{% block content %}ok{% end %}',
            "page_single.html": "{% extends 'base_single.html' %}{% block content %}ok{% end %}",
            "page_none.html": "{% extends base_none.html %}{% block content %}ok{% end %}",
            "include_double.html": '{% include "base_double.html" %}',
            "include_single.html": "{% include 'base_single.html' %}",
            "include_none.html": "{% include base_none.html %}"
        });

        expect(loader.load('page_double.html').generate()).toEqual("Double: ok");
        expect(loader.load('page_single.html').generate()).toEqual("Single: ok");
        expect(loader.load('page_none.html').generate()).toEqual("None: ok");

        expect(loader.load('include_double.html').generate()).toEqual("Double: ");
        expect(loader.load('include_single.html').generate()).toEqual("Single: ");
        expect(loader.load('include_none.html').generate()).toEqual("None: ");
    });

    it('test_eval_avoidance_variable_scope', function() {
        var template = new Template("{{ name }} - {{ xhtml_escape }} - {{ escape }}");
        expect(template.generate({
            name: "Test",
            xhtml_escape: "yes",
            escape: "no"
        })).toEqual("Test - yes - no");
    });
});

describe('LaneRendererTest', function() {
    it('test_lane_render_fragment', function() {
        var mockLane = {
            runner: {
                model: {
                    color: "ff0000"
                }
            },
            number: 1,
            position: 2,
            len: 5
        };

        var renderer = new LaneRenderer();
        var fragment = renderer.Render(mockLane);

        expect(fragment instanceof DocumentFragment).toBeTruthy();
        expect(fragment.childNodes.length).toEqual(4);
        expect(fragment.childNodes[0].textContent).toEqual("___\uD83C\uDFC7__");
        expect(fragment.childNodes[1].textContent).toEqual("|");
        expect(fragment.childNodes[2].tagName.toLowerCase()).toEqual("span");
        expect(fragment.childNodes[2].style.backgroundColor).toEqual("rgb(255, 0, 0)");
        expect(fragment.childNodes[2].textContent).toEqual("1");
        expect(fragment.childNodes[3].textContent).toEqual("|2");
    });

    it('test_racetracklayer_dom_fragment', function() {
        var mockRacetrack = {
            lanes: [
                {
                    runner: { model: { color: "ff0000" } },
                    number: 1,
                    position: 1,
                    len: 3
                },
                {
                    runner: { model: { color: "00ff00" } },
                    number: 2,
                    position: 2,
                    len: 3
                }
            ]
        };

        var layer = new RacetrackLayer(null);
        var fragment = layer.DOM(mockRacetrack);

        expect(fragment instanceof DocumentFragment).toBeTruthy();
        expect(fragment.childNodes.length).toEqual(9);
        expect(fragment.childNodes[4].tagName.toLowerCase()).toEqual("br");
    });
});

