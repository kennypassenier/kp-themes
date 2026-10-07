// How deep is synthwave's page floor? (Kenny's anchor, 2026-10-07 21:21: the page
// horizon, "the floor being the page below it"; the port drew a 3.5 rem band inside
// the header, because the header is a layout container and a floor any deeper,
// painted by it, would lie over the plates that follow.)
//
// A review-kit demo in aspect mode, synthwave only, ONE aspect ("floor") with one
// option per page in the dialog, each applied to the same real page of the package's
// own components (.kp-page, .kp-page-header with a More ▾ popover trigger, .kp-field,
// .kp-kpi, .kp-card, .kp-progressbar, .kp-table, .kp-badge). The page tube, the floor,
// the piece of tube a hand lights and the loading are the package's own
// (css/synthwave-register.css); options.css only changes how deep the floor runs and
// what carries it, scoped by `data-sf-floor="<key>"` on the scene.
//
// The scene holds two pages: one with a toolbar under its header (room under the
// header) and one with the plates right under it (no room), because the options differ
// exactly there. The one clock below writes `data-sf-phase` (rest, busy) and sets
// `aria-busy` on both pages: the tube is then a track the ramp flows through and the
// floor drives toward you, which at depth is the thing to see.

/* ------------------------------------------------------------- the texts */

const ASPECT = {
    id: 'floor',
    label: 'The depth of the floor',
    question: 'How deep is the floor under the page tube, and what does it cost?',
    why: 'The anchor you picked says the floor is the page below the tube. The package’s header can only paint a band of its own height; anything deeper has to lie behind what follows, or make room for itself. Each option below is that choice on the same real page, at real size: look at how far the grid runs, whether it stays behind the toolbar, key figures and cards or pushes them down, and whether a plate edge is touched.',
};

const OPTIONS = [
    {
        key: 'page',
        name: 'The floor is the page, behind the plates',
        rule: 'Depth: 8.5 rem, from the tube down, painted by the header behind what follows. The header reserves nothing; whatever follows it stands on the floor.',
        see: 'The grid runs deep under the tube and the toolbar, the key figures and the cards stand on it: you see it in the gaps between plates and behind the quiet toolbar, never through a plate. Waiting, the floor drives toward you across the whole depth. The header is exactly as tall as without a floor, so the page does not grow.',
        shows: 'Why it suits synthwave: this is the anchor as Kenny decided it, one horizon with the page as its floor, components carrying 1 px of its light. The deeper grid is what makes the horizon read as a place.',
        cost: 'Cost: the header’s floor is lifted behind what follows (`z-index: -1` in the header’s own stacking context, and whatever follows is made positioned at no specificity, `position: relative` unless it says otherwise). The floor also lies behind a toolbar’s quiet parts (its lines are 30 to 40 % under the words of a ghost button, which still read). Plate edges: untouched, 0 differing pixels in the measurement.',
        rec: true,
    },
    {
        key: 'band',
        name: 'A 3.5 rem band inside the header',
        rule: 'Depth: 3.5 rem, painted inside the header and kept clear by its own foot padding. This is what the package has now.',
        see: 'A shallow strip of grid under the tube, then the page: the toolbar and the plates begin below it. The floor is a tidy footer to the header and no more; there is no ground under the page.',
        shows: 'Why it is safe: the header paints only what it owns, nothing can lie over a plate and no other rule is needed.',
        cost: 'Cost: the horizon reads as a line with a hem, not as a floor. The depth is tied to a padding, so a header with a floor is always 3.5 rem taller than one without.',
    },
    {
        key: 'reserve',
        name: 'The header is as deep as the floor',
        rule: 'Depth: 8.5 rem inside the header: its foot padding grows by 5 rem, so the plates start under the floor and nothing is painted over anything.',
        see: 'The deep grid under the tube, then a clean break, then the toolbar and the plates: the floor is a band of its own and the page begins under it. Waiting, the floor drives across the whole band.',
        shows: 'Why it is workable: it is the only deep version that needs no stacking trick and touches nothing.',
        cost: 'Cost: 5 rem of height on every page, with or without a toolbar: the key figures sit 5 rem lower, and on a phone the header takes a full screen’s third before any content. The floor is a stage under the title, not the ground under the page.',
    },
    {
        key: 'room',
        name: 'Deep only where there is room',
        rule: 'Depth: 8.5 rem when nothing that is a plate follows the header (a toolbar, a line of text, an empty page), the 3.5 rem band when plates follow it directly.',
        see: 'Page 1 (a toolbar under the header) has the deep floor, page 2 (plates right under the header) the band: two depths on one site. The deep floor is a band of its own, like the reserved one.',
        shows: 'Why it is tempting: pages with room get the full floor and pages that are dense stay compact.',
        cost: 'Cost: the horizon changes depth from page to page, which breaks the strict grammar within a theme (one floor, everywhere); the rule needs `:has()` over a list of every plate class; and a toolbar added or removed changes the header’s height.',
    },
];

