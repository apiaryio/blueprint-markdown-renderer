/*jslint node: true*/
'use strict';

module.exports = {
  renderHtml:           require('./commonmark').renderHtml,
  renderRobotskirtHtml: require('./rs').renderRobotskirtHtml,
  uriPolicy:            require('./uriPolicy').uriPolicy
};
