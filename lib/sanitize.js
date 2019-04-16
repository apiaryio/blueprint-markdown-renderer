var dompurify = require('dompurify');


var allowedUriSchemesRegexp = /^(https?|mailto|#)/i;
var absoluteUriRegexp = /^[a-zA-Z]+:\//;

function linkHrefHook(node) {
  if (node.nodeName !== 'A') { return; }

  var href = node.getAttribute('href') || '';

  if (!absoluteUriRegexp.test(href)) { return; }

  if (allowedUriSchemesRegexp.test(href)) { return; }

  node.removeAttribute('href');
};

dompurify.addHook('afterSanitizeAttributes', linkHrefHook);

function sanitize(source, config) {
  return dompurify.sanitize(source, config);
}

module.exports = sanitize;