/* ------------------------------------------------------------ the real page */

const TABLE = `<div class="kp-table-wrap">
    <table class="kp-table">
        <caption class="kp-sr-only">Readings from the pump houses</caption>
        <thead><tr><th scope="col">Pump house</th><th scope="col">State</th><th scope="col" class="kp-text-end">Pressure</th></tr></thead>
        <tbody>
            <tr><td>Pump house 1</td><td><span class="kp-badge kp-badge--success">Online</span></td><td class="kp-text-end">3.4 bar</td></tr>
            <tr><td>Pump house 3</td><td><span class="kp-badge kp-badge--warning">Low</span></td><td class="kp-text-end">2.1 bar</td></tr>
        </tbody>
    </table>
</div>`;

function tile(label, value, small, trend, v, tone) {
    return `<div class="kp-kpi"${tone ? ` data-kp-tone="${tone}"` : ''}>
            <span class="kp-kpi__label">${label}</span>
            <span class="kp-kpi__value">${value}<small>${small}</small></span>
            <span class="kp-kpi__trend">${trend}</span>
            <span class="kp-kpi__meter" role="meter" aria-label="${label}: ${Math.round(v * 100)} %" aria-valuenow="${Math.round(v * 100)}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${v}"></span>
        </div>`;
}

/** The header with its four actions, the last a real popover trigger (More ▾) with the inline anchor-name a real one has. */
function header(id) {
    return `<header class="kp-page-header">
        <div class="kp-page-header__inner">
            <div>
                <h1 class="kp-page-header__title">Pump houses</h1>
                <p class="kp-page-header__description">Fifteen pump houses on the northern network: their state, the last reading of each, and what needs a visit.</p>
            </div>
            <div class="kp-page-header__actions">
                <button type="button" class="kp-button">Export readings</button>
                <button type="button" class="kp-button">Schedule a visit</button>
                <button type="button" class="kp-button kp-button--primary">Add a pump house</button>
                <button type="button" class="kp-button" popovertarget="${id}-more" aria-haspopup="menu" style="anchor-name: --${id}-more">More ▾</button>
                <div popover="auto" id="${id}-more" class="kp-popover" style="position-anchor: --${id}-more">
                    <ul class="kp-menu" role="menu">
                        <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Import from a file…</button></li>
                        <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Print the overview</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>`;
}

