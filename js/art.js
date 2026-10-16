// Drawings for an empty state, in the theme's own hand [kpadopt4; homelab's `drawing()` and `nx-art`].
//
//   <div class="kp-empty" data-kp-art="none">
//       <p class="kp-empty__title">No applications yet</p> …
//   </div>
//
// attachArt() puts a small line drawing at the top of every element with
// `data-kp-art`: what kind of emptiness it is, drawn the way the theme draws.
// The kinds:
//
//   none      nothing here yet
//   nomatch   nothing matched the search or the filter
//   error     it could not be read
//   offline   the connection is gone
//   done      all clear, nothing left to do
//   locked    there is something, and this reader may not see it
//
// A drawing is a picture only (`aria-hidden`): the title and the sentence of
// the empty state carry the meaning. Each theme draws its own set: the svg
// holds every set this package has, one `<g data-kp-art-set>` each, and the
// theme's register shows its own (`.kp-art` is hidden until a register shows
// it), so a theme switch needs no script and a theme without a set shows no
// drawing rather than another theme's. Formal's set is the ledger: a page of
// ruled lines, an entry struck through in red ink, the account closed with the
// double rule. Every stroke is ruled in on arrival, top down, by the register.
//
//   data-kp-art-size="sm" | "lg"   5rem or 10rem wide instead of 7.5rem
//
// Nothing runs on import; attachArt(root) returns a detach that takes the
// drawings out again.

/** An element that gets a drawing. */
export const ART = '[data-kp-art]';
/** The kinds a drawing can show. */
export const ART_KINDS = /** @type {const} */ (['none', 'nomatch', 'error', 'offline', 'done', 'locked']);

/**
 * @typedef {'none' | 'nomatch' | 'error' | 'offline' | 'done' | 'locked'} ArtKind
 * @typedef {'rule' | 'line' | 'ink' | 'red'} ArtInk the stroke's colour: the theme's acting colour, a faint ruled line, the page's ink, the destructive ink
 * @typedef {[ArtInk, string]} ArtStroke an ink and an SVG path, drawn in that order
 */

const SVG = 'http://www.w3.org/2000/svg';

