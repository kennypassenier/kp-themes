// What makes deco deco (Kenny, 2026-10-08): the anchor is the fan that opens,
// and the progress bar is to be redone. Nineteen questions turn that anchor
// into rules for every other component. Update 1 (2026-10-08): thirteen of
// them are redrawn in Kenny's direction (thin gold on deep blue lacquer with
// the wallpaper, the fan unfolding smoothly, nothing counted, nothing loud);
// his six picks keep their round-one scenes. Update 2 (2026-10-09): six of
// them are drawn again (corners, loading, the bar, leave, hover and the press)
// as jewellery, with gold that reads as gold; their scenes take the option's
// key, so each option builds only the parts it draws (curtains, jewels,
// pearls, inline-SVG corners), and the hover and press rows answer the
// reviewer's own pointer.
//
// A review-kit demo in aspect mode, deco only. aspects.js holds the nineteen
// questions as data (the designer's text, used verbatim); this file gives each
// its scene (a small dashboard of the package's own parts in deco) and builds
// the rows. Each OPTION is one attribute on the scene's wrapper
// (`data-dc-<aspect>="<key>"`) that options.css reads; the recommended option
// is always first. The page's one clock (below) plays every scene that opens,
// arrives, updates or leaves, so the rule is seen in action. The network graph
// is in no scene: it changes in no theme (Kenny, 2026-10-07 02:54).
import { ASPECTS, STORY, TITLE, LABEL, THEME } from './aspects.js';

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The one wrapper a part that arrives stands in: the clock's animation runs on it (the fan, the pleats, the pass), the part inside stays still. */
const fx = (html, cls = '', extra = '') => `<div class="dc-fx ${cls}" ${extra}>${html}</div>`;

/** A crest: twelve gold rays folded to a point at its foot. */
const crest = (cls = '') => `<span class="dc-crest ${cls}" aria-hidden="true"></span>`;

/** The change on a lozenge-ended tag, in its tone's plate and ink. */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta dc-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter dc-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const barBody = (extra = '') =>
    `<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span>${extra}</span>`;
/** The package's progress bar: a share (0 to 1) or busy; `extra` is what an option of question 11 sets on the track (its stations). */
const bar = (share = null, size = '', label = 'Export', extra = '') =>
    share === null
        ? `<div class="kp-progressbar dc-bar ${size}" role="progressbar" aria-label="${label}, busy" data-kp-indeterminate>${barBody(extra)}</div>`
        : `<div class="kp-progressbar dc-bar ${size}" role="progressbar" aria-label="${label}, ${Math.round(share * 100)} %" aria-valuenow="${Math.round(
              share * 100,
          )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${share}">${barBody(extra)}</div>`;

const spin = (size = 1.5, label = 'Working…') =>
    `<span class="kp-spinner dc-spin" role="status" aria-label="${label}" style="--kp-spinner-size: ${size}rem"></span>`;

const dayRow = (nums, cls = '') =>
    `<div class="dc-days ${cls}" aria-hidden="true">${nums.map((n) => `<span class="dc-day">${n}</span>`).join('')}</div>`;

const PART = {
    /** A dialog: its crest stands over its top edge and opens first, the panel follows in pleats. */
    dialog: () =>
        fx(
            `${crest('dc-crest--dialog')}<div class="kp-dialog dc-dialog"><p class="kp-dialog__title dc-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div></div>`,
            'dc-fx--dialog',
            'role="group" aria-label="A dialog opening"',
        ),
    kpi: (label = 'Flow now', value = '412', foot = note('6 %')) => `<div class="kp-kpi dc-kpi">
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value dc-carrier" data-dc-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    /** Days of a month: `--i` is a day's rank from the centre (the group opens from there). */
    days: (n = 7, from = 12) => {
        const mid = (n - 1) / 2;
        return `<div class="dc-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => fx(`<span class="dc-day">${from + i}</span>`, 'dc-fx--day', `style="--i: ${Math.round(Math.abs(i - mid))}"`))
            .join('')}</div>`;
    },
    chip: (word = 'Running') =>
        `<span class="dc-state"><span class="dc-state__dot dc-carrier" aria-hidden="true"></span><span class="dc-state__word dc-carrier" data-dc-word>${word}</span></span>`,
    spark: (cls = '') => `<span class="dc-spark ${cls}" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="1"/></svg></span>`,
    column: (label = 'Open', value = '38') =>
        `<div class="dc-column"><span class="kp-kpi__label">${label}</span><span class="dc-column__num dc-carrier" data-dc-num>${value}</span></div>`,
};
const caption = (text) => `<p class="dc-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="dc-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------- update 1: the lobby's parts */

// Update 1 (2026-10-08) redraws thirteen questions in Kenny's direction: thin
// gold on deep blue lacquer with the chevron wallpaper behind every plate. A
// plate (`.dc-plate`) is lacquer, the wallpaper and a gold inlay line set in
// from its edge (its ::after); a part that arrives (`.dc-ar`) is played by
// the clock through the registered numbers --dc-draw (the inlay drawn), --dc-up
// (the lacquer and the words up), --dc-g (a glint across) and --dc-p (a part's
// own parting). `--i` is a part's rank from the centre of its group.

/** A lozenge: a small gold jewel (a square turned 45 degrees). */
const loz = (cls = '') => `<span class="dc-loz ${cls}" aria-hidden="true"></span>`;

/** A fan of gold hairlines on a pivot at its foot; `--dc-a` is how far it has unfolded. */
const fan = (cls = '') => `<span class="dc-fan ${cls}" aria-hidden="true"></span>`;

