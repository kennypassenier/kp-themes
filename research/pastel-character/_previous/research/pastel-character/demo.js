// What makes pastel pastel (themes/pastel/CHARACTER.md, G1-G20). Pastel is a
// risograph-printed sticker sheet in a planner: a lavender milk page, plum ink,
// a second ink (sky) that never lines up, stickers with a flat shadow and washi
// tape. The anchor proposed for it (§0a, question 1 here): a part is PRINTED
// TWICE AND STUCK ON. Its second pass (a flat sky silhouette, no words) springs
// from a wide misregistration into its rest 6 px off register, where it stays
// as the part's flat shadow; then the part swings down from its top-start
// corner onto it. The close is exactly that backwards.
//
// A review-kit demo in aspect mode, pastel only. The questions are data in
// aspects.js; this file builds each question's scene (small planner pages of
// the package's own components in pastel), the rows and the review kit's
// choices from that data, and runs the page's clocks. Each OPTION is a live
// scene with one attribute on its wrapper (`data-pa-<question>="<key>"`) that
// options.css reads. The recommendation is the option marked `rec`, else the
// first (aspects.js: the spinner recommends option 2 so its pairs keep their
// numbers). The network graph
// is in no scene: it changes in no theme (Kenny, 2026-10-07 02:54).

import { ASPECTS, STORY, TITLE, THEME, LABEL } from './aspects.js';
import { decorate as decorateA } from './pairs-a.js';
import { decorate as decorateB } from './pairs-b.js';

/** The recommended option's index: the one marked `rec`, else the first. @param {{ options: { rec?: boolean }[] }} a */
const recOf = (a) => Math.max(0, a.options.findIndex((o) => o.rec));

/* ----------------------------------------------------------- the parts */

/** A pastel button; the fold is the corner that curls up when it is pointed at (G14). */
const button = (label = '', modifier = '', extra = '') =>
    `<button type="button" class="kp-button pa-btn ${modifier}" ${extra}><span class="kp-button__label">${label}</span><span class="pa-fold" aria-hidden="true"></span></button>`;

/** A strip of washi tape across a plate's top-start corner (G7). */
const TAPE = '<span class="pa-tape" aria-hidden="true"></span>';
/** A thumbtack beside it, drawn only by the leave's tack option (G12, update 1), which hides the tape. */
const TACK = '<span class="pa-tack" aria-hidden="true"></span>';
/** What a waiting part wears: the tape strip, and a dot some loading pictures draw with (pairs-a, pairs-b). */
const WAIT = '<span class="pa-strip" aria-hidden="true"><span class="pa-strip__dot"></span></span>';

/**
 * A part printed twice: the wrapper carries the second pass (`::before`), the
 * first child is the ink pass (`.pa-ink`). `i` is its place in reading order,
 * `ri` the same counted from the end.
 * @param {string} inner @param {string} cls @param {number} i @param {number} ri
 */
const sheet = (inner, cls = '', i = 0, ri = 0) => `<div class="pa-sheet pa-arrives ${cls}" style="--i: ${i}; --ri: ${ri}">${inner}</div>`;

