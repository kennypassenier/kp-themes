// Builds research/tip-1102/demo.html: the reason of a disabled button drawn whole inside a data table [tip-1102, kitchen-1101].
// One review page, formal only, one section (DEMO_RULES ch. 1 and 6): Kitchen's ingredient table with Garlic's Delete off, at
// full width and in a 390 px box where the table is cards. The section is written once in sections.mjs; demo.js wires its
// controls. The tooltip only uses the theme's existing look, so formal alone is asked (DEMO_RULES ch. 6). Names are mock.
// Run: node research/tip-1102/build.mjs (the page keeps its round id until the verdict is recorded; a round already answered gets a new one).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SECTIONS } from './sections.mjs';

const here = new URL('./', import.meta.url);
const ID = 'tip-1102';
const THEMES = ['formal'];
const MAX_ITEMS = 100;

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s) => `        <section id="${s.id}" data-review-item="${s.id}" data-review-topic="${s.topic}" data-review-topic-title="${s.topicTitle}" data-review-components="${s.id}" data-review-motion="none" data-review-title="${s.title}"${s.choices ? ` data-review-choices='${JSON.stringify(s.choices).replaceAll("'", '&#39;')}'` : ''} aria-labelledby="h-${s.id}">
            <header class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></header>
            <div class="pg-changed"><p><b>What is asked</b> (${s.item}): ${s.asked}</p></div>
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

const title = 'The reason of a disabled button, whole inside a table';
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
                    Kitchen found the reason of a disabled Delete cut at the edge of its table&rsquo;s card on a phone. The reason&rsquo;s tooltip now
                    stands above the page, so nothing round the button can cut it. One section, formal only.
                </p>
                <p>The section says under <b>Expected</b> what you should see. Reason shows Garlic&rsquo;s reason or puts the table at rest; Width shows the table at a phone&rsquo;s 390 px, where its rows are cards.</p>
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
