// Builds research/kpi-entity-1019/demo.html: four faults of the key-figure tile and the entity card, found by the project threads
// (almanac 23, kyu 14, http-switchboard 33 and Round SW) and fixed in the package. They change components Kenny had approved, so
// each comes back through the review dialog (DEMO_RULES ch. 7 and 9) with a plain "What changed" text. Formal only.
//
//   1. kpi-label-hint    "Delivered" broke into DEL / IVE / RED beside its hint   (css/components.css)
//   2. kpi-label-note    a note wrapped with a dot at the start of its line        (css/components.css)
//   3. entity-actions    the same action was another width on every card           (css/components.css, js/entity-card.js)
//   4. entity-options    a meter had no good or quiet colour; the empty plate's action could not be left out or worded (js/entity-card.js, css)
//
// Run: node research/kpi-entity-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'kpi-entity-1019';
const PAGE_THEMES = ['formal'];

/** One look-at line per theme asked. @param {string[]} themes @param {string} text */
const looks = (themes, text) => themes.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, body: string, components: string, themes?: string[], topic?: string, topicTitle?: string }} s
 */
const section = (s) => {
    const themes = s.themes ?? ['formal'];
    const topic = s.topic ? ` data-review-topic="${s.topic}"${s.topicTitle ? ` data-review-topic-title="${s.topicTitle}"` : ''}` : '';
    return `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="${themes.join(',')}"${topic}
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
${looks(themes, s.look)}
    </div>
${s.body}
</section>`;
};

const frame = (/** @type {string} */ label, /** @type {string} */ inner, /** @type {number} */ width = 390) =>
    `<div class="ki-frame" style="--ki-w: ${width}px"><p class="ki-frame__label">${label}</p><div class="ki-col">\n${inner}\n</div></div>`;

const SPARK = (/** @type {string} */ label, /** @type {number[]} */ values) =>
    `<figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="${label}, last 24 hours, sample data"><script type="application/json" data-kp-chart-data>${JSON.stringify({ unit: 'events', digits: 0, series: [{ label, start: 1792360800000, step: 3600000, values }] })}</script></figure>`;

const toggle = (/** @type {string} */ label, /** @type {string} */ value, /** @type {string} */ note) =>
    `<button type="button" class="kp-kpi kp-kpi--toggle" aria-pressed="false"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Show in the bar</span><span data-kp-when="on">Showing only this &times;</span></span><span class="kp-kpi__value">${value}<small>events</small></span><span class="kp-kpi__trend">${note}</span></button>`;
const plain = (/** @type {string} */ label, /** @type {string} */ value, /** @type {string} */ note) =>
    `<div class="kp-kpi"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value">${value}<small>events</small></span><span class="kp-kpi__trend">${note}</span></div>`;
const trend = (/** @type {string} */ name, /** @type {string} */ labelNote, /** @type {string} */ value) =>
    `<div class="kp-kpi kp-kpi--trend"><span class="kp-kpi__label">${name} <span class="kp-kpi__label-note">${labelNote}</span></span><a class="kp-kpi__link" href="#charts" title="Open ${name} on Charts"><span class="kp-kpi__link-word">Charts</span> &#8599;</a><span class="kp-kpi__value">${value}<small>per hour</small></span><span class="kp-kpi__trend">Last 24 hours, sample data</span>${SPARK(name, [0, 0, 1, 0, 0, 0, 0, 1, 2, 1, 0, 1, 0, 0, 1, 1, 0, 2, 1, 0, 0, 1, 0, 1, 1])}</div>`;

