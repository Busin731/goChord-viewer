import { ChordBrush } from "./chordBrush";
import { Definitions } from "./definitions";
import { Settings } from "./settings";

/**
 * Draws large chord diagram grid (aka "reference" diagrams) on canvas
 * @class ChordPainter
 */
export const ChordPainter = () => {
    /**
     * attach public members to this object
     * @property _public
     * @type {Object}
     */
    const _public = {};

    /**
     * canvas object handle
     * @property _brush
     * @type ChordBrush instance handle
     * @private
     */
    let _brush = null;

    /**
     * keep an array of missing chords (strings)
     * @property _errors
     * @type array
     * @private
     */
    let _errors = [];

    let _handles = null;

    /**
     * If ignoreCommonChords option is true then this will contain list of
     * matched chords: ones defined in the ignore list that were also found in the song
     * @property _ignoreMatchList
     * @type {Array}
     * @private
     */
    let _ignoreMatchList = [];

    /**
     * Ignore "tacet" or "no chord" chords
     * @property _tacet
     * @type {RegExp}
     * @private
     */
    const _tacet = /^(n.?\/?c.?|tacet)$/i;

    /**
     * Again this is a constructor replacement
     * @method init
     * @param htmlHandles {Data.htmlHandles} DOM Element object
     * @return {void}
     */
    _public.init = htmlHandles => {
        _brush = new ChordBrush();
        _brush.init();
        _handles = htmlHandles;
    };

    /**
     * Checks whether speicified chord (name) is on the ignore list.
     * @method ignoreChord
     * @param  {string} chord Chord name
     * @return {boolean}	return TRUE if "chord" is on ignore list.
     */
    const ignoreChord = chord => {
        for (let i = 0; i < Settings.commonChords.length; i++) {
            if (chord == Settings.commonChords[i]) {
                return true;
            }
        }
        return false;
    };

    /**
     * Plots the passed in chords (array of ) by adding canvas elements inside passed DOM element.
     * @method show
     * @param chords {array<expandedChord>} Array of chord objects to be plotted
     * @return {void}
     */
    _public.show = chords => {
        _handles.diagrams.innerHTML = "";
        _errors = [];
        _ignoreMatchList = [];

        if (Settings.opts.sortAlphabetical) {
            chords.sort();
        }

        for (let i = 0; i < chords.length; i++) {
            if (_tacet.test(chords[i])) {
                continue;
            }
            if (Settings.opts.ignoreCommonChords && ignoreChord(chords[i])) {
                if (
                    typeof Array.prototype.indexOf === "function" &&
                    !_ignoreMatchList.includes(chords[i])
                ) {
                    _ignoreMatchList.push(chords[i]);
                }
                continue;
            }
            const chord = Definitions.get(chords[i]);
            if (!chord) {
                _errors.push(chords[i]);
                continue;
            }
            _brush.plot(_handles.diagrams, chord, Settings.fretBox);
        }

        if (_ignoreMatchList.length > 0) {
            const para = document.createElement("p");
            para.className = "gcIgnoredChords";
            para.innerHTML = `Also uses: ${_ignoreMatchList.sort().join(", ")}`;
            _handles.diagrams.appendChild(para);
        }
    };

    /**
     * Plots chords "inline" with the lyrics. Searches for &lt;code data-chordName=&quot;Am7&quot;&gt;&lt;/code&gt;.
     * When found adds canvas element and draws chord named in data-chordName attribute
     * @method showInline
     * @param chords {array<expandedChord>} Array of chord objects to be plotted
     * @return {void}
     */
    _public.showInline = chords => {
        const e = _handles.text.getElementsByTagName("code");
        if (e.length < 1) {
            return;
        }
        for (let i = 0; i < chords.length; i++) {
            const chord = Definitions.get(chords[i]);
            if (!chord) {
                /* TODO: error reporting if not found */
                // _errors.push(chords[i]);
                continue;
            }
            for (let j = 0; j < e.length; j++) {
                if (e[j].getAttribute("data-chordName") == chord.name) {
                    _brush.plot(
                        e[j],
                        chord,
                        Settings.inlineFretBox,
                        Settings.inlineFretBox.fonts
                    );
                }
            }
        }
    };

    /**
     * returns array of unknown chords
     * @method getErrors
     * @return {array}
     */
    _public.getErrors = () => _errors;

    /**
     * List of chords excluded from the master chord diagrams
     * @method getIgnoredChords
     * @return {array} array of strings
     */
    _public.getIgnoredChords = () => _ignoreMatchList;

    /* return our public interface
     */
    return _public;
};