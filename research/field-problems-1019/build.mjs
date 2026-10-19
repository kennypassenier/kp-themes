// Builds research/field-problems-1019/demo.html: two faults found by the project threads (HTTPSwitchboard 32, chassis-rs 9, homelab 48)
// that break Kenny's grid rule (2026-10-19: everything on a grid, never a loose start or end edge). They change approved components, so
// they come back through the review dialog with a plain "What changed" text. Formal only.
//
//   1. field-fills      a form field stopped short of its card or grid column      (css/components.css)
//   2. problems-edges   fixes of different words began on different edges         (css/components.css)
//
// Run: node research/field-problems-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'field-problems-1019';
const PAGE_THEMES = ['formal'];

/** One look-at line per theme asked. @param {string[]} themes @param {string} text */
const looks = (themes, text) => themes.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, body: string, components: string, themes?: string[] }} s
 */
const section = (s) => {
    const themes = s.themes ?? ['formal'];
    return `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="${themes.join(',')}"
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

const field = (/** @type {string} */ id, /** @type {string} */ label, /** @type {string} */ help, value = '') =>
    `<div class="kp-field"><label class="kp-field__label" for="${id}">${label}</label><input class="kp-field__input" id="${id}" type="text" value="${value}" /><p class="kp-field__help">${help}</p></div>`;

const sections = [
    section({
        id: 'field-fills',
        title: 'Form field: it fills its card and its column',
        intro: 'Fields that stand in a card, in a stack of blocks and in the two columns of a grid. Each card is a plate; the label and the help always ran to its edge.',
        changed:
            'A form field stopped at 28 rem (448 px) however wide its place was, so inside a card or a grid column the box ended 42 to 47 px before the edge that its label, its help and the blocks around it ran to: a loose end edge. Now a field that stands in a card, a stack, a dialog or a grid column fills the place it is in; <code>--kp-field-max-width</code> caps it again where a page wants a measure.',
        expect: [
            'In the wide card the box ends on the same vertical line as the paragraph above it and the help text below; in the two cards side by side each box ends at its card&rsquo;s inner edge.',
            'The stacked fields in the first card end on one line; narrow the window and they keep ending at the card&rsquo;s inner edge.',
        ],
        look: 'every box ends exactly where the blocks around it end, in every card and column; nothing is left hanging short.',
        components: 'field',
        body: `<div class="fp-stack">
    <section class="kp-card fp-card"><div class="kp-card__header"><h3 class="kp-card__title">Server</h3></div>
        <p class="kp-card__body">Where HTTPSwitchboard listens for requests.</p>
        ${field('fp-host', 'Host name', 'The name clients use to reach this profile.', 'switchboard.kp-soft.dev')}
        ${field('fp-path', 'Base path', 'Everything below this path goes to the profile.', '/v1')}
    </section>
    <div class="fp-two">
        <section class="kp-card fp-card"><div class="kp-card__header"><h3 class="kp-card__title">Sample</h3></div>
            ${field('fp-sample', 'Sample request', 'Sent when you press Test.', 'GET /health')}</section>
        <section class="kp-card fp-card"><div class="kp-card__header"><h3 class="kp-card__title">Reply</h3></div>
            ${field('fp-reply', 'Expected reply', 'The profile passes when the reply matches.', '200 OK')}</section>
    </div>
</div>`,
    }),
    section({
        id: 'problems-edges',
        title: 'Problems: every fix on one edge',
        intro: 'Four problems at once, each with a fix of different words. Shown in a card, at the page&rsquo;s width and inside a form grid.',
        changed:
            'The fixes of the problems in a list began on different edges when the list stood in a form grid or a page grid (<code>data-kp-subgrid</code>): that mode switched off the list&rsquo;s own width check, so the shared columns never applied and each fix took the width of its own words (up to 56 px apart). Now the list shares its columns in every setting: the text ends on one line and every fix starts on one line.',
        expect: [
            'In every list the fixes (<b>Run the backup now</b>, <b>Open Secrets</b>, <b>Restart Alloy</b>, <b>Share</b>) start on one vertical line and the text of each problem ends on one vertical line.',
            'At phone width the fix sits under its text, as before.',
        ],
        look: 'one start edge for all four fixes in each list, and one end edge for the text.',
        components: 'problems',
        body: `<div class="fp-stack">
    <div class="kp-problems" data-kp-problems data-fp-problems></div>
    <div class="kp-formgrid fp-grid">
        <div class="kp-problems" data-kp-subgrid data-kp-problems data-fp-problems></div>
    </div>
</div>`,
    }),
];

const body = sections.join('\n');
const pairs = sections.length;

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, bundledInto: 'round-4-1019', rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^fieldproblems-[0-9a-f]{8}-/.test(current) ? current : `fieldproblems-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Two grid faults: form field width and problem fixes</title>
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
                <h1>Two grid faults</h1>
                <p class="cat-intro">
                    The project threads found two places where an approved component left a loose edge: a form field that stopped short of its card, and
                    the fixes of a problem list that began on different lines. ${pairs} pairs, shown in formal. Each section says under <b>What changed
                    since you approved it</b> what was wrong and what is different now.
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
