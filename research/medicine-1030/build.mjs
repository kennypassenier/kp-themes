// Builds research/medicine-1030/demo.html, ROUND 2: the two sections Kenny did not approve on 2026-10-31 00:01 (page round medicine-1030-2e8f47fd-...,
// 11 of 13 approved). A re-review shows only the open pairs (DEMO_RULES ch. 6 and 9; research/_review/README.md): the eleven approved sections are
// gone from this page and from its script, round 1 stays readable in `_previous/` and in VERDICTS.json. Every section is written here once: what is
// asked (his words), the heading and one sentence, what to expect, what to look at, the controls and the component, in the shape research/wishes-1028
// uses. demo.js wires them by their own elements; page.css is the frame. The data is the Medicine Cabinet app's own shape (symptoms, forms of
// medicine); the names, counts and times are mock.
// Run: node research/medicine-1030/build.mjs (the page keeps its round id until the verdict is recorded; a round already answered gets a new one).
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

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

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

/** The symptoms of the mock app and how often each is chosen (`data-kp-uses`): the most used become the pills. */
const SYMPTOMS = [['Headache', 14], ['Fever', 11], ['Hay fever', 9], ['Sore throat', 8], ['Cough', 7], ['Nausea', 5], ['Back pain', 4], ['Dizziness', 3], ['Rash', 2]];
const FORM_USES = [12, 7, 3, 2, 4, 5];
const chip = (value, label, on) => `<button type="button" class="kp-segmented__item" data-value="${value}" role="radio" aria-checked="${on ? 'true' : 'false'}"><span class="kp-segmented__label">${label}</span></button>`;
/** The options of a field; every one carries how often it is chosen. */
const options = (list) => list.map(([name, uses]) => `<li class="kp-combobox__option" role="option" data-kp-option data-value="${slug(name)}" data-kp-uses="${uses}">${name}</li>`).join('');
/** A combobox with its input, list and status; `tags` makes it a tag input. */
const combobox = (id, list, { tags = false, placeholder = '' } = {}) =>
    `<div class="kp-combobox" id="${id}" data-kp-combobox${tags ? ' data-kp-tags' : ''}>${tags ? '<div data-kp-tag-list></div>' : ''}<input class="kp-field__input kp-combobox__input" id="${id}-input" role="combobox" type="text" aria-expanded="false" aria-controls="${id}-list" autocomplete="off"${placeholder ? ` placeholder="${placeholder}"` : ''} /><ul class="kp-combobox__list" id="${id}-list" role="listbox" hidden>${options(list)}</ul><p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p></div>`;
/** Chips made by the package from a field's most used options. */
const pills = (id, mode, field, top, label) =>
    `<div class="kp-segmented kp-segmented--chips" id="${id}" data-kp-segmented="${mode}" data-kp-segmented-for="${field}" data-kp-segmented-top="${top}" role="${mode === 'multi' ? 'group' : 'radiogroup'}" aria-label="${label}"></div>`;

