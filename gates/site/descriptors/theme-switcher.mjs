// Page descriptor for the "theme-switcher" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const themeSwitcherDescriptor = {
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
            'Put one in the page’s header when the reader picks their own theme. To preview a theme in one corner of a page, use the preview option, or let an element wear a theme by carrying the theme attribute, which is what the swatch beside each option does — and do not put it in a settings form behind a save button: the choice applies the moment it is made, so a form around it promises something it does not do.',
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
            {
                title: 'A picker that previews on hover',
                why: '`data-kp-theme-preview="hover"` shows each theme while the pointer is on its button; the real choice is still the press.',
                markup: `
<div data-kp-theme-picker data-kp-theme-preview="hover">
<button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span> Formal</button>
<button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span> Dark</button>
</div>
<p data-kp-theme-status hidden></p>
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
            { name: 'data-kp-theme-preview="hover"', what: 'The picker previews a theme while the pointer or focus is on its option and goes back when it leaves (also `attachThemePickers(root, { preview })`); `data-kp-theme-preview-target` names the element that wears the preview (default: the root). The event `kp-theme-preview` says which, and the root carries `data-theme-preview-from` while it lasts. `previewTheme`, `endPreview` and `previewedTheme` do it from code, and `currentTheme()` answers the real theme meanwhile. A preview inside a menu ends when the menu closes and the menu does not replay its entrance.' },
            { name: 'in a form row', what: 'A theme button takes its baseline from its name; the grouped picker puts the themes at the start edge and the Light or Dark word at the line’s end.' },
        ],
        accessibility: [
            'Built in — each option is a real button with a pressed state, so a screen reader says which theme is current without seeing the border.',
            'Built in — the check mark and the border are two carriers beside the colour, which is what DI4 asks for.',
            'Built in — in a menu the browser gives Escape, light dismiss and focus return, because the list is a popover rather than a hand-written dropdown.',
            'Built in — every word the picker itself speaks comes from the dictionary and can be replaced.',
            'Yours — give the menu button an accessible name; an icon on its own says nothing.',
            'Yours — write the options your server knows about. The module attaches behaviour to markup that is already there; it renders nothing on its own.',
        ],
    };
