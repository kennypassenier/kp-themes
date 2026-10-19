// Tests for the four machine sources [AR21, AR26, TH100].
//
// They run against the real files rather than fixtures: an extractor's
// whole job is to agree with this repository, and a fixture would let it
// agree with a copy of the repository instead. The numbers asserted are
// floors and relations, not the counts of the day, so adding a component
// does not turn a green suite red for no reason — except where the exact
// number IS the claim (the 24 stories, the one unread knob).
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { documentedDefault, extractProps, parseMembers, valueExports } from './extract-props.mjs';
import { datasetKeyToAttribute, extractAttributes } from './extract-attributes.mjs';
import { extractEvents } from './extract-events.mjs';
import { extractKnobs, familyOf } from './extract-knobs.mjs';
import { destructuredDefaults, extractDefaults, literal } from './extract-defaults.mjs';
import { matchingBracket, stripComments } from './source.mjs';

test('the comment stripper keeps code after a // line containing /*', () => {
    // Live-found, standing rule 8: js/upload.js documents its markup in a
    // line comment holding `accept="image/*"`, and a regex that removed
    // block comments first swallowed the next sixty lines — including
    // `const UPLOAD = '[data-kp-upload]'`. The attribute vanished from the
    // extraction and the totals still looked plausible.
    const source = '// <input accept="image/*" />\nconst UPLOAD = \'[data-kp-upload]\';\n';
    assert.match(stripComments(source), /const UPLOAD = '\[data-kp-upload\]';/);
    assert.equal(stripComments('a /* b */ c'), 'a  c');
    assert.equal(matchingBracket('f({ a: { b: 1 } })', 2), 16);
});

test('AR21: props come from the generated declarations, with their doc and optionality', () => {
    const members = parseMembers(
        '\n    /**\n     * Between the label and the text. Default ": ".\n     */\n    separator?: string;\n    label: number;\n',
    );
    assert.deepEqual(members, [
        {
            name: 'separator',
            optional: true,
            type: 'string',
            description: 'Between the label and the text. Default ": ".',
            documentedDefault: '": "',
        },
        { name: 'label', optional: false, type: 'number', description: '', documentedDefault: null },
    ]);
    assert.equal(documentedDefault("Default: the dictionary's `close`."), null);
    assert.equal(documentedDefault('Default true.'), 'true');
});

test('AR21: a declaration file yields its default and its named value exports', () => {
    const source = [
        'export type WidgetProps = {',
        '    a?: string;',
        '};',
        'declare const Widget: import("react").ForwardRefExoticComponent<WidgetProps>;',
        'export default Widget;',
        '',
    ].join('\n');
    assert.deepEqual(valueExports(source), [
        { name: 'Widget', exported: 'default', form: 'const', type: 'import("react").ForwardRefExoticComponent<WidgetProps>' },
    ]);
});

test('AR21: every component in components/ maps to its XProps', () => {
    const result = extractProps();
    const alert = result.components.find((c) => c.name === 'Alert');
    assert.ok(alert, 'Alert is not among the mapped components');
    assert.equal(alert.propsType, 'AlertProps');
    assert.equal(alert.module, 'components/alert.jsx');
    assert.ok(alert.props.some((p) => p.name === 'flavour' && p.optional));
    assert.ok(result.components.length >= 33, `only ${result.components.length} components mapped`);
    assert.ok(result.found.props > 400, `only ${result.found.props} props`);
    assert.deepEqual(result.orphanTypes, [], 'a props type belongs to no exported component');
});

test('AR26: an export that cannot be mapped is reported, never skipped', () => {
    const result = extractProps();
    // The mapping rule is `X` -> `XProps`. Spinner's props are inline, so
    // it does not meet the rule; saying nothing would leave a component
    // undocumented while the count still added up.
    const spinner = result.unmapped.find((u) => u.name === 'Spinner');
    assert.ok(spinner, 'Spinner is neither mapped nor reported');
    assert.match(spinner.why, /no type SpinnerProps/);
    assert.ok(spinner.props.some((p) => p.name === 'label'));
    assert.ok(result.unmapped.some((u) => u.name === 'pageRange' && /not a component/.test(u.why)));
    assert.equal(result.expected.exports, result.components.length + result.unmapped.length);
});