const menuList = (items, pointed = -1, cls = '') =>
    `<ul class="kp-menu" role="menu">${items
        .map(
            (t, i) =>
                `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === pointed ? ' dc-pointed' : ''}${
                    /Delete/.test(t) ? ' kp-menu__item--destructive' : ''
                } ${cls}">${t}</button></li>`,
        )
        .join('')}</ul>`;

const LOBBY = {
    /** A dialog on the lacquer: one small crest over its title, its inlay starts there. */
    dialog: () =>
        `<div class="kp-dialog dc-plate dc-ar dc-dlg" role="group" aria-label="A dialog">${fan('dc-fan--crest')}<p class="kp-dialog__title dc-title">Close INC-4471?</p><p class="kp-dialog__description">The vendor is told at once.</p><div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div></div>`,
    /** A menu under its button; its inlay starts under the button. */
    menu: () =>
        `<div class="dc-menu-wrap">${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}<div class="kp-popover dc-plate dc-ar dc-drop">${menuList(['Open incident', 'Assign to…', 'Rename'])}</div></div>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], pointed = -1, cls = '') =>
        `<div class="kp-popover dc-plate dc-pop2 ${cls}">${menuList(items, pointed)}</div>`,
    toast: () => `<div class="kp-toast dc-plate dc-ar dc-toast2" role="status"><span class="kp-toast__body">Export saved at 02:00.</span></div>`,
    /** A tooltip: its point is a lozenge on its inlay, under what it names. */
    tooltip: (cls = 'dc-ar') =>
        `<div class="dc-tip-wrap"><div class="kp-tooltip dc-plate dc-tip2 ${cls}" role="tooltip">${loz('dc-tip2__point')}<span>14:00 · 412 m³/h</span></div></div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h', cls = '') =>
        `<div class="kp-card dc-plate ${cls}"><p class="kp-card__title dc-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Flow now', value = '412', foot = `${note('6 %')} on yesterday`, cls = '', extra = '') =>
        `<div class="kp-kpi dc-plate dc-kpi2 ${cls}" ${extra}><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value">${value}</span>${
            foot ? `<span class="kp-kpi__trend">${foot}</span>` : ''
        }</div>`,
    alert: (html, cls = '') => `<div class="kp-alert dc-plate dc-alert2 ${cls}" role="status"><span class="kp-alert__body">${html}</span></div>`,
    /** A week of days as small plates, `--i` each day's rank from the middle. */
    week: (from = 12, cls = 'dc-ar') =>
        `<div class="dc-days dc-week" aria-hidden="true">${[...Array(7).keys()]
            .map((i) => `<span class="dc-day2 dc-plate ${cls}" style="--i: ${Math.abs(i - 3)}">${from + i}</span>`)
            .join('')}</div>`,
    line: (cls = '') => PART.spark(`dc-line ${cls}`),
    trendTile: (foot = '') => `<div class="kp-card dc-plate dc-trend2"><p class="kp-card__title dc-title">Flow, 24 h</p>${PART.spark()}${foot}</div>`,
};

/* ------------------------------------------- update 2: jewellery in gold */

// Kenny, update 2: "it should be fancy … It should exhume elegance". Gold is
// drawn as gold here: every hairline and jewel of the corners, the bar heads
// and the curtains is inline SVG painted from one sprite of gradients
// (`.dc-defs`, its stops coloured from --primary by options.css): a lighter
// highlight, the gold and a darker shade in the same hue, never a flat fill.

const r2 = (v) => Math.round(v * 100) / 100;

/** A lozenge jewel centred at (x, y), half-diagonal r: four facets lit from the top left. */
const gem = (x, y, r, cls = '') =>
    `<g class="dc-gem ${cls}"><path class="dc-f-ul" d="M${r2(x)} ${r2(y)}L${r2(x - r)} ${r2(y)}L${r2(x)} ${r2(y - r)}Z"/><path class="dc-f-ur" d="M${r2(x)} ${r2(y)}L${r2(x)} ${r2(y - r)}L${r2(x + r)} ${r2(y)}Z"/><path class="dc-f-lr" d="M${r2(x)} ${r2(y)}L${r2(x + r)} ${r2(y)}L${r2(x)} ${r2(y + r)}Z"/><path class="dc-f-ll" d="M${r2(x)} ${r2(y)}L${r2(x)} ${r2(y + r)}L${r2(x - r)} ${r2(y)}Z"/></g>`;

const line = (d, cls = 'dc-ln', w = 1) => `<path class="${cls}" d="${d}" stroke-width="${w}"/>`;
const bead = (x, y, r, cls = 'dc-bd') => `<circle class="${cls}" cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}"/>`;
const poly = (pts) => `M${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L')}`;

/** The sprite of gradients every ornament is painted from, once per page (outside the rows, so the dialog's stage reaches it too). */
const DEFS = `<svg class="dc-defs" aria-hidden="true" focusable="false" width="0" height="0"><defs>
    <linearGradient id="dc-leaf-L" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24"><stop offset="0" class="dc-st-hi"/><stop offset="0.3" class="dc-st-lt"/><stop offset="0.62" class="dc-st-au"/><stop offset="1" class="dc-st-lo"/></linearGradient>
    <linearGradient id="dc-leaf-S" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="12" y2="12"><stop offset="0" class="dc-st-hi"/><stop offset="0.3" class="dc-st-lt"/><stop offset="0.62" class="dc-st-au"/><stop offset="1" class="dc-st-lo"/></linearGradient>
    <linearGradient id="dc-leaf-H" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="18" y2="18"><stop offset="0" class="dc-st-hi"/><stop offset="0.35" class="dc-st-lt"/><stop offset="0.65" class="dc-st-au"/><stop offset="1" class="dc-st-lo"/></linearGradient>
    <linearGradient id="dc-leaf-V" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="dc-st-hi"/><stop offset="0.45" class="dc-st-au"/><stop offset="1" class="dc-st-lo"/></linearGradient>
    <radialGradient id="dc-bead" cx="0.36" cy="0.32" r="0.72"><stop offset="0" class="dc-st-hi"/><stop offset="0.45" class="dc-st-au"/><stop offset="1" class="dc-st-lo"/></radialGradient>
    <radialGradient id="dc-emerald" cx="0.38" cy="0.32" r="0.75"><stop offset="0" class="dc-st-em-hi"/><stop offset="0.5" class="dc-st-em"/><stop offset="1" class="dc-st-em-lo"/></radialGradient>
</defs></svg>`;

/**
 * The six corners of question 6, each the top-left corner of a part, in px
 * for a large part (a plate) or a small one (`small`: a button, a tag, a
 * tooltip). options.css turns the copy for the other three corners and draws
 * the straight lines between them, so the ornament is the same at every size.
 * @type {Record<string, (small: boolean) => { w: number, h: number, body: string }>}
 */