const TREND = '0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8';
const TREND2 = '0,20 15,23 30,17 45,19 60,8 75,14 90,5 105,11 120,3';
const polyline = (points = TREND) =>
    `<polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;

/** The change on a figure: the tone's sticker (G8). */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta pa-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const menuList = (items = ['Openen', 'Toewijzen…', 'Wissen']) =>
    `<ul class="kp-menu" role="menu">${items
        .map(
            (t, n) =>
                `<li role="none"><button type="button" role="menuitem" class="kp-menu__item pa-entry${
                    t === 'Wissen' ? ' kp-menu__item--destructive' : ''
                }${n === 0 ? ' pa-entry--first' : ''}">${t}<span class="pa-fold" aria-hidden="true"></span></button></li>`,
        )
        .join('')}</ul>`;

const PART = {
    dialog: (i = 0, long = false) =>
        sheet(
            `<div class="kp-dialog pa-ink pa-dialog" role="group" aria-label="Een dialoog die opent">${TAPE}
        <p class="kp-dialog__title pa-title">Week afsluiten?</p>
        <p class="kp-dialog__description">${
            long ? 'De planning van deze week wordt bewaard en de open taken schuiven door naar maandag, met hun stickers erbij.' : 'De open taken schuiven door naar maandag.'
        }</p>
        <div class="kp-dialog__actions">${button('Annuleren', 'kp-button--sm')}${button('Afsluiten', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
            'pa-plate',
            i,
        ),
    menu: (i = 0) => `<div class="pa-hangs">
        ${button('Meer ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        ${sheet(`<div class="kp-popover pa-ink pa-pop">${menuList()}</div>`, 'pa-plate pa-hang', i)}
    </div>`,
    tile: (label = 'Boodschappen', body = '4 van 9 gedaan', taped = true, i = 0, ri = 0) =>
        sheet(
            `<div class="kp-card pa-ink pa-tile">${taped ? TAPE : ''}<p class="kp-card__title pa-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
            'pa-plate',
            i,
            ri,
        ),
    kpi: (label = 'Taken vandaag', value = '12', foot = note('3 meer'), tone = '', extra = '', i = 0) =>
        sheet(
            `<div class="kp-kpi pa-ink pa-kpi"${tone ? ` data-kp-tone="${tone}"` : ''}>${TAPE}
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value"><span class="pa-carrier" data-pa-num>${value}</span></span>
        <span class="kp-kpi__trend">${foot} dan gisteren</span>${extra}
    </div>`,
            'pa-plate',
            i,
        ),
    /** A small sticker on the option's curve beside one at an even pace. */
    beads: () => `<div class="pa-beads" aria-hidden="true">
        <span class="pa-beads__ground">${sheet('<span class="pa-ink pa-bead"></span>', 'pa-bead-wrap pa-bead--own')}</span>
        <span class="pa-beads__ground">${sheet('<span class="pa-ink pa-bead"></span>', 'pa-bead-wrap pa-bead--even')}</span>
        <span class="pa-beads__name">deze curve</span><span class="pa-beads__name">gelijkmatig tempo</span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="pa-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => sheet(`<span class="pa-ink pa-day"><span class="pa-day__n">${from + i}</span></span>`, 'pa-daywrap', i, n - 1 - i))
            .join('')}</div>`,
    toast: (i = 0) => sheet(`<div class="kp-toast pa-ink pa-toast" role="status"><span class="kp-toast__body">Export klaar</span></div>`, 'pa-plate pa-toastwrap', i),
    tip: (i = 0) => `<div class="pa-hangs pa-hangs--tip">${button('14:00', 'kp-button--sm')}${sheet(
        `<div class="kp-tooltip pa-ink pa-tip" role="tooltip">14:00 · 9 taken</div>`,
        'pa-pill pa-hang',
        i,
    )}</div>`,
    drawer: (i = 0) => `<div class="pa-frame" aria-label="Een pagina met een zijpaneel">
        ${sheet(
            `<nav class="kp-card pa-ink pa-drawer" aria-label="Zijpaneel">${TAPE}<p class="pa-title">Planner</p><a class="pa-navlink" href="#pa-intro">Vandaag</a><a class="pa-navlink" href="#pa-intro">Week</a><a class="pa-navlink" href="#pa-intro">Maand</a></nav>`,
            'pa-plate pa-edge',
            i,
        )}
        <div class="pa-frame__page" aria-hidden="true"><span></span><span></span><span></span></div>
    </div>`,
    alarm: (i = 0) => `<div class="pa-alarm">
        <span class="pa-alarm__ground pa-fades" aria-hidden="true" style="--i: ${i}"></span>
        ${sheet(
            `<div class="kp-card pa-ink pa-alarm__panel" role="alert"><p class="pa-alarm__title">De vriezer staat open</p><p class="kp-card__body">Al 6 minuten.</p>${button(
                'Gezien',
                'kp-button--sm kp-button--primary',
            )}</div>`,
            'pa-plate',
            i,
        )}
    </div>`,
    tour: (i = 0) => `<div class="pa-tour">
        <span class="pa-tour__target"><span class="pa-tour__ring pa-fades" aria-hidden="true" style="--i: ${i}"></span>Filter</span>
        ${sheet(
            `<div class="kp-card pa-ink pa-tourcard">${TAPE}<p class="pa-title">Stap 2 van 4</p><p class="kp-card__body">De filter onthoudt je keuze.</p><div class="pa-row">${button(
                'Overslaan',
                'kp-button--sm kp-button--ghost',
            )}${button('Volgende', 'kp-button--sm kp-button--primary')}</div></div>`,
            'pa-plate',
            i,
        )}
    </div>`,
    datepicker: (i = 0) => `<div class="pa-hangs">
        <label class="kp-field pa-field"><span class="kp-field__label">Datum</span><input class="kp-field__input" value="14-10-2026" readonly /></label>
        ${sheet(
            `<div class="kp-popover pa-ink pa-pop pa-cal" aria-label="Oktober 2026"><p class="pa-cal__head">Oktober 2026</p><div class="pa-cal__grid">${[...Array(14).keys()]
                .map((d) => `<span class="pa-cal__d${d + 8 === 14 ? ' pa-cal__d--pick' : ''}">${d + 8}</span>`)
                .join('')}</div></div>`,
            'pa-plate pa-hang',
            i,
        )}
    </div>`,
    combobox: (i = 0) => `<div class="pa-hangs">
        <label class="kp-field pa-field"><span class="kp-field__label">Lijst</span><input class="kp-field__input" value="Bo" readonly /></label>
        ${sheet(`<div class="kp-popover pa-ink pa-pop">${menuList(['Boodschappen', 'Boeken', 'Bonnetjes'])}</div>`, 'pa-plate pa-hang', i)}
    </div>`,
    /** The trend's line, drawn in along its length. */
    sparkRun: (i = 0) => `<span class="pa-spark pa-run pa-arrives" style="--i: ${i}; --ri: 0" aria-hidden="true">
        <svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline()}</svg>
    </span>`,
    /** The trend's line as a live carrier. */
    spark: () =>
        `<span class="pa-spark pa-carrier pa-carrier--svg" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline()}</svg></span>`,
    chip: (word = 'Bezig') =>
        `<span class="pa-state"><span class="pa-state__dot" aria-hidden="true"></span><span class="pa-state__word pa-carrier" data-pa-word>${word}</span></span>`,
    alert: (text = 'De wasmachine is klaar.', kind = '') =>
        `<div class="kp-alert ${kind} pa-ink pa-alert" role="status"><span class="kp-alert__body">${text}</span></div>`,
    menuStatic: (items = ['Openen', 'Toewijzen…'], cls = '') => sheet(`<div class="kp-popover pa-ink pa-pop ${cls}">${menuList(items)}</div>`, 'pa-plate pa-still'),
};

const caption = (/** @type {string} */ text) => `<p class="pa-cap">${text}</p>`;
const cell = (/** @type {string} */ cap, /** @type {string} */ html, cls = '') => `<div class="pa-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

