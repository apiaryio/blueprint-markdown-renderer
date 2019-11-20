var allowedUriSchemesRegexp = /^(https?|mailto|#)/i;
var absoluteUriRegexp = /^[a-zA-Z]+:\//;

function linkHrefHook(node) {
  if (node.nodeName !== 'A') { return; }

  var href = node.getAttribute('href') || '';

  if (!absoluteUriRegexp.test(href)) { return; }

  if (allowedUriSchemesRegexp.test(href)) { return; }

  node.removeAttribute('href');
};

function sanitize(source, config) {
  var dompurify = require('dompurify');
  
  dompurify.removeAllHooks();
  dompurify.addHook('afterSanitizeAttributes', linkHrefHook);

  return dompurify.sanitize(source, config);
}

module.exports = sanitize;
