// research/kpadopt-controls: writes demo.html from one description.
// Edit this file and demo.css / demo.js, not demo.html.
//
//   node research/kpadopt-controls/build.mjs
import { writeFileSync } from 'node:fs';

const THEMES = [
    ['formal', 'Formal'],
    ['light', 'Light'],
    ['dark', 'Dark'],
    ['cyberpunk', 'Cyberpunk'],
    ['synthwave', 'Synthwave'],
    ['pastel', 'Pastel'],
    ['forest', 'Forest'],
    ['blueprint', 'Blueprint'],
    ['solstice', 'Solstice'],
    ['brutalism', 'Brutalism'],
    ['deco', 'Art Deco'],
    ['grotesk', 'Grotesk'],
    ['nostromo', 'Nostromo'],
    ['titanium', 'Titanium'],
];

// ------------------------------------------------------------------ look-at
const SEG = {
    formal: 'The chosen segment is a card on a ledger track with a navy rule under its word (the quill underline); chips are square-cornered and fill navy. The label keeps one weight, so nothing shifts when you press.',
    light: 'A white pill floats on a pale track with a soft lift and glides to the next value on the theme’s easing. Chips are round pills that fill indigo.',
    dark: 'A machined slot: the chosen segment is a lit slot with a bright top edge, small capitals, square ends. The glide is quick and square.',
    cyberpunk:
        'Neon trace: the chosen word is lit inside a thin yellow frame with a glow; after a press the word splits into cyan and red for three steps. It must not play on load.',
    synthwave:
        'A VCR display: spaced capitals, the plate a pink-to-cyan gradient with a glow. Check the dark word reads on both ends of the gradient.',
    pastel: 'A sticker on washi tape (dashed track): the chosen plate is a raspberry sticker with a darker peel edge beneath, and it springs a little past the next value before it settles. Chips peel the same way.',
    terminal: 'Reverse video: the chosen segment is a solid green block with black type and it jumps in one step, no glide. Monospace throughout.',
    forest: 'The chosen segment is a leaf: two rounded corners, two nearly square, with a darker edge under it. Chips take the same leaf when they are on.',
    blueprint: 'Drafting hatch: a cyan-hatched box with a thin cyan frame on an open track, mono capitals; the plate moves in drafting steps.',
    solstice:
        'Embers: the plate is an orange-to-red gradient with a warm halo; chips glow when on. The glow must not bleed over the neighbouring segment.',
    brutalism:
        'A slab: thick black frame with a hard drop, bold capitals; the chosen segment is a yellow block with a thick black inset frame, and it slams across in a blink.',
    deco: 'A gilt frame: a gold hairline plate with a double inlay rule inside it, spaced capitals. The inlay must stay inside the plate while it moves.',
    phantom:
        'Cut paper: a red plate with the top-start and bottom-end corners snipped, condensed capitals. Chips are flat red with a deep second plate behind. Tab to a chosen chip: the focus ring must stay whole.',
    grotesk:
        'A transit board: no box; the segments hang from one black rule and the chosen one carries a thick red bar under its word, which runs to the next value. Chips are plain frames that invert when on.',
    nostromo:
        'A CRT panel: a tan track, the chosen segment a dark block with faint scanlines in monospace capitals; the movement is stepped like a refresh.',
    titanium:
        'An anodised badge: the chosen plate is a chamfered, knurled block in the primary colour and moves in one linear glide (metal does not ease). Check the chamfer clips cleanly at both ends.',
};
const LABEL = {
    formal: 'small capitals with air between the letters',
    light: 'lightly spaced',
    dark: 'spaced capitals',
    cyberpunk: 'very widely spaced',
    synthwave: 'extremely widely spaced',
    pastel: 'lightly spaced',
    terminal: 'lower-case monospace',
    forest: 'lightly spaced',
    blueprint: 'monospace, widely spaced',
    solstice: 'lightly spaced',
    brutalism: 'in the heavy display face',
    deco: 'in gilt-style spaced capitals',
    phantom: 'in condensed display capitals',
    grotesk: 'bold, tight',
    nostromo: 'monospace, widely spaced',
    titanium: 'monospace, spaced',
};
const TB = Object.fromEntries(
    Object.entries(LABEL).map(([theme, label]) => [
        theme,
        `Search box (the theme’s own field), then the filter group labels (${label}), the chips, and the count at the right edge. Type a word, turn a status on: the “Showing only” row appears with removable tags, the same tags as the data table’s. The three zones must keep their places while you type and toggle, and the list must not jump when the row appears (the second toolbar reserves it).`,
    ]),
);
const KB = {
    formal: 'Engraved plate caps in the body face, a thin foot.',
    light: 'Soft rounded caps on a pale ground.',
    dark: 'Machined caps with a thick foot.',
    cyberpunk: 'Cyan outlined capitals, flat.',
    synthwave: 'Cyan outlined caps with a faint glow.',
    pastel: 'Rounded sticker caps with a 3 px foot.',
    terminal: 'No box at all: each key is written [ / ], as a man page writes it.',
    forest: 'Bark-plank caps with a 3 px foot.',
    blueprint: 'Dashed outline caps in monospace.',
    solstice: 'Ember-grey caps with a 2 px foot.',
    brutalism: 'Heavy black caps with a hard 2 px shadow.',
    deco: 'Gold double-rule caps.',
    phantom: 'Condensed capitals on a grey cut.',
    grotesk: 'Plain black outline caps in bold.',
    nostromo: 'Tan keys with monospace capitals and a 3 px foot.',
    titanium: 'Monospace caps with a lit top edge.',
};
const KEYS_LOOK = Object.fromEntries(
    Object.entries(KB).map(([theme, caps]) => [
        theme,
        `${caps} The whole line stays one row of one height; the words follow their caps; two caps for one action (↑ ↓) sit closer than two actions. The last line wraps by whole shortcuts, never mid-shortcut. Ctrl K shows ⌘ on a Mac.`,
    ]),
);

