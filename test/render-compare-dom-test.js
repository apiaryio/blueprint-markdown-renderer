var assert = require('chai').assert;
var compareHtmlAsDomNodes = require('./utils').compareHtmlAsDomNodes;

markdownRenderer = require('../lib/index.js');

describe('Compare', function() {
  describe('rendered HTML as DOM nodes', function() {

    it('Parse a plain paragraph', function(done) {
      var markdownString, expectedHtml;
      markdownString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      expectedHtml = '<p>\n\t  \t\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n</p>\n\t  \t\n\n';
      markdownRenderer.renderHtml(markdownString, {}, function(error, html) {
        assert.ok(compareHtmlAsDomNodes(html, expectedHtml));
        done(error);
      });
    });
  });
});
