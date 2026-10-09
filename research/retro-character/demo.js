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

/** A sunken bar with its track: the boot band scrolls in the track, Setup's and the progress blocks fill it. */
const TRACK = '<i class="rt-w__track"><i class="rt-w__band"></i></i>';
/** What every waiting part of question 10 carries, one overlay (`.rt-w`) with the pieces of all seven Windows 95 pictures; each
 * option shows its own: the Find flashlight (`__beam`: the torch and its light), Defrag's cells (`__cells`), the busy pointer
 * (`__busy`: the hourglass, or the arrow with a small hourglass on a part that loads in the background), and the foot (`__foot`:
 * the sunken bar, Setup's label, the dial-up monitors). @param {'glass' | 'arrow'} busy */
const WAIT = (busy = 'glass') =>
    `<span class="rt-w" aria-hidden="true"><i class="rt-w__cells"></i><i class="rt-w__beam"></i><span class="rt-w__busy rt-w__busy--${busy}"><span class="kp-spinner rt-w__glass"></span></span><span class="rt-w__foot"><i class="rt-w__bar">${TRACK}</i><i class="rt-w__label"></i><i class="rt-w__lights"><i></i><i></i></i></span></span>`;
/** A month of fourteen days waiting, each day with its own short bar (the boot band's). */
const waitDays = () =>
    `<div class="rt-days rt-days--grid" aria-hidden="true">${[...Array(14).keys()]
        .map((i) => `<span class="rt-day" style="--i: ${i}"><span class="rt-day__num">${i + 1}</span><i class="rt-day__bar">${TRACK}</i></span>`)
        .join('')}</div>`;
/** A skeleton line: the register's sunken line, its own track (a bar) and its own row of cells. */
const waitLine = (/** @type {number} */ i) => `<span class="kp-skeleton rt-line" style="--i: ${i}">${TRACK}<i class="rt-w__cells"></i></span>`;

const LOADING = () =>
    cell(
        'Tile',
        `<div class="kp-card rt-tile rt-waits rt-waits--box" aria-busy="true"><p class="kp-card__title rt-titlebar"><span>Pump house 4</span></p><div class="rt-waits__room">${WAIT()}</div><p class="rt-tile__foot"><span>Reading…</span></p></div>`,
    ) +
    cell(
        'Panel',
        `<div class="kp-card rt-panel rt-waits rt-waits--box" aria-busy="true"><p class="rt-panel__words">Reading the pump houses…</p><div class="rt-waits__room">${WAIT()}</div></div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover rt-pop rt-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item rt-waits rt-waits--row" aria-busy="true"><span class="rt-entry">Stations…</span>${WAIT(
            'arrow',
        )}</button></li>${entries(['Rename'])}</ul></div>`,
    ) +
    cell('Month days', `<div class="rt-well rt-month-wait rt-waits" aria-busy="true">${waitDays()}${WAIT('arrow')}</div>`) +
    cell('Chart plot', `<div class="rt-well rt-plotwait rt-waits" aria-busy="true">${plot('rt-plot--ghost')}${WAIT()}</div>`) +
    cell(
        'Skeleton lines',
        `<div class="rt-skelwrap rt-waits rt-waits--skel" aria-busy="true"><div class="rt-skel" aria-hidden="true">${[0, 1, 2]
            .map(waitLine)
            .join('')}</div>${WAIT()}</div>`,
    );

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
const SCENES = /** @type {Record<string, () => string>} */ ({
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
        <div class="rt-scene" data-rt-kind="${a.kind}" data-rt-${a.id}="${o.key}" data-rt-phase="hold">${desk(scene())}</div>`;
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