/** @type {{ id: string, title: string, topic: string, topicTitle?: string, item: string, asked: string, h2: string, intro: string, expected: string[], look: string, controls: string, component: string }[]} */
const SECTIONS = [
    {
        id: 'pills-none',
        title: 'Pills and their field, always in step',
        topic: 'form',
        topicTitle: 'The medicine form',
        item: 'item 8 · Medicine Cabinet gaps 11, 14, 16 · round 2',
        asked:
            'Kenny, 2026-10-31 00:01: &ldquo;I think when selecting an option from for example symptoms from the text box, the button needs to be selected as well, same the other way around, but if all symptoms are listed as buttons, I don&rsquo;t see why the inputbox would still be relevant?&rdquo; <b>What changed:</b> the pills and the field now agree in both directions every time (a choice in the field lights its pill, also in a one-value field, which it did not; a pill puts its value in the field and taking it off removes it), and the field is only there when the choices are more than the pills. The pills are the most used choices (<code>data-kp-segmented-top</code>, a count or <code>all</code>), the field searches all of them, and when every choice is a pill the page shows no field.',
        h2: 'Form, symptoms and search',
        intro:
            'Three rows of the form. Form: every option is a pill, so there is no field. Symptoms and the search box: the four most used as pills, the full list behind the field.',
        expected: [
            '<b>Form</b>: six forms, six pills, no field. Pick Tablet, press it again and nothing is chosen. <b>Single (before)</b> forces a choice.',
            '<b>Symptoms</b> (several): type &ldquo;head&rdquo; and choose Headache in the field: the Headache pill turns on. Press the Fever pill: Fever appears as a tag in the field. Remove the tag with its &times;: the pill turns off. Choose Nausea in the field: it has no pill, so it is only a tag.',
            '<b>What is bothering you?</b> (one): choose Cough in the field: the Cough pill turns on, the Fever one goes. Press the Headache pill: the field says Headache. Press it again: the field is empty. Type other words: no pill stays on.',
            'The control under <b>Pills from the list</b> changes how many pills there are, live: three, four, or every choice, which takes the field away. The line under the form says what the page heard.',
        ],
        look: 'The pills and the field read as one control: the pills stand under the field with one gap and the field says what it searches (&ldquo;Search all 9&rdquo;). Where there is no field, nothing is left where it stood.',
        controls:
            group('Form pills', 'pill-mode', [['single-or-none', 'Single or none (new)', true], ['single', 'Single (before)']]) +
            group('Pills from the list', 'pill-top', [['3', '3 pills'], ['4', '4 pills', true], ['all', 'Every choice, no field']]) +
            widths('pills-none'),
        component: `<div class="kp-card pg-card"><div class="kp-formgrid" id="pg-pills">
            <div class="kp-formgrid__row"><span class="kp-formgrid__label" id="pg-form-l">Form</span><div class="kp-formgrid__control">${combobox('pg-form', FORMS.map(([name], i) => [name, FORM_USES[i]]))}${pills('pg-form-pills', 'single-or-none', 'pg-form', 'all', 'Form')}</div><p class="kp-formgrid__value">or none</p><div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm">Manage…</button></div></div>
            <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="pg-sym-input">Symptoms</label><div class="kp-formgrid__control">${combobox('pg-sym', SYMPTOMS, { tags: true })}${pills('pg-sym-pills', 'multi', 'pg-sym', '4', 'Common symptoms')}</div><p class="kp-formgrid__value">pick or type</p></div>
            <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="pg-find-input">What is bothering you?</label><div class="kp-formgrid__control">${combobox('pg-find', SYMPTOMS)}${pills('pg-find-pills', 'single-or-none', 'pg-find', '4', 'Most used')}</div><p class="kp-formgrid__value">one</p></div>
            </div><p class="pg-log" id="pg-pills-log" role="status" aria-live="polite"></p></div>`,
    },
    {
        id: 'dialogs',
        title: 'Dialog width steps and a confirmation that holds a body',
        topic: 'dialogs',
        topicTitle: 'Dialogs and managed tables',
        item: 'item 6 · Medicine Cabinet gaps 8, 9, 19 · round 2',
        asked:
            'Kenny, 2026-10-31 00:01: &ldquo;When increasing/decreasing the amount with the controls, the text on the button should reflect that change right? or it could just say &lsquo;add amount&rsquo; or something similar.&rdquo; <b>What changed:</b> the accept button of a dialog that holds a quantity follows it live (<code>data-kp-accept-follows="&lt;quantity id&gt;"</code>): &ldquo;Add 20 tablets&rdquo;, &ldquo;Add 1 tablet&rdquo;, and at 0 it says &ldquo;Add tablets&rdquo;, is off, and a line under the stepper gives the reason. The widths and the dose guard are as you saw them.',
        h2: 'Add stock, the dose guard and the forms manager',
        intro: 'Each dialog is shown open here and opens for real with its button. In Add stock the button says what happens with the amount you chose.',
        expected: [
            '<b>Add stock</b> (narrow): press plus and minus, hold them, type a number, press the arrows in the field: the button follows each change (&ldquo;Add 21 tablets&rdquo;, &ldquo;Add 1 tablet&rdquo;). At 0 the button is off, reads &ldquo;Add tablets&rdquo; and the line under the stepper says &ldquo;Choose how many tablets first.&rdquo;. The line is always one line high, so nothing moves.',
            '<b>Take it anyway</b>: a title, three short paragraphs and a bold wait time, Cancel and a primary (not red) accept. <b>Forms manager</b> (wider): 52rem, the table inside scrolls in the dialog&rsquo;s body. The width step control changes the first dialog live.',
        ],
        look: 'Open Add stock for real: the button&rsquo;s words change as the number does and the button keeps its place and width class; at 0 the reason is readable at a glance; Escape and Cancel close.',
        controls:
            group('Add-stock width', 'dlg-step', [['default', 'Default'], ['narrow', 'Narrow', true], ['wide', 'Wide'], ['wider', 'Wider']]) +
            group('Set the amount', 'dlg-amount', [['0', '0'], ['1', '1'], ['20', '20'], ['200', '200']], '', false) +
            group('Open for real', 'dlg-open', [['stock', 'Add stock'], ['guard', 'Take it anyway'], ['forms', 'Forms manager']], '', false) +
            widths('dialogs'),
        component: `<div class="kp-card pg-card pg-previews">
            <dialog class="kp-dialog kp-dialog--narrow pg-preview" id="pg-prev-stock" open aria-labelledby="pg-prev-stock-t"><h4 class="kp-dialog__title" id="pg-prev-stock-t">Add stock</h4><p class="kp-dialog__description">Ibuprofen 400 mg · 14 tablets now</p>
                <div class="kp-field"><label class="kp-field__label" for="pg-prev-qty">How many did you buy?</label><div class="kp-quantity" id="pg-prev-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Tablets to add"><input class="kp-quantity__input" id="pg-prev-qty" value="20" /></div></div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button">Cancel</button><button type="button" class="kp-button kp-button--primary" data-kp-accept-follows="pg-prev-quantity">Add 20 tablets</button></div></dialog>
            <dialog class="kp-dialog kp-confirm pg-preview" id="pg-prev-guard" open aria-labelledby="pg-prev-guard-t"><h4 class="kp-dialog__title" id="pg-prev-guard-t">Too soon for another dose</h4><div class="kp-dialog__description"><p>You took Ibuprofen 400 mg at 14:10, 2 h ago.</p><p>The leaflet asks for at least <strong>6 h</strong> between doses: the next one is due at 20:10.</p><p>Taking it anyway is your choice; it is written down as an extra dose.</p></div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button">Cancel</button><button type="button" class="kp-button kp-button--primary">Take it anyway</button></div></dialog>
            <dialog class="kp-dialog kp-dialog--wider pg-preview" id="pg-prev-forms" open aria-labelledby="pg-prev-forms-t"><h4 class="kp-dialog__title" id="pg-prev-forms-t">Forms of medicine</h4><p class="kp-dialog__description">Rename or remove a form; the medicines that use it are counted.</p>
                <div class="kp-dialog__body">${formsTable('pg-prev-forms-table', 'data-kp-cards-at="30rem"')}</div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button">Close</button><button type="button" class="kp-button kp-button--primary">Add a form</button></div></dialog></div>
            <dialog class="kp-dialog kp-dialog--narrow" id="pg-stock" aria-labelledby="pg-stock-t"><h2 class="kp-dialog__title" id="pg-stock-t">Add stock</h2><p class="kp-dialog__description">Ibuprofen 400 mg · 14 tablets now</p>
                <div class="kp-field"><label class="kp-field__label" for="pg-stock-qty">How many did you buy?</label><div class="kp-quantity" id="pg-stock-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Tablets to add"><input class="kp-quantity__input" id="pg-stock-qty" value="20" /></div></div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button" data-pg-close>Cancel</button><button type="button" class="kp-button kp-button--primary" data-pg-close data-kp-accept-follows="pg-stock-quantity">Add 20 tablets</button></div></dialog>
            <dialog class="kp-dialog kp-dialog--wider" id="pg-forms" aria-labelledby="pg-forms-t"><h2 class="kp-dialog__title" id="pg-forms-t">Forms of medicine</h2><p class="kp-dialog__description">Rename or remove a form; the medicines that use it are counted.</p>
                <div class="kp-dialog__body">${formsTable('pg-forms-table', 'data-kp-cards-at="30rem"')}</div>
                <div class="kp-dialog__actions"><button type="button" class="kp-button" data-pg-close>Close</button></div></dialog>`,
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
// A round id is never reused: once Kenny's answer to it is recorded (it is in `received`), the next page gets a new one.
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) && !received.includes(current) ? current : `${ID}-${randomUUID()}`;

const title = 'Medicine Cabinet, round 2: pills that follow their field, a button that follows the amount';
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
                    Round 1 of the Medicine Cabinet package (2026-10-31): eleven of the thirteen items are approved and have left this page; two come back.
                    The pills and their field now stay in step in both directions and the field is only there when the choices are more than the pills;
                    the accept button of the add-stock dialog says what will happen with the amount and follows the stepper. Formal only, on the app&rsquo;s own
                    shapes (the names, counts and times are mock). ${SECTIONS.length} sections, ${SECTIONS.length} pairs.
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