const CORNER = {
    /** A quarter sunburst: nine rays from the corner point, an arc through the inlay, a pivot and a bead. */
    fan: (small) => {
        const R = small ? 7 : 14;
        const r0 = small ? 1.5 : 2.8;
        let rays = '';
        for (let i = 1; i <= 9; i++) {
            const a = (i * 9 * Math.PI) / 180;
            const r1 = i % 2 ? R - 0.7 : R * 0.7;
            rays += `M${r2(r0 * Math.cos(a))} ${r2(r0 * Math.sin(a))}L${r2(r1 * Math.cos(a))} ${r2(r1 * Math.sin(a))}`;
        }
        const p = small ? 1.7 : 3.2;
        const b = (R + (small ? 1.9 : 3.4)) / Math.SQRT2;
        return {
            w: small ? 12 : 24,
            h: small ? 12 : 24,
            body:
                line(rays, 'dc-ln', small ? 0.55 : 0.75) +
                line(`M${R} 0.5A${R - 0.5} ${R - 0.5} 0 0 1 0.5 ${R}`, 'dc-ln', small ? 0.8 : 1) +
                `<path class="dc-bd" d="M0 0H${p}A${p} ${p} 0 0 1 0 ${p}Z"/>` +
                bead(b, b, small ? 0.8 : 1.45),
        };
    },
    /** Three setbacks drawn as a double hairline, a faceted lozenge in the corner they leave. */
    ziggurat: (small) => {
        const s = small ? 2 : 4;
        const d = small ? 2 : 3;
        const c = 3 * s + d + 1;
        const stair = (o) => [
            [o + 0.5, c],
            [o + 0.5, 3 * s + o + 0.5],
            [s + o + 0.5, 3 * s + o + 0.5],
            [s + o + 0.5, 2 * s + o + 0.5],
            [2 * s + o + 0.5, 2 * s + o + 0.5],
            [2 * s + o + 0.5, s + o + 0.5],
            [3 * s + o + 0.5, s + o + 0.5],
            [3 * s + o + 0.5, o + 0.5],
            [c, o + 0.5],
        ];
        return {
            w: c,
            h: c,
            body: line(poly(stair(0))) + line(poly(stair(d)), 'dc-ln dc-ln--soft') + gem(s * 0.9, s * 0.9, small ? 1.7 : 3.3),
        };
    },
    /** A cove: a hollow quarter circle, two hairlines following it, a bead in the hollow. */
    cove: (small) => {
        const r = small ? 5 : 10;
        const d = small ? 2 : 3;
        const c = small ? 8 : 14;
        const p1 = r + 0.5;
        const y1 = Math.sqrt(p1 * p1 - 0.25);
        const p2 = p1 + d;
        const y2 = Math.sqrt(p2 * p2 - (d + 0.5) * (d + 0.5));
        return {
            w: c,
            h: c,
            body:
                line(`M0.5 ${c}V${r2(y1)}A${p1} ${p1} 0 0 0 ${r2(y1)} 0.5H${c}`) +
                line(`M${d + 0.5} ${c}V${r2(y2)}A${p2} ${p2} 0 0 0 ${r2(y2)} ${d + 0.5}H${c}`, 'dc-ln dc-ln--soft') +
                bead(small ? 1.5 : 2.6, small ? 1.5 : 2.6, small ? 1 : 1.7),
        };
    },
    /** Three nested brackets like a moulding turning the corner; the inlay runs on from the largest. */
    chevrons: (small) => {
        const c = small ? 10 : 20;
        const at = small ? [3, 5, 7] : [6, 9, 12];
        const ends = small ? [10, 10, 10] : [20, 19, 18];
        return {
            w: c,
            h: c,
            body: at.map((o, i) => line(`M${o + 0.5} ${ends[i]}V${o + 0.5}H${ends[i]}`, i ? 'dc-ln dc-ln--soft' : 'dc-ln')).join(''),
        };
    },
    /** A medallion pinned on the corner's point, half over the page: a ring, eight rays, a jewel. */
    medallion: (small) => {
        const R = small ? 4.3 : 7.6;
        const n = small ? 3 : 6;
        const c = small ? 7 : 12;
        let rays = '';
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4 + Math.PI / 8;
            const [a1, a2] = small ? [1.6, 3.2] : [2.8, 5.1];
            rays += `M${r2(a1 * Math.cos(a))} ${r2(a1 * Math.sin(a))}L${r2(a2 * Math.cos(a))} ${r2(a2 * Math.sin(a))}`;
        }
        return {
            w: c,
            h: c,
            body:
                `<circle class="dc-back" cx="0" cy="0" r="${R + 1}"/>` +
                `<circle class="dc-ln" cx="0" cy="0" r="${R}" stroke-width="${small ? 0.8 : 1.1}"/>` +
                (small ? '' : `<circle class="dc-ln dc-ln--soft" cx="0" cy="0" r="${R - 1.9}" stroke-width="0.6"/>`) +
                line(rays, 'dc-ln', small ? 0.55 : 0.75) +
                bead(0, 0, small ? 1 : 1.7, 'dc-bd dc-bd--em') +
                bead(c - 0.6, n + 0.5, small ? 0.6 : 1.05) +
                bead(n + 0.5, c - 0.6, small ? 0.6 : 1.05),
        };
    },
    /** A fluted pilaster at the corner: three flutes under an abacus, capped with a lozenge. */
    pilaster: (small) => {
        const w = small ? 9 : 12;
        const h = small ? 12 : 24;
        const xs = small ? [2.5, 4.5, 6.5] : [3.5, 6.5, 9.5];
        const [top, foot] = small ? [5.5, 11.5] : [10.5, 22.5];
        const ab = small ? 4.5 : 9.5;
        return {
            w,
            h,
            body:
                line(xs.map((x) => `M${x} ${top}V${foot}`).join(''), 'dc-ln dc-ln--flute', small ? 0.7 : 0.9) +
                line(`M${small ? 1 : 1.5} ${ab}H${w}`) +
                line(`M${small ? 1.5 : 2} ${foot + (small ? 0 : 0)}H${small ? 7.5 : 11}`, 'dc-ln dc-ln--soft') +
                gem(xs[1], small ? 2.3 : 5.2, small ? 1.9 : 3.1),
        };
    },
};

/** The four corners of one part, the top-left drawn and turned by options.css for the others. */
const ornament = (key, small) => {
    const c = CORNER[key];
    if (!c) return '';
    const { w, h, body } = c(small);
    const one = (at) => `<svg class="dc-orn__c dc-orn__c--${at}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" focusable="false">${body}</svg>`;
    return `<span class="dc-orn dc-orn--${small ? 'S' : 'L'}" aria-hidden="true">${['tl', 'tr', 'bl', 'br'].map(one).join('')}</span>`;
};

