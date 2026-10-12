// Forest, straightened (Kenny, 2026-10-09: "Despite our efforts to make
// everything uniform … many components are still not uniform. Think of
// navbars … maybe spinners … Analyse the Forest theme and see where we can
// still straighten it … Make a demo of it so we can make choices where
// needed."). The audit is README.md and findings.json; this page asks the
// questions only Kenny can answer, one family of findings each.
//
// A review-kit demo in aspect mode, forest only, on the package's own
// components in forest (css/forest-register.css is linked as it stands). The
// questions are data in aspects.js; this file builds each question's scene,
// the rows and the review kit's choices, and runs the page's one clock. Each
// OPTION is a live scene with one attribute on its wrapper
// (`data-fu-<question>="<key>"`) that options.css reads; the last option of
// every question is forest today, drawn with the values measured in Chromium.
// The network graph is in no scene: it changes in no theme.

import { ASPECTS, STORY, TITLE, THEME, LABEL } from './aspects.js';

/* ----------------------------------------------------------- the parts */

const button = (/** @type {string} */ label, modifier = '', extra = '') =>
    `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** A radio group needs a name of its own in every scene. */
let uid = 0;

const PART = {
    /** The bar, drawn as the package's bar parts in a plain row (no container query folds it), with its dropdown under Readings. */
    bar: () => `<div class="fu-barbox"><nav class="kp-nav fu-bar" aria-label="Pump house operations">
        <a class="kp-nav__brand" href="#fu-intro">North</a>
        <ul class="kp-nav__links fu-bar__links">
            <li class="fu-has-drop"><a class="kp-nav__link" href="#fu-intro" aria-current="page" aria-haspopup="true">Readings</a>
                <ul class="kp-nav__menu fu-drop fu-opens"><li><a href="#fu-intro">Pressure</a></li><li><a href="#fu-intro">Flow rate</a></li><li><a href="#fu-intro">Pump cycles</a></li></ul></li>
            <li><a class="kp-nav__link fu-pointed" href="#fu-intro">Rota</a></li>
            <li><a class="kp-nav__link kp-nav__link--cta fu-cta fu-pointed" href="#fu-intro">Report</a></li>
        </ul></nav></div>`,
    /** The bar on a phone: its toggle, and the menu that drops out of it. */
    phone: () => `<div class="fu-phonebox"><nav class="kp-nav fu-phone" aria-label="Pump house operations, on a phone">
        <a class="kp-nav__brand" href="#fu-intro">North</a>
        <button type="button" class="kp-nav__toggle fu-toggle fu-pointed" aria-expanded="true" aria-label="Close the navigation"></button>
        </nav><ul class="kp-nav__links fu-phonepanel fu-opens"><li><a class="kp-nav__link" href="#fu-intro" aria-current="page">Readings</a></li><li><a class="kp-nav__link" href="#fu-intro">Rota</a></li><li><a class="kp-nav__link" href="#fu-intro">Incidents</a></li></ul></div>`,
    /** Tabs, crumbs and page numbers, one of each pointed at. */
    trail: () => `<div class="fu-trail">
        <div class="kp-tabs__list" role="tablist" aria-label="Incident"><button type="button" class="kp-tab" role="tab" aria-selected="true">Summary</button><button type="button" class="kp-tab fu-link fu-pointed" role="tab" aria-selected="false">Readings</button><button type="button" class="kp-tab" role="tab" aria-selected="false">Log</button></div>
        <nav class="kp-breadcrumb" aria-label="Breadcrumb"><ol><li><a class="fu-link fu-pointed" href="#fu-intro">Sites</a></li><li><a href="#fu-intro">Pump house 4</a></li><li><span aria-current="page">Incident</span></li></ol></nav>
        <nav class="kp-pagination" aria-label="Incidents, page 1"><ul><li><a href="#fu-intro" aria-current="page">1</a></li><li><a class="fu-link fu-pointed" href="#fu-intro">2</a></li><li><a href="#fu-intro">3</a></li><li><a href="#fu-intro">Next</a></li></ul></nav>
    </div>`,
    menuRows: (/** @type {string[]} */ items, cls = 'kp-menu__item') =>
        `<div class="kp-popover fu-pop"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="${cls} fu-r${i === 1 ? ' fu-pointed' : ''}">${t}</button></li>`,
            )
            .join('')}</ul></div>`,
    themeOptions: (focus = true) =>
        `<div class="kp-popover fu-pop"><div class="kp-menu" role="menu" aria-label="Theme"><button type="button" role="menuitemradio" aria-checked="true" data-kp-theme="forest" class="fu-pt fu-pt--row fu-pointed">Forest</button><button type="button" role="menuitemradio" aria-checked="false" data-kp-theme="light" class="fu-pt fu-pt--row${
            focus ? ' fu-focused' : ''
        }">Light</button><button type="button" role="menuitemradio" aria-checked="false" data-kp-theme="formal" class="fu-pt fu-pt--row">Formal</button></div></div>`,
    days: (/** @type {number[]} */ list, pointed = -1, cls = 'kp-datepicker__day') =>
        `<div class="fu-days">${list
            .map((d) => `<button type="button" class="${cls} fu-pt${d === pointed ? ' fu-pointed' : ''}" aria-label="${d} October">${d}</button>`)
            .join('')}</div>`,
    tile: (title, body, cls = '') =>
        `<div class="kp-card fu-tile ${cls}"><p class="kp-card__title">${title}</p><p class="kp-card__body">${body}</p></div>`,
};

