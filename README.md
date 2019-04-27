![Demo](https://github.com/jrmora/goChord-viewer/blob/master/GoChordViewer.png)

# GoChord Viewer

A JavaScript frontend library for parsing and formatting ChordPro songs with chord diagrams.

Inspired by: https://github.com/buzcarter/UkeGeeks with the following modifications:

- Adaptation for Guitar
- Upgraded to ES6
- Allows to send the chordpro songText instead of preload it in the document
- Import Themes class (it allows modify the viewer only, not the complet page body)
- Beautify chord diagrams
- Chord diagrams on right side
- Bugs fixes
- Bundled and minified to optimize performance

## Overview

Reads marked-up music (lyrics + chords) extracting all of the chords used.
Generates chord diagrams using HTML5 &lt;canvas&gt; and rewrites the music with standard HTML wrapping the chords.

#### Part of [goChord](https://gochord.com/)

## Usage

`GoChord Viewer` is on npm, to install run:

```sh
$ npm i gochord-viewer
```

Load with `require()`:

```javascript
var GoChordViewer = require("gochord-viewer");
```

or `import` (es6, typescript):

```javascript
import * as GoChordViewer from "gochord-viewer";
```

And call the Main class:

```javascript
GoChordViewer.Main.init(false);
GoChordViewer.Main.run(chordSheet);
```

## Demo

Open demo/index.html on the browser to see a webpage example.

You can also modify the sources to see changes:

1.  Clone
2.  Install dependencies

```sh
$ npm i
```

3.  Change the songText input in demo/sample.js (Or any source file in src)
4.  Bundle files with webpack (the output will be in dist folder)

```sh
$ npm run build
```

5.  Open again demo/index.html to see the result!

## ChordPro format: Lyrics and Chords

Essentially, it looks like this:

```
    {title: Praise Adonai}
    {artist: Paul Baloche}

    {sot}
    E|-----2---2-----|-------3-3---
    B|---3---3---3---|-----0-------
    G|-2-------------|---0---------
    D|---------------|---0---------
    A|---------------|-2-----------
    E|---------------|-------------
    {eot}

    [Am]Who is like [F]Him,
    The Lion and the [C]Lamb
    Seated on the [G]throne    [E7]
    [Am]Mountains bow [F]down
    Every ocean [C]roars
    To the Lord of [G]hosts

    {start_of_chorus}
    [F]Praise Ado[Am]nai
    From the [G]rising of the sun
    'Till the [Dm7]end of every [F]day[G]
    [F]Praise Ado[Am]nai
    All the [G]nations of the earth
    All the [Dm7] Angels and the [F]Saints
    [G]Sing [Bbsus2]praise
    {end_of_chorus}
```

## Themes

- normal
- reversed
- frosty
- jellyBean
- justBlack
- krampus
- western
- pumpkin
- notebook
- zombie

## Contribute

Contributions are welcome, especially with the chords fingers:

https://github.com/jrmora/goChord-viewer/blob/master/src/instrumentDefinitions.js
