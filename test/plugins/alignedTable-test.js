'use strict';

var cheerio = require('cheerio');
var assert = require('chai').assert;

var renderHtml = require('../../lib/index').renderHtml;
var loadFixture = require('../fixtures').loadFixture;

describe('Plugins - Aligned Table', function() {
  [
    {name: 'With Pipes', file: 'with-pipes.md'},
    {name: 'With Pipes and indented', file: 'with-pipes-indented.md'},
    {name: 'Without Pipes', file: 'without-pipes.md'},
    {name: 'Without Pipes and indented', file: 'without-pipes-indented.md'}
  ].forEach(function(test) {
    describe(test.name, function() {
      var $ = null;
      var $table = null;

      before(function() {
        var rendered = renderHtml(loadFixture('tables/' + test.file));
        $ = cheerio.load(rendered);
        $table = $('table');
      });

      it('Cell A is filled', function() {
        assert.equal($table.find('tbody tr:nth-child(1) td:nth-child(1)').text().trim(), 'cell A')
      });

      it('Cell B is filled', function() {
        assert.equal($table.find('tbody tr:nth-child(1) td:nth-child(2)').text().trim(), 'cell B')
      });

      it('Cell C is filled', function() {
        assert.equal($table.find('tbody tr:nth-child(2) td:nth-child(1)').text().trim(), 'cell C')
      });

      it('Cell D is filled', function() {
        assert.equal($table.find('tbody tr:nth-child(2) td:nth-child(2)').text().trim(), 'cell D')
      });
    });
  });
});