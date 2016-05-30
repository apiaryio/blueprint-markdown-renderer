'use strict';

var sanitizer = require('sanitizer');
var MarkdownIt = require('markdown-it');
var uriPolicy = require('./uriPolicy').uriPolicy;

var plugins = [
  require('markdown-it-sup'),
  require('markdown-it-sub'),
  require('markdown-it-lazy-headers'),
  require('./plugins/alignedTable.js')
];

var defaultOptions = {
  'linkify': true,
  'html': true,
  'langPrefix': ''
};


function rendererFactory() {
  var md = new MarkdownIt('commonmark', defaultOptions);

  plugins.forEach(function pluginLoader(pluginFn) {
    md.use(pluginFn);
  });

  md.inline.ruler.enable(['sup', 'sub']);

  return md;
}

var commonmarkRenderer = rendererFactory();

function renderHtml(markdownString, options, cb) {
  var usedRenderer, cleanRenderer, result;

  usedRenderer = commonmarkRenderer;
  cleanRenderer = false;

  if (markdownString == null) {
    markdownString = '';
  }

  if (typeof(options) === 'function') {
    cb = options;
    options = {
      'sanitize': true
    };
  }
  else {
    usedRenderer = rendererFactory();
    cleanRenderer = true;
  }

  result = usedRenderer.render(markdownString);

  if (result.substr(-1, 1) !== '\n') {
    result = result + '\n';
  }

  if (options.sanitize) {
    result = sanitizer.sanitize(result, uriPolicy);
  }

  if (cleanRenderer) {
    usedRenderer = null;
  }

  cb(null, result);
}


// API
module.exports = {
  rendererFactory: rendererFactory,
  renderHtml: renderHtml
};
