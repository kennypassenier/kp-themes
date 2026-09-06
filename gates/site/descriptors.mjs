// What a documentation page says, and where each part comes from [AR19].
//
// One descriptor per documented unit. The shape is pinned here because
// roughly 45 pages depend on it and changing it later touches all of
// them.
//
// A descriptor holds only what no machine can extract:
//
//   id            the page's file name and its anchor in the navigation
//   title         what the unit is called
//   group         which navigation section it sits under
//   intro         one paragraph: what it is
//   whenToUse     one paragraph: when to reach for it, and when not
//   classes       the `kp-` class families this page documents; the
//                 coverage gate reads them, so every family in
//                 css/components.css belongs to exactly one page
//   exports       the React exports this page documents, likewise
//   examples      each { title, why, markup, react? } -- `markup` is
//                 framework-free HTML, rendered live AND printed as the
//                 snippet from the same string, so the two cannot
//                 diverge (AR19)
//   variants      each { name, what } -- every variant and state
//   accessibility bullets: what the package does, and what the consumer
//                 still has to do
//
// Everything else on the page is extracted from the sources: the props
// table from the `@typedef` blocks, the events from the `*_EVENT`
// constants, the knobs from `css/components.css`, the attributes from
// `js/`. A descriptor MAY NOT restate any of those -- gates/check-site.mjs
// refuses it, so a rename cannot leave a table behind (AR21).

/**
 * @typedef {{ title: string, why: string, markup: string, react?: string }} Example
 * @typedef {{ name: string, what: string }} Variant
 * @typedef {{
 *   id: string,
 *   title: string,
 *   group: string,
 *   intro: string,
 *   whenToUse: string,
 *   classes: string[],
 *   exports: string[],
 *   examples: Example[],
 *   variants: Variant[],
 *   accessibility: string[],
 * }} Descriptor
 */

/** The navigation sections, in order. */
export const GROUPS = ['Getting started', 'Layout', 'Forms', 'Data', 'Feedback', 'Navigation', 'Structure'];

/** @type {Descriptor[]} */
export const DESCRIPTORS = [];
