// The six options of research/sidenav-minor, described once; build.mjs turns this
// into the frame pages and look.html.

/** The 16 themes, in the registry's order. */
export const THEMES = [
    'formal',
    'light',
    'dark',
    'cyberpunk',
    'synthwave',
    'pastel',
    'terminal',
    'forest',
    'blueprint',
    'solstice',
    'brutalism',
    'deco',
    'phantom',
    'grotesk',
    'nostromo',
    'titanium',
];

/**
 * @typedef {{ src: string, title: string, caption: string, phone?: boolean }} Win
 * @type {{ id: string, name: string, heading: string, how: string, title: string, blurb: string, attrs: string[], style?: string, scenes: string, extra?: string, actions?: boolean, leadFrame?: boolean, windows: Win[] }[]}
 */
export const OPTIONS = [
    {
        id: 'narrow',
        name: 'Width on a narrow screen',
        heading: 'On a phone the panel can be narrower.',
        how: 'The token --kp-sidenav-width-narrow, read while the panel is held as an over panel on a narrow screen.',
        title: 'narrow-screen width',
        blurb: 'On a phone the panel lies over the page, and it can be narrower than on a desk.',
        attrs: [],
        style: '--kp-sidenav-width: 20rem',
        scenes: 'over',
        windows: [
            {
                src: 'narrow.html?narrow=none',
                title: 'Without the token: an app page on a phone',
                caption: 'No token: the panel keeps its normal width, 20rem.',
                phone: true,
            },
            {
                src: 'narrow.html?narrow=13rem',
                title: 'With the token: an app page on a phone',
                caption: '--kp-sidenav-width-narrow: 13rem.',
                phone: true,
            },
        ],
    },
    {
        id: 'floating',
        name: 'Floating variant',
        heading: 'The panel floats off the edge.',
        how: 'data-kp-sidenav-variant="floating": a gap all round, the theme\'s radius, edge and shadow.',
        title: 'floating variant',
        blurb: 'The panel floats a little away from the edge of the window, as a card of its own.',
        attrs: ['data-kp-sidenav-variant="floating"'],
        scenes: 'push,gutter,over',
        windows: [{ src: 'floating.html', title: 'Floating: an app page with its side navigation', caption: 'Plays by itself. Now: ' }],
    },
    {
        id: 'inset',
        name: 'Inset variant',
        heading: 'The page becomes a card beside the panel.',
        how: 'data-kp-sidenav-variant="inset": the panel stays flush, the content is a rounded card.',
        title: 'inset variant',
        blurb: 'The page is a rounded card beside a panel that sits flush with the window.',
        attrs: ['data-kp-sidenav-variant="inset"'],
        scenes: 'push,gutter,over',
        windows: [{ src: 'inset.html', title: 'Inset: an app page with its side navigation', caption: 'Plays by itself. Now: ' }],
    },
    {
        id: 'peek',
        name: 'Peek strip',
        heading: 'A thin strip of the panel stays in view when it is shut.',
        how: "The token --kp-sidenav-peek (here 0.75rem): the page keeps that strip's room; over the page, the strip is the only part that overlaps.",
        title: 'peek strip',
        blurb: 'When the panel is shut, a thin strip of it stays at the edge of the window.',
        attrs: [],
        style: '--kp-sidenav-peek: 0.75rem',
        scenes: 'push,gutter,over',
        windows: [{ src: 'peek.html', title: 'Peek strip: an app page with its side navigation', caption: 'Plays by itself. Now: ' }],
    },
    {
        id: 'density',
        name: 'Density presets',
        heading: 'Compact, default and comfortable rows.',
        how: 'data-kp-sidenav-density="compact" or "comfortable": only the panel\'s own spacing and size tokens change.',
        title: 'density presets',
        blurb: 'The same panel in three densities: the rows are closer together or further apart.',
        attrs: [],
        scenes: 'over',
        windows: [
            { src: 'density.html?density=compact', title: 'Compact density', caption: 'compact' },
            { src: 'density.html?density=default', title: 'Default density', caption: 'default (nothing set)' },
            { src: 'density.html?density=comfortable', title: 'Comfortable density', caption: 'comfortable' },
        ],
    },
    {
        id: 'action',
        name: 'Action beside an item',
        heading: 'A small button beside a link.',
        how: 'A .kp-sidenav__row holds the link and a .kp-sidenav__action: reachable by Tab, its own focus ring, and it does not open the link.',
        title: 'action beside an item',
        blurb: 'Some rows carry a small button beside the link. Pressing it does not open the link.',
        attrs: [],
        scenes: 'push,over',
        extra: 'action',
        actions: true,
        leadFrame: true,
        windows: [
            {
                src: 'action.html',
                title: 'Action: an app page with its side navigation',
                caption: 'Plays by itself: the keyboard reaches a button, then it is pressed. Now: ',
            },
        ],
    },
];

