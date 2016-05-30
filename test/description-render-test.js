'use strict';

var assert = require('chai').assert;

var markdownRenderer = require('../lib/index.js');

describe('Markdown', function() {
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
        markdownRenderer.renderHtml(markdownString, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse out custom tags and preserve contents', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<p><custom>HTML tag</custom></p>';
        expectedHtml = '<p>HTML tag</p>\n';
        markdownRenderer.renderHtml(markdownString, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse out custom attributes', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<p custom="test">HTML tag</p>';
        expectedHtml = '<p>HTML tag</p>\n';
        markdownRenderer.renderHtml(markdownString, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse preseves code block tags', function(done) {
        var expectedHtml, markdownString;
        markdownString = '```xml\n<xml>Hello World</xml>\n```';
        expectedHtml = '<pre><code class="xml">&lt;xml&gt;Hello World&lt;/xml&gt;\n</code></pre>\n';
        markdownRenderer.renderHtml(markdownString, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });

      it('Parse and sanitize images', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<img src="/image.jpg" onerror="alert(\'XSS\')" />';
        expectedHtml = '<img src="/image.jpg">\n';
        markdownRenderer.renderHtml(markdownString, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });
    });

    describe('when sanitizing is false', function() {
      it('Parse and leave script tags', function(done) {
        var expectedHtml, markdownString;
        markdownString = '<div><script>HTML tag</script></div>';
        expectedHtml = '<div><script>HTML tag</script></div>\n';
        markdownRenderer.renderHtml(markdownString, {
          sanitize: false
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
          sanitize: false
        }, function(error, html) {
          assert.strictEqual(html, expectedHtml);
          done(error);
        });
      });
    });
  });
});