// Every part that opens, closes, arrives or leaves: the anchor is seen on all of them.
const ANCHOR = () =>
    cell('Een dialoog', PART.dialog()) +
    cell('Een menu onder zijn knop', PART.menu()) +
    cell('Een toast', PART.toast()) +
    cell('Een zijpaneel aan de rand', PART.drawer(), 'pa-part--wide') +
    cell('Het alarm', PART.alarm()) +
    cell('Een tooltip', PART.tip()) +
    cell('De rondleiding', PART.tour()) +
    cell('Een datumkiezer', PART.datepicker());

const CURVE = () =>
    cell('Een stickertje, naast een op gelijkmatig tempo', PART.beads(), 'pa-part--wide') +
    cell('Een dialoog', PART.dialog()) +
    cell('Een menu onder zijn knop', PART.menu()) +
    cell('Een tegel', PART.tile());

const DIRECTION = () =>
    cell('Een week, de ene dag na de andere', PART.days(7), 'pa-part--wide') +
    cell('Een tegel', PART.tile('Boodschappen', '4 van 9 gedaan', true, 0, 0)) +
    cell('Een kerncijfer', PART.kpi()) +
    cell('De lijn van de trend', PART.sparkRun(), 'pa-part--wide');

const OPENING = () =>
    cell('Een menu onder zijn knop', PART.menu()) +
    cell('Een datumkiezer onder zijn veld', PART.datepicker()) +
    cell('Een keuzelijst onder zijn veld', PART.combobox()) +
    cell('Een tooltip onder zijn knop', PART.tip());

const DURATIONS = () =>
    cell(
        'Contact: een druk',
        `<div class="pa-row">${button('Exporteren', 'pa-tap')}</div><p class="pa-readout" data-pa-readout="contact"></p>`,
    ) +
    cell('Een landing: een dialoog', PART.dialog() + '<p class="pa-readout" data-pa-readout="landing"></p>') +
    cell('Een groep: vijf dagen', PART.days(5, 12) + '<p class="pa-readout" data-pa-readout="group"></p>') +
    cell(
        'Een lus: de wapperende tape',
        `<div class="kp-card pa-tile pa-waits pa-ink-still" aria-busy="true"><p class="kp-card__title pa-title">Agenda</p><p class="kp-card__body">Laden…</p>${WAIT}</div><p class="pa-readout" data-pa-readout="loop"></p>`,
    );

const COLOUR = () =>
    cell(
        'Een kaart en zijn woorden',
        sheet(
            `<div class="kp-card pa-ink pa-tile">${TAPE}<p class="kp-card__title pa-title">Deze week</p><p class="kp-card__body">Nog <mark>drie taken</mark> en een <mark>afspraak</mark>.</p></div>`,
            'pa-plate pa-still',
        ),
    ) +
    cell('Een dialoog', sheet(`<div class="kp-dialog pa-ink pa-dialog" role="group" aria-label="Een dialoog"><p class="kp-dialog__title pa-title">Week afsluiten?</p>
        <div class="kp-dialog__actions">${button('Annuleren', 'kp-button--sm')}${button('Afsluiten', 'kp-button--sm kp-button--primary')}</div></div>`, 'pa-plate pa-still pa-dialogwrap')) +
    cell(
        'Wat iets doet',
        `<div class="pa-row">${button('Exporteren')}${button('Taak toevoegen', 'kp-button--primary')}</div><div class="pa-row pa-row--gap"><label class="kp-switch pa-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Live" /></label><a class="pa-link" href="#pa-intro">Open het logboek</a></div>`,
    ) +
    cell('Een kerncijfer met zijn sticker', `<div class="kp-kpis">${PART.kpi().replace('pa-arrives', 'pa-still')}</div>`) +
    cell('Een mislukte export', PART.alert('Export mislukt: de agenda gaf geen antwoord.', 'kp-alert--destructive'), 'pa-part--wide');

/** One part in three sizes, side by side. */
const sizes3 = (/** @type {(size: string) => string} */ make) => `<div class="pa-sizes3">${make('small')}${make('long')}${make('wide')}</div>`;

