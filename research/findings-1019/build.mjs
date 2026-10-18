// Builds research/findings-1019/demo.html: four faults found in the package while the components page was being checked (Kenny,
// 2026-10-19). They change components he had approved, so each comes back through the review dialog (DEMO_RULES ch. 7 and 9), in
// all twelve themes, with a plain "What changed" text saying what was wrong and what is different now.
//
//   1. command-narrow    Copy in a command block broke per letter at phone width (js/command.js, css/components.css)
//   2. focus-nav-narrow  Back and Next of the check-in broke per letter at phone width (js/focus-steps.js, css/components.css)
//   3. flash-grow        data-kp-width="grow" set by hand left an empty button (js/flash.js, css/components.css)
//   4. lede-fold-link    a lede with data-kp-lede-collapsible and data-kp-lede-link never folded (js/lede.js)
//
// Run: node research/findings-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'findings-1019';
const THEMES = ['formal', 'dark', 'cyberpunk', 'synthwave', 'pastel', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'nostromo', 'titanium'];

/** One look-at line per theme: the same thing to check, in the theme's own name. @param {string} text */
const looks = (text) => THEMES.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

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
${looks(s.look)}
    </div>
${s.body}
</section>`;

const phone = (/** @type {string} */ label, /** @type {string} */ inner) =>
    `<div class="f19-phone"><p class="f19-phone__label">${label}</p><div class="f19-col">\n${inner}\n</div></div>`;

const sections = [
    section({
        id: 'command-narrow',
        title: 'Command block on a phone: the Copy button',
        intro: 'A command with the terminal it runs in, its admin badge and a Copy button, in the narrow column a 390 px phone leaves a component (about 270 px).',
        changed:
            'The Copy button of a command block broke its word letter by letter (&ldquo;C o p y&rdquo;, one letter under the other) when the head was too narrow for the terminal&rsquo;s name, the admin badge and the button on one line; the button was squeezed because every package button is allowed to break a word anywhere. It showed in dark, cyberpunk and synthwave at 270 px (what a 390 px phone leaves a component) with the admin badge, and in brutalism, deco and nostromo a few pixels narrower. Now the button keeps its word whole and its own width, and when the three do not fit on one line the button goes under the name and the badge, at the right. The head, the badge, the prompt and the code are as you approved them.',
        expect: [
            'In the dashed phone frame the head shows <b>PowerShell</b>, the amber <b>admin</b> badge and <b>Copy</b>: on one line where they fit, <b>Copy</b> on a line under them, at the right, where they do not.',
            '<b>Copy</b> is always one word on one line, never a letter per line; press it and it says <b>Copied</b> at the same width.',
            'The two commands under the first (WSL with the badge, bash without) look as before.',
        ],
        look: 'the word Copy reads as a word, with air round it inside the button, in the head of the PowerShell block with the admin badge.',
        components: 'command',
        body: phone(
            'About 270 px of content, as on a 390 px phone',
            `<div class="kp-command" data-kp-command="powershell" data-kp-command-elevated data-kp-command-where="the workstation"><pre class="kp-command__code"><code>Get-Service kyu | Restart-Service</code></pre></div>
