/**
 * A container or Models library. Data is really a "Models" namespace. Please refactor.
 * @class Data
 * @singleton
 */
export const Data = (() => {
  /**
   * attach public members to this object
   * @property _public
   * @type {Object}
   */
  const _public = {};

  /**
   * Chord info suitable for plotting on Canvas; has name and dot positions
   * @class expandedChord
   * @constructor
   * @for Data
   * @namespace Data
   */
  _public.expandedChord = function(name) {
    /**
     * string, i.e. 'C#6'
     * @property name
     * @type string
     * @for Data.expandedChord
     */
    this.name = name;
    /**
     * Array of Data.dot objects
     * @property dots
     * @type array
     */
    this.dots = [];
    /**
     * Array of bools, true means that string is not played (muted). i.e. chord.muted[2] means third string is muted.
     * @property muted
     * @type array
     */
    this.muted = [];
  };

  /**
   * Song object holds all meta info (Title, Subtitles) plus an array of plot
   * @class song
   * @constructor
   * @for Data
   * @namespace Data
   */
  _public.song = function() {
    /**
     * Song Title
     * @property title
     * @type string
     * @for Data.song
     */
    this.title = "";
    /**
     * Album
     * @property album
     * @type string
     */
    this.album = "";
    /**
     * Artist Info
     * @property artist
     * @type string
     */
    this.artist = "";
    /**
     * Subtitle, often Artist Info
     * @property st
     * @type string
     */
    this.st = "";
    /**
     * Subtitle Number 2, subtitle2 (not used yet)
     * @property st2
     * @type string
     */
    this.st2 = "";
    /**
     * Song's Key ('A', 'C', etc)
     * @property key
     * @type string
     */
    this.key = "";
    /**
     *
     * @property body
     * @type string
     */
    this.body = "";
    /**
     * True if there is at least one chord in use, false otherwise. Useful for laying out tablature, which might have no chords.
     * @property hasChords
     * @type bool
     */
    this.hasChords = false;

    // JRM: renombrada de ugsMeta a metadata
    this.metadata = [];
    /**
     * array of Data.dots
     * @property defs
     * @type array
     */
    this.defs = [];

    /**
     * array of chord names found in current song
     * @property chords
     * @type array(strings)
     */
    this.chords = [];
  };

  /**
   * A single fretboard fingering "dot" -- the position on the Canvas object that a dot should occupy.
   * @class dot
   * @constructor
   * @for Data
   * @namespace Data
   */
  _public.dot = function(string, fret, finger) {
    // JRM: arreglar el comentario
    /**
     * The guitar's string, numbered from "top" (1) to "bottom" (6). Strings would be ['E' => 1,'A' => 2,'D' => 3,'G' => 4,'B' => 5,'e' => 6]
     * @property string
     * @type int
     * @for Data.dot
     */
    this.string = string;
    /**
     * Fret position, i.e. 0-12
     * @property fret
     * @type int
     */
    this.fret = fret;
    /**
     * Your finger, 0-4
     * @property finger
     * @type int
     */
    this.finger = finger;
  };

  /**
   * @class instrument
   * @constructor
   * @param  {string} key
   * @param  {string} name
   * @param  {string} tuning
   * @param  {array} chords
   */
  _public.instrument = function(key, name, tuning, chords) {
    this.key = key;
    this.name = name;
    this.tuning = tuning;
    this.chords = chords;
  };

  _public.htmlHandles = function(wrap, diagrams, text) {
    this.wrap = wrap;
    this.diagrams = diagrams;
    this.text = text;
  };

  // -----------------------------------------------------------------------------------------
  // *** DOCUMENTATION ONLY ***
  // -----------------------------------------------------------------------------------------
  /**
	 * Documentation Only (no JS Definition)
	 * <br />
	 * <br />The JSON format used for add-in fingerings. Frequently you'll add this to indicate
	 * "nutting" or "barring" with one or more fingers.
	 * <br />
	 * <br />For example, the F#m7 is often played by laying the index finger across the entire
	 * second fret and then placing ring finger on 4th fret of "A" string like this:
	 &gt;pre&lt;
	  E A D G B E
	  - - - - - -  (1st fret)
		X X X X X X
		- - - - - -
		- X - - - -  (4th fret)
	 </pre>
	 * The "A" string has two fingers on it, obviously one does nothing -- except to make the
	 * chord much easier to play.
	 *
	 * @class addInFinger
	 * @constructor
	 * @for Data
	 * @namespace Data
	 */
  /**
   * ex: 'G'
   * @property string
   * @type char
   * @for Data.addInFinger
   */
  /**
   * ex: 0-12
   * @property fret
   * @type int
   * @for Data.addInFinger
   */
  /**
   * ex: 0-4 (where 1 = index finger and 4 = pinky)
   * @property  finger
   * @type int
   * @for Data.addInFinger
   */

  return _public;
})();