/**
 * The plain statement of what to see and what each control does (Kenny, 2026-10-16: "Zet in de volgende demo nog eens
 * duidelijk wat je verwacht"). One per section, beside the per-theme look-at text.
 * @param {string} items list items
 */
const expected = (items) => `<div class="cd-expect"><p><b>Expected:</b></p><ul>${items}</ul></div>`;

const look = (map) =>
    `<div data-review-look>\n${THEMES.map(([t]) => `                        <p data-for="${t}">${map[t]}</p>`).join('\n')}\n                    </div>`;

// ------------------------------------------------------------------ pieces
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** @param {{value:string,label:string,count?:number|string|null,on?:boolean,disabled?:boolean,all?:boolean,hint?:string,cls?:string}} i @param {boolean} multi */
const item = (i, multi) =>
    `<button type="button" class="kp-segmented__item${i.cls ? ` ${i.cls}` : ''}" data-value="${i.value}"${i.all ? ' data-kp-segmented-all' : ''} ${
        multi ? 'aria-pressed' : 'role="radio" aria-checked'
    }="${i.on ? 'true' : 'false'}"${i.disabled ? ' disabled' : ''}${i.hint ? ` title="${esc(i.hint)}"` : ''}><span class="kp-segmented__label">${esc(i.label)}</span>${
        i.count === undefined ? '' : `<span class="kp-segmented__count">${i.count ?? ''}</span>`
    }</button>`;

/** @param {{mode?:'single'|'multi',label:string,items:any[],cls?:string,attrs?:string}} g */
const seg = (g) => {
    const multi = g.mode === 'multi';
    return `<div class="kp-segmented${g.cls ? ` ${g.cls}` : ''}" data-kp-segmented="${multi ? 'multi' : 'single'}" role="${multi ? 'group' : 'radiogroup'}" aria-label="${esc(g.label)}"${
        g.attrs ? ` ${g.attrs}` : ''
    }>${g.items.map((i) => item(i, multi)).join('')}</div>`;
};

const SHOW = [
    { value: 'changed', label: 'Changed', count: 12, on: true },
    { value: 'all', label: 'All', count: 48 },
    { value: 'errors', label: 'Errors', count: 3 },
];
const STATUS = [
    { value: 'all', label: 'All', count: 12, all: true, on: true },
    { value: 'running', label: 'Running', count: 8 },
    { value: 'stopped', label: 'Stopped', count: 3 },
    { value: 'restarting', label: 'Restarting', count: 1 },
];
const STATUS_ON = (on) => STATUS.map((i) => ({ ...i, on: i.all ? false : on.includes(i.value) }));
const KIND = [
    { value: 'web', label: 'Web', count: 3 },
    { value: 'db', label: 'Database', count: 3 },
    { value: 'job', label: 'Job', count: 3 },
];

