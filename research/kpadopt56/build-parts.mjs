// Builds the review pages that ask the eleven other themes about the 79 sections of the fifth and sixth adoption rounds
// (Kenny, 2026-10-18: formal is decided for research/kpadopt5-{basics,people,time,rows,ops} and
// research/kpadopt6-{calm,social,media,ops}; the same sections now go to dark, cyberpunk, synthwave, pastel, forest,
// blueprint, solstice, brutalism, deco, nostromo and titanium).
//
// Why a builder: every re-review round of those nine demos removed the sections Kenny had approved (a re-review shows
// only the unapproved), so no demo page holds all its sections any more. research/kpadopt56/src/<demo>/ holds, per demo,
// the LATEST version of every section (the one from the last round in which it was shown), its scripts with the wiring a
// later round dropped restored, and its styles; extract-sources.mjs derives those from git and says how. This builder
// reads only src/ and the package.
//
// Why parts: a review asks at most 100 pairs (Kenny, 2026-10-17: "demos met meer dan 100 beoordelingen moeten ook
// opgesplitst worden per group van elementen"). 79 sections x 11 themes = 869 pairs, so the sections are grouped by the
// kind of component into the parts below, nine sections at most (9 x 11 = 99 pairs). An item and its "-states" sibling
// stay in one part and one topic. Each part is research/kpadopt56-<topic>/demo.html with its own round id
// (`<topic>-<uuid>`), its own VERDICTS.json and its own entry on the Agenda.
//
// What the builder does to a section: swaps its look-at lines for one line per theme asked (written from
// themes/<theme>/CHARACTER.md, see LOOK below), and checks the page (no id twice, every hook the section uses is wired
// by a script that is on the page). A page holds ONLY the sections of its part (Kenny, 2026-10-18 07:11): the sections of
// a demo that are not in the part are not on the page, neither hidden nor laid aside, and the demo's script tolerates
// their absence (a section that is not there is skipped), so no foreign control group or content reaches the dialog.
// Idempotent: run it after every change to src/ or to the lists below; a part keeps its round id until Kenny's answer
// to it is recorded in its VERDICTS.json, then takes a fresh one.
//
// Run: node research/kpadopt56/build-parts.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import { declareControls } from './controls-for.mjs';

const here = new URL('./', import.meta.url);
const THEMES = ['dark', 'cyberpunk', 'synthwave', 'pastel', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'nostromo', 'titanium'];
const MAX_PAIRS = 100;

/** The nine demos: where their sources are, and whether their script ran before js/auto.js on their own page. */
const DEMOS = /** @type {const} */ ({
    'kpadopt5-basics': { autoFirst: true },
    'kpadopt5-people': { autoFirst: false },
    'kpadopt5-time': { autoFirst: true },
    'kpadopt5-rows': { autoFirst: false },
    'kpadopt5-ops': { autoFirst: false },
    'kpadopt6-calm': { autoFirst: false },
    'kpadopt6-social': { autoFirst: false },
    'kpadopt6-media': { autoFirst: true },
    'kpadopt6-ops': { autoFirst: true },
});

/**
 * The parts, by the kind of component. `items`: [demo, section id]. The title and the summary are shown to Kenny.
 * @type {{ topic: string, title: string, summary: string, items: [keyof typeof DEMOS, string][] }[]}
 */