const caption = (/** @type {string} */ text) => `<p class="fu-cap">${text}</p>`;
const cell = (/** @type {string} */ cap, /** @type {string} */ html, cls = '') => `<div class="fu-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

const NAVIGATION = () =>
    cell('The bar: its dropdown under Readings; Rota and Report pointed at', PART.bar(), 'fu-part--wide') +
    cell('The bar on a phone: the menu under the toggle', PART.phone()) +
    cell('Tabs, crumbs and page numbers, one of each pointed at', PART.trail());

const LOADING = () =>
    cell(
        'A busy table',
        `<div class="kp-card fu-panel" aria-busy="true" data-fu-busy><p class="kp-card__title">Pump houses</p><p class="kp-card__body">Reading the pump houses…</p><span class="kp-spinner fu-panel__tree" role="status" aria-label="Working…"></span></div>`,
        'fu-part--wide',
    ) +
    cell(
        'A busy month',
        `<div class="kp-card fu-panel fu-panel--small" aria-busy="true" data-fu-busy><p class="kp-card__body">October</p><span class="kp-spinner fu-panel__tree" role="status" aria-label="Working…"></span></div>`,
    ) +
    cell('A busy button (the same in every option)', `<div class="fu-row">${button('Saving the rota…', '', 'aria-busy="true"')}</div>`) +
    cell(
        'Where no row fits: the spinner (the same in every option)',
        `<div class="fu-row"><span class="kp-spinner fu-spin" role="status" aria-label="Working…"></span><span class="kp-spinner fu-spin fu-spin--big" role="status" aria-label="Working…"></span></div>`,
    );

const POINTING = () =>
    cell(
        'An accordion heading, pointed at',
        `<details class="kp-accordion__item fu-acc"><summary class="kp-accordion__summary fu-pt fu-pt--row fu-pointed">Who may reopen a locked-out line?</summary><p>The day shift lead.</p></details>`,
    ) +
    cell('Date picker days, the 14th pointed at', PART.days([12, 13, 14, 15, 16], 14)) +
    cell('Theme menu: Forest pointed at, Light focused', PART.themeOptions()) +
    cell(
        'Combobox options, the second pointed at',
        `<ul class="kp-combobox__list fu-still-list" role="listbox" aria-label="Stations"><li class="kp-combobox__option fu-pt fu-pt--row" role="option" aria-selected="false">North 4</li><li class="kp-combobox__option fu-pt fu-pt--row fu-pointed" role="option" aria-selected="false">North 7</li><li class="kp-combobox__option fu-pt fu-pt--row" role="option" aria-selected="false">North 9</li></ul>`,
    ) +
    cell(
        'Chart legend keys, Flow pointed at',
        `<div class="fu-row"><button type="button" class="kp-chart__source fu-pt fu-pointed" aria-pressed="true"><i class="fu-key fu-key--a" aria-hidden="true"></i>Flow <b>412</b></button><button type="button" class="kp-chart__source fu-pt" aria-pressed="true"><i class="fu-key fu-key--b" aria-hidden="true"></i>Pressure <b>3.1</b></button></div>`,
    ) +
    cell(
        'Days of the month, the 14th focused',
        `<div class="fu-days fu-days--month"><span class="kp-calendar__day fu-mday">13</span><span class="kp-calendar__day fu-mday fu-focused" tabindex="-1">14</span><span class="kp-calendar__day fu-mday">15</span></div>`,
    );

const PAIRS = () => {
    uid += 1;
    return (
        cell(
            'A check and a choice are set, then cleared',
            `<div class="fu-checks"><label class="fu-check-row"><input type="checkbox" class="kp-field__check fu-check" /> Night shift</label><label class="fu-check-row"><input type="radio" class="kp-field__check fu-radio" name="fu-r-${uid}" /> Line 2</label></div>`,
        ) +
        cell(
            'A combobox list drops from its field',
            `<div class="kp-combobox fu-combo"><input class="kp-combobox__input" value="Nor" aria-label="Station" tabindex="-1" /><ul class="kp-combobox__list fu-list fu-opens" role="listbox" aria-label="Stations"><li class="kp-combobox__option" role="option" aria-selected="true">North 4</li><li class="kp-combobox__option" role="option" aria-selected="false">North 7</li></ul></div>`,
        ) +
        cell(
            'A side navigation group and an accordion item unfold',
            `<div class="fu-folds"><div class="fu-group"><button type="button" class="kp-sidenav__category-toggle" aria-expanded="true">Pumps</button><div class="fu-fold fu-fold--nav"><div class="fu-fold__in"><a class="kp-sidenav__link" href="#fu-intro">North 4</a><a class="kp-sidenav__link" href="#fu-intro">North 7</a></div></div></div>
            <details class="kp-accordion__item fu-acc" open><summary class="kp-accordion__summary">Who may reopen a line?</summary><div class="fu-fold fu-fold--acc"><div class="fu-fold__in"><p class="fu-acc__body">The day shift lead, after a walk round.</p></div></div></details></div>`,
        ) +
        cell(
            'The tour card arrives and leaves',
            `<div class="kp-card fu-tour fu-opens"><p class="kp-card__title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="fu-row">${button(
                'Skip',
                'kp-button--sm kp-button--ghost',
            )}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
        )
    );
};

