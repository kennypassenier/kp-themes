// Builds research/medicine-1030/demo.html: the thirteen items of the Medicine Cabinet package Kenny approved on 2026-10-30 20:05
// (kp-gaps/medicine-cabinet-workpackage.md), as ONE review page (DEMO_RULES ch. 1 and 6: one page, formal only, one section per item,
// at most 25 items). Eight items are new parts or options, five are fixes; each fix shows Before and After. Every section is written
// here once: what is asked, the heading and one sentence, what to expect, what to look at, the controls and the component, in the
// shape research/wishes-1028 uses. demo.js wires them by their own elements; page.css is the frame. The data is the Medicine Cabinet
// app's own shape (medicines, doses, symptoms, forms); the names, counts and times are mock.
// Run: node research/medicine-1030/build.mjs (the page keeps its round id until the verdict is recorded).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'medicine-1030';
const THEMES = ['formal'];
const MAX_ITEMS = 25;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]; `toggle: false` makes plain action buttons (no aria-pressed). */
const group = (label, name, buttons, target = '', toggle = true) =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} ${toggle ? ` aria-pressed="${on ? 'true' : 'false'}"` : ''}>${words}</button>`,
        )
        .join('')}</div>`;

/** The width group every component section has: the stage at full width, or at a phone's 390 px. */
const widths = (id) =>
    group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], `${id}-component`);

/** The medicines of the mock Cabinet: [name, what it is, stock, unit, unit one, active, badges]. */
const MEDS = [
    ['Ibuprofen 400 mg', 'Film-coated tablet · pain and fever', 14, 'tablets', 'tablet', true, [['Low stock', 'warning'], ['Expires 03/2027']]],
    ['Paracetamol 500 mg', 'Tablet · pain and fever', 32, 'tablets', 'tablet', true, [['In stock', 'success']]],
    ['Cetirizine 10 mg', 'Tablet · hay fever', 8, 'tablets', 'tablet', true, [['Low stock', 'warning'], ['Take as needed']]],
    ['Vitamin D3 25 µg', 'Capsule · supplement', 60, 'capsules', 'capsule', true, [['On schedule'], ['Expires 11/2026', 'warning'], ['Refill on 12/11']]],
    ['Amoxicillin 500 mg', 'Capsule · antibiotic course', 0, 'capsules', 'capsule', false, [['Course ended'], ['Expired 09/2026', 'destructive']]],
    ['Saline nasal spray', 'Spray · congestion', 1, 'bottles', 'bottle', true, [['Opened 30 days ago', 'warning']]],
];

const badge = ([words, tone]) => `<span class="kp-badge${tone ? ` kp-badge--${tone}` : ''}">${words}</span>`;
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** One row of the Cabinet list: identity, status, stepper and switch. */
const listRow = ([name, meta, stock, unit, one, active, badges]) => `<li class="kp-listrow${active ? '' : ' kp-listrow--muted'}">
    <div class="kp-listrow__identity"><strong class="kp-listrow__name">${name}</strong><span class="kp-listrow__meta">${meta}</span></div>
    <div class="kp-listrow__status"><div class="kp-badges">${badges.map(badge).join('')}</div></div>
    <div class="kp-listrow__stepper"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="${unit}" data-kp-quantity-unit-one="${one}" data-kp-quantity-label="Stock of ${name}"><input class="kp-quantity__input" value="${stock}" /></div></div>
    <div class="kp-listrow__switch"><label class="kp-switch" data-kp-switch-state="none"><input class="kp-switch__input" type="checkbox" role="switch"${active ? ' checked' : ''} aria-label="Active: ${name}" /><span>Active</span></label></div>
</li>`;

/** A card with the package's own data states around whatever the data is. */
const stateCard = (id, title, note, data) => `<div class="kp-card" role="region" id="${id}" data-kp-state="ready" aria-labelledby="${id}-t">
    <div class="kp-card__header"><h3 class="kp-card__title" id="${id}-t">${title}</h3></div>
    <p class="kp-card__body">${note}</p>
    <div class="kp-card__stage"><div class="kp-card__data">${data}</div></div>
</div>`;

const STATES = group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]);
const stateFor = (id) => STATES.replaceAll('data-pg="state"', `data-pg="state" data-target="${id}"`);

/** A time, the days and a dose: one slot of "When to take it". `n` is the row template's counter. */
const slot = (n, time, days, dose) => `<li class="kp-rows__row">
    <div class="kp-rows__cell" data-label="Time"><div class="kp-time" data-kp-time data-kp-name="at-${n}" data-kp-value="${time}" data-kp-label="Time" data-kp-time-step="5"></div></div>
    <div class="kp-rows__cell" data-label="Days"><div class="kp-weekdays" data-kp-weekdays data-kp-value="${days}" data-kp-presets="false" data-kp-summary="false" aria-label="Days"></div></div>
    <div class="kp-rows__cell" data-label="Dose"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="1" data-kp-quantity-max="10" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Dose"><input class="kp-quantity__input" value="${dose}" /></div></div>
</li>`;