const PARTS = [
    {
        topic: 'schedule',
        title: 'Schedules and reminders',
        summary: 'Choosing weekdays, seeing the next times a schedule runs, snoozing, and a schedule written as a sentence.',
        items: [
            ['kpadopt5-time', 'weekdays'],
            ['kpadopt5-time', 'weekdays-states'],
            ['kpadopt5-time', 'runs'],
            ['kpadopt5-time', 'runs-states'],
            ['kpadopt5-time', 'snooze'],
            ['kpadopt5-time', 'snooze-states'],
            ['kpadopt5-time', 'sentence'],
            ['kpadopt5-time', 'sentence-states'],
        ],
    },
    {
        topic: 'choose',
        title: 'Pickers and palettes',
        summary: 'Picking from a list: the usual on top, with its band and its states, and words in any order.',
        items: [
            ['kpadopt6-calm', 'usual'],
            ['kpadopt6-calm', 'usual-band'],
            ['kpadopt6-calm', 'usual-states'],
            ['kpadopt6-ops', 'intent'],
            ['kpadopt6-ops', 'intent-states'],
        ],
    },
    {
        topic: 'toggles',
        title: 'Dated options, toggles and keys',
        summary: 'Options with a date, a button that stays pressed, and keys that know their own list.',
        items: [
            ['kpadopt5-time', 'dated'],
            ['kpadopt5-time', 'dated-states'],
            ['kpadopt6-ops', 'toggle'],
            ['kpadopt6-ops', 'toggle-states'],
            ['kpadopt5-basics', 'shortcut-engine'],
        ],
    },
    {
        topic: 'fields',
        title: 'Fields and inputs',
        summary: 'Entering a value: a slider with a typed value beside it, a time of day, a text box that grows, a JSON box that checks what you type, and a star rating.',
        items: [
            ['kpadopt5-time', 'slider'],
            ['kpadopt5-time', 'slider-states'],
            ['kpadopt6-social', 'time-field'],
            ['kpadopt6-social', 'time-field-options'],
            ['kpadopt6-media', 'autosize-grow'],
            ['kpadopt6-media', 'autosize-states'],
            ['kpadopt5-rows', 'json-textarea'],
            ['kpadopt6-calm', 'rating'],
            ['kpadopt6-calm', 'rating-states'],
        ],
    },
    {
        topic: 'updates',
        title: 'Updating safely',
        summary: 'What an update list needs: the size of a version jump, a tick before it may start, what needs what, and how often the list refreshes.',
        items: [
            ['kpadopt6-ops', 'version'],
            ['kpadopt6-ops', 'version-states'],
            ['kpadopt6-ops', 'ack'],
            ['kpadopt6-ops', 'ack-states'],
            ['kpadopt6-ops', 'deplist'],
            ['kpadopt6-ops', 'deplist-states'],
            ['kpadopt5-ops', 'auto-refresh'],
        ],
    },
    {
        topic: 'confirm',
        title: 'Saving, undoing and answering',
        summary: 'What happens after you act: the unsaved-changes bar, a toast with Undo, a button that shows its result, a question that waits for your answer, and the bar over a selection.',
        items: [
            ['kpadopt5-time', 'unsaved'],
            ['kpadopt5-time', 'unsaved-states'],
            ['kpadopt5-rows', 'undo-toast'],
            ['kpadopt5-rows', 'undo-toast-clock'],
            ['kpadopt5-basics', 'result-flash-button'],
            ['kpadopt5-ops', 'question'],
            ['kpadopt5-rows', 'selection-bar'],
            ['kpadopt5-rows', 'selection-bar-place'],
        ],
    },
    {
        topic: 'lists',
        title: 'Lists, records and pages',
        summary: 'Rows and what sits in them: ticking with the keyboard, who brings what, a list with its detail, new lines on a live list and payloads.',
        items: [
            ['kpadopt5-rows', 'row-keyboard-select'],
            ['kpadopt6-social', 'claim-row-states'],
            ['kpadopt6-social', 'claim-row'],
            ['kpadopt5-ops', 'master-detail'],
            ['kpadopt5-rows', 'new-items-pill'],
            ['kpadopt5-rows', 'payload-cell'],
        ],
    },
    {
        topic: 'pages',
        title: 'Requests, consoles and pages',
        summary: 'Looking into a request, a console with a prompt and a block per command, and the frame of a dashboard page.',
        items: [
            ['kpadopt5-rows', 'request-inspector'],
            ['kpadopt6-social', 'interactive-console-states'],
            ['kpadopt6-social', 'interactive-console'],
            ['kpadopt5-ops', 'ops-page-states'],
            ['kpadopt5-ops', 'ops-page'],
        ],
    },
    {
        topic: 'status',
        title: 'Messages and status',
        summary: 'Telling the reader what is going on: a problem with its reason and its remedy, the offline banner, a transfer with its time left, the notification centre, the line under a heading, and the today card.',
        items: [
            ['kpadopt5-basics', 'problem-alert'],
            ['kpadopt5-ops', 'connection'],
            ['kpadopt5-ops', 'transfer'],
            ['kpadopt5-ops', 'notices'],
            ['kpadopt5-basics', 'explain-lede'],
            ['kpadopt6-calm', 'today'],
            ['kpadopt6-calm', 'today-states'],
        ],
    },
    {
        topic: 'calm',
        title: 'Calm screens',
        summary: 'A quiet daily check-in: calm mode, calm days, the quote card and questions one per screen.',
        items: [
            ['kpadopt5-basics', 'calm-mode'],
            ['kpadopt6-calm', 'calm-tones'],
            ['kpadopt6-calm', 'calm-tones-states'],
            ['kpadopt6-calm', 'quote'],
            ['kpadopt6-calm', 'quote-states'],
            ['kpadopt6-calm', 'focus'],
            ['kpadopt6-calm', 'focus-options'],
            ['kpadopt6-calm', 'focus-states'],
        ],
    },
    {
        topic: 'charts',
        title: 'Charts and maps',
        summary: 'Drawings of data: chart markers and a median line, what uses what, and the path of a connection.',
        items: [
            ['kpadopt5-people', 'chart-annotations'],
            ['kpadopt5-people', 'chart-annotations-runs'],
            ['kpadopt5-people', 'chart-annotations-few'],
            ['kpadopt6-media', 'uses-lines'],
            ['kpadopt6-media', 'uses-states'],
            ['kpadopt6-ops', 'trace'],
            ['kpadopt6-ops', 'trace-states'],
        ],
    },
    {
        topic: 'availability',
        title: 'Who can come',
        summary: 'People over days or periods, in five sections of the same grid: its states, how people answer, the best column, the rows and the summary, and the phone and density.',
        items: [
            ['kpadopt6-social', 'availability-grid-states'],
            ['kpadopt6-social', 'availability-grid-answering'],
            ['kpadopt6-social', 'availability-grid-best'],
            ['kpadopt6-social', 'availability-grid-layout'],
            ['kpadopt6-social', 'availability-grid-phone'],
        ],
    },
    {
        topic: 'media',
        title: 'Pictures, documents and printing',
        summary: 'Things you look at or take away: the picture gallery, the document preview, anchors on headings and rows, a QR code, and a printed checklist.',
        items: [
            ['kpadopt6-media', 'gallery-grid'],
            ['kpadopt6-media', 'gallery-states'],
            ['kpadopt6-media', 'docpreview-open'],
            ['kpadopt6-media', 'docpreview-states'],
            ['kpadopt6-media', 'anchors-headings'],
            ['kpadopt6-media', 'anchors-rows'],
            ['kpadopt6-media', 'print-checklist'],
            ['kpadopt6-social', 'qr-code-states'],
            ['kpadopt6-social', 'qr-code'],
        ],
    },
    {
        topic: 'people',
        title: 'People and cards',
        summary: 'Who is who: the avatar, the list of ways to sign in, the conversation in bubbles, and the entity card.',
        items: [
            ['kpadopt5-people', 'avatar'],
            ['kpadopt5-people', 'passkey-list'],
            ['kpadopt5-people', 'conversation-thread'],
            ['kpadopt5-people', 'conversation-thread-look'],
            ['kpadopt5-people', 'conversation-thread-fold'],
            ['kpadopt6-ops', 'entity'],
            ['kpadopt6-ops', 'entity-behaviour'],
            ['kpadopt6-ops', 'entity-states'],
        ],
    },
];