<div class="kp-command" data-kp-command="wsl" data-kp-command-elevated data-kp-command-where="CT 109 (kyu)"><pre class="kp-command__code"><code>sudo systemctl restart kyu</code></pre></div>
<div class="kp-command" data-kp-command="bash"><pre class="kp-command__code"><code>docker compose up -d</code></pre></div>`,
        ),
    }),
    section({
        id: 'focus-nav-narrow',
        title: 'Check-in on a phone: the Back and Next buttons',
        intro: 'The one-question-per-screen check-in with its Back and Next buttons at the foot, in the narrow column a 390 px phone leaves a component (about 270 px).',
        changed:
            'The Back and Next buttons at the foot of the check-in broke their words letter by letter when the column was between 240 and 270 px wide, as on a 390 px phone (titanium and nostromo at 270, formal, dark, pastel, forest, blueprint and solstice at about 260, cyberpunk at 242; synthwave, brutalism and deco have narrower buttons and held); the two equal columns squeezed the buttons below their own words. Now each button keeps its word on one line and its width, and when two buttons do not fit side by side the second goes under the first at the full width. At 270 px they sit side by side as you approved them; in a column too narrow for both words they stand one under the other at the full width. Nothing else about the check-in changed.',
        expect: [
            'In the phone frame <b>Back</b> and <b>Next</b> stand side by side at the foot, each word on one line with the arrow beside it.',
            'Press an answer and the next question comes; <b>Back</b> and <b>Next</b> never change width or place.',
            'In a column narrower than this (a small phone) the buttons stack, <b>Back</b> above <b>Next</b>, instead of breaking.',
        ],
        look: 'Back and Next each read as one word on one line, with the arrow clear of the word.',
        components: 'focus-steps',
        body: phone(
            'About 270 px of content, as on a 390 px phone',
            `<div class="kp-focus-steps" data-kp-focus-steps data-f19-checkin data-kp-focus-mode="answer" aria-label="Daily check-in"></div>`,
        ),
    }),
    section({
        id: 'flash-grow',
        title: 'Flash button: the width that grows',
        intro: 'A button that shows busy and then its result. Beside the normal one, the one a page sets to grow by hand, and the one that grows by itself for a refusal.',
        changed:
            'A page could set <code>data-kp-width=&quot;grow&quot;</code> on the button by hand, as its documentation says, and got an empty button: the words and the spinner were removed for good and only a refusal sentence would ever have filled it. The grow was only meant for the moment a refusal is written on the button itself. Now <code>grow</code> works by hand: at rest and while busy the button shows its own words, and when the result comes it grows to the width of what it says, then goes back. The width a page set by hand is no longer taken away after a refusal. The default button (<code>keep</code>) and the refusal on the button are exactly as you approved them.',
        expect: [
            'Three buttons, all showing <b>Send test</b> at rest. The middle one (grow, set by hand) used to be an empty strip.',
            'Press one: the spinner, then <b>Sent</b> in green; press again: <b>Refused</b> in red (the third button writes the whole sentence on itself, wider).',
            '<b>Keep</b> holds one width for every word; <b>grow</b> takes the width of the word it shows; neither jumps the row below it.',
        ],
        look: 'the grow button shows its words at rest, shows the result when pressed, and returns to its words afterwards.',
        components: 'flash',
        body: `<div class="f19-row">
    <span class="f19-row__name">Keep (the default)</span>
    <div><button class="kp-button" type="button" data-kp-flash-button data-f19-flash data-kp-flash-words="Sent,Refused">Send test</button></div>
    <span class="f19-row__name">Grow, set by hand</span>
    <div><button class="kp-button" type="button" data-kp-flash-button data-f19-flash data-kp-width="grow">Send test</button></div>
    <span class="f19-row__name">Refusal written on the button</span>
    <div><button class="kp-button" type="button" data-kp-flash-button data-f19-flash data-kp-refusal="button">Send test</button></div>
</div>`,
    }),
    section({
        id: 'lede-fold-link',
        title: 'Lede: a long text with a Learn more link',
        intro: 'The short paragraph under a heading. A long one folds behind More; a link adds Learn more at the end. Here both are asked of the same lede.',
        changed:
            'A lede that was asked to fold (<code>data-kp-lede-collapsible</code>) and to carry a Learn more link (<code>data-kp-lede-link</code>) never folded: the link was added first, so the module saw a paragraph with an element inside it and read its text as empty. Now the text is read before the link is added: the lede shows its first sentences with <b>More</b>, and the <b>Learn more</b> link stands at the very end, after the part that unfolds. A lede with only one of the two works as before.',
        expect: [
            'The first lede (fold and link) shows two sentences, a <b>More</b> button under it and <b>Learn more</b> at the end; <b>More</b> opens the rest above the link and turns into <b>Less</b>.',
            'The second (fold only) and the third (link only) are as you approved them.',
        ],
        look: 'the first lede is folded with More, and Learn more stands after its last words once opened.',
        components: 'lede',
        body: `<div class="f19-ledes">
    <div><h3 class="kp-fw-semibold" id="f19-lede-both">Backups, with a fold and a link</h3><p class="kp-lede" data-kp-lede-collapsible="100" data-kp-lede-link="https://example.com/help/backups">Backups are made every night at 03:00 and kept for thirty days. A backup that fails is tried again an hour later, and a second failure sends a message to the person on duty. Restoring is always done from the newest backup that passed its check, never from one that was only copied.</p></div>
    <div><h3 class="kp-fw-semibold" id="f19-lede-fold">Backups, with a fold only</h3><p class="kp-lede" data-kp-lede-collapsible="100">Backups are made every night at 03:00 and kept for thirty days. A backup that fails is tried again an hour later, and a second failure sends a message to the person on duty. Restoring is always done from the newest backup that passed its check, never from one that was only copied.</p></div>
    <div><h3 class="kp-fw-semibold" id="f19-lede-link">Restoring, with a link only</h3><p class="kp-lede" data-kp-lede-link="https://example.com/help/restore">Restoring puts a backup back on the disk it came from.</p></div>
</div>`,
    }),
];

const body = sections.join('\n');

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^findings-[0-9a-f]{8}-/.test(current) ? current : `findings-${randomUUID()}`;
const pairs = THEMES.length * sections.length;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Four faults found in the package: Copy, Back and Next, the flash button and the lede</title>
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
                <h1>Four faults found in the package</h1>
                <p class="cat-intro">
                    Checking the components page turned up four faults in components you had approved, so they come back to you here. The Copy button of a
                    command block and the Back and Next buttons of the check-in broke their words letter by letter on a phone; the flash button set to
                    grow by hand was an empty button; a lede asked to fold and to carry a link never folded. ${pairs} pairs in all: each fault in the
                    twelve themes. Each section says under <b>What changed since you approved it</b> what was wrong and what is different now; the
                    first two are shown in a frame the width of a phone.
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