/** How each theme opens its panel, and closes it as that backwards, in plain words. */
const EFFECT = {
    formal: 'is ruled in where it stands and ruled away again',
    light: 'comes out of a glare and goes back into it',
    dark: 'is laid in by a bright line that crosses it, and the line takes it away again',
    cyberpunk: 'glitches in and out in three jumps',
    synthwave: 'is uncovered from its foot behind a glowing beam, and covered again',
    pastel: 'is stuck on like a sticker and peeled off again',
    terminal: 'is printed line by line and cleared again',
    forest: 'grows out of its edge and shrinks back',
    blueprint: 'is traced in ink lines and untraced again',
    solstice: 'is kindled from the middle of its foot and sinks back',
    brutalism: 'drops on its hard shadow and is lifted off again',
    deco: 'arrives as a gilded plate and leaves the same way',
    phantom: 'is thrown on in three cuts and snatched away again',
    grotesk: 'falls in like the dialog and rises out again',
    nostromo: 'is scanned in by a beam and scanned out again',
    titanium: 'is cut open from the top and cut shut again',
};

/** What the edge of a card looks like in each theme. */
const EDGE = {
    formal: 'soft corners and a thin warm-grey line',
    light: 'soft corners and a thin grey line',
    dark: 'square corners and a thin dark line',
    cyberpunk: "square corners and a thin line in the theme's dim yellow",
    synthwave: 'almost square corners and a thin purple line',
    pastel: 'very round corners and a soft purple line',
    terminal: 'square corners and a thin green line',
    forest: 'round corners and a thin sand line',
    blueprint: 'nearly square corners and a thin blue line',
    solstice: 'round corners and a thin warm line',
    brutalism: 'square corners and a hard black shadow',
    deco: 'square corners and a thin gold-grey line',
    phantom: 'square corners and a thin grey line',
    grotesk: 'square corners and a thin black line',
    nostromo: 'round corners and a thin tan line',
    titanium: 'square corners and a thin steel line',
};

/** @type {Record<string, (theme: string) => string>} */
const LINE = {
    narrow: (t) =>
        `In ${t}, compare the two phones: with the token the panel is clearly narrower (13rem, against 20rem). The panel ${EFFECT[t]}, in the same time both ways. Every label stays readable.`,
    floating: (t) =>
        `In ${t} the panel floats a little off the edge, with ${EDGE[t]}. It ${EFFECT[t]}. Shut, nothing of it stays on the screen, not even a shadow. Watch all three ways it meets the page.`,
    inset: (t) =>
        `In ${t} the panel sits flat against the edge and the page is a card beside it, with ${EDGE[t]}. The panel ${EFFECT[t]}. Nothing dims, and nothing next to the panel covers the page.`,
    peek: (t) =>
        `In ${t}, when the panel is shut, a thin strip of it stays at the edge. Pushing, the page leaves room for the strip; over the page, only the strip overlaps. The panel ${EFFECT[t]}, and the strip never moves.`,
    density: (t) =>
        `In ${t}, compare the three panels: compact rows sit close together, comfortable rows sit further apart, and the middle one is as it always was. The text stays readable in all three.`,
    action: (t) =>
        `In ${t} some rows carry a small button beside the link. Watch the keyboard reach it and draw its own ring, then press it: the link does not open. The panel ${EFFECT[t]}.`,
};

export const LOOKS = Object.fromEntries(
    OPTIONS.map((option) => [option.id, Object.fromEntries(THEMES.map((theme) => [theme, LINE[option.id](theme)]))]),
);
