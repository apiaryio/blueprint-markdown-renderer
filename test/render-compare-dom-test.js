'use strict';

var assert = require('chai').assert;
var compareHtmlAsDomNodes = require('./test-utils').compareHtmlAsDomNodes;

var markdownRenderer = require('../lib/index.js');

var fixtures = require('./fixtures');

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


    Object.keys(fixtures).forEach(function(fixtureKey) {
      it('Parses a fixture "' + fixtureKey + '"', function(done) {
        var actualHtml;

        actualHtml = markdownRenderer.renderRobotskirtHtml(''.concat(fixtures[fixtureKey]));

        markdownRenderer.renderHtml(''.concat(fixtures[fixtureKey]), function(error, html) {
          assert.ok(compareHtmlAsDomNodes(html, actualHtml));
          done(error);
        });

      });
    });


  });
});
