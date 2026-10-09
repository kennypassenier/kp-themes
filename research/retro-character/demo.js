// What makes retro retro (Kenny, 2026-10-08, after the anchor round: "Copying…:
// the sheet flies between the folders", and "I like the windows environment
// with the task bar and desktop that you created around it"). Retro is the 1995
// desktop, and what it does is COPY: a part flies in as a sheet and lands
// whole, is copied over when it changes, waits while sheets fly and blocks
// fill, and flies out to the Recycle Bin when it goes; nothing eases, every
// motion is whole frames of 90 ms. The questions below turn that anchor into
// rules for every other component (themes/retro/CHARACTER.md, G1-G21).
//
// A review-kit demo in aspect mode, retro only. The questions are data in
// aspects.js (the designer's text, used verbatim); this file adds each
// question's scene (a small 1995 desktop with the package's own components in
// retro on it: the teal ground, My Computer and the Recycle Bin, the taskbar
// with Start and the clock), builds the rows and the review kit's choices from
// that data, and runs the page's one clock. Each OPTION is a live scene with
// one attribute on its wrapper (`data-rt-<question>="<key>"`) that options.css
// reads. The first option is the recommendation. The network graph is in no
// scene: it changes in no theme (Kenny, 2026-10-07 02:54).

import { ASPECTS, STORY, TITLE, THEME, LABEL } from './aspects.js';

/** One frame of the clock, ms: the Copying dialog's 90 ms (G1, G4). */
const FRAME = 90;

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;
/** A button whose label is its own span, so a press moves the label and never the box. */
const pressable = (label, modifier = '', extra = '') =>
    `<button type="button" class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span></button>`;

/** The package's bar: a track, the fill, the head (retro draws the fill as navy blocks). */
const barInner =
    '<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>';
/** The bar while no share is known, with the small sheet that hops along it. @param {string} label @param {string} size */
const busyBar = (label = 'Copying', size = '') =>
    `<div class="rt-hopper${size ? ` rt-hopper--${size}` : ''}"><div class="kp-progressbar rt-bar${
        size ? ` kp-progressbar--${size}` : ''
    }" role="progressbar" aria-label="${label}" data-kp-indeterminate>${barInner}</div><i class="rt-hop" aria-hidden="true"></i></div>`;
/** The bar with a share known. @param {number} value */
const shareBar = (value = 0.62, label = 'Copied') =>
    `<div class="kp-progressbar rt-bar rt-bar--share" role="progressbar" aria-label="${label}, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}">${barInner}</div>`;

/** The change under a key figure: the tone's mark. */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta rt-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter rt-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const TREND = '0,26 15,21 30,23 45,15 60,17 75,10 90,12 105,6 120,8';
const TREND_B = '0,20 15,24 30,16 45,19 60,11 75,14 90,7 105,10 120,4';
const polyline = (points = TREND) =>
    `<polyline data-rt-line points="${points}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/>`;
const plot = (cls = '') =>
    `<span class="rt-plot ${cls}" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline()}</svg><span class="rt-plot__blocks"></span></span>`;

/** A 1995 window: the title bar in the ramp with its icon and controls, a menu bar, the client area, a status bar with the grip. */
const win = (title, body, { menu = true, status = 'Ready', cls = '' } = {}) =>
    `<div class="rt-win ${cls}"><div class="rt-win__title"><span class="rt-win__sysicon" aria-hidden="true"></span><span>${title}</span><span class="rt-win__controls" aria-hidden="true"><i></i><i></i><i></i></span></div>${
        menu
            ? '<div class="rt-win__menu" aria-hidden="true"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></div>'
            : ''
    }<div class="rt-win__body">${body}</div>${
        status ? `<div class="rt-win__status"><span>${status}</span><span class="rt-win__grip" aria-hidden="true"></span></div>` : ''
    }</div>`;

/** The window controls a dialog's title bar carries: the close box alone. */
const CLOSE = '<span class="rt-win__controls rt-win__controls--one" aria-hidden="true"><i></i></span>';

/** The menu's entries, the package's markup. @param {string[]} items @param {string} cls */
const entries = (items, cls = '') =>
    items
        .map((t, i) => {
            const bad = /^Delete/.test(t);
            return `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${bad ? ' kp-menu__item--destructive rt-bad' : ''}${
                i === 0 && cls ? ` ${cls}` : ''
            }"><span class="rt-entry">${t}</span></button></li>`;
        })
        .join('');

const PART = {
    /** A 1995 dialog box: the package's dialog with its title bar, the message beside its icon, the buttons under it. */
    dialog: (
        title = 'Copy readings?',
        text = 'Copy 12 readings to Backup?',
        icon = 'warn',
    ) => `<div class="kp-dialog rt-dialog" role="group" aria-label="${title}">
        <p class="kp-dialog__title rt-titlebar"><span>${title}</span>${CLOSE}</p>
        <div class="rt-dialog__msg"><span class="rt-icon16 rt-icon16--${icon}" aria-hidden="true"></span><p class="kp-dialog__description">${text}</p></div>
        <div class="kp-dialog__actions">${button('Copy', 'kp-button--sm kp-button--primary')}${button('Cancel', 'kp-button--sm')}</div>
    </div>`,
    /** A menu dropped from its button: the package's popover and menu. */
    pop: (items = ['Open incident', 'Assign to…', 'Delete'], cls = '') =>
        `<div class="kp-popover rt-pop ${cls}"><ul class="kp-menu" role="menu">${entries(items)}</ul></div>`,
    /** A static menu panel. */
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', first = '') =>
        `<div class="kp-popover rt-pop rt-pop--static ${cls}"><ul class="kp-menu" role="menu">${entries(items, first)}</ul></div>`,
    /** A tile: the package's card as a window part, its title on the ramp, its footer a status bar. */
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h', foot = 'Updated 07:12', cls = '') => `<div class="kp-card rt-tile ${cls}">
        <p class="kp-card__title rt-titlebar"><span>${label}</span></p>
        <p class="kp-card__body">${body}</p>
        <p class="rt-tile__foot"><span>${foot}</span></p>
    </div>`,
    /** A key figure: the package's kpi, its label on the caption strip. */
    kpi: (label = 'Flow now', value = '412', foot = note('6 %'), cls = '', tag = 'div', extra = '') =>
        `<${tag} class="kp-kpi rt-kpi ${cls}" ${extra}>
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value"><span class="rt-carrier" data-rt-num>${value}</span></span>
        <span class="kp-kpi__trend">${foot}</span>
    </${tag}>`,
    /** A week or a month of days, in the date picker's white well. */
    days: (from = 12, n = 7, cls = '', mark = () => '') =>
        `<div class="rt-days ${cls}" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="rt-day${mark(from + i)}" style="--i: ${i}"><span class="rt-day__num">${from + i}</span></span>`)
            .join('')}</div>`,
    /** The state word in its status field. */
    state: (word = 'Running', tone = 'good') =>
        `<span class="rt-state" data-rt-tone="${tone}"><span class="rt-state__lamp" aria-hidden="true"></span><span class="rt-state__word rt-carrier" data-rt-word>${word}</span></span>`,
    alert: (text = 'Pump house 4 is back online.', kind = '') =>
        `<div class="kp-alert ${kind} rt-alert" role="status"><span class="rt-icon16 rt-icon16--${kind ? 'warn' : 'info'}" aria-hidden="true"></span><span class="kp-alert__body">${text}</span></div>`,
    /** A strip column: a sunken status-bar pane with its figure. */
    column: (label = 'Open', value = '38') =>
        `<div class="rt-column"><span class="kp-kpi__label">${label}</span><span class="rt-column__num"><span class="rt-carrier" data-rt-num>${value}</span></span></div>`,
    skeleton: () =>
        `<div class="rt-skel" aria-hidden="true"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span></div>`,
    toast: () => `<div class="kp-toast rt-toast" role="status"><span class="kp-toast__body">Readings copied to Backup.</span></div>`,
};
const caption = (/** @type {string} */ text) => `<p class="rt-caption">${text}</p>`;
const cell = (/** @type {string} */ cap, /** @type {string} */ html, cls = '') => `<div class="rt-part ${cls}">${caption(cap)}${html}</div>`;
/** What arrives: the part inside, the sheet it is copied in as on the wrapper. */
const arrives = (/** @type {string} */ html, i = 0, cls = '') => `<div class="rt-arrives rt-a ${cls}" style="--i: ${i}">${html}</div>`;