/** The bar's head in the corners row, one per corner, centred on the share's end (a 20-unit box). */
const HEAD = {
    fan: () => {
        let rays = '';
        for (let i = 1; i <= 7; i++) {
            const a = Math.PI + (i * Math.PI) / 8;
            const r1 = i % 2 ? 8 : 6.2;
            rays += `M${r2(10 + 2.4 * Math.cos(a))} ${r2(10 + 2.4 * Math.sin(a))}L${r2(10 + r1 * Math.cos(a))} ${r2(10 + r1 * Math.sin(a))}`;
        }
        return line(rays, 'dc-ln', 0.8) + line('M1.4 10A8.6 8.6 0 0 1 18.6 10', 'dc-ln', 0.9) + bead(10, 10, 2);
    },
    ziggurat: () =>
        line(
            `${poly([
                [8, 1.5],
                [12, 1.5],
                [12, 4],
                [14.5, 4],
                [14.5, 5.5],
                [16, 5.5],
                [16, 8],
                [18.5, 8],
                [18.5, 12],
                [16, 12],
                [16, 14.5],
                [14.5, 14.5],
                [14.5, 16],
                [12, 16],
                [12, 18.5],
                [8, 18.5],
                [8, 16],
                [5.5, 16],
                [5.5, 14.5],
                [4, 14.5],
                [4, 12],
                [1.5, 12],
                [1.5, 8],
                [4, 8],
                [4, 5.5],
                [5.5, 5.5],
                [5.5, 4],
                [8, 4],
            ])}Z`,
            'dc-ln dc-ln--fillback',
        ) + gem(10, 10, 4.2),
    cove: () =>
        `<g transform="rotate(45 10 10)">${line('M7 3.5H13A3.5 3.5 0 0 0 16.5 7V13A3.5 3.5 0 0 0 13 16.5H7A3.5 3.5 0 0 0 3.5 13V7A3.5 3.5 0 0 0 7 3.5Z', 'dc-ln dc-ln--fillback')}${line(
            'M8.4 6.2H11.6A2.2 2.2 0 0 0 13.8 8.4V11.6A2.2 2.2 0 0 0 11.6 13.8H8.4A2.2 2.2 0 0 0 6.2 11.6V8.4A2.2 2.2 0 0 0 8.4 6.2Z',
            'dc-ln dc-ln--soft',
            0.7,
        )}</g>${bead(10, 10, 1.6)}`,
    chevrons: () =>
        `<path class="dc-back" d="M2 1.5L10.5 10L2 18.5Z"/>${line('M3 2L11 10L3 18', 'dc-ln', 1)}${line('M7 5L12 10L7 15', 'dc-ln dc-ln--soft', 0.9)}${line(
            'M11 8L13 10L11 12',
            'dc-ln',
            0.9,
        )}${gem(16, 10, 2.6)}`,
    medallion: () => {
        let rays = '';
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4 + Math.PI / 8;
            rays += `M${r2(10 + 2.4 * Math.cos(a))} ${r2(10 + 2.4 * Math.sin(a))}L${r2(10 + 4.6 * Math.cos(a))} ${r2(10 + 4.6 * Math.sin(a))}`;
        }
        return `<circle class="dc-back" cx="10" cy="10" r="8.4"/><circle class="dc-ln" cx="10" cy="10" r="7.6" stroke-width="1.1"/><circle class="dc-ln dc-ln--soft" cx="10" cy="10" r="5.8" stroke-width="0.6"/>${line(
            rays,
            'dc-ln',
            0.8,
        )}${bead(10, 10, 1.6, 'dc-bd dc-bd--em')}`;
    },
    pilaster: () =>
        `<path class="dc-back" d="M5.5 6.5H14.5V17H5.5Z"/>${line('M7.5 7.8V16M10 7.8V16M12.5 7.8V16', 'dc-ln dc-ln--flute', 0.9)}${line('M5.5 7H14.5')}${line(
            'M6 16.6H14',
        )}${gem(10, 3.6, 2.6)}`,
};

const headSvg = (key) =>
    HEAD[key] ? `<svg class="dc-head" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">${HEAD[key]()}</svg>` : '';

/* ------------------------------------------------------------ the scenes */

/** Question 1: every part arrives the same way for 480 ms; only the curve differs. */
const MOVING = () =>
    cell(
        'A fan of hairlines on this curve, beside one at an even pace',
        `<div class="dc-fans" aria-hidden="true"><span class="dc-fans__ground">${fan('dc-ar dc-fan--probe')}</span><span class="dc-fans__ground">${fan(
            'dc-ar dc-fan--probe dc-fan--even',
        )}</span><span class="dc-fans__name">this curve</span><span class="dc-fans__name">an even pace</span></div>`,
        'dc-part--wide',
    ) +
    cell('A dialog arrives', LOBBY.dialog()) +
    cell('A menu arrives under its button', LOBBY.menu()) +
    cell('A tile arrives', LOBBY.tile('Pump house 1', '4.2 bar · 412 m³/h', 'dc-ar'));

const DIRECTION = () =>
    cell('A week of days arrives', LOBBY.week(), 'dc-part--wide') +
    cell('A tile arrives', LOBBY.tile('Pump house 1', '4.2 bar · 412 m³/h', 'dc-ar')) +
    cell('The trend’s line is drawn', `<div class="dc-linebed">${LOBBY.line('dc-ar')}</div>`);

const OPENING = () =>
    cell('A menu opens under its button', LOBBY.menu()) +
    cell('A dialog opens on the lacquer', LOBBY.dialog()) +
    cell('A toast appears', LOBBY.toast()) +
    cell('A tooltip appears', LOBBY.tooltip());

const COLOUR = () =>
    cell(
        'A card under its double rule',
        `<div class="kp-card dc-plate"><p class="kp-card__title dc-title dc-ruled">Reservoir North</p><p class="kp-card__body">Level 71 % · ${loz('dc-loz--done')} filled at 06:00</p></div>`,
    ) +
    cell(
        'Buttons: the one that acts and the others',
        `<div class="dc-row">${button('Export')}${button('Add a pump house', 'kp-button--primary')}</div>`,
    ) +
    cell(
        'A switch on, a meter with its mark',
        `<div class="dc-colours">${'<label class="kp-switch dc-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked /><span>Alerts on</span></label>'}${meter(0.62, 0.8)}</div>`,
    ) +
    cell(
        'A month: two days done, the picked day',
        `<div class="dc-days dc-month" aria-hidden="true">${[12, 13, 14, 15, 16]
            .map((d) => `<span class="dc-day2 dc-plate${d < 14 ? ' dc-done' : ''}${d === 14 ? ' dc-picked' : ''}">${d}</span>`)
            .join('')}</div>`,
    ) +
    cell('A key figure', LOBBY.kpi('Flow now', '412')) +
    cell('A failed export', LOBBY.alert('<b class="dc-fail">Export failed:</b> the pump house did not answer.', 'dc-alert2--fail'));

const CORNERS = () =>
    cell('Card', LOBBY.tile('Reservoir North', 'Level 71 %')) +
    cell('Menu panel', LOBBY.menuStatic(['Open incident', 'Assign to…'])) +
    cell('Key figure with its change', LOBBY.kpi('Flow now', '412')) +
    cell(
        'Button, tag and chip',
        `<div class="dc-row">${button('Export')}<span class="kp-badge dc-tag2">12 new</span><span class="kp-tag dc-tag2">Pumps</span></div>`,
    ) +
    cell('Tooltip', LOBBY.tooltip('dc-tip2--still')) +
    cell('A progress bar’s head', bar(0.62, 'dc-bar2 kp-progressbar--lg', 'Export'));

