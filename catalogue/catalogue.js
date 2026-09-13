// The catalogue shell: the side navigation over every review page, the
// theme switcher, the feedback a reviewer leaves under each block, and the
// developer overlay on demand. Components themselves are attached by
// js/auto.js; this file only drives the chrome around them.
import { THEMES } from '../js/theme-registry.js';
import { applyTheme, currentTheme, initializeTheme, THEME_EVENT } from '../js/theme-core.js';
import { attachThemePickers, themeMenuMarkup } from '../js/theme-picker.js';
import { attachLazyRegisters, registersPresent } from '../js/lazy-register.js';
import { PAGES } from './pages.js';
import { JUDGEMENT_EVENT, loadJudgements, saveJudgements, stateOf } from './judgements.js';
import { fingerprint, stillAnimations } from './block-hash.js';
import './demos.js';

/** The repository root, wherever the pages are served from (a local server, a Pages subpath). */
const ROOT = new URL('../', import.meta.url);

const FEEDBACK_KEY = 'kp-catalogue-feedback:v1';
// What went into the last prompt copied from each page, so the next prompt
// carries only what is new (Kenny, 2026-09-13: an old note and old verdicts
// came back in every prompt). { page: [signature, …] }
const COPIED_KEY = 'kp-catalogue-copied:v1';

/* ------------------------------------------------------------- storage */

// Every read and write is guarded: a private window or a browser that
// blocks site data must still get a working page, only without memory.
function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

/* ------------------------------------------------------------ the page */

/** This page's path from the repository root, e.g. `catalogue/table.html`. */
function pagePath() {
    return decodeURIComponent(location.pathname).slice(decodeURIComponent(ROOT.pathname).length);
}

const themeLabel = (name) => THEMES.find((t) => t.name === name)?.label ?? name;

/* ---------------------------------------------------------- navigation */

function buildNavigation() {
    const here = pagePath();
    const nav = document.createElement('nav');
    nav.className = 'kp-sidenav cat-nav';
    nav.id = 'cat-nav';
    nav.setAttribute('aria-label', 'Review pages');

    const header = document.createElement('div');
    header.className = 'kp-sidenav__header';
    const title = document.createElement('p');
    title.className = 'kp-sidenav__title';
    title.textContent = 'kp-themes review';
    header.append(title);

    const scroll = document.createElement('div');
    scroll.className = 'kp-sidenav__scroll';
    const list = document.createElement('ul');
    list.className = 'kp-sidenav__list';

    for (const { group, pages } of PAGES) {
        const category = document.createElement('li');
        category.className = 'kp-sidenav__category';
        // Open by default: a reviewer scans the whole list, and a closed
        // group is a page nobody finds.
        category.setAttribute('data-kp-sidenav-expanded', '');
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'kp-sidenav__category-toggle';
        toggle.setAttribute('aria-expanded', 'true');
        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'kp-sidenav__label';
        toggleLabel.textContent = group;
        toggle.append(toggleLabel);

        const submenu = document.createElement('div');
        submenu.className = 'kp-sidenav__submenu';
        const inner = document.createElement('ul');
        inner.className = 'kp-sidenav__list';
        for (const page of pages) {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'kp-sidenav__link';
            link.href = new URL(page.href, ROOT).href;
            if (page.href === here) link.setAttribute('aria-current', 'page');
            const label = document.createElement('span');
            label.className = 'kp-sidenav__label';
            label.textContent = page.label;
            link.append(label);
            item.append(link);
            inner.append(item);
        }
        submenu.append(inner);
        category.append(toggle, submenu);
        list.append(category);
    }
    scroll.append(list);
    nav.append(header, scroll);
    return nav;
}