/**
 * What to look at, per theme, from themes/<theme>/CHARACTER.md: `main` for a section, `states` for a "-states" section
 * (its loading, empty, failed, long-text and phone-width samples).
 * @type {Record<string, { main: string, states: string }>}
 */
const LOOK = {
    dark: {
        main: 'Dark is a spectral instrument: near-black with a faint grid, chamfered corners and one film of cyan-to-magenta light along the edges that matter. Check that this part wears that film on its frames and focus, that anything opening or arriving is swept in from the left over its own box and never just faded, and that text keeps clear of every edge.',
        states: 'In dark, waiting is a comet with a film tail over the whole component; empty and failed are one centred plate at normal size with a normal-size button. Check each sample keeps the component’s footprint, the chamfered corners hold, and at phone width nothing is cut or touches an edge.',
    },
    cyberpunk: {
        main: 'Cyberpunk is a netrunner’s HUD: signal yellow on a near-black ground with scanlines, cyan read-outs, blood red where something is wrong, and plates with a cut corner. Check the part reads as a holo card, that things appear in hard glitch ticks (never an ease or a glide), and that no text sits against a cut corner or the rim.',
        states: 'In cyberpunk, waiting is signal loss: the word and the plate glitch while the whole component stays in place. Check loading, empty and failed keep the full footprint, the red is used only for a real failure, and at phone width the cut corners clip no text.',
    },
    synthwave: {
        main: 'Synthwave is the drive into the sunset, 1984: a neon horizon, the grid floor, the striped sun and tubes with a soft bloom. Check the part sits on its floor with neon-tube edges, that things rise over the horizon or switch on like a tube (nothing tears or runs diagonal), and that text keeps clear of the glow and the edge.',
        states: 'In synthwave, waiting is the marquee chasing along the whole component. Check loading, empty and failed keep the full footprint, the chase is visible and moving, and at phone width the bloom clips nothing.',
    },
    pastel: {
        main: 'Pastel is a risograph sticker sheet in a planner: lavender milk paper, plum ink, a second ink that never quite lines up, stickers and taped-in notes. Check the part looks printed in two passes and stuck on, soft and never sharp, and that text keeps clear of the sticker edge and the tape.',
        states: 'In pastel, waiting is washi tape fluttering over the whole component. Check loading, empty and failed keep the full footprint, the misregistered second ink is visible but readable, and at phone width nothing is cut.',
    },
    forest: {
        main: 'Forest is a ranger’s field kit: a map on kraft paper with contour lines and trail blazes, and wood that grows on it. Check the part has the leaf corners (top-right and bottom-left rounded), that things grow out of their anchor rather than pop, and that text keeps clear of the corners and the blazes.',
        states: 'In forest, waiting is the row of planted trees along the whole component. Check loading, empty and failed keep the full footprint, the trees stand and grow as the bar fills, and at phone width nothing is cut.',
    },
    blueprint: {
        main: 'Blueprint is the working drawing: a Prussian-blue sheet, a cyan pen line, white lettering and an amber checker’s pencil. Check the part is drawn by the pen (outline first, then inked), that corner brackets and dimension lines sit where they say, and that no lettering touches a line or a bracket.',
        states: 'In blueprint, waiting is the section hatched across the whole component. Check loading, empty and failed keep the full footprint, the hatching moves, a failure is flagged in amber or red and not just a colour change, and at phone width nothing is cut.',
    },
    solstice: {
        main: 'Solstice is the low sun on warm charcoal: light comes from below and catches the foot of every plate, the voice is a serif, and everything is slow. Check the warm light rises from the foot of the part, that things are kindled or eclipsed rather than faded, and that text keeps clear of the lit edge.',
        states: 'In solstice, waiting is the sun crossing the whole component and a warning reddens the sky. Check loading, empty and failed keep the full footprint, the crossing is visible and calm, and at phone width nothing is cut.',
    },
    brutalism: {
        main: 'Brutalism is the slab: one hard ink line, a hard offset shadow where the part would fall, flat paint and controls that name what they are. Check the part stands on its own shadow, that things drop onto their footprint and stop dead (no ease, no glow), and that text keeps clear of the line and the shadow.',
        states: 'In brutalism, waiting is a lintel hoisted across the whole component and a warning is taped off. Check loading, empty and failed keep the full footprint, the hard steps are visible, and at phone width the shadow clips nothing.',
    },
    deco: {
        main: 'Deco is the grand lobby of 1925: deep blue lacquer with a chevron wallpaper, gold hairlines and small jewels, ivory type, symmetry and slow motion. Check the part has its gold inlay (a hairline, not a flat fill), that it draws itself on and is covered by a great fan when it leaves, and that text keeps clear of the inlay.',
        states: 'In deco, waiting is lift doors over the whole component. Check loading, empty and failed keep the full footprint, the doors and the inlay move slowly and cleanly, and at phone width the gold edge cuts no text.',
    },
    nostromo: {
        main: 'Nostromo is the ship’s console, 1979: a moulded beige case with label tape, screws, vents and a lamp on every switch, and amber CRT screens set into it. Check the part reads as plastic case or as screen (not a mix), that things switch on or are struck on the tube in whole frames, and that no label touches the case edge or a vent.',
        states: 'In nostromo, waiting is the raster building up on the screen across the whole component. Check loading, empty and failed keep the full footprint, the lamps tell the state, and at phone width nothing is cut.',
    },
    titanium: {
        main: 'Titanium is a material: bare machined titanium over a carbon twill with an anodised oxide film, cut, milled, indexed and stamped. Check the part looks machined (crisp edges, the film only where it carries meaning), that nothing breathes, bounces or swells, and that text keeps clear of the milled edge.',
        states: 'In titanium, waiting is the machined film sweeping the whole component. Check loading, empty and failed keep the full footprint, the sweep is visible, and at phone width nothing is cut.',
    },
};