/** Page 1: a toolbar under the header (room). Page 2: the plates right under it (no room). `p` makes every id unique. */
function realPage(p) {
    const kpis = `<div class="kp-kpis" role="group" aria-label="Network at a glance">
            ${tile('Pump houses online', '14', 'of 15', 'Pump house 7 offline', 0.93)}
            ${tile('Flow now', '412', 'm³/h', '6 % on yesterday', 0.62)}
            ${tile('Mean pressure', '3.2', 'bar', 'Within range', 0.8)}
            ${tile('Open incidents', '3', '', '1 critical', 0.3, 'warning')}
        </div>`;
    const grid = `<div class="sf-grid">
            <section class="kp-card" aria-labelledby="${p}-h1">
                <div class="sf-stack">
                    <div class="sf-head"><h2 class="kp-card__title" id="${p}-h1">Syncing readings</h2><span class="kp-badge">Live</span></div>
                    <p>Four pump houses are answering.</p>
                    <div class="kp-progressbar" role="progressbar" aria-label="Syncing readings, 62 %" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style="--kp-value: 0.62"><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>
                    ${TABLE}
                </div>
            </section>
            <section class="kp-card" aria-labelledby="${p}-h2">
                <div class="sf-stack">
                    <div class="sf-head"><h2 class="kp-card__title" id="${p}-h2">Alarm threshold</h2><span class="kp-badge kp-badge--warning">2 of 3 valid</span></div>
                    <p>The pressure at which a pump house raises an alarm.</p>
                    <div class="kp-field">
                        <label class="kp-field__label" for="${p}-site">Site</label>
                        <input class="kp-field__input" id="${p}-site" type="text" value="Pump house 4" />
                    </div>
                    <div class="sf-toolbar">
                        <button type="button" class="kp-button kp-button--primary">Save</button>
                        <button type="button" class="kp-button">Cancel</button>
                    </div>
                </div>
            </section>
        </div>`;
    const toolbar = `<div class="sf-toolbar" role="group" aria-label="Filters">
            <input class="kp-field__input" type="search" aria-label="Search pump houses" placeholder="Search pump houses" />
            <button type="button" class="kp-button kp-button--ghost kp-button--sm">All</button>
            <button type="button" class="kp-button kp-button--ghost kp-button--sm">Online</button>
            <button type="button" class="kp-button kp-button--ghost kp-button--sm">Needs a visit</button>
        </div>`;
    return `<div class="sf-real" data-sf-real><div class="kp-page">${header(`${p}-a`)}${toolbar}${kpis}${grid}</div></div>
    <p class="sf-caption">Page 2 · the plates right under the header</p>
    <div class="sf-real" data-sf-real><div class="kp-page">${header(`${p}-b`)}${kpis}${grid.replace(new RegExp(`${p}-`, 'g'), `${p}-2-`)}</div></div>`;
}

/* ---------------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="synthwave-floor"]'));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: ASPECT.id,
            label: ASPECT.label,
            options: OPTIONS.map((o, at) => ({
                value: String(at + 1),
                label: o.name,
                hint: `${o.rule} ${o.cost}`.replaceAll('`', ''),
            })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'synthwave');
lookLine.textContent = `One question, ${OPTIONS.length} depths of the page floor, each on the same real page at real size: a header with a More ▾ menu, a toolbar, key figures and two cards, and a second page with the plates right under the header. Look at how far the grid runs, whether it stays behind the content or pushes it down, and what the header costs in height; hover More ▾ and the buttons for the piece of tube under the hand. Pick the depth, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the row */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-sf-aspects]'));
const toc = document.querySelector('[data-sf-toc]');
const row = document.createElement('section');
row.className = 'sf-aspect';
row.id = `sf-${ASPECT.id}`;
row.setAttribute('data-sf-aspect', ASPECT.id);
row.setAttribute('aria-labelledby', `h-sf-${ASPECT.id}`);
row.innerHTML = `<div class="sf-aspect__head"><h3 id="h-sf-${ASPECT.id}">${ASPECT.label}</h3><p class="sf-aspect__q"></p><p class="sf-aspect__why"></p></div><div class="sf-four" data-sf-n="${OPTIONS.length}"></div>`;
/** @type {HTMLElement} */ (row.querySelector('.sf-aspect__q')).textContent = ASPECT.question;
/** @type {HTMLElement} */ (row.querySelector('.sf-aspect__why')).textContent = ASPECT.why;
const four = /** @type {HTMLElement} */ (row.querySelector('.sf-four'));
OPTIONS.forEach((o, at) => {
    const col = document.createElement('div');
    col.className = 'sf-col';
    col.id = `sf-option-${at + 1}`;
    col.setAttribute('data-sf-option', String(at + 1));
    col.innerHTML = `<p class="sf-label-row"><span class="sf-label-row__no">${at + 1}</span> <span class="sf-label-row__name"></span>${o.rec ? ' <span class="sf-label-row__rec">Recommended</span>' : ''}</p>
        <p class="sf-rule"></p><p class="sf-see"></p><p class="sf-verdict${o.rec ? ' sf-verdict--rec' : ''}"></p>
        <div class="sf-scene" data-sf-kind="loop" data-sf-${ASPECT.id}="${o.key}" data-sf-phase="rest">
            <p class="sf-caption">Page 1 · a toolbar under the header</p>
            ${realPage(`${o.key}`)}
        </div>
        <p class="sf-measured" data-sf-measured></p>`;
    /** @type {HTMLElement} */ (col.querySelector('.sf-label-row__name')).textContent = o.name;
    /** @type {HTMLElement} */ (col.querySelector('.sf-rule')).textContent = o.rule;
    /** @type {HTMLElement} */ (col.querySelector('.sf-see')).textContent = o.see;
    /** @type {HTMLElement} */ (col.querySelector('.sf-verdict')).textContent = `${o.shows} ${o.cost}`;
    four.append(col);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#sf-option-${at + 1}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${o.name}${o.rec ? ' (recommended)' : ''}`;
        toc.append(li);
    }
});
rows.append(row);