const row = (name, ...cells) =>
    `<div class="cd-states__row"><p class="cd-states__name">${name}</p>${cells.map((c) => `<div class="cd-states__cell">${c}</div>`).join('')}</div>`;

const stateRows = [
    row(
        'Chosen',
        seg({ label: 'Show', items: SHOW }),
        seg({ mode: 'multi', label: 'Status', cls: 'kp-segmented--chips', items: STATUS_ON(['running']).slice(1) }),
    ),
    row(
        'Hover (shown by a class)',
        seg({ label: 'Show', items: SHOW.map((i) => (i.value === 'all' ? { ...i, cls: 'cd-hover' } : i)) }),
        seg({
            mode: 'multi',
            label: 'Status',
            cls: 'kp-segmented--chips',
            items: STATUS_ON(['running'])
                .slice(1)
                .map((i) => (i.value === 'stopped' ? { ...i, cls: 'cd-hover' } : i)),
        }),
    ),
    row(
        'Keyboard focus (shown by a class)',
        seg({ label: 'Show', items: SHOW.map((i) => (i.value === 'changed' ? { ...i, cls: 'cd-focus' } : i)) }),
        seg({
            mode: 'multi',
            label: 'Status',
            cls: 'kp-segmented--chips',
            items: STATUS_ON(['running'])
                .slice(1)
                .map((i) => (i.value === 'running' ? { ...i, cls: 'cd-focus' } : i)),
        }),
    ),
    row(
        'One value disabled',
        seg({ label: 'Show', items: SHOW.map((i) => (i.value === 'errors' ? { ...i, disabled: true } : i)) }),
        seg({
            mode: 'multi',
            label: 'Status',
            cls: 'kp-segmented--chips',
            items: STATUS_ON([])
                .slice(1)
                .map((i) => (i.value === 'restarting' ? { ...i, disabled: true } : i)),
        }),
    ),
    row(
        'Whole control disabled',
        seg({ label: 'Show', items: SHOW, attrs: 'aria-disabled="true"' }),
        seg({ mode: 'multi', label: 'Status', cls: 'kp-segmented--chips', items: STATUS_ON(['running']).slice(1), attrs: 'aria-disabled="true"' }),
    ),
    row(
        'Loading: the numbers are on their way',
        seg({ label: 'Show', items: SHOW.map((i) => ({ ...i, count: null })), attrs: 'aria-busy="true" data-cd-loading' }),
        seg({
            mode: 'multi',
            label: 'Status',
            cls: 'kp-segmented--chips',
            items: STATUS_ON([])
                .slice(1)
                .map((i) => ({ ...i, count: null })),
            attrs: 'aria-busy="true" data-cd-loading',
        }),
    ),
    row(
        'A long label, cut with an ellipsis',
        seg({
            label: 'Scope',
            cls: 'cd-narrow',
            items: [
                {
                    value: 'a',
                    label: 'Everything that changed since the last nightly backup finished',
                    on: true,
                    hint: 'Everything that changed since the last nightly backup finished',
                },
                { value: 'b', label: 'Mine' },
            ],
        }),
        seg({
            mode: 'multi',
            label: 'Scope',
            cls: 'kp-segmented--chips cd-narrow',
            items: [
                { value: 'a', label: 'Everything that changed since the last nightly backup finished', on: true },
                { value: 'b', label: 'Mine' },
            ],
        }),
    ),
    row(
        'More values than room (scrolls / wraps)',
        seg({
            label: 'Month',
            cls: 'cd-narrow',
            items: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, at) => ({
                value: m,
                label: m,
                count: at * 3 + 1,
                on: m === 'Mar',
            })),
        }),
        seg({
            mode: 'multi',
            label: 'Month',
            cls: 'kp-segmented--chips cd-narrow',
            items: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, at) => ({
                value: m,
                label: m,
                count: at * 3 + 1,
                on: m === 'Mar',
            })),
        }),
    ),
    row(
        'Right to left (arrows and plate)',
        `<div dir="rtl" class="cd-rtl">${seg({ label: 'Show', items: SHOW })}</div>`,
        `<div dir="rtl" class="cd-rtl">${seg({ mode: 'multi', label: 'Status', cls: 'kp-segmented--chips', items: STATUS_ON(['running']).slice(1) })}</div>`,
    ),
].join('\n');

