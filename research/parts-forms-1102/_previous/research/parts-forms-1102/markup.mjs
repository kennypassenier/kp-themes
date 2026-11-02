// research/parts-forms-1102: the controls and the components' markup, written once; sections.mjs places them. Every component is the
// package's own (kp- classes, attached by js/auto.js); the pg- classes are this page's frame. Names, counts and values are mock, in the
// shapes of Almanac, Kitchen and Medicine Cabinet.

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

/** A data table's frame: its status bar, its table with a caption, and its empty slot. */
const table = (id, caption, heads, rows, extra = '') => `<div class="kp-datatable" id="${id}" data-kp-datatable data-kp-cards data-kp-page-sizes="none" data-kp-filter-ui="none"${extra}>
                    <div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status"></p></div>
                    <div class="kp-table-wrap">
                        <table class="kp-table">
                            <caption class="kp-sr-only">${caption}</caption>
                            <thead><tr>${heads}</tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                    <div class="kp-empty" data-kp-datatable-empty hidden></div>
                </div>`;

// ---------------------------------------------------------------- 1 · the chip filter (Almanac's deliveries)
/** The deliveries table under its chips; demo.js writes the rows from data.js. */
export const deliveries = () => `<div class="pg-stack">
                <div class="kp-segmented kp-segmented--chips" id="pg-delivery-chips" data-kp-segmented="single" aria-label="Show deliveries" data-kp-filter-for="pg-deliveries" data-kp-filter-column="status"></div>
                ${table(
                    'pg-deliveries',
                    'Deliveries of the last day',
                    '<th scope="col" data-kp-sort="text" data-kp-field="event">Event</th><th scope="col" data-kp-sort="text" data-kp-field="status" data-kp-filter="choice" data-kp-filter-options="Delivered,Retrying,Failed">Status</th><th scope="col" data-kp-sort="text" data-kp-field="calendar">Calendar</th><th scope="col" data-kp-sort="date" data-kp-field="at">Sent</th>',
                    '',
                )}
            </div>`;

// ---------------------------------------------------------------- 2 · the add row (Kitchen's What I ate; Medicine Cabinet's forms)
/** Kitchen's "What I ate": the add row over the table, its fields under the columns. */
export const meals = () => `<div class="pg-stack">
                <form class="kp-addrow" id="pg-meal-add" data-kp-addrow data-kp-addrow-for="pg-meals" data-kp-form novalidate aria-label="Add what you ate">
                    <div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
                    <div class="kp-addrow__cells">
                        <div class="kp-field kp-addrow__cell" data-kp-addrow-column="dish"><label class="kp-field__label" for="pg-new-dish">Dish</label><input class="kp-field__input" id="pg-new-dish" name="dish" required placeholder="What did you eat?" autocomplete="off" /><span class="kp-field__error" data-kp-field-error hidden></span></div>
                        <div class="kp-field kp-addrow__cell" data-kp-addrow-column="meal"><label class="kp-field__label" for="pg-new-meal">Meal</label><select class="kp-field__input" id="pg-new-meal" name="meal"><option>Breakfast</option><option>Lunch</option><option selected>Dinner</option><option>Snack</option></select><span class="kp-field__error" data-kp-field-error hidden></span></div>
                        <div class="kp-field kp-addrow__cell" data-kp-addrow-column="portions"><label class="kp-field__label" for="pg-new-portions">Portions</label><input class="kp-field__input" id="pg-new-portions" name="portions" type="number" min="1" max="9" step="1" value="1" required /><span class="kp-field__error" data-kp-field-error hidden></span></div>
                        <div class="kp-addrow__submit"><button type="submit" class="kp-button kp-button--primary" data-kp-submit data-kp-busy="Adding…">Add</button></div>
                    </div>
                </form>
                ${table(
                    'pg-meals',
                    'What I ate today',
                    '<th scope="col" data-kp-sort="text" data-kp-field="dish">Dish</th><th scope="col" data-kp-sort="text" data-kp-field="meal">Meal</th><th scope="col" data-kp-sort="number" data-kp-field="portions" data-kp-edit="number">Portions</th><th scope="col" data-kp-field="actions"><span class="kp-sr-only">Actions</span></th>',
                    '',
                )}
                ${log('pg-meal-log')}
            </div>`;

