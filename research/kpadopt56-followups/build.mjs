// Builds research/kpadopt56-followups/demo.html: two findings on work Kenny had approved (Kenny, 2026-10-18; a change to
// approved work goes back to him through the review dialog, DEMO_RULES ch. 7 and 9).
//
// 1. selection-bar-place, "Floating at the foot", in every theme the bar was approved in (dark first: Kenny approved it with
//    "ik zie de balk nergens?"). The review dialog lays a section out in a frame as tall as the section, the bar is
//    `position: fixed` and so stood at the foot of that frame, below the part the reviewer sees; research/_review/review.css
//    now puts it at the foot of the part in view.
// 2. usual-states, formal: the two samples shown opened opened and closed again and again while half in view; they open once.
//
// Same sections and scripts as the other kpadopt56 pages: each section is read from research/kpadopt56/src/<demo>/sections.html
// and run by the source demo's own script. Edit those sources or this builder, never the page.
//
// Run: node research/kpadopt56-followups/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import { declareControls } from '../kpadopt56/controls-for.mjs';

const here = new URL('./', import.meta.url);
const ID = 'kpadopt56-followups';
const read = (/** @type {string} */ path, base = here) => readFileSync(fileURLToPath(new URL(path, base)), 'utf8');

/** The themes the selection bar was approved in: dark first (Kenny's note), formal, then the registry's order of the rest. */
const BAR_THEMES = ['dark', 'formal', 'cyberpunk', 'synthwave', 'pastel', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'nostromo', 'titanium'];
const PAGE_THEMES = BAR_THEMES;

/** A section of a source demo. */
function source(/** @type {string} */ demo, /** @type {string} */ id) {
    const html = read(`../kpadopt56/src/${demo}/sections.html`);
    for (const m of html.matchAll(/<!-- ===== item: (\S+) \(from [^)]*\) -->\n([\s\S]*?)\n\n(?=<!-- ===== item: |$)/g)) if (m[1] === id) return m[2];
    throw new Error(`${demo}/${id} has no source`);
}

/** The per-theme look-at lines the eleven-theme page already carries for the bar's section (the themes' own words). */
const confirmPage = read('../kpadopt56-confirm/demo.html');
const barSection = confirmPage.slice(confirmPage.indexOf('data-review-item="selection-bar-place"'));
const themeLooks = new Map(
    [...barSection.slice(0, barSection.indexOf('</section>')).matchAll(/<p data-for="([a-z]+)">\s*([\s\S]*?)\s*<\/p>/g)].map((m) => [m[1], m[2].replace(/\s+/g, ' ')]),
);
const formalLook = source('kpadopt5-rows', 'selection-bar-place').match(/<p data-for="formal">\s*([\s\S]*?)\s*<\/p>/)?.[1].replace(/\s+/g, ' ');
if (!formalLook) throw new Error('selection-bar-place has no formal look-at line');
themeLooks.set('formal', formalLook);

/** @param {string} text @param {string} changed @param {string} expect */
function addChanged(text, changed, expect) {
    let out = text.replace(/<section\b[^>]*>/, (open) => `${open}\n<div class="k56-changed"><p><b>What changed since you approved it:</b> ${changed}</p></div>`);
    const expected = /<div class="[a-z0-9]+-expect(?:ed)?">/.exec(out);
    if (!expected) throw new Error('no Expected block');
    const close = out.indexOf('</ul>', expected.index);
    if (close < 0) throw new Error('Expected block has no list');
    out = `${out.slice(0, close)}<li><b>Changed:</b> ${expect}</li>\n${out.slice(close)}`;
    return out;
}

