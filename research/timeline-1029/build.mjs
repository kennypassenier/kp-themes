// Builds research/timeline-1029/demo.html: the editable multi-track sequencer (js/sequencer.js, Kenny 2026-10-29: "Echt onderdeel"), as ONE
// review page (DEMO_RULES ch. 1 and 6: one page, formal only, one section per capability, at most 25 items). Every section is written here once, in
// the shape research/wishes-1028 uses: what is asked, the heading and one sentence, what to expect, what to look at in formal, the controls above the
// component, and the component. demo.js wires them by their own elements; page.css is the frame. The data is Kitchen's: one recipe's steps in its
// own shape (track, mins, start, with; docs/agent/DATA.md), laid out in lanes. Run: node research/timeline-1029/build.mjs (the page keeps its round
// id until the verdict is recorded).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'timeline-1029';
const THEMES = ['formal'];
const MAX_ITEMS = 25;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]; a `momentary` group is a set of actions, not a choice. */
const group = (label, name, buttons, momentary = false) =>
    `<div role="group" aria-label="${label}">${buttons
        .map(([value, words, on]) => `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${momentary ? ' data-pg-momentary' : ` aria-pressed="${on ? 'true' : 'false'}"`}>${words}</button>`)
        .join('')}</div>`;

/** The sequencer's host, loading from the first frame; demo.js hands it Kitchen's steps. */
const host = (id, label, attrs = '') =>
    `<section class="kp-gantt kp-sequencer" id="${id}" data-kp-sequencer data-kp-state="loading" data-kp-sequencer-ghosts="2 2" ${attrs} aria-label="${label}"></section>`;

