'use strict';

var MarkdownIt = require('markdown-it');

var defaultPlugins = [
  require('markdown-it-sup'),
  require('markdown-it-sub'),
  require('markdown-it-lazy-headers'),
  require('./plugins/alignedTable.js')
];

var defaultEnabledPlugins = [
  'linkify', 'sup', 'sub', 'link', 'autolink'
];

var defaultOptions = {
  'linkify': true,
  'html': true,
  'langPrefix': '',
  'xhtmlOut': false,
  'breaks': false
};

var defaultRenderer = rendererFactory();


function rendererFactory() {
  var renderer = new MarkdownIt('commonmark', defaultOptions);

  defaultPlugins.forEach(function pluginLoader(pluginFn) {
    renderer.use(pluginFn);
  });

  renderer.enable(defaultEnabledPlugins, true);

  renderer.linkify.set({ fuzzyLink: false, fuzzyEmail: false });

  return renderer;
}

function renderHtml(markdownString, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {
      'sanitize': true
    };
  } else if (!options) {
    options = {
      'sanitize': true
    };
  }

  if (markdownString == null) {
    markdownString = '';
  }

  var renderer = options.renderer || defaultRenderer;
  var env = options.env || {};
  var result = null;

  result = renderer.render(markdownString, env);

  if (result.substr(-1, 1) !== '\n') {
    result = result + '\n';
  }

  if (typeof options.sanitize === 'function') {
    result = options.sanitize(result);
  }

  if (!cb) {
    return result;
  }

  cb(null, result);
}

function parse(markdownString, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  if (markdownString == null) {
    markdownString = '';
  }

  var renderer = options.renderer || defaultRenderer;
  var env = options.env || {};
  var result = null;

  try {
    result = defaultRenderer.parse(markdownString, env)

    if (!cb) {
      return result;
    }

    cb(null, result);
  } catch(ex) {
    if (!cb) {
      throw ex;
    }

    cb(ex)
  }
};

// API
module.exports = {
  rendererFactory: rendererFactory,
  renderHtml: renderHtml,
  parse: parse
};