/**
 * Formal's set, the ledger [G7, G8, G19]: every drawing is something a clerk does to a ledger page. The page is a hairline
 * frame with the double rule at its head; its lines are faint ruled lines; what acts is a navy rule; what needs the eye is
 * red ink. In a 120 by 72 box, strokes listed top down, the order they are ruled in.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const LEDGER = {
    // An open page, ruled and blank, the pen's tick waiting at the first line.
    none: [
        ['ink', 'M26 8h68v56H26z'],
        ['rule', 'M30 16h60'],
        ['rule', 'M30 19h60'],
        ['line', 'M30 29h60'],
        ['line', 'M30 38h60'],
        ['line', 'M30 47h60'],
        ['line', 'M30 56h60'],
        ['rule', 'M33 25v4'],
    ],
    // The page searched: its lines with no entry under them, and the reading glass over its foot.
    nomatch: [
        ['ink', 'M20 8h64v56H20z'],
        ['rule', 'M24 16h56'],
        ['rule', 'M24 19h56'],
        ['line', 'M24 29h56'],
        ['line', 'M24 38h56'],
        ['line', 'M24 47h30'],
        ['ink', 'M86 44a12 12 0 1 0-24 0a12 12 0 1 0 24 0'],
        ['rule', 'M83 53l13 13'],
    ],
    // An entry struck through in red ink, ruled off along its start edge.
    error: [
        ['ink', 'M26 8h68v56H26z'],
        ['rule', 'M30 16h60'],
        ['rule', 'M30 19h60'],
        ['line', 'M30 29h60'],
        ['ink', 'M36 37c4-5 7 4 11-1s6 3 10-1 7 3 11 0 5 2 8 0'],
        ['red', 'M33 37.5h50'],
        ['red', 'M30 31v13'],
        ['line', 'M30 47h60'],
        ['line', 'M30 56h60'],
    ],
    // The double rule broken in its middle: the two halves of the account no longer meet.
    offline: [
        ['rule', 'M10 30h38'],
        ['rule', 'M10 34h38'],
        ['ink', 'M48 26v12'],
        ['rule', 'M72 30h38'],
        ['rule', 'M72 34h38'],
        ['ink', 'M72 26v12'],
        ['line', 'M56 32h8'],
        ['line', 'M10 48h100'],
    ],
    // The account closed: a column of figures, ruled under, and closed with the double rule.
    done: [
        ['ink', 'M26 8h68v56H26z'],
        ['line', 'M30 17h60'],
        ['ink', 'M70 17h16'],
        ['line', 'M30 26h60'],
        ['ink', 'M74 26h12'],
        ['line', 'M30 35h60'],
        ['ink', 'M66 35h20'],
        ['rule', 'M62 44h26'],
        ['rule', 'M62 47.5h26'],
        ['ink', 'M70 55h16'],
    ],
    // The ledger shut, its strap across the cover and the clasp closed on it.
    locked: [
        ['ink', 'M30 10h60v52H30z'],
        ['ink', 'M36 10v52'],
        ['rule', 'M30 36h60'],
        ['ink', 'M54 31h12v10H54z'],
        ['rule', 'M57 31v-4a3 3 0 0 1 6 0v4'],
    ],
};

/**
 * Pastel's set, the sticker sheet [G7, G9, G18]: every drawing is something done to a page of a planner. A sticker is
 * white paper with its second pass, a flat sky shape 5 units off register (`line`, filled); the paper is `ink` (a closed
 * shape, filled with the card colour, outlined in plum); what is drawn on it is `rule` (plum, open); a mistake is `red`.
 * The last stroke of every drawing is the washi tape that holds it (the register fills it mint). In a 120 by 72 box,
 * strokes listed in the order they are stuck on.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const STICKERS = {
    // A blank planner page: three empty pearls on a thread, waiting for something to be threaded.
    none: [
        ['line', 'M33 13h56a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H33a6 6 0 0 1-6-6V19a6 6 0 0 1 6-6z'],
        ['ink', 'M28 8h56a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z'],
        ['rule', 'M32 20h24'],
        ['rule', 'M32 34h56'],
        ['rule', 'M46 34a2.5 2.5 0 1 0-5 0a2.5 2.5 0 1 0 5 0'],
        ['rule', 'M62.5 34a2.5 2.5 0 1 0-5 0a2.5 2.5 0 1 0 5 0'],
        ['rule', 'M79 34a2.5 2.5 0 1 0-5 0a2.5 2.5 0 1 0 5 0'],
        ['rule', 'M32 48h34'],
        ['ink', 'M13 16L27 6l6 8-14 10z'],
    ],
    // The page searched: its lines with nothing on them, and a lens held over its foot.
    nomatch: [
        ['line', 'M33 13h56a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H33a6 6 0 0 1-6-6V19a6 6 0 0 1 6-6z'],
        ['ink', 'M28 8h56a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z'],
        ['rule', 'M32 20h24'],
        ['rule', 'M32 30h34'],
        ['line', 'M89 45a12 12 0 1 0-24 0a12 12 0 1 0 24 0'],
        ['ink', 'M86 42a12 12 0 1 0-24 0a12 12 0 1 0 24 0'],
        ['rule', 'M83 51l11 11'],
        ['ink', 'M13 16L27 6l6 8-14 10z'],
    ],
    // A cross-out sticker stuck on the page where the entry should be.
    error: [
        ['line', 'M33 13h56a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H33a6 6 0 0 1-6-6V19a6 6 0 0 1 6-6z'],
        ['ink', 'M28 8h56a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z'],
        ['rule', 'M32 18h24'],
        ['rule', 'M32 54h40'],
        ['line', 'M70 37a11 11 0 1 0-22 0a11 11 0 1 0 22 0'],
        ['ink', 'M67 34a11 11 0 1 0-22 0a11 11 0 1 0 22 0'],
        ['red', 'M51 29l12 10M63 29L51 39'],
        ['ink', 'M13 16L27 6l6 8-14 10z'],
    ],
    // Two stickers on a thread that no longer joins them.
    offline: [
        ['line', 'M24 26h18a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6z'],
        ['line', 'M86 26h18a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H86a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6z'],
        ['ink', 'M20 22h18a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6z'],
        ['ink', 'M82 22h18a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H82a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6z'],
        ['rule', 'M44 36h9'],
        ['rule', 'M67 36h9'],
        ['red', 'M56 31l8 10M64 31l-8 10'],
        ['ink', 'M8 24L20 16l5 7-12 8z'],
    ],
    // The page's round sticker, stuck on with a tick: nothing is left to do.
    done: [
        ['line', 'M87 39a22 22 0 1 0-44 0a22 22 0 1 0 44 0'],
        ['ink', 'M82 34a22 22 0 1 0-44 0a22 22 0 1 0 44 0'],
        ['rule', 'M49 35l8 8 15-17'],
        ['rule', 'M44 66h4'],
        ['rule', 'M54 66h12'],
        ['rule', 'M72 66h4'],
        ['ink', 'M34 14l12-8 5 7-12 8z'],
    ],
    // The planner shut, its strap across the cover and the padlock sticker on it.
    locked: [
        ['line', 'M39 13h46a6 6 0 0 1 6 6v42a6 6 0 0 1-6 6H39a6 6 0 0 1-6-6V19a6 6 0 0 1 6-6z'],
        ['ink', 'M34 8h46a6 6 0 0 1 6 6v42a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z'],
        ['rule', 'M28 36h58'],
        ['ink', 'M54 34h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H54a2 2 0 0 1-2-2V36a2 2 0 0 1 2-2z'],
        ['rule', 'M55 34v-4a5 5 0 0 1 10 0v4'],
        ['ink', 'M22 14l12-8 5 7-12 9z'],
    ],
};

/**
 * Forest's set, the field kit [G7, G14]: every drawing is something on a ranger's map or in the wood it describes. The
 * map sheet has the leaf corner (`ink`, the outline of a plate); what is drawn on it is the wood: contour lines are
 * `line`, the trail, a tree and a trig point are `rule` (the acting green), a blaze that marks a fault is `red`. In a 120
 * by 72 box, strokes listed from the ground up, the order they grow in.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const FIELD_KIT = {
    // A map with nothing charted yet: contour rings round a bare trig point.
    none: [
        ['ink', 'M22 8h58a10 10 0 0 1 10 10v44H32a10 10 0 0 1-10-10z'],
        ['line', 'M36 46c-2-10 8-17 22-16c13 1 20 10 14 19c-7 8-33 7-36-3z'],
        ['line', 'M46 44c2-6 8-9 15-7c7 2 9 8 4 13c-6 4-18 3-19-6z'],
        ['rule', 'M60 35l5 9h-10z'],
        ['rule', 'M61.5 41a1.5 1.5 0 1 0-3 0a1.5 1.5 0 1 0 3 0'],
        ['rule', 'M30 18h16'],
    ],
    // The trail searched: it runs out where the lens lies and finds nothing.
    nomatch: [
        ['ink', 'M22 8h58a10 10 0 0 1 10 10v44H32a10 10 0 0 1-10-10z'],
        ['line', 'M28 28c10-6 18 2 28-2s14-8 24-4'],
        ['line', 'M28 36c10-6 18 2 28-2s14-8 24-4'],
        ['rule', 'M30 52l8-4 7 3 8-6'],
        ['ink', 'M86 36a11 11 0 1 0-22 0a11 11 0 1 0 22 0'],
        ['rule', 'M82 44l9 10'],
    ],
    // A tree with a red blaze crossed through: the trail is closed here.
    error: [
        ['line', 'M30 62h60'],
        ['ink', 'M56 62V30M64 62V30'],
        ['rule', 'M60 6l15 24H45z'],
        ['red', 'M54 40h12v11H54z'],
        ['red', 'M54 40l12 11M66 40L54 51'],
    ],
    // The trail on one bank and the trail on the other, and a stream between with nothing across it.
    offline: [
        ['ink', 'M8 40h38M74 40h38'],
        ['line', 'M46 24c5 5 5 11 0 16s-5 11 0 16'],
        ['line', 'M74 24c-5 5-5 11 0 16s5 11 0 16'],
        ['rule', 'M12 34h9M25 34h9'],
        ['rule', 'M86 34h9M99 34h9'],
        ['rule', 'M38 22a4 4 0 1 0-8 0a4 4 0 1 0 8 0'],
        ['rule', 'M90 22a4 4 0 1 0-8 0a4 4 0 1 0 8 0'],
    ],
    // A tree grown whole on its ground, a flag at the trig point: the plot is finished.
    done: [
        ['line', 'M36 66h48'],
        ['ink', 'M30 58h60'],
        ['ink', 'M58 58V40h4v18'],
        ['rule', 'M60 6l12 16h-5l10 16H43l10-16h-5z'],
        ['rule', 'M94 58V44l9 4-9 4'],
    ],
    // A gate in a fence, its latch fastened.
    locked: [
        ['ink', 'M30 12v52M90 12v52'],
        ['rule', 'M30 22h60M30 36h60M30 50h60'],
        ['line', 'M32 48L88 24'],
        ['ink', 'M55 31h10v10H55z'],
        ['rule', 'M57 31v-3a3 3 0 0 1 6 0v3'],
    ],
};

/**
 * Blueprint's set, the working drawing [G6, G13, G16]: every drawing is something a draughtsman does on a sheet. The part
 * is the finished line (`ink`), what the pen draws now is cyan (`rule`), the construction and the hatch are faint (`line`),
 * a flagged fault is `red`. In a 120 by 72 box, strokes listed in the order the pen draws them.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const DRAWING = {
    // A part not drawn yet: its four corner marks, the centre lines and the compass circle round the centre.
    none: [
        ['line', 'M18 36h84'],
        ['line', 'M60 8v56'],
        ['ink', 'M26 20V10h10'],
        ['ink', 'M84 10h10v10'],
        ['ink', 'M94 52v10H84'],
        ['ink', 'M36 62H26V52'],
        ['rule', 'M72 36a12 12 0 1 0-24 0a12 12 0 1 0 24 0'],
        ['ink', 'M30 68h60M30 65v6M90 65v6'],
    ],
    // The circle searched: a leader from it to a note that holds nothing.
    nomatch: [
        ['line', 'M16 36h60'],
        ['line', 'M46 10v52'],
        ['ink', 'M62 36a16 16 0 1 0-32 0a16 16 0 1 0 32 0'],
        ['rule', 'M58 25l16-12h20'],
        ['ink', 'M94 8h18v10H94z'],
    ],
    // The part with its failure flagged: the filled triangle in red, the part's outline unfinished at one corner.
    error: [
        ['ink', 'M30 14h60v40H30z'],
        ['line', 'M60 14v40M30 34h60'],
        ['red', 'M60 20l11 20H49z'],
        ['red', 'M60 26v7M60 36v1'],
        ['rule', 'M30 64h60M30 61v6M90 61v6'],
    ],
    // Two parts on one centre line, and the break in it where they no longer meet.
    offline: [
        ['ink', 'M10 24h36v24H10z'],
        ['ink', 'M74 24h36v24H74z'],
        ['line', 'M4 36h6M46 36h6M68 36h6M110 36h6'],
        ['ink', 'M53 36l3-6 6 12 3-6'],
        ['rule', 'M10 56h36M10 53v6M46 53v6'],
        ['rule', 'M74 56h36M74 53v6M110 53v6'],
    ],
    // The section hatched and checked: the part is complete.
    done: [
        ['ink', 'M30 12h60v44H30z'],
        ['line', 'M30 56L74 12M44 56L88 12M60 56L90 26M30 38L56 12'],
        ['rule', 'M50 36l8 8 14-16'],
        ['ink', 'M30 64h60M30 61v6M90 61v6'],
    ],
    // The part held under a lock: hatched across, the padlock drawn on its centre.
    locked: [
        ['ink', 'M30 10h60v52H30z'],
        ['line', 'M30 62L82 10M30 40L60 10M52 62L90 24'],
        ['ink', 'M50 32h20v18H50z'],
        ['rule', 'M54 32v-6a6 6 0 0 1 12 0v6'],
        ['rule', 'M20 6h6M23 3v6M94 6h6M97 3v6'],
    ],
};

/** Every set the package has, by the name a register shows. @type {Record<string, Record<ArtKind, ArtStroke[]>>} */
export const ART_SETS = {
    ledger: LEDGER,
    stickers: STICKERS,
    fieldkit: FIELD_KIT,
    drawing: DRAWING,
};