/**
 * What changed since Kenny's last review, for a section a later round asks again (keyed `<topic>/<section id>`): shown on
 * the page above the Expected block ("What changed since your last review"), and as one more Expected bullet.
 * @type {Record<string, { changed: string, expect: string }>}
 */
const CHANGED = {
    'media/docpreview-open': {
        changed:
            'In your last review (18/10) the preview that opens was far too low and showed almost nothing of the file. Two causes. The review dialog shows each section in a frame as tall as the section (219 px here), and the preview takes 90% of the window it stands in, so it was 197 px high with a stage of 58 px. Now, while a preview (or any dialog of a section) is open, the frame is as tall as the review dialog has room for and the section is brought to the top, so the preview is 779 px high with a stage of 640 px at 1920 by 965, as it would be in an app; it shrinks back when you close it. And a tall picture was cut at the foot of the stage; the stage now holds the whole picture, scaled to fit.',
        expect: '<b>Preview the CV</b> opens a preview of about 90% of the dialog&rsquo;s height, its stage showing the file at full size; <kbd class="kp-kbd">&rarr;</kbd> shows the whole cover letter and then the whole photo (sky to the foot of the mountains), nothing cut; <kbd class="kp-kbd">Esc</kbd> closes it and the frame returns to the three files.',
    },
};

