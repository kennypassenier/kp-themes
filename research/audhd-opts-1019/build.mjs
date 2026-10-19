// Builds research/audhd-opts-1019/demo.html: three options the AuDHD recipes project asked for (gaps 1, 2 and 24 of its list),
// added to components Kenny had approved, so each comes back through the review dialog (DEMO_RULES ch. 7 and 9) with a plain
// "What changed" text. Formal only: nothing here looks different per theme beyond the theme's own tile padding and type.
//
//   1. action-size       the size of an action tile board                        (css/components.css, js/action-tiles.js)
//   2. freshness-tone    a calm stale tone and a days-only reading                (css/components.css, js/freshness.js)
//   3. sentence-computed a read-only field the sentence works out itself         (css/components.css, js/sentence.js)
//
// Every section is a composition on the page's twelve columns (page.css): the component being judged on the larger span, a
// readout that follows it on the smaller one, labels, values and actions in columns that run across their rows (.kp-formgrid).
//
// Run: node research/audhd-opts-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'audhd-opts-1019';

const esc = (/** @type {string} */ s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');

/**
 * One control group: buttons that set one attribute on the component (the very thing a page or the console does).
 * `value: null` takes the attribute away; a string sets it.
 * @param {{ label: string, target: string, attr: string, options: [string, string | null][], on: number }} g
 */
const group = (g) =>
    `<div role="group" aria-label="${esc(g.label)}"><b>${g.label}:</b> ${g.options
        .map(
            ([label, value], i) =>
                `<button type="button" class="kp-button kp-button--sm" data-ao-target="${g.target}" data-ao-attr="${g.attr}"${value === null ? ' data-ao-remove' : ` data-ao-value="${esc(value)}"`} aria-pressed="${i === g.on}">${label}</button>`,
        )
        .join(' ')}</div>`;

/** A group of buttons that set a field of the sentence. @param {string} label @param {[string, string, string][]} options [button, field name, value] */
const setters = (label, options) =>
    `<div role="group" aria-label="${esc(label)}"><b>${label}:</b> ${options
        .map(([text, name, value]) => `<button type="button" class="kp-button kp-button--sm" data-ao-field="${name}" data-ao-text="${esc(value)}">${text}</button>`)
        .join(' ')}</div>`;

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, components: string, target: string, controls: string[], board: string }} s
 */
const section = (s) => `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-topic="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${esc(s.title)}"
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
        <p data-for="formal">${s.look}</p>
    </div>
    <div data-review-controls data-review-controls-for="${s.id}-board">
        ${s.controls.join('\n        ')}
    </div>
${s.board.replace('<div class="ao-board">', `<div class="ao-board" id="${s.id}-board">`)}
</section>`;

/** A block of the board: a heading, one sentence, then its content, on `span` of the twelve columns. */
const block = (/** @type {number} */ span, /** @type {string} */ title, /** @type {string} */ about, /** @type {string} */ inner, extra = '') =>
    `<div class="ao-block ao-span-${span}"${extra}>
    <h3 class="ao-block__title">${title}</h3>
    <p class="ao-block__about">${about}</p>
${inner}
</div>`;

const tile = (/** @type {string} */ title, /** @type {string} */ text, /** @type {string} */ attrs = '', tag = 'button', cls = 'kp-action') =>
    tag === 'a'
        ? `<a class="${cls}" href="#ao-tiles"${attrs}><strong class="kp-action__title">${title}</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">${text}</span></a>`
        : `<button type="button" class="${cls}"${attrs}><strong class="kp-action__title">${title}</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">${text}</span></button>`;

const kv = (/** @type {[string, string, string?][]} */ rows) =>
    `<dl class="kp-kv">\n${rows.map(([k, v, id]) => `    <div class="kp-kv__row"><dt>${k}</dt><dd${id ? ` data-ao-read="${id}"` : ''}>${v}</dd></div>`).join('\n')}\n</dl>`;

