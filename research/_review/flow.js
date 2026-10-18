// The review flow (kit-flow-1018): what happens after the last open step of a part, and the "Tonight" playlist that
// walks every open part. Everything here is a per-viewer OPTION (localStorage, try/catch, switchable at runtime on the
// Agenda); the verdicts and the journal are never read or written here. A part page calls `leave` where it used to go
// straight back to the Agenda, `arrive` once it is loaded and `inScope` while it looks for the next open step; the
// Agenda publishes its order with `publishAgenda` and starts a run with `startRun`.
//
// Options (defaults):
//   after   'agenda' | 'next'    where the last open step goes: back to the Agenda, or on to the next part (agenda)
//   tonight boolean              the "Tonight" playlist entry on the Agenda (false)
//   order   'part' | 'theme'     the playlist order (part)
//   chips   boolean              reason chips on a reject (true)

const OPTIONS_KEY = 'kp-flow-options-v1';
const AGENDA_KEY = 'kp-flow-agenda-v1';
const RUN_KEY = 'kp-flow-run-v1';
const CHAIN_KEY = 'kp-flow-chain-v1';
export const OPTIONS_EVENT = 'kp-flow-options';
export const LEAVE_MS = 2000;

/** @typedef {{ id: string, label: string, href: string, themes: string[] }} Entry  an open part on the Agenda */
/** @typedef {{ id: string, label: string, href: string, theme?: string }} Visit  one stop of a run */
/** @typedef {{ mode: 'part' | 'theme', queue: Visit[], pos: number }} Run */

const DEFAULTS = Object.freeze({ after: 'agenda', tonight: false, order: 'part', chips: true });
const AGENDA = new URL('../../catalogue/agenda.html', import.meta.url).href;

/* ------------------------------------------------------------ storage */

const read = (/** @type {Storage | undefined} */ area, /** @type {string} */ key) => {
    try {
        return JSON.parse(area?.getItem(key) ?? 'null');
    } catch {
        return null;
    }
};
const write = (/** @type {Storage | undefined} */ area, /** @type {string} */ key, /** @type {unknown} */ value) => {
    try {
        if (value === null) area?.removeItem(key);
        else area?.setItem(key, JSON.stringify(value));
    } catch {
        /* storage blocked or full: the option stays at what it was; nothing else depends on it */
    }
};
const local = () => {
    try {
        return localStorage;
    } catch {
        return undefined;
    }
};
const session = () => {
    try {
        return sessionStorage;
    } catch {
        return undefined;
    }
};

/* ------------------------------------------------------------ options */

/** The options now, every missing or invalid value at its default. */
export function options() {
    const stored = read(local(), OPTIONS_KEY) || {};
    return {
        after: stored.after === 'next' ? 'next' : DEFAULTS.after,
        tonight: typeof stored.tonight === 'boolean' ? stored.tonight : DEFAULTS.tonight,
        order: stored.order === 'theme' ? 'theme' : DEFAULTS.order,
        chips: typeof stored.chips === 'boolean' ? stored.chips : DEFAULTS.chips,
    };
}

/** Sets one option; every listener on this page (and, by `storage`, on other tabs) hears it. */
export function setOption(/** @type {keyof typeof DEFAULTS} */ name, /** @type {string | boolean} */ value) {
    write(local(), OPTIONS_KEY, { ...options(), [name]: value });
    document.dispatchEvent(new CustomEvent(OPTIONS_EVENT));
}

/** Calls back whenever an option changes, here or in another tab. @returns {() => void} */
export function onOptions(/** @type {() => void} */ listener) {
    const storage = (/** @type {StorageEvent} */ e) => e.key === OPTIONS_KEY && listener();
    document.addEventListener(OPTIONS_EVENT, listener);
    addEventListener('storage', storage);
    return () => {
        document.removeEventListener(OPTIONS_EVENT, listener);
        removeEventListener('storage', storage);
    };
}

/** The stylesheet of the flow's parts, once. */
export function loadStyle() {
    const href = new URL('flow.css', import.meta.url).href;
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => /** @type {HTMLLinkElement} */ (l).href === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.append(link);
}

/* ------------------------------------------------------------- Agenda */

/** The Agenda's open parts in its order, kept for the part pages. @param {Entry[]} entries */
export const publishAgenda = (entries) => write(local(), AGENDA_KEY, entries);
/** @returns {Entry[]} */
const publishedAgenda = () => {
    const list = read(local(), AGENDA_KEY);
    return Array.isArray(list) ? list.filter((e) => e && typeof e.id === 'string' && typeof e.href === 'string') : [];
};

/** The Agenda was reached: no run and no chain goes on from here. */
export function endAll() {
    write(session(), RUN_KEY, null);
    write(session(), CHAIN_KEY, null);
}

/**
 * Starts the Tonight run over the open parts. Order by part: one stop per part, in Agenda order. Order by theme: one
 * stop per part-and-theme with something open, theme after theme in the registry's order, the parts of a theme in
 * Agenda order. @param {Entry[]} entries @param {'part' | 'theme'} mode @param {string[]} themeOrder
 * @returns {string | null} the first stop's address
 */