function mountShell() {
    let bar = document.querySelector('.cat-bar');
    let main = document.querySelector('.cat-main');

    // A catalogue page arrives with its bar and main; a research demo arrives
    // with neither. Both end in the same shell, so every review page carries
    // the navigation and the theme menu (Kenny, 2026-09-13: "die sidenav moet
    // op elke pagina terugkomen").
    const column = document.createElement('div');
    column.className = 'cat-column';
    if (!bar) {
        bar = document.createElement('header');
        bar.className = 'cat-bar';
        const home = document.createElement('a');
        home.className = 'cat-bar__home';
        home.href = new URL('catalogue/index.html', ROOT).href;
        home.textContent = 'kp-themes catalogue';
        const spacer = document.createElement('span');
        spacer.className = 'cat-bar__spacer';
        const tools = document.createElement('button');
        tools.type = 'button';
        tools.className = 'kp-button kp-button--ghost';
        tools.setAttribute('data-cat-devtools', '');
        tools.textContent = 'Devtools (Alt+D)';
        bar.append(home, spacer, tools);
    }
    const skip = document.querySelector('body > .kp-skip-link');
    const content = [...document.body.children].filter((el) => el !== bar && el !== skip && el.tagName !== 'SCRIPT' && !el.hasAttribute('popover'));
    if (skip) skip.after(column);
    else document.body.prepend(column);
    column.append(bar);
    if (main) column.append(main);
    else for (const el of content) column.append(el);
    main ??= column;

    const nav = buildNavigation();
    document.body.classList.add('cat-shell');
    column.before(nav);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'kp-sidenav__toggle kp-button kp-button--ghost cat-nav-toggle';
    toggle.setAttribute('data-kp-sidenav-toggle', '');
    toggle.setAttribute('aria-controls', nav.id);
    toggle.textContent = '☰ All pages';
    bar.prepend(toggle);

    import('../js/sidenav.js').then(({ attachSidenavs, sidenavOf }) => {
        attachSidenavs(document);
        // Beside the content on a wide screen, over it on a narrow one: the
        // same component, told which of its modes fits the room.
        // Beside the page down to a phone's width: at 56rem it folded behind a
        // button on any half-screen window, and the navigation looked absent.
        const narrow = window.matchMedia('(max-width: 40rem)');
        const fit = () => {
            const handle = sidenavOf(nav);
            handle?.setMode(narrow.matches ? 'over' : 'side');
            // A panel that was open beside the page stays open when it moves
            // over it, which on a phone is a menu covering the page it came
            // to show. Over the page it starts closed; the Pages button opens it.
            if (narrow.matches) handle?.close();
        };
        fit();
        narrow.addEventListener('change', fit);
    });
    return bar;
}

/* --------------------------------------------------------------- theme */

function mountThemeMenu(bar) {
    // The package's own theme menu, grouped Light and Dark, exactly as a
    // consumer gets it — the catalogue reviews the picker by using it.
    const slot = document.createElement('span');
    slot.className = 'cat-bar__theme';
    slot.innerHTML = themeMenuMarkup({ id: 'cat-theme-menu', label: 'Choose a theme' });
    const tools = bar.querySelector('[data-cat-devtools]');
    if (tools) tools.before(slot);
    else bar.append(slot);

    // A catalogue page links every register; a research demo links two or
    // three. Where some are missing and the page does not manage its own
    // register links, the missing one is fetched on the switch [scope-50].
    const managed = document.querySelector('link[data-kp-register]') !== null;
    if (!managed && registersPresent().length < THEMES.length) {
        attachLazyRegisters({ pattern: `${new URL('css/', ROOT).pathname}{theme}-register.css` });
    }
    attachThemePickers(slot);
    // A page about one theme says so with data-cat-theme on <html>, and opens in
    // that theme whatever the browser last stored; the menu still switches.
    const fixed = document.documentElement.getAttribute('data-cat-theme');
    if (fixed) applyTheme(fixed);
    else initializeTheme(document.documentElement.dataset.theme || 'formal');
}

/* ------------------------------------------------------------ feedback */

// Feedback is kept per page, per block and per theme, because what is wrong
// with a button in cyberpunk is not what is wrong with it in formal. The
// textarea under a block shows the note for the theme on screen; switching
// theme swaps it, and every note of every theme stays in the summary.

/** @returns {Record<string, Record<string, Record<string, string>>>} page → block → theme → text */
const allFeedback = () => load(FEEDBACK_KEY, {});

function noteFor(block, theme) {
    return allFeedback()[pagePath()]?.[block]?.[theme] ?? '';
}

function setNote(block, theme, text) {
    const all = allFeedback();
    const page = (all[pagePath()] ??= {});
    const entry = (page[block] ??= {});
    if (text.trim()) entry[theme] = text;
    else delete entry[theme];
    if (!Object.keys(entry).length) delete page[block];
    if (!Object.keys(page).length) delete all[pagePath()];
    return save(FEEDBACK_KEY, all);
}

function blockTitle(section) {
    if (section.dataset.catTitle) return section.dataset.catTitle;
    const heading = section.querySelector('h2, h3');
    if (!heading) return section.id;
    // A label set inside the heading (the data table demo's "mock", "mixed")
    // is not part of the name; read without it rather than glued on.
    const copy = /** @type {HTMLElement} */ (heading.cloneNode(true));
    for (const tag of copy.querySelectorAll('[class*="-tag"]')) tag.remove();
    return copy.textContent.trim() || section.id;
}

