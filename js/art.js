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
 * Solstice's set, the low sun [kpadopt4]: every drawing is something the sun does on a horizon. The horizon is a faint line
 * and what is drawn comes up from it, so the strokes are listed from the foot upward, the order they rise in; the sun and
 * what acts is amber, the rays and the arc its path, what needs the eye a red sky. Round at every end.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const HORIZON = {
    // The sun not yet up: the horizon, a half disc on it and its first rays.
    none: [
        ['line', 'M10 52h100'],
        ['rule', 'M46 52a14 14 0 0 1 28 0'],
        ['line', 'M60 29v-6'],
        ['line', 'M40 36l-4-4'],
        ['line', 'M80 36l4-4'],
    ],
    // The arc traced, and a hollow ring where the sun would stand: nothing matched.
    nomatch: [
        ['line', 'M10 52h100'],
        ['line', 'M16 52a44 44 0 0 1 88 0'],
        ['ink', 'M52 8a8 8 0 1 0 16 0a8 8 0 1 0-16 0'],
        ['rule', 'M74 20l10 10'],
    ],
    // The sky reddened: the sun low behind bands of red haze.
    error: [
        ['line', 'M10 56h100'],
        ['ink', 'M46 52a14 14 0 0 1 28 0'],
        ['red', 'M22 44h76'],
        ['red', 'M32 36h56'],
        ['red', 'M44 28h32'],
    ],
    // The arc broken in its middle and no sun on it.
    offline: [
        ['line', 'M10 56h100'],
        ['ink', 'M14 56a46 46 0 0 1 23-40'],
        ['ink', 'M83 16a46 46 0 0 1 23 40'],
        ['line', 'M54 14h12'],
    ],
    // Noon: the whole sun risen over the horizon, every ray out.
    done: [
        ['line', 'M10 58h100'],
        ['rule', 'M48 34a12 12 0 1 0 24 0a12 12 0 1 0-24 0'],
        ['ink', 'M60 14v6'],
        ['ink', 'M60 48v6'],
        ['ink', 'M34 34h6'],
        ['ink', 'M80 34h6'],
        ['ink', 'M41 15l4 4'],
        ['ink', 'M79 15l-4 4'],
    ],
    // The sun behind a closed shutter: its rays stop at the board, a keyhole in it.
    locked: [
        ['ink', 'M26 36h68v24H26z'],
        ['rule', 'M54 47a6 6 0 1 0 12 0a6 6 0 1 0-12 0'],
        ['rule', 'M60 53v4'],
        ['line', 'M60 12v14'],
        ['line', 'M40 18l6 10'],
        ['line', 'M80 18l-6 10'],
    ],
};

