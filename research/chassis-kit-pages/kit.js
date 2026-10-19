// research/chassis-kit-pages/kit.js: the redesigned chassis-rs kit pages as pure functions, data in, markup out.
//
// Every function here is what a chassis-rs template will become: a page of the kit is the shell (navigation bar, palette,
// tab bar) around a body made only of kp-themes 11.0.0 parts. The data is what the running example service answered
// (captured.js, chassis-rs 3.8.0, 2026-10-19); where the capture holds fewer rows than a page needs to be judged (it has 3 clients,
// no problems, no passkeys: a plain HTTP service answers none) sample.js adds rows of the SAME shape and says so on the page.
import { THEMES } from '../../js/theme-registry.js';
import { CAPTURED } from './captured.js';
import { SAMPLE, NOW } from './sample.js';

/** The captured data first, the sample rows after it. */
export const DATA = {
    status: CAPTURED.status,
    healthz: CAPTURED.healthz,
    requests: CAPTURED.requests,
    clientsInfo: CAPTURED.clients,
    clients: [...CAPTURED.clients.clients, ...SAMPLE.clients],
    capturedClients: CAPTURED.clients.clients.length,
    passkeys: SAMPLE.passkeys,
    problems: SAMPLE.problems,
    uptime: SAMPLE.uptime,
};

export { NOW };

/* -------------------------------------------------------------------------------------------- small helpers -- */

/** @param {unknown} s */
export const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

const BRUSSELS = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Brussels',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