const CORNERS = () =>
    cell(
        'Kaart: klein, lang, breed',
        sizes3((size) =>
            sheet(
                `<div class="kp-card pa-ink pa-tile pa-${size}">${TAPE}<p class="kp-card__title pa-title">${
                    { small: 'Was', long: 'Boodschappen', wide: 'Boodschappen voor het weekend' }[size]
                }</p><p class="kp-card__body">${{ small: '2', long: '4 van 9 gedaan, de rest zaterdag', wide: '4 van 9 gedaan, de rest zaterdag op de markt' }[size]}</p></div>`,
                'pa-plate pa-still',
            ),
        ),
        'pa-part--wide',
    ) +
    cell('Een menu', PART.menuStatic(['Openen', 'Toewijzen aan iemand', 'Hernoemen'])) +
    cell('Knop, label en chip', `<div class="pa-row">${button('Exporteren')}<span class="kp-badge pa-chip">12 nieuw</span><span class="kp-tag pa-chip">Thuis</span></div>`) +
    cell('Tooltip', `<div class="kp-tooltip pa-tip pa-tip--still" role="tooltip">14:00 · 9 taken</div>`) +
    cell(
        'De balk',
        `<div class="kp-progressbar pa-bar" role="progressbar" aria-label="Export, 62 %" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style="--kp-value: 0.62"><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
    );

const SURFACE = () =>
    cell('Een dialoog met een titel en een lange regel', sheet(`<div class="kp-dialog pa-ink pa-dialog" role="group" aria-label="Een dialoog">${TAPE}<p class="kp-dialog__title pa-title">Week afsluiten?</p><p class="kp-dialog__description">De open taken schuiven door naar maandag, met hun stickers erbij.</p></div>`, 'pa-plate pa-still pa-dialogwrap')) +
    cell('Een kerncijfer', `<div class="kp-kpis">${PART.kpi('Gelezen', '18').replace('pa-arrives', 'pa-still')}</div>`) +
    cell(
        'Een trendtegel',
        sheet(
            `<div class="kp-card pa-ink pa-tile pa-chart">${TAPE}<p class="kp-card__title pa-title">Stappen, 7 dagen</p><span class="pa-chart__plot" aria-hidden="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none">${polyline()}</svg></span><p class="kp-card__body">8 412 vandaag</p></div>`,
            'pa-plate pa-still',
        ),
    ) +
    cell('Een menu', PART.menuStatic(['Openen', 'Toewijzen…'], 'pa-pop--soft')) +
    cell('Een toast en een knop', `<div class="pa-stack">${sheet(`<div class="kp-toast pa-ink pa-toast" role="status"><span class="kp-toast__body">Export klaar</span></div>`, 'pa-plate pa-still pa-toastwrap')}<div class="pa-row">${button('Exporteren', 'kp-button--primary')}</div></div>`);

const TONE = () =>
    cell('Een kerncijfer dat aandacht vraagt', `<div class="kp-kpis">${PART.kpi('Water vandaag', '0,6 l', note('1 l minder', 'down', 'bad'), 'warning').replace('pa-arrives', 'pa-still')}</div>`) +
    cell(
        'Een mislukte trendtegel',
        sheet(
            `<div class="kp-card pa-ink pa-tile pa-failed" data-pa-tone="bad">${TAPE}<p class="kp-card__title pa-title">Slaap</p><span class="pa-spark pa-spark--stale" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline()}</svg></span><p class="kp-card__body">Geen meting sinds 06:40 ${note('2 u', 'down', 'bad')}</p></div>`,
            'pa-plate pa-still',
        ),
    ) +
    cell('Een menuregel om te wissen', PART.menuStatic(['Openen', 'Wissen'])) +
    cell('Een toestandswoord', `<div class="pa-row">${PART.chip('Te laat')}</div>`);

const LIVE = () =>
    cell('Het getal van een kerncijfer', `<div class="kp-kpis">${PART.kpi().replace('pa-arrives', 'pa-still')}</div>`) +
    cell('Een toestandswoord', `<div class="pa-row">${PART.chip('Bezig')}</div>`) +
    cell('De lijn van een trend', PART.spark()) +
    cell(
        'Een tegel',
        sheet(
            `<div class="kp-card pa-ink pa-tile">${TAPE}<p class="kp-card__title pa-title">Water</p><p class="kp-card__body"><span class="pa-carrier" data-pa-num>1,4 l</span></p></div>`,
            'pa-plate pa-still',
        ),
    );

const LOADING = () =>
    cell('Een tegel', `<div class="kp-card pa-tile pa-waits" aria-busy="true"><p class="kp-card__title pa-title">Agenda</p><p class="kp-card__body">Laden…</p>${WAIT}</div>`) +
    cell(
        'Een paneel',
        `<div class="kp-kpis"><div class="kp-kpi pa-kpi pa-waits" aria-busy="true"><span class="kp-kpi__label">Taken vandaag</span><span class="kp-kpi__value">12</span><span class="kp-kpi__trend">dan gisteren</span>${WAIT}</div></div>`,
    ) +
    cell(
        'Een menuregel die laadt',
        `<div class="kp-popover pa-pop pa-pop--flat"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item pa-waits" aria-busy="true">Lijsten laden…${WAIT}</button></li></ul></div>`,
    ) +
    cell('Dagen van een maand', `<div class="pa-days">${[1, 2, 3, 4, 5].map((d) => `<span class="pa-day pa-waits"><span class="pa-day__n">${d}</span>${WAIT}</span>`).join('')}</div>`) +
    cell('Een grafiek', `<div class="pa-plot pa-waits" aria-busy="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">${polyline()}</svg>${WAIT}</div>`) +
    cell('Skeletregels', `<div class="pa-skel" aria-hidden="true">${[1, 2, 3].map((n) => `<span class="pa-skel__line pa-waits" style="--n: ${n}">${WAIT}</span>`).join('')}</div>`) +
    cell(
        'De bezige balk (nog geen aandeel bekend)',
        `<div class="kp-progressbar pa-bar pa-bar--busy" role="progressbar" aria-label="Export bezig" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span>${WAIT}</span></div>`,
        'pa-part--wide',
    );

