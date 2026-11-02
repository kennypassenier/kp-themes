// research/tip-1102: the one section of the review page, written once: what is asked, the heading and one sentence, what to
// expect, what to look at, the controls and the component. The component is Kitchen's ingredient table on the package's own
// data table, run inline on this page (no stage frame): the data table falls into its cards when its own box is narrower
// than 40rem, so the 390 px width is a 390 px box, and the tooltip is the package's, drawn on the top layer.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (/** @type {string} */ label, /** @type {string} */ name, /** @type {[string, string, boolean?][]} */ buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** Kitchen's ingredients: [key, name, category, used by, the reason its Delete is off (empty: nothing uses it)]. Mock data. */
const INGREDIENTS = [
    ['garlic', 'Garlic', 'Vegetables', '1 dish and 2 recipes', 'Used by 1 dish and 2 recipes: Pasta aglio e olio (dish), Garlic bread (recipe), Roast chicken (recipe). Take it out of them first.'],
    ['olive-oil', 'Olive oil', 'Oils and fats', '6 dishes and 4 recipes', 'Used by 6 dishes and 4 recipes'],
    ['saffron', 'Saffron', 'Spices', 'Nothing', ''],
    ['parmesan', 'Parmesan', 'Dairy', '2 dishes', 'Used by 2 dishes: Pasta carbonara (dish), Risotto (dish). Take it out of them first.'],
];

/** One row: Edit always on, Delete off with its reason while something uses the ingredient. */
const row = (/** @type {string[]} */ [key, name, category, usedBy, reason]) =>
    `<tr data-kp-row-key="${key}"><td>${name}</td><td>${category}</td><td>${usedBy}</td><td><div class="kp-row-actions">` +
    `<button type="button" class="kp-button kp-button--sm" data-kp-action="edit" aria-label="Edit ${name}">Edit</button>` +
    `<button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete" aria-label="Delete ${name}"${reason ? ` disabled data-kp-disabled-reason="${reason}"` : ''}${key === 'garlic' ? ' data-pg-reason' : ''}>Delete</button>` +
    `</div></td></tr>`;

const TABLE = `<div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-page-size="10">
    <div class="kp-table-wrap">
        <table class="kp-table">
            <caption>Ingredients</caption>
            <thead><tr>
                <th scope="col" data-kp-sort="text">Name</th>
                <th scope="col" data-kp-sort="text">Category</th>
                <th scope="col">Used by</th>
                <th scope="col" data-kp-col="actions">Actions</th>
            </tr></thead>
            <tbody>${INGREDIENTS.map(row).join('')}</tbody>
        </table>
    </div>
    <div class="kp-datatable__bar">
        <p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
        <div class="kp-datatable__pager" data-kp-datatable-pager></div>
    </div>
</div>`;

export const SECTIONS = [
    {
        id: 'reason-in-table',
        title: 'The reason of a disabled Delete, whole inside a table',
        topic: 'reason',
        topicTitle: 'The reason of a disabled button',
        item: 'kitchen-1101, disabled reason',
        asked: 'In Kitchen the reason of a disabled Delete was cut at the edge of the table&rsquo;s card on a phone (&ldquo;In gebruik door 1 gerecht en 2 rece&hellip;&rdquo;) and ran under the next row on a laptop. The tooltip now stands on the top layer above the page, and wraps at its own width, so no table, card or dialog round the button can cut it. A tooltip that was never cut looks exactly as before (measured in all twelve themes).',
        h2: 'Ingredients',
        intro: 'Kitchen&rsquo;s ingredients with Garlic&rsquo;s Delete turned off, because a dish and two recipes still use it.',
        expected: [
            '<b>Reason shown</b>: under Garlic&rsquo;s Delete the reason in formal&rsquo;s tooltip, every word of it on three or four lines, over the rows below rather than under them; nothing of it is cut by the table or its card.',
            '<b>Phone, 390 px</b>: the rows are cards; the tooltip stays inside the window, wrapped, and is not cut at the card&rsquo;s edge. <b>At rest</b>: no tooltip; hover any grey Delete (or Tab to it where the browser allows) to see its reason, and Escape hides it.',
        ],
        look: 'Formal: the approved tooltip (hairline frame, small capitals). Check that the whole sentence is readable and the plate is the same as on any other tooltip.',
        controls:
            group('Reason', 'reason', [['shown', 'Reason shown', true], ['rest', 'At rest']], 'reason-in-table-component') +
            group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], 'reason-in-table-component'),
        component: `<div class="pg-room" data-review-room>${TABLE}</div>`,
    },
];