// ---- the live list
const CONTAINERS = [
    ['nginx-proxy', 'web', 'running'],
    ['api-gateway', 'web', 'running'],
    ['grafana', 'web', 'running'],
    ['postgres-main', 'db', 'running'],
    ['redis-cache', 'db', 'running'],
    ['loki', 'db', 'stopped'],
    ['worker-mail', 'job', 'restarting'],
    ['worker-thumbs', 'job', 'running'],
    ['backup-nightly', 'job', 'stopped'],
    ['uptime-kuma', 'web', 'running'],
    ['postgres-replica', 'db', 'running'],
    ['report-export', 'job', 'stopped'],
];

const toolbar = ({ id, search = true, reserve = false, stacked = false, view = true, label, live = true }) => `
<div class="kp-toolbar${stacked ? ' kp-toolbar--stacked' : ''}" data-kp-toolbar${search ? ' data-kp-toolbar-key="/"' : ''}${reserve ? ' data-kp-toolbar-reserve' : ''} role="group" aria-label="${label}"${live ? ` data-cd-live="${id}"` : ''}>
    ${
        search
            ? `<div class="kp-toolbar__search">
        <input type="search" class="kp-field__input kp-toolbar__input" placeholder="Search containers" aria-label="Search containers" aria-keyshortcuts="/" autocomplete="off" />
        <kbd class="kp-kbd kp-toolbar__key" aria-hidden="true">/</kbd>
    </div>`
            : ''
    }
    <div class="kp-toolbar__filters">
        <div class="kp-toolbar__group" role="group" aria-label="Status">
            <b class="kp-toolbar__label">Status</b>
            ${seg({ mode: 'multi', label: 'Status', cls: 'kp-segmented--chips', items: STATUS.slice(1).map((i) => ({ ...i, on: false })), attrs: 'data-cd-group="status"' })}
        </div>
        <div class="kp-toolbar__group" role="group" aria-label="Kind">
            <b class="kp-toolbar__label">Kind</b>
            ${seg({ mode: 'multi', label: 'Kind', cls: 'kp-segmented--chips', items: KIND.map((i) => ({ ...i, on: false })), attrs: 'data-cd-group="kind"' })}
        </div>
    </div>
    <div class="kp-toolbar__state">
        <span data-cd-count>12 of 12</span>
        ${
            view
                ? seg({
                      label: 'View',
                      items: [
                          { value: 'table', label: 'Table', on: true },
                          { value: 'cards', label: 'Cards' },
                      ],
                      attrs: 'data-cd-group="view"',
                  })
                : ''
        }
    </div>
    <div class="kp-toolbar__active" hidden></div>
</div>`;

const list = (id) => `
<ul class="cd-list" data-cd-list="${id}" aria-label="Containers">
${CONTAINERS.map(
    ([name, kind, status]) =>
        `    <li class="cd-list__row" data-name="${name}" data-kind="${kind}" data-status="${status}"><span class="cd-list__name">${name}</span><span class="cd-list__kind">${kind}</span><span class="kp-badge kp-badge--${
            status === 'running' ? 'success' : status === 'stopped' ? 'destructive' : 'warning'
        }">${status}</span></li>`,
).join('\n')}
    <li class="cd-list__none" hidden>No container matches. Turn a filter off or clear the search.</li>