/** The blocks a note can belong to on this page. */
function sections() {
    const blocks = [...document.querySelectorAll('.cat-block[id]')];
    return blocks.length ? blocks : [...document.querySelectorAll('main section[id]')];
}

/** A research demo judges its own sections; the review page judges gathered blocks. */
const isResearch = () => pagePath().startsWith('research/');

/** The key a block's verdicts are stored under. */
function judgementKey(section) {
    return isResearch() ? `${pagePath()}#${section.id}` : section.id;
}

const copiedSignatures = () => new Set(load(COPIED_KEY, {})[pagePath()] ?? []);

/**
 * Everything the prompt could say, each with the signature that tells whether
 * it was already in a copied prompt.
 * @returns {{ kind: 'note' | 'approved' | 'rejected', theme: string, text: string, signature: string }[]}
 */
function promptItems() {
    const page = allFeedback()[pagePath()] ?? {};
    const judgements = loadJudgements();
    const items = [];
    for (const section of sections()) {
        for (const [theme, text] of Object.entries(page[section.id] ?? {})) {
            const line = text.trim().replace(/\n+/g, ' / ');
            items.push({
                kind: 'note',
                theme,
                text: `- ${blockTitle(section)} (#${section.id}): ${line}`,
                signature: `note|${section.id}|${theme}|${line}`,
            });
        }
        const key = judgementKey(section);
        for (const [theme, { verdict, hash }] of Object.entries(judgements[key] ?? {})) {
            // In the theme on screen a verdict counts only while the block still
            // looks the way it did when it was judged.
            if (theme === currentTheme() && section.dataset.catState === 'changed') continue;
            items.push({
                kind: verdict === 'rejected' ? 'rejected' : 'approved',
                theme,
                text: blockTitle(section),
                signature: `verdict|${key}|${theme}|${verdict}|${hash}`,
            });
        }
    }
    return items;
}

/** The prompt a reviewer pastes into the conversation: verdicts and notes. */
function promptText({ includeCopied = false } = {}) {
    const copied = copiedSignatures();
    const items = promptItems().filter((item) => includeCopied || !copied.has(item.signature));
    if (!items.length) return '';
    const order = THEMES.map((t) => t.name);
    const themes = [...new Set(items.map((i) => i.theme))].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const lines = [`Catalogue feedback on ${pagePath()}`];
    for (const theme of themes) {
        const of = (kind) => items.filter((i) => i.theme === theme && i.kind === kind).map((i) => i.text);
        const [approved, rejected, notes] = [of('approved'), of('rejected'), of('note')];
        lines.push('', `Theme ${themeLabel(theme)}:`);
        if (approved.length) lines.push(`Approved (${approved.length}): ${approved.join('; ')}`);
        if (rejected.length) lines.push(`Not approved (${rejected.length}): ${rejected.join('; ')}`);
        if (notes.length) lines.push('Notes:', ...notes);
    }
    return lines.join('\n');
}

/* ------------------------------------------------------------ verdicts */