/**
 * Brutalism's set, the slab [kpadopt4]: every drawing is a thing of weight on its footprint, drawn in the one ink line. A
 * slab is a square outline, its footprint the L of ground its hard shadow would fall on, and each stroke is listed in the
 * order it is set down: the ground first, then what falls on it. Nothing is round; a bolt is a small square; what is
 * wrong is taped off in red stripes.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const SLAB = {
    // The footprint and the slab that stands on it, nothing on the slab yet.
    none: [
        ['line', 'M34 62h54V20'],
        ['ink', 'M28 12h54v44H28z'],
    ],
    // The footprint with nothing on it and the slab lifted off, up and to the left, where it was.
    nomatch: [
        ['line', 'M40 62h56V20'],
        ['ink', 'M18 6h54v44H18z'],
        ['rule', 'M44 56v-2'],
        ['rule', 'M70 56v-2'],
    ],
    // The slab taped off: three red stripes across it.
    error: [
        ['line', 'M34 62h54V20'],
        ['ink', 'M28 12h54v44H28z'],
        ['red', 'M28 34L50 12'],
        ['red', 'M28 56L72 12'],
        ['red', 'M50 56l32-32'],
    ],
    // Two slabs on their ground with the cable between them cut through.
    offline: [
        ['line', 'M6 62h108'],
        ['ink', 'M6 20h34v36H6z'],
        ['ink', 'M80 20h34v36H80z'],
        ['rule', 'M40 38h12'],
        ['rule', 'M68 38h12'],
        ['red', 'M54 30v16'],
        ['red', 'M66 30v16'],
    ],
    // The slab set down on its footprint and stamped with a tick.
    done: [
        ['line', 'M34 62h54V20'],
        ['ink', 'M28 12h54v44H28z'],
        ['rule', 'M42 34l10 10 18-22'],
    ],
    // The slab bolted shut: four square bolts, a padlock on it.
    locked: [
        ['line', 'M32 64h66V16'],
        ['ink', 'M26 8h68v52H26z'],
        ['ink', 'M44 32h32v20H44z'],
        ['rule', 'M50 32v-6a10 10 0 0 1 20 0v6'],
        ['ink', 'M31 13h5v5h-5z'],
        ['ink', 'M84 13h5v5h-5z'],
        ['ink', 'M31 50h5v5h-5z'],
        ['ink', 'M84 50h5v5h-5z'],
    ],
};

/**
 * Deco's set, the lobby's fan [kpadopt4]: every drawing is the fan, the deco gesture, in gold hairlines: closed it is a
 * pointed shape standing on its pivot (a lozenge) over the double rule, open it is ribs from that pivot with the leaf's arcs
 * across them. Strokes are listed from the centre outward, the order the inlay is drawn in, two at a time. The lozenge is
 * the jewel, the chevron the cut, ruby only where something broke.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const FAN = {
    // The fan closed, standing on its pivot over the double rule: nothing opened yet.
    none: [
        ['rule', 'M60 56l-4 4 4 4 4-4z'],
        ['ink', 'M60 56L52 14h16z'],
        ['line', 'M30 66h60'],
        ['line', 'M30 69h60'],
    ],
    // The ribs without their leaf: the fan open and nothing on it that matched.
    nomatch: [
        ['rule', 'M60 56l-4 4 4 4 4-4z'],
        ['line', 'M60.0 62.0L67.6 18.7'],
        ['line', 'M60.0 62.0L52.4 18.7'],
        ['line', 'M60.0 62.0L82.0 23.9'],
        ['line', 'M60.0 62.0L38.0 23.9'],
        ['line', 'M60.0 62.0L93.7 33.7'],
        ['line', 'M60.0 62.0L26.3 33.7'],
        ['line', 'M60.0 62.0L101.3 47.0'],
        ['line', 'M60.0 62.0L18.7 47.0'],
        ['line', 'M24 66h72'],
    ],
    // One rib broken through in ruby, the rest of the fan whole.
    error: [
        ['rule', 'M60 56l-4 4 4 4 4-4z'],
        ['red', 'M60.0 62.0L63.4 42.5'],
        ['red', 'M64.6 36.0L67.6 18.7'],
        ['ink', 'M60.0 62.0L52.4 18.7'],
        ['ink', 'M60.0 62.0L82.0 23.9'],
        ['ink', 'M60.0 62.0L38.0 23.9'],
        ['ink', 'M60.0 62.0L93.7 33.7'],
        ['ink', 'M60.0 62.0L26.3 33.7'],
        ['ink', 'M60.0 62.0L101.3 47.0'],
        ['ink', 'M60.0 62.0L18.7 47.0'],
    ],
    // Two chevrons turned toward each other and no longer meeting, over the double rule.
    offline: [
        ['line', 'M10 66h100'],
        ['line', 'M10 69h100'],
        ['ink', 'M24 24l16 16-16 16'],
        ['ink', 'M96 24l-16 16 16 16'],
        ['rule', 'M60 34l6 6-6 6-6-6z'],
    ],
    // The fan wide open with its leaf: everything is done.
    done: [
        ['rule', 'M60 56l-4 4 4 4 4-4z'],
        ['ink', 'M60.0 62.0L67.6 18.7'],
        ['ink', 'M60.0 62.0L52.4 18.7'],
        ['ink', 'M60.0 62.0L82.0 23.9'],
        ['ink', 'M60.0 62.0L38.0 23.9'],
        ['ink', 'M60.0 62.0L93.7 33.7'],
        ['ink', 'M60.0 62.0L26.3 33.7'],
        ['ink', 'M60.0 62.0L101.3 47.0'],
        ['ink', 'M60.0 62.0L18.7 47.0'],
        ['rule', 'M101.3 47.0A44 44 0 0 0 18.7 47.0'],
        ['rule', 'M86.3 52.4A28 28 0 0 0 33.7 52.4'],
    ],
    // The fan folded shut with its band and the lozenge clasp across it.
    locked: [
        ['ink', 'M60 60L50 12h20z'],
        ['rule', 'M44 38h32'],
        ['rule', 'M60 32l6 6-6 6-6-6z'],
        ['line', 'M30 66h60'],
        ['line', 'M30 69h60'],
    ],
};

/** Every set the package has, by the name a register shows. @type {Record<string, Record<ArtKind, ArtStroke[]>>} */
export const ART_SETS = {
    ledger: LEDGER,
    horizon: HORIZON,
    slab: SLAB,
    fan: FAN,
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
