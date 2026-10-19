// Builds research/rule-fixes-1019/demo.html: nine faults that break Kenny's standing UI rules (text never touches an edge, never cut
// with an ellipsis, never breaks per letter, no stray marks, no overlap), found by the project threads (chassis-rs, HTTPSwitchboard,
// kyu, AuDHD recepten) and fixed in the package. They change components Kenny had approved, so each comes back through the review
// dialog (DEMO_RULES ch. 7 and 9) with a plain "What changed" text. Formal only unless the fault differs per theme (the wheel).
//
//   1. tabbar-badge   the count sat over its icon                       (css/components.css)
//   2. palette-keys   a key chord wrapped onto two lines                (css/components.css)
//   3. dialog-edge    section text touched its edge                      (css/components.css)
//   4. code-long      a long line ran to the plate's edge                (css/components.css, js/code.js)
//   5. code-punct     `},` `],` were two elements at 0 px                (js/code.js)
//   6. empty-card     formal's empty card drew two stray hairlines       (css/formal-register.css)
//   7. newpill-gap    an empty gap before the count                      (css/components.css)
//   8. heat-label     a row label ended in an ellipsis                   (css/components.css)
//   9. wheel-label    thin slices cut their label with an ellipsis       (js/wheel.js)
//
// Run: node research/rule-fixes-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'rule-fixes-1019';
const PAGE_THEMES = ['formal', 'dark', 'cyberpunk'];

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