test('AR21: the framework-free channel’s attributes, by the role they play', () => {
    const result = extractAttributes();
    assert.equal(datasetKeyToAttribute('kpMaxTags'), 'data-kp-max-tags');
    const byName = new Map(result.attributes.map((a) => [a.name, a]));

    const dialog = byName.get('data-kp-dialog');
    assert.ok(dialog?.roles.includes('selector'), 'data-kp-dialog is the hook the dialog module attaches to');

    // Read through `flag('kpMaxTags')`, never as a literal attribute name.
    const maxTags = byName.get('data-kp-max-tags');
    assert.ok(maxTags?.roles.includes('read'), 'data-kp-max-tags is a prop of the framework-free combobox');
    assert.deepEqual(maxTags?.families, ['combobox']);

    const armed = byName.get('data-kp-armed');
    assert.ok(armed?.roles.includes('written'), 'data-kp-armed is state the module writes');

    assert.equal(result.expected, result.attributes.length);
    assert.ok(result.attributes.filter((a) => a.roles.includes('read')).length >= 83, 'the critic counted 83 the consumer can set');
});

test('AR21: every event constant is collected, with the module that exports it', () => {
    const result = extractEvents();
    const tab = result.events.find((e) => e.constant === 'TAB_CHANGE_EVENT');
    assert.equal(tab?.name, 'kp-tab-change');
    assert.equal(tab?.module, 'js/overlays.js');
    assert.match(tab?.description ?? '', /Dispatched on a tab list/);
    assert.equal(tab?.detail, '{ index, tab, panel, previous }');
    assert.ok(result.events.some((e) => e.constant === 'COMMIT_EVENT' && e.module === 'js/patterns.js'));
    assert.ok(result.events.some((e) => e.constant === 'COPY_EVENT'));

    // AR26: the expectation is counted from the sources first, so a
    // collector that quietly dropped one fails here.
    assert.equal(result.events.length, result.expected);
    assert.deepEqual(result.mismatched, []);
    assert.ok(result.events.length >= 40, `only ${result.events.length} events`);
    assert.ok(
        result.events.every((e) => e.dispatches > 0),
        'an exported event constant nothing dispatches',
    );
});

