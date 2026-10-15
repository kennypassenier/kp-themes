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

/** The spinner each theme draws (CHARACTER.md), for the running-job button. */
const SPIN = {
    formal: 'an arc ruled round a double ring',
    light: 'a bead that burns out and comes back',
    dark: 'the line running the ring',
    cyberpunk: 'the reticle locking on its core',
    synthwave: 'the sun setting',
    pastel: 'the caterpillar',
    terminal: 'the braille cell',
    forest: 'forest’s own spinner',
    blueprint: 'the compass',
    solstice: 'the sun’s arc',
    brutalism: 'the block tipped over',
    deco: 'the sunburst turning',
    phantom: 'the star that snaps and resolves',
    grotesk: 'the plate',
    nostromo: 'the tape reel',
    titanium: 'the facing cut',
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

/**
 * A phone: a frame that holds a mock page and the real tab bar. The bar is `--static` inside it and sits at the
 * frame's foot (the frame is its own positioning box), which is where a fixed bar stands on a real phone.
 * @param {{ id: string, caption: string, tabs: string[], dir?: string, label?: string, busyBar?: boolean, safe?: boolean, sheet?: boolean, note?: string }} o
 */
const phone = ({ id, caption, tabs, dir, label = 'Areas', busyBar = false, safe = false, sheet = false, note = '' }) => `
                    <figure class="tb-fig">
                        <div class="tb-phone${safe ? ' tb-phone--safe' : ''}"${dir ? ` dir="${dir}"` : ''} data-tb="${id}">
                            <div class="tb-page" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>${sheet ? `\n                            ${SHEET}` : ''}
                            <nav class="kp-tabbar kp-tabbar--always kp-tabbar--static" aria-label="${label}"${busyBar ? ' aria-busy="true"' : ''}>
                                ${tabs.join('\n                                ')}
                            </nav>
                        </div>
                        <figcaption>${caption}${note ? `<span>${note}</span>` : ''}</figcaption>
                    </figure>`;

const MORE_ITEMS = `<a class="kp-menu__item" href="#backups"><span class="kp-menu__label">Backups</span><span class="kp-menu__hint">Snapshots, restores and the nightly run</span></a>
                                    <a class="kp-menu__item" href="#system"><span class="kp-menu__label">System</span><span class="kp-menu__hint">The host, its disks and updates</span></a>
                                    <button type="button" class="kp-menu__item"><span class="kp-menu__label">Search or do anything</span><span class="kp-menu__hint">Pages, stacks and actions in one box</span></button>
                                    <button type="button" class="kp-menu__item"><span class="kp-menu__label">Help and the words</span><span class="kp-menu__hint">What a stack, a deploy or a snapshot is</span></button>`;

/** The More sheet drawn open inside a phone (the real one is the dialog below). */
const SHEET = `<div class="kp-drawer kp-dialog tb-sheet" role="group" aria-label="More, shown open">
                                <header class="kp-drawer__head"><h3 class="kp-dialog__title">More</h3><p class="kp-drawer__desc">The two areas you need less often, plus search and help.</p></header>
                                <div class="kp-drawer__body"><div class="kp-menu" role="group" aria-label="More">
                                    ${MORE_ITEMS}
                                </div></div>
                            </div>`;

/** The real More drawer a More tab opens. */
const DRAWER = `
        <dialog class="kp-drawer kp-dialog" id="tb-more" aria-labelledby="tb-more-title">
            <header class="kp-drawer__head">
                <h2 class="kp-dialog__title" id="tb-more-title">More</h2>
                <button type="button" class="kp-icon-button kp-dialog__close" data-kp-dialog-close aria-label="Close"></button>
                <p class="kp-drawer__desc">The two areas you need less often, plus search and help.</p>
            </header>
            <div class="kp-drawer__body"><div class="kp-menu" role="group" aria-label="More">
                ${MORE_ITEMS}
            </div></div>
        </dialog>`;

/* ------------------------------------------------------------------ the page */

const SECTIONS = `
            <section class="nf-sec" id="nav-fold" data-review-item="nav-fold" data-review-title="1 · A bar that folds behind More" data-review-components="nav-fold" aria-labelledby="h-nav-fold">
                <div class="nf-sec__head">
                    <p class="nf-num">1 · Top bar</p>
                    <h2 id="h-nav-fold">What does not fit goes behind More, and the bar never changes height.</h2>
                    <p class="nf-how"><code>data-kp-nav-fold</code> on the nav. Nothing else is written by hand: the More button and its menu are added by the script, and the menu is the package’s menu button.</p>
                </div>
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
            </section>

            <section class="nf-sec" id="tabbar" data-review-item="tabbar" data-review-title="2 · The bottom tab bar" data-review-components="tabbar badge" aria-labelledby="h-tabbar">
                <div class="nf-sec__head">
                    <p class="nf-num">2 · Bottom tab bar</p>
                    <h2 id="h-tabbar">Four areas within thumb reach, then More.</h2>
                    <p class="nf-how"><code>nav.kp-tabbar</code> of <code>.kp-tabbar__tab</code>s (icon over label, a count at the icon’s corner). The More tab is a <code>data-kp-dialog</code> button that opens the package’s drawer. Shown here inside phone frames with <code>kp-tabbar--always kp-tabbar--static</code>; the section below shows the real, fixed bar in a window of its own.</p>
                </div>
                <div class="nf-look" data-review-look>
${looks(
    (theme) =>
        `In ${theme}, look at the current tab in the first phone. ${TAB[theme]} Then press the tabs: the mark moves to the one you press. Check the count on Needs you (placed at the icon’s corner, the tab does not move when the count appears or goes), the busy tab (the theme’s spinner takes the icon’s place at the same size), the disabled tab, the long label (cut with an ellipsis, never wrapped), the loading bar (grey places, no links), and More opened (the sheet in the frame is the same drawer the More tab opens).`,
)}
                </div>
                <div class="tb-grid">${phone({
                    id: 'home',
                    caption: 'Home is current; Needs you has a count.',
                    tabs: [FOUR.home, FOUR.inbox({ count: 3 }), FOUR.overview(), FOUR.activity(), more()],
                    note: 'Press the tabs: the mark moves.',
                })}${phone({
                    id: 'inbox',
                    caption: 'Needs you is current; the count is 99+.',
                    tabs: [FOUR.homeIdle, FOUR.inbox({ count: '99+', current: true }), FOUR.overview(), FOUR.activity(), more()],
                })}${phone({
                    id: 'held',
                    caption: 'The current page is behind More: the More tab reads as current.',
                    tabs: [
                        FOUR.homeIdle,
                        FOUR.inbox({ count: 'dot' }),
                        FOUR.overview(),
                        FOUR.activity(),
                        more().replace('class="kp-tabbar__tab', 'aria-current="true" class="kp-tabbar__tab'),
                    ],
                    note: 'The dot on Needs you is an empty badge.',
                })}${phone({
                    id: 'sheet',
                    caption: 'More opened: the sheet is the drawer’s own content.',
                    tabs: [
                        FOUR.homeIdle,
                        FOUR.inbox({ count: 3 }),
                        FOUR.overview(),
                        FOUR.activity(),
                        more().replace('class="kp-tabbar__tab', 'aria-expanded="true" aria-current="true" class="kp-tabbar__tab'),
                    ],
                    sheet: true,
                })}${phone({
                    id: 'states',
                    caption: 'A tab waiting (busy), a disabled tab, a long label.',
                    tabs: [
                        FOUR.home,
                        FOUR.inbox({ busy: true }),
                        FOUR.overview({ disabled: true }),
                        tab({ id: 'logs', label: 'Notifications and logs', icon: 'logs' }),
                        more(),
                    ],
                    note: 'Busy and disabled tabs: the busy one is not a link to follow yet.',
                })}${phone({
                    id: 'loading',
                    caption: 'The bar loading: places, not links.',
                    tabs: [FOUR.home, FOUR.inbox({ count: 3 }), FOUR.overview(), FOUR.activity(), more()],
                    busyBar: true,
                })}${phone({
                    id: 'three',
                    caption: 'Three tabs share the width equally.',
                    tabs: [FOUR.home, FOUR.inbox({ count: 3 }), more()],
                })}${phone({
                    id: 'six',
                    caption: 'Six tabs, at 22rem: labels shrink to an ellipsis before anything wraps.',
                    tabs: [
                        FOUR.home,
                        FOUR.inbox({ count: 3 }),
                        FOUR.overview(),
                        FOUR.activity(),
                        tab({ id: 'logs', label: 'Logs', icon: 'logs' }),
                        more(),
                    ],
                })}${phone({
                    id: 'safe',
                    caption: 'Safe area: 1.25rem kept under the bar, as a home indicator needs.',
                    tabs: [FOUR.home, FOUR.inbox({ count: 3 }), FOUR.overview(), FOUR.activity(), more()],
                    safe: true,
                    note: 'Set by <code>--kp-tabbar-safe-bottom</code> here; a phone gives <code>env(safe-area-inset-bottom)</code>.',
                })}${phone({
                    id: 'rtl',
                    caption: 'Right to left: the order and the marks mirror.',
                    tabs: [FOUR.home, FOUR.inbox({ count: 3 }), FOUR.overview(), FOUR.activity(), more()],
                    dir: 'rtl',
                })}${phone({
                    id: 'tones',
                    caption: 'Every badge tone on a tab: success, info, warning, destructive.',
                    tabs: [
                        tab({ id: 'home', label: 'Home', icon: 'home', count: 2, tone: 'success', current: true }),
                        tab({ id: 'inbox', label: 'Needs you', icon: 'inbox', count: 4, tone: 'info' }),
                        tab({ id: 'overview', label: 'Overview', icon: 'overview', count: 5, tone: 'warning' }),
                        tab({ id: 'activity', label: 'Activity', icon: 'activity', count: 6, tone: 'destructive' }),
                        more(),
                    ],
                })}
                </div>
                <div class="tb-play">
                    <button type="button" class="kp-button kp-button--sm" data-tb-count>Add a count to Needs you</button>
                    <button type="button" class="kp-button kp-button--sm" data-tb-clear>Clear the count</button>
                    <button type="button" class="kp-button kp-button--sm" data-tb-busy>Toggle busy on Overview</button>
                    <button type="button" class="kp-button kp-button--sm" data-tb-focus>Show keyboard focus on Activity</button>
                    <span class="tb-play__note">These act on the first phone. The More tab of any phone opens the real drawer.</span>
                </div>
                <p class="nf-note">Pointing a tab and pressing it are the theme’s, and live: hover and press them. Contrast: a resting tab’s label is the muted ink, as a bar link is; where a theme’s muted ink is under 4.5:1 on the bar it is the theme’s own muted ink and is not changed here.</p>
            </section>

            <section class="nf-sec" id="live-button" data-review-item="live-button" data-review-title="3 · The running-job button" data-review-components="button" aria-labelledby="h-live">
                <div class="nf-sec__head">
                    <p class="nf-num">3 · Running job</p>
                    <h2 id="h-live">The dashboard’s pill is a button with the theme’s spinner in front.</h2>
                    <p class="nf-how"><code>kp-button kp-button--live</code> with a <code>kp-spinner kp-button__spin</code>, a <code>kp-button__short</code> and a <code>kp-button__long</code> label. No new look: it is the theme’s button, so it wears the theme’s button in every variant. It cuts a long label with an ellipsis, gives way to the short label in a container under 40rem, and <code>hidden</code> removes it without a gap.</p>
                </div>
                <div class="nf-look" data-review-look>
${looks(
    (theme) =>
        `In ${theme}, the spinner is ${SPIN[theme]} and the button around it is the theme’s own button in each of its seven variants (default, primary, secondary, ghost, destructive, small, large; the mirror one reads the other way). Check that the spinner sits centred on the text line, that the long label is cut with an ellipsis in the narrow-limit row, that the 22rem bar shows the short word instead of the long, and that the hidden button leaves no gap in the bar.`,
)}
                </div>
                <div class="lv-row">
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', '')}
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--primary')}
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary')}
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--ghost')}
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--destructive')}
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary kp-button--sm')}
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary kp-button--lg')}
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary kp-button--mirror')}
                </div>
                <div class="lv-row">
                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary', ' disabled')}
                    <span class="lv-cap">disabled</span>
                    ${LIVE_BUTTON('Restoring the media library from last night’s snapshot on the second backup disk · step 12 of 35 · 2 more waiting', 'Running +2', 'kp-button--secondary', '')}
                    <span class="lv-cap">a very long label, cut at 30rem with an ellipsis</span>
                </div>
                <div class="nf-grid">
                    <figure class="nf-fig">${bar({ id: 'live-wide', width: 'nf-w-xl', links: LINKS.few, live: true, label: 'Main with a running job' })}
                        <figcaption>In a wide bar: the long label.</figcaption></figure>
                    <figure class="nf-fig">${bar({ id: 'live-narrow', width: 'nf-w-xs', links: LINKS.few, live: true, label: 'Main with a running job, narrow' })}
                        <figcaption>In a bar under 40rem (22rem): the short word.</figcaption></figure>
                    <figure class="nf-fig">
                        <div class="nf-frame nf-w-m" data-nf="live-hidden">
                            <div class="kp-nav-wrap">
                                <nav class="kp-nav" aria-label="Main, no job">
                                    <span class="kp-nav__brand">Homelab</span>
                                    ${LIVE_BUTTON('Updating gateway · step 3 of 35', 'Running', 'kp-button--secondary kp-button--sm', ' hidden')}
                                    ${SEARCH}
                                </nav>
                            </div>
                        </div>
                        <figcaption>No job running: the button is <code>hidden</code> and the bar closes over it.</figcaption></figure>
                </div>
            </section>

            <section class="nf-sec" id="together" data-review-item="together" data-review-title="4 · Together, in a real window" data-review-components="tabbar nav-fold" aria-labelledby="h-together">
                <div class="nf-sec__head">
                    <p class="nf-num">4 · Together</p>
                    <h2 id="h-together">The dashboard’s shell in three real windows.</h2>
                    <p class="nf-how">Three pages in frames, each a window of its own width: the media queries answer to the frame, so this is what a phone, a tablet and a desktop get. The mock page behind is the demo’s; the top bar, the tab bar, the running-job button, the menu button and the drawer are the package’s.</p>
                </div>
                <div class="nf-look" data-review-look>
${looks(
    (theme) =>
        `In ${theme}, compare the three windows. Phone (22.5rem): the top bar keeps only the brand, the search box, the running-job button (its short word) and the theme; the areas are in the tab bar at the foot, fixed, with room kept under the last line of the page; pressing More opens the drawer. Tablet (48rem): the tab bar is the wide one (shown below 60rem) and the top bar has no links. Desktop (70rem): no tab bar, the top bar folds what does not fit behind More. ${TAB[theme]}`,
)}
                </div>
                <div class="tg-windows">
                    <figure class="tg-fig"><iframe class="tg-window tg-window--phone" src="app.html" title="The shell in a phone-sized window" loading="lazy"></iframe><figcaption>Phone, 22.5rem</figcaption></figure>
                    <figure class="tg-fig"><iframe class="tg-window tg-window--tablet" src="app.html" title="The shell in a tablet-sized window" loading="lazy"></iframe><figcaption>Tablet, 48rem</figcaption></figure>
                    <figure class="tg-fig"><iframe class="tg-window tg-window--desktop" src="app.html" title="The shell in a desktop-sized window" loading="lazy"></iframe><figcaption>Desktop, 70rem</figcaption></figure>
                </div>
            </section>`;

const demo = `<!doctype html>
<!-- Written by research/kpadopt-nav/build.mjs; edit build.mjs, demo.css and demo.js, not this file. -->
<html lang="en" data-theme="formal" data-cat-theme="formal" data-review="kpadopt-nav">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes: a folding top bar, a bottom tab bar and the running-job button</title>
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
                <h1>A folding top bar, a bottom tab bar and the running-job button</h1>
                <p>
                    Three things the homelab dashboard still draws by hand, built into the package so it can draw nothing itself. Everything inside the
                    frames is the package’s own classes and scripts (<code>kp-nav</code> with <code>data-kp-nav-fold</code>,
                    <code>kp-tabbar</code>, <code>kp-button--live</code>, the menu button and the drawer); the frames, the slider, the mock page behind
                    the phones and the buttons that play a state are this demo’s. Judge them in the review dialog (“Review in a dialog” at the top),
                    one theme at a time.
                </p>
                <p class="nf-motion" data-nf-motion hidden>
                    <b>Your system asks for reduced motion</b>, so the marks and menus appear without moving. Turn it off to judge the movement.
                </p>
            </header>
${SECTIONS}
        </main>${DRAWER}
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="demo.js"></script>
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
                <button type="button" class="kp-icon-button kp-dialog__close" data-kp-dialog-close aria-label="Close"></button>
                <p class="kp-drawer__desc">The two areas you need less often, plus search and help.</p>
            </header>
            <div class="kp-drawer__body"><div class="kp-menu" role="group" aria-label="More">
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