const OVERLAYS = () =>
    cell(
        'The command palette',
        `<div class="kp-card fu-palette fu-opens"><input class="kp-palette__input" value="pump" aria-label="Search" tabindex="-1" /><div class="fu-palette__list"><div class="kp-palette__option" aria-selected="true">Pump house 4</div><div class="kp-palette__option" aria-selected="false">Pump cycles</div></div></div>`,
    ) +
    cell(
        'The date picker under its field',
        `<div class="fu-anchor fu-anchor--dp"><input class="kp-field__input" value="2026-10-14" aria-label="Date" tabindex="-1" /><div class="kp-datepicker__panel fu-dp fu-opens"><p class="kp-datepicker__title">October 2026</p>${PART.days(
            [12, 13, 14, 15, 16],
        )}</div></div>`,
    ) +
    cell(
        'The theme menu under its button',
        `<div class="fu-anchor fu-anchor--tm"><button type="button" class="kp-icon-button" aria-label="Choose a theme" aria-expanded="true">Aa</button><div class="fu-tm fu-opens">${PART.themeOptions(false)}</div></div>`,
    ) +
    cell(
        'The side navigation from its edge',
        `<div class="fu-window"><p class="fu-window__page">Night shift readings.</p><span class="fu-backdrop fu-opens" aria-hidden="true"></span><nav class="fu-sidenav fu-opens" aria-label="Sections"><a class="kp-sidenav__link" href="#fu-intro" aria-current="page">Overview</a><a class="kp-sidenav__link" href="#fu-intro">Readings</a><a class="kp-sidenav__link" href="#fu-intro">Rota</a></nav></div>`,
        'fu-part--wide',
    );