test('AR21: the knobs, their fallbacks and the families that read them', () => {
    const result = extractKnobs();
    assert.equal(familyOf('.kp-datatable[data-kp-cards] .kp-table thead'), 'datatable');
    assert.equal(familyOf('[data-kp-theme-picker] li'), 'theme');

    const height = result.knobs.find((k) => k.name === '--kp-control-height');
    assert.deepEqual(height?.defaults, ['2.25rem']);
    assert.ok(height?.families.includes('button') && height.families.includes('field'));

    // M1 (2026-09-08) added two: the marquee's duration and the gap
    // between its items, both declared on the row itself so a consumer
    // overrides one and keeps the theme's value for the other. Its third
    // knob, the rest-while-off-screen answer, is read by js/effects.js
    // rather than by any rule, so it is not declared here.
    // ask-1 (2026-09-10) added one: --kp-badge-wrap, the way out of the
    // overflow floor for the one of its five components whose content is
    // usually a label rather than a value.
    // gap-11 (2026-09-13) added seven, one per repaired component: the date
    // picker's input floor, the disabled opacity fields, menu items and
    // combobox options share, the invalid radio group's outline offset, the
    // combobox's gap now that it is not a flex column, the dialog's maximum
    // height, the indeterminate progress stripe and the data table bar's
    // padding.
    // The switch (gap-11, approved 2026-09-13) added nine, the concept's
    // geometry on knobs; gap-13 the same day added four to the data table and
    // took one away (--kp-table-cell-pad, which nothing else read); gap-12
    // added four (the back-to-top glyph, the overhang above a scrolling tab
    // row, the tree's selected wash and bar); the nostromo notes (scope-60)
    // added the dialog close button's size and held-60 the room inside the
    // wizard's frame (--kp-wizard-padding): 123 + 9 + 3 + 4 + 1 + 1.
    // Kenny's second nostromo pass (2026-09-13) added two, the toast
    // button's hover veil and the ink that veil is judged from
    // (--kp-toast-button-hover, --kp-toast-button-ink): 141 + 2.
    // Kenny's review notes of the same day split the data table bar's one
    // shorthand knob into its block and inline halves
    // (--kp-datatable-bar-padding-block, --kp-datatable-bar-padding-inline):
    // 143 - 1 + 2.
    // The data table's seven features of the same day ("Alle zeven, nu")
    // added eleven: the sort order ring's radius and size, the expand
    // button's width and the detail row's block padding, the fixed column's
    // offset, ground, hairline and hairline width, and the edit button's
    // underline, pencil and editor floor: 144 + 11.
    // The add-filter mode of 2026-09-14 ("Allebei, per tabel") added twelve:
    // the filter editor's ground, ink, border, border width, radius, padding,
    // gap, maximum width and title weight, the floors under a choice and a
    // bound, and the gap before a filtered column's mark: 155 + 12.
    // The palette as navigation (scope-48) added the minimum width of the
    // bar's search trigger, --kp-nav-search-min, and the app shell moved the
    // bar's layer into the base, --kp-z-nav, which eleven registers had each
    // read on their own: 167 + 2.
    // Option E of research/uniform-size/ (scope-80) put the control and row
    // heights in the package and added four: the one-line boxes' line
    // height, the running text's (read by the multi-line field), the table
    // row's height and the button's block padding: 169 + 4.
    // The shrinking header (scope-48 wave 2) added four: the compact bar's
    // block padding and how long it glides (--kp-nav-sticky-shrink,
    // --kp-nav-sticky-duration), the bar's measured height the module writes
    // (--kp-nav-sticky-height), and the page's own --kp-scroll-offset, which
    // the sticky root's scroll padding reads first: 173 + 4.
    // The mega menu (scope-48, wave 2) added four more: the panel's minimum
    // column width and column gap, and the two offsets js/components.js
    // writes to line the panel up with the bar's edges
    // (--kp-nav-mega-start, --kp-nav-mega-end): 177 + 4.
    // Both additions together, as measured after the merge: 173 + 4 + 4 = 181.
    // sticky-shrink (scope-85) added one: --kp-nav-pad-scale, the factor
    // every bar multiplies its block padding by, which the compact state
    // sets from --kp-nav-sticky-shrink: 181 + 1.
    // Option B of research/uniform-size/ (scope-87) put the type sizes of
    // titles, labels, tabs, badges and navigation in the package and added
    // eighteen: the heading line height; the card, dialog and footer title
    // sizes; the help text's size; the badge's size, line height and block
    // padding; the tab's size and block padding; the bar link's, the menu
    // link's and the side-navigation link's size and block padding; the
    // breadcrumb's and the pagination's size: 182 + 18.
    // scope-88 added two, the field error's and the side navigation title's
    // size (--kp-field-error-size, --kp-sidenav-title-size): 200 + 2.
    // fix-32 added one, --kp-datatable-head-reach, the shadow that carries a
    // sticky header's ground 2px above it, which a register drawing its own
    // shadow on the header adds to its list: 202 + 1.
    // Kenny's surfaces note of 2026-09-15 added one,
    // --kp-surface-padding-inline, the room between a surface's ground and
    // its content; the alignment beside it is an attribute
    // (data-kp-surface-align), not a property: 203 + 1.
    // The alarm (scope-94) added twenty-three: the plate, the ink, the soft
    // line, the split, the ink's own words, the glow, the halo, the scanlines,
    // the vignette, the stripes and the bars' height, the frame; the
    // headline's font, size, case and tracking; the panel's ground, border,
    // shadow, padding and radius; and the two shares of the time left that
    // js/alarm.js writes (--kp-alarm-left, --kp-alarm-left-step): 204 + 23.
    // fix-41 added one, --kp-nav-menu-shift: how far a bar's dropdown or
    // mega panel slides along the inline axis to stay inside the box that
    // shows it. js/components.js writes it, the way it writes the two mega
    // offsets beside it: 227 + 1.
    //
    // fix-64 added one, --kp-progress-group-gap: the row gap between the
    // bars of a progress group, whose column gap is the package's own
    // --kp-space-sm and needs no knob: 228 + 1.
    //
    // gap-14 added four with the log: --kp-log-gap, --kp-log-padding,
    // --kp-log-line-height and --kp-text-sm read on the list itself: 229 + 4.
    // fix-70 added one, --kp-log-level-ink: the quiet severity word's
    // colour, which fifteen registers used to set on .kp-log__level
    // itself and so took the plate ink of a warning with it: 233 + 1.
    // Kenny's submenu mark added three (2026-09-20): the mark itself, where
    // it sits in the indent, and its ink — 234 + 3.
    // fix-78 added one (2026-09-29), --kp-picker-max-width, the select's
    // open list's inline limit: 237 + 1. fix-82 added --kp-nav-ink, the ink
    // a bar's hover veil is made of: 238 + 1.
    // scope-140 (9.0.0) replaced the native progress bar: --kp-progress-max-width
    // and --kp-progress-stripe left, and the signature bar brought six —
    // --kp-value, --kp-steps, --kp-progressbar-height, -max-width, -duration
    // and -ease: 245 - 2 + 6.
    // scope-142 added one, --kp-resize-dur: how long a box's glide to its
    // new height lasts, which js/motion.js writes and the transitions that
    // fade a theme's character read: 249 + 1.
    // scope-143 (the dashboard components) added nineteen: the action
    // columns' five (--kp-action-col, -count, -gap, -stack, -widths), the
    // attention band's two tones, the tiles' three (--kp-tile-min,
    // --kp-tiles-gap, --kp-tile-title-size), the KPI strip's five
    // (--kp-kpi-min, --kp-kpis-gap, --kp-kpi-spark-height, -value-size,
    // -meter-fill), the chart's three (--kp-chart-series, -tone, -tip-x)
    // and the busy panel's --kp-busy-overlay-spinner-narrow: 250 + 19.
    // The homelab port (scope-143, 2026-10-04) added seven: the tile set's
    // --kp-tile-row-min, the freshness line's stale plate (--kp-ago-stale-bg,
    // -fg, -edge), the attention band's --kp-attention-tint and the data
    // table's group row (--kp-datatable-group-ground, -weight): 269 + 7.
    // Round two of the port (2026-10-05) added twenty-seven: the meter's six
    // (--kp-meter-height, -fill, -mark-colour, -mark-overhang, -halo,
    // -inline-size), the trend tile's --kp-kpi-trend-lines, the month heatmap's five
    // (--kp-calendar-aside, -gap, -cell-height, -cell-font, -title-size),
    // the graph's three (--kp-graph-h, -label-size, -dim), the rich menu's
    // three (--kp-menu-rich-min, -rich-max, -max-height) and the drawer,
    // help and tour's (--kp-drawer-width, --kp-help-term, --kp-tour-width):
    // 280 + 27. The deco review round (2026-10-05) added three more
    // (the meter's over signs and the tile set's easing): 307 + 3. The
    // motion-symmetry round (2026-10-05) added --kp-sidenav-ease-back, the
    // theme's curve turned around that js/sidenav.js writes for a rail
    // that collapses, a panel that closes and a group that folds: 310 + 1.
    // The menu's opaque loading plate sets --kp-busy-opacity itself (2026-10-05): 311 + 1.
    // fix-97 added --kp-chart-delta-width, the floor of the tooltip's change column: 312 + 1.
    // fix-98 added --kp-calendar-nav-fit, the width below which the month heatmap's
    // title takes a row of its own: 313 + 1.
    // fix-99 added --kp-kpi-trend-label-lines and its correction took it out
    // again (a label is one line; the tile grows to it): 314.
    // fix-101 added --kp-kpi-border, the frame of a tile in a strip with
    // columns, set by the two registers whose --border-strong is under 3:1: 314 + 1.
    // The progress bar's three sizes (2026-10-05) added three: the scale every
    // register multiplies its bar by (--kp-progressbar-scale), the reading's
    // size beside it (--kp-progressbar-text) and the group's gaps
    // (--kp-progress-group-scale): 315 + 3.
    // The skeleton circle's width, --kp-skeleton-circle (2026-10-07): 318 + 1.
    // Cyberpunk's tour close reads three tokens (--kp-tour-dim-time, --kp-tour-dim-close-ease, --kp-tour-dim-close-delay): 323 + 3.
    // The tree row's inset, --kp-tree-inset (2026-10-12): 326 + 1.
    // The side navigation at the window's edge (2026-10-13): the launcher's inset and size, the
    // push's timing js/sidenav.js copies onto the content (--kp-sidenav-shift-duration, -ease, -delay), the
    // floating parts' place (--kp-sidenav-float-x, -y), the flyout's floor and indent (--kp-sidenav-flyout-min,
    // -indent) and the edge tab's size (--kp-sidenav-tab-thickness, -length): 11 more, on a main that already
    // read 328 (one knob arrived after the tree row's without a line here): 328 + 11.
    // The side navigation's minor options (2026-10-14): the width on a narrow screen (--kp-sidenav-width-narrow): 339 + 1.
    // The floating variant's ten: its gap, its derived gaps and room (--kp-sidenav-float, -lead, -room, -away-to-start,
    // -away-to-end) and the five knobs a theme or page sets (--kp-sidenav-float-inset, -radius, -edge, -shadow, -ink): 340 + 10.
    // The inset variant's four, all read through var(): its gap, the card's own space, radius and edge: 350 + 4.
    // The peek strip's two, --kp-sidenav-peek (the strip's width) and --kp-sidenav-peek-surface, both read through var(): 354 + 2.
    // The action slot's two, its gap and its width, both read through var(): 356 + 2.
    // The resize handle's width, --kp-sidenav-resizer-size (the behaviour options, merged): 358 + 1.
    // Re-pinned 2026-10-18 [gatefaults-1018]: the file had grown to 944 distinct names (the pin stopped at 359 after
    // the sidenav rows). Comment wildcards such as `--kp-seg-*` are no longer counted, so every name is a real knob.
    // Re-pinned 2026-10-18 [release-11-1018]: 11 knobs arrived with the day's merged rounds, all real and read through var():
    // --kp-notices-sizer, the segmented fade (--kp-seg-fade, -start, -end), the shortcuts hint view (--kp-shortcuts-hint-view-height, -top),
    // the shortcuts view (--kp-shortcuts-view-height, -top), the toggle hint (--kp-toggle-hint-gap, -line) and --kp-usual-check-gap: 944 + 11.
    // Re-pinned 2026-10-19 [gap-log-viewer + gap-diff-view-1019]: the log viewer's two knobs (--kp-logviewer-height, -min) and the diff view's five (--kp-diffview-min, -status, -gap, -added-ch, -removed-ch), all read through var(): 955 + 2 + 5.
    // Re-pinned 2026-10-19 [gap-int-1019]: the five component rounds merged into one branch (log viewer 2, diff view 5, tab count, activity feed, entity tiles) and main's 955; recounted with extractKnobs() after the last merge: 978.
    // Re-pinned 2026-10-19 [align-grid-1019]: the second batch (state plates, graph loading pictures, live options), the form
    // grid and the focus tracks landed on main; recounted with extractKnobs(): 1003.
    // Re-pinned 2026-10-19 [round-2-1019]: the four package-fix branches merged (shared line of the package components, calendar and
    // pipeline states, run timeline and uses map, data table); recounted with extractKnobs() after the last merge: 1010.
    // Re-pinned 2026-10-19 [round-3-1019]: the four fix and option branches merged (remind-me, Copy, checklist and timer states, action size, calm freshness, computed sentence field, hover card, wheel, form grid); recounted with extractKnobs(): 1021.
    // Re-pinned 2026-10-19 [round-4-1019]: heat-deplist merged; recounted: 1022.
    // Re-pinned 2026-10-19 [stackbar-refresh-1019]: the share bar's picked ring (--kp-stackbar-picked-ring) and the legend's value track (--kp-stackbar-value-w), both read through var(): 1022 + 2.
    // Re-pinned 2026-10-19 [datatable-r5-1019]: the data table's card label track, card gap and fixed end column (--kp-datatable-card-label, -card-gap, -fixed-end), all read through var(): 1024 + 3.
    // Re-pinned 2026-10-19 [anchors-picker-1019]: --kp-anchor-room and --kp-picker-label-gap: 1029.
    // Re-pinned 2026-10-19 [graph-loading-1019]: the per-theme graph loading knobs (ghost, edge and node animations) left
    // with the pictures Kenny rejected, the form grid fix added and removed some: 1020.
    // Recounted 2026-10-19 [gapmisc-1019]: --kp-touch-target added: 1021.
    // Re-pinned 2026-10-19 [gapviz-1019]: the legend is one subgrid: --kp-stackbar-value-w and --kp-stackbar-legend-min left, --kp-stackbar-legend-columns came: 1021 - 2 = 1019.
    // Re-pinned 2026-10-19 [gapform-1019]: the form grid stage (--kp-formgrid-stage-min, -stage-gap, --kp-formgrid-rows) and the
    // calendar's spread nav (--kp-calendar-nav-spread-fit), all read through var(): 1019 + 4.
    assert.equal(result.expected, 1023, 'AR21 counted the --kp-* properties in css/components.css');
    // Every one of them is read through var(). The single exception used
    // to be --kp-breakpoint-narrow, which a media query cannot read, so
    // its value was repeated in the query [TH26]; R3 replaced that query
    // with a container query and the knob left the stylesheet altogether,
    // taking the exception with it. --kp-cell-truncate-max arrived in the
    // same milestone, which is why the total did not move.
    // R8 added four: the form gap, the field gap and the two halves of a
    // table cell's padding, each a literal put on the spacing scale so
    // the density mode could reach it. --kp-space-lg came with them, as
    // the first use of that step in this stylesheet. R0-TYPO then added
    // Round six (the concept demo's spec sheet) added --kp-mono: the mono
    // sample reads the register's mono face, with monospace as its fallback.
    // six more: the rules that wanted a text size the scale name did not
    // mean got their own knob, so every scale name means one thing. And
    // R3-CQ added --kp-table-wrap-min, the floor under a wrapper that
    // containment collapses.
    // Round five added twenty across three milestones, merged as a sum
    // rather than settled as a choice between three counts.
    // W0 added ten: the size scale's eight (a height, a block padding, an
    // inline padding and a type size for each of the two new steps),
    // --kp-focus-ring-inner-width for the ring .kp-button now composes
    // rather than replaces, and --kp-space-xl, whose first use in this
    // stylesheet is the large button's inline padding [TH111, AR30].
    // W1 added one, --kp-confirm-max-width, on the dialog TH107 opens:
    // one question wants a narrower box than a form.
    // W2 added nine — --kp-tile-x/y/w/h, the grid tile's place, which
    // js/gridlayout.js and components/canvas.jsx used to write as inline
    // `grid-column` and `grid-row` where no rule could ever overrule them
    // [AR31]; and TH104's five, the two wrapper floors plus the nav bar's
    // three padding knobs, which used to be one `clamp(…, 3vw, …)`
    // reading the window rather than its own box.
    // Every one of them is read through var(), all five rounds' included.
    // Option B's eighteen (scope-87), scope-88's two, fix-32's one and the surface's one are read through var() too.
    // So are the alarm's twenty-three (scope-94), fix-41's one,
    // fix-64's --kp-progress-group-gap, the log's four, fix-70's one and
    // the submenu mark's three, fix-78's --kp-picker-max-width and fix-82's
    // --kp-nav-ink.
    // One is declared and not read here, on purpose: --kp-steps is the
    // progress bar contract's segment count (scope-140), declared on the bar
    // so every register that draws segments reads one value; the plain bar
    // the package draws has no segments to count. scope-142's
    // --kp-resize-dur is read through var() too: 248 + 1. So are
    // scope-143's nineteen: 249 + 19. And the homelab port's seven: 268 + 7.
    // And round two's twenty-seven, every one read through var(): 278 + 27.
    // And the deco review round's three: 305 + 3. And the motion-symmetry
    // round's --kp-sidenav-ease-back: 308 + 1. And fix-97's
    // --kp-chart-delta-width: 309 + 1. And fix-98's --kp-calendar-nav-fit: 310 + 1.
    // fix-99's --kp-kpi-trend-label-lines came and went: 311.
    // fix-101's --kp-kpi-border: 311 + 1. The progress bar's three sizes:
    // --kp-progressbar-scale, -text and --kp-progress-group-scale: 312 + 3.
    // The skeleton circle's width knob (2026-10-07): 315 + 1.
    // Cyberpunk's three tour-close tokens are read through var(): 320 + 3.
    // And --kp-tree-inset, read through var(): 323 + 1.
    // The side navigation at the window's edge (2026-10-13): its eleven, every one read through var(), on a main
    // that already read 325: 325 + 11.
    // The floating variant reads eight of its ten through var(); --kp-sidenav-room and -lead are read by js/sidenav.js: 337 + 8.
    // And the inset variant's four, every one read through var(): 345 + 4.
    // And the peek strip's two: 349 + 2.
    // And the action slot's two: 351 + 2.
    // And the resize handle's width, --kp-sidenav-resizer-size, read through var(): 353 + 1.
    // And the 11 of 2026-10-18 [release-11-1018] (see the pin above), every one read through var(): 936 + 11.
    // And the log viewer's two and the diff view's five of 2026-10-19, every one read through var(): 947 + 2 + 5.
    // Recounted 2026-10-19 [gap-int-1019] after merging the five rounds into main's 947, every one read through var(): 970.
    // Recounted 2026-10-19 [align-grid-1019] with the same rounds, every one read through var(): 994.
    // Recounted 2026-10-19 [round-2-1019] after the four package-fix merges, every one read through var(): 1001.
    // Recounted 2026-10-19 [round-3-1019] after the four fix and option merges, every one read through var(): 1012.
    // Recounted 2026-10-19 [round-4-1019]: heat-deplist merged; recounted: 1013.
    // Recounted 2026-10-19 [stackbar-refresh-1019]: the two new stackbar knobs, both read through var(): 1015.
    // Recounted 2026-10-19 [datatable-r5-1019]: the three new data table knobs, all read through var(): 1018.
    // Recounted 2026-10-19 [anchors-picker-1019], both read through var(): 1020.
    // Recounted 2026-10-19 [graph-loading-1019]: 1012.
    // Recounted 2026-10-19 [gapmisc-1019]: --kp-touch-target read through var(): 1013.
    // Recounted 2026-10-19 [gapviz-1019]: the same three stackbar knobs, read through var(): 1013 - 2 = 1011.
    // Recounted 2026-10-19 [gapform-1019]: the form grid stage's three knobs and the calendar's spread fit: 1011 + 4.
    assert.equal(result.readCount, 1015);
    // `--kp-chart-height` is read by js/chart.js (the plot's height when the
    // data names none), not by a stylesheet [scope-143]. --kp-sidenav-lead and --kp-sidenav-room are read by js/sidenav.js
    // (what the floating variant leaves beside the panel).
    // The four that no rule and no script reads yet stay listed: --kp-busy-opacity, --kp-inspector-min, --kp-week-mode and
    // --kp-wheel-ease; --kp-steps is declared on the progress stripe (css/components.css) and not read through var() there.
    assert.deepEqual(result.unread, [
        '--kp-busy-opacity',
        '--kp-chart-height',
        '--kp-inspector-min',
        '--kp-sidenav-lead',
        '--kp-sidenav-room',
        '--kp-steps',
        '--kp-week-mode',
        '--kp-wheel-ease',
    ]);
});

