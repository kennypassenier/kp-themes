// Builds research/gaps-1031/demo.html: seven opt-in options the homelab dashboard and kyu asked for (~/Projects/kp-gaps/homelab.md
// items 22, 26, 39, 43, 70 and 73, kyu.md item 15), built for 12.1.0 (Kenny: "zie dat alles gefixt is in deze release"). One review page,
// formal only, one section per item (DEMO_RULES ch. 1 and 6). Each section is written here once: what is asked, the heading and one
// sentence, what to expect, what to look at, the controls and the component. demo.js fills the components with the apps' own data (the
// homelab Inbox's questions and notices, its Settings tokens, a stack's secrets, its schedules; kyu's publish snippet) and wires the
// controls by each section's own elements. The names, times and tokens are mock.
// Run: node research/gaps-1031/build.mjs (the page keeps its round id until the verdict is recorded; a round already answered gets a new one).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { demoVerdicts } from '../_review/verdicts-record.mjs';

const here = new URL('./', import.meta.url);
const ID = 'gaps-1031';
const THEMES = ['formal'];
const MAX_ITEMS = 100;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The data states a section's component takes. */
const states = (target) => group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], target);
/** The stage's width: the whole column, or a phone's 390 px. */
const width = (target) => group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], target);

const ASIDE_ROWS = [
    ['Set by', 'kenny, from the dashboard'],
    ['Changed', '27/10/2026 21:14'],
    ['Used by', 'vaultwarden (the admin page)'],
    ['Kept in', 'latch, env prod'],
];

const SECRET_ROWS = [
    ['ADMIN_TOKEN', 'Set', '27/10/2026 21:14'],
    ['DATABASE_URL', 'Set', '02/09/2026 08:40'],
    ['SMTP_PASSWORD', 'Set', '14/08/2026 19:02'],
    ['PUSH_INSTALLATION_KEY', 'Missing', '-'],
    ['SIGNUPS_ALLOWED', 'Set', '02/09/2026 08:40'],
    ['YUBICO_SECRET_KEY', 'Set', '30/06/2026 11:27'],
];

const secretsTable = `<div class="kp-datatable" id="pg-md-table" data-kp-datatable data-kp-cards data-kp-cards-at="24rem" data-kp-page-size="25" data-kp-page-sizes="none">
                    <div class="kp-table-wrap"><table class="kp-table"><caption>Secrets of vaultwarden</caption>
                    <thead><tr><th scope="col" data-kp-field="key" data-kp-sort="text">Key</th><th scope="col" data-kp-field="state" data-kp-sort="text">State</th><th scope="col" data-kp-field="changed" data-kp-sort="text">Changed</th></tr></thead>
                    <tbody>${SECRET_ROWS.map(([k, s, c]) => `<tr><td><code>${k}</code></td><td><span class="kp-badge${s === 'Missing' ? ' kp-badge--warning' : ''}">${s}</span></td><td>${c}</td></tr>`).join('')}</tbody></table></div>
                </div>`;

const masterDetail = `<div class="kp-split kp-split--panes" id="pg-md" data-kp-master-detail data-kp-aside-fold-at="56rem" data-kp-pane-history="off">
                <section class="kp-split__pane" data-kp-pane="detail" aria-label="Secrets of vaultwarden">
                    <h3 data-kp-pane-heading tabindex="-1">vaultwarden: 6 secrets, 1 missing</h3>
                    ${secretsTable}
                </section>
                <aside class="kp-split__pane" data-kp-pane="aside" aria-label="ADMIN_TOKEN">
                    <h4 class="pg-aside-title">ADMIN_TOKEN</h4>
                    <dl class="kp-kv">${ASIDE_ROWS.map(([k, v]) => `<div class="kp-kv__row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
                </aside>
            </div>`;

/** kyu's publish snippet (src/dashboard/snippets.rs) with the hub's token marked as the secret. The token is mock. */
const KYU_TOKEN = 'kyu_6f1c9e2a7b4d4e0f8a3c5b9d1e7f2a64';
const kyuCommand = `<div class="kp-command" id="pg-command" data-kp-command="bash" data-kp-command-where="the machine that publishes"><pre><code>curl -s -H 'authorization: Bearer <span data-kp-command-secret="kyu token">${KYU_TOKEN}</span>' \\
     -H 'content-type: application/json' \\
     -d '{"text":"Backup of vaultwarden failed"}' \\
     https://kyu.lan/t/alerts</code></pre></div>`;