const icon = (/** @type {string} */ d) =>
    `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const ICONS = {
    home: 'M3 11l9-8 9 8M5 10v10h14V10',
    inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5',
    chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
    bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4',
};
const tab = (/** @type {keyof typeof ICONS} */ id, /** @type {string} */ label, /** @type {string} */ badge = '', current = false) =>
    `<a class="kp-tabbar__tab" href="#${id}" data-kp-tab="${id}"${current ? ' aria-current="page"' : ''}><span class="kp-tabbar__icon">${icon(ICONS[id])}</span><span class="kp-tabbar__label">${label}</span>${badge === 'dot' ? '<span class="kp-badge kp-tabbar__badge"></span>' : badge ? `<span class="kp-badge kp-tabbar__badge">${badge}</span>` : ''}</a>`;

const sections = [
    section({
        id: 'wheel-label',
        title: 'Wheel: names on thin slices',
        intro: 'The wheel that picks tonight&rsquo;s dinner, with a long name on a thin slice, a name that has a short form, and a few tiny slices.',
        topic: 'wheel',
        themes: ['formal', 'dark', 'cyberpunk'],
        changed:
            'A name too long for its slice was cut with an ellipsis (&ldquo;Chicken curry wit&hellip;&rdquo;), and a slice too thin for any word was left blank. Now a name is never cut: it takes the largest type its slice allows, goes onto two lines when that reads larger, and if it still does not fit it uses the dish&rsquo;s <code>short</code> name when the page gave one (<b>Pasta</b> for <b>Pasta with roasted vegetables and feta</b>). A name that fits in no form is not drawn on the disc; it is the slice&rsquo;s tooltip and it is always whole in the result under the wheel. The slices, the weights, the spin and the colours are as you approved them. Shown in formal, dark and cyberpunk because the last two set their names in a wider mono face.',
        expect: [
            'No name on the wheel ends in <b>&hellip;</b>; every drawn name is whole, in a size as large as its slice allows.',
            '<b>Pasta</b> (short form) and the long names on two lines read cleanly; press <b>Spin</b> and the result says the whole name.',
        ],
        look: 'every name on the disc is whole, none ends in an ellipsis, and no two names touch.',
        components: 'wheel',
        body: `<div class="rf-wheel"><div class="kp-wheel" data-rf-wheel aria-label="Tonight's dinner"></div></div>`,
    }),
    section({
        id: 'tabbar-badge',
        title: 'Tab bar: the count beside its icon',
        intro: 'The bottom bar of a phone with a count on the tab that needs you: a number, a long number and a dot.',
        changed:
            'The count on a tab (a Badge) was laid over the end corner of the tab&rsquo;s icon, half on the drawing, so its number sat on the icon&rsquo;s strokes. That breaks the rule that text never touches an icon. Now the count stands beside the icon, at its top and end corner, with a small gap, and still takes no room in the row, so a count that appears, grows (12, 1534) or goes moves nothing. The dot (a badge with no number) moves the same way. The bar, its tabs and the current-page mark are as you approved them.',
        expect: [
            'The first bar carries <b>3</b> and <b>12</b>, the second <b>1534</b> and a dot, each right of its icon, clear of the drawing.',
            'The number is never cut and never touches the icon; the labels and icons do not move.',
        ],
        look: 'the count stands beside the icon with air between them, never on its lines.',
        components: 'tabbar',
        body:
            frame(
                'A tab bar as on a phone',
                `<nav class="kp-tabbar kp-tabbar--always kp-tabbar--static" aria-label="Areas">${tab('home', 'Home', '', true)}${tab('inbox', 'Needs you', '3')}${tab('chart', 'Metrics', '12')}</nav>`,
                380,
            ) +
            frame(
                'Three tabs: a count of 1534 and a dot',
                `<nav class="kp-tabbar kp-tabbar--always kp-tabbar--static" aria-label="Areas, three">${tab('home', 'Home', '', true)}${tab('inbox', 'Needs you', '1534')}${tab('bell', 'Alerts', 'dot')}</nav>`,
                380,
            ),
    }),
    section({
        id: 'palette-keys',
        title: 'Command palette: a key chord',
        intro: 'The command list with the keys that run each command at the end of its row, shown in a narrow frame.',
        changed:
            'A chord such as <b>Ctrl Shift P</b> was allowed to wrap: in a narrow palette it broke into <b>Ctrl Shift</b> over <b>P</b>, two lines of key letters at the end of a one-line command. Now a chord keeps its width and its line, and it is the command&rsquo;s name that gives way (it wraps onto a second line instead). The palette, its rows and its other parts are as you approved them.',
        expect: [
            'In the narrow frame every chord (<b>g i</b>, <b>Ctrl K</b>, <b>Ctrl Shift P</b>) is one line at the end of its row.',
            'A long command name wraps beside the chord; the chord never drops to a second line.',
        ],
        look: 'each key chord reads on one line at the end of its row, with air before the next word.',
        components: 'palette',
        body: frame(
            'About 330 px, a small phone',
            `<dialog class="kp-palette rf-static" aria-label="Commands" open>
    <input class="kp-palette__input" type="text" role="combobox" aria-label="Commands" aria-expanded="true" aria-controls="rf-palette-list" autocomplete="off" placeholder="Type a command…" />
    <ul class="kp-palette__list" id="rf-palette-list" role="listbox" aria-label="Commands">
        <li class="kp-palette__option" role="option" data-kp-option data-value="inbox">Go to the inbox<kbd class="kp-palette__keys">g i</kbd></li>
        <li class="kp-palette__option" role="option" data-kp-option data-value="search">Search everything<kbd class="kp-palette__keys">Ctrl K</kbd></li>
        <li class="kp-palette__option" role="option" data-kp-option data-value="env">Switch to the staging environment<kbd class="kp-palette__keys">Ctrl Shift P</kbd></li>
    </ul>
    <p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>`,
            330,
        ),
    }),
    section({
        id: 'dialog-edge',
        title: 'Dialog in sections: text and its edge',
        intro: 'A dialog that manages one thing, in sections, each with a heading, its content and a note, the last one the danger section.',
        changed:
            'The text of a section stood exactly on the edge of the section (its rule and its start edge), 0 px away: the heading, the note and the words of a section began where the section&rsquo;s own line began. That breaks the rule that text never touches the side edge of its plate. Now a section keeps a margin of 0.5 rem between its text and its edge on both sides; the head, the footer and the buttons of the dialog are as you approved them, and the danger section keeps its red edge with its words clear of it.',
        expect: [
            'The headings <b>Use it</b>, <b>Test it</b> and <b>Danger zone</b> and the notes under them start clear of the rule that separates the sections.',
            'The danger section has its rule along the start edge and its words well clear of it.',
        ],
        look: 'every word in a section has air between it and the section&rsquo;s own edge and rules.',
        components: 'dialog',
        body: `<div class="rf-dialog"><dialog class="kp-dialog kp-dialog--wide rf-static" aria-labelledby="rf-dlg-title" open>
    <div class="kp-dialog__head"><h2 class="kp-dialog__title" id="rf-dlg-title">kyu-runner</h2><span class="kp-badge kp-badge--success">active</span>
        <p class="kp-dialog__description">Issued 12/10/2026 14:05 · last used 19/10/2026 08:41 (214 requests)</p></div>
    <div class="kp-dialog__body">
        <section class="kp-dialog__section"><h3 class="kp-dialog__heading">Use it</h3>
            <p>Paste the command on the machine that calls this service. The token is read when you press Copy.</p>
            <p class="kp-dialog__note">The block is safe to paste into a chat.</p></section>
        <section class="kp-dialog__section"><h3 class="kp-dialog__heading">Test it</h3>
            <p>One request with this client&rsquo;s token to the service&rsquo;s own test route.</p>
            <p class="kp-dialog__note">You see the round trip before the real program is wired.</p></section>
        <section class="kp-dialog__section kp-dialog__section--danger"><h3 class="kp-dialog__heading">Danger zone</h3>
            <p>Revoking keeps the row and its history; deleting does not.</p>
            <p class="kp-dialog__note">Re-issuing keeps the name and the history.</p></section>
    </div>
