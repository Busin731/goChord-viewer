/**
 * <ul>
 * <li>Project: GoChord Viewer for guitar (based on UkeGeeks' Scriptasaurus from Buz Carter)</li>
 * <li>Version: 0.1.0</li>
 * <li>Author: Jaime Mora</li>
 * <li>License MIT</li>
 * </ul>
 *
 * <h3>Overview</h3>
 * <p>Reads marked-up music (lyrics + chords) extracting all of the chords used;
 * Generates a chord diagrams using HTML5 &lt;canvas&gt; and rewrites the music with
 * standard HTML wrapping the chords.</p>
 */

import { css } from "./src/styles.css";

export { GcViewer } from './src/gcViewer';
export { Settings } from './src/settings';