</ul>`;

const staticActive = (tags, clear = true) =>
    `<div class="kp-toolbar__active"><span class="kp-toolbar__active-label">Showing only</span><ul class="kp-tag-list kp-toolbar__active-list" aria-label="Active filters">${tags
        .map((t) => `<li class="kp-tag">${esc(t)}<button type="button" class="kp-tag__remove" aria-label="Remove filter ${esc(t)}">×</button></li>`)
        .join(
            '',
        )}</ul>${clear ? '<button type="button" class="kp-button kp-button--ghost kp-button--sm" data-kp-toolbar-clear>Clear all</button>' : ''}</div>`;

const staticToolbar = ({ label, search = true, stacked = false, tags = [], reserve = false, noState = false }) => `
<div class="kp-toolbar${stacked ? ' kp-toolbar--stacked' : ''}" data-kp-toolbar${reserve ? ' data-kp-toolbar-reserve' : ''} role="group" aria-label="${label}">
    ${search ? `<div class="kp-toolbar__search"><input type="search" class="kp-field__input kp-toolbar__input" placeholder="Search containers" aria-label="Search containers" /><kbd class="kp-kbd kp-toolbar__key" aria-hidden="true">/</kbd></div>` : ''}
    <div class="kp-toolbar__filters"><div class="kp-toolbar__group" role="group" aria-label="Status"><b class="kp-toolbar__label">Status</b>${seg({ mode: 'multi', label: 'Status', cls: 'kp-segmented--chips', items: STATUS.slice(1).map((i, at) => ({ ...i, on: at === 0 && tags.length > 0 })) })}</div></div>
    ${noState ? '' : '<div class="kp-toolbar__state"><span>12 of 12</span></div>'}
    ${tags.length ? staticActive(tags) : '<div class="kp-toolbar__active" hidden></div>'}
</div>`;

const keysStatic = (extra = '') => `
<div class="kp-keys${extra}" role="group" aria-label="Keyboard shortcuts">
    <span class="kp-keys__item"><kbd class="kp-kbd">/</kbd> search containers</span>
    <span class="kp-keys__item"><span class="kp-keys__caps"><kbd class="kp-kbd">↑</kbd><kbd class="kp-kbd">↓</kbd></span> move</span>
    <span class="kp-keys__item"><kbd class="kp-kbd">Enter</kbd> open</span>
    <span class="kp-keys__item"><kbd class="kp-kbd">Esc</kbd> clear</span>
</div>`;

const lineup = THEMES.map(
    ([t, name]) => `
<article class="cd-stage" data-theme="${t}">
    <h4 class="cd-stage__name">${name}</h4>
    ${seg({ label: 'Show', items: SHOW })}
    ${seg({ mode: 'multi', label: 'Status', cls: 'kp-segmented--chips', items: STATUS_ON(['running']).slice(1) })}
    ${seg({ mode: 'multi', label: 'Status', items: STATUS_ON(['running', 'stopped']) })}
    <div class="kp-keys" role="group" aria-label="Keyboard shortcuts"><span class="kp-keys__item"><kbd class="kp-kbd">/</kbd> search</span><span class="kp-keys__item"><span class="kp-keys__caps"><kbd class="kp-kbd">↑</kbd><kbd class="kp-kbd">↓</kbd></span> move</span><span class="kp-keys__item"><kbd class="kp-kbd">Esc</kbd> clear</span></div>
