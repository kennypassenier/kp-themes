// The colour pairs the contrast gate measures (gates/check-contrast.mjs): text pairs, large-text pairs, non-text pairs, the exemptions and the pairs that must differ.

// Application-pipeline status badges: text on a coloured plate.
export const STATUS_NAMES = ['draft', 'sent', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'];

export const PAIRS = [
    ['background', 'foreground'],
    ['card', 'card-foreground'],
    ['popover', 'popover-foreground'],
    ['primary', 'primary-foreground'],
    ['secondary', 'secondary-foreground'],
    ['muted', 'muted-foreground'],
    ['background', 'muted-foreground'],
    ['card', 'muted-foreground'],
    ['destructive', 'destructive-foreground'],
    ['success', 'success-foreground'],
    ['warning', 'warning-foreground'],
    ['info', 'info-foreground'],
    ['sidebar-background', 'sidebar-foreground'],
    ['sidebar-primary', 'sidebar-primary-foreground'],
    ['sidebar-accent', 'sidebar-accent-foreground'],
    ['background', 'primary'], // primary used as link text on the page bg
    ['background', 'destructive'], // the picker's "not saved" line is destructive text on the page
    ['fx-signal', 'fx-signal-foreground'], // TH15: the HUD signal plate carries text
    ['background', 'link'], // TH31: links, on the page and on a card
    ['card', 'link'],
    ['background', 'link-visited'],
    ['card', 'link-visited'],
    ['muted', 'foreground'], // TH32: code, pre and kbd sit on the muted surface
    ['card', 'code-keyword'], // fix-58: a code block's own two inks, read rather than only seen
    ['card', 'code-string'],
    ...STATUS_NAMES.map((s) => [`status-${s}`, `status-${s}-foreground`]),
    // TH116: the hero surface is a second ground with its own ink, second
    // ink, muted ink, button, alert and card. Every text pair a component
    // can form on it is measured like the app's [AR38].
    ['surface-hero-bg', 'surface-hero-fg'],
    ['surface-hero-bg', 'surface-hero-fg-2'],
    ['surface-hero-bg', 'surface-hero-muted'],
    ['surface-hero-bg', 'surface-hero-primary'], // the hero's link and button colour as text on the hero
    ['surface-hero-bg', 'surface-hero-danger'], // the alert as text on the hero
    ['surface-hero-primary', 'surface-hero-primary-foreground'],
    ['surface-hero-danger', 'surface-hero-danger-foreground'],
    ['surface-hero-card', 'surface-hero-card-foreground'],
    ['surface-hero-card', 'surface-hero-muted'], // muted ink on the hero card
];
// Accent surfaces carry large text/icons in this design system: 3:1.
export const LARGE_PAIRS = [['accent', 'accent-foreground']];

/**
 * Non-text pairs [TH15]: SC 1.4.11 asks 3:1 of graphical objects needed to
 * understand the content, and of the parts of a control that identify it.
 * A chart series nobody can see against the page is a graph with a missing
 * line; a HUD accent is a graphic, not prose.
 */
export const NON_TEXT_PAIRS = [
    ['surface-hero-bg', 'surface-hero-border'], // TH116: the hero's frame is a boundary on its ground (SC 1.4.11)

    ['background', 'fx-signal'],
    ['background', 'chart-1'],
    ['background', 'chart-2'],
    ['background', 'chart-3'],
    ['background', 'chart-4'],
    ['background', 'chart-5'],
    ['background', 'ring'],
    ['sidebar-background', 'sidebar-ring'],
];

/**
 * Colour tokens deliberately not measured here, each with its reason
 * [TH15, AR8]. The completeness check below refuses a token that is in
 * neither a pair list nor this one, so the next token someone adds cannot
 * be silently unmeasured — which is exactly how the nine pairs this
 * milestone closes came to be uncovered in the first place.
 */
/** @type {Record<string, string>} */
export const EXEMPT = {
    border: 'a hairline divider between areas of the same surface, not a control boundary — --border-strong is the one SC 1.4.11 applies to, and check-invariants.mjs holds it at 3:1 against all three surfaces',
    'sidebar-border': 'as --border',
    selected: 'a boundary, gated at 3:1 by check-invariants.mjs rather than here',
    'border-strong': 'gated at 3:1 by check-invariants.mjs',
    input: 'gated at 3:1 by check-invariants.mjs',
    'focus-ring': 'gated by check-invariants.mjs, which measures the pair and every surface it can land on (DI2)',
    'focus-ring-contrast': 'as --focus-ring',
    link: 'measured against background and card in PAIRS above',
    'link-visited': 'as --link',
    'color-scheme': 'not a colour',
    radius: 'not a colour',
    'kp-text-xs': 'not a colour (a length: one step of the typography scale) [TH94, R0-TYPO]',
    'kp-text-sm': 'not a colour (a length: one step of the typography scale) [TH94, R0-TYPO]',
    'kp-text-md': 'not a colour (a length: one step of the typography scale) [TH94, R0-TYPO]',
    'kp-text-display': 'not a colour (a length: the display step of the typography scale, a headline on a hero) [S47]',
    'kp-space-xs': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-sm': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-md': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-lg': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-xl': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-2xl': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'theme-font-body': 'not a colour',
    'theme-font-display': 'not a colour',
    'theme-font-mono': 'a font stack, not a colour; the mono face of the theme (the contract since 5.0.0, S47)',
    'fx-overprint':
        'a decorative second ink, drawn at 40% alpha behind a heading that carries its own --foreground; it is not a surface and nothing reads on it',
    'fx-scanline': 'a 1px line at 4% alpha across the texture layer; at that opacity it is a veil rather than a surface',
    'fx-hot':
        "the ink a theme that BRIGHTENS under pressure gives a hovered control, DI3's opt-out [S49, A9]. No pair here can measure it: which surface it lands on is the register's choice, and a theme whose register never opts in never paints it. The one register that does — terminal's, on its own plate — has the painted pair measured in the browser by tests/register-terminal.spec.mjs, which reads what is drawn rather than what a pair would predict.",
    'fx-hot-alarm': 'as --fx-hot, for the destructive control',
    'fx-notch': 'not a colour (a length)',
    'fx-lift': 'not a colour (how far a thing moves when it moves; 0 is a real answer)',
    'fx-shadow-offset': 'not a colour (a length: how far the hard shadow sits from its box; 0 paints nothing) [TH85]',
    'chart-pattern-1': 'not a colour (an image drawn over chart-1 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-2': 'not a colour (an image drawn over chart-2 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-3': 'not a colour (an image drawn over chart-3 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-4': 'not a colour (an image drawn over chart-4 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-5': 'not a colour (an image drawn over chart-5 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'kp-cat-1': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-2': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-3': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-4': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-5': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-6': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-7': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-8': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-9': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-10': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-11': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-12': 'a categorical colour [habits-1101]; contrast is advice, not a gate (Kenny, 2026-10-05): its reading against the ground is reported in research/habits-1101/README.md',
    'kp-cat-ink': 'the ink on a categorical fill [habits-1101], the ground itself; reported with the categorical colours in research/habits-1101/README.md',
    'fx-duration': 'not a colour',
    'fx-ease': 'not a colour',
};

/** @param {string} name @returns {string} */
/**
 * Pairs that must be far APART rather than readable, measured on the
 * generated stylesheet [Phase 7, G1].
 *
 * These live here rather than in check-invariants.mjs for a reason found
 * in the Phase 7 audit: that gate reads the token source, and these
 * tokens are derived, so the check it held for the visited link guarded
 * `theme.tokens['link-visited'] !== undefined` — which no theme declares.
 * The branch never ran. It sat green next to the real checks, which is
 * worse than not having it.
 *
 * Read from the artefact, they measure what a consumer actually receives,
 * however it got there — derived, authored, or hand-edited afterwards.
 *
 * @type {[string, string, number][]}
 */
export const DISTANCE_PAIRS = [
    ['link', 'link-visited', 12], // TH31: a visited link says something only if it looks different
    ['primary', 'primary-active', 10], // KT2: a pressed state you can see
    ['secondary', 'secondary-active', 10],
    ['accent', 'accent-active', 10],
    ['destructive', 'destructive-active', 10],
];
