/* research/character-drawer, round 2 (Kenny, 2026-10-06 20:45): the new
   options of group a (light, terminal). Keys are namespaced `r2-<theme>-
   <aspect>-<n>`; the CSS answering them is in round2-a.css. */

/** @typedef {{ key: string, name: string, text: string }} Option */

export default {
    light: {
        openclose: /** @type {Option[]} */ ([
            {
                key: 'r2-light-oc-1',
                name: 'Sunrise',
                text: 'The panel rises straight up from the bottom edge, warming from a slightly dim morning grey to full daylight brightness as it arrives — a vertical climb, not a slide, echoing the trend tile’s "Sunrise" arrival and the chart’s "Morning rising". Closing cools and sinks back down the same way, reversed.',
            },
            {
                key: 'r2-light-oc-2',
                name: 'The shadow swings',
                text: 'The panel swings in from the end edge on a pivot at its far bottom corner, tilting a few degrees off true and easing past level before settling flat — an arc, not a straight line, echoing the meter’s and chart’s "The shadow swings" pick (a sundial shadow sweeping into place). Closing swings it back out on the same pivot, reversed.',
            },
            {
                key: 'r2-light-oc-3',
                name: 'Out of the glare',
                text: 'The panel comes into focus where it stands at the end edge, out of a blurred, too bright glare, 700 ms on a long settle; it never slides or grows. Closing is the same pair played the other way, back into the glare.',
            },
        ]),
    },
    terminal: {
        shape: /** @type {Option[]} */ ([
            {
                key: 'r2-term-shape-1',
                name: 'The top(1) row',
                text: 'A plain black panel, bright green border; the head is a proper reverse-video bar (bright green fill, near-black text) with the description explicitly set to that same near-black ink, not left on the default muted green that round 1 silently painted over its own bar — the actual fault behind "too dark or unreadable". Echoes the trend tile’s and menu’s "The top(1) row" pick. The body keeps faint scanlines, the foot a dashed rule.',
            },
            {
                key: 'r2-term-shape-2',
                name: 'The box-drawing map',
                text: 'No fill ever swaps: background and text stay the theme’s plain black-on-green throughout, head and foot divided from the body by a double rule (═), like ASCII box-drawing — echoing the graph’s "The box-drawing map". Guaranteed readable because no part of the panel ever inverts.',
            },
            {
                key: 'r2-term-shape-3',
                name: 'The hex dump',
                text: 'A plain black-on-green panel with a thin address-column rule down the inline-start edge of head, body and foot, like a hex dump’s offset column — echoing the calendar’s "The hex dump" pick. The head’s only accent is a bright green rule under it (no fill swap), the foot a dotted rule; text never sits on anything but the plain background.',
            },
        ]),
    },
};