const SECTIONS = [
    {
        id: 'question-batch',
        title: 'Questions: answer them all with their default',
        topic: 'questions',
        topicTitle: 'The question card',
        item: 'homelab gap 22',
        asked: 'The homelab Inbox drew its own plain button to answer every waiting question at once. <code>data-kp-questions-batch</code> on the questions container puts the package&rsquo;s own bar over the cards: one press answers every open question that has a default answer with that default, the answer it would get at zero anyway, each card through its own button. <code>off</code> (no bar) stays the default, so the approved card is unchanged; <code>confirm</code> asks first. <code>data-kp-questions-batch-min</code> (default 2) is how many must wait before the bar shows.',
        h2: 'Three questions from the host',
        intro: 'Two prunes and a restart wait for an answer; each has &ldquo;Leave it stopped&rdquo; as its default. The clocks stand still so you can read them.',
        expected: [
            '<b>On</b>: a bar over the three cards says &ldquo;3 questions wait and each has a default answer.&rdquo; with &ldquo;Answer 3 with their default&rdquo; at its end. A press turns every card to its outcome (&ldquo;Stopped. Nothing was deleted.&rdquo;) and the bar goes, because nothing waits any more. The line under the cards names each answer the page heard.',
            '<b>Confirm</b>: the first press asks &ldquo;Answer 3 questions with their default now?&rdquo; with Answer all and Cancel; Cancel puts the bar back.',
            '<b>Off</b>: no bar, the cards exactly as approved. <b>Three (ask again)</b> asks the three questions again; <b>One</b> asks only the first, and the bar stays away, because one card already has its own buttons (<code>data-kp-questions-batch-min</code>, 2). <b>Phone</b>: the bar&rsquo;s button goes under its line.',
        ],
        look: 'Formal: the bar is a quiet card-coloured plate over the alert cards, its button the package&rsquo;s small button. Check that the bar reads as belonging to the cards under it and that the count is exact.',
        controls:
            group('Bar', 'batch', [['on', 'On', true], ['confirm', 'Confirm first'], ['off', 'Off (default)']], 'pg-questions') +
            group('Waiting', 'ask', [['3', 'Three (ask again)', true], ['1', 'One']], 'pg-questions') +
            width('question-batch-component'),
        component: `<div id="pg-questions" data-kp-questions data-kp-title="off" data-kp-questions-batch="on" aria-label="Questions from the host"></div>
        <p class="pg-log" id="pg-questions-log" role="status" aria-live="polite"></p>`,
    },
    {
        id: 'notices-preview',
        title: 'Notices: an embedded read-only preview',
        topic: 'notices',
        topicTitle: 'The notification centre',
        item: 'homelab gap 26',
        asked: 'The homelab Overview wants to show the newest notices in the page without the Inbox&rsquo;s own heading, Mark all read and per-row Mark read: those belong on the Inbox page. <code>data-kp-notices-look="preview"</code> is that look: the same rows as the Inbox page, newest per severity, each with its Fix, and &ldquo;All 5 in the Inbox&rdquo; under them. It leaves the tab title and the toasts to the page&rsquo;s own counter. The approved looks (both, panel, page) do not change.',
        h2: 'What needs you, on the Overview',
        intro: 'The five notices the homelab pushed last night: two urgent, two warnings and one for the morning digest.',
        expected: [
            '<b>Preview</b>: five rows, worst first, each with its mark, title, age and why it was pushed; the two with a fix show their button at the start of the actions. No heading, no Mark all read, no Mark read; &ldquo;All 5 in the Inbox&rdquo; stands under the list.',
            '<b>Inbox page (as approved)</b>: the same notices with the Inbox heading, Mark all read and a Mark read in every row, to compare.',
            '<b>Loading</b>, <b>Empty</b> and <b>Failed</b> fill the list&rsquo;s footprint with the busy card or the package plate (Failed with Retry), in both looks.',
        ],
        look: 'Formal: the preview is the Inbox page&rsquo;s paper plate without its head. Check that nothing in it invites you to change a notice&rsquo;s read state, and that the Fix buttons stand in one column.',
        controls:
            group('Look', 'look', [['preview', 'Preview', true], ['page', 'Inbox page (as approved)']], 'pg-notices-slot') + states('pg-notices-slot') + width('notices-preview-component'),
        component: `<div id="pg-notices-slot" class="pg-slot"></div>`,
    },
    {
        id: 'passkeys-slot',
        title: 'Ways to sign in: a free slot in a row',
        topic: 'passkeys',
        topicTitle: 'The list of ways to sign in',
        item: 'homelab gap 39',
        asked: 'The homelab Settings page lists its machine tokens with their scope, and the passkey row had no place for it, so the tokens were drawn as form rows instead. A row&rsquo;s <code>extra</code> is a free slot beside its badges: a word is drawn as a plain badge (the token&rsquo;s scope), or the page hands in its own element. A row without <code>extra</code> is as approved.',
        h2: 'How you and your machines sign in',
        intro: 'Your two passkeys and the dashboard&rsquo;s two tokens, legacy with full access and wsl that may only operate.',
        expected: [
            '<b>Scope chip</b>: the two token rows carry &ldquo;Scope: full access&rdquo; and &ldquo;Scope: operate&rdquo; in the badge column, under each other, on the same edge as &ldquo;This device&rdquo; above them; the passkey rows have none and keep their place.',
            '<b>No slot</b>: the list exactly as approved.',
            '<b>Phone</b>: the chips join the badges under the name; Rename and Remove fill the line under each row.',
        ],
        look: 'Formal: the scope is a plain badge in the same column as the approved badges. Check that it reads as part of the row and never pushes the buttons out of their column.',
        controls: group('Slot', 'slot', [['scope', 'Scope chip', true], ['none', 'No slot']], 'pg-pk-slot') + states('pg-pk-slot') + width('passkeys-slot-component'),
        component: `<div class="kp-passkeys" id="pg-pk-slot" data-kp-passkeys></div>`,
    },
    {
        id: 'passkeys-tokens',
        title: 'Ways to sign in: no Rename, and a last use that is not known',
        topic: 'passkeys',
        topicTitle: 'The list of ways to sign in',
        item: 'homelab gap 70',
        asked: 'The homelab cannot rename a token (its kit has no call for it) and does not record when a token was last used, yet every row said &ldquo;Never used&rdquo; and offered Rename. <code>data-kp-rename="off"</code> (or <code>rename: false</code>) leaves Rename out. <code>data-kp-missing-use</code> says what a row without a last use reads: <code>never</code> (&ldquo;Never used&rdquo;, the default, as approved), <code>unknown</code> (&ldquo;Last use not recorded&rdquo;, and never flagged as unused) or <code>none</code> (nothing).',
        h2: 'The dashboard&rsquo;s tokens',
        intro: 'Three machine tokens as the homelab lists them: a name and a scope, no record of their last use.',
        expected: [
            '<b>No Rename, Unknown</b>: each row says &ldquo;Token · Added …&rdquo; and &ldquo;Last use not recorded&rdquo;; no &ldquo;Unused for … days&rdquo; badge; Remove stands alone at the end of every row, in one column.',
            '<b>Rename</b> brings the approved Rename back beside Remove. <b>Never used</b> is today&rsquo;s wording (and the old token gets its &ldquo;Unused for … days&rdquo; badge); <b>Nothing</b> leaves the last-use words out.',
            '<b>Loading</b>, <b>Empty</b> and <b>Failed</b> are the list&rsquo;s own states over its full footprint.',
        ],
        look: 'Formal: the same row as the passkeys, with fewer words. Check that one Remove per row lines up and that nothing claims a token was never used.',
        controls:
            group('Rename', 'rename', [['off', 'No Rename', true], ['on', 'Rename (default)']], 'pg-pk-tokens') +
            group('Last use', 'missing', [['unknown', 'Unknown', true], ['never', 'Never used (default)'], ['none', 'Nothing']], 'pg-pk-tokens') +
            states('pg-pk-tokens') +
            width('passkeys-tokens-component'),
        component: `<div class="kp-passkeys" id="pg-pk-tokens" data-kp-passkeys data-kp-rename="off" data-kp-missing-use="unknown"></div>`,
    },
    {
        id: 'md-aside',
        title: 'Master and detail: a detail with its aside, no list',
        topic: 'master-detail',
        topicTitle: 'Master and detail',
        item: 'homelab gap 73',
        asked: 'A stack&rsquo;s Secrets page has one stack, so no list: the homelab laid its keys and drawer on a grid of its own. A master-detail with a detail and an aside but no list pane is now wired: the detail takes the room, the aside stands beside it and folds under it when the layout gets narrow, and there is no Back and no &ldquo;Pick an item&rdquo; plate, because there is nothing to pick. A master-detail with a list is unchanged.',
        h2: 'The secrets of vaultwarden',
        intro: 'Six keys of one stack, one missing, with the drawer of ADMIN_TOKEN beside them.',
        expected: [
            '<b>Full width</b>: the table on the left, the drawer (24rem) on the right, a rule between them; the heading over the table, no Back button.',
            '<b>Tablet, 820 px</b>: the drawer moves under the table, full width. <b>Phone</b>: the same, one column.',
            '<b>Loading</b> lays the busy card over the detail; <b>Empty</b> and <b>Failed</b> cover the whole layout at full width with the package plate (Failed with Retry); with the drawer folded under (tablet, phone) the plate fills the detail and the drawer under it is held still, as in the approved master-detail.',
        ],
        look: 'Formal: two ruled panes. Check that the detail is the wide one, that the aside never squeezes it, and that the states fill the footprint.',
        controls:
            states('pg-md') +
            group('Width', 'width', [['full', 'Full width', true], ['tablet', 'Tablet, 820 px'], ['phone', 'Phone, 390 px']], 'md-aside-component'),
        component: masterDetail,
    },
    {
        id: 'week-off',
        title: 'Week: leave the switched-off runs out',
        topic: 'week',
        topicTitle: 'The week agenda',
        item: 'homelab gap 43',
        asked: 'The homelab Schedules page can only draw a switched-off schedule dimmed and struck through, and wants to leave it out. <code>data-kp-week-off="hide"</code> leaves the <code>off</code> items out of the week; <code>show</code>, the default, draws them as approved. It is read again when it changes.',
        h2: 'Runs in the next 7 days',
        intro: 'The nightly backups, the Sunday prune and the update round; two schedules are switched off.',
        expected: [
            '<b>Hidden</b>: no struck-through pill anywhere; the paused immich backups and the switched-off almanac sync are gone, every other pill keeps its place.',
            '<b>Shown (as approved)</b>: the two switched-off schedules come back muted and struck through.',
            '<b>Loading</b>, <b>Empty</b> and <b>Failed</b>: the busy card over the days, or the package plate over the whole agenda (Failed with Retry). <b>Phone</b>: the days become rows.',
        ],
        look: 'Formal: the week&rsquo;s ruled grid. Check that hiding moves nothing else and that each day&rsquo;s pills stay in time order.',
        controls: group('Switched off', 'off', [['hide', 'Hidden', true], ['show', 'Shown (default)']], 'pg-week') + states('pg-week') + width('week-off-component'),
        component: `<section class="kp-week" id="pg-week" data-kp-week data-kp-week-off="hide" aria-label="Runs in the next 7 days"></section>`,
    },
    {
        id: 'command-secret',
        title: 'Command: a masked token in the line',
        topic: 'command',
        topicTitle: 'The command block',
        item: 'kyu gap 15',
        asked: 'kyu shows a working publish command with its token, and had to print it twice: once without the token in the command block and once whole in a secret field under it. Now the page marks the token inside the command with <code>data-kp-command-secret</code>: it is drawn masked, a Show button before Copy shows it while pressed in, and Copy always copies the command with the real token. <code>data-kp-command-secret-mask</code>: <code>dots</code> (default, eight dots, whatever its length) or <code>tail</code> (its last four characters too). <code>data-kp-command-secret-reveal="off"</code> leaves Show out. A command without a marked token is as approved.',
        h2: 'Publish a message',
        intro: 'kyu&rsquo;s own snippet for the alerts topic, with the hub&rsquo;s token in the header.',
        expected: [
            '<b>Dots</b>: the token reads as eight dots on a muted ground inside the first line; the lines and prompts are as approved. <b>Show</b> (pressed in) puts the token in its place and says Hide; pressing again masks it. <b>Copy</b> says Copied, and what it copied (the real command) is written under the block.',
            '<b>Last four</b>: the dots end in the token&rsquo;s last four characters, &ldquo;2a64&rdquo;.',
            '<b>Show button off</b>: only Copy in the head. <b>Phone</b>: the long line wraps under itself; the dots never break apart.',
        ],
        look: 'Formal: the command&rsquo;s paper code block. Check that the masked part reads as one thing, that Show and Copy keep their width when their words change, and that nothing of the token shows while it is masked.',
        controls:
            group('Mask', 'mask', [['dots', 'Dots (default)', true], ['tail', 'Last four']], 'pg-command-slot') +
            group('Show button', 'reveal', [['on', 'On (default)', true], ['off', 'Off']], 'pg-command-slot') +
            width('command-secret-component'),
        component: `<template id="pg-command-template">${kyuCommand}</template><div id="pg-command-slot" class="pg-slot"></div>
        <p class="pg-log" id="pg-command-log" role="status" aria-live="polite"></p>`,
    },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s) => `        <section id="${s.id}" data-review-item="${s.id}" data-review-topic="${s.topic}" data-review-topic-title="${s.topicTitle}" data-review-components="${s.id}" data-review-title="${s.title}" aria-labelledby="h-${s.id}">
            <div class="pg-asked"><p><b>What is asked</b> (${s.item}): ${s.asked}</p></div>
            <div class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></div>
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

const { verdicts, received } = demoVerdicts(here, { demo: ID, rounds: [] });
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
// A round id is never reused: once Kenny's answer to it is recorded (it is in `received`), the next page gets a new one.
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) && !received.includes(current) ? current : `${ID}-${randomUUID()}`;

const title = 'Seven options homelab and kyu asked for';
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
                    For 12.1.0 (&ldquo;zie dat alles gefixt is in deze release&rdquo;): seven things the homelab dashboard and kyu had to draw themselves, now
                    options of the package. Every one is opt-in: without it the component is exactly as you approved it. Formal only, on the apps&rsquo; own
                    data (the names, times and the token are mock). ${SECTIONS.length} sections, ${SECTIONS.length * THEMES.length} pairs.
                </p>
                <p>Each section says under <b>Expected</b> what you should see and what each control does. The width control shows the stage at a phone&rsquo;s 390 px.</p>
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