const WARNING = () =>
    cell('A warning key figure', LOBBY.kpi('Pressure', '1.1 bar', `${note('0.4 bar', 'down', 'bad')} on yesterday`, 'dc-warn')) +
    cell(
        'A failed trend tile',
        LOBBY.trendTile(`<p class="kp-card__body"><span class="dc-failword">Failed</span> · last reading 07:12</p>`).replace(
            'dc-trend2',
            'dc-trend2 dc-warn',
        ),
    ) +
    cell('A destructive menu entry', LOBBY.menuStatic(['Rename', 'Delete'])) +
    cell('A warning alert', LOBBY.alert('<b class="dc-failword">Low pressure:</b> below 1.2 bar since 07:12.', 'dc-warn'));

/** What each loading picture of update 2 adds inside a waiting part (`.dc-wait`, the size of the part); the rest is drawn by options.css on the part and on `.dc-wait` itself. */
const WAIT = {
    crest: () => fan('dc-fan--wait'),
    pearls: () => `<span class="dc-pearls">${[...Array(7).keys()].map((i) => `<i style="--i: ${i}"></i>`).join('')}</span>`,
    jewel: () => '<span class="dc-gem"><i></i></span>',
    doors: () => '<span class="dc-door"></span><span class="dc-door dc-door--r"></span>',
};
/** A surface that waits: a plate (lacquer, the wallpaper, its inlay); the option draws what moves on it. */
const waitLayer = (key) => `<span class="dc-wait" aria-hidden="true">${WAIT[key] ? WAIT[key]() : ''}</span>`;
const waits = (key, html, cls = '') => `<div class="dc-waits dc-plate ${cls}" aria-busy="true">${html}${waitLayer(key)}</div>`;
const LOADERS = (key) =>
    cell('A tile', waits(key, '<p class="kp-card__title dc-title">Pump house 3</p><p class="kp-card__body">Reading…</p>', 'kp-card')) +
    cell(
        'A panel',
        waits(
            key,
            '<div class="dc-panel2"><span>Station</span><span>Flow</span><span class="dc-faint">North 4</span><span class="dc-faint">412</span></div>',
        ),
    ) +
    cell(
        'A menu entry',
        `<div class="kp-popover dc-plate dc-pop2"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dc-waits dc-plate" aria-busy="true"><span class="dc-entry-word">Loading stations…</span>${waitLayer(
            key,
        )}</button></li></ul></div>`,
    ) +
    cell(
        'A month of days',
        waits(key, `<div class="dc-days dc-month">${[1, 2, 3, 4, 5].map((d) => `<span class="dc-day2">${d}</span>`).join('')}</div>`),
    ) +
    cell('A chart’s plot', waits(key, '<div class="dc-plot2"></div>')) +
    cell(
        'Skeleton lines',
        `<div class="dc-skel dc-waits dc-plate" aria-busy="true"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span>${waitLayer(
            key,
        )}</div>`,
    );

/** The stations an option of question 11 sets on its track: lozenges at every quarter (ruled) or three emeralds (stations). */
const STATIONS = {
    ruled: [0, 0.25, 0.5, 0.75, 1],
    stations: [0.25, 0.5, 0.75],
};
const BARS = (key) => {
    const st = (STATIONS[key] || []).map((x) => `<i class="dc-st" style="--x: ${x}"></i>`).join('');
    const b = (share, size, label) => bar(share, `dc-bar2 ${size}`, label, st);
    return (
        cell(
            'A share of 62 %, three sizes',
            `<div class="dc-bars">${b(0.62, '', 'Export')}${b(0.62, 'kp-progressbar--md', 'Export')}${b(0.62, 'kp-progressbar--lg', 'Export')}</div>`,
            'dc-part--wide',
        ) +
        cell(
            'Busy, three sizes',
            `<div class="dc-bars">${b(null, '', 'Export')}${b(null, 'kp-progressbar--md', 'Export')}${b(null, 'kp-progressbar--lg', 'Export')}</div>`,
            'dc-part--wide',
        ) +
        cell(
            'Inside a busy button',
            `<button type="button" class="kp-button dc-busy-button" aria-busy="true">Saving…${b(null, '', 'Saving')}</button>`,
        ) +
        cell('Beside a share of 62 %', `<div class="dc-bars dc-bars--pair">${b(0.62, '', 'Share')}${b(null, '', 'Busy')}</div>`)
    );
};

/** Question 13's curtains, over a stage round the part (the stage is what arrives; the part stands behind the curtain). */
const ROSETTE = `<circle class="dc-bd" cx="0" cy="-3" r="1.9"/><circle class="dc-bd" cx="2.6" cy="-1.5" r="1.9"/><circle class="dc-bd" cx="2.6" cy="1.5" r="1.9"/><circle class="dc-bd" cx="0" cy="3" r="1.9"/><circle class="dc-bd" cx="-2.6" cy="1.5" r="1.9"/><circle class="dc-bd" cx="-2.6" cy="-1.5" r="1.9"/>${bead(
    0,
    0,
    1.7,
    'dc-bd dc-bd--hi',
)}${line('M0 5V9.6', 'dc-ln', 0.8)}${gem(0, 11.6, 2)}${line('M-1.3 13.4V17.6M0 13.6V18.4M1.3 13.4V17.6', 'dc-ln dc-ln--soft', 0.55)}`;
const rosette = (side) => `<svg class="dc-ros dc-ros--${side}" viewBox="-6 -6 12 25" width="12" height="25" focusable="false">${ROSETTE}</svg>`;
/** A tassel: a cord, a faceted lozenge, a skirt of three threads (a 8 x 18 box, its cord at the top centre). */
const TASSEL = `${line('M0 0V5.4', 'dc-ln', 0.9)}${gem(0, 7.6, 2.3)}${line('M-1.7 9.6V15.4M0 9.9V17M1.7 9.6V15.4', 'dc-ln dc-ln--soft', 0.6)}`;
const tassel = (cls = '') => `<svg class="dc-tassel ${cls}" viewBox="-4 0 8 18" width="8" height="18" focusable="false">${TASSEL}</svg>`;
let patterns = 0;
/** The valance's row of tassels, one under every point between two scallops (an SVG pattern, 18 px a scallop, centred like the scallops). */
const tassels = () => {
    const id = `dc-tassels-${(patterns += 1)}`;
    return `<svg class="dc-valance__tassels" width="100%" height="14" focusable="false"><defs><pattern id="${id}" patternUnits="userSpaceOnUse" x="50%" y="0" width="18" height="14"><g transform="translate(9 0) scale(0.72)">${TASSEL}</g></pattern></defs><rect width="100%" height="14" fill="url(#${id})"/></svg>`;
};
const drape = (side) => `<span class="dc-drape dc-drape--${side}"><i class="dc-drape__braid"></i>${tassel('dc-tassel--hem')}</span>`;
const CURTAIN = {
    velvet: () =>
        `<span class="dc-cur dc-cur--velvet" aria-hidden="true">${drape('l')}${drape('r')}<span class="dc-tie dc-tie--l"></span><span class="dc-tie dc-tie--r"></span><span class="dc-valance"></span>${tassels()}</span>`,
    festoon: () =>
        `<span class="dc-cur dc-cur--festoon" aria-hidden="true">${[0, 1, 2, 3, 4]
            .map(
                (i) =>
                    `<span class="dc-swag" style="--i: ${Math.abs(i - 2)}; --x: ${i * 0.2}"><span class="dc-swag__body"></span><svg class="dc-swag__trim" viewBox="0 0 100 10" preserveAspectRatio="none" focusable="false"><path class="dc-ln" d="M0 0.5A50 9.5 0 0 0 100 0.5" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>${
                        i <= 2 ? rosette('l') : ''
                    }${i >= 2 ? rosette('r') : ''}</span>`,
            )
            .join('')}<span class="dc-cur__rail"></span></span>`,
};
const JEWELS = '<i class="dc-jw dc-jw--tl"></i><i class="dc-jw dc-jw--tr"></i><i class="dc-jw dc-jw--bl"></i><i class="dc-jw dc-jw--br"></i>';
const LEAVE = (key) => {
    const stage = key in CURTAIN;
    const ar = stage ? '' : 'dc-ar';
    const wrap = (html) => (stage ? `<div class="dc-stage dc-ar">${html}${CURTAIN[/** @type {keyof typeof CURTAIN} */ (key)]()}</div>` : html);
    const jw = (html) => (key === 'jewels' ? html.replace(/<\/div>$/, `${JEWELS}</div>`) : html);
    return (
        cell('An alert', wrap(jw(LOBBY.alert('Pump house 4 is back online.', ar)))) +
        cell('A card', wrap(jw(LOBBY.tile('Reservoir North', 'Level 71 %', ar)))) +
        cell('A key figure', wrap(jw(LOBBY.kpi('Flow now', '412', '', ar))))
    );
};