/** The forms the medicine form offers, for the pills and the managed table. */
const FORMS = [['Tablet', 12], ['Capsule', 7], ['Syrup', 3], ['Spray', 2], ['Drops', 4], ['Cream', 5]];
const FORM_ROWS = FORMS.map(
    ([name, used]) =>
        `<tr data-kp-row-key="${slug(name)}"><td>${name}</td><td>${used}</td><td><div class="kp-table__actions"><button type="button" class="kp-button kp-button--sm">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete</button></div></td></tr>`,
).join('');
const formsTable = (id, extra = '') => `<div class="kp-datatable" id="${id}" data-kp-datatable data-kp-cards ${extra} data-kp-busy-overlay data-kp-page-size="25" data-kp-page-sizes="none">
    <div class="kp-table-wrap"><table class="kp-table"><caption>Forms of medicine</caption>
    <thead><tr><th scope="col" data-kp-field="form" data-kp-sort="text">Form</th><th scope="col" data-kp-field="used" data-kp-sort="number">Medicines</th><th scope="col" data-kp-col="actions">Actions</th></tr></thead>
    <tbody>${FORM_ROWS}</tbody></table></div>
    <div class="kp-empty" data-kp-datatable-empty hidden><strong class="kp-empty__title">No forms yet</strong><span class="kp-stateplate__text">Add the first form of medicine to pick it in the medicine form.</span></div>
</div>`;

/** A form grid of the medicine form's text fields (gap 4). */
const fieldGrid = (id, attributes = '') => `<div class="kp-formgrid" id="${id}" ${attributes}>
    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="${id}-name">Name</label><div class="kp-formgrid__control"><input class="kp-field__input" id="${id}-name" value="Ibuprofen 400 mg" /></div><p class="kp-formgrid__value">as on the box</p></div>
    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="${id}-note">Note</label><div class="kp-formgrid__control"><input class="kp-field__input" id="${id}-note" placeholder="Take with food" /></div><p class="kp-formgrid__value">optional</p></div>
    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="${id}-at">First dose</label><div class="kp-formgrid__control"><div class="kp-time" data-kp-time data-kp-value="08:00" data-kp-label="First dose" data-kp-time-id="${id}-at"></div></div><p class="kp-formgrid__value">24 hours</p></div>
    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="${id}-strength">Strength</label><div class="kp-formgrid__control"><select class="kp-field__input" id="${id}-strength"><option>200 mg</option><option selected>400 mg</option><option>600 mg</option></select></div><p class="kp-formgrid__value">per tablet</p></div>
</div>`;

const SYMPTOMS = ['Headache', 'Fever', 'Sore throat', 'Hay fever', 'Nausea', 'Back pain'];
const chip = (value, label, on) => `<button type="button" class="kp-segmented__item" data-value="${value}" role="radio" aria-checked="${on ? 'true' : 'false'}"><span class="kp-segmented__label">${label}</span></button>`;
const chipMulti = (value, label) => `<button type="button" class="kp-segmented__item" data-value="${value}" aria-pressed="false"><span class="kp-segmented__label">${label}</span></button>`;
const options = (list) => list.map((name) => `<li class="kp-combobox__option" role="option" data-kp-option data-value="${slug(name)}">${name}</li>`).join('');