const read = (/** @type {string} */ path) => readFileSync(fileURLToPath(new URL(path, here)), 'utf8');
/** @param {string} text */
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** @type {Map<string, { id: string, text: string }[]>} */
const sections = new Map();
for (const demo of Object.keys(DEMOS)) {
    const html = read(`src/${demo}/sections.html`);
    /** @type {{ id: string, text: string }[]} */
    const list = [];
    for (const m of html.matchAll(/<!-- ===== item: (\S+) \(from [^)]*\) -->\n([\s\S]*?)\n\n(?=<!-- ===== item: |$)/g)) list.push({ id: m[1], text: m[2] });
    sections.set(demo, list);
}

// Every one of the 79 sections is in exactly one part.
const placed = new Map(PARTS.flatMap((p) => p.items).map(([d, i]) => [`${d}/${i}`, 0]));
for (const [demo, list] of sections) for (const s of list) if (!placed.has(`${demo}/${s.id}`)) throw new Error(`${demo}/${s.id} is in no part`);
for (const part of PARTS) {
    for (const [demo, id] of part.items) {
        if (!sections.get(demo)?.some((s) => s.id === id)) throw new Error(`${part.topic}: ${demo}/${id} has no source`);
        placed.set(`${demo}/${id}`, (placed.get(`${demo}/${id}`) ?? 0) + 1);
    }
    if (part.items.length * THEMES.length > MAX_PAIRS) throw new Error(`${part.topic}: ${part.items.length * THEMES.length} pairs, more than ${MAX_PAIRS}`);
}
for (const [key, n] of placed) if (n !== 1) throw new Error(`${key} is in ${n} parts`);

