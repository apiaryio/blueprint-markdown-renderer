/*jslint node: true, eqnull: true */
'use strict';

var rs = require('robotskirt');
var sanitizer = require('sanitizer');
var uriPolicy = require('./uriPolicy').uriPolicy;

var rsFlags = [
  rs.EXT_AUTOLINK,
  rs.EXT_FENCED_CODE,
  rs.EXT_LAX_HTML_BLOCKS,
  rs.EXT_TABLES,
  rs.EXT_NO_INTRA_EMPHASIS,
  rs.EXT_STRIKETHROUGH,
  rs.EXT_SUPERSCRIPT
];

var rsRenderer = new rs.HtmlRenderer();
var parserSync = new rs.Markdown(rsRenderer, rsFlags);

// API
module.exports.renderRobotskirtHtml = function renderRobotskirtHtml(markdown, options) {
  var parsed, results;
  if (options == null) {
    options = {};
  }
  if (!markdown) {
    return '';
  }
  if (options.sanitize == null) {
    options.sanitize = true;
  }
  parsed = parserSync.render(markdown);
  if (options.sanitize) {
    results = sanitizer.sanitize(parsed, uriPolicy);
  } else {
    results = parsed;
  }
  if (results.trim() !== '') {
    return results;
  }
  return '<span></span>';
};
