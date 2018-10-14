/**
 * <ul>
 * <li>Project: GoChord Viewer for guitar (based on UkeGeeks' Scriptasaurus from Buz Carter)</li>
 * <li>Version: 1.0.0</li>
 * <li>Author: Jaime Mora</li>
 * <li>License MIT</li>
 * </ul>
 *
 * <h3>Overview</h3>
 * <p>Reads marked-up music (lyrics + chords) extracting all of the chords used;
 * Generates a chord diagrams using HTML5 &lt;canvas&gt; and rewrites the music with
 * standard HTML wrapping the chords.</p>
 */
import { GcViewer } from "./gcViewer";
import { css } from './styles.css';

function component() {
    const chordSheet = `
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
    `.substring(1);

    GcViewer.init(false);
    GcViewer.run(chordSheet);
}

component();