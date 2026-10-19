// Builds research/heat-deplist-1019/demo.html: three faults found by the homelab thread, fixed in the package. They change components
// Kenny had approved (the heat grid, the dependency list), so each comes back through the review dialog with a plain "What changed" text.
// Formal only. The page is bundled into round-4-1019 (VERDICTS.json), so it has no catalogue entry of its own.
//
//   1. heat-label   a row name broke inside a word ("PAPERLE / SS") at 390 px          (css/components.css)
//   2. heat-axis    `every` was ignored beside `minor`; a minor name was drawn invisible (js/heat.js, css/components.css)
//   3. deplist-state the Running / Stopped / Unknown badges ended on different edges     (css/components.css)
//
// Run: node research/heat-deplist-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'heat-deplist-1019';
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

const frame = (/** @type {string} */ label, /** @type {string} */ inner, /** @type {number} */ width = 270) =>
    `<div class="rf-frame"><p class="rf-frame__label">${label}</p><div class="rf-col" style="--rf-w: ${width}px">\n${inner}\n</div></div>`;

const sections = [
    section({
        id: 'heat-label',
        title: 'Heat grid: row names stay whole words',
        intro: 'Backups per stack per night, rows named after the stack; the grid is shown at the width of a phone and at a wide width.',
        changed:
            'On a phone a row name was broken inside the word (&ldquo;PAPERLE&rdquo; over &ldquo;SS&rdquo;, &ldquo;VAULTW&rdquo; over &ldquo;ARDEN&rdquo;), because the name column was a fixed share of the grid, narrower than the longest name. Now the name column is as wide as the longest <em>word</em> of any name (never more than it was, unless a word needs it) and the cells give way; a name of several words wraps at its spaces. The cells, the legend, the axis and pressing a name to pick a row are as you approved them.',
        expect: [
            'In the narrow frame every row name is whole: <b>Paperless</b>, <b>Vaultwarden</b> and <b>Almanac</b> each on one line, <b>Photos and family videos</b> on three lines at its spaces.',
            'Every row&rsquo;s cells start on one edge, the same distance from the names, in both frames.',
        ],
        look: 'no row name is cut in the middle of a word, and the cells of every row start on one vertical line.',
        components: 'heat',
        body:
            frame('Phone width (about 340 px)', '<div class="kp-heat rf-heat" data-rf-heat="names"></div>', 340) +
            frame('Wide', '<div class="kp-heat rf-heat" data-rf-heat="names"></div>', 640),
    }),
    section({
        id: 'heat-axis',
        title: 'Heat grid: the column names',
        intro: 'Fourteen nights with the weekend nights marked as minor columns, first with the default spacing of names and then with a name on every second night.',
        changed:
            'Two faults. First, <code>every</code> (how many columns share one name) was ignored as soon as a column was marked <code>minor</code>: the mark decided alone, so a page could not both mark the weekend and thin out the names. Now the columns that are not marked are counted every <code>every</code>th, the last of them always named; a marked <code>minor</code> column is never named and does not count. Second, a name that was not shown was still in the grid, only drawn in no colour, so a measure of the page still found it standing under its neighbour. Now it is not written at all: the column keeps its header for a screen reader (the name is its label) and there is no text to find. The grid, the cells and the picked column are as you approved them.',
        expect: [
            'The first axis names the first night, every third night after it and the last; the two weekend columns carry no name.',
            'The second axis (every second night) names every second night; the weekend columns are still blank, and nothing is written in a blank column.',
        ],
        look: 'the names stand over their own columns with air between them; a blank column is empty, not faint.',
        components: 'heat',
        body:
            frame('Every third (default)', '<div class="kp-heat rf-heat" data-rf-heat="axis-3"></div>', 560) +
            frame('Every second', '<div class="kp-heat rf-heat" data-rf-heat="axis-2"></div>', 560),
    }),
    section({
        id: 'deplist-state',
        title: 'Dependency list: one status column',
        intro: 'Which stacks reach which apps, with the state of each app that is needed, at a wide width and at the width of a phone.',
        changed:
            'The state badges (Running, Stopped, Unknown) each took their own word&rsquo;s width and started on the column&rsquo;s start edge, so they ended on three different edges. Now the status is one column: every badge fills the width of the widest word, its word centred, so all of them start and end on the same two lines. On a phone, where each state stands under its row, they share one width as well. The numbers, the names, the arrows and the copy button are as you approved them.',
        expect: [
            'In the wide list the badges form one column, all the same width and aligned on both edges.',
            'In the narrow list the badges are the same width too, under the names, aligned on their start edge.',
        ],
        look: 'every state badge starts and ends on the same two vertical lines.',
        components: 'deplist',
        body:
            frame('Wide', '<div class="kp-deplist" data-kp-deplist data-kp-dep-states data-rf-deplist></div>', 640) +
            frame('Phone width (about 300 px)', '<div class="kp-deplist" data-kp-deplist data-kp-dep-states data-rf-deplist></div>', 300),
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
const roundId = current && /^heatdeplist-[0-9a-f]{8}-/.test(current) ? current : `heatdeplist-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Heat grid names and axis, dependency list status column</title>
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
                <h1>Heat grid names and axis, dependency list status</h1>
                <p class="cat-intro">
                    The homelab project found three places where an approved component was loose: heat grid names broken inside a word, a heat
                    axis that ignored its spacing beside a marked column, and status badges ending on different edges. ${pairs} pairs, all in
                    formal. Each section says under <b>What changed since you approved it</b> what was wrong and what is different now.
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