/** Medicine Cabinet's "Manage forms": one line of a form grid, name and unit with Add, the refusal under it. */
export const formsLine = () => `<div class="kp-formgrid pg-forms" aria-label="Forms of medicine">
                <div class="kp-formgrid__row"><span class="kp-formgrid__label">Forms</span><div class="kp-formgrid__control"><ul class="kp-tag-list" id="pg-forms-list" aria-label="Forms you use"><li class="kp-tag">Tablet · tablets</li><li class="kp-tag">Capsule · capsules</li><li class="kp-tag">Drops · ml</li></ul></div></div>
                <form class="kp-addrow kp-addrow--line" id="pg-form-add" data-kp-addrow data-kp-form novalidate aria-label="Add a form">
                    <div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
                    <div class="kp-formgrid__row">
                        <span class="kp-formgrid__label">New form</span>
                        <div class="kp-formgrid__control kp-addrow__fields">
                            <div class="kp-field"><label class="kp-field__label" for="pg-form-name">Name</label><input class="kp-field__input" id="pg-form-name" name="name" required placeholder="Name, e.g. Sachet" autocomplete="off" /><span class="kp-field__error" data-kp-field-error hidden></span></div>
                            <div class="kp-field"><label class="kp-field__label" for="pg-form-unit">Unit</label><input class="kp-field__input" id="pg-form-unit" name="unit" required placeholder="Unit, e.g. sachets" autocomplete="off" /><span class="kp-field__error" data-kp-field-error hidden></span></div>
                        </div>
                        <div class="kp-formgrid__actions"><button type="submit" class="kp-button kp-button--primary" data-kp-submit data-kp-busy="Adding…">Add</button></div>
                    </div>
                </form>
            </div>`;

// ---------------------------------------------------------------- 3 · the unsaved bar counting custom controls (Medicine Cabinet's medicine form)
const slot = (name, time, days) => `<div class="kp-rows__cell" data-label="Time"><div class="kp-time" data-kp-time data-kp-name="${name}" data-kp-value="${time}" data-kp-label="Time" data-kp-time-step="5"></div></div>
<div class="kp-rows__cell" data-label="Days"><div class="kp-weekdays" data-kp-weekdays data-kp-track-value data-kp-value="${days}" data-kp-presets="false" data-kp-summary="false" aria-label="Days"></div></div>`;