/** @param {string} value @returns {value is ArtKind} */
const isKind = (value) => /** @type {readonly string[]} */ (ART_KINDS).includes(value);

/**
 * The drawing for one kind: an svg with every set's group, hidden from a screen reader.
 * @param {Document} doc
 * @param {ArtKind} kind
 * @returns {SVGSVGElement}
 */
export function drawArt(doc, kind) {
    const svg = /** @type {SVGSVGElement} */ (doc.createElementNS(SVG, 'svg'));
    svg.setAttribute('class', 'kp-art');
    svg.setAttribute('viewBox', '0 0 120 72');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.dataset.kpArtKind = kind;
    for (const [name, set] of Object.entries(ART_SETS)) {
        const group = doc.createElementNS(SVG, 'g');
        group.setAttribute('data-kp-art-set', name);
        set[kind].forEach(([ink, d], i) => {
            const path = doc.createElementNS(SVG, 'path');
            path.setAttribute('d', d);
            path.setAttribute('pathLength', '1');
            path.setAttribute('class', `kp-art__${ink}`);
            // The order the strokes are ruled in, top down (through the CSSOM, which a strict style-src allows).
            path.style.setProperty('--kp-art-i', String(i));
            group.append(path);
        });
        svg.append(group);
    }
    return svg;
}

