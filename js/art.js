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
 * Dark's set, the spectrum [kpadopt4]: every drawing is the instrument's screen. The screen is a frame cut on two opposite
 * corners with its grid faint; the baseline is the line's track; the film (the acting stroke) is what the spectral line has
 * laid; a bracket closes on a reading; coral is the one colour that is meaning. In a 120 by 72 box.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const SPECTRUM = {
    // An empty screen: the grid, the baseline, the line waiting at its start edge.
    none: [
        ['ink', 'M22 8h66l10 10v46H32L22 54z'],
        ['line', 'M34 22h52'],
        ['line', 'M34 50h52'],
        ['line', 'M60 14v44'],
        ['line', 'M34 36h52'],
        ['rule', 'M34 30v12'],
    ],
    // The spectrum read and no line found: the baseline flat, a pair of brackets round nothing.
    nomatch: [
        ['ink', 'M22 8h66l10 10v46H32L22 54z'],
        ['line', 'M34 36h14'],
        ['line', 'M72 36h14'],
        ['ink', 'M54 24h-6v24h6'],
        ['ink', 'M66 24h6v24h-6'],
        ['rule', 'M60 31v10'],
    ],
    // The line laid up to a point and cut there in coral: the rest of the track dark.
    error: [
        ['ink', 'M22 8h66l10 10v46H32L22 54z'],
        ['rule', 'M34 36h20'],
        ['red', 'M58 24l8 24'],
        ['red', 'M66 24l-8 24'],
        ['line', 'M70 36h16'],
    ],
    // The track broken in two with the brackets turned away from each other: nothing crosses the gap.
    offline: [
        ['line', 'M10 36h26'],
        ['ink', 'M44 26h-6v20h6'],
        ['ink', 'M76 26h6v20h-6'],
        ['line', 'M84 36h26'],
        ['rule', 'M52 36h4'],
        ['rule', 'M64 36h4'],
    ],
    // The pass finished: the whole track laid in film, the bracket closed on its end.
    done: [
        ['ink', 'M22 8h66l10 10v46H32L22 54z'],
        ['line', 'M34 22h52'],
        ['line', 'M34 50h52'],
        ['rule', 'M34 36h46'],
        ['ink', 'M82 26h6v20h-6'],
        ['rule', 'M46 54l6 5l12-12'],
    ],
    // The screen behind a plate: a shackle, the plate cut on its corners, the keyhole in film.
    locked: [
        ['ink', 'M22 8h66l10 10v46H32L22 54z'],
        ['ink', 'M52 34v-7a8 8 0 0 1 16 0v7'],
        ['ink', 'M48 34h24v18H54l-6-6z'],
        ['rule', 'M60 39v8'],
    ],
};

