'use strict';

var commonmark = require('./commonmark');
var uriPolicy = require('./uriPolicy');

module.exports = {
  rendererFactory: commonmark.rendererFactory,
  renderHtml: commonmark.renderHtml,
  parse: commonmark.parse,
  uriPolicy: uriPolicy
};
