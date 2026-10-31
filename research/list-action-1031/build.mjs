// Builds research/list-action-1031/demo.html: the trailing action column of the list of rows (`.kp-listrow__action`), which Kenny chose on
// 2026-10-31 ("list-action: Eigen vak toevoegen"). One review page, formal only, one section (DEMO_RULES ch. 1 and 6). The section is written
// here once: what is asked, the heading and one sentence, what to expect, what to look at, the controls and the component. demo.js wires the
// controls by the section's own elements; page.css is the frame. The rows are Medicine Cabinet's Symptoms results (web/js/pages/symptoms-rows.js)
// in the app's own shape, plus one Cabinet row with a stepper and a switch; the names, counts and times are mock.
// Run: node research/list-action-1031/build.mjs (the page keeps its round id until the verdict is recorded; a round already answered gets a new one).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = new URL('./', import.meta.url);
const ID = 'list-action-1031';
const THEMES = ['formal'];
const MAX_ITEMS = 25;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

const badge = ([words, tone]) => `<span class="kp-badge${tone ? ` kp-badge--${tone}` : ''}">${words}</span>`;
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** What a row ends with: the primary "I took one" (`take`), the word that stands in for it (`scheduled`), or nothing. */
const ACTIONS = {
    take: (name) => `<button type="button" class="kp-button kp-button--primary" data-pg-take="${name}" aria-label="I took one ${name}">I took one</button>`,
    scheduled: () => '<span class="kp-text-muted">Scheduled</span>',
};

/**
 * The rows: the Symptoms results for "Headache" in the app's shape, and one Cabinet row (stepper and switch, no action).
 * @type {{ name: string, facts: string, plan: string, badges: string[][], action?: 'take' | 'scheduled', muted?: boolean, stock?: [number, string, string] }[]}
 */
const ROWS = [
    { name: 'Ibuprofen 400 mg', facts: '400 mg tablet · pain and fever · 14 tablets left', plan: 'When needed · at least 6 h apart · max 3 a day', badges: [['Low stock', 'warning'], ['Expires 03/2027']], action: 'take' },
    { name: 'Paracetamol 500 mg', facts: '500 mg tablet · pain and fever · 32 tablets left', plan: 'When needed · at least 4 h apart · max 4 a day', badges: [['In stock', 'success']], action: 'take' },
    { name: 'Vitamin D3 25 µg', facts: '25 µg capsule · supplement · 60 capsules left', plan: '08:00 · every day', badges: [['On schedule'], ['Expires 11/2026', 'warning']], action: 'scheduled' },
    { name: 'Saline nasal spray', facts: 'Spray · congestion', plan: 'When needed', badges: [['Opened 30 days ago', 'warning']], stock: [1, 'bottles', 'bottle'] },
    { name: 'Cetirizine 10 mg', facts: '10 mg tablet · hay fever · 8 tablets left', plan: 'When needed · max 1 a day', badges: [['Low stock', 'warning']], action: 'take' },
    { name: 'Amoxicillin 500 mg', facts: '500 mg capsule · antibiotic course · 0 capsules left', plan: 'Its course is over.', badges: [['Course over']], muted: true },
];

/** A stepper and a switch, as the Cabinet row has them. */
const cabinetCells = (name, [stock, unit, one]) => `
                    <div class="kp-listrow__stepper"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="${unit}" data-kp-quantity-unit-one="${one}" data-kp-quantity-label="Stock of ${name}"><input class="kp-quantity__input" value="${stock}" /></div></div>
                    <div class="kp-listrow__switch"><label class="kp-switch" data-kp-switch-state="none"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Active: ${name}" /><span>Active</span></label></div>`;

const listRow = (row) => `
                <li class="kp-listrow${row.muted ? ' kp-listrow--muted' : ''}" data-pg-row="${slug(row.name)}">
                    <div class="kp-listrow__identity"><strong class="kp-listrow__name">${row.name}</strong><span class="kp-listrow__meta">${row.facts}</span><span class="kp-listrow__meta">${row.plan}</span></div>
                    <div class="kp-listrow__status"><div class="kp-badges">${row.badges.map(badge).join('')}</div></div>${row.stock ? cabinetCells(row.name, row.stock) : ''}${row.action ? `
                    <div class="kp-listrow__action">${ACTIONS[row.action](row.name)}</div>` : ''}
                </li>`;

/** A card with the package's own data states around the list. */
const stateCard = (id, title, note, data) => `<section class="kp-card" id="${id}" data-kp-state="ready" aria-labelledby="${id}-t">
            <div class="kp-card__header"><h3 class="kp-card__title" id="${id}-t">${title}</h3></div>
            <p class="kp-card__body">${note}</p>
            <div class="kp-card__stage"><div class="kp-card__data">${data}</div></div>
        </section>`;