/**
 * Cyberpunk's set, the HUD [kpadopt4]: every drawing is the system looking at a holo card. The card is a plate cut at its
 * dossier corner and its foot; scan lines are faint; the reticle (four corner brackets, the acting stroke in signal
 * yellow) is the system targeting; cyan reads out; red is the alarm. In a 120 by 72 box.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const HUD = {
    // An empty holo card, the reticle standing open at its middle, the cursor waiting.
    none: [
        ['ink', 'M22 8h64l12 12v44H34L22 52z'],
        ['line', 'M30 22h8'],
        ['line', 'M30 28h4'],
        ['rule', 'M48 30h6'],
        ['rule', 'M48 30v6'],
        ['rule', 'M72 30h-6'],
        ['rule', 'M72 30v6'],
        ['rule', 'M48 46h6'],
        ['rule', 'M48 46v-6'],
        ['rule', 'M72 46h-6'],
        ['rule', 'M72 46v-6'],
        ['line', 'M57 38h6'],
    ],
    // The reticle hunting wide and finding nothing, a read-out prefix beside it.
    nomatch: [
        ['ink', 'M22 8h64l12 12v44H34L22 52z'],
        ['rule', 'M40 24h10'],
        ['rule', 'M40 24v10'],
        ['rule', 'M80 24h-10'],
        ['rule', 'M80 24v10'],
        ['rule', 'M40 52h10'],
        ['rule', 'M40 52v-10'],
        ['rule', 'M80 52h-10'],
        ['rule', 'M80 52v-10'],
        ['line', 'M56 38h8'],
        ['line', 'M60 34v8'],
    ],
    // The card torn: its top half displaced sideways, two bands of red between the halves.
    error: [
        ['ink', 'M28 8h64l12 12v10H28z'],
        ['red', 'M14 34h34'],
        ['red', 'M72 38h34'],
        ['ink', 'M22 42h64v22H34L22 52z'],
        ['line', 'M40 54h24'],
    ],
    // The uplink: four bars of signal rising, cut through by one red stroke, nothing diagonal in the card.
    offline: [
        ['ink', 'M44 54v-6'],
        ['ink', 'M54 54v-14'],
        ['ink', 'M64 54v-22'],
        ['ink', 'M74 54v-30'],
        ['red', 'M30 62h60'],
        ['line', 'M30 14h20'],
        ['line', 'M70 14h20'],
    ],
    // Target locked and cleared: the reticle closed tight on a tick.
    done: [
        ['ink', 'M22 8h64l12 12v44H34L22 52z'],
        ['rule', 'M44 26h8'],
        ['rule', 'M44 26v8'],
        ['rule', 'M76 26h-8'],
        ['rule', 'M76 26v8'],
        ['rule', 'M44 50h8'],
        ['rule', 'M44 50v-8'],
        ['rule', 'M76 50h-8'],
        ['rule', 'M76 50v-8'],
        ['ink', 'M53 39l5 5l10-11'],
    ],
    // A card behind the lock: the shackle, the notched body, the reticle's four corners in red.
    locked: [
        ['ink', 'M22 8h64l12 12v44H34L22 52z'],
        ['ink', 'M52 34v-6a8 8 0 0 1 16 0v6'],
        ['ink', 'M48 34h24v18H56l-8-8z'],
        ['red', 'M60 40v6'],
        ['line', 'M28 60h8'],
    ],
};

/**
 * Synthwave's set, the floor [kpadopt4]: the empty state already carries the striped sun on its horizon, so each drawing is
 * what stands on the floor under it, in neon tubes: the marquee's bulbs (what waits), a ring (what is looked for or what
 * failed), the horizon's tube in two halves (what is cut), the lock on a shutter. Pink acts (the acting stroke), cyan
 * reads, red is a tube that failed; the floor's lines close on a point, nothing else runs diagonal. In a 120 by 72 box.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
const HORIZON = {
    // The marquee with its bulbs unlit, the floor closing on the horizon under it.
    none: [
        ['ink', 'M26 14h6'],
        ['ink', 'M42 14h6'],
        ['ink', 'M58 14h6'],
        ['ink', 'M74 14h6'],
        ['ink', 'M90 14h6'],
        ['rule', 'M10 30h100'],
        ['line', 'M60 30l-40 34'],
        ['line', 'M60 30l-20 34'],
        ['line', 'M60 30v34'],
        ['line', 'M60 30l20 34'],
        ['line', 'M60 30l40 34'],
        ['line', 'M18 42h84'],
        ['line', 'M8 56h104'],
    ],
    // A neon ring held over the floor with a laser laid under it: it holds nothing.
    nomatch: [
        ['ink', 'M72 24a12 12 0 1 0-24 0a12 12 0 1 0 24 0'],
        ['line', 'M56 24h8'],
        ['rule', 'M12 44h96'],
        ['line', 'M18 54h84'],
        ['line', 'M8 64h104'],
    ],
    // A red neon ring with its bar across it: the tube that failed, the floor still under it.
    error: [
        ['red', 'M72 24a12 12 0 1 0-24 0a12 12 0 1 0 24 0'],
        ['red', 'M54 24h12'],
        ['rule', 'M12 44h96'],
        ['line', 'M18 54h84'],
        ['line', 'M8 64h104'],
    ],
    // The horizon tube in two halves, each ending in a plug that meets no socket.
    offline: [
        ['rule', 'M10 30h38'],
        ['ink', 'M48 22v16'],
        ['ink', 'M72 22v16'],
        ['rule', 'M72 30h38'],
        ['line', 'M52 30h4'],
        ['line', 'M64 30h4'],
        ['line', 'M18 46h84'],
        ['line', 'M8 58h104'],
    ],
    // Every bulb of the marquee lit, the horizon closed under them.
    done: [
        ['rule', 'M24 14h8'],
        ['rule', 'M40 14h8'],
        ['rule', 'M56 14h8'],
        ['rule', 'M72 14h8'],
        ['rule', 'M88 14h8'],
        ['ink', 'M10 30h100'],
        ['line', 'M18 42h84'],
        ['line', 'M8 56h104'],
    ],
    // The shutter down: slats, a lock strung on the lowest one.
    locked: [
        ['ink', 'M32 8h56'],
        ['ink', 'M32 16h56'],
        ['ink', 'M32 24h56'],
        ['ink', 'M32 32h56'],
        ['ink', 'M54 40v-3a6 6 0 0 1 12 0v3'],
        ['rule', 'M52 40h16v12H52z'],
        ['line', 'M18 62h84'],
    ],
};

/** Every set the package has, by the name a register shows. @type {Record<string, Record<ArtKind, ArtStroke[]>>} */
export const ART_SETS = {
    ledger: LEDGER,
    spectrum: SPECTRUM,
    hud: HUD,
    horizon: HORIZON,
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
