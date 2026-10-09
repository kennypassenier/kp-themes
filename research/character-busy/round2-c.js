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
};
