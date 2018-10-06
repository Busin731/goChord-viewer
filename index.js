"use strict";

//var goChord = require('lib/namespace');

/**
 * Run viewer
 * @param {string} songText
 */
module.exports = function(songText) {
    var goChord = {};
  goChord.settings.inlineDiagrams = false;
  goChord.gcViewer.init(false);
  goChord.cViewer.run(songText);
};