</dialog></div>`,
    }),
    section({
        id: 'code-long',
        title: 'Code block: a long line',
        intro: 'A payload with one line longer than the box. It scrolls sideways (or wraps with the Wrap button).',
        topic: 'code',
        topicTitle: 'Code block',
        changed:
            'A line longer than the box ran under the edge of the plate: the text was cut exactly at the plate&rsquo;s edge, with no margin, because the whole plate scrolled and the padding went with it. Now the plate keeps its 0.75 rem margin on both sides and only the line scrolls inside it, so a long line goes out of sight a little before the edge, never on it. The head, the tools, the Wrap button, the line numbers and the fold are as you approved them. The keyboard still scrolls it (it takes focus, with the arrow keys).',
        expect: [
            'The first block holds one very long line: it stops short of the right edge of the grey plate; scroll it sideways and it still stops short of both edges.',
            '<b>Wrap</b> puts the whole line on screen in several lines; the second block (short lines) is unchanged.',
        ],
        look: 'the long line ends before the plate&rsquo;s edge with air, at the start and when scrolled to the end.',
        components: 'code',
        body: `<div class="rf-stack">
    <div class="kp-code" data-rf-code="long"></div>
    <div class="kp-code" data-rf-code="short"></div>
</div>`,
    }),
    section({
        id: 'code-punct',
        title: 'Code block: punctuation in JSON',
        intro: 'A JSON payload shown pretty, with the Raw and Pretty switch. Its punctuation is drawn quieter than the words.',
        topic: 'code',
        changed:
            'Punctuation that follows other punctuation (<code>},</code> and <code>],</code>) was drawn as two separate pieces side by side with no gap between them, which the check for touching text reads as two texts at 0 px. Now a run of punctuation is one piece. It looks exactly as before: the same quiet colour, the same spacing; only the structure under it is cleaner. Raw and Pretty, keys, strings and the fold are as you approved them.',
        expect: [
            'The closing lines <b>},</b> and <b>],</b> read as they did, in the quiet colour.',
            '<b>Raw</b> and <b>Pretty</b> both draw correctly and nothing moves.',
        ],
        look: 'the punctuation at the end of a line reads as one mark in the quiet colour, as before.',
        components: 'code',
        body: `<div class="rf-stack"><div class="kp-code" data-rf-code="json"></div></div>`,
    }),
    section({
        id: 'empty-card',
        title: 'Card with nothing to show',
        intro: 'A card whose data came back empty: the card&rsquo;s own empty state fills where the data would be.',
        changed:
            'In formal the empty state of a card drew a double rule (two hairlines) along its top edge, right under the card&rsquo;s own heading and sentence, and three ruled lines at its foot that floated apart from the words centred above them: marks that belonged to nothing, since the card has its frame and the loading, failed and filled states draw none. Now the empty state inside a card draws neither; it is its words, centred in the card&rsquo;s stage. The empty plate on its own (outside a card) keeps its ledger rules. Only formal changes; the other themes were never affected.',
        expect: [
            'The card shows its heading, its sentence and, under them, <b>Nothing to show yet.</b> centred in the stage: no double rule under the sentence and no ruled lines floating under the words.',
            'The heading, the sentence and the card&rsquo;s frame are where they were; the empty words stay centred in the stage.',
        ],
        look: 'no double rule under the card&rsquo;s sentence and no ruled lines under the empty words; only the words.',
        components: 'card-state',
        body: `<div class="rf-stack"><section class="kp-card" data-kp-state="empty" id="rf-card">
    <div class="kp-card__header"><h3 class="kp-card__title">Files</h3></div>
    <p class="kp-card__body">Everything in this application&rsquo;s folder.</p>
    <div class="kp-card__stage"><div class="kp-card__data"><ul class="rf-files"><li>notes.txt</li><li>backup.tar</li><li>readme.md</li></ul></div></div>