/** The look-at block of a section: one line per theme asked. @param {string} id @param {readonly string[]} themes */
function lookBlock(id, themes) {
    const kind = id.endsWith('-states') ? 'states' : 'main';
    return `<div data-review-look>\n${themes.map((t) => `<p data-for="${t}">${escapeHtml(LOOK[t][kind])}</p>`).join('\n')}\n</div>`;
}

/**
 * A section ready for its page: its look-at lines for the themes asked, its themes when it is asked in fewer than all, its
 * topic's title when the section that carried it left the page, and what changed since the last review.
 * @param {string} text a section @param {string} id
 * @param {{ themes: readonly string[], title?: string, changed?: { changed: string, expect: string } }} how
 */
function ready(text, id, how) {
    const looks = text.match(/<div data-review-look>[\s\S]*?<\/div>/g) ?? [];
    if (looks.length !== 1) throw new Error(`${id}: ${looks.length} look-at blocks`);
    if (/<div[\s\S]*<div data-review-look>/.test(looks[0])) throw new Error(`${id}: look-at block is nested`);
    text = text.replace(looks[0], lookBlock(id, how.themes));
    const extra = [
        how.themes.length < THEMES.length ? ` data-review-themes="${how.themes.join(',')}"` : '',
        how.title && !/data-review-topic-title="/.test(text) ? ` data-review-topic-title="${how.title}"` : '',
    ].join('');
    if (extra) text = text.replace(/(data-review-item="[^"]*")/, `$1${extra}`);
    if (how.changed) {
        // What changed, on the page, before the Expected block; and the change as one more Expected bullet.
        const expected = /<div class="[a-z0-9]+-expect(?:ed)?">/.exec(text);
        if (!expected) throw new Error(`${id}: no Expected block`);
        const box = `<div class="k56-changed"><p><b>What changed since your last review:</b> ${how.changed.changed}</p></div>\n`;
        text = text.slice(0, expected.index) + box + text.slice(expected.index);
        const close = text.indexOf('</ul>', text.indexOf(expected[0]));
        if (close < 0) throw new Error(`${id}: Expected block has no list`);
        text = `${text.slice(0, close)}<li><b>Changed:</b> ${how.changed.expect}</li>\n${text.slice(close)}`;
    }
    // Every control group names the component it drives and stands at it in the dialog (Kenny, 2026-10-18 07:09).
    return declareControls(text, id);
}

const TEMPLATE_HEAD = (/** @type {string} */ id, /** @type {string} */ title, /** @type {string[]} */ styles, /** @type {readonly string[]} */ themes) => `<!doctype html>
<html lang="en" data-theme="formal" data-review="${id}" data-review-themes="${themes.join(',')}">
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
${styles.map((s) => `        <link rel="stylesheet" href="${s}" />`).join('\n')}
    </head>
`;

const problems = /** @type {string[]} */ ([]);
for (const [i, part] of PARTS.entries()) {
    const id = `kpadopt56-${part.topic}`;
    const dir = new URL(`../${id}/`, here);
    if (!existsSync(dir)) mkdirSync(dir);
    const verdictsFile = new URL('VERDICTS.json', dir);
    if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: id, rounds: [] }, null, 4)}\n`);
    const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
    const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
    // A page round id never collides and is never reused (Kenny, 2026-10-17): the page keeps the id it has while that
    // round is not received, else it takes a fresh UUID.
    const out = fileURLToPath(new URL('demo.html', dir));
    const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
    const roundId = current && !received.includes(current) && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${part.topic}-${randomUUID()}`;

    // A later round asks only the pairs Kenny has not approved (DEMO_RULES ch. 6, gates/check-rereview.mjs): the latest round
    // naming a pair wins, and an `allJudged` round approved every pair of its page it does not list as not approved.
    /** @type {Map<string, 'approved' | 'not approved'>} */
    const latest = new Map();
    for (const round of verdicts.rounds ?? []) {
        if (round.allJudged) for (const [, item] of part.items) for (const t of THEMES) latest.set(`${t}|${item}`, 'approved');
        for (const p of round.approved ?? []) latest.set(`${p.theme}|${p.item}`, 'approved');
        for (const p of round.notApproved ?? []) latest.set(`${p.theme}|${p.item}`, 'not approved');
    }
    const shown = part.items
        .map(([demo, item]) => ({ demo, item, themes: THEMES.filter((t) => latest.get(`${t}|${item}`) !== 'approved') }))
        .filter((s) => s.themes.length);
    if (!shown.length) {
        // Every pair approved: the part is decided and archived; its last page stays as Kenny judged it.
        console.log(`${id}: every pair approved, page left as it is`);
        continue;
    }
    const sourceOf = (/** @type {keyof typeof DEMOS} */ d, /** @type {string} */ item) =>
        /** @type {{ text: string }} */ (sections.get(d)?.find((s) => s.id === item)).text;
    const topicOf = (/** @type {string} */ text) => /data-review-topic="([^"]+)"/.exec(text)?.[1];
    // A topic's title rides on its first section shown, also when the section that carried it was approved and left.
    const titleOf = (/** @type {string | undefined} */ topic) =>
        part.items.map(([d, item]) => sourceOf(d, item)).find((text) => topicOf(text) === topic && /data-review-topic-title="/.test(text))
            ?.match(/data-review-topic-title="([^"]*)"/)?.[1];
    const pageThemes = THEMES.filter((t) => shown.some((s) => s.themes.includes(t)));
    const pairs = shown.reduce((n, s) => n + s.themes.length, 0);
    const demos = [...new Set(shown.map((s) => s.demo))];
    const body = shown
        .map((s, n) => {
            const text = sourceOf(s.demo, s.item);
            const topic = topicOf(text);
            const first = shown.findIndex((o) => topicOf(sourceOf(o.demo, o.item)) === topic) === n;
            return ready(text, s.item, { themes: s.themes, title: first ? titleOf(topic) : undefined, changed: CHANGED[`${part.topic}/${s.item}`] });
        })
        .join('\n\n');
    // A part page holds ONLY the sections it asks (Kenny, 2026-10-18 07:11): no laid-aside sections of the other
    // components of its demos, so no foreign control group or content can reach the review dialog. The demos' scripts
    // tolerate a section that is not on the page.

    // Checks on the page: no id twice (two demos' sections), every hook wired.
    const whole = body;
    const seen = new Map();
    for (const m of whole.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
    for (const [k, n] of seen) if (n > 1) problems.push(`${id}: the id "${k}" stands ${n} times`);
    for (const topic of new Set([...body.matchAll(/data-review-topic="([^"]+)"/g)].map((m) => m[1]))) {
        const first = body.split(/(?=<section\b)/).find((s) => s.includes(`data-review-topic="${topic}"`)) ?? '';
        if (!/data-review-topic-title="/.test(first)) problems.push(`${id}: the first section of topic "${topic}" carries no data-review-topic-title`);
    }

    const styles = ['../kpadopt56/part.css', ...demos.map((d) => `../kpadopt56/src/${d}/page.css`)];
    const autoFirst = demos.filter((d) => DEMOS[d].autoFirst);
    const demoFirst = demos.filter((d) => !DEMOS[d].autoFirst);
    const script = (/** @type {string} */ d) => `        <script type="module" src="../kpadopt56/src/${d}/demo.js"></script>`;
    const title = `kpadopt5 and 6 in the other themes, part ${i + 1} of ${PARTS.length}: ${part.title}`;
    const intro = `            <header class="k56-intro">
                <h1>The fifth and sixth adoption rounds, part ${i + 1} of ${PARTS.length}: ${escapeHtml(part.title)}</h1>
                <p class="cat-intro">
                    ${
                        received.length
                            ? `This round asks only the ${pairs} pair${pairs === 1 ? '' : 's'} you did not approve in your last review (${shown.length} section${shown.length === 1 ? '' : 's'}); each says under <b>What changed since your last review</b> what was done about your words. `
                            : ''
                    }Formal is approved. ${escapeHtml(part.summary)} ${received.length ? 'The first round asked' : 'This part asks'} the eleven other themes for ${part.items.length} sections (${part.items.length * THEMES.length}
                    pairs), one theme per step in the review dialog. The sections were approved in formal in several rounds; each is shown here in
                    its latest version, with the defaults you chose.
                </p>
                <p>
                    Every section says under <b>Expected</b> what you should see and what each control does (written for formal; the line under
                    &ldquo;What to look at&rdquo; says what is the theme&rsquo;s own).
                </p>
            </header>
`;
    const page = `${TEMPLATE_HEAD(id, title, styles, pageThemes)}    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
${intro}
${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
${demoFirst.map(script).join('\n')}${demoFirst.length ? '\n' : ''}        <script type="module" src="../../js/auto.js"></script>
${autoFirst.map(script).join('\n')}${autoFirst.length ? '\n' : ''}        <script type="module" src="../_review/review.js"></script>
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
        throw new Error(`${id}: prettier cannot read the page (kept as ${out}.unformatted): ${/** @type {Error} */ (error).message.split('\n')[0]}`);
    }
    const readme = new URL('README.md', dir);
    if (!existsSync(readme))
        writeFileSync(
            readme,
            `# research/${id}: the fifth and sixth adoption rounds in the other themes, part ${i + 1} of ${PARTS.length}\n\n` +
                `${part.title}, in the eleven themes other than formal (${THEMES.join(', ')}): ${part.items.map(([, s]) => s).join(', ')}. ` +
                `${part.items.length} sections, ${part.items.length * THEMES.length} pairs.\n\n` +
                `**Generated** from [research/kpadopt56/src](../kpadopt56/src/) by \`node research/kpadopt56/build-parts.mjs\`; edit the source, ` +
                `never this page. Formal is decided and is not asked again. Every section is its latest version from the formal rounds ` +
                `(research/kpadopt56/src/SOURCES.json says which commit), with Kenny's defaults of 2026-10-17 and 2026-10-18; the choice sets ` +
                `of the formal reviews are not asked again, because a default belongs to the component, not to a theme. Split off on Kenny's ` +
                `rule of 2026-10-17: a review asks at most 100 pairs, so the 79 sections are grouped by kind of component.\n`,
        );
    console.log(`${id}: ${shown.length} sections, ${pairs} pairs, round ${roundId}`);
}
if (problems.length) {
    console.error(`build-parts: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}