/** Section 1: the selection bar, floating at the foot, in twelve themes. */
function barSectionMarkup() {
    let text = source('kpadopt5-rows', 'selection-bar-place');
    // The section is judged for the floating variant: it opens on it, with two rows ticked (the page's demo.js).
    text = text
        .replace('data-kp-placement="sticky-top"', 'data-kp-placement="floating-bottom"')
        .replace('data-k5-placement="sticky-top" aria-pressed="true"', 'data-k5-placement="sticky-top" aria-pressed="false"')
        .replace('data-k5-placement="floating-bottom" aria-pressed="false"', 'data-k5-placement="floating-bottom" aria-pressed="true"');
    if (!/data-kp-placement="floating-bottom"/.test(text) || (text.match(/aria-pressed="true"/g) ?? []).length < 1) throw new Error('the bar did not switch to floating');
    text = text
        .replace(/\s+data-review-topic="[^"]*"/, '')
        .replace(/\s+data-review-topic-title="[^"]*"/, '')
        .replace(/(data-review-item="[^"]*")/, `$1 data-review-topic="selection-bar" data-review-topic-title="Selection bar at the foot"`);
    const lead =
        'With two rows ticked, the floating bar stands at the foot of what you see in this frame. ';
    const looks = BAR_THEMES.map((theme) => {
        const own = themeLooks.get(theme);
        if (!own) throw new Error(`no look-at line for ${theme}`);
        return `<p data-for="${theme}">${lead}${own}</p>`;
    }).join('\n');
    const block = text.match(/<div data-review-look>[\s\S]*?<\/div>/g) ?? [];
    if (block.length !== 1) throw new Error(`selection-bar-place: ${block.length} look-at blocks`);
    text = text.replace(block[0], `<div data-review-look>\n${looks}\n</div>`);
    return addChanged(
        text,
        'You approved this section with the note &ldquo;ik zie de balk nergens?&rdquo;: you never saw the <b>Floating at the foot</b> variant of the bar. The cause was in the review dialog, not in the bar. The dialog shows a section in a frame as tall as the whole section, and the floating bar sticks to the foot of its frame, so it stood below the part of the section you can see (at 1920 by 965 it stood more than 500 px below the dialog&rsquo;s foot on the first screen) and only came into view when you scrolled right to the end. The same held in every theme, so it is asked again in all twelve. Now the floating bar stands at the foot of the part of the frame that is in view, the way it would stand at the foot of a window in an app. The bar itself, its wording and its settings are as you approved them. This section now opens on the floating variant with two rows ticked.',
        'with <b>Floating at the foot</b> pressed (it is pressed when the section opens) and two rows ticked, the bar stands at the foot of the part of the section you see, in the dialog at 1920 by 965 and at 1280 by 800, without scrolling to the end of the frame; <b>Stuck to the top</b> and <b>In the flow</b> are unchanged.',
    );
}

/** Section 2: the picker with the usual on top, states and opened samples, formal. */
function usualSectionMarkup() {
    let text = source('kpadopt6-calm', 'usual-states');
    text = text
        .replace(/\s+data-review-topic="[^"]*"/, '')
        .replace(/\s+data-review-topic-title="[^"]*"/, '')
        .replace(/(data-review-item="[^"]*")/, `$1 data-review-themes="formal" data-review-topic="usual-picker" data-review-topic-title="Picker with the usual on top, opened samples"`);
    const block = text.match(/<div data-review-look>[\s\S]*?<\/div>/g) ?? [];
    if (block.length !== 1) throw new Error(`usual-states: ${block.length} look-at blocks`);
    text = text.replace(
        block[0],
        `<div data-review-look>\n<p data-for="formal">Both lists shown opened (the one with the long label, and the plain combobox beside it) open once and then stay still; the page does not twitch while they are half in view. The plates and every state button are as you approved them.</p>\n</div>`,
    );
    return addChanged(
        text,
        'You approved the picker with the usual on top. Its two samples that are shown opened on the page (the one with the long label, and the plain combobox beside it) were opened and closed by the demo according to how much of their case was on screen: below 90% they closed, above 90% they opened again. Opening makes the case taller, so a case that was half in view closed, shrank, was in view again, and opened again, several times a second. Now each sample opens once, the first time it is on screen, and stays open. The lists, their plates and the states are as you approved them.',
        'scroll the two opened samples in and out of view, at the dialog&rsquo;s own size and with only part of them in view: each list opens once and stays open; nothing opens and closes by itself (measured over two seconds).',
    );
}

const bodyParts = [declareControls(barSectionMarkup(), 'selection-bar-place'), declareControls(usualSectionMarkup(), 'usual-states')];
const body = bodyParts.join('\n\n');

/** @type {string[]} */
const problems = [];
const seen = new Map();
for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
// A page keeps its own round id once decided, and lists it as received (the archived shape).
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^followups-[0-9a-f]{8}-/.test(current) ? current : `followups-${randomUUID()}`;
const pairs = BAR_THEMES.length + 1;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Two things found in work you approved: the floating selection bar and the opened pickers</title>
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
        <link rel="stylesheet" href="../kpadopt56/src/kpadopt5-rows/page.css" />
        <link rel="stylesheet" href="../kpadopt56/src/kpadopt6-calm/page.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>Two things found in work you approved</h1>
                <p class="cat-intro">
                    Two faults turned up in work you had approved, so they come back to you here. The floating selection bar could not be seen in the
                    review dialog (your note: &ldquo;ik zie de balk nergens?&rdquo;): ${BAR_THEMES.length} pairs, dark first. And the two picker samples shown opened
                    flickered open and shut while half in view: 1 pair, in formal. ${pairs} pairs in all. Each section says under <b>What changed since you
                    approved it</b> what you saw before and what is different now.
                </p>
            </header>
${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
        <script type="module" src="../kpadopt56/src/kpadopt5-rows/demo.js"></script>
        <script type="module" src="../kpadopt56/src/kpadopt6-calm/demo.js"></script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
try {
    writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
} catch (error) {
    writeFileSync(`${out}.unformatted`, page);
    throw new Error(`prettier cannot read the page (kept as ${out}.unformatted): ${/** @type {Error} */ (error).message.split('\n')[0]}`);
}
if (problems.length) {
    console.error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}
console.log(`${ID}: 2 sections, ${pairs} pairs, round ${roundId}`);