const sections = [
    section({
        id: 'action-size',
        title: 'Action tiles: a size',
        intro: 'A board of buttons and links, each with a title and the one sentence that says what it does. The board can now be compact, the theme&rsquo;s own size, or large.',
        changed:
            'Action tiles had one size in every place they were used, so a page with many small actions and a page with three important ones looked the same. The board, one tile, or any element above them can now say <code>data-kp-action-size="compact"</code> or <code>"large"</code>. The tile&rsquo;s padding, title, sentence and mark scale together, and so does the width a column may shrink to, so a compact board fits more tiles on a line and a large one fewer. With no attribute nothing changes. The option follows the attribute at runtime, in every theme.',
        expect: [
            'The board opens at the theme&rsquo;s own size. The block beside it reads <b>Default</b> and lists the tile height, title size, padding and tiles per line.',
            'Press <b>Compact</b> in the control group above the board: every tile shrinks together, more tiles stand on a line, and the readout follows. Press <b>Large</b>: tiles grow and fewer fit on a line. Press <b>Default</b> to come back.',
            'All six tiles keep one height whatever their state: a button, a link with its arrow, a destructive one with its bar, one that is busy with its spinner and one that is disabled.',
        ],
        look: 'six tiles on one grid, all one height; the mark column keeps its place in every size; the readout column lines its numbers up under each other.',
        components: 'action',
        target: 'ao-tiles',
        controls: [
            group({
                label: 'Size',
                target: 'ao-tiles',
                attr: 'data-kp-action-size',
                options: [
                    ['Compact', 'compact'],
                    ['Default', null],
                    ['Large', 'large'],
                ],
                on: 1,
            }),
        ],
        board: `<div class="ao-board">
${block(
    8,
    'Backup actions',
    'Mock actions of a backup page. Each tile does one thing and says which.',
    `<div class="kp-actions" id="ao-tiles">
    ${tile('Back up now', 'Copies every volume to the backup disk and checks the copy.')}
    ${tile('Restart stack', 'Stops the stack, starts it again and waits until it answers.')}
    ${tile('Open host page', 'Shows the disks, the temperature and the last boot of this host.', '', 'a')}
    ${tile('Delete old snapshots', 'Removes every snapshot older than 30 days. This cannot be undone.', '', 'button', 'kp-action kp-action--destructive')}
    ${tile('Check disks', 'Reads every disk&rsquo;s health report and lists what it found.', ' aria-busy="true"')}
    ${tile('Export logs', 'Saves the last seven days of logs as one file.', ' disabled')}
</div>`,
)}
${block(
    4,
    'What the size sets',
    'Read from the tiles as they are drawn, so it follows every press.',
    kv([
        ['Size', 'Default', 'size'],
        ['Tile height', '', 'height'],
        ['Title size', '', 'title'],
        ['Padding', '', 'pad'],
        ['Tiles per line', '', 'per-line'],
    ]),
)}
</div>`,
    }),
    section({
        id: 'freshness-tone',
        title: 'Freshness line: a calm stale tone and days only',
        intro: 'The line that says how old data is (&ldquo;updated 12 s ago&rdquo;). For data that is old on purpose, such as a frozen recipe, it no longer has to look like a warning.',
        changed:
            'Once a line was older than its limit it turned into an amber warning plate, and it counted in two units (&ldquo;97 days 4 h&rdquo;). Two options are new. <code>data-kp-stale-tone="calm"</code> draws the stale line as a quiet plate in the muted ground and ordinary ink, with the same size, so turning stale still moves nothing. <code>data-kp-ago-units="days"</code> counts whole days from one day on (&ldquo;frozen 97 days ago&rdquo;), and keeps hours and minutes under a day. With neither attribute nothing changes. Both follow their attribute at runtime.',
        expect: [
            'The first row is the amber plate as before: <b>frozen 97 days 4 h ago</b>. The second is the same age on a quiet grey plate, the third reads <b>frozen 97 days ago</b>.',
            'The fourth row is only 3 h old, so it has no plate at all and still reads <b>3 h 12 min</b>, also with days only.',
            'Press <b>Calm</b> and <b>Days only</b> in the control group: the last row (the live line) changes tone and units, and the block beside it shows the exact moment and the limit.',
        ],
        look: 'the four lines start on the same edge of the control column and sit on their label&rsquo;s baseline; the plates change colour but not size.',
        components: 'ago',
        target: 'ao-ago-live',
        controls: [
            group({
                label: 'Tone',
                target: 'ao-ago-live',
                attr: 'data-kp-stale-tone',
                options: [
                    ['Warning', null],
                    ['Calm', 'calm'],
                ],
                on: 0,
            }),
            group({
                label: 'Units',
                target: 'ao-ago-live',
                attr: 'data-kp-ago-units',
                options: [
                    ['Two units', null],
                    ['Days only', 'days'],
                ],
                on: 0,
            }),
        ],
        board: `<div class="ao-board">
${block(
    8,
    'Four lines, one age',
    'Mock lines of a recipe box. The first three are 97 days 4 h old, the fourth 3 h 12 min.',
    `<div class="kp-formgrid" data-kp-formgrid-lines="lines">
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label">Warning plate</span>
        <div class="kp-formgrid__control"><time class="kp-ago" data-kp-ago data-kp-ago-verb="frozen" data-kp-stale-after="1209600" data-ao-age="8395200"></time></div>
        <p class="kp-formgrid__value">As it was: amber, two units.</p>
    </div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label">Calm plate</span>
        <div class="kp-formgrid__control"><time class="kp-ago" data-kp-ago data-kp-ago-verb="frozen" data-kp-stale-after="1209600" data-kp-stale-tone="calm" data-ao-age="8395200"></time></div>
        <p class="kp-formgrid__value">Quiet grey, two units.</p>
    </div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label">Calm, days only</span>
        <div class="kp-formgrid__control"><time class="kp-ago" data-kp-ago data-kp-ago-verb="frozen" data-kp-stale-after="1209600" data-kp-stale-tone="calm" data-kp-ago-units="days" data-ao-age="8395200"></time></div>
        <p class="kp-formgrid__value">Quiet grey, whole days.</p>
    </div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label">Not stale yet</span>
        <div class="kp-formgrid__control"><time class="kp-ago" data-kp-ago data-kp-ago-verb="frozen" data-kp-stale-after="1209600" data-kp-stale-tone="calm" data-kp-ago-units="days" data-ao-age="11520"></time></div>
        <p class="kp-formgrid__value">Under a day, so no plate and exact.</p>
    </div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label">Live line</span>
        <div class="kp-formgrid__control"><time class="kp-ago" id="ao-ago-live" data-kp-ago data-kp-ago-verb="frozen" data-kp-stale-after="1209600" data-ao-age="8395200"></time></div>
        <p class="kp-formgrid__value">Follows the buttons above.</p>
    </div>
</div>`,
)}
${block(
    4,
    'The live line',
    'What the line carries under its words.',
    kv([
        ['Frozen on', '', 'moment'],
        ['Stale after', '14 days'],
        ['Tone', 'Warning', 'tone'],
        ['Units', 'Two units', 'units'],
    ]),
)}
</div>`,
    }),
    section({
        id: 'sentence-computed',
        title: 'Sentence form: a field the sentence works out',
        intro: 'A form that reads as a sentence. Some words in it can now be worked out from the fields you fill in, and are not fields you type in yourself.',
        changed:
            'Every field in a sentence form was something the person typed or chose. A sentence can now hold a read-only computed field: <code>&lt;output class="kp-sentence__computed" data-kp-sentence-computed="ready"&gt;</code> inside a <code>.kp-sentence__field</code>, with a function that gets the value of the other fields and returns its words (<code>attachSentences(root, { computed })</code>, <code>sentence(form).compute(name, fn)</code>, or <code>setSentenceComputed(form, name, text)</code> to push the text in). It is drawn on a quiet plate with no underline in the primary colour, so it is not mistaken for something to fill in; it is not a tab stop, is not sent with the form, and is part of the spoken summary. With nothing to say it shows a dash.',
        expect: [
            'Read the sentence: <b>Start cooking at 17:30. It takes 70 min, so dinner is ready at 18:40. It serves 4 people at 150 g each: 600 g in total.</b> The two grey words are worked out.',
            'Change the start time or the minutes, the people or the grams: the grey words change at once. Press <b>95 min</b> and dinner is ready at 19:05; press <b>Clear minutes</b> and it shows a dash and the spoken summary says <b>(Ready at)</b>.',
            'Press Tab through the sentence: the focus visits the four fields you type in and never the grey ones. The block beside it shows what is sent with the form: only those four.',
        ],
        look: 'the grey words stand on the line of the words around them, as tall as the fields beside them, with no underline.',
        components: 'sentence',
        target: 'ao-sentence',
        controls: [
            setters('Minutes', [
                ['70 min', 'minutes', '70'],
                ['95 min', 'minutes', '95'],
                ['Clear minutes', 'minutes', ''],
            ]),
            setters('People', [
                ['4 people', 'people', '4'],
                ['10 people', 'people', '10'],
            ]),
        ],
        board: `<div class="ao-board">
${block(
    8,
    'Tonight&rsquo;s dinner',
    'A mock cooking plan. Four fields to fill in, two words worked out from them.',
    `<form class="kp-sentence" data-kp-sentence data-kp-sentence-size="lg" id="ao-sentence" onsubmit="return false">
    <p class="kp-sentence__text">
        Start cooking at <span class="kp-sentence__field"><input name="start" size="5" value="17:30" aria-label="Start time (HH:MM)" /></span>.
        It takes <span class="kp-sentence__field"><input name="minutes" size="3" inputmode="numeric" value="70" aria-label="Minutes" /></span> min,
        so dinner is ready at <span class="kp-sentence__field"><output class="kp-sentence__computed" data-kp-sentence-computed="ready" aria-label="Ready at"></output></span>.
        It serves <span class="kp-sentence__field"><input name="people" size="3" inputmode="numeric" value="4" aria-label="People" /></span> people at
        <span class="kp-sentence__field"><input name="grams" size="4" inputmode="numeric" value="150" aria-label="Grams each" /></span> g each:
        <span class="kp-sentence__field"><output class="kp-sentence__computed" data-kp-sentence-computed="total" aria-label="In total"></output></span> in total.
    </p>
</form>`,
)}
${block(
    4,
    'What the sentence says',
    'Updated after every change.',
    kv([
        ['Spoken summary', '', 'summary'],
        ['Sent with the form', '', 'sent'],
        ['Computed words', '2'],
    ]),
)}
</div>`,
    }),
];

const body = sections.join('\n');

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, bundledInto: 'round-3-1019', rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^audhdopts-[0-9a-f]{8}-/.test(current) ? current : `audhdopts-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Three options for the recipe app: tile size, calm freshness, computed sentence word</title>
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
                <h1>Three options for the recipe app</h1>
                <p class="cat-intro">
                    The AuDHD recipe project asked for three things its pages could not do: action tiles in a smaller or larger size, a freshness
                    line that says &ldquo;frozen 97 days ago&rdquo; on a calm plate instead of a warning, and a sentence form with words it works out
                    itself. Each is an option of a component you approved, with its old look as the default. Three sections, formal only; under
                    <b>What changed since you approved it</b> each says what is new.
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
console.log(`${ID}: ${sections.length} sections, ${sections.length} pairs, round ${roundId}`);