const SECTIONS = [
    {
        id: 'list-action',
        title: 'A trailing action column in the list of rows',
        topic: 'list',
        topicTitle: 'The list of rows',
        item: 'your choice &ldquo;list-action: Eigen vak toevoegen&rdquo;, 2026-10-31',
        asked:
            'Medicine Cabinet&rsquo;s Symptoms page put its &ldquo;I took one&rdquo; button in the stepper cell, because the list had no place for an action. <code>.kp-listrow__action</code> is a fifth named column <code>[action]</code> at the end of the list&rsquo;s grid, as wide as the widest action; every row is a subgrid, so all actions line up, and a row without one leaves the cell empty, like the status. Under the card break (40rem of the list&rsquo;s own width) the action takes its own full line below the rest. A list that holds no action keeps its four columns exactly as you approved them.',
        h2: 'Headache: what you have',
        intro:
            'Six medicines as the Symptoms page lists them for a headache: what each is, its badges and what you can do now. One row is a Cabinet row with a stepper and a switch, to show that mixed rows keep one grid.',
        expected: [
            '<b>Full width</b>: the three &ldquo;I took one&rdquo; buttons are equally wide and stand in one column at the end of the rows; &ldquo;Scheduled&rdquo; starts on the same edge. The Amoxicillin row and the spray row have no action and leave the cell empty. The spray&rsquo;s stepper and switch stand in their own columns, before the action column, and the badges keep one edge down all six rows. Pressing a button writes what was noted under the list.',
            '<b>No action in any row</b>: the action column is gone and the spray&rsquo;s switch ends on the row&rsquo;s right edge, exactly as in the approved list without actions.',
            '<b>Phone, 390 px</b>: each row is a card; the button fills its own line at the bottom of the card and &ldquo;Scheduled&rdquo; stands on its own line; a row without an action has no empty line. <b>Loading</b>, <b>Empty</b> and <b>Failed</b> fill the list&rsquo;s footprint with the card&rsquo;s plate and a normal Retry.',
        ],
        look: 'Formal is a paper plate: rows ruled by thin lines, the primary button the one filled thing in a row. Check that the action column runs straight down the list whatever a row holds, and that name, badges, stepper and switch look as they did.',
        controls:
            group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], 'pg-symptoms') +
            group('Actions', 'actions', [['some', 'As in the app', true], ['none', 'No action in any row']], 'pg-symptoms-list') +
            group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], 'list-action-component'),
        component: `${stateCard(
            'pg-symptoms',
            'Headache',
            'What you have that helps, with what is left of it.',
            `<ul class="kp-list" id="pg-symptoms-list" role="list" aria-label="Medicines for a headache">${ROWS.map(listRow).join('')}
            </ul>`,
        )}
        <p class="pg-log" id="pg-symptoms-log" role="status" aria-live="polite"></p>`,
    },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s) => `        <section id="${s.id}" data-review-item="${s.id}" data-review-topic="${s.topic}" data-review-topic-title="${s.topicTitle}" data-review-components="${s.id}" data-review-title="${s.title}" aria-labelledby="h-${s.id}">
            <div class="pg-asked"><p><b>What is asked</b> (${s.item}): ${s.asked}</p></div>
            <div class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></div>
            <div class="pg-expected"><p><b>Expected:</b></p><ul>${s.expected.map((e) => `<li>${e}</li>`).join('')}</ul></div>
            <div data-review-look><p data-for="formal">${s.look}</p></div>
            <div data-review-controls data-review-controls-for="${s.id}-component">${s.controls}</div>
            <div id="${s.id}-component" class="pg-component" data-pg-width="full">
        ${s.component}
            </div>
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

const title = 'The list of rows gets a column for its action';
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
                    You chose to give the list of rows its own place for an action (2026-10-31). Medicine Cabinet&rsquo;s Symptoms page is the first user: its
                    &ldquo;I took one&rdquo; button stood in the stepper&rsquo;s cell. Formal only, on the app&rsquo;s own shapes (the names, counts and times are
                    mock). ${SECTIONS.length} section, ${SECTIONS.length * THEMES.length} pair.
                </p>
                <p>The section says under <b>Expected</b> what you should see and what each control does. The width control shows the stage at a phone&rsquo;s 390 px.</p>
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
writeFileSync(out, page);
console.log(`${ID}: ${SECTIONS.length} items, round ${roundId}`);