const COMPOSITES = () =>
    cell(
        'Alone: deco’s own button, for reference',
        `<div class="dc-row">${button('Export readings')}${button('Add', 'kp-button--primary')}</div>`,
        'dc-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header dc-header dc-plate"><div class="kp-page-header__inner"><div><p class="kp-page-header__title dc-title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm dc-in-header')}${button('Add', 'kp-button--sm kp-button--primary dc-in-header')}</div></div></header>`,
        'dc-part--wide',
    ) +
    cell('Menu: its entries', LOBBY.menuStatic(['Open incident', 'Assign to…'], -1, 'dc-in-menu')) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card dc-plate dc-tile dc-in-tile"><p class="kp-card__title dc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm dc-tile-link" href="#dc-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card dc-plate dc-drawer"><p class="kp-card__title dc-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="dc-row">${button('Skip', 'kp-button--sm kp-button--ghost')}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi dc-plate dc-kpi2 dc-in-kpi" href="#dc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

/** A label in its own span, so a hover or a press can set jewels at its two ends. */
const lbl = (t) => `<span class="dc-lbl">${t}</span>`;

const HOVER = () =>
    cell(
        'Button, pointed at',
        `<div class="dc-row">${button(lbl('Export readings'), 'dc-pointed')}${button(lbl('Add'), 'kp-button--primary')}</div>`,
    ) +
    cell('Menu entries, the first pointed at', LOBBY.menuStatic(['Open incident', 'Assign to…', 'Rename'].map(lbl), 0)) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card dc-plate dc-tile"><p class="kp-card__title dc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm dc-tile-link dc-pointed" href="#dc-intro">${lbl('Open')}</a></div>`,
    ) +
    cell(
        'A link in a line, pointed at',
        `<p class="dc-prose">Read the <a class="dc-pointed" href="#dc-intro">pressure report</a> before the night valve closes.</p>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis dc-kpi-row"><a class="kp-kpi dc-plate dc-kpi2 dc-in-kpi dc-pointed" href="#dc-intro"><span class="kp-kpi__label dc-lbl">Flow now</span><span class="kp-kpi__value">412</span></a><a class="kp-kpi dc-plate dc-kpi2 dc-in-kpi" href="#dc-intro"><span class="kp-kpi__label dc-lbl">Pressure</span><span class="kp-kpi__value">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="dc-days dc-month">${[12, 13, 14, 15]
            .map((d) => `<span class="dc-day2 dc-plate${d === 13 ? ' dc-pointed' : ''}" tabindex="0">${lbl(String(d))}</span>`)
            .join('')}</div>`,
    );

/** One specimen at rest beside the same one pressed. */
const duo = (rest, pressed) => `<div class="dc-duo"><span class="dc-duo__one">${rest}</span><span class="dc-duo__one">${pressed}</span></div>`;
const entry = (state) =>
    `<div class="kp-popover dc-plate dc-pop2"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item ${state}">${lbl('Assign to…')}</button></li></ul></div>`;
const filter = (state) =>
    `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle dc-plate dc-kpi2 ${state}" aria-pressed="false"><span class="kp-kpi__label dc-lbl">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`;
const PRESS = () =>
    cell('Button, at rest and pressed', duo(button(lbl('Export readings'), 'dc-rest'), button(lbl('Export readings'), 'dc-press'))) +
    cell('Primary button', duo(button(lbl('Add'), 'kp-button--primary dc-rest'), button(lbl('Add'), 'kp-button--primary dc-press'))) +
    cell('Menu entry', duo(entry('dc-rest'), entry('dc-press'))) +
    cell(
        'Calendar day',
        duo(
            `<span class="dc-day2 dc-plate dc-rest" tabindex="0">${lbl('14')}</span>`,
            `<span class="dc-day2 dc-plate dc-press" tabindex="0">${lbl('14')}</span>`,
        ),
    ) +
    cell('Key figure as a filter', duo(filter('dc-rest'), filter('dc-press')));

const MOTIFS = () =>
    cell(
        'A card and its title',
        `<div class="kp-card dc-plate dc-motif-card">${fan('dc-fan--crest')}<p class="kp-card__title dc-title dc-ruled">Reservoir North</p><p class="kp-card__body">Level 71 %</p></div>`,
    ) +
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events',
        `<div class="dc-plate dc-events2"><div class="dc-events" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none"><polyline points="0,36 20,30 40,33 60,22 80,26 100,16 120,20 140,12 160,14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg><span class="dc-events__mark" style="--x: 37.5%"></span><span class="dc-events__mark" style="--x: 75%"></span></div></div>`,
    ) +
    cell(
        'Button and a list',
        `<div class="dc-row">${button('Add a sensor', 'dc-motif-button')}</div><ul class="dc-motif-list"><li>North 4</li><li>South 2</li></ul>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty dc-plate dc-motif-empty">${fan('dc-fan--crest')}<p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="dc-cap">Pumps</p><hr data-kp-divider class="dc-divider" /><p class="dc-cap">Reservoirs</p>`);

