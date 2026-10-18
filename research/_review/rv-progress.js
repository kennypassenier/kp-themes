// The review kit's progress options: a "remaining" line in the dialog and "Continue" where Kenny left off (his
// proposals list, 2026-10-18: "maak zelf ook voorstellen om dit hele proces te optimaliseren").
//
// Two options of the kit, each a per-viewer setting: kept in localStorage (`kp-review-option:<name>`, "on" or "off"),
// switchable at run time (the Agenda's "Review options", or the attribute `data-rv-<name>="on|off"` on <html>, which
// re-renders at once), and both ON by default:
//
//   remaining  one plain line in the dialog's head: "Step n of N here · this part: X of Y pairs left · all open
//              reviews: A of B left · about H:MM left at your pace", and the same counts on every Agenda row. The
//              pace is the median of the last 20 step durations, shown once five exist.
//   resume     per part the step, the scroll and (kept by the kit itself, KEPT_STORE) the pressed states; the Agenda
//              shows one "Continue: <part>, <theme>, step n" button that reopens exactly there (`?rv-resume=1`).
//
// Counts are the Agenda's own: progress.js progressOf over the same markup and the same stored verdicts, current
// round only. This module never writes a verdict or the journal; it keeps only its own keys:
//   kp-review-option:<name>, kp-review-pace, kp-demo-review:<demo>:resume.
//
// Hooks: review.js calls mountProgress() once; agenda.js calls paintAgenda() at the end of render().
import { PAGES } from '../../catalogue/pages.js';
import { THEMES } from '../../js/theme-registry.js';
import { fingerprintOf, progressOf, shapeOf, storedFor, storeKey } from './progress.js';

const ROOT = new URL('../../', import.meta.url);
/** The module's sheet, added once, and only where a hook runs (a lane frame imports this file and builds nothing). */
function ensureSheet() {
    if (document.querySelector('link[data-rv-progress-css]')) return;
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = new URL('rv-progress.css', import.meta.url).href;
    sheet.setAttribute('data-rv-progress-css', '');
    document.head.append(sheet);
}
const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------------------- options */

/** The options of this module: name, default, and the words the Agenda shows. */
export const OPTIONS = {
    remaining: {
        default: true,
        title: 'Remaining line',
        about: 'A plain line in the review dialog, and on every Agenda row, with the step you are on, the pairs left in this part and in all open reviews, and the time left at your pace.',
    },
    resume: {
        default: true,
        title: 'Continue where you left off',
        about: 'Remembers per part the step, the scroll and the states you pressed, and adds a Continue button at the top of the Agenda that reopens exactly there.',
    },
};
const optionKey = (/** @type {string} */ name) => `kp-review-option:${name}`;
export const OPTION_EVENT = 'rv-options';

/** Whether an option is on: the stored choice, else its default. @param {keyof OPTIONS} name */
export function readOption(name) {
    try {
        const value = localStorage.getItem(optionKey(name));
        if (value === 'on' || value === 'off') return value === 'on';
    } catch {
        // No storage: the default.
    }
    return OPTIONS[name].default;
}

/** Switch an option: kept, put on <html> and announced. @param {keyof OPTIONS} name @param {boolean} on */
export function writeOption(name, on) {
    try {
        localStorage.setItem(optionKey(name), on ? 'on' : 'off');
    } catch {
        // No storage: this visit only.
    }
    document.documentElement.setAttribute(`data-rv-${name}`, on ? 'on' : 'off');
    document.dispatchEvent(new CustomEvent(OPTION_EVENT, { detail: { name, on } }));
}

/**
 * Put the options on <html> and follow them: an attribute changed in the console, or the option changed in another
 * tab, takes effect at once.
 */
