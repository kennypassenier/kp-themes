// The catalogue shell: the side navigation over every review page, the
// theme switcher, the judging panel under each block (judging.js), the
// prompt bars (prompt.js), and the developer overlay on demand. Components themselves are attached by
// js/auto.js; this file only drives the chrome around them.
import { THEMES } from '../js/theme-registry.js';
import { applyTheme, initializeTheme } from '../js/theme-core.js';
import { paintRemembered } from '../js/remember.js';
import { attachThemePickers, themeMenuMarkup } from '../js/theme-picker.js';
import { attachLazyRegisters, registersPresent } from '../js/lazy-register.js';
import { COMPONENT_PAGES, PAGES } from './pages.js';
import { pagePath, REVIEW_PAGE, slugOf } from './review-state.js';
import { mountJudging } from './judging.js';
import { mountPrompt } from './prompt.js';
import './demos.js';

/** The repository root, wherever the pages are served from (a local server, a Pages subpath). */
const ROOT = new URL('../', import.meta.url);

/* ---------------------------------------------------------- navigation */

function buildNavigation() {
    const here = pagePath();
    const nav = document.createElement('nav');
    nav.className = 'kp-sidenav cat-nav';
    nav.id = 'cat-nav';
    nav.setAttribute('aria-label', 'Review pages');
    // Kenny's own case: a group he closed is still closed on the page the
    // link led to [js/remember.js]. The name is the catalogue's, not the
    // page's — the whole point is that it survives the navigation.
    nav.setAttribute('data-kp-remember', 'catalogue-nav');

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
        // Each group keeps its own state under its own name, so adding a
        // group does not shift what the others remembered.
        category.setAttribute('data-kp-remember', group);
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
            // An example page wears the shell only when asked (pages.js).
            link.href = new URL(page.review ? `${page.href}?review` : page.href, ROOT).href;
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

/**
 * The shell's own stylesheet, if the page did not link it [fix-60].
 *
 * `body.cat-shell { display: flex }` is what puts the navigation BESIDE the
 * page rather than above it. Seven research demos loaded this script and not
 * that file, so their navigation stacked on top of the demo and the content
 * started below it — Kenny, 2026-09-17: "de content moet gewoon naast de
 * sidenav staan". A page can forget a link; a script that brings its own
 * stylesheet cannot.
 */
function mountStyles() {
    const href = new URL('catalogue/catalogue.css', ROOT).href;
    if ([...document.styleSheets].some((sheet) => sheet.href === href)) return;
    if (document.querySelector(`link[rel='stylesheet'][href='${href}']`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.append(link);
}

function mountShell() {
    mountStyles();
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
    // Painted before it is in the document: this navigation is built by
    // script, so the restore js/auto.js does at boot has nothing to paint.
    // Doing it here means the closed group is never drawn open.
    paintRemembered(nav, 'sidenav');
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
            // Not remembered: the window got narrow, Kenny did not close it.
            if (narrow.matches) handle?.close({ remember: false });
        };
        fit();
        narrow.addEventListener('change', fit);
    });
    return bar;
}

/* --------------------------------------------------------------- theme */

function mountThemeMenu(bar) {
    // A page that IS one theme (a theme portrait, scope-97) says so with
    // data-cat-theme-fixed as well: it shows that theme and nothing else, so
    // it carries no menu and a stored choice does not move it.
    const root = document.documentElement;
    if (root.hasAttribute('data-cat-theme-fixed') && root.getAttribute('data-cat-theme')) {
        applyTheme(/** @type {string} */ (root.getAttribute('data-cat-theme')));
        return;
    }
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

/* ------------------------------------------------------------ judging */

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

// A component page judges its blocks exactly as the review page does, under
// the review page's keys, and a judged block leaves it the same way (Kenny,
// 2026-09-13: "dat moet ook zo werken zoals de 'every component' pagina"). A
// research demo judges its own sections under its own page; nothing leaves
// it, a demo is read whole.
async function mountBlocks() {
    const here = pagePath();
    const component = COMPONENT_PAGES.find((p) => p.href === here);
    let sections = [...document.querySelectorAll('.cat-block[id]')];
    if (!sections.length) sections = [...document.querySelectorAll('main section[id]')];
    if (!sections.length) return;

    let raw = null;
    try {
        const response = await fetch(location.href);
        if (response.ok) raw = new DOMParser().parseFromString(await response.text(), 'text/html');
    } catch {
        /* the markup as it stands now is the fallback */
    }
    const slug = slugOf(here);
    const entries = sections.map((section) => {
        const key = component ? `${slug}--${section.id}` : `${here}#${section.id}`;
        const heading = blockTitle(section);
        return {
            key,
            notePage: component ? REVIEW_PAGE : here,
            noteBlock: component ? key : section.id,
            // The review page's title for the same block, so a prompt names it the same way.
            title: component ? `${component.label} › ${heading}` : heading,
            source: raw?.getElementById(section.id)?.outerHTML ?? section.outerHTML,
            root: section,
            fieldId: `cat-feedback-${section.id}`,
            place: (panel) => section.append(panel),
        };
    });

    let toolbar = null;
    if (component) {
        toolbar = document.createElement('div');
        toolbar.className = 'cat-review-bar';
        sections[0].before(toolbar);
    }
    const judging = mountJudging({ entries, toolbar });
    await judging.start();
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
// The review page and the compare page gather their blocks and judge them
// themselves (review.js, frame/compare.js); every page carries the prompt.
mountPrompt({ bar, main: document.querySelector('.cat-main') ?? document.querySelector('main') ?? bar.parentElement });
if (!document.querySelector('[data-cat-compose]')) mountBlocks();
