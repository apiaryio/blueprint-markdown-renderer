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
md.block.ruler.enable(['table']);

var uriPolicy = function uriPolicy (value) {
  //TODO: Attack vector via non-http protocols
  return value;
};

/**
 * Adds two numbers.
 * @param {number}
 * @param {number}
 * @returns {number}
 */
module.exports.renderHtml = function(markdownString, options, cb) {
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

    renderer.disable('table');

    plugins.forEach(function pluginLoader(pluginFn){
      renderer.use(pluginFn);
    });
    renderer.inline.ruler.enable(['sup', 'sub']);
    renderer.block.ruler.enable(['table']);
  }

  var result = renderer.render(markdownString);

  if (result.substr(-1, 1) !== '\n')
    result = result + '\n';

  if (options.sanitize) {
    result = sanitizer.sanitize(result, uriPolicy);
  }

  cb(null, result);
};