const spin = (size = '1.25rem') => `<span class="pa-spinwrap"><span class="kp-spinner pa-spin" role="status" aria-label="Bezig…" style="--kp-spinner-size: ${size}"></span></span>`;

const SPINNER = () =>
    cell('Drie maten', `<div class="pa-row pa-spins">${spin('1.25rem')}${spin('2rem')}${spin('3.5rem')}</div>`, 'pa-part--wide') +
    cell('Een bezige knop', `<button type="button" class="kp-button pa-btn pa-busy-button" aria-busy="true">${spin()}<span class="kp-button__label">Bewaren…</span></button>`) +
    cell('Een bezig paneel', `<div class="kp-card pa-tile pa-busy-panel">${spin('2.5rem')}<p class="kp-card__body">De agenda wordt gelezen…</p></div>`);

// The parts the surface rule tapes to the page (the card, the key figure) also
// carry the tack the leave's third option pushes in instead of the tape.
const LEAVE = () =>
    cell('Een melding', sheet(PART.alert('De wasmachine is klaar.'), 'pa-plate', 0)) +
    cell('Een kaart', PART.tile('Boodschappen', '4 van 9 gedaan', true).replace(TAPE, TAPE + TACK)) +
    cell('Een kerncijfer', `<div class="kp-kpis">${PART.kpi('Taken vandaag', '12', note('3 meer')).replace(TAPE, TAPE + TACK)}</div>`) +
    cell('Een toast', PART.toast());

const COMPOSITES = () =>
    cell('Alleen: pastels eigen knop, ter vergelijking', `<div class="pa-row">${button('Exporteren', 'pa-alone')}${button('Toevoegen', 'kp-button--primary pa-alone')}</div>`, 'pa-part--wide') +
    cell(
        'Paginakop: zijn knoppen',
        `<header class="kp-page-header pa-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title pa-title">Deze week</p><p class="kp-page-header__description">Negen taken, drie afspraken.</p></div>
        <div class="kp-page-header__actions">${button('Exporteren', 'kp-button--sm pa-in-header')}${button('Toevoegen', 'kp-button--sm kp-button--primary pa-in-header')}</div></div></header>`,
        'pa-part--wide',
    ) +
    cell('Menu: zijn regels', PART.menuStatic(['Openen', 'Toewijzen…'], 'pa-in-menu')) +
    cell(
        'Tegel: zijn Open-link',
        sheet(
            `<div class="kp-card pa-ink pa-tile pa-in-tile">${TAPE}<p class="kp-card__title pa-title">Boodschappen</p><a class="kp-button kp-button--ghost kp-button--sm pa-btn pa-tile-link" href="#pa-intro"><span class="kp-button__label">Open</span><span class="pa-fold" aria-hidden="true"></span></a></div>`,
            'pa-plate pa-still',
        ),
    ) +
    cell(
        'Rondleiding: zijn knoppen',
        sheet(
            `<div class="kp-card pa-ink pa-tourcard">${TAPE}<p class="pa-title">Stap 2 van 4</p><p class="kp-card__body">De filter onthoudt je keuze.</p><div class="pa-row">${button(
                'Overslaan',
                'kp-button--sm kp-button--ghost pa-in-drawer',
            )}${button('Volgende', 'kp-button--sm kp-button--primary pa-in-drawer')}</div></div>`,
            'pa-plate pa-still',
        ),
    ) +
    cell(
        'Kerncijfer als link',
        `<div class="kp-kpis"><a class="kp-kpi pa-kpi pa-in-kpi pa-kpilink" href="#pa-intro"><span class="kp-kpi__label">Taken vandaag</span><span class="kp-kpi__value">12</span><span class="kp-kpi__trend">gemiddeld 9</span><span class="pa-fold" aria-hidden="true"></span></a></div>`,
    );

const HOVER = () =>
    cell('Een knop, aangewezen', `<div class="pa-row">${button('Exporteren', 'pa-pointed')}${button('Toevoegen', 'kp-button--primary')}</div>`) +
    cell('Menuregels, de eerste aangewezen', PART.menuStatic(['Openen', 'Toewijzen…', 'Hernoemen'], 'pa-point-first')) +
    cell(
        'Een tegel met zijn Open-link aangewezen',
        sheet(
            `<div class="kp-card pa-ink pa-tile pa-in-tile">${TAPE}<p class="kp-card__title pa-title">Boodschappen</p><a class="kp-button kp-button--ghost kp-button--sm pa-btn pa-tile-link pa-pointed" href="#pa-intro"><span class="kp-button__label">Open</span><span class="pa-fold" aria-hidden="true"></span></a></div>`,
            'pa-plate pa-still',
        ),
    ) +
    cell('Een link in gewone tekst, aangewezen', `<p class="pa-prose">Lees eerst het <a class="pa-link pa-pointed" href="#pa-intro">logboek van de week</a> voor je plant.</p>`) +
    cell(
        'Kerncijfers, het eerste aangewezen',
        `<div class="kp-kpis pa-kpi-row"><a class="kp-kpi pa-kpi pa-kpilink pa-pointed" href="#pa-intro"><span class="kp-kpi__label">Taken</span><span class="kp-kpi__value">12</span><span class="pa-fold" aria-hidden="true"></span></a><a class="kp-kpi pa-kpi pa-kpilink" href="#pa-intro"><span class="kp-kpi__label">Afspraken</span><span class="kp-kpi__value">3</span><span class="pa-fold" aria-hidden="true"></span></a></div>`,
    ) +
    cell(
        'Dagen van een maand, één aangewezen',
        `<div class="pa-days pa-days--still">${[12, 13, 14, 15].map((d) => `<span class="pa-day pa-day--btn${d === 13 ? ' pa-pointed' : ''}"><span class="pa-day__n">${d}</span><span class="pa-fold" aria-hidden="true"></span></span>`).join('')}</div>`,
    );