</section></div>`,
    }),
    section({
        id: 'newpill-gap',
        title: 'The new-lines pill',
        intro: 'A live log. Scrolled away from its end, the rows that arrive are counted in a pill that jumps back.',
        changed:
            'The pill kept room for a two-digit count, so with a count of 3 it showed an empty space of a letter or two in front of the number, as if the pill had a bigger margin on one side. Now the pill is exactly as wide as its words: <b>3 new lines</b>, then <b>· back to the tail</b>, with the same air on both sides. When the number gets another digit (9 to 10, 99 to 100) the pill grows by that digit, symmetrically, around its centre. The placement, the arrival, the divider and the count are as you approved them.',
        expect: [
            'The log shows the pill <b>3 new lines · back to the tail</b>; the words start and end the same distance from the pill&rsquo;s edges.',
            'Press <b>A line arrives</b>: the count goes up by one and the pill stays centred.',
        ],
        look: 'the count starts right where the pill&rsquo;s padding ends, no extra space before it.',
        components: 'newpill',
        body: `<div class="rf-stack"><div class="rf-log" data-kp-newpill-host>
    <ul class="rf-log__list" tabindex="0" aria-label="Live lines" data-kp-follow="tail" data-kp-pill-unit="line,lines" data-kp-since-left="off" data-rf-log></ul>
</div>
<p><button type="button" class="kp-button" data-rf-arrive>A line arrives</button></p></div>`,
    }),
    section({
        id: 'heat-label',
        title: 'Heat grid: a long row name',
        intro: 'Backups per stack per night, rows named after the stack, some with long names.',
        changed:
            'A row name that was longer than its column ended in an ellipsis (&ldquo;Photos and family vide&hellip;&rdquo;), cutting the name. That breaks the rule that a label is never cut. Now a long name wraps onto a second line and the row grows to hold it (only a single word longer than the column would break, at the column&rsquo;s edge). Short names, the cells, the legend and the filter by pressing a name are as you approved them.',
        expect: [
            'Every row name is whole: <b>Photos and family videos archive</b> and <b>Nightly database snapshots</b> stand on two lines, short names on one.',
            'Press a name: the row is picked (filter) as before.',
        ],
        look: 'no row name ends in an ellipsis, and a two-line name keeps its air at both edges.',
        components: 'heat',
        body: `<div class="rf-stack"><div class="rf-heat" data-rf-heat></div></div>`,
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
const roundId = current && /^rulefixes-[0-9a-f]{8}-/.test(current) ? current : `rulefixes-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Nine faults against the text rules: tab bar, palette, dialog, code, card, pill, heat grid, wheel</title>
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
                <h1>Nine faults against the text rules</h1>
                <p class="cat-intro">
                    The project threads found nine places where an approved component broke one of your standing rules: text touching an edge or an
                    icon, text cut with an ellipsis, a word breaking letter by letter, a stray mark. ${pairs} pairs in all; every fault is shown in
                    formal, the wheel also in dark and cyberpunk (their names are set in a wider face). Each section says under <b>What changed since
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
