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

/** Every set the package has, by the name a register shows. @type {Record<string, Record<ArtKind, ArtStroke[]>>} */
export const ART_SETS = { ledger: LEDGER };

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
