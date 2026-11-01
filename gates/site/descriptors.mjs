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
//   aliases       names this page also answers to, for events and
//                 attributes whose name does not follow from a class:
//                 `kp-color-change` is the colour picker's, whose family
//                 is `kp-colorpicker`. gates/site/selection.mjs states
//                 the rule; the coverage gate holds every attribute to it
//   examples      each { title, why, markup } -- `markup` is
//                 framework-free HTML, rendered live AND printed as the
//                 snippet from the same string, so the two cannot
//                 diverge (AR19). `script` is the page's own part, run live
//                 and printed below it, for a component that waits for data.
//                 `frame: true` (or `{ height, width }`) renders
//                 it in an iframe window of its own, for a launcher or a
//                 panel fixed to the window's edge
//   variants      each { name, what } -- every variant and state
//   accessibility bullets: what the package does, and what the consumer
//                 still has to do
//
// Everything else on the page is extracted from the sources: the props
// table from the `@typedef` blocks, the events from the `*_EVENT`
// constants, the knobs from `css/components.css`, the attributes from
// `js/`. A descriptor MAY NOT restate any of those -- gates/check-site.mjs
// refuses it, so a rename cannot leave a table behind (AR21).
//
// Each descriptor lives in its own file under ./descriptors/ (one per page, named
// after its id); this module only fixes the order the pages appear in.


import { DESCRIPTORS_1 } from './descriptors/registry-1.mjs';
import { DESCRIPTORS_2 } from './descriptors/registry-2.mjs';
/** @typedef {import('./descriptors/types.mjs').Descriptor} Descriptor */
/** @typedef {import('./descriptors/types.mjs').Example} Example */
/** @typedef {import('./descriptors/types.mjs').Variant} Variant */

/** The navigation sections, in order. */
export const GROUPS = ['Getting started', 'Theming', 'Layout', 'Forms', 'Data', 'Feedback', 'Navigation', 'Content', 'Structure'];

/** @type {Descriptor[]} */
export const DESCRIPTORS = [...DESCRIPTORS_1, ...DESCRIPTORS_2];
