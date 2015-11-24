var sanitizer = require('sanitizer');


var uriPolicy = function uriPolicy (value) {
	//TODO: Attack vector via non-http protocols
	return value;
}

/**
 * Adds two numbers.
 * @param {number}
 * @param {number}
 * @returns {number}
 */
module.exports.renderHtml = function(markdownString, options, cb) {

	if (typeof(options) === 'function') {
		cb = options;
		options = {
			'sanitize': true
		}
	}

	var md = require('markdown-it')('commonmark', {
		html: true,
		tables: true,
		langPrefix: '',
	});
	
	var result = md.render(markdownString);

	if (result.substr(-1, 1) !== '\n')
		result = result + '\n';


	if (options.sanitize)
		result = sanitizer.sanitize(result, uriPolicy)
 	
 	cb(null, result);
}
