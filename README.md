![Demo](https://github.com/jrmora/goChord-viewer/blob/master/GoChordViewer.png)

# GoChord Viewer
A JavaScript library for parsing and formatting ChordPro songs with chord diagrams.

Inspired by: https://github.com/buzcarter/UkeGeeks with the following modifications:

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
2.  Install dependencies
```bash 
npm i
```
3.  Bundle js and css files with webpack (the output will be in dist folder)
```bash 
npm run build
```
4.  Open the dist/index.html on the browser to see the result!
5.  (Optional) You want change the songText input in test/test.js and repeat steps 3 and 4

### ChordPro format: Lyrics and Chords

Essentially, it looks like this:

```
{title: My Little Grass Shack in Kealakekua}
{subtitle: GoChord-viewer example version}

{sot}
E|-----2---2-----|-------3-3---
B|---3---3---3---|-----0-------
G|-2-------------|---0---------
D|-2-------------|---0---------
A|------1--------|-2-----------
E|---------------|-----2-------
{eot}

It won't be [G]long till my ship will be sailing
Back to [A7]Kona
A [D7]grand old place
That's always fair to [B7]see... you're telling me
I'm [E7]just a little Hawaiian and a homesick island boy
I [A7]want to go back to my fish and poi

{start_of_chorus}
I want to go [G]back to my little grass shack
In Kealakekua, [A7]Hawaii
Where the [D7]humu-humu nuku-nuku a pua'a
Go swimming [G]by
{end_of_chorus}
[F]Raindrops keep falling on my [Fmaj7]head.
```