/** @type {{ id: string, title: string, topic: string, topicTitle?: string, item: string, asked: string, h2: string, intro: string, expected: string[], look: string, controls: string, component: string }[]} */
const SECTIONS = [
    // ---------------------------------------------------------------- the Cabinet list
    {
        id: 'list-row',
        title: 'A list of rows with an identity, a status, a stepper and a switch',
        topic: 'list',
        topicTitle: 'The Cabinet list',
        item: 'item 1 · Medicine Cabinet gap 1',
        asked:
            'A list where every row holds several controls has no component: a data table is the wrong tool. <code>.kp-list</code> with <code>.kp-listrow</code> is one grid of four named columns and every row a subgrid of it, so the columns continue across rows, and a row is a card on a phone. Is this the row the Cabinet, Today and Symptoms lists should use?',
        h2: 'The Cabinet: six medicines',
        intro:
            'Each row: the medicine and what it is, its status badges, a stepper for the stock and a switch for whether it is in use. The list sits in the card&rsquo;s data area, so loading, empty and failed are the card&rsquo;s own.',
        expected: [
            '<b>Full width</b>: the names, the badges, the steppers and the switches stand on four edges that run down all six rows. A stepper is as wide as its column, so every stepper ends on one edge. The inactive medicine is quieter, its controls are not.',
            '<b>Phone</b>: each row is a card: the name and what it is, the badges on their own line, the stepper filling its line, the switch beside it when the line has room for both and under it when not. <b>Loading</b>, <b>Empty</b> and <b>Failed</b> fill the list&rsquo;s whole footprint with the card&rsquo;s plate and a normal Retry.',
        ],
        look: 'Formal is a paper plate: rows ruled by thin lines, nothing in a row drawn on a card of its own. Check the columns line up whatever a row holds, and that the badge column never pushes a stepper.',
        controls: stateFor('pg-cabinet') + widths('list-row'),
        component: stateCard('pg-cabinet', 'Cabinet', 'Everything in the cabinet, with what is left of it.', `<ul class="kp-list" role="list" aria-label="Medicines">${MEDS.map(listRow).join('')}</ul>`),
    },
    {
        id: 'quantity-fill',
        title: 'A quantity that fills its cell',
        topic: 'list',
        item: 'item 2 · Medicine Cabinet gap 2',
        asked:
            'A <code>.kp-quantity</code> is as wide as its content, so steppers in a column ended at different edges and, in a narrow cell, the unit broke per letter (&ldquo;capsule/s&rdquo;). <code>data-kp-quantity-fill</code> makes the number track <code>1fr</code> and keeps the unit whole. Is that the stepper for the Cabinet rows, the add-stock dialog and the dose?',
        h2: 'The same stepper in three cells',
        intro: 'Vitamin D3 in a wide cell, a medium one and a narrow one. Fill off is the stepper as it was; fill on is the new look.',
        expected: [
            '<b>Fill on</b> (default): in every cell the minus and plus stand at the cell&rsquo;s two edges, the number between them, the unit after the number on one line. <b>Fill off</b>: the stepper is as wide as its content and starts on the cell&rsquo;s edge.',
            'In the <b>narrow</b> cell the number gives way, never the unit: &ldquo;capsules&rdquo; is never cut in two. Press minus and plus: the sizes do not change.',
        ],
        look: 'The three steppers have the same height and the same button size; only the number field takes the difference in width.',
        controls: group('Fill', 'qfill', [['on', 'Fill (new)', true], ['off', 'Content width (before)']]) + widths('quantity-fill'),
        component: `<div class="kp-card pg-card"><div class="pg-cells">${[['Cabinet row', 'pg-cell--wide'], ['Add-stock dialog', 'pg-cell--medium'], ['Narrow cell', 'pg-cell--narrow']]
            .map(
                ([label, cls], i) =>
                    `<div class="pg-cell ${cls}"><p class="pg-cell__label">${label}</p><div class="kp-quantity" id="pg-qfill-${i}" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="capsules" data-kp-quantity-unit-one="capsule" data-kp-quantity-label="Vitamin D3 stock, ${label}"><input class="kp-quantity__input" value="60" /></div></div>`,
            )
            .join('')}</div></div>`,
    },
    {
        id: 'badge-run',
        title: 'Several badges in one cell that wrap',
        topic: 'list',
        item: 'item 5 · Medicine Cabinet gap 7',
        asked:
            'Status badges in a row were a grid with <code>grid-auto-flow: column</code>, which cannot wrap. <code>.kp-badges</code> is a grid whose tracks are as wide as the widest badge, so a long run wraps into columns without a flex run. Does a run of badges read well in a narrow cell?',
        h2: 'Status badges in a cell',
        intro: 'The badges of Vitamin D3 in three cell widths. Add badges to see the run wrap; the old single row is there for comparison.',
        expected: [
            '<b>New run</b>: in the wide cell the badges stand in one line; in the narrow cell they wrap into rows of equal-width columns, each label whole (it wraps at spaces, never between letters).',
            '<b>Single row (before)</b>: the same badges cannot wrap and run past the cell&rsquo;s edge in the narrow one.',
        ],
        look: 'A wrapped run keeps one rhythm: the same gap across and down, the first badge of each row on one edge.',
        controls: group('Badges', 'brun-count', [['3', 'Three', true], ['6', 'Six'], ['9', 'Nine']]) + group('Run', 'brun-mode', [['new', 'Wrapping run (new)', true], ['old', 'Single row (before)']]),
        component: `<div class="kp-card pg-card"><div class="pg-cells">${[['Wide cell', 'pg-cell--wide'], ['Medium cell', 'pg-cell--medium'], ['Narrow cell', 'pg-cell--narrow']]
            .map(([label, cls]) => `<div class="pg-cell ${cls}"><p class="pg-cell__label">${label}</p><div class="kp-badges pg-brun"></div></div>`)
            .join('')}</div></div>`,
    },
    // ---------------------------------------------------------------- Today
    {
        id: 'attention-max',
        title: 'The attention band with a maximum',
        topic: 'today',
        topicTitle: 'Today',
        item: 'item 4 · Medicine Cabinet gap 6',
        asked:
            'Seven problems pushed the page&rsquo;s content below the fold on a phone, and Today made its own toggle. <code>data-kp-attention-max="3"</code> shows the worst three and folds the rest behind a built-in &ldquo;Show N more&rdquo; (<code>aria-expanded</code>), worst first. Is three, and this toggle, right for Today?',
        h2: 'Today&rsquo;s problems, worst first',
        intro: 'Seven problems about the cabinet. With a maximum of three, only the worst three show and one button unfolds the other four.',
        expected: [
            '<b>Cap 3</b>: the two critical problems and the first warning show; the button says <b>Show 4 more</b>. Press it: all seven show, the button says <b>Show fewer</b>, and the order is still worst first.',
            '<b>Cap off</b> shows all seven. <b>2 problems</b> shows both and no button. <b>None</b>: the band takes no room at all.',
        ],
        look: 'The button is the band&rsquo;s last row, a normal small button on the band&rsquo;s start edge, and the band does not jump when it folds.',
        controls: group('Cap', 'att-max', [['3', 'Three', true], ['5', 'Five'], ['0', 'No cap']]) + group('Problems', 'att-count', [['7', 'Seven', true], ['2', 'Two'], ['0', 'None']]) + widths('attention-max'),
        component: `<div class="kp-card pg-card"><div class="kp-attention" id="pg-attention" data-kp-attention-max="3" aria-label="What needs you today"></div></div>`,
    },
    {
        id: 'header-updated',
        title: 'A freshness line right after the page title',
        topic: 'today',
        item: 'item 13 · Medicine Cabinet gap 12 · fix',
        asked:
            'The principles want &ldquo;updated HH:MM&rdquo; right after the title, but the header had only a description line, so Today wrote it into that. <code>.kp-page-header__updated</code> is the slot. Is this the place and the weight?',
        h2: 'Today&rsquo;s page header',
        intro: 'Before: the date and the update time share the description. After: the update time stands on the title&rsquo;s baseline and the description is the date alone.',
        expected: [
            '<b>Before</b>: &ldquo;Friday 30/10/2026 · updated 18:45&rdquo; as one grey line under the title. <b>After</b>: &ldquo;updated 18:45&rdquo; right after &ldquo;Today&rdquo; in small tabular digits, the date under both; the primary button stays on the right.',
            'At <b>phone</b> width the freshness line goes under the title if the room runs out; the title never moves when the time changes.',
        ],
        look: 'The freshness line is quieter than the title and level with its baseline; the description does not change place.',
        controls: group('Time', 'hdr-time', [['1845', '18:45', true], ['0905', '09:05']]) + widths('header-updated'),
        component: `<div class="kp-card pg-card">
            <p class="pg-case__title">Before</p>
            <header class="kp-page-header"><div class="kp-page-header__inner"><div><h4 class="kp-page-header__title">Today</h4><p class="kp-page-header__description"><span class="pg-date">Friday 30/10/2026</span> · <span class="pg-time">updated 18:45</span></p></div><div class="kp-page-header__actions"><button type="button" class="kp-button kp-button--primary">Take a dose</button></div></div></header>
            <p class="pg-case__title">After</p>
            <header class="kp-page-header"><div class="kp-page-header__inner"><div><h4 class="kp-page-header__title">Today</h4><time class="kp-page-header__updated pg-time">updated 18:45</time><p class="kp-page-header__description">Friday 30/10/2026</p></div><div class="kp-page-header__actions"><button type="button" class="kp-button kp-button--primary">Take a dose</button></div></div></header></div>`,
    },
    // ---------------------------------------------------------------- the medicine form
    {
        id: 'row-editor',
        title: 'A repeating row editor for &ldquo;When to take it&rdquo;',
        topic: 'form',
        topicTitle: 'The medicine form',
        item: 'item 3 · Medicine Cabinet gap 5',
        asked:
            'A medicine has one or more slots of a time, the days and a dose. The package had the parts but no container to add and remove them. <code>data-kp-rows</code> repeats a template row, writes one head row of labels over the columns and a remove button per row. Is this the editor for &ldquo;When to take it&rdquo;?',
        h2: 'When to take it',
        intro: 'Two slots of the package&rsquo;s own time field, weekday picker and quantity. Add a time, remove one; the editor says why a button is off.',
        expected: [
            '<b>Add a time</b> appends a row with the time field, the days and the dose already working, and moves the focus into it. <b>Remove time 2</b> takes a row away and moves the focus to the row now in its place. The labels stand once, over the columns, and the columns run through every row.',
            'At the <b>fewest</b> (one) the remove buttons are off and the line says &ldquo;At least 1 time needed&rdquo;; at the <b>most</b> (six) Add is off and the line says why. <b>Empty it</b> (with the fewest at none) shows the empty plate. <b>Phone</b>: each row is a card with its labels in front of its fields. <b>Loading</b> and <b>Failed</b> are the card&rsquo;s.',
        ],
        look: 'The head labels sit on the fields&rsquo; left edges; the remove buttons stand in one column; nothing moves when a row comes or goes except the rows under it.',
        controls: group('Rows', 'rows-fill', [['fill', 'Fill to the most'], ['empty', 'Empty it']]) + group('Fewest', 'rows-min', [['1', 'One', true], ['0', 'None']]) + stateFor('pg-when') + widths('row-editor'),
        component: stateCard(
            'pg-when',
            'When to take it',
            'Each slot is a time, the days it runs on and how many to take.',
            `<div class="kp-rows" id="pg-rows" data-kp-rows data-kp-rows-min="1" data-kp-rows-max="6" data-kp-rows-unit="time,times" aria-label="When to take it">
                <ol class="kp-rows__list" data-kp-rows-list>${slot('a', '08:00', '1,2,3,4,5', 1)}${slot('b', '20:00', '0,1,2,3,4,5,6', 2)}</ol>
                <template data-kp-rows-template>${slot('{n}', '12:00', '1,2,3,4,5,6,0', 1)}</template>
            </div>`,
        ),
    },
    {
        id: 'pills-none',
        title: 'Pills with nothing chosen, tied to a tag input',
        topic: 'form',
        item: 'item 8 · Medicine Cabinet gaps 11, 14, 16',
        asked:
            'The medicine form&rsquo;s &ldquo;Form&rdquo; is one pill or none, symptom chips fill a search box, and symptom pills mirror a tag input by hand. <code>data-kp-segmented="single-or-none"</code> lets the chosen pill go again, and <code>data-kp-segmented-for="&lt;combobox id&gt;"</code> keeps pills and field in step. Is this the pill group the form needs?',
        h2: 'Form, symptoms and search',
        intro: 'Three rows of the form: the form as one pill or none (with its Manage action), the symptoms as pills that fill the tags above, and the search chips that fill the box.',
        expected: [
            '<b>Form</b>: pick Tablet, press it again and nothing is chosen (no pill is checked, one pill is still the tab stop). <b>Single (before)</b> forces a choice: the pressed pill cannot be let go.',
            '<b>Symptoms</b>: a pill adds a tag, a tag removed in the field turns its pill off, a tag typed in the field that has no pill stays. <b>Search</b>: one chip fills the box with its words, pressing it again empties it, typing something else clears the chip. The line under the form says what the page heard.',
        ],
        look: 'The pills fill the control track with the same height as the fields; Manage stands in the actions column of the row.',
        controls: group('Form pills', 'pill-mode', [['single-or-none', 'Single or none (new)', true], ['single', 'Single (before)']]) + widths('pills-none'),
        component: `<div class="kp-card pg-card"><div class="kp-formgrid" id="pg-pills">
            <div class="kp-formgrid__row"><span class="kp-formgrid__label" id="pg-form-l">Form</span><div class="kp-formgrid__control"><div class="kp-segmented kp-segmented--chips" id="pg-form-pills" data-kp-segmented="single-or-none" role="radiogroup" aria-labelledby="pg-form-l">${FORMS.map(([name]) => chip(slug(name), name, name === 'Tablet')).join('')}</div></div><p class="kp-formgrid__value">or none</p><div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm">Manage…</button></div></div>
            <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="pg-sym-input">Symptoms</label><div class="kp-formgrid__control"><div class="kp-combobox" id="pg-sym" data-kp-combobox data-kp-tags><div data-kp-tag-list></div><input class="kp-field__input kp-combobox__input" id="pg-sym-input" role="combobox" type="text" aria-expanded="false" aria-controls="pg-sym-list" autocomplete="off" /><ul class="kp-combobox__list" id="pg-sym-list" role="listbox" hidden>${options(SYMPTOMS)}</ul><p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p></div><div class="kp-segmented kp-segmented--chips" id="pg-sym-pills" data-kp-segmented="multi" data-kp-segmented-for="pg-sym" data-kp-segmented-collapse="false" role="group" aria-label="Common symptoms">${SYMPTOMS.map((s) => chipMulti(slug(s), s)).join('')}</div></div><p class="kp-formgrid__value">pick or type</p></div>
            <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="pg-find-input">What is bothering you?</label><div class="kp-formgrid__control"><div class="kp-combobox" id="pg-find" data-kp-combobox><input class="kp-field__input kp-combobox__input" id="pg-find-input" role="combobox" type="text" aria-expanded="false" aria-controls="pg-find-list" autocomplete="off" placeholder="Type or pick a symptom" /><ul class="kp-combobox__list" id="pg-find-list" role="listbox" hidden>${options(SYMPTOMS)}</ul><p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p></div><div class="kp-segmented kp-segmented--chips" id="pg-find-pills" data-kp-segmented="single-or-none" data-kp-segmented-for="pg-find" role="radiogroup" aria-label="Suggestions">${SYMPTOMS.map((s) => chip(slug(s), s, false)).join('')}</div></div><p class="kp-formgrid__value">suggestions</p></div>
            </div><p class="pg-log" id="pg-pills-log" role="status" aria-live="polite"></p></div>`,
    },
    // ---------------------------------------------------------------- dialogs and tables
    {
        id: 'dialogs',
        title: 'Dialog width steps and a confirmation that holds a body',
        topic: 'dialogs',
        topicTitle: 'Dialogs and managed tables',
        item: 'item 6 · Medicine Cabinet gaps 8, 9, 19',
        asked:
            'A short dialog was as wide as its longest line and touched the edge of a phone; a dialog holding a table needed 50rem; <code>openConfirmation</code> took one phrase. Now <code>kp-dialog--narrow</code> (a question&rsquo;s width), <code>--wide</code> and <code>--wider</code> are steps, and <code>openConfirmation</code> takes <code>description</code> as nodes and <code>acceptLook: "primary"</code>. Are these the steps, and is the guard right for the as-needed dose?',
        h2: 'Add stock, the dose guard and the forms manager',
        intro: 'Each dialog is shown open here and opens for real with its button. The guard is the confirmation with a rich body and a primary &ldquo;Take it anyway&rdquo;.',
        expected: [
            '<b>Add stock</b> (narrow): 26rem wide whatever it holds, one gap from the window edge on a phone. <b>Take it anyway</b>: a title, three short paragraphs and a bold wait time, Cancel and a primary (not red) accept. <b>Forms manager</b> (wider): 52rem, the table inside scrolls in the dialog&rsquo;s body.',
            'The width step control changes the first dialog live: Default is the width it had (its longest line), Narrow, Wide and Wider the steps.',
        ],
        look: 'Open each dialog for real: the title, the body and the actions keep their order; Escape and Cancel close; the primary accept is the page&rsquo;s primary look, not a destructive one.',
        controls: group('Add-stock width', 'dlg-step', [['default', 'Default'], ['narrow', 'Narrow', true], ['wide', 'Wide'], ['wider', 'Wider']]) + group('Open for real', 'dlg-open', [['stock', 'Add stock'], ['guard', 'Take it anyway'], ['forms', 'Forms manager']], '', false) + widths('dialogs'),
        component: `<div class="kp-card pg-card pg-previews">
            <dialog class="kp-dialog kp-dialog--narrow pg-preview" id="pg-prev-stock" open aria-labelledby="pg-prev-stock-t"><h4 class="kp-dialog__title" id="pg-prev-stock-t">Add stock</h4><p class="kp-dialog__description">Ibuprofen 400 mg · 14 tablets now</p>
                <div class="kp-field"><label class="kp-field__label" for="pg-prev-qty">How many did you buy?</label><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="1" data-kp-quantity-max="200" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Tablets to add"><input class="kp-quantity__input" id="pg-prev-qty" value="20" /></div></div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button">Cancel</button><button type="button" class="kp-button kp-button--primary">Add 20</button></div></dialog>
            <dialog class="kp-dialog kp-confirm pg-preview" id="pg-prev-guard" open aria-labelledby="pg-prev-guard-t"><h4 class="kp-dialog__title" id="pg-prev-guard-t">Too soon for another dose</h4><div class="kp-dialog__description"><p>You took Ibuprofen 400 mg at 14:10, 2 h ago.</p><p>The leaflet asks for at least <strong>6 h</strong> between doses: the next one is due at 20:10.</p><p>Taking it anyway is your choice; it is written down as an extra dose.</p></div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button">Cancel</button><button type="button" class="kp-button kp-button--primary">Take it anyway</button></div></dialog>
            <dialog class="kp-dialog kp-dialog--wider pg-preview" id="pg-prev-forms" open aria-labelledby="pg-prev-forms-t"><h4 class="kp-dialog__title" id="pg-prev-forms-t">Forms of medicine</h4><p class="kp-dialog__description">Rename or remove a form; the medicines that use it are counted.</p>
                <div class="kp-dialog__body">${formsTable('pg-prev-forms-table', 'data-kp-cards-at="30rem"')}</div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button">Close</button><button type="button" class="kp-button kp-button--primary">Add a form</button></div></dialog></div>
            <dialog class="kp-dialog kp-dialog--narrow" id="pg-stock" aria-labelledby="pg-stock-t"><h2 class="kp-dialog__title" id="pg-stock-t">Add stock</h2><p class="kp-dialog__description">Ibuprofen 400 mg · 14 tablets now</p>
                <div class="kp-field"><label class="kp-field__label" for="pg-stock-qty">How many did you buy?</label><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="1" data-kp-quantity-max="200" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Tablets to add"><input class="kp-quantity__input" id="pg-stock-qty" value="20" /></div></div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button" data-pg-close>Cancel</button><button type="button" class="kp-button kp-button--primary" data-pg-close>Add 20</button></div></dialog>
            <dialog class="kp-dialog kp-dialog--wider" id="pg-forms" aria-labelledby="pg-forms-t"><h2 class="kp-dialog__title" id="pg-forms-t">Forms of medicine</h2><p class="kp-dialog__description">Rename or remove a form; the medicines that use it are counted.</p>
                <div class="kp-dialog__body">${formsTable('pg-forms-table', 'data-kp-cards-at="30rem"')}</div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button" data-pg-close>Close</button></div></dialog>`,
    },
    {
        id: 'table-columns',
        title: 'A table with an actions column that turns into cards only on a phone',
        topic: 'dialogs',
        item: 'item 7 · Medicine Cabinet gaps 17, 18',
        asked:
            'A small managed list (categories, forms) sat in a column of a third of the page, where a table turned into cards at 40rem of its own width, and its Edit and Delete were hand-built. <code>data-kp-cards-at="30rem"</code> sets the width where it turns into cards, and <code>data-kp-col="actions"</code> makes the column a fixed track with no label in a card. Is that right for the forms and symptoms managers?',
        h2: 'Forms of medicine, managed',
        intro: 'The same table in a column 36rem wide: with the usual 40rem it is a card list, with 30rem it stays a table until the screen is a phone.',
        expected: [
            '<b>Cards at 30rem (new)</b> in the 36rem column: a table with the actions column at the end, Edit and Delete of equal width in every row, the header &ldquo;Actions&rdquo;. <b>Cards at 40rem (before)</b>: the same table is a list of cards. <b>Phone</b>: cards in both; the card&rsquo;s actions stand in a row across it with no &ldquo;Actions&rdquo; label.',
            '<b>Loading</b> lays the busy card over the rows, <b>Empty</b> the package&rsquo;s plate and <b>Failed</b> the failed plate with Try again, all at the loaded height.',
        ],
        look: 'The actions column is as wide as its two buttons and no wider; the buttons never wrap; a card has no stray label.',
        controls: group('Cards at', 'cards-at', [['30rem', '30rem (new)', true], ['40rem', '40rem (before)']]) + group('Column', 'tbl-width', [['column', 'A 36rem column', true], ['full', 'Full width']]) + group('State', 'tbl-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]) + widths('table-columns'),
        component: `<div class="kp-card pg-card"><div class="pg-column" id="pg-tbl-box">${formsTable('pg-forms-managed', 'data-kp-cards-at="30rem"')}</div></div>`,
    },
    // ---------------------------------------------------------------- fixes
    {
        id: 'fix-text-align',
        title: 'Fix: typed text and placeholders start at the start edge',
        topic: 'fixes',
        topicTitle: 'Fixes in the package',
        item: 'item 9 · Medicine Cabinet gap 4 · fix',
        asked:
            'Typed text and placeholders in a form grid&rsquo;s fields were centred, which read as if the caret were in the wrong place, and every app overrode it. Now they start at the start edge; a select stays centred, and <code>data-kp-formgrid-align="center"</code> brings the old look back. Is the start edge the right default?',
        h2: 'The medicine form&rsquo;s fields',
        intro: 'The same four rows, before (centred) and after (start edge). The note row shows the placeholder.',
        expected: [
            '<b>Before</b>: &ldquo;Ibuprofen 400 mg&rdquo;, the placeholder and the time are centred in their fields. <b>After</b>: they start at the left edge, aligned with the labels&rsquo; column of text; the strength select still shows its value centred.',
            'Type in a field: the text grows from the start edge.',
        ],
        look: 'In the after grid the first letters of the name, note and time stand on one vertical line.',
        controls: widths('fix-text-align'),
        component: `<div class="kp-card pg-card"><p class="pg-case__title">Before</p>${fieldGrid('pg-ta-before', 'data-kp-formgrid-align="center"')}<p class="pg-case__title">After</p>${fieldGrid('pg-ta-after')}</div>`,
    },
    {
        id: 'fix-card-gap',
        title: 'Fix: air between a card&rsquo;s sentence and its first form row',
        topic: 'fixes',
        item: 'item 10 · Medicine Cabinet gap 10 · fix',
        asked:
            'In a card, the first label of a form grid stood directly under the card&rsquo;s sentence. Now a form grid after the card&rsquo;s title or sentence has the medium space above it (<code>--kp-card-form-gap</code>). Is that the right amount of air?',
        h2: 'A card of the medicine form',
        intro: 'The &ldquo;Basics&rdquo; card before and after.',
        expected: ['<b>Before</b>: the sentence and the label &ldquo;Name&rdquo; touch. <b>After</b>: one medium space between them, the same space as between the rows of the grid.'],
        look: 'The gap under the sentence equals the gap between two rows below it.',
        controls: widths('fix-card-gap'),
        component: `<div class="pg-stack">${['Before', 'After']
            .map(
                (label) =>
                    `<section class="kp-card${label === 'Before' ? ' pg-before' : ''}" aria-label="${label}"><p class="pg-case__title">${label}</p><h4 class="kp-card__title">Basics</h4><p class="kp-card__body">What the medicine is called and how strong it is.</p>${fieldGrid(`pg-cg-${label.toLowerCase()}`)}</section>`,
            )
            .join('')}</div>`,
    },
    {
        id: 'fix-error-line',
        title: 'Fix: an empty required field&rsquo;s error does not move the layout',
        topic: 'fixes',
        item: 'item 11 · Medicine Cabinet gap 15 · fix',
        asked:
            'The error of an empty required field appeared on blur and grew the row by a line, so a press on the pill under it landed on the moving group. Now a form grid keeps room for the line (<code>data-kp-formgrid-errors="flow"</code> gives the old behaviour). Does nothing move now?',
        h2: 'The name is required',
        intro: 'Leave the name empty and move on: the line says what is wrong. The readout under each grid is the height of the pills&rsquo; row before and after.',
        expected: [
            '<b>Leave the name empty</b>: the error shows in both grids. In <b>before</b> the pills move down by the height of one line (the readout shows the shift); in <b>after</b> they do not move at all (shift 0 px).',
            '<b>Clear it</b> hides the error again.',
        ],
        look: 'Compare the readouts: after must say 0 px. The reserved line is empty, not a gap that looks like a mistake.',
        controls: group('Name', 'err-name', [['leave', 'Leave it empty'], ['clear', 'Clear the error', true]]) + widths('fix-error-line'),
        component: `<div class="kp-card pg-card">${['Before', 'After']
            .map((label) => {
                const k = label.toLowerCase();
                return `<p class="pg-case__title">${label}</p><div class="kp-formgrid" id="pg-err-${k}"${label === 'Before' ? ' data-kp-formgrid-errors="flow"' : ''}>
                <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="pg-err-${k}-name">Name</label><div class="kp-formgrid__control"><div class="kp-field"><input class="kp-field__input" id="pg-err-${k}-name" required /><span class="kp-field__error" id="pg-err-${k}-name-error" hidden></span></div></div><p class="kp-formgrid__value">required</p></div>
                <div class="kp-formgrid__row"><span class="kp-formgrid__label" id="pg-err-${k}-l">Form</span><div class="kp-formgrid__control"><div class="kp-segmented kp-segmented--chips" id="pg-err-${k}-pills" data-kp-segmented="single-or-none" role="radiogroup" aria-labelledby="pg-err-${k}-l">${FORMS.map(([name]) => chip(slug(name), name, false)).join('')}</div></div></div></div><p class="pg-log" id="pg-err-${k}-log" role="status"></p>`;
            })
            .join('')}</div>`,
    },
    {
        id: 'fix-switch-state',
        title: 'Fix: a switch with no state word keeps no track',
        topic: 'fixes',
        item: 'item 12 · Medicine Cabinet gap 3 · fix',
        asked:
            'A switch reserved a 32 px track for its On/Off word even when it had none, so the gap between the knob and the label was about 60 px. Now an empty state word takes no track, and <code>data-kp-switch-state="none"</code> is the official switch without one. Is the knob now close enough to its label?',
        h2: 'Active, and as needed',
        intro: 'Three switches before and after: no state word, the state word On/Off (unchanged) and an empty word.',
        expected: ['<b>Before</b>: the knob and &ldquo;Active&rdquo; are about 60 px apart with an empty word. <b>After</b>: one gap (0.625rem). The switch with On/Off words is the same before and after.'],
        look: 'The after switches are 114 px wide at most &ldquo;Active&rdquo; included, measured from the knob to the end of the label.',
        controls: group('Switches', 'sw-on', [['off', 'All off', true], ['on', 'All on']]) + widths('fix-switch-state'),
        component: `<div class="kp-card pg-card">${['Before', 'After']
            .map(
                (label) =>
                    `<div class="${label === 'Before' ? 'pg-before ' : ''}pg-switches"><p class="pg-case__title">${label}</p>
                    <span class="pg-switch-name">Empty word</span>
                    <label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" /><span class="kp-switch__state" aria-hidden="true"><span class="kp-switch__on"></span><span class="kp-switch__off"></span></span><span>Active</span></label>
                    <span class="pg-switch-name">No word</span>
                    <label class="kp-switch" data-kp-switch-state="none"><input class="kp-switch__input" type="checkbox" role="switch" /><span class="kp-switch__state" aria-hidden="true"><span class="kp-switch__on"></span><span class="kp-switch__off"></span></span><span>Active</span></label>
                    </div><div class="${label === 'Before' ? 'pg-before ' : ''}pg-switches"><p class="pg-case__title">With words (unchanged)</p>
                    <span class="pg-switch-name">On / Off words</span>
                    <label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" /><span class="kp-switch__state" aria-hidden="true"><span class="kp-switch__on">On</span><span class="kp-switch__off">Off</span></span><span>Active</span></label></div>`,
            )
            .join('')}</div>`,
    },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s) => `<section id="${s.id}" data-review-item="${s.id}" data-review-topic="${s.topic}"${s.topicTitle ? ` data-review-topic-title="${s.topicTitle}"` : ''} data-review-components="${s.id}" data-review-title="${s.title}" aria-labelledby="h-${s.id}">
    <div class="pg-asked"><p><b>What is asked</b> (${s.item}): ${s.asked}</p></div>
    <div class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></div>
    <div class="pg-expected"><p><b>Expected:</b></p><ul>${s.expected.map((e) => `<li>${e}</li>`).join('')}</ul></div>
    <div data-review-look><p data-for="formal">${s.look}</p></div>
    <div data-review-controls data-review-controls-for="${s.id}-component">${s.controls}</div>
    <div id="${s.id}-component" class="pg-component" data-pg-width="full">${s.component}</div>
</section>`;

const problems = [];
const ids = SECTIONS.map((s) => s.id);
for (const id of new Set(ids)) if (ids.filter((i) => i === id).length > 1) problems.push(`the item "${id}" stands twice`);
if (SECTIONS.length * THEMES.length > MAX_ITEMS) problems.push(`${SECTIONS.length * THEMES.length} items: more than ${MAX_ITEMS}`);
const body = SECTIONS.map(asSection).join('\n\n');
const seen = new Map();
for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);
if (problems.length) {
    console.error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${ID}-${randomUUID()}`;

const title = 'Medicine Cabinet: thirteen things the app needed from the package';
const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <script>
            (function () {
                var d = document.documentElement;
                var t = new URLSearchParams(location.search).get('theme');
                try {
                    // A theme in the link is kept, so the catalogue's own
                    // boot, which reads the stored theme, does not undo it.
                    if (t) localStorage.setItem('theme', t);
                    t = t || localStorage.getItem('theme');
                } catch (e) {}
                if (t) d.setAttribute('data-theme', t);
                var theme = d.getAttribute('data-theme') || 'formal';
                document.write('<link rel="stylesheet" href="../../css/' + theme + '-register.css" data-kp-register="' + theme + '">');
            })();
        </script>
        <link rel="stylesheet" href="../../catalogue/catalogue.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main pg-page">
            <header class="pg-head">
                <h1>${escapeHtml(title)}</h1>
                <p class="cat-intro">
                    The Medicine Cabinet web app found thirteen places where it had to draw its own glue; you approved building them in the package on 2026-10-30.
                    Eight are new parts or options (a list of rows, a quantity that fills its cell, a repeating row editor, an attention band with a maximum, a run
                    of badges, dialog widths and a rich confirmation, a table&rsquo;s actions column and card width, pills with nothing chosen tied to a tag input)
                    and five are fixes (typed text at the start edge, air under a card&rsquo;s sentence, an error line that moves nothing, a switch without a state
                    word, a freshness line after the title); each fix shows Before and After. Formal only, on the app&rsquo;s own shapes (the names, counts and times
                    are mock). Nothing here is on by default except the five fixes and the narrow confirmation, which say so. ${SECTIONS.length} sections, ${SECTIONS.length} pairs.
                </p>
                <p>Every section says under <b>Expected</b> what you should see and what each control does. The width control shows the stage at a phone&rsquo;s 390 px.</p>
            </header>

${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
console.log(`${ID}: ${SECTIONS.length} items, round ${roundId}`);
