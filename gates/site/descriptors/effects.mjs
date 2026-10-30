// Page descriptor for the "effects" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const effectsDescriptor = {
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
    };