/* The six questions Kenny picked keep their round-one scenes. */

const DURATION = () =>
    cell('Contact: a press', `<div class="dc-row">${button('Export readings', 'dc-tap')}</div><p class="dc-readout" data-dc-readout="contact"></p>`) +
    cell(
        'A fan of twelve rays',
        `<div class="dc-fans dc-fans--one" aria-hidden="true"><span class="dc-fans__ground">${fx(crest('dc-crest--probe'), 'dc-fx--probe')}</span></div><p class="dc-readout" data-dc-readout="fan"></p>`,
    ) +
    cell('A plate behind its fan', PART.dialog() + '<p class="dc-readout" data-dc-readout="plate"></p>') +
    cell('A group, from the centre out', PART.days(5, 12) + '<p class="dc-readout" data-dc-readout="group"></p>') +
    cell('A loop: the spinner’s fan', `<div class="dc-row">${spin(2.5)}</div><p class="dc-readout" data-dc-readout="loop"></p>`);

const SURFACE = () =>
    cell(
        'A dialog’s title and a header',
        `<div class="dc-surface-head">${crest('dc-crest--head')}<p class="dc-title dc-surface-head__title">Pump houses</p><p class="dc-cap">Fifteen on the northern network</p></div>`,
    ) +
    cell('A key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell('A trend tile', `<div class="kp-card dc-tile dc-trend"><p class="kp-card__title dc-title">Flow, 24 h</p>${PART.spark()}</div>`) +
    cell(
        'A menu with its headings',
        `<div class="kp-popover dc-pop dc-pop--static"><ul class="kp-menu" role="menu"><li role="presentation" class="dc-menu-head">Stations</li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">North 4</button></li><li role="presentation" class="dc-menu-head">Reservoirs</li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Reservoir North</button></li></ul></div>`,
    ) +
    cell('The state word', `<div class="dc-state-plate">${PART.chip('Running')}</div>`);

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', `<span class="dc-carrier dc-carrier--line">${PART.spark()}</span>`) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card dc-tile dc-live-tile"><p class="kp-card__title dc-title">Pump house 2</p><p class="kp-card__body"><span class="dc-carrier" data-dc-num>4.2 bar</span></p></div>`,
    );

const SPINNERS = () =>
    cell('Three sizes', `<div class="dc-row dc-spins">${[1, 1.5, 2.5].map((s) => spin(s)).join('')}</div>`, 'dc-part--wide') +
    cell('A busy button', `<button type="button" class="kp-button dc-busy-button" aria-busy="true">${spin(1)}Saving…</button>`) +
    cell(
        'The busy panel',
        `<div class="kp-card dc-busy-panel">${spin(1.75, 'Reading the pump houses')}<p class="kp-card__body">Reading the pump houses…</p></div>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="dc-row">${button('Export readings', 'dc-focused')}</div>`) +
    cell('Primary button', `<div class="dc-row">${button('Add a pump house', 'kp-button--primary dc-focused')}</div>`) +
    cell('Header action', `<div class="dc-header-mini">${button('Export', 'kp-button--sm dc-in-header dc-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi dc-kpi dc-in-kpi dc-focused" href="#dc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover dc-pop dc-pop--static dc-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dc-focused">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="dc-days"><span class="dc-day">13</span><span class="dc-day dc-focused">14</span><span class="dc-day">15</span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card dc-tile dc-in-tile"><p class="kp-card__title dc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm dc-tile-link dc-focused" href="#dc-intro">Open</a></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card dc-type"><p class="dc-type__label">Northern network</p><p class="dc-type__head">Pump house 4</p>
        <p class="dc-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="dc-type__figure">4.2 <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
        <table class="dc-type__table"><tbody><tr><th scope="row">Flow</th><td>412 m³/h</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp">2026-10-07 07:12</span></td></tr></tbody></table>
        <p class="dc-type__ticks" aria-hidden="true"><span>06:00</span><span>09:00</span><span>12:00</span></p>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge dc-tag">12 new</span></p></div>`,
        'dc-part--wide',
    );

/** What a scene of update 2 adds once it stands in the page: question 6's ornaments on every part and its bar head. */
const DECORATE = {
    corners: (/** @type {HTMLElement} */ scene, /** @type {string} */ key) => {
        for (const el of scene.querySelectorAll('.dc-plate, .kp-button, .dc-tag2'))
            el.insertAdjacentHTML('beforeend', ornament(key, !el.matches('.kp-card, .kp-popover, .kp-kpi')));
        for (const head of scene.querySelectorAll('.kp-progressbar__head')) head.insertAdjacentHTML('beforeend', headSvg(key));
    },
};

const SCENES = {
    moving: MOVING,
    direction: DIRECTION,
    opening: OPENING,
    durations: DURATION,
    colour: COLOUR,
    corners: CORNERS,
    surface: SURFACE,
    warning: WARNING,
    live: LIVE,
    loading: LOADERS,
    bar: BARS,
    spinner: SPINNERS,
    leave: LEAVE,
    composites: COMPOSITES,
    hover: HOVER,
    focus: FOCUS,
    press: PRESS,
    type: TYPE,
    motifs: MOTIFS,
};

/** The questions of aspects.js, each given its scene function. */
const ROWS = ASPECTS.map((a) => ({ ...a, build: /** @type {(key: string) => string} */ (SCENES[/** @type {keyof typeof SCENES} */ (a.scene)]) }));

/** The thirteen questions update 1 redrew (their scenes carry `.dc-scene--r2`); the other six are Kenny's picks, kept as drawn. */
const REDRAWN = new Set([
    'curve',
    'direction',
    'opening',
    'colour',
    'corners',
    'warning',
    'loading',
    'bar',
    'leave',
    'composites',
    'hover',
    'press',
    'motifs',
]);

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}"]`));
// Each hint repeats the question and the reason, then what this option shows
// and the recommendation line: the dialog shows only the hint of the option
// on screen, so each hint has to stand on its own.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ROWS.map((a) => ({
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
lookLine.textContent = `${ROWS.length} questions, one rule of ${THEME} each; the first option of every question is the recommendation. Pick the one that is ${THEME} to you, or “None of these” with a note.`;
look.append(lookLine);

for (const p of document.querySelectorAll('[data-dc-story]'))
    p.textContent = STORY[/** @type {keyof typeof STORY} */ (p.getAttribute('data-dc-story'))];
