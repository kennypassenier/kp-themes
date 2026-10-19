// Builds research/trace-diff-1019/demo.html: two faults of approved components found by HTTPSwitchboard (kp-gaps 26, 27), each coming
// back through the review dialog with a plain "What changed" text. Formal only.
//
//   1. trace-column   the state words of a trace in a column ended on different edges   (css/components.css)
//   2. diff-line      a long token ran past the other diff lines                         (css/components.css)
//
// Run: node research/trace-diff-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'trace-diff-1019';

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

const frame = (/** @type {string} */ label, /** @type {string} */ inner) =>
    `<div class="td-frame"><p class="td-frame__label">${label}</p>\n${inner}\n</div>`;

const sections = [
    section({
        id: 'trace-column',
        title: 'Path trace: the hops in a column',
        intro: 'One message followed from its sender to its destination, at a phone&rsquo;s width, where the hops stand under each other.',
        components: 'trace steplist',
        changed:
            'In a trace whose hops stand in a column (a phone, or a narrow box) the verdict word of each hop (<b>Allowed</b>, <b>Refused</b>, <b>Not Reached</b>) took only as much room as its own word, so the words started and ended on a different edge from hop to hop and the lines of words beside them ended on different edges too. Now the trace has one column for the verdict word, as wide as the longest word of any hop, and every hop uses it: the words start on one edge, the hops&rsquo; own words end on one edge. The marks, the words, the chips, the dimmed hop after a refusal, and the row of hops side by side on a wide box are as you approved them.',
        expect: [
            'Under each other, the verdict words <b>Allowed</b>, <b>Refused</b> and <b>Not Reached</b> all start on one edge and the hops&rsquo; own words all end on one edge.',
            'In the second frame (words only) the same: one column for the verdict word.',
        ],
        look: 'the verdict words of every hop start on one vertical line, and so do the ends of the hops&rsquo; own words.',
        body:
            frame('The trace, mark and word', '<div class="kp-trace" data-kp-trace data-kp-trace-layout="column" data-td-trace></div>') +
            frame('The trace, the word only', '<div class="kp-trace" data-kp-trace data-kp-trace-layout="column" data-kp-trace-verdict="word" data-td-trace></div>'),
    }),
    section({
        id: 'diff-line',
        title: 'Diff: a line with a long token',
        intro: 'Before and after of a message, one line holding an address that has no place to break.',
        components: 'diff',
        changed:
            'A line of a diff holding one long word (an address or a file name with no space in it) made its text column as wide as that word, so the line ran past the other lines and past the plate&rsquo;s edge at a phone&rsquo;s width. Now the text column may be narrower than its longest word, and the word breaks inside the column, so every line ends on the plate&rsquo;s inner edge. The line numbers, the signs, the colours and the diff view with its words marked are as you approved them.',
        expect: [
            'The long address breaks onto a second line inside the text column; every line ends on the plate&rsquo;s inner edge.',
            'The line numbers stand in one column and the signs in the next, on every line, including the broken one.',
        ],
        look: 'the right edge of every line is the plate&rsquo;s inner edge, none runs past.',
        body: frame('A diff in a phone-width plate', '<pre class="kp-diff td-diff" tabindex="0" aria-label="Changes: 2 lines removed, 3 lines added" data-td-diff></pre>'),
    }),
];

const body = sections.join('\n');
const pairs = sections.length;

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^tracediff-[0-9a-f]{8}-/.test(current) ? current : `tracediff-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Two faults of the lists: the trace's verdict column and the diff's long line</title>
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
                <h1>Two faults of the lists</h1>
                <p class="cat-intro">
                    HTTPSwitchboard found two places where an approved component did not line up at a phone&rsquo;s width: the verdict words of a
                    trace, and a long word in a diff line. ${pairs} pairs in all, both in formal. Each section says under <b>What changed since
                    you approved it</b> what was wrong and what is different now.
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
