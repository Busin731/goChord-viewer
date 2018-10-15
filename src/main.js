import { ChordPainter } from "./chordPainter";
import { ChordParser } from "./chordParser";
import { CpmParser } from "./cpmParser";
import { Data } from "./data";
import { Definitions } from "./definitions";
import { InstrumentDefinitions } from "./instrumentDefinitions";
import { OverlapFixer } from "./overlapFixer";
import { Settings } from "./settings";
import { Tabs } from "./tabs";
import { ToolsLite } from "./toolsLite";

/**
 * Finds page HTML elements & creates goChord objects;
 * Reads song text, parses, draws choard diagrams.
 *
 * @class Main
 * @static
 * @singleton
 */
export const Main = (() => {
    /**
     * attach public members to this object
     * @property _public
     * @type {Object}
     */
    const _public = {};

    var _errList = [];

    /**
     * Preps this class for running
     * @method init
     * @param isIeFamily {bool} TRUE if UserAgent (Browser to you and me) is Internet Explorer
     * @return {void}
     */
    _public.init = isIeFamily => {
        const defs = Definitions;

        Settings.environment.isIe = isIeFamily;
        // Need to preload Guitar chord library then we can change if needed
        defs.addInstrument(InstrumentDefinitions.guitar);
        defs.useInstrument(defs.instrument.guitar);
        if (Settings.defaultInstrument != defs.instrument.guitar) {
            defs.useInstrument(Settings.defaultInstrument);
        }
    };

    /**
     * Runs all Main methods using the element Ids defined in the Settings class.
     * This is your "Do All". See Data.song for structure.
     * @method run
     * @return {songObject}
     */
    // JRM: Agrego songText como parametro enviado
    _public.run = songText => {
        const handles = _getHandlesFromId();
        if (!handles || !handles.diagrams || !handles.text || !handles.wrap) {
            return null;
        }
        _errList = [];
        const song = _runSong(handles, songText);
        showErrors(_errList[0]);
        return song;
    };

    /**
     * Same as "run" except runs using class names, this allows you to have multiple songs on a single page.
     * @method runByClasses
     * @return {Array of songObject}
     */
    // JRM: Agrego songText como parametro enviado
    _public.runByClasses = songText => {
        const songs = [];
        const songWraps = ToolsLite.getElementsByClass(Settings.wrapClasses.wrap);
        for (let i = 0; i < songWraps.length; i++) {
            const handles = _getHandlesFromClass(songWraps[i]);
            if (handles === null) {
                continue;
            }
            songs.push(_runSong(handles, songText));
        }
        return songs;
    };

    /**
     * Is this really necessary?
     * @method setTuningOffset
     * @param offset {int} (optional) default 0. Number of semitones to shift the tuning. See Definitions.instrument.
     */
    _public.setTuningOffset = offset => {
        Definitions.useInstrument(offset);
    };

    // song

    /**
     *
     * @method _runSong
     * @private
     * @param handles {Data.htmlHandles}
     * @return {songObj}
     */
    // JRM: agrego songText como parametro opcional enviado
    var _runSong = (handles, songText) => {
        // read Music, find chords, generate HTML version of song:        
        const cpm = new CpmParser();
        cpm.init();
        // JRM agrego condición
        let song = '';
        if (songText) {
            song = cpm.parse(songText);
        } else {
            song = cpm.parse(handles.text.innerHTML);
        }

        Definitions.replace(song.defs);

        const chrdPrsr = new ChordParser();
        chrdPrsr.init();
        handles.text.innerHTML = chrdPrsr.parse(song.body);
        song.chords = chrdPrsr.getChords();

        // Draw the Chord Diagrams:
        const painter = new ChordPainter();
        painter.init(handles);
        painter.show(song.chords);

        // Show chord diagrams inline with lyrics
        if (Settings.inlineDiagrams) {
            ToolsLite.addClass(handles.wrap, "gcInlineDiagrams");
            painter.showInline(song.chords);
        }

        // Do Tablature:
        const tabs = new Tabs();
        tabs.init();
        tabs.replace(handles.text);

        // error reporting:
        _errList.push(painter.getErrors());

        const container = handles.wrap;
        if (container) {
            ToolsLite.setClass(container, "gcNoChords", !song.hasChords);
        }

        if (Settings.opts.autoFixOverlaps) {
            OverlapFixer.Fix(handles.text);
        }

        // done!
        return song;
    };

    /**
     * Log in console the list of unknown chords.
     * @method showErrors
     * @return {void}
     */
    var showErrors = errs => {
        if (errs.length < 1) {
            return;
        }

        let s = "";
        for (let i = 0; i < errs.length; i++) {
            s += s.length > 0 ? ", " : "";
            s += errs[i];
        }
        console.log(`Unknown chords: ${s}`);
    };

    /**
     *
     * @method _getHandlesFromClass
     * @private
     * @param wrap {domElement}
     * @return {Data.htmlHandles}
     */
    var _getHandlesFromClass = wrap => {
        const diagrams = ToolsLite.getElementsByClass(
            Settings.wrapClasses.diagrams,
            wrap
        );
        const text = ToolsLite.getElementsByClass(Settings.wrapClasses.text, wrap);
        if (
            diagrams === undefined ||
            diagrams.length < 1 ||
            text === undefined ||
            text.length < 1
        ) {
            return null;
        }
        return new Data.htmlHandles(wrap, diagrams[0], text[0]);
    };

    /**
     *
     * @method _getHandlesFromId
     * @private
     * @return {Data.htmlHandles}
     */
    var _getHandlesFromId = () =>
        new Data.htmlHandles(
            document.getElementById(Settings.ids.container),
            document.getElementById(Settings.ids.canvas),
            document.getElementById(Settings.ids.songText)
        );

    return _public;
})();