// research/kyugaps-1102: the scenes a stage frame shows, written once from kyu's own topic page: the dead letters card
// (kyu's templates/_topic_dead.html: the selection bar over the dead letters table, its columns Died,
// Subscription, Tries, Why it died, Payload, Actions) and the page's tour. Names, counts and dates are mock.

/** kyu's dead letters of one topic: [key, died, subscription, tries, why, payload]. */
export const DEAD = [
    ['d-4812', '02/11/2026 09:14', 'billing', 5, 'HTTP 503 from the billing endpoint', '{"order":10412,"total":"41.90"}'],
    ['d-4811', '02/11/2026 09:12', 'billing', 5, 'HTTP 503 from the billing endpoint', '{"order":10411,"total":"12.50"}'],
    ['d-4807', '02/11/2026 08:58', 'mailer', 3, 'Lease ran out three times', '{"order":10407,"to":"anna@example.org"}'],
    ['d-4799', '02/11/2026 08:31', 'warehouse', 5, 'Payload is not valid JSON', '{"order":10399,"lines":[{"sku":"A-17"'],
    ['d-4790', '02/11/2026 07:46', 'mailer', 3, 'Lease ran out three times', '{"order":10390,"to":"jan@example.org"}'],
    ['d-4776', '02/11/2026 06:20', 'billing', 5, 'HTTP 503 from the billing endpoint', '{"order":10376,"total":"8.00"}'],
];

/** One dead letter's row, as kyu draws it. @param {(string | number)[]} letter */
const row = ([key, died, sub, tries, why, payload]) => `<tr data-kp-row-key="${key}" data-kp-row-label="${key} on ${sub}">
        <td><input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select ${key}" /></td>
        <td>${died}</td><td>${sub}</td><td class="kp-text-end">${tries}</td><td>${why}</td>
        <td><code>${payload}</code></td>
        <td><button type="button" class="kp-button kp-button--sm">Requeue</button></td>
    </tr>`;

/** The dead letters table: kyu's columns, the empty slot, the status line. @param {string} id @param {(string | number)[][]} letters */
const table = (id, letters) => `<div class="kp-datatable" id="${id}" data-kp-datatable data-kp-cards data-kp-page-size="50" data-kp-page-sizes="none">
        <div class="kp-table-wrap"><table class="kp-table">
            <caption class="kp-sr-only">Dead letters of orders.created</caption>
            <thead><tr>
                <th scope="col"><input class="kp-field__check" type="checkbox" data-kp-select-all aria-label="Select all shown dead letters" /></th>
                <th scope="col" data-kp-sort="date">Died</th><th scope="col" data-kp-sort="text">Subscription</th>
                <th scope="col" data-kp-sort="number" class="kp-text-end">Tries</th><th scope="col" data-kp-sort="text">Why it died</th>
                <th scope="col">Payload</th><th scope="col">Actions</th>
            </tr></thead>
            <tbody>${letters.map(row).join('')}</tbody>
        </table></div>
        <div class="kp-empty" data-kp-datatable-empty hidden><div data-kp-art="done" data-kp-datatable-empty-none>
            <p class="kp-empty__title">Nothing is dead</p><p class="kp-empty__body">Every message on orders.created was delivered or is still waiting.</p>
        </div></div>
        <div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p></div>
    </div>`;

/** kyu's selection bar over the table. @param {string} id @param {string} attrs the bar's options */
const bar = (id, attrs) => `<div class="kp-selection" data-kp-selection data-kp-selection-for="${id}" data-kp-placement="sticky-top" data-kp-selection-names="names" data-kp-selection-max="6" aria-label="Selected dead letters"${attrs}>
        <div class="kp-selection__actions">
            <button type="button" class="kp-button" data-kp-selection-action="requeue">Requeue</button>
            <button type="button" class="kp-button kp-button--destructive" data-kp-selection-action="delete">Delete</button>
        </div>
    </div>`;

/** The dead letters card of a topic page. @param {string} attrs the bar's options @param {(string | number)[][]} letters */
const deadCard = (attrs, letters) => `<section class="kp-card" id="pg-dead" data-kp-state="ready" aria-labelledby="pg-dead-title">
        <div class="kp-card__header"><h2 class="kp-card__title" id="pg-dead-title">Dead letters of orders.created</h2></div>
        <p class="kp-card__body">These gave up. Nothing is lost: each one waits here until you requeue or delete it.</p>
        <div class="kp-card__stage"><div class="kp-card__data">${bar('pg-dead-table', attrs)}${table('pg-dead-table', letters)}</div></div>
    </section>`;

/** The head of kyu's topic page: the topic's name and what it is. */
const head = () => `<header class="pg-stage__head">
        <div><h2>orders.created</h2><p>Every order the shop takes, for billing, the mailer and the warehouse.</p></div>
        <div class="pg-stage__action"><button type="button" class="kp-button" id="pg-help">Help</button></div>
    </header>`;

/** The dead letters card alone, six letters. @param {string} attrs */
export const dead = (attrs) => `${head()}${deadCard(attrs, DEAD)}`;

/** A day of dead letters: 30 rows, so the card is taller than the window, as on a busy topic. */
const DAY = Array.from({ length: 30 }, (_, i) => {
    const [, , sub, tries, why, payload] = DEAD[i % DEAD.length];
    const minute = String(59 - (i % 60)).padStart(2, '0');
    return [`d-${4812 - i}`, `02/11/2026 ${String(9 - Math.floor(i / 6)).padStart(2, '0')}:${minute}`, sub, tries, why, payload];
});
/** The topic page with a busy day's dead letters, for the tour. @param {string} attrs */
export const busy = (attrs) => `${head()}${deadCard(attrs, DAY)}`;