/* ---------------------------------------------------------- the one clock */

// The page rests, then waits (aria-busy on both pages: the tube is a track the ramp
// flows through, the floor drives toward you), then rests again. The CSS is the
// package's; the clock only writes the state.
const scenes = /** @type {HTMLElement[]} */ ([...section.querySelectorAll('.sf-scene[data-sf-kind="loop"]')]);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-sf-motion]');
let slow = 1;
let mode = 'auto';
const PHASES = /** @type {const} */ ([
    ['rest', 3500],
    ['busy', 5400],
]);
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
function dialogPaused() {
    return Boolean(document.getElementById('rv-flip-pause')?.textContent);
}

function setPhase(/** @type {string} */ phase) {
    for (const scene of scenes) {
        scene.setAttribute('data-sf-phase', phase);
        for (const page of scene.querySelectorAll('[data-sf-real]')) page.setAttribute('aria-busy', String(phase === 'busy'));
    }
}

function run(/** @type {number} */ at = 0) {
    clearTimeout(timer);
    if (reduced.matches) {
        setPhase('rest');
        return;
    }
    if (dialogPaused()) {
        timer = window.setTimeout(() => run(at), 300);
        return;
    }
    if (mode === 'rest') return setPhase('rest');
    if (mode === 'busy') return setPhase('busy');
    const [phase, ms] = PHASES[at];
    setPhase(phase);
    timer = window.setTimeout(() => run((at + 1) % PHASES.length), ms * slow);
}

/* --------------------------------------------------------------- controls */

function radio(/** @type {string} */ attr, /** @type {(value: string) => void} */ apply) {
    const buttons = [...document.querySelectorAll(`[${attr}]`)];
    for (const b of buttons)
        b.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === b));
            apply(b.getAttribute(attr) || '');
        });
}
radio('data-sf-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--sf-slow', String(slow));
    run(0);
});
radio('data-sf-mode', (value) => {
    mode = value;
    section.setAttribute('data-sf-state', value);
    run(0);
});
document.querySelector('[data-sf-replay]')?.addEventListener('click', () => run(0));

// The buttons in the pages are scenery: a click does nothing (More ▾ does not open).
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.sf-scene a, .sf-scene button') : null;
    if (target) event.preventDefault();
});

/* ------------------------------------------------------------ the numbers */

const px = (/** @type {number} */ n) => `${Math.round(n * 10) / 10} px`;
const rem = (/** @type {number} */ n) => `${Math.round((n / 16) * 100) / 100} rem`;

/** The numbers under each page: the real header and its floor, measured, not assumed. */
function measured(/** @type {HTMLElement} */ scene) {
    const note = scene.parentElement?.querySelector('[data-sf-measured]');
    if (!note) return;
    const parts = [...scene.querySelectorAll('.sf-real')].map((real, i) => {
        const header = real.querySelector('.kp-page-header');
        const first = header?.nextElementSibling;
        if (!header || !first) return '';
        const h = header.getBoundingClientRect();
        const f = first.getBoundingClientRect();
        const floor = parseFloat(getComputedStyle(header, '::before').height) || 0;
        const behind = getComputedStyle(header, '::before').zIndex === '-1';
        return `Page ${i + 1}: the header is ${px(h.height)} tall; the floor is ${px(floor)} (${rem(floor)}) deep and ${behind ? 'lies behind what follows' : 'lies inside the header'}; the first part under the header starts ${px(f.top - h.bottom)} below it and ${px(f.top - h.top)} below its top.`;
    });
    note.textContent = `Measured here: ${parts.join(' ')}`;
}

const placeNumbers = () => scenes.forEach(measured);
if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(placeNumbers);
    for (const scene of scenes) ro.observe(scene);
}
document.fonts?.ready.then(placeNumbers);
placeNumbers();

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();