/** dd/mm/yyyy HH:mm, 24 hours, Brussels: the one date format of the kit (UI_PRINCIPLES, rule 52). @param {string | number} when */
export function fmt(when) {
    const p = Object.fromEntries(BRUSSELS.formatToParts(new Date(when)).map((x) => [x.type, x.value]));
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

/** How long ago, in exact words: 12 s, 2 min, 3 h, 5 days. @param {string | number} when */
export function agoWords(when) {
    const s = Math.max(0, Math.round((NOW - new Date(when).getTime()) / 1000));
    if (s < 60) return `${s} s ago`;
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
    const d = Math.floor(s / 86400);
    return `${d} ${d === 1 ? 'day' : 'days'} ago`;
}

/** A moment `seconds` ago, for a ticking freshness line (the one place the demo reads the real clock: the line counts from it). @param {number} seconds */
export const agoStamp = (seconds) => new Date(Date.now() - seconds * 1000).toISOString();

/** A duration in words: 10 h 2 min. @param {number} ms */
export function span(ms) {
    const m = Math.floor(ms / 60000);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    if (h < 48) return `${h} h ${m % 60} min`;
    return `${Math.floor(h / 24)} days ${h % 24} h`;
}

/** The days since a moment. @param {string | null} when */
export const daysSince = (when) => (when ? Math.floor((NOW - new Date(when).getTime()) / 86400000) : null);

/**
 * What a client is, for the list and the filters: one word, never colour alone. `idle` is no call for 30 days, a client that
 * was issued 30 days ago and never called included; `new` is issued less than 30 days ago and not called yet.
 * @param {any} c
 */
export function clientState(c) {
    if (!c.active) return 'revoked';
    if (!c.last_used_at) return (daysSince(c.issued_at) ?? 0) >= 30 ? 'idle' : 'new';
    return (daysSince(c.last_used_at) ?? 0) >= 30 ? 'idle' : 'in use';
}

/** Days without a call: since the last one, or since the token was issued. @param {any} c */
export const idleDays = (c) => daysSince(c.last_used_at ?? c.issued_at) ?? 0;

/** @param {any[]} clients */
export function clientCounts(clients) {
    const count = (/** @type {string} */ s) => clients.filter((c) => clientState(c) === s).length;
    return {
        all: clients.length,
        active: clients.filter((c) => c.active).length,
        inUse: count('in use'),
        idle: count('idle'),
        fresh: count('new'),
        revoked: count('revoked'),
    };
}

const ICON = {
    messages: '<path d="M4 5h16v11H8l-4 4z"/>',
    status: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    clients: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.4 3.5 5.2"/>',
    passkeys: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v4M15 12v3"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
};
/** @param {keyof typeof ICON} name */
const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

/** The kit's navigation: what a service declares (`nav`) plus the kit's own pages. */
export const NAV = [
    { id: 'messages', label: 'Messages', href: '/', keys: 'g m', hint: 'The service’s own page' },
    { id: 'status', label: 'Status', href: '/status', keys: 'g s', hint: 'Version, health and updates' },
    { id: 'clients', label: 'Clients', href: '/clients', keys: 'g c', hint: 'The programs that call this service' },
    { id: 'passkeys', label: 'Passkeys', href: '/passkeys', keys: 'g p', hint: 'Ways to sign in' },
];

/* --------------------------------------------------------------------------------------------------- shell -- */

/** @param {string} uid */
function themeMenu(uid) {
    const items = THEMES.map(
        (t) =>
            `<li><button type="button" data-kp-theme="${esc(t.name ?? t)}"><span class="kp-swatch" data-theme="${esc(t.name ?? t)}"></span>${esc(t.label ?? t.name ?? t)}</button></li>`,
    ).join('');
    return `<span class="kp-theme-menu"><button type="button" class="kp-icon-button" popovertarget="${uid}-theme" aria-label="Choose a theme" style="anchor-name: --${uid}-theme"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.6-10-8.6z"/></svg></button><div popover="auto" id="${uid}-theme" class="kp-popover" style="position-anchor: --${uid}-theme"><ul class="kp-menu" data-kp-theme-picker aria-label="Choose a theme">${items}</ul></div></span>`;
}

/**
 * The navigation bar: the brand, the service's links (folded behind More when they do not fit), the search that opens the
 * palette, the theme menu and Log out. `anonymous` is the login page: a brand and the theme menu only.
 * @param {string} uid @param {{ active?: string, anonymous?: boolean, paletteId?: string }} o
 */
export function navBar(uid, { active = '', anonymous = false, paletteId = '' } = {}) {
    const links = anonymous
        ? ''
        : `<ul class="kp-nav__links">${NAV.map(
              (n) => `<li><a class="kp-nav__link" href="#${n.id}"${n.id === active ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`,
          ).join('')}</ul>`;
    const search =
        anonymous || !paletteId
            ? ''
            : `<div class="kp-nav__search"><button type="button" class="kp-nav__search-trigger" aria-label="Search" data-kp-palette-open="${paletteId}">${svg('search')}<span class="ck-search-word">Search</span> <kbd class="kp-palette__keys" data-kp-palette-keys></kbd></button></div>`;
    const logout = anonymous ? '' : `<button type="button" class="kp-button ck-logout">Log out</button>`;
    return `<div class="kp-nav-wrap"><nav class="kp-nav" ${anonymous ? '' : 'data-kp-nav-fold'} aria-label="Main"><a class="kp-nav__brand" href="#top">inbox</a>${links}${search}${themeMenu(uid)}${logout}</nav></div>`;
}

/**
 * The command palette: places to go, what this page can do, and one entry per client for the things done most.
 * @param {string} uid @param {{ open?: boolean, page?: string, hotkey?: boolean }} o
 */
export function palette(uid, { open = false, page = 'clients', hotkey = false } = {}) {
    const opt = (/** @type {string} */ value, /** @type {string} */ label, /** @type {string} */ hint = '', /** @type {string} */ keys = '', words = '') =>
        `<li class="kp-palette__option" role="option" data-kp-option data-value="${esc(value)}"${words ? ` data-kp-words="${esc(words)}"` : ''}>${esc(label)}${hint ? `<span class="kp-palette__description">${esc(hint)}</span>` : ''}${keys ? `<kbd class="kp-palette__keys" data-kp-keys="${esc(keys)}">${esc(keys)}</kbd>` : ''}</li>`;
    const group = (/** @type {string} */ label, /** @type {string[]} */ items) =>
        `<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">${esc(label)}</span><ul role="group" aria-label="${esc(label)}">${items.join('')}</ul></li>`;
    const active = DATA.clients.filter((c) => c.active);
    const groups = [
        group('Go to', NAV.map((n) => opt(`go-${n.id}`, n.label, n.hint, n.keys))),
        ...(page === 'clients'
            ? [
                  group('This page', [opt('issue', 'Issue a client', 'Give a new program its own token', 'n'), opt('filter-idle', 'Show idle clients', 'Not used for 30 days or more', '', 'unused stale old')]),
                  group('Manage a client', active.slice(0, 5).map((c) => opt(`manage-${c.id}`, `Manage ${c.name}`, `Last used ${c.last_used_at ? agoWords(c.last_used_at) : 'never'}`))),
                  group('Send a test', active.slice(0, 3).map((c) => opt(`test-${c.id}`, `Send a test to ${c.name}`, 'One request through the service’s own test route'))),
              ]
            : []),
        group('This service', [opt('refresh', 'Refresh the status', 'Read health and version again', 'r'), opt('updates', 'Check for updates', 'Look for a newer release')]),
        group('Account', [opt('theme', 'Choose a theme'), opt('logout', 'Log out')]),
    ];
    return `<dialog class="kp-palette" data-kp-palette${hotkey ? ' data-kp-hotkey="k"' : ' data-kp-hotkey="none"'} id="${uid}-palette" aria-label="Search and commands"${open ? ' open' : ''}>
  <input class="kp-palette__input" type="text" role="combobox" aria-label="Search and commands" aria-expanded="${open}" aria-controls="${uid}-palette-list" autocomplete="off" placeholder="Go to a page, or do something…" />
  <ul class="kp-palette__list" id="${uid}-palette-list" role="listbox" aria-label="Search and commands">${groups.join('')}</ul>
  <p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>`;
}

/** The shortcut sheet, from the chords the shell registers. @param {string} uid @param {boolean} open */
export function shortcutSheet(uid, open = true) {
    const row = (/** @type {string} */ keys, /** @type {string} */ what) => `<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">${esc(keys)}</kbd></dt><dd>${esc(what)}</dd></div>`;
    return `<dialog class="kp-shortcuts" data-kp-shortcuts data-kp-hotkey="none" id="${uid}-sheet" aria-label="Keyboard shortcuts"${open ? ' open' : ''}>
  <h2 class="kp-dialog__title">Keyboard shortcuts</h2>
  <section class="kp-shortcuts__group"><h3 class="kp-shortcuts__group-label">Go to a page</h3><dl class="kp-shortcuts__list">${NAV.map((n) => row(n.keys, n.label)).join('')}</dl></section>
  <section class="kp-shortcuts__group"><h3 class="kp-shortcuts__group-label">Anywhere</h3><dl class="kp-shortcuts__list">${row('Ctrl K', 'Search and commands')}${row('?', 'Show this sheet')}${row('r', 'Refresh the page’s data')}</dl></section>
  <section class="kp-shortcuts__group"><h3 class="kp-shortcuts__group-label">On Clients</h3><dl class="kp-shortcuts__list">${row('n', 'Issue a client')}${row('/', 'Search the list')}</dl></section>
</dialog>`;
}

/**
 * The tab bar of a phone: the service's areas within thumb reach, and More for the rest. Counts are exact.
 * @param {string} uid @param {{ active?: string, counts?: Record<string, number | null>, more?: boolean }} o
 */
export function tabBar(uid, { active = '', counts = {}, more = false } = {}) {
    const tab = (/** @type {typeof NAV[number]} */ n) => {
        const c = counts[n.id];
        return `<a class="kp-tabbar__tab" href="#${n.id}" data-kp-tab="${n.id}"${n.id === active ? ' aria-current="page"' : ''}><span class="kp-tabbar__icon">${svg(/** @type {keyof typeof ICON} */ (n.id))}</span><span class="kp-tabbar__label">${esc(n.label)}</span>${c ? `<span class="kp-badge kp-tabbar__badge">${c}</span>` : ''}</a>`;
    };
    return `<nav class="kp-tabbar kp-tabbar--always kp-tabbar--static ck-tabbar" id="${uid}-tabbar" aria-label="Areas">${NAV.slice(0, 3).map(tab).join('')}<button type="button" class="kp-tabbar__tab kp-tabbar__tab--more" data-kp-dialog="${uid}-more"><span class="kp-tabbar__icon kp-tabbar__icon--more" aria-hidden="true"></span><span class="kp-tabbar__label">More</span></button></nav>
<dialog class="kp-drawer kp-dialog" id="${uid}-more" aria-labelledby="${uid}-more-title"${more ? ' open' : ''}>
  <header class="kp-drawer__head"><h2 class="kp-dialog__title" id="${uid}-more-title">More</h2><button type="button" class="kp-icon-button kp-dialog__close" data-kp-dialog-close aria-label="Close">×</button><p class="kp-drawer__desc">The pages you need less often, and your session.</p></header>
  <div class="kp-drawer__body"><div class="kp-menu kp-menu--rich" role="group" aria-label="More">
    <a class="kp-menu__item" href="#passkeys"${active === 'passkeys' ? ' aria-current="page"' : ''}><span class="kp-menu__label">Passkeys</span><span class="kp-menu__hint">Ways to sign in</span></a>
    <button type="button" class="kp-menu__item"><span class="kp-menu__label">Choose a theme</span><span class="kp-menu__hint">Colours and feel of this dashboard</span></button>
    <button type="button" class="kp-menu__item"><span class="kp-menu__label">Log out</span><span class="kp-menu__hint">End this session on this browser</span></button>
  </div></div>
</dialog>`;
}

/**
 * One page of the kit in its shell: bar, a connection banner slot, the page, and on a phone the tab bar.
 * @param {string} uid @param {string} active @param {string} body
 * @param {{ tabs?: Record<string, number | null>, hotkey?: boolean, anonymous?: boolean, page?: string }} o
 */
export function app(uid, active, body, { tabs = {}, hotkey = false, anonymous = false, page = active } = {}) {
    return `<div class="ck-app" id="${uid}-app">
${navBar(uid, { active, anonymous, paletteId: `${uid}-palette` })}
${anonymous ? '' : `<div class="kp-connection" data-kp-connection data-kp-connection-source="app" data-kp-retry-delays="off"></div>`}
<main class="kp-page ck-main" id="${uid}-main">${body}</main>
${anonymous ? '' : palette(uid, { page, hotkey }) + tabBar(uid, { active, counts: tabs })}
</div>`;
}

/* ----------------------------------------------------------------------------------------------- page header -- */

/**
 * The header row: title and one sentence on the left, the freshness trio under them, one primary and at most two
 * secondary actions on the right, the rest behind More.
 * @param {string} uid @param {{ title: string, about: string, fresh?: boolean, actions?: string, more?: string[] }} o
 */
export function header(uid, { title, about, fresh = false, actions = '', more = [] }) {
    const trio = fresh
        ? `<div class="ck-fresh"><div class="kp-refresh" data-kp-refresh="30" data-kp-remember="${uid}-refresh" data-kp-look="menu" data-kp-refresh-choices="0,15,30,60"></div></div>`
        : '';
    const menu = more.length
        ? `<div class="kp-menu-button" data-kp-menu-button data-kp-key="${uid}-more"><button type="button" class="kp-button">More ▾</button><div class="kp-menu kp-menu--rich" role="menu" aria-label="More actions" hidden><div class="kp-menu__group" role="group" aria-label="More actions">${more
              .map((m) => {
                  const [label, hint] = m.split('|');
                  return `<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" data-kp-value="${esc(label)}"><span class="kp-menu__label">${esc(label)}</span><span class="kp-menu__hint">${esc(hint)}</span></button>`;
              })
              .join('')}</div></div></div>`
        : '';
    return `<header class="kp-ops__head kp-page-header"><div class="kp-page-header__inner"><div><h1 class="kp-page-header__title">${esc(title)}</h1><p class="kp-page-header__description">${esc(about)}</p>${trio}</div><div class="kp-page-header__actions">${actions}${menu}</div></div></header>`;
}

/** A flash button: spinner while it works, a short word after, a refusal as one line under it, one width throughout. */
export function flashButton(label, { words = '', kind = '', attrs = '' } = {}) {
    return `<button type="button" class="kp-button${kind ? kind.split(' ').map((k) => ` kp-button--${k}`).join('') : ''}" data-kp-flash-button${words ? ` data-kp-flash-words="${esc(words)}"` : ''} ${attrs}>${esc(label)}</button>`;
}
