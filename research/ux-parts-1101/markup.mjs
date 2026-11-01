// research/ux-parts-1101, round 2: the components' markup, written once from the apps' own data (Medicine Cabinet's Overview
// filters, kyu's Topics header). sections.mjs places them.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
export const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The stage's width: the whole column, or a phone's 390 px. */
export const width = (target) => group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], target);
/** A line under a component that says what the page heard, one line high whether it says something or not. */
export const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;
/** Two frames under each other, the approved look first, each named; the one that is the default carries the mark. */
export const pair = (now, next) => `<div class="pg-pair">
            <div class="pg-frame" data-pg-frame="now" data-pg-default><p class="pg-frame__name"><span><b>Now</b>, as approved</span> <span class="kp-badge pg-frame__default">Default</span></p>${now}</div>
            <div class="pg-frame" data-pg-frame="new"><p class="pg-frame__name"><span><b>New</b>, the option</span> <span class="kp-badge pg-frame__default">Default</span></p>${next}</div>
        </div>`;

// ---------------------------------------------------------------- Medicine Cabinet: the Overview's filter chips
const FILTERS = [
    ['all', 'All', 14, true],
    ['due', 'Due today', 3],
    ['expiring', 'Expiring', 2],
    ['low', 'Low stock', 1],
    ['out', 'Out of stock', 1],
    ['off', 'Switched off', 4],
];
const chip = ([value, label, count, on]) =>
    `<button type="button" class="kp-segmented__item" data-value="${value}" role="radio" aria-checked="${on ? 'true' : 'false'}"><span class="kp-segmented__label">${label}</span><span class="kp-segmented__count">${count}</span></button>`;
/** The Overview's toolbar: search, then the chips. @param {string} id @param {string} fit */
export const chipToolbar = (id, fit) => `<div class="kp-toolbar">
                <div class="kp-toolbar__search"><input class="kp-field__input kp-toolbar__input" type="search" aria-label="Search the cabinet" placeholder="Search the cabinet" /></div>
                <div class="kp-toolbar__filters"><div class="kp-segmented kp-segmented--chips" id="${id}" data-kp-segmented="single"${fit} aria-label="Show">${FILTERS.map(chip).join('')}</div></div>
            </div>`;

// ---------------------------------------------------------------- kyu: the Topics header with its own freshness line
/** kyu's Topics header and its refresh control. @param {string} id @param {string} options */
export const topicsHeader = (id, options) => `<header class="kp-page-header">
                <div class="kp-page-header__inner">
                    <div><h3 class="kp-page-header__title">Topics</h3><p class="kp-page-header__updated">Updated 2 min ago</p><p class="kp-page-header__description">Eleven topics on the hub, their subscribers and what waits in each.</p></div>
                </div>
            </header>
            <div class="kp-refresh" id="${id}" data-kp-refresh="30" data-kp-refresh-choices="0,15,30,60,300"${options}></div>`;