// A research demo carries the same Approve / Not approved as the review page
// (Kenny, 2026-09-13: "die moeten er altijd staan en functioneel zijn"). The
// component pages do not: their blocks are judged on the review page, where
// the heading sits a level lower and the hash would never match.
async function mountVerdicts(sections) {
    let raw = null;
    try {
        const response = await fetch(location.href);
        if (response.ok) raw = new DOMParser().parseFromString(await response.text(), 'text/html');
    } catch {
        /* the markup as it stands now is the fallback */
    }
    const entries = sections.map((section) => {
        const row = document.createElement('div');
        row.className = 'cat-approval';
        row.innerHTML = `
            <span class="kp-badge" data-cat-approval-state>Checking…</span>
            <button type="button" class="kp-button kp-button--primary kp-button--sm" data-cat-verdict="approved">Approve</button>
            <button type="button" class="kp-button kp-button--sm" data-cat-verdict="rejected">Not approved</button>`;
        const field = section.querySelector(':scope > .cat-feedback-field');
        if (field) field.before(row);
        else section.append(row);
        return {
            section,
            key: judgementKey(section),
            source: raw?.getElementById(section.id)?.outerHTML ?? section.outerHTML,
            badge: row.querySelector('[data-cat-approval-state]'),
            approve: row.querySelector('[data-cat-verdict="approved"]'),
            reject: row.querySelector('[data-cat-verdict="rejected"]'),
        };
    });
    let current = new Map();
    const WORDS = {
        new: (t) => `Not yet judged in ${t}`,
        approved: (t) => `Approved in ${t}`,
        rejected: (t) => `Not approved in ${t}`,
        changed: (t) => `Changed since it was judged in ${t}`,
    };
    const TONE = { approved: ' kp-badge--success', rejected: ' kp-badge--destructive', changed: ' kp-badge--warning', new: '' };

    function render() {
        const theme = currentTheme();
        const label = themeLabel(theme);
        const all = loadJudgements();
        for (const entry of entries) {
            const hash = current.get(entry.key);
            const state = stateOf(all, entry.key, theme, hash);
            entry.badge.textContent = hash ? WORDS[state](label) : 'Checking…';
            entry.badge.className = `kp-badge${TONE[state]}`;
            entry.approve.textContent = `Approve in ${label}`;
            entry.reject.textContent = `Not approved in ${label}`;
            entry.approve.disabled = state === 'approved' || !hash;
            entry.reject.disabled = state === 'rejected' || !hash;
            entry.section.dataset.catState = state;
        }
        document.dispatchEvent(new CustomEvent(JUDGEMENT_EVENT));
    }

    async function measure() {
        const theme = currentTheme();
        const release = stillAnimations();
        const next = new Map();
        for (const entry of entries) next.set(entry.key, await fingerprint(entry.section, entry.source));
        release();
        if (theme !== currentTheme()) return;
        current = next;
        render();
    }

    document.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('[data-cat-verdict]') : null;
        const entry = button && entries.find((e) => e.approve === button || e.reject === button);
        const hash = entry && current.get(entry.key);
        if (!hash) return;
        const all = loadJudgements();
        (all[entry.key] ??= {})[currentTheme()] = { verdict: button.getAttribute('data-cat-verdict'), hash };
        saveJudgements(all);
        render();
    });
    document.documentElement.addEventListener(THEME_EVENT, () => {
        current = new Map();
        render();
        // A timer, not a frame: a background tab runs none (see review.js).
        setTimeout(measure, 400);
    });
    await document.fonts?.ready;
    setTimeout(measure, 300);
}

function mountFeedback() {
    const main = document.querySelector('.cat-main') ?? document.querySelector('main') ?? document.querySelector('.cat-column');
    let sections = [...document.querySelectorAll('.cat-block[id]')];
    // A research demo has no catalogue blocks; its own id'd sections are
    // what a reviewer comments on there.
    if (!sections.length) sections = [...document.querySelectorAll('main section[id]')];
    if (!main || !sections.length) return;

    const fields = [];
    for (const section of sections) {
        const wrap = document.createElement('div');
        wrap.className = 'kp-field cat-feedback-field';
        const id = `cat-feedback-${section.id}`;
        const label = document.createElement('label');
        label.className = 'kp-field__label';
        label.htmlFor = id;
        const area = document.createElement('textarea');
        area.id = id;
        area.className = 'kp-field__input kp-field__input--multiline cat-feedback-input';
        area.rows = 2;
        area.addEventListener('input', () => {
            setNote(section.id, currentTheme(), area.value);
            renderSummary();
        });
        wrap.append(label, area);
        section.append(wrap);
        fields.push({ section, label, area });
    }

    const summary = document.createElement('section');
    summary.className = 'cat-feedback';
    summary.setAttribute('aria-labelledby', 'cat-feedback-title');
    summary.innerHTML = `
        <h2 id="cat-feedback-title">Feedback on this page</h2>
        <p class="cat-note">The notes and verdicts on this page that were not in a prompt copied before, from every theme, as one prompt to paste into the conversation. Both are kept in this browser only.</p>
        <pre class="cat-feedback-prompt" data-cat-prompt></pre>
        <div class="cat-feedback-actions">
            <div class="kp-field kp-field--check">
                <input class="kp-field__check" type="checkbox" id="cat-include-copied" data-cat-include-copied />
                <label class="kp-field__label" for="cat-include-copied">Include what was already copied</label>
            </div>
            <button type="button" class="kp-button" data-cat-copy>Copy prompt</button>
            <button type="button" class="kp-button kp-button--ghost" data-cat-clear>Clear this page's notes</button>
            <span class="cat-note" role="status" aria-live="polite" data-cat-copy-status></span>
        </div>`;
    main.append(summary);

    const prompt = summary.querySelector('[data-cat-prompt]');
    const status = summary.querySelector('[data-cat-copy-status]');
    const copy = summary.querySelector('[data-cat-copy]');
    const clear = summary.querySelector('[data-cat-clear]');
    const includeCopied = summary.querySelector('[data-cat-include-copied]');

    function renderSummary() {
        const text = promptText({ includeCopied: includeCopied.checked });
        const anything = promptItems().length > 0;
        prompt.textContent =
            text ||
            (anything
                ? 'Nothing new since the last copied prompt. Tick "Include what was already copied" to see all of it again.'
                : 'No notes or approvals yet. Write under any block above; a note belongs to the theme on screen.');
        copy.disabled = !text;
        clear.disabled = !Object.keys(allFeedback()[pagePath()] ?? {}).length;
    }
    includeCopied.addEventListener('change', renderSummary);

    function renderFields() {
        const theme = currentTheme();
        for (const { section, label, area } of fields) {
            label.textContent = `Feedback on “${blockTitle(section)}” in ${themeLabel(theme)}`;
            area.value = noteFor(section.id, theme);
        }
    }

    copy.addEventListener('click', async () => {
        const text = promptText({ includeCopied: includeCopied.checked });
        // Everything on the page now counts as passed on; the next prompt starts
        // from what changes after this.
        const copiedAll = load(COPIED_KEY, {});
        copiedAll[pagePath()] = promptItems().map((item) => item.signature);
        save(COPIED_KEY, copiedAll);
        try {
            await navigator.clipboard.writeText(text);
            status.textContent = 'Copied. Paste it into the conversation.';
            // Only once it is on the clipboard: when the text is selected for a
            // manual Ctrl+C instead, it must stay on screen.
            setTimeout(renderSummary, 1500);
        } catch {
            // Without clipboard permission the text is selected instead, so
            // one Ctrl+C still does it.
            const range = document.createRange();
            range.selectNodeContents(prompt);
            const selection = getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            status.textContent = 'Selected. Press Ctrl+C to copy.';
        }
    });

    clear.addEventListener('click', () => {
        // Destructive, so it asks first (standing rule 31).
        if (!confirm(`Remove every note on ${pagePath()}, in every theme?`)) return;
        const all = allFeedback();
        delete all[pagePath()];
        save(FEEDBACK_KEY, all);
        renderFields();
        renderSummary();
        status.textContent = 'Cleared.';
    });

    document.documentElement.addEventListener(THEME_EVENT, renderFields);
    // An approval changes the prompt as much as a note does.
    document.addEventListener(JUDGEMENT_EVENT, renderSummary);
    document.documentElement.addEventListener(THEME_EVENT, () => setTimeout(renderSummary, 400));
    renderFields();
    renderSummary();
    if (isResearch()) mountVerdicts(sections);
}

