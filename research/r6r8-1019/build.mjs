// Builds research/r6r8-1019/demo.html: four faults the project threads found (homelab 24, almanac 15, AuDHD recipes 29 and 30), fixed in
// the package. They change components Kenny had approved, so each comes back through the review dialog (DEMO_RULES ch. 7 and 9) with a
// plain "What changed" text, in formal (every fix is the theme's existing plate, button and busy card).
//
//   1. snooze-width    the "remind me later" picker had no width of its own (css/components.css)
//   2. copyable-kv     the Copy button broke mid-word in a narrow fact cell (css/components.css)
//   3. checklist-failed the checklist's failed and empty states are the state plate, with a Retry (js/checklist.js)
//   4. timers-states   the timer list has loading, empty and failed states, as high as a row of cards (js/timer.js)
//
// The page is bundled into round-3-1019 afterwards (VERDICTS.json "bundledInto"); it has no catalogue entry of its own.
// Run: node research/r6r8-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'r6r8-1019';
const THEMES = ['formal'];

/** @param {string} text */
const looks = (text) => THEMES.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * A group of state buttons: one pressed at a time.
 * @param {string} key @param {string} label @param {[string, string][]} options
 */
const group = (key, label, options) =>
    `<div role="group" aria-label="${label}"><b>${label}:</b> ${options
        .map(
            ([value, text], i) =>
                `<button type="button" class="kp-button kp-button--sm" data-rr-set="${key}" data-rr-value="${value}" aria-pressed="${i === 0}">${text}</button>`,
        )
        .join(' ')}</div>`;

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, components: string, groups?: string, stage: string }} s
 */
const section = (s) => `
<section
    class="rr-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-topic="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What changed since you approved it:</b> ${s.changed}</p></div>
    <div class="rr-sec__head">
        <h2 id="h-${s.id}">${s.title}</h2>
        <p>${s.intro}</p>
    </div>
    <div class="rr-expected">
        <p><b>Expected:</b></p>
        <ul>
${s.expect.map((e) => `            <li>${e}</li>`).join('\n')}
        </ul>
    </div>
    <div data-review-look>
${looks(s.look)}
    </div>${
        s.groups
            ? `
    <div data-review-controls data-review-controls-for="${s.id}-component">
        ${s.groups}
    </div>`
            : ''
    }
    <div class="rr-stage" id="${s.id}-component">
${s.stage}
    </div>
</section>`;

const STATES4 = /** @type {[string, string][]} */ ([
    ['ready', 'Ready'],
    ['loading', 'Loading'],
    ['empty', 'Empty'],
    ['error', 'Failed'],
]);

const snooze = (/** @type {string} */ extra = '') =>
    `<div class="kp-snooze" data-kp-snooze data-kp-snooze-choices="1h 4h tonight tomorrow monday pick" data-kp-look="menu"${extra}></div>`;

const copy = (/** @type {string} */ id, /** @type {string} */ value) =>
    `<span class="kp-copyable"><span class="kp-copyable__value" id="${id}">${value}</span><button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="${id}">Copy</button></span>`;

const kv = (/** @type {string} */ p) => `<dl class="kp-kv">
    <div class="kp-kv__row"><dt>Client</dt><dd>kyu-runner</dd></div>
    <div class="kp-kv__row"><dt>Token id</dt><dd>${copy(`${p}-id`, 'tok_3f9a21c8d4')}</dd></div>
    <div class="kp-kv__row"><dt>Endpoint</dt><dd>${copy(`${p}-url`, 'https://kyu.example.internal/v1/messages')}</dd></div>
    <div class="kp-kv__row"><dt>Last used</dt><dd>19/10/2026 08:41</dd></div>
</dl>`;