</article>`,
).join('\n');

const themeButtons = THEMES.map(
    ([t, n]) => `<button type="button" class="kp-button kp-button--sm" data-cd-theme="${t}" aria-pressed="false">${n}</button>`,
).join('\n                    ');

const registers = ['formal', 'light'].map((t) => `        <link rel="stylesheet" href="../../css/${t}-register.css" data-kp-register="${t}" />`);

const html = `<!doctype html>
<!-- Written by research/kpadopt-controls/build.mjs; edit build.mjs, demo.css and demo.js, not this file. -->
<html lang="en" data-theme="light" data-cat-theme="light" data-cat-theme-fixed data-review="kpadopt-controls">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes: segmented control, list toolbar and key line</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
${registers.join('\n')}
        <link rel="stylesheet" href="demo.css" />
    </head>
    <body>
        <main class="cd-page">
            <header class="cd-intro">
                <h1>Segmented control, list toolbar and key line</h1>
                <p>
                    Three parts Kenny’s admin dashboard still draws itself because kp-themes 10.1.1 has no component for them (its toggleGroup, segSwitch,
                    toolbar, filterChip and keyRow). Each is built here on the package: the stylesheet rules are in css/components.css and every register,
                    the behaviour in js/segmented.js, js/toolbar.js and js/keys.js. Everything on this page is the package; only the list of containers, the
                    filtering of it and the “hover” and “focus” rows are this page’s (stand-ins, named where they appear). Judge in the review dialog
                    (“Review in a dialog” at the top): sixteen themes, three sections each.
                </p>
                <p class="cd-motion" data-cd-motion hidden>
                    <b>Your system asks for reduced motion</b>, so the plate under a chosen segment appears in place instead of gliding. Turn it off to
                    judge the movement.
                </p>
                <div class="cd-themes" role="group" aria-label="Theme (outside the review dialog)">
                    <b>Theme:</b>
                    ${themeButtons}
                </div>
            </header>

            <section class="cd-sec" data-review-item="segmented" data-review-components="segmented" data-review-title="1 · Segmented control and filter chips" aria-label="Segmented control and filter chips">
                <div class="cd-sec__head">
                    <h2>1 · Segmented control and filter chips</h2>
                    <p>
                        One component, two looks. The segmented look is a track with a plate under the chosen value; the chip look is the same buttons as
                        separate pills. A group chooses <b>one</b> value (a radio group: one tab stop, the arrow keys move and choose) or <b>several</b>
                        (toggle buttons: arrows move, Space or Enter turns the value; none on means All, turning every value on is the same as none).
                        Try it with the keyboard: Tab into a control, then the arrow keys, Home and End.
                    </p>
                </div>
                ${look(SEG)}
                ${expected(`
                    <li><b>One value:</b> press Changed, All or Errors, or Table or Cards: the pressed one becomes the chosen one (the plate moves under it), the other loses it, exactly one is chosen at any time. The counts do not move the labels.</li>
                    <li><b>Several values:</b> press Running, Stopped or Restarting: each press turns that value on or off, and “Values on” under the group lists what is on. With nothing on, All is the pressed one; pressing All turns every other value off; turning on every value one by one ends as All.</li>
                    <li><b>Keyboard:</b> Tab reaches a group once (one tab stop); the arrow keys, Home and End move inside it; in a one-value group they also choose; in a several-values group Space or Enter turns the value.</li>
                    <li><b>Loading rows:</b> “Numbers arrive” fills the counts without moving any label; “Back to loading” puts the grey places back. Hover and focus rows are drawn standing still; Disabled does not answer a press.</li>
                `)}
                <div class="cd-block">
                    <h3>One value, with counts</h3>
                    <p class="cd-caption">Single choice. The plate glides in the theme’s own motion and the counts keep their column when they change.</p>
                    <div class="cd-row">${seg({ label: 'Show', items: SHOW })}${seg({
                        label: 'View',
                        items: [
                            { value: 'table', label: 'Table', on: true },
                            { value: 'cards', label: 'Cards' },
                        ],
                    })}</div>
                </div>
                <div class="cd-block">
                    <h3>Several values, with an All segment</h3>
                    <p class="cd-caption">Plain-click toggles. “All” is pressed while nothing else is on; pressing it turns the rest off.</p>
                    <div class="cd-row">${seg({ mode: 'multi', label: 'Status', items: STATUS })}</div>
                    <p class="cd-readout" data-cd-readout="status">Values on: none (All).</p>
                </div>
                <div class="cd-block">
                    <h3>The chip look</h3>
                    <p class="cd-caption">Chips wrap rather than scroll; a chip fills when it is on.</p>
                    <div class="cd-row">${seg({ mode: 'multi', label: 'Status', cls: 'kp-segmented--chips', items: STATUS_ON(['running']).slice(1) })}${seg({ label: 'Kind', cls: 'kp-segmented--chips', items: KIND.map((i, at) => ({ ...i, on: at === 1 })) })}</div>
                </div>
                <div class="cd-block">
                    <h3>Full width</h3>
                    <p class="cd-caption"><code>kp-segmented--block</code>: every segment the same width.</p>
                    ${seg({
                        label: 'Range',
                        cls: 'kp-segmented--block',
                        items: [
                            { value: '1h', label: '1 hour' },
                            { value: '24h', label: '24 hours', on: true },
                            { value: '7d', label: '7 days' },
                            { value: '30d', label: '30 days' },
                        ],
                    })}
                </div>
                <div class="cd-block">
                    <h3>Every state, segmented beside chips</h3>
                    <div class="cd-actions" data-review-controls role="group" aria-label="The loading rows">
                        <b>Loading rows:</b>
                        <button type="button" class="kp-button kp-button--sm" data-cd-arrive>Numbers arrive</button>
                        <button type="button" class="kp-button kp-button--sm" data-cd-wait>Back to loading</button>
                    </div>
                    <p class="cd-caption">
                        Mock: a page cannot hold the pointer or the keyboard still, so “hover” and “focus” are drawn with this page’s classes from the
                        package’s own knobs (<code>--kp-seg-hover</code>, the global focus ring). Disabled, loading and the rest are the package’s.
                    </p>
                    <div class="cd-states">
                        <div class="cd-states__row cd-states__row--head"><p></p><p>Segmented</p><p>Chips</p></div>
