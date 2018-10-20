// Type definitions for gochord-viewer v0.2.0
// Project: https://github.com/jrmora/goChord-viewer
// Definitions by: Jaime Mora <https://github.com/jrmora/> 
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare const GoChordViewer: {
    Definitions: {
        add: any;
        addInstrument: any;
        get: any;
        getChords: any;
        instrument: {
            guitar: number;
        };
        replace: any;
        setChords: any;
        useInstrument: any;
    };
    Main: {
        init: any;
        run: any;
        runByClasses: any;
        setTuningOffset: any;
    };
    OverlapFixer: {
        Fix: any;
    };
    Settings: {
        colors: {
            dotText: string;
            dots: string;
            fretLines: string;
            fretText: string;
            text: string;
            xStroke: string;
        };
        commonChords: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
            7: string;
            concat: any;
            copyWithin: any;
            entries: any;
            every: any;
            fill: any;
            filter: any;
            find: any;
            findIndex: any;
            flat: any;
            flatMap: any;
            forEach: any;
            includes: any;
            indexOf: any;
            join: any;
            keys: any;
            lastIndexOf: any;
            length: number;
            map: any;
            pop: any;
            push: any;
            reduce: any;
            reduceRight: any;
            reverse: any;
            shift: any;
            slice: any;
            some: any;
            sort: any;
            splice: any;
            toLocaleString: any;
            toSource: any;
            toString: any;
            unshift: any;
            values: any;
        };
        defaultInstrument: number;
        environment: {
            isIe: boolean;
        };
        fonts: {
            dot: string;
            fret: string;
            text: string;
        };
        fretBox: {
            dotRadius: number;
            fretSpace: number;
            height: number;
            lineWidth: number;
            showText: boolean;
            stringSpace: number;
            topLeftPos: {
                x: number;
                y: number;
            };
            width: number;
            xStroke: number;
            xWidth: number;
        };
        ids: {
            canvas: string;
            container: string;
            songText: string;
        };
        inlineDiagrams: boolean;
        inlineFretBox: {
            dotRadius: number;
            fonts: {
                dot: string;
                fret: string;
                text: string;
            };
            fretSpace: number;
            height: number;
            lineWidth: number;
            showText: boolean;
            stringSpace: number;
            topLeftPos: {
                x: number;
                y: number;
            };
            width: number;
            xStroke: number;
            xWidth: number;
        };
        numFrets: number;
        opts: {
            autoFixOverlaps: boolean;
            columnsEnabled: boolean;
            ignoreCommonChords: boolean;
            retainBrackets: boolean;
            sortAlphabetical: boolean;
        };
        scale: any;
        tabs: {
            bottomPadding: number;
            dotColor: string;
            dotRadius: number;
            labelFont: string;
            labelWidth: number;
            lineColor: string;
            lineSpacing: number;
            lineWidth: number;
            noteSpacing: number;
            textColor: string;
            textFont: string;
        };
        tuning: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            concat: any;
            copyWithin: any;
            entries: any;
            every: any;
            fill: any;
            filter: any;
            find: any;
            findIndex: any;
            flat: any;
            flatMap: any;
            forEach: any;
            includes: any;
            indexOf: any;
            join: any;
            keys: any;
            lastIndexOf: any;
            length: number;
            map: any;
            pop: any;
            push: any;
            reduce: any;
            reduceRight: any;
            reverse: any;
            shift: any;
            slice: any;
            some: any;
            sort: any;
            splice: any;
            toLocaleString: any;
            toSource: any;
            toString: any;
            unshift: any;
            values: any;
        };
        wrapClasses: {
            diagrams: string;
            text: string;
            wrap: string;
        };
    };
    ToolsLite: {
        addClass: any;
        getElementsByClass: any;
        hasClass: any;
        pack: any;
        removeClass: any;
        setClass: any;
        trim: any;
    };
    Transpose: {
        retune: any;
        shift: any;
        shiftChords: any;
    };
};