/** The scene's world: the 1995 desktop, the parts as windows on it. */
const desk = (/** @type {string} */ inner) => `<div class="rt-desk rt-desk--scene">
    <span class="rt-icon rt-icon--pc rt-desk__pc" aria-hidden="true"><i></i><b>My Computer</b></span>
    <span class="rt-icon rt-icon--bin rt-desk__bin" aria-hidden="true"><i></i><b>Recycle Bin</b></span>
    <div class="rt-parts">${inner}</div>
    <span class="rt-pointer rt-desk__pointer" aria-hidden="true"></span>
    <div class="rt-taskbar" aria-hidden="true"><span class="rt-start"><i></i>Start</span><span class="rt-task"><i></i><span>Pump houses</span></span><span class="rt-taskbar__tray"><span>9:41 AM</span></span></div>
</div>`;

/* ------------------------------------------------------------ the scenes */

/** The Copying dialog's stage: a folder, the sheet, a folder. */
const stage = (/** @type {string} */ cls) =>
    `<span class="rt-stage"><i class="rt-folder rt-stage__from"></i><i class="rt-sheet rt-a rt-stage__sheet ${cls}"></i><i class="rt-folder rt-stage__to"></i></span>`;

const MOVING = () =>
    cell(
        'A sheet in these frames, beside one that moves smoothly',
        `<div class="rt-dlg rt-lanes"><div class="rt-win__title"><span>Copying…</span>${CLOSE}</div>
        <div class="rt-lane">${stage('rt-stage__sheet--own')}<span class="rt-lane__name">these frames</span></div>
        <div class="rt-lane">${stage('rt-stage__sheet--even')}<span class="rt-lane__name">smooth, for comparison</span></div></div>`,
        'rt-part--wide',
    ) +
    cell('A dialog, copied in', arrives(PART.dialog())) +
    cell(
        'A menu, under its button',
        `<div class="rt-menu-wrap">${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}${arrives(PART.pop(), 0, 'rt-drop')}</div>`,
    ) +
    cell('A tile, copied in', arrives(PART.tile()));

const DIRECTION = () =>
    cell(
        'A week of days, one after the other',
        `<div class="rt-well rt-week">${[12, 13, 14, 15, 16, 17, 18]
            .map((d, i) => arrives(`<span class="rt-day"><span class="rt-day__num">${d}</span></span>`, i, 'rt-arrives--day'))
            .join('')}</div>`,
        'rt-part--wide',
    ) +
    cell('A tile', arrives(PART.tile())) +
    cell('A key figure', arrives(`<div class="kp-kpis">${PART.kpi()}</div>`)) +
    cell('The trend’s line', `<div class="rt-well rt-trendwell">${plot('rt-a rt-draws')}</div>`, 'rt-part--wide');

const OPENING = () =>
    cell(
        'A menu, from its menu bar',
        `<div class="rt-win rt-menuwin"><div class="rt-win__title"><span class="rt-win__sysicon" aria-hidden="true"></span><span>Pump houses</span><span class="rt-win__controls" aria-hidden="true"><i></i><i></i><i></i></span></div>
        <div class="rt-win__menu"><span class="rt-menubar__on"><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span></div>
        <div class="rt-win__body rt-menuwin__body"><p>North 4 · 4.2 bar</p><p>North 5 · 3.9 bar</p><p>South 1 · 4.0 bar</p></div>
        <div class="rt-deal">${PART.pop(['Open…', 'Copy to Backup', 'Delete'], 'rt-a rt-opens rt-opens--menu')}</div></div>`,
    ) +
    cell(
        'A dialog, on the desktop',
        `<div class="rt-zoomer">${PART.dialog('Close INC-4471?', 'The vendor is told at once.', 'warn').replace(
            'class="kp-dialog rt-dialog"',
            'class="kp-dialog rt-dialog rt-a rt-opens rt-opens--dialog"',
        )}<span class="rt-zoom rt-a" aria-hidden="true"></span></div>`,
    ) +
    cell('A notice, from its edge', `<div class="rt-edge">${PART.toast().replace('rt-toast', 'rt-toast rt-a rt-opens rt-opens--toast')}</div>`) +
    cell(
        'A tip, where the pointer rests',
        `<div class="rt-tipwrap">${button('Export', 'kp-button--sm')}<span class="rt-pointer rt-tipwrap__pointer" aria-hidden="true"></span><span class="kp-tooltip rt-tip rt-a rt-opens rt-opens--tip" role="tooltip">Copies the log to A:</span></div>`,
    );

const DURATION = () =>
    cell('Contact: a press', `<div class="rt-row">${pressable('Copy', 'rt-tap')}</div><p class="rt-count" data-rt-readout="contact"></p>`) +
    cell(
        'A zoom: the dialog opens',
        `<div class="rt-zoomer">${PART.dialog('Copy readings?', 'Copy 12 readings?', 'warn').replace(
            'class="kp-dialog rt-dialog"',
            'class="kp-dialog rt-dialog rt-a rt-opens rt-opens--dialog"',
        )}<span class="rt-zoom rt-a" aria-hidden="true"></span></div><p class="rt-count" data-rt-readout="zoom"></p>`,
    ) +
    cell(
        'A flight: the sheet',
        `<div class="rt-dlg rt-lanes rt-lanes--one"><div class="rt-win__title"><span>Copying…</span>${CLOSE}</div><div class="rt-lane">${stage(
            'rt-stage__sheet--own',
        )}</div></div><p class="rt-count" data-rt-readout="flight"></p>`,
    ) +
    cell(
        'A group: five days',
        `<div class="rt-well rt-week rt-week--five">${[12, 13, 14, 15, 16]
            .map((d, i) => arrives(`<span class="rt-day"><span class="rt-day__num">${d}</span></span>`, i, 'rt-arrives--day'))
            .join('')}</div><p class="rt-count" data-rt-readout="group"></p>`,
    ) +
    cell('A loop: the busy bar', `${busyBar('Copying')}<p class="rt-count" data-rt-readout="loop"></p>`, 'rt-part--wide');

/** A message box: the dialog box with its icon, its message and OK. */
const messageBox = (title, icon, text, cls = '') =>
    `<div class="rt-dlg rt-msgbox ${cls}"><div class="rt-win__title"><span>${title}</span>${CLOSE}</div><div class="rt-dlg__body"><span class="rt-icon16 rt-icon16--${icon}" aria-hidden="true"></span><p>${text}</p></div><div class="rt-dlg__buttons"><span class="rt-btn rt-btn--default">OK</span></div></div>`;

