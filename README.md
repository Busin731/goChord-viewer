# GoChord Viewer
A JavaScript library for parsing and formatting ChordPro songs with chord diagrams.

Inspired by: https://github.com/buzcarter/UkeGeeks

* Adaptation for Guitar
* Upgraded to ES6 
* Allows to send the chordpro songText instead of preloading it in the document
* Beautify chord diagrams
* Chord diagrams on right side
* Bugs fixes

## Overview
Reads marked-up music (lyrics + chords) extracting all of the chords used.
Generates chord diagrams using HTML5 &lt;canvas&gt; and rewrites the music with standard HTML wrapping the chords.

#### Part of [goChord](https://gochord.com/)

## Demo
1.  Clone
2.  npm i --Install dependencies
3.  npm run build --Bundle js and css files with webpack (the output will be in dist folder)
4.  Open the dist/index.html on the browser to see the result!
#.  You want change the songText input in src/index.js