function followOptions() {
    for (const name of /** @type {(keyof OPTIONS)[]} */ (Object.keys(OPTIONS))) {
        document.documentElement.setAttribute(`data-rv-${name}`, readOption(name) ? 'on' : 'off');
    }
    new MutationObserver((records) => {
        for (const { attributeName } of records) {
            const name = /** @type {keyof OPTIONS} */ (attributeName?.replace(/^data-rv-/, ''));
            if (!(name in OPTIONS)) continue;
            const on = document.documentElement.getAttribute(`data-rv-${name}`) !== 'off';
            if (on !== readOption(name)) writeOption(name, on);
            else document.dispatchEvent(new CustomEvent(OPTION_EVENT, { detail: { name, on } }));
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: Object.keys(OPTIONS).map((n) => `data-rv-${n}`) });
    addEventListener('storage', (event) => {
        if (event.key?.startsWith('kp-review-option:')) {
            const name = /** @type {keyof OPTIONS} */ (event.key.replace('kp-review-option:', ''));
            if (name in OPTIONS) document.documentElement.setAttribute(`data-rv-${name}`, readOption(name) ? 'on' : 'off');
        }
    });
}

/* ---------------------------------------------------------------- pace */

const PACE_KEY = 'kp-review-pace';
const PACE_KEEP = 20;
const PACE_MIN = 5;

/** The last step durations, in seconds. @returns {number[]} */
function paceList() {
    try {
        const list = JSON.parse(localStorage.getItem(PACE_KEY) || '[]');
        return Array.isArray(list) ? list.filter((n) => Number.isFinite(n) && n > 0).slice(-PACE_KEEP) : [];
    } catch {
        return [];
    }
}

/** Keep one finished step's duration. @param {number} seconds */
function keepPace(seconds) {
    try {
        localStorage.setItem(PACE_KEY, JSON.stringify([...paceList(), Math.round(seconds)].slice(-PACE_KEEP)));
    } catch {
        // No storage: no pace.
    }
}

/** The median of the last 20 step durations, in seconds; null before five exist. */
export function medianPace() {
    const list = paceList();
    if (list.length < PACE_MIN) return null;
    const sorted = [...list].sort((a, b) => a - b);
    const mid = sorted.length >> 1;
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** "H:MM", rounded up to the minute. @param {number} seconds */
export function clock(seconds) {
    const minutes = Math.ceil(seconds / 60);
    return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
}

/* ---------------------------------------------------------------- parts */

/**
 * The steps the dialog walks for a part, as review.js builds them (topicSteps / themeSteps), each as the sub-shape that
 * progressOf can count: a topic walks one theme per step, a round without topics one theme per step, the catalogue
 * blocks it carries come last. Null for a demo of aspect pages, whose steps are per option.
 * @param {Document} doc @param {import('./progress.js').DemoShape} shape
 */
function stepsOf(doc, shape) {
    const sections = [...doc.querySelectorAll('[data-review-item]')];
    if (sections.length && sections.every((s) => s.getAttribute('data-review-mode') === 'aspects')) return null;
    const asked = (/** @type {string} */ item, /** @type {string} */ theme) =>
        !shape.itemThemes?.[item] || Boolean(shape.itemThemes[item]?.includes(theme));
    const sub = (/** @type {string[]} */ themes, /** @type {string[]} */ items) => ({ ...shape, themes, items, extras: [] });
    const topicIds = new Set(sections.map((s) => s.getAttribute('data-review-topic')).filter(Boolean));
    const themesUsed = new Set(shape.items.flatMap((item) => shape.themes.filter((theme) => asked(item, theme))));
    const topicMode = themesUsed.size > 1 || topicIds.size > 1;
    /** @type {ReturnType<typeof sub>[]} */
    const out = [];
    if (topicMode) {
        /** @type {Map<string, string[]>} */
        const topics = new Map();
        for (const item of shape.items) {
            const section = sections.find((s) => s.getAttribute('data-review-item') === item);
            const id = section?.getAttribute('data-review-topic') || `item:${item}`;
            topics.set(id, [...(topics.get(id) ?? []), item]);
        }
        for (const members of topics.values())
            for (const theme of shape.themes) {
                const here = members.filter((item) => asked(item, theme));
                if (here.length) out.push(sub([theme], here));
            }
    } else {
        for (const theme of shape.themes) {
            const here = shape.items.filter((item) => asked(item, theme));
            if (here.length) out.push(sub([theme], here));
        }
    }
    if (shape.extras.length) out.push({ ...shape, themes: [], items: [], extras: shape.extras });
    return out;
}

/**
 * @typedef {object} Part
 * @property {string} href      absolute address of the demo page
 * @property {string} label
 * @property {import('./progress.js').DemoShape} shape
 * @property {ReturnType<typeof stepsOf>} steps
 */

/** Parts read once, by address. @type {Map<string, Promise<Part | null>>} */
const parts = new Map();

/**
 * Read a part: its shape (the Agenda's own when it already holds it) and its steps. Null without the review kit.
 * @param {string} href @param {string} label @param {import('./progress.js').DemoShape | null | undefined} [known]
 */
export function loadPart(href, label, known) {
    let promise = parts.get(href);
    if (!promise) {
        promise = (async () => {
            try {
                const url = new URL(href);
                url.search = url.hash = '';
                const response = await fetch(url, { cache: 'no-cache' });
                if (!response.ok) return null;
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const shape = shapeOf(doc);
                if (!shape) return null;
                // The version, so a verdict on earlier files of this round reads as open, as on the Agenda.
                shape.fingerprint = await fingerprintOf(url, html);
                return { href, label, shape, steps: stepsOf(doc, shape) };
            } catch {
                return null;
            }
        })();
        parts.set(href, promise);
    }
    return promise.then((part) => {
        if (part && known) part.shape = known;
        return part;
    });
}

/**
 * The counts of a part now, from the stored verdicts.
 * @param {Part} part
 */
export function countsOf(part) {
    const progress = progressOf(part.shape, storedFor(part.shape.id));
    const stepsOpen = part.steps ? part.steps.filter((step) => progressOf(step, storedFor(step.id)).pairsLeft > 0).length : progress.themesLeft;
    const stepsTotal = part.steps ? part.steps.length : progress.themes;
    const firstOpen = part.steps ? part.steps.findIndex((step) => progressOf(step, storedFor(step.id)).pairsLeft > 0) : -1;
    return { pairs: progress.pairs, pairsLeft: progress.pairsLeft, stepsOpen, stepsTotal, firstOpen, decided: progress.state === 'decided' };
}

/** The research demos that wait, as the Agenda lists them (pages.js "Research to look at", minus the ones in rework). */
function waitingPages() {
    const group = PAGES.find((g) => g.group === 'Research to look at')?.pages ?? [];
    return group.filter((page) => !page.rework).map((page) => ({ href: new URL(page.href, ROOT).href, label: page.label }));
}

/**
 * Every open review together.
 * @param {{ href: string, label: string, shape?: import('./progress.js').DemoShape | null }[]} [also] pages to count too
 * @returns {Promise<{ pairs: number, pairsLeft: number, stepsOpen: number }>}
 */
export async function allOpen(also = []) {
    const list = waitingPages();
    for (const extra of also) if (!list.some((p) => p.href === extra.href)) list.push({ href: extra.href, label: extra.label });
    const known = new Map(also.map((e) => [e.href, e.shape]));
    const loaded = await Promise.all(list.map((p) => loadPart(p.href, p.label, known.get(p.href))));
    const total = { pairs: 0, pairsLeft: 0, stepsOpen: 0 };
    for (const part of loaded) {
        if (!part) continue;
        const c = countsOf(part);
        if (c.decided) continue;
        total.pairs += c.pairs;
        total.pairsLeft += c.pairsLeft;
        total.stepsOpen += c.stepsOpen;
    }
    return total;
}

const plural = (/** @type {number} */ n, /** @type {string} */ one) => `${n} ${one}${n === 1 ? '' : 's'}`;

/** The time left at the pace, or '' before the pace is known. @param {number} stepsOpen */
function etaWords(stepsOpen) {
    const pace = medianPace();
    return pace === null ? '' : `about ${clock(stepsOpen * pace)} left at your pace`;
}

/* ---------------------------------------------------------------- resume */

const resumeKey = (/** @type {string} */ id) => `${storeKey(id)}:resume`;

/**
 * @typedef {object} Resume
 * @property {string} at      ISO time
 * @property {number} index   the step, 0-based
 * @property {number} total   steps in the part
 * @property {string} title   the step's title (topic and theme), the way back when steps move
 * @property {string} theme   the step's theme, in words
 * @property {{ stage: number, view: number }} scroll
 */

/** @returns {Resume | null} @param {string} id */
export function resumeOf(id) {
    try {
        const data = JSON.parse(localStorage.getItem(resumeKey(id)) || 'null');
        return data && Number.isInteger(data.index) ? data : null;
    } catch {
        return null;
    }
}

function keepResume(/** @type {string} */ id, /** @type {Resume} */ data) {
    try {
        localStorage.setItem(resumeKey(id), JSON.stringify(data));
    } catch {
        // No storage: not remembered.
    }
}

/* ---------------------------------------------------------------- dialog */

/**
 * The hook review.js calls once, after the dialog is built.
 * @param {{
 *   demo: string,
 *   dialog: HTMLDialogElement,
 *   steps: { title: string, theme: string | null, laneTheme?: string }[],
 *   getIndex: () => number,
 *   stepOpen: (step: any) => boolean,
 *   show: (at: number) => Promise<void>,
 *   stage: HTMLElement,
 *   openFirst: () => void,
 * }} kit
 */
export function mountProgress({ demo, dialog, steps, getIndex, stepOpen, show, stage, openFirst, slot }) {
    ensureSheet();
    followOptions();
    const here = new URL(location.href);
    here.search = here.hash = '';
    const view = /** @type {HTMLElement} */ (stage.closest('.rv-dialog__view') ?? stage);
    // The dialog's header row hands a slot for the counts (review.js); without one the line goes at the end of the head.
    const head = /** @type {HTMLElement} */ (slot ?? dialog.querySelector('.rv-dialog__head'));
    const line = document.createElement('p');
    line.className = 'rv-remaining';
    line.setAttribute('data-rv-remaining', '');
    head.append(line);

    /** The counts of this part and of all open reviews, once read. @type {{ part: ReturnType<typeof countsOf> | null, all: Awaited<ReturnType<typeof allOpen>> | null }} */
    const counts = { part: null, all: null };
    /** @type {Part | null} */
    let thisPart = null;

    async function recount() {
        if (!thisPart) thisPart = await loadPart(here.href, document.title);
        if (!thisPart) return;
        counts.part = countsOf(thisPart);
        counts.all = await allOpen([{ href: here.href, label: document.title }]);
        paint();
    }

    function paint() {
        const on = readOption('remaining');
        line.hidden = !on;
        if (!on) return;
        // Compact in the header row (the step itself stands in the step chip beside it); the full sentence is the title and
        // the accessible name, so nothing is lost.
        const step = `Step ${getIndex() + 1} of ${steps.length} here`;
        const part = counts.part ? `this part: ${counts.part.pairsLeft} of ${counts.part.pairs} pairs left` : 'this part: counting…';
        const all = counts.all ? `all open reviews: ${counts.all.pairsLeft} of ${counts.all.pairs} left` : 'all open reviews: counting…';
        const eta = counts.all ? etaWords(counts.all.stepsOpen) : '';
        const full = [step, part, all, eta].filter(Boolean).join(' · ');
        line.replaceChildren();
        const piece = (/** @type {string} */ text, /** @type {string} */ cls) => {
            const span = document.createElement('span');
            span.className = cls;
            span.textContent = text;
            line.append(span);
        };
        piece(counts.part ? `${counts.part.pairsLeft}/${counts.part.pairs} left here` : 'counting…', 'rv-remaining__part');
        if (counts.all) piece(`${counts.all.pairsLeft}/${counts.all.pairs} in all reviews`, 'rv-remaining__all');
        if (eta) piece(`~${clock((counts.all?.stepsOpen ?? 0) * (medianPace() ?? 0))}`, 'rv-remaining__eta');
        line.title = full;
        line.setAttribute('aria-label', full);
    }

    /* Step durations: seconds the dialog was open, visible and in use while a step was shown. */
    /** @type {{ step: any, wasOpen: boolean, seconds: number } | null} */
    let timing = null;
    let lastActive = Date.now();
    for (const type of ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'])
        addEventListener(type, () => (lastActive = Date.now()), { capture: true, passive: true });
    setInterval(() => {
        if (timing && dialog.open && document.visibilityState === 'visible' && Date.now() - lastActive < 120000) timing.seconds += 1;
    }, 1000);
    /** A step that was open and is judged now has taken the time counted. */
    function settle() {
        if (timing && timing.wasOpen && !stepOpen(timing.step) && timing.seconds >= 3) keepPace(timing.seconds);
        timing = null;
    }

    /* What a visit leaves behind: the step and the scroll. */
    function remember() {
        if (!readOption('resume') || !dialog.open) return;
        const index = getIndex();
        const step = steps[index];
        if (!step) return;
        const themeName = step.laneTheme || step.theme || '';
        keepResume(demo, {
            at: new Date().toISOString(),
            index,
            total: steps.length,
            title: step.title,
            theme: LABEL[themeName] || themeName || step.title,
            scroll: { stage: stage.scrollTop, view: view.scrollTop },
        });
    }

    let scrollTimer = 0;
    dialog.addEventListener(
        'scroll',
        (event) => {
            if (event.target !== stage && event.target !== view) return;
            clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(remember, 250);
        },
        true,
    );

    const position = /** @type {HTMLElement} */ (dialog.querySelector('[data-rv-position]'));
    let shownTitle = '';
    new MutationObserver(() => {
        const index = getIndex();
        const step = steps[index];
        if (!step || step.title === shownTitle) return;
        shownTitle = step.title;
        settle();
        timing = { step, wasOpen: stepOpen(step), seconds: 0 };
        // The new step starts at its top; the scroll that follows is its own.
        if (readOption('resume') && dialog.open) {
            stage.scrollTop = view.scrollTop = 0;
            remember();
        }
        paint();
        void recount();
    }).observe(position, { childList: true, characterData: true, subtree: true });

    dialog.addEventListener('close', () => {
        remember();
        settle();
    });
    addEventListener('pagehide', () => {
        remember();
        settle();
    });
    document.addEventListener(OPTION_EVENT, () => {
        paint();
        remember();
    });
    addEventListener('storage', (event) => {
        if (event.key?.startsWith('kp-demo-review:')) void recount();
    });
    paint();
    void recount();

    /** Open at the remembered step and scroll (`?rv-resume=1`, the Agenda's Continue). */
    async function resumeNow() {
        const saved = resumeOf(demo);
        if (!saved || !readOption('resume')) return openFirst();
        const byTitle = steps.findIndex((step) => step.title === saved.title);
        const at = byTitle >= 0 ? byTitle : Math.min(saved.index, steps.length - 1);
        await show(at);
        // The frames of a step load as they come near the view and change its height: put the scroll back until the
        // reviewer takes over, or for a few seconds.
        let touched = false;
        const stop = () => (touched = true);
        for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) dialog.addEventListener(type, stop, { once: true, passive: true });
        const until = Date.now() + 4000;
        const settleScroll = () => {
            if (touched || Date.now() > until) return;
            stage.scrollTop = saved.scroll?.stage ?? 0;
            view.scrollTop = saved.scroll?.view ?? 0;
            setTimeout(settleScroll, 150);
        };
        settleScroll();
    }
    const params = new URLSearchParams(location.search);
    if (params.has('rv-resume')) {
        const clean = new URL(location.href);
        clean.searchParams.delete('rv-resume');
        history.replaceState(history.state, '', clean.href);
        void resumeNow();
    }
}

/* ---------------------------------------------------------------- agenda */

/** The address that reopens a part where it was left. @param {string} href absolute @param {string} back the Agenda's address */
export function continueUrl(href, back) {
    const url = new URL(href);
    url.searchParams.set('next', back);
    url.searchParams.set('rv-resume', '1');
    return url.href;
}

/** The part's name without its series ("… part 2 of 14: Pickers and palettes" becomes "Pickers and palettes"). @param {string} label */
export const shortLabel = (label) => label.replace(/^.*?\bpart \d+ of \d+:\s*/i, '');

/** @type {HTMLElement | null} */
let optionsBox = null;
/** @type {HTMLAnchorElement | null} */
let continueLink = null;
/** @type {HTMLElement | null} */
let continueNote = null;

function ensureAgendaParts() {
    ensureSheet();
    if (!optionsBox) {
        const slot = document.querySelector('[data-agenda-status-slot]');
        optionsBox = document.createElement('details');
        optionsBox.className = 'agenda__options';
        optionsBox.innerHTML = `<summary class="agenda__fold-summary">Review options</summary>
            <p class="cat-intro">How the review dialog and this page help you along. Each switch is yours, kept in this browser, and takes effect at once.</p>
            <div class="agenda__options-list"></div>`;
        const list = /** @type {HTMLElement} */ (optionsBox.querySelector('.agenda__options-list'));
        for (const [name, option] of Object.entries(OPTIONS)) {
            const row = document.createElement('div');
            row.className = 'agenda__option';
            row.innerHTML = `<label class="kp-switch">
                    <input class="kp-switch__input" type="checkbox" role="switch" data-rv-option="${name}" />
                    <span class="kp-switch__state" aria-hidden="true"></span>
                    <span></span>
                </label>
                <p class="cat-note"></p>`;
            /** @type {HTMLElement} */ (row.querySelector('label span:last-child')).textContent = option.title;
            /** @type {HTMLElement} */ (row.querySelector('.cat-note')).textContent = option.about;
            const input = /** @type {HTMLInputElement} */ (row.querySelector('input'));
            input.addEventListener('change', () => writeOption(/** @type {keyof OPTIONS} */ (name), input.checked));
            list.append(row);
        }
        slot?.after(optionsBox);
        followOptions();
        document.addEventListener(OPTION_EVENT, () => paintAgenda());
        addEventListener('storage', (event) => {
            if (event.key?.startsWith('kp-demo-review:') || event.key?.startsWith('kp-review-')) paintAgenda();
        });
    }
    if (!continueLink) {
        const actions = document.querySelector('.agenda__actions');
        continueLink = document.createElement('a');
        continueLink.className = 'kp-button kp-button--primary agenda__continue';
        continueLink.hidden = true;
        continueNote = document.createElement('p');
        continueNote.className = 'cat-note agenda__continue-note';
        continueNote.hidden = true;
        actions?.prepend(continueLink, continueNote);
    }
}

/** @type {{ href: string, label: string, shape: import('./progress.js').DemoShape | null | undefined }[]} */
let lastEntries = [];

/**
 * The hook agenda.js calls at the end of every render: the remaining line on each row, and the Continue button.
 * @param {{ href: string, label: string, shape: import('./progress.js').DemoShape | null | undefined }[]} [entries] one per demo (page address
 *   relative to the repository, its label, its shape once read); omitted, the last ones are painted again
 */
export function paintAgenda(entries = lastEntries) {
    lastEntries = entries;
    ensureAgendaParts();
    for (const input of /** @type {NodeListOf<HTMLInputElement>} */ (optionsBox?.querySelectorAll('[data-rv-option]') ?? []))
        input.checked = readOption(/** @type {keyof OPTIONS} */ (input.dataset.rvOption));
    const absolute = entries.map((e) => ({ ...e, href: new URL(e.href, ROOT).href }));
    const read = absolute.filter((e) => e.shape);
    void Promise.all([
        Promise.all(read.map((e) => loadPart(e.href, e.label, e.shape))),
        allOpen(read.map((e) => ({ href: e.href, label: e.label, shape: e.shape }))),
    ]).then(([loaded, all]) => {
        const back = new URL('catalogue/agenda.html', ROOT).href;
        const remaining = readOption('remaining');
        const resume = readOption('resume');
        /** @type {{ part: Part, saved: Resume } | null} */
        let latest = null;
        for (const part of loaded) {
            if (!part) continue;
            const c = countsOf(part);
            const row = document.getElementById(`agenda-${new URL(part.href).pathname.replace(ROOT.pathname, '').replace(/[^a-z0-9-]+/gi, '-')}`);
            const what = row?.querySelector('.agenda-row__what');
            let note = /** @type {HTMLElement | null} */ (what?.querySelector('.agenda-row__remaining') ?? null);
            if (what && !note) {
                note = document.createElement('p');
                note.className = 'agenda-row__remaining';
                what.querySelector('.agenda-row__about')?.after(note);
            }
            const saved = resumeOf(part.shape.id);
            if (note) {
                note.hidden = !remaining || c.decided;
                if (!note.hidden) {
                    const at = saved && resume && c.pairsLeft ? saved.index : Math.max(c.firstOpen, 0);
                    note.textContent = [
                        `Step ${at + 1} of ${c.stepsTotal}`,
                        `this part: ${c.pairsLeft} of ${c.pairs} pairs left`,
                        `all open reviews: ${all.pairsLeft} of ${all.pairs} left`,
                        etaWords(c.stepsOpen),
                    ]
                        .filter(Boolean)
                        .join(' · ');
                }
            }
            if (saved && resume && c.pairsLeft && (!latest || saved.at > latest.saved.at)) latest = { part, saved };
        }
        const start = /** @type {HTMLElement | null} */ (document.querySelector('[data-agenda-start]'));
        if (continueLink && continueNote) {
            continueLink.hidden = continueNote.hidden = !latest;
            // One primary action at a time: the start button steps back while Continue stands.
            start?.classList.toggle('kp-button--primary', !latest);
            if (latest) {
                const { part, saved } = latest;
                continueLink.href = continueUrl(part.href, back);
                continueLink.textContent = `Continue: ${shortLabel(part.label)}, ${saved.theme}, step ${saved.index + 1}`;
                continueNote.textContent = `Reopens step ${saved.index + 1} of ${saved.total} of this part where you left it: the same scroll and the states you pressed.`;
            }
        }
    });
}