export function startRun(entries, mode, themeOrder) {
    /** @type {Visit[]} */
    let queue;
    if (mode === 'theme') {
        const themes = [...new Set([...themeOrder, ...entries.flatMap((e) => e.themes)])];
        queue = themes.flatMap((theme) =>
            entries.filter((e) => e.themes.includes(theme)).map((e) => ({ id: e.id, label: e.label, href: e.href, theme })),
        );
        queue.push(...entries.filter((e) => !e.themes.length).map((e) => ({ id: e.id, label: e.label, href: e.href })));
    } else queue = entries.map((e) => ({ id: e.id, label: e.label, href: e.href }));
    if (!queue.length) return null;
    write(session(), CHAIN_KEY, null);
    write(session(), RUN_KEY, { mode, queue, pos: 0 });
    return queue[0].href;
}

/* ---------------------------------------------------------- part page */

let demo = '';
/** A part page names itself once. */
export const init = (/** @type {string} */ id) => {
    demo = id;
    loadStyle();
};

/** The run, when this page is its current stop. @returns {Run | null} */
function activeRun() {
    const run = read(session(), RUN_KEY);
    return run && Array.isArray(run.queue) && run.queue[run.pos]?.id === demo ? run : null;
}

/** Whether a step belongs to what the page is asked now: in a run by theme, only the stop's theme. */
export function inScope(/** @type {string | null | undefined} */ stepTheme) {
    const run = activeRun();
    const theme = run?.mode === 'theme' ? run.queue[run.pos].theme : '';
    return !theme || !stepTheme || stepTheme === theme;
}

/**
 * The next stop after this page: the next of the run, else (option "next part") the next part on the Agenda that still
 * has open pairs, after this one first and never one already visited in this chain. @returns {{ href: string, label: string, theme?: string } | null}
 */
function nextStop(/** @type {boolean} */ advance) {
    const run = activeRun();
    if (run) {
        const stop = run.queue[run.pos + 1];
        if (advance && stop) write(session(), RUN_KEY, { ...run, pos: run.pos + 1 });
        return stop || null;
    }
    if (options().after !== 'next') return null;
    const chain = read(session(), CHAIN_KEY) || { visited: [] };
    const visited = new Set([...(chain.visited || []), demo]);
    const list = publishedAgenda();
    const at = list.findIndex((e) => e.id === demo);
    const stop = [...list.slice(at + 1), ...list.slice(0, Math.max(at, 0))].find((e) => !visited.has(e.id));
    if (advance) write(session(), CHAIN_KEY, { visited: [...visited], pending: stop?.id || '' });
    return stop || null;
}

/**
 * The page was loaded. A stop with nothing open left in its scope (judged in another tab since the Agenda was read) is
 * passed at once. @param {{ anyOpen: boolean, themeOpen: (theme: string) => boolean }} state
 * @returns {boolean} true when the page is being left
 */
export function arrive({ anyOpen, themeOpen }) {
    const run = activeRun();
    const chain = read(session(), CHAIN_KEY);
    const theme = run?.mode === 'theme' ? run.queue[run.pos].theme : '';
    const empty = run ? (theme ? !themeOpen(theme) : !anyOpen) : chain?.pending === demo && !anyOpen;
    if (chain?.pending === demo && !run) write(session(), CHAIN_KEY, { ...chain, pending: '' });
    if (!empty) return false;
    const stop = nextStop(true);
    location.replace(stop ? stop.href : AGENDA);
    if (!stop) endAll();
    return true;
}

/** @type {HTMLElement | null} */
let line = null;

/**
 * The last open step of the part is judged. With a run on, or the option "next part", the page shows for 2 s that it is
 * going on and that Esc goes back to the Agenda; the caller has written its journal before. Without either it does
 * nothing and the caller goes back to the Agenda as before. @returns {boolean} true when this took over
 */
export function leave() {
    const stop = nextStop(true);
    if (!stop) {
        endAll();
        return false;
    }
    loadStyle();
    line?.remove();
    line = document.createElement('div');
    line.className = 'kf-leave';
    line.setAttribute('role', 'status');
    line.innerHTML = `
        <p class="kf-leave__text"><span data-kf-next></span> <span class="kf-leave__esc"><kbd>Esc</kbd>: back to the Agenda</span></p>
        <button type="button" class="kp-button kp-button--sm" data-kf-back>Back to the Agenda</button>
        <span class="kf-leave__bar" aria-hidden="true"></span>`;
    /** @type {HTMLElement} */ (line.querySelector('[data-kf-next]')).textContent = `Next: ${stop.label}${stop.theme ? ` in ${stop.theme}` : ''}.`;
    document.body.append(line);
    const toAgenda = () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', onKey, true);
        endAll();
        location.assign(AGENDA);
    };
    const onKey = (/** @type {KeyboardEvent} */ e) => {
        if (e.key !== 'Escape') return;
        e.preventDefault();
        e.stopPropagation();
        toAgenda();
    };
    document.addEventListener('keydown', onKey, true);
    /** @type {HTMLElement} */ (line.querySelector('[data-kf-back]')).addEventListener('click', toAgenda);
    const timer = setTimeout(() => {
        document.removeEventListener('keydown', onKey, true);
        location.assign(stop.href);
    }, LEAVE_MS);
    return true;
}
