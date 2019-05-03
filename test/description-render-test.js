'use strict';

var assert = require('chai').assert;
var { JSDOM } = require('jsdom');
global.window = (new JSDOM('')).window;

var markdownRenderer = require('../lib/index.js');
var sanitize = markdownRenderer.sanitize;

describe('Markdown', function() {
  describe('#parse', function() {

    it('Parse a paragraph', function(done) {
      var expectedTokens, markdownString;
      markdownString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      expectedTokens = [
        {
          "type": "paragraph_open",
          "tag": "p",
          "attrs": null,
          "map": [
            0,
            1
          ],
          "nesting": 1,
          "level": 0,
          "children": null,
          "content": "",
          "markup": "",
          "info": "",
          "meta": null,
          "block": true,
          "hidden": false
        },
        {
          "type": "inline",
          "tag": "",
          "attrs": null,
          "map": [
            0,
            1
          ],
          "nesting": 0,
          "level": 1,
          "children": [
            {
              "type": "text",
              "tag": "",
              "attrs": null,
              "map": null,
              "nesting": 0,
              "level": 0,
              "children": null,
              "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              "markup": "",
              "info": "",
              "meta": null,
              "block": false,
              "hidden": false
            }
          ],
          "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "markup": "",
          "info": "",
          "meta": null,
          "block": true,
          "hidden": false
        },
        {
          "type": "paragraph_close",
          "tag": "p",
          "attrs": null,
          "map": null,
          "nesting": -1,
          "level": 0,
          "children": null,
          "content": "",
          "markup": "",
          "info": "",
          "meta": null,
          "block": true,
          "hidden": false
        }
      ];

      markdownRenderer.parse(markdownString, function(err, tokens) {
        // Okay, let me explain it!
        //
        // When you run `sameDeepMembers` without the `JSON.parse/stringify`
        // you get `expected [ Array(3) ] to have the same members as [ Array(3) ]`,
        // even if you run it through a diff, you get `0 differences`.
        //
        // There must be some secret properties hiding on the object
        // breaking the equality test (= prototypes).
        //
        // Let's run `JSON.parse/stringify` to get rid of them.
        assert.sameDeepMembers(
          JSON.parse(JSON.stringify(tokens)),
          JSON.parse(JSON.stringify(expectedTokens, null, 2))
        );

        done(err);
      });
    });
  });

  describe('#toHtml sync (without callback)', function() {

    it('Renders with options passed in', function() {
      var expectedHtml, markdownString, html;
      markdownString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      expectedHtml = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n';
      html = markdownRenderer.renderHtml(markdownString, {});
      assert.strictEqual(html, expectedHtml);
    });
    it('Renders without options passed in', function() {
      var expectedHtml, markdownString, html;
      markdownString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      expectedHtml = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n';
      html = markdownRenderer.renderHtml(markdownString);
      assert.strictEqual(html, expectedHtml);
    });
  });

  describe('#toHtml', function() {

    it('Parse a plain paragraph', function(done) {
      var expectedHtml, markdownString;
      markdownString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      expectedHtml = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse a bullet list (stars used as bullets)', function(done) {
      var expectedHtml, markdownString;
      markdownString = '* Red\n* Green\n* Orange\n* Blue';
      expectedHtml = '<ul>\n<li>Red</li>\n<li>Green</li>\n<li>Orange</li>\n<li>Blue</li>\n</ul>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse a bullet list (dashes used as bullets)', function(done) {
      var expectedHtml, markdownString;
      markdownString = '- Red\n- Green\n- Orange\n- Blue';
      expectedHtml = '<ul>\n<li>Red</li>\n<li>Green</li>\n<li>Orange</li>\n<li>Blue</li>\n</ul>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse an ordered list', function(done) {
      var expectedHtml, markdownString;
      markdownString = '1. Red\n2. Green\n3. Orange\n4. Blue';
      expectedHtml = '<ol>\n<li>Red</li>\n<li>Green</li>\n<li>Orange</li>\n<li>Blue</li>\n</ol>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse nested lists', function(done) {
      var expectedHtml, markdownString;
      markdownString = '* Lorem\n* Ipsum\n  * Dolor\n  * Ismaet';
      expectedHtml = '<ul>\n<li>Lorem</li>\n<li>Ipsum\n<ul>\n<li>Dolor</li>\n<li>Ismaet</li>\n</ul>\n</li>\n</ul>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse headers', function(done) {
      var expectedHtml, markdownString;
      markdownString = '# Level 1\n## Level 2\n### Level 3\n#### Level 4\n##### Level 5\n###### Level 6';
      expectedHtml = '<h1>Level 1</h1>\n<h2>Level 2</h2>\n<h3>Level 3</h3>\n<h4>Level 4</h4>\n<h5>Level 5</h5>\n<h6>Level 6</h6>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse a code block', function(done) {
      var expectedHtml, markdownString;
      markdownString = 'Lorem ipsum dolor isamet.\n\n    alert(\'Hello!\');';
      expectedHtml = '<p>Lorem ipsum dolor isamet.</p>\n<pre><code>alert(\'Hello!\');</code></pre>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse a link without markdown-brackets', function(done) {
      var expectedHtml, markdownString;
      markdownString = '*Here* it is http://link.to/page.html\n';
      expectedHtml = '<p><em>Here</em> it is <a href="http://link.to/page.html">http://link.to/page.html</a></p>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse a fenced code block', function(done) {
      var expectedHtml, markdownString;
      markdownString = '```\nalert(\'Hello!\');\n```';
      expectedHtml = '<pre><code>alert(\'Hello!\');\n</code></pre>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    it('Parse a Markdown table', function(done) {
      var expectedHtml, markdownString;
      markdownString = '| First Header  | Second Header | Third Header         |\n| :------------ | :-----------: | -------------------: |\n| First row     | Data          | Very long data entry |\n| Second row    | **Cell**      | *Cell*               |\n| Third row     | Cell that spans across two columns  ||';
      expectedHtml = '<table>\n<thead>\n<tr>\n<th align="left">First Header</th>\n<th align="center">Second Header</th>\n<th align="right">Third Header</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">First row</td>\n<td align="center">Data</td>\n<td align="right">Very long data entry</td>\n</tr>\n<tr>\n<td align="left">Second row</td>\n<td align="center"><strong>Cell</strong></td>\n<td align="right"><em>Cell</em></td>\n</tr>\n<tr>\n<td align="left">Third row</td>\n<td align="center">Cell that spans across two columns</td>\n<td align="right"></td>\n</tr>\n</tbody>\n</table>\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.strictEqual(html, expectedHtml);
        done(error);
      });
    });

    describe('when sanitize is true', function() {
      it('Parse out script tags', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<div><script>HTML tag</script></div>';
        expectedHtml = '<div></div>\n';
        markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse out custom tags and preserve contents', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<p><custom>HTML tag</custom></p>';
        expectedHtml = '<p>HTML tag</p>\n';
        markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse out custom attributes', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<p custom="test">HTML tag</p>';
        expectedHtml = '<p>HTML tag</p>\n';
        markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse preseves code block tags', function(done) {
        var expectedHtml, markdownString;
        markdownString = '```xml\n<xml>Hello World</xml>\n```';
        expectedHtml = '<pre><code class="xml">&lt;xml&gt;Hello World&lt;/xml&gt;\n</code></pre>\n';
        markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse and sanitize images', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<img src="/image.jpg" onerror="alert(\'XSS\')" />';
        expectedHtml = '<img src="/image.jpg">\n';
        markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      context('given <a> tag', function () {
        it('should not strip href with relative links', function(done) {
          var markdownString = '[Link to something](../../something.html)';
          var expectedHtml = '<p><a href="../../something.html">Link to something</a></p>\n';
          markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
            assert.strictEqual(html, expectedHtml);
            done(error);
          });
        });

        it('should not strip href with url fragment', function(done) {
          var expectedHtml, markdownString;
          markdownString = '[internal](#internal)';
          expectedHtml = '<p><a href="#internal">internal</a></p>\n';
          markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
            assert.strictEqual(html, expectedHtml);
            done(error);
          });
        });

        it('should not strip href with HTTP scheme', function(done) {
          var expectedHtml, markdownString;
          markdownString = 'http://apiary.io';
          expectedHtml = '<p><a href="http://apiary.io">http://apiary.io</a></p>\n';
          markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
            assert.strictEqual(html, expectedHtml);
            done(error);
          });
        });

        it('should not strip href with HTTPS scheme', function(done) {
          var expectedHtml, markdownString;
          markdownString = 'https://apiary.io';
          expectedHtml = '<p><a href="https://apiary.io">https://apiary.io</a></p>\n';
          markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
            assert.strictEqual(html, expectedHtml);
            done(error);
          });
        });

        it('should not strip href with mailto scheme', function(done) {
          var expectedHtml, markdownString;
          markdownString = 'mailto:support@apiary.io';
          expectedHtml = '<p><a href="mailto:support@apiary.io">mailto:support@apiary.io</a></p>\n';
          markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
            assert.strictEqual(html, expectedHtml);
            done(error);
          });
        });

        it('should strip href with FTP scheme', function(done) {
          var expectedHtml, markdownString;
          markdownString = '[ftp](ftp://apiary.io)';
          expectedHtml = '<p><a>ftp</a></p>\n';
          markdownRenderer.renderHtml(markdownString, { sanitize: sanitize }, function(error, html) {
            assert.strictEqual(html, expectedHtml);
            done(error);
          });
        });
      });
    });

    describe('when sanitizing is false', function() {
      it('Parse and leave script tags', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<div><script>HTML tag</script></div>';
        expectedHtml = '<div><script>HTML tag</script></div>\n';
        markdownRenderer.renderHtml(markdownString, {
          sanitize: null
        }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse and leave custom tags and preserve contents', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<p><custom>HTML tag</custom></p>';
        expectedHtml = '<p><custom>HTML tag</custom></p>\n';
        markdownRenderer.renderHtml(markdownString, {
          sanitize: null
        }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });
    });
  });
});
