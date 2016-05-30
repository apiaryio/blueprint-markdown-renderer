'use strict';

function uriPolicy(value) {
  //TODO: Attack vector via non-http protocols
  return value;
}

// API
module.exports.uriPolicy = uriPolicy;
