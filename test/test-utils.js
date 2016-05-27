var assert = require('chai').assert;

var jsdom = require('jsdom');
var domCompare = require('dom-compare').compare;


function compareHtmlAsDomNodes(htmlA, htmlB) {
  if (htmlA === htmlB) {
    return true;
  }
  return deepContainParseDOM('root', {'html': htmlA}, {'html': htmlB});
}

function deepContainParseDOM(path, actual, expected) {
  var comparison, el, i, j, key, keys, len, len1, res, semiRes, tempRes;
  // by default: actual === expected
  res = true;

  if (typeof(expected) === 'object' && typeof(actual) === 'object') {
    keys = Object.keys(expected);
    // let's iterate over "expected" keys only => the "actual" object can
    // then contain some non-expected keys we do not check, and it is ok
    if (keys.length > 0) {
      for (j = 0, len1 = keys.length; j < len1; j++) {
        key = keys[j];
        semiRes = hasOwnProperty.call(actual, key);
        assert.ok(semiRes, "Actual Object \"" + path + "\" does not contain key \"" + key + "\"");
        semiRes = semiRes && !!deepContainParseDOM(path + ("." + key), actual[key], expected[key]);
        if (!semiRes) {
          res = false;
        }
      }
    } else {
      res = !assert.equal(keys.length, Object.keys(actual).length, "Empty objects (\"{}\") are not equal");
    }
  } else {
    // basic primitive value
    if (path.match(/\.(html)/i)) {
      comparison = domCompare(jsdom.jsdom("" + actual), jsdom.jsdom("" + expected), {stripSpaces: true});
      tempRes = comparison.getResult();
      if (tempRes !== true) {
        console.log('Differences:', comparison.getDifferences());
      }
      res = !assert.isTrue(tempRes, "Expected DOM:\n" + expected + "\n to equal DOM:\n" + actual + "\nat path " + path);
    } else {
      res = !assert.strictEqual(actual, expected, "Expected '" + expected + "' to equal '" + actual + "' at path " + path);
    }
  }
  return !!res;
}

module.exports = {
  compareHtmlAsDomNodes: compareHtmlAsDomNodes,
  deepContainParseDOM: deepContainParseDOM
};
