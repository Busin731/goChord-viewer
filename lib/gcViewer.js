/**
 * Finds page HTML elements & creates goChord objects;
 * Reads song text, parses, draws choard diagrams.
 *
 * @class gcViewer
 * @namespace goChord
 * @static
 * @singleton
 */
goChord.gcViewer = (function() {
  /**
   * attach public members to this object
   * @property _public
   * @type {Object}
   */
  var _public = {};

  /**
   * Preps this class for running
   * @method init
   * @param isIeFamily {bool} TRUE if UserAgent (Browser to you and me) is Internet Explorer
   * @return {void}
   */
  _public.init = function(isIeFamily) {
    var defs = goChord.definitions;

    goChord.settings.environment.isIe = isIeFamily;
    // Need to preload Guitar chord library then we can change if needed
    defs.addInstrument(defs.guitar);
    defs.useInstrument(defs.instrument.guitar);
    if (goChord.settings.defaultInstrument != defs.instrument.guitar) {
      defs.useInstrument(goChord.settings.defaultInstrument);
    }
  };

  /**
   * Runs all gcViewer methods using the element Ids defined in the settings class.
   * This is your "Do All". See data.song for structure.
   * @method run
   * @return {songObject}
   */
  // JRM: Agrego songText como parametro enviado
  _public.run = function(songText) {
    //console.log('run (Classic Mode)');
    var handles = _getHandlesFromId();
    if (!handles || !handles.diagrams || !handles.text || !handles.wrap) {
      return null;
    }
    _errList = [];
    var song = _runSong(handles, songText);
    showErrors(_errList[0]);
    return song;
  };

  /**
   * Same as "run" except runs using class names, this allows you to have multiple songs on a single page.
   * @method runByClasses
   * @return {Array of songObject}
   */
  _public.runByClasses = function() {
    var songs = [];
    var songWraps = goChord.toolsLite.getElementsByClass(
      goChord.settings.wrapClasses.wrap
    );
    for (var i = 0; i < songWraps.length; i++) {
      var handles = _getHandlesFromClass(songWraps[i]);
      if (handles === null) {
        continue;
      }
      songs.push(_runSong(handles));
    }
    return songs;
  };

  /**
   * Is this really nececessary?
   * @method setTuningOffset
   * @param offset {int} (optional) default 0. Number of semitones to shift the tuning. See goChord.definitions.instrument.
   */
  _public.setTuningOffset = function(offset) {
    goChord.definitions.useInstrument(offset);
  };

  var _errList = [];
  // song

  /**
   *
   * @method _runSong
   * @private
   * @param handles {goChord.data.htmlHandles}
   * @return {songObj}
   */
  // JRM: agrego songText como parametro enviado
  var _runSong = function(handles, songText) {
    // console.log('run Song');

    // read Music, find chords, generate HTML version of song:
    var cpm = new goChord.cpmParser();
    cpm.init();
    // JRM cambio handles.text.innerHTML por songText
    var song = cpm.parse(songText);
    goChord.definitions.replace(song.defs);

    var chrdPrsr = new goChord.chordParser();
    chrdPrsr.init();
    handles.text.innerHTML = chrdPrsr.parse(song.body);
    song.chords = chrdPrsr.getChords();

    // Draw the Chord Diagrams:
    var painter = new goChord.chordPainter();
    painter.init(handles);
    painter.show(song.chords);
    // Show chord diagrams inline with lyrics
    if (goChord.settings.inlineDiagrams) {
      goChord.toolsLite.addClass(handles.wrap, "gcInlineDiagrams");
      painter.showInline(song.chords);
    }

    // Do Tablature:
    var tabs = new goChord.tabs();
    tabs.init();
    tabs.replace(handles.text);

    // error reporting:
    _errList.push(painter.getErrors());

    var container = handles.wrap;
    if (container) {
      goChord.toolsLite.setClass(container, "gcNoChords", !song.hasChords);
    }

    if (goChord.settings.opts.autoFixOverlaps) {
      goChord.overlapFixer.Fix(handles.text);
    }

    // done!
    return song;
  };

  /**
   * Shows a JavaScript alert box containing list of unknown chords.
   * @method showErrors
   * @return {void}
   */
  var showErrors = function(errs) {
    if (errs.length < 1) {
      return;
    }

    var s = "";
    for (var i = 0; i < errs.length; i++) {
      s += s.length > 0 ? ", " : "";
      s += errs[i];
    }
    console.log("Unknown chords: " + s);
  };

  /**
   *
   * @method _getHandlesFromClass
   * @private
   * @param wrap {domElement}
   * @return {goChord.data.htmlHandles}
   */
  var _getHandlesFromClass = function(wrap) {
    var diagrams = goChord.toolsLite.getElementsByClass(
      goChord.settings.wrapClasses.diagrams,
      wrap
    );
    var text = goChord.toolsLite.getElementsByClass(
      goChord.settings.wrapClasses.text,
      wrap
    );
    if (
      diagrams === undefined ||
      diagrams.length < 1 ||
      text === undefined ||
      text.length < 1
    ) {
      return null;
    }
    return new goChord.data.htmlHandles(wrap, diagrams[0], text[0]);
  };

  /**
   *
   * @method _getHandlesFromId
   * @private
   * @return {goChord.data.htmlHandles}
   */
  var _getHandlesFromId = function() {
    return new goChord.data.htmlHandles(
      document.getElementById(goChord.settings.ids.container),
      document.getElementById(goChord.settings.ids.canvas),
      document.getElementById(goChord.settings.ids.songText)
    );
  };

  return _public;
})();
