// Builds research/formgrid-notes-1019/demo.html: notes on the form grid from chassis-rs and homelab, and the alignment check.
// They change components Kenny had approved (the form grid, the JSON field, the refresh bar), so each comes back through the
// review dialog with a plain "What changed" text. Formal only: none of the faults is theme-specific.
//
//   1. form-gap       a form that is a block of a form grid kept formal's own gap     (css/formal-register.css)
//   2. json-action    a row's action had no way to stand on the JSON field's tool row  (css/components.css)
//   3. refresh-label  a refresh bar could not sit next to a label in a form grid        (css/components.css, js/auto-refresh.js)
//   4. check-segmented  the check flagged a segmented control for its own padding       (research/_review/measure-align.mjs)
//   5. check-buttons  the check compared buttons that only overlap by chance            (research/_review/measure-align.mjs)
//
// The check sections carry the proof that a real misalignment is still caught: proof.json, written by proof.mjs, which runs the
// old and the new check on the same fixtures.
//
// Run: node research/formgrid-notes-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'formgrid-notes-1019';

/** @type {{ fixtures: { id: string, section: string, what: string, expect: string, old: string[], now: string[] }[] }} */
const proof = existsSync(new URL('proof.json', here)) ? JSON.parse(readFileSync(new URL('proof.json', here), 'utf8')) : { fixtures: [] };

/** @param {string} s */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The proof table of one section. @param {string} sectionId */
const proofTable = (sectionId) => {
    const rows = proof.fixtures.filter((f) => f.section === sectionId);
    if (!rows.length) return '';
    const cell = (/** @type {string[]} */ lines) =>
        lines.length ? `${lines.length} line${lines.length === 1 ? '' : 's'}: ${esc(lines[0].replace(/^[^:]+: /, '').slice(0, 150))}` : 'none';
    return `<div class="fg-proof">
    <p><b>The check still catches a real misalignment.</b> The same fixtures, measured by the check as it was and as it is now (script: <code>research/formgrid-notes-1019/proof.mjs</code>).</p>
    <table>
        <thead><tr><th scope="col">Fixture</th><th scope="col">Should be</th><th scope="col">Check as it was</th><th scope="col">Check now</th></tr></thead>
        <tbody>
${rows.map((f) => `            <tr><td>${esc(f.what)}</td><td>${esc(f.expect)}</td><td>${cell(f.old)}</td><td>${cell(f.now)}</td></tr>`).join('\n')}
        </tbody>
    </table>
</div>`;
};

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, body: string, components: string }} s
 */
const section = (s) => `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="formal"
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What changed since you approved it:</b> ${s.changed}</p></div>
    <div class="kc-sec__head">
        <h2 id="h-${s.id}">${s.title}</h2>
        <p>${s.intro}</p>
    </div>
    <div class="kc-expected">
        <p><b>Expected:</b></p>
        <ul>
${s.expect.map((e) => `            <li>${e}</li>`).join('\n')}
        </ul>
    </div>
    <div data-review-look>
        <p data-for="formal">Formal: ${s.look}</p>
    </div>
${s.body}
</section>`;

const field = (/** @type {string} */ id, /** @type {string} */ value, /** @type {string} */ extra = '') =>
    `<input class="kp-field__input" type="text" id="${id}" value="${value}"${extra} />`;

const JSON_BODY = `{
  "topic": "backup.done",
  "ok": true,
  "stacks": ["media", "photos"]
}`;