test('AR21: a knob read in a nested rule is placed by the rule, not by its name', () => {
    const css =
        '@layer components {\n    .kp-menu {\n        @media (min-width: 40rem) {\n            min-width: var(--kp-menu-min-width, 11rem);\n        }\n    }\n}';
    const result = extractKnobs(css);
    assert.deepEqual(result.knobs, [
        { name: '--kp-menu-min-width', defaults: ['11rem'], families: ['menu'], selectors: ['.kp-menu'], read: true, declared: false },
    ]);
});

test('AR21: the documented default and the destructured one are compared', () => {
    assert.deepEqual(
        [...destructuredDefaults("flavour, separator = ': ', as: As = 'div', wrap = true, ...rest").entries()],
        [
            ['flavour', null],
            ['separator', "': '"],
            ['as', "'div'"],
            ['wrap', 'true'],
        ],
    );
    assert.equal(literal("': '"), ': ');
    assert.equal(literal('() => {}'), null);

    const result = extractDefaults();
    assert.ok(result.expected >= 75, `only ${result.expected} documented defaults`);
    assert.equal(result.agreed + result.disagreed.length + result.missing.length, result.expected);
    // A disagreement is a finding about a component, not about this
    // check: today there are none, and a new one should be looked at
    // rather than absorbed.
    assert.deepEqual(
        result.disagreed.map((c) => `${c.module} ${c.component}.${c.prop}: documented ${c.documented}, code has ${c.actual}`),
        [],
    );

    // Phase 7: `missing` was an unasserted bucket. A documented default
    // whose code has none is not always wrong — two of them keep the
    // default somewhere the destructuring cannot show — but "not always
    // wrong" is not "never looked at", and a third arriving because
    // someone deleted a default would have landed here in silence. Named,
    // with the reason, the way themes/known-asymmetry.json names its four.
    assert.deepEqual(
        result.missing.map((c) => `${c.component}.${c.prop}`).sort(),
        ['Marquee.pause', 'SplitPane.defaultValue'],
        'a documented default is not comparable; either the code lost it, or this list owes it a reason',
    );
    // Marquee.pause     — the default is the CSS custom property's own
    //                     fallback, `--kp-marquee-pause: offscreen`, so
    //                     the component passes the prop through untouched.
    // SplitPane.defaultValue — `defaultValue ?? initial` keeps the 1.x
    //                     alias working, so the 50 lives in useControllable.

    // And the count that says the extractor is still finding things at
    // all: without this, a broken extractor makes everything "missing"
    // and the disagreement list stays honestly empty.
    assert.ok(result.agreed >= 80, `only ${result.agreed} defaults could be compared and agreed`);
});
