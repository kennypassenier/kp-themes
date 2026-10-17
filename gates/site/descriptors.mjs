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

import { SIDENAV_MINOR_EXAMPLES, SIDENAV_MINOR_VARIANTS } from './sidenav-minor.mjs';

/**
 * @typedef {{ title: string, why: string, markup: string, react?: string, script?: string, frame?: boolean | { height?: string, width?: string } }} Example
 * @typedef {{ name: string, what: string }} Variant
 * @typedef {{
 *   id: string,
 *   title: string,
 *   group: string,
 *   intro: string,
 *   whenToUse: string,
 *   classes: string[],
 *   exports: string[],
 *   aliases?: string[],
 *   examples: Example[],
 *   variants: Variant[],
 *   accessibility: string[],
 * }} Descriptor
 */

/** The navigation sections, in order. */
export const GROUPS = ['Getting started', 'Theming', 'Layout', 'Forms', 'Data', 'Feedback', 'Navigation', 'Content', 'Structure'];

/** @type {Descriptor[]} */
export const DESCRIPTORS = [
    {
        id: 'theme-switcher',
        title: 'Theme switcher',
        group: 'Theming',
        classes: ['kp-theme-menu', 'kp-theme-group', 'kp-theme-option', 'kp-swatch'],
        exports: ['ThemeSwitcher'],
        // `register` claims what js/lazy-register.js writes and dispatches
        // [scope-50]: the link attribute and its load and error events.
        aliases: ['theme', 'register'],
        intro: 'The control that changes the page’s theme. Two shapes share one behaviour: a flat row of buttons, and an icon button whose dropdown groups the light themes above the dark ones. Both write the chosen name onto the document and remember it.',
        whenToUse:
            'Put one in the page’s header when the reader picks their own theme. Do not reach for it to preview a theme in one corner of a page — every element can wear a theme by carrying the theme attribute, which is what the swatch beside each option does — and do not put it in a settings form behind a save button: the choice applies the moment it is made, so a form around it promises something it does not do.',
        examples: [
            {
                title: 'A flat picker',
                why: 'The markup a server writes; one module attaches the behaviour to the attribute, not to the layout. The paragraph underneath stays empty unless the browser refuses to store the choice.',
                markup: `
<div data-kp-theme-picker>
<button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span> Formal</button>
<button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span> Dark</button>
</div>
<p data-kp-theme-status hidden></p>
`,
            },
            {
                title: 'The same picker in a menu, grouped',
                why: 'An icon button with a popover: Escape and light dismiss are the browser’s. Each group carries its label on its own list, so a screen reader hears “Light, list, two items” rather than reading the heading twice.',
                markup: `
<span class="kp-theme-menu">
<button type="button" class="kp-icon-button" popovertarget="doc-theme-menu" aria-label="Choose a theme" style="anchor-name: --doc-theme-menu">Aa</button>
<div popover="auto" id="doc-theme-menu" class="kp-popover" style="position-anchor: --doc-theme-menu">
<ul class="kp-menu" data-kp-theme-picker aria-label="Choose a theme">
<li role="presentation" class="kp-theme-group" data-kp-theme-group="light"><span class="kp-theme-group__label" aria-hidden="true">Light</span>
<ul class="kp-theme-group__list" aria-label="Light">
<li><button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span>Formal</button></li>
</ul></li>
<li role="presentation" class="kp-theme-group" data-kp-theme-group="dark"><span class="kp-theme-group__label" aria-hidden="true">Dark</span>
<ul class="kp-theme-group__list" aria-label="Dark">
<li><button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span>Dark</button></li>
<li><button type="button" data-kp-theme="cyberpunk"><span class="kp-swatch" data-theme="cyberpunk"></span>Cyberpunk</button></li>
</ul></li>
</ul>
</div>
</span>
`,
            },
        ],
        variants: [
            { name: '.kp-swatch', what: 'The two-colour disc beside an option. It wears the theme it names, so it shows that theme’s live colours rather than a copy.' },
            { name: '.kp-theme-group', what: 'One labelled group of options — light above dark. Flat, the groups become two rows; in a menu they become two sections with a rule between them.' },
            { name: '.kp-theme-menu', what: 'The wrapper of the icon button and its list. The React switcher positions its own list under the button; the framework-free menu is a popover.' },
            { name: '.kp-theme-option__label / __check', what: 'The parts of one option in the React channel: the name, and the check that marks the current theme.' },
            { name: 'selected', what: 'The current theme is marked twice — a border and a check mark flat, weight and a check in a menu — because colour alone is not a carrier.' },
            { name: 'storage refused', what: 'When the browser will not store the choice the status line says so out loud instead of leaving a picker that looks broken on the next load.' },
            {
                name: 'registers loaded lazily',
                what: 'On a page that links only the active theme’s register, a choice waits until the new register has arrived: the page keeps the previous theme meanwhile, the choice is still the one remembered, and a register that fails to load leaves the theme as it was.',
            },
            { name: '--kp-sig-pa-* (pastel’s register)', what: 'The tokens pastel’s register keeps to itself, readable but not knobs: the soft landing (`land`, the same curve as the theme’s easing token), `land-size` (the landing held at its value, for widths and heights), `land-back` (the landing reversed); the clocks `window` 560 ms, `dialog` 840 ms, `tack` 360 ms, `wobble` 800 ms and `loop` 2400 ms; `off` (6 px, the pass’s offset), `pass-c`, `peel`, the radii `r-plate`, `r-ctl` and `r-chip`, `tape-bg`, `dir`, `corner` and `ground`; and two registered numbers, `pass` and `ink`, the two clocks every part that draws its own plate follows.' },
            { name: 'kp-sig-pastel-* (pastel’s keyframes)', what: 'The anchor: `stuck-in`/`-out`, `stuck-placed-in`/`-out`, `stuck-plate-in`/`-out`, `pass-in`/`-out`, `pass-host-in`/`-out`, `stuck-small-in` and `pass-small-in` (a tick, a dot); the tack: `tack-in`/`-out`; the meter’s share: `meter-stuck-o`/`-w`/`-d`; the wobble: `update-wobble`; the caterpillar: `bug-rise`, `bug-rise-bead`, `bug-step`, `bug-feel`, and the spinner’s `curl-orbit`, `curl-lift`, `curl-turn`; the tour’s `tour-ring`. Every close is its open played backwards.' },
        ],
        accessibility: [
            'Built in — each option is a real button with a pressed state, so a screen reader says which theme is current without seeing the border.',
            'Built in — the check mark and the border are two carriers beside the colour, which is what DI4 asks for.',
            'Built in — in a menu the browser gives Escape, light dismiss and focus return, because the list is a popover rather than a hand-written dropdown.',
            'Built in — every word the picker itself speaks comes from the dictionary and can be replaced.',
            'Yours — give the menu button an accessible name; an icon on its own says nothing.',
            'Yours — write the options your server knows about. The module attaches behaviour to markup that is already there; it renders nothing on its own.',
        ],
    },
    {
        id: 'effects',
        title: 'Effects and surfaces',
        group: 'Theming',
        classes: ['kp-laurels', 'kp-side-note', 'kp-platforms', 'kp-spec'],
        exports: [],
        // The hook vocabulary of round six [S45, AR35]: a consumer marks
        // what a passage IS and a theme decides what that looks like. The
        // aliases claim the attributes js/effects.js writes and the one
        // event it dispatches.
        aliases: ['effects', 'effect', 'surface', 'reveal', 'divider', 'text', 'open', 'measure', 'measured', 'dim', 'elev', 'press', 'pressed'],
        intro: 'A small vocabulary of attributes that say what a passage is — a hero, an app surface, a divider, a phrase that should land — and leave what that looks like to the theme. A theme that has an answer paints it; a theme that has none stays quiet, and the page reads the same either way.',
        whenToUse:
            'Mark the structure of a page you want a theme to be able to dramatise: the opening surface, the working surface, the seam between them, the words that carry the point. Do not use the attributes to ask for a particular effect — there is no attribute for a glitch or a flicker, only for the thing a theme may glitch or flicker. A theme decides, and a reader who asked for reduced motion gets the words without the drama.',
        examples: [
            {
                title: 'The demo pieces: laurels, a side note, a platforms line and a spec sheet',
                why: 'The four pieces the concept demo carries beside the components: a list of claims, a note in the margin, a row of names and a sheet of the theme’s own values. Quiet in every theme — a list, a note, a row, a card — and a register may dramatise them; cyberpunk sets the laurels in dotted bars, turns the note vertical and cuts two corners off the sheet.',
                markup: `
<ul class="kp-laurels" aria-label="Measured against"><li><b>93 tokens</b>parity gate</li><li><b>DI5 safe</b>no flashing</li></ul>
<p class="kp-side-note">SECTOR 06</p>
<div class="kp-platforms"><span>Chromium</span><span>Firefox</span></div>
<aside class="kp-spec" aria-label="Palette"><dl><dt>ground</dt><dd><i class="kp-spec__swatch" data-token="surface-hero-bg"></i>--surface-hero-bg</dd><dt>display</dt><dd><span class="kp-spec__font" data-font="display">Aa</span> --theme-font-display</dd></dl></aside>
`,
            },
            {
                title: 'Two surfaces and the seam between them',
                why: 'The hero and the app are two grounds in one page: a theme can give the hero its loud register and keep the app surface calm. The divider is the seam a theme may draw; the marked phrases are what a theme may reveal. The concept demo in the examples is this markup at full length, under every theme.',
                markup: `
<section data-kp-surface="hero">
<h1 data-kp-reveal="headline">Signal in the noise</h1>
<p>Every <mark>reading</mark> is time-stamped; every <mark>decision</mark> is logged.</p>
</section>
<div data-kp-divider></div>
<section data-kp-surface="app">
<p data-kp-reveal="emphasis" data-kp-label="Sealed" data-kp-label-open="Open">Dossier 7 — <mark>cleared</mark></p>
<button type="button" class="kp-button" data-kp-reveal-trigger>Reveal</button>
<p data-kp-label="Sealed" data-kp-label-open="Open" data-kp-open>Dossier 8 — the same stamp, with the file already open.</p>
</section>
`,
            },
        ],
        variants: [
            { name: 'data-kp-surface="hero"', what: 'The opening surface: the one place a theme may be loud.' },
            { name: 'data-kp-surface="app"', what: 'The working surface: forms, tables, cards. A theme keeps it readable before anything else.' },
            {
                name: 'data-kp-surface-align="center"',
                what: 'Sets a surface’s content on its middle: the text centres, a narrower child takes auto margins and a row centres its controls. Off unless a page asks; every surface keeps its content off its own inline edges either way, one lg step in.',
            },
            { name: 'data-kp-divider', what: 'The seam between two surfaces. A theme may draw it as a rule, a tear, or nothing.' },
            { name: 'data-kp-reveal', what: 'headline, emphasis or rule: the element a theme may bring in with a reveal. Once per session unless data-kp-reveal-every="load" says otherwise.' },
            { name: 'data-kp-reveal-trigger', what: 'A control that replays the reveals of the surface it sits in.' },
            {
                name: 'data-kp-label-open',
                what: 'The word a stamp takes once the file is open, beside data-kp-label for the word it wears while sealed. A theme whose demo changes the stamp answers it; the rest keep the one word.',
            },
            {
                name: 'data-kp-open',
                what: 'What the module writes on a reveal container while its trigger holds it open, so a register can answer the open state without a script of its own.',
            },
            { name: '<mark>', what: 'Emphasis inside running text. Themes answer it with a highlight, a glow, or a decipher — never with less contrast than the text around it.' },
            { name: 'data-kp-text', what: 'The copy of a headline or a navigation label that a register\u2019s glitch pseudo-elements read; the module writes it on a headline, the NavBar writes it on its links.' },
            { name: 'data-kp-effects', what: 'What the module writes on the document root before first paint, so a stylesheet can tell an armed page from one without the script; data-kp-effects-done follows when the reveals of a load have run.' },
            { name: 'data-kp-press-size', what: 'Written on a button or icon button a press started on, for a theme that asks the module for it (blueprint): its measured width in whole pixels, which the theme letters on the dimension drawn below a pressed part. Read it, do not set it.' },
            { name: 'data-kp-pressed', what: 'Written on a pressed part for the length of the theme\u2019s press animation (deco\u2019s seal, 400 ms), from the pointer or Space or Enter going down, for a theme that asks the module for it (deco), so a tap shorter than the animation still plays it whole. The register keys the animation on it beside :active. Read it, do not set it.' },
            { name: 'kp-effect-unknown', what: 'The event the module dispatches on an element that names a surface or a reveal it does not know, so a typo is heard rather than silently quiet.' },
            {
                name: '--kp-measure: live',
                what: "Blueprint's own device, outside the six-hook vocabulary [S48]: on the root, the module wraps every `data-kp-reveal=\"headline\"` element in `[data-kp-measured]` and builds two dimension lines beside it — never a fixed width. The horizontal one (`[data-kp-dim]`, `[data-kp-dim-line]`, two `[data-kp-dim-tick]` and a `[data-kp-measure]` label) reads the headline's own `getBoundingClientRect().width`, on load, on resize and once the page's fonts are ready, and writes the same rounded number to the line's `style.width` and the label in one breath. The vertical one (`[data-kp-elev-line]`, two `[data-kp-elev-tick]` and `[data-kp-elev-measure]`) needs no measurement of its own width to size itself — CSS containment does that — only a read to print the wrap's own height into its label.",
            },
            { name: 'pastel: the spec sheet', what: 'In pastel the spec sheet is stuck to the page with a strip of washi tape across its top-start corner.' },
        ],
        accessibility: [
            'Built in — every reveal keeps the words in the document from the start; an effect changes how they arrive, never whether they are there.',
            'Built in — a reader who asked for reduced motion gets no reveal at all, and the marked phrases are shown at once.',
            'Built in — a highlight on a marked phrase keeps the contrast of the text around it; the contrast gate measures the pair.',
            'Yours — mark the structure, not the wish: the attributes name what a passage is, and a theme that has no answer leaves the page as it was.',
        ],
    },
    {
        id: 'button',
        title: 'Button',
        group: 'Forms',
        classes: ['kp-button', 'kp-confirm'],
        exports: ['Button'],
        aliases: ['confirm', 'contract', 'destructive', 'armed', 'undo', 'action', 'key'],
        intro: 'One button in four looks and three sizes, and the two contracts a button can carry: an action that cannot be taken back must offer a confirmation or an undo, and a row action can act at once and offer the way back beside itself while the window is open.',
        whenToUse:
            'For anything that acts on the page or sends something. Not for navigation — a control that goes to another URL is a link, and a link painted as a button loses the middle click, the context menu and what a screen reader says about it. Not for a bar of icons either: that is the icon button, which is the same paint at a square size.',
        examples: [
            {
                title: 'The four looks and a disabled one',
                why: 'Hover, active and disabled are derived from the base colour by the theme generator rather than authored per theme, so a new theme gets all three by declaring one.',
                markup: `
<button type="button" class="kp-button">Default</button>
<button type="button" class="kp-button kp-button--primary">Primary</button>
<button type="button" class="kp-button kp-button--destructive">Destructive</button>
<button type="button" class="kp-button kp-button--ghost">Ghost</button>
<button type="button" class="kp-button kp-button--primary" disabled>Disabled</button>
`,
            },
            {
                title: 'Three sizes',
                why: 'The middle step is the unmodified button, so `.kp-button` on its own is `md` and nothing that exists today changes size. The small step is floored at the 24px pointer target even under the compact density, and the large one is the row-leading action on a marketing page. Every measure behind them is a knob.',
                markup: `
<button type="button" class="kp-button kp-button--sm">Small</button>
<button type="button" class="kp-button">Medium</button>
<button type="button" class="kp-button kp-button--lg">Large</button>
`,
            },
            {
                title: 'A label beside an icon',
                why: 'The words go in their own `.kp-button__text` and the icon stays a hidden sibling. A register that underlines the first letter of the label when the button is pointed at (retro did, until it was removed on 2026-10-09) cannot tell a bare run of text from the icon next to it in CSS, so without the element that letter is never found. No theme styles it today: in the button’s flex row it lays out exactly as the bare text did. `<Button>` and the generated examples write it for you when the label mixes text with an element; by hand, add it yourself.',
                markup: `
<button type="button" class="kp-button"><span aria-hidden="true">↻</span><span class="kp-button__text">Retry</span></button>
<button type="button" class="kp-button kp-button--primary"><span class="kp-button__text">Export</span><span aria-hidden="true">↓</span></button>
`,
            },
            {
                title: 'A destructive button that confirms',
                why: 'Since 4.0.0 the click opens a modal dialog carrying your phrase: Escape and Cancel do nothing, Confirm re-fires the click so your own handler runs exactly once, and focus comes back to the button. Add `data-kp-confirm-mode="inline"` for the arm-then-act of 3.x, where the label changes and a second click acts. A destructive button carrying neither a confirmation nor an undo is disarmed by the contract enforcer and reported.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete this application?">Delete</button>
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete this application?" data-kp-confirm-mode="inline">Delete, the 3.x way</button>
`,
            },
            {
                title: 'A removal that depends on something',
                why: 'The confirmation lists what still uses the thing (`data-kp-confirm-dependents`, one name per `;`, under a heading with the exact count). `data-kp-confirm-blocked` makes it a notice with one Close button and the sentence that says what to do first; `data-kp-confirm-type` turns Confirm on only once that name is typed (the typed confirmation).',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete the calendar Household?" data-kp-confirm-dependents="kyu-runner; Home Assistant" data-kp-confirm-blocked="Delete those two sources first, on the Sources page.">Delete</button>
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete the calendar Holidays and everything on it?" data-kp-confirm-type="Holidays">Delete</button>
`,
            },
            {
                title: 'A row action that acts at once and offers the way back',
                why: 'The optimistic half: the row goes away immediately, an undo appears beside it, and the action commits only when the window closes. The consumer hears both outcomes as events.',
                markup: `
<ul class="kp-stack">
<li data-kp-undo-target>Application at Example Inc
<button type="button" class="kp-button kp-button--ghost" data-kp-undo-action>Delete</button>
</li>
</ul>
`,
            },
            {
                title: 'A button that shows a running job',
                why: '`kp-button--live` is a row with the theme’s own spinner in front and a label that gives way: it never grows past its maximum width, cuts the long label with an ellipsis and, in a container narrower than 40rem (the nav wrapper is one), swaps the long label for the short one, so the box never empties. `hidden` takes it out of the bar without a gap. The narrow box below shows the short label.',
                markup: `
<div class="kp-row kp-gap-md">
<button type="button" class="kp-button kp-button--secondary kp-button--sm kp-button--live"><span class="kp-spinner kp-button__spin" aria-hidden="true"></span><span class="kp-button__short">Running</span><span class="kp-button__long">Updating gateway · step 3 of 35</span></button>
<div style="inline-size: 14rem; container-type: inline-size">
<button type="button" class="kp-button kp-button--secondary kp-button--sm kp-button--live"><span class="kp-spinner kp-button__spin" aria-hidden="true"></span><span class="kp-button__short">Running</span><span class="kp-button__long">Updating gateway · step 3 of 35</span></button>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-button--live', what: 'A running-job button: `.kp-button__spin` (the theme’s spinner), `.kp-button__short` and `.kp-button__long`. The long label is cut with an ellipsis; the short one takes over in a container under 40rem. The widest it grows is the live-width knob.' },
            { name: '.kp-button', what: 'The default: the secondary surface with a boundary, for the actions that are neither the main one nor dangerous.' },
            { name: '.kp-button--primary', what: 'One per view. The action the reader came to take.' },
            { name: '.kp-button--destructive', what: 'Deletes and disconnections. It has to carry a confirmation or an undo as well.' },
            { name: '.kp-button--ghost', what: 'No ground and no boundary until it is hovered, for actions that sit inside dense rows.' },
            {
                name: '.kp-button--sm',
                what: 'The small step, for a control that sits inside a table row or a menu. Its height is floored so the compact density cannot take it under the 24px pointer target.',
            },
            { name: '.kp-button--lg', what: 'The large step, for the one action a landing page is about. There is no modifier for the middle step: that is `.kp-button` itself.' },
            {
                name: '.kp-button__text',
                what: 'The words of a label that also holds an icon or another element. Public: use it whenever the label is more than bare text. A label of text alone needs none, and a label that marks its own access key with `data-kp-key` is left as written.',
            },
            { name: '.kp-button__undo', what: 'The undo the pattern puts beside a committed action, inline rather than in a toast that may already be gone.' },
            {
                name: '.kp-confirm',
                what: 'The dialog the confirmation opens, on top of `.kp-dialog`. It also carries `data-kp-confirm-dialog`, which is what a consumer reaches it by.',
            },
            { name: 'data-kp-confirm-dependents', what: 'What still uses the thing, one name per `;`: listed in the confirmation (`.kp-confirm__dependents`, `.kp-confirm__list`) under a heading with the exact count.' },
            { name: 'data-kp-confirm-blocked', what: 'The removal may not go ahead: the confirmation says this sentence (empty: the dictionary’s) and offers only Close.' },
            { name: 'data-kp-confirm-type', what: 'Confirm turns on only once this name is typed: the typed confirmation (its own page), with what will be lost, the rule and a line that says whether it matches; Enter in the field confirms. A blocked removal shows no field.' },
            { name: ':hover / :active', what: 'Both are derived colours; on a theme that lifts its controls the button also rises, and by nothing at all where the theme answers zero.' },
            { name: ':disabled', what: 'A dimmed ground and a refusing cursor. DI8 records the decision that a disabled control may fall below the contrast floor.' },
            {
                name: 'armed',
                what: 'A confirming button between its first and second click, in the `inline` variant only. The module writes the state, the label changes, and a timeout disarms it. The default variant opens a dialog instead and writes nothing on the button.',
            },
            { name: 'pastel', what: 'In pastel a button is a sticker with a flat peel straight under it: the pointer lifts it 2 px and curls its top-end corner into a fold, a press sticks it down flat, and focus is the dashed ring line alone, 3 px out, with no inner line. On a destructive, info or primary plate the dashed line takes the plate’s ink, where the ring colour would read 1.34, 2.92 and 1.40:1. A button in a header, a menu, a tile, an alert or the alarm is this button.' },
        ],
        accessibility: [
            'Built in — a destructive action with no way back is disarmed rather than left to fire, which is SC 3.3.4 turned into something a review cannot forget.',
            'Built in — the confirmation label, the undo label and the announcement all come from the dictionary, so they can be replaced in one place.',
            'Built in — the disabled look is not carried by colour alone: the cursor changes and the button refuses the click.',
            'Yours — use a real button element. The class paints; it does not make a div focusable or operable by Enter.',
            'Yours — a button with only an icon in it needs a name of its own.',
            'Yours — say what happens in the label. “Delete application” survives being read out of context; “OK” does not.',
        ],
    },
    {
        id: 'icon-button',
        title: 'Icon button',
        group: 'Forms',
        classes: ['kp-icon-button'],
        exports: [],
        intro: 'A square, quiet button for a single glyph: the theme menu’s trigger, the close on a dialog, an alert or a toast. It has no ground until it is hovered, and the wash it takes then has no hue of its own, so it stays quiet in every theme.',
        whenToUse:
            'Where the meaning is obvious from the glyph and the row has no room for words — a close, a menu, a sort. Not for the main action of a view: an icon alone is a guess for anyone who does not already know what it means. Not as a decoration either; if there is nothing to press, it is a span.',
        examples: [
            {
                title: 'A close button and a menu trigger',
                why: 'The size is fixed so a row of them lines up, and the glyph inside is capped rather than the button growing around it.',
                markup: `
<button type="button" class="kp-icon-button" aria-label="Close">×</button>
<button type="button" class="kp-icon-button" aria-label="More actions">⋯</button>
`,
            },
        ],
        variants: [
            { name: '.kp-icon-button', what: 'The only look. It has no variants on purpose: a destructive or primary icon button is colour as the only carrier.' },
            { name: ':hover', what: 'A wash of the page’s own ink, so it does not take the accent colour that made a highlighted row turn lavender in one theme and emerald in another.' },
            { name: 'with an svg child', what: 'An inline glyph is sized by the button rather than by its own attributes, so icons from different sets end up the same size.' },
        ],
        accessibility: [
            'Built in — the target is larger than the glyph, which is what keeps it above the 24px minimum of WCAG 2.5.8.',
            'Yours — every one of these needs an accessible name; the glyph is not one.',
            'Yours — mark a decorative glyph as hidden so it is not read out beside the name you gave the button.',
        ],
    },
    {
        id: 'field',
        title: 'Form field',
        group: 'Forms',
        classes: ['kp-field', 'kp-fieldset'],
        exports: ['Field'],
        intro: 'A label, a control, optional help text and an error, with the wiring between them: the label points at the control, the help and the error are announced with it, and an invalid field says what is wrong in words rather than by turning red.',
        whenToUse:
            'For a single control that stands on its own — a search box in a toolbar, one filter in a sidebar. Inside a form that validates, reach for the form field instead: it is the same shape connected to the form’s own state, and using this one there means writing the error handling twice.',
        examples: [
            {
                title: 'A field with help, and the same field invalid',
                why: 'The error is text and it names the problem. A red border is one carrier and a silent one; the message is read out because the control points at it.',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="doc-field-mail">Email</label>
<input class="kp-field__input" id="doc-field-mail" type="email" placeholder="name@example.com" aria-describedby="doc-field-mail-help" />
<span class="kp-field__help" id="doc-field-mail-help">We never pass this on.</span>
</div>
<div class="kp-field kp-field--invalid">
<label class="kp-field__label" for="doc-field-bad">Email</label>
<input class="kp-field__input" id="doc-field-bad" type="email" value="not-an-address" aria-invalid="true" aria-describedby="doc-field-bad-error" />
<span class="kp-field__error" id="doc-field-bad-error">Enter a valid address.</span>
</div>
`,
            },
            {
                title: 'The other four controls',
                why: 'A field is not always a text box. Select, textarea, checkbox and a radio group carry the same label, help and error wiring, so a real form does not grow a hand-written half beside the component.',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="doc-field-country">Country</label>
<select class="kp-field__input" id="doc-field-country"><option>Pick…</option><option>Belgium</option><option>The Netherlands</option></select>
</div>
<div class="kp-field">
<label class="kp-field__label" for="doc-field-notes">Notes</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-field-notes"></textarea>
</div>
<div class="kp-field kp-field--check">
<input class="kp-field__check" id="doc-field-post" type="checkbox" checked />
<label class="kp-field__label" for="doc-field-post">Keep me posted</label>
</div>
<fieldset class="kp-field kp-fieldset" role="radiogroup">
<legend class="kp-field__label">How do we reach you?</legend>
<div class="kp-field__option"><input class="kp-field__check" id="doc-field-r1" name="doc-field-reach" type="radio" /><label for="doc-field-r1">Email</label></div>
<div class="kp-field__option"><input class="kp-field__check" id="doc-field-r2" name="doc-field-reach" type="radio" /><label for="doc-field-r2">Telephone</label></div>
</fieldset>
`,
            },
        ],
        variants: [
            { name: '.kp-field', what: 'The stacked default: label above control, help and error under it.' },
            { name: '.kp-field--check', what: 'Box first, label beside it — the order it is read in and the order it is clicked in. Help and error move under both.' },
            { name: '.kp-field--invalid', what: 'Colours the control’s boundary, or outlines a checkbox, which has no boundary of its own to colour.' },
            { name: '.kp-field__input--multiline', what: 'A textarea: taller, and resizable vertically only, because one dragged wider breaks the column it sits in.' },
            { name: '.kp-fieldset', what: 'A group of radios or checkboxes with a legend, so the question is read once before the answers rather than once per answer.' },
            { name: 'inline layout', what: 'A radio group laid out in a row instead of a column, with the legend on its own line above them.' },
            { name: '.kp-field__required', what: 'The required marking: a star and the word, because a star alone is read as “star”.' },
        ],
        accessibility: [
            'Built in — the label is a real label, the help and the error are pointed at by the control, and the invalid state is announced rather than only painted.',
            'Built in — the checkbox and the radio are drawn larger than the browser’s default, and their tick takes a colour the theme can correct; the label is clickable too, which is what actually makes the target big enough for WCAG 2.5.8.',
            'Built in — a select’s open list is drawn by the package in the combobox’s look in every browser, Firefox included, while the native select stays the control a screen reader reads and a form submits. Write data-kp-select="native" (React: drawn={false}) on a select that should keep the browser’s own list; a multiple select always does.',
            'Yours — give every control an id and point the label at it, or wrap the control in the label.',
            'Yours — write the error as a sentence that says what to do. “Invalid” tells the reader only that you noticed.',
            'Yours — keep the help text short: it is read out before the reader has typed anything.',
        ],
    },
    {
        id: 'switch',
        title: 'Switch',
        group: 'Forms',
        classes: ['kp-switch'],
        exports: ['Switch'],
        intro: 'A checkbox that says on and off instead of ticked: a native checkbox with role="switch", drawn as a track and a thumb, with the state in a word beside it. It submits with a form, reads its state from checked and flips with Space, with no script of its own.',
        whenToUse:
            'For a setting that takes effect as it is flipped — alarms on, a live view on. For a choice that only counts once a form is sent, a checkbox says that better; for more than two states, use a radio group or a select.',
        examples: [
            {
                title: 'Off, on, disabled, and invalid',
                why: 'The thumb’s position and the word both carry the state, so it never rests on colour alone. The state span starts empty: attachSwitches() fills it from the dictionary, so a consumer’s setStrings() reaches the words.',
                markup: `
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Night alarms</span>
</label>
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" checked />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Weekly summary</span>
</label>
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" checked disabled />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Audit log (always on)</span>
</label>
<div class="kp-field kp-field--check kp-field--invalid">
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" aria-invalid="true" aria-describedby="doc-switch-error" />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Line locked out</span>
</label>
<span class="kp-field__error" id="doc-switch-error">Lock the line out before you start the repair.</span>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-switch', what: 'The row: a label, so the track, the word and the text are one target.' },
            { name: '.kp-switch__input', what: 'The track, with the thumb drawn on it; checked moves the thumb to the end and fills the track the theme’s way.' },
            { name: '.kp-switch__state', what: 'The On or Off word beside the track, from the dictionary; aria-hidden, because the role already announces the state.' },
            { name: 'disabled', what: 'The row fades and refuses the pointer; a disabled switch that is on still reads as on.' },
            { name: 'aria-invalid', what: 'The outline an invalid checkbox takes, in the alarm colour; the message under it says what is wrong.' },
        ],
        accessibility: [
            'Built in — role="switch" on a real checkbox: a screen reader says “switch, on”, Space flips it and Enter does not.',
            'Built in — the state is carried three ways: the thumb’s position, the paint, and the word.',
            'Built in — with reduced motion asked for, the thumb jumps instead of sliding.',
            'Yours — label every switch with what it turns on, not with “on” or “enable”.',
            'Yours — a switch acts at once; if flipping it needs a save button, use a checkbox.',
        ],
    },
    {
        id: 'form',
        title: 'Form',
        group: 'Forms',
        classes: ['kp-form'],
        exports: ['Form', 'FormField'],
        aliases: ['field', 'submit', 'busy', 'focus-summary', 'validate-on', 'revalidate-on'],
        intro: 'A form that makes the browser’s own validation reachable: the messages the browser already found are put where a screen reader will read them, gathered into a summary at the top, and the first one takes focus when a submit fails.',
        whenToUse:
            'For anything the reader fills in and sends. Not for a single filter or search box — that is one field and needs no summary. Not as a validation engine either: the rules stay the browser’s, so a field validates by declaring what it is rather than by a rule written twice, once here and once on the server.',
        examples: [
            {
                title: 'A form that validates on submit',
                why: 'The summary is empty and hidden until a submit fails; then it names each failing field as a link, takes focus, and each field’s own message appears under it. Native validation stays on, its popups do not.',
                markup: `
<form class="kp-form" data-kp-form>
<div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
<div class="kp-field">
<label class="kp-field__label" for="doc-form-name">Name <span class="kp-field__required">required</span></label>
<input class="kp-field__input" id="doc-form-name" name="name" required aria-describedby="doc-form-name-help" />
<span class="kp-field__help" id="doc-form-name-help">As it appears on your pass.</span>
<span class="kp-field__error" data-kp-field-error hidden></span>
</div>
<div class="kp-field">
<label class="kp-field__label" for="doc-form-mail">Email <span class="kp-field__required">required</span></label>
<input class="kp-field__input" id="doc-form-mail" name="email" type="email" required />
<span class="kp-field__error" data-kp-field-error hidden></span>
</div>
<button type="submit" class="kp-button kp-button--primary" data-kp-submit>Save</button>
</form>
`,
            },
        ],
        variants: [
            { name: '.kp-form', what: 'The column: fields stacked with one distance between them.' },
            { name: '.kp-form__summary', what: 'The error summary. It is a focus target rather than a banner, because a message that appears above the fold is invisible to someone whose focus is at the bottom.' },
            { name: '.kp-form__summary-title', what: 'The line that says what the summary is, in words, above the list of failing fields.' },
            { name: 'busy', what: 'While a save is in flight the form marks itself, so a consumer can disable what it wants to; the outcome is reported back through the callback the event hands over.' },
            { name: 'server errors', what: 'Errors a server found are handed in and shown in the same places as the browser’s own, rather than in a second mechanism beside them.' },
        ],
        accessibility: [
            'Built in — the browser’s own popups are turned off and its validation kept: the message is put in the page instead, where it can be styled, read and left standing.',
            'Built in — a failed submit moves focus to the summary, and each entry in it moves focus to the field it names.',
            'Built in — every field that fails is marked invalid and pointed at its message, so it is announced rather than only coloured.',
            'Yours — give each control a name and the constraint that describes it; that is what the browser validates.',
            'Yours — repeat the validation on the server. This is what the reader sees, not what protects the data.',
            'Yours — keep the submit a real submit button, or the form cannot be sent with the keyboard.',
        ],
    },
    {
        id: 'combobox',
        title: 'Combobox and tag input',
        group: 'Forms',
        classes: ['kp-combobox', 'kp-tag', 'kp-tag-list'],
        exports: ['Combobox'],
        aliases: ['listbox', 'option', 'tags', 'empty-row', 'max-tags', 'backspace-removes', 'close-on-blur', 'disabled', 'duplicates', 'open-on-focus', 'stay-open', 'remove-glyph', 'loop', 'match', 'debounce', 'creatable', 'select', 'select-list', 'select-attached', 'chosen', 'overlay-side'],
        intro: 'A text input with a filtered list under it. The arrow keys move a highlight while the cursor stays in the input, Enter takes the highlighted option, and the count of what is left is announced. With tags on, a choice appends a removable tag and clears the field instead of replacing the value.',
        whenToUse:
            'When there are more options than a select can carry comfortably and the reader knows roughly what they are looking for. Not for a handful of fixed choices — a select is smaller, needs no script and works before the page has finished loading. Not for a free-text field with suggestions you may ignore either: this one is about choosing from a list.',
        examples: [
            {
                title: 'A combobox over a list the server wrote',
                why: 'The options are markup, not a JavaScript array: a page rendered by a server shows the list before any script runs. The status line is not decoration — it is how anyone who cannot see the list shrink is told that it did.',
                markup: `
<div class="kp-combobox" data-kp-combobox>
<label class="kp-field__label" for="doc-combobox-fruit">Fruit</label>
<input class="kp-combobox__input" id="doc-combobox-fruit" type="text" role="combobox" autocomplete="off" aria-expanded="false" aria-controls="doc-combobox-fruit-list" placeholder="Pick or type…" />
<ul class="kp-combobox__list" id="doc-combobox-fruit-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="apple">Apple</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="banana">Banana</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="lemon">Lemon</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
`,
            },
            {
                title: 'The same markup as a tag input',
                why: 'One flag on the wrapper turns choosing into appending. Tags the server already rendered into the list are read at attach, so a reloaded page keeps them.',
                markup: `
<div class="kp-combobox" data-kp-combobox data-kp-tags>
<label class="kp-field__label" for="doc-combobox-labels">Labels</label>
<ul class="kp-tag-list" data-kp-tag-list>
<li class="kp-tag">urgent<button type="button" class="kp-tag__remove" data-kp-tag-remove aria-label="Remove urgent">×</button></li>
</ul>
<input class="kp-combobox__input" id="doc-combobox-labels" type="text" role="combobox" autocomplete="off" aria-expanded="false" aria-controls="doc-combobox-labels-list" />
<ul class="kp-combobox__list" id="doc-combobox-labels-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="urgent">Urgent</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="bug">Bug</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="idea">Idea</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-combobox', what: 'The wrapper. It positions the list, so it is the element the list is measured against.' },
            { name: '.kp-combobox__list', what: 'The floating list: its own surface, a boundary that survives whatever is behind it, and a maximum height it scrolls inside.' },
            { name: 'is-active', what: 'The keyboard’s position in the list. It is mirrored on hover so the mouse and the keyboard agree about what Enter would take.' },
            { name: 'hidden option', what: 'An option filtered out is hidden rather than removed, so the list the server wrote is still the list after typing.' },
            { name: '.kp-combobox__clear', what: 'The clear control inside the input, at the trailing edge.' },
            { name: '.kp-tag-list / .kp-tag', what: 'With tags on: the chosen values as removable chips above the input.' },
            { name: '.kp-tag__remove', what: 'The remove control on a tag. Its hover takes the destructive colour, and the tap target is widened by the tag rather than by growing the glyph.' },
            { name: '.kp-combobox__status', what: 'The live region that says how many options are left after each keystroke.' },
            { name: 'pastel', what: 'In pastel the list has its pass on its ::backdrop and lands on it, and closes as that backwards.' },
        ],
        accessibility: [
            'Built in — virtual focus: the highlight travels the list while the cursor stays in the input, so typing keeps working and the current option is announced.',
            'Built in — the number of matches is announced after typing, which is the single most-skipped part of every hand-written combobox.',
            'Built in — Escape closes the list, Enter takes the highlight, and the input keeps its own expanded state in step.',
            'Yours — write the options with a value and a label. The module filters and announces what is there; it fetches nothing.',
            'Yours — give the input a label and the list a name, and give every tag’s remove button a name that includes the tag.',
            'Yours — keep the status paragraph in the markup. Without it the list is silent to anyone who cannot see it.',
        ],
    },
    {
        id: 'datepicker',
        title: 'Date picker',
        group: 'Forms',
        classes: ['kp-datepicker'],
        exports: ['DatePicker'],
        aliases: ['date', 'day', 'month', 'year', 'view', 'min', 'max', 'week-starts-on', 'close-on-select', 'next-glyph', 'previous-glyph', 'disabled', 'disabled-days', 'locale', 'align', 'overlay-side'],
        intro: 'A text input that takes a typed date, with a calendar beside it for the reader who would rather look. The value is kept as an ISO date whatever the page’s locale prints, so a consumer never parses a localised string.',
        whenToUse:
            'For a date a person knows or can find in a month — a start date, a deadline. Not for a birth date far in the past, where three selects or a typed field beat paging a calendar back forty years; and not for a date the browser can own entirely, where the native date input is smaller and already localised.',
        examples: [
            {
                title: 'Typed, with the calendar as an aid',
                why: 'Typing always works and the grid never has to open, which is what keeps the control usable for someone who would otherwise be walked through thirty-one buttons. The panel is built when it is opened rather than written by the server.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker>
<div class="kp-field">
<label class="kp-field__label" for="doc-date-from">From</label>
<input class="kp-field__input" id="doc-date-from" type="text" inputmode="numeric" placeholder="dd/mm/yyyy" data-kp-date-input />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
            {
                title: 'The locale\u2019s own order, by attribute',
                why: 'Added 2026-10-15 (`datetime-M1`). A date is written dd/mm/yyyy for every reader (rule 52), whatever the page\u2019s language, so `04/09/2026` is the fourth of September in New York as in Brussels. `data-kp-date-format="locale"` on the picker brings back the order and separator the locale writes: this picker is `en-US`, so the field is written, hinted and read month first (`09/04/2026`, `mm/dd/yyyy`); in script it is `attachDatePickers(root, { dateFormat: \'locale\' })`. The value the module keeps is the ISO date either way, and the month and weekday names always follow the locale.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker data-kp-locale="en-US" data-kp-date-format="locale">
<div class="kp-field">
<label class="kp-field__label" for="doc-date-us">Delivery (month first)</label>
<input class="kp-field__input" id="doc-date-us" type="text" inputmode="numeric" data-kp-date-input value="09/04/2026" />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
            {
                title: 'A range with a floor and weekends closed',
                why: 'The bounds and the closed days are declared on the markup, so a server that already knows them does not have to repeat them in script.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker data-kp-min="2026-01-01" data-kp-max="2026-12-31" data-kp-disabled-days="0,6">
<div class="kp-field">
<label class="kp-field__label" for="doc-date-visit">Visit</label>
<input class="kp-field__input" id="doc-date-visit" type="text" inputmode="numeric" data-kp-date-input />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-datepicker__panel', what: 'The calendar, floating under the input on its own surface. It is rendered when it opens because a month grid is derived from a date.' },
            { name: '.kp-datepicker__head / __title', what: 'The month, its name, and the two controls that page it. The title is a button that opens the twelve months of the year, and there the year opens twelve years.' },
            { name: 'month and year grids', what: 'Twelve cells, three a row, drawn with the day’s class so every theme paints them; the panel keeps the size the days had. Choosing a year shows its months, a month its days.' },
            { name: 'data-kp-date-format', what: '`rule52` (the default): the field is written, hinted and read dd/mm/yyyy whatever the locale; `locale`: the order and separator the locale writes (09/04/2026 under en-US, 04.09.2026 under de-DE). Script: `dateFormat: \'locale\'` in the options of attachDatePickers; React: the `dateFormat="locale"` prop of DatePicker (default `"rule52"`). The ISO value does not change.' },
            { name: '.kp-datepicker__grid / __weekday', what: 'Seven columns with the week starting where the locale says, unless the markup overrules it.' },
            { name: '.kp-datepicker__day', what: 'One day. Exactly one of them is in the tab order at a time; the arrows move between the rest.' },
            { name: 'selected day', what: 'Carries a boundary as well as a fill, so it is still the chosen day when the fill matches the hover.' },
            { name: 'disabled day', what: 'Outside the bounds or on a closed weekday: present, marked, and refusing the click.' },
            { name: 'pastel', what: 'In pastel the date picker’s panel has its pass on its ::backdrop and lands on it; it closes as that backwards, and the focus returns to the input when it has closed.' },
        ],
        accessibility: [
            'Built in — the focus returns to the input when the picker has closed, not at the start of the close.',
            'Built in — the grid is a real grid: arrows by day, Page keys by month, Home and End to the ends of the week, and one tab stop for the whole month.',
            'Built in — the month and year grids take the same keys a size up, Escape steps back one grid, and the grid that opens is named and announced.',
            'Built in — typing is a complete route to a date, so nobody is forced through the calendar at all.',
            'Built in — the month and the chosen date are announced when they change, in the page’s own locale.',
            'Yours — label the input and name the button that opens the calendar.',
            'Yours — read the ISO value the module keeps rather than the text on screen, which is localised.',
            'Yours — say what format you expect near the field; a placeholder disappears the moment someone types.',
        ],
    },
    {
        id: 'colorpicker',
        title: 'Colour picker',
        group: 'Forms',
        classes: ['kp-colorpicker'],
        exports: ['ColorPicker'],
        aliases: ['color', 'swatch', 'against', 'channel', 'follow', 'contrast-ok'],
        intro: 'Three labelled sliders, a swatch, and the number that makes this one different: the WCAG contrast ratio of the chosen colour against the current theme’s own background, measured with the same function the contrast gate uses.',
        whenToUse:
            'Where somebody picks a colour that text or a boundary will later have to survive on — a status colour, a label, a theme of their own. Not as a general colour wheel: three sliders are exact and operable from the keyboard, but they are slower than a canvas for browsing. Not for choosing from a fixed set either; that is a row of swatch buttons.',
        examples: [
            {
                title: 'A picker measured against the page background',
                why: 'The verdict is a sentence in a live region, not a green tick: the colour is the second carrier, never the only one. Sliders rather than a canvas, because a canvas needs a pointer.',
                markup: `
<div class="kp-colorpicker" data-kp-colorpicker data-kp-against="--background">
<label class="kp-field__label" for="doc-color-h">Hue</label>
<input id="doc-color-h" type="range" data-kp-channel="h" min="0" max="360" value="220" />
<label class="kp-field__label" for="doc-color-s">Saturation</label>
<input id="doc-color-s" type="range" data-kp-channel="s" min="0" max="100" value="90" />
<label class="kp-field__label" for="doc-color-l">Lightness</label>
<input id="doc-color-l" type="range" data-kp-channel="l" min="0" max="100" value="56" />
<span class="kp-colorpicker__swatch" data-kp-swatch aria-hidden="true"></span>
<output class="kp-colorpicker__value" data-kp-colorpicker-value></output>
<p class="kp-colorpicker__contrast" data-kp-colorpicker-contrast role="status" aria-live="polite"></p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-colorpicker__channel', what: 'One label and its slider. The wrapper contributes nothing to the box tree, so the three pairs line up as one grid.' },
            { name: '.kp-colorpicker__swatch', what: 'The chosen colour, with a boundary — a pale swatch on a pale card is otherwise an invisible square.' },
            { name: '.kp-colorpicker__value', what: 'The colour in numbers, in the mono face, so it can be read back and copied.' },
            { name: '.kp-colorpicker__contrast', what: 'The verdict. It takes the destructive colour while the ratio fails and the quiet one once it passes.' },
            { name: 'measured against another token', what: 'The comparison surface is declared on the markup: a card, a primary plate, or the page itself.' },
            { name: 'following the theme', what: 'The picker can re-measure when the page’s theme changes, so the same colour is judged again against the new background.' },
        ],
        accessibility: [
            'Built in — three range inputs are operable from the keyboard, announced with their values, and give exact numbers back; a canvas gradient does none of that.',
            'Built in — the verdict is words in a live region, so it reaches someone who cannot compare the two colours by eye.',
            'Built in — the swatch is marked decorative, because the value beside it is the thing that carries the information.',
            'Yours — label each of the three sliders. They are hue, saturation and lightness only if something says so.',
            'Yours — decide what the ratio has to clear. The picker measures; it does not refuse.',
        ],
    },
    {
        id: 'upload',
        title: 'File upload',
        group: 'Forms',
        classes: ['kp-upload'],
        exports: ['Upload'],
        aliases: ['drop', 'max-bytes', 'max-files', 'max-total', 'remove-glyph', 'locale', 'dragging'],
        intro: 'A drop zone that is a label over a real file input, a list of the chosen files, and a per-file state the consumer drives: progress, done, or an error with its reason. The sending stays yours.',
        whenToUse:
            'Wherever a person attaches files. Not as an upload client — the request, the retry and the endpoint are the application’s, and a component that owned them would have to know your auth. Not for a single hidden image swap either, where a plain file input with a label is the whole story.',
        examples: [
            {
                title: 'A drop zone with a size limit',
                why: 'The zone is a label pointing at a real file input: Tab reaches it, Enter opens the picker, and a screen reader announces a file field rather than a mysterious box. Dropping is added on top and is nobody’s only route in.',
                markup: `
<div class="kp-upload" data-kp-upload data-kp-max-bytes="5000000" data-kp-max-files="5">
<input type="file" multiple class="kp-sr-only" id="doc-upload-files" data-kp-upload-input />
<label class="kp-upload__zone" for="doc-upload-files" data-kp-upload-zone>Drop files here or choose them</label>
<ul class="kp-upload__list" data-kp-upload-list></ul>
</div>
`,
            },
            {
                title: 'What a row looks like while it is sending, and when it failed',
                why: 'The rows are normally written by the module as files arrive; printed here so the states can be seen at rest. The bar is one element filled by a gradient stop rather than a second element kept in step by hand.',
                markup: `
<ul class="kp-upload__list">
<li class="kp-upload__file" data-state="uploading">
<span>quarterly-report.pdf</span><span class="kp-upload__size">1.2 MB</span>
<span class="kp-upload__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" aria-label="Uploading quarterly-report.pdf"></span>
</li>
<li class="kp-upload__file" data-state="error">
<span>holiday.mov</span><span class="kp-upload__size">210 MB</span>
<span class="kp-upload__message">Larger than the 5 MB limit.</span>
</li>
</ul>
`,
            },
        ],
        variants: [
            { name: '.kp-upload__zone', what: 'The target. It is a label, which is what makes it operable without a pointer.' },
            { name: 'dragging', what: 'While files are over the zone it takes the primary boundary and the page’s full ink.' },
            { name: '.kp-upload__file', what: 'One row: name, size, and room underneath for a bar or a message.' },
            { name: '.kp-upload__bar', what: 'Progress, as a fill across the row rather than a separate element.' },
            { name: '.kp-upload__message', what: 'Why a file was refused, or what is happening to it, in words under the row.' },
            { name: 'error', what: 'A refused or failed row takes the destructive boundary and its message the destructive colour.' },
        ],
        accessibility: [
            'Built in — the real file input stays in the tab order under the zone, so the keyboard route is the same one the pointer uses.',
            'Built in — a refusal is a sentence in the row, and sizes are printed in the page’s locale rather than in one hard-coded format.',
            'Built in — removing a file is a button with a name, and the removal is an event a consumer can refuse.',
            'Yours — send the files and report back what happened; the component shows the outcome you give it.',
            'Yours — say what is allowed before the reader picks: the types, the size and how many.',
            'Yours — keep the file input in the markup even though it is visually hidden. Hiding it with display none takes it out of the tab order.',
        ],
    },
    {
        id: 'wizard',
        title: 'Wizard',
        group: 'Forms',
        classes: ['kp-wizard'],
        exports: ['Wizard'],
        aliases: ['step', 'step-label', 'navigable', 'finish', 'validate', 'focus-step', 'next'],
        intro: 'A form in steps, with an indicator that says where you are and what is still coming. It borrows the form’s validation rather than repeating it, so a step that will not validate does not advance.',
        whenToUse:
            'When a long form has a natural order and the later parts depend on the earlier ones. Not to hide the length of a form the reader could have filled in one screen — steps make a short form feel long. Not for anything the reader may want to fill in out of order either: that is a page with sections.',
        examples: [
            {
                title: 'Two steps, a back and a next',
                why: 'The indicator is an ordered list rather than a row of dots: the steps have names and a number, which is what “step two of four” needs in order to be said out loud.',
                markup: `
<div class="kp-wizard" data-kp-wizard>
<ol class="kp-wizard__steps">
<li data-kp-step-label>Details</li>
<li data-kp-step-label>Review</li>
</ol>
<p data-kp-wizard-status role="status" aria-live="polite"></p>
<section data-kp-step>
<div class="kp-field">
<label class="kp-field__label" for="doc-wizard-name">Name</label>
<input class="kp-field__input" id="doc-wizard-name" required />
</div>
</section>
<section data-kp-step hidden>Ready to send.</section>
<div class="kp-wizard__actions">
<button type="button" class="kp-button" data-kp-wizard-back>Back</button>
<button type="button" class="kp-button kp-button--primary" data-kp-wizard-next>Next</button>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-wizard__steps', what: 'The indicator. Each step is numbered by the stylesheet rather than by markup, so inserting one renumbers the rest.' },
            { name: 'current step', what: 'Marked by weight, by a filled circle, and by the current-step attribute — three carriers, one of which survives without colour.' },
            { name: 'done step', what: 'Its number becomes a check in the success colour.' },
            { name: 'navigable labels', what: 'The step labels can be made clickable, for a wizard whose earlier steps stay open.' },
            { name: '.kp-wizard__actions', what: 'The back and next pair, at the end of the current step.' },
            { name: '--kp-wizard-padding', what: 'The room between the frame a theme draws and what is inside it, 1rem by default.' },
            { name: 'held transition', what: 'A step change can be refused or delayed by a listener or an async check, which is what a step that needs a server answer was missing.' },
            { name: 'pastel', what: 'In pastel a wizard is stuck to the page with a strip of washi tape across its top-start corner.' },
        ],
        accessibility: [
            'Built in — the current step is marked with the attribute that exists for exactly this, which is what a screen reader announces on arrival.',
            'Built in — the status line says which step you are on out loud when it changes.',
            'Built in — the step that becomes visible takes focus, so the keyboard does not stay behind on the previous panel.',
            'Yours — validate on the server as well; a wizard that will not advance is a courtesy, not a guard.',
            'Yours — name each step in a word or two. “Step 2” tells the reader nothing about what is in it.',
            'Yours — let people go back. A step that cannot be revisited turns a typo into a restart.',
        ],
    },
    {
        id: 'table',
        title: 'Table',
        group: 'Data',
        classes: ['kp-table', 'kp-table-wrap', 'kp-cell-break', 'kp-cell-truncate', 'kp-col-low'],
        exports: ['Table'],
        aliases: ['region'],
        intro: 'The plain table: header, rows, tabular numerals, and a wrapper that scrolls a wide table inside its own box instead of pushing the page sideways. That box is a named region a keyboard can reach.',
        whenToUse:
            'For data the server already knows and the reader only reads. Reach for the data table instead as soon as sorting, filtering or paging is wanted. Do not use a table for layout — the row and grid classes of the layout layer are for that, and a layout table is announced to a screen reader as data with rows and columns.',
        examples: [
            {
                title: 'A table in its scroll region',
                why: 'The wrapper is upgraded on attach: it becomes focusable, takes the region role, and is named after the caption — so someone who cannot use a mouse can reach the scrollbar and is told which table they landed in.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Applications</caption>
<thead><tr><th scope="col">Company</th><th scope="col">Status</th><th scope="col">Amount</th></tr></thead>
<tbody>
<tr><td>Example Inc</td><td>Interview</td><td class="kp-numeric">1,284.50</td></tr>
<tr><td>Second Ltd</td><td>Offer</td><td class="kp-numeric">998.00</td></tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'Cells that do not fit, and a column that may go',
                why: 'Two different problems: an identifier is one unbreakable word that widens the whole table, and a sentence is prose that should be cut with the full value still in the cell. The low-priority column is dropped at the same width the rows become cards.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Deliveries</caption>
<thead><tr><th scope="col">Key</th><th scope="col">Note</th><th scope="col" class="kp-col-low">Updated</th></tr></thead>
<tbody>
<tr>
<td class="kp-cell-break">7f3a9c21-4e18-4b7d-9f02-6d5e8a1c0b44</td>
<td class="kp-cell-truncate" title="Left with a neighbour who was not in when the courier came back">Left with a neighbour who was not in when the courier came back</td>
<td class="kp-col-low kp-timestamp">2026-09-06 14:07</td>
</tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'Rows as cards in a narrow container',
                why: 'Opt-in, because every table that already ships would otherwise change shape in a minor release. The width that decides is the width of the table’s own container, not the window’s, so a table in a narrow column falls into cards on a wide page.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table" data-kp-cards>
<caption>Orders</caption>
<thead><tr><th scope="col">Customer</th><th scope="col">Amount</th></tr></thead>
<tbody>
<tr><td data-label="Customer">Acme</td><td data-label="Amount" class="kp-numeric">100.00</td></tr>
<tr><td data-label="Customer">Bakker</td><td data-label="Amount" class="kp-numeric">20.00</td></tr>
</tbody>
</table>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-table', what: 'The table itself: collapsed borders, quiet header ink, and same-width digits so a column of numbers does not shimmer.' },
            { name: '.kp-table-wrap', what: 'The scroll box. It is also the element the card layout measures, so the query asks about the space the table actually has.' },
            { name: '.kp-cell-break', what: 'For identifiers: a long unbroken key wraps anywhere instead of widening every row.' },
            { name: '.kp-cell-truncate', what: 'For prose: one line with an ellipsis, the whole value still in the cell for a reader, a search and a copy.' },
            { name: '.kp-col-low', what: 'A column that disappears when the rows become cards. Header and cells together, because values with no column name are worse than no column.' },
            { name: 'cards', what: 'Opt-in on the table: below the threshold each row becomes a card and each cell carries its column name.' },
            { name: 'row hover', what: 'A quiet wash on the hovered row; it is not a selection, and nothing depends on it.' },
        ],
        accessibility: [
            'Built in — the scroll region gets a tab stop, a role and a name from the caption, which is the repair for a wide table nobody without a mouse could scroll.',
            'Built in — the card layout carries each column name into its cell, so a value never appears without its question.',
            'Built in — the wrapper keeps the page from scrolling sideways, which is what SC 1.4.10 asks for.',
            'Yours — write a caption. It is the table’s name, for the region as well as for a reader.',
            'Yours — mark header cells with their scope, and use a header cell for a row’s own label.',
            'Yours — put the column name on each cell if you turn the card layout on; nothing else can know it.',
        ],
    },
    {
        id: 'datatable',
        title: 'Data table',
        group: 'Data',
        classes: ['kp-datatable'],
        exports: ['DataTable'],
        aliases: [
            'sort',
            'select',
            'page',
            'row',
            'debounce',
            'locale',
            'cards',
            'filter',
            'filters',
            'search',
            'state',
            'max',
            'direction',
            // The seven of Kenny's form of 2026-09-13.
            'column',
            'expand',
            'expandable',
            'expanded',
            'fixed',
            'edit',
            'cell-class',
            'server',
            'total',
            // scope-90: the state that draws the sticky header's reach.
            'scrolled',
            'folded'],
        intro: 'Sorting, searching, paging and row selection over a table the server already rendered. It works on the rows that are in the document and owns no data; a table marked `data-kp-server` asks your `load` for each page instead.',
        whenToUse:
            'For a table a reader will interrogate — hundreds of rows, a search box, a sort on one column or several, a choice of columns, rows that open, values edited in place, arrow keys between cells. Not for thousands without a server behind it: there is no virtualisation, and export is the app’s, from the rows the table hands over. Not for a handful of rows either, where a search box over six lines is furniture.',
        examples: [
            {
                title: 'Search, sort, page and select',
                why: 'Everything is markup the server wrote, so the table is readable before any script runs. The status paragraph says which rows are showing after each change, which is what makes the filtering audible. A filter is declared on its header (`data-kp-filter="choice"`, `range` or `date`) and leaves a removable pill; `data-kp-sort-order` sorts a column by meaning; the "In" choice limits the search to one column; `data-kp-max-height` keeps the header in view; `data-kp-state="loading"` or `"failed"` shows those states, and `data-kp-cards` turns rows into cards with a sort control of their own.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-page-size="3" data-kp-cards>
<div class="kp-datatable__bar">
<input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the table" placeholder="Search…" />
<select class="kp-field__input kp-datatable__select" data-kp-datatable-scope></select>
<select class="kp-field__input kp-datatable__select" data-kp-datatable-density></select>
</div>
<div class="kp-datatable__actions" data-kp-datatable-actions hidden>
<span data-kp-datatable-selected-count></span>
<button type="button" class="kp-button kp-button--ghost" data-kp-datatable-clear-selection>Clear selection</button>
</div>
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Orders</caption>
<thead><tr>
<th scope="col"><input class="kp-field__check" type="checkbox" data-kp-select-all aria-label="Select every row on this page" /></th>
<th scope="col" data-kp-sort="text" data-kp-filter="choice">Customer</th>
<th scope="col" data-kp-sort="number" data-kp-filter="range">Amount</th>
<th scope="col" data-kp-sort="date" data-kp-filter="date">Date</th>
</tr></thead>
<tbody>
<tr data-kp-row-key="r0"><td><input type="checkbox" data-kp-select-row aria-label="Select Acme" /></td><td>Acme</td><td class="kp-numeric">100.00</td><td class="kp-timestamp">2026-03-01</td></tr>
<tr data-kp-row-key="r1"><td><input type="checkbox" data-kp-select-row aria-label="Select Bakker" /></td><td>Bakker</td><td class="kp-numeric">20.00</td><td class="kp-timestamp">2026-01-12</td></tr>
<tr data-kp-row-key="r2"><td><input type="checkbox" data-kp-select-row aria-label="Select Cerise" /></td><td>Cerise</td><td class="kp-numeric">1,284.50</td><td class="kp-timestamp">2026-09-04</td></tr>
<tr data-kp-row-key="r3"><td><input type="checkbox" data-kp-select-row aria-label="Select Delta" /></td><td>Delta</td><td class="kp-numeric">7.00</td><td class="kp-timestamp">2025-11-30</td></tr>
</tbody>
</table>
</div>
<div class="kp-empty" data-kp-datatable-empty hidden>Nothing found.</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
<div class="kp-datatable__pager" data-kp-datatable-pager></div>
</div>
</div>
`,
            },
            {
                title: 'Loading, with a layer over the rows',
                why: 'A table that is still asking: `data-kp-state="loading"` and `data-kp-busy-overlay` on the wrapper put a panel with the theme’s large spinner over the rows; the status line under the table says the same, and it is the one a screen reader hears. In pastel the panel is a plate with its own pass, stuck on as everything is, and it becomes caterpillar: a head on its top-end corner and legs along its foot, with the round-trip spinner on it.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-state="loading" data-kp-busy-overlay>
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Containers, loading again</caption>
<thead><tr><th scope="col">Stack</th><th scope="col">Container</th><th scope="col">State</th></tr></thead>
<tbody>
<tr><td>media</td><td>jellyfin</td><td>running</td></tr>
<tr><td>platform</td><td>traefik</td><td>running</td></tr>
<tr><td>platform</td><td>crowdsec</td><td>restarting</td></tr>
<tr><td>monitoring</td><td>grafana</td><td>running</td></tr>
</tbody>
</table>
</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
</div>
</div>
`,
            },
            {
                title: 'Several sort keys by plain click, sorted by a value, filtered by a word',
                why: '`data-kp-sort-multi="click"` makes a plain press on a header (Enter, Space) add a sort key and Shift + click sort on that column alone; the reset button and the sort summary are the ordinary ones. A cell’s `data-kp-sort-value` is what it sorts and range-filters by in place of its text: the size says “1.2 GB” and sorts by its bytes. A cell’s `data-kp-filter-value` is the word a choice filter lists and matches it by: the status cell shows a dot and a time, the filter offers “running” and “stopped”.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-sort-multi="click" data-kp-page-sizes="none">
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Backups</caption>
<thead><tr>
<th scope="col" data-kp-sort="text">Stack</th>
<th scope="col" data-kp-sort="text" data-kp-filter="choice">Status</th>
<th scope="col" data-kp-sort="number" class="kp-text-end">Size</th>
</tr></thead>
<tbody>
<tr data-kp-row-key="s0"><td>media</td><td data-kp-filter-value="running"><span class="kp-badge kp-badge--success">● 02:14</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="1200000000">1.2 GB</td></tr>
<tr data-kp-row-key="s1"><td>home</td><td data-kp-filter-value="stopped"><span class="kp-badge">○ 3 days ago</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="950000">950 KB</td></tr>
<tr data-kp-row-key="s2"><td>network</td><td data-kp-filter-value="running"><span class="kp-badge kp-badge--success">● 03:30</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="48000000">48 MB</td></tr>
<tr data-kp-row-key="s3"><td>docs</td><td data-kp-filter-value="running"><span class="kp-badge kp-badge--success">● 04:02</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="48000000">48 MB</td></tr>
</tbody>
</table>
</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
</div>
</div>
`,
            },
            {
                title: 'A group heading that stays with no row under it',
                why: '`data-kp-group-always` on a `tr[data-kp-row-group]` heading keeps it visible when no data row stands under it: here the second group is still loading (skeleton rows), the third failed (with a Retry in the heading) and the fourth is empty, with its reason. Without the attribute a heading with no row is hidden, as the rows are.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-page-sizes="none">
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Backup repositories by stack. Stacks with nothing to list still show their heading and say why.</caption>
<thead><tr><th scope="col" data-kp-sort="text">Repository</th><th scope="col" data-kp-sort="number" class="kp-text-end">Snapshots</th></tr></thead>
<tbody>
<tr data-kp-row-group="media"><th scope="rowgroup" colspan="2">Stack media <span class="kp-badge" data-kp-group-count></span></th></tr>
<tr data-kp-row-key="media-jellyfin" data-kp-group-of="media"><td>media-jellyfin</td><td class="kp-text-end kp-numeric">42</td></tr>
<tr data-kp-row-group="home" data-kp-group-always><th scope="rowgroup" colspan="2">Stack home (still loading) <span class="kp-badge" data-kp-group-count></span></th></tr>
<tr data-kp-skeleton-row aria-hidden="true"><td colspan="2"><span class="kp-skeleton" style="display: block; block-size: 1em"></span></td></tr>
<tr data-kp-row-group="platform" data-kp-group-always><th scope="rowgroup" colspan="2">Stack platform (failed) <span class="kp-badge" data-kp-group-count></span> <span class="kp-text-muted">Could not reach the repository.</span> <button type="button" class="kp-button kp-button--sm">Retry</button></th></tr>
<tr data-kp-row-group="lab" data-kp-group-always><th scope="rowgroup" colspan="2">Stack lab (no repositories) <span class="kp-badge" data-kp-group-count></span> <span class="kp-text-muted">No repository is configured for this stack.</span></th></tr>
</tbody>
</table>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-sort-multi="click"', what: 'A plain press on a header (Enter, Space) adds a sort key and Shift + click sorts on that column alone; without a value, Shift + click adds the key as it always did. `multiSort: \'click\'` is the same in script.' },
            { name: 'td data-kp-sort-value', what: 'The value a cell sorts and range- or date-filters by in place of its text: a bar cell’s share, a size’s bytes.' },
            { name: 'td data-kp-filter-value', what: 'The word a choice filter lists and matches a cell by in place of its text: a status cell with a dot and a time is filtered as “running”.' },
            { name: 'data-kp-group-always', what: 'On a `tr[data-kp-row-group]` heading: it stays visible with no data row under it (loading, failed with a Retry in the heading, empty with the reason). Without it the heading is hidden with its rows.' },
            { name: 'the busy card', what: 'The loading card of a busy table (`.kp-datatable__busy-overlay.kp-datatable__busy-card` over a `.kp-datatable__busy-panel`: the theme’s spinner and words) is `openBusyCard(host, { words, area, className, arrive })` in `js/busy-card.js` (`BUSY_CARD` selects it), and the heat grid, matrix and run timeline lay the same one over their cells and lanes. A container named `kp-busy-card` lays the panel flat over a short area.' },
            { name: 'data-kp-folded', what: 'Written on a group row (`tr[data-kp-row-group]`) while its members are folded away; `fold()` and `view().folded` read and set it.' },
            {
                name: 'loading, on a phone',
                what: 'In a table under 30rem the busy layer lies flat over the skeleton rows: the spinner beside the words, the words kept to three lines (the status line says all of it), the layer clipped to the table [scope-143].',
            },
            { name: '.kp-datatable__bar', what: 'A row of controls above or below the table: the search box, the status line, the pager.' },
            { name: '.kp-datatable__sort', what: 'The sort control inside a header cell. It wears the header’s own case and spacing, and a click anywhere in the header sorts.' },
            { name: '.kp-datatable__filters / __pills', what: 'The filter panel the headers declare, and the removable pills of the filters that are set.' },
            { name: '.kp-datatable__actions', what: 'The action bar a selection shows, with the count; the buttons in it are the app’s.' },
            { name: '.kp-datatable__card-sort', what: 'The sort control of the card layout, where the headers that sort are hidden.' },
            { name: '.kp-datatable__select / __label', what: 'A choice in a bar: the "In" choice, the density, the rows per page.' },
            { name: 'sorted ascending / descending', what: 'An arrow after the header text and the sort state on the header itself; the arrow is the second carrier, the state is what is announced.' },
            { name: '.kp-datatable__pager / __page', what: 'The page controls and the “page m of n” label, in same-width digits.' },
            { name: '.kp-datatable__page-size', what: 'The rows-per-page control, before the pager.' },
            { name: '.kp-datatable__sort-order / __sort-summary', what: 'With `data-kp-sort-multi`: each sorted header’s place in the sort, and the sort said in words above the table.' },
            {
                name: 'data-kp-sort-external',
                what: 'The page sorts: a header press draws the arrow, `aria-sort`, the key numbers, the summary and Reset, remembers the sort and fires `kp-datatable-sort`; the rows keep the order the page renders, which it changes and then calls `refresh()` (`view().sorts` has every key). A sortable header with `aria-disabled="true"` cannot be pressed now and keeps an arrow it already has. Also the `sortExternal` option.',
            },
            { name: '.kp-datatable__columns / __column-option', what: 'With `data-kp-column-menu`: the menu of columns, on the popover layer, and one checkbox per column; the key column is locked.' },
            { name: '.kp-datatable__expand / __detail', what: 'With `data-kp-expandable`: the button that opens a row, and the detail row under it that spans every column.' },
            { name: 'fixed columns', what: 'With `data-kp-fixed-columns`: the key column stays at the left edge on an opaque ground, with a hairline, while the box scrolls sideways.' },
            { name: '.kp-datatable__edit / __editor / __edit-log', what: 'With `data-kp-edit` on a header: a value as a button with a dashed underline, the package’s control that edits it in the cell, and the line that says what changed, with Undo.' },
            { name: '.kp-datatable__grid-readout', what: 'With `data-kp-grid`: the table is an ARIA grid, and this line says which cell has the focus.' },
            { name: '.kp-datatable__status', what: 'The live region that says how many rows are showing after a search, a sort or a page.' },
            { name: '.kp-datatable__search', what: 'The search box. Typing is debounced so a long list is not re-sorted on every keystroke.' },
            { name: 'empty', what: 'When a filter matches nothing the empty state takes the table’s place rather than leaving a header over nothing.' },
            { name: 'clickable rows', what: 'A row can be marked as a control, which gives it the pointer cursor and an activation of its own.' },
            { name: 'pastel: the busy panel', what: 'In pastel the busy panel draws its own plate and pass and lands on it as every part does, leaves as that backwards, and while it waits it becomes caterpillar (a head on its corner, stepping legs) with the round-trip spinner on it.' },
        ],
        accessibility: [
            'Built in — every sortable header is a real button inside the cell, so sorting is reachable without a pointer.',
            'Built in — the sort state, the row count and the current page are announced in words, not only drawn.',
            'Built in — numbers and dates are read in the page’s locale, so a sort agrees with what the reader sees.',
            'Yours — give every row a stable key if you care which rows are selected after a sort.',
            'Yours — name the search box and every row checkbox; “select row” is not a name when there are forty of them.',
            'Yours — render the rows on the server. This works on what is there; a table that appears only after a script has run is an empty box on first paint.',
        ],
    },
    {
        id: 'tree',
        title: 'Tree',
        group: 'Data',
        classes: ['kp-tree'],
        exports: ['Tree'],
        aliases: ['typeahead', 'selectable', 'click'],
        intro: 'A nested list a keyboard can walk: arrows move and open, Home and End jump to the ends, and typing a few letters finds the next matching item. The twisty points the way the branch will go rather than the way it is.',
        whenToUse:
            'For a hierarchy the reader browses — a file list, a category tree, a menu of settings. Not for a flat list of options, which is a listbox and cheaper in every way. Not for navigation that could be links: a tree that replaces a nav takes the middle click and the address bar away.',
        examples: [
            {
                title: 'A tree with one closed branch',
                why: 'A closed branch is skipped by the arrows, because Down should go to the next thing you can see; walking into a folder that is shut is the bug that makes a tree feel broken rather than merely awkward.',
                markup: `
<ul class="kp-tree" role="tree" data-kp-tree aria-label="Project files">
<li role="treeitem" aria-expanded="false">Components
<ul role="group">
<li role="treeitem">button.jsx</li>
<li role="treeitem">card.jsx</li>
</ul>
</li>
<li role="treeitem" aria-expanded="true">Styles
<ul role="group">
<li role="treeitem">components.css</li>
</ul>
</li>
<li role="treeitem">README.md</li>
</ul>
`,
            },
        ],
        variants: [
            { name: 'expanded / collapsed', what: 'The twisty is a second carrier beside the expanded state, and a collapsed branch is out of the walk as well as out of sight.' },
            { name: 'row inset', what: 'Where a row\u2019s text starts at the root level, before the depth adds its indent: a knob (listed in the table of knobs below), 0.375rem by default. A theme with a wider row padding (cyberpunk) sets it, so a row keeps its inset in every theme.' },
            { name: 'selected', what: 'Selection is separate from the highlight: a click can select or toggle, and which one it does is a choice.' },
            { name: 'depth', what: 'The indent per level is a measure the tree sets from its own depth, so a deep branch does not need a class per level.' },
            { name: 'typeahead', what: 'Typing letters jumps to the next item that starts with them; it can be turned off for a tree whose labels are numbers.' },
            { name: 'hover', what: 'A quiet ground on the item under the pointer. It is not selection and nothing depends on it.' },
        ],
        accessibility: [
            'Built in — the whole tree is one tab stop and the arrows move within it, which is the pattern a screen reader expects.',
            'Built in — expanding, collapsing and selecting are events, so a consumer can persist what the reader opened.',
            'Built in — the open state is on the item itself, so it is announced rather than inferred from the twisty.',
            'Yours — write the roles and the nesting. The module drives markup that is already a tree; it does not build one.',
            'Yours — give the tree a name, or a reader who lands in it is told only “tree”.',
            'Yours — keep the labels short. They are read one at a time as the arrows move.',
        ],
    },
    {
        id: 'reorder',
        title: 'Reorder list',
        group: 'Data',
        classes: ['kp-reorder'],
        exports: ['Reorder'],
        aliases: ['item', 'handle', 'label', 'pointer', 'dragging'],
        intro: 'A list whose items can be moved: a real grab handle that moves an item with the arrow keys, and a pointer drag beside it. Every move is announced in words and reported as the new order.',
        whenToUse:
            'When the order is the data — a playlist, a checklist, columns in a report. Not for sorting by a property, which belongs to the table and needs no dragging. Not for a list of two: a pair is better served by a swap.',
        examples: [
            {
                title: 'Three items with a handle each',
                why: 'The handle is a real button, not a decorative grip: it has to be reachable by Tab or the arrow keys have nothing to act on. Dragging is the easy half and the platform gives it away.',
                markup: `
<ul class="kp-reorder" data-kp-reorder aria-label="Report columns">
<li data-kp-item="name"><button type="button" data-kp-handle aria-label="Move Name">⠿</button> Name</li>
<li data-kp-item="amount"><button type="button" data-kp-handle aria-label="Move Amount">⠿</button> Amount</li>
<li data-kp-item="date"><button type="button" data-kp-handle aria-label="Move Date">⠿</button> Date</li>
</ul>
`,
            },
        ],
        variants: [
            { name: 'keyboard move', what: 'With the handle focused the arrows move the item and the list says where it went.' },
            { name: 'pointer drag', what: 'The same move with a pointer, added beside the keyboard rather than instead of it.' },
            { name: 'dragging', what: 'While an item is being moved it is marked, so the stylesheet can lift it out of the row.' },
            { name: 'item label', what: 'The name used in the announcement can be the item’s own text or a label element inside it.' },
        ],
        accessibility: [
            'Built in — the whole gesture exists on the keyboard, which is the half a drag library leaves out.',
            'Built in — each move is announced (“Amount, position two of three”) through the dictionary, so it can be translated.',
            'Built in — the new order is an event, so the consumer stores what the reader arranged.',
            'Yours — name each handle after the item it moves; “drag” repeated six times is not a name.',
            'Yours — give every item a stable identifier, or the order you get back cannot be applied to your data.',
            'Yours — save the order. The list reports the move and forgets it.',
        ],
    },
    {
        id: 'grid-layout',
        title: 'Movable grid layout',
        group: 'Data',
        classes: ['kp-grid', 'kp-grid-wrap'],
        exports: ['GridLayout'],
        aliases: ['tile', 'columns', 'rows', 'commit', 'label', 'step', 'pointer', 'dragging'],
        intro: 'A dashboard the reader arranges: tiles on a coarse grid that move with the arrow keys and resize with Shift and the arrows, and a layout that can be handed back to be stored. Dragging exists too, and it is the half that was easy.',
        whenToUse:
            'For a dashboard whose readers do not agree about what matters. Not for a page whose layout you decide — the automatic grid of the layout layer is a class, needs no script and cannot be knocked out of shape. Not on a phone: below the narrow threshold the arrangement stops being an arrangement and becomes one column in source order.',
        examples: [
            {
                title: 'Three tiles on a six-column grid',
                why: 'The position lives in attributes rather than in inline styles, because the consumer stores the numbers and the stylesheet turns them into a grid area. Reading a layout back out of a style string is how a dashboard loses somebody’s arrangement. The wrapper is what the narrow rule measures: a container query styles a container’s contents, never the container itself, so the element that changes column count cannot be the one that is the container. GridLayout renders it for you.',
                markup: `
<div class="kp-grid-wrap">
<div class="kp-grid" data-kp-grid data-kp-columns="6">
<div class="kp-grid__tile" data-kp-tile="cpu" data-kp-label="CPU" data-x="0" data-y="0" data-w="2" data-h="1" tabindex="0" role="group">CPU</div>
<div class="kp-grid__tile" data-kp-tile="ram" data-kp-label="RAM" data-x="2" data-y="0" data-w="2" data-h="1" tabindex="0" role="group">RAM</div>
<div class="kp-grid__tile" data-kp-tile="disk" data-kp-label="Disk" data-x="4" data-y="0" data-w="2" data-h="2" tabindex="0" role="group">Disk</div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-grid__tile', what: 'One tile. It is a tab stop, because moving it is a keyboard gesture first and a drag second.' },
            { name: 'moving / resizing', what: 'Arrows move, Shift and the arrows resize, and the tile says where it is and how big it is in words.' },
            { name: 'dragging', what: 'While a pointer is moving a tile it is marked, so the stylesheet can show it leaving its place.' },
            { name: '.kp-grid-wrap', what: 'The box the grid measures itself against. Below the narrow threshold it is the wrapper’s width that decides, not the window’s, so a grid in a 300px panel of a wide page collapses too.' },
            { name: 'narrow', what: 'Below the narrow threshold the grid becomes one column in source order: a six-column dashboard on a phone is six columns of nothing.' },
            { name: 'commit', what: 'A drag reports its final layout once the movement settles rather than on every pixel.' },
        ],
        accessibility: [
            'Built in — every gesture has a keyboard equivalent, and the keyboard one is the one the browser suite drives.',
            'Built in — a tile keeps its own name and gets its geometry as a description, so the announcement is “CPU, two by one at column one” rather than a number salad instead of the name.',
            'Built in — the layout is reported as data and can be applied again, so a reader’s arrangement survives a reload.',
            'Yours — name every tile. A group with no name is announced as a group.',
            'Yours — store the layout you are handed; the grid does not.',
            'Yours — keep a sensible source order, because that is the order on a narrow screen and for a screen reader.',
        ],
    },
    {
        id: 'timeline',
        title: 'Timeline',
        group: 'Data',
        classes: ['kp-timeline'],
        exports: ['Timeline'],
        intro: 'An ordered list of things that happened, each with its moment and a marker down the left. The rule between markers is drawn on the marker itself, so a one-item timeline has no line hanging under it.',
        whenToUse:
            'For a history in order — releases, an audit trail, the states an application passed through. Not for a schedule of what is still to come, where a list with dates reads better than a line. Not as a chart: this is prose in order, not a measurement of time.',
        examples: [
            {
                title: 'Two events',
                why: 'The moment is a time element and the marker is decorative, so the entry reads as “2026-09-04 14:07, version 1.1.0 released” rather than as a bullet with a date attached.',
                markup: `
<ol class="kp-timeline">
<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>
<span><time class="kp-timeline__when" datetime="2026-09-04T14:07">2026-09-04 14:07</time>Version 1.1.0 released</span></li>
<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>
<span><time class="kp-timeline__when" datetime="2026-09-04T12:27">2026-09-04 12:27</time>Version 1.0.0 released</span></li>
</ol>
`,
            },
        ],
        variants: [
            { name: '.kp-timeline__item', what: 'One entry: a marker column and the text beside it.' },
            { name: '.kp-timeline__marker', what: 'The dot, and the rule to the next entry — except on the last, which draws no line.' },
            { name: '.kp-timeline__when', what: 'The moment, quiet, above the text, in same-width digits so a column of times lines up.' },
        ],
        accessibility: [
            'Built in — the markers are decorative and the list is an ordered list, so the order is announced rather than drawn only.',
            'Yours — use a time element with a machine-readable moment; the printed text is for the reader.',
            'Yours — put the newest entry where your readers expect it, and say which end that is if the order could be either.',
        ],
    },
    {
        id: 'diff',
        title: 'Diff',
        group: 'Data',
        classes: ['kp-diff'],
        exports: ['Diff'],
        intro: 'Two versions of a text side by side in one column: a line number, a sign, and the line. The sign has a column of its own, so the difference survives printing, high contrast, and a reader who cannot tell green from red.',
        whenToUse:
            'For showing what changed in something textual — a configuration, a record, a theme’s tokens. Not for a review tool with comments and threads, which is an application rather than a component. Not for two long documents: this is a rendering, not a diff algorithm.',
        examples: [
            {
                title: 'One line changed',
                why: 'Colour is the second carrier here, never the only one. Removing the tints leaves a diff that still reads correctly.',
                markup: `
<pre class="kp-diff">
<span class="kp-diff__line" data-kind="same"><span class="kp-diff__number">1</span><span class="kp-diff__sign"> </span><span>--background: 0 0% 100%;</span></span>
<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">2</span><span class="kp-diff__sign">-</span><span>--primary: 220 90% 56%;</span></span>
<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">2</span><span class="kp-diff__sign">+</span><span>--primary: 220 90% 48%;</span></span>
</pre>
`,
            },
            {
                title: 'Two hunks, each with its @@ header',
                why: 'A hunk opens with a row of its own: the range (`@@ -a,b +c,d @@`) and, optionally, the place it sits in, wrapped in `.kp-diff__hunk-context` so the range reads as the quiet part. The header is a band with a rule under it, and a rule over it from the second hunk on.',
                markup: `
<pre class="kp-diff">
<div class="kp-diff__hunk">@@ -4,3 +4,3 @@ <span class="kp-diff__hunk-context">[retention]</span></div>
<span class="kp-diff__line" data-kind="same"><span class="kp-diff__number">4</span><span class="kp-diff__sign"> </span><span>keep_daily = 7</span></span>
<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">5</span><span class="kp-diff__sign">-</span><span>keep_weekly = 4</span></span>
<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">5</span><span class="kp-diff__sign">+</span><span>keep_weekly = 8</span></span>
<div class="kp-diff__hunk">@@ -20,2 +20,2 @@ <span class="kp-diff__hunk-context">[target]</span></div>
<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">20</span><span class="kp-diff__sign">-</span><span>path = /mnt/old</span></span>
<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">20</span><span class="kp-diff__sign">+</span><span>path = /mnt/backup</span></span>
</pre>
`,
            },
        ],
        variants: [
            { name: '.kp-diff__hunk', what: 'The `@@` header row that opens a block of changes: a muted band with a rule under it, and a rule over it from the second hunk on. It wraps long headers instead of widening the block.' },
            { name: '.kp-diff__hunk-context', what: 'Optional: wraps the text after the range (the function or section the hunk sits in) in the foreground colour. A header may be one text node without it.' },
            { name: 'same', what: 'Context: no tint, a blank sign, the line as it is.' },
            { name: 'added', what: 'A wash of the success colour behind the line, and a plus in the sign column.' },
            { name: 'removed', what: 'A wash of the destructive colour, and a minus.' },
            { name: '.kp-diff__number', what: 'The line number, quiet, right-aligned, in same-width digits.' },
            { name: 'long lines', what: 'The block scrolls sideways inside its own boundary rather than widening the page.' },
        ],
        accessibility: [
            'Built in — the sign is text in its own column, which is the carrier that survives without colour.',
            'Built in — the lines keep their whitespace, so indentation is part of what is compared.',
            'Yours — say what the two sides are above the block. “Added” and “removed” are relative to something.',
            'Yours — keep the numbers if the reader may need to point at a line.',
        ],
    },
    {
        id: 'copyable',
        title: 'Copyable value',
        group: 'Data',
        classes: ['kp-copyable'],
        exports: ['Copyable'],
        aliases: ['copy', 'copied'],
        intro: 'A value in the mono face with a button beside it that copies it and then says so, in words on the button, for as long as the confirmation lasts. When the clipboard refuses, that is said too.',
        whenToUse:
            'For a value someone has to paste somewhere else — a token, an identifier, a command. Not for prose, which is selected and copied the ordinary way. Not for a secret you would rather nobody copied by accident: the button makes it one click.',
        examples: [
            {
                title: 'A token with a copy button',
                why: 'The confirmation is words on the button rather than a green flash, because a flash is invisible to a screen reader and to anyone who looked away.',
                markup: `
<span class="kp-copyable">
<span class="kp-copyable__value" id="doc-copy-token">a3f9-2b71</span>
<button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="doc-copy-token">Copy</button>
</span>
`,
            },
            {
                title: 'Copying a value that is not on screen',
                why: 'The button can carry the text itself, for a value that is shortened on screen or not shown at all.',
                markup: `
<span class="kp-copyable">
<span class="kp-copyable__value">https://example.test/i/a3f9…</span>
<button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy data-kp-copy-value="https://example.test/invite/a3f9-2b71-0c4d" aria-label="Copy the invitation link">Copy</button>
</span>
`,
            },
        ],
        variants: [
            { name: '.kp-copyable__value', what: 'The value, in the mono face, so an identifier can be read character by character.' },
            { name: 'copied', what: 'The button wears the success colour and says it copied, then goes back by itself.' },
            { name: 'refused', what: 'When the clipboard is unavailable the button says so instead of silently doing nothing.' },
            { name: 'with a toast', what: 'The confirmation can be a toast as well as the button’s own label, for a copy that happens far from where the reader is looking.' },
        ],
        accessibility: [
            'Built in — the confirmation is a change of text, and the button announces itself when its own label changes.',
            'Built in — a refusal is reported rather than swallowed; a copy button that does nothing looks broken.',
            'Built in — both outcomes are events, so a consumer can log or count them.',
            'Yours — name the button after what it copies when the value is long or shortened on screen.',
            'Yours — do not put a copy button on something that has to stay secret.',
        ],
    },
    {
        id: 'secret',
        title: 'Secret field',
        group: 'Data',
        classes: ['kp-secret'],
        exports: [],
        aliases: ['secret'],
        intro: 'A token, a password or a key, shown as a mask, shown in full on request for a few seconds and then hidden again, and copied without being shown. `attachPatterns()` (js/patterns.js, also through js/auto.js) builds what the markup leaves out: the value box, Reveal and Copy, and one line under them for the countdown, the reason the field is off, or why it could not be read. The value is read when it is needed (`kp-secret-request`, or the `secretLoad` option), so it is in the page only while it is shown; `revealSecret(field)` and `hideSecret(field)` do what the button does.',
        whenToUse:
            'For a value a person must sometimes read or paste but should not see by accident: an API token, a client secret, a password a service generated. Not for an identifier everyone may see (use the copyable value).',
        examples: [
            {
                title: 'A token that hides itself after 30 seconds',
                why: 'The markup is the empty field; the script builds the mask, the buttons and the line under them, which always keeps its room so nothing moves when it fills.',
                markup: `
<div class="kp-secret" data-kp-secret data-kp-secret-ttl="30" data-kp-secret-label="API token" data-kp-secret-value="kp_live_7Hq2v9XcLm4TzR8sWb3N"></div>
`,
            },
            {
                title: 'Shown only while held, and a field the reader may not open',
                why: 'Hold to reveal suits a value read over someone’s shoulder; a disabled field says why under its buttons.',
                markup: `
<div class="kp-secret" data-kp-secret data-kp-secret-reveal-on="hold" data-kp-secret-label="Root password" data-kp-secret-value="correct-horse-battery"></div>
<div class="kp-secret" data-kp-secret data-kp-secret-label="Signing key" data-kp-secret-disabled="Only the owner can read the signing key."></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-secret', what: 'Marks the field; `attachPatterns` builds its parts.' },
            { name: 'data-kp-secret-ttl', what: 'Seconds a shown value stays (30 by default); `0` keeps it until Hide is pressed.' },
            { name: 'data-kp-secret-label', what: 'The field’s name for a screen reader and in the copied announcement.' },
            { name: 'data-kp-secret-mask', what: 'The mask’s length in characters (12); `data-kp-secret-mask-char` its character (•).' },
            { name: 'data-kp-secret-mask-char', what: 'The mask’s character.' },
            { name: 'data-kp-secret-reveal-on', what: '`hold`: shown only while the button is held, by pointer or with Space or Enter held down.' },
            { name: 'data-kp-secret-copy', what: '`false`: no Copy button.' },
            { name: 'data-kp-secret-wrap', what: '`wrap`: a long value wraps, the box keeping `data-kp-secret-lines` lines of room; by default it stays on one line and scrolls inside its box, a fade at its end saying there is more.' },
            { name: 'data-kp-secret-lines', what: 'With `wrap`, the lines of room the box keeps (2).' },
            { name: 'data-kp-secret-disabled', what: 'Both buttons off; its words are the sentence under them that says why. Followed when it changes.' },
            { name: 'data-kp-secret-value', what: 'The value itself, for a page that has it anyway. A page that does not answers `kp-secret-request` instead.' },
            { name: 'data-kp-secret-state', what: 'Written: `hidden`, `loading`, `shown`, `error` or `disabled`.' },
            { name: 'data-kp-secret-paused', what: 'Written while the countdown waits because the reader selects the value or holds the focus in it.' },
            { name: 'data-kp-secret-overflow', what: 'Written while a shown value is longer than its box.' },
            { name: 'data-kp-secret-reveal', what: 'On the Reveal button, when the markup brings its own.' },
            { name: 'kp-secret', what: 'Fired on the field when it is shown or hidden: `{ shown, reason }`, reason `press`, `hold`, `timer`, `away` (the tab went to the background) or `call`.' },
            { name: 'kp-secret-request', what: 'Fired, cancelable, when the field needs its value: call `preventDefault()` and answer with `detail.respond(value)` or `detail.fail(reason)`; `detail.purpose` is `reveal` or `copy`.' },
        ],
        accessibility: [
            'Built in — the field is a named group; Reveal says whether the value is shown (`aria-expanded`), and a polite region says “Shown. Hides in 30 s.”, “Hides in 10 s” and “Hidden again”, never every second.',
            'Built in — the countdown pauses while the value is selected or holds the focus, and the value hides at once when the tab goes to the background.',
            'Built in — Copy works while the value is hidden and never puts it in an event or an announcement.',
            'Yours — read the value from the server when it is asked for, so it is not in the page before it is shown.',
        ],
    },
    {
        id: 'data-formatting',
        title: 'Showing data',
        group: 'Data',
        classes: ['kp-url', 'kp-id', 'kp-numeric', 'kp-timestamp', 'kp-masked', 'kp-truncate'],
        exports: [],
        intro: 'Six classes that are not components — nobody imports a URL — but that every data-heavy page rewrites badly. Each fixes one specific failure: a page that scrolls sideways because of one long link, or a column of numbers that jitters between rows.',
        whenToUse:
            'On the values themselves, wherever they appear: in a table, in a card, in a definition list. Do not reach for the truncation where the value must stay readable — a cut identifier with no way back is data hidden rather than shortened — and do not use the masked class to hide anything a viewer could not already see.',
        examples: [
            {
                title: 'All six at rest',
                why: 'The URL and the identifier wrap anywhere rather than pushing the page sideways; the amount and the moment use same-width digits; the masked value keeps its shape without claiming to be the real one; the last line is cut with an ellipsis.',
                markup: `
<p class="kp-url">https://example.test/a/very/long/path/that-would-otherwise-widen-the-page?with=query&amp;and=more</p>
<p class="kp-id">a3f9-2b71-0c4d-8e15</p>
<p class="kp-numeric">1,284.50 · 998.00 · 12.75</p>
<p class="kp-timestamp">2026-09-06 14:07</p>
<p class="kp-masked">•••• •••• •••• 4417</p>
<p class="kp-truncate">This sentence is cut off with an ellipsis as soon as its column is narrower than the text itself, instead of making the row taller.</p>
`,
            },
        ],
        variants: [
            { name: '.kp-url', what: 'Wraps anywhere, so one long link cannot widen the page.' },
            { name: '.kp-id', what: 'The same wrapping, in the mono face and slightly smaller, for keys and identifiers.' },
            { name: '.kp-numeric', what: 'Same-width digits, so a column of amounts lines up and does not shimmer as values change.' },
            { name: '.kp-timestamp', what: 'The same digits, in the quiet ink, because a moment is rarely the point of the row.' },
            { name: '.kp-masked', what: 'Mono, letter-spaced and quiet: a value with its shape kept and its content gone.' },
            { name: '.kp-truncate', what: 'One line with an ellipsis. Put the whole value in the title, or use the cell class that keeps it.' },
        ],
        accessibility: [
            'Built in — none of these hides anything from a screen reader: they change how a value is drawn, not what it is.',
            'Built in — the wrapping classes are what keep a page from needing sideways scrolling at 320 pixels.',
            'Yours — put the full text within reach of anyone who meets a truncated one.',
            'Yours — mask on the server. A masked class over a real number is a value in the page source.',
        ],
    },
    {
        id: 'empty-state',
        title: 'Empty state',
        group: 'Data',
        classes: ['kp-empty', 'kp-art'],
        aliases: ['art'],
        exports: ['EmptyState'],
        intro: 'A bordered box that says a list is empty, and which emptiness it is: nothing yet, or nothing that matched. A blank area says the page is broken instead.',
        whenToUse:
            'Wherever a list, a table or a search can come back with nothing. Not as an error message — a failed request is an alert, because the reader can do something about it. Not for a section that is empty by design, where a sentence in the ordinary prose is enough.',
        examples: [
            {
                title: 'Nothing yet, and nothing found',
                why: '“No applications yet” and “nothing matched your filter” are different messages, and offering “create one” to somebody who just typed a filter is noise.',
                markup: `
<div class="kp-empty">
<p class="kp-empty__title">No applications yet</p>
<p class="kp-empty__body">Applications you send appear here.</p>
<button type="button" class="kp-button kp-button--primary">New application</button>
</div>
<div class="kp-empty">
<p class="kp-empty__title">Nothing matched</p>
<p class="kp-empty__body">No application matches “bakery”.</p>
<button type="button" class="kp-button">Clear the filter</button>
</div>
`,
            },
            {
                title: 'With a drawing of what kind of empty it is',
                why: '`data-kp-art` puts a small line drawing at the top, in the theme’s own hand: none, nomatch, error, offline, done or locked. It is a picture only; the title and the sentence carry the meaning. A theme shows its own set, and a theme without one shows none.',
                markup: `
<div class="kp-empty" data-kp-art="done">
<p class="kp-empty__title">All clear</p>
<p class="kp-empty__body">No follow-up is due this week.</p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-empty', what: 'The box on its own: a dashed boundary and quiet ink, for a one-line emptiness with nothing to offer.' },
            { name: '.kp-empty__title', what: 'The line that names the emptiness, in the page’s full ink so it is not mistaken for help text.' },
            { name: '.kp-empty__body', what: 'One sentence under it, saying what would put something here.' },
            { name: 'filtered', what: 'The same box in its other state, with the action that clears the filter instead of the one that creates a first item.' },
            { name: 'as a heading', what: 'The title can be rendered as a real heading where the empty state stands for a whole section.' },
            { name: 'data-kp-art', what: 'A drawing at the top (`.kp-art`, js/art.js `attachArt`): `none`, `nomatch`, `error`, `offline`, `done` or `locked`, in the theme’s own set (`data-kp-art-set`; formal’s is the ledger), ruled in on arrival where the theme moves. `data-kp-art-kind` on the drawing says which.' },
            { name: 'data-kp-art-size', what: '`sm` (5rem) or `lg` (10rem) instead of 7.5rem.' },
        ],
        accessibility: [
            'Built in — the title is text in the page’s own ink rather than a picture of a shrug, so it is read out like any other message.',
            'Yours — put the empty state where the list was, so a reader who moved focus into the list is not left with nothing.',
            'Yours — announce the change if the list emptied because of something the reader typed; the box appearing is silent on its own.',
            'Yours — offer one action, and only the one that fits the emptiness in front of you.',
        ],
    },
    {
        id: 'alert',
        title: 'Alert',
        group: 'Feedback',
        classes: ['kp-alert'],
        exports: ['Alert'],
        aliases: ['semantic', 'dismiss'],
        intro: 'A message on a coloured plate that also says, in words, what kind of message it is. Four flavours, no hover and no active state: an alert is a message, not a control.',
        whenToUse:
            'For something the reader has to know about the page or their last action, in place, where it happened. Not for a message about a single field — that belongs under the field, where the eye already is. Not for something that can be missed either: an alert appears in the page rather than announcing itself, so a passing confirmation is a toast.',
        examples: [
            {
                title: 'The four flavours',
                why: 'Each names itself in text as well as in colour: four coloured plates are one plate to somebody who sees them all the same. The contract enforcer disarms a semantic alert that carries no words.',
                markup: `
<div class="kp-alert kp-alert--success" role="status" data-kp-semantic><span><span class="kp-alert__label">Success: </span>The application was sent.</span></div>
<div class="kp-alert kp-alert--warning" role="status" data-kp-semantic><span><span class="kp-alert__label">Warning: </span>Two attachments were larger than the limit.</span></div>
<div class="kp-alert kp-alert--info" role="status" data-kp-semantic><span><span class="kp-alert__label">Note: </span>Applications are kept for twelve months.</span></div>
<div class="kp-alert kp-alert--destructive" role="alert" data-kp-semantic><span><span class="kp-alert__label">Error: </span>The server refused the file.</span></div>
`,
            },
            {
                title: 'With an icon and a way out',
                why: 'The icon is decorative — the word beside it is what carries the meaning — and the close button is a named control rather than a bare glyph.',
                markup: `
<div class="kp-alert kp-alert--warning" role="status" data-kp-semantic>
<span class="kp-alert__icon" aria-hidden="true">!</span>
<span class="kp-alert__body"><span class="kp-alert__label">Warning: </span>Your session ends in five minutes.</span>
<button type="button" class="kp-icon-button kp-alert__close" aria-label="Dismiss this message">×</button>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-alert', what: 'The neutral plate, for a message with no flavour at all.' },
            { name: '.kp-alert--success / --warning / --info / --destructive', what: 'The four semantic plates. Each takes its own ground and the ink that is measured against it.' },
            { name: '.kp-alert__label', what: 'The word that names the flavour, in bold, before the message.' },
            { name: '.kp-alert__icon', what: 'A decorative glyph at the leading edge, sized so it does not stretch with the text.' },
            { name: '.kp-alert__body', what: 'The message itself, taking the remaining width — a bare span here leaves the close button in the middle of the plate.' },
            { name: '.kp-alert__close', what: 'The dismiss control, pushed to the trailing edge.' },
            { name: 'pastel', what: 'In pastel an alert draws its own plate and pass and is stuck on as everything is; its label sits on its tone’s plate and its close button is pastel’s button. An alert shown again arrives as its leave backwards.' },
        ],
        accessibility: [
            'Built in — a semantic alert with no words is refused by the contract enforcer, which is DI4 made mechanical rather than remembered.',
            'Built in — every ground and ink pair on these plates is in the contrast gate; no alert invents a colour.',
            'Yours — choose the role: a status for something the reader can finish reading first, an alert only for what interrupts.',
            'Yours — an alert added after the page has loaded needs a live region, or it appears silently.',
            'Yours — name the dismiss button, and leave the reader a way back to what the message was about.',
        ],
    },
    {
        id: 'attention',
        title: 'Attention band',
        group: 'Feedback',
        classes: ['kp-attention'],
        exports: [],
        // The band ranks its items by `data-kp-severity`, the word the log
        // reads too.
        aliases: ['severity'],
        intro: 'One alert per problem, worst first, each with the action that fixes it. Each is a soft tint of its severity with a coloured edge, the page’s own text colour and a solid round icon: calm, still unmistakable. With nothing wrong the band takes no room at all. `attachAttention()` in js/attention.js keeps the order in the page itself, so a screen reader meets the problems in the order the eye does.',
        whenToUse:
            'At the top of a dashboard, for what needs a person now. Not for a message about the action just taken, which is a toast, and never for an “all is well” line: an empty band is the all-clear.',
        examples: [
            {
                title: 'Three problems, written in any order',
                why: 'Written info, critical, warning; shown critical, warning, info.',
                markup: `
<div class="kp-attention" role="region" aria-label="Needs attention">
<div class="kp-alert kp-alert--info kp-attention__item" role="status" data-kp-severity="info">
<span class="kp-attention__icon" aria-hidden="true">i</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Information: </span>Firmware 4.2 is out for six field units</strong><span>It fixes the flow meter’s drift after a power cut.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Plan the update</button></div>
</div>
<div class="kp-alert kp-alert--destructive kp-attention__item" role="alert" data-kp-severity="critical">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Critical: </span>Pump house 3 is below 2.1 bar</strong><span>For forty minutes.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Open the incident</button></div>
</div>
<div class="kp-alert kp-alert--warning kp-attention__item" role="status" data-kp-severity="warning">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Warning: </span>Pump house 7 has sent no reading since 06:00</strong><span>Its modem may need a restart.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Restart the modem</button></div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-attention', what: 'The band: a region of items one under the other; with no item it is not drawn.' },
            { name: '.kp-attention__item', what: 'One problem, on a `.kp-alert` of its tone: a soft tint of the severity, a thick edge of it, the page’s own text colour.' },
            { name: 'data-kp-severity', what: '`critical`, `warning` or `info`: the order and the tint.' },
            { name: '.kp-attention__icon, __text, __actions', what: 'A solid round icon, the problem in a strong line and a sentence, and the action that fixes it. In a band under 34rem the actions go under the words.' },
        ],
        accessibility: [
            'Built in — the DOM order is the severity order, so reading order and visual order agree.',
            'Built in — the severity is a word for a screen reader (the hidden prefix) and an icon, not only a colour.',
            'Yours — `role="alert"` for a critical problem that arrives while the reader is on the page, `role="status"` for the rest; and the hidden prefix in your words.',
        ],
    },
    {
        id: 'badge',
        title: 'Badge',
        group: 'Feedback',
        classes: ['kp-badge'],
        exports: ['Badge'],
        aliases: ['semantic'],
        intro: 'A small pill for a state — a status, a count, a label. It says what it is in text; the colour is the second channel and never the only one.',
        whenToUse:
            'To mark a row or a card with a state the reader scans for. Not as a button: a pill that acts is a button, and painting one as a badge hides that it can be pressed. Not for long text either — a badge that wraps to two lines is a sentence wearing a costume.',
        examples: [
            {
                title: 'A row of statuses',
                why: 'Each badge names its status. The status colours come from the theme’s own scale, so the same seven states look right in all twenty-four themes.',
                markup: `
<span class="kp-badge" data-kp-semantic data-status="draft">draft</span>
<span class="kp-badge" data-kp-semantic data-status="sent">sent</span>
<span class="kp-badge" data-kp-semantic data-status="interview">interview</span>
<span class="kp-badge" data-kp-semantic data-status="offer">offer</span>
<span class="kp-badge" data-kp-semantic data-status="rejected">rejected</span>
`,
            },
            {
                title: 'A count beside a label',
                why: 'Without the semantic marking a badge is just a pill on the quiet surface, which is what a count wants: it is a number, not a state.',
                markup: `
<span>Unread <span class="kp-badge">12</span></span>
`,
            },
        ],
        variants: [
            { name: '.kp-badge', what: 'The default: the quiet ground and its ink, for counts and neutral labels.' },
            { name: 'semantic', what: 'A badge carrying a status colour. It must say what it means in text; one carrying none is refused by the contract enforcer.' },
            { name: 'with a status', what: 'The status attribute is what a consumer paints from, using the theme’s own status pair for that name.' },
        ],
        accessibility: [
            'Built in — a coloured badge with no words is disarmed and reported, because seven pale plates are one plate to somebody who cannot tell them apart.',
            'Yours — write the state in the badge. A colour with no word is a colour.',
            'Yours — if a badge is a filter, make it a button; if it is a link, make it a link.',
            'Yours — say what the badge belongs to when it stands alone in a row: “12 unread”, not “12”.',
        ],
    },
    {
        id: 'count',
        title: 'Counting number',
        group: 'Feedback',
        classes: [],
        exports: [],
        aliases: ['count', 'counter', 'odometer', 'tick'],
        intro: 'A number that counts up to what it already says. The page writes the final figure; the effects module reads it, counts to it and puts the same string back — so a page that never loads the module, and a reader who asked for less movement, both simply see the number.',
        whenToUse:
            'For one or two figures that are the point of a page — a total, a score, a count of things done. Not for a table of numbers, where the movement makes the column unreadable, and not for anything a reader needs at once. The final number is authored in the HTML, so nothing is ever hidden behind the animation.',
        examples: [
            {
                title: 'A number that counts up to itself',
                why: 'The text is the truth. The module reads the number out of it, counts, and restores exactly what was written — separators, currency and all.',
                markup: `
<span data-kp-count>1204</span>
`,
            },
            {
                title: 'The page decides which separator is which',
                why: '`1.204` is one thousand two hundred and four in Dutch and one-point-two-oh-four in English, and the string alone does not say. The nearest `lang` decides, so the module never has to guess.',
                markup: `
<p lang="nl"><span data-kp-count>1.118.204,75</span></p>
<p lang="en"><span data-kp-count>1,204.50</span></p>
`,
            },
            {
                title: 'The two knobs, and the state a test or a consumer can read',
                why: 'How long the count takes and where it starts, both as custom properties. `--kp-count: 0` means no counting at all. The state attribute is written by the module and readable at any moment, so nothing has to have been listening.',
                markup: `
<span data-kp-count style="--kp-count: 1200; --kp-count-from: 100" data-kp-count-state="done">640</span>
`,
            },
        ],
        variants: [],
        accessibility: [
            'The final number is written in the HTML, so a page without the module and a reader with reduced motion both see the real figure — the count is decoration over content that is already there.',
            'At the reduced-motion setting the number never changes at all: it is not counted quickly, it is not counted.',
            'The number is not announced while it counts. A screen reader reads the element once, with the figure the page authored.',
            'The nearest `lang` decides which separator groups and which one is the decimal point, so a number never counts through the wrong notation.',
        ],
    },
    {
        id: 'marquee',
        title: 'Marquee',
        group: 'Feedback',
        classes: ['kp-marquee'],
        exports: ['Marquee'],
        aliases: ['marquee', 'paused'],
        intro: 'A row of short items that a theme may run across the page — a tape of figures, a strip of headlines, a band of names. The consumer writes the items once; the theme decides whether they move at all.',
        whenToUse:
            'For a row of small, equal things nobody has to read in order: prices, statuses, credits. Not for anything a reader must act on or find again — a moving target is the hardest thing on a page to click — and not as a substitute for a heading. A theme that has no answer leaves the row standing still, which must still make sense.',
        examples: [
            {
                title: 'A row a theme may run',
                why: 'The consumer writes the items once. The effects module builds the track, doubles the row so the pass is seamless and hides the copy from a screen reader; a page without the module shows the row standing still.',
                markup: `
<div class="kp-marquee" data-kp-marquee>
    <span>KP 412.75 +1.9%</span>
    <span>THEME 98.20 -0.4%</span>
    <span>REG25 1 240.00 +3.2%</span>
</div>
`,
            },
            {
                title: 'What the module builds from it',
                why: 'Written out so a consumer who renders it server-side, or who does not load the module at all, can produce the same thing by hand. The second run is the copy; it carries aria-hidden so the items are announced once.',
                markup: `
<div class="kp-marquee" data-kp-marquee data-kp-marquee-ready data-kp-marquee-runs="2">
    <div data-kp-marquee-track>
        <div data-kp-marquee-run><span>KP 412.75 +1.9%</span></div>
        <div data-kp-marquee-run aria-hidden="true"><span>KP 412.75 +1.9%</span></div>
    </div>
</div>
`,
            },
            {
                title: 'A consumer overriding the speed',
                why: 'The two knobs ride as custom properties, so overriding one leaves the theme’s value for the other: one is the time a full pass takes, the other is whether the row rests while it is off screen.',
                markup: `
<div class="kp-marquee" data-kp-marquee style="--kp-marquee: 20000ms">
    <span>Slower or faster, without leaving the theme</span>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-marquee', what: 'The row itself. Everything else is written by the module, or by a consumer who renders the same markup server-side.' },
            { name: 'data-kp-marquee-track', what: 'The element that moves: both runs sit inside it, so one -50% pass lands exactly where it started.' },
            { name: 'data-kp-marquee-run', what: 'One run of the items. There are two; the second carries aria-hidden.' },
            { name: 'data-kp-marquee-ready', what: 'Written on the row once the module has built it. A theme keys its animation on this, so a page without the module never shows a half-built band.' },
            { name: 'data-kp-marquee-runs', what: 'How many runs the track holds. Two today; a theme that needs a different pass distance can read it.' },
            { name: 'data-kp-paused', what: 'Written while the row sits outside the viewport, so the animation rests and resumes where it stood. A theme that asks never to rest never sees it.' },
        ],
        accessibility: [
            'Built in — the copy of the row is aria-hidden, so a screen reader announces the items once, not twice.',
            'Built in — the whole band stands still under `prefers-reduced-motion: reduce`, in every theme.',
            'Built in — the loop rests while the band is off screen, unless the theme asks it never to.',
            'Yours — keep the items short and repeat nothing a reader must act on. A moving row is scenery, not navigation.',
            'Yours — give the band a label only if it means something on its own; unlabelled scenery is better than a landmark nobody wants.',
        ],
    },
    {
        id: 'toast',
        title: 'Toast',
        group: 'Feedback',
        classes: ['kp-toast', 'kp-toasts'],
        exports: ['Toasts'],
        intro: 'A short message in a stack at the corner of the window that removes itself after a while. Errors go to a second, assertive stack, because those are the ones that must interrupt.',
        whenToUse:
            'For confirming something the reader just did, when the result is elsewhere on the page or not visible at all. Not for anything they have to act on — a toast that disappears is not a place for a decision — and not for errors that block progress, which belong beside the thing that failed.',
        examples: [
            {
                title: 'The four flavours, at rest',
                why: 'Printed here on the page so the variants can be seen; in an application the module puts them into the fixed stack at the corner of the window. The flavour is a rule down the leading edge and the message says it too.',
                markup: `
<div class="kp-toast kp-toast--success">Saved: the application was sent.</div>
<div class="kp-toast kp-toast--warning">Two files were skipped.</div>
<div class="kp-toast kp-toast--info">Your session ends in five minutes.</div>
<div class="kp-toast kp-toast--error">The server refused the file.<button type="button" class="kp-icon-button kp-toast__close" aria-label="Dismiss">×</button></div>
`,
            },
            {
                title: 'The region a consumer writes once',
                why: 'One polite region for ordinary messages; the module makes a second assertive one for errors when it needs it. The stack is fixed to the corner of the window and sits above the texture layer, because a toast under an overlay is a toast nobody can read.',
                markup: `
<div class="kp-toasts" role="status" aria-live="polite"></div>
`,
            },
            {
                title: 'A toast that waits for the reader, and one that stays',
                why: 'Three buttons call toast() from js/overlays.js. The first toast keeps its clock while the pointer is on it or focus is inside it (try resting the pointer on it) and leaves two seconds after both are gone; the second has a close button and the ordinary clock; the third is sticky: no clock, a close button, and Esc closes it from the keyboard.',
                markup: `
<div class="kp-row kp-gap-sm">
<button type="button" class="kp-button" data-doc-toast="pause">Rest on it</button>
<button type="button" class="kp-button" data-doc-toast="close">With a close button</button>
<button type="button" class="kp-button kp-button--primary" data-doc-toast="sticky">Stays until closed</button>
</div>
`,
                script: `
import { toast } from '@kp-soft/themes/js/overlays';

const shows = {
    pause: () => toast('Saved: rest the pointer on this toast and it waits.', { linger: 1500 }),
    close: () => toast('The export finished.', { close: true }),
    sticky: () => toast('The server refused the file. Close this when you have read it.', { sticky: true, live: 'assertive' }),
};
for (const button of document.querySelectorAll('[data-doc-toast]')) {
    button.addEventListener('click', () => shows[button.dataset.docToast]());
}
`,
            },
        ],
        variants: [
            { name: '.kp-toasts', what: 'The stack: fixed at the trailing bottom corner, newest last, above every other layer.' },
            { name: 'assertive stack', what: 'A second region for errors, which interrupts rather than waiting for a pause.' },
            { name: '.kp-toast--success / --warning / --info / --error', what: 'A rule down the leading edge in the status colour. The words say it as well.' },
            { name: '.kp-toast__close', what: 'A dismiss control pushed to the trailing edge, for a toast that does not go by itself.' },
            { name: 'with an action', what: 'A toast can carry one control — an undo — and then it should stay long enough to be used.' },
            { name: 'pause (default true)', what: 'While the pointer is on a toast or focus is inside it, its clock stops and the toast carries `data-kp-paused`; `pause: false` brings back the plain timer. A touch is not hovering. The region hears `kp-toast-pause` with `{ toast, paused }` each time it stops or starts again.' },
            { name: 'linger', what: 'The milliseconds a toast has left once the pointer and the focus are both gone (`TOAST_LINGER_MS`, 2000 by default; per toast as `linger`).' },
            { name: 'close', what: '`close: true` adds a close button at the toast’s end; the toast keeps its clock.' },
            { name: 'sticky', what: '`sticky: true` is no clock plus a close button: the toast stays until it is closed. For an undo that needs a decision or an error that has to be read.' },
            { name: 'Escape', what: 'Esc on a focused toast closes it, whether or not it has a close button.' },
            { name: 'with a tab bar', what: 'The stack, and the back-to-top control, rise by the tab bar’s own height, so a toast never stands behind it on a phone.' },
            { name: 'pastel', what: 'In pastel a toast draws its own plate and pass under its words (no tape: paper in the hand), lands on the pass and leaves as that landing backwards; js/motion.js plays a toast’s arrival as its leave backwards. Each tone names its own paper.' },
        ],
        accessibility: [
            'Built in — the polite region announces without interrupting, and errors get the assertive one; that split is the whole reason there are two.',
            'Built in — a toast is not focused when it appears, so it does not steal the keyboard from what the reader was doing.',
            'Built in — the stack sits above the other layers, so nothing draws over it.',
            'Yours — put the region in the document once, at the end, and leave it there. A region added at the same moment as its message is not announced.',
            'Yours — leave a toast long enough to read, and give anything actionable a home that does not expire.',
            'Yours — repeat the information somewhere permanent if the reader may need it later.',
        ],
    },
    {
        id: 'alarm',
        title: 'Alarm',
        group: 'Feedback',
        classes: ['kp-alarm'],
        exports: ['Alarm', 'useAlarm'],
        intro: 'A full-screen dramatic alert: a code line, one huge word, the reason under it and one way out, over a plate that takes the whole window. It opens as a modal dialog in the top layer, so the page behind it cannot be clicked or tabbed to until it is dealt with. Either only its button closes it, or it closes by itself after a number of seconds. Every theme draws it in its own colours and faces.',
        whenToUse:
            'For the rare event that must stop everything: access refused, a lockout, a connection to something critical lost. Not for an error beside a field, which is a field message; not for a result the reader may ignore, which is a toast; and not for a question with two answers, which is a dialog. An alarm that fires often teaches people to press through it.',
        examples: [
            {
                title: 'A button that raises an alarm',
                why: 'The trigger describes the alarm in its attributes and the module raises it on a press: the value of the first attribute is the headline, the others the code line, the reason and the mode. When it closes, the close event is dispatched on the button with the reason, and focus is back on it. The same alarm from a script is one call to showAlarm() with the same words, which resolves with the reason.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-alarm="Access denied" data-kp-alarm-code="Security protocol 7 · lockout" data-kp-alarm-detail="Three failed attempts on terminal 4. This console is locked for ten minutes.">Test the lockout</button>
<button type="button" class="kp-button" data-kp-alarm="Connection lost" data-kp-alarm-code="Telemetry" data-kp-alarm-detail="The link to pump house 4 dropped. Readings shown are the last known values." data-kp-alarm-mode="auto" data-kp-alarm-seconds="6">Test the timed alarm</button>
`,
            },
            {
                title: 'The parts, held open in the page',
                why: 'Printed in the flow of the page so the pieces can be seen at rest, the way a style guide shows it: the plate, the frame and the hazard bars, the code line, the headline, the reason and the one button. A held-open frame is inert, because its button is a picture.',
                markup: `
<div class="kp-alarm" data-kp-alarm-inline data-kp-alarm-mode="ack" data-kp-alarm-motion="still" inert>
<div class="kp-alarm__scan" aria-hidden="true"></div>
<div class="kp-alarm__bars" aria-hidden="true"></div>
<div class="kp-alarm__panel">
<p class="kp-alarm__code">Special order 937</p>
<div class="kp-alarm__title" role="heading" aria-level="2"><span class="kp-alarm__glyphs" data-text="Request denied">Request denied</span></div>
<p class="kp-alarm__detail">Crew override is not accepted at this level of clearance.</p>
<div class="kp-alarm__actions">
<button type="button" class="kp-button kp-alarm__ack">Acknowledge</button>
<span class="kp-alarm__hint" aria-hidden="true">Press Enter</span>
</div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: 'ack', what: 'The default: only the button closes it, with a click, Enter or Space. Escape and a click on the plate do nothing, and so does time.' },
            { name: 'ack with escape', what: 'The same, and Escape closes it too, with the reason escape.' },
            { name: 'auto', what: 'Closes by itself after its seconds, with a bar that shrinks towards the start and the whole seconds under it. Escape closes it. Keep open stops the clock and turns it into ack.' },
            { name: '.kp-alarm__code / __title / __detail', what: 'The small line above, the headline in the display face, and the reason in the mono face.' },
            { name: '.kp-alarm__ack / __keep', what: 'The one way out, in the theme’s button shape and the alarm’s paint; and the quiet button that keeps a timed alarm open.' },
            { name: 'data-kp-alarm-inline', what: 'A frame held open in the flow of a page instead of raised over it, for a style guide.' },
            { name: 'data-kp-alarm-motion="still"', what: 'A frame that shows what a reader who asked for reduced motion sees, whatever the reader asked for.' },
            { name: 'pastel', what: 'In pastel the alarm draws its own plate on the pass’s clock, lands as pastel’s dialog does and leaves as that backwards; its buttons are pastel’s button.' },
        ],
        accessibility: [
            'Built in — an alertdialog opened as a modal: the page behind is inert, focus stays inside, and it returns to the trigger when the alarm closes.',
            'Built in — the headline is its accessible name and the reason its description; a sentence read once says how it goes away, instead of a number every second.',
            'Built in — the acknowledged alarm focuses its button; the timed one focuses itself, so an Enter meant for the page presses nothing.',
            'Built in — with reduced motion asked for, nothing moves: the words are there at once and the bar steps a whole second at a time.',
            'Built in — the flicker, the decode and the glow stay under two flashes a second, measured from rendered frames; WCAG allows three.',
            'Yours — keep the headline to a few words and put what happens next in the reason.',
            'Yours — give a timed alarm enough seconds to read the reason twice, and repeat what matters somewhere that stays.',
        ],
    },
    {
        id: 'progress',
        title: 'Progress',
        group: 'Feedback',
        classes: ['kp-progressbar', 'kp-progress', 'kp-progress-group'],
        // The busy state is `data-kp-indeterminate`, a name no class slug derives.
        aliases: ['indeterminate'],
        exports: ['Progress'],
        intro: 'A bar for work whose end is known, drawn by each theme in its own hand — a track, a fill clipped to the value and a head on its leading edge — and one line high whatever the theme draws inside it.',
        whenToUse:
            'When you can say how far along something is: an upload, an import, a step count. Not for waiting on a server that will answer when it answers — that is the spinner, or the busy bar when the wait belongs to a task with a place on the page. Not as a rating or a gauge: a progress bar means work in flight.',
        examples: [
            {
                title: 'Three bars that begin in the same column',
                why: 'A set of bars is read against each other, so the tracks have to start and end together — a bar behind “Memory” may not begin later than the one behind “CPU” because the word is longer. The group gives the labels one column, as wide as the longest of them [fix-64].',
                markup: `
<div class="kp-progress-group">
<div class="kp-progress__wrap">
<span class="kp-progress__label">CPU</span>
<div class="kp-progressbar" role="progressbar" aria-label="CPU" aria-valuemin="0" aria-valuemax="100" aria-valuenow="22" style="--kp-value: 0.22">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">22%</span>
</div>
<div class="kp-progress__wrap">
<span class="kp-progress__label">Memory</span>
<div class="kp-progressbar" role="progressbar" aria-label="Memory" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64" style="--kp-value: 0.64">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">64%</span>
</div>
</div>
`,
            },
            {
                title: 'A bar, and a bar with its number',
                why: 'The value is the share done on `--kp-value` (0 to 1) and the amount a screen reader reads on `aria-valuenow`. With js/progressbar.js loaded (js/auto.js loads it), setting `aria-valuenow` moves the paint too, and the outer element alone is enough: the track, the fill and the head are written in.',
                markup: `
<div class="kp-progressbar" role="progressbar" aria-label="Import" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40"></div>
<div class="kp-progress__wrap">
<div class="kp-progressbar" role="progressbar" aria-label="Import" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
`,
            },
            {
                title: 'Three sizes',
                why: 'The bar as it always was is the small one; `.kp-progressbar--md` and `.kp-progressbar--lg` make it one and a half and two times as tall. The theme draws the same bar larger — its marks, cells and patterns grow with the track — and the label and the number in the same row step up the type scale with it (13, 16 and 18px at a 16px root). Pick by how much the bar matters on the page: small beside a line of text or in a table, medium for the bar a panel is about, large for the one task a page is waiting on.',
                markup: `
<div class="kp-progress-group">
<div class="kp-progress__wrap">
<span class="kp-progress__label">Small</span>
<div class="kp-progressbar" role="progressbar" aria-label="Small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
<div class="kp-progress__wrap">
<span class="kp-progress__label">Medium</span>
<div class="kp-progressbar kp-progressbar--md" role="progressbar" aria-label="Medium" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
<div class="kp-progress__wrap">
<span class="kp-progress__label">Large</span>
<div class="kp-progressbar kp-progressbar--lg" role="progressbar" aria-label="Large" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
</div>
`,
            },
            {
                title: 'Busy, with no idea how far',
                why: 'Without an amount the bar says so twice: `data-kp-indeterminate` for the eye and no `aria-valuenow` for a screen reader. It moves while it waits, and stands still, still reading as busy, for a reader who asked for less motion.',
                markup: `
<div class="kp-progressbar" role="progressbar" aria-label="Waiting for the export service" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
`,
            },
            {
                title: 'Busy, in three sizes',
                why: 'A busy bar is `data-kp-indeterminate` on the bar, with no value. Each theme draws its own wait in the track, at every size; pastel draws it from pieces: js/loading-pieces.js puts a row of pom-poms with a head in the track while it is busy (a still row of pom-poms without the script), and takes them away when the attribute goes.',
                markup: `
<div class="kp-stack">
<div class="kp-progressbar" role="progressbar" aria-label="Waiting for the export, small" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<div class="kp-progressbar kp-progressbar--md" role="progressbar" aria-label="Waiting for the export, medium" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<div class="kp-progressbar kp-progressbar--lg" role="progressbar" aria-label="Waiting for the export, large" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-progressbar', what: 'The bar: one line high, as wide as its place up to a maximum, painting the share done from 0 to 1.' },
            { name: '.kp-progressbar__track', what: 'The ground the value is measured against; the theme draws it.' },
            { name: '.kp-progressbar__fill', what: 'The share done, clipped to the value, so a pattern in it never stretches and only the clip moves.' },
            { name: '.kp-progressbar__head', what: 'The mark on the fill’s leading edge; a theme gives it a shape or leaves it empty.' },
            { name: '.kp-progressbar--md', what: 'The medium size: one and a half times the small bar, the theme’s drawing grown with it, and the label and number beside it at the body size.' },
            { name: '.kp-progressbar--lg', what: 'The large size: twice the small bar, for the one task a page waits on; the label and number one step above the body size.' },
            { name: '[data-kp-indeterminate]', what: 'Busy without an amount: a moving band, and diagonal stripes standing still under reduced motion.' },
            { name: '.kp-progress__wrap', what: 'The bar with something beside it, on one centre line.' },
            { name: '.kp-progress__value', what: 'The number, quiet and small, after the bar.' },
            { name: '.kp-progress-group', what: 'A set of bars in three columns — label, track, reading — so every track begins and ends in the same place [fix-64].' },
            { name: '.kp-progress__label', what: 'The word in front of a bar inside a group.' },
            { name: 'pastel: the caterpillar', what: 'In pastel a busy bar’s track becomes the pom-pom caterpillar: a row of pom-poms as round as the track is high, a head at its end, rising in turn on the theme’s loop (2.4 s). The pieces are js/loading-pieces.js’s, hidden from screen readers; without the script the track shows the same row standing still, and under reduced motion it stands still too.' },
        ],
        accessibility: [
            'Built in — `role="progressbar"` with `aria-valuenow` against `aria-valuemin` and `aria-valuemax`; js/progressbar.js keeps the paint in step with them, so the number read and the bar drawn cannot drift apart.',
            'Built in — the busy bar carries no `aria-valuenow`, which is how a screen reader learns the amount is unknown.',
            'Built in — with reduced motion asked for nothing inside the bar moves, in any theme, and the busy bar still reads as busy.',
            'Yours — give it a name. A bar with no label is progress on something unspecified.',
            'Yours — add `aria-valuetext` where a percentage is not the useful number (“3 of 12 files”).',
            'Yours — say when it is finished; a full bar is silent.',
        ],
    },
    {
        id: 'spinner',
        title: 'Spinner',
        group: 'Feedback',
        classes: ['kp-spinner'],
        // `data-kp-pieces` marks a waiting part while a theme's loading pieces are in it (js/loading-pieces.js).
        aliases: ['pieces'],
        exports: ['Spinner'],
        intro: 'A small ring that turns while something is happening whose end is not known. It stops turning for a reader who asked for less motion, and it says what it is in words.',
        whenToUse:
            'For a wait you cannot measure, and only for the part of the page that is waiting. Not for a whole page that is loading, where a skeleton shows the shape of what is coming; and not for something that finishes in a blink, where a spinner is a flash of anxiety.',
        examples: [
            {
                title: 'A spinner with its name',
                why: 'The ring’s track is its own head at a quarter of its alpha rather than a grey boundary: in a theme where both were black, nothing visibly turned.',
                markup: `
<span class="kp-spinner" role="status" aria-label="Loading"></span>
`,
            },
            {
                title: 'Inside the button that started the wait',
                why: 'Beside the label rather than instead of it: a button whose text disappears has changed size and meaning at the moment the reader is looking away.',
                markup: `
<button type="button" class="kp-button kp-button--primary" aria-busy="true"><span class="kp-spinner" aria-hidden="true"></span> Saving…</button>
`,
            },
            {
                title: 'At every size',
                why: 'The spinner’s size is a measure (the knobs table below), so one spinner serves a button, a line and a panel. In pastel the spinner is the pom-pom caterpillar going round a small day sticker, the round trip, at every size: js/loading-pieces.js draws it from pieces and marks the spinner `data-kp-pieces` while they are there.',
                markup: `
<div class="kp-row kp-gap-md">
<span class="kp-spinner" role="status" aria-label="Loading, small" style="--kp-spinner-size: 1rem"></span>
<span class="kp-spinner" role="status" aria-label="Loading"></span>
<span class="kp-spinner" role="status" aria-label="Loading, medium" style="--kp-spinner-size: 2rem"></span>
<span class="kp-spinner" role="status" aria-label="Loading, large" style="--kp-spinner-size: 3rem"></span>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-spinner', what: 'The one size, set by a measure so a consumer can make it smaller inside a button.' },
            { name: 'reduced motion', what: 'The animation is inside the reduced-motion guard: for a reader who asked for stillness the ring is simply drawn, not turning.' },
            { name: 'decorative', what: 'Beside a label that already says what is happening, the ring is marked hidden so the wait is not announced twice.' },
            { name: 'pastel: the round trip', what: 'In pastel the spinner is the pom-pom caterpillar going round a small day sticker, at every size, on the theme’s loop; under reduced motion it rests curled round the sticker.' },
            { name: '--kp-loading-pieces', what: 'A register’s name for a loading picture made of pieces: js/loading-pieces.js (attachLoadingPieces(), wired in js/auto.js) adds the pieces to every waiting part of a theme that names one, and none to a theme that names nothing. Pastel names `caterpillar`; it is the only theme that names one.' },
        ],
        accessibility: [
            'Built in — the animation only runs where motion is welcome, which is DI7 and not a preference honoured where convenient.',
            'Built in — the turn does not change luminance in a way that approaches the flash threshold, and the motion gate measures that.',
            'Yours — give a standalone spinner a name, or nothing says what is being waited for.',
            'Yours — say when the wait ends. A spinner that disappears is silent.',
        ],
    },
    {
        id: 'skeleton',
        title: 'Skeleton',
        group: 'Feedback',
        classes: ['kp-skeleton'],
        exports: ['Skeleton'],
        intro: 'Grey shapes standing in for content that is on its way, in the shape of what will arrive. It pulses where motion is welcome and stands still where it is not.',
        whenToUse:
            'For a first paint whose layout you already know — a list of cards, a table, a profile. Not for a short wait, where the skeleton is on screen more briefly than it takes to understand; and not where the shape is a guess, because a skeleton that does not match what arrives is a jump.',
        examples: [
            {
                title: 'A paragraph, a block and an avatar',
                why: 'Three shapes: lines, a block for an image or a card, and a circle. Stacked lines take their distance from the stylesheet rather than from an inline style nothing could beat.',
                markup: `
<div aria-hidden="true">
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
</div>
<div aria-hidden="true"><span class="kp-skeleton kp-skeleton--block"></span></div>
<div aria-hidden="true"><span class="kp-skeleton kp-skeleton--circle"></span></div>
`,
            },
            {
                title: 'A card of skeletons',
                why: 'A card whose content is on its way: a block for its picture, two lines for its words. In pastel everything that waits becomes caterpillar: each line a row of pom-poms with a head, the block a plate with a head on its top-end corner and legs along its foot that step in turn, and the circle a body with two legs.',
                markup: `
<div class="kp-card" aria-hidden="true">
<span class="kp-skeleton kp-skeleton--block"></span>
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
<span class="kp-skeleton kp-skeleton--circle" style="inline-size: 3rem"></span>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-skeleton', what: 'One line, at the height of a line of text.' },
            { name: '.kp-skeleton--block', what: 'A taller rectangle for an image, a card or a chart.' },
            { name: '.kp-skeleton--circle', what: 'A round one for an avatar; it keeps its aspect whatever width it is given.' },
            { name: 'stacked', what: 'Adjacent skeletons take a distance from the stylesheet, so a paragraph of them needs no wrapper.' },
            { name: 'reduced motion', what: 'The pulse is inside the reduced-motion guard; the shapes are simply there for a reader who asked for stillness.' },
            { name: 'pastel: the caterpillar', what: 'In pastel a line is a row of pom-poms with a head, a block a plate with a head and stepping legs, and a circle a pom-pom body on two legs; js/loading-pieces.js adds the pieces and the part carries `data-kp-pieces` while they are there. Without the script a line shows a still row of pom-poms.' },
        ],
        accessibility: [
            'Built in — the pulse changes opacity slowly enough to stay well under the flash threshold, and the motion gate measures it.',
            'Built in — the animation stops entirely where less motion was asked for.',
            'Yours — hide the skeleton from a screen reader. It stands for content; it is not content.',
            'Yours — announce the arrival of the real thing, and keep the shape close enough that nothing jumps.',
        ],
    },
    {
        id: 'health',
        title: 'Health',
        group: 'Feedback',
        classes: ['kp-health'],
        exports: ['Health'],
        intro: 'A dot and a word for the state of something being watched — a service, a job, a connection. The word is what carries it; the dot is the second channel.',
        whenToUse:
            'In a list of things whose state a reader scans down — a status page, a fleet, a set of integrations. Not for the outcome of a single action, which is an alert or a toast. Not for a numeric measurement, where the number itself says more than three colours can.',
        examples: [
            {
                title: 'Three states',
                why: 'The dot is marked decorative and the word beside it is the label, so the row reads as “Database, healthy” rather than as a coloured circle nobody can name.',
                markup: `
<span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span> Healthy</span>
<span class="kp-health" data-state="warn"><span class="kp-health__dot" aria-hidden="true"></span> Degraded</span>
<span class="kp-health" data-state="down"><span class="kp-health__dot" aria-hidden="true"></span> Unreachable</span>
`,
            },
        ],
        variants: [
            { name: 'ok', what: 'The success colour in the dot, with the word beside it.' },
            { name: 'warn', what: 'The warning colour: something is wrong but the thing still works.' },
            { name: 'down', what: 'The destructive colour: it does not work.' },
            { name: 'no state', what: 'Without a state the dot takes the quiet ground — unknown, which is a fourth thing and not a fourth colour.' },
        ],
        accessibility: [
            'Built in — the dot is decorative and carries a boundary, so it is visible on a pale card and never the only carrier.',
            'Yours — write the state as a word. Three coloured dots in a column are one dot to somebody who cannot tell them apart.',
            'Yours — say what the state belongs to, and when it was last measured.',
        ],
    },
    {
        id: 'log',
        title: 'Log',
        group: 'Data',
        classes: ['kp-log'],
        exports: [],
        aliases: ['source', 'severity', 'current'],
        intro: 'A stream of lines with the time, the source, the level and the message, in four columns that do not move. The shape homelab writes three times by hand and kp-tui carries as `LogPane`; what the web was missing was the component, not the colours.',
        whenToUse:
            'When a reader scans lines as they arrive — a deploy, a job, a service. Not for a table of records, which sorts and filters and belongs in the data table. Not for one message about one action, which is an alert or a toast.',
        examples: [
            {
                title: 'Four columns that do not move',
                why: 'The list is the grid and every line hands its parts to it, so the message of each line begins in the same column whatever the source before it is called [fix-64]. The level is a word before it is a colour: a log read without colour must still say which line failed.',
                markup: `
<div class="kp-log">
<p class="kp-log__line" data-kp-severity="info">
<time class="kp-log__time">09:41:02</time>
<span class="kp-log__source" data-kp-source="media">media</span>
<span class="kp-log__level">info</span>
<span class="kp-log__message">jellyfin: transcode worker ready</span>
</p>
<p class="kp-log__line" data-kp-severity="error">
<time class="kp-log__time">09:41:06</time>
<span class="kp-log__source" data-kp-source="backup">backup</span>
<span class="kp-log__level">error</span>
<span class="kp-log__message">restic: snapshot failed, the lock is 41 minutes old</span>
</p>
</div>
`,
            },
            {
                title: 'A name keeps its own colour',
                why: '`attachLogs` in js/log.js hashes the name into the register\'s five chart colours — FNV-1a, the same arithmetic kp-tui uses — and writes `--kp-source-colour`. So `media` is the third chart colour in the terminal and the third here, in all twenty-two themes, and no page picks a hue by hand [gap-15]. Without the script the name is simply ink.',
                markup: `
<span class="kp-log__source" data-kp-source="prometheus">prom</span>
`,
            },
        ],
        variants: [
            { name: '.kp-log', what: 'The list: the grid whose four columns every line shares.' },
            { name: '.kp-log__line', what: 'One line; it hands its four parts to the grid and paints nothing itself.' },
            { name: '.kp-log__time, .kp-log__source, .kp-log__level, .kp-log__message', what: 'The four parts, in that order — the first three stay put and the fourth takes what is left.' },
            { name: 'data-kp-severity', what: 'debug, info, notice, warning, error or critical: the ink of the level and, for the loud three, of the message.' },
            { name: 'data-kp-source', what: 'The name to hash into a chart colour. Its value is the full name, so a shortened label can still carry the right hue.' },
            { name: 'data-kp-current', what: 'The line the reader is pointed at: the muted ground, and no second colour.' },
        ],
        accessibility: [
            'Built in — the level is a word in a column of its own, so colour is never the only carrier [fix-1].',
            'Built in — the columns are the list\'s, so a long message wraps inside its own column instead of pushing the ones before it.',
            'Yours — give the list a name and say whether it follows the tail, where a reader can scroll it.',
            'Yours — announce a line that demands attention; a stream nobody is watching is silent by design.',
        ],
    },
    {
        id: 'action-columns',
        title: 'Buttons in shared columns',
        group: 'Data',
        classes: ['kp-action-list', 'kp-row-actions'],
        exports: [],
        // `data-kp-action` names a button's role; the button page claims the
        // same word for its undo action, so the two share it.
        aliases: ['action'],
        intro: 'A list’s row buttons on columns the whole list shares: a button of one role starts at one edge and has one width on every row, whatever its label, and a row without that role leaves its column empty. In a list the browser does it — the list is a grid, each row a subgrid — and by position from the end no script is needed. A table measures, through `attachActionColumns()` in js/actions.js.',
        whenToUse:
            'For a list or a table whose rows carry the same few actions, so the eye finds Open in the same place on every row. Not for one row’s toolbar, and not for a long row of actions: four from the end is what the stylesheet places alone, and beyond that a menu reads better.',
        examples: [
            {
                title: 'A list, by position from the end',
                why: 'No script: the last button of every row shares the last column, the one before it the column before, and a shorter row leaves its first columns empty. Every column is as wide as its widest button.',
                markup: `
<ul class="kp-action-list">
<li>
<div><b>INC-4471</b> Pump house 3: pressure below 2.1 bar</div>
<div class="kp-row-actions">
<button type="button" class="kp-button kp-button--sm">Acknowledge</button>
<button type="button" class="kp-button kp-button--sm">Assign…</button>
<button type="button" class="kp-button kp-button--sm kp-button--primary">Open</button>
</div>
</li>
<li>
<div><b>INC-4468</b> Pump house 7: no reading since 06:00</div>
<div class="kp-row-actions">
<button type="button" class="kp-button kp-button--sm">Reassign…</button>
<button type="button" class="kp-button kp-button--sm kp-button--primary">Open</button>
</div>
</li>
</ul>
`,
            },
            {
                title: 'A table, by role',
                why: 'A table cannot be a subgrid, so `attachActionColumns()` measures each role’s widest button and writes the widths on the table. Named by role, Open stays under Open on a row without Recalibrate.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<thead><tr><th scope="col">Pump house</th><th scope="col"><span class="kp-sr-only">Actions</span></th></tr></thead>
<tbody>
<tr><td>Pump house 1</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="recalibrate">Recalibrate…</button><button type="button" class="kp-button kp-button--sm kp-button--primary" data-kp-action="open">Open</button></div></td></tr>
<tr><td>Pump house 3</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm kp-button--primary" data-kp-action="open">Open</button></div></td></tr>
</tbody>
</table>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-action-list', what: 'A list (`ul` or `ol`) whose rows are one grid: the row’s text first, then one column per button.' },
            { name: '.kp-row-actions', what: 'The button box in a row or a table cell. Empty, it takes no room.' },
            { name: 'data-kp-action', what: 'A button’s role, for rows whose buttons are not the same from the end: one column per role, in the order the rows give them.' },
            {
                name: 'on a phone',
                what: 'In a list narrower than 30rem the buttons go under the row’s text, side by side, spread over the full width in equal columns, so a role still lines up from row to row. In a narrow table they stack in the cell at one width.',
            },
            { name: 'data-kp-action-measuring', what: 'What the script writes on a table for the moment it measures, every button at its own size.' },
        ],
        accessibility: [
            'Built in — the buttons keep their order in the markup; the columns are layout only, so the tab order is the row’s own.',
            'Built in — a column a row leaves empty holds nothing focusable.',
            'Yours — name a button by what it does to that row (“Open INC-4471” for a screen reader) when the visible word alone is the same on every row.',
        ],
    },
    {
        id: 'kpi',
        title: 'Key figures',
        group: 'Data',
        classes: ['kp-kpis', 'kp-kpi'],
        exports: [],
        // The tile's sparkline is `data-kp-spark`; its tone and its hint's
        // two states (`data-kp-when`) are read by the stylesheet, and the
        // time chart reads the same two words.
        aliases: ['spark', 'tone', 'when'],
        intro: 'A strip of key figures: each `.kp-kpi` tile a label, the number (with its unit and a note such as “avg 15 min” beside it), a trend line, and at the bottom a 24-hour sparkline or a meter. Every tile is as tall as the tallest on every row the strip wraps to, so labels, numbers and trend lines line up across it. js/kpi.js draws the sparklines and turns a tile into a filter toggle.',
        whenToUse:
            'At the top of a dashboard, for the handful of numbers a reader checks first. Not for a table of figures, and not for more than a row or two of tiles: a key figure that is one of thirty is not key.',
        examples: [
            {
                title: 'A strip: a meter, a sparkline, a link and a filter',
                why: 'The tile is a `div`, an `a` that leads to its detail, or a `button.kp-kpi--toggle` that turns a filter on this page on and off. Pressed, a filter tile takes a primary border over a faint primary background, and its corner word changes; the words are yours.',
                markup: `
<div class="kp-kpis" role="group" aria-label="Network at a glance">
<div class="kp-kpi">
<span class="kp-kpi__label">Pump houses online</span>
<span class="kp-kpi__value">14<small>of 15</small></span>
<span class="kp-kpi__trend">Pump house 7 offline</span>
<span class="kp-kpi__meter" role="meter" aria-label="Pump houses online: 93 %" aria-valuenow="93" aria-valuemin="0" aria-valuemax="100" style="--kp-value: 0.93"></span>
</div>
<a class="kp-kpi" href="#">
<span class="kp-kpi__label">Flow now</span>
<span class="kp-kpi__value">412<small>m³/h</small><span class="kp-kpi__note">avg 15 min</span></span>
<span class="kp-kpi__trend"><span class="kp-kpi__delta" data-kp-direction="up" data-kp-tone="good">6 %</span> on yesterday</span>
<svg class="kp-kpi__spark" data-kp-spark="380 371 352 340 335 338 360 395 430 451 448 440 436 429 431 440 452 470 480 466 441 420 409 412"></svg>
</a>
<button type="button" class="kp-kpi kp-kpi--toggle" aria-pressed="true" data-kp-tone="warning">
<span class="kp-kpi__label">Open incidents</span>
<span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Filter</span><span data-kp-when="on">Filtering ×</span></span>
<span class="kp-kpi__value">3</span>
<span class="kp-kpi__trend">2 new today</span>
</button>
</div>
`,
            },
            {
                title: 'A key figure that waits, one that acts, and the tones',
                why: 'A key figure still waiting for its number carries `aria-busy="true"`; a warning or a failed figure carries its tone; a figure that leads somewhere is an `a`. In pastel every key figure has a thumbtack pushed in at its top centre; the waiting one becomes caterpillar (a head on its top-end corner, stepping legs along its foot); a warning or failed figure’s label sits on its tone’s plate; and the one that acts peels its top-end corner into a fold under the pointer.',
                markup: `
<div class="kp-kpis" role="group" aria-label="Pump houses">
<div class="kp-kpi" aria-busy="true">
<span class="kp-kpi__label">Flow now</span>
<span class="kp-kpi__value">…</span>
<span class="kp-kpi__trend">Reading the meters</span>
</div>
<div class="kp-kpi" data-kp-tone="warning">
<span class="kp-kpi__label">Reservoir North</span>
<span class="kp-kpi__value">78<small>%</small></span>
<span class="kp-kpi__trend"><span class="kp-kpi__delta" data-kp-direction="up" data-kp-tone="bad">4 %</span> in the last hour</span>
</div>
<div class="kp-kpi" data-kp-tone="destructive">
<span class="kp-kpi__label">Pump house 7</span>
<span class="kp-kpi__value">0<small>bar</small></span>
<span class="kp-kpi__trend">Offline since 04:12</span>
</div>
<a class="kp-kpi" href="#">
<span class="kp-kpi__label">Alarms today</span>
<span class="kp-kpi__value">3</span>
<span class="kp-kpi__trend">See every alarm</span>
</a>
</div>
`,
            },
            {
                title: 'A long label wraps between words and is never cut',
                why: 'Added 2026-10-14 (`kpi-label-cut-M1`). A plain tile\u2019s label takes as many lines as it needs, breaking between words (a single word longer than the tile breaks inside it); it never ends in an ellipsis. The tiles of a row stretch to the tallest, so the row stays one height, and the figures sit directly under their labels. Here the window is 17rem wide and the tiles stack, each as wide as the window.',
                frame: { height: '15rem', width: '17rem' },
                markup: `
<div class="kp-kpis" role="group" aria-label="Pump house 3">
<div class="kp-kpi"><span class="kp-kpi__label">Discharge pressure at the reservoir inlet</span><span class="kp-kpi__value">3.1<small>bar</small></span><span class="kp-kpi__trend">two pumps running</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Flow</span><span class="kp-kpi__value">412<small>m\u00b3/h</small></span><span class="kp-kpi__trend">into the ring main</span></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-kpis', what: 'The strip: as many tiles a row as fit, every tile one height on every row.' },
            { name: '.kp-kpi', what: 'One tile: a `div`, an `a` (its border answers hover), or a `button.kp-kpi--toggle`.' },
            { name: '.kp-kpi__label, __value, __note, __trend', what: 'The label (small capitals; it wraps between words as often as the tile is narrow and is never cut, a word longer than the tile breaks; in a strip with `data-kp-kpis-columns` it keeps one line and the strip takes fewer columns instead), the number with a `<small>` unit, a note beside it, and the trend line.' },
            { name: '.kp-kpi__delta', what: 'A change in the trend line: `data-kp-direction="up|down"` puts ▲ or ▼ before it, `data-kp-tone="good|bad"` colours it.' },
            { name: '.kp-kpi__spark', what: 'An inline SVG with `data-kp-spark="12 14 13 …"`: the script draws a line over a soft area from the numbers, and again when they change.' },
    { name: '.kp-kpi__meter', what: 'The meter at the bottom of a tile: the same rules as `.kp-meter` (its own page), with a mark, past the end and loading; the tile’s tone colours its fill.' },
            { name: 'data-kp-tone', what: 'On the tile, `warning` or `destructive`: a coloured edge and a coloured number (and the meter’s fill).' },
            { name: '.kp-kpi--toggle', what: 'A filter tile: a click flips `aria-pressed` and fires `kp-kpi-toggle` with `detail.pressed`; the page filters. Pressed, a primary border over a faint primary background.' },
            { name: '.kp-kpi__hint', what: 'What a click does, beside the label, in the page’s words: one child `data-kp-when="off"`, one `data-kp-when="on"`.' },
            { name: 'data-kp-kpi-owned', what: 'Leaves a toggle to the page, for a framework that keeps the pressed state itself.' },
            { name: 'pastel: the thumbtack', what: 'In pastel every key figure is fixed to the page with a thumbtack at its top centre, the ones that act too. When a figure leaves, the tack comes out first, then it lifts off as its landing backwards and its space folds after the tack is out; one put back arrives as that backwards, the tack pushed in last.' },
            { name: 'pastel: tones and changes', what: 'A warning or failed figure’s label sits on its tone’s plate, and a change shows as a sticker on the figure; a value written with update() wobbles (the update page). A figure that acts (a link, a toggle) lifts and peels its top-end corner under the pointer and sticks down flat when pressed; its focus is the dashed line alone.' },
            { name: 'pastel: waiting', what: 'A key figure with `aria-busy="true"` becomes caterpillar while it waits: a head on its top-end corner and legs along its foot that step in turn (js/loading-pieces.js).' },
        ],
        accessibility: [
            'Built in — a filter tile is a real button with `aria-pressed`, so a screen reader says whether the filter is on.',
            'Built in — the sparkline is hidden from a screen reader unless it has a role of its own; the number and the trend line carry the meaning.',
            'Built in — a delta’s direction is a ▲ or ▼ as well as a colour.',
            'Yours — give the meter its `aria-label` and values, and say in the trend line what a sparkline would otherwise only show.',
            'Yours — keep the hint `aria-hidden`; the pressed state already says what it says.',
        ],
    },
    {
        id: 'meter',
        title: 'Meter with a mark',
        group: 'Data',
        classes: ['kp-meter'],
        exports: [],
        // What setMeter() writes for the stylesheet: a share past the end
        // (on the meter and on its mark) and the loading pulse.
        aliases: ['over', 'loading'],
        intro: 'A used-of-total bar that works anywhere: in a table cell, at the bottom of a key figure (`.kp-kpi__meter`), at the start of a line of words (`.kp-meter--inline`). the share property is the share, the mark property an optional tick across the bar (a target, a limit, what is booked) that sticks out above and below without making the meter taller. A share or a mark past the end shows a small ▸ at the end, and a screen reader hears the real numbers, past 100 % too. js/kpi.js writes it all in one call: `setMeter(el, { value, mark, tone, label, markLabel, loading })`.',
        whenToUse:
            'For one share of a whole that the reader compares with a line: a reservoir against its target, capacity against what is booked tonight, a plan against what was done. Not for progress that moves on its own (that is a progress bar), and not for many values side by side (that is a chart).',
        examples: [
            {
                title: 'A share against its mark, past the end, and in a line of words',
                why: 'Written the way `setMeter()` writes it, so it reads right before any script runs: `role="meter"`, `aria-valuenow` from 0 to 100, and an `aria-valuetext` that names the real share. The tick is a `.kp-meter__mark` child; past the end it carries `data-kp-over`.',
                markup: `
<div class="kp-stack">
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62" aria-valuetext="62% full; 80% the target level" style="--kp-value: 0.62; --kp-mark: 0.8"><span class="kp-meter__mark" aria-hidden="true"></span></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="58" aria-valuetext="58% running now; 130% booked for tonight" style="--kp-value: 0.58; --kp-mark: 1.3"><span class="kp-meter__mark" aria-hidden="true" data-kp-over></span></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-valuetext="112% of the plan used" data-kp-over style="--kp-value: 1.12"></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="78" aria-valuetext="78% full; 80% the overflow alarm" data-kp-tone="warning" style="--kp-value: 0.78; --kp-mark: 0.8"><span class="kp-meter__mark" aria-hidden="true"></span></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuetext="being measured" aria-busy="true" data-kp-loading style="--kp-value: 0"></span>
<p><span class="kp-meter kp-meter--inline" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="41" aria-valuetext="41% of today's plan; 55% planned by now" style="--kp-value: 0.41; --kp-mark: 0.55"><span class="kp-meter__mark" aria-hidden="true"></span></span>41 % of today’s plan, plan to 55 % by now</p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-meter', what: 'The bar: the share property from 0 up (above 1 the fill is full), on the muted track, the primary colour by default.' },
            { name: '.kp-kpi__meter', what: 'The same meter at the bottom of a key figure; a `data-kp-tone` on the tile colours its fill.' },
            { name: '.kp-meter__mark', what: 'The tick at the mark property, across the bar and a little above and below it, with a halo of the card colour so it reads on the fill and on the track. The meter is as tall with it as without.' },
            { name: 'data-kp-over', what: 'Past the end: on the meter, the share is above 1 and a ▸ sits at the bar’s end; on the mark, the tick stops just short of the end with the ▸ after it.' },
            { name: 'data-kp-tone', what: '`warning` or `destructive` on the meter: an amber or red fill.' },
            { name: 'data-kp-loading', what: 'Loading: the track pulses at its height (still under reduced motion), with no fill and no mark; `aria-busy` with it.' },
            { name: '.kp-meter--inline', what: 'Three rem wide, at the start of a line of words, its middle on the line’s middle.' },
            { name: 'setMeter(el, meter)', what: 'Writes the share, the mark (made the first time), the tone and the ARIA in one call; `meterText(value, mark, words)` and `meterParts(value, mark)` are the words and the arithmetic on their own.' },
            { name: 'pastel: loading', what: 'In pastel a meter with `data-kp-loading` (the last one in the example above) becomes a row of pom-poms with a head, as a busy progress bar does; a share that arrives is stuck on from its start corner on the soft landing.' },
        ],
        accessibility: [
            'Built in — `setMeter()` writes `role="meter"`, `aria-valuenow` (0 to 100) and an `aria-valuetext` with the real share and the mark, past 100 % too (“58% running now; 130% booked for tonight”).',
            'Built in — past the end is a ▸ as well as a full bar, so it does not rest on colour; a tone is a colour and the words carry the same.',
            'Built in — the loading pulse stops under reduced motion; a loading meter says “being measured” (`meterMeasuring`).',
            'Yours — the words: `label` names the share (“full”) and `markLabel` the mark (“the target level”); without a `label` the dictionary’s `meterUsed` is used. In markup you write the same `aria-valuetext` yourself.',
        ],
    },
    {
        id: 'kpi-columns',
        title: 'Key figures on allowed column counts',
        group: 'Data',
        classes: [],
        exports: [],
        // The strip's list of allowed counts, and the flag the script writes
        // when no count avoids a lone tile.
        aliases: ['kpis-columns', 'kpis-span-last'],
        intro: 'A strip of key figures that never leaves one tile alone on a row. `.kp-kpis[data-kp-kpis-columns="all 3 2 1"]` takes the first count in the list at which every tile is at least its minimum width wide, measured by the strip’s own width (not the window’s); if that leaves one tile alone on the last row it steps down to a count that does not, and only when none exists does the last tile span the whole row. js/kpi.js keeps it so as the strip resizes and as tiles come and go: `attachKpiStrips(root)`.',
        whenToUse:
            'For a strip whose number of tiles changes with the data (hosts, pumps, queues), or that sits in a column of changing width, where the package’s plain auto-fit would leave a single tile on the last row. Not needed for a fixed set of tiles that always fits.',
        examples: [
            {
                title: 'Five tiles, three a row at most',
                why: 'At a desk width the five sit on one row (`all`); narrower, three would leave 3 + 2, so three it is; at a phone width two would leave 2 + 2 + 1, and with no count left that avoids it the fifth spans its row. Before the script runs the strip keeps the package’s auto-fit.',
                markup: `
<div class="kp-kpis" data-kp-kpis-columns="all 3 2 1" role="group" aria-label="The northern network right now">
<div class="kp-kpi"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1<small>bar</small></span><span class="kp-kpi__trend">two pumps running</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Flow</span><span class="kp-kpi__value">412<small>m³/h</small></span><span class="kp-kpi__trend">into the ring main</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Reservoir North</span><span class="kp-kpi__value">71<small>%</small></span><span class="kp-kpi__trend">target 80 %</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Reservoir South</span><span class="kp-kpi__value">64<small>%</small></span><span class="kp-kpi__trend">target 80 %</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">2</span><span class="kp-kpi__trend">one needs a visit</span></div>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-kpis-columns', what: 'The allowed counts, largest first: numbers and `all` (as many as there are tiles), for example `"all 3 2 1"` or `"4 2 1"`.' },
            { name: 'data-kp-kpis-span-last', what: 'Written by the script when no allowed count avoids a lone tile: the last tile spans its row.' },
            { name: 'kpiColumns(n, width, options)', what: 'The pure rule: `{ columns, spanLast }` for `n` tiles in `width` px, with `allowed`, `minTilePx` (144) and `gapPx` (16); `fitKpiStrip(strip)` applies it once.' },
        ],
        accessibility: [
            'Built in — only the layout changes; the tiles keep their order in the markup and in the tab order.',
            'Yours — name the strip (`role="group"` with an `aria-label`), as for any strip of key figures.',
        ],
    },
    {
        id: 'kpi-trend',
        title: 'Key figure with its 24-hour trend',
        group: 'Data',
        classes: [],
        exports: [],
        // The spark variant's two options, and the chip's two-line form.
        aliases: ['spark-head', 'spark-axis', 'stacked'],
        intro: 'A key figure whose whole tile opens its chart, with its last 24 hours inside it. `.kp-kpi--trend` stretches its `.kp-kpi__link` over the tile; the trend is the time chart’s spark variant without its head line (`data-kp-spark-head="none"`), with the axis under it (`data-kp-spark-axis="relative"`): where it starts, as `14:40 yesterday`, and `now`. A pointer, a finger or the arrow keys read one point: a crosshair and a chip with its moment and value over the line, kept inside the tile. A note such as “avg 15 min” goes in the label, in its capitals (`.kp-kpi__label-note`). js/chart.js draws it.',
        whenToUse:
            'At the top of a dashboard, for the few readings whose last day matters as much as their value now, each leading to its full chart. Not for a reading whose history nobody looks at (a plain key figure), and not for comparing sources (the time chart).',
        examples: [
            {
                title: 'A trend tile, its data in the markup',
                why: 'The data is the page’s: a JSON child as here, or `setTrendData(figure, { points, step, unit, digits })` from a script (`null` is loading). The axis counts from the reader’s now on the Brussels clock; this sample’s readings are from 04/10/2026, so it names their dates.',
                markup: `
<div class="kp-kpis" data-kp-kpis-columns="4 2 1" role="group" aria-label="Pump house 1 right now">
<div class="kp-kpi kp-kpi--trend">
<span class="kp-kpi__label">Pressure <span class="kp-kpi__label-note">avg 15 min</span></span>
<a class="kp-kpi__link" href="#" title="Open Pressure on Charts"><span class="kp-kpi__link-word">Charts</span> ↗</a>
<span class="kp-kpi__value">3.30<small>bar</small></span>
<span class="kp-kpi__trend">now <b>3.36 bar</b> · peak 3.58 bar · two pumps</span>
<figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="Pressure, last 24 hours">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pressure","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]}]}</script>
</figure>
</div>
</div>
`,
            },
            {
                title: 'A long label wraps and stops before the corner link',
                why: 'Added 2026-10-14 (`kpi-label-cut-M1`). The trend tile\u2019s label stops before the corner link and, where it does not fit, wraps between words instead of ending in an ellipsis. Two label lines are kept for it whether it wraps or not, so a row of trend tiles stays one height. Here the window is 14rem wide, one tile.',
                frame: { height: '22rem', width: '14rem' },
                markup: `
<div class="kp-kpis" role="group" aria-label="Pump house 1">
<div class="kp-kpi kp-kpi--trend">
<span class="kp-kpi__label">Discharge pressure at the reservoir inlet</span>
<a class="kp-kpi__link" href="#" title="Open Pressure on Charts"><span class="kp-kpi__link-word">Charts</span> \u2197</a>
<span class="kp-kpi__value">3.30<small>bar</small></span>
<span class="kp-kpi__trend">now <b>3.36 bar</b> \u00b7 two pumps</span>
<figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="Pressure, last 24 hours">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pressure","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]}]}</script>
</figure>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-kpi--trend', what: 'The tile: its link stretched over it, the trend a second stop for the keyboard; the whole tile takes the focus ring while its link has it.' },
            { name: '.kp-kpi__label (trend tile)', what: 'Stops before the corner link and wraps between words, never cut; two lines are kept for it so a row of trend tiles stays one height.' },
            { name: '.kp-kpi__link', what: 'The corner link (“Charts ↗”); in a tile of 12rem or less only ↗ shows, the word stays for a screen reader (`.kp-kpi__link-word`).' },
            { name: '.kp-kpi__label-note', what: 'A note in the label, in its capitals, after a dot: “PRESSURE · AVG 15 MIN”.' },
            { name: 'data-kp-spark-head="none"', what: 'On a `[data-kp-chart="spark"]`: no name and value line; a reading is a chip over the line, on the trend’s own crosshair, and a click that was not a drag follows the tile’s link.' },
            { name: 'data-kp-spark-axis="relative"', what: 'The axis under the line: the first point’s clock and day (`today`, `yesterday`, else its date) and `now` while the last point is at most two steps old, else its clock. One point or none: two no-break spaces, so the row keeps its height.' },
            { name: 'data-kp-stacked', what: 'Written on the chip when moment and value do not fit on one line: the value goes under the moment. When even that does not fit, the reading takes the axis row.' },
            { name: 'states', what: 'Loading (`setTrendData(figure, null)`, or no data yet): the trend empty at its height, the tile `aria-busy`. No points: no trend, no tab stop. One point: the same, with the axis kept.' },
            { name: 'trendAxis(points, { now, step })', what: 'The axis words on their own; `attachTrendCharts(root, options)` draws only the trends under `root` (attachCharts() draws them too).' },
        ],
        accessibility: [
            'Built in — no control sits inside the link: the tile’s link is one tab stop, the trend (`role="application"`, named by the figure’s `aria-label`) the next, and only while it has two points or more.',
            'Built in — ←/→ read point by point (Shift: ten), Home and End go to the ends, Esc hides the reading; what a key reads is said through a polite live region, with the keys described (`chartTrendKeys`).',
            'Built in — every moment is `dd/mm/yyyy HH:mm` on the Brussels clock (rule 52); the words `now`, `today` and `yesterday` are the dictionary’s.',
            'Yours — name the figure (“Pressure, last 24 hours”) and give the link a title that says where it goes; say the value that matters in the tile’s words, not only in the line.',
        ],
    },
    {
        id: 'chart',
        title: 'Time chart',
        group: 'Data',
        classes: ['kp-chart', 'kp-chart-group', 'kp-chart-ranges', 'kp-chart-zoom'],
        exports: [],
        // The marks the script writes on what it draws: a source's colour
        // (`data-kp-series`, `data-kp-dash`), a legend button kept off, a
        // pinned tooltip, an event's tone, the hint's two audiences.
        aliases: ['series', 'dash', 'off', 'pinned', 'tone', 'when', 'outside'],
        intro: 'The one time chart every page draws, so its controls mean the same everywhere. js/chart.js draws a `[data-kp-chart]` from the page’s data: a legend that singles a source out and keeps sources on or off, a crosshair every chart of a group shares, a tooltip beside it with every value, the change over the hour before and the events within reach, drag to zoom, event markers, range buttons, and a spark variant that is a tile’s 24-hour line on the same crosshair.',
        whenToUse:
            'For readings over time: pressures, flows, response times, a queue’s length. Not for a share of a whole or a comparison of categories, and not for a single number now, which is a key figure.',
        examples: [
            {
                title: 'Two sources, an alarm level and events',
                why: 'The data is the page’s, here as a JSON child (`setChartData()` does the same from a script). Point at the plot for the tooltip, click to pin it, drag to zoom, and use ←/→, Home/End, Enter and Esc on the focused plot. With one or two sources on, a soft area lies under each line.',
                markup: `
<figure class="kp-chart" data-kp-chart aria-label="Pressure" lang="en-GB">
<figcaption class="kp-chart__title">Pressure, bar</figcaption>
<script type="application/json" data-kp-chart-data>{"label":"Pressure","unit":"bar","digits":2,"threshold":2.1,"series":[{"label":"Pump house 1","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]},{"label":"Pump house 3","start":1791010800000,"step":3600000,"values":[2.77,2.86,2.86,2.89,2.87,2.9,2.85,2.87,2.83,2.75,2.74,2.76,2.84,2.84,2.85,2.87,2.92,2.97,3,3.01,2.91,2.83,2.69,1.92,2.76]}],"events":[{"at":1791087000000,"label":"Valve swap, ring main","tone":"info"},{"at":1791091920000,"label":"Alarm: pump house 3 below 2.1 bar","tone":"critical"},{"at":1791094320000,"label":"Pump restart, pump house 3","tone":"warning"}]}</script>
</figure>
`,
            },
            {
                title: 'A group with ranges, a zoom chip and a spark',
                why: 'The charts of one `[data-kp-chart-group]` share a crosshair, a zoom and a range. A range button fires `kp-chart-range` before the charts redraw, so the page can hand them that range’s data; the chip shows a zoom and resets it.',
                markup: `
<div class="kp-chart-group" data-kp-chart-group data-kp-chart-span="24h" lang="en-GB">
<div class="kp-chart-group__bar">
<div class="kp-chart-ranges" role="group" aria-label="Time range">
<button type="button" class="kp-button kp-button--sm" data-kp-chart-range="6h">6 h</button>
<button type="button" class="kp-button kp-button--sm" data-kp-chart-range="24h">24 h</button>
</div>
<span class="kp-chart-zoom" data-kp-chart-zoom hidden></span>
</div>
<figure class="kp-chart" data-kp-chart aria-label="Pump house 1">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pump house 1","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]}]}</script>
</figure>
<div class="kp-chart" data-kp-chart="spark" aria-label="Pump house 3">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pump house 3","start":1791010800000,"step":3600000,"values":[2.77,2.86,2.86,2.89,2.87,2.9,2.85,2.87,2.83,2.75,2.74,2.76,2.84,2.84,2.85,2.87,2.92,2.97,3,3.01,2.91,2.83,2.69,1.92,2.76],"colour":"var(--chart-2)"}]}</script>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-outside', what: 'Written on the tooltip while its pinned moment lies outside the window: it docks at the plot’s edge and says so.' },
            { name: '[data-kp-chart]', what: 'A chart; usually a `figure.kp-chart` with a `.kp-chart__title` caption. Its data comes from a `script[type="application/json"][data-kp-chart-data]` child or from `setChartData(el, data)`, before or after it is attached.' },
            { name: 'data-kp-chart="spark"', what: 'The spark variant: one source’s line over a soft area, its value at the crosshair (or now) beside its name, on the group’s crosshair.' },
            { name: '.kp-chart-group', what: '`[data-kp-chart-group]`: the charts in it share one crosshair, one zoom and one range; `data-kp-chart-span="24h"` is the window (`15m`, `1h`, `7d` …).' },
            { name: '.kp-chart-ranges', what: 'The range buttons, each with `data-kp-chart-range`; the script writes `aria-pressed` on the one in force and fires `kp-chart-range`.' },
            { name: '.kp-chart-zoom', what: '`[data-kp-chart-zoom]`: the chip the script fills while the group is zoomed, with its Reset; `kp-chart-zoom` fires on the group.' },
            { name: 'the legend', what: 'Hover or focus singles a source out; a click keeps one or several on and fires `kp-chart-select`; Show all and Esc reset. Hidden for a single source.' },
            { name: 'the tooltip', what: 'Beside the crosshair, on the side with room: every visible source’s value, ▲/▼ over the hour before, the events within a thirtieth of the window. A click pins it; ✕ or Esc releases it.' },
            { name: 'colours', what: 'The theme’s five chart colours in order; from the sixth source on they come round again with one of three dashes. A series’ own `colour` overrides.' },
            { name: 'under the lines', what: 'A soft area while one or two sources are on, a stronger one for a source alone; with three or more, the lines alone. Stacked sources are areas.' },
        ],
        accessibility: [
            'Built in — the plot is focusable, with ←/→ (Shift: ten points), Home/End, Enter to pin and Esc to step back; what is under the crosshair is said through a polite live region, on keys and pins only.',
            'Built in — the legend’s buttons carry `aria-pressed`; a source kept off is faded and named so in its title.',
            'Built in — the hint under the legend speaks to a pointer or to a finger, never both.',
            'Built in — every word the chart says is in the dictionary (`chart…` in js/strings.js); `attachCharts(root, { strings, locale })` overrides them per chart.',
            'Yours — name each chart (`aria-label`) and give it a caption; the drawing itself is hidden from a screen reader.',
            'Yours — say the reading that matters in text near the chart; a chart is the overview, not the only place a number lives.',
        ],
    },
    {
        id: 'graph',
        title: 'Network graph',
        group: 'Data',
        classes: ['kp-graph'],
        exports: [],
        // The marks the script writes on what it draws and reads back: a
        // link's ends and kind (`data-kp-from`, `-to`, `-kind`), its dash
        // (`data-kp-style`), a node's id, Show all at rest (`-idle`), a
        // graph with a node lit (`-focus`), its state, and the host's key
        // that `decorate` passes on.
        aliases: ['key', 'style', 'from', 'to', 'kind', 'id', 'idle', 'state', 'focus'],
        intro: 'A picture of a network: one node in the middle, the rest on a ring around it from the top, clockwise, A to Z and then the nodes outside the network, the links drawn by kind (a colour and a dash each, listed above the picture with Show all). Hover or focus a node to see only its links; click it, or press Enter, to keep it picked, several at once; Esc or Show all clears. Each node takes its own hue at the theme’s chart lightness. A label points away from the middle and is shortened, with an ellipsis, where it would touch another or leave the picture; the full name stays in its title and its accessible name. js/graph.js builds it from the page’s data.',
        whenToUse:
            'For a network with one centre that everything reports to or is reached from: a control centre and its sites, a server and the services it talks to. Not for a network without a centre, not for a flow with a direction that matters more than the links, and not past a few dozen nodes, where the ring’s labels shrink to a letter.',
        examples: [
            {
                title: 'A control centre, its sites and two kinds of link',
                why: 'The data is the page’s, here as a JSON child (`setGraphData()` does the same from a script). The hub is the node named in `hub`, else the one with the most links. A kind the links do not use is left out of the list; a node marked `external` has a dashed grey ring and sits at the end of the ring.',
                markup: `
<figure class="kp-graph" data-kp-graph aria-label="The northern network">
<script type="application/json" data-kp-graph-data>{"hub":"centre","nodes":[{"id":"centre","label":"Control centre","description":"where every reading arrives"},{"id":"ph1","label":"Pump house 1","description":"two pumps, ring main west"},{"id":"ph2","label":"Pump house 2","description":"one pump, the old town"},{"id":"ph3","label":"Pump house 3","description":"two pumps, ring main north","flag":"mismatch"},{"id":"north","label":"Reservoir North","description":"level sensor and an inlet valve"},{"id":"weather","label":"Weather service","description":"an address outside the network","external":true}],"edges":[{"from":"ph1","to":"centre","kind":"telemetry"},{"from":"ph2","to":"centre","kind":"telemetry"},{"from":"ph3","to":"centre","kind":"telemetry"},{"from":"north","to":"centre","kind":"telemetry"},{"from":"centre","to":"ph1","kind":"control","detail":"pump start and stop"},{"from":"weather","to":"centre","kind":"telemetry","detail":"rain radar every 10 min"}],"kinds":[{"kind":"telemetry","label":"Telemetry","hint":"Readings sent every minute","style":"solid","colour":"var(--chart-1)"},{"kind":"control","label":"Remote control","hint":"Commands to the site","style":"dash","colour":"var(--chart-2)"},{"kind":"radio","label":"Radio link","hint":"A spare path over radio","style":"dot","colour":"var(--chart-4)"}]}</script>
</figure>
`,
            },
        ],
        variants: [
            { name: '[data-kp-graph]', what: 'A graph; usually a `figure.kp-graph` with an `aria-label`. Its data comes from a `script[type="application/json"][data-kp-graph-data]` child or from `setGraphData(el, data)` after the attach; until then it shows loading.' },
            { name: '.kp-graph__bar', what: 'Over the picture: the kinds of link (`.kp-graph__kinds`, one `.kp-graph__kind` toggle each, the ones the links use) and Show all, which keeps its place while there is nothing to show again (`data-kp-idle`).' },
            { name: '.kp-graph__box', what: 'The picture (`.kp-graph__svg`) at the height it is drawn at (see the knobs), in every state, with `.kp-graph__note` for the state’s sentence.' },
            { name: '.kp-graph__hint', what: 'What a pointer, a click and the keys do, under the picture in the page’s flow.' },
            { name: '.kp-graph__edge', what: 'A link: its kind’s colour (the kind’s `colour`, a token such as `var(--chart-2)`) and dash (`data-kp-style="solid|dash|dot|long-dash"`). Two links between one pair bend apart, 26 px a step.' },
            { name: '.kp-graph__node', what: 'A node: a ring (`__ring`), a core (`__core`) in its own hue (spread over the nodes A to Z unless a node gives its own `hue`), and its label (`__label`). A `weight` from 0 to 1 sizes it.' },
            { name: '.kp-graph__node--hub', what: 'The node in the middle; its label sits under it.' },
            { name: '.kp-graph__node--external', what: 'A node outside the network (`external: true`): a dashed grey ring, no core, at the end of the ring.' },
            { name: '.kp-graph__flag', what: 'A dotted ring around a node whose `flag` is `mismatch`: its settings differ from the plan.' },
            { name: 'lit, dim, picked', what: 'While a node is hovered, focused or picked, its links are `is-on`, the rest `is-dim`, and the nodes they do not reach fade; a picked node has a thicker ring. A kind turned off is `is-hidden`.' },
            { name: 'data-kp-state', what: 'Written by the script: `loading` (the ring pulses; still under reduced motion), `empty` or `error` (a red dot before the page’s sentence), each at the picture’s full height; `ready` once it has nodes.' },
        ],
        accessibility: [
            'Built in — the picture is one tab stop: Tab lands on the hub (or the node last focused), the arrow keys walk the ring, Home and End jump, Enter or Space picks, Esc shows all again.',
            'Built in — every node is a `role="button"` with `aria-pressed` and the accessible name “label, description”; the picture is a named group whose name ends with the hint.',
            'Built in — a shortened label keeps the full name in the node’s title and accessible name; the labels are fitted again when a web font arrives.',
            'Built in — a kind toggle is a real button with `aria-pressed` and the kind’s hint as its title; a kind turned off is crossed out as well as faded.',
            'Built in — a live update keeps the focus and the picks by id; a hover or a pick changes classes only, so the node under the pointer is never rebuilt.',
            'Yours — name the graph (`aria-label`), give every node a `description` worth hearing, and say in text near it what a reader must not miss; the picture is the overview.',
        ],
    },
    {
        id: 'state-word',
        title: 'State word',
        group: 'Data',
        classes: ['kp-state-word'],
        exports: [],
        aliases: ['words'],
        intro: 'A word that changes with its state (“Running”, “Stopped”, “in 3 min”) and keeps the width of the widest word it can show, so nothing beside it moves when it changes. `setStateWord(el, word)` in js/components.js changes it and adds a new word to the ones it keeps room for.',
        whenToUse:
            'Where a state sits in front of a control that changes it: a second click without moving the mouse must hit the same button. Not for running text, where a word may take the room it needs.',
        examples: [
            {
                title: 'A pump, its state and its button',
                why: 'The words are listed in `data-kp-words`, one per line (`&#10;` between them in markup); an invisible line of no height holds the widest.',
                markup: `
<p class="kp-row"><b>Pump 1</b> <span class="kp-state-word" data-kp-words="Running&#10;Stopped&#10;Starting in 3 min">Stopped</span> <button type="button" class="kp-button kp-button--sm">Start</button></p>
`,
            },
        ],
        variants: [
            { name: '.kp-state-word', what: 'As wide as the widest of its words, the shown word at its start.' },
            { name: '.kp-state-word--center', what: 'The shown word in the middle of that width.' },
            { name: 'data-kp-words', what: 'Every word it can show, one per line. `setStateWord()` adds a word that is new, so the width never shrinks back.' },
        ],
        accessibility: [
            'Built in — the held width is an invisible pseudo-element; a screen reader reads the shown word only.',
            'Yours — announce a state change that matters (a live region nearby); the word changing on screen is silent.',
        ],
    },
    {
        id: 'freshness',
        title: 'Freshness line',
        group: 'Data',
        classes: ['kp-ago'],
        exports: [],
        aliases: ['ago', 'updated', 'stale'],
        intro: 'A ticking “updated 42 s ago” (js/freshness.js): one timer per page, a width held at the widest text of its unit so nothing beside it moves, a stale plate once the moment is older than `data-kp-stale-after`, and the moment itself as dd/mm/yyyy HH:mm in Europe/Brussels in the title. It stays out of live regions: a line that ticks must not be read aloud every second.',
        whenToUse:
            'Where a page shows data that goes stale: a dashboard’s last reading, a list’s last refresh. Not for a fixed date: write that out.',
        examples: [
            {
                title: 'A reading’s freshness, stale after three minutes',
                why: 'The moment is the `datetime`; the verb is yours; past 180 s the line takes the stale plate and `data-kp-stale`.',
                markup: `
<time class="kp-ago" datetime="2026-10-04T12:00:00Z" data-kp-ago data-kp-ago-verb="updated" data-kp-stale-after="180">updated 42 s ago</time>
`,
            },
        ],
        variants: [
            { name: 'data-kp-ago', what: 'The line itself; the moment is the `datetime`, or this attribute’s value (ISO or ms).' },
            { name: 'data-kp-ago-verb', what: 'The word before the age (“updated”, “read”); the dictionary’s `agoVerb` when absent.' },
            { name: 'data-kp-stale-after', what: 'Seconds after which the line is stale and carries `data-kp-stale`; the stale plate’s three knobs are listed below.' },
            { name: 'data-kp-stale', what: 'Written by the module while the moment is older than `data-kp-stale-after`. Read it, do not set it.' },
            { name: 'data-kp-ago-width', what: 'Written by the module: the held width, measured once per unit and cached by font.' },
            { name: 'data-kp-ago-announce', what: '`state` announces only the change to stale and back, through a polite region of its own; the ticking itself is never announced.' },
            { name: 'data-kp-ago-voice', what: 'Written by the module: the live region it announces through when `data-kp-ago-announce` is set.' },
        ],
        accessibility: [
            'Built in — `aria-live="off"`, `aria-description` with the moment written out, a console warning when the line sits inside a live region.',
            'Yours — keep the line out of `role="status"`; announce staleness with `data-kp-ago-announce="state"` if it matters.',
        ],
    },
    {
        id: 'calendar',
        title: 'Month heatmap',
        group: 'Data',
        classes: ['kp-calendar', 'kp-calendar-layout'],
        exports: [],
        // The calendar's own hooks follow from its class (`data-kp-calendar-…`);
        // these are the generic ones it reads or writes on its parts.
        aliases: ['time-zone', 'locale', 'week-starts-on', 'heading-level', 'key', 'date', 'tone', 'today', 'pad', 'state'],
        intro: 'A month as a grid of days, each a plate in the colour of its state, with a short count under the number: a month of nightly backups, of shifts covered, of readings received. js/calendar.js builds it into a `section.kp-calendar[data-kp-calendar]`: the month’s title between ‹ Prev and Next ›, Today, a line for the state, a six-week `table[role=grid]` with one tab stop and the keys of a date grid, and a legend. The page hands it every day’s state by date; today is the day in Europe/Brussels, whatever the reader’s zone.',
        whenToUse:
            'Where a reader looks for the bad days in a month of one daily outcome and picks one to see why. Not for picking a date in a form, which is the date picker, and not for a value over time, which is a time chart.',
        examples: [
            {
                title: 'A month of nightly backups, with the page’s detail beside it',
                why: 'The markup is the empty section; the script builds the rest and the page gives the days with `setCalendarDays(el, { "2026-10-04": { tone: "warn", count: "7/9", label: "7 of 9 services backed up" } })`. A picked day fires `kp-calendar-pick`; the page fills the aside. Under 45rem the aside goes under the grid.',
                markup: `
<div class="kp-calendar-layout">
<section class="kp-calendar" data-kp-calendar data-kp-calendar-month="2026-10" lang="en-GB" aria-label="Nightly backups"></section>
<aside aria-live="polite"><p>Pick a day to see every service’s own state that night.</p></aside>
</div>
`,
            },
            {
                title: 'A month that loads',
                why: 'The page says the month is loading with `setCalendarState(el, "loading", words)` and done with `setCalendarState(el, "ready")`; `.kp-calendar--busy-whole` puts one card over the grid while it loads, `.kp-calendar--busy-days` makes every day wait on its own. In pastel everything becomes caterpillar: the card over the month gets a head and stepping legs and is stuck on and taken off as the theme’s landing; in the second month every loading day gets a pom-pom rim and two legs, rises in turn, and the last of its week has a head beside it. Press Load and Loaded.',
                markup: `
<div class="kp-row kp-gap-sm kp-mb-md" role="group" aria-label="The months’ state">
<button type="button" class="kp-button kp-button--sm" data-doc-calendar="loading">Load</button>
<button type="button" class="kp-button kp-button--sm" data-doc-calendar="ready">Loaded</button>
</div>
<div class="kp-stack">
<section class="kp-calendar kp-calendar--busy-whole" data-kp-calendar data-kp-calendar-month="2026-10" lang="en-GB" aria-label="Nightly backups, one card while loading" data-doc-calendar-month></section>
<section class="kp-calendar kp-calendar--busy-days" data-kp-calendar data-kp-calendar-month="2026-10" lang="en-GB" aria-label="Nightly backups, each day waiting" data-doc-calendar-month></section>
</div>
<script type="module">
import { setCalendarState } from '../../js/calendar.js';
document.addEventListener('click', (event) => {
const button = event.target instanceof Element ? event.target.closest('[data-doc-calendar]') : null;
if (!button) return;
const state = button.getAttribute('data-doc-calendar') === 'loading' ? 'loading' : 'ready';
for (const month of document.querySelectorAll('[data-doc-calendar-month]')) setCalendarState(month, state, state === 'loading' ? 'Reading the backups: 4 of 9 services read.' : '');
});
</script>
`,
            },
        ],
        variants: [
            { name: '[data-kp-calendar]', what: 'The calendar; `data-kp-calendar-month="YYYY-MM"` is the month it shows first (today’s by default) and `data-kp-calendar-selected="YYYY-MM-DD"` the day picked at first.' },
            { name: '.kp-calendar-layout', what: 'The calendar beside the page’s own detail of the picked day; one column under 45rem of its own width.' },
            { name: 'data-kp-tone="ok|warn|bad"', what: 'A day on its status plate, the text in the plate’s own ink: all done, partly done, nothing done.' },
            { name: 'data-kp-tone="muted|none"', what: 'Nothing to do that day (a muted plate), or nothing known about it (an outline).' },
            { name: 'data-kp-tone="future|before"', what: 'A day still to come, or from before anything was kept: a dashed outline, no count.' },
            { name: 'data-kp-tone="loading"', what: 'Every day while `setCalendarState(el, "loading", words)`: a muted plate that pulses, at rest under reduced motion.' },
            { name: 'data-kp-today', what: 'Written on today’s day: an inner ring in the text colour.' },
            { name: 'td[aria-selected="true"]', what: 'The picked day: an outer ring in the primary colour; the focus ring sits further out.' },
            { name: '.kp-calendar__pad', what: 'The neighbouring months’ days in the first and last weeks: their numbers, quiet and inert, so every week reads full.' },
            { name: '.kp-calendar__state', what: 'The line under the month: the words of `setCalendarState()`; an error’s after a dot in the destructive colour.' },
            { name: '.kp-calendar__legend', what: 'A swatch and its words per tone, from `setCalendarLegend(el, [{ tone, label }])`; hidden until given.' },
            { name: '.kp-calendar--busy-whole / --busy-days', what: 'How a loading month shows: one card with the theme’s spinner and the state’s words over the whole grid, or the theme’s spinner in every loading day. Without either, the loading days pulse.' },
            { name: 'pastel: the caterpillar', what: 'In pastel a loading day gets a pom-pom rim and two legs and rises in turn, with a head beside the last loading day of its week; the card over the whole month is a plate with its own pass, a head on its corner and stepping legs, stuck on as the landing and taken off as that backwards.' },
            { name: '--kp-calendar-busy-words', what: 'In a register: `hold` keeps the card’s words on the card while it leaves, so the card that goes is the one that came (pastel); js/calendar.js writes `data-kp-busy-words-held` on the card until it has gone. Unset, the words clear at once.' },
        ],
        accessibility: [
            'Built in — one `table[role=grid]` named by the month’s title, seven column heads with the full weekday as their `abbr`, and one tab stop: arrows, Home/End, Page Up/Down (Shift: a year), Enter or Space to pick.',
            'Built in — every day is named by its date as dd/mm/yyyy and the page’s words for it, so the colour is never the only carrier.',
            'Built in — a live update repaints in place: the focus and the pick stay on the same element.',
            'Yours — give each day words that say what its colour says (`label`), and name the calendar (`aria-label`) when the month’s title alone does not say what it counts.',
            'Yours — put the detail of a picked day in a polite live region, or move the focus there, so a screen reader hears it.',
        ],
    },
    {
        id: 'segmented',
        title: 'Segmented control and filter chips',
        group: 'Forms',
        classes: ['kp-segmented'],
        exports: [],
        intro: 'A group of buttons that choose among a few values, in two looks: a track with a plate under the chosen segment, or the same buttons as separate pills (`.kp-segmented--chips`). With `data-kp-segmented="single"` (the default) it is a radio group with one value on; with `multi` each press turns one value on or off, several may be on, and none on means everything is shown. js/segmented.js writes the roles, the states, the roving tab stop and, in the track look, the position of the plate.',
        whenToUse:
            'For a choice among two to six values that changes what a list or a chart shows, where every value should stay in sight: a status filter, a view, a range. Not for a long list of values (use a select or a combobox), and not for navigation between pages (use tabs or links).',
        examples: [
            {
                title: 'One value on, with counts',
                why: 'The markup is complete without the script: the roles and `aria-checked` are written, so it is right before anything runs. The script adds the roving tab stop, the arrow keys and the plate.',
                markup: `
<div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="Show">
<button type="button" class="kp-segmented__item" data-value="changed" role="radio" aria-checked="true"><span class="kp-segmented__label">Changed</span><span class="kp-segmented__count">12</span></button>
<button type="button" class="kp-segmented__item" data-value="all" role="radio" aria-checked="false"><span class="kp-segmented__label">All</span><span class="kp-segmented__count">48</span></button>
<button type="button" class="kp-segmented__item" data-value="failed" role="radio" aria-checked="false"><span class="kp-segmented__label">Failed</span><span class="kp-segmented__count">2</span></button>
</div>
`,
            },
            {
                title: 'Chips that combine, with an All chip',
                why: 'In `multi` mode each chip is a toggle with `aria-pressed`. The chip marked `data-kp-segmented-all` is pressed while nothing else is, and pressing it turns the rest off.',
                markup: `
<div class="kp-segmented kp-segmented--chips" data-kp-segmented="multi" role="group" aria-label="Status">
<button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all aria-pressed="true"><span class="kp-segmented__label">All</span></button>
<button type="button" class="kp-segmented__item" data-value="running" aria-pressed="false"><span class="kp-segmented__label">Running</span></button>
<button type="button" class="kp-segmented__item" data-value="stopped" aria-pressed="false"><span class="kp-segmented__label">Stopped</span></button>
</div>
`,
            },
            {
                title: 'Full width, and counts that arrive later',
                why: '`.kp-segmented--block` gives every segment the same width on a full-width control. While the group is `aria-busy="true"` the counts show as quiet placeholders that keep their place; `setSegmentedCounts` writes the numbers, and the group is released, so nothing moves. Press the button to load them again. The group also reports `kp-segmented-change` with `{ value, values, item }`.',
                markup: `
<div class="kp-segmented kp-segmented--block" id="doc-seg-load" data-kp-segmented="single" role="radiogroup" aria-label="Show" aria-busy="true">
<button type="button" class="kp-segmented__item" data-value="all" role="radio" aria-checked="true"><span class="kp-segmented__label">All</span><span class="kp-segmented__count"></span></button>
<button type="button" class="kp-segmented__item" data-value="running" role="radio" aria-checked="false"><span class="kp-segmented__label">Running</span><span class="kp-segmented__count"></span></button>
<button type="button" class="kp-segmented__item" data-value="failed" role="radio" aria-checked="false"><span class="kp-segmented__label">Failed</span><span class="kp-segmented__count"></span></button>
</div>
<button type="button" class="kp-button kp-mt-sm" id="doc-seg-reload">Load the counts again</button>
`,
                script: `
import { attachSegmented, setSegmentedCounts } from '@kp-soft/themes/js/segmented';

const group = document.getElementById('doc-seg-load');
attachSegmented(group.parentElement);
const load = () => {
    group.setAttribute('aria-busy', 'true');
    setTimeout(() => {
        setSegmentedCounts(group, { all: 48, running: 31, failed: 2 });
        group.removeAttribute('aria-busy');
    }, 1500);
};
document.getElementById('doc-seg-reload').addEventListener('click', load);
load();
`,
            },
        ],
        variants: [
            { name: '.kp-segmented--chips', what: 'The same buttons as separate pills instead of a track; the chosen chip takes the primary colour.' },
            { name: '.kp-segmented__count', what: 'A number beside the label. While the group is `aria-busy="true"` it shows a placeholder, so nothing moves when the numbers arrive.' },
            { name: 'disabled', what: '`disabled` on an item, or `aria-disabled="true"` on the group, takes it out of the arrow keys and dims it.' },
            { name: 'overflow', what: 'When the segments are wider than the group, the group scrolls and the chosen segment is kept in view.' },
            { name: '.kp-segmented--block', what: 'Every segment the same width, on a full-width control.' },
            { name: 'data-kp-segmented-collapse="false"', what: 'In `multi`, turning every other value on is the same as none, so the group goes back to All. This keeps them on.' },
            { name: 'data-kp-segmented-thumb / -glide / -overflow', what: 'Written by the script, never by you: the plate is placed, it glides only after its first placement, and the segments are wider than the group. The plate’s place is two custom properties on the group, which the theme moves in its own time.' },
            { name: 'setSegmentedValues / getSegmentedValues / resetSegmented', what: 'Read the values that are on (empty is All), set them without an event (the address changed), or turn every value off and fire the event if anything was on.' },
            { name: 'setSegmentedCounts / setSegmentedItems', what: 'Write the numbers beside the values (null empties one, a value not named keeps its number), or replace the items in place: the values still present stay on and the focus stays on its value.' },
            { name: 'aria-busy="true"', what: 'On the group: the counts show a placeholder while their numbers load. Pressing is not blocked.' },
        ],
        accessibility: [
            'Built in — single is a `radiogroup` with `aria-checked`, multi is a group of toggle buttons with `aria-pressed`; one tab stop in, arrow keys within, Home and End jump.',
            'Built in — in multi the arrow keys only move the focus; Space and Enter turn the value, so a keyboard user never changes a filter by passing it.',
            'Yours — name the group (`aria-label` or `aria-labelledby`), and say in text near the list what is being filtered.',
        ],
    },
    {
        id: 'heat',
        title: 'Heat grid',
        group: 'Data',
        classes: ['kp-heat'],
        aliases: ['picked', 'share', 'minor', 'inert'],
        exports: [],
        intro: 'Rows by many columns of small cells, each toned by a state or a value: a stack per night, a service per hour. A label column on the start side (a press on a name toggles it, `data-kp-heat-toggle`), the column axis, an optional summary row whose cells fill from the bottom (`data-kp-share`), a legend (`.kp-heat__legend` with `.kp-heat__swatch` and `.kp-heat__ramp`), a picked column (`data-kp-picked`, `data-kp-heat-picked`) and hover detail through the hover card. A state is told by a pattern as well as a colour: a bad cell is striped, a warn cell ruled, a future cell dashed, a cell before the record hatched. `setHeat(el, spec)` in js/heat.js writes it and keeps its footprint in every state; `data-kp-heat-owned` leaves the picked column and the pressed names to the page. A cell on the axis that is not named is `data-kp-minor`; a cell that cannot be pressed is `data-kp-inert`.',
        whenToUse:
            'When a reader looks for the odd one out in a dense grid of states or values and then asks about one cell: coverage per night, uptime per hour, a count per day. Not for a few categories (use a table or a chart) and not for a month calendar (use the calendar, which has the weekdays).',
        examples: [
            {
                title: 'Two rows of states, with a legend',
                why: 'The markup is complete without the script apart from the roving tab stop: every cell is a named button. Tones are the month heatmap’s words.',
                markup: `
<div class="kp-heat" data-kp-heat role="grid" aria-label="Snapshots per stack per night" style="--kp-heat-cols: 4">
<div class="kp-heat__row" role="row"><span class="kp-heat__label" role="rowheader"><span class="kp-heat__label-text">media</span></span>
<div class="kp-heat__cells" role="none">
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="ok" data-r="0" data-c="0" data-row-key="media" data-col-key="14" aria-label="media, 14: backed up"></button>
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="bad" data-r="0" data-c="1" data-row-key="media" data-col-key="15" aria-label="media, 15: missed"></button>
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="before" data-r="0" data-c="2" data-row-key="media" data-col-key="16" aria-label="media, 16: before any history"></button>
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="future" data-r="0" data-c="3" data-row-key="media" data-col-key="17" aria-label="media, 17: not run yet"></button>
</div></div>
</div>
<ul class="kp-heat__legend"><li><span class="kp-heat__swatch" data-kp-tone="ok"></span> backed up</li><li><span class="kp-heat__swatch" data-kp-tone="bad"></span> missed</li></ul>
`,
            },
            {
                title: 'A backups grid with a summary row, a picked night and the newest column on the end',
                why: '`setHeat(el, spec)` writes the axis, the summary row (each cell filled from the bottom by its `share`) and the rows. Press a name to toggle it (`data-kp-heat-toggle`), press a cell to pin its night, and use the arrows, Page Up and Page Down. `data-kp-heat-latest="end"` says the newest column stands on the end edge: End also sends `kp-heat-page` with `direction: "latest"`, so a grid paged back to older nights comes back in the same press.',
                markup: `
<div class="kp-heat" id="doc-heat-backups" data-kp-heat data-kp-heat-toggle data-kp-heat-latest="end"></div>
<ul class="kp-heat__legend"><li><span class="kp-heat__swatch" data-kp-tone="ok"></span> backed up</li><li><span class="kp-heat__swatch" data-kp-tone="warn"></span> some missed</li><li><span class="kp-heat__swatch" data-kp-tone="bad"></span> missed</li><li><span class="kp-heat__swatch" data-kp-tone="future"></span> not run yet</li></ul>
`,
                script: `
import { attachHeats, setHeat } from '@kp-soft/themes/js/heat';

const grid = document.getElementById('doc-heat-backups');
attachHeats(grid.parentElement);
const NIGHTS = 14;
const STACKS = ['media', 'home', 'platform', 'backups'];
const missed = (stack, night) => (stack === 'backups' && night === 5) || (stack === 'platform' && night === 9);
const columns = Array.from({ length: NIGHTS }, (_, night) => ({ key: String(night), label: String(night + 1) }));
const cellOf = (stack, night) =>
    night === NIGHTS - 1
        ? { tone: 'future', label: 'not run yet' }
        : missed(stack, night)
          ? { tone: 'bad', label: 'missed', tip: stack + ', night ' + (night + 1) + ': no snapshot.' }
          : { tone: 'ok', label: 'backed up' };
const rows = STACKS.map((stack) => ({ key: stack, label: stack, cells: columns.map((_, night) => cellOf(stack, night)) }));
const summary = {
    key: 'fleet',
    label: 'Whole fleet',
    cells: columns.map((_, night) => {
        if (night === NIGHTS - 1) return { tone: 'future', label: 'not run yet' };
        const ok = STACKS.filter((stack) => !missed(stack, night)).length;
        return { tone: ok === STACKS.length ? 'ok' : 'warn', share: ok / STACKS.length, label: ok + ' of ' + STACKS.length + ' backed up' };
    }),
};
setHeat(grid, { columns, summary, rows, label: 'Snapshots per stack per night', picked: String(NIGHTS - 2) });
`,
            },
            {
                title: 'Tone by value, and the three states',
                why: 'The tone `level` darkens with a cell’s `level` (0 to 1): a count per day, a load per hour. The three states keep the grid’s footprint: `loading` shows skeleton cells in place (and the data table’s loading card over them), `empty` and `error` give one sentence of the grid’s minimum height (`message`). `skeleton` is the shape of a loading grid that has no data yet.',
                markup: `
<div class="kp-heat" id="doc-heat-level" data-kp-heat></div>
<div class="kp-heat" id="doc-heat-loading" data-kp-heat></div>
<div class="kp-heat" id="doc-heat-empty" data-kp-heat></div>
<div class="kp-heat" id="doc-heat-error" data-kp-heat></div>
`,
                script: `
import { attachHeats, setHeat } from '@kp-soft/themes/js/heat';

attachHeats(document.getElementById('doc-heat-level').parentElement);
const columns = Array.from({ length: 12 }, (_, hour) => ({ key: String(hour), label: String(hour * 2) }));
const row = (key, seed) => ({
    key,
    label: key,
    cells: columns.map((_, hour) => {
        const level = Math.abs(Math.sin(hour * seed));
        return { tone: 'level', level, label: Math.round(level * 100) + ' requests' };
    }),
});
setHeat(document.getElementById('doc-heat-level'), { columns, rows: [row('web', 0.7), row('api', 1.3), row('mail', 2.1)], label: 'Requests per two hours' });
const skeleton = { rows: 3, columns: 12 };
setHeat(document.getElementById('doc-heat-loading'), { state: 'loading', skeleton, label: 'Requests, loading' });
setHeat(document.getElementById('doc-heat-empty'), { state: 'empty', skeleton, message: 'No stack is shown: every stack is filtered out.', label: 'Requests, empty' });
setHeat(document.getElementById('doc-heat-error'), { state: 'error', skeleton, message: 'The repositories could not be read. Try again in a minute.', label: 'Requests, failed' });
`,
            },
        ],
        variants: [
            { name: 'data-kp-tone', what: '`ok`, `warn`, `bad`, `muted`, `future`, `before`, `none`, `level` (the darker, the more) and `loading` (the theme’s own skeleton block).' },
            { name: '.kp-heat__row--summary', what: 'A track per cell, filled from the bottom by its share; the whole-fleet row of a coverage grid.' },
            { name: 'data-kp-picked', what: 'On every cell and the axis name of the picked column; written by `setHeatPick` and by a press on a cell.' },
            { name: 'data-kp-share', what: 'On a summary row’s cell: the tone fills it from the bottom by its share.' },
            { name: 'data-kp-minor', what: 'On an axis name that is not drawn (every third is); it stays in the tree for a screen reader.' },
            { name: 'data-kp-inert', what: 'A cell that cannot be pressed; `aria-disabled` goes with it.' },
            { name: 'data-kp-state', what: '`loading`, `empty` and `error` on the grid: loading keeps the cells in place, the others show one sentence of the grid’s minimum height.' },
            { name: 'data-kp-heat-latest', what: 'Opt-in: `end` (or `start`, for a grid whose newest column comes first) says which edge the newest column stands on. The key that goes to that edge (End, or Home) still moves to the end of the row, and also sends `kp-heat-page` with `direction: "latest"`; with Ctrl it goes to that corner and sends it too.' },
            { name: 'the busy card', what: 'While `loading`, the data table’s loading card (`js/busy-card.js`: the theme’s spinner and “Reading…”) stands centred over the cells (`.kp-heat__busy`), arriving and leaving as the table’s does; the cells are drawn once it has left.' },
            { name: 'setHeat / setHeatPick / setHeatRows', what: 'Write the grid (keeping its columns, row heights, picked column and a focused cell’s place), pick a column by its key, and set which row names are pressed. A grid marked `data-kp-heat-owned` leaves the picked column and the pressed names to the page. `heatLoading`, `heatEmpty` and `heatFailed` are the default words.' },
        ],
        accessibility: [
            'Built in — a `grid` with row and column headers, one tab stop, arrow keys, Home and End, Ctrl with them for the corners; Page Up and Page Down send `kp-heat-page`, Enter and Space press a cell (`kp-heat-pick`), a pressed name sends `kp-heat-row`.',
            'Built in — a state is a pattern as well as a colour; a column name that is not drawn stays in the tree.',
            'Yours — give every cell words (`label`) that say what its colour says, and put the detail of a picked column in a polite live region.',
        ],
    },
    {
        id: 'matrix',
        title: 'Matrix',
        group: 'Data',
        classes: ['kp-matrix'],
        aliases: ['glyph', 'ringed', 'mark', 'lit', 'hot', 'inert'],
        exports: [],
        intro: 'Source by destination: a cell per pair that says its state in a plate, a word or a glyph (`data-kp-glyph`), with the pair with itself dashed and inert (`self`, `data-kp-inert`). A red ring (`data-kp-ringed`) means the traffic stopped on the way out of the source; a dashed outline (`data-kp-mark`) marks the cells a rule being read touches. The headers are buttons that light their row and their column (`data-kp-lit` on the matrix, `data-kp-hot` on the cells they touch) and stay in place while the grid scrolls inside its own box. One cell can be pinned (`aria-pressed`); `data-kp-matrix-select="follow"` pins the one the arrow keys land on, and `data-kp-matrix-owned` leaves the state to the page. `setMatrix(el, spec)` in js/heat.js writes it.',
        whenToUse:
            'For a table of pairs where the state of each pair matters more than a number: which service may reach which, who shares with whom, which version fits which platform.',
        examples: [
            {
                title: 'Two names, one allowed pair',
                why: 'Headers are sticky; the cell reads as a plate, a number and its words.',
                markup: `
<div class="kp-matrix" data-kp-matrix>
<div class="kp-matrix__grid" role="grid" aria-label="Which stack can reach which" style="--kp-matrix-cols: 2">
<div class="kp-matrix__line" role="row"><span class="kp-matrix__corner" role="columnheader">from ↓ to →</span><button type="button" class="kp-matrix__col" role="columnheader" aria-pressed="false" data-key="web"><span class="kp-matrix__name">web</span></button><button type="button" class="kp-matrix__col" role="columnheader" aria-pressed="false" data-key="db"><span class="kp-matrix__name">db</span></button></div>
<div class="kp-matrix__line" role="row"><button type="button" class="kp-matrix__row" role="rowheader" aria-pressed="false" data-key="web"><span class="kp-matrix__name">web</span></button><span class="kp-matrix__cell" role="gridcell" data-kp-tone="self" data-kp-inert aria-label="web to web: itself"></span><button type="button" class="kp-matrix__cell" role="gridcell" data-kp-tone="ok" data-r="0" data-c="1" data-row-key="web" data-col-key="db" aria-pressed="false" aria-label="web to db: 1 port open">1</button></div>
</div>
</div>
`,
            },
            {
                title: 'Who can reach whom, pinned by the arrow keys, and the three states',
                why: '`setMatrix(el, spec)` takes the names and a `cell(row, column)` function: a tone, the words, a `ringed` red ring for traffic stopped on the way out, a `mark` outline for the cells a rule touches. Press a header to light its row or column; `data-kp-matrix-select="follow"` pins the cell the arrow keys land on and `kp-matrix-pick` reports it. `matrixSelf` and `matrixUnknown` are the words for a pair with itself and an unknown pair. Below, the loading, empty and failed matrix.',
                markup: `
<div class="kp-matrix" id="doc-matrix-live" data-kp-matrix data-kp-matrix-select="follow"></div>
<div class="kp-matrix" id="doc-matrix-loading" data-kp-matrix></div>
<div class="kp-matrix" id="doc-matrix-empty" data-kp-matrix></div>
<div class="kp-matrix" id="doc-matrix-error" data-kp-matrix></div>
`,
                script: `
import { attachMatrices, setMatrix } from '@kp-soft/themes/js/heat';

attachMatrices(document.getElementById('doc-matrix-live').parentElement);
const names = ['web', 'api', 'db', 'cache'].map((key) => ({ key, label: key }));
const open = { 'web>api': 'HTTP', 'api>db': 'SQL', 'api>cache': 'cache' };
setMatrix(document.getElementById('doc-matrix-live'), {
    corner: 'from ↓ to →',
    rows: names,
    columns: names,
    label: 'Which stack can reach which',
    cell: (row, column) => {
        if (row === column) return undefined;
        const words = open[row + '>' + column];
        if (words) return { tone: 'ok', text: words, label: words + ' is open', mark: row === 'api' };
        return row === 'web' && column === 'db'
            ? { tone: 'bad', label: 'blocked on the way out of web', ringed: true }
            : { tone: 'muted', label: 'nothing open' };
    },
});
setMatrix(document.getElementById('doc-matrix-loading'), { state: 'loading', skeleton: 3, label: 'Reachability, loading' });
setMatrix(document.getElementById('doc-matrix-empty'), { state: 'empty', message: 'No stack is shown: every stack is filtered out.', label: 'Reachability, empty' });
setMatrix(document.getElementById('doc-matrix-error'), { state: 'error', message: 'The firewall rules could not be read.', label: 'Reachability, failed' });
`,
            },
        ],
        variants: [
            { name: 'data-kp-tone', what: '`ok` (allowed), `warn` (mismatch), `bad` (blocked), `muted` (nothing open), `none` (unknown, inert), `self` (itself, inert) and `loading`.' },
            { name: 'data-kp-glyph', what: 'The glyph a cell shows when the page gave it no text: a tick, an exclamation mark, a cross or a dash by its tone.' },
            { name: 'data-kp-ringed', what: 'A red ring inside the plate: the traffic was stopped on the way out of the source.' },
            { name: 'data-kp-mark', what: 'A dashed outline on the cells a rule being read touches.' },
            { name: 'data-kp-lit', what: 'On the matrix while a header is lit: the cells it does not touch recede; the ones it touches carry `data-kp-hot`.' },
            { name: 'data-kp-hot', what: 'A cell in a lit row or column.' },
            { name: 'data-kp-inert', what: 'A cell that cannot be pressed (itself, unknown).' },
            { name: 'data-kp-ringed', what: 'See above: the ring on a cell.' },
            { name: 'data-kp-state', what: '`loading` keeps the shape with skeleton names and cells; `empty` and `error` show one sentence.' },
            { name: 'the busy card', what: 'While `loading`, the data table’s loading card (`js/busy-card.js`) stands centred over the cells (`.kp-matrix__busy`), over the skeleton names and plates, and the matrix is drawn once it has left.' },
            { name: 'setMatrix / setMatrixLit / setMatrixPick', what: 'Write the matrix, light some headers (`kp-matrix-light` reports the change a person made) and pin a cell. `data-kp-matrix-owned` leaves the lit and pinned state to the page.' },
            { name: '.kp-heat__swatch--plate', what: 'A legend swatch drawn as a matrix plate, for a legend under a matrix.' },
        ],
        accessibility: [
            'Built in — a `grid` with row and column headers and one tab stop; arrows move between the cells that can be pressed and wrap round; Escape turns the lit names off (`kp-matrix-light`); a pinned cell sends `kp-matrix-pick`.',
            'Built in — a state is a plate, a word or a glyph, and the cell’s name says the pair and its state.',
            'Yours — give every cell a `label` that says its state in words, and say what is pinned in a live region.',
        ],
    },
    {
        id: 'bar-cell',
        title: 'Bar in a table cell',
        group: 'Data',
        classes: ['kp-bar-cell'],
        aliases: ['bar'],
        exports: [],
        intro: 'A value with a proportional bar inside a table cell: the meter and its figure, the figure in a column of its own on the end edge, so a column of them lines up its bars and its numbers. `data-kp-bar="0.62"` on the span is enough (`data-kp-bar-text`, `-tone`, `-mark`, `-label`, `-loading`, `-warn` and `-bad` refine it); `setBarCell(span, { value, text })` in js/barcell.js does the same from script. From 0.75 the fill is the warning colour, from 0.9 the destructive one. A data table sorts a cell by its `data-kp-sort-value` when it has one, and `setBarCell` writes it.',
        whenToUse:
            'In a table where the share of something is the point of a column: capacity per stack, how full a disk is. Not alone on a page (use the meter).',
        examples: [
            {
                title: 'A bar column that sorts by its share',
                why: 'The cell shows "62%" and sorts by 62; `data-kp-sort-value` on the `td` is what the data table reads.',
                markup: `
<table class="kp-table"><thead><tr><th scope="col">Stack</th><th scope="col">Disk</th></tr></thead>
<tbody><tr><td>media</td><td data-kp-sort-value="62"><span class="kp-bar-cell" data-kp-bar="0.62"></span></td></tr></tbody></table>
`,
            },
        ],
        variants: [
            { name: '.kp-bar-cell--start', what: 'The figure before the bar.' },
            { name: 'data-kp-bar', what: 'The share, 0 up (1 is full; above 1 the bar is full and says so); empty is not measured.' },
            { name: 'data-kp-bar-text', what: 'The words beside the bar; without them, the rounded percentage.' },
            { name: 'data-kp-bar-tone', what: '`warning`, `destructive` or `none`; without it the share decides.' },
            { name: 'data-kp-bar-warn', what: 'The share from which the fill is the warning colour (0.75).' },
            { name: 'data-kp-bar-bad', what: 'The share from which the fill is the destructive colour (0.9).' },
            { name: 'data-kp-bar-mark', what: 'A tick on the bar: a limit, a target.' },
            { name: 'data-kp-bar-label', what: 'What the share is, for a screen reader.' },
            { name: 'data-kp-bar-loading', what: 'The bar is the busy track at its own size and the figure is empty.' },
        ],
        accessibility: [
            'Built in — the bar is the package’s meter: `role="meter"` with a value text that names the real share, past 100 % too.',
            'Yours — keep the figure beside the bar: colour and length are not the only carrier.',
        ],
    },
    {
        id: 'week',
        title: 'Week agenda',
        group: 'Data',
        classes: ['kp-week'],
        aliases: ['past', 'overflow', 'today'],
        exports: [],
        intro: 'Seven day columns with the items of the week placed at their time of day: a nightly backup at 02:00, a host round at 03:30. `attachWeeks(root)` in js/week.js fills `section.kp-week[data-kp-week]` with the head of each day, an hour axis and one pill per item; the page gives the items (`setWeekEvents`) and the state of the whole (`setWeekState`). `data-kp-week-start` is the first day (`YYYY-MM-DD`, else today), `data-kp-week-days` how many columns, `data-kp-week-nav` adds the week buttons. A pill has a series colour (1 to 5) and a state: `next` is ringed, `off` and `skipped` muted and struck through, `reference` dashed and not a button. A column holds as many pills as fit; the rest fold into a `+N` menu button (`data-kp-overflow` marks the folded ones). Below 40rem the columns become rows and every item is shown. A line across today’s column is now; items already past carry `data-kp-past`.',
        whenToUse:
            'When a reader asks what runs when over the next days: schedules, rounds, bookings. Not for a month (use the calendar), not for what already ran (use the run timeline) and not for one list in time order (use the timeline).',
        examples: [
            {
                title: 'An agenda for the next seven days',
                why: 'The markup is the empty frame; the script builds the days and the pills from the items the page hands over. Two series, a ringed next run, a muted one that is off, a dashed reference and a legend: the page’s part is printed below.',
                markup: `
<section class="kp-week" data-kp-week data-kp-week-nav aria-label="Runs in the next 7 days"></section>
`,
                script: `
import { attachWeeks, setWeekEvents, setWeekLegend } from '@kp-soft/themes/js/week';

const agenda = document.querySelector('[data-kp-week]');
attachWeeks(agenda.parentElement);
const at = (days, hours, minutes) => {
    const moment = new Date();
    moment.setDate(moment.getDate() + days);
    moment.setHours(hours, minutes, 0, 0);
    return moment.getTime();
};
const events = [];
for (let day = 0; day < 7; day += 1) {
    events.push({ id: 'backup-' + day, start: at(day, 2, 0), label: 'Backup photos', series: 1, detail: 'Nightly, keeps 14 copies' });
    events.push({ id: 'host-' + day, start: at(day, 3, 30), label: 'Host round', series: 3, state: 'reference' });
    if (day % 3 === 0) events.push({ id: 'update-' + day, start: at(day, 4, 30), label: 'Update images', series: 2 });
}
events.push({ id: 'report', start: at(1, 7, 30), label: 'Mail the report', series: 2, state: 'next' });
events.push({ id: 'scrub', start: at(2, 13, 0), label: 'Scrub the pool', series: 4, state: 'off' });
setWeekEvents(agenda, events);
setWeekLegend(agenda, [
    { series: 1, label: 'Nightly round' },
    { series: 2, label: 'Updates' },
    { series: 4, label: 'Housekeeping' },
]);
`,
            },
            {
                title: 'On a phone: the next eight items',
                why: '`data-kp-week-upcoming="8"` makes the agenda, once it is narrower than 40rem, a list of the next eight items instead of seven day rows: one row per item, its day on the left (named once for a run of the same day, Today for today) and its own pill on the right. An item that is off, skipped or only a reference is not one, and a passed item leaves the list on the next tick. `data-kp-week-upcoming-label` names the list and `data-kp-week-upcoming-empty` is what it says when nothing is left. The box here is 26rem wide, so it shows what a phone shows.',
                markup: `
<div style="max-inline-size: 26rem">
<section class="kp-week" data-kp-week data-kp-week-upcoming="8" data-kp-week-upcoming-label="The next runs" data-kp-week-upcoming-empty="Nothing is scheduled." aria-label="Runs in the next 7 days"></section>
</div>
`,
                script: `
import { attachWeeks, setWeekEvents } from '@kp-soft/themes/js/week';

const agenda = document.querySelector('[data-kp-week-upcoming]');
attachWeeks(agenda.parentElement);
const at = (days, hours, minutes) => {
    const moment = new Date();
    moment.setDate(moment.getDate() + days);
    moment.setHours(hours, minutes, 0, 0);
    return moment.getTime();
};
const events = [];
for (let day = 0; day < 7; day += 1) {
    events.push({ id: 'backup-' + day, start: at(day, 2, 0), label: 'Backup photos', series: 1 });
    if (day % 2 === 0) events.push({ id: 'report-' + day, start: at(day, 18, 30), label: 'Mail the report', series: 2 });
}
events.push({ id: 'off', start: at(1, 12, 0), label: 'Scrub the pool', series: 4, state: 'off' });
setWeekEvents(agenda, events);
`,
            },
        ],
        variants: [
            { name: 'data-kp-week', what: 'Marks the agenda; `attachWeeks` fills it.' },
            { name: 'data-kp-week-start', what: 'The first day, `YYYY-MM-DD`; without it, today in the time zone.' },
            { name: 'data-kp-week-days', what: 'How many day columns the range has (7).' },
            { name: 'data-kp-week-nav', what: 'Adds the row of week buttons: previous, today and next (`data-kp-week-prev`, `data-kp-week-today`, `data-kp-week-next` mark them); a press sends the new range to the page.' },
            { name: 'data-kp-week-mode', what: 'The layout in force: `grid` (columns) or `list` (rows below 40rem); read from the stylesheet, not written by the page.' },
            { name: 'data-kp-state', what: 'On a pill: `next`, `off`, `skipped` or `reference`. On the agenda: `loading`, `empty` or `error`.' },
            { name: 'data-kp-series', what: 'On a pill: 1 to 5, the colour from `--chart-1` to `--chart-5`; the label carries the meaning.' },
            { name: 'data-kp-past', what: 'On a pill whose time has passed; it is muted.' },
            { name: 'data-kp-overflow', what: 'On a pill folded into the `+N` menu of a full column.' },
            { name: 'setWeekEvents / setWeekState / setWeekStart / setWeekLegend', what: 'The page’s four calls: the items (repainted in place by id, so a pill keeps its focus), the state of the whole (`loading` draws the data table’s busy card over the empty days; `empty`, `error` with its words), a new first day, and the legend under the agenda.' },
            { name: 'data-kp-week-upcoming', what: 'Opt-in: below 40rem the agenda lists the next items (the number given) instead of its day rows, one row per item.' },
            { name: 'data-kp-week-upcoming-label / -empty', what: 'The list’s name for a screen reader, and its sentence when nothing is still to come (else the dictionary’s `weekEmpty`).' },
            { name: '.kp-week__upcoming / __next', what: 'The list and one row of it. A row carries `data-kp-day-start` when it opens its day and `data-kp-today` for today; `.kp-week__next--empty` and `.kp-week__none` are the sentence of an empty list.' },
        ],
        accessibility: [
            'Built in — one tab stop: arrow up and down move within a day, left and right to the neighbouring day (the item nearest in time), Home and End to the day’s first and last, Enter and Space open the item.',
            'Built in — every pill is a button named by its time and label; the now-line has an accessible name with the time; the `+N` button opens a menu of the folded items.',
            'Yours — give the agenda a name (`aria-label`), keep the label of every item short and meaningful without its colour, and give the new items when the range changes.',
        ],
    },
    {
        id: 'gantt',
        title: 'Run timeline',
        group: 'Data',
        classes: ['kp-gantt'],
        aliases: ['active', 'out', 'cluster', 'clustered', 'lane-key', 'lane-zone', 'name', 'planned', 'shape', 'zone'],
        exports: [],
        intro: 'One bar per run on a time axis, a lane per job, stack or host, and a line for now. `attachGantts(root)` in js/gantt.js fills `section.kp-gantt[data-kp-gantt]` with range buttons (`data-kp-gantt-ranges`, the one in force in `data-kp-gantt-range`), a Live button and the selected range; the page gives the lanes and the runs (`setGanttRuns`) and the state of the whole (`setGanttState`). A run is `queued` (dashed and hollow, from queueing to now), `running` (striped and growing to now), `ok` (solid) or `failed` (solid, taller, with a cap and a cross): the tone is never the only carrier. A running bar is placed by one custom property that moves every second, so the page repaints nothing. While the window is Live its right edge follows now (`data-kp-gantt-live`); dragging across the plot selects a range, shown in a chip with Zoom and Clear (`data-kp-gantt-zoom`, `data-kp-gantt-clear`). `data-kp-gantt-ghosts="2 3 2 1"` sets the rows of the loading lanes so loading and loaded are as tall.',
        whenToUse:
            'When a reader asks what ran when, how long it took and what failed: operations of the last hours or days, per job. Not for what will run (use the week agenda) and not for a series of values (use the chart).',
        examples: [
            {
                title: 'Operations of the last six hours',
                why: 'The markup is the empty frame with its ranges; the script builds the axis, the lanes and the bars from the runs the page hands over: a finished run, a failed one, one still running and one queued. Drag across the plot to select a range.',
                markup: `
<section class="kp-gantt" data-kp-gantt data-kp-gantt-ranges="1h 6h 24h 7d" data-kp-gantt-range="6h" data-kp-gantt-ghosts="2 1" aria-label="Operations of the last 6 hours"></section>
`,
                script: `
import { attachGantts, setGanttRuns } from '@kp-soft/themes/js/gantt';

const MIN = 60_000;
const now = Date.now();
const ago = (minutes) => now - minutes * MIN;
const timeline = document.querySelector('[data-kp-gantt]');
attachGantts(timeline.parentElement);
setGanttRuns(
    timeline,
    [
        { id: 'backup', lane: 'nightly', label: 'Backup photos', start: ago(300), end: ago(240), state: 'ok' },
        { id: 'prune', lane: 'nightly', label: 'Prune snapshots', start: ago(220), end: ago(190), state: 'failed', detail: 'The target disk was full.' },
        { id: 'update', lane: 'updates', label: 'Update images', start: ago(150), end: ago(95), state: 'ok' },
        { id: 'verify', lane: 'updates', label: 'Verify backups', start: ago(40), state: 'running' },
        { id: 'next', lane: 'nightly', label: 'Backup photos', start: ago(8), state: 'queued' },
    ],
    [
        { id: 'nightly', label: 'Nightly round' },
        { id: 'updates', label: 'Updates' },
    ],
);
`,
            },
            {
                title: 'A week of runs, by series, with the days on the axis',
                why: '`data-kp-gantt-days` turns every day named on the axis into a button that selects that whole day, with the chip, Zoom and Clear; `kp-gantt-select` then carries `source: "day"` and the `day`. A finished run’s `series` (1 to 5) inks it in the chart colours instead of the success colour, and `setGanttLegend` names the series after the states; a failed run keeps its own look, so the state still reads first.',
                markup: `
<section class="kp-gantt" data-kp-gantt data-kp-gantt-days data-kp-gantt-ranges="24h 7d" data-kp-gantt-range="7d" data-kp-gantt-ghosts="2 1" aria-label="Operations of the last 7 days"></section>
`,
                script: `
import { attachGantts, setGanttLegend, setGanttRuns } from '@kp-soft/themes/js/gantt';

const HOUR = 3_600_000;
const midnight = new Date();
midnight.setHours(0, 0, 0, 0);
const runs = [];
for (let day = 6; day >= 0; day -= 1) {
    const start = midnight.getTime() - day * 24 * HOUR;
    runs.push({ id: 'backup-' + day, lane: 'nightly', label: 'Backup photos', start: start + 2 * HOUR, end: start + 3 * HOUR, state: day === 3 ? 'failed' : 'ok', series: 1 });
    if (day % 3 === 0) runs.push({ id: 'update-' + day, lane: 'updates', label: 'Update images', start: start + 4.5 * HOUR, end: start + 6 * HOUR, state: 'ok', series: 2 });
}
const el = document.querySelector('[data-kp-gantt-days]');
attachGantts(el.parentElement);
setGanttRuns(el, runs, [
    { id: 'nightly', label: 'Nightly round' },
    { id: 'updates', label: 'Updates' },
]);
setGanttLegend(el, [
    { series: 1, label: 'Nightly round' },
    { series: 2, label: 'Updates' },
]);
`,
            },
            {
                title: 'While it loads',
                why: '`setGanttState(el, "loading")` draws the lanes’ ghosts at their final height and stands the data table’s own loading card (the theme’s spinner and “Reading the history”) over them, the toolbar, axis and lane names beside it; the runs are drawn once the card has left. `error` and `empty` put their words over the plot.',
                markup: `
<section class="kp-gantt" data-kp-gantt data-kp-gantt-ranges="1h 6h 24h 7d" data-kp-gantt-ghosts="2 1" data-kp-doc-loading aria-label="Operations, loading"></section>
`,
                script: `
import { attachGantts, setGanttState } from '@kp-soft/themes/js/gantt';

const timeline = document.querySelector('[data-kp-doc-loading]');
attachGantts(timeline.parentElement);
setGanttState(timeline, 'loading');
`,
            },
        ],
        variants: [
            { name: 'data-kp-gantt', what: 'Marks the timeline; `attachGantts` fills it.' },
            { name: 'data-kp-gantt-ranges', what: 'The range buttons, space separated: `1h 6h 24h 7d`.' },
            { name: 'data-kp-gantt-range', what: 'The range in force; it decides how much time the window shows.' },
            { name: 'data-kp-gantt-live', what: 'On the Live button, pressed while the window follows now.' },
            { name: 'data-kp-gantt-zoom', what: 'On the Zoom button of the selection chip: the window becomes the selected range and stops following now.' },
            { name: 'data-kp-gantt-clear', what: 'On the Clear button of the selection chip: the selection is lifted.' },
            { name: 'data-kp-gantt-ghosts', what: 'The rows of each loading lane, space separated, so loading and loaded are as tall.' },
            { name: 'data-kp-gantt-id', what: 'On a bar: the id the page gave the run; reported when it is opened.' },
            { name: 'data-kp-state', what: 'On a bar: `queued`, `running`, `ok` or `failed`. On the timeline: `loading`, `empty` or `error`.' },
            { name: 'data-kp-active', what: 'On the selection chip while a range is selected.' },
            { name: 'data-kp-out', what: 'On the now-line when now lies outside the window; it is hidden.' },
            { name: 'data-kp-gantt-edge', what: 'On an axis label too close to the end edge for its name: an hour label stands before its rule and ends at it in a register that flips it; a day button stands against the end, whole.' },
            { name: 'data-kp-gantt-days', what: 'Opt-in: each day named on the axis is a button (one tab stop, arrows, Home and End between them) that selects that whole day, 00:00 to 00:00 in the zone, as a brush would. It is `aria-pressed` while it is the selection and lifts it when pressed again; a window too short to hold a midnight names no day. `data-kp-gantt-crowded` marks an axis whose day names would touch, so they thin out.' },
            { name: 'series', what: 'On a run (`GanttRun.series`, 1 to 5): a finished run is inked in `--chart-1` to `--chart-5` instead of the success colour. Failed, running and queued keep their own look. `setGanttLegend(el, [{ series, label }])` names the series after the states; none takes them away.' },
            { name: 'setGanttRuns / setGanttState / setGanttWindow / setGanttSelection', what: 'The page’s calls: the lanes and runs (repainted in place by id), the state of the whole, the window (`{ span, live, to }`, no event) and a selected range (`{ from, to }` or null).' },
            { name: 'the busy card', what: 'While loading, the data table’s loading card (`js/busy-card.js`) stands centred over the lanes, flat over a short area, and the runs are drawn once it has left.' },
            { name: 'a register’s repairs', what: 'A register may hang the end-edge axis label inside the plot (the flip knob) and give an empty or failed timeline’s sentence a plate of its own (the state-ground knob); both are in the knobs below, and formal leaves them as they were approved.' },
            { name: 'setGanttPoints / setGanttKinds / setGanttZones', what: 'Moments instead of runs [kpadopt4]: a point (`id`, `lane`, `at`, `kind`, `label`, `detail`, `planned`) is a `.kp-gantt__point` mark in its lane, in the colour and shape of its kind (`data-kp-shape` dot, diamond, square, triangle or ring; `data-kp-series` or `data-kp-tone`), hollow when `data-kp-planned`. A kind is named in the legend (`.kp-gantt__mark`); the run states leave the legend when there are no runs. A zone is a thin band in its lane (`data-kp-lane-zone`) or a band behind every lane, named in the legend (`.kp-gantt__band`); `data-kp-zone` carries its id.' },
            { name: 'data-kp-cluster / data-kp-clustered', what: 'Marks closer than the eye can tell apart: the first carries the number it stands for and a count plate (`.kp-gantt__count`, “+2”), its name and card name them all; the others are `data-kp-clustered` and step aside. Opening it reports every point in `points`.' },
            { name: 'data-kp-name / data-kp-card', what: 'Written on a mark: its own accessible name and card words, which a mark with a count joins.' },
            { name: 'data-kp-gantt-points', what: 'On the timeline: its hint speaks of marks, not bars.' },
            { name: 'all', what: 'A range word: the window fits everything on the timeline and now, and stays fitted while the data changes.' },
            { name: 'href / sub', what: 'A lane with `href` is a link (`.kp-gantt__lane-link`); `sub` is a second line under its name (`.kp-gantt__sub`), and the lanes grow to hold it. `data-kp-lane-key` on the name is what it was drawn from.' },
            { name: '.kp-gantt--line', what: 'One lane, no toolbar, no lane names, no hint and no brush, the axis under the line, fitted to its data: the dated line under a journey stepper.' },
        ],
        accessibility: [
            'Built in — one tab stop: left and right move along a lane, up and down to the nearest bar of the neighbouring lane, Home and End to the lane’s first and last, Enter and Space open the run; range, Live, Zoom and Clear are buttons.',
            'Built in — every bar has an accessible name with its label, state and times; a run that changes state is announced in a polite status region.',
            'Yours — give the timeline a name (`aria-label`), name every run so it reads without its colour, and give the new runs when the window moves.',
        ],
    },
    {
        id: 'pipeline',
        title: 'Pipeline',
        group: 'Data',
        classes: ['kp-pipeline'],
        aliases: ['dimmed', 'lane'],
        exports: [],
        intro: 'Where each item stands, a lane per stage: a read-only board, not a drag-and-drop one. `attachPipelines(root)` in js/pipeline.js fills `section.kp-pipeline[data-kp-pipeline]`; the page gives the lanes and the cards with `setPipeline(el, { lanes, cards })` and the state of the whole with `setPipelineState`. Each lane has a plate with its name and exact count in the stage’s colour (`tone` 1 to 5), its share of all, and its cards (a link with `href`, else a button; `mark`, `sub` and `meta` under the title). A lane marked `closed` stands under the board across its width. `data-kp-pipeline-limit="4"` keeps four cards per lane behind “+N more”; `data-kp-pipeline-share="false"` leaves the share out. Under 40rem of its own width the lanes turn to rows.',
        whenToUse:
            'When a reader asks how many items stand at each stage of one process and which: applications from draft to offer, deployments from queued to live. Not for moving items between stages (that is a form), and not for counts alone (use key figures).',
        examples: [
            {
                title: 'Applications by stage',
                why: 'The markup is the empty board; the script draws the lanes and cards from what the page hands over, keeping cards by id so a refresh moves nothing that stayed.',
                markup: `
<section class="kp-pipeline" data-kp-pipeline data-kp-pipeline-limit="4" id="doc-pipeline" aria-label="Applications by stage"></section>
`,
            },
        ],
        variants: [
            { name: 'data-kp-pipeline', what: 'Marks the board; `attachPipelines` fills it.' },
            { name: 'data-kp-pipeline-limit', what: 'Cards per lane before “+N more” (a toggle, `aria-expanded`; `data-kp-pipeline-more` names its lane); 0 or none shows every card.' },
            { name: 'data-kp-pipeline-share', what: '`false`: no share of all under the lane’s plate.' },
            { name: 'data-kp-pipeline-more', what: 'On a lane’s “+N more” button: the lane it opens.' },
            { name: 'data-kp-lane', what: 'On a lane: its key.' },
            { name: 'data-kp-tone', what: 'On a lane and its cards: the stage’s colour, 1 to 5.' },
            { name: 'data-kp-dimmed', what: 'On a card filtered out but kept in its place: quieter ink and a dashed edge.' },
            { name: 'data-kp-state', what: 'On the board: `loading` (the lanes kept, the table’s loading card over them, cards drawn once it has gone), `ready`, `empty` (every lane says none, one sentence on a plate above the lanes) or `error` (the reason with Try again).' },
            { name: 'kp-pipeline-open', what: 'A card was opened: `{ id, card, source }`; a link is still followed.' },
            { name: 'kp-pipeline-retry', what: 'Try again on a failed board was pressed.' },
            { name: 'kp-pipeline-more', what: 'A lane shows more or fewer: `{ lane, open }`.' },
            { name: 'setPipelineSelected', what: 'Marks the open card (`aria-current`), or none.' },
        ],
        accessibility: [
            'Built in — the board is a list of lanes named by their plates, each a list of cards; a count is the exact number.',
            'Built in — one tab stop: left and right to the neighbouring lane, up and down along a lane, Home and End to its first and last; Enter follows a link or presses a button.',
            'Yours — name the board (`aria-label`), and give a card a title that says what it is without its colour.',
        ],
    },
    {
        id: 'uptime',
        title: 'Uptime strip',
        group: 'Data',
        classes: ['kp-uptime'],
        exports: [],
        intro: 'One thin strip of cells, one per period (90 days, 48 hours), each toned up, degraded (ruled), down (striped) or no data (an empty frame), with the window’s summary over it in exact figures and the first and the latest period’s names under it. `setUptime(el, { label, periods, from, to, state })` in js/uptime.js draws it; until then the strip waits as skeleton cells under the data table’s busy card. The share is cut to one decimal and never rounded up; the incident count is the number. On a narrow page the strip shows the latest periods that fit and says how many; `data-kp-uptime-fit="scroll"` keeps every period and scrolls.',
        whenToUse:
            'When a reader asks how a service or a queue did over the last days or hours, at a glance, with the detail of any period on hover. Not for a series of values (use the chart) and not for many services by many days at once (use the heat grid).',
        examples: [
            {
                title: 'A service over 90 days',
                why: 'The markup is the empty strip with its name and its number of periods; the script draws the cells from the periods the page hands over, and draws the loading state before that.',
                markup: `
<div class="kp-uptime" data-kp-uptime data-kp-uptime-label="jellyfin" data-kp-uptime-count="90"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-uptime', what: 'Marks the strip; `attachUptimes` wires it and draws its loading state until `setUptime` is called.' },
            { name: 'data-kp-uptime-label', what: 'The strip’s title (the service) when `setUptime` is given none.' },
            { name: 'data-kp-uptime-count', what: 'How many cells a loading or empty strip waits with; 90 by default.' },
            { name: 'data-kp-uptime-state', what: 'Set by the script: `ready`, `loading`, `empty` or `error`. Given in the markup, the state the strip starts in.' },
            { name: 'data-kp-uptime-fit', what: '`scroll`: every period is kept and the strip scrolls sideways, starting at the latest; without it the latest periods that fit are shown.' },
            { name: 'data-kp-uptime-before', what: 'Set by the script on a scrolling strip with periods before the view: the start edge fades.' },
            { name: 'data-kp-uptime-after', what: 'Set by the script on a scrolling strip with periods after the view: the end edge fades.' },
            { name: 'data-kp-uptime-attached', what: 'Set by the script once the strip is wired.' },
        ],
        accessibility: [
            'Built in — one tab stop: the arrow keys move through the cells that are shown, Home and End jump to the first and the latest, Enter and Space pick (`kp-uptime-pick`); the hover card opens at once on focus.',
            'Built in — every cell is a button named by its period, state and figures; the strip is a group named by its title and its summary; a state is a pattern as well as a colour.',
            'Yours — name each period the way a person reads it (dd/mm/yyyy, HH:MM), keep an error sentence short, and give `tip` a sentence when a period has more to say.',
        ],
    },
    {
        id: 'type-confirm',
        title: 'Typed confirmation',
        group: 'Feedback',
        classes: ['kp-type-confirm'],
        aliases: ['matched'],
        exports: [],
        intro: 'A destructive action that turns on only once the reader has typed its name. On a button that already asks for a confirmation, `data-kp-confirm-type="media"` makes the package’s confirmation dialog show what will be lost (`data-kp-confirm-loses`, the id of a template or an element), the field, the rule it is matched by and a line that says whether it matches; Confirm stays disabled until it does, carries the button’s own words (or `data-kp-confirm-label`), and Enter in the field confirms a match. Spaces at the start and the end never count; capitals count unless `data-kp-confirm-case="any"`. In a page’s own dialog or form, `data-kp-type-confirm="media"` with `data-kp-type-confirm-for="<button id>"` builds the same block and holds that button off.',
        whenToUse:
            'For the few actions that delete something that cannot come back and whose name the reader should look at first: wiping a stack, removing a service, deleting a backup set. For an everyday delete the plain confirmation or an undo is enough.',
        examples: [
            {
                title: 'In the confirmation dialog',
                why: 'The button keeps its own handler: the dialog swallows the click, and re-fires it once the name is typed and Confirm is pressed.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Wipe the stack media?" data-kp-confirm-type="media" data-kp-confirm-loses="lost-media">Wipe media…</button>
<template id="lost-media"><ul class="kp-type-confirm__list"><li>3 containers: jellyfin, jellyseerr, tdarr</li><li>/srv/media/config (2.4 GB)</li></ul></template>
`,
            },
            {
                title: 'In a page’s own dialog',
                why: 'The block fills itself and keeps the button it names disabled until the name matches; a button the page disabled itself stays disabled.',
                markup: `
<div data-kp-type-confirm="media" data-kp-type-confirm-for="wipe"></div>
<button type="button" class="kp-button kp-button--destructive" id="wipe">Wipe media</button>
`,
            },
        ],
        variants: [
            { name: 'data-kp-confirm-type', what: 'On a button with `data-kp-confirm`: the name the reader types before Confirm turns on.' },
            { name: 'data-kp-confirm-case', what: '`any`: capitals do not count. Spaces at the start and the end never do.' },
            { name: 'data-kp-confirm-loses', what: 'The id of a `<template>` or an element whose content says what will be lost; shown above the field.' },
            { name: 'data-kp-confirm-label', what: 'The words on Confirm; else the button’s own words without a trailing “…”.' },
            { name: 'data-kp-type-confirm', what: 'A block a page puts in its own dialog or form: the name to type.' },
            { name: 'data-kp-type-confirm-for', what: 'The id of the button the block holds off until the name matches.' },
            { name: 'data-kp-type-confirm-case', what: '`any`: capitals do not count.' },
            { name: 'data-kp-type-confirm-loses', what: 'The id of a template or an element with what will be lost.' },
            { name: 'data-kp-type-confirm-attached', what: 'Set by the script once the block is filled.' },
            { name: 'data-kp-matched', what: 'Set by the script on the block: `true` while what is typed matches the name.' },
        ],
        accessibility: [
            'Built in — the field is labelled by the sentence with the name in it and described by the rule and the match line; the match line is a polite live region; the field has the focus when the dialog opens.',
            'Built in — Confirm is disabled until the name matches, so neither a click nor Enter can act before; a match is a word on the success plate as well as a colour.',
            'Yours — list what will be lost in plain words, keep the name the one the reader knows it by, and keep the action rare: a typed name asked every day is typed without reading.',
        ],
    },
    {
        id: 'command',
        title: 'Command block',
        group: 'Content',
        classes: ['kp-command'],
        aliases: ['continued'],
        exports: [],
        intro: 'One command to run, with the terminal it runs in, whether it needs admin or sudo, a copy button that confirms and where it runs. `attachCommands(root)` in js/command.js writes the head (the terminal’s name from `data-kp-command`: `wsl`, `powershell`, `cmd`, `garuda`, `bash`; the amber `admin` or `sudo` badge with `data-kp-command-elevated`; the package’s copy button) and the note `data-kp-command-where` under the code, and puts every line behind the terminal’s prompt, which the stylesheet draws so it is never copied. A line ending in a continuation mark or a pipe carries on, indented, on the next. A long line wraps under its first character; `data-kp-command-wrap="scroll"` keeps it whole and the code scrolls.',
        whenToUse:
            'Whenever a page asks a person to run something: a fix in a runbook, the next step of a release, a command a dialog shows for a workstation. Not for a code listing to read (use a plain `pre`) and not for a value to copy (use the copyable value).',
        examples: [
            {
                title: 'A WSL command that needs sudo',
                why: 'The markup is the code and three attributes; the head, the prompt and the copy button are the script’s, and the copy is the command as written.',
                markup: `
<div class="kp-command" data-kp-command="wsl" data-kp-command-elevated data-kp-command-where="CT 109 (kyu)"><pre class="kp-command__code"><code>sudo systemctl restart kyu</code></pre></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-command', what: 'The terminal: `wsl`, `powershell`, `cmd`, `garuda` or `bash`; it decides the name, the prompt and the continuation marks.' },
            { name: 'data-kp-command-label', what: 'The terminal’s name when it is not one the dictionary knows.' },
            { name: 'data-kp-command-elevated', what: 'The command needs a terminal opened as administrator (Windows) or runs with sudo (Linux): the amber badge.' },
            { name: 'data-kp-command-where', what: 'Where it runs; shown under the code as “Runs on …”.' },
            { name: 'data-kp-command-wrap', what: '`scroll`: long lines stay whole and the code scrolls sideways, its edge fading on the side with more.' },
            { name: 'data-kp-command-shell', what: 'Set by the script: the terminal the prompt is drawn for, or `other`.' },
            { name: 'data-kp-command-ready', what: 'Set by the script once the block is drawn; before it the head’s room is kept.' },
            { name: 'data-kp-command-before', what: 'Set by the script on scrolling code with more before the view.' },
            { name: 'data-kp-command-after', what: 'Set by the script on scrolling code with more after the view.' },
            { name: 'data-kp-continued', what: 'Set by the script on a line that carries on from the line before: indented, without a prompt.' },
        ],
        accessibility: [
            'Built in — the block is a group named by its terminal; the copy button is described by it, says “Copied” on itself and announces it; a refused copy says so in a toast and on the button.',
            'Built in — the prompts are drawn, not written, so neither a screen reader nor a copy reads them; scrolling code is a focusable region a keyboard can scroll.',
            'Yours — say what the command does in the sentence before it, and name where it runs when that is not the obvious machine.',
        ],
    },
    {
        id: 'timer-disc',
        title: 'Visual timer',
        group: 'Feedback',
        classes: ['kp-timer-disc'],
        exports: [],
        intro: 'The time left as a shrinking disc, the Time Timer’s idea: no figures tick, a coloured disc grows smaller as the time goes, so the time left is seen at a glance. `attachTimerDiscs(root)` in js/timer-disc.js draws the face with twelve marks on its rim, the disc (drawn by one number, written only when its edge has moved a tenth of a degree), the name and length under it, one line for Paused or Time is up, and Start and Reset as the package’s buttons. Reset fills the disc in the theme’s own time and curve; at the end the face breathes three times. Under reduced motion the disc steps once a minute and nothing glides or breathes.',
        whenToUse:
            'For a span of time a person should feel rather than read: focus, a break, homework, a child’s turn. When the exact seconds matter, use the countdown in digits.',
        examples: [
            {
                title: 'Twenty-five minutes of focus',
                why: '`data-kp-timer-disc` takes a length (`25m`, `1h30m`, `90`, `25:00`); `data-kp-timer-disc-scale="60"` makes the face a 60-minute dial.',
                markup: `
<div class="kp-timer-disc" data-kp-timer-disc="25m" data-kp-timer-disc-name="Focus"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-timer-disc', what: 'The length: `25m`, `1h30m`, `45s`, `90` (seconds) or `25:00`.' },
            { name: 'data-kp-timer-disc-name', what: 'The timer’s name, under the face with its length.' },
            { name: 'data-kp-timer-disc-scale', what: 'Minutes for a whole turn of the face (`60`: the classic dial); without it the whole disc is the set length.' },
            { name: 'data-kp-timer-disc-disabled', what: 'Every button is off.' },
            { name: 'data-kp-timer-disc-state', what: 'Set by the script: `idle`, `running`, `paused` or `ended`.' },
        ],
        accessibility: [
            'Built in — the face is an image named by the time left in whole minutes, so a screen reader is not told every second; a status region says when it starts, pauses and ends.',
            'Built in — Start keeps one width for Start, Pause and Resume; Reset is off while there is nothing to reset; the end is a word and a ring as well as a breath, and nothing moves under reduced motion.',
            'Yours — name the timer, and say elsewhere what happens at the end if anything does.',
        ],
    },
    {
        id: 'countdown',
        title: 'Countdown',
        group: 'Feedback',
        classes: ['kp-countdown'],
        exports: [],
        intro: 'A named timer in digits, mm:ss or h:mm:ss, with Start, a minute more and Reset, and a gentle signal at the end. `attachCountdowns(root)` in js/countdown.js draws it; every digit stands in a cell one `ch` wide and only the digits that change are written, so the time never moves the layout in any theme’s face. The format follows the timer’s length and changes only on a press (a minute more past the hour). The time shown is rounded up: 0:00 is the end. The clock is the end moment minus now, so a hidden tab never loses time; `countdownClock()` is that clock on its own.',
        whenToUse:
            'When the exact time left matters: a tea, an oven, a call that has to end, a step that must wait so many minutes. For a span to feel rather than read, use the visual timer.',
        examples: [
            {
                title: 'Tea, three minutes',
                why: '`data-kp-countdown` takes a length; `data-kp-countdown-step` sets what “a minute more” adds.',
                markup: `
<div class="kp-countdown" data-kp-countdown="3:00" data-kp-countdown-name="Tea"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-countdown', what: 'The length: `3:00`, `1:30:00`, `25m`, `90` (seconds).' },
            { name: 'data-kp-countdown-name', what: 'The timer’s name, over the digits.' },
            { name: 'data-kp-countdown-step', what: 'What the add button adds; 60 seconds by default.' },
            { name: 'data-kp-countdown-disabled', what: 'Every button is off.' },
            { name: 'data-kp-countdown-state', what: 'Set by the script: `idle`, `running`, `paused` or `ended`.' },
        ],
        accessibility: [
            'Built in — the digits are a timer (`role="timer"`, not announced every second) with the time left in words for a screen reader; a status region says when it starts, pauses, goes on and ends, with the timer’s name.',
            'Built in — Start keeps one width for Start, Pause and Resume; the end is a word and a ring as well as a breath, still under reduced motion.',
            'Yours — name the timer, and keep one countdown per task: several running at once need their names to be told apart.',
        ],
    },
    {
        id: 'range',
        title: 'Range picker',
        group: 'Forms',
        classes: ['kp-range'],
        exports: [],
        intro: 'The time window of a metrics page: the presets as the package’s segmented control and a Custom… button that opens a panel with two of the package’s date pickers (dd/mm/yyyy) and two times (HH:MM), checked before Apply. Under the control one line says exactly which window is chosen, “Last 24 hours · 15/10/2026 14:05 – 16/10/2026 14:05”, in Europe/Brussels unless `data-kp-time-zone` says otherwise. Choosing fires `kp-range-change` with the preset’s key (or null), ISO start and end, and the line. The panel says what is wrong (a date or time that is not whole, the end before the start, an end in the future, a window longer than `data-kp-range-max-days`) under the fields and marks them; Cancel, Escape or a press outside keeps the window as it was.',
        whenToUse:
            'Above a chart, a log or a table that shows a stretch of time. For one date use the date picker; for a range inside a table’s filter use the table’s own date filter.',
        examples: [
            {
                title: 'Metrics, the last 24 hours',
                why: 'The markup is the empty box with its presets; the script builds the control, the line and the panel.',
                markup: `
<div class="kp-range" data-kp-range="24h" data-kp-range-presets="1h 6h 24h 7d 30d" aria-label="Metrics range"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-range', what: 'The preset chosen at first (a key of the presets); empty for the third preset.' },
            { name: 'data-kp-range-presets', what: 'The presets, space separated: a number and m, h, d or w (`1h 6h 24h 7d 30d`).' },
            { name: 'data-kp-range-start', what: 'With `data-kp-range-end`: a custom window to start with, as ISO moments.' },
            { name: 'data-kp-range-end', what: 'The end of that custom window.' },
            { name: 'data-kp-range-max-days', what: 'The longest custom window, in days; none by default.' },
            { name: 'data-kp-range-future', what: 'A custom window may end in the future.' },
            { name: 'data-kp-range-disabled', what: 'The presets and Custom… are off; the line still names the window.' },
            { name: 'data-kp-range-value', what: 'Set by the script: the preset in force, or `custom`.' },
            { name: 'data-kp-time-zone', what: 'The zone the line and the custom times are read in; Europe/Brussels by default.' },
        ],
        accessibility: [
            'Built in — the presets are a radio group with one tab stop and arrow keys; Custom… says it opens a dialog and is pressed while a custom window is in force; the line is the picker’s description and is read when it changes.',
            'Built in — the panel takes the focus and gives it back; Escape closes a calendar first, then the panel; a wrong field is marked invalid and points at the sentence that says why.',
            'Yours — name the picker (`aria-label`) after what it narrows, and redraw the chart from the event’s ISO moments.',
        ],
    },
    {
        id: 'compare',
        title: 'Compare slider',
        group: 'Content',
        classes: ['kp-compare'],
        aliases: ['pane', 'position', 'ratio', 'state'],
        exports: [],
        intro: 'Two versions stacked with a draggable divider: the before pane shows on the start side, the after pane on the end side. `attachCompares(root)` in js/compare.js adds the divider (a slider: arrow keys by 1, with Shift by 10, Page Up and Down, Home and End), a label on each side that steps aside while the divider covers it, and the waiting state. On images a press anywhere moves the divider and a drag follows; on live HTML panes only the handle drags, so both panes stay usable. Give images their width and height, or the box `data-kp-compare-ratio`, so nothing moves while they load; the theme’s skeleton covers the box meanwhile, and a failed image says so in its pane.',
        whenToUse:
            'To show what a change did: a redesign before and after, two renders of a chart, a photo before and after an edit. For two things that differ in more than looks, put them side by side instead.',
        examples: [
            {
                title: 'A chart before and after',
                why: 'Each pane is marked with its side; the script adds the divider, the labels and the waiting state.',
                markup: `
<div class="kp-compare" data-kp-compare aria-label="Pressure chart, before and after"><div data-kp-compare-pane="before"><img src="before.png" width="1200" height="675" alt="The chart before" /></div><div data-kp-compare-pane="after"><img src="after.png" width="1200" height="675" alt="The chart after" /></div></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-compare', what: 'Marks the slider; `attachCompares` wires it.' },
            { name: 'data-kp-compare-pane', what: '`before` or `after` on each of the two panes.' },
            { name: 'data-kp-compare-position', what: 'Where the divider starts, 0 (all after) to 100 (all before); 50 by default.' },
            { name: 'data-kp-compare-before', what: 'The before side’s label; “Before” by default.' },
            { name: 'data-kp-compare-after', what: 'The after side’s label; “After” by default.' },
            { name: 'data-kp-compare-ratio', what: 'The box’s aspect ratio (`16/9`) when the panes do not give their size.' },
            { name: 'data-kp-compare-drag', what: '`anywhere` (images: a press moves the divider) or `handle` (live panes); set by the script when not given.' },
            { name: 'data-kp-compare-state', what: 'Set by the script: `loading` while an image is on its way, else `ready`.' },
            { name: 'data-kp-compare-dragging', what: 'Set by the script during a drag: the divider follows at once.' },
            { name: 'data-kp-compare-glide', what: 'Set by the script when the divider moves to a press: it glides in the theme’s own time.' },
            { name: 'data-kp-compare-before-hidden', what: 'Set by the script while the divider covers the before label.' },
            { name: 'data-kp-compare-after-hidden', what: 'Set by the script while the divider covers the after label.' },
        ],
        accessibility: [
            'Built in — the divider is a slider with a name, its value and a value text (“40% Before, 60% After”); one tab stop; the arrow keys, Page Up and Down, Home and End move it.',
            'Built in — a finger moving up and down scrolls the page; sideways on the handle it moves the divider. The labels are drawn, the slider says the sides.',
            'Yours — give each image an `alt` that says what it shows, and the slider a name (`aria-label`).',
        ],
    },
    {
        id: 'weekdays',
        title: 'Weekday picker',
        group: 'Forms',
        classes: ['kp-weekdays'],
        exports: [],
        intro: 'The days a schedule runs on: seven chips (or the days of a month) with the quick picks Weekdays, Weekend and Every day and a line in words under them, “Mon and Thu”. Built on the chip group in multi mode; all seven days is a real choice.',
        whenToUse: 'A schedule or a repeat that runs on chosen days. For one date use the date picker; for one of a few options use the segmented control.',
        examples: [
            {
                title: 'Mondays and Thursdays',
                why: 'The markup is the empty box; the script builds the chips, the quick picks and the line.',
                markup: `
<div class="kp-weekdays" data-kp-weekdays data-kp-value="1,4" aria-label="Run on"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-days', what: '`week` (default) or `month`: the days 1 to 31 and Last.' },
            { name: 'data-kp-week-starts-on', what: 'The first day, 0 (Sunday) to 6; the locale’s by default.' },
            { name: 'data-kp-day-names', what: '`short` (Mon) or `narrow` (M).' },
            { name: 'data-kp-min', what: 'The fewest days that make a schedule; 1 by default, 0 allows none.' },
            { name: 'data-kp-presets', what: 'The quick picks, `weekdays,weekend,every`, or `false` for none.' },
            { name: 'data-kp-value', what: 'The days at first, `1,4` or `mon,thu`.' },
            { name: 'data-kp-disabled', what: 'The whole picker is off; `data-kp-disabled-reason` says why, under the chips.' },
        ],
        accessibility: [
            'Built in — the chips are one tab stop with arrow keys; each is a toggle button with its full day name; the line in words is read when it changes.',
            'Yours — name the picker (`aria-label`) after what it chooses, and keep your own copy of the days: the picker holds no data of yours.',
        ],
    },
    {
        id: 'runs',
        title: 'Next times',
        group: 'Data',
        classes: ['kp-runs'],
        exports: [],
        intro: 'The next times a schedule will run, one to a row: the time with its weekday (dd/mm/yyyy HH:MM, Europe/Brussels), how far away it is, and a mark where the clock is turned before a run or the page names a conflict. The page computes the times; the package draws them, in the same height in every state.',
        whenToUse: 'Under a schedule or repeat, so the person sees what the setting really does. For a run history use the run timeline.',
        examples: [
            {
                title: 'Three nights',
                why: 'The markup is the empty box; the page hands over the times.',
                markup: `
<div class="kp-runs" data-kp-runs data-kp-runs-count="3" data-kp-runs-values="2026-10-18T03:00:00+02:00,2026-10-19T03:00:00+02:00,2026-10-20T03:00:00+02:00"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-runs-count', what: 'How many rows; 3 by default.' },
            { name: 'data-kp-runs-relative', what: '`false` leaves the “in 2 days” out.' },
            { name: 'data-kp-runs-warn', what: '`false` leaves the clock-change and conflict marks out.' },
            { name: 'data-kp-runs-more', what: 'N: a “Show N more” for times past the count.' },
            { name: 'data-kp-time-zone', what: 'The zone the times are written in; Europe/Brussels by default.' },
            { name: 'data-kp-now', what: 'A fixed clock (ISO) for a demo or a test.' },
            { name: 'data-kp-state', what: '`loading` at first; the script writes `ready`, `empty`, `loading` and `error`.' },
        ],
        accessibility: [
            'Built in — each time is a `<time>` with its datetime; a status region says the first run when it changes; the failed state is an alert.',
            'Yours — word the reason of an empty list (“Pick at least one weekday”) and the conflicts, and name the list after the schedule.',
        ],
    },
    {
        id: 'snooze',
        title: 'Snooze picker',
        group: 'Forms',
        classes: ['kp-snooze'],
        exports: [],
        intro: 'A “remind me later” picker: a button with a menu (or a row of chips) of quick choices, each over the exact moment it means, and a date and time of your own. Choices that have passed or lie too far away are left out.',
        whenToUse: 'Where a reminder, a notification or a to-do can be put off. For choosing a date only, use the date picker.',
        examples: [
            {
                title: 'The mix',
                why: 'The markup is the empty box; the script builds the button, the menu and the panel.',
                markup: `
<div class="kp-snooze" data-kp-snooze data-kp-snooze-choices="1h 4h tonight tomorrow monday pick"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-snooze-choices', what: 'The choices, space separated: `15m`, `1h`, `4h`, `tonight`, `tomorrow`, `monday`, `next-week`, `pick`.' },
            { name: 'data-kp-snooze-morning', what: 'What tomorrow, Monday and next week mean; 09:00.' },
            { name: 'data-kp-snooze-evening', what: 'What tonight means; 18:00.' },
            { name: 'data-kp-snooze-max', what: 'The longest a reminder may be put off; 7d.' },
            { name: 'data-kp-look', what: '`menu` (default) or `chips`.' },
            { name: 'data-kp-snoozed-until', what: 'An ISO moment: shows “Snoozed until …” with End snooze.' },
            { name: 'data-kp-remember', what: 'A name: the last custom moment is kept across visits.' },
        ],
        accessibility: [
            'Built in — the menu is the package’s menu (arrow keys, Home, End, Esc); the status line is read when it changes; the panel takes the focus and gives it back and names what is wrong in a field.',
            'Yours — store the moment the event carries, and call `setSnoozedUntil` back; name the picker after what it puts off.',
        ],
    },
    {
        id: 'toolbar',
        title: 'List toolbar',
        group: 'Data',
        classes: ['kp-toolbar'],
        exports: [],
        intro: 'The bar above a list, a log, a board or a chart that is not (or not only) a data table: a search box, groups of filters (segmented controls or chips), a slot for a count or a switch, and a row of the filters that are on as removable tags. The zones sit on one grid row, so the search box keeps its width whatever the filter groups hold. js/toolbar.js clears the search on Escape, focuses it on a key, and draws the active row.',
        whenToUse:
            'Above any list the reader narrows down by typing and by a few filters. For a data table use its own header filters instead: the toolbar is the same idea for everything else.',
        examples: [
            {
                title: 'Search, one filter group and a count',
                why: '`data-kp-toolbar-key="/"` focuses the search from anywhere on the page that is not a field; the key cap in the markup says so. The active row stays hidden until the page calls `setToolbarActive`.',
                markup: `
<div class="kp-toolbar" data-kp-toolbar data-kp-toolbar-key="/" role="group" aria-label="Containers">
<div class="kp-toolbar__search"><input type="search" class="kp-field__input kp-toolbar__input" placeholder="Search containers" aria-label="Search containers" aria-keyshortcuts="/" /><kbd class="kp-kbd kp-toolbar__key" aria-hidden="true">/</kbd></div>
<div class="kp-toolbar__filters"><div class="kp-toolbar__group" role="group" aria-labelledby="doc-tb-status"><b class="kp-toolbar__label" id="doc-tb-status">Status</b>
<div class="kp-segmented kp-segmented--chips" data-kp-segmented="multi" role="group" aria-label="Status"><button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all aria-pressed="true"><span class="kp-segmented__label">All</span></button><button type="button" class="kp-segmented__item" data-value="running" aria-pressed="false"><span class="kp-segmented__label">Running</span></button></div>
</div></div>
<div class="kp-toolbar__state">12 of 48</div>
<div class="kp-toolbar__active" hidden></div>
</div>
`,
            },
            {
                title: 'The active row, a reserved height and a narrow column',
                why: 'The page keeps the filters in step: `setToolbarActive(toolbar, filters)` draws one removable tag each and Clear all, and the page turns a filter off on `kp-toolbar-remove` (`{ id, label }`) or all of them on `kp-toolbar-clear`. `data-kp-toolbar-reserve` keeps the active row’s height while it is empty, so the list under the toolbar never moves; `.kp-toolbar--stacked` is the one-column toolbar on demand, for a narrow card or a side column on a wide window.',
                markup: `
<div class="kp-toolbar kp-toolbar--stacked" id="doc-tb-live" data-kp-toolbar data-kp-toolbar-reserve role="group" aria-label="Containers" style="max-inline-size: 24rem">
<div class="kp-toolbar__search"><input type="search" class="kp-field__input kp-toolbar__input" placeholder="Search containers" aria-label="Search containers" /></div>
<div class="kp-toolbar__filters"><div class="kp-toolbar__group" role="group" aria-labelledby="doc-tb-live-status"><b class="kp-toolbar__label" id="doc-tb-live-status">Status</b>
<div class="kp-segmented kp-segmented--chips" data-kp-segmented="multi" role="group" aria-label="Status"><button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all aria-pressed="true"><span class="kp-segmented__label">All</span></button><button type="button" class="kp-segmented__item" data-value="running" aria-pressed="false"><span class="kp-segmented__label">Running</span></button><button type="button" class="kp-segmented__item" data-value="stopped" aria-pressed="false"><span class="kp-segmented__label">Stopped</span></button></div>
</div></div>
<div class="kp-toolbar__state">3 containers</div>
<div class="kp-toolbar__active" hidden></div>
</div>
`,
                script: `
import { attachSegmented, getSegmentedValues, resetSegmented, setSegmentedValues } from '@kp-soft/themes/js/segmented';
import { attachToolbars, setToolbarActive } from '@kp-soft/themes/js/toolbar';

const toolbar = document.getElementById('doc-tb-live');
const chips = toolbar.querySelector('[data-kp-segmented]');
attachSegmented(toolbar);
attachToolbars(toolbar.parentElement);
const draw = (values) => setToolbarActive(toolbar, values.map((value) => ({ id: value, label: 'Status: ' + value })));
chips.addEventListener('kp-segmented-change', (event) => draw(event.detail.values));
toolbar.addEventListener('kp-toolbar-remove', (event) => {
    const values = getSegmentedValues(chips).filter((value) => value !== event.detail.id);
    setSegmentedValues(chips, values);
    draw(values);
});
toolbar.addEventListener('kp-toolbar-clear', () => {
    resetSegmented(chips);
    draw([]);
});
`,
            },
        ],
        variants: [
            { name: '.kp-toolbar__search', what: 'The search zone: the field and, beside it, the key cap that focuses it.' },
            { name: '.kp-toolbar__filters', what: 'The filter zone: any number of `.kp-toolbar__group`, each a label over a segmented control.' },
            { name: '.kp-toolbar__state', what: 'A slot for a count, a follow switch or a table/cards choice.' },
            { name: '.kp-toolbar__active', what: 'The filters that are on, as the data table’s removable tags and a Clear all button. Hidden when none is on.' },
            { name: 'data-kp-toolbar-key', what: 'The key that focuses the search from anywhere on the page that is not a field (`/`); the key cap in the markup (`.kp-toolbar__key`) says so.' },
            { name: 'data-kp-toolbar-reserve', what: 'The active row keeps its height while it is empty, so the list under the toolbar does not move when a filter is turned on.' },
            { name: '.kp-toolbar--stacked', what: 'The one-column toolbar on demand, for a narrow card or a side column on a wide window, where the window’s own width cannot know the room. The filters scroll sideways instead of wrapping.' },
            { name: 'data-kp-toolbar-clear', what: 'On the Clear all button; the script makes it once and keeps it, so a press in flight never meets a button replaced under it.' },
            { name: 'setToolbarActive(toolbar, filters, { clearAll, removeGlyph })', what: 'Draws the filters that are on (`{ id, label }` each); `clearAll: false` leaves out Clear all, `removeGlyph` changes the cross. `toolbarSearch(toolbar)` returns the search input.' },
            { name: 'toolbarShowingOnly / toolbarClearAll', what: 'The word before the tags and the Clear all label, in the dictionary, so `setStrings()` translates them.' },
        ],
        accessibility: [
            'Built in — the toolbar is a named group; Escape in the search clears it and fires `input`, so the page filters again.',
            'Built in — removing a tag moves the focus to the next one, and Clear all returns it to the search.',
            'Yours — name the toolbar, label the search, and call `setToolbarActive` again after a filter changes so the tags always say what is on.',
        ],
    },
    {
        id: 'keys',
        title: 'Key line and key cap',
        group: 'Content',
        classes: ['kp-keys', 'kp-kbd'],
        exports: [],
        intro: 'A line of keyboard shortcuts on one line under a list or beside a control: key caps (`kbd.kp-kbd`) with what each does. The markup is complete without any script; `setKeys(el, pairs)` writes it from pairs, and `Mod` is the platform’s modifier, ⌘ on a Mac and Ctrl elsewhere, in the set form and in markup (`data-kp-key="mod"` on a cap).',
        whenToUse:
            'To tell a reader which keys work where they are looking. For a full list of every shortcut use the Help sheet (`.kp-shortcuts`), which is a boxed dialog; this is the line that sits in the page.',
        examples: [
            {
                title: 'Three shortcuts',
                why: 'Keys pressed together share a `.kp-keys__caps`. The Ctrl cap is filled with ⌘ on a Mac by `attachKeys`.',
                markup: `
<div class="kp-keys" role="group" aria-label="Keyboard shortcuts">
<span class="kp-keys__item"><kbd class="kp-kbd">/</kbd> search</span>
<span class="kp-keys__item"><span class="kp-keys__caps"><kbd class="kp-kbd">↑</kbd><kbd class="kp-kbd">↓</kbd></span> move</span>
<span class="kp-keys__item"><kbd class="kp-kbd" data-kp-key="mod">Ctrl</kbd><kbd class="kp-kbd">K</kbd> palette</span>
</div>
`,
            },
            {
                title: 'Written from pairs, at the end of its row',
                why: '`setKeys(el, pairs)` takes `[keys, words]` pairs (a key, or an array of keys pressed together) and writes the spans; `Mod` becomes ⌘ on a Mac and Ctrl elsewhere. The group is named by the dictionary’s `keysLabel` when it has no name of its own.',
                markup: `
<div class="kp-keys kp-keys--end" id="doc-keys-set"></div>
`,
                script: `
import { setKeys } from '@kp-soft/themes/js/keys';

setKeys(document.getElementById('doc-keys-set'), [
    ['/', 'search containers'],
    [['↑', '↓'], 'move'],
    [['Mod', 'K'], 'palette'],
]);
`,
            },
        ],
        variants: [
            { name: '.kp-kbd', what: 'One key cap: a small raised plate with the key’s text, in the page’s mono face.' },
            { name: '.kp-keys--end', what: 'The line sits at the end of its row instead of the start.' },
            { name: '.kp-keys__caps', what: 'Keys pressed together, kept side by side and never wrapped apart.' },
        ],
        accessibility: [
            'Built in — the line is a named group, and each cap is real text, so a screen reader reads “slash, search”.',
            'Yours — a cap only describes a shortcut; the page must bind the key, and a key that works only with a modifier must say so.',
        ],
    },
    {
        id: 'action-tile',
        title: 'Action tile',
        group: 'Buttons',
        classes: ['kp-actions', 'kp-action'],
        exports: [],
        intro: 'A button or a link drawn as a tile: a title and the one sentence that says what it does, in a grid whose tiles on one row are all as tall as the tallest. A button tile does something, a link tile goes somewhere (its mark is a chevron). The tile has a mark column that is always there, so a spinner arriving moves nothing. js/action-tiles.js (`attachActionTiles`, `setActionBusy`) stops a press on a busy or disabled tile and puts the theme’s own spinner in the mark while `aria-busy="true"`.',
        whenToUse: 'For a short list of things to do or places to go that each need a sentence: a landing page, a drawer, a settings overview. For one action use a button; for a list of records use a table.',
        examples: [
            {
                title: 'A grid of tiles',
                why: 'Buttons and links mix in one grid. Mark a destructive tile with `kp-action--destructive`; its words must say what it does, the bar and the red title only help.',
                markup: `
<div class="kp-actions" role="group" aria-label="System actions">
<button type="button" class="kp-action"><strong class="kp-action__title">Back up now</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Copies every volume to the backup disk and checks the copy.</span></button>
<a class="kp-action" href="#host"><strong class="kp-action__title">Host</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">CPU, memory and disks of the machine underneath.</span></a>
<button type="button" class="kp-action kp-action--destructive"><strong class="kp-action__title">Delete all snapshots</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Frees 48 GB. This cannot be undone.</span></button>
<button type="button" class="kp-action" disabled><strong class="kp-action__title">Check for updates</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Not while a backup is running.</span></button>
</div>
`,
            },
            {
                title: 'A tile that works for a while',
                why: '`setActionBusy(tile, true)` puts `aria-busy="true"` on the tile, the theme’s spinner in its mark and a hidden “Working…” after its title, and fires `kp-action-busy` with `{ tile, busy }`. While it is busy a press does nothing, not even the page’s own handler. The mark column is always there, so the spinner arriving moves nothing.',
                markup: `
<div class="kp-actions" id="doc-tiles-busy" role="group" aria-label="System actions">
<button type="button" class="kp-action" id="doc-tile-backup"><strong class="kp-action__title">Back up now</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Copies every volume to the backup disk. Press it and it is busy for three seconds.</span></button>
<button type="button" class="kp-action kp-action--destructive" aria-busy="true"><strong class="kp-action__title">Delete all snapshots</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Always busy here, to show a busy tile of the destructive kind.</span></button>
</div>
`,
                script: `
import { attachActionTiles, setActionBusy } from '@kp-soft/themes/js/action-tiles';

const tiles = document.getElementById('doc-tiles-busy');
attachActionTiles(tiles.parentElement);
document.getElementById('doc-tile-backup').addEventListener('click', (event) => {
    const tile = event.currentTarget;
    setActionBusy(tile, true);
    setTimeout(() => setActionBusy(tile, false), 3000);
});
`,
            },
        ],
        variants: [
            { name: '.kp-action--destructive', what: 'A start bar, a red-tinted edge and title. The edge goes fully red when pointed at.' },
            { name: 'disabled / aria-disabled="true"', what: 'A quieter plate, no hover, no press; `aria-disabled` also stops a link or a button that must keep its focus.' },
            { name: 'aria-busy="true"', what: 'The spinner appears in the mark, a hidden “Working…” follows the title, and a press does nothing until it is cleared. `setActionBusy(tile, true)` sets it and fires `kp-action-busy`.' },
            { name: '.kp-action__meta', what: 'An optional small line under the sentence, for a live figure.' },
            { name: '--kp-actions-min', what: 'The least width of a column (15rem); the grid fills the width with as many as fit.' },
        ],
        accessibility: [
            'Built in — a tile is a real button or link: Tab reaches it, Enter or Space presses a button, Enter follows a link, and the focus ring is whole in every theme.',
            'Built in — the chevron and the spinner are pictures (`aria-hidden`); the busy word is read after the title.',
            'Yours — give every tile a sentence, and name the group.',
        ],
    },
    {
        id: 'status-row',
        aliases: ['status', 'status-id', 'status-retry', 'status-retry-button', 'status-change'],
        title: 'Status rows',
        group: 'Feedback',
        classes: ['kp-statuslist', 'kp-statusrow'],
        exports: [],
        intro: 'One row per item that is read or checked one by one: a mark, the item’s name, a short detail and, when it failed, a Retry that tries that one item again. `data-state` is `ok`, `loading`, `failed` or `empty`; each is a shape and a word as well as a colour. js/statusrow.js (`buildStatusList`, `setStatus`, `attachStatusLists`) keeps the mark, the spoken state, `aria-busy`, the Retry and the announcement in step with it, and fires `kp-status-retry` when a Retry is pressed and `kp-status-change` when a row changes.',
        whenToUse: 'For a page that reads many things separately (a backup per stack, a check per host) and must say which one is slow, which failed and why. For the steps of one run use the step list.',
        examples: [
            {
                title: 'The four states',
                why: 'Give every row a detail so a reason arriving later moves nothing; `--kp-statusrow-detail-lines: 2` keeps room for a two-line reason.',
                markup: `
<ul class="kp-statuslist" aria-label="Backups per stack">
<li class="kp-statusrow" data-state="ok" data-kp-status-id="jellyfin"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">jellyfin</span><span class="kp-statusrow__detail">read</span></span></li>
<li class="kp-statusrow" data-state="loading" data-kp-status-id="vault"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">vaultwarden</span><span class="kp-statusrow__detail">reading (12 s)</span></span></li>
<li class="kp-statusrow" data-state="failed" data-kp-status-id="traefik"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">traefik</span><span class="kp-statusrow__detail">timed out after 20 s</span></span></li>
<li class="kp-statusrow" data-state="empty" data-kp-status-id="grafana"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">grafana</span><span class="kp-statusrow__detail">no backups by design</span></span></li>
</ul>
`,
            },
            {
                title: 'Built from rows, with a Retry that works',
                why: '`buildStatusList(rows, { label, retry, single })` builds the list; `setStatus(list, id, { state, label, detail })` changes one row. Pressing Retry on the failed row fires `kp-status-retry` with `{ item, id }` and changes nothing else: the page decides what a retry is, here `loading`, then `ok` two seconds later. `kp-status-change` fires on every change after attach, and the hidden status region says it once.',
                markup: `
<div id="doc-status-host"></div>
`,
                script: `
import { attachStatusLists, buildStatusList, setStatus } from '@kp-soft/themes/js/statusrow';

const host = document.getElementById('doc-status-host');
const list = buildStatusList(
    [
        { id: 'jellyfin', label: 'jellyfin', state: 'ok', detail: 'read' },
        { id: 'vault', label: 'vaultwarden', state: 'loading', detail: 'reading' },
        { id: 'traefik', label: 'traefik', state: 'failed', detail: 'timed out after 20 s' },
        { id: 'grafana', label: 'grafana', state: 'empty', detail: 'no backups by design' },
    ],
    { label: 'Backups per stack', single: true },
);
host.append(list);
attachStatusLists(host);
setTimeout(() => setStatus(list, 'vault', { state: 'ok', detail: 'read' }), 2500);
list.addEventListener('kp-status-retry', (event) => {
    const id = event.detail.id;
    setStatus(list, id, { state: 'loading', detail: 'reading' });
    setTimeout(() => setStatus(list, id, { state: 'ok', detail: 'read' }), 2000);
});
`,
            },
        ],
        variants: [
            { name: 'data-state', what: '`ok` (a disc with a tick), `loading` (the theme’s spinner), `failed` (a disc with a cross, a red edge and a Retry), `empty` (a dashed ring and a dashed edge).' },
            { name: 'data-kp-status-id', what: 'Names a row for `setStatus(list, id, { state, label, detail })`.' },
            { name: 'data-kp-status-retry="false"', what: 'On the list: no Retry button on failed rows.' },
            { name: '.kp-statuslist--rows', what: 'One column instead of a grid of columns of at least 16rem.' },
            { name: 'buildStatusList / setStatus / attachStatusLists', what: 'Build the list from rows `{ id, label, state, detail }`, change one row, and attach the spoken parts and the Retry. `kp-status-retry` is `{ item, id }`, `kp-status-change` is `{ item, id, state, previous }`.' },
            { name: 'statusOk / statusLoading / statusFailed / statusEmpty / statusRetry', what: 'The state words and the Retry label, in the dictionary; `statusRetryLabel` names a Retry after its row, and `statusAnnounce` and `statusAnnounceMany` are the announcements (more than three changes in one tick become one summary).' },
        ],
        accessibility: [
            'Built in — each row reads “name, state”, a loading row has `aria-busy`, and a change is announced once through a hidden status region; more than three changes in one tick become one summary.',
            'Built in — the Retry is named after its row, and when the focused Retry goes away the focus moves to the row’s name.',
            'Yours — name the list, and write a reason that says what to do.',
        ],
    },
    {
        id: 'facets',
        title: 'Facet list',
        group: 'Data',
        classes: ['kp-facets', 'kp-facet'],
        exports: [],
        intro: 'Checkbox rows that narrow a list by one property, each with how many items it would show and an “only” button that selects just that row. `data-kp-facets` on the group; `data-kp-facets-all="Everything"` adds a row that turns every row on and shows a mixed state while only some are. js/facets.js (`setFacetItems`, `setFacetCounts`, `setFacetValues`, `getFacetValues`, `attachFacets`) keeps the rows in step and fires `kp-facet-change`. `setFacetItems` changes rows in place, so a row that arrives later never takes the keyboard focus away.',
        whenToUse: 'For the side of a log, a list or a board where a few values of one property are turned on and off, and the common move is “only this one”. For one value out of a few use a segmented control; for a long list with search use the combobox.',
        examples: [
            {
                title: 'A group with an Everything row',
                why: 'The checkboxes are the theme’s own; “only” is the theme’s ghost button, a sibling of the label. Counts keep a column.',
                markup: `
<div class="kp-facets" role="group" aria-label="Source">
<ul class="kp-facets__list">
<li class="kp-facet" data-kp-facet-all><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check" checked /><span class="kp-facet__name">Everything</span><span class="kp-facet__count">351</span></label></li>
<li class="kp-facet" data-value="HOST"><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check" checked /><span class="kp-facet__name">Host</span><span class="kp-facet__count">214</span></label><button type="button" class="kp-button kp-button--ghost kp-button--sm kp-facet__only" aria-label="Show only Host">only</button></li>
<li class="kp-facet" data-value="jellyfin"><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check" checked /><span class="kp-facet__name">jellyfin</span><span class="kp-facet__count">96</span></label><button type="button" class="kp-button kp-button--ghost kp-button--sm kp-facet__only" aria-label="Show only jellyfin">only</button></li>
</ul>
</div>
`,
            },
            {
                title: 'Made from items, with a colour and an identity pattern, and counts that arrive',
                why: '`setFacetItems` reconciles the rows by value, in place. A row’s `swatch` is a colour and its `pattern` a seed (a name): a 5 by 5 pattern, the same for the same name wherever it is drawn (`identityCells(seed)`), is laid over the square, so two sources are told apart by more than a hue. `aria-busy="true"` shows the counts as quiet bars until `setFacetCounts` writes them. `kp-facet-change` carries `{ group, values, source, value }`; the line under the list prints it.',
                markup: `
<div class="kp-facets" id="doc-facets-live" data-kp-facets data-kp-facets-all="Everything" role="group" aria-label="Source" aria-busy="true">
<ul class="kp-facets__list"></ul>
<p class="kp-facets__empty" hidden>No sources yet.</p>
</div>
<p class="kp-text-muted" id="doc-facets-out" aria-live="polite">Showing everything.</p>
`,
                script: `
import { attachFacets, setFacetCounts, setFacetItems } from '@kp-soft/themes/js/facets';

const group = document.getElementById('doc-facets-live');
attachFacets(group.parentElement);
const hue = (name) => [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 360;
setFacetItems(
    group,
    ['Host', 'jellyfin', 'traefik', 'vaultwarden'].map((name) => ({
        value: name,
        label: name,
        swatch: 'oklch(0.62 0.15 ' + hue(name) + ')',
        pattern: name,
    })),
);
setTimeout(() => {
    setFacetCounts(group, { Host: 214, jellyfin: 96, traefik: 31, vaultwarden: 10 });
    group.removeAttribute('aria-busy');
}, 1200);
group.addEventListener('kp-facet-change', (event) => {
    const { values, source, value } = event.detail;
    document.getElementById('doc-facets-out').textContent = 'Showing ' + values.join(', ') + ' (' + source + (value ? ', ' + value : '') + ').';
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-facets-all', what: 'The Everything row; its checkbox is mixed while only some rows are on, and pressing it turns every row on.' },
            { name: 'aria-busy="true"', what: 'On the group: the counts show as quiet bars that keep their place until `setFacetCounts` writes them.' },
            { name: '.kp-facets--row', what: 'The rows side by side as bordered pills, scrolling sideways, for a phone.' },
            { name: '.kp-facet__swatch', what: 'An optional small square before the name; its colour is a custom property you set on it.' },
            { name: 'FacetItem.pattern / data-kp-facet-pattern', what: 'A seed (a name) for an identity pattern over the swatch: `identityCells(seed)` makes a 5 by 5 grid mirrored about its middle column, the same for the same name everywhere; `.kp-facet__pattern` is the drawing. An empty seed takes it away. The pattern’s size and ink are in the knobs.' },
            { name: 'setFacetItems / setFacetCounts / setFacetValues / getFacetValues', what: 'Reconcile the rows by value in place, write the counts, set the values that are on without an event, and read them. `kp-facet-change` fires for a person’s choice only: `source` is `toggle`, `only` or `all`.' },
            { name: 'facetOnly / facetAll / facetShowingOnly / facetShowingAll', what: 'The words (“only”, “Everything”, “Showing only Host”, “Showing everything”), in the dictionary; the “only” label and its aria name are `facetOnly` and `facetOnlyLabel`.' },
            { name: 'data-kp-facet-all and only', what: 'The “only” button is shown when the pointer is on the row or focus is in it, and always on a device that cannot hover.' },
        ],
        accessibility: [
            'Built in — each checkbox is named by its row’s name and described by its count; “only” says which row it is for; it sits beside the label, never inside it.',
            'Built in — after “only” or “Everything” a hidden status region says “Showing only Host” or “Showing everything”.',
            'Yours — give the group a name, and keep each count in step with what the page shows.',
        ],
    },
    {
        id: 'quantity',
        title: 'Quantity',
        group: 'Forms',
        classes: ['kp-quantity'],
        exports: [],
        intro: 'A number between a minus and a plus button with its unit after it, for servings and amounts. `data-kp-quantity` on the root with `-min`, `-max`, `-step`, `-unit`, `-unit-one`, `-label` and `-locale`; js/quantity.js (`attachQuantities`, `setQuantity`, `getQuantity`) writes the buttons, the field box and the unit, and fires `kp-quantity-change` with `{ value, previous, source }`. The number is a spin button that can be typed in the page’s language, with a comma or a point.',
        whenToUse: 'For a small whole or stepped amount a person nudges up and down: portions, pieces, grams in steps. For a free number use a field; for a share of a range use a slider.',
        examples: [
            {
                title: 'Portions, from 1 to 12',
                why: 'The buttons are the theme’s own; the number and the unit share one field box; the minus is dimmed at the bound and keeps its place.',
                markup: `
<div class="kp-quantity" data-kp-quantity data-kp-quantity-min="1" data-kp-quantity-max="12" data-kp-quantity-unit="portions" data-kp-quantity-unit-one="portion" data-kp-quantity-label="Portions">
<input class="kp-quantity__input" value="2" />
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-quantity-step', what: 'The step a press moves by; its decimals are the number’s decimals (0.5 shows one).' },
            { name: 'data-kp-quantity-disabled', what: 'The whole control dimmed and out of reach.' },
            { name: '.kp-quantity--lg', what: 'Larger buttons and number, for a screen at arm’s length.' },
        ],
        accessibility: [
            'Built in — the number is a spin button with its value and unit in words; ArrowUp, ArrowDown, PageUp, PageDown, Home and End move it; the buttons are named after the label.',
            'Built in — a button at a bound is marked `aria-disabled` and keeps the focus.',
            'Yours — give it a label (`data-kp-quantity-label` or a `<label>` for the input).',
        ],
    },
    {
        id: 'checklist',
        title: 'Checklist',
        group: 'Data',
        classes: ['kp-checklist'],
        exports: [],
        intro: 'A list a person works down, such as a shopping list by shop: every row is a checkbox’s label, a ticked row is struck through and sinks to the end of its group, gliding in the theme’s own time. `data-kp-checklist` on the root; js/checklist.js (`setChecklistItems`, `getChecklistItems`, `setChecklistChecked`, `setChecklistState`, `attachChecklists`) draws the groups, the counts and the bar with Check all, Clear checked and its Undo, and fires `kp-checklist-change`, `kp-checklist-clear` and `kp-checklist-undo` with the whole list, so the page stores it.',
        whenToUse: 'For items a person ticks off and no longer needs to see on top. For a filter use the facet list; for the steps of a running process use the step list.',
        examples: [
            {
                title: 'A shopping list',
                why: 'The module draws the rows from the items it is given; the markup is only the root.',
                markup: `
<div class="kp-checklist" data-kp-checklist aria-label="Shopping list"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-checklist-sink="false"', what: 'A ticked row stays where it is, struck through.' },
            { name: 'data-kp-checklist-undo-ms', what: 'How long Undo is offered after Clear checked (6000).' },
            { name: 'data-kp-checklist-empty', what: 'The sentence of an empty list.' },
            { name: 'data-kp-checklist-heading', what: 'The level of the group headings (3).' },
        ],
        accessibility: [
            'Built in — real checkboxes in labels, named by the item and described by its amount; group headings with their counts.',
            'Built in — ticked with the keyboard, the focus goes to the item that took its place; a status region says what moved.',
            'Yours — give the list a name and store what the events say.',
        ],
    },
    {
        id: 'timer',
        title: 'Kitchen timers',
        group: 'Feedback',
        classes: ['kp-timers', 'kp-timer'],
        exports: [],
        intro: 'Named countdowns that keep running side by side, each a card with its name, the time left large, the theme’s progress bar, Pause or Resume, +1 min and Remove. `data-kp-timers` on the list; js/timer.js (`startTimer`, `pauseTimer`, `resumeTimer`, `addTimerTime`, `stopTimer`, `getTimers`, `restoreTimers`, `askTimerNotifications`, `attachTimers`) counts from each end time, so a page in the background or a phone that locked shows the right time again, and ends a timer with the done plate, a soft chime, a buzz and a system notification when allowed. A button with `data-kp-timer-start="10m"` anywhere in the page starts one.',
        whenToUse: 'For clocks a person starts and keeps an eye on (cooking, a break, a session). For a notice that closes by itself use the alarm in its timed mode.',
        examples: [
            {
                title: 'A list and a starter in a sentence',
                why: 'The list draws its cards; the starter names the duration and the timer.',
                markup: `
<div class="kp-timers" data-kp-timers id="timers" aria-label="Kitchen timers"></div>
<p>Let the sauce simmer for <button type="button" class="kp-button kp-button--sm" data-kp-timer-start="10m" data-kp-timer-name="Sauce" data-kp-timer-for="timers">10 minutes</button>.</p>
`,
            },
        ],
        variants: [
            { name: 'data-kp-timers-ring', what: 'How long an ended timer chimes, in seconds (60; 0 is once).' },
            { name: 'data-kp-timers-sound="off"', what: 'No chime.' },
            { name: 'data-kp-timers-notify="false"', what: 'No system notification even with the permission.' },
            { name: 'data-kp-timers-empty', what: 'The sentence of an empty list.' },
        ],
        accessibility: [
            'Built in — each card is named by its timer; the time is a `timer` region that is read on demand, never every second.',
            'Built in — a start and the last minute are said politely, the end at once.',
            'Yours — ask for notifications from a press, and keep what getTimers() gives across a reload.',
        ],
    },
    {
        id: 'focus-steps',
        title: 'One step at a time',
        group: 'Navigation',
        classes: ['kp-focus-steps'],
        exports: [],
        intro: 'Cook mode: one step of a recipe large on the screen, with what that step needs, a timer button and a note, the count and the theme’s progress bar on top, and two big buttons at the foot. `data-kp-focus-steps` on the root; js/focus-steps.js (`setFocusSteps`, `goToStep`, `getStepIndex`, `setFocusStepsState`, `attachFocusSteps`) keeps the screen on with the Wake Lock API while it is attached, turns the step with the arrows, PageUp/PageDown, Space and a swipe, reads it aloud on request and fires `kp-focus-steps-change` so the page can remember where a person stopped.',
        whenToUse: 'For instructions followed with the hands busy: a recipe, a repair, an exercise. For a form filled in parts use the wizard; for the steps of a running process use the step list.',
        examples: [
            {
                title: 'A recipe',
                why: 'The module draws the parts from the steps it is given; the root needs a height.',
                markup: `
<div class="kp-focus-steps" data-kp-focus-steps aria-label="Chicken curry"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-focus-steps-wake="false"', what: 'Do not ask for the screen to stay on.' },
            { name: 'data-kp-focus-steps-timers', what: 'The id of the timer list a step’s timer button starts in.' },
            { name: 'data-kp-focus-steps-empty', what: 'The sentence of a recipe with no steps.' },
            { name: 'data-kp-focus-steps-screen', what: 'Written: on, off or unsupported, and said in the head.' },
        ],
        accessibility: [
            'Built in — every change says “Step 3 of 8” and the step; the buttons are real buttons, a step boundary is `aria-disabled` and keeps the focus.',
            'Built in — keys and a swipe do what the buttons do; Read aloud uses the browser’s own voice.',
            'Yours — give the view a name and a height, and remember the index the event gives.',
        ],
    },
    {
        id: 'wheel',
        title: 'Wheel',
        group: 'Data',
        classes: ['kp-wheel'],
        exports: [],
        intro: 'A wheel that picks for you: a segment per choice, sized by its weight, a pointer at the top and Spin in the middle. `data-kp-wheel` on the root; js/wheel.js (`setWheelItems`, `spinWheel`, `setWheelState`, `getWheelResult`, `pickWeighted`, `attachWheels`) draws the outcome by the weights first and then turns the wheel to it, never lands on the same choice twice in a row, takes the short way for a reader who asked for less motion, and says the outcome once. `kp-wheel-spin` and `kp-wheel-result` carry the item.',
        whenToUse: 'To take a small choice off someone’s hands (what to eat, who goes first) where any outcome is acceptable. For a choice a person makes use a list or a segmented control.',
        examples: [
            {
                title: 'Tonight’s dinner',
                why: 'The module draws the wheel from the items it is given.',
                markup: `
<div class="kp-wheel" data-kp-wheel aria-label="Tonight’s dinner"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-wheel-duration', what: 'How long a spin takes, in ms (3600).' },
            { name: 'data-kp-wheel-turns', what: 'Whole turns before it settles (4).' },
            { name: 'data-kp-wheel-reduced-ms', what: 'The short turn under reduced motion, in ms (600; 0 places it at once).' },
            { name: 'data-kp-wheel-repeat="true"', what: 'Spin again may land on the same choice.' },
            { name: 'data-kp-wheel-empty', what: 'The sentence when nothing fits.' },
        ],
        accessibility: [
            'Built in — Spin is a real button (Space, Enter); the outcome is a status region said once, after the turn.',
            'Built in — reduced motion takes the short way, or none.',
            'Yours — give the wheel a name, and offer the outcome as a choice the person can refuse.',
        ],
    },
    {
        id: 'steplist',
        title: 'Step list',
        group: 'Feedback',
        classes: ['kp-steplist'],
        exports: [],
        intro: 'The steps of one run, live: an update, an import or a deploy as a list whose items are waiting, running, done, failed or skipped. `data-state` on each item is the source; js/steplist.js keeps the rest in step with it: the spinner on the running step, a hidden state word after each title, `aria-current="step"`, and a polite status region that announces a change.',
        whenToUse:
            'For a process with named stages that a person watches or comes back to. For one measured quantity use a progress bar; for a form split in pages use the wizard.',
        examples: [
            {
                title: 'An update in flight',
                why: 'Give every step a note, so one arriving later moves nothing. Change a step with `setStep(list, id, { state })`, or set `data-state` yourself: the script follows either.',
                markup: `
<ol class="kp-steplist" aria-label="Update progress">
<li class="kp-steplist__item" data-state="done" data-kp-step-id="pull"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Pull the images</span><span class="kp-steplist__note">Fetches what changed from the registry</span></span><time class="kp-steplist__time">4 s</time></li>
<li class="kp-steplist__item" data-state="running" data-kp-step-id="restart"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Restart the stack</span><span class="kp-steplist__note">Stops, then starts every container</span></span></li>
<li class="kp-steplist__item" data-state="pending" data-kp-step-id="check"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Check it answers</span><span class="kp-steplist__note">Waits for the health check</span></span></li>
</ol>
`,
            },
            {
                title: 'Built from rows, and run live',
                why: 'The five states in one list, built by `buildSteplist` from rows (an `id`, a `title`, a `note`, a `state`, a `time`) and then driven by `setStep`. Each step the button moves announces itself once in the status region, and `kp-steplist-step` fires on the list with `{ item, id, state, previous }`. The step ids are the `data-kp-step-id` the module writes.',
                markup: `
<div id="doc-steps" class="kp-stack"></div>
<button type="button" class="kp-button" id="doc-steps-run">Run it again</button>
`,
                script: `
import { buildSteplist, setStep, attachSteplists } from '@kp-soft/themes/js/steplist';

const host = document.getElementById('doc-steps');
const list = buildSteplist(
    [
        { id: 'pull', title: 'Pull the images', note: 'Fetches what changed', state: 'done', time: '4 s' },
        { id: 'stop', title: 'Stop the stack', note: 'Waits for the containers', state: 'done', time: '2 s' },
        { id: 'migrate', title: 'Migrate the data', note: 'Nothing to migrate', state: 'skipped' },
        { id: 'start', title: 'Start the stack', note: 'The disk was full', state: 'failed', time: '9 s' },
        { id: 'check', title: 'Check it answers', note: 'Waits for the health check', state: 'pending' },
    ],
    { label: 'Update progress' },
);
host.append(list);
attachSteplists(host);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
document.getElementById('doc-steps-run').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    for (const id of ['pull', 'stop', 'migrate', 'start', 'check']) setStep(list, id, { state: 'pending', time: '' });
    for (const id of ['pull', 'stop', 'start', 'check']) {
        setStep(list, id, { state: 'running' });
        await sleep(900);
        setStep(list, id, { state: 'done', time: '1 s' });
    }
    setStep(list, 'migrate', { state: 'skipped' });
    event.currentTarget.disabled = false;
});
`,
            },
            {
                title: 'A journey: where an application stands',
                why: 'The same list laid along one path. `current` is the step it stands at now, reached steps are `done`, a closed path ends with a `failed` step; `data-kp-tone` gives a step its own colour and the time column holds the date it was reached. Under 30rem of its own width the path turns to a column.',
                markup: `
<ol class="kp-steplist kp-steplist--journey" aria-label="Where the application stands">
<li class="kp-steplist__item" data-state="done" data-kp-tone="1"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Draft</span></span><time class="kp-steplist__time">28/09</time></li>
<li class="kp-steplist__item" data-state="done" data-kp-tone="2"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Sent</span></span><time class="kp-steplist__time">02/10</time></li>
<li class="kp-steplist__item" data-state="current" data-kp-tone="3"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Interview</span></span><time class="kp-steplist__time">09/10</time></li>
<li class="kp-steplist__item" data-state="pending"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Offer</span></span><time class="kp-steplist__time"></time></li>
</ol>
`,
            },
        ],
        variants: [
            { name: 'data-state', what: '`pending`, `running`, `done`, `failed`, `skipped` or `current` (the step a journey stands at now: a ring with a dot, no spinner): the mark, the colour and the word follow it.' },
            { name: '.kp-steplist--journey', what: 'The steps side by side on one path, joined by a rule drawn in the step’s colour once reached; a column under 30rem of its own width.' },
            { name: 'data-kp-tone', what: 'A step’s own colour, `1` to `5` (`--chart-N`), or any value with the page’s own step colour set on the item: the reached mark and the rule into it wear it.' },
            { name: '.kp-steplist__time', what: 'How long the step took, as the page prints it; in a journey, the date it was reached.' },
            { name: '.kp-steplist__note', what: 'The one-line description under the title.' },
            { name: 'buildSteplist(rows, { label })', what: 'Builds the `ol` from rows `{ id, title, note, state, time }`; attach it afterwards. `data-kp-step-id` carries each id.' },
            { name: 'setStep(list, id, change)', what: 'Changes one step (`state`, `title`, `note`, `time`) and says so once in the status region; the id is `data-kp-step-id` or the step’s index.' },
            { name: 'the mark', what: 'Drawn from `data-state`: the theme’s spinner while running, and a glyph for done, failed and skipped (the glyph tokens are in the knobs). It is never the only carrier: the state word is there too.' },
            { name: 'the words', what: '`stepPending`, `stepRunning`, `stepDone`, `stepFailed`, `stepSkipped` and the announcement `stepAnnounce(title, state)` are in the dictionary, so `setStrings()` translates them.' },
        ],
        accessibility: [
            'Built in — each step reads “title, state”, the running one carries `aria-current="step"`, and a change is announced once through a hidden status region (a burst in one tick is one announcement).',
            'Built in — the list itself is not a live region, so it does not re-read every note on every change.',
            'Yours — name the list, and give a failed step a note that says what to do.',
        ],
    },
    {
        id: 'tooltip',
        title: 'Tooltip',
        group: 'Feedback',
        classes: ['kp-tooltip'],
        exports: ['Tooltip'],
        aliases: ['tooltip-owner', 'open-delay', 'close-delay', 'close-on-escape', 'hovercard'],
        intro: 'A short label on the popover surface, anchored to the thing it describes. Both channels open it on hover and on focus, with a delay at both ends, and close it on Escape: the React component, and `attachTooltips` in js/overlays.js for a `.kp-tooltip-anchor` a server wrote.',
        whenToUse:
            'For naming a control whose glyph is not obvious, in a few words. Never for anything the reader needs — a tooltip cannot be reached on a touch screen, cannot be selected, and is gone the moment the pointer moves. Instructions, errors and help text belong in the page.',
        examples: [
            {
                title: 'The surface, on a popover',
                why: 'Shown here as the browser’s own popover so it can be opened and looked at; the React component adds the hover and focus timing on top of the same two classes.',
                markup: `
<button type="button" class="kp-button" popovertarget="doc-tooltip" style="anchor-name: --doc-tooltip">What is a register?</button>
<span popover="auto" id="doc-tooltip" role="tooltip" class="kp-popover kp-tooltip" style="position-anchor: --doc-tooltip">An optional stylesheet that changes the texture of a theme without changing its colours.</span>
`,
            },
            {
                title: 'The hover card: one card for the whole page',
                why: '`attachHoverCards(root, options)` listens on the root, not on the anchors, so an anchor made later works at once. The first cell’s words are in `data-kp-hovercard`; the second has none, so `fill(anchor, card)` supplies them as the card opens (return a string, nodes or null). The third opens after 800 ms (`data-kp-open-delay`) and ignores Escape (`data-kp-close-on-escape="false"`). Rest the pointer on a cell, or Tab to it: the card stays while the pointer is on it and goes on Escape. `kp-hovercard` is fired on the anchor with `{ open, card, anchor }`.',
                markup: `
<table class="kp-table" id="doc-hovercards"><thead><tr><th scope="col">Stack</th><th scope="col">State</th></tr></thead>
<tbody>
<tr><td>media</td><td tabindex="0" data-kp-hovercard="Last backup 02:14, 3 hours ago">healthy</td></tr>
<tr><td>network</td><td tabindex="0" data-kp-hovercard data-doc-fill="network">warning</td></tr>
<tr><td>vault</td><td tabindex="0" data-kp-hovercard="Slow to answer. The card opens late and Escape does not close it." data-kp-open-delay="800" data-kp-close-on-escape="false">slow</td></tr>
</tbody></table>
<p class="kp-text-muted" id="doc-hovercard-out">No card has opened yet.</p>
`,
                script: `
import { attachHoverCards } from '@kp-soft/themes/js/hovercard';

const table = document.getElementById('doc-hovercards');
attachHoverCards(table.parentElement, {
    fill: (anchor) => (anchor.dataset.docFill ? 'Two hosts did not answer in the last ten minutes.' : null),
});
table.addEventListener('kp-hovercard', (event) => {
    document.getElementById('doc-hovercard-out').textContent = event.detail.open ? 'Open for ' + event.detail.anchor.textContent + '.' : 'Closed.';
});
`,
            },
        ],
        variants: [
            { name: '.kp-tooltip', what: 'The popover surface at tooltip size: smaller text and a maximum width, so it wraps instead of running across the page.' },
            { name: 'hover and focus', what: 'Both open it in the React channel, with a delay before and after, so a pointer crossing the control does not flash it.' },
            { name: 'interactive', what: 'A tooltip can be made to take the pointer, for one that contains a link; by default it does not, so it cannot get in the way.' },
            { name: 'Escape', what: 'Closes it, like every other layer in the package.' },
            { name: 'data-kp-hovercard', what: 'The hover card: one tooltip for a whole page, filled when it opens (`attachHoverCards`), for anchors a page rebuilds or whose words are only known when the pointer arrives. The attribute holds the words, or a `fill(anchor, card)` callback supplies them; it is hoverable, dismissible and ignores touch.' },
            { name: 'attachHoverCards options', what: '`{ selector, fill, openDelayMs, closeDelayMs, closeOnEscape, cardClass }` (300 ms and 100 ms, Escape on). Per anchor: `data-kp-open-delay`, `data-kp-close-delay` and `data-kp-close-on-escape="false"`. The attribute’s own text wins over `fill`.' },
            { name: 'hover card handle', what: '`attachHoverCards` returns the detach function with `{ card, open(anchor), hide(), refresh(), anchor() }` on it: `refresh()` fills the open card again when its data changed under the pointer. The card is `.kp-popover.kp-tooltip[data-kp-hovercard-card]` in the body, in the top layer, and its widest is a knob.' },
            { name: 'pastel', what: 'In pastel a tooltip hangs in its holder, whose ::after draws its pass by anchor positioning; it lands small on the pass and leaves as that backwards.' },
        ],
        accessibility: [
            'Built in — focus opens it as well as hover, so it is reachable from the keyboard.',
            'Built in — the described element points at the tooltip, so its text is read as part of the control rather than as a stray paragraph.',
            'Yours — never put anything essential in one. It is unreachable on touch and invisible in print.',
            'Yours — keep it to a few words; a tooltip that wraps to four lines is help text in the wrong place.',
            'Yours — do not put a control inside a tooltip that closes when the pointer leaves it.',
        ],
    },
    {
        id: 'nav-bar',
        title: 'Navigation bar',
        group: 'Navigation',
        classes: ['kp-nav', 'kp-nav-wrap', 'kp-tabbar'],
        exports: ['NavBar'],
        intro: 'The bar across the top of an application: a brand, a row of links, and room at the end for whatever the page keeps there. The current page is marked by weight and by a thicker underline, not by colour alone.',
        whenToUse:
            'For the handful of places every page of an application can reach. Not for a deep hierarchy — that is a sidebar with a tree, or a breadcrumb saying where you are. Not for actions: a bar of buttons pretending to be navigation confuses the browser’s own history.',
        examples: [
            {
                title: 'A brand and three links',
                why: 'The current page carries the current-page marking, which is what a screen reader announces, and the weight and underline are what everyone else sees. The wrapper is what the narrow rule measures: a container query styles a container’s contents, never the container itself, and the rule that changes is the bar’s own padding. NavBar renders it for you.',
                markup: `
<div class="kp-nav-wrap">
<nav class="kp-nav" aria-label="Main">
<a class="kp-nav__brand" href="#nav-bar">kp</a>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#nav-bar" aria-current="page">Overview</a></li>
<li><a class="kp-nav__link" href="#example">Applications</a></li>
<li><a class="kp-nav__link" href="#variants">Settings</a></li>
</ul>
</nav>
</div>
`,
            },
            {
                title: 'A mega menu',
                why: 'Press Equipment: a panel of grouped links opens under the bar and spans its width, in up to four columns. It is a disclosure — a button with `aria-expanded` — rather than a dropdown that opens on hover, so a touch or keyboard reader opens it on purpose; Escape closes it and puts the focus back on the button, a click outside closes it, and only one panel is open at a time. The groups are plain lists under headings, not a menu, because these are places to go. In React, a link with `groups` renders the same.',
                markup: `
<div class="kp-nav-wrap">
<nav class="kp-nav" aria-label="Main, with a mega menu">
<a class="kp-nav__brand" href="#nav-bar">kp</a>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#nav-bar">Overview</a></li>
<li>
<button type="button" class="kp-nav__link kp-nav__disclosure" data-kp-nav-disclosure>Equipment</button>
<div class="kp-nav__menu kp-nav__menu--wide">
<div class="kp-nav__group"><h3 class="kp-nav__menu-heading">Pumps</h3><ul><li><a href="#example">Main line pumps</a></li><li><a href="#example">Booster sets</a></li></ul></div>
<div class="kp-nav__group"><h3 class="kp-nav__menu-heading">Valves</h3><ul><li><a href="#example">Gate valves</a></li><li><a href="#example">Check valves</a></li></ul></div>
<div class="kp-nav__group"><h3 class="kp-nav__menu-heading">Sensors</h3><ul><li><a href="#example">Flow meters</a></li></ul></div>
</div>
</li>
</ul>
</nav>
</div>
`,
                react: `
<NavBar
    brand="kp"
    label="Main, with a mega menu"
    links={[
        { href: '#nav-bar', label: 'Overview' },
        {
            href: '#equipment',
            label: 'Equipment',
            groups: [
                { label: 'Pumps', links: [{ href: '#example', label: 'Main line pumps' }, { href: '#example', label: 'Booster sets' }] },
                { label: 'Valves', links: [{ href: '#example', label: 'Gate valves' }, { href: '#example', label: 'Check valves' }] },
                { label: 'Sensors', links: [{ href: '#example', label: 'Flow meters' }] },
            ],
        },
    ]}
    headingLevel={3}
/>
`,
            },
            {
                title: 'A bar that folds what does not fit, with a separator',
                why: '`data-kp-nav-fold` on the nav folds only the links that do not fit, from the end, behind a More menu (the menu button’s own: its keys, its placement, its theme); a link that is folded stays in its list item, out of the flow and the focus order, and its menu entry clicks the real link. `data-kp-nav-keep` on an item keeps it in the bar wherever it is. `li.kp-nav__sep` is a rule between two groups of links: it stands only between shown links, and the More menu draws it as its own separator. Drag the corner of the box to narrow the bar.',
                markup: `
<div style="inline-size: 28rem; max-inline-size: 100%; overflow: hidden; resize: horizontal; border: 1px dashed var(--border); padding: 0.25rem">
<div class="kp-nav-wrap">
<nav class="kp-nav" data-kp-nav-fold aria-label="Main, folding">
<span class="kp-nav__brand">kp</span>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#nav-bar" aria-current="page">Overview</a></li>
<li><a class="kp-nav__link" href="#example">Backups</a></li>
<li class="kp-nav__sep" aria-hidden="true"></li>
<li><a class="kp-nav__link" href="#variants">Network</a></li>
<li><a class="kp-nav__link" href="#variants">Applications</a></li>
<li data-kp-nav-keep><a class="kp-nav__link" href="#variants">Alerts</a></li>
<li class="kp-nav__sep" aria-hidden="true"></li>
<li><a class="kp-nav__link" href="#variants">Settings</a></li>
</ul>
</nav>
</div>
</div>
`,
            },
            {
                title: 'A bottom tab bar, with a count on one tab',
                why: 'On a phone the bar sits at the bottom of the window; here `kp-tabbar--static` leaves it in the flow and `kp-tabbar--always` shows it at every width, so it can be looked at. The icon, the label and the optional `.kp-badge` count are the tab’s; the More tab opens a drawer through `data-kp-dialog`. `setTabbarBadge`, `setTabbarCurrent` and `setTabbarBusy` change a tab from the page: press the buttons below.',
                markup: `
<nav class="kp-tabbar kp-tabbar--always kp-tabbar--static" id="doc-tabbar" aria-label="Areas">
<a class="kp-tabbar__tab" href="#home" data-kp-tab="home" aria-current="page"><span class="kp-tabbar__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3z" /><path d="M14 3h7v7h-7z" /><path d="M3 14h7v7H3z" /><path d="M14 14h7v7h-7z" /></svg></span><span class="kp-tabbar__label">Home</span></a>
<a class="kp-tabbar__tab" href="#inbox" data-kp-tab="inbox"><span class="kp-tabbar__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h4l2 3h4l2-3h4" /><path d="M5 5h14l1 8v6H4v-6z" /></svg></span><span class="kp-tabbar__label">Needs you</span><span class="kp-badge kp-tabbar__badge">3</span></a>
<a class="kp-tabbar__tab" href="#activity" data-kp-tab="activity"><span class="kp-tabbar__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3-7 4 14 3-7h4" /></svg></span><span class="kp-tabbar__label">Activity</span></a>
<button type="button" class="kp-tabbar__tab kp-tabbar__tab--more" data-kp-dialog="doc-tabbar-more"><span class="kp-tabbar__icon kp-tabbar__icon--more" aria-hidden="true"></span><span class="kp-tabbar__label">More</span></button>
</nav>
<dialog class="kp-drawer kp-dialog" id="doc-tabbar-more" aria-labelledby="doc-tabbar-more-title">
<header class="kp-drawer__head">
<h2 class="kp-dialog__title" id="doc-tabbar-more-title">More</h2>
<button type="button" class="kp-icon-button kp-dialog__close" data-kp-dialog-close aria-label="Close">×</button>
<p class="kp-drawer__desc">The areas you need less often.</p>
</header>
<div class="kp-drawer__body">
<div class="kp-menu kp-menu--rich" role="group" aria-label="More">
<a class="kp-menu__item" href="#backups"><span class="kp-menu__label">Backups</span><span class="kp-menu__hint">Snapshots, restores and the nightly run</span></a>
<a class="kp-menu__item" href="#system"><span class="kp-menu__label">System</span><span class="kp-menu__hint">The host, its disks and updates</span></a>
</div>
</div>
</dialog>
<div class="kp-row kp-gap-sm kp-mt-sm">
<button type="button" class="kp-button kp-button--sm" data-doc-tab="badge">Count 1534</button>
<button type="button" class="kp-button kp-button--sm" data-doc-tab="current">Current: Activity</button>
<button type="button" class="kp-button kp-button--sm" data-doc-tab="busy">Busy</button>
</div>
`,
                script: `
import { attachTabbars, setTabbarBadge, setTabbarBusy, setTabbarCurrent } from '@kp-soft/themes/js/tabbar';

const bar = document.getElementById('doc-tabbar');
attachTabbars(bar.parentElement);
const tab = (id) => bar.querySelector('[data-kp-tab="' + id + '"]');
const actions = {
    badge: () => setTabbarBadge(tab('inbox'), 1534),
    current: () => setTabbarCurrent(bar, 'activity'),
    busy: () => {
        setTabbarBusy(tab('activity'), true);
        setTimeout(() => setTabbarBusy(tab('activity'), false), 2500);
    },
};
for (const button of document.querySelectorAll('[data-doc-tab]')) {
    button.addEventListener('click', () => actions[button.dataset.docTab]());
}
`,
            },
        ],
        variants: [
            { name: 'data-kp-nav-fold', what: 'Opt-in on the nav: the links that do not fit are folded from the end behind a More menu (`attachNavFolds`; `NavBar` takes `fold`). The bar stays one row before and after, the fit is measured at the links’ natural widths so it cannot oscillate, and below the bar’s own phone breakpoint, with a toggle present, it stands down.' },
            { name: 'data-kp-nav-keep', what: 'On a list item: it stays in the bar wherever it is, and the fold takes the others.' },
            { name: 'kp-nav-fold', what: 'Fired on the nav, bubbling, when the folded set changes: `{ folded, items }`. `planFold()` is the arithmetic on its own, `foldNav()` folds one bar.' },
            { name: 'fold marks', what: 'Written by the script: `data-kp-nav-fold-ready` once the bar is fitted, `data-kp-nav-folding` while anything is folded, `data-kp-nav-folded` on each folded item, `data-kp-nav-more-current` when the current page is behind More (and `aria-current` on its button) and `data-kp-nav-more-alert` when a `.kp-badge` count is (a dot on the button, announced).' },
            { name: '--kp-nav-more-dot', what: 'The colour of the dot on the More button when a count is behind it. A list item with a dropdown or a mega menu becomes a named group in the More menu: its heading, then its links.' },
            { name: 'navMore / navMoreMenu / navMoreAlert / navMoreUnavailable', what: 'The More button’s words in the dictionary: its label, the menu’s name, the alert announcement and the entry of a link that cannot be followed.' },
            { name: '.kp-nav__sep', what: '`<li class="kp-nav__sep" aria-hidden="true">`: a rule between two groups of links, never a target. A separator stands only between two links that are shown, so none dangles before More or at the start; in the More menu the links after it start a group below the menu’s own `.kp-menu__separator` (`data-kp-nav-sep`). `planSeparators()` and `NAV_SEP` are the arithmetic. Its inset and colour are knobs.' },
            { name: '.kp-tabbar', what: 'The bottom tab bar for phone widths: a `nav` of `.kp-tabbar__tab` links (an icon and a label each, a `.kp-badge` count on the one that needs the reader) and a More tab that opens a drawer through `data-kp-dialog`. It publishes its height on the root while it is on the screen, so a toast and the back-to-top control clear it; `setTabbarBadge`, `setTabbarCurrent` and `setTabbarBusy` change a tab from the page.' },
            { name: '.kp-nav__brand', what: 'The name at the leading edge, in bold. As a link it keeps its look and takes the page’s ordinary link underline, which is what says it is one.' },
            { name: '--kp-nav-close-time', what: 'For a theme that plays a close for the phone panel or a hover dropdown (cyberpunk): its length. The module holds the panel or the item open for that long while the close plays, then lets go. Unset, the phone panel closes after the theme\u2019s fold time, or 300 ms; the dropdowns close at once.' },
            { name: '.kp-nav__links', what: 'The row itself. It wraps rather than scrolling, so a narrow window gets two rows instead of a hidden third link.' },
            { name: '.kp-nav-wrap', what: 'The box the bar measures itself against. In a narrow one the bar takes a smaller inset, and the width that decides is the wrapper’s rather than the window’s.' },
            { name: '.kp-nav-wrap--sticky', what: 'The shrinking header: the bar sticks to the top of the box that scrolls it, and once that box has scrolled further than the bar is tall (or `data-kp-nav-sticky-after` pixels, if more) js/auto.js sets `data-kp-nav-compact` and the bar lowers its block padding (the knobs table names how far), gliding only when the reader has not asked for less motion. The module hands the bar’s height to the scrolling box’s scroll padding, so anchors and focused elements land below the bar; a scroll offset the page sets itself still wins. In React it is the `sticky` prop, with `stickyAfter`.' },
            { name: '.kp-tabbar modifiers', what: 'The bar shows below 40rem of window; `kp-tabbar--wide` below 60rem, where a dashboard’s top bar has no room for its links either; `kp-tabbar--always` at every width; `kp-tabbar--static` leaves it in the flow instead of fixed to the window’s bottom edge.' },
            { name: '.kp-tabbar parts', what: '`.kp-tabbar__tab` (a link or a button), `__icon` (`__icon--more` is the More tab’s), `__label` and `__badge`, the `.kp-badge` count on the tab that needs the reader. `setTabbarBadge(tab, count)` writes every digit of the count (never `99+`), hidden at 0 or null; `setTabbarCurrent(bar, id)` moves `aria-current` to the tab with that `data-kp-tab`; `setTabbarBusy(tab, busy)` puts one tab to wait.' },
            { name: '--kp-tabbar-height', what: 'Written on the root by `js/tabbar.js` while the bar is on the screen (0px when it is not): the page keeps its last line, a toast and the back-to-top control clear of it. The bar’s own sizes (tab height, icon, padding, text size, the safe-area inset, its time and layer) are in the knobs below.' },
            { name: 'current page', what: 'Weight and a thicker underline, with the state on the link so it is announced as well as drawn.' },
            { name: '.kp-nav__search', what: 'The slot at the bar’s far end for the command palette’s trigger — a `.kp-nav__search-trigger` button with `data-kp-palette-open`, which reads as a quiet search box and prints the palette’s key. The command palette page shows it working; in React it is the `search` prop, filled with a PaletteTrigger.' },
            { name: 'data-kp-nav-menu-open', what: 'On a list item with a `.kp-nav__menu`: that dropdown is shown open, exactly where hover and focus open it. For a page that shows it open, or a script that opens it on a press; taking the attribute away closes it again.' },
            { name: 'data-kp-nav-menu-end', what: 'Written by the module on a dropdown whose item has no room for it towards the window’s end: the panel hangs from the item’s end edge instead, so it stays inside the window. Measured as it opens and when the window changes size; nothing to write by hand.' },
            { name: '.kp-nav__menu--wide', what: 'The mega menu’s panel: a `.kp-nav__menu` that spans the bar in up to four columns of `.kp-nav__group`, each a `.kp-nav__menu-heading` over a plain list. Shown while its button says it is expanded; the minimum column width and the gap are knobs.' },
            { name: 'data-kp-nav-disclosure', what: 'The button that opens a mega menu’s panel, beside it in the same item; give it `kp-nav__link kp-nav__disclosure` so it reads as one of the bar’s links with a caret that turns while open. The module writes `aria-expanded` and `aria-controls`.' },
            { name: 'pastel', what: 'In pastel a hover dropdown and the mega menu hang in their holder, whose ::after draws the pass by anchor positioning; the phone panel draws its own plate and pass. Each lands on its pass and closes as that backwards, and the module holds it open for the close (560 ms in pastel).' },
        ],
        accessibility: [
            'Built in — the current page is marked in three ways at once: weight, an underline and the attribute that says so out loud.',
            'Built in — the bar wraps at narrow widths rather than pushing the page sideways.',
            'Built in — a sticky bar hands its height to the scrolling box’s scroll padding, so a skip link, an anchor or a Tab never lands underneath it.',
            'Built in — a dropdown near the window’s end opens towards the other side rather than past the edge.',
            'Built in — a mega menu opens on a press, not on hover; Escape closes it and returns the focus to its button, and the focus leaving it or a click outside closes it too.',
            'Yours — give the nav element a name; a page with two of them is otherwise “navigation” twice.',
            'Yours — use links, and give the reader a skip link past the bar.',
            'Yours — keep the list short. A bar that wraps to three rows on a laptop is a menu.',
        ],
    },
    {
        id: 'sidenav',
        title: 'Side navigation',
        group: 'Navigation',
        classes: ['kp-sidenav'],
        exports: ['Sidenav', 'SidenavToggle', 'SidenavSlimToggle'],
        aliases: ['sidenav', 'remember'],
        intro: 'A navigation that stands beside the content instead of above it. Three modes — beside the page, over it, or pushing it aside — a slim rail that keeps the icons and drops the words, categories that fold, and either edge.',
        whenToUse:
            'For an application with more places than a bar can hold, or a hierarchy two levels deep. Not for the five links every page can reach — that is the bar at the top. Not as a drawer for content: a panel that slides in carrying a form is a dialog, and it wants a dialog’s focus handling and a dialog’s dismissal.',
        examples: [
            {
                title: 'The React channel',
                why: 'Added 2026-09-12 (`sidenav-react`). The component renders the markup and the knobs; js/sidenav.js — attached by js/auto.js — does the behaviour, exactly as it does for the framework-free channel. Every data attribute the module reads is a prop, and one left out keeps the module\u2019s own default rather than restating it. The way out of the opened state is the handle: `sidenavOf(ref.current)`. This example uses the default mode on purpose: `over` slides the panel off-canvas until something opens it, so on a static page it would render as a sliver — which is exactly what it did before someone looked.',
                markup: `
<nav class="kp-sidenav" id="nav" aria-label="Sections">
    <div class="kp-sidenav__header"><p class="kp-sidenav__title">Sections</p></div>
    <div class="kp-sidenav__scroll">
        <ul class="kp-sidenav__list">
            <li><a class="kp-sidenav__link" href="#overview" aria-current="page"><span class="kp-sidenav__label">Overview</span></a></li>
            <li><a class="kp-sidenav__link" href="#reports"><span class="kp-sidenav__label">Reports</span></a></li>
            <li><a class="kp-sidenav__link" href="#settings"><span class="kp-sidenav__label">Settings</span></a></li>
        </ul>
    </div>
</nav>
`,
                react: `
<Sidenav
    id="nav"
    label="Sections"
    title="Sections"
    items={[
        { label: 'Overview', href: '#overview', current: true },
        { label: 'Reports', href: '#reports' },
        { label: 'Settings', href: '#settings' },
    ]}
/>
`,
            },
            {
                title: 'Beside the page',
                why: 'The default mode is the one that is simply there: a column in the flow, no JavaScript needed to see it. The current page carries aria-current, which is what a screen reader announces and what every theme hangs its own mark on.',
                markup: `
<nav class="kp-sidenav" aria-label="Sections">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">Reports</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav" aria-current="page"><span class="kp-sidenav__label">Daily</span></a></li>
<li><a class="kp-sidenav__link" href="#example"><span class="kp-sidenav__label">Weekly</span><span class="kp-sidenav__badge">12</span></a></li>
</ul>
</div>
</nav>
`,
            },
            {
                title: 'A rail that collapses from its own toggle',
                why: 'Added at scope-48, with the application shell (examples/app-shell.html). data-kp-sidenav-slim allows the rail; a button with data-kp-sidenav-slim-toggle, pointed at the panel by aria-controls, collapses it to its icons and gives the words back — no script of your own. The module keeps aria-expanded on the button, and a button whose only content is an aria-hidden glyph gets its accessible name from the strings, changing with the state. The labels leave the eye and stay in the accessibility tree, so every link in the collapsed rail keeps its name. The button is not replaced, so the focus stays on it.',
                markup: `
<nav class="kp-sidenav" id="rail" aria-label="Invoices" data-kp-sidenav-slim>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">All invoices</span></a></li>
<li><a class="kp-sidenav__link" href="#example"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Overdue</span></a></li>
</ul>
</div>
<div class="kp-sidenav__footer">
<button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="rail"><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span></button>
</div>
</nav>
`,
                react: `
<Sidenav
    id="rail"
    label="Invoices"
    slim
    items={[
        { label: 'All invoices', href: '#all', icon: '▤', current: true },
        { label: 'Overdue', href: '#overdue', icon: '!' },
    ]}
    footer={
        <SidenavSlimToggle controls="rail" className="kp-sidenav__link">
            <span className="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span>
            <span className="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span>
        </SidenavSlimToggle>
    }
/>
`,
            },
            {
                title: 'A navigation that remembers what the reader folded',
                why: 'Kenny, 2026-09-16: a group he closed and then clicked a link in must still be closed on the page the link led to. data-kp-remember on the panel turns that on, and the name is the element\u2019s — two navigations on one page with different names keep separate state, and two with the SAME name are a fault the module reports rather than a memory they share. A group with a data-kp-remember of its own keeps its state under that name; without one it is known by the words in its toggle. The same attribute is read by the accordion, the tree, the split pane and the data table; docs/USER_GUIDE.md has the whole table.',
                markup: `
<nav class="kp-sidenav" id="kept-nav" aria-label="Sections" data-kp-remember="main-nav">
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li class="kp-sidenav__category" data-kp-sidenav-expanded data-kp-remember="components">
<button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__label">Components</span></button>
<div class="kp-sidenav__submenu">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav"><span class="kp-sidenav__label">Side navigation</span></a></li>
</ul>
</div>
</li>
</ul>
</div>
</nav>
`,
            },
            {
                title: 'Over the page, with a toggler',
                why: 'data-kp-sidenav-mode="over" puts the panel above the content with a backdrop, a focus trap and Escape. The toggler names the panel it drives, and keeps a place above both so it never disappears under what it opened.',
                markup: `
<button type="button" class="kp-sidenav__toggle" data-kp-sidenav-toggle aria-controls="app-nav">Menu</button>
<nav class="kp-sidenav" id="app-nav" data-kp-sidenav-mode="over" aria-label="Sections">
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav"><span class="kp-sidenav__label">Daily</span></a></li>
</ul>
</div>
</nav>
`,
            },
            {
                title: 'From the window edge: a launcher, and the page pushed aside',
                why: 'Added 2026-10-13 (research/sidenav-edge). The launcher is a box fixed at the window\'s start corner; the toggler inside it is empty, so the module draws the three bars (.kp-sidenav__bars) and names it from the strings. data-kp-sidenav-mode="push" with data-kp-sidenav-content moves the named element by the panel\'s width, on the panel\'s own slide timing, so closing is the opening played backwards. data-kp-sidenav-launcher-room keeps the page header clear of the launcher, and the shortcut is Control+B (⌘B on a Mac; the togglers get aria-keyshortcuts). data-kp-sidenav-over-below turns the panel into an over panel in a window narrower than 40rem: see it on a narrow screen. The example runs in a window of its own, because a fixed launcher would otherwise take over this page.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-sidenav__launcher">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="push-nav"></button>
</div>
<nav class="kp-sidenav" id="push-nav" aria-label="Sections" data-kp-sidenav-mode="push" data-kp-sidenav-content="#push-main" data-kp-sidenav-backdrop="false" data-kp-sidenav-over-below data-kp-sidenav-shortcut="Control+b">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#push-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#push-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#push-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="push-main">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">The navigation slides in from the window edge and pushes this page aside by its own width; closing slides it back and the page follows. Control+B (⌘B on a Mac) does the same.</p>
</header>
</main>
`,
            },
            {
                title: 'A reserved gutter: the panel covers nothing',
                why: 'data-kp-sidenav-reserve on a push panel keeps the content\'s margin as wide as the panel whether the panel is open or not, so opening moves nothing and hides nothing. data-kp-sidenav-open="true" starts it open. While data-kp-sidenav-over-below has made the panel an over panel in a narrow window the reserve gives way, since there is no room to reserve.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-sidenav__launcher">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="gutter-nav"></button>
</div>
<nav class="kp-sidenav" id="gutter-nav" aria-label="Sections" data-kp-sidenav-mode="push" data-kp-sidenav-reserve data-kp-sidenav-content="#gutter-main" data-kp-sidenav-backdrop="false" data-kp-sidenav-over-below data-kp-sidenav-open="true" data-kp-sidenav-shortcut="Control+b">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#gutter-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#gutter-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#gutter-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="gutter-main">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">This page always keeps a margin as wide as the navigation, so the navigation opens into that space and covers nothing. In a reserved gutter the launcher stands in the gutter.</p>
</header>
</main>
`,
            },
            {
                title: 'Over the page, from the window edge, without a backdrop',
                why: 'data-kp-sidenav-mode="over" with data-kp-sidenav-backdrop="false" slides the panel over the content and leaves the page visible and in place. data-kp-sidenav-initial-focus is a selector inside the panel for where the focus lands on opening, used in every mode. A closed over or push panel is inert (data-kp-sidenav-inert, on by default), so it is out of the tab order while it is away.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-sidenav__launcher">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="over-nav"></button>
</div>
<div class="kp-sidenav__tab">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="over-nav"></button>
</div>
<nav class="kp-sidenav" id="over-nav" aria-label="Sections" data-kp-sidenav-mode="over" data-kp-sidenav-backdrop="false" data-kp-sidenav-initial-focus="[aria-current='page']" data-kp-sidenav-shortcut="Control+b">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#over-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#over-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#over-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="over-main">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">The navigation slides over this page and moves nothing. There is no backdrop here, so the page stays in view; the focus lands on the current page when the panel opens and returns to the launcher when it has closed.</p>
</header>
</main>
`,
            },
            {
                title: 'A push panel on the end edge',
                why: 'data-kp-sidenav-side="end" puts the panel on the other edge, logically (the left in a right-to-left page). With data-kp-sidenav-content it is the content\'s end margin that makes room, so the page is pushed toward the start. The edge tab rides on the panel\'s far edge and is the only toggler here.',
                frame: { height: '22rem' },
                markup: `
<div class="kp-sidenav__tab">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="end-nav"></button>
</div>
<nav class="kp-sidenav" id="end-nav" aria-label="Sections" data-kp-sidenav-mode="push" data-kp-sidenav-side="end" data-kp-sidenav-content="#end-main" data-kp-sidenav-backdrop="false">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#end-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#end-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#end-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="end-main">
<header class="kp-page-header">
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">A push panel on the end edge moves the content away from the end, not the start: the page keeps its start and gives up its end margin to the panel.</p>
</header>
</main>
`,
            },
            {
                title: 'A collapsed rail: tips, flyouts and a width that collapses it',
                why: 'In the collapsed rail each item shows its label as the package\'s tooltip, on hover and on focus (data-kp-sidenav-rail-tips, on by default), and a group opens beside the rail as a floating panel with the theme\'s popover effect (data-kp-sidenav-flyout, on by default): after the pointer rests, on a press, or from the keyboard (Enter or the arrow away from the edge goes in, Escape or the arrow back folds it). The module writes data-kp-sidenav-flown on the group while it floats. data-kp-sidenav-slim-below="60rem" collapses the rail in a box that wide or narrower, and wider again it is what the reader left it.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-shell">
<div class="kp-shell__body">
<nav class="kp-sidenav" id="rail-nav" aria-label="Sections" data-kp-sidenav-slim data-kp-sidenav-slim-collapsed data-kp-sidenav-slim-below="60rem">
<div class="kp-sidenav__header"><p class="kp-sidenav__title" data-kp-sidenav-slim-hide>North site</p><p class="kp-sidenav__title" data-kp-sidenav-slim-show aria-hidden="true">N</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#rail-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span></a></li>
<li class="kp-sidenav__category">
<button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__icon" aria-hidden="true">≋</span><span class="kp-sidenav__label">Readings</span></button>
<div class="kp-sidenav__submenu">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#rail-main"><span class="kp-sidenav__label">Pressure</span></a></li>
<li><a class="kp-sidenav__link" href="#rail-main"><span class="kp-sidenav__label">Flow rate</span></a></li>
</ul>
</div>
</li>
</ul>
</div>
<div class="kp-sidenav__footer">
<button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="rail-nav"><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span></button>
</div>
</nav>
<main class="kp-flex-1" id="rail-main">
<header class="kp-page-header">
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">Point at an icon, or tab to it: its name shows beside the rail. Point at Readings and the group opens beside the rail. The button at the foot widens the rail; in a window 60rem wide or narrower it collapses by itself.</p>
</header>
</main>
</div>
</div>
`,
            },
            {
                title: 'A rail that widens under a resting pointer',
                why: 'data-kp-sidenav-expand-on-hover gives the words back while the pointer is over the rail; data-kp-sidenav-hover-delay is how long it must rest first, in milliseconds (default 150), so a pointer crossing the rail does not flap it. The rail also widens while the focus is inside it. The module writes data-kp-sidenav-peek on the panel: open while it is wide, then leaving while it narrows.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-shell">
<div class="kp-shell__body">
<nav class="kp-sidenav" id="peek-nav" aria-label="Sections" data-kp-sidenav-slim data-kp-sidenav-slim-collapsed data-kp-sidenav-expand-on-hover data-kp-sidenav-hover-delay="150">
<div class="kp-sidenav__header"><p class="kp-sidenav__title" data-kp-sidenav-slim-hide>North site</p><p class="kp-sidenav__title" data-kp-sidenav-slim-show aria-hidden="true">N</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#peek-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span></a></li>
<li class="kp-sidenav__category">
<button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__icon" aria-hidden="true">≋</span><span class="kp-sidenav__label">Readings</span></button>
<div class="kp-sidenav__submenu">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#peek-main"><span class="kp-sidenav__label">Pressure</span></a></li>
<li><a class="kp-sidenav__link" href="#peek-main"><span class="kp-sidenav__label">Flow rate</span></a></li>
</ul>
</div>
</li>
</ul>
</div>
<div class="kp-sidenav__footer">
<button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="peek-nav"><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span></button>
</div>
</nav>
<main class="kp-flex-1" id="peek-main">
<header class="kp-page-header">
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">The rail widens when the pointer rests on it for 150 ms, or while the focus is inside it, and narrows when both have gone. Its words stay while it narrows, so the narrowing is the widening backwards.</p>
</header>
</main>
</div>
</div>
`,
            },
            ...SIDENAV_MINOR_EXAMPLES,
        ],
        variants: [
            { name: 'data-kp-sidenav-mode', what: 'side (the default, in the flow), over (above the content, with a backdrop) or push (fixed, and the content named by data-kp-sidenav-content moves over).' },
            { name: 'data-kp-sidenav-content', what: 'On a push or over panel: a selector for the page element the panel offsets. A push moves it by the panel\u2019s width (its start margin, or its end margin for a panel on the end edge); the module writes data-kp-sidenav-shift on it.' },
            { name: 'data-kp-sidenav-over-below', what: 'A length, or empty for 40rem: in a box narrower than that a push panel becomes an over panel, and the reserve gives way. A launcher is never hidden by it; any other toggler (an edge tab included) is shown only while the panel is narrow, so a panel with over-below takes a launcher, not a tab. data-kp-sidenav-narrow is written while it has.' },
            { name: 'data-kp-sidenav-reserve', what: 'On a push or over panel with data-kp-sidenav-content: the content keeps the panel\u2019s width whether the panel is open or not, a gutter the panel opens into, so it covers nothing. Off by default. Not while data-kp-sidenav-over-below has made the panel an over panel on a narrow screen.' },
            { name: '.kp-sidenav__launcher', what: 'A box fixed at the window\u2019s start corner holding the panel\u2019s toggler (a .kp-icon-button with data-kp-sidenav-toggle and aria-controls): the same place at every width and in every state, above the panel. An empty toggler gets the package\u2019s three bars (.kp-sidenav__bars) and its accessible name from the strings. The module marks the panel data-kp-sidenav-launched, which starts its header beside the launcher (or its first row below it), and marks the box data-kp-sidenav-lit from the opening\u2019s first frame to the closing\u2019s last, the accent plate.' },
            { name: '.kp-sidenav__bars', what: 'The three bars drawn in an empty toggler inside the launcher; a toggler with words or an icon of its own gets none.' },
            { name: 'data-kp-sidenav-launched', what: 'Written on the panel while a launcher drives it: the header starts beside the launcher. Read it, do not set it.' },
            { name: 'data-kp-sidenav-lit', what: 'Written on the launcher box from the opening\u2019s first frame to the closing\u2019s last: the accent plate. Read it, do not set it.' },
            { name: 'data-kp-sidenav-launcher-room', what: 'On a page element in the launcher\u2019s corner (the page header): keeps the launcher\u2019s width free at its start, except in a reserved gutter, where the launcher stands in the gutter.' },
            { name: 'data-kp-sidenav-opener', what: 'On an over or push panel, which opener the page shows: launcher (the fixed .kp-sidenav__launcher), tab (the .kp-sidenav__tab on the panel\u2019s edge) or both. Absent or any other value is tab, the default; a page with no tab for the panel keeps its launcher, so a panel is never left without an opener. The box the choice turns off is not drawn, is out of the tab order and the accessibility tree and is absent from the first frame, and the header\u2019s room for the launcher is given back. A side panel and the collapsed rail ignore it. React: opener.' },
            { name: 'data-kp-sidenav-opener-off / -on', what: 'Written by the module on an opener box (launcher or tab) the choice turns off, or keeps. Read them, do not set them.' },
            { name: '.kp-sidenav__tab', what: 'The edge tab: a box holding a toggler (a .kp-icon-button with data-kp-sidenav-toggle and aria-controls) that rides on the far edge of a panel that slides (over, push), halfway down, and sits at the window\u2019s edge while the panel is away; it moves on the panel\u2019s own timing and works beside the launcher. An empty toggler gets a grip (.kp-sidenav__grip), which has no state to change.' },
            { name: 'data-kp-sidenav-inert', what: 'A closed panel that slides away is inert, out of the tab order and the accessibility tree, from the closing\u2019s last frame to the opening\u2019s first. On by default; false leaves a closed panel reachable.' },
            { name: 'data-kp-sidenav-rail-tips', what: 'In the collapsed rail each item shows its label as the package\u2019s tooltip on hover and on focus, beside the rail and inside the window; it leaves as it came. On by default; false turns it off.' },
            { name: 'data-kp-sidenav-slim-below', what: 'On a rail (data-kp-sidenav-slim): the width of the panel\u2019s box at and below which the rail collapses to its icons, a length, or 40rem when empty. Wider again it is what the reader left it; the step\u2019s collapse is never remembered as the reader\u2019s. data-kp-sidenav-over-below, which takes a length too, is its sibling for the variant.' },
            { name: 'data-kp-sidenav-flyout', what: 'In the collapsed rail a group opens beside the rail as a floating panel, in the top layer, with the theme\u2019s popover opening and its close as that opening backwards: after the pointer rests 150 ms, on a press, or from the keyboard (Enter or the arrow away from the edge goes into it; Escape or the arrow back folds it and returns to its heading when the close is over). Placed beside the rail and turned to stay in the window. On by default; false keeps groups folding in place. data-kp-sidenav-flown is written on the group while it floats.' },
            { name: 'data-kp-sidenav-flown', what: 'Written on a .kp-sidenav__category while its group floats beside the collapsed rail. Read it, do not set it.' },
            { name: 'data-kp-sidenav-shortcut', what: 'A key chord that opens and closes the panel from anywhere but a text field, such as Control+b. Control (or Mod) is the platform\u2019s command key: Meta (\u2318) on a Mac. The togglers get aria-keyshortcuts. Off by default.' },
            { name: 'data-kp-sidenav-initial-focus', what: 'A selector, inside the panel, for where the focus lands when the panel opens. Without it an over panel focuses its first stop and the others leave the focus where it is; named, it is used in every mode, and the focus goes back to the opener when the panel has closed.' },
            { name: 'data-kp-sidenav-hover-delay', what: 'On a rail with data-kp-sidenav-expand-on-hover: how long the pointer rests, in milliseconds, before the rail widens (default 150). The rail also widens while the focus is inside it. The module writes data-kp-sidenav-peek (open, then leaving while it narrows); a page without the module widens on plain hover.' },
            { name: 'data-kp-sidenav-peek', what: 'Written on a rail with data-kp-sidenav-expand-on-hover: open while the rail is wide for a resting pointer or the focus, then leaving while it narrows with its words still showing. Read it, do not set it.' },
            { name: 'data-kp-sidenav-shift', what: 'Written by the module on the content a panel offsets: open, closed, or reserved for a gutter. A push moves on the panel\u2019s own slide timing, which the module copies onto the content for each change, so the content travels with the theme\u2019s slide and comes back on its reverse; a register that draws the move itself wins.' },
            { name: 'data-kp-sidenav-position', what: 'fixed or absolute. Absolute puts the panel inside a positioned box rather than against the window, which is what a page with two of them needs.' },
            { name: 'data-kp-sidenav-side', what: 'end puts the panel on the other edge, logically: in a right-to-left page that is the left, and it still slides out of the side it came from.' },
            { name: 'data-kp-sidenav-slim', what: 'Allows the rail. With data-kp-sidenav-slim-collapsed it starts collapsed; data-kp-sidenav-expand-on-hover gives the words back while the pointer is over it.' },
            { name: 'data-kp-sidenav-slim-toggle', what: 'On a button, collapses the rail to its icons and expands it again. aria-controls names the panel; without it the button drives every rail on the page, the way data-kp-sidenav-toggle does. The module keeps aria-expanded on it, and names a button that has no words of its own.' },
            { name: 'data-kp-sidenav-slim-hide', what: 'On an element inside, hides it in the rail; data-kp-sidenav-slim-show is its other half, so a wordmark can become a monogram instead of only disappearing.' },
            { name: 'data-kp-sidenav-accordion', what: 'One category open at a time. Without it they are independent.' },
            { name: 'data-kp-sidenav-backdrop', what: 'false takes the backdrop away in over mode; data-kp-sidenav-backdrop-class puts your own class on it.' },
            { name: 'data-kp-sidenav-close-on-esc', what: 'false keeps Escape from closing it. data-kp-sidenav-focus-trap="false" lets the focus leave; data-kp-sidenav-lock-scroll holds the page still while it is open.' },
            { name: 'data-kp-remember', what: 'A name. Name the panel and its folded groups, its open state and its rail survive a reload; name a .kp-sidenav__category as well and that group keeps its state under its own name. The same attribute is what the accordion, the tree, the split pane and the data table remember by — one mechanism, js/remember.js, and the key it composes is kp-remember:<component>:<name>:<slot>. Leave it off and this package writes nothing into your storage.' },
            { name: 'data-kp-sidenav-remember', what: 'The older spelling of data-kp-remember, still read. New markup uses data-kp-remember.' },
            { name: 'kp-remember-clash', what: 'On the element refused a memory because another element of the same component already answers to that name: `{ name, component, other }`. It keeps its markup default and writes nothing; the first one to attach owns the key.' },
            { name: '--kp-sidenav-inset-block', what: 'Where a covering panel starts and ends, one value or two. A page that keeps its own bar says `3rem 0` and the panel begins under it instead of sliding beneath it.' },
            { name: 'never sideways', what: 'The panel clips its own horizontal overflow and a long label ends in an ellipsis, so a count or a badge at the end of a row is never pushed out of reach. A navigation you have to scroll sideways is one you cannot read.' },
            { name: '.kp-sidenav__scroll', what: 'The part that scrolls. The header and the footer do not, so a long navigation in a short window keeps its title and its account row in view.' },
            { name: '.kp-sidenav__category', what: 'A heading that folds, with .kp-sidenav__category-toggle and .kp-sidenav__submenu inside it. The open height is a grid track, so it animates without anything measuring it.' },
            ...SIDENAV_MINOR_VARIANTS,
            { name: 'pastel', what: 'In pastel an over or push panel draws its own plate and pass and lands on it; a panel on the end edge swings from its top-end corner. Widths and groups move on the landing held at its value, so a size never passes it, and the panel closes as it opened, backwards. The launcher and the rows are pastel’s buttons.' },
        ],
        accessibility: [
            'Built in — over mode traps the focus while it covers the page, moves the focus in on open, and gives it back to the toggler on close.',
            'Built in — the focus goes back to the opener when the panel has closed, not at the start of the close.',
            'Built in — a shut over or push panel is inert, out of the tab order and the accessibility tree; a shortcut puts aria-keyshortcuts on the togglers, and an empty launcher toggler gets an accessible name.',
            'Built in — the current page carries aria-current, so it is announced and not only drawn.',
            'Built in — the toggler says whether it is expanded and which panel it controls.',
            'Built in — a collapsed rail keeps every label in the accessibility tree, and the slim toggle keeps the focus while the rail changes.',
            'Yours — give the nav element a name; a page with a bar and a side navigation has two of them.',
            'Yours — put a label in every link. A rail of bare icons reads as a column of nothing.',
        ],
    },
    {
        id: 'to-top',
        title: 'Back to top',
        group: 'Navigation',
        classes: ['kp-to-top'],
        exports: [],
        intro: 'The control that appears once the reader is a way down the page and takes them back — the view and the focus both, which is the half usually left out.',
        whenToUse:
            'On a page long enough that getting back is work: an article, a log, a table of a few hundred rows. Not on a page that fits on a screen, where it is a button that does nothing. Not as a substitute for a navigation — going up is not the same as going somewhere.',
        examples: [
            {
                title: 'A control that knows when it is needed',
                why: 'It is invisible until the reader has scrolled past the threshold, and `visibility: hidden` keeps it out of the tab order while it is. Pressing it scrolls to the top and moves the focus to the top of the document, so the next Tab starts where the eye is.',
                markup: `
<button type="button" class="kp-button kp-to-top" data-kp-to-top data-kp-to-top-after="400"></button>
`,
            },
            {
                title: 'In a box that scrolls on its own',
                why: 'Added 2026-10-13. A dashboard\u2019s main column or a dialog\u2019s stage scrolls instead of the window. The control looks for the nearest scrolling box it sits in, at every use: it appears when that box is past the threshold, and pressing it scrolls that box, not the window. Scroll the text in the window below. It runs in a window of its own because the control is fixed to the window\u2019s corner.',
                frame: { height: '16rem' },
                markup: `
<main id="stage" style="block-size: 100dvh; overflow-y: auto">
<h1>Readings</h1>
<p>Line 2 reports every fifteen minutes. The pressure held at 3.2 bar until 02:10.</p>
<p>At 02:40 it had dropped to 1.1 bar, and pump house 3 was switched to the reserve pump at 02:52.</p>
<p>The day shift checks the seal first, then the valve V-12 that was slow to close.</p>
<p>Nothing else was reported overnight. The backup ran at 03:00 and finished at 03:14.</p>
<p>Flow averaged 412 m\u00b3/h over the last quarter of an hour.</p>
<p>Maintenance has two lock-outs open and one spare part on order.</p>
<p>The rota for the coming week is on the last page.</p>
<button type="button" class="kp-button kp-to-top" data-kp-to-top data-kp-to-top-after="120"></button>
</main>
`,
            },
        ],
        variants: [
            { name: 'with a tab bar', what: 'The control, like the toast stack, rises by the bottom tab bar’s own height while the bar is on the screen, so it never stands behind it on a phone.' },
            { name: 'data-kp-to-top-after', what: 'How far down it appears, in pixels. Default 400.' },
            { name: 'the box it scrolls', what: 'The control scrolls the nearest scrolling box it sits in (a dashboard\u2019s main column, a dialog\u2019s stage), and measures its threshold against that box; with no such box it is the window, as before.' },
            { name: 'data-kp-to-top-target', what: 'A selector for where the focus should land instead of the top of the document. The focus moves without scrolling either way, so naming a landmark cannot undo the journey.' },
            { name: 'data-kp-to-top-shown', what: 'Written by the module while the control is on the screen. Read it, do not set it.' },
            { name: 'kp-to-top', what: 'The event, on the control, whenever it appears or goes away: `{ shown }`.' },
            { name: '--kp-to-top-offset', what: 'How far it sits from the corner, both ways at once. Default 1.5rem.' },
            { name: '--kp-glyph-to-top', what: 'The arrow an empty control draws. The module puts an empty `.kp-to-top__glyph` in a button that has nothing of its own and takes it out again on detach; a button with its own words or icon gets none. Default ↑.' },
        ],
        accessibility: [
            'Built in — the focus goes back with the view, and it moves without scrolling, so the control cannot undo its own journey.',
            'Built in — while it is not on the screen it is not in the tab order either.',
            'Built in — the scroll follows the page’s own scroll-behaviour, so a reader who asked for less motion gets none.',
            'Yours — give it a name. A button with only an arrow in it is announced as “button”.',
        ],
    },
    {
        id: 'size-motion',
        title: 'Closing and resizing',
        group: 'Theming',
        classes: [],
        aliases: ['size-motion', 'resizing', 'arriving', 'leaving', 'arrive', 'folding', 'gliding', 'reversing', 'settling', 'closing', 'ghost'],
        exports: [],
        intro: 'A dialog leaves the way it came, and a box that changes size eases to its new height, growing and shrinking alike. Nothing here has a speed of its own: every duration and curve is read from the theme’s dialog entrance.',
        whenToUse:
            'Nothing to do for the components: every dialog, accordion, tab set, data table, toast stack, upload list, combobox list, tree, wizard and field gets it from `js/motion.js`, which `js/auto.js` loads wherever one of them is. Mark any other box whose content changes after it is drawn with `data-kp-size-motion`: a card that fills after loading, a panel that shows its errors. Not on a box that scrolls its own content, which does not change size.',
        examples: [
            {
                title: 'A card that eases to its new height',
                why: 'The card’s children are watched, not the card: when one grows, shrinks, arrives or leaves, the card glides from its old height to the new one in four fifths of the theme’s dialog entrance, capped at `--kp-size-max`. A reader who asked for reduced motion sees it take its size at once.',
                markup: `
<div class="kp-card" data-kp-size-motion>
  <h3>Line 2 readings</h3>
  <ul id="readings"></ul>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-size-motion', what: 'Ease this box to its new height whenever its content changes size.' },
            { name: '--kp-close-max', what: 'The longest a dialog may take to leave. It leaves in two thirds of its entrance, never longer than this. Default 600ms.' },
            { name: '--kp-size-max', what: 'The longest a box may take to change size. It takes four fifths of the dialog entrance, never longer than this. Default 480ms.' },
            { name: '--kp-size-step', what: 'For a theme that counts its time in steps: the length of one step (nostromo 80ms, terminal 136ms). A stepped resize, fold or unfold then takes that long per step, and a fold waits a whole number of steps. Unset, the steps share the size time.' },
            { name: 'data-kp-resizing', what: 'Written on a box while it glides to a new height, `grow` or `shrink`. A register draws its own character on it. Read it, do not set it.' },
            { name: 'data-kp-reversing', what: '`reset` then `play` on an element while its CSS entrance is played backwards to hide it (a tooltip, the tour card); the stylesheet restarts the entrance in reverse, and the mark goes when it has played. Read it, do not set it.' },
            { name: 'data-kp-closing', what: 'Written on a menu or a popover while it plays its close, its opening backwards (js/motion.js playClose). A register may draw a close of its own on it, or run its transitions to the closed state. Read it, do not set it.' },
            { name: 'data-kp-ghost', what: 'On the stand-in copy of a popover the browser just hid: it takes the popover\u2019s place in the top layer for as long as the close plays, then goes. Read it, do not set it.' },
            { name: 'data-kp-gliding', what: '`column` on a box laid out as a column of flex items while it glides: its items keep their own size and the box clips them, rather than squeezing them. Read it, do not set it.' },
            { name: 'data-kp-arriving', what: 'Written for one arrival on what arrives in a box (a row, a shown panel or message). A register may give it its own arrival; without one it plays the theme\u2019s toast entrance.' },
            { name: 'data-kp-leaving', what: 'Written on an element while `leave(el)` plays its arrival backwards and folds it shut, before it is removed. Read it, do not set it.' },
            { name: 'data-kp-folding', what: 'Written on an accordion item (`<details>`) while it folds shut; `open` goes only when the fold ends. Whatever counts only what is shown (a tile set) treats it as shut from the fold’s first frame. Read it, do not set it.' },
            { name: 'data-kp-tiles-easing', what: 'Written on the grids of a tile set while their tiles ease to the set’s new height: the rows follow the tiles, and each tile clips what it has not yet grown to show. Read it, do not set it.' },
            { name: 'data-kp-arrive', what: '`none` on a box whose rows a live view redraws: nothing in it plays an arrival, so a refresh does not replay every row.' },
            { name: 'data-kp-settling', what: 'On a root while its first render is drawn: nothing under it arrives and no box glides, it takes its size at once. js/auto.js writes it on the root of every `attachAll()` until its modules have attached and two frames are painted; set it yourself on a part a framework renders in several passes, and take it off when that part is drawn.' },
            { name: '--kp-size-ease', what: 'A theme\u2019s own curve for its size changes, held from overshooting. Default: the dialog entrance\u2019s curve.' },
            { name: '--kp-size-steps', what: '`line` moves a size one line of text at a time, growing and shrinking alike (terminal).' },
            { name: 'a close is its open, backwards', what: 'In every theme a part that closes (menu, popover, date picker, combobox, tour card and dim, alarm, side navigation, calendar and table busy layers) plays the theme\u2019s own opening in reverse, over the same time on the mirrored curve. The rows below are the knobs a theme sets for the parts that fold or leave; a theme that sets none keeps the defaults named.' },
            { name: '--kp-leave-state', what: '`leave` on a theme lets a part a script is about to remove or hide (a state\u2019s layer, an empty state, a file row, a tree\u2019s children) leave first, as `leave(el)` plays it. Unset, such a part is taken out at once.' },
            { name: '--kp-arrive-unseen', what: '`skip` lets what takes no box (display none) arrive as nothing, so its arrival does not hold back the visible parts added with it.' },
            { name: '--kp-leave-fold-grow', what: 'How long a leave\u2019s fold of space takes, as a multiple of the longer of the exit and the size glide. Default 1.25.' },
            { name: '--kp-leave-fold-start', what: 'Where the fold starts, as a share of the exit. Default one third; 0 starts it with the leave, so the space closes as long as, and with, the part.' },
            { name: '--kp-leave-fold-ease', what: 'The curve the fold runs on. Default: the theme\u2019s entrance curve; a theme that folds in whole ticks names a steps() curve, and the box then leaves at the size the fold ended on.' },
            { name: '--kp-swap-fold-ease', what: 'The fold curve for the panel that leaves while another arrives (a tab swap), so a stepped theme can offset the two by one tick and the box does not move.' },
            { name: '--kp-accordion-size', what: '`own` gives the parts that otherwise keep the entrance\u2019s curve alone (the accordion, a tree branch) the theme\u2019s own size character as well.' },
            { name: '--kp-motion-scale', what: 'On the root: plays every close and every resize slower (above 1) or faster (below 1) at once. Default 1.' },
            { name: 'pastel', what: 'Pastel caps a resize at one landing (560 ms), staggers a leave by 0.1071 of it, and folds the space of a card, a key figure or a tile from 0.6429 of its leave, after the tack is out; the side navigation’s width moves on the landing held at its value.' },
        ],
        accessibility: [
            'Built in — a reader who asked for reduced motion gets none: the dialog closes and the box takes its size at once.',
            'Built in — the dialog stays open, and modal, until its leaving motion ends; its `close` event comes then, with its return value.',
            'Yours — a box that grows under the reader’s pointer moves what is below it; keep what people click above content that arrives.',
        ],
    },
    {
        // Kenny's picks on research/update-motion, 2026-10-05. The task named
        // a group 'Motion'; GROUPS has none, so it stands beside size-motion.
        id: 'update',
        title: 'Information that updates in place',
        group: 'Theming',
        classes: [],
        aliases: ['updating'],
        exports: [],
        intro: 'A value that changes on a live page (a key figure, a table cell, a state word, a chart’s last point) shows it changed, the theme’s way: formal lands a stamp’s frame round it, cyberpunk glitches it and lets it settle, titanium runs the anodised colours across it. The new value is there from the first frame; nothing beside it moves.',
        whenToUse:
            'When a page writes a new value into something already on the screen and the reader should notice: call `update(el, next)` from `js/update.js` instead of setting the text. Not on first paint and not on a value that ticks every second (a clock, a countdown): only a change is an update. Every other theme has no update motion yet, so there the value simply changes.',
        examples: [
            {
                title: 'A key figure that changes',
                why: 'update() writes the value, marks the element for as long as the theme’s update plays (once, in max(resize, close) × 1.25 of the theme’s motion) and takes the mark off. With reduced motion asked for, the value changes and nothing moves (cyberpunk shows its two copies still for a moment). Every update called in the same task is marked in one batch: one style pass for a whole dashboard.',
                markup: `
<span class="kp-kpi__value"><span id="pressure">3.26</span><small>bar</small></span>
`,
            },
        ],
        variants: [
            { name: 'data-kp-updating', what: 'Written on the element while its update plays, with the register’s idea (`stamp`, `stutter`, `anodise`, `wobble`); on a spark it is the svg’s parent. Read it, do not set it.' },
            { name: '--kp-update', what: 'In a register: the idea it plays on an update. Formal `stamp`, cyberpunk `stutter`, titanium `anodise`, pastel `wobble` (the value rocks on its pin and settles, 800 ms); most registers declare an idea of their own. Read on the element itself, so `none` on a spark’s svg lets the chart take its new point at once (cyberpunk). A register that declares it outside `prefers-reduced-motion: no-preference` plays a still version under reduced motion (cyberpunk).' },
        ],
        accessibility: [
            'Built in — the new value is in the page at the first frame and readable throughout; no idea hides, scrambles or resizes it.',
            'Built in — a reader who asked for reduced motion gets the value without the motion (cyberpunk: its copies stand still beside the value for 1.2 s).',
            'Yours — a change a screen reader must hear goes in a live region; the motion is for the eye only.',
        ],
    },
    {
        id: 'media',
        title: 'Media',
        group: 'Content',
        classes: ['kp-media', 'kp-media-figure'],
        exports: [],
        intro: 'A frame for a picture or a video that has its final shape before the picture arrives, so the text below it does not jump when the bytes land.',
        whenToUse:
            'Wherever a page shows an image whose size it does not control — a hero, a card’s thumbnail, an avatar. Not for a decorative background, which is a background. Not for an icon, which has one size and needs no frame.',
        examples: [
            {
                title: 'A hero that holds its space',
                why: 'The ratio is on the frame and the fit is on the image, so the page is the right shape at the first paint and the picture fills that shape rather than stretching to it. The caption over the picture has a darkening ground under it, because the picture belongs to you and can be any brightness.',
                markup: `
<figure class="kp-media-figure">
<div class="kp-media kp-media--wide">
<img src="/hero.jpg" alt="" />
<p class="kp-media__overlay">Where this was taken</p>
</div>
<figcaption>And what it shows</figcaption>
</figure>
`,
            },
        ],
        variants: [
            { name: '.kp-media--wide', what: '21/9, for a hero that spans the page.' },
            { name: '.kp-media--square', what: '1/1, for a grid of thumbnails.' },
            { name: '.kp-media--portrait', what: '3/4, for a person.' },
            { name: '--kp-media-ratio', what: 'Any other shape. Default 16/9.' },
            { name: '--kp-media-fit', what: 'cover by default — the picture fills the frame and is cropped. `contain` fits it whole, with the frame’s ground showing around it.' },
            { name: '--kp-media-position', what: 'Which part survives the crop. Default the middle; `50% 20%` keeps heads in the frame.' },
            { name: '.kp-media__overlay', what: 'Text on the picture, with a gradient under it. Its ink and its ground are knobs for a consumer who knows their own picture.' },
        ],
        accessibility: [
            'Yours — every image needs alt text, and a decorative one needs an empty alt rather than none.',
            'Yours — a caption that repeats the alt text is read twice. Say different things, or leave one out.',
            'Built in — the frame keeps its shape before and after loading, so nothing the reader is looking at moves under them.',
        ],
    },
    {
        id: 'breadcrumb',
        title: 'Breadcrumb',
        group: 'Navigation',
        classes: ['kp-breadcrumb'],
        exports: ['Breadcrumb'],
        intro: 'The trail from the top of the hierarchy to where the reader is now, with a separator drawn by the stylesheet rather than written into the markup.',
        whenToUse:
            'On a page that sits inside a hierarchy deeper than one level, where “up” is a useful move. Not as a history of where somebody has been — that is the back button — and not on a flat application, where every crumb but the last would say the same thing.',
        examples: [
            {
                title: 'Three levels, the last one where you are',
                why: 'The separator is a stylesheet glyph, so it is never selected or read out as text; the last entry is not a link, because it is the page you are on.',
                markup: `
<nav class="kp-breadcrumb" aria-label="Breadcrumb">
<ol>
<li><a href="#breadcrumb">Home</a></li>
<li><a href="#example">Applications</a></li>
<li><span aria-current="page">Example Inc</span></li>
</ol>
</nav>
`,
            },
        ],
        variants: [
            { name: 'separator', what: 'Drawn before every entry but the first, from a glyph the theme can change.' },
            { name: 'current page', what: 'The last entry is text rather than a link, and says it is the current page.' },
            { name: 'wrapping', what: 'A long trail wraps to a second line instead of scrolling sideways.' },
        ],
        accessibility: [
            'Built in — the separator is a stylesheet glyph, so a screen reader does not read a slash between every crumb.',
            'Yours — use an ordered list; the order is the information.',
            'Yours — name the nav element and mark the last entry as the current page.',
            'Yours — shorten long names in the middle of the trail rather than dropping levels out of it.',
        ],
    },
    {
        id: 'pagination',
        title: 'Pagination',
        group: 'Navigation',
        classes: ['kp-pagination'],
        exports: ['Pagination'],
        intro: 'Numbered pages with previous and next, gaps where the range is cut, and the current page marked by weight as well as by the attribute that announces it.',
        whenToUse:
            'For a list a reader may want to come back to, where a page number is a place they can return to and link to. Not for a feed, where endless scrolling suits the reading; and not inside the data table, which builds its own pager.',
        examples: [
            {
                title: 'Five pages with a gap',
                why: 'The gap is decorative and hidden from a screen reader — “…” read out between page numbers is noise. Real links, so a page can be opened in a new tab.',
                markup: `
<nav class="kp-pagination" aria-label="Pagination">
<ul>
<li><a href="#pagination">Previous</a></li>
<li><a href="#pagination">1</a></li>
<li><a href="#pagination" aria-current="page">2</a></li>
<li><a href="#pagination">3</a></li>
<li class="kp-pagination__gap" aria-hidden="true">…</li>
<li><a href="#pagination">9</a></li>
<li><a href="#pagination">Next</a></li>
</ul>
</nav>
`,
            },
        ],
        variants: [
            { name: 'current page', what: 'Bold with a thicker underline, and the attribute that says so, because weight alone is a fine distinction.' },
            { name: '.kp-pagination__gap', what: 'The cut in the range: quiet, decorative and not a link.' },
            { name: 'previous / next', what: 'Words rather than arrows by default, and left out at the ends rather than rendered as links to a page that is not there.' },
            { name: 'first / last', what: 'Optional jumps to either end for a long list.' },
        ],
        accessibility: [
            'Built in — the gap is hidden from a screen reader and the current page is announced rather than only drawn.',
            'Built in — a link that would point outside the range is not rendered, so nobody tabs onto a page that does not exist.',
            'Yours — name the nav element, and give each number a label if the number alone is not clear (“page 3”).',
            'Yours — use real links with real URLs. A page number that only works with script cannot be shared.',
            'Yours — say how many pages there are; a reader cannot guess from a cut range.',
        ],
    },
    {
        id: 'tabs',
        title: 'Tabs',
        group: 'Navigation',
        classes: ['kp-tabs', 'kp-tab'],
        exports: ['Tabs'],
        aliases: ['activation', 'loop'],
        intro: 'One panel at a time, with a row of tabs above it. The arrows move between tabs, one tab is in the tab order at a time, and by default moving the arrows also selects.',
        whenToUse:
            'For alternative views of the same subject, where the reader wants one of them at a time — a record’s details, its history, its files. Not to split a form into parts, where a reader has to fill in all of them and a wizard says so; and not for content anyone might want to search or print as a whole.',
        examples: [
            {
                title: 'Two tabs and their panels',
                why: 'The wiring is markup: each tab controls a panel and each panel names its tab. The module adds the roving tab order and the arrow keys, and nothing else.',
                markup: `
<div class="kp-tabs">
<div class="kp-tabs__list" role="tablist" aria-label="Application">
<button type="button" class="kp-tab" role="tab" id="doc-tab-0" aria-controls="doc-panel-0" aria-selected="true">Overview</button>
<button type="button" class="kp-tab" role="tab" id="doc-tab-1" aria-controls="doc-panel-1" aria-selected="false">History</button>
</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-0" aria-labelledby="doc-tab-0">Sent on 4 September, interview on the eleventh.</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-1" aria-labelledby="doc-tab-1" hidden>Three earlier applications to this company.</div>
</div>
`,
            },
            {
                title: 'Tabs that only select when you say so',
                why: 'With manual activation the arrows move focus and Enter or Space selects — the right choice when showing a panel is expensive, and the wrong one when it is free.',
                markup: `
<div class="kp-tabs">
<div class="kp-tabs__list" role="tablist" aria-label="Reports" data-kp-activation="manual" data-kp-loop="false">
<button type="button" class="kp-tab" role="tab" id="doc-tab-m0" aria-controls="doc-panel-m0" aria-selected="true">Summary</button>
<button type="button" class="kp-tab" role="tab" id="doc-tab-m1" aria-controls="doc-panel-m1" aria-selected="false">Full export</button>
</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-m0" aria-labelledby="doc-tab-m0">Twelve applications this quarter.</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-m1" aria-labelledby="doc-tab-m1" hidden>Everything, as a table.</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-tabs__list', what: 'The row, with a rule under it that the selected tab’s own rule sits on.' },
            { name: '.kp-tab', what: 'One tab: quiet ink until it is chosen.' },
            { name: 'selected', what: 'The page’s full ink, bold, and a coloured rule underneath — three carriers, and the selected state is what is announced.' },
            { name: 'automatic activation', what: 'The default: moving with the arrows selects as it goes.' },
            { name: 'manual activation', what: 'The arrows move focus only; Enter or Space selects.' },
            { name: 'looping', what: 'The arrows wrap from the last tab to the first, unless the list says not to.' },
            { name: '.kp-tabs__panel', what: 'The panel. Exactly one is visible; the others are hidden, which also takes them out of the search and the tab order.' },
        ],
        accessibility: [
            'Built in — a roving tab order, so Tab leaves the list rather than walking through every tab in it.',
            'Built in — the arrows, Home and End move between tabs, and the selection is reflected on the tab itself.',
            'Built in — every change of tab is an event, so a consumer can put the choice in the URL.',
            'Yours — write the roles and the pairing between tab and panel. The module drives markup that is already a tab list.',
            'Yours — name the tab list, and give each panel a label that is its tab.',
            'Yours — do not hide something behind a tab that the reader has to find by searching the page.',
        ],
    },
    {
        id: 'accordion',
        title: 'Accordion',
        group: 'Navigation',
        classes: ['kp-accordion'],
        exports: ['Accordion'],
        intro: 'Disclosure sections built on the browser’s own details element, so opening, closing and the keyboard come from the platform rather than from a hand-written toggle.',
        whenToUse:
            'For a long page of questions or optional detail the reader dips into. Not for content most readers need — anything folded away is missed and, in some browsers, not found by a search of the page. Not as tabs either: an accordion can have everything open at once, which is often the point.',
        examples: [
            {
                title: 'Two sections, one open',
                why: 'A details element is already keyboard-operable and its state is already announced; the classes only paint. The open attribute is the whole of the open state.',
                markup: `
<div class="kp-accordion">
<details class="kp-accordion__item" open>
<summary class="kp-accordion__summary">What is a theme?</summary>
<div class="kp-accordion__body">A block of tokens on the document, which every component reads.</div>
</details>
<details class="kp-accordion__item">
<summary class="kp-accordion__summary">What is a register?</summary>
<div class="kp-accordion__body">An optional stylesheet that adds a texture without changing the colours.</div>
</details>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-accordion__item', what: 'One section, with a rule under it so a stack of them reads as a list.' },
            { name: '.kp-accordion__summary', what: 'The header. It is the button, in bold, with the browser’s own marker.' },
            { name: '.kp-accordion__body', what: 'The content, in quiet ink, with room under it.' },
            { name: 'open', what: 'The browser’s own state; the React component can also keep one section open at a time.' },
        ],
        accessibility: [
            'Built in — the element is a real disclosure: Enter and Space open it, and its state is announced without a written role.',
            'Yours — write a summary that says what is inside; “more” tells the reader nothing.',
            'Yours — open the section that matters on arrival rather than leaving the page as a row of closed lids.',
            'Yours — do not fold away anything the reader must not miss.',
        ],
    },
    {
        id: 'menu',
        title: 'Dropdown menu',
        group: 'Navigation',
        classes: ['kp-menu', 'kp-popover'],
        exports: ['DropdownMenu'],
        intro: 'A list of actions on the popover layer, anchored under the control that opens it. The browser gives it light dismiss, Escape and focus return; the package gives it the looks and the anchor.',
        whenToUse:
            'For actions that belong to one thing and would crowd the row they sit in. Not for navigation, which reads better as links; not for a choice that changes a value, which is a select or a listbox; and not for more than a handful of entries, where a command palette or a page is kinder.',
        examples: [
            {
                title: 'A menu with a destructive entry',
                why: 'Anchor positioning puts the list under its button without either of them measuring the other, and the popover is the browser’s, so Escape and clicking away are free.',
                markup: `
<button type="button" class="kp-button" popovertarget="doc-menu" style="anchor-name: --doc-menu">Actions</button>
<div popover="auto" id="doc-menu" class="kp-popover" style="position-anchor: --doc-menu">
<ul class="kp-menu">
<li><button type="button" class="kp-menu__item">Edit</button></li>
<li><button type="button" class="kp-menu__item">Duplicate</button></li>
<li><hr class="kp-menu__separator" /></li>
<li><button type="button" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
</ul>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-popover', what: 'The floating surface: its own ground, a boundary, a maximum height it scrolls inside, and a position taken from its anchor.' },
            { name: '.kp-menu', what: 'The column of entries. It never wraps into a second column, whatever height it is given.' },
            { name: '.kp-menu__item', what: 'One entry: a real button that fills the row and wears no button chrome.' },
            { name: '.kp-menu__item--destructive', what: 'An entry in the destructive colour. It still needs a confirmation or an undo behind it.' },
            { name: '.kp-menu__separator', what: 'A rule between groups of entries.' },
            { name: 'hover', what: 'A wash of the page’s ink rather than the accent colour, so a highlighted row is quiet in every theme.' },
            { name: 'pastel', what: 'In pastel a popover or a menu has its pass on its own ::backdrop (no dim), placed on it by anchor positioning, and lands on it from its top-start corner in one landing (560 ms); it closes as that backwards. An entry under the pointer peels its top-end corner into a fold, a press sticks it flat, and focus is the dashed line alone. The theme menu is this menu.' },
        ],
        accessibility: [
            'Built in — light dismiss, Escape and focus return are the browser’s, because a hand-written focus trap is how focus traps break.',
            'Built in — the list scrolls inside the popover instead of running off the bottom of the window.',
            'Yours — make every entry a real button or link; a div with a click handler is not reachable.',
            'Yours — name the trigger, and say when it opens a menu rather than acting.',
            'Yours — put a destructive entry behind the same confirmation you would give a destructive button.',
        ],
    },
    {
        id: 'menu-button',
        title: 'Menu button',
        group: 'Navigation',
        classes: ['kp-menu-button'],
        exports: [],
        aliases: ['menu-open', 'menu-close', 'menu-select', 'menu-empty', 'value', 'reason', 'loading'],
        intro: 'A button that opens every other action of a page or a thing, grouped under small muted capitals, each entry its label over a one-line hint. It is the package’s `.kp-menu` with `.kp-menu__item` entries, made rich (`.kp-menu--rich`) and wired by js/menu-button.js: the keys of a menu, a fill that waits while the menu is open, and an action that cannot be used now that stays in the list and says why.',
        whenToUse:
            'For the rare actions on a page or a record, behind a “More ▾” at the end of its header, when each needs a word of explanation. Not for the one or two actions used every day, which are buttons; not for navigation, which reads better as links; and not for a plain list of short commands, which the dropdown menu does with less.',
        examples: [
            {
                title: 'More ▾ with groups, hints and an action that cannot be used now',
                why: 'The entries are markup here; `setMenu(wrapper, groups)` writes the same from a script, and a live page refills it the same way. ↓ on the button opens it on the first entry; the grey entry takes the focus, keeps its hint and says why under it, and Enter does nothing there.',
                markup: `
<div class="kp-menu-button" data-kp-menu-button data-kp-key="doc-pump-more">
<button type="button" class="kp-button">More ▾</button>
<div class="kp-menu kp-menu--rich" role="menu" aria-label="Every other action on this pump house" hidden>
<div class="kp-menu__group" role="group" aria-labelledby="doc-mb-g1">
<p class="kp-menu__heading" id="doc-mb-g1" role="presentation">Run</p>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-labelledby="doc-mb-l1" aria-describedby="doc-mb-h1" data-kp-value="restart"><span class="kp-menu__label" id="doc-mb-l1">Restart the pumps</span><span class="kp-menu__hint" id="doc-mb-h1">Stop and start both pumps, one after the other</span></button>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-disabled="true" aria-labelledby="doc-mb-l2" aria-describedby="doc-mb-h2 doc-mb-r2" data-kp-value="test"><span class="kp-menu__label" id="doc-mb-l2">Run a pressure test</span><span class="kp-menu__hint" id="doc-mb-h2">Close the ring main valve and measure for ten minutes</span><span class="kp-menu__hint kp-menu__reason" id="doc-mb-r2">Not while a field engineer is on site</span></button>
</div>
<div class="kp-menu__group" role="group" aria-labelledby="doc-mb-g2">
<p class="kp-menu__heading" id="doc-mb-g2" role="presentation">Records</p>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-labelledby="doc-mb-l3" aria-describedby="doc-mb-h3" data-kp-value="print"><span class="kp-menu__label" id="doc-mb-l3">Print the site sheet</span><span class="kp-menu__hint" id="doc-mb-h3">One page with the pumps, the valves and the contacts</span></button>
<button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive" tabindex="-1" aria-labelledby="doc-mb-l4" aria-describedby="doc-mb-h4" data-kp-value="archive"><span class="kp-menu__label" id="doc-mb-l4">Archive this pump house…</span><span class="kp-menu__hint" id="doc-mb-h4">Take it off the network; its readings are kept</span></button>
</div>
</div>
</div>
`,
            },
            {
                title: 'A menu that is still loading',
                why: 'This is what `setMenu(wrapper, "loading")` writes: one disabled entry at the final row height and `aria-busy` on the menu, so the menu opens at once and fills when the entries arrive. In pastel the waiting menu becomes caterpillar: a head on its top-end corner and legs along its foot that step in turn.',
                markup: `
<div class="kp-menu-button" data-kp-menu-button>
<button type="button" class="kp-button">Actions ▾</button>
<div class="kp-menu kp-menu--rich" role="menu" aria-label="Actions on this pump house" aria-busy="true" hidden>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-disabled="true" data-kp-loading><span class="kp-menu__label">Loading…</span><span class="kp-menu__hint"> </span></button>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '--kp-menu-anchor-x', what: 'Written by `js/menu-button.js` on the open menu: the button’s centre in pixels from the menu’s left edge, kept 14 px inside it, and not written when the menu hangs above its button. Every theme receives it; only deco reads it, to start its inlay under the button.' },
            { name: '.kp-menu-button', what: 'The wrapper, `[data-kp-menu-button]`: a button, then its `[role="menu"]`. The menu hangs under the button at its end edge.' },
            { name: '.kp-menu--rich', what: 'The menu itself, a `.kp-menu`: wide enough for a label over a hint, and past its maximum height it scrolls inside itself.' },
            { name: '.kp-menu__group, __heading', what: 'A group of entries and its heading in small muted capitals, which names the `role="group"`. A menu of one entry, or a nameless group, has no heading.' },
            { name: '.kp-menu__label, __hint', what: 'An entry’s label over its one-line hint; every label and every hint start at one edge.' },
            { name: '.kp-menu__reason', what: 'Under the hint of an entry that cannot be used now (`aria-disabled`), in italics: why. The entry keeps its focus and does nothing.' },
            { name: '.kp-menu__item--destructive', what: 'A destructive entry: its label in the destructive colour.' },
            { name: 'loading', what: '`setMenu(wrapper, "loading")`: one grey entry at the height of a real one, the menu `aria-busy`.' },
            { name: 'empty', what: 'No entries: the button stays, grey, and its title says why; `data-kp-menu-empty="hide"` takes it away instead.' },
            { name: 'in a page header', what: 'In a `.kp-page-header` 40rem wide or narrower, the open menu spans the header’s buttons, inside the screen.' },
            { name: 'a refill while open', what: 'Waits until the menu closes, so a live update never moves an entry under the pointer or the focus; a fill that shows the same is skipped.' },
            { name: 'pastel', what: 'The menu opens and closes as pastel’s popover (the menu page): its pass on its ::backdrop, the landing onto it, the close as the opening backwards. A loading menu becomes caterpillar, a head on its top-end corner and stepping legs along its foot, until its entries arrive.' },
        ],
        accessibility: [
            'Built in — the APG menu button: `aria-haspopup`, `aria-expanded` and `aria-controls` on the button; ↓ or ↑ opens it on the first or last entry; ↓ ↑ wrap, Home and End, and a letter jumps to the next entry that starts with it.',
            'Built in — Esc closes it and puts the focus back on the button, and the page’s own Escape listeners hear nothing; Tab closes it and moves on; a click outside closes it.',
            'Built in — an entry that cannot be used stays focusable with `aria-disabled`, and its hint and reason are its description, so a keyboard reader learns why.',
            'Built in — every word the menu says is in the dictionary (`menuLoading`, `menuEmpty`); `attachMenuButtons(root, { strings })` overrides them.',
            'Yours — name the menu (`aria-label`) and say in the button that it opens one (“More ▾”).',
            'Yours — put a destructive entry behind the same confirmation you would give a destructive button.',
        ],
    },
    {
        id: 'drawer',
        title: 'Drawer',
        group: 'Navigation',
        classes: ['kp-drawer'],
        exports: [],
        intro: 'A panel at the end edge of the window, full height: a head with the title, the close button and one sentence, a body that scrolls, and a foot that stays. `.kp-drawer` lays out any element; a `dialog.kp-drawer` (with `.kp-dialog`) is placed at the edge and slides in.',
        whenToUse:
            'For Help, settings or the detail of one thing, kept beside the page rather than over its middle. Not for a decision that must be made first, which is a dialog, and not for navigation that is always there, which is a side navigation.',
        examples: [
            {
                title: 'Help in a drawer',
                why: 'The button names the dialog by id, as every dialog trigger does; Esc or ✕ closes it and the focus goes back to the button. The foot holds what Help can start.',
                markup: `
<button type="button" class="kp-button" data-kp-dialog="doc-drawer">Help</button>
<dialog class="kp-drawer kp-dialog" id="doc-drawer" aria-labelledby="doc-drawer-title">
<header class="kp-drawer__head">
<h2 class="kp-dialog__title" id="doc-drawer-title">Help</h2>
<button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close Help" data-kp-dialog-close>✕</button>
<p class="kp-drawer__desc">Where things live on this site, the words it uses, and its keys.</p>
</header>
<div class="kp-drawer__body">
<section class="kp-help kp-card">
<h3>Words</h3>
<p>The words this site uses for things.</p>
<dl class="kp-help__list">
<dt>Pump house</dt><dd>A building with one or more pumps that keep the pressure up in a part of the network.</dd>
<dt>Ring main</dt><dd>The loop of large pipes that feeds the town from two sides.</dd>
</dl>
</section>
</div>
<footer class="kp-drawer__foot">
<button type="button" class="kp-button kp-button--primary">Take the 1-minute tour</button>
</footer>
</dialog>
`,
            },
        ],
        variants: [
            { name: '.kp-drawer', what: 'Three rows: the head, the body (which scrolls) and the foot (which stays). On any element.' },
            { name: 'dialog.kp-drawer', what: 'At the end edge at the full height of the window, square, sliding in from the edge unless the reader asked for less motion.' },
            { name: '.kp-drawer__head, __desc', what: 'The title (a `.kp-dialog__title`, kept clear of the close button) and one sentence under it.' },
            { name: '.kp-drawer__body', what: 'What the drawer holds, in a column with room between; it scrolls inside itself.' },
            { name: '.kp-drawer__foot', what: 'The drawer’s action, always in view at the bottom.' },
            { name: 'pastel', what: 'In pastel the drawer opens as pastel’s dialog (its pass, the landing onto it, a strip of washi tape) and swings from its top-end corner; it closes as that opening backwards.' },
        ],
        accessibility: [
            'Built in — as a modal `dialog` it traps the focus, closes on Escape and returns the focus to its button: the browser’s, as every dialog’s.',
            'Yours — name the drawer by its title (`aria-labelledby`) and give it a close button with a name.',
        ],
    },
    {
        id: 'help-tour',
        title: 'Help and the tour',
        group: 'Navigation',
        classes: ['kp-help', 'kp-tour'],
        exports: [],
        intro: 'Help cards (`.kp-help`), each a list of words beside their meanings, and a short guided tour over the page: `startTour(steps)` in js/tour.js shows one card (`.kp-tour`) per step beside the part it is about, with that part ringed and the rest of the page dimmed. The count is exact, because a step whose part is not on the page is left out before counting, and a tour that ended is remembered.',
        whenToUse:
            'Help for the words and keys a site uses, and a tour for a first visit to a page whose parts are not obvious. Not for instructions a reader needs every time, which belong on the page, and not for more than a handful of steps.',
        examples: [
            {
                title: 'A help card',
                why: 'A heading, a sentence and a `dl`: the words in one column, their meanings beside them, starting at one edge across every card; in a card of 22rem or less the word goes over its meaning.',
                markup: `
<section class="kp-help kp-card">
<h3>Keys</h3>
<p>Pressed anywhere outside a field.</p>
<dl class="kp-help__list">
<dt><kbd>?</kbd></dt><dd>Open this Help.</dd>
<dt><kbd>Ctrl</kbd> <kbd>K</kbd></dt><dd>Jump to a page or a pump house by its name.</dd>
<dt><kbd>Esc</kbd></dt><dd>Close what is open, or show all again.</dd>
</dl>
</section>
`,
            },
            {
                title: 'The tour’s card, as startTour() builds it',
                why: 'Shown in place here; the tour places it 12 px under or over its target, 16 px inside the window, and moves it with the page. Back is hidden on the first step, and Next reads Done on the last.',
                markup: `
<div class="kp-tour" role="dialog" aria-labelledby="doc-tour-title" style="position: relative">
<h3 class="kp-tour__title" id="doc-tour-title">The areas</h3>
<p class="kp-tour__text">Five areas, always in the same place: the overview, the pump houses, their readings, incidents and backups.</p>
<footer class="kp-tour__foot">
<span class="kp-tour__count">1 of 5</span>
<span class="kp-tour__buttons">
<button type="button" class="kp-button kp-button--sm kp-button--ghost">Skip</button>
<button type="button" class="kp-button kp-button--sm kp-button--primary">Next</button>
</span>
</footer>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-help', what: 'A help card: a heading, a sentence, and its lists.' },
            { name: '.kp-help__list', what: 'A `dl`: the words beside their meanings in two columns; in a card of 22rem or less, the word over its meaning.' },
            { name: '.kp-help kbd', what: 'A key, drawn as a key.' },
            { name: '.kp-tour', what: 'The tour’s card, a non-modal dialog: its title, its text, and a foot with the count and Back, Skip and Next.' },
            { name: 'the dim', what: 'The page is dimmed around the target by a shadow the target casts, set by a knob (listed below) that a theme replaces to draw its own dim; the theme does not paint a box-shadow on the target itself, which a cut corner would clip. While the tour points at a part, the part is uncut.' },
            { name: 'closing the dim', what: 'When the card closes, the dim leaves as it was drawn: the knobs listed below name the shadow it fades to, how long it takes, its curve and its delay (forest withers it, cyberpunk steps it). Unset, it fades over the theme\u2019s fold time.' },
            { name: 'data-kp-tour-target', what: 'Written by the tour on the part it talks about: a ring in the focus colour, and the rest of the page dimmed around it.' },
            { name: 'startTour(steps, options)', what: 'Starts it: each step a `target` (a selector or a function), a `title` and a `text`; `remember`, `returnFocus`, `onEnd`, `decorate`, `strings`. Returns `{ end, goto }`, or null when no step’s part is on the page.' },
            { name: 'shouldStartTour()', what: 'Whether a page starts the tour by itself: `?tour` (or `?tour=3`) always; otherwise a first visit by a person, not a remembered one and not a browser driven by a script.' },
            { name: 'in a dialog', what: 'When the part a step is about is inside an open modal dialog, the card goes into that dialog, where it can be used.' },
            { name: 'pastel', what: 'In pastel the tour’s card draws its own plate and pass and lands on it, a ring is drawn round the target (`kp-sig-pastel-tour-ring`), and the card and the dim close as they came, backwards.' },
        ],
        accessibility: [
            'Built in — the card is named by its title and described by its text; Next takes the focus on every step, ← and → move, and Esc ends the tour from anywhere and returns the focus where it was.',
            'Built in — the page stays usable during the tour: the card is not modal.',
            'Built in — every word the card says is in the dictionary (`tour…`); `startTour(steps, { strings })` overrides them.',
            'Yours — keep the tour short and let Help start it again; never start it on every visit (`shouldStartTour` with the remembered state does that).',
            'Yours — a help list’s words are the site’s own: write them as the pages use them.',
        ],
    },
    {
        id: 'dialog',
        title: 'Dialog',
        group: 'Navigation',
        classes: ['kp-dialog'],
        exports: ['Dialog'],
        intro: 'The browser’s own dialog element, painted. Opened as a modal it traps focus, closes on Escape and puts focus back where it came from — all three for free, which is why none of them is written here.',
        whenToUse:
            'For a decision that has to be made before anything else continues, and for a short form that would lose its context on its own page. Not for a message, which is an alert or a toast; not for anything long, because a dialog cannot be scrolled comfortably or printed; and not for something the reader may want to keep open while working.',
        examples: [
            {
                title: 'A button that opens a modal dialog',
                why: 'The trigger names the dialog by id and the module wires the two together. Escape closes it and focus returns to the button.',
                markup: `
<button type="button" class="kp-button" data-kp-dialog="doc-dialog">Delete application</button>
<dialog class="kp-dialog" id="doc-dialog">
<h2 class="kp-dialog__title">Delete this application?</h2>
<p class="kp-dialog__description">It disappears from your list. This cannot be undone.</p>
<div class="kp-dialog__actions">
<button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>
<button type="button" class="kp-button kp-button--destructive" data-kp-dialog-close>Delete</button>
</div>
</dialog>
`,
            },
            {
                title: 'A dialog that manages one thing, in sections',
                why: 'The head holds the title, a state badge and the description; the body holds sections with a heading and a note, the danger section last. The wide variant takes its full width at once, so a section that fills later moves nothing sideways.',
                markup: `
<dialog class="kp-dialog kp-dialog--wide" open aria-labelledby="doc-manage-title">
<div class="kp-dialog__head">
<h2 class="kp-dialog__title" id="doc-manage-title">home-assistant</h2>
<span class="kp-badge kp-badge--success">active</span>
<p class="kp-dialog__description">Issued 02/10/2026 09:14 · last used 16/10/2026 18:40 (412×)</p>
</div>
<div class="kp-dialog__body">
<section class="kp-dialog__section">
<h3 class="kp-dialog__heading">Token</h3>
<div class="kp-secret" data-kp-secret data-kp-secret-label="Token of home-assistant" data-kp-secret-value="kp_live_7Hq2v9XcLm4TzR8sWb3N"></div>
<p class="kp-dialog__note">Hides itself again after 30 seconds.</p>
</section>
<section class="kp-dialog__section kp-dialog__section--danger">
<h3 class="kp-dialog__heading">Danger zone</h3>
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Revoke this token?">Revoke</button>
<p class="kp-dialog__note">Revoking keeps the row and its history; deleting does not.</p>
</section>
</div>
<div class="kp-dialog__actions">
<button type="button" class="kp-button">Close</button>
</div>
</dialog>
`,
            },
            {
                title: 'The parts, with the dialog left open',
                why: 'Printed open so the pieces can be seen at rest: the title, the description under it, the close in the corner and the actions at the end.',
                markup: `
<dialog class="kp-dialog" open>
<h2 class="kp-dialog__title">Invite a colleague</h2>
<p class="kp-dialog__description">They get an email with a link that expires in a week.</p>
<button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close">×</button>
<div class="kp-field">
<label class="kp-field__label" for="doc-dialog-mail">Email</label>
<input class="kp-field__input" id="doc-dialog-mail" type="email" />
</div>
<div class="kp-dialog__actions">
<button type="button" class="kp-button">Cancel</button>
<button type="button" class="kp-button kp-button--primary">Send</button>
</div>
</dialog>
`,
            },
        ],
        variants: [
            { name: 'modal', what: 'The default: the rest of the page is inert behind a dimmed backdrop, focus is trapped, and Escape closes.' },
            { name: 'non-modal', what: 'Opened without inerting the page, for a panel that has to sit beside what it is about.' },
            { name: '.kp-dialog__title / __description', what: 'The heading and the sentence under it, which are also what name and describe the dialog.' },
            { name: '.kp-dialog__close', what: 'The close in the corner, on top of the padding rather than in the flow.' },
            { name: '.kp-dialog__actions', what: 'The buttons at the end, pushed to the trailing edge, primary last.' },
            { name: '.kp-dialog--wide', what: 'A dialog that manages one thing: 42rem wide at once, so a section that fills later moves nothing sideways.' },
            { name: '.kp-dialog__head', what: 'The title with a state badge beside it and the description under both.' },
            { name: '.kp-dialog__section / __heading / __note', what: 'One part of the body under its heading, with an optional note under it; sections are divided by a rule.' },
            { name: '.kp-dialog__section--danger', what: 'The last section, for what cannot be undone: ruled along its start edge in the destructive colour.' },
            { name: 'backdrop', what: 'A dimming rather than a theme colour: a tinted backdrop paints the page instead of pushing it back.' },
            { name: 'pastel', what: 'In pastel a dialog is printed twice and stuck on: its second pass, a flat silhouette in the second ink drawn by its ::backdrop and placed on it by anchor positioning, springs into its rest 6 px off register, then the dialog swings down onto it from its top-start corner on the soft landing (one 8 % overshoot, settled once); a strip of washi tape crosses its top-start corner, and the modal’s dim is the backdrop’s border, so a click outside still reaches it. The close is that opening played backwards. Without anchor positioning the pass rests as a flat shadow and the dialog opens with the swing alone; under reduced motion it is simply there.' },
        ],
        accessibility: [
            'Built in — focus trapping, Escape and focus return come from the element itself, so they work the way the platform’s do.',
            'Built in — opening from a wired trigger is an event that says which trigger and whether it was modal, so a consumer can restore state.',
            'Yours — name the dialog with its title, and point it at its description.',
            'Yours — give every dialog a way out that is not Escape; a modal with only a submit is a trap on touch.',
            'Yours — keep it short. A dialog is not a page.',
        ],
    },
    {
        id: 'command-palette',
        title: 'Command palette',
        group: 'Navigation',
        classes: ['kp-palette'],
        exports: ['CommandPalette', 'PaletteTrigger'],
        aliases: ['listbox', 'option', 'disabled', 'group', 'keys', 'generated', 'primary', 'match', 'hotkey', 'clear-on-close', 'close-on-run'],
        intro: 'A dialog with a filter box and a list of commands, opened by a key from anywhere on the page. The commands are markup a server wrote, not an array this module owns, so they are there before any script runs.',
        whenToUse:
            'In an application dense enough that a reader will want to jump rather than navigate — and only as a second route, never the only one. Not as a menu for three commands; not as a search over data, which is a search field with results.',
        examples: [
            {
                title: 'A palette, grouped, left open',
                why: 'Shown open so it can be looked at; in an application it opens on its key and closes when a command runs. The hotkey is turned off here so that this page does not take a key from your browser.',
                markup: `
<dialog class="kp-palette" data-kp-palette data-kp-hotkey="none" id="doc-palette" aria-label="Commands" open>
<input class="kp-palette__input" type="text" role="combobox" aria-label="Commands" aria-expanded="true" aria-controls="doc-palette-list" autocomplete="off" placeholder="Type a command…" />
<ul class="kp-palette__list" id="doc-palette-list" role="listbox" aria-label="Commands">
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Applications</span>
<ul role="group" aria-label="Applications">
<li class="kp-palette__option" role="option" data-kp-option data-value="new">New application<span class="kp-palette__description">Start from an empty form</span><kbd class="kp-palette__keys" data-kp-keys="n">n</kbd></li>
<li class="kp-palette__option" role="option" data-kp-option data-value="import">Import from a file</li>
</ul></li>
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Account</span>
<ul role="group" aria-label="Account">
<li class="kp-palette__option" role="option" data-kp-option data-value="theme">Change theme</li>
<li class="kp-palette__option" role="option" data-kp-option data-value="signout">Sign out</li>
</ul></li>
</ul>
<p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
`,
            },
            {
                title: 'Places to go, opened from the bar',
                why: 'A hotkey alone is a secret, so the bar keeps a visible trigger in its `.kp-nav__search` slot: a `data-kp-palette-open` button the module marks as opening a dialog, whose empty key hint it fills with ⌘K or Ctrl K when the palette has a key. The commands are links: Enter and a click both follow them, `kp-palette-run` still fires first and can be cancelled by a router that navigates itself, and until the module attaches they are plain anchors that work on their own. The hotkey is off here, so the trigger prints no key.',
                markup: `
<div class="kp-nav-wrap">
<nav class="kp-nav" aria-label="Main">
<a class="kp-nav__brand" href="#command-palette">kp</a>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#command-palette" aria-current="page">Overview</a></li>
</ul>
<div class="kp-nav__search">
<button type="button" class="kp-nav__search-trigger" data-kp-palette-open="doc-places">Search <kbd class="kp-palette__keys" data-kp-palette-keys></kbd></button>
</div>
</nav>
</div>
<dialog class="kp-palette" data-kp-palette data-kp-hotkey="none" id="doc-places" aria-label="Go to">
<input class="kp-palette__input" type="text" role="combobox" aria-label="Go to" aria-expanded="true" aria-controls="doc-places-list" autocomplete="off" placeholder="Where to?" />
<ul class="kp-palette__list" id="doc-places-list" role="listbox" aria-label="Go to">
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="overview" href="#command-palette">Overview</a></li>
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="nav-bar" href="nav-bar.html">Navigation bar</a></li>
</ul>
<p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
`,
            },
        ],
        variants: [
            { name: '.kp-palette', what: 'The dialog: near the top rather than in the middle, so a list that grows downwards does not push its own input off centre.' },
            { name: '.kp-palette__input', what: 'The filter, at full width, with the list under it.' },
            { name: '.kp-palette__group / __group-label', what: 'Commands under a small heading. A group whose commands are all filtered out hides itself.' },
            { name: '.kp-palette__option', what: 'One command; is-active marks where the keyboard is.' },
            { name: '.kp-palette__description', what: 'A second line on a command, for one whose name is not enough.' },
            { name: '.kp-palette__keys', what: 'The key hint at the end of a row, which never competes with the label.' },
            { name: '.kp-palette__status', what: 'The live region that says how many commands are left after typing.' },
            { name: 'a link as a command', what: 'An `<a href>` carrying the option’s role and `data-kp-option`, inside a presentational list item (a command with an `href` in React). Enter and a click follow it; the module keeps it out of the Tab order so focus stays in the filter, and a page without JavaScript still has a list of working links.' },
            { name: 'matching', what: 'The filter matches literally by default — “read” finds “Readings for line 2” and not “Report an incident” — and `data-kp-match="subsequence"` (the `match` prop in React) makes “nap” find “new application” instead.' },
            { name: 'pastel', what: 'In pastel the palette opens as pastel’s dialog: its pass on its ::backdrop, the landing onto it, a strip of washi tape across its corner; it closes as that opening backwards. An entry under the pointer or the keys is a sticker on its plate.' },
        ],
        accessibility: [
            'Built in — the dialog gives focus trapping, Escape and focus return, so the palette cannot strand the keyboard.',
            'Built in — virtual focus keeps the cursor in the input while the highlight moves, and the current command is announced.',
            'Built in — the number of matches is announced after typing.',
            'Yours — offer every command somewhere else as well. A palette is a shortcut, not an interface.',
            'Yours — write the commands as markup, with a value each, and name the groups.',
            'Built in — the trigger in the bar says it opens a dialog and which key does the same, and Escape gives focus back to it.',
            'Yours — pick a key that is not already the browser’s, and say what it is somewhere visible.',
        ],
    },
    {
        id: 'shortcut-sheet',
        title: 'Shortcut sheet',
        group: 'Navigation',
        classes: ['kp-shortcuts'],
        exports: ['ShortcutSheet'],
        aliases: ['hotkey'],
        intro: 'The dialog that lists what the keys do — the page every application with shortcuts owes its readers, and the one that is usually a paragraph in a help centre.',
        whenToUse:
            'As soon as the application has keys worth learning. Not as the only place the keys appear: a shortcut is most useful printed next to the command it repeats, which is what the palette’s key hints are for.',
        examples: [
            {
                title: 'A sheet with two groups, left open',
                why: 'Shown open here; in an application it opens on its own key. The rows are a definition list, so each key is read together with what it does.',
                markup: `
<dialog class="kp-shortcuts" data-kp-shortcuts data-kp-hotkey="none" aria-label="Keyboard shortcuts" open>
<h2 class="kp-dialog__title">Keyboard shortcuts</h2>
<section class="kp-shortcuts__group">
<h3 class="kp-shortcuts__group-label">Anywhere</h3>
<dl class="kp-shortcuts__list">
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">Ctrl K</kbd></dt><dd>Open the commands</dd></div>
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">?</kbd></dt><dd>Show this sheet</dd></div>
</dl>
</section>
<section class="kp-shortcuts__group">
<h3 class="kp-shortcuts__group-label">In a list</h3>
<dl class="kp-shortcuts__list">
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">J</kbd></dt><dd>Next row</dd></div>
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">K</kbd></dt><dd>Previous row</dd></div>
</dl>
</section>
</dialog>
`,
            },
        ],
        variants: [
            { name: '.kp-shortcuts', what: 'The dialog, narrower than the palette because a key and a sentence need less room.' },
            { name: '.kp-shortcuts__list', what: 'The definition list, with room above and below.' },
            { name: '.kp-shortcuts__row', what: 'One pair: the keys in a fixed column, the description beside them in quiet ink.' },
            { name: '.kp-shortcuts__group-label', what: 'A small heading over a group of rows, for a sheet long enough to need sections.' },
            { name: 'pastel', what: 'In pastel the sheet opens as pastel’s dialog: its pass on its ::backdrop, the landing onto it; it closes as that opening backwards.' },
        ],
        accessibility: [
            'Built in — the dialog gives the focus trap, Escape and focus return; the sheet adds nothing to them.',
            'Yours — mark the keys as keyboard input so they are read as keys.',
            'Yours — offer a way to open the sheet that is not itself a shortcut, or it can only be found by people who already know.',
            'Yours — keep the list current. A sheet that lies is worse than none.',
        ],
    },
    {
        id: 'skip-link',
        title: 'Skip link',
        group: 'Navigation',
        classes: ['kp-skip-link'],
        exports: [],
        aliases: ['skip'],
        intro: 'The first thing a keyboard user meets on a page: a link past the header and the navigation, invisible until it is focused and then unmissable.',
        whenToUse:
            'On every page with anything repeated before its content — a bar, a sidebar, a set of filters. There is no case for leaving it out; the only choice is where it lands, and the answer is the main content, not the first heading.',
        examples: [
            {
                title: 'The link and its target',
                why: 'It is out of sight until it takes focus, then it appears at the top corner. Tab into the box below to see it. The target takes focus itself, so the next Tab continues inside the content.',
                markup: `
<a class="kp-skip-link" href="#doc-skip-main">Skip to content</a>
<div id="doc-skip-main" tabindex="-1">The page’s content starts here.</div>
`,
            },
        ],
        variants: [
            { name: 'at rest', what: 'Off the top of the page, taking no space and reachable by nothing but the tab order.' },
            { name: 'focused', what: 'It drops into the top corner on the primary plate, above every other layer, with an underline.' },
        ],
        accessibility: [
            'Built in — it is above every other layer, so nothing sticky draws over it when it appears.',
            'Built in — the module moves focus to the target rather than only jumping the view, which is the half a bare anchor gets wrong.',
            'Yours — put it first in the document, before anything else focusable.',
            'Yours — point it at the main content; the module gives that element a focus target itself if it has none.',
            'Yours — keep the words plain. This one is read out of context by definition.',
        ],
    },
    {
        id: 'card',
        title: 'Card',
        group: 'Structure',
        classes: ['kp-card'],
        exports: ['Card'],
        intro: 'A raised surface with its own ground and ink: a title, a body, and optional slots for a header row, its actions and a footer. A raised surface is never darker than the one below it.',
        whenToUse:
            'To group what belongs together and to separate one record from the next in a grid or a list. Not as a box around everything — a page of cards inside cards has no hierarchy left — and not as a button: a card that is entirely clickable hides where the target is.',
        examples: [
            {
                title: 'Title and body',
                why: 'The smallest useful card. The body takes the quiet ink, which is what makes the title the title without a size change.',
                markup: `
<div class="kp-card">
<h3 class="kp-card__title">Example Inc</h3>
<p class="kp-card__body">Applied on 4 September; interview on the eleventh.</p>
</div>
`,
            },
            {
                title: 'With a header row, actions and a footer',
                why: 'The header lays the title and its controls on one baseline; the footer is separated by a rule rather than by distance alone, so it still reads as a footer in a dense list.',
                markup: `
<div class="kp-card">
<div class="kp-card__header">
<h3 class="kp-card__title">Example Inc</h3>
<div class="kp-card__actions">
<button type="button" class="kp-button kp-button--ghost">Edit</button>
<button type="button" class="kp-button">Open</button>
</div>
</div>
<p class="kp-card__body">Applied on 4 September; interview on the eleventh.</p>
<div class="kp-card__footer"><span class="kp-timestamp">Updated 2026-09-06 14:07</span></div>
</div>
`,
            },
            {
                title: 'A card that waits',
                why: 'A card whose body is still on its way carries `aria-busy="true"` until it has arrived. Every card in pastel has a thumbtack at its top centre; a waiting one also becomes caterpillar, a head on its top-end corner and legs along its foot.',
                markup: `
<article class="kp-card" aria-busy="true">
<h3 class="kp-card__title">Pump house 3</h3>
<p class="kp-card__body">Reading the pressure from the field unit…</p>
</article>
`,
            },
        ],
        variants: [
            { name: '.kp-card', what: 'The surface: the card ground, a boundary, a rounded corner, and in one theme a hard shadow the knob paints and every other theme leaves at nothing.' },
            { name: '.kp-card__title', what: 'The heading, at body size — a card is not a page and its title is not a display line.' },
            { name: '.kp-card__body', what: 'The text, in quiet ink.' },
            { name: '.kp-card__header', what: 'A row that lays the title and its actions on one baseline and pushes them apart.' },
            { name: '.kp-card__actions', what: 'The controls in that row, spaced by the scale.' },
            { name: '.kp-card__footer', what: 'A closing row, separated by a rule and the scale’s own distance.' },
            { name: 'pastel: the thumbtack', what: 'In pastel every card is fixed to the page with a thumbtack at its top centre. A card that leaves loses its tack first, then lifts off as its landing backwards, and its space folds after the tack is out; one put back arrives as that backwards, the tack pushed in last.' },
            { name: '[aria-busy="true"]', what: 'A card waiting for its content. In pastel it becomes caterpillar: a head on its top-end corner and legs along its foot that step in turn (js/loading-pieces.js). Other themes draw nothing extra.' },
        ],
        accessibility: [
            'Built in — the card ground and its ink are a measured pair, so text on a card clears the contrast floor in every theme.',
            'Yours — use a real heading for the title if the card is a section of the page rather than one of many equal records.',
            'Yours — put the link or the button inside the card rather than making the whole card clickable.',
            'Yours — keep the reading order the source order; a card that reads bottom to top on a screen reader is a card laid out with the visual only in mind.',
        ],
    },
    {
        id: 'tiles',
        title: 'Tiles of one height',
        group: 'Structure',
        classes: ['kp-tiles'],
        exports: [],
        intro: '`.kp-tiles` lays the package’s own `.kp-card` out in a grid: every tile as tall as the tallest tile of the grid, on every row, and each card’s footer kept to its bottom edge, so the footers of a row form one line however long the text above them is.',
        whenToUse:
            'For a grid of records of the same kind: pump houses, projects, services. Not for cards of different kinds or weights on one page, which want a layout of their own, and not for a single card.',
        examples: [
            {
                title: 'Cards with footers',
                why: 'The second card has the longest text; every card takes its height, and every footer keeps to the bottom.',
                markup: `
<ul class="kp-tiles">
<li class="kp-card">
<h3 class="kp-card__title">Pump house 1</h3>
<p class="kp-card__body">Two pumps, both running.</p>
<div class="kp-card__footer kp-row kp-row--between"><span class="kp-timestamp">Read 2 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" href="#">Open</a></div>
</li>
<li class="kp-card">
<h3 class="kp-card__title">Pump house 3</h3>
<p class="kp-card__body">Pressure below 2.1 bar for forty minutes; the field engineer is on the way.</p>
<div class="kp-card__footer kp-row kp-row--between"><span class="kp-timestamp">Read 1 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" href="#">Open</a></div>
</li>
</ul>
`,
            },
        ],
        variants: [
            { name: '.kp-tiles', what: 'A list or a div of `.kp-card`s: as many columns as fit, every row as tall as the tallest tile. A tile’s title is a step under a page card’s.' },
            { name: 'the footer', what: 'A `.kp-card__footer` keeps to the tile’s bottom edge; the body never touches its rule.' },
            { name: 'pastel', what: 'In pastel every tile is fixed to the page with a thumbtack at its top centre, which comes out first when the tile leaves.' },
        ],
        accessibility: [
            'Built in — the grid is layout only; the cards keep their order in the markup, which is the reading order.',
            'Yours — use a list (`ul`) when the tiles are a list of like records, so a screen reader says how many there are.',
        ],
    },
    {
        id: 'page-header',
        title: 'Page header',
        group: 'Structure',
        classes: ['kp-page-header'],
        exports: [],
        intro: 'A page’s title and its one-sentence description on the left; what acts on the whole page on the right: secondary buttons, one primary, and an overflow button that says “More ▾” for the rare things. On a narrow page it reads top to bottom, the primary first at the full width.',
        whenToUse:
            'At the top of a page that does something: a list with its actions, a record with its own. Not inside a card or a dialog, which have headers of their own, and not for more than one primary action.',
        examples: [
            {
                title: 'Title, description, three buttons and More',
                why: 'The overflow is the package’s popover and menu, hanging under its button towards the start so it stays on the page.',
                markup: `
<header class="kp-page-header">
<div class="kp-page-header__inner">
<div>
<h1 class="kp-page-header__title">Pump houses</h1>
<p class="kp-page-header__description">Fifteen pump houses on the northern network: their state, the last reading of each, and what needs a visit.</p>
</div>
<div class="kp-page-header__actions">
<button type="button" class="kp-button">Export readings</button>
<button type="button" class="kp-button kp-button--primary">Add a pump house</button>
<button type="button" class="kp-button" popovertarget="doc-page-more" aria-haspopup="menu" style="anchor-name: --doc-page-more">More ▾</button>
<div popover="auto" id="doc-page-more" class="kp-popover" style="position-anchor: --doc-page-more">
<ul class="kp-menu" role="menu">
<li role="none"><button type="button" role="menuitem" class="kp-menu__item">Import from a file…</button></li>
<li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Archive the network…</button></li>
</ul>
</div>
</div>
</div>
</header>
`,
            },
        ],
        variants: [
            { name: '.kp-page-header', what: 'The header; it measures its own width.' },
            { name: '.kp-page-header__inner', what: 'Two columns: the text block, and the actions against the far edge, level with the title.' },
            { name: '.kp-page-header__title, __description', what: 'The page’s heading, and one sentence under it at a readable measure in the muted ink.' },
            { name: '.kp-page-header__actions', what: 'The buttons, the primary among them, the overflow last; a popover in it hangs under its button towards the start.' },
            { name: 'on a phone', what: 'Under 40rem the title takes the width and the buttons fold under the description: the primary on a line of its own at the full width, the others beside each other under it, from the left.' },
        ],
        accessibility: [
            'Built in — the order on a phone is visual only; in the markup and the tab order the buttons keep yours.',
            'Built in — the overflow is a popover menu, so Escape and light dismiss are the browser’s.',
            'Yours — one `h1` per page, and the overflow button says what it is (“More ▾”) rather than a bare icon.',
        ],
    },
    {
        id: 'split-pane',
        title: 'Split pane',
        group: 'Structure',
        classes: ['kp-split'],
        exports: ['SplitPane'],
        aliases: ['orientation', 'collapse', 'large-step', 'step'],
        intro: 'Two panes with a separator between them that can be dragged, and moved with the arrow keys. One custom property drives the whole layout, so the pointer and the keyboard move the same thing.',
        whenToUse:
            'For a list beside a detail, or an editor beside its preview, where readers disagree about how much room each deserves. Not on a narrow screen, where two panes are two half-width columns; and not for a fixed proportion, which is a grid and needs no separator.',
        examples: [
            {
                title: 'A list beside a detail',
                why: 'The separator is a real separator with a value, minimum and maximum, so it is announced as a slider and moved with the arrows rather than only dragged.',
                markup: `
<div class="kp-split" data-kp-split>
<div class="kp-split__pane">
<p class="kp-fw-semibold">Applications</p>
<p>Example Inc</p>
<p>Second Ltd</p>
</div>
<div class="kp-split__separator" role="separator" tabindex="0" aria-orientation="vertical" aria-valuemin="10" aria-valuemax="90" aria-valuenow="50" aria-label="Resize the panes"></div>
<div class="kp-split__pane">
<p class="kp-fw-semibold">Example Inc</p>
<p>Applied on 4 September; interview on the eleventh.</p>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: 'vertical separator', what: 'The default: two panes side by side, the separator moving left and right.' },
            { name: 'horizontal', what: 'The same control stacked, for an editor above its output.' },
            { name: 'collapsing', what: 'A double click on the separator can put a pane away and bring it back.' },
            { name: 'step / large step', what: 'How far one arrow press moves the divider, and how far a Page key does.' },
            { name: 'focused separator', what: 'It takes the focus ring inside its own edge, because a two-pixel bar has no room for a ring outside it.' },
        ],
        accessibility: [
            'Built in — the separator is in the tab order and the arrows move it, which is the half a drag-only splitter leaves out.',
            'Built in — each move is an event carrying the new percentage, so a consumer can store the arrangement.',
            'Yours — write the separator role with its value, minimum and maximum, and name it.',
            'Yours — decide what happens below a narrow width; two panes on a phone are two half-columns.',
            'Yours — keep both panes usable at their extremes, or set bounds that stop the reader from erasing one.',
        ],
    },
    {
        id: 'page-shell',
        title: 'Page shell',
        group: 'Structure',
        classes: ['kp-footer', 'kp-error'],
        exports: [],
        intro: 'The two pieces every application has and nobody designs: the footer under the content, and the page that says something went wrong.',
        whenToUse:
            'The footer wherever a page needs a quiet closing line — a version, a licence, a link to the source. The error page for the states a server returns rather than for a failed action inside a working page, which is an alert. Do not put navigation a reader needs only in the footer.',
        examples: [
            {
                title: 'An error page',
                why: 'A message, not a wall: the destructive colour names the failure in the heading, and the explanation stays in the ordinary ink at a readable measure.',
                markup: `
<div class="kp-error">
<h1>404</h1>
<p>This page does not exist. It may have been renamed, or the link may be older than the page.</p>
<a class="kp-button" href="#page-shell">Back to the start</a>
</div>
`,
            },
            {
                title: 'A footer',
                why: 'Quiet ink over a rule, with the page’s own outer distance, so it closes the page rather than starting a new region.',
                markup: `
<footer class="kp-footer">kp-themes · twenty-four themes, one set of tokens</footer>
`,
            },
        ],
        variants: [
            { name: '.kp-error', what: 'A centred column at a readable measure, with room above it.' },
            { name: '.kp-error h1', what: 'The heading in the destructive colour: the one place a whole page names a failure.' },
            { name: '.kp-footer', what: 'A rule above, quiet ink, and the same outer distance as the page.' },
        ],
        accessibility: [
            'Built in — the error heading takes a colour measured against the page, so it is not a red that only just reads.',
            'Yours — say what happened and what to do next; a number on its own is a code, not a message.',
            'Yours — send the right status from the server as well. The page is what the reader sees; the status is what everything else reads.',
            'Yours — use the footer element itself, so it is announced as one.',
        ],
    },
    {
        id: 'visually-hidden',
        title: 'Visually hidden',
        group: 'Structure',
        classes: ['kp-sr-only'],
        exports: [],
        intro: 'Text that is not drawn and is still announced. It is for the things a page says by looking, which are silent to anyone who is not looking.',
        whenToUse:
            'For a name a control needs but the layout cannot show, and for a change that is obvious on screen and silent otherwise. Not to hide anything a sighted reader also needs, and never to bury text for a search engine: this class is a promise that the words are true.',
        examples: [
            {
                title: 'A name for a control that shows a glyph',
                why: 'The word is read out and takes no room; the glyph is marked decorative so it is not announced beside it.',
                markup: `
<button type="button" class="kp-button kp-button--ghost"><span aria-hidden="true">⌫</span><span class="kp-sr-only">Remove this filter</span></button>
<label class="kp-sr-only" for="doc-hidden-search">Search applications</label>
<input class="kp-field__input" id="doc-hidden-search" type="search" placeholder="Search…" />
`,
            },
        ],
        variants: [
            { name: '.kp-sr-only', what: 'The only state. It keeps the text in the document and out of the picture: one pixel, clipped, and never with display taken away, which would take it out of the reading too.' },
        ],
        accessibility: [
            'Built in — the text stays in the accessibility tree; nothing here is hidden from a screen reader.',
            'Built in — the file input under an upload zone uses this rather than being hidden away, which is what keeps it in the tab order.',
            'Yours — prefer visible words. Hidden text is unread by everyone who is looking at the screen.',
            'Yours — do not put a focusable control inside it unless it becomes visible when focused, as the skip link does.',
        ],
    },
    {
        id: 'idmark',
        title: 'Identity mark',
        group: 'Data',
        classes: ['kp-idmark', 'kp-idmark-group', 'kp-idmark-name'],
        exports: [],
        intro: 'A small plate made from a name, so a company or a stack is found in a list before its name is read: two letters on a wash of one of the theme’s five chart colours, or (`--pattern`) a mirrored 5 by 5 pattern. The same name gives the same mark on every page. js/idmark.js (`idmarkFor`, `idmarkColours`, `setIdmark`, `attachIdmarks`) fills every `[data-kp-idmark]`.',
        whenToUse: 'Beside the name of a company, a stack or a person in a list, a header or a cell. It is decoration: the name always stands beside it.',
        examples: [
            {
                title: 'Letters, a pattern and a group',
                why: 'Marks inside one `data-kp-idmark-set` never share a colour while one of the five is free.',
                markup: `
<div data-kp-idmark-set>
<span class="kp-idmark-name"><span class="kp-idmark" data-kp-idmark="Acme Logistics" aria-hidden="true"></span><span>Acme Logistics</span></span>
<span class="kp-idmark-name"><span class="kp-idmark kp-idmark--sm kp-idmark--pattern" data-kp-idmark="media" aria-hidden="true"></span><span>media</span></span>
<span class="kp-idmark-group" role="img" aria-label="Acme, Contoso and 7 more"><span class="kp-idmark kp-idmark--round" data-kp-idmark="Acme" aria-hidden="true"></span><span class="kp-idmark kp-idmark--round" data-kp-idmark="Contoso" aria-hidden="true"></span><span class="kp-idmark-group__more" aria-hidden="true">+7</span></span>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-idmark--xs / --sm / --lg / --xl', what: 'Sizes 20, 24, 44 and 56 px around the 32 px default; extra small shows one letter.' },
            { name: '.kp-idmark--pattern / --round / --glyph', what: 'The pattern instead of letters; a round plate; a small corner shape picked by the name.' },
            { name: 'data-kp-idmark-hue="free"', what: 'A hue of its own from the name, on the lightness and strength of the first chart colour.' },
            { name: 'aria-current / data-kp-idmark-selected', what: 'The current one in a list: a ring kept off its neighbours by a halo.' },
            { name: '.kp-idmark.kp-skeleton.kp-skeleton--block', what: 'Loading: the plate’s own shape, drawn as the theme draws a waiting block.' },
        ],
        accessibility: ['Built in — the mark is hidden from a screen reader.', 'Yours — always put the name beside it, and name a group in words.'],
    },
    {
        id: 'stackbar',
        title: 'Share bar',
        group: 'Data',
        classes: ['kp-stackbar'],
        exports: [],
        intro: 'One bar split into the parts of a whole, in the chart colours, the free rest as the track, with a legend that gives every part its exact value. js/stackbar.js (`setStackbar`, `stackbarParts`, `attachStackbars`) draws it from a list; every part has a hover card, the arrow keys walk them, and `kp-stackbar-pick` names a pressed part.',
        whenToUse: 'For what fills a disk, a budget or a quota. For one share of a whole use the meter; for shares over time use the chart.',
        examples: [
            {
                title: 'From a spec in the markup',
                why: 'A page that draws later calls `setStackbar(el, spec)`; `state` is `loading`, `empty` or `error`, each at the bar’s height.',
                markup: `
<figure class="kp-stackbar" data-kp-stackbar='{"title":"Root volume","total":120,"parts":[{"label":"Docker images","value":41},{"label":"Volumes","value":18.5},{"label":"Logs","value":6.5}]}'></figure>
`,
            },
        ],
        variants: [
            { name: '.kp-stackbar--sm / --lg', what: 'An 8 px or a 20 px bar around the 12 px default.' },
            { name: 'other, marks', what: 'Parts under a share merged into “Other”; ticks across the bar at a share.' },
            { name: 'over the whole', what: 'Parts adding up past the total: the bar is their sum, a ▸ at its end, “Over by …” in the legend.' },
        ],
        accessibility: ['Built in — the bar is a group of parts, each named with its value and share; one tab stop, arrow keys within.', 'Built in — the legend holds every exact value.'],
    },
    {
        id: 'bullets',
        title: 'Bullet rows',
        group: 'Data',
        classes: ['kp-bullets'],
        exports: [],
        intro: 'Rows of a value against a threshold: a lead, the label and a detail, a meter whose tick is the threshold, and the exact figure; worst first. js/bullets.js (`setBullets`, `bulletTone`, `attachBullets`); loading lays the data table’s busy card over waiting rows; a failed list has a Retry (`kp-bullets-retry`).',
        whenToUse: 'Days since the last contact against a limit, a backup’s age, days to an expiry. For one value use the meter.',
        examples: [
            {
                title: 'From a spec in the markup',
                why: 'Past the threshold the warning tone, past `bad` the destructive one.',
                markup: `
<div class="kp-bullets" data-kp-bullets='{"threshold":14,"bad":21,"rows":[{"key":"a","label":"Data engineer","detail":"due since 02/10/2026","value":22,"lead":"Acme"},{"key":"b","label":"Project lead","value":9,"lead":"Contoso"}]}'></div>
`,
            },
        ],
        variants: [
            { name: 'href / pick', what: 'A row that is a link, or a button that fires `kp-bullets-pick`; its press area is the whole row.' },
            { name: 'value: null', what: 'Nothing to measure: a dash and no bar, the row keeping its height.' },
        ],
        accessibility: ['Built in — each meter reads its figure and the threshold.', 'Yours — say in the card what the threshold is.'],
    },
    {
        id: 'kv',
        title: 'Key-value grid',
        group: 'Data',
        classes: ['kp-kv'],
        exports: [],
        intro: 'A read-only list of facts: `dl.kp-kv` with `div.kp-kv__row` rows of a `dt` and a `dd`. The label column is as wide as the longest label and every value starts on one edge.',
        whenToUse: 'The facts about one thing: a host, a release, a message. For editable settings use the form rows.',
        examples: [
            {
                title: 'With lines',
                why: 'Values reuse the package: `.kp-id`, `.kp-copyable`, `.kp-badge`, `.kp-ago`.',
                markup: `
<dl class="kp-kv kp-kv--lines">
<div class="kp-kv__row"><dt>Host</dt><dd>pve-01</dd></div>
<div class="kp-kv__row" data-kp-changed><dt>Retention</dt><dd>30 days</dd></div>
<div class="kp-kv__row"><dt>Image digest</dt><dd><span class="kp-kv__none">—<span class="kp-sr-only">not known</span></span></dd></div>
</dl>
`,
            },
        ],
        variants: [
            { name: '.kp-kv--lines / --stack / --columns', what: 'A hairline between rows; each label over its value; lists side by side where there is room.' },
            { name: 'data-kp-changed / data-kp-state="error"', what: 'A dot after the label; a red rule on the row’s start edge.' },
            { name: '.kp-kv__wait', what: 'A waiting line one text line high with the theme’s skeleton in it.' },
        ],
        accessibility: ['Built in — a real description list.', 'Yours — give an unknown value its words for a screen reader.'],
    },
    {
        id: 'formrows',
        title: 'Form rows',
        group: 'Forms',
        classes: ['kp-formrows', 'kp-formrow'],
        exports: [],
        intro: 'A settings form as rows: the label, the package’s own control with its help or error under it, and an aside for where the value comes from or an Edit button. The label column is as wide as the longest label; under 36rem each row reads top to bottom.',
        whenToUse: 'A settings page or a long form of independent values.',
        examples: [
            {
                title: 'Two rows',
                why: 'Mark a changed row with `data-kp-changed`, a failed one with `data-kp-state="error"`, a locked one with `data-kp-locked`.',
                markup: `
<div class="kp-formrows kp-formrows--lines">
<div class="kp-formrow" data-kp-changed><label class="kp-formrow__label" for="doc-ret">Retention<small>backup.retention_days</small></label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ret" value="30" /><p class="kp-field__help">Days of nightly copies to keep.</p></div><div class="kp-formrow__aside">Not saved</div></div>
<div class="kp-formrow" data-kp-locked><label class="kp-formrow__label" for="doc-dir">Data folder</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-dir" value="/srv/data" disabled /></div><div class="kp-formrow__aside"><span class="kp-formrow__lock">Set at install</span></div></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-formrows--lines', what: 'A hairline between rows.' },
            { name: '.kp-formrow--top / --wide', what: 'The label at the top for a tall control; the control takes the aside’s column too.' },
        ],
        accessibility: ['Built in — the label is a real label.', 'Yours — tie help and errors to the control with aria-describedby.'],
    },
    {
        id: 'code',
        title: 'Code block',
        group: 'Data',
        classes: ['kp-code'],
        exports: [],
        intro: 'A payload, a request or a snippet: a head with its title, what it is and its tools (Pretty and Raw for JSON, Wrap, Copy), and the text in the mono face. js/code.js (`setCode`, `prettyJson`, `attachCodes`) fills every `[data-kp-code]`; loading lays the busy card, empty, binary and failed say so at the body’s height.',
        whenToUse: 'A message body, an HTTP request, a command to copy. For a running log use the log; for a change use the diff.',
        examples: [
            {
                title: 'A JSON payload',
                why: '`data-kp-code-max` folds a long block with “Show all N lines”; `data-kp-code-lines` adds line numbers.',
                markup: `
<figure class="kp-code" data-kp-code data-kp-code-title="Payload" data-kp-code-language="JSON" data-kp-code-lines><pre class="kp-code__body"><code>{"topic":"backup.done","ok":true,"volumes":["media","photos"]}</code></pre></figure>
`,
            },
        ],
        variants: [
            { name: 'data-kp-code-wrap / -max / -layout', what: 'Wrapped from the start; folded past N lines; Raw instead of Pretty.' },
            { name: 'state', what: '`loading`, `empty`, `binary` (with `size`) and `error`.' },
            { name: 'truncated', what: '`{ shown, total }`: the foot says only the start was sent.' },
        ],
        accessibility: ['Built in — the body is a named region that takes focus, so a keyboard can scroll it; a copy is announced.', 'Built in — line numbers are never copied or read.'],
    },
];
