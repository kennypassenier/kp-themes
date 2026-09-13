// The catalogue shell: the side navigation over every review page, the
// theme switcher, the feedback a reviewer leaves under each block, and the
// developer overlay on demand. Components themselves are attached by
// js/auto.js; this file only drives the chrome around them.
import { THEMES } from '../js/theme-registry.js';
import { applyTheme, currentTheme, initializeTheme, THEME_EVENT } from '../js/theme-core.js';
import { attachThemePickers, themeMenuMarkup } from '../js/theme-picker.js';
import { attachLazyRegisters, registersPresent } from '../js/lazy-register.js';
import { PAGES } from './pages.js';
import { JUDGEMENT_EVENT, loadJudgements } from './judgements.js';
import './demos.js';

/** The repository root, wherever the pages are served from (a local server, a Pages subpath). */
const ROOT = new URL('../', import.meta.url);

const FEEDBACK_KEY = 'kp-catalogue-feedback:v1';

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
    return section.dataset.catTitle || section.querySelector('h2, h3')?.textContent?.trim() || section.id;
}

/** The blocks a note can belong to on this page. */
function sections() {
    const blocks = [...document.querySelectorAll('.cat-block[id]')];
    return blocks.length ? blocks : [...document.querySelectorAll('main section[id]')];
}

/** The prompt a reviewer pastes into the conversation: verdicts and notes. */
function promptText() {
    const page = allFeedback()[pagePath()] ?? {};
    const judgements = loadJudgements();
    const notes = new Map();
    const approved = new Map();
    const rejected = new Map();
    const add = (map, theme, value) => {
        if (!map.has(theme)) map.set(theme, []);
        map.get(theme).push(value);
    };
    for (const section of sections()) {
        for (const [theme, text] of Object.entries(page[section.id] ?? {})) {
            add(notes, theme, `- ${blockTitle(section)} (#${section.id}): ${text.trim().replace(/\n+/g, ' / ')}`);
        }
        for (const [theme, { verdict }] of Object.entries(judgements[section.id] ?? {})) {
            // In the theme on screen a verdict counts only while the block still
            // looks the way it did when it was judged; review.js marks that.
            if (theme === currentTheme() && section.dataset.catState === 'changed') continue;
            add(verdict === 'rejected' ? rejected : approved, theme, blockTitle(section));
        }
    }
    if (!notes.size && !approved.size && !rejected.size) return '';
    const order = THEMES.map((t) => t.name);
    const themes = [...new Set([...notes.keys(), ...approved.keys(), ...rejected.keys()])].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const lines = [`Catalogue feedback on ${pagePath()}`];
    for (const theme of themes) {
        lines.push('', `Theme ${themeLabel(theme)}:`);
        if (approved.has(theme)) lines.push(`Approved (${approved.get(theme).length}): ${approved.get(theme).join('; ')}`);
        if (rejected.has(theme)) lines.push(`Not approved (${rejected.get(theme).length}): ${rejected.get(theme).join('; ')}`);
        if (notes.has(theme)) lines.push('Notes:', ...notes.get(theme));
    }
    return lines.join('\n');
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
        <p class="cat-note">Every note and every approval on this page, from every theme, as one prompt to paste into the conversation. Both are kept in this browser only.</p>
        <pre class="cat-feedback-prompt" data-cat-prompt></pre>
        <div class="cat-feedback-actions">
            <button type="button" class="kp-button" data-cat-copy>Copy prompt</button>
            <button type="button" class="kp-button kp-button--ghost" data-cat-clear>Clear this page's notes</button>
            <span class="cat-note" role="status" aria-live="polite" data-cat-copy-status></span>
        </div>`;
    main.append(summary);

    const prompt = summary.querySelector('[data-cat-prompt]');
    const status = summary.querySelector('[data-cat-copy-status]');
    const copy = summary.querySelector('[data-cat-copy]');
    const clear = summary.querySelector('[data-cat-clear]');

    function renderSummary() {
        const text = promptText();
        prompt.textContent = text || 'No notes or approvals yet. Write under any block above; a note belongs to the theme on screen.';
        copy.disabled = !text;
        clear.disabled = !text;
    }

    function renderFields() {
        const theme = currentTheme();
        for (const { section, label, area } of fields) {
            label.textContent = `Feedback on “${blockTitle(section)}” in ${themeLabel(theme)}`;
            area.value = noteFor(section.id, theme);
        }
    }

    copy.addEventListener('click', async () => {
        const text = promptText();
        try {
            await navigator.clipboard.writeText(text);
            status.textContent = 'Copied. Paste it into the conversation.';
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
