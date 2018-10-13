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
    {title: My Little Grass Shack in Kealakekua}
    {subtitle: GoChord-viewer example version}
    {artist: Lyrics & Music: B.Cogswell, T.Harrison and J.Noble (1933)}

    {sot}
    E|-----2---2-----|-------3-3---
    B|---3---3---3---|-----0-------
    G|-2-------------|---0---------
    D|-2-------------|---0---------
    A|------1--------|-2-----------
    E|---------------|-----2-------
    {eot}

    {comment: Verse 1}
    I want to go [G]back to my little grass shack
    In Kealakekua, [A7]Hawaii
    I want to [D7]be with all the kanes and wahines
    That I used to [G]know... so long ago
    I can [B7]hear the old guitars a-playing[E7]
    On the beach at Honaunau
    I can [A7]hear the old Hawaiians saying
    "Komo [D7]mai no kaua i ka hale welakahau"

    {comment: Verse 2}
    It won't be [G]long till my ship will be sailing
    Back to [A7]Kona
    A [D7]grand old place
    That's always fair to [B7]see... you're telling me
    I'm [E7]just a little Hawaiian and a homesick island boy
    I [A7]want to go back to my fish and poi

    {start_of_chorus}
    {comment: Chorus}
    I want to go [G]back to my little grass shack
    In Kealakekua, [A7]Hawaii
    Where the [D7]humu-humu nuku-nuku a pua'a
    Go swimming [G]by
    {end_of_chorus}

    {comment: Outro}
    Where the [D7]humu-humu nuku-nuku a pua'a
    Go swimming [G]by

    `.substring(1);

    GcViewer.init(false);
    GcViewer.run(chordSheet);
}

component();