const FOCUS = () =>
    cell('Een knop', `<div class="pa-row">${button('Exporteren', 'pa-focused')}</div>`) +
    cell('Een knop in de paginakop', `<div class="pa-header-mini">${button('Exporteren', 'kp-button--sm pa-in-header pa-focused')}</div>`) +
    cell(
        'Een kerncijfer als link',
        `<div class="kp-kpis"><a class="kp-kpi pa-kpi pa-kpilink pa-focused" href="#pa-intro"><span class="kp-kpi__label">Taken vandaag</span><span class="kp-kpi__value">12</span><span class="pa-fold" aria-hidden="true"></span></a></div>`,
    ) +
    cell('Een menuregel', PART.menuStatic(['Toewijzen…', 'Hernoemen'], 'pa-focus-first')) +
    cell(
        'Een dag',
        `<div class="pa-days pa-days--still"><span class="pa-day pa-day--btn"><span class="pa-day__n">13</span></span><span class="pa-day pa-day--btn pa-focused"><span class="pa-day__n">14</span></span><span class="pa-day pa-day--btn"><span class="pa-day__n">15</span></span></div>`,
    ) +
    cell(
        'Een tegellink',
        sheet(
            `<div class="kp-card pa-ink pa-tile pa-in-tile"><p class="kp-card__title pa-title">Boodschappen</p><a class="kp-button kp-button--ghost kp-button--sm pa-btn pa-tile-link pa-focused" href="#pa-intro"><span class="kp-button__label">Open</span><span class="pa-fold" aria-hidden="true"></span></a></div>`,
            'pa-plate pa-still',
        ),
    );

const PRESS = () =>
    cell('Een knop', `<div class="pa-row">${button('Exporteren', 'pa-press')}</div>`) +
    cell('Een hoofdknop', `<div class="pa-row">${button('Taak toevoegen', 'kp-button--primary pa-press')}</div>`) +
    cell('Een menuregel', PART.menuStatic(['Toewijzen…', 'Hernoemen'], 'pa-press-first')) +
    cell(
        'Een dag',
        `<div class="pa-days pa-days--still"><span class="pa-day pa-day--btn"><span class="pa-day__n">13</span></span><span class="pa-day pa-day--btn pa-press"><span class="pa-day__n">14</span></span><span class="pa-day pa-day--btn"><span class="pa-day__n">15</span></span></div>`,
    ) +
    cell(
        'Een kerncijfer als filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle pa-kpi pa-kpilink pa-press" aria-pressed="false"><span class="kp-kpi__label">Te laat</span><span class="kp-kpi__value">3</span></button></div>`,
    );

const TYPE = () =>
    cell(
        'Een tegel met zijn woorden en cijfers',
        sheet(
            `<div class="kp-card pa-ink pa-tile pa-type">${TAPE}<p class="pa-type__label">Deze week</p><p class="pa-type__head">Boodschappen</p>
        <p class="pa-type__prose">De markt is zaterdag tot één uur; de rest halen we vrijdag na het werk.</p>
        <p class="pa-type__figure">4 <small>van 9</small> ${note('2 meer', 'up', 'good')}</p>
        <table class="pa-type__table"><tbody><tr><th scope="row">Lijsten</th><td>3</td></tr><tr><th scope="row">Laatst bijgewerkt</th><td><span class="kp-timestamp pa-stamp">2026-10-14 08:12</span></td></tr></tbody></table>
        <p class="pa-type__id">LIJST-0412</p>
        <p class="pa-row">${button('Open de lijst', 'kp-button--sm')} <span class="kp-badge pa-chip">12 nieuw</span></p></div>`,
            'pa-plate pa-still',
        ),
        'pa-part--wide',
    );

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter pa-meter" role="meter" aria-label="Water, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(value * 100)}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const MOTIFS = () =>
    cell('Een kaart met zijn titel', PART.tile('Boodschappen', '4 van 9 gedaan', true).replace('pa-arrives', 'pa-still')) +
    cell('Een meter met zijn merkteken', `${meter(0.62, 0.8)}<div class="pa-gap"></div>${meter(1, 0.8, 'data-kp-over')}`) +
    cell(
        'De gebeurtenissen van een grafiek',
        `<div class="pa-events" aria-hidden="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none">${polyline()}</svg><i></i><i></i></div>`,
    ) +
    cell('Een knop en een lijstje', `<div class="pa-row">${button('Exporteren', 'kp-button--primary')}</div><ul class="pa-list"><li>Boodschappen</li><li>Was</li></ul>`) +
    cell('Een lege toestand', `<div class="kp-empty pa-empty"><p class="kp-empty__title">Nog geen taken</p><p class="kp-empty__body">De eerste komt er vanzelf bij.</p></div>`) +
    cell(
        'Een scheiding tussen twee delen',
        `<p class="pa-cap pa-cap--inner">Thuis</p><div class="pa-seam" data-kp-divider role="separator"></div><p class="pa-cap pa-cap--inner">Werk</p>`,
    );