const COLOUR = () =>
    cell(
        'A window, its buttons',
        win('Pump houses', `<p>North 4 · 4.2 bar</p><p class="rt-sel">North 5 · 3.9 bar</p><p>South 1 · 4.0 bar</p>`) +
            `<div class="rt-row rt-row--gap">${button('Export')}${button('Add', 'kp-button--primary')}</div>`,
    ) +
    cell(
        'A switch, a month',
        `<label class="rt-switchline"><span class="kp-switch rt-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Live" /></span> Live readings</label>${PART.days(
            12,
            7,
            'rt-month',
            (d) =>
                d === 14
                    ? ' rt-today'
                    : d === 16
                      ? ' rt-picked'
                      : d === 13
                        ? ' rt-tone-warn'
                        : d === 17
                          ? ' rt-tone-bad'
                          : d === 12
                            ? ' rt-tone-ok'
                            : '',
        )}`,
    ) +
    cell('A key figure, a meter', `<div class="kp-kpis">${PART.kpi('Reservoir North', '62 %', note('4 %'))}</div>${meter(0.62, 0.8)}`) +
    cell('A failed export', messageBox('Export', 'error', 'The export to A: failed.'));

const CORNERS = () =>
    cell('A window', win('Reservoir North', '<p>Level 71 %</p>', { menu: false })) +
    cell('A menu panel', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell('A key figure', `<div class="kp-kpis">${PART.kpi('Flow now', '412')}</div>`) +
    cell(
        'A button, a tag, a chip',
        `<div class="rt-row">${button('Export')}<span class="kp-badge rt-tag">12 new</span><span class="kp-tag rt-chip">Pumps</span></div>`,
    ) +
    cell('A tooltip', `<div class="kp-tooltip rt-tip rt-tip--still" role="tooltip">14:00 · 412 m³/h</div>`) +
    cell('A bar, its head', shareBar(0.62));

const SURFACE = () =>
    cell(
        'A dialog with its title',
        `<div class="kp-dialog rt-dialog rt-dialog--still" role="group" aria-label="Pump house 3"><p class="kp-dialog__title rt-titlebar"><span>Pump house 3</span>${CLOSE}</p>
        <div class="rt-dialog__msg"><span class="rt-icon16 rt-icon16--warn" aria-hidden="true"></span><p class="kp-dialog__description">Pressure is low.</p></div>
        <div class="kp-dialog__actions">${button('OK', 'kp-button--sm kp-button--primary')}</div><div class="rt-win__status"><span>Ready</span><span class="rt-win__grip" aria-hidden="true"></span></div></div>`,
    ) +
    cell('A key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell(
        'A trend tile',
        `<div class="kp-card rt-tile"><p class="kp-card__title rt-titlebar"><span>Flow, 24 h</span></p><div class="rt-well rt-trendwell">${plot()}</div><p class="rt-tile__foot"><span>412 m³/h</span></p></div>`,
    ) +
    cell(
        'A menu with headings',
        `<div class="kp-popover rt-pop rt-pop--static"><ul class="kp-menu" role="menu"><li role="none" class="rt-menuhead">Incident</li>${entries([
            'Open incident',
            'Assign to…',
        ])}<li role="separator" class="rt-groove"></li><li role="none" class="rt-menuhead">Station</li>${entries(['Rename'])}</ul></div>`,
    ) +
    cell('The state word', `<div class="rt-statusbar">${PART.state('Running')}${PART.state('Pressure low', 'warn')}</div>`);

const WARNING = () =>
    cell(
        'A key figure that needs attention',
        `<div class="kp-kpis"><div class="kp-kpi rt-kpi rt-warnfig" data-kp-tone="warning" data-rt-tone="warn"><span class="kp-kpi__label">Pressure</span><span class="rt-warnfig__row"><span class="rt-icon16 rt-icon16--warn" aria-hidden="true"></span><span class="kp-kpi__value">1.1 bar</span></span><span class="kp-kpi__trend">${note(
            '0.4 bar',
            'down',
            'bad',
        )} since 06:00</span></div></div>`,
    ) +
    cell(
        'A failed trend tile',
        `<div class="kp-card rt-tile rt-warnfig" data-rt-tone="bad"><p class="kp-card__title rt-titlebar"><span>Pump house 3</span></p><div class="rt-warnfig__row"><span class="rt-icon16 rt-icon16--error" aria-hidden="true"></span><div class="rt-well rt-trendwell">${plot(
            'rt-plot--stale',
        )}</div></div><p class="rt-tile__foot"><span>No reading since 06:40</span></p></div>`,
    ) +
    cell(
        'A destructive menu entry',
        `<div class="kp-popover rt-pop rt-pop--static"><ul class="kp-menu" role="menu">${entries(['Open incident', 'Delete pump house'])}</ul></div>`,
    ) +
    cell(
        'A warning alert',
        `<div class="kp-alert kp-alert--warning rt-alert rt-warnfig" data-rt-tone="warn" role="status"><span class="rt-alert__bar">Warning</span><span class="rt-warnfig__row"><span class="rt-icon16 rt-icon16--warn" aria-hidden="true"></span><span class="kp-alert__body">Pressure is low at pump house 3.</span></span></div>`,
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', `<div class="rt-statusbar">${PART.state('Running')}</div>`) +
    cell('Trend line', `<div class="rt-well rt-trendwell rt-carrier rt-carrier--plot">${plot('rt-plot--live')}</div>`) +
    cell(
        'Strip column number',
        `<div class="rt-strip">${PART.column()}${PART.column('Closed', '112').replace('<span class="rt-carrier" data-rt-num>', '<span>')}</div>`,
    ) +
    cell(
        'Dashboard tile',
        `<div class="kp-card rt-tile rt-live-tile"><p class="kp-card__title rt-titlebar"><span>Pump house 4</span></p><p class="kp-card__body">4.2 bar · 412 m³/h</p><p class="rt-tile__foot"><span class="rt-carrier" data-rt-time>Updated 07:12</span></p></div>`,
    );

/* ------------------------------------------- question 10: loading (update 3) */

// Eight pictures from the screens of the nineties (Kenny on update 2: "all of
// these are so bad that I am about to delete this whole theme. Come up with
// something better now!"): no dialog, no bar, no label. Each is pixel art in
// the register's palette, in whole 90 ms frames over a loop of 28 (2.52 s),
// fitted to the six waiting parts: a box (the tile's and the panel's room), a
// row (the menu entry's slot), the month, the chart's plot and the skeleton's
// lines. The art is generated here once, seeded, so every page draws the same
// picture: SVG paths of art pixels in token colours (`.rt-px--<colour>`,
// options.css). A frame that changes the picture is a cel (`.rt-cel`, its
// frame in `--i`), shown by options.css for exactly that frame.

/** The loop, in frames. */
const LOOP = 28;
/** A seeded random in [0, 1). @param {number} seed */
const seeded = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const frac = (/** @type {number} */ u) => u - Math.floor(u);
/** A triangle wave, 0 → 1 → 0 once a unit: a point bouncing between two walls. */
const tri = (/** @type {number} */ u) => 1 - Math.abs(2 * frac(u) - 1);

/**
 * Art pixels to one path per colour, row by row with runs merged. With `step`, every step-th row stands for the rows under it,
 * as an interlaced pass draws it. @param {number} w @param {number} h @param {(x: number, y: number) => string | null} at
 */
const pixels = (w, h, at, step = 1) => {
    /** @type {Record<string, string[]>} */
    const runs = {};
    for (let y = 0; y < h; y += step) {
        const tall = Math.min(step, h - y);
        for (let x = 0; x < w;) {
            const c = at(x, y);
            let e = x + 1;
            while (e < w && at(e, y) === c) e += 1;
            if (c) (runs[c] ||= []).push(`M${x} ${y}h${e - x}v${tall}h${x - e}z`);
            x = e;
        }
    }
    return Object.entries(runs)
        .map(([c, d]) => `<path class="rt-px rt-px--${c}" d="${d.join('')}"/>`)
        .join('');
};
/** Single cells, one path per colour. @param {Record<string, [number, number, number][]>} cells x, y, size */
const dots = (cells) =>
    Object.entries(cells)
        .map(([c, list]) => `<path class="rt-px rt-px--${c}" d="${list.map(([x, y, s]) => `M${x} ${y}h${s}v${s}h${-s}z`).join('')}"/>`)
        .join('');
const svg = (/** @type {string} */ cls, /** @type {string} */ box, /** @type {string} */ inner, fit = 'xMidYMid slice') =>
    `<svg class="${cls}" viewBox="${box}" preserveAspectRatio="${fit}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${inner}</svg>`;
/** Pattern definitions, out of the layout. */
const defs = (/** @type {string} */ inner) => `<svg class="rt-defs" aria-hidden="true" focusable="false"><defs>${inner}</defs></svg>`;

/* 1 Palette cycling: a waterfall of fourteen blues, teals and greys in wavy diagonal bands two art pixels wide, each seam
   dithered; one tile of 56 × 28 art pixels (2 px each) repeats under every part. The sheet steps down one band a frame (two
   tiles a loop): at any one pixel the colours run through the ramp, as a cycled palette does. */
const FLOW_DEFS = defs(
    `<pattern id="rt-flow" width="112" height="56" patternUnits="userSpaceOnUse"><g transform="scale(2)">${pixels(56, 28, (x, y) => {
        const wave = Math.round(2.6 * Math.sin((2 * Math.PI * x) / 56) + 1.2 * Math.sin((4 * Math.PI * x) / 56));
        const d = (((x + y + wave) % 28) + 28) % 28;
        const band = Math.floor(d / 2);
        return `r${d % 2 === 0 && x % 2 === 0 ? (band + 13) % 14 : band}`;
    })}</g></pattern>`,
);
const flow = (cls = '') =>
    `<svg class="rt-flow ${cls}" aria-hidden="true" focusable="false"><rect class="rt-flow__sheet" y="-112" width="100%" height="1200" fill="url(#rt-flow)"/></svg>`;

/* 2 Interlaced: the Windows 95 clouds over the desktop's teal, loaded in four passes (every eighth row standing for the eight
   under it, then every fourth, every second, every row). The sky is five teals with a 2 × 2 dither between each two. */
const LACE_DEFS = defs(
    [0, 1, 2, 3]
        .map(
            (i) =>
                `<pattern id="rt-lace-d${i}" width="2" height="2" patternUnits="userSpaceOnUse"><path class="rt-px rt-px--s${i}" d="M0 0h2v2h-2z"/><path class="rt-px rt-px--s${
                    i + 1
                }" d="M1 0h1v1h-1zM0 1h1v1h-1z"/></pattern>`,
        )
        .join(''),
);
/** The clouds picture, w × h art pixels: cumulus of five to seven puffs on a flat base, lit from the top left (white, a pale and a
 * deeper teal grey, dithered between), on the sky. @param {number} w @param {number} h @param {number} seed */
const clouds = (w, h, seed) => {
    const rnd = seeded(seed);
    /** @type {{ base: number, top: number, left: number, right: number, puffs: { x: number, y: number, r: number }[] }[]} */
    const list = [];
    const unit = Math.max(h, 8);
    for (let cx = rnd() * unit * 1.5; cx < w + unit; cx += unit * (1.7 + rnd() * 1.3)) {
        const R = unit * (0.13 + rnd() * 0.15);
        const base = Math.round(h * (0.42 + rnd() * 0.36));
        const n = 5 + Math.floor(rnd() * 3);
        const puffs = [...Array(n).keys()].map((k) => {
            const at = k / (n - 1);
            const r = R * (0.5 + 0.55 * Math.sin(Math.PI * at)) * (0.85 + rnd() * 0.3);
            return { x: cx + (at - 0.5) * 3.4 * R + (rnd() - 0.5) * R * 0.4, y: base - r * 0.62, r };
        });
        const top = Math.min(...puffs.map((p) => p.y - p.r));
        list.push({ base, top, left: cx - 1.75 * R, right: cx + 1.75 * R, puffs });
    }
    return (/** @type {number} */ x, /** @type {number} */ y) => {
        const px = x + 0.5;
        const py = y + 0.5;
        for (const cl of list) {
            if (py > cl.base || py < cl.top || px < cl.left - cl.base || px > cl.right + cl.base) continue;
            let best = null;
            for (const p of cl.puffs) {
                const d = Math.hypot(px - p.x, py - p.y) / p.r;
                if (d <= 1 && (!best || p.y - p.r < best.p.y - best.p.r || d < best.d)) best = { p, d };
            }
            if (!best) continue;
            const nx = (px - best.p.x) / best.p.r;
            const ny = (py - best.p.y) / best.p.r;
            const t = (py - cl.top) / (cl.base - cl.top);
            const lit = -0.35 * nx - 0.6 * ny - 0.85 * t + 0.55;
            const odd = (x + y) % 2 === 1;
            if (lit > 0.32) return 'c0';
            if (lit > 0.18) return odd ? 'c1' : 'c0';
            if (lit > 0.02) return 'c1';
            if (lit > -0.14) return odd ? 'c2' : 'c1';
            return 'c2';
        }
        const v = (y / Math.max(h - 1, 1)) * 4;
        const i = Math.min(Math.floor(v), 3);
        const f = v - i;
        return f < 0.34 ? `s${i}` : f < 0.67 ? `d${i}` : `s${i + 1}`;
    };
};
const lace = (/** @type {number} */ w, /** @type {number} */ h, /** @type {number} */ seed) => {
    const at = clouds(w, h, seed);
    return svg(
        'rt-lace',
        `0 0 ${w} ${h}`,
        [8, 4, 2, 1].map((step, k) => `<g class="rt-lace__pass rt-lace__pass--${k + 1}">${pixels(w, h, at, step)}</g>`).join(''),
    );
};

/* 4 Mystify your mind: two quadrilaterals whose corners bounce between the part's walls (a whole number of bounces a loop, so
   the loop closes), each frame's copy standing five frames as it fades through the blues (the trail). */
const mystify = (/** @type {number} */ w, /** @type {number} */ h, /** @type {number} */ seed) => {
    const rnd = seeded(seed);
    const shape = () => [...Array(4)].map((_, k) => [1, k / 4 + rnd() * 0.25, 1, rnd()]);
    return svg(
        'rt-myst',
        `0 0 ${w} ${h}`,
        [shape(), shape()]
            .map((corners, n) =>
                [...Array(LOOP).keys()]
                    .map((f) => {
                        const points = corners
                            .map(
                                ([kx, px, ky, py]) =>
                                    `${(1 + (w - 2) * tri((kx * f) / LOOP + px)).toFixed(1)},${(1 + (h - 2) * tri((ky * f) / LOOP + py)).toFixed(1)}`,
                            )
                            .join(' ');
                        const still = f <= 4 ? ` rt-myst__q--age${4 - f}` : '';
                        return `<polygon class="rt-cel rt-myst__q rt-myst__q--${n ? 'b' : 'a'}${still}" style="--i: ${f}" points="${points}"/>`;
                    })
                    .join(''),
            )
            .join(''),
        'none',
    );
};

/* 5 The starfield: stars stream out from the centre (or from the start edge), faster as they come near, grey and one art pixel
   far off, pale blue, then white and two by two near. Each star makes one, two or four passes a loop. */
const starfield = (/** @type {number} */ w, /** @type {number} */ h, /** @type {number} */ seed, edge = false) => {
    const rnd = seeded(seed);
    const n = Math.max(8, Math.round((w * h) / (edge ? 30 : 40)));
    const list = [...Array(n)].map(() => ({ a: rnd() * 2 * Math.PI, s: [1, 1, 2, 2, 4][Math.floor(rnd() * 5)], p: rnd(), y: rnd(), tint: rnd() }));
    // How far a star travels, in art pixels: to the far corner, or along the whole part from its start edge; the colour and the
    // size go by the distance it has come, so a near star is white and two by two wherever the part ends.
    const reach = edge ? w : Math.hypot(w, h) / 2;
    const near = edge ? Math.min(w * 0.45, 26) : Math.min(h * 0.55, 20);
    const cels = [...Array(LOOP).keys()].map((f) => {
        /** @type {Record<string, [number, number, number][]>} */
        const cells = {};
        const put = (/** @type {string} */ c, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ s) => {
            if (x >= 0 && y >= 0 && x <= w - s && y <= h - s) (cells[c] ||= []).push([Math.floor(x), Math.floor(y), s]);
        };
        for (const st of list) {
            const u = frac((st.s * f) / LOOP + st.p);
            const d = 2 + (reach - 2) * u ** 1.8;
            const dx = edge ? 1 : Math.cos(st.a);
            const dy = edge ? 0 : Math.sin(st.a);
            const x = edge ? d - 2 : w / 2 + dx * d;
            const y = edge ? st.y * h : h / 2 + dy * d;
            if (d < near * 0.25) continue;
            if (d < near * 0.5) put('far', x, y, 1);
            else if (d < near) put(st.tint > 0.5 ? 'mid' : 'near', x, y, 1);
            else {
                // Near: two by two, with its streak behind it, dimmer the further back.
                put('near', x, y, 2);
                put(st.tint > 0.5 ? 'mid' : 'near', x - dx * 2, y - dy * 2, 1);
                put('far', x - dx * 4, y - dy * 4, 1);
            }
        }
        return `<g class="rt-cel" style="--i: ${f}">${dots(cells)}</g>`;
    });
    return svg('rt-stars', `0 0 ${w} ${h}`, cels.join(''));
};

/* 6 The DOS prompt: light grey text on black, typed a letter a frame from frame `at` (the line's own width grows a character a
   frame), the block cursor after it, blinking two frames on and two off, from frame `from` to frame `until`. */
const esc = (/** @type {string} */ t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const typed = (/** @type {string} */ text, /** @type {number} */ at, cursor = /** @type {[number, number] | null} */ (null), lead = '') =>
    `<span class="rt-dos__line">${lead ? `<span>${esc(lead)}</span>` : ''}<span class="rt-dos__text" style="--i: ${at}; --x: ${text.length}">${esc(text)}</span>${
        cursor ? `<span class="rt-dos__cur" style="--i: ${cursor[0]}"><i style="--x: ${cursor[1]}"></i></span>` : ''
    }</span>`;
const said = (/** @type {string} */ text) => `<span class="rt-dos__line">${esc(text)}</span>`;
/** The frame each day's number starts typing in: days 1 to 9 take a frame, 10 to 14 two. */
const dayAt = (/** @type {number} */ i) => i + Math.max(0, i - 9);

/* 7 The bouncing ball: a chunky pixel marble lit from the top left, outlined in ink. @param {number} d */
const ball = (d) => {
    const r = d / 2;
    const L = [-0.48, -0.56, 0.68];
    return svg(
        'rt-ball__sprite',
        `0 0 ${d} ${d}`,
        pixels(d, d, (x, y) => {
            const nx = (x + 0.5 - r) / r;
            const ny = (y + 0.5 - r) / r;
            const q = nx * nx + ny * ny;
            if (q > 1) return null;
            if (q > 0.78) return 'ink';
            const nz = Math.sqrt(1 - q);
            const lit = nx * L[0] + ny * L[1] + nz * L[2];
            if (lit > 0.94) return 'hi';
            if (lit > 0.78) return 'b3';
            if (lit > 0.5) return 'b2';
            if (lit > 0.2) return 'b1';
            return 'b0';
        }),
        'xMidYMid meet',
    );
};

/* 8 The spinning globe: the world in a 32 × 16 map, turned an eighth a frame (eight cels), lit from the top left, in a ring of
   dither. @param {boolean} ring */
const EARTH = [
    '..............XX................',
    '...XXXXXXX...XXX....XXXXXXXXXX..',
    '..XXXXXXXXXX..X...XXXXXXXXXXXXX.',
    '...XXXXXXXX.......XXXXXXXXXXXX..',
    '....XXXXXX.......XXXXXXXXXXXX...',
    '.....XXXX........XXXXXXXXXXX....',
    '......XX........XXXXXXX..XX.....',
    '.......XX.......XXXXXX....X.....',
    '........XXX......XXXX......XX...',
    '........XXXX.....XXXX.....XXXX..',
    '.........XXX......XX......XXXX..',
    '.........XX.......XX............',
    '.........X......................',
    '................................',
    '................................',
    '..XXXXXXXXXXXXXXXXXXXXXXXXXXXX..',
];
const globe = (ring = true) => {
    const size = ring ? 20 : 12;
    const c = size / 2;
    const R = ring ? 7.5 : 5.5;
    const cels = [...Array(8).keys()].map((f) => {
        const turn = (f * Math.PI) / 4;
        return `<g class="rt-cel8" style="--i: ${f}">${pixels(size, size, (x, y) => {
            const dx = x + 0.5 - c;
            const dy = y + 0.5 - c;
            const dist = Math.hypot(dx, dy);
            if (dist > R) return ring && dist > 8.6 && dist < 9.9 && (x + y) % 2 === 0 ? 'ring' : null;
            const nx = dx / R;
            const ny = dy / R;
            const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
            const row = Math.min(15, Math.floor(((Math.PI / 2 + Math.asin(ny)) / Math.PI) * 16));
            const col = Math.floor(frac((Math.atan2(nx, nz) + turn) / (2 * Math.PI) + 0.5) * 32);
            const land = EARTH[row][col] === 'X';
            const lit = -0.45 * nx - 0.5 * ny + 0.74 * nz;
            if (lit > 0.93) return 'hi';
            if (land) return lit > 0.55 ? 'l2' : lit > 0.15 ? 'l1' : 'l0';
            return lit > 0.7 ? 'o3' : lit > 0.4 ? 'o2' : lit > 0.05 ? 'o1' : 'o0';
        })}</g>`;
    });
    return svg(`rt-globe${ring ? '' : ' rt-globe--bare'}`, `0 0 ${size} ${size}`, cels.join(''), 'xMidYMid meet');
};

/**
 * What each option draws into each waiting part: `box` (the tile's and the panel's room), `row` (the menu entry's slot), `line`
 * (a skeleton line, by index), `day` (a day of the month, its inside), `month` (under the days) and `cover` (over them), `plot`.
 * @type {Record<string, { defs?: string, plot?: string, box: (seed: number) => string, row: () => string, line: (i: number) => string,
 *   day?: (i: number) => string, month?: () => string, cover?: () => string, plotted: () => string }>}
 */
const WAITS = {
    cycle: {
        defs: FLOW_DEFS,
        plot: 'rt-plot--real',
        box: () => flow(),
        row: () => flow(),
        line: () => flow(),
        month: () => flow('rt-flow--month'),
        plotted: () => flow('rt-flow--plot'),
    },
    interlace: {
        defs: LACE_DEFS,
        plot: 'rt-plot--real',
        box: (seed) => lace(360, 35, seed),
        row: () => lace(44, 10, 7),
        line: (i) => lace(400, 6, 11 + i),
        cover: () => '<i class="rt-lacecover"></i>',
        plotted: () => '<i class="rt-lacecover"></i>',
    },
    ants: {
        box: () => '<i class="rt-ants"></i>',
        row: () => '<i class="rt-ants"></i>',
        line: () => '<i class="rt-ants"></i>',
        day: (i) => `<span class="rt-day__num">${i + 1}</span><i class="rt-ants rt-ants--day"></i>`,
        plotted: () => '<i class="rt-ants"></i>',
    },
    mystify: {
        box: (seed) => mystify(200, 70, seed),
        row: () => mystify(88, 20, 5),
        line: (i) => mystify(200, 12, 21 + i),
        month: () => mystify(210, 66, 31),
        plotted: () => mystify(210, 40, 41),
    },
    stars: {
        box: (seed) => starfield(100, 35, seed),
        row: () => starfield(44, 10, 9, true),
        line: (i) => starfield(400, 6, 13 + i, true),
        month: () => starfield(104, 33, 17),
        plotted: () => starfield(104, 20, 19),
    },
    prompt: {
        plot: 'rt-plot--dos',
        box: () =>
            `<span class="rt-dos">${said('Starting MS-DOS...')}${said('HIMEM is testing extended memory...done.')}${typed('READ PUMPS', 3, [0, 15], 'C:\\>')}${typed(
                'Loading...',
                15,
                [15, LOOP],
            )}</span>`,
        row: () => `<span class="rt-dos">${typed('Loading...', 3, [0, LOOP])}</span>`,
        line: (i) =>
            `<span class="rt-dos">${[typed('C:\\>DIR /W', 0, [0, 11]), typed('12 file(s)', 11, [11, 22]), typed('C:\\>', 22, [22, LOOP])][i]}</span>`,
        day: (i) => {
            const at = dayAt(i);
            return `<span class="rt-dos rt-dos--day">${typed(String(i + 1), at, [at, i === 13 ? LOOP : dayAt(i + 1)])}</span>`;
        },
        plotted: () => `<span class="rt-dos rt-dos--foot">${typed('Plotting PUMP.DAT', 2, [0, LOOP])}</span>`,
    },
    ball: {
        plot: 'rt-plot--real',
        box: () => `<i class="rt-ball__shadow"></i><i class="rt-ball">${ball(12)}</i>`,
        row: () => `<i class="rt-ball__shadow"></i><i class="rt-ball">${ball(10)}</i>`,
        line: () => `<i class="rt-ball__shadow"></i><i class="rt-ball">${ball(8)}</i>`,
        day: (i) =>
            `<span class="rt-day__num">${i + 1}</span><i class="rt-bounce rt-bounce--air" style="--i: ${2 * i}">${ball(10)}</i><i class="rt-bounce rt-bounce--land" style="--i: ${
                2 * i + 1
            }">${ball(10)}</i><i class="rt-bounce__press" style="--i: ${2 * i + 1}"></i>`,
        plotted: () => `<i class="rt-ball">${ball(10)}</i>`,
    },
    globe: {
        box: () => `<i class="rt-globe-at">${globe()}</i>`,
        row: () => `<i class="rt-globe-at">${globe()}</i>`,
        line: () => `<i class="rt-globe-at">${globe(false)}</i>`,
        day: (i) => (i === 0 ? `<i class="rt-globe-at">${globe()}</i>` : `<span class="rt-day__num">${i + 1}</span>`),
        plotted: () => `<i class="rt-globe-at">${globe()}</i>`,
    },
};

/** The overlay a waiting part carries. @param {string} inner */
const over = (inner, cls = '') => `<span class="rt-w ${cls}" aria-hidden="true">${inner}</span>`;
/** A month of fourteen days waiting. */
const waitDays = (/** @type {(typeof WAITS)[string]} */ w) =>
    `<div class="rt-days rt-days--grid" aria-hidden="true">${[...Array(14).keys()]
        .map((i) => `<span class="rt-day" style="--i: ${i}">${w.day ? w.day(i) : `<span class="rt-day__num">${i + 1}</span>`}</span>`)
        .join('')}</div>`;
/** A skeleton line, the register's sunken line, with the picture inside it. */
const waitLine = (/** @type {(typeof WAITS)[string]} */ w, /** @type {number} */ i) =>
    `<span class="kp-skeleton rt-line" style="--i: ${i}">${over(w.line(i), 'rt-w--line')}</span>`;

const LOADING = (key = 'cycle') => {
    const w = WAITS[key] || WAITS.cycle;
    return (
        (w.defs || '') +
        cell(
            'Tile',
            `<div class="kp-card rt-tile rt-waits rt-waits--box" aria-busy="true"><p class="kp-card__title rt-titlebar"><span>Pump house 4</span></p><div class="rt-waits__room">${over(
                w.box(3),
            )}</div><p class="rt-tile__foot"><span>Reading…</span></p></div>`,
        ) +
        cell(
            'Panel',
            `<div class="kp-card rt-panel rt-waits rt-waits--box" aria-busy="true"><p class="rt-panel__words">Reading the pump houses…</p><div class="rt-waits__room">${over(
                w.box(8),
            )}</div></div>`,
        ) +
        cell(
            'Menu, loading entry',
            `<div class="kp-popover rt-pop rt-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item rt-waits rt-waits--row" aria-busy="true"><span class="rt-entry">Stations…</span>${over(
                w.row(),
                'rt-w--row',
            )}</button></li>${entries(['Rename'])}</ul></div>`,
        ) +
        cell(
            'Month days',
            `<div class="rt-well rt-month-wait rt-waits" aria-busy="true">${w.month ? over(w.month(), 'rt-w--under') : ''}${waitDays(w)}${
                w.cover ? over(w.cover(), 'rt-w--cover') : ''
            }</div>`,
        ) +
        cell(
            'Chart plot',
            `<div class="rt-well rt-plotwait rt-waits" aria-busy="true">${plot(w.plot || 'rt-plot--ghost')}${over(w.plotted(), 'rt-w--plot')}</div>`,
        ) +
        cell(
            'Skeleton lines',
            `<div class="rt-skelwrap rt-waits rt-waits--skel" aria-busy="true"><div class="rt-skel" aria-hidden="true">${[0, 1, 2]
                .map((i) => waitLine(w, i))
                .join('')}</div></div>`,
        )
    );
};

const BUSYBAR = () =>
    cell(
        'Three sizes, busy: no share known yet',
        `<div class="rt-sizes">${busyBar('Small')}${busyBar('Medium', 'md')}${busyBar('Large', 'lg')}</div>`,
        'rt-part--wide',
    ) +
    cell(
        'Inside a busy button',
        `<button type="button" class="kp-button rt-busy-button" aria-busy="true"><span>Copying</span>${busyBar('Copying', 'inline')}</button>`,
    ) +
    cell('Beside it, the same in every option: the bar with a share (62 %)', shareBar(0.62));

const spin = (size = '') =>
    `<span class="kp-spinner rt-spin" role="status" aria-label="Working…"${size ? ` style="--kp-spinner-size: ${size}"` : ''}></span>`;

const SPINNER = () =>
    cell('Three sizes', `<div class="rt-row rt-spins">${spin('1.25rem')}${spin('2rem')}${spin('3.5rem')}</div>`, 'rt-part--wide') +
    cell('A busy button', `<button type="button" class="kp-button rt-busy-button" aria-busy="true">${spin()}<span>Saving…</span></button>`) +
    cell(
        'The busy panel',
        `<div class="kp-card rt-tile rt-busy-panel"><p class="kp-card__title rt-titlebar"><span>Pump houses</span></p><div class="rt-busy-panel__room">${spin(
            '2.5rem',
        )}<p class="kp-card__body">Reading the pump houses…</p></div></div>`,
    );

/** A part that arrives and leaves: the sheet it comes as, the outline it goes as. */
const leaver = (/** @type {string} */ html) =>
    `<div class="rt-leaver rt-arrives rt-a">${html}<span class="rt-ghost" aria-hidden="true"></span></div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell('A card', leaver(PART.tile('Reservoir North', 'Level 71 %', 'Updated 07:12'))) +
    cell('A key figure', leaver(`<div class="kp-kpis">${PART.kpi('Flow now', '412', note('6 %')).replace(' data-rt-num', '')}</div>`));

const COMPOSITES = () =>
    cell(
        'Alone: retro’s own button, for reference',
        `<div class="rt-row">${button('Export readings', 'rt-alone')}${button('Add', 'kp-button--primary rt-alone')}</div>`,
        'rt-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header rt-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title rt-headtitle">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions rt-actions-card">${button('Export', 'kp-button--sm rt-in-header')}${button('Add', 'kp-button--sm kp-button--primary rt-in-header')}</div></div></header>`,
        'rt-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'rt-in-menu')) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card rt-tile rt-in-tile"><p class="kp-card__title rt-titlebar"><span>Pump house 1</span></p><p class="kp-card__body">4.2 bar · 412 m³/h <a class="rt-link rt-tile-link" href="#rt-intro">Open</a></p></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card rt-tile rt-drawer"><p class="kp-card__title rt-titlebar"><span>Step 3 of 4</span></p><p class="kp-card__body">The filter keeps your choice.</p><div class="rt-row rt-actions-card rt-drawer__foot">${button(
            'Skip',
            'kp-button--sm rt-in-drawer',
        )}${button('Next', 'kp-button--sm kp-button--primary rt-in-drawer')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis">${PART.kpi('Flow now', '412', 'avg 15 min', 'rt-in-kpi', 'a', 'href="#rt-intro"').replace(' data-rt-num', '')}</div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="rt-row">${button('Export readings', 'rt-pointed')}${button('Add', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'], '', 'rt-pointed')) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card rt-tile rt-in-tile"><p class="kp-card__title rt-titlebar"><span>Pump house 1</span></p><p class="kp-card__body">4.2 bar · 412 m³/h <a class="rt-link rt-tile-link rt-pointed" href="#rt-intro">Open</a></p></div>`,
    ) +
    cell(
        'A link in running text, pointed at',
        `<p class="rt-prose">Read the <a class="rt-link rt-pointed" href="#rt-intro">pump house log</a> before the crew leaves.</p>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis rt-kpi-row">${PART.kpi('Flow now', '412', 'm³/h', 'rt-in-kpi rt-pointed', 'a', 'href="#rt-intro"').replace(' data-rt-num', '')}${PART.kpi(
            'Pressure',
            '3.1',
            'bar',
            'rt-in-kpi',
            'a',
            'href="#rt-intro"',
        ).replace(' data-rt-num', '')}</div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        PART.days(12, 5, 'rt-month', (d) => (d === 13 ? ' rt-pointed' : '')),
    );

const FOCUS = () =>
    cell('Button', `<div class="rt-row">${button('Export readings', 'rt-focused')}</div>`) +
    cell(
        'Header action',
        `<div class="rt-header-mini"><span class="rt-header-mini__title">Pump houses</span>${button('Export', 'kp-button--sm rt-in-header rt-focused')}</div>`,
    ) +
    cell(
        'Key figure link',
        `<div class="kp-kpis">${PART.kpi('Flow now', '412', 'm³/h', 'rt-in-kpi rt-focused', 'a', 'href="#rt-intro"').replace(' data-rt-num', '')}</div>`,
    ) +
    cell('Menu entry', PART.menuStatic(['Assign to…', 'Rename'], 'rt-in-menu', 'rt-focused')) +
    cell(
        'Calendar day',
        PART.days(13, 3, 'rt-month', (d) => (d === 14 ? ' rt-focused' : '')),
    ) +
    cell(
        'Tile link',
        `<div class="kp-card rt-tile rt-in-tile"><p class="kp-card__title rt-titlebar"><span>Pump house 1</span></p><p class="kp-card__body">4.2 bar <a class="rt-link rt-tile-link rt-focused" href="#rt-intro">Open</a></p></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="rt-row">${pressable('Export readings', 'rt-press')}</div>`) +
    cell('Primary button', `<div class="rt-row">${pressable('Add a pump house', 'kp-button--primary rt-press')}</div>`) +
    cell('Menu entry', PART.menuStatic(['Assign to…', 'Rename'], '', 'rt-press')) +
    cell(
        'Calendar day',
        PART.days(13, 3, 'rt-month', (d) => (d === 14 ? ' rt-press' : '')),
    ) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle rt-kpi rt-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value"><span class="kp-button__label">3</span></span></button></div>`,
    );

const TYPE = () =>
    cell(
        'A window with its words, figures and labels',
        win(
            'Pump house 4',
            `<p class="rt-type__label">PRESSURE · NORTH-04</p>
            <p class="rt-type__head">Night valve</p>
            <p class="rt-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
            <p class="rt-type__figure">4.2 <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
            <p class="rt-row"><span class="kp-badge rt-tag">12 new</span><span class="kp-timestamp rt-stamp">2026-10-08 07:12</span></p>`,
            { status: 'Ready · 3 of 15 stations' },
        ),
        'rt-part--wide',
    );

const MOTIFS = () =>
    cell(
        'A window with its title',
        win('Reservoir North', `<p>Level 71 %</p><div class="rt-groove rt-groove--line" role="separator"></div><p>Inflow 412 m³/h</p>`, {
            menu: false,
        }),
    ) +
    cell('A meter with its mark', meter(0.62, 0.8) + `<div class="rt-gap"></div>${meter(0.34, 0.5)}`) +
    cell(
        'A chart’s events',
        `<div class="rt-well rt-trendwell rt-events">${plot()}<span class="rt-event" style="--i: 0"></span><span class="rt-event" style="--i: 1"></span></div>`,
    ) +
    cell(
        'A button and a list',
        `<div class="rt-row">${button('Export')}${button('Delete', '', 'disabled')}</div>${PART.menuStatic(['North 4', 'North 5', 'South 1'], 'rt-list', 'rt-sel-item')}`,
    ) +
    cell(
        'An empty state',
        `<div class="kp-empty rt-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell(
        'A divider between two sections',
        `<p class="rt-caption rt-caption--inner">Pumps</p><div class="rt-groove rt-groove--line" role="separator"></div><p class="rt-caption rt-caption--inner">Reservoirs</p>`,
    );

/** Each question's scene, by the `scene` key aspects.js names. */
const SCENES = /** @type {Record<string, (key?: string) => string>} */ ({
    moving: MOVING,
    direction: DIRECTION,
    opening: OPENING,
    durations: DURATION,
    colour: COLOUR,
    corners: CORNERS,
    surface: SURFACE,
    warning: WARNING,
    live: LIVE,
    loading: LOADING,
    busybar: BUSYBAR,
    bar: BUSYBAR,
    spinner: SPINNER,
    leave: LEAVE,
    composites: COMPOSITES,
    hover: HOVER,
    focus: FOCUS,
    press: PRESS,
    type: TYPE,
    motifs: MOTIFS,
});

/* ---------------------------------------------------- the review kit's text */

// The intro's three paragraphs are the designer's STORY, verbatim (demo.html
// carries the same words, so the page reads without this script).
for (const [key, text] of Object.entries(STORY)) {
    const p = document.querySelector(`[data-rt-story="${key}"]`);
    if (p) p.textContent = text;
}
const h1 = document.querySelector('.rt-intro h1');
if (h1) h1.textContent = TITLE;

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}"]`));
// Each hint repeats the question, then what this option shows and the
// recommendation line: the dialog shows only the hint of the option on screen,
// so each hint has to stand on its own.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map((a) => ({
            id: a.id,
            label: a.label,
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
lookLine.textContent = `${ASPECTS.length} questions, one rule of ${LABEL.toLowerCase()} each; the first option of every question is the recommendation. Pick the one that is ${LABEL.toLowerCase()} to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-rt-aspects]'));
const toc = document.querySelector('[data-rt-toc]');
ASPECTS.forEach((a, n) => {
    const scene = SCENES[a.scene];
    if (!scene) throw new Error(`no scene for ${a.id}: ${a.scene}`);
    const box = document.createElement('section');
    box.className = 'rt-aspect';
    box.id = `rt-${a.id}`;
    box.setAttribute('data-rt-aspect', a.id);
    box.setAttribute('data-rt-count', String(a.options.length));
    box.setAttribute('aria-labelledby', `h-rt-${a.id}`);
    box.innerHTML = `<div class="rt-aspect__head">
        <h3 id="h-rt-${a.id}"><span class="rt-aspect__no">${n + 1}</span> ${a.label} <span class="rt-aspect__rule">${a.rule}</span></h3>
        <p class="rt-aspect__q"></p><p class="rt-aspect__why"></p></div><div class="rt-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.rt-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.rt-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.rt-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'rt-col';
        col.setAttribute('data-rt-option', String(at + 1));
        col.innerHTML = `<p class="rt-label"><span class="rt-label__no">${at + 1}</span> <span class="rt-label__name"></span>${
            at === 0 ? ' <span class="rt-label__rec">Recommended</span>' : ''
        }</p><p class="rt-see"></p><p class="rt-verdict"></p>
        <div class="rt-scene" data-rt-kind="${a.kind}" data-rt-${a.id}="${o.key}" data-rt-phase="hold">${desk(scene(o.key))}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.rt-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.rt-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.rt-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('rt-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#rt-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part (the same numbers
// options.css plays: one frame, a zoom of five, a flight of eight, a group one
// frame apart, a loop of twenty-eight).
const BANDS = { flight: 90, quick: 60, slow: 120 };
for (const scene of section.querySelectorAll('[data-rt-durations]')) {
    const frame = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-rt-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-rt-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', 'at once · 0 ms');
    say('zoom', `5 frames · ${5 * frame} ms`);
    say('flight', `8 frames of ${frame} ms · ${8 * frame} ms`);
    say('group', `one frame apart · ${frame} ms`);
    say('loop', `28 frames · ${(28 * frame).toLocaleString('en')} ms a loop`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, updates or leaves is replayed by one clock,
// so the options of a row always start together and can be compared. One
// cycle, in frames of 90 ms: `gap` (4: what arrives is not there yet), `in`
// (20: it is copied in, a value is copied over), `hold` (14: it stands whole),
// `out` (20: the same frames backwards, what came last going first). `in` and
// `out` are the window every open and its mirror are timed in (options.css
// --rt-w, 1800 ms): the slowest open (a flight of 120 ms frames after a group
// of five) ends inside it, so nothing is cut off. The CSS keys every motion to
// these phases; the clock only sets the attribute and, on the live row,
// copies the new value over at the frame its sheet lands (`--rt-swap`).
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-rt-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 4],
    ['in', 20],
    ['hold', 14],
    ['out', 20],
]);
const WINDOW = 20;
const values = ['412', '436', '398', '451'];
const words = ['Running', 'Draining'];
const times = ['Updated 07:12', 'Updated 07:13'];
let tick = 0;
let timer = 0;
/** @type {number[]} */
let swaps = [];

document.documentElement.style.setProperty('--rt-unit', `${FRAME}ms`);

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

/** Copies the next value over in one live scene. @param {Element} scene */
function copyOver(scene) {
    for (const num of scene.querySelectorAll('[data-rt-num]')) {
        const text = (num.textContent || '').trim();
        num.textContent = Number(text) > 99 ? values[tick % values.length] : String(30 + ((tick * 7) % 20));
    }
    for (const word of scene.querySelectorAll('[data-rt-word]')) word.textContent = words[tick % 2];
    for (const time of scene.querySelectorAll('[data-rt-time]')) time.textContent = times[tick % 2];
    for (const line of scene.querySelectorAll('[data-rt-line]')) line.setAttribute('points', tick % 2 ? TREND_B : TREND);
}

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.rt-scene[data-rt-kind="cycle"]')) scene.setAttribute('data-rt-phase', phase);
    if (phase !== 'in' && phase !== 'out') return;
    tick += 1;
    // A value is copied over as its sheet lands on the way in, and again as it
    // lifts off on the way out: the mirrored frame of the same window.
    for (const scene of section.querySelectorAll('.rt-scene[data-rt-live]')) {
        const at = Number(getComputedStyle(scene).getPropertyValue('--rt-swap')) || 0;
        const frames = phase === 'in' ? at : WINDOW - at;
        swaps.push(window.setTimeout(() => copyOver(scene), frames * FRAME * slow));
    }
}

function run(/** @type {number} */ at = 0) {
    clearTimeout(timer);
    for (const s of swaps) clearTimeout(s);
    swaps = [];
    if (reduced.matches) {
        setPhase('hold');
        return;
    }
    if (dialogPaused()) {
        timer = window.setTimeout(() => run(at), 300);
        return;
    }
    const [phase, frames] = PHASES[at];
    setPhase(phase);
    timer = window.setTimeout(() => run((at + 1) % PHASES.length), frames * FRAME * slow);
}

/* --------------------------------------------------------------- controls */

/** A radio-like group: one pressed button. */
function radio(/** @type {string} */ attr, /** @type {(value: string) => void} */ apply) {
    const buttons = [...document.querySelectorAll(`[${attr}]`)];
    for (const b of buttons)
        b.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === b));
            apply(b.getAttribute(attr) || '');
        });
}
radio('data-rt-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--rt-slow', String(slow));
    run(0);
});
radio('data-rt-state', (value) => {
    section.setAttribute('data-rt-show', value);
});
document.querySelector('[data-rt-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.rt-scene a, .rt-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided retro components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=retro`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-rt-gallery]'));
const frameOf = new Map();
gallery?.addEventListener('toggle', () => {
    if (!gallery.open) return;
    for (const frame of gallery.querySelectorAll('iframe[data-src]')) {
        frame.setAttribute('src', frame.getAttribute('data-src') || '');
        frame.removeAttribute('data-src');
        frame.addEventListener('load', () => {
            if (/** @type {HTMLIFrameElement} */ (frame).contentWindow) frameOf.set(/** @type {HTMLIFrameElement} */ (frame).contentWindow, frame);
        });
    }
});
addEventListener('message', (event) => {
    const data = event.data || {};
    if (event.origin !== location.origin || data.type !== 'rv-embed') return;
    const frame = frameOf.get(event.source);
    if (frame && data.height) frame.style.blockSize = `${Math.min(Math.max(data.height, 96), 900)}px`;
});
