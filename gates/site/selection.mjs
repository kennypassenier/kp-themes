// Which extracted rows belong to which page [AR21].
//
// The four extractors know what exists; they do not know which page it
// belongs on. That mapping is here, once, because the generator and the
// coverage gate have to agree about it — if they disagreed, the gate
// could say an attribute is documented while no page printed it.
//
// The rule is the name itself. A page's **slugs** are its class families
// with the `kp-` prefix removed, plus whatever `aliases` the descriptor
// adds for names that do not follow from a class — `kp-color-change` is
// fired by the colour picker, whose class family is `kp-colorpicker`, and
// no rule derives one from the other.
//
//   events      `kp-<slug>` or `kp-<slug>-…`
//   attributes  `data-kp-<slug>` or `data-kp-<slug>-…`
//   knobs       the family the knob extractor recorded, which is the
//               first dash-separated segment of the class it was read on
//               (`.kp-cell-truncate` → `cell`), so the slugs are cut the
//               same way before they are compared
//
// A prefix has to end on a dash boundary: `date` claims `data-kp-date-value`
// and not `data-kp-datepicker`, which is the difference between a page
// that documents its own attributes and one that documents its
// neighbour's.
//
// **Two names can claim the same attribute, and the first cut got that
// wrong.** `data-kp-max-bytes` is the upload's, and the date picker
// claims `max` as well; `data-kp-step-label` is the wizard's, and the
// grid and the split pane both read `data-kp-step`. So a claim is
// resolved rather than merely tested:
//
//   1. the longest matching slug wins — `max-bytes` beats `max`;
//   2. on equal length an alias beats a slug taken from a class name,
//      because an alias is somebody saying "this name is mine" and a
//      class slug is derived. That is what keeps `data-kp-swatch`, which
//      the colour picker reads, off the theme switcher's page, whose
//      `.kp-swatch` is a different thing with the same word in it;
//   3. what is still tied is genuinely shared — three modules do read
//      `data-kp-locale` — and lands on every page that claimed it.

/** @typedef {import('./descriptors.mjs').Descriptor} Descriptor */

/**
 * What owning a name actually takes: an id and the names it answers to.
 * A component page is one of these; so is the layout page, which is
 * generated from docs/LAYOUT.md and has no descriptor.
 *
 * @typedef {{ id: string, classes: string[], aliases?: string[] }} Page
 */

/**
 * The names a page answers to, each with whether it was declared
 * (an alias) or derived (a class family).
 *
 * @param {Page} descriptor
 * @returns {{ slug: string, alias: boolean }[]}
 */
export function slugsOf(descriptor) {
    return [
        ...descriptor.classes.map((c) => ({ slug: c.replace(/^kp-/, ''), alias: false })),
        ...(descriptor.aliases ?? []).map((slug) => ({ slug, alias: true })),
    ];
}

/**
 * `rest` is `slug`, or begins with `slug` and a dash.
 *
 * @param {string} rest
 * @param {string} slug
 */
function claims(rest, slug) {
    return rest === slug || rest.startsWith(`${slug}-`);
}

/**
 * Which pages own which name, by the three rules above.
 *
 * @param {{ name: string }[]} rows what the extractor found
 * @param {Page[]} descriptors every page
 * @param {RegExp} prefix what to strip before matching
 * @returns {Map<string, Set<string>>} name → the ids of the pages that own it
 */
export function owners(rows, descriptors, prefix) {
    /** @type {Map<string, Set<string>>} */
    const out = new Map();
    for (const row of rows) {
        const rest = row.name.replace(prefix, '');
        /** @type {{ id: string, length: number, alias: boolean }[]} */
        const claimed = [];
        for (const descriptor of descriptors) {
            for (const { slug, alias } of slugsOf(descriptor)) {
                if (claims(rest, slug)) claimed.push({ id: descriptor.id, length: slug.length, alias });
            }
        }
        if (claimed.length === 0) continue;
        const longest = Math.max(...claimed.map((c) => c.length));
        let winners = claimed.filter((c) => c.length === longest);
        if (winners.some((c) => c.alias)) winners = winners.filter((c) => c.alias);
        out.set(
            row.name,
            new Set(winners.map((c) => c.id)),
        );
    }
    return out;
}

/**
 * @param {{ name: string }[]} events every exported event
 * @param {Page[]} descriptors
 */
export function eventOwners(events, descriptors) {
    return owners(events, descriptors, /^kp-/);
}

/**
 * @param {{ name: string }[]} attributes every `data-kp-*` the modules read
 * @param {Page[]} descriptors
 */
export function attributeOwners(attributes, descriptors) {
    return owners(attributes, descriptors, /^data-kp-/);
}

/**
 * @template {{ name: string }} T
 * @param {T[]} rows
 * @param {Map<string, Set<string>>} owned
 * @param {Descriptor} descriptor
 * @returns {T[]}
 */
export function rowsOf(rows, owned, descriptor) {
    return rows.filter((row) => owned.get(row.name)?.has(descriptor.id) === true);
}

/**
 * Knobs need no arbitration: the extractor already reduced the class it
 * was read on to a family, and a knob read in several families is read in
 * several families.
 *
 * @template {{ families: string[] }} T
 * @param {T[]} knobs every `--kp-*` the stylesheet reads
 * @param {Descriptor} descriptor
 * @returns {T[]}
 */
export function knobsOf(knobs, descriptor) {
    const families = new Set(slugsOf(descriptor).map(({ slug }) => slug.split('-')[0]));
    return knobs.filter((k) => k.families.some((family) => families.has(family)));
}
