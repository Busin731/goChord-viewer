import { ChordImport } from "./chordImport";
import { Data } from "./data";
import { ToolsLite } from "./toolsLite";

/**
 * Reads a text block and returns an object containing whatever ChordPro elements it recognizes.
 *
 * A cleaned, HTML version of song is included.
 *
 * @class CpmParser
 */
export const CpmParser = () => {
  /**
   * attach public members to this object
   * @property _public
   * @type {Object}
   */
  const _public = {};

  /**
   * Number of columns defined
   * @property _columnCount
   * @private
   * @type int
   */
  let _columnCount = 1;

  /**
   * Under development, bool indicating whether any chords were found within the lyrics.
   * Helpful for tablature-only arrangements.
   * TODO: do not rely on this!!!
   * @property _hasChords
   * @private
   * @type bool
   */
  let _hasChords = false; // TODO:

  /**
   * Song's key. May be set via command tag {key: C} otherwise use the first chord found (if available)
   * @property _firstChord
   * @private
   * @type string
   */
  let _firstChord = "";

  /**
   * Again this is a constructor replacement. Just here for consistency. Does nothing.
   * @method init
   * @return {void}
   */
  _public.init = () => {};

  /**
   * Accepts CPM text, returning HTML marked-up text
   * @method parse
   * @param text {string} string RAW song
   * @return {songObject}
   */
  _public.parse = text => {
    const song = new Data.song();
    text = _stripHtml(text);
    let songDom = _domParse(text);
    songDom = _parseInstr(songDom);
    songDom = _parseSimpleInstr(songDom);
    songDom = _markChordLines(songDom);
    song.body = _export(songDom);
    if (_columnCount > 1) {
      song.body = `<div class="${_classNames.ColumnWrap} ${
        _classNames.ColumnCount
      }${_columnCount}"><div class="${_classNames.Column}">${
        song.body
      }</div></div>`;
    }
    song.hasChords = _hasChords;
    let tmp;
    // Song Title
    tmp = _getInfo(songDom, _blockTypeEnum.Title);
    if (tmp.length > 0) {
      song.title = tmp[0];
    }
    // Artist
    tmp = _getInfo(songDom, _blockTypeEnum.Artist);
    if (tmp.length > 0) {
      song.artist = tmp[0];
    }
    // Song Subtitle
    tmp = _getInfo(songDom, _blockTypeEnum.Subtitle);
    if (tmp.length > 0) {
      song.st = tmp[0];
    }
    if (tmp.length > 1) {
      song.st2 = tmp[1];
    }
    // Album
    tmp = _getInfo(songDom, _blockTypeEnum.Album);
    if (tmp.length > 0) {
      song.album = tmp[0];
    }
    // goChord "Extras"
    tmp = _getInfo(songDom, _blockTypeEnum.GoChordMeta);
    if (tmp.length > 0) {
      song.metadata = tmp;
    }
    // Key
    tmp = _getInfo(songDom, _blockTypeEnum.Key);
    if (tmp.length > 0) {
      song.key = tmp[0];
    } else if (_firstChord !== "") {
      // Setting Key to first chord found
      song.key = _firstChord;
    }
    // Chord Definitions
    tmp = _getInfo(songDom, _blockTypeEnum.ChordDefinition);
    if (tmp.length > 0) {
      for (const i in tmp) {
        song.defs.push(ChordImport.runLine(`{define: ${tmp[i]}}`));
      }
    }
    return song;
  };

  /*
		TODO: add goChord Meta support:
		$regEx = "/{(goChord-meta|meta)\s*:\s*(.+?)}/i";
	*/
  const _regEx = {
    blocks: /\s*{\s*(start_of_tab|sot|start_of_chorus|soc|end_of_tab|eot|end_of_chorus|eoc)\s*}\s*/im,
    tabBlock: /\s*{\s*(start_of_tab|sot)\s*}\s*/im,
    chorusBlock: /\s*{\s*(start_of_chorus|soc)\s*}\s*/im
  };

  /**
   * All of the CSS classnames used by goChord JavaScript
   * @property _classNames
   * @private
   * @type JSON
   */
  var _classNames = {
    Comment: "gcComment",
    Tabs: "gcTabs",
    Chorus: "gcChorus",
    PreChords: "gcChords", // preformatted with chords
    PrePlain: "gcPlain", // preformated, no chords
    NoLyrics: "gcNoLyrics", // preformated, chords ONLY -- no lyrics (text) between 'em
    ColumnWrap: "gcWrap",
    ColumnCount: "gcColumnCount",
    Column: "gcColumn",
    NewPage: "gcNewPage"
  };

  /**
   * Enumeration defining the types of nodes used within this class to parse CPM
   * @property _blockTypeEnum
   * @private
   * @type JSON-enum
   */
  var _blockTypeEnum = {
    // Multiline Nodes
    TextBlock: 1, // temporary type, should be replaced with Chord Text or Plain Text
    ChorusBlock: 2,
    TabBlock: 3,
    // Single Line "Instruction" Nodes
    Comment: 101,
    Title: 102,
    Subtitle: 103,
    Album: 104,
    ChordDefinition: 105,
    GoChordMeta: 106,
    ColumnBreak: 107, // Defining this as an instruction instead of a node since I'm not requiring a Begin/End syntax and it simplifies processing
    Artist: 108,
    NewPage: 109,
    Key: 110,
    // Text Types
    ChordText: 201,
    PlainText: 202,
    ChordOnlyText: 203, //
    // Undefined
    Undefined: 666
  };

  /**
   * Retuns the block type (_blockTypeEnum) of passed in line.
   * @method _getBlockType
   * @private
   * @param line {songNode}
   * @return {_blockTypeEnum}
   */
  const _getBlockType = line => {
    // TODO: verify line's type in documentation
    if (_regEx.chorusBlock.test(line)) {
      return _blockTypeEnum.ChorusBlock;
    } else if (_regEx.tabBlock.test(line)) {
      return _blockTypeEnum.TabBlock;
    }
    return _blockTypeEnum.TextBlock;
  };

  /**
   * Convert passed in song to HTML block
   * @method _export
   * @private
   * @param song {songNodeArray}
   * @return {strings}
   */
  var _export = song => {
    const nl = "\n";
    let html = "";
      
    for (let i = 0; i < song.length; i++) {
      // JRM: visualizar titulo, subtitulo, album y metadata(no visible por ahora)      
      if (song[i].type == _blockTypeEnum.Title) {
        html += `<h1>${song[i].lines[0]}</h1>${nl}`;
      } else if (song[i].type == _blockTypeEnum.Subtitle) {
        html += `<h2>${song[i].lines[0]}</h2>${nl}`;
      } else if (song[i].type == _blockTypeEnum.Album) {
        html += `<h3 class="gcAlbum">${song[i].lines[0]}</h3>${nl}`;
      } else if (song[i].type == _blockTypeEnum.GoChordMeta) {
        html += `<h3>${song[i].lines[0]}</h3>${nl}`;
      } else if (song[i].type == _blockTypeEnum.Comment) {
        html += `<h6 class="${_classNames.Comment}">${
          song[i].lines[0]
        }</h6>${nl}`;
      } else if (song[i].type == _blockTypeEnum.NewPage) {
        html += `<hr class="${_classNames.NewPage}" />${nl}`;
      } else if (
        song[i].type == _blockTypeEnum.ChordText ||
        song[i].type == _blockTypeEnum.PlainText ||
        song[i].type == _blockTypeEnum.ChordOnlyText
      ) {
        // TODO: beware undefined's!!!
        // Repack the text, only open/close <pre> tags when type changes
        // problem: exacerbates WebKit browsers' first chord position bug.
        if (song[i].lines[0].length < 1) {
          // prevent empty blocks (usually caused by comments mixed in header tags)
          continue;
        }
        let myClass =
          song[i].type == _blockTypeEnum.PlainText
            ? _classNames.PrePlain
            : _classNames.PreChords;
        if (song[i].type == _blockTypeEnum.ChordOnlyText) {
          myClass += ` ${_classNames.NoLyrics}`;
        }
        const myType = song[i].type;
        const lastType =
          i - 1 >= 0 ? song[i - 1].type : _blockTypeEnum.Undefined;
        let nextType =
          i + 1 < song.length
            ? (nextType = song[i + 1].type)
            : _blockTypeEnum.Undefined;
        html += lastType != myType ? `<pre class="${myClass}">` : nl;
        html += song[i].lines[0];
        html += nextType != myType ? `</pre>${nl}` : "";
      } else if (song[i].type == _blockTypeEnum.ChorusBlock) {
        html += `<div class="${_classNames.Chorus}">${nl}`;
        html += _export(song[i].lines);
        html += `</div>${nl}`;
      } else if (song[i].type == _blockTypeEnum.TabBlock) {
        html += `<pre class="${_classNames.Tabs}">`;
        for (const j in song[i].lines) {
          html += song[i].lines[j] + nl;
        }
        html += `</pre>${nl}`;
      } else if (song[i].type == _blockTypeEnum.TextBlock) {
        html += _export(song[i].lines);
      } else if (song[i].type == _blockTypeEnum.ColumnBreak) {
        html += `</div><div class="${_classNames.Column}">`;
      }
      // else {}
    }
    return html;
  };

  /**
   * Debugging tool for Firebug. Echos the song's structure.
   * @method _echo
   * @private
   * @param song {songNodeArray}
   * @return {void}
   */
  const _echo = song => {
    for (const i in song) {
      console.log(
        `>> ${i}. ${song[i].type} node, ${song[i].lines.length} lines`
      );
      for (const j in song[i].lines) {
        console.log(song[i].lines[j]);
      }
    }
  };

  /**
   * Explodes passed in text block into an array of songNodes ready for further parsing.
   * @method _domParse
   * @private
   * @param text {string}
   * @return {songNodeArray}
   */
  var _domParse = text => {
    const lines = text.split("\n");
    const song = [];
    let tmpBlk = null;
    let isMarker; // block marker
    for (const i in lines) {
      // strip comments
      if (lines[i].length > 0 && lines[i][0] == "#") {
        continue;
      }
      isMarker = _regEx.blocks.test(lines[i]);
      if (isMarker || tmpBlk === null) {
        // save last block, start new one...
        if (tmpBlk !== null) {
          song.push(tmpBlk);
        }
        tmpBlk = {
          type: _getBlockType(lines[i]),
          lines: []
        };
        if (!isMarker) {
          // Don't miss that first line!
          tmpBlk.lines.push(lines[i]);
        }
      } else {
        const s = ToolsLite.trim(lines[i]);
        if (s.length > 0) {
          tmpBlk.lines.push(s);
        }
      }
    }
    if (tmpBlk.lines.length > 0) {
      song.push(tmpBlk);
    }
    return song;
  };

  /**
   * Goes through songNodes, those nodes that are "instructions" are exploded and
   * a "the resulting "songDomElement" built, this songDomElement then replaces the
   * original line.
   *
   * The regular expression look for instructions with this format:
   * {commandVerb: commandArguments}
   *
   * @method _parseInstr
   * @private
   * @param song {songNodeArray}
   * @return {songNodeArray}
   */
  var _parseInstr = song => {
    const regEx = {
      instr: /\{[^}]+?:.*?\}/im,
      cmdArgs: /\{.+?:(.*)\}/gi,
      cmdVerb: /\{(.+?)\s*:.*\}/gi
    };
    for (const i in song) {      
      for (const j in song[i].lines) {           
        if (regEx.instr.test(song[i].lines[j])) {
          let args = song[i].lines[j].replace(regEx.cmdArgs, "$1");
          //JRM: Correction
          args = ToolsLite.trim(args);
          let verb = song[i].lines[j]
            .replace(regEx.cmdVerb, "$1")
            .toLowerCase();            
          verb = verb.replace(/\r/, ""); // IE7 bug
          verb = ToolsLite.trim(verb); // JRM: Correction bug
          const tmpBlk = {
            type: "",
            lines: []
          };
          switch (verb) {
            case "title":
            case "t":
              tmpBlk.type = _blockTypeEnum.Title;
              break;
            case "artist":
              tmpBlk.type = _blockTypeEnum.Artist;
              break;
            case "subtitle":
            case "st":
              tmpBlk.type = _blockTypeEnum.Subtitle;
              break;
            case "album":
              tmpBlk.type = _blockTypeEnum.Album;
              break;
            case "comment":
            case "c":
              tmpBlk.type = _blockTypeEnum.Comment;
              break;
            case "key":
            case "k":
              tmpBlk.type = _blockTypeEnum.Key;
              break;
            case "define":
              tmpBlk.type = _blockTypeEnum.ChordDefinition;
              break;
            case "goChord-meta":
              tmpBlk.type = _blockTypeEnum.GoChordMeta;
              break;
            default:
              tmpBlk.type = `Undefined-${verb}`;
              break;
          }
          tmpBlk.lines[0] = ToolsLite.trim(args);
          song[i].lines[j] = tmpBlk;
        }
      }
    }
    return song;
  };

  /**
   * A "Simple Instruction" is one that accepts no arguments. Presently this only handles Column Breaks.
   * @method _parseSimpleInstr
   * @private
   * @param song {songNodeArray}
   * @return {songNodeArray}
   */
  var _parseSimpleInstr = song => {
    const regEx = {
      columnBreak: /\s*{\s*(column_break|colb|np|new_page)\s*}\s*/im
    };
    for (const i in song) {
      for (const j in song[i].lines) {
        if (regEx.columnBreak.test(song[i].lines[j])) {
          const verb = song[i].lines[j]
            .replace(regEx.columnBreak, "$1")
            .toLowerCase();
          switch (verb) {
            case "column_break":
            case "colb":
              _columnCount++;
              song[i].lines[j] = {
                type: _blockTypeEnum.ColumnBreak,
                lines: []
              };
              break;
            case "new_page":
            case "np":
              song[i].lines[j] = {
                type: _blockTypeEnum.NewPage,
                lines: []
              };
              break;
          }
        }
      }
    }
    return song;
  };

  /**
   * Runs through songNodes and if the line contains at least one chord it's type is et to
   * ChordText, otherwise it's marked as "PlainText", meaning straight lyrics
   * @method _markChordLines
   * @private
   * @param song {songNodeArray}
   * @return {songNodeArray}
   */
  var _markChordLines = song => {
    const regEx = {
      chord: /\[(.+?)]/i,
      allChords: /\[(.+?)]/gim
    };

    let chordFound;
    let hasOnlyChords;
    let line;

    for (const i in song) {
      if (
        song[i].type != _blockTypeEnum.TextBlock &&
        song[i].type != _blockTypeEnum.ChorusBlock
      ) {
        continue;
      }
      for (const j in song[i].lines) {
        line = song[i].lines[j];
        if (typeof line != "string") {
          continue;
        }

        chordFound = regEx.chord.test(line);
        _hasChords = _hasChords || chordFound;
        hasOnlyChords =
          chordFound &&
          ToolsLite.trim(line.replace(regEx.allChords, "")).length < 1;
        // need to find
        song[i].lines[j] = {
          type: hasOnlyChords
            ? _blockTypeEnum.ChordOnlyText
            : chordFound
              ? _blockTypeEnum.ChordText
              : _blockTypeEnum.PlainText,
          lines: [line]
        };

        if (chordFound && _firstChord === "") {
          const m = line.match(regEx.chord);
          if (m) {
            _firstChord = m[1];
          }
        }
      }
    }
    return song;
  };

  /**
   * Searches the songNodes for the specified block type, retunrs all matching node line (text) values.
   * @method _getInfo
   * @private
   * @param song {songNodeArray}
   * @param type {_blockTypeEnum}
   * @return {array}
   */
  var _getInfo = (song, type) => {
    const rtn = [];
    for (const i in song) {
      if (song[i].type == type) {
        rtn.push(song[i].lines[0]);
      } else if (song[i].type == _blockTypeEnum.TextBlock) {
        for (const j in song[i].lines) {
          if (song[i].lines[j].type == type) {
            rtn.push(song[i].lines[j].lines[0]);
          }
        }
      }
    }
    return rtn;
  };

  /**
   * Removes HTML "pre" tags and comments.
   * @method _stripHtml
   * @private
   * @param text {string}
   * @return {string}
   */
  var _stripHtml = text => {
    const regEx = {
      pre: /<\/?pre>/gim, // HTML <pre></pre>
      htmlComment: /<!--(.|\n)*?-->/gm // HTML <!-- Comment -->
    };
    return text.replace(regEx.pre, "").replace(regEx.htmlComment, "");
  };

  /* return our public interface */
  return _public;
};