const sections = [
    section({
        id: 'form-gap',
        title: 'Form grid: a form between rows keeps the grid’s gap',
        intro: 'One form grid with a row, then a form (two rows of its own), then a row again. The rows are spaced by the grid’s row gap wherever they stand.',
        changed:
            'Formal drew its own 1 rem gap on every form (<code>.kp-form</code>). When that form was a block of a form grid, its rows are rows of the grid (the form is a subgrid of it), but this gap, being more specific than the grid’s, overrode the grid’s: the two rows inside the form stood further apart than the rows around them, and a page that set <code>--kp-formgrid-gap</code> got its setting everywhere except inside the form. Now the form takes the grid’s gap, and a form on its own page keeps formal’s gap. The rows, the columns and everything else of the grid are as you approved them.',
        expect: [
            'The distance from <b>Name</b> to <b>Region</b>, from <b>Region</b> to <b>Retention</b> (both inside the form), and from <b>Retention</b> to <b>Contact</b> is the same in all four steps.',
            'The labels, the fields and the <b>Save</b> button keep their columns from row to row, in and out of the form.',
        ],
        look: 'four rows with one and the same space between them, the form’s two rows not further apart than the rest.',
        components: 'formgrid',
        body: `<div class="fg-stage"><div class="kp-formgrid" style="--kp-formgrid-gap: 0.5rem">
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-gap-name">Name</label>
        <div class="kp-formgrid__control">${field('fg-gap-name', 'Nightly snapshot')}</div>
        <p class="kp-formgrid__value">shown in the list</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Rename</button></div>
    </div>
    <form class="kp-form" action="#" onsubmit="return false">
        <div class="kp-formgrid__row">
            <label class="kp-formgrid__label" for="fg-gap-region">Region</label>
            <div class="kp-formgrid__control">${field('fg-gap-region', 'eu-west')}</div>
            <p class="kp-formgrid__value">where it runs</p>
            <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Change</button></div>
        </div>
        <div class="kp-formgrid__row">
            <label class="kp-formgrid__label" for="fg-gap-keep">Retention</label>
            <div class="kp-formgrid__control">${field('fg-gap-keep', '30 days')}</div>
            <p class="kp-formgrid__value">oldest is removed</p>
            <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="submit">Save</button></div>
        </div>
    </form>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-gap-contact">Contact</label>
        <div class="kp-formgrid__control">${field('fg-gap-contact', 'ops@example.net')}</div>
        <p class="kp-formgrid__value">told when it fails</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Edit</button></div>
    </div>
</div></div>`,
    }),
    section({
        id: 'json-action',
        title: 'Form grid: a row’s action on the JSON field’s tool row',
        intro: 'A request body in a JSON field with its tools (Format, Minify, Wrap, Copy) above it, and the row’s own action, Send test, in the actions column.',
        changed:
            'A JSON field’s first line is its tool row, and its label already stood on that line. The row’s own action in the actions column had no way to: it stood at the top of the cell, level with the field’s top edge, so “Send test” was a few pixels off the line of Format and Minify. Now, in a row that holds a JSON field, the actions cell is exactly one tool row high and centres its button on it, so Send test stands on the line of the tools and in the column of every other row action. Stacked on a phone the action falls below the field as before. The JSON field itself is as you approved it.',
        expect: [
            'The label <b>Request body</b>, the four tools and <b>Send test</b> stand on one line; <b>Send test</b> is in the same column as <b>Check</b> in the row above.',
            'Press <b>Format</b> or <b>Minify</b>: the row does not move. At 390 px the action falls below the field.',
        ],
        look: 'the word Request body, the four tools and Send test on one line, with Send test in the actions column.',
        components: 'formgrid json-field',
        body: `<div class="fg-stage"><div class="kp-formgrid">
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-json-url">Endpoint</label>
        <div class="kp-formgrid__control">${field('fg-json-url', 'https://kyu.example.internal/v1/messages')}</div>
        <p class="kp-formgrid__value">where it is sent</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Check</button></div>
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-json-body">Request body</label>
        <div class="kp-formgrid__control"><textarea class="kp-field__input kp-field__input--multiline" id="fg-json-body" rows="5" data-kp-json="strict" data-kp-json-indent="2" data-kp-json-format="button">${JSON_BODY}</textarea></div>
        <p class="kp-formgrid__value">checked as you type</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm kp-button--primary" type="button">Send test</button></div>
    </div>
</div></div>`,
    }),
    section({
        id: 'refresh-label',
        title: 'Form grid: the refresh next to its label',
        intro: 'A settings list with the automatic refresh as one of its rows: a label, the interval chooser, the freshness line and Refresh now.',
        changed:
            'The refresh bar of a form grid is a subgrid of it, which left no cell for a label: the label had to go in a row of its own, or the page drew its own nested grid. Now the refresh takes <code>data-kp-refresh-label="Auto-refresh"</code> and draws that word as the first cell of its bar, in the label column, with the chooser in the control column, the freshness line in the value column and Refresh now in the actions column, all on one first baseline. The chooser also started 4 px left of every other control (the refresh kept its own column gap instead of the grid’s); it now starts on the same edge. Outside a form grid the label is a line above the bar. The chooser, the countdown, the freshness line and Refresh now are as you approved them.',
        expect: [
            'The word <b>Auto-refresh</b> stands in the label column like <b>Name</b> and <b>Retention</b>; the chooser starts on the edge of the fields above and below it.',
            'The freshness line stands in the value column and <b>Refresh now</b> in the actions column, in line with the other rows’ actions.',
            'Press <b>Refresh now</b>: the line says it is updating and then that it is fresh; nothing moves.',
        ],
        look: 'the label, the chooser, the freshness line and Refresh now on one line, on the same four columns as the rows around them.',
        components: 'formgrid refresh',
        body: `<div class="fg-stage"><div class="kp-formgrid">
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-ref-name">Name</label>
        <div class="kp-formgrid__control">${field('fg-ref-name', 'Nightly snapshot')}</div>
        <p class="kp-formgrid__value">shown in the list</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Rename</button></div>
    </div>
    <div class="kp-refresh" data-kp-refresh="30" data-kp-refresh-choices="0,30,300" data-kp-refresh-label="Auto-refresh"></div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-ref-keep">Retention</label>
        <div class="kp-formgrid__control">${field('fg-ref-keep', '30 days')}</div>
        <p class="kp-formgrid__value">oldest is removed</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Save</button></div>
    </div>
</div></div>`,
    }),
    section({
        id: 'check-segmented',
        title: 'Alignment check: a segmented control’s own edge',
        intro: 'A settings list with a segmented filter under it, starting on the list’s own left edge.',
        changed:
            'This changes the check, not a component. The check that holds every page to the grid (<code>measure-align.mjs</code>, rule D: a group of buttons under a list starts on one of its column edges) read a segmented control by its first item, which stands 4 px inside the control’s box (its own padding), and reported the filter as 4 px off the list’s edge. A segmented control is one box, drawn with its own padding: that box is its edge. The check now reads the box. A filter whose box is off the columns is still reported, as the proof below shows. Nothing on this page, and no component, looks different.',
        expect: [
            'The filter’s box starts on the left edge of the list above it; the check passes this page.',
            'The proof table lists a filter flush with the list (only the old check reported it) and one 24 px off the list’s columns (both report it).',
        ],
        look: 'the filter’s outer edge on the left edge of the list above it.',
        components: 'formgrid segmented',
        body: `<div class="fg-stage"><div class="kp-formgrid">
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-seg-name">Name</label>
        <div class="kp-formgrid__control">${field('fg-seg-name', 'Nightly snapshot')}</div>
        <p class="kp-formgrid__value">shown in the list</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Rename</button></div>
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="fg-seg-keep">Retention</label>
        <div class="kp-formgrid__control">${field('fg-seg-keep', '30 days')}</div>
        <p class="kp-formgrid__value">oldest is removed</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Save</button></div>
    </div>
</div>
<div style="margin-block-start: var(--kp-space-md, 0.75rem)"><div class="kp-segmented" role="group" aria-label="Show" data-kp-segmented="single">
    <button type="button" class="kp-segmented__item" data-value="all" role="radio" aria-checked="true"><span class="kp-segmented__label">All</span></button>
    <button type="button" class="kp-segmented__item" data-value="failed" role="radio" aria-checked="false"><span class="kp-segmented__label">Failed</span></button>
    <button type="button" class="kp-segmented__item" data-value="running" role="radio" aria-checked="false"><span class="kp-segmented__label">Running</span></button>
</div></div></div>
${proofTable('check-segmented')}`,
    }),
    section({
        id: 'check-buttons',
        title: 'Alignment check: buttons that are not on one line',
        intro: 'Two cards side by side, each with a button at its own height, and the real case: Format, Minify and Send test on one line.',
        changed:
            'This changes the check, not a component. Rule C (two buttons that stand side by side share a top, a centre or a bottom) compared every pair whose boxes overlapped by even a pixel, so a button at the foot of one card and a button at the head of the next column were reported as “off one line” by chance, and so was a button inside a box it had scrolled out of or that was hidden. Now a pair is two buttons that stand on one line (their boxes share at least three quarters of the shorter one), and a button that cannot be seen is not part of the composition. “Send test” 9 px off “Format” is still reported, as the proof below shows. Nothing on this page, and no component, looks different.',
        expect: [
            'The check passes this page: the two cards’ buttons and the three buttons on one line.',
            'The proof table lists Send test 9 px off Format, which both checks report, and two buttons that overlap by chance and a button scrolled out of its box, which only the old check reported.',
        ],
        look: 'Format, Minify and Send test on one line; the buttons of the two cards each in their own card.',
        components: 'formgrid button',
        body: `<div class="fg-stage">
<div class="fg-pair">
    <div class="fg-card"><p>A short card with its button at the head.</p><button class="kp-button kp-button--sm" type="button">Open</button></div>
    <div class="fg-card"><p>A tall card: a longer text that takes three lines in a column this wide, so its button stands lower than the one beside it.</p><p>A second paragraph of the same card.</p><button class="kp-button kp-button--sm" type="button">Details</button></div>
</div>
<div class="kp-formgrid" style="margin-block-start: var(--kp-space-md, 0.75rem)">
    <div class="kp-formgrid__row kp-formgrid__row--buttons">
        <div class="kp-formgrid__control"><div class="kp-formgrid__buttons">
            <button class="kp-button" type="button">Format</button>
            <button class="kp-button" type="button">Minify</button>
        </div></div>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--primary" type="button">Send test</button></div>
    </div>
</div>
${proofTable('check-buttons')}
</div>`,
    }),
];

const body = sections.join('\n');

const verdictsFile = new URL('VERDICTS.json', here);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^formgridnotes-[0-9a-f]{8}-/.test(current) ? current : `formgridnotes-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Form grid notes: form gap, JSON action, refresh label, alignment check</title>
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
        <link rel="stylesheet" href="../kpadopt56/part.css" />
        <link rel="stylesheet" href="../kpadopt56/src/kpadopt6-calm/page.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>Notes on the form grid</h1>
                <p class="cat-intro">
                    The chassis-rs and homelab threads, laying their settings out on the form grid, found three places where it fell short and two
                    where the alignment check was wrong. Five sections, all in formal: the form grid gap, the JSON field’s action, the refresh with a
                    label, and the check’s reading of a segmented control and of buttons. Each says under <b>What changed since you approved it</b>
                    what was wrong and what is different now.
                </p>
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
console.log(`${ID}: ${sections.length} sections, round ${roundId}`);
