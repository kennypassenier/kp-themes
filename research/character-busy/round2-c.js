// research/character-busy round 2, group c (Kenny, 2026-10-06 22:30: "wat
// evalueren we bij shape? ik zie enkel dezelfde vorm en dezelfde loading
// screen?"): round 1's three shapes per theme differed by 0-4 % of their
// pixels (shade-dark 0 %) because every option kept the same rectangular
// plate and only swapped a background tint. These three per theme change
// the overlay's silhouette itself — the panel's outline, its frame, and
// where the veil and the words sit — so the three read apart at a glance.
// Loading, arrival, failure and phone are untouched; busy-a..d.css already
// style them for every theme and still apply on top of any shape.
//
// Each option's text names the approved pick it echoes (from
// research/THEME_PROFILES.md's decided picks for this theme's other
// components) and says in one sentence what sets it apart from the other
// two in this trio.

/** @typedef {{ key: string, name: string, text: string }} Option */

export default {
    deco: {
        shape: /** @type {Option[]} */ ([
            {
                key: 'r2-dc-shape-1',
                name: 'The colonnade',
                text: 'Echoes the columns character’s shape pick, the colonnade: a thick gold pilaster sits flush against each side of the panel, square corners, no other frame. The other two keep the panel’s outline rectangular and plain; this one reads as a plate set between two columns.',
            },
            {
                key: 'r2-dc-shape-2',
                name: 'The lobby floor indicator',
                text: 'Echoes the meter character’s shape pick of the same name: the panel is a gold-rimmed pill, a row of small lit lamps along its top edge. The other two keep square corners; this is the only one with a fully rounded silhouette.',
            },
            {
                key: 'r2-dc-shape-3',
                name: 'The gilt calendar',
                text: 'Echoes the calendar character’s shape pick of the same name: a plain rectangular plate capped by a gridded gold header band, as a calendar’s month strip. The other two change the panel’s whole outline; this one keeps a square plate and only caps it.',
            },
        ]),
    },
    phantom: {
        shape: /** @type {Option[]} */ ([
            {
                key: 'r2-ph-shape-1',
                name: 'The redacted dossier',
                text: 'Echoes the columns character’s shape pick, the redacted dossier: a level, square-cornered plate with thick ink bars across its top, as blacked-out lines. The other two cut the panel’s own outline; this one stays a plain rectangle and only marks its face.',
            },
            {
                key: 'r2-ph-shape-2',
                name: 'Stamped tags and string',
                text: 'Echoes the graph character’s shape pick of the same name: the panel’s inline-start edge is cut to a tag’s point, a small ring punched near its corner for the string. The other two keep a straight-sided rectangle; this is the only one shaped like a tag.',
            },
            {
                key: 'r2-ph-shape-3',
                name: 'The torn ticket',
                text: 'Echoes the calendar character’s shape pick, the torn ticket: a rectangle with one corner clipped off and a perforated dashed line run down near its inline-start edge, as a stub torn free. The other two are not perforated; this is the only one with a torn-off corner.',
            },
        ]),
    },
    'shade-light': {
        shape: /** @type {Option[]} */ ([
            {
                key: 'r2-sl-shape-1',
                name: 'The parasol',
                text: 'Echoes the chart character’s shape pick, the parasol: the panel’s top corners round out into a dome, a soft wash of light pooling under it. The other two keep a flat top edge; this is the only one with a domed silhouette.',
            },
            {
                key: 'r2-sl-shape-2',
                name: 'Embossed paper',
                text: 'Echoes the columns character’s shape pick of the same name: a plain rectangular plate with no visible border, its edge pressed in as a soft emboss rather than drawn with a line. The other two carry a dome or a cut corner; this one is the flattest, plainest outline of the three.',
            },
            {
                key: 'r2-sl-shape-3',
                name: 'The paper lantern',
                text: 'Echoes the graph character’s shape pick of the same name: the panel’s whole outline is cut to a hexagon, a warm glow sitting at its centre. The other two keep four-sided plates; this is the only one with a faceted silhouette.',
            },
        ]),
    },
    'shade-dark': {
        shape: /** @type {Option[]} */ ([
            {
                key: 'r2-sd-shape-1',
                name: 'The reading lamp',
                text: 'Echoes the chart character’s shape pick of the same name: the panel’s top corners dome out, a warm pool of light gathering under the curve. The other two keep a flat top; this is the only domed silhouette here.',
            },
            {
                key: 'r2-sd-shape-2',
                name: 'The velvet tray',
                text: 'Echoes the columns character’s shape pick of the same name: all four corners round out generously, a soft padded lip sitting inside the plate’s edge. The other two keep square or domed-top corners; this is the only one fully rounded.',
            },
            {
                key: 'r2-sd-shape-3',
                name: 'The night window',
                text: 'Echoes the menu character’s shape pick, the night window: a square plain plate, a faint cross of mullion lines dividing its face into four panes. The other two change the plate’s outline; this one keeps a plain rectangle and only marks what is behind the words.',
            },
        ]),
    },
    retro: {
        shape: /** @type {Option[]} */ ([
            {
                key: 'r2-rt-shape-1',
                name: 'The floppy label',
                text: 'Echoes the calendar character’s shape pick of the same name: the raised-bevel plate from the 1995 dialog, its top-right corner cut off as a floppy disk’s shutter notch. The other two keep every corner square; this is the only one with a cut corner.',
            },
            {
                key: 'r2-rt-shape-2',
                name: 'The 1995 network diagram',
                text: 'Echoes the graph character’s shape pick of the same name, "marching ants": the whole plate is ringed in a dashed selection outline instead of a solid frame, no bevel. The other two carry a solid or divided frame; this is the only dashed one.',
            },
            {
                key: 'r2-rt-shape-3',
                name: 'The status bar',
                text: 'Echoes the trend and columns characters’ shape picks, the title bar and the status bar: a plain solid-framed plate, parted into three cells by two vertical divider rules, as a Windows status bar. The other two are undivided; this is the only segmented one.',
            },
        ]),
    },
};
