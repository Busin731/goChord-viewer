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
export { GcViewer } from "./lib/gcViewer";
export { Settings } from "./lib/settings";

/**
 * Run viewer
 * @param {string} songText
 */
module.exports = function(songText) {
  Settings.inlineDiagrams = false;
  GcViewer.init(false);
  GcViewer.run(songText);
};