/** The medicine form: a name, the form as chips, the days and the times, each counted by the bar in the header. */
export const medicineForm = () => `<div class="pg-stack" id="pg-med">
                <header class="kp-page-header">
                    <div class="kp-page-header__inner">
                        <div class="kp-page-header__text">
                            <h3 class="kp-page-header__title">Ibuprofen 400</h3>
                            <p class="kp-page-header__description">Change the form, the days or the times: the bar counts each of them as one change.</p>
                        </div>
                        <div class="kp-page-header__actions">
                            <div class="kp-unsaved" data-kp-unsaved id="pg-med-bar" data-kp-unsaved-for="#pg-med-form" data-kp-name="pg-med" data-kp-dock="container" data-kp-placement="header" data-kp-keep="off" data-kp-warn-leave="app" data-kp-undo-ms="8000"></div>
                        </div>
                    </div>
                </header>
                <form class="kp-formgrid" id="pg-med-form" action="#" aria-label="Ibuprofen 400">
                    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="pg-med-name">Name</label><div class="kp-formgrid__control" data-kp-formgrid-span="wide"><input class="kp-field__input" id="pg-med-name" name="name" value="Ibuprofen 400" /></div></div>
                    <div class="kp-formgrid__row" data-kp-name="Form"><span class="kp-formgrid__label">Form</span><div class="kp-formgrid__control" data-kp-formgrid-span="wide"><div class="kp-segmented kp-segmented--block" data-kp-segmented="single" data-kp-track-value aria-label="Form"><button type="button" class="kp-segmented__item" data-value="tablet" aria-checked="true">Tablet</button><button type="button" class="kp-segmented__item" data-value="capsule">Capsule</button><button type="button" class="kp-segmented__item" data-value="drops">Drops</button></div></div></div>
                    <div class="kp-formgrid__row" data-kp-name="When to take it"><span class="kp-formgrid__label">When to take it</span><div class="kp-formgrid__control" data-kp-formgrid-span="wide">
                        <div class="kp-rows" id="pg-med-rows" data-kp-rows data-kp-track-value data-kp-rows-min="1" data-kp-rows-max="4" data-kp-rows-unit="time,times" aria-label="When to take it">
                            <ol class="kp-rows__list" data-kp-rows-list><li class="kp-rows__row">${slot('pg-at-a', '08:00', '1,2,3,4,5')}</li><li class="kp-rows__row">${slot('pg-at-b', '20:00', '0,1,2,3,4,5,6')}</li></ol>
                            <template data-kp-rows-template><li class="kp-rows__row">${slot('pg-at-{n}', '12:00', '0,1,2,3,4,5,6')}</li></template>
                        </div>
                    </div></div>
                </form>
                <p class="pg-links"><a href="?view=cabinet" id="pg-med-leave">Back to the cabinet</a></p>
                ${log('pg-med-log')}
            </div>`;

// ---------------------------------------------------------------- 4 · a chip's menu and rename (Medicine Cabinet's categories)
const menu = (name) => `<div class="kp-menu-button kp-segmented__menu" data-kp-menu-button><button type="button" class="kp-icon-button">⋯</button><div class="kp-menu" role="menu" aria-label="${name}"><button type="button" class="kp-menu__item" role="menuitem" data-kp-segmented-rename>Rename</button><button type="button" class="kp-menu__item" role="menuitem" data-kp-value="delete">Delete</button></div></div>`;
const chip = ([value, label, count, on]) =>
    `<button type="button" class="kp-segmented__item" data-value="${value}" aria-checked="${on ? 'true' : 'false'}"><span class="kp-segmented__label">${label}</span><span class="kp-segmented__count">${count}</span></button>`;

/** The category chips, each but All with its ⋯ menu. */
export const categories = () => `<div class="pg-stack">
                <div class="kp-segmented kp-segmented--chips" id="pg-cats" data-kp-segmented="single" aria-label="Category">
                    ${chip(['all', 'All', 14, true])}
                    ${[['pain', 'Pain', 4], ['fever', 'Fever', 3], ['allergy', 'Allergy', 2], ['stomach', 'Stomach', 5]].map((c) => chip(c) + menu(`Actions for ${c[1]}`)).join('\n                    ')}
                </div>
                ${log('pg-cats-log')}
            </div>`;

// ---------------------------------------------------------------- 5 · run notes and tries left (Almanac's retries)
/** The next tries of a failed delivery, with notes, and the delivery timeline with tries left per lane. */
export const retries = () => `<div class="pg-stack">
                <div class="kp-runs" id="pg-runs" data-kp-runs data-kp-runs-count="3" data-kp-runs-title="Next tries of “Dentist, Thursday”" data-kp-now="2026-11-02T09:00:00+01:00"></div>
                <div class="kp-gantt" id="pg-gantt" role="region" data-kp-gantt data-kp-gantt-toolbar="off" data-kp-gantt-hint="off" data-kp-gantt-range="6h" aria-label="Deliveries of the last 6 hours"></div>
            </div>`;
