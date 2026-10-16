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
 * Nostromo's set, the console [kpadopt4]: every drawing is a vector the ship's computer writes on an amber screen, of the
 * hardware the case is made of: a cassette bay, a scope, a tape reel, a jack, a row of lamps, a key switch. The register
 * sets the drawing in dark glass: `rule` is the lit phosphor, `line` the dim trace, `ink` the cream of the case's own
 * markings, `red` the alarm. In a 120 by 72 box, strokes in the order the beam writes them, top down.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const CONSOLE = {
    // An empty cassette bay: the case, the label strip, the window with its two bare hubs. Nothing wound on them.
    none: [
        ['ink', 'M26 12h68a4 4 0 0 1 4 4v38a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z'],
        ['line', 'M30 18h60v10H30z'],
        ['ink', 'M38 34h44v16H38z'],
        ['rule', 'M54 42a4 4 0 1 0-8 0a4 4 0 1 0 8 0'],
        ['rule', 'M74 42a4 4 0 1 0-8 0a4 4 0 1 0 8 0'],
    ],
    // The scope searched: its rings and crosshair, the sweep line, and no blip anywhere.
    nomatch: [
        ['ink', 'M86 36a26 26 0 1 0-52 0a26 26 0 1 0 52 0'],
        ['line', 'M73 36a13 13 0 1 0-26 0a13 13 0 1 0 26 0'],
        ['line', 'M60 10v52'],
        ['line', 'M34 36h52'],
        ['rule', 'M60 36l18-17'],
    ],
    // The tape off its reel: the reel stands, the tape runs out of it in red and tangles.
    error: [
        ['ink', 'M54 34a16 16 0 1 0-32 0a16 16 0 1 0 32 0'],
        ['line', 'M42 34a4 4 0 1 0-8 0a4 4 0 1 0 8 0'],
        ['red', 'M54 34c10 0 10 18 20 18s10-30 20-30 10 26 16 22'],
        ['red', 'M110 44c3 8-5 12-9 6'],
    ],
    // The jack and its socket, drawn apart: the plug on its cable, the socket on its own, a spark in the gap.
    offline: [
        ['line', 'M8 36h22'],
        ['ink', 'M30 28h16v16H30z'],
        ['ink', 'M46 31h8'],
        ['ink', 'M46 41h8'],
        ['rule', 'M58 36l2-4 3 8 2-4'],
        ['ink', 'M74 26h16v20H74z'],
        ['line', 'M78 31h5'],
        ['line', 'M78 41h5'],
        ['line', 'M90 36h22'],
    ],
    // A row of five lamps, every one lit, and the check under them.
    done: [
        ['ink', 'M28 26a6 6 0 1 0-12 0a6 6 0 1 0 12 0'],
        ['ink', 'M47 26a6 6 0 1 0-12 0a6 6 0 1 0 12 0'],
        ['ink', 'M66 26a6 6 0 1 0-12 0a6 6 0 1 0 12 0'],
        ['ink', 'M85 26a6 6 0 1 0-12 0a6 6 0 1 0 12 0'],
        ['ink', 'M104 26a6 6 0 1 0-12 0a6 6 0 1 0 12 0'],
        ['rule', 'M23 26h-2M42 26h-2M61 26h-2M80 26h-2M99 26h-2'],
        ['line', 'M12 40h96'],
        ['rule', 'M50 52l7 7 14-15'],
    ],
    // The key switch: the plate with its four screws, the cylinder, the key slot, the label tape under it.
    locked: [
        ['ink', 'M32 8h56a4 4 0 0 1 4 4v48a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z'],
        ['line', 'M37 16a1.5 1.5 0 1 0-3 0a1.5 1.5 0 1 0 3 0M86 16a1.5 1.5 0 1 0-3 0a1.5 1.5 0 1 0 3 0'],
        ['ink', 'M70 30a10 10 0 1 0-20 0a10 10 0 1 0 20 0'],
        ['rule', 'M60 24v12'],
        ['line', 'M44 50h32'],
    ],
};

/**
 * Titanium's set, the machined part [kpadopt4]: every drawing is a part on a machinist's drawing, cut from bar stock with the
 * chamfer at its top start and bottom end corners: a blank plate, a plate probed, a plate fractured, a bar cut in two, a
 * part with its bore inspected, a part under its clasp. `rule` is the bare tool edge, `line` the faint grain and centre
 * lines, `ink` the part's own outline, `red` the fracture. In a 120 by 72 box, strokes listed in the order they are cut.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const MACHINED = {
    // Bar stock before the first cut: the chamfered plate, its brushed grain, the datum cross where the work starts.
    none: [
        ['ink', 'M36 8h56v48l-8 8H28V16z'],
        ['line', 'M38 24h46'],
        ['line', 'M38 48h46'],
        ['line', 'M20 36h8M92 36h8'],
        ['rule', 'M54 36h12M60 30v12'],
    ],
    // The plate probed: three drilled holes, the stylus come down on a fourth place, and nothing there to find.
    nomatch: [
        ['ink', 'M36 8h56v48l-8 8H28V16z'],
        ['ink', 'M50 29a3 3 0 1 0-6 0a3 3 0 1 0 6 0'],
        ['ink', 'M63 29a3 3 0 1 0-6 0a3 3 0 1 0 6 0'],
        ['ink', 'M76 29a3 3 0 1 0-6 0a3 3 0 1 0 6 0'],
        ['line', 'M44 46h32'],
        ['rule', 'M60 46h4M62 44v4'],
        ['rule', 'M100 6L63 43'],
    ],
    // The plate fractured through: the crack runs top to bottom in red, the halves no longer one part.
    error: [
        ['ink', 'M36 8h22M62 8h30v48l-8 8H62M58 64H28V16l8-8'],
        ['red', 'M58 8l5 12-9 9 8 10-7 9 6 8-2 8'],
        ['line', 'M38 28h12'],
        ['line', 'M70 48h14'],
    ],
    // A bar parted: two halves with their chamfered ends, the axis through both, the gap dimensioned.
    offline: [
        ['ink', 'M14 28h34l4 4v8l-4 4H14z'],
        ['ink', 'M106 28H72l-4 4v8l4 4h34z'],
        ['line', 'M8 36h104'],
        ['rule', 'M52 56h16'],
        ['rule', 'M56 53l-4 3 4 3M64 53l4 3-4 3'],
    ],
    // The finished part: the plate, its bore, and the inspection tick stamped in the bore.
    done: [
        ['ink', 'M36 8h56v48l-8 8H28V16z'],
        ['ink', 'M72 36a12 12 0 1 0-24 0a12 12 0 1 0 24 0'],
        ['rule', 'M54 36l4 4 9-9'],
        ['line', 'M36 20h8'],
        ['line', 'M76 52h8'],
    ],
    // The part under its clasp: the body with its chamfers, the shackle over it, the key bore.
    locked: [
        ['ink', 'M46 32h34v26l-6 6H40V38z'],
        ['rule', 'M48 32v-8a12 12 0 0 1 24 0v8'],
        ['ink', 'M63 46a3 3 0 1 0-6 0a3 3 0 1 0 6 0'],
        ['rule', 'M60 49v7'],
        ['line', 'M14 56h18M88 56h18'],
    ],
};

/** Every set the package has, by the name a register shows. @type {Record<string, Record<ArtKind, ArtStroke[]>>} */
export const ART_SETS = {
    ledger: LEDGER,
    nostromo: CONSOLE,
    titanium: MACHINED,
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