/* ------------------------------------------------------------ devtools */

// Every page links the same overlay, but a reviewer who never opens it
// should not pay for it: it loads on the first press of its key.
function mountDevtools() {
    let loaded = null;
    const open = () => {
        loaded ??= import('./devtools.js');
        return loaded.then((m) => m.openDevtools());
    };
    document.querySelector('[data-cat-devtools]')?.addEventListener('click', open);
    window.addEventListener('keydown', (event) => {
        if (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            open();
        }
    });
}

/* -------------------------------------------------- page-level comforts */

function mountComforts() {
    // Always in reach, bottom right: the review page is thousands of pixels
    // long (Kenny, 2026-09-13). The catalogue's own control, not the package's
    // back-to-top, which is itself one of the things under review.
    const up = document.createElement('button');
    up.type = 'button';
    up.className = 'kp-button kp-button--primary cat-to-top';
    up.setAttribute('aria-label', 'Back to the top of the page');
    up.textContent = '↑ Top';
    up.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.append(up);

    // A demo form must never navigate: a submit would reload the page and
    // throw away the scroll position (notes and verdicts are stored as they are
    // made, so those survive either way). A form that opts in to the package's
    // own validation still gets it; only the navigation is stopped.
    // A file dropped anywhere but a live upload zone must not make the browser
    // open it in place of the page (Kenny dropped an image on the frozen upload
    // copy and lost the review page to it). A real zone still receives its drop.
    for (const type of ['dragover', 'drop']) {
        document.addEventListener(type, (event) => {
            const zone = event.target instanceof Element ? event.target.closest('[data-kp-upload]') : null;
            if (!zone || zone.closest('[data-cat-frozen], [inert]')) event.preventDefault();
        });
    }

    document.addEventListener('submit', (event) => {
        const form = event.target;
        if (form instanceof HTMLFormElement && form.method !== 'dialog') event.preventDefault();
    });
}

const bar = mountShell();
mountComforts();
mountThemeMenu(bar);
mountDevtools();
// A page that gathers its blocks from elsewhere says so, and announces when
// they are in; notes attach to what is on the page at that moment.
const composing = document.querySelector('[data-cat-compose]');
if (composing?.getAttribute('data-cat-compose') === 'compare') {
    /* two themes side by side: notes belong to the review page, not here */
} else if (composing) {
    document.addEventListener('cat-composed', () => mountFeedback(), { once: true });
} else {
    mountFeedback();
}