const sections = [
    section({
        id: 'snooze-width',
        title: 'Remind me later: the picker in a cell, a bar and a form',
        intro: 'The button that puts a reminder off, with its line under it, in the places a page puts it: a table row, a selection bar, a form row and a narrow cell.',
        changed:
            'The picker had no width of its own: wherever its cell, row or bar sized itself from what it held, the picker came out as wide as nothing, so &ldquo;Not snoozed&rdquo; broke letter by letter and each page had to give it a fixed width. Now the picker is as wide as its button and its line, and fills the room it is given: in a column of a grid it takes the column, in a bar it sits among the other buttons, and in a narrow cell End snooze goes under the button. The choices, the menu, the date panel and the snoozed line are as you approved them.',
        expect: [
            '<b>Table row</b>: the picker is one button in its own column, &ldquo;Not snoozed&rdquo; under it on one line; the second row shows a snoozed reminder with <b>End snooze</b> beside the button.',
            '<b>Selection bar</b>: the button stands among the bar&rsquo;s buttons on one line.',
            '<b>Form row</b>: the button fills the control column, the line under it; <b>narrow cell</b>: button and End snooze on two lines, none cut.',
        ],
        look: 'every &ldquo;Not snoozed&rdquo; is one line, and the buttons stand on a common line and edge.',
        components: 'snooze',
        stage: `<div class="rr-stage-stack">
    <div>
        <p class="rr-label">In a table and its selection bar: name, picker and action, each in its own column</p>
        <div class="rr-cells">
            <p class="rr-cells__head">Reminder</p><p class="rr-cells__head">Put off</p><p class="rr-cells__head">Action</p>
            <p class="rr-cells__name">Backup of the photos stack failed</p>${snooze()}<button type="button" class="kp-button">Open</button>
            <p class="rr-cells__name">Certificate expires in 12 days</p>${snooze(' data-rr-snoozed')}<button type="button" class="kp-button">Open</button>
            <hr class="rr-cells__rule" />
            <div class="rr-cells__bar"><b>3 selected</b><button type="button" class="kp-button">Mark read</button></div>${snooze()}<button type="button" class="kp-button kp-button--destructive">Delete</button>
        </div>
    </div>
    <div>
        <p class="rr-label">In a form row</p>
        <div class="kp-formgrid">
            <div class="kp-formgrid__row">
                <span class="kp-formgrid__label">Remind me</span>
                <div class="kp-formgrid__control">${snooze()}</div>
                <p class="kp-formgrid__value">Nothing is snoozed.</p>
            </div>
        </div>
    </div>
    <div>
        <p class="rr-label">In a narrow cell (13 rem)</p>
        <div class="rr-narrow">${snooze(' data-rr-snoozed')}</div>
    </div>
</div>`,
    }),
    section({
        id: 'copyable-kv',
        title: 'Facts with a Copy button',
        intro: 'A list of facts (name left, value right) where two values can be copied, in a narrow cell and in a wide one.',
        changed:
            'In a narrow cell the Copy button was squeezed until its word broke in the middle (&ldquo;Co&rdquo; over &ldquo;py&rdquo;) while the long value kept its room. Now the button keeps its word whole and its size, and it is the value that wraps. In a list of facts the copyable fills its value cell and the Copy button stands at the end of the cell, so the buttons of every row line up in one column. The list, its labels and the other values are as you approved them.',
        expect: [
            'In both lists <b>Copy</b> is one word on one line, and the two Copy buttons stand under each other at the end of the value column.',
            'In the narrow list the long address wraps in the room beside the button; nothing is cut.',
        ],
        look: 'Copy is whole, the two buttons share one right edge, and the value has air before the button.',
        components: 'copyable',
        stage: `<div class="rr-stage-stack">
    <div><p class="rr-label">A narrow cell (19 rem)</p><div class="rr-kvcell rr-kvcell--narrow">${kv('rr-n')}</div></div>
    <div><p class="rr-label">A wide cell</p><div class="rr-kvcell">${kv('rr-w')}</div></div>
</div>`,
    }),
    section({
        id: 'checklist-failed',
        title: 'Checklist: failed and empty',
        intro: 'The shopping list. Press a state: it loads, is empty, or could not be read; Retry on the failed list reads it again.',
        changed:
            'A checklist that could not be read said so in one line of text, with no way to try again unless the page drew its own button, and its empty line was the same small line. Now both are the package&rsquo;s state plate: the title at heading size, centred in the whole body of the list (the same height as the list with its rows), a sentence under a failure and a normal-size <b>Retry</b>. Retry fires <code>kp-checklist-retry</code> on the list. The rows, the ticking, Clear checked and Undo are as you approved them.',
        expect: [
            '<b>Failed</b>: one red plate over the whole list body, the title at heading size, a sentence and a <b>Retry</b> button; the bar above it rests.',
            '<b>Empty</b>: the empty plate in the same place and the same height; <b>Loading</b>: the loading card over the body.',
            'Press <b>Retry</b>: the list loads for a moment and the rows come back.',
        ],
        look: 'the plate fills the body at the height of the loaded list, its words centred; Retry is a normal button.',
        components: 'checklist',
        groups: group('state', 'State', STATES4),
        stage: `<div class="kp-checklist" data-kp-checklist data-rr-checklist aria-label="Shopping list"></div>`,
    }),
    section({
        id: 'timers-states',
        title: 'Kitchen timers: loading, empty and failed',
        intro: 'The row of timer cards. Press a state: the timers load, none are running, or they could not be read; Retry reads them again.',
        changed:
            'The timer list had no loading and no failed state, and with no timer it showed a small dashed line, much lower than a row of cards, so the page jumped when the first timer started. Now loading is the theme&rsquo;s loading card over the whole row, empty and failed are the package&rsquo;s state plate as high as a card (a list that was read first keeps the height it had), and a failed list has a normal-size <b>Retry</b> (<code>kp-timers-retry</code>). The cards, the clock and the buttons are as you approved them.',
        expect: [
            '<b>Ready</b>: two timer cards. <b>Empty</b>: a plate as high as the cards, &ldquo;No timers running.&rdquo; at heading size, centred.',
            '<b>Failed</b>: a red plate of the same height with a sentence and a <b>Retry</b>; <b>Loading</b>: the loading card over the same box.',
            'Nothing under the list moves when the state changes.',
        ],
        look: 'every state is as high as the ready row, the words centred; Retry is a normal button.',
        components: 'timer',
        groups: group('state', 'State', STATES4),
        stage: `<div class="rr-timers-stage"><div class="kp-timers" data-kp-timers data-rr-timers aria-label="Kitchen timers"></div></div>`,
    }),
];

const body = sections.join('\n');

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, bundledInto: 'round-3-1019', rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^r6r8-[0-9a-f]{8}-/.test(current) ? current : `r6r8-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Four fixes on the grid: remind-me picker, Copy in facts, checklist and timer states</title>
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
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>Four fixes on the grid</h1>
                <p class="cat-intro">
                    The project threads found four places where an approved component did not hold its place: the remind-me picker had no width of
                    its own, a Copy button broke in the middle of its word in a narrow cell, a checklist that could not be read had no Retry, and the
                    timer list had no loading or failed state and a too-low empty line. ${sections.length} sections, formal only (every fix is the
                    theme&rsquo;s own plate, button and loading card). Each section says under <b>What changed since you approved it</b> what was
                    wrong and what is different now.
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