/** @type {{ id: string, title: string, topic: string, topicTitle?: string, asked: string, h2: string, intro: string, expected: string[], look: string, controls: string, component: string }[]} */
const SECTIONS = [
    {
        id: 'drag-resize',
        title: 'Drag a step and resize it, with snap',
        topic: 'sequencer',
        topicTitle: 'Editable sequencer',
        asked:
            'Kenny wants to lay out a recipe’s steps like clips in a video editor: drag a bar along the time axis, drag either edge to resize it, everything snapping to a step the app sets (1 minute by default) and to the edges of other steps.',
        h2: 'Spaghetti bolognese, steps in time',
        intro:
            'Kitchen’s recipe in two lanes. Drag a step, drag its left or right edge. A chip follows the drag and a line shows the edge it snaps to. Under the sequencer: what Kitchen would save.',
        expected: [
            '<b>Drag</b> a step sideways: it moves in whole steps (1 minute); drag near another step’s edge and a thin line appears where it snaps. Drag an <b>edge</b>: the step gets shorter or longer. <b>Escape</b> during a drag puts it back. The <b>Total</b> in the toolbar follows the end of the last step.',
            '<b>Snap</b> sets the step (1, 5 or 15 minutes). <b>Snap to edges off</b> leaves only the grid. <b>Unit</b> counts the same plan in seconds, minutes or hours: the axis, the chip and the total speak that unit, and the numbers Kitchen would save stay minutes.',
        ],
        look: 'The bars are the run timeline’s own: solid, a colour per lane, the label inside when it fits and beside the bar when it does not. The grips at the two edges show on hover. Nothing under the pointer is redrawn while dragging.',
        controls:
            group('Snap step', 'dr-snap', [['1', '1 min', true], ['5', '5 min'], ['15', '15 min']]) +
            group('Snap to other steps', 'dr-edges', [['on', 'Edges on', true], ['off', 'Edges off']]) +
            group('Unit', 'dr-unit', [['minute', 'Minutes', true], ['hour', 'Hours'], ['second', 'Seconds']]),
        component: `<div class="kp-card pg-card">${host('tl-drag', 'Spaghetti bolognese, steps in time')}
            <p class="pg-log" id="tl-drag-log" role="status"></p></div>`,
    },
    {
        id: 'lanes',
        title: 'Move a step between lanes',
        topic: 'sequencer',
        asked: 'A step can be dragged from one lane (track) to another, and the lanes are the app’s: a recipe has Sauce and Pasta, a bigger one an Oven too.',
        h2: 'Sauce, pasta and the oven',
        intro: 'Drag a step up or down onto another lane; it keeps its place in time unless you move it sideways too. Where a lane is taken, the step goes back.',
        expected: [
            '<b>Items change lane</b> (the default): drag “Boil the water” up to Sauce, where there is room, and it lands there. Drop it on a step that is in the way and it goes back, with a chip saying so.',
            '<b>Items stay in their lane</b> pins every step to its row: only sideways moves work. <b>Three lanes</b> adds the Oven with “Warm the plates”, so a third row exists to drag to.',
        ],
        look: 'Lanes keep their height and their name column while a bar crosses them; the bar being dragged lies over the lanes, raised, and the lane it would land in is the one under the pointer.',
        controls:
            group('Lanes', 'ln-move', [['move', 'Items change lane', true], ['fixed', 'Items stay in their lane']]) +
            group('Lanes shown', 'ln-count', [['two', 'Two lanes', true], ['three', 'Three lanes (Oven)']]),
        component: `<div class="kp-card pg-card">${host('tl-lanes', 'Lanes of a recipe')}
            <p class="pg-log" id="tl-lanes-log" role="status"></p></div>`,
    },
    {
        id: 'keyboard',
        title: 'Everything with the keyboard, announced',
        topic: 'sequencer',
        asked: 'Keyboard for all of it: arrows move by the step, Shift and arrows resize, Alt and Up or Down change lane, Enter drops, Escape puts back; announced to screen readers.',
        h2: 'Pick a step up, move it, drop it',
        intro:
            'Tab into the sequencer, use the arrows to reach a step, press Enter to pick it up. The buttons press the keys for you; the line under the sequencer is what a screen reader hears.',
        expected: [
            '<b>Pick up</b> a step (Enter): its bar turns dashed. <b>Earlier</b> and <b>Later</b> (← →) move it by the step, <b>Shorter</b> and <b>Longer</b> (Shift and ← →) resize its end, <b>Lane up</b> and <b>Lane down</b> (Alt and ↑ ↓) change lane; the line says where it is after every press.',
            'Pushing into a neighbour says why it cannot (“cannot go there: it would overlap …”), <b>Drop</b> (Enter) keeps the change and says so, <b>Put back</b> (Escape) restores it. <b>Overlap push</b> lets the keys push neighbours later instead of refusing.',
        ],
        look: 'The picked-up bar is dashed (not a colour change), the focus ring is clear of its edge, and the line under the sequencer holds the announcement in a fixed place that does not move the page.',
        controls:
            group('Pick up', 'kb-pick', [['cook', 'Cook the spaghetti', true], ['plate', 'Drain and plate'], ['chop', 'Chop the vegetables']]) +
            group('Move and resize', 'kb-key', [['ArrowLeft', 'Earlier (←)'], ['ArrowRight', 'Later (→)'], ['shift+ArrowLeft', 'Shorter (Shift ←)'], ['shift+ArrowRight', 'Longer (Shift →)']], true) +
            group('Lane and finish', 'kb-end', [['alt+ArrowUp', 'Lane up (Alt ↑)'], ['alt+ArrowDown', 'Lane down (Alt ↓)'], ['Enter', 'Drop (Enter)'], ['Escape', 'Put back (Esc)']], true) +
            group('Overlap rule', 'kb-overlap', [['refuse', 'Refuse', true], ['push', 'Push']]),
        component: `<div class="kp-card pg-card">${host('tl-keys', 'Spaghetti bolognese, keyboard editing')}
            <p class="pg-log pg-log--heard" id="tl-keys-log"><b>A screen reader hears:</b> <span id="tl-keys-heard">Press Enter on a step to pick it up.</span></p></div>`,
    },
    {
        id: 'linked',
        title: 'Steps that run alongside move together',
        topic: 'sequencer',
        asked: '“Runs alongside”: a step can be linked to start with another (a visible join), and moving one moves the linked.',
        h2: 'Boil the water while the mince browns',
        intro:
            '“Boil the water” runs alongside “Brown the mince”: a dotted line joins them. Move one and the other goes with it. This section pushes neighbours later, so the pair has room to move.',
        expected: [
            '<b>Browning 5 min later</b> (or <b>10</b>) moves the boiling too, and pushes “Simmer” and “Season” later in the Sauce lane. The join follows both bars; <b>Reset the plan</b> puts the steps back.',
            '<b>Cook alongside the simmer</b> links “Cook the spaghetti” to “Simmer with the tomatoes”: it jumps to the simmer’s start and a second join appears. <b>Cook on its own</b> cuts the link and leaves it where it is. Select a step and the buttons under the sequencer do the same (L and U on the keyboard).',
        ],
        look: 'The join is a dotted line with a dot at each end, drawn at the shared start from one bar’s middle to the other’s; it is never the only sign (the selection line says “runs alongside …” too).',
        controls:
            group('Move browning', 'lk-move', [['5', 'Browning 5 min later'], ['10', 'Browning 10 min later']], true) +
            group('Cook the spaghetti', 'lk-link', [['link', 'Cook alongside the simmer'], ['unlink', 'Cook on its own']], true) +
            group('Plan', 'lk-reset', [['reset', 'Reset the plan']], true),
        component: `<div class="kp-card pg-card">${host('tl-linked', 'Linked steps of a recipe', 'data-kp-sequencer-overlap="push"')}
            <p class="pg-log" id="tl-linked-log" role="status"></p></div>`,
    },
    {
        id: 'overlap',
        title: 'The overlap rule: refuse, push or allow',
        topic: 'sequencer',
        asked: 'Items in one lane may overlap only where the app allows it; otherwise they push or refuse.',
        h2: 'Cook the spaghetti into the plating',
        intro: 'Moving “Cook the spaghetti” 5 minutes later would put it on “Drain and plate”. What happens is the app’s rule, one attribute.',
        expected: [
            '<b>Refuse</b> (the default): the move does not happen and the line says what is in the way. <b>Push</b>: “Drain and plate” moves later by what it needs, and so does everything behind it. <b>Allow</b>: the two overlap and the lane grows a second row for the one underneath.',
            '<b>Move 5 minutes later</b> and <b>earlier</b> try it; <b>Reset the plan</b> puts Kitchen’s steps back as they were. The rule can change between moves.',
        ],
        look: 'Under Allow the lane gets exactly the rows it needs and the other lanes keep theirs; under Push the pushed bars glide to their new place and the total grows.',
        controls:
            group('Overlap', 'ov-rule', [['refuse', 'Refuse (default)', true], ['push', 'Push'], ['allow', 'Allow']]) +
            group('Try it', 'ov-try', [['later', 'Move cook 5 min later'], ['earlier', 'Move cook 5 min earlier'], ['reset', 'Reset the plan']], true),
        component: `<div class="kp-card pg-card">${host('tl-overlap', 'Overlap rule of a recipe')}
            <p class="pg-log" id="tl-overlap-log" role="status"></p></div>`,
    },
    {
        id: 'total-now',
        title: 'The total and the line for now',
        topic: 'sequencer',
        asked: 'A live total (the end of the last item) and a “now” line like the gantt.',
        h2: 'How long is dinner, and where are we',
        intro: 'The total is the end of the last step and follows every edit; the line for now is where the cook is in the plan, set by the page.',
        expected: [
            '<b>Now at 15 minutes</b> or <b>at 40</b> puts the red line there; <b>Advance 5 minutes</b> moves it on; <b>Off</b> removes it. The plan does not move; only the line does.',
            '<b>Add “Let the sauce rest”</b> appends a 10-minute step: the total grows from 61 to 71 minutes and a dashed line marks where the plan ends. <b>Remove it</b> brings it back to 61.',
        ],
        look: 'The now line is the gantt’s: a 2 px line through every lane, with its time as its accessible name. The end of the plan is a dashed line; the total reads in the toolbar at the right.',
        controls:
            group('Now', 'tn-now', [['off', 'Off', true], ['15', 'Now at 15 min'], ['40', 'Now at 40 min'], ['advance', 'Advance 5 min']]) +
            group('Plan', 'tn-plan', [['add', 'Add “Let the sauce rest”'], ['remove', 'Remove it']], true),
        component: `<div class="kp-card pg-card">${host('tl-total', 'Total and now of a recipe')}
            <p class="pg-log" id="tl-total-log" role="status"></p></div>`,
    },
    {
        id: 'events',
        title: 'The events a page hears',
        topic: 'sequencer',
        asked: 'Events kp-sequencer-change with, per item, {id, lane, start, duration, with} in minutes, and a programmatic set and get.',
        h2: 'What Kitchen is told',
        intro: 'Every edit that is dropped fires <code>kp-sequencer-change</code> with the whole plan; a refused one fires <code>kp-sequencer-refuse</code>; selecting fires <code>kp-sequencer-select</code>. The log is what a page receives.',
        expected: [
            '<b>Move a step</b> (a change with <code>changed</code> naming it), <b>Try an overlap</b> (a refusal naming what is in the way) and <b>Select a step</b> each add a line; dragging in the sequencer does too. A drag that is put back with Escape adds nothing.',
            '<b>Read it back</b> calls <code>getSequencerItems</code> and lists what the page would save; <b>Clear the log</b> empties the list.',
        ],
        look: 'The log keeps a fixed height and its lines line up in the same columns; the component above it is as wide as the column.',
        controls:
            group('Cause an event', 'ev-cause', [['move', 'Move a step'], ['refuse', 'Try an overlap'], ['select', 'Select a step'], ['read', 'Read it back']], true) +
            group('Log', 'ev-log', [['clear', 'Clear the log']], true),
        component: `<div class="kp-card pg-card">${host('tl-events', 'Events of a recipe')}
            <ol class="pg-events" id="tl-events-log" aria-label="Events received"></ol></div>`,
    },
    {
        id: 'phone',
        title: 'On a phone: scroll inside the box, and zoom',
        topic: 'sequencer',
        asked: 'Phone width: horizontal scroll inside its own box, pinch or a zoom control.',
        h2: 'The plan in a narrow box',
        intro: 'A box you can narrow. The plot keeps a readable width and the frame scrolls sideways inside itself, the lane names held at the start. Zoom with the buttons, Ctrl and the wheel, or a pinch.',
        expected: [
            '<b>Tablet</b> and <b>Phone</b> narrow the box: the sequencer scrolls sideways inside its frame, no page scroll appears, the lane names stay in view. <b>Column</b> is the full width.',
            '<b>Zoom 200%</b> and <b>400%</b> widen the plot (the frame scrolls, the axis refines its labels); <b>Fit</b> returns; <b>50%</b> shows a whole long plan. <b>A long afternoon</b> triples the plan so there is something to scroll.',
        ],
        look: 'The axis stays on top, the name column does not scroll away, and a bar’s grips stay easy to hit (larger on a touch screen); nothing makes the page itself scroll sideways.',
        controls:
            group('Box', 'ph-width', [['column', 'Column', true], ['tablet', 'Tablet (34rem)'], ['phone', 'Phone (22rem)']]) +
            group('Zoom', 'ph-zoom', [['0.5', '50%'], ['1', 'Fit', true], ['2', '200%'], ['4', '400%']]) +
            group('Plan', 'ph-plan', [['short', 'The recipe', true], ['long', 'A long afternoon']]),
        component: `<div class="kp-card pg-card"><div class="pg-box" id="tl-phone-box">${host('tl-phone', 'Recipe plan on a phone')}</div>
            <p class="pg-log" id="tl-phone-log" role="status"></p></div>`,
    },
    {
        id: 'states',
        title: 'Loading, empty and failed',
        topic: 'sequencer',
        asked: 'The package’s loading, empty and failed states, filling the footprint.',
        h2: 'The sequencer while the recipe is read',
        intro: 'Loading is the theme’s busy card over the lanes, empty and failed fill the same box with the package’s plate. The box keeps its height.',
        expected: [
            '<b>Loading</b> lays the spinner and its words over the lanes, centred; <b>Empty</b> says there is nothing yet and <b>Failed</b> says why with <b>Retry</b>, which brings the plan back.',
            'Each state is as tall as the loaded sequencer: switch between them and the page under it does not move.',
        ],
        look: 'The state is centred in the whole frame, at heading size, with a normal-size Retry; the toolbar and the selection line keep their places.',
        controls: group('State', 'st-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]),
        component: `<div class="kp-card pg-card">${host('tl-states', 'Recipe plan states')}</div>`,
    },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s) => `<section id="${s.id}" data-review-item="${s.id}" data-review-topic="${s.topic}"${s.topicTitle ? ` data-review-topic-title="${s.topicTitle}"` : ''} data-review-components="${s.id}" data-review-title="${s.title}" aria-labelledby="h-${s.id}">
    <div class="pg-asked"><p><b>What is asked</b> (Kitchen): ${s.asked}</p></div>
    <div class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></div>
    <div class="pg-expected"><p><b>Expected:</b></p><ul>${s.expected.map((e) => `<li>${e}</li>`).join('')}</ul></div>
    <div data-review-look><p data-for="formal">${s.look}</p></div>
    <div data-review-controls data-review-controls-for="${s.id}-component">${s.controls}</div>
    <div id="${s.id}-component" class="pg-component">${s.component}</div>
</section>`;

const problems = [];
const ids = SECTIONS.map((s) => s.id);
for (const id of new Set(ids)) if (ids.filter((i) => i === id).length > 1) problems.push(`the item "${id}" stands twice`);
if (SECTIONS.length * THEMES.length > MAX_ITEMS) problems.push(`${SECTIONS.length * THEMES.length} items: more than ${MAX_ITEMS}`);
for (const s of SECTIONS) {
    const groups = (s.controls.match(/role="group"/g) ?? []).length;
    if (groups > 4) problems.push(`${s.id}: ${groups} control groups, at most four`);
}
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
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${ID}-${randomUUID()}`;

const title = 'An editable sequencer for a recipe’s steps';
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
                    Kitchen wants to lay out a recipe’s steps like clips in a video editor, so the package got a new part: lanes as rows, every step a bar
                    that is moved, resized and linked by pointer or keyboard. It looks like the run timeline on purpose (same bars, same theme answers). The data
                    is one real recipe in Kitchen’s own shape (track, minutes, start, runs alongside). Formal only; ${SECTIONS.length} sections, one per
                    capability, ${SECTIONS.length} pairs.
                </p>
                <p>Every section says under <b>Expected</b> what you should see and what each control does.</p>
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
console.log(`${ID}: ${SECTIONS.length} items, round ${roundId}`);