const FORMS = () =>
    cell(
        'A text field, pointed at',
        `<label class="kp-field fu-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input fu-pt fu-pointed" value="North 4" tabindex="-1" /></label>`,
    ) +
    cell(
        'A check, a choice and a switch, pointed at',
        `<div class="fu-checks"><label class="fu-check-row"><input type="checkbox" class="kp-field__check fu-pt fu-pointed" /> Night shift</label><label class="fu-check-row"><input type="radio" class="kp-field__check fu-pt fu-pointed" name="fu-f-${++uid}" /> Line 2</label><label class="kp-switch fu-switch"><input class="kp-switch__input fu-pt fu-pointed" type="checkbox" role="switch" aria-label="Live" /> Live</label></div>`,
    ) +
    cell('The drop zone, pointed at', `<div class="kp-upload__zone fu-zone fu-pt fu-pointed">Drop the night’s exports here, or choose them</div>`);

const ROWS = () =>
    cell(
        'A table, the second row pointed at',
        `<table class="kp-table fu-table"><thead><tr><th>Station</th><th>Flow</th></tr></thead><tbody><tr class="fu-r"><td>North 4</td><td>412</td></tr><tr class="fu-r fu-pointed"><td>North 7</td><td>398</td></tr><tr class="fu-r"><td>North 9</td><td>436</td></tr></tbody></table>`,
        'fu-part--wide',
    ) +
    cell(
        'A tree',
        `<ul class="kp-tree fu-tree" role="tree" aria-label="Exports"><li role="treeitem" class="fu-r">Line 1</li><li role="treeitem" class="fu-r fu-pointed">Line 2</li><li role="treeitem" class="fu-r">Line 3</li></ul>`,
    ) +
    cell(
        'The side navigation',
        `<nav class="fu-sidelist" aria-label="Sections"><a class="kp-sidenav__link fu-r" href="#fu-intro">Overview</a><a class="kp-sidenav__link fu-r fu-pointed" href="#fu-intro">Readings</a><a class="kp-sidenav__link fu-r" href="#fu-intro">Rota</a></nav>`,
    ) +
    cell(
        'The bar’s dropdown',
        `<ul class="kp-nav__menu fu-drop fu-drop--still"><li><a class="fu-r" href="#fu-intro">Pressure</a></li><li><a class="fu-r fu-pointed" href="#fu-intro">Flow rate</a></li><li><a class="fu-r" href="#fu-intro">Pump cycles</a></li></ul>`,
    ) +
    cell('A menu (the reference)', PART.menuRows(['Open incident', 'Assign to…', 'Rename']));

const FEEDBACK = () =>
    cell(
        'The alarm',
        `<div class="fu-alarmbox"><div class="fu-alarm fu-opens" role="alertdialog" aria-label="Alarm"><span class="fu-alarm__ring" aria-hidden="true"></span><p class="fu-alarm__title">Pressure lost at pump house 3</p><p class="fu-alarm__detail">Line 2 has read under 0.5 bar since 06:40.</p><div class="fu-row">${button(
            'Acknowledge',
            'kp-button--sm kp-button--destructive',
        )}</div></div></div>`,
        'fu-part--wide',
    ) +
    cell(
        'A toast (the reference: it already grows)',
        `<div class="kp-toast fu-toast fu-opens" role="status"><span class="kp-toast__body">Export finished.</span></div>`,
    );

