'use strict';

var fs = require('fs');
var path = require('path');

function loadFixture(name) {
  return fs.readFileSync(path.join(__dirname, './fixtures', name), { encoding: 'utf8' });
}

module.exports = {
  'advanced': '_About Sample API_\n*Is there nothing to say?*\n\n- list\n- items\n\n#headerName\n\n# normal header\n\n1. numbered list\n1. item-of-OL\n\nparagraph\n\n- and a\n- UL immediately following\n- the paragraph\n- space around LI\n',
  loadFixture: loadFixture
};
