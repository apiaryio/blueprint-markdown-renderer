'use strict';

var commonmark = require('./commonmark');
var sanitize = require('./sanitize');

module.exports = {
  rendererFactory: commonmark.rendererFactory,
  renderHtml: commonmark.renderHtml,
  parse: commonmark.parse,
  sanitize: sanitize,
};