/** Each question's scene, by the `scene` key aspects.js names. */
const SCENES = /** @type {Record<string, () => string>} */ ({
    anchor: ANCHOR,
    curve: CURVE,
    direction: DIRECTION,
    opening: OPENING,
    durations: DURATIONS,
    colour: COLOUR,
    corners: CORNERS,
    surface: SURFACE,
    tone: TONE,
    live: LIVE,
    loading: LOADING,
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

for (const [key, text] of Object.entries(STORY)) {
    const p = document.querySelector(`[data-pa-story="${key}"]`);
    if (p) p.textContent = text;
}
const h1 = document.querySelector('.pa-intro h1');
if (h1) h1.textContent = TITLE;

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}"]`));
// Each hint repeats the question, then what this option shows and why: the
// dialog shows only the hint of the option on screen, so it stands on its own.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map((a) => ({
            id: a.id,
            label: a.label,
            options: a.options.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === recOf(a) ? ' (aanbevolen)' : ''}`,
                hint: `${a.question} ${o.see} ${o.verdict}`,
            })),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', THEME);
lookLine.textContent = `${ASPECTS.length} vragen, elk één regel van ${LABEL.toLowerCase()}; de optie met “aanbevolen” is de aanbeveling (meestal de eerste). Laden en de spinner zijn 21 paren: optie N van de ene hoort bij optie N van de andere. Kies wat voor jou ${LABEL.toLowerCase()} is, of “None of these” met een opmerking.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-pa-aspects]'));
const toc = document.querySelector('[data-pa-toc]');
ASPECTS.forEach((a, n) => {
    const rec = recOf(a);
    const scene = SCENES[a.scene];
    if (!scene) throw new Error(`no scene for ${a.id}: ${a.scene}`);
    const box = document.createElement('section');
    box.className = 'pa-aspect';
    box.id = `pa-${a.id}`;
    box.setAttribute('data-pa-aspect', a.id);
    box.setAttribute('data-pa-count', String(a.options.length));
    box.setAttribute('aria-labelledby', `h-pa-${a.id}`);
    box.innerHTML = `<div class="pa-aspect__head">
        <h3 id="h-pa-${a.id}"><span class="pa-aspect__no">${n + 1}</span> ${a.label} <span class="pa-aspect__rule">${a.rule}</span></h3>
        <p class="pa-aspect__q"></p><p class="pa-aspect__why"></p></div><div class="pa-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.pa-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.pa-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.pa-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'pa-col';
        col.setAttribute('data-pa-option', String(at + 1));
        col.innerHTML = `<p class="pa-label"><span class="pa-label__no">${at + 1}</span> <span class="pa-label__name"></span>${
            at === rec ? ' <span class="pa-label__rec">Aanbevolen</span>' : ''
        }</p><p class="pa-see"></p><p class="pa-verdict"></p>
        <div class="pa-scene" data-pa-kind="${a.kind}" data-pa-${a.id}="${o.key}" data-pa-phase="in">${scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.pa-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.pa-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.pa-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('pa-verdict--rec', at === rec);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#pa-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// Round 2: the loading and spinner pairs add a few elements of their own
// (pairs-a.js, pairs-b.js). Some measure their carrier (pairs-a's doodle fits its
// line to the strip; a hidden strip measures 0 and falls back to a stretched
// line), so each scene is decorated after layout and again whenever its size
// changes: a resize, or the review dialog showing a cell that was hidden.
const decorated = new WeakMap();
const decorateScene = (/** @type {HTMLElement} */ scene) => {
    const id = scene.hasAttribute('data-pa-loading') ? 'loading' : 'spinner';
    const key = scene.getAttribute(`data-pa-${id}`) || '';
    decorateA(scene, id, key);
    decorateB(scene, id, key);
};
const resized = new ResizeObserver((entries) => {
    for (const { target, contentRect } of entries) {
        const size = `${Math.round(contentRect.width)}x${Math.round(contentRect.height)}`;
        if (decorated.get(target) === size) continue;
        decorated.set(target, size);
        decorateScene(/** @type {HTMLElement} */ (target));
    }
});
// An option change (the review kit's embed writes the key on the scene) redraws too.
const rekeyed = new MutationObserver((records) => {
    for (const { target } of records) decorateScene(/** @type {HTMLElement} */ (target));
});
for (const scene of section.querySelectorAll('.pa-scene[data-pa-loading], .pa-scene[data-pa-spinner]')) {
    decorateScene(/** @type {HTMLElement} */ (scene));
    resized.observe(scene);
    rekeyed.observe(scene, { attributeFilter: ['data-pa-loading', 'data-pa-spinner'] });
}

// Update 1 (update.json beside this page, the review kit's convention): the
// questions Kenny approved are answered there and the dialog no longer walks
// them; on the page each such row says it is decided and marks the option he
// picked, so only the reopened questions read as open.
fetch(new URL('update.json', location.href), { cache: 'no-cache' })
    .then((response) => (response.ok ? response.json() : null))
    .then((update) => {
        const picks = update?.picks?.[THEME] || {};
        const asked = update?.questions?.[THEME] || {};
        for (const a of ASPECTS) {
            const box = rows.querySelector(`[data-pa-aspect="${a.id}"]`);
            const at = a.options.findIndex((o) => o.key === picks[a.id]);
            if (!box || at < 0 || asked[a.id]) continue;
            box.setAttribute('data-pa-decided', '');
            const note = document.createElement('p');
            note.className = 'pa-aspect__decided';
            note.textContent = `Beslist door jou (14/10): ${a.options[at].name}. Niet meer gevraagd.`;
            box.querySelector('.pa-aspect__head')?.append(note);
            const col = box.querySelector(`[data-pa-option="${at + 1}"]`);
            col?.setAttribute('data-pa-picked', '');
            const tag = document.createElement('span');
            tag.className = 'pa-label__picked';
            tag.textContent = 'Jouw keuze';
            col?.querySelector('.pa-label')?.append(' ', tag);
        }
    })
    .catch(() => {});

// The window of a cell's close is its picture's own length: the largest place in
// reading order of its arriving parts tells how many group steps it holds.
for (const scene of section.querySelectorAll('.pa-scene[data-pa-kind="cycle"] .pa-part')) {
    let most = 0;
    for (const part of scene.querySelectorAll('.pa-arrives, .pa-fades')) {
        const style = /** @type {HTMLElement} */ (part).style;
        most = Math.max(most, Number(style.getPropertyValue('--i')) || 0, Number(style.getPropertyValue('--ri')) || 0);
    }
    /** @type {HTMLElement} */ (scene).style.setProperty('--pa-nmax', String(most));
}

// A menu's first entry is the one pointed at, focused or pressed where the scene asks
// for it (the review kit plays the pointer through the `pa-pointed` class itself).
for (const [holder, mark] of [
    ['.pa-point-first', 'pa-pointed'],
    ['.pa-focus-first', 'pa-focused'],
    ['.pa-press-first', 'pa-press'],
]) {
    for (const entry of section.querySelectorAll(`${holder} .pa-entry--first`)) entry.classList.add(mark);
}

// The durations row says its own numbers under each part (the numbers options.css plays).
const BANDS = {
    landing: ['220 ms', '440 ms de tweede inkt, 440 ms het onderdeel vanaf 120 ms: 560 ms', '60 ms na elkaar', '2400 ms per lus'],
    brisk: ['160 ms', '320 ms de tweede inkt, 320 ms het onderdeel vanaf 80 ms: 400 ms', '40 ms na elkaar', '1600 ms per lus'],
    unhurried: ['280 ms', '600 ms de tweede inkt, 600 ms het onderdeel vanaf 180 ms: 780 ms', '90 ms na elkaar', '3200 ms per lus'],
};
for (const scene of section.querySelectorAll('[data-pa-durations]')) {
    const [contact, landing, group, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-pa-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-pa-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', contact);
    say('landing', landing);
    say('group', group);
    say('loop', loop);
}

/* ---------------------------------------------------------- the clocks */

// One clock replays every scene that opens, arrives or leaves, so the options of
// a row start together and can be compared. One cycle: `gap` (away: not drawn),
// `in` (printed twice and stuck on), `hold` (it stands, its pass 6 px off
// register), `out` (its landing played backwards: peeled off, then the pass slides
// off). `in` and `out` outlast the slowest landing with its group (the unhurried
// 600 + 180 ms and six steps of 90 ms, 1320 ms) so nothing is cut off. The CSS
// keys every motion to these phases.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-pa-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 600],
    ['in', 1800],
    ['hold', 1600],
    ['out', 1800],
]);
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clocks stand still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.pa-scene[data-pa-kind="cycle"]')) scene.setAttribute('data-pa-phase', phase);
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

// A live update: every 2.2 s every live scene gets new values at once and plays
// its update under a fresh name (`data-pa-beat` a / b), so the animation restarts.
const values = ['12', '14', '11', '15'];
const litres = ['1,4 l', '1,6 l'];
let tick = 0;
let liveTimer = 0;
function beat() {
    clearTimeout(liveTimer);
    if (reduced.matches) return;
    if (!dialogPaused()) {
        tick += 1;
        for (const scene of section.querySelectorAll('.pa-scene[data-pa-kind="live"]')) {
            for (const num of scene.querySelectorAll('[data-pa-num]')) {
                num.textContent = /l$/.test(num.textContent || '') ? litres[tick % 2] : values[tick % values.length];
            }
            for (const word of scene.querySelectorAll('[data-pa-word]')) word.textContent = tick % 2 ? 'Klaar' : 'Bezig';
            for (const line of scene.querySelectorAll('.pa-spark polyline')) line.setAttribute('points', tick % 2 ? TREND2 : TREND);
            scene.setAttribute('data-pa-beat', tick % 2 ? 'a' : 'b');
        }
    }
    liveTimer = window.setTimeout(beat, 2200 * slow);
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
radio('data-pa-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--pa-slow', String(slow));
    run(0);
    beat();
});
radio('data-pa-state', (value) => {
    section.setAttribute('data-pa-show', value);
});
document.querySelector('[data-pa-replay]')?.addEventListener('click', () => {
    run(0);
    beat();
});

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.pa-scene a, .pa-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
    beat();
};
reduced.addEventListener('change', syncMotion);
syncMotion();
