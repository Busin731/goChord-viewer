/**
 * <ul>
 * <li>Project: GoChord Viewer for guitar (based on UkeGeeks' Scriptasaurus from Buz Carter)</li>
 * <li>Version: 0.1.3</li>
 * <li>Author: Jaime Mora</li>
 * <li>License MIT</li>
 * </ul>
 *
 * <h3>Overview</h3>
 * <p>Reads marked-up music (lyrics + chords) extracting all of the chords used;
 * Generates a chord diagrams using HTML5 &lt;canvas&gt; and rewrites the music with
 * standard HTML wrapping the chords.</p>
 */

import { css } from "./styles.css";

export { Main } from './main';
export { Settings } from './settings';
export { ToolsLite } from './toolsLite';
export { OverlapFixer } from './overlapFixer';
export { Definitions } from './definitions';
export { Transpose } from './transpose';