${stateRows}
                    </div>
                </div>
            </section>

            <section class="cd-sec" data-review-item="toolbar" data-review-components="toolbar" data-review-title="2 · List toolbar" aria-label="List toolbar">
                <div class="cd-sec__head">
                    <h2>2 · List toolbar</h2>
                    <p>
                        The bar above a list, a log or a board that is not a data table: search at its own width, labelled filter groups, view and state
                        against the right edge, and under them the filters that are on, as the data table’s own removable tags. Press <kbd class="kp-kbd">/</kbd>
                        anywhere outside a field to jump to the search; Escape in the search clears it.
                    </p>
                </div>
                ${look(TB)}
                ${expected(`
                    <li><b>Live toolbar:</b> type in the search box: the list under it narrows to the names that match, the count at the right (“5 of 12”) follows, and a tag “Search: …” appears. Press <kbd class="kp-kbd">/</kbd> outside a field to jump to the search; Escape in the search clears it.</li>
                    <li><b>Press a filter</b> (for instance Status: Running): the list narrows, the counts on the other chips update, and a removable tag “Status: Running” appears in a row under the bar. The tag must appear at its final size at once: it must not start tall or stretched, and the page may move down by that one row, once, and then stay still.</li>
                    <li><b>The tag’s × and Clear all</b> turn that filter off, or every filter off, and the row goes away again. Table / Cards changes the list’s layout (the rows become cards).</li>
                    <li><b>Three bars below:</b> without the row (the list starts higher), reserved (the list starts at the same place with or without filters), two filters on (the long one is cut, not wrapped). The narrow one is stacked in one column. The data table’s own pills look the same as the toolbar’s tags.</li>
                `)}
                <div class="cd-block">
                    <h3>Above a plain list (live)</h3>
                    <p class="cd-caption">Mock: the list and its filtering are this page’s. Everything in the bar is the package.</p>
                    <div class="cd-card" data-cd-live-root>
                        ${toolbar({ id: 'a', label: 'Containers' })}
                        ${list('a')}
                    </div>
                </div>
                <div class="cd-block">
                    <h3>The row of filters that are on, kept in place</h3>
                    <p class="cd-caption">
                        <code>data-kp-toolbar-reserve</code> keeps the row’s height while it is empty, so the list under the toolbar does not move when a
                        filter is turned on. Below: absent when empty (the default), reserved when empty, and with filters on.
                    </p>
                    <div class="cd-stack">
                        <div class="cd-card">${staticToolbar({ label: 'Absent when empty (default)' })}<p class="cd-mark">The list starts here.</p></div>
                        <div class="cd-card">${staticToolbar({ label: 'Reserved when empty', reserve: true })}<p class="cd-mark">The list starts here too.</p></div>
                        <div class="cd-card">${staticToolbar({ label: 'Two filters on', tags: ['Status: Running', 'Search: “postgres-main-replica-eu-west-2-nightly”'] })}<p class="cd-mark">The list starts here, and a long tag wraps.</p></div>
                    </div>
                </div>
                <div class="cd-block">
                    <h3>No search, and stacked in a narrow column</h3>
                    <p class="cd-caption"><code>kp-toolbar--stacked</code> is the phone layout on demand (below 48rem the toolbar stacks by itself).</p>
                    <div class="cd-stack cd-stack--two">
                        <div class="cd-card">${staticToolbar({ label: 'Without search', search: false })}</div>
                        <div class="cd-card cd-card--narrow">${staticToolbar({ label: 'Stacked', stacked: true, tags: ['Status: Running'] })}</div>
                    </div>
                </div>
                <div class="cd-block">
                    <h3>Beside the data table’s own bar</h3>
                    <p class="cd-caption">
                        A real <code>kp-datatable</code> (search, a header filter with a pill). Its pills and the toolbar’s tags are the same
                        <code>.kp-tag</code>, so the two read as one family.
                    </p>
                    <div class="cd-card">
                        <div class="kp-datatable" data-kp-datatable data-kp-filter-mode="panel">
                            <div class="kp-datatable__bar"><input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search containers" placeholder="Search containers" /></div>
                            <div class="kp-table-wrap">
                                <table class="kp-table">
                                    <caption class="kp-sr-only">Containers</caption>
                                    <thead><tr><th scope="col" data-kp-sort="text">Name</th><th scope="col" data-kp-filter="choice" data-kp-filter-value="running">Status</th><th scope="col" data-kp-sort="text">Kind</th></tr></thead>
                                    <tbody>
