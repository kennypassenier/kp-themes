// research/kpadopt-nav: writes demo.html and app.html from one description, so the demo has one source.
//
//   node research/kpadopt-nav/build.mjs
//
// Three components the homelab dashboard drew by hand and kp-themes did not have:
//   1. a top bar that folds what does not fit behind a More menu   (data-kp-nav-fold, js/nav-fold.js)
//   2. a bottom tab bar for phone widths                            (.kp-tabbar, js/tabbar.js)
//   3. the running-job button                                       (.kp-button--live)
// Everything on the page is the package's own classes; only the page around them (frames, a mock page
// behind the phone) is this demo's, in demo.css and frame.css.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** @param {string} text */
const esc = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

const THEMES = [
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

/** How each theme opens a menu under its button (CHARACTER.md, rule 3), for the More menu. */
const MENU = {
    formal: 'It is ruled open line by line, downward out of the button’s edge.',
    light: 'It comes into focus under the button.',
    dark: 'It is swept in from the button’s edge.',
    cyberpunk: 'It glitches in.',
    synthwave: 'It rises over its horizon.',
    pastel: 'It is stuck on beside the button.',
    terminal: 'It is printed a line at a time.',
    forest: 'It grows out of the button.',
    blueprint: 'It is drawn, the way the sheet is: constructed, then inked.',
    solstice: 'It is kindled under the button.',
    brutalism: 'It is dropped onto its footprint.',
    deco: 'Its inlay draws itself under the button and the lacquer comes up.',
    phantom: 'It is thrown from the button and resolves.',
    grotesk: 'It is printed by the colour bands.',
    nostromo: 'It strikes on like a tube.',
    titanium: 'It is cut open from the top.',
};

/** Whether the theme's register puts a caret after a bar link that opens something (`.kp-nav__link[aria-haspopup]`). */
const CARET = {
    formal: false,
    light: false,
    dark: true,
    cyberpunk: true,
    synthwave: true,
    pastel: true,
    terminal: true,
    forest: false,
    blueprint: true,
    solstice: true,
    brutalism: true,
    deco: true,
    phantom: true,
    grotesk: false,
    nostromo: false,
    titanium: true,
};

/** What the current tab looks like in each register, in one sentence. */
const TAB = {
    formal: 'A navy rule is ruled along the bar’s top edge over the current tab, at an even pace from the start; the labels are small capitals and the bar stands under a double rule. A press doubles the rule.',
    light: 'The current tab settles into a soft pill behind its icon, as if exposed; the bar floats on a soft shadow.',
    dark: 'A film line is laid along the top edge over the current tab, fading at both ends, with a chamfered wash under it; the count is chamfered.',
    cyberpunk: 'The current tab becomes a yellow notched plate with dark ink, acquired in three ticks, never eased; labels are mono capitals.',
    synthwave: 'A neon tube lights along the top edge over the current tab and its label glows; a press dips the tube; the count is a neon ring.',
    pastel: 'A strip of washi tape is stuck on the bar’s edge over the current tab, a hair off true, with one soft overshoot; hovering lifts a tab, a press sticks it down; the count is a sticker.',
    terminal:
        'The current tab is printed in reverse video in one step; hovering underlines the label like a cursor line; a press enters it in reverse.',
    forest: 'A short clay trail blaze grows down from the bar’s edge over the current tab; the paper bar is dashed from the page by a hairline.',
    blueprint:
        'The current tab is dimensioned: a witness line with end ticks is drawn under its label at the plotter’s feed; labels are mono capitals.',
    solstice: 'The sun is raised under the current tab: warm light comes up from the tab’s foot; labels are in the serif.',
    brutalism:
        'The current tab is a yellow slab with an ink border and a hard offset shadow; pointing lifts a tab off its footprint, a press drives it in.',
    deco: 'A gold line is drawn along the top edge from the centre to both sides and a jewel is set on it; the bar stands under a double rule; the count is a gold lozenge.',
    phantom: 'The current tab is a skewed red plate with black ink, thrown in from off the start edge in one shove; labels are condensed capitals.',
    grotesk:
        'A black baseline is drawn under the current tab’s label from the start; a press thickens it; the bar stands under a black rule; the count is the one red.',
    nostromo: 'Every tab is a key with its lamp: dark when idle, lit when current; a press pushes the key in; labels are tape capitals.',
    titanium:
        'The current tab is a chamfered accent plate (top-start and bottom-end cut) with a bright tool edge along its top, fed in from the start and slowing as it lands; counts are in the mono.',
};

/** @param {(theme: string) => string} text */
const looks = (text) => THEMES.map((theme) => `                    <p data-for="${theme}">${esc(text(theme))}</p>`).join('\n');

/* ------------------------------------------------------------------ the top bar */

/**
 * @param {string} label
 * @param {{ current?: boolean, count?: number, tone?: string, disabled?: boolean, keep?: boolean, menu?: [string, string][] }} [o]
 */
const link = (label, o = {}) => {
    const badge = o.count ? ` <span class="kp-badge${o.tone ? ` kp-badge--${o.tone}` : ''}">${o.count}</span>` : '';
    const keep = o.keep ? ' data-kp-nav-keep' : '';
    if (o.menu) {
        const items = o.menu.map(([text, href]) => `<li><a class="kp-nav__link" href="${href}">${text}</a></li>`).join('');
        return `<li${keep}><a class="kp-nav__link"${o.current ? ' aria-current="page"' : ''} href="#" aria-haspopup="true">${label}</a><ul class="kp-nav__menu">${items}</ul></li>`;
    }
    const aria = o.disabled ? ' aria-disabled="true"' : '';
    return `<li${keep}><a class="kp-nav__link"${o.current ? ' aria-current="page"' : ''}${aria} href="#">${label}${badge}</a></li>`;
};

const SEARCH = `<div class="kp-nav__search"><button type="button" class="kp-button kp-button--ghost kp-button--sm">Search</button></div>`;

/**
 * One bar. `links` are the items; `extra` goes after the brand (the toggle).
 * @param {{ id: string, width: string, links: string[], toggle?: boolean, dir?: string, label?: string, live?: boolean, tall?: boolean }} o
 */
const bar = ({ id, width, links, toggle = false, dir, label = 'Main', live = false, tall = false }) => `
                <div class="nf-frame ${width}${tall ? ' nf-frame--tall' : ''}"${dir ? ` dir="${dir}"` : ''} data-nf="${id}">
                    <div class="kp-nav-wrap">
                        <nav class="kp-nav" data-kp-nav-fold aria-label="${label}">
                            <span class="kp-nav__brand">Homelab</span>${toggle ? '\n                            <button type="button" data-kp-nav-toggle class="kp-nav__toggle"></button>' : ''}
                            <ul class="kp-nav__links">
                                ${links.join('\n                                ')}
                            </ul>${live ? `\n                            ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary kp-button--sm')}` : ''}
                            ${SEARCH}
                        </nav>
                    </div>
                </div>`;

const LINKS = {
    plain: [
        link('Home', { current: true }),
        link('Needs you'),
        link('Overview'),
        link('Activity'),
        link('Stacks'),
        link('Logs'),
        link('Backups'),
        link('System'),
        link('Settings'),
    ],
    counter: [
        link('Home'),
        link('Needs you', { count: 3, tone: 'destructive' }),
        link('Overview'),
        link('Activity'),
        link('Stacks'),
        link('Logs'),
        link('Backups'),
        link('System'),
        link('Settings'),
    ],
    behind: [
        link('Home'),
        link('Needs you'),
        link('Overview'),
        link('Activity'),
        link('Stacks'),
        link('Logs'),
        link('Backups'),
        link('System', { current: true }),
        link('Settings'),
    ],
    rich: [
        link('Home'),
        link('Needs you', { count: 3, tone: 'destructive' }),
        link('Overview'),
        link('Activity'),
        link('Stacks', {
            menu: [
                ['All stacks', '#stacks'],
                ['Gateway', '#gateway'],
                ['Media', '#media'],
            ],
        }),
        link('Logs'),
        link('Backups', { disabled: true }),
        link('System', { current: true }),
        link('Settings'),
    ],
    keep: [
        link('Home'),
        link('Needs you'),
        link('Overview'),
        link('Activity'),
        link('Stacks'),
        link('Logs'),
        link('Backups'),
        link('System'),
        link('Settings', { current: true, keep: true }),
    ],
    few: [link('Home', { current: true }), link('Needs you'), link('Overview')],
};

/* ------------------------------------------------------------------ the live button */

/**
 * @param {string} long
 * @param {string} short
 * @param {string} [cls]
 * @param {string} [attrs]
 */
function LIVE_BUTTON(long, short, cls = 'kp-button--secondary', attrs = '') {
    return `<button type="button" class="kp-button ${cls} kp-button--live"${attrs}><span class="kp-spinner kp-button__spin" aria-hidden="true"></span><span class="kp-button__short">${short}</span><span class="kp-button__long">${long}</span></button>`;
}

/* ------------------------------------------------------------------ the tab bar */

const ICON = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M14 14h7v7h-7z"/></svg>',
    inbox: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h4l2 3h4l2-3h4"/><path d="M5 5h14l1 8v6H4v-6z"/></svg>',
    overview: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
    activity: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>',
    logs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16"/><path d="M4 10h16"/><path d="M4 15h10"/><path d="M4 20h7"/></svg>',
};

/**
 * @param {{ id: string, label: string, icon: keyof typeof ICON, current?: boolean, count?: number | string, tone?: string, disabled?: boolean, busy?: boolean, hiddenBadge?: boolean }} t
 */
const tab = (t) => {
    const count = t.count !== undefined ? String(t.count) : '';
    const badge =
        t.count !== undefined || t.hiddenBadge
            ? `<span class="kp-badge kp-tabbar__badge${t.tone ? ` kp-badge--${t.tone}` : ''}"${t.hiddenBadge ? ' hidden' : ''}>${count === 'dot' ? '' : count}</span>`
            : '';
    const attrs = [t.current ? 'aria-current="page"' : '', t.disabled ? 'aria-disabled="true"' : '', t.busy ? 'aria-busy="true"' : '']
        .filter(Boolean)
        .join(' ');
    const spin = t.busy ? '<span class="kp-spinner" aria-hidden="true"></span>' : ICON[t.icon];
    return `<a class="kp-tabbar__tab" href="#${t.id}" data-kp-tab="${t.id}"${attrs ? ` ${attrs}` : ''}><span class="kp-tabbar__icon">${spin}</span><span class="kp-tabbar__label">${t.label}</span>${badge}</a>`;
};

/**
 * The plain statement of what Kenny should see and what each control should do (Kenny, 2026-10-16: "Zet in de volgende
 * demo nog eens duidelijk wat je verwacht"). One per section, beside the per-theme look-at text.
 * @param {string} html
 */
const expected = (html) => `<div class="nf-expect"><p><b>Expected:</b></p>${html}</div>`;

/** @param {string} drawer the id of the dialog the tab opens */
const more = (drawer = 'tb-more') =>
    `<button type="button" class="kp-tabbar__tab kp-tabbar__tab--more" data-kp-dialog="${drawer}"><span class="kp-tabbar__icon kp-tabbar__icon--more" aria-hidden="true"></span><span class="kp-tabbar__label">More</span></button>`;

const FOUR = {
    home: tab({ id: 'home', label: 'Home', icon: 'home', current: true }),
    homeIdle: tab({ id: 'home', label: 'Home', icon: 'home' }),
    inbox: (/** @type {Partial<Parameters<typeof tab>[0]>} */ o = {}) => tab({ id: 'inbox', label: 'Needs you', icon: 'inbox', ...o }),
    overview: (/** @type {Partial<Parameters<typeof tab>[0]>} */ o = {}) => tab({ id: 'overview', label: 'Overview', icon: 'overview', ...o }),
    activity: (/** @type {Partial<Parameters<typeof tab>[0]>} */ o = {}) => tab({ id: 'activity', label: 'Activity', icon: 'activity', ...o }),
};

const MORE_ITEMS = `<a class="kp-menu__item" href="#backups"><span class="kp-menu__label">Backups</span><span class="kp-menu__hint">Snapshots, restores and the nightly run</span></a>
                                    <a class="kp-menu__item" href="#system"><span class="kp-menu__label">System</span><span class="kp-menu__hint">The host, its disks and updates</span></a>
                                    <button type="button" class="kp-menu__item"><span class="kp-menu__label">Search or do anything</span><span class="kp-menu__hint">Pages, stacks and actions in one box</span></button>
                                    <button type="button" class="kp-menu__item"><span class="kp-menu__label">Help and the words</span><span class="kp-menu__hint">What a stack, a deploy or a snapshot is</span></button>`;

/* ------------------------------------------------------------------ the page */

const SECTIONS = `
            <section class="nf-sec" id="nav-fold" data-review-item="nav-fold" data-review-themes="phantom" data-review-title="1 · A bar that folds behind More" data-review-components="nav-fold" aria-labelledby="h-nav-fold">
                <div class="nf-sec__head">
                    <p class="nf-num">1 · Top bar</p>
                    <h2 id="h-nav-fold">What does not fit goes behind More, and the bar never changes height.</h2>
                    <p class="nf-how"><code>data-kp-nav-fold</code> on the nav. Nothing else is written by hand: the More button and its menu are added by the script, and the menu is the package’s menu button.</p>
                </div>
                ${expected(`<ul>
                    <li>Drag the slider above the first bar: the links that do not fit leave the bar from the end and are listed behind a <b>More</b> button; the bar stays one row tall at every width (at 18rem the brand gives way to an ellipsis before anything wraps), and nothing jumps when a link folds. The More button is always inside the bar, after the links that stay and before Search.</li>
                    <li>Press <b>More</b> (or the button under the “More opened” bar): a menu hangs from its left edge (its right edge in the right-to-left bar), straight under the button, wherever it is on the page, with the folded links; picking an entry follows its link, <b>Escape</b> closes the menu and the focus is back on More.</li>
                    <li>The opened menu stands on phantom’s own plate, on the page and in the review dialog alike: the dark ground, the red edge on its left, the cut corner and its red fold, a degree and a half askew; nothing of the page reads through it.</li>
                    <li>The three-link bar at 26rem has no More at all. The bar that keeps Settings (<code>data-kp-nav-keep</code>) keeps it however narrow it gets.</li>
                    <li>Tab through a bar: the links that stay, then More, then Search. Folded links are skipped.</li>
                </ul>`)}
                <div class="nf-look" data-review-look>
${looks(
    (theme) =>
        `In ${theme}, drag the slider and watch the first bar: the links that do not fit fold from the end behind More, one after the other, and the bar stays one row tall at every width (nothing jumps when a link folds). ${CARET[theme] ? 'More wears the theme’s caret for a link that opens something.' : 'More has no caret in this theme; it marks a menu link by its word alone, as the theme’s own dropdown links do.'} Open it (the second row shows it open): ${MENU[theme]} The entry for the current page is marked as the theme marks a current link; a group heading stands over the Stacks links; Backups stays in the list, greyed, with its reason under it. Compare the five widths: the same links fold in the same order.`,
)}
                </div>
                <div class="nf-liveset">
                    <label class="nf-slider"><span>Width of the first bar</span><input type="range" min="18" max="64" step="1" value="46" data-nf-slider="nf-live" /><output data-nf-out="nf-live">46rem</output></label>
${bar({ id: 'nf-live', width: 'nf-w-live', links: LINKS.plain })}
                </div>
                <div class="nf-grid">
                    <figure class="nf-fig">${bar({ id: 'w-xl', width: 'nf-w-xl', links: LINKS.plain })}
                        <figcaption>64rem: with the theme’s own letters, some fit, some already fold.</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'w-l', width: 'nf-w-l', links: LINKS.plain })}
                        <figcaption>46rem</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'w-m', width: 'nf-w-m', links: LINKS.plain })}
                        <figcaption>34rem</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'w-s', width: 'nf-w-s', links: LINKS.plain })}
                        <figcaption>26rem: only the first links stay.</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'few', width: 'nf-w-s', links: LINKS.few })}
                        <figcaption>Three links at 26rem: everything fits, More is not drawn and takes no room.</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'behind', width: 'nf-w-m', links: LINKS.behind })}
                        <figcaption>The current page (System) is behind More: the button reads as the current item of the bar (<code>aria-current="true"</code>).</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'counter', width: 'nf-w-m', links: LINKS.counter, label: 'Main with a counter' })}
                        <figcaption>Needs you carries a count (3), as a bar link does.</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'counter-s', width: 'nf-w-s', links: LINKS.counter, label: 'Main with a counter, narrow' })}
                        <figcaption>The counter is behind More: a dot on the button, announced to a screen reader; the entry reads “Needs you · 3”.</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'keep', width: 'nf-w-s', links: LINKS.keep, label: 'Main with a kept link' })}
                        <figcaption><code>data-kp-nav-keep</code> on Settings: it stays in the bar however narrow it gets; the others fold around it.</figcaption></figure>
                </div>
                <div class="nf-grid nf-grid--tall">
                    <figure class="nf-fig">${bar({ id: 'open', width: 'nf-w-m', links: LINKS.rich, tall: true, label: 'Main, More open' })}
                        <figcaption>More opened: a link with a dropdown becomes a named group, a counter reads “Needs you · 3”, Backups is greyed with its reason, the current page is marked. <button type="button" class="kp-button kp-button--sm" data-nf-open="open">Open it again</button></figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'focus', width: 'nf-w-m', links: LINKS.plain, label: 'Main, focus on More' })}
                        <figcaption>Keyboard focus on More: the theme’s ring. Tab into the bar to see the order: the links that stay, then More, then Search; the folded links are out of the order. <button type="button" class="kp-button kp-button--sm" data-nf-focus="focus">Show focus</button></figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'rtl', width: 'nf-w-m', links: LINKS.plain, dir: 'rtl', label: 'Main, right to left' })}
                        <figcaption>Right to left: the links fold from the left, More sits at the end (the left), and the menu hangs from it.</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'toggle', width: 'nf-w-s', links: LINKS.plain, toggle: true, label: 'Main with the phone toggle' })}
                        <figcaption>A bar that also has the phone toggle: below 40rem the toggle’s own collapse wins, as before, and the fold stands down (More is not drawn).</figcaption></figure>
                </div>
                <p class="nf-note">Not shown: loading. The fold has no loading state of its own; the More menu shows the menu button’s loading entry when a page fills it that way. Hovering a link is the theme’s, and not repeated here.</p>
            </section>`;

const demo = `<!doctype html>
<!-- Written by research/kpadopt-nav/build.mjs; edit build.mjs, demo.css and demo.js, not this file. -->
<html lang="en" data-theme="formal" data-cat-theme="formal" data-review="kpadopt-nav">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes: the folding top bar in phantom, still open</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <link rel="stylesheet" href="../../css/formal-register.css" data-kp-register="formal" />
        <link rel="stylesheet" href="demo.css" />
    </head>
    <body>
        <main class="nf-page">
            <header class="nf-intro">
                <h1>The folding top bar in phantom, still open</h1>
                <p>
                    Round 5. Kenny approved the folding bar in cyberpunk and grotesk and the shell in grotesk, so only phantom’s folding bar is
                    left. Its opened More menu had no plate in the review dialog: phantom makes a list inside a dialog bare, and the review dialog is
                    a dialog. The More menu now keeps phantom’s own plate there too: the dark ground, the red edge, the cut corner and its red fold,
                    the same as phantom’s menus everywhere else. Everything inside the frames is the package’s own (<code>kp-nav</code> with
                    <code>data-kp-nav-fold</code>, the menu button); the frames and the slider are this demo’s. Judge it in the review dialog
                    (“Review in a dialog” at the top).
                </p>
                <p class="nf-motion" data-nf-motion hidden>
                    <b>Your system asks for reduced motion</b>, so the marks and menus appear without moving. Turn it off to judge the movement.
                </p>
            </header>