const CORNERS = () =>
    cell(
        'Page numbers and the Report button',
        `<div class="fu-row"><nav class="kp-pagination" aria-label="Incidents"><ul><li><a href="#fu-intro" aria-current="page">1</a></li><li><a href="#fu-intro">2</a></li><li><a href="#fu-intro">3</a></li></ul></nav><a class="kp-nav__link kp-nav__link--cta fu-cta" href="#fu-intro">Report</a></div>`,
    ) +
    cell(
        'Date picker days, the 14th picked',
        `<div class="fu-days">${[12, 13, 14, 15].map((d) => `<button type="button" class="kp-datepicker__day" aria-selected="${d === 14}">${d}</button>`).join('')}</div>`,
    ) +
    cell(
        'Tree rows, Line 2 selected',
        `<ul class="kp-tree fu-tree" role="tree" aria-label="Exports"><li role="treeitem" aria-selected="false">Line 1</li><li role="treeitem" aria-selected="true">Line 2</li></ul>`,
    ) +
    cell('Theme menu options', PART.themeOptions(false).replace(/ fu-pointed/g, '')) +
    cell(
        'Colour swatches and legend keys',
        `<div class="fu-row"><span class="kp-colorpicker__swatch fu-swatch fu-swatch--a" aria-hidden="true"></span><span class="kp-colorpicker__swatch fu-swatch fu-swatch--b" aria-hidden="true"></span><button type="button" class="kp-chart__source" aria-pressed="true"><i class="fu-key fu-key--a" aria-hidden="true"></i>Flow <b>412</b></button></div>`,
    ) +
    cell(
        'A tag with its remove button, a radio and a switch (round stays round)',
        `<div class="fu-row"><span class="kp-tag fu-tag"><span>Pressure</span><button type="button" class="kp-tag__remove" aria-label="Remove Pressure">×</button></span><input type="radio" class="kp-field__check" checked aria-label="Line 2" /><label class="kp-switch fu-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Live" /></label></div>`,
    );

