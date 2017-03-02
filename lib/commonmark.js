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
  'langPrefix': '',
  'xhtmlOut': false,
  'breaks': false
};


function rendererFactory() {
  var md = new MarkdownIt('commonmark', defaultOptions);

  // "linkify" plugin must be enabled separately
  // even though it is set in the config. But /shrug
  md.enable('linkify', true);

  plugins.forEach(function pluginLoader(pluginFn) {
    md.use(pluginFn);
  });
  md.linkify.set({ fuzzyLink: false, fuzzyEmail: false });

  md.enable(['sup', 'sub', 'link', 'autolink'], true);

  return md;
}

var defaultRenderer = rendererFactory();

function renderHtml(markdownString, options, cb) {
  var usedRenderer, result;

  usedRenderer = defaultRenderer;

  if (markdownString == null) {
    markdownString = '';
  }

  if (typeof(options) === 'function') {
    cb = options;
    options = null;
  }
  else {
    usedRenderer = rendererFactory();
  }

  if (options == null) {
    options = {
      'sanitize': true
    };
  }

  result = usedRenderer.render(markdownString);

  if (result.substr(-1, 1) !== '\n') {
    result = result + '\n';
  }

  if (options.sanitize) {
    result = sanitizer.sanitize(result, uriPolicy);
  }

  if (!cb) {
    return result;
  }

  cb(null, result);
}

function parse(markdownString, cb) {
  try {
    cb(null, defaultRenderer.parse(markdownString, {}));
  } catch(ex) {
    cb(ex)
  }
};

// API
module.exports = {
  rendererFactory: rendererFactory,
  renderHtml: renderHtml,
  parse: parse,
};