${CONTAINERS.slice(0, 6)
    .map(([n, k, s]) => `                                        <tr><td>${n}</td><td>${s}</td><td>${k}</td></tr>`)
    .join('\n')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="cd-sec" data-review-item="keys" data-review-components="keys kbd" data-review-title="3 · Inline key line" aria-label="Inline key line">
                <div class="cd-sec__head">
                    <h2>3 · Inline key line</h2>
                    <p>
                        A row of key caps with what each does, under a list or beside a control. It is not the Help sheet: no box, no dialog, one line that
                        wraps by whole shortcuts. The cap (<code>kbd.kp-kbd</code>) also stands alone: in a button, a hint, a sentence.
                    </p>
                </div>
                ${look(KEYS_LOOK)}
                ${expected(`
                    <li><b>The line:</b> one row of key caps, each followed by what it does, no box around it. When the row is too wide it wraps by whole shortcuts, never in the middle of one; two caps for one action (like ↑ ↓) sit closer together than two actions.</li>
                    <li><b>Written from pairs:</b> the Mod key reads ⌘ on a Mac and Ctrl everywhere else, on this machine it reads as the platform’s own key.</li>
                    <li><b>A cap on its own</b> in a button, a sentence, or in a disabled button (dimmed with its button). The caps are not controls: pressing one does nothing.</li>
                `)}
                <div class="cd-block">
                    <h3>The line</h3>
                    ${keysStatic()}
                </div>
                <div class="cd-block">
                    <h3>Written from pairs, with the platform’s modifier</h3>
                    <p class="cd-caption"><code>setKeys(el, [[['Mod','K'], 'palette'], …])</code>: <code>Mod</code> is ⌘ on a Mac and Ctrl elsewhere.</p>
                    <div data-cd-keys></div>
                </div>
                <div class="cd-block">
                    <h3>Against the far edge, and wrapping</h3>
                    <div class="cd-stack cd-stack--two">
                        <div class="cd-card">${keysStatic(' kp-keys--end')}</div>
                        <div class="cd-card cd-card--narrow">${keysStatic()}</div>
                    </div>
                </div>
                <div class="cd-block">
                    <h3>A cap on its own</h3>
                    <div class="cd-row">
                        <button type="button" class="kp-button kp-button--primary">Search <kbd class="kp-kbd">/</kbd></button>
                        <button type="button" class="kp-button">Close <kbd class="kp-kbd">Esc</kbd></button>
                        <button type="button" class="kp-button" disabled>Delete <kbd class="kp-kbd">Del</kbd></button>
                        <p class="cd-sentence">Press <kbd class="kp-kbd">Ctrl</kbd> <kbd class="kp-kbd">S</kbd> to save, <kbd class="kp-kbd">Shift</kbd> <kbd class="kp-kbd">Tab</kbd> to go back.</p>
                    </div>
                </div>
            </section>

            <section class="cd-lineup" aria-label="All sixteen themes side by side">
                <h2>All sixteen side by side</h2>
                <p>
                    For comparing the themes with each other, not judged in the dialog: a segmented control (single), chips, a multi segmented control and
                    a key line, in each theme at once. Each stage has its own theme and loads its register.
                </p>
                <div class="cd-lineup__grid" data-cd-lineup>
${lineup}
                </div>
            </section>
        </main>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="demo.js"></script>
        <!-- Round two (2026-10-16): Kenny's rejections of round one reopen by themselves; every pair he has not judged is still open. -->
        <script type="application/json" data-review-round>
            { "round": "2026-10-16-r2", "reopen": [] }
        </script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

writeFileSync(new URL('demo.html', import.meta.url), html);
console.log('demo.html', html.length, 'bytes');
