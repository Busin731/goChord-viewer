import { CanvasTools } from "./canvasTools";
import { Settings } from "./settings";

/**
 * First places a Canvas element within a DOM element, then draws a chord diagram on it.
 * @class ChordBrush
 */
export const ChordBrush = () => {
  /**
   * attach public members to this object
   * @property _public
   * @type {Object}
   */
  const _public = {};

  /////////////////////////////////////////////////////////////////////////////
  //
  // PUBLIC methods
  //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Again this is a constructor replacement
   * @method init
   * @return {void}
   */
  _public.init = () => {};

  /**
   * Puts a new Canvas within ChordBox and draws the chord diagram on it.
   * @method plot
   * @param chordBox {DOMElement} Handle to the DOM element where the chord is to be drawn.
   * @param chord {expandedChord} Chord Diagram to be drawn.
   * @param fretBox {JSON} Appropriate Settings.fretBox -- either "fretBox" or "inlineFretBox"
   * @param {JSON} fontSettings (optional) Defaults to Settings.fonts
   * @param {JSON} colorSettings (optional) Defaults to Settings.colors
   * @return {void}
   */
  _public.plot = (chordBox, chord, fretBox, fontSettings, colorSettings) => {
    const ctx = CanvasTools.addCanvas(chordBox, fretBox.width, fretBox.height);
    if (!ctx) {
      return;
    }

    if (!fontSettings) {
      fontSettings = Settings.fonts;
    }
    if (!colorSettings) {
      colorSettings = Settings.colors;
    }

    // starting top-left position for chord diagram
    const pos = {
      x: fretBox.topLeftPos.x,
      y: fretBox.topLeftPos.y
    };
    _drawFretboard(ctx, pos, fretBox, colorSettings.fretLines);
    // find where the circle centers should be:
    const centers = {
      x: pos.x,
      y: pos.y + fretBox.dotRadius
    };

    // find the vertical shift by dividing the freespace between top and bottom (freespace is the row height less circle diameter)
    const fudgeY = (fretBox.fretSpace - 2 * fretBox.dotRadius) / 2;
    const fretRange = _getFretRange(chord.dots);
    const firstFret = fretRange.last <= 5 ? 1 : fretRange.last - 4;

    // now add Dots (with finger numbers, if present)
    for (let i = 0; i < chord.dots.length; i++) {
      const s = chord.dots[i].string;
      const p = {
        x: centers.x + s * fretBox.stringSpace,
        y:
          fudgeY +
          centers.y +
          (chord.dots[i].fret - firstFret) * fretBox.fretSpace
      };
      CanvasTools.drawDot(ctx, p, fretBox.dotRadius, colorSettings.dots);
      // check that the dot's radius isn't stupidly small
      // JRM: cambia de 4 a 3
      if (
        chord.dots[i].finger > 0 &&
        fretBox.showText &&
        fretBox.dotRadius > 3
      ) {
        CanvasTools.drawText(
          // JRM: cambia de 5 a 3
          ctx,
          {
            x: p.x,
            y: p.y + 3
          },
          chord.dots[i].finger,
          fontSettings.dot,
          colorSettings.dotText
        );
      }
    }

    // If the chord is above the normal first 5 frets we need to add labels for the first and last frets
    if (firstFret != 1) {
      // Label the starting and ending frets (0-12). It's assumed that the fretboard covers frets 1-5.
      // If instead the top fret is 6, say, well, this is the method called to add that "6".
      // The Y position calculation is a bit klunky. How big of a fret range is present in the chord?
      const txtPos = {
        x: 0,
        y:
          pos.y +
          fretBox.fretSpace *
            (0.96 * (5.0 - (fretRange.last - fretRange.first)))
        // Old Y calculation: pos.y + (0.8 * fretBox.fretSpace)
      };
      CanvasTools.drawText(
        ctx,
        txtPos,
        fretRange.first,
        fontSettings.fret,
        colorSettings.fretText,
        "left"
      );

      // no point in double plotting a fret (i.e. barred 8th fret) so only add second label if
      // first and last frets are different. Also, it's odd to see both 8 & 9, so only show if there's
      // at least one fret between first and last (i.e. 8 & 10)
      if (fretRange.last - fretRange.first > 1) {
        txtPos.y = pos.y + 4.8 * fretBox.fretSpace;
        CanvasTools.drawText(
          ctx,
          txtPos,
          fretRange.last,
          fontSettings.fret,
          colorSettings.fretText,
          "left"
        );
      }
    }

    // TODO: top offset
    if (fretBox.showText) {
      CanvasTools.drawText(
        ctx,
        {
          // JRM: cambia de 1.5 a 2.5
          x: pos.x + 2.5 * fretBox.stringSpace,
          y: pos.y - 5
        },
        chord.name,
        fontSettings.text,
        colorSettings.text
      );
    }

    _mutedStrings(ctx, fretBox, chord.muted, colorSettings.xStroke);
  };

  /////////////////////////////////////////////////////////////////////////////
  //
  // PRIVATE methods
  //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * @method _drawFretboard
   * @private
   * @param ctx {CanvasContext} Valid Canvas Context Handle
   * @param pos {XYPosObject} Object with two properties: x & y ints, position in pixels
   * @param fretBox {settings}
   * @return {void}
   */
  var _drawFretboard = (ctx, pos, fretBox, fretColor) => {
    // width offset, a "subpixel" adjustment
    let i;

    const offset = fretBox.lineWidth / 2;
    // locals
    const stringHeight = Settings.numFrets * fretBox.fretSpace;
    // JRM: cambia de 3 a 5
    const fretWidth = 5 * fretBox.stringSpace;
    // build shape
    ctx.beginPath();
    // add "C" & "E" strings
    // JRM: cambia de <3 a <=5 (no estoy seguro)
    for (i = 1; i <= 5; i++) {
      const x = pos.x + i * fretBox.stringSpace + offset;
      ctx.moveTo(x, pos.y + offset);
      ctx.lineTo(x, pos.y + stringHeight + offset);
    }
    // add frets
    for (i = 1; i < Settings.numFrets; i++) {
      const y = pos.y + i * fretBox.fretSpace + offset;
      ctx.moveTo(pos.x + offset, y);
      ctx.lineTo(pos.x + fretWidth + offset, y);
    }
    //
    ctx.rect(pos.x + offset, pos.y + offset, fretWidth, stringHeight);
    // stroke shape
    ctx.strokeStyle = fretColor;
    ctx.lineWidth = fretBox.lineWidth;
    ctx.stroke();
    ctx.closePath();
  };

  /**
   * TODO: Loop over the muted array, dropping X's whenever a string position is TRUE
   * @method _mutedStrings
   * @private
   * @param  {CanvasContext} ctx  Valid Canvas Context handle
   * @param  {JSON} fretBox  See Settings.fretBox
   * @param  {bool} muted    Is this string "muted"?
   * @param  {string} strokeColor Valid CSS hex color (shorthand not recommended)
   * @return {void}
   */
  var _mutedStrings = (ctx, fretBox, muted, strokeColor) => {
    const x = fretBox.topLeftPos.x + fretBox.lineWidth / 2;
    const y = fretBox.topLeftPos.y + fretBox.lineWidth / 4;
    for (let i = 0; i < muted.length; i++) {
      if (muted[i]) {
        _drawX(
          ctx,
          {
            x: x + i * fretBox.stringSpace,
            y
          },
          fretBox,
          strokeColor
        );
      }
    }
  };

  /**
   * Plots an "X" centered at POSITION
   * @method _drawX
   * @private
   * @param {CanvasContext} ctx Valid Canvas Context handle
   * @param centerPos {XyPositionJson} JSON with two properties: x & y ints, position in pixels, format {x: <int>, y: <int>}
   * @param  {JSON} fretBox  See Settings.fretBox
   * @param  {string} strokeColor Valid CSS hex color (shorthand not recommended)
   * @return {void}
   */
  var _drawX = (ctx, pos, fretBox, strokeColor) => {
    pos.x -= fretBox.xWidth / 2;
    pos.y -= fretBox.xWidth / 2;

    ctx.beginPath();

    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + fretBox.xWidth, pos.y + fretBox.xWidth);
    ctx.moveTo(pos.x, pos.y + fretBox.xWidth);
    ctx.lineTo(pos.x + fretBox.xWidth, pos.y);

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = fretBox.xStroke;
    ctx.stroke();
    ctx.closePath();
  };

  /**
   * Returns first & last frets, 0 if none found.
   * @method _getFretRange
   * @private
   * @param dots {array<Data.dot>} Array of Data.dot objects
   * @return {JSON}
   */
  var _getFretRange = dots => {
    let max = -1;
    let min = 300;

    for (let i = 0; i < dots.length; i++) {
      if (dots[i].fret > max) {
        max = dots[i].fret;
      }
      if (dots[i].fret < min) {
        min = dots[i].fret;
      }
    }
    return {
      first: min < 300 ? min : 0,
      last: max > 0 ? max : 0
    };
  };

  /* return our public interface
	 */
  return _public;
};