${SECTIONS}
        </main>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="demo.js"></script>
        <!-- Round five (2026-10-16): only the one pair Kenny has not approved (research/kpadopt-nav/VERDICTS.json): the folding bar in
             phantom. The approved sections and themes are gone from the page; gates/check-rereview.mjs refuses a page that offers an
             approved pair. -->
        <script type="application/json" data-review-round>
            { "round": "2026-10-16-r5", "received": ["2026-10-16-r2", "2026-10-16-r4"], "reopen": ["phantom|nav-fold"] }
        </script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

/** The page the three windows of the last section show: the dashboard's shell. */
const app = `<!doctype html>
<!-- Written by research/kpadopt-nav/build.mjs; edit build.mjs, not this file. -->
<html lang="en" data-theme="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Homelab shell</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <link rel="stylesheet" href="../../css/formal-register.css" data-kp-register="formal" />
        <link rel="stylesheet" href="frame.css" />
    </head>
    <body class="app-body">
        <div class="kp-nav-wrap app-top">
            <nav class="kp-nav" data-kp-nav-fold aria-label="Main">
                <span class="kp-nav__brand">Homelab</span>
                <ul class="kp-nav__links">
                    ${LINKS.counter.join('\n                    ')}
                </ul>
                ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary kp-button--sm')}
                <div class="kp-nav__search"><button type="button" class="kp-button kp-button--ghost kp-button--sm">Search</button></div>
            </nav>
        </div>
        <main class="app-main">
            <header class="kp-page-header"><div class="kp-page-header__inner"><div><h1 class="kp-page-header__title">Home</h1><p class="kp-page-header__description">Everything is running; three things need you.</p></div></div></header>
            <div class="app-cards">
                <article class="kp-card"><h2 class="kp-card__title">Gateway</h2><div class="kp-card__body"><p>Updating, step 3 of 35.</p></div></article>
                <article class="kp-card"><h2 class="kp-card__title">Media</h2><div class="kp-card__body"><p>Healthy. Last backup 02:10.</p></div></article>
                <article class="kp-card"><h2 class="kp-card__title">Backups</h2><div class="kp-card__body"><p>Next run tonight at 02:00.</p></div></article>
                <article class="kp-card"><h2 class="kp-card__title">System</h2><div class="kp-card__body"><p>Two updates are waiting.</p></div></article>
            </div>
            <p class="app-last">The last line of the page: it must stay clear of the tab bar.</p>
        </main>
        <nav class="kp-tabbar kp-tabbar--wide" aria-label="Areas">
            ${[FOUR.home, FOUR.inbox({ count: 3 }), FOUR.overview(), FOUR.activity(), more()].join('\n            ')}
        </nav>
        <dialog class="kp-drawer kp-dialog" id="tb-more" aria-labelledby="tb-more-title">
            <header class="kp-drawer__head">
                <h2 class="kp-dialog__title" id="tb-more-title">More</h2>
                <button type="button" class="kp-icon-button kp-dialog__close" data-kp-dialog-close aria-label="Close">×</button>
                <p class="kp-drawer__desc">The two areas you need less often, plus search and help.</p>
            </header>
            <div class="kp-drawer__body"><div class="kp-menu kp-menu--rich" role="group" aria-label="More">
                ${MORE_ITEMS}
            </div></div>
        </dialog>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="frame.js"></script>
    </body>
</html>
`;

writeFileSync(join(here, 'demo.html'), demo);
writeFileSync(join(here, 'app.html'), app);
console.log('wrote demo.html and app.html');