/**
 * Give every element with `data-kp-art` under `root` its drawing, and follow a change of the kind.
 * @param {ParentNode} [root]
 * @returns {() => void} detach: the drawings go
 */
export function attachArt(root = document) {
    const hosts = /** @type {HTMLElement[]} */ ([...(root instanceof Element && root.matches(ART) ? [root] : []), ...root.querySelectorAll(ART)]);
    /** @type {SVGSVGElement[]} */
    const made = [];
    const place = (/** @type {HTMLElement} */ host) => {
        host.querySelector(':scope > .kp-art')?.remove();
        const kind = host.dataset.kpArt ?? '';
        if (!isKind(kind)) return;
        const svg = drawArt(host.ownerDocument, kind);
        host.prepend(svg);
        made.push(svg);
    };
    for (const host of hosts) place(host);
    if (typeof MutationObserver === 'undefined' || hosts.length === 0)
        return () => {
            for (const svg of made) svg.remove();
        };
    const watch = new MutationObserver((records) => {
        for (const record of records) place(/** @type {HTMLElement} */ (record.target));
    });
    for (const host of hosts) watch.observe(host, { attributes: true, attributeFilter: ['data-kp-art'] });
    return () => {
        watch.disconnect();
        for (const svg of made) svg.remove();
    };
}