document.title = `kp-themes — ${TITLE.toLowerCase()}`;

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-dc-aspects]'));
// The sprite of gold gradients (update 2), once, beside the section, so the dialog's stage reaches it as well.
if (!document.querySelector('.dc-defs')) document.body.insertAdjacentHTML('afterbegin', DEFS);
const toc = document.querySelector('[data-dc-toc]');
ROWS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'dc-aspect';
    box.id = `dc-${a.id}`;
    box.setAttribute('data-dc-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-dc-${a.id}`);
    box.innerHTML = `<div class="dc-aspect__head">
        <h3 id="h-dc-${a.id}"><span class="dc-aspect__no">${n + 1}</span> ${a.label} <span class="dc-aspect__rule">${a.rule}</span></h3>
        <p class="dc-aspect__q"></p><p class="dc-aspect__why"></p></div><div class="dc-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.dc-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.dc-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.dc-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'dc-col';
        col.setAttribute('data-dc-option', String(at + 1));
        col.innerHTML = `<p class="dc-label"><span class="dc-label__no">${at + 1}</span> <span class="dc-label__name"></span>${
            at === 0 ? ' <span class="dc-label__rec">Recommended</span>' : ''
        }</p><p class="dc-see"></p><p class="dc-verdict"></p>
        <div class="dc-scene${REDRAWN.has(a.id) ? ' dc-scene--r2' : ''}" data-dc-kind="${a.kind}" data-dc-${a.id}="${o.key}" data-dc-phase="in" data-dc-show="rest">${a.build(o.key)}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.dc-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.dc-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.dc-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('dc-verdict--rec', at === 0);
        const scene = /** @type {HTMLElement} */ (col.querySelector('.dc-scene'));
        DECORATE[/** @type {keyof typeof DECORATE} */ (a.id)]?.(scene, o.key);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#dc-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// Update 2: the hover and press rows answer the reviewer's own pointer (Kenny:
// "make the elements actually pressable and hoverable so i can test
// myself"). A press holds while the pointer or the key is down and lasts at
// least as long as its motion, so a quick tap shows it whole once (`dc-on`,
// beside the real :active); a part the pointer has left plays its hover
// backwards (`data-dc-was`), never on the page's first paint. A touch
// listener lets :active reach a finger on iOS.
const HOLD = 440;
for (const scene of section.querySelectorAll('.dc-scene:is([data-dc-hover], [data-dc-press])'))
    for (const el of scene.querySelectorAll('.kp-button, .kp-menu__item, .dc-day2, .kp-kpi--toggle, a')) {
        let t0 = 0;
        let held = 0;
        const down = () => {
            clearTimeout(held);
            t0 = performance.now();
            el.classList.add('dc-on');
        };
        const up = () => {
            if (!el.classList.contains('dc-on')) return;
            clearTimeout(held);
            held = window.setTimeout(() => el.classList.remove('dc-on'), Math.max(0, HOLD * slow - (performance.now() - t0)));
        };
        el.addEventListener('pointerdown', down);
        for (const type of ['pointerup', 'pointercancel', 'pointerleave', 'blur']) el.addEventListener(type, up);
        el.addEventListener('pointerleave', () => el.setAttribute('data-dc-was', ''));
        el.addEventListener('keydown', (event) => {
            const key = /** @type {KeyboardEvent} */ (event).key;
            if ((key === ' ' || key === 'Enter') && !(/** @type {KeyboardEvent} */ (event).repeat)) down();
        });
        el.addEventListener('keyup', (event) => {
            const key = /** @type {KeyboardEvent} */ (event).key;
            if (key === ' ' || key === 'Enter') up();
        });
        el.addEventListener('touchstart', () => {}, { passive: true });
    }

// The durations row says its own numbers under each part (the same numbers
// options.css plays): contact, a fan, a plate behind it, a group, a loop.
const BANDS = {
    fan: ['160 ms', '480 ms (40 ms a ray)', '480 + 160 ms', '80 ms apart', '2400 ms a loop'],
    brisk: ['120 ms', '320 ms (27 ms a ray)', '320 + 100 ms', '50 ms apart', '1600 ms a loop'],
    grand: ['200 ms', '720 ms (60 ms a ray)', '720 + 240 ms', '120 ms apart', '3600 ms a loop'],
};
for (const scene of section.querySelectorAll('[data-dc-durations]')) {
    const band = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-dc-durations'))];
    ['contact', 'fan', 'plate', 'group', 'loop'].forEach((id, i) => {
        const p = scene.querySelector(`[data-dc-readout="${id}"]`);
        if (p) p.textContent = band[i];
    });
}

/* ---------------------------------------------------------- the one clock */

// Every scene that opens, arrives, updates or leaves is replayed by one clock,
// so the options of a row always start together and can be compared. One
// cycle: `gap` (what arrives is away), `in` (it opens, a value updates),
// `hold` (it stands), `out` (it leaves, its opening played backwards: a fan
// folds ray by ray, a plate folds into its pleats). `in` outlasts the slowest
// opening (the grand fan: 720 + 240 ms, a group 3 x 120 ms behind), and `out`
// the slowest leave, so nothing is cut off mid-motion. The CSS keys every
// motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-dc-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', 1500],
    ['hold', 1400],
    ['out', 1500],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.dc-scene[data-dc-kind="cycle"]')) scene.setAttribute('data-dc-phase', phase);
    // A live update happens on the way in and again on the way out (the flash of the fan is the same both ways, so its close is its open reversed).
    if (phase === 'in' || phase === 'out') {
        tick += 1;
        for (const num of section.querySelectorAll('.dc-scene[data-dc-live] [data-dc-num]')) {
            const text = num.textContent || '';
            if (/bar/.test(text)) num.textContent = tick % 2 ? '4.4 bar' : '4.2 bar';
            else if (/^\d+$/.test(text.trim()) && Number(text) > 99) num.textContent = values[tick % values.length];
            else if (/^\d+$/.test(text.trim())) num.textContent = String(30 + ((tick * 7) % 20));
        }
        for (const word of section.querySelectorAll('.dc-scene[data-dc-live] [data-dc-word]')) word.textContent = tick % 2 ? 'Draining' : 'Running';
    }
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
radio('data-dc-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--dc-slow', String(slow));
    run(0);
});
// A state is forced on every control of the scenes (it sits on the scene, so it moves with it into the review dialog's stage).
radio('data-dc-state', (value) => {
    section.setAttribute('data-dc-show', value);
    for (const scene of section.querySelectorAll('.dc-scene')) scene.setAttribute('data-dc-show', value);
});
document.querySelector('[data-dc-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.dc-scene a, .dc-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided deco components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=deco`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-dc-gallery]'));
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

void LABEL;
