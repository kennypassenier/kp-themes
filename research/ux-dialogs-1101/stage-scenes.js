// research/ux-dialogs-1101: the scenes a stage frame shows, each written once from an app's own data (Kitchen's dish
// categories and recipe editor, Medicine Cabinet's symptoms, HTTPSwitchboard's profiles, kyu's dead letters and
// subscriptions). Names, counts and dates are mock. stage.js mounts one and wires it.

/** A form-grid row: label, control, hint. @param {string} id @param {string} label @param {string} control @param {string} [hint] */
const row = (id, label, control, hint = '') => `<div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="${id}">${label}</label>
        <div class="kp-formgrid__control">${control}</div>
        <p class="kp-formgrid__value">${hint}</p>
    </div>`;
const input = (/** @type {string} */ id, /** @type {string} */ value) => `<input class="kp-field__input" id="${id}" name="${id}" type="text" autocomplete="off" value="${value}" />`;
const select = (/** @type {string} */ id, /** @type {string[]} */ options, /** @type {string} */ chosen) =>
    `<select class="kp-field__input" id="${id}" name="${id}">${options.map((o) => `<option${o === chosen ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
/** A data table: caption, head, rows (each [key, cells, action]). */
const table = (/** @type {string} */ id, /** @type {string} */ caption, /** @type {string[]} */ head, /** @type {[string, string[], string][]} */ rows) => `<div class="kp-datatable" id="${id}" data-kp-datatable data-kp-page-size="25" data-kp-page-sizes="none">
        <div class="kp-table-wrap"><table class="kp-table"><caption>${caption}</caption>
        <thead><tr>${head.map((h, i) => `<th scope="col"${i < head.length - 1 ? ' data-kp-sort="text"' : ''}>${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(([key, cells, action]) => `<tr data-kp-row-key="${key}">${cells.map((c) => `<td>${c}</td>`).join('')}<td>${action}</td></tr>`).join('')}</tbody></table></div>
        <div class="kp-empty" data-kp-datatable-empty hidden><p class="kp-empty__title">Nothing here yet</p></div>
    </div>`;
/** The head of a stage: what the page is, in one sentence, and its one action. */
const head = (/** @type {string} */ title, /** @type {string} */ text, /** @type {string} */ action) => `<header class="pg-stage__head">
        <div><h2>${title}</h2><p>${text}</p></div>
        <div class="pg-stage__action">${action}</div>
    </header>`;
const close = (/** @type {string} */ label) => `<button type="button" class="kp-icon-button kp-dialog__close" data-kp-dialog-close aria-label="${label}">✕</button>`;

// ---------------------------------------------------------------- Kitchen: dish categories and the category drawer
export const CATEGORIES = [
    ['soups', 'Soepen', 'Soups', 6],
    ['pasta', 'Pasta', 'Pasta', 9],
    ['stews', 'Stoofpotten', 'Stews', 4],
    ['salads', 'Salades', 'Salads', 5],
    ['rice', 'Rijstgerechten', 'Rice dishes', 3],
    ['sweet', 'Desserts', 'Desserts', 2],
];
const categoryDrawer = (/** @type {string} */ attrs) => `<dialog class="kp-drawer kp-dialog" id="pg-cat-drawer" aria-labelledby="pg-cat-title"${attrs}>
        <header class="kp-drawer__head">
            <h2 class="kp-dialog__title" id="pg-cat-title">Add a category</h2>
            ${close('Close without saving')}
            <p class="kp-drawer__desc">A category keeps the dishes in order on the wheel and in the lists.</p>
        </header>
        <form class="kp-drawer__body" id="pg-cat-form"><div class="kp-formgrid">
            ${row('pg-cat-nl', 'Dutch name', input('pg-cat-nl', ''))}
            ${row('pg-cat-en', 'English name', input('pg-cat-en', ''))}
            ${row('pg-cat-order', 'Place in the list', select('pg-cat-order', ['First', 'After Soups', 'After Pasta', 'Last'], 'Last'))}
        </div></form>
        <footer class="kp-drawer__foot"><div class="kp-dialog__actions">
            <button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>
            <button type="submit" class="kp-button kp-button--primary" form="pg-cat-form">Add the category</button>
        </div></footer>
    </dialog>`;
/** @param {string} attrs the drawer's options */
export const categories = (attrs) => `${head('Dish categories', 'The categories the wheel and the dish lists are sorted by.', '<button type="button" class="kp-button kp-button--primary" data-kp-dialog="pg-cat-drawer" id="pg-cat-add">Add a category</button>')}
    <div class="pg-stage__room" data-kp-drawer-room>${table(
        'pg-cats',
        'Dish categories',
        ['Dutch', 'English', 'Dishes', '<span class="kp-sr-only">Actions</span>'],
        CATEGORIES.map(([key, nl, en, n]) => [
            String(key),
            [String(nl), String(en), String(n)],
            `<button type="button" class="kp-button kp-button--sm" data-kp-dialog="pg-cat-drawer" data-pg-cat="${key}">Edit</button>`,
        ]),
    )}</div>
    ${categoryDrawer(attrs)}`;

// ---------------------------------------------------------------- Kitchen: the recipe editor
const RECIPES = [
    ['carbonara', 'Pasta carbonara', 'Pasta', '25 min'],
    ['daube', 'Daube provençale', 'Stews', '3 h 10 min'],
    ['fried-rice', 'Egg fried rice', 'Rice dishes', '20 min'],
];
/** @param {string} attrs the drawer's options */
export const recipe = (attrs) => `${head('Recipes', 'Every recipe the cook plan can use, with its time and its steps.', '<button type="button" class="kp-button kp-button--primary" data-kp-dialog="pg-recipe-drawer" id="pg-recipe-add">Add a recipe</button>')}
    ${table(
        'pg-recipes',
        'Recipes',
        ['Recipe', 'Category', 'Time', '<span class="kp-sr-only">Actions</span>'],
        RECIPES.map(([key, name, cat, time]) => [key, [name, cat, time], `<button type="button" class="kp-button kp-button--sm" data-kp-dialog="pg-recipe-drawer" id="pg-edit-${key}">Edit</button>`]),
    )}
    <dialog class="kp-drawer kp-dialog" id="pg-recipe-drawer" aria-labelledby="pg-recipe-title"${attrs}>
        <header class="kp-drawer__head">
            <h2 class="kp-dialog__title" id="pg-recipe-title">Edit Pasta carbonara</h2>
            ${close('Close without saving')}
            <p class="kp-drawer__desc">Changes show in the cook plan once you save them.</p>
        </header>
        <form class="kp-drawer__body" id="pg-recipe-form"><div class="kp-formgrid">
            ${row('pg-r-nl', 'Dutch name', input('pg-r-nl', 'Pasta carbonara'))}
            ${row('pg-r-en', 'English name', input('pg-r-en', 'Pasta carbonara'))}
            ${row('pg-r-cat', 'Category', select('pg-r-cat', ['Soups', 'Pasta', 'Stews', 'Salads', 'Rice dishes', 'Desserts'], 'Pasta'))}
            ${row('pg-r-time', 'Time', '<input class="kp-field__input kp-field__input--short" id="pg-r-time" name="pg-r-time" type="number" min="5" step="5" value="25" />', 'minutes, from the first pan to the plate')}
            ${row('pg-r-steps', 'Steps', '<textarea class="kp-field__input" id="pg-r-steps" name="pg-r-steps" rows="5">Cook the spaghetti in salted water.\nFry the guanciale until crisp.\nBeat the eggs with the pecorino.\nToss the pasta off the heat with the eggs and a splash of water.</textarea>', 'one step per line')}
        </div></form>
        <footer class="kp-drawer__foot"><div class="kp-dialog__actions">
            <button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>
            <button type="submit" class="kp-button kp-button--primary" form="pg-recipe-form">Save the recipe</button>
        </div></footer>
    </dialog>`;

// ---------------------------------------------------------------- Medicine Cabinet: symptoms and Add symptom
const SYMPTOMS = [
    ['headache', 'Headache', 'Pain', 3],
    ['fever', 'Fever', 'Pain', 2],
    ['hay-fever', 'Hay fever', 'Allergy', 1],
    ['heartburn', 'Heartburn', 'Stomach', 1],
    ['cough', 'Dry cough', 'Cold and flu', 2],
];
/** @param {string} attrs the dialog's options */
export const symptoms = (attrs) => `${head('Symptoms', 'What you take medicine for, and where it is listed.', '<button type="button" class="kp-button kp-button--primary" data-kp-dialog="pg-sym-dialog" id="pg-sym-add">Add symptom</button>')}
    ${table(
        'pg-syms',
        'Symptoms',
        ['Symptom', 'Category', 'Medicines', '<span class="kp-sr-only">Actions</span>'],
        SYMPTOMS.map(([key, name, cat, n]) => [String(key), [String(name), String(cat), String(n)], '<button type="button" class="kp-button kp-button--sm">Edit</button>']),
    )}
    <dialog class="kp-dialog kp-dialog--wide" id="pg-sym-dialog" aria-labelledby="pg-sym-title"${attrs}>
        <h2 class="kp-dialog__title" id="pg-sym-title">Add a symptom</h2>
        <p class="kp-dialog__description">Name what you take medicine for and where it is listed.</p>
        <form class="kp-dialog__body" id="pg-sym-form" method="dialog"><div class="kp-formgrid">
            ${row('pg-sym-name', 'Name', '<input class="kp-field__input" id="pg-sym-name" name="name" type="text" placeholder="e.g. headache" required />')}
            ${row('pg-sym-cat', 'Category', select('pg-sym-cat', ['Uncategorised', 'Pain', 'Allergy', 'Stomach', 'Cold and flu'], 'Uncategorised'))}
        </div></form>
        <div class="kp-dialog__actions">
            <button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>
            <button type="submit" class="kp-button kp-button--primary" form="pg-sym-form" value="add">Add symptom</button>
        </div>
    </dialog>`;

// ---------------------------------------------------------------- HTTPSwitchboard: Manage profiles
const PROFILES = [
    ['home', 'Home', '12 routes', 'In use'],
    ['work', 'Work', '7 routes', ''],
    ['travel', 'Travel', '3 routes', ''],
];
/** @param {string} attrs the dialog's options */
export const profiles = (attrs) => `${head('Profiles', 'A profile is a set of routes you switch on together.', '<button type="button" class="kp-button kp-button--primary" data-kp-dialog="pg-prof-dialog" id="pg-prof-open">Manage profiles</button>')}
    <dialog class="kp-dialog kp-dialog--wide" id="pg-prof-dialog" aria-labelledby="pg-prof-title"${attrs}>
        <h2 class="kp-dialog__title" id="pg-prof-title">Manage profiles</h2>
        ${close('Close')}
        <p class="kp-dialog__description">Rename a profile or delete one you no longer use; the profile in use cannot be deleted.</p>
        <div class="kp-dialog__body"><div class="kp-formgrid">${PROFILES.map(
            ([key, name, routes, used]) => `<div class="kp-formgrid__row">
                <label class="kp-formgrid__label" for="pg-prof-${key}">Name</label>
                <div class="kp-formgrid__control">${input(`pg-prof-${key}`, name)}</div>
                <p class="kp-formgrid__value">${routes}${used ? ` · ${used}` : ''}</p>
                <div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-destructive data-kp-confirm="Delete profile ${name}?" data-kp-confirm-label="Delete ${name}" id="pg-del-${key}"${used ? ' disabled title="The profile in use cannot be deleted"' : ''}>Delete…</button></div>
            </div>`,
        ).join('')}</div></div>
    </dialog>`;

// ---------------------------------------------------------------- kyu: dead letters, and a subscription's typed delete
/** @param {string} attrs the Prune button's words and options */
export const prune = (attrs) => `${head('Dead letters', 'Messages no subscriber took after every retry; they are kept for 14 days.', `<button type="button" class="kp-button kp-button--destructive" data-kp-destructive id="pg-prune"${attrs}>Prune 8 dead letters</button>`)}
    ${table(
        'pg-dead',
        'Dead letters',
        ['Topic', 'Subscriber', 'Last try', '<span class="kp-sr-only">Actions</span>'],
        [
            ['d1', ['orders', 'orders-to-ha', '31/10/2026 22:14'], '<button type="button" class="kp-button kp-button--sm">Retry</button>'],
            ['d2', ['orders', 'orders-to-ha', '31/10/2026 22:09'], '<button type="button" class="kp-button kp-button--sm">Retry</button>'],
            ['d3', ['doorbell', 'doorbell-chime', '30/10/2026 07:41'], '<button type="button" class="kp-button kp-button--sm">Retry</button>'],
        ],
    )}`;
export const typed = () => `${head('Subscriptions of orders', 'Who receives the messages published on this topic.', '')}
    ${table(
        'pg-subs',
        'Subscriptions',
        ['Subscription', 'Sends to', 'Delivered', '<span class="kp-sr-only">Actions</span>'],
        [
            ['orders-to-ha', ['orders-to-ha', 'Home Assistant webhook', '1284'], '<button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-destructive data-kp-confirm="Delete subscription orders-to-ha and its delivery history?" data-kp-confirm-type="orders-to-ha" data-kp-confirm-loses="pg-loses" id="pg-del-sub">Delete…</button>'],
            ['orders-to-log', ['orders-to-log', 'The log file', '1290'], '<button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete…</button>'],
        ],
    )}
    <template id="pg-loses"><ul class="kp-type-confirm__list">
        <li>The subscription orders-to-ha and its filter (priority high and up)</li>
        <li>1284 deliveries in its history, the oldest from 02/09/2026</li>
        <li>3 messages waiting for a retry</li>
    </ul></template>`;
