/*jslint node: true, eqnull: true */
'use strict';

var sanitizer = require('sanitizer');
var MarkdownIt = require('markdown-it');

var md = new MarkdownIt('commonmark', {
  'linkify': true,
  'html': true,
  'langPrefix': ''
});

var plugins = [
  require('markdown-it-sup'),
  require('markdown-it-sub'),
  require('markdown-it-lazy-headers'),
  require('./plugins/aligned-table.js')
];

plugins.forEach(function pluginLoader(pluginFn){
  md.use(pluginFn);
});

md.inline.ruler.enable(['sup', 'sub']);

var uriPolicy = function uriPolicy (value) {
  //TODO: Attack vector via non-http protocols
  return value;
};

module.exports.uriPolicy = uriPolicy;


module.exports.renderRobotskirtHtml = require('./rs').renderRobotskirtHtml;

module.exports.renderHtml = function renderHtml(markdownString, options, cb) {
  var renderer;

  if (typeof(options) === 'function') {
    cb = options;
    renderer = md;
    options = {
      'sanitize': true
    };
  }
  else {
    renderer = new MarkdownIt('commonmark', {
      'linkify': true,
      'html': true,
      'langPrefix': ''
    });
    plugins.forEach(function pluginLoader(pluginFn){
      renderer.use(pluginFn);
    });
    renderer.inline.ruler.enable(['sup', 'sub']);
  }

  var result = renderer.render(markdownString);

  if (result.substr(-1, 1) !== '\n') {
    result = result + '\n';
  }

  if (options.sanitize) {
    result = sanitizer.sanitize(result, uriPolicy);
  }

  cb(null, result);
};



