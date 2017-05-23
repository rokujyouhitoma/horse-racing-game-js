//"use strict";

/**
 * Original code is here.
 * https://raw.githubusercontent.com/rokujyouhitoma/js-templateengine/develop/tests/template_spec.js
 */

var describe = function(dname, func){
    var dname = dname;
    this.it = function(name, func){
        var name = name;
        var expect = function(value){
            var Test = function(value){
                this.value = value;
            };
            Test.prototype.toEqual = function(v){
                if (this.value != v) {
                    console.error(dname, name, this.value, " not equal to ", v);
                }
            };
            Test.prototype.toBeTruthy = function(){
                if(!this.value){
                    console.error(dname, name, this.value);
                }
            };
            return new Test(value);
        };
        this.expect = expect;
        func.call(this);
    };
    func.call(this);
};

describe('Template', function() {
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
});
