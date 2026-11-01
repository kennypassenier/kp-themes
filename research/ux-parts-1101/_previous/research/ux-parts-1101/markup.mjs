// research/ux-parts-1101: the components' markup, written once from the apps' own data (Medicine Cabinet's filters, cabinet and
// stock table; Kitchen's wheel filters; kyu's dead letters and Topics header; Almanac's Status). sections.mjs places them.

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

// ---------------------------------------------------------------- Kitchen: the wheel's filters (web/js/pages/wheel/template.js)
const WHEEL = [
    ['meal', 'Meal', ['Breakfast', 'Lunch', 'Dinner', 'Snack']],
    ['time', 'Time', ['Under 20 min', '20 to 40 min', 'Over 40 min']],
    ['ing', 'Ingredients', ['Chicken', 'Mushrooms', 'Rice', 'Pasta', 'Tomatoes', 'Cheese', 'Eggs']],
];
const triChip = (label) => `<button type="button" class="kp-segmented__item" data-value="${label.toLowerCase().replace(/\s+/g, '-')}"><span class="kp-segmented__label">${label}</span></button>`;
export const wheelFilters = `<div class="pg-wheel" id="pg-wheel">${WHEEL.map(
    ([key, name, items]) => `
                <div class="pg-wheel__filter">
                    <p class="pg-wheel__name" id="pg-wheel-${key}-l">${name}</p>
                    <div class="kp-segmented kp-segmented--chips" id="pg-wheel-${key}" data-kp-segmented="tri" data-kp-segmented-tri-look="word" data-kp-segmented-summary aria-labelledby="pg-wheel-${key}-l">${items.map(triChip).join('')}</div>
                </div>`,
).join('')}
            </div>`;

// ---------------------------------------------------------------- Medicine Cabinet: Add stock, per medicine
const CABINET = [
    ['ibuprofen', 'Ibuprofen 400 mg', 2, 'boxes of 20', '14/03/2027'],
    ['paracetamol', 'Paracetamol 500 mg', 5, 'boxes of 16', '02/09/2027'],
    ['cetirizine', 'Cetirizine 10 mg', 0, 'boxes of 7', '30/11/2026'],
];
const addStock = ([key, name, , unit]) => `<div class="kp-popover-form" data-kp-popover-form id="pg-add-${key}" data-pg-name="${name}">
                        <button type="button" class="kp-button kp-button--sm">Add stock</button>
                        <form class="kp-menu kp-popover-form__panel" aria-label="Add stock to ${name}">
                            <label class="kp-popover-form__label" for="pg-add-${key}-n">Boxes to add</label>
                            <p class="kp-popover-form__hint">${unit}</p>
                            <div class="kp-popover-form__row"><input class="kp-field__input" id="pg-add-${key}-n" name="boxes" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" required /><button type="submit" class="kp-button kp-button--primary">Add</button></div>
                        </form>
                    </div>`;
export const cabinet = `<div class="kp-formgrid" data-kp-formgrid-lines="lines" id="pg-cabinet">${CABINET.map(
    (row) => `
                <div class="kp-formgrid__row">
                    <p class="kp-formgrid__label">${row[1]}</p>
                    <div class="kp-formgrid__control kp-formgrid__fill"><span class="kp-badge${row[2] === 0 ? ' kp-badge--warning' : ''}" id="pg-stock-${row[0]}" data-pg-boxes="${row[2]}">${row[2] === 1 ? '1 box' : `${row[2]} boxes`}</span></div>
                    <p class="kp-formgrid__value">Expires ${row[4]}</p>
                    <div class="kp-formgrid__actions">${addStock(row)}</div>
                </div>`,
).join('')}
            </div>`;

// ---------------------------------------------------------------- kyu: the dead letters, none
/** kyu's dead-letter table with nothing in it. @param {string} id */
export const deadLetters = (id) => `<div class="kp-datatable" id="${id}" data-kp-datatable data-kp-page-size="25" data-kp-page-sizes="none">
                <div class="kp-table-wrap"><table class="kp-table"><caption>Dead letters</caption>
                <thead><tr><th scope="col" data-kp-sort="text">Topic</th><th scope="col" data-kp-sort="text">Message</th><th scope="col" data-kp-sort="text">Failed at</th><th scope="col" data-kp-sort="number">Tries</th></tr></thead>
                <tbody></tbody></table></div>
                <div class="kp-empty" data-kp-datatable-empty hidden><p class="kp-empty__title">No dead letters</p><p class="kp-empty__body">Every message reached its subscriber.</p></div>
            </div>`;

// ---------------------------------------------------------------- kyu: the Topics header with its own freshness line
/** kyu's Topics header and its refresh control. @param {string} id @param {string} options */
export const topicsHeader = (id, options) => `<header class="kp-page-header">
                <div class="kp-page-header__inner">
                    <div><h3 class="kp-page-header__title">Topics</h3><p class="kp-page-header__updated">Updated 2 min ago</p><p class="kp-page-header__description">Eleven topics on the hub, their subscribers and what waits in each.</p></div>
                </div>
            </header>
            <div class="kp-refresh" id="${id}" data-kp-refresh="30" data-kp-refresh-choices="0,15,30,60,300"${options}></div>`;

// ---------------------------------------------------------------- Almanac: Status, the month's deliveries and the week's syncs
export const almanacStatus = `<div class="pg-status">
                <section class="pg-status__block" aria-labelledby="pg-month-h">
                    <h3 id="pg-month-h">Deliveries this month</h3>
                    <nav class="kp-date-nav" id="pg-month-nav" data-kp-date-nav="month" data-kp-week-starts-on="1" data-kp-date-nav-today="2026-11-01" data-kp-date-nav-for="pg-month" aria-label="Month shown"></nav>
                    <div class="kp-calendar" id="pg-month" data-kp-calendar data-kp-week-starts-on="1" data-kp-calendar-nav="off" data-kp-calendar-month="2026-11" aria-label="Deliveries per day"></div>
                </section>
                <section class="pg-status__block" aria-labelledby="pg-week-h">
                    <h3 id="pg-week-h">Syncs this week</h3>
                    <nav class="kp-date-nav" id="pg-week-nav" data-kp-date-nav="week" data-kp-week-starts-on="1" data-kp-date-nav-today="2026-11-01" data-kp-date-nav-for="pg-week" aria-label="Week shown"></nav>
                    <section class="kp-week" id="pg-week" data-kp-week data-kp-week-starts-on="1" data-kp-week-start="2026-10-26" aria-label="Syncs in the week shown"></section>
                </section>
            </div>`;

// ---------------------------------------------------------------- Medicine Cabinet: the stock table, Delete with Undo
const STOCK = [
    ['ibuprofen', 'Ibuprofen 400 mg', '2 boxes', '14/03/2027'],
    ['paracetamol', 'Paracetamol 500 mg', '5 boxes', '02/09/2027'],
    ['cetirizine', 'Cetirizine 10 mg', '0 boxes', '30/11/2026'],
    ['omeprazole', 'Omeprazole 20 mg', '1 box', '11/06/2027'],
    ['vitamin-d', 'Vitamin D 25 µg', '3 boxes', '01/01/2028'],
];
export const stockTable = `<div class="kp-datatable" id="pg-stock" data-kp-datatable data-kp-page-size="25" data-kp-page-sizes="none" data-kp-cards data-kp-cards-at="28rem">
                <div class="kp-table-wrap"><table class="kp-table"><caption>Medicines in the cabinet</caption>
                <thead><tr><th scope="col" data-kp-sort="text">Medicine</th><th scope="col" data-kp-sort="text">In stock</th><th scope="col" data-kp-sort="text">Expires</th><th scope="col"><span class="kp-sr-only">Actions</span></th></tr></thead>
                <tbody>${STOCK.map(([key, name, stock, expires]) => `<tr data-kp-row-key="${key}"><td>${name}</td><td>${stock}</td><td>${expires}</td><td><button type="button" class="kp-button kp-button--sm" data-kp-row-delete="${name}">Delete</button></td></tr>`).join('')}</tbody></table></div>
                <div class="kp-empty" data-kp-datatable-empty hidden><p class="kp-empty__title">The cabinet is empty</p><p class="kp-empty__body">Add a medicine to start tracking it.</p></div>
            </div>`;