const sections = [
    section({
        id: 'kpi-label-hint',
        title: 'Key figures: a tile name beside its hint',
        intro: 'A strip of key figures whose middle two tiles can be pressed to filter the journal. A pressable tile says in a small hint, beside its name, what pressing does.',
        topic: 'kpi',
        topicTitle: 'Key figure tile',
        changed:
            'In a narrow tile the hint (<b>Show in the bar</b>) took all the room it asked for and left the name 30 px: <b>Delivered since start</b> broke inside its words, letter by letter (<b>DEL / IVE / RED / SIN / CE</b>), seven lines tall. Now the name keeps the width of its longest word. The hint gives way instead: its own words wrap in the room that is left (<b>Show / in the bar</b>), and neither is ever broken inside a word.',
        expect: [
            'In the phone-width frame, <b>Delivered since start</b> and <b>Failed since start</b> read as whole words on two or three lines, with the hint right-aligned beside them.',
            'In the wide frame the names sit on one or two lines and the hint stays on the first line, at the end.',
            'No word in any tile is cut anywhere inside the word.',
        ],
        look: 'every tile name is made of whole words; the hint never pushes a letter of the name onto its own line.',
        components: 'kpi',
        body:
            frame(
                'A phone, 390 px (two tiles a row)',
                `<div class="kp-kpis" role="group" aria-label="Journal figures, phone">${plain('Waiting to be delivered', '0', 'Nothing is waiting')}${toggle('Delivered since start', '3', '3 accepted in all')}${toggle('Failed since start', '0', 'None gave up')}${trend('Deliveries per hour', 'sample data', '1')}</div>`,
                390,
            ) +
            frame(
                'A desk, 960 px (four tiles in a row)',
                `<div class="kp-kpis" role="group" aria-label="Journal figures, desk">${plain('Waiting to be delivered', '0', 'Nothing is waiting')}${toggle('Delivered since start', '3', '3 accepted in all')}${toggle('Failed since start', '0', 'None gave up')}${trend('Deliveries per hour', 'sample data', '1')}</div>`,
                960,
            ),
    }),
    section({
        id: 'kpi-label-note',
        title: 'Key figures: the note after a name',
        intro: 'Key figures with a 24-hour trend, each with a small note after its name (<b>avg 15 min</b>, <b>sample data</b>).',
        topic: 'kpi',
        changed:
            'When the note did not fit beside the name it moved to the next line as one piece, but its separating dot went with it: the line began with <b>&middot; SAMPLE DATA</b>, a dot with nothing before it. Now the dot only stands between the name and the note on one line; a note that starts a line has no dot.',
        expect: [
            'In the narrow frame the note stands on its own line under the name, with no dot before it.',
            'In the wide frame the note follows the name on its line, parted by a dot.',
        ],
        look: 'no line of a tile name begins with a dot; a dot between name and note has air on both sides.',
        components: 'kpi',
        body:
            frame(
                'A phone tile, 190 px',
                `<div class="kp-kpis" role="group" aria-label="Trends, narrow">${trend('Deliveries per hour', 'sample data', '1')}</div>`,
                190,
            ) +
            frame(
                'A wide tile, 420 px',
                `<div class="kp-kpis" role="group" aria-label="Trends, wide">${trend('Pressure', 'avg 15 min', '3.3')}</div>`,
                420,
            ),
    }),
    section({
        id: 'entity-actions',
        title: 'Cards: the same action, the same width',
        intro: 'Profile cards with three actions each. The words differ from card to card (<b>Recheck this profile</b>, <b>Try a translation</b>, <b>Open the log</b>), the cards are one size.',
        topic: 'entity',
        topicTitle: 'Entity card',
        changed:
            'The three action columns were sized by their words (<b>minmax(min-content, 1fr)</b>), so a card with a long action had other column widths than the card next to it: the same <b>Remove</b> was a different width on every card. Now the columns are three equal tracks on every card, a long label wraps between words inside its button, and a button whose longest word cannot fit moves into <b>More</b> on every card of the grid at once.',
        expect: [
            'The buttons of every card start and end on the same edges as the buttons in the same position on the card above or beside it.',
            'A long label (<b>Recheck this profile</b>) wraps onto two lines inside its button; no word is broken.',
        ],
        look: 'the same action has the same width and the same left edge on every card; nothing runs past a card.',
        components: 'entity-grid',
        body: `<div class="ki-wide"><div class="kp-entity-grid" data-kp-entity-grid data-kp-entity-min="22rem" data-kp-entity-meters="1" data-ki-grid="actions"></div></div>`,
    }),
    section({
        id: 'entity-options',
        title: 'Cards: a good or quiet meter, and an empty grid with its own action',
        intro: 'A card whose bars say whether a high reading is good (free space), quiet (a queue that is fine at any height) or worth a warning; and the plate shown when a grid has no cards, with no action, or with the action you word.',
        topic: 'entity',
        changed:
            'A card&rsquo;s bar could only turn amber or red (and it did so by itself above 75 % and 90 %), so a share where high is good, such as free space, was drawn like a warning. A bar now takes <b>success</b> (green) or <b>neutral</b> (quiet grey) as its tone, which stops the automatic amber and red. The empty plate always carried a fixed &ldquo;New&rdquo; action; it can now have <b>no action</b> or your own words and your own function.',
        expect: [
            'On the first card, <b>Free disk</b> at 82 % is green and <b>Queue</b> at 91 % is grey, while <b>CPU</b> at 91 % with no tone is red as before.',
            'The first empty plate has a title and a line and no button; the second has a button with its own words (<b>Reload profiles</b>) that writes a line under the plate when pressed.',
        ],
        look: 'each bar&rsquo;s colour matches its meaning; the plate without a button keeps the same size and place as the one with it.',
        components: 'entity-grid',
        body: `<div class="ki-wide"><div class="kp-entity-grid" data-kp-entity-grid data-kp-entity-min="22rem" data-kp-entity-meters="3" data-ki-grid="tones"></div></div>
<div class="ki-pair">
    <div class="ki-pair__cell"><p class="ki-frame__label">No action</p><div class="kp-entity-grid" data-kp-entity-grid data-kp-entity-empty-action="none" data-ki-grid="empty-none"></div></div>
    <div class="ki-pair__cell"><p class="ki-frame__label">Own words and function</p><div class="kp-entity-grid" data-kp-entity-grid data-ki-grid="empty-custom"></div><p class="ki-readout" id="ki-readout" role="status" aria-live="polite">Press the button: nothing has been pressed yet.</p></div>
</div>`,
    }),
];

const body = sections.join('\n');
const pairs = sections.reduce((n, s) => n + (/data-review-themes="([^"]+)"/.exec(s)?.[1].split(',').length ?? 1), 0);

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^kpientity-[0-9a-f]{8}-/.test(current) ? current : `kpientity-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Four faults: key-figure names and notes, entity-card actions and options</title>
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
                <h1>Key figures and entity cards: four faults</h1>
                <p class="cat-intro">
                    The project threads found four faults in two approved components: a key-figure name broken inside its words, a note that began
                    a line with a stray dot, entity-card actions that were another width on every card, and two missing options of the card (a
                    good or quiet bar, an empty plate with no action or your own). ${pairs} pairs in all, in formal. Each section says under
                    <b>What changed since you approved it</b> what was wrong and what is different now.
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
console.log(`${ID}: ${sections.length} sections, ${pairs} pairs, round ${roundId}`);