const TIMING = () =>
    cell('A skeleton block', `<span class="kp-skeleton kp-skeleton--block fu-block" aria-hidden="true"></span>`, 'fu-part--wide') +
    cell(
        'Skeleton lines',
        `<div class="fu-lines" aria-hidden="true"><span class="kp-skeleton fu-line"></span><span class="kp-skeleton fu-line"></span><span class="kp-skeleton fu-line"></span></div>`,
    ) +
    cell(
        'The busy bar',
        `<div class="kp-progressbar fu-bar-busy" role="progressbar" aria-label="Export busy" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
    ) +
    cell(
        'The spinner (the same in every option)',
        `<div class="fu-row"><span class="kp-spinner fu-spin" role="status" aria-label="Working…"></span></div>`,
    );

/** Each question's scene, by the `scene` key aspects.js names. */
const SCENES = /** @type {Record<string, () => string>} */ ({
    navigation: NAVIGATION,
    loading: LOADING,
    pointing: POINTING,
    pairs: PAIRS,
    overlays: OVERLAYS,
    forms: FORMS,
    rows: ROWS,
    feedback: FEEDBACK,
    corners: CORNERS,
    timing: TIMING,
});

/* ---------------------------------------------------- the review kit's text */

for (const [key, text] of Object.entries(STORY)) {
    const p = document.querySelector(`[data-fu-story="${key}"]`);
    if (p) p.textContent = text;
}
const h1 = document.querySelector('.fu-intro h1');
if (h1) h1.textContent = TITLE;

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}"]`));
// Each hint repeats the question, then what this option shows and its
// verdict: the dialog shows only the hint of the option on screen. Where the
// approved grammar already settles a question, its recommendation is ticked.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map((a) => ({
            id: a.id,
            label: a.label,
            ...(a.settled ? { default: '1' } : {}),
            options: a.options.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${a.question} ${o.see} ${o.verdict}`,
            })),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', THEME);
lookLine.textContent = `${ASPECTS.length} questions, one family of findings each; the first option is the recommendation and the last is ${LABEL.toLowerCase()} today. Pick one, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-fu-aspects]'));
const toc = document.querySelector('[data-fu-toc]');
ASPECTS.forEach((a, n) => {
    const scene = SCENES[a.scene];
    if (!scene) throw new Error(`no scene for ${a.id}: ${a.scene}`);
    const box = document.createElement('section');
    box.className = 'fu-aspect';
    box.id = `fu-${a.id}`;
    box.setAttribute('data-fu-aspect', a.id);
    box.setAttribute('data-fu-count', String(a.options.length));
    box.setAttribute('aria-labelledby', `h-fu-${a.id}`);
    box.innerHTML = `<div class="fu-aspect__head">
        <h3 id="h-fu-${a.id}"><span class="fu-aspect__no">${n + 1}</span> <span class="fu-aspect__label"></span> <span class="fu-aspect__rule"></span></h3>
        <p class="fu-aspect__q"></p><p class="fu-aspect__why"></p></div><div class="fu-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.fu-aspect__label')).textContent = a.label;
    /** @type {HTMLElement} */ (box.querySelector('.fu-aspect__rule')).textContent = a.rule;
    /** @type {HTMLElement} */ (box.querySelector('.fu-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.fu-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.fu-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'fu-col';
        col.setAttribute('data-fu-option', String(at + 1));
        col.innerHTML = `<p class="fu-label"><span class="fu-label__no">${at + 1}</span> <span class="fu-label__name"></span>${
            at === 0 ? ' <span class="fu-label__rec">Recommended</span>' : ''
        }${at === a.options.length - 1 ? ' <span class="fu-label__today">Today</span>' : ''}</p><p class="fu-see"></p><p class="fu-verdict"></p>
        <div class="fu-scene" data-fu-kind="${a.kind}" data-fu-${a.id}="${o.key}" data-fu-phase="hold"${o.untick ? ` data-fu-untick="${o.untick}"` : ''}>${scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.fu-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.fu-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.fu-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('fu-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#fu-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

/* ---------------------------------------------------------- the one clock */

// Every scene that opens and closes is replayed by one clock, so the options
// of a row start together and can be compared. One cycle: `gap` (closed: the
// part is not drawn), `in` (it opens), `hold` (it stands open), `out` (it
// closes). `in` and `out` outlast the slowest motion (one growth, 1000 ms),
// so nothing is cut off. The CSS keys every motion to these phases; the clock
// only sets the attribute, and sets and clears the real checks of question 4.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-fu-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 600],
    ['in', 1400],
    ['hold', 1600],
    ['out', 1400],
]);
let timer = 0;
let untickTimer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

/** The real checks of question 4: set on `in`, cleared on `out` at once or after their tick is taken back. */
function checks(/** @type {string} */ phase) {
    clearTimeout(untickTimer);
    for (const scene of section.querySelectorAll('.fu-scene[data-fu-pairs]')) {
        const inputs = /** @type {HTMLInputElement[]} */ ([...scene.querySelectorAll('.fu-check, .fu-radio')]);
        if (phase === 'in' || phase === 'hold') for (const i of inputs) i.checked = true;
        if (phase === 'gap') for (const i of inputs) i.checked = false;
        if (phase === 'out' && scene.getAttribute('data-fu-untick') === 'now') for (const i of inputs) i.checked = false;
    }
    if (phase === 'out')
        untickTimer = window.setTimeout(() => {
            for (const i of section.querySelectorAll('.fu-scene[data-fu-untick="after"] :is(.fu-check, .fu-radio)'))
                /** @type {HTMLInputElement} */ (i).checked = false;
        }, 220 * slow);
}

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.fu-scene[data-fu-kind="cycle"]')) scene.setAttribute('data-fu-phase', phase);
    checks(phase);
}

function run(/** @type {number} */ at = 0) {
    clearTimeout(timer);
    if (reduced.matches) {
        setPhase('hold');
        return;
    }
    if (dialogPaused()) {
        timer = window.setTimeout(() => run(at), 300);
        return;
    }
    const [phase, ms] = PHASES[at];
    setPhase(phase);
    timer = window.setTimeout(() => run((at + 1) % PHASES.length), ms * slow);
}

/** The loops start again together (questions 2 and 10), so their rhythms can be compared from the same start. */
function restartLoops() {
    for (const scene of section.querySelectorAll('.fu-scene[data-fu-kind="loop"]')) {
        scene.classList.add('fu-restart');
        void (/** @type {HTMLElement} */ (scene).offsetWidth);
        scene.classList.remove('fu-restart');
    }
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
radio('data-fu-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--fu-slow', String(slow));
    restartLoops();
    run(0);
});
document.querySelector('[data-fu-replay]')?.addEventListener('click', () => {
    restartLoops();
    run(0);
});

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.fu-scene a, .fu-scene button, .fu-scene summary, .fu-scene input') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();
