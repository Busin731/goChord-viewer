import { CanvasTools } from "./canvasTools";
import { Settings } from "./settings";
import { ToolsLite } from "./toolsLite";

/**
 * Tablature renderer -- reads tab data and draws canvas elements.
 * Creates "packed" versions of the tabs, including a "key line" that's comprised
 * only of '-' and '*' -- the asterisks denoting where a dot will eventually be placed.
 * @class Tabs
 * @constructor
 */
export const Tabs = () => {
    /**
     * alias for external Settings dependencies (helps with compression, too)
     * @property tab_settings
     * @private
     * @type {JSON}
     */
    const tab_settings = Settings.tabs;

    // TODO: use Settings.tuning for NUM_STRINGS and LAST_STRING_NAME??

    /**
     * (Constant) Number of Strings (dashed lines of tablature notation) expected. (For now
     * a constant -- guitar "always" have six). Making a variable to help support port
     * for other instruments.
     * @property NUM_STRINGS
     * @private
     * @type int
     */
    // JRM: aumenta a 6
    const NUM_STRINGS = 6;

    /**
     * (Constant) Last String Name (Note). --JRM: la 6a cuerda
     * @property LAST_STRING_NAME
     * @private
     * @type string
     */
    const LAST_STRING_NAME = "E";

    /* PUBLIC METHODS
	---------------------------------------------- */
    /**
     * Again this is a constructor replacement
     * @method init
     * @public
     * @return {void}
     */
    const init = () => {};

    /**
     * Races through all &lt;pre&gt; tags within h, any with the CSS class of "gcTabs" will be replaced with the canvas element.
     * @method replace
     * @public
     * @param h {DOM-element}
     * @return {void}
     */
    const replace = h => {
        const tabBlocks = h.getElementsByTagName("pre");
        for (const i in tabBlocks) {
            if (tabBlocks[i].className == "gcTabs") {
                const s = tabBlocks[i].innerHTML;
                tabBlocks[i].innerHTML = "";
                loadBlocks(s, tabBlocks[i]);
            }
        }
    };

    /**
     *
     * @method loadBlocks
     * @param text {string} Block of text that contains one or more tablature blocks
     * @param outElement {string or DOM} Either: (string) the Id to a DOM element, or DOM element handle where the canvas/converted text will be placed.
     * @return {void}
     */
    var loadBlocks = (text, outElement) => {
        const lines = text.split("\n");
        let tab = [];
        for (const i in lines) {
            const s = ToolsLite.trim(lines[i]);
            if (s.length > 0) {
                tab.push(s);
            }
            // JRM: Se debe asegurar que el texto de tabs tenga 6 cuerdas
            if (tab.length == NUM_STRINGS) {
                redraw(tab, outElement);
                tab = [];
            }
        }
    };

    /**
     *
     * @method redraw
     * @param inTabs {string or array} Block of text or four element array containing tablbature to be parsed
     * @param outElement {string or DOM} Either: (string) the Id to a DOM element, or DOM element handle where the canvas/converted text will be placed.
     * @return {void}
     */
    var redraw = (inTabs, outElement) => {
        // validate inTabs input...
        // TODO: instead of this if it's text pop the entire processing back to loadBlocks!
        inTabs = typeof inTabs == "string" ? inTabs.split("\n") : inTabs;
        if (inTabs.length < NUM_STRINGS) {
            return;
        }
        // read tabs
        const tabInfo = readTabs(inTabs);
        const labelOffset = tabInfo.hasLabels ? tab_settings.labelWidth : 0;
        const tabs = tabInfo.tabs;
        // how much space?
        const height =
            (NUM_STRINGS - 1) * tab_settings.lineSpacing +
            2 * tab_settings.dotRadius +
            tab_settings.bottomPadding;
        // prep canvas        
        outElement =
            typeof outElement == "string" ?
            document.getElementById(outElement) :
            outElement;

        const ctx = CanvasTools.addCanvas(
            outElement,
            getWidth(tabs, labelOffset, false),
            height
        );
        const pos = {
            x: tab_settings.dotRadius + labelOffset,
            y: 1 + tab_settings.dotRadius
        };
        const lineWidth = getWidth(tabs, labelOffset, true);
        drawStaff(ctx, pos, lineWidth, tab_settings);
        drawNotes(ctx, pos, tabs, tab_settings, lineWidth);
        if (tabInfo.hasLabels) {
            drawLabels(ctx, pos, tab_settings);
        }
    };

    /**
     * This is insanely long, insanely kludgy, but, insanely, it works. This will read break a block of text into
     * six lines (the guitar strings), then find which frets are used by each. Then, the hard part, pack un-needed
     * dashes. Once it's done that a 2-dimentional array (strings X frets) is created and returned.
     * @method readTabs
     * @private
     * @param gcStrings {array<string>} Block of tablature to be parsed
     * @return {2-dimentional array}
     */
    var readTabs = gcStrings => {
        const hasLabels = gcStrings[NUM_STRINGS - 1][0] == LAST_STRING_NAME;
        if (hasLabels) {
            stripStringLabels(gcStrings);
        }
        const frets = getFretNumbers(gcStrings);
        const symbols = getSymbols(gcStrings);
        const minLength = getMinLineLength(gcStrings);
        const guide = getGuideLine(symbols, minLength);

        return {
            tabs: getPackedLines(frets, symbols, guide, minLength),
            hasLabels
        };
    };

    /**
     * @method getWidth
     * @private
     * @param tabs {2Darray}
     * @param labelOffset {int}
     * @param isTruncate {bool} If TRUE returns the length of the line, allowing for a terminating "|" character, othwrwise, it's for canvas width
     * @return {int}
     */
    var getWidth = (tabs, labelOffset, isTruncate) => {
        if (!isTruncate) {
            return (
                tab_settings.noteSpacing * tabs[0].length +
                labelOffset +
                tab_settings.dotRadius
            );
        }

        let len = tabs[0].length;
        let plusDot = tab_settings.dotRadius;
        if (tabs[0][len - 1] == "|") {
            // TODO: too much??? retest
            len -= 1;
            plusDot = 0;
        }

        return tab_settings.noteSpacing * len + labelOffset + plusDot;
    };

    /**
     * Processes gcStrings stripping the first character from each line
     * @method stripStringLabels
     * @private
     * @param gcStrings {array<string>}
     * @return {void}
     */
    var stripStringLabels = gcStrings => {
        for (let i = 0; i < NUM_STRINGS; i++) {
            gcStrings[i] = gcStrings[i].substr(1);
        }
    };

    /**
     * Finds the frets in used for each line. In other words, ignoring
     * spacers ("-" or "|") this returns arrays of numbers, the frets
     * in use, for each line.
     * @method getFretNumbers
     * @private
     * @param gcStrings {array<string>}
     * @return {void}
     */
    var getFretNumbers = gcStrings => {
        // first, get the frets
        const reInts = /([0-9]+)/g;
        const frets = [];
        for (let i = 0; i < NUM_STRINGS; i++) {
            frets[i] = gcStrings[i].match(reInts);
        }
        return frets;
    };

    /**
     * Returns array of the strings with placeholders instead of the numbers.
     * This helps us pack because "12" and "7" now occupy the same space horizontally.
     * @method getSymbols
     * @private
     * @param gcStrings {array<string>}
     * @return {void}
     */
    var getSymbols = gcStrings => {
        // convert to symbols
        const reDoubles = /([0-9]{2})/g;
        const reSingle = /([0-9])/g;
        const symbols = [];
        // TODO: verify why using NUM_STRINGS instead of gcStrings.length (appears in other methods, again, do you recall why?)
        for (let i = 0; i < NUM_STRINGS; i++) {
            symbols[i] = gcStrings[i].replace(reDoubles, "-*");
            symbols[i] = symbols[i].replace(reSingle, "*");
        }
        return symbols;
    };

    /**
     * Run through all of the strings (array) and return the length of the shortest one.
     * would prefer the max length, but then I'd need to pad the shorter ones and ... well, it's complicated.
     * this gets a TODO: get max!
     * @method getMinLineLength
     * @private
     * @param gcStrings {array<string>}
     * @return {void}
     */
    var getMinLineLength = gcStrings => {
        let minLength = 0;
        let line;
        const re = /-+$/gi;

        for (let i = 0; i < gcStrings.length; i++) {
            line = gcStrings[i].trim().replace(re, "");
            if (line.length > minLength) {
                minLength = line.length;
            }
        }

        return minLength;
    };

    /**
     * OK, having created symbolic representations for the lines in earlier steps
     * here we go through and "merge" them into a single, master "guide" -- saying
     * "somewhere on this beat you'll pluck (or not) one note". This normalized
     * guide will be the master for the next step.
     * @method getGuideLine
     * @private
     * @param symbols {undefined}
     * @param minLength {int}
     * @return {void}
     */
    var getGuideLine = (symbols, minLength) => {
        // Build a master pattern "guide" and eliminate double dashes
        let guide = "";
        for (let i = 0; i < minLength; i++) {
            if (symbols[0][i] == "|") {
                guide += "|";
            } else {
                // TODO: assumes 6 strings, use NUM_STRINGS
                // JRM: agrega 2 cuerdas
                guide +=
                    symbols[0][i] == "*" ||
                    symbols[1][i] == "*" ||
                    symbols[2][i] == "*" ||
                    symbols[3][i] == "*" ||
                    symbols[4][i] == "*" ||
                    symbols[5][i] == "*" ?
                    "*" :
                    "-";
            }
        }
        let reDash = /--/g;
        guide = guide.replace(reDash, "- ");
        reDash = / -/g;
        let lastGuide = guide;
        while (true) {
            guide = guide.replace(reDash, "  ");
            if (guide == lastGuide) {
                break;
            }
            lastGuide = guide;
        }
        return guide;
    };

    /**
     * Using the packed "guide" line we loop over the strings, rebuilding each string
     * with either a space, measure marker, or the note -- as an integer! Now the frets
     * are the same regardless of whether they are single or double digit numbers:
     * a "12" occupies no more horizontal space than a "5".
     * @method getPackedLines
     * @private
     * @param frets {undefined}
     * @param symbols {undefined}
     * @param guide {undefined}
     * @param minLength {int}
     * @return {void}
     */
    var getPackedLines = (frets, symbols, guide, minLength) => {
        // pack it!
        const packed = []; // fret marker counter

        let // a temp variable to hold the 'note'
            chrNote = "";

        let // loop index for guide string
            guideIdx;

        let // loop index for instrument's strings (guitar 6)
            stringIdx;

        let // index to single line within packed array (along a string)
            lineIdx;

        let fretCount;

        for (stringIdx = 0; stringIdx < NUM_STRINGS; stringIdx++) {
            packed.push([]);
        }

        for (stringIdx = 0; stringIdx < NUM_STRINGS; stringIdx++) {
            // loop over lines
            lineIdx = 0;
            fretCount = 0;
            for (guideIdx = 0; guideIdx < minLength; guideIdx++) {
                // loop over guide
                if (guide[guideIdx] != " ") {
                    if (symbols[stringIdx][guideIdx] == "*") {
                        chrNote = frets[stringIdx][fretCount];
                        fretCount++;
                    } else {
                        chrNote = guide[guideIdx] == "|" ? "|" : "-";
                    }
                    packed[stringIdx][lineIdx] = chrNote;
                    lineIdx++;
                }
            }
        }
        return packed;
    };

    /**
     * Create the staff -- really the four tablature strings
     * @method drawStaff
     * @private
     * @param ctx {canvasContext} Handle to active canvas context
     * @param pos {xyPos} JSON (x,y) position
     * @param length {int} Length in pixels
     * @param settings {settingsObj}
     * @return {voie}
     */
    var drawStaff = (ctx, pos, length, settings) => {
        const offset = settings.lineWidth / 2;
        const x = pos.x + offset;
        let y = pos.y + offset;
        ctx.beginPath();
        for (let i = 0; i < NUM_STRINGS; i++) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y);
            y += settings.lineSpacing;
        }
        ctx.strokeStyle = settings.lineColor;
        ctx.lineWidth = settings.lineWidth;
        ctx.stroke();
        ctx.closePath();
    };

    /**
     * Loop over the normalized tabs emitting the dots/fingers on the passed in canvase
     * @method drawNotes
     * @private
     * @param ctx {canvasContext} Handle to active canvas context
     * @param pos {xyPos} JSON (x,y) position
     * @param tabs {array} Array of normalized string data -- space (character) or int (fret number)
     * @param settings {settingsObj}
     * @param lineWidth {int} Length in pixels (used only when line ends with a measure mark)
     * @return {void}
     */
    var drawNotes = (ctx, pos, tabs, settings, lineWidth) => {
        let c;
        const center = {
            x: 0,
            y: pos.y
        };

        for (const strIdx in tabs) {
            // JRM: cambio de 3 a NUM_STRINGS-1
            if (strIdx > (NUM_STRINGS - 1)) {
                return;
            }
            center.x = pos.x;
            for (const chrIdx in tabs[strIdx]) {
                c = tabs[strIdx][chrIdx];
                // (c != '-'){
                if (c == "|") {
                    const jnum = parseInt(chrIdx, 10);
                    const heavy =
                        (jnum + 1 < tabs[strIdx].length - 1 &&
                            tabs[strIdx][jnum + 1] == "|") ||
                        (jnum == tabs[strIdx].length - 1 && tabs[strIdx][jnum - 1] == "|");
                    drawMeasure(
                        ctx, {
                            x: chrIdx == tabs[strIdx].length - 1 ?
                                pos.x + lineWidth : center.x,
                            y: pos.y
                        },
                        settings,
                        heavy
                    );
                } else if (!isNaN(c)) {
                    CanvasTools.drawDot(
                        ctx,
                        center,
                        settings.dotRadius,
                        settings.dotColor
                    );
                    CanvasTools.drawText(
                        ctx, {
                            x: center.x,
                            y: center.y + 0.5 * settings.dotRadius
                        },
                        c,
                        settings.textFont,
                        settings.textColor
                    );
                }
                center.x += settings.noteSpacing;
            }
            center.y += settings.lineSpacing;
        }
    };

    /**
     * Draws a vertical "measure" demarcation line
     * @method drawMeasure
     * @private
     * @param ctx {canvasContext} Handle to active canvas context
     * @param pos {xyPos} JSON (x,y) position
     * @param settings {settingsObj}
     * @param heavy {bool} if TRUE hevy line
     * @return {void}
     */
    var drawMeasure = (ctx, pos, settings, heavy) => {
        const offset = settings.lineWidth / 2;
        ctx.beginPath();
        ctx.moveTo(pos.x + offset, pos.y);
        ctx.lineTo(
            pos.x + offset,
            pos.y + (NUM_STRINGS - 1) * settings.lineSpacing
        );
        ctx.strokeStyle = settings.lineColor;
        ctx.lineWidth = (heavy ? 4.5 : 1) * settings.lineWidth;
        ctx.stroke();
        ctx.closePath();
    };

    /**
     * Adds the string letters on the left-side of the canvas, before the tablature string lines
     * @method drawLabels
     * @private
     * @param ctx {canvasContext} Handle to active canvas context
     * @param pos {xyPos} JSON (x,y) position
     * @param settings {settingsObj}
     * @return {void}
     */
    var drawLabels = (ctx, pos, tabSettings) => {
        // ['E','A','D','G','B','E'];
        const labels = Settings.tuning.reverse();
        for (let i = 0; i < NUM_STRINGS; i++) {
            CanvasTools.drawText(
                ctx, {
                    x: 1,
                    y: pos.y + (i + 0.3) * tabSettings.lineSpacing
                },
                labels[i],
                tabSettings.labelFont,
                tabSettings.lineColor,
                "left"
            );
        }
    };

    /* return our public interface */
    return {
        init,
        replace
    };
};