// research/medgaps-1102: the controls and the two components' markup, written once; sections.mjs places them. Every component is
// the package's own (kp- classes, attached by js/auto.js); the pg- classes are this page's frame. Names, counts and stock are mock,
// in Medicine Cabinet's shapes (its Stock page and its medicines table).

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]; `target` the component it drives. */
export const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The stage's width: a phone's 390 px or the whole column. */
export const width = (target, phone = false) => group('Width', 'width', [['full', 'Full width', !phone], ['phone', 'Phone, 390 px', phone]], target);

/** A line under a component that says what the page heard, one line high whether it says something or not. */
export const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;

/** Medicine Cabinet's stock rows: name, what is left, and Add stock at the row's end edge. */
const STOCK = [
    ['ibuprofen', 'Ibuprofen 400 mg', '12 tablets left'],
    ['paracetamol', 'Paracetamol 500 mg', '30 tablets left'],
    ['vitamin-d', 'Vitamin D 25 µg', '5 capsules left'],
];

const stockRow = ([key, name, left]) => `<li class="pg-stock__row">
                        <span class="pg-stock__name">${name}</span>
                        <span class="pg-stock__left">${left}</span>
                        <button type="button" class="kp-button kp-button--sm pg-stock__open" id="pg-stock-open-${key}" popovertarget="pg-stock-pop-${key}" style="anchor-name: --pg-stock-${key}">Add stock</button>
                        <div popover="auto" class="kp-popover kp-popover--panel kp-popover--end" id="pg-stock-pop-${key}" role="dialog" aria-labelledby="pg-stock-t-${key}" style="position-anchor: --pg-stock-${key}" data-pg-stock-pop>
                            <form class="pg-stock__form" data-pg-stock-form="${key}">
                                <p class="pg-stock__title" id="pg-stock-t-${key}">Add stock to ${name}</p>
                                <label class="kp-field__label" for="pg-stock-n-${key}">Packs of 20</label>
                                <input class="kp-field__input" id="pg-stock-n-${key}" name="packs" type="number" min="1" max="20" step="1" value="1" required />
                                <button type="submit" class="kp-button kp-button--primary kp-button--sm">Add</button>
                            </form>
                        </div>
                    </li>`;

/** The stock list with one popover per row; the room under it grows while a popover is open (the review kit's data-review-room). */
export const stockList = () => `<div class="pg-stack">
                <div class="kp-card pg-stock" id="pg-stock" data-review-room>
                    <ul class="pg-stock__rows" aria-label="Stock">
                    ${STOCK.map(stockRow).join('\n                    ')}
                    </ul>
                </div>
                ${log('pg-stock-log')}
            </div>`;

/** Medicine Cabinet's medicines table: a stock field in every row, the rows redrawn by the page's refresh. */
export const medicinesTable = () => `<div class="pg-stack">
                <div class="kp-datatable" id="pg-meds" data-kp-datatable data-kp-cards data-kp-cards-at="30rem" data-kp-page-sizes="none" data-kp-keep-focused-row data-kp-region-label="Medicines">
                    <div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status"></p></div>
                    <div class="kp-table-wrap">
                        <table class="kp-table">
                            <caption class="kp-sr-only">Medicines and their stock</caption>
                            <thead><tr><th scope="col" data-kp-sort="text">Medicine</th><th scope="col" data-kp-sort="number" class="kp-numeric">Taken today</th><th scope="col" data-kp-sort="number" class="kp-numeric">Stock, tablets</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="kp-empty" data-kp-datatable-empty hidden>No medicines yet.</div>
                </div>
                ${log('pg-meds-log')}
            </div>`;
