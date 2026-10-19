// Builds research/focus-tracks-1019/demo.html: cook mode with parallel tracks (Kenny's AuDHD recipes: "ondersteuning om verschillende
// stappen gelijktijdig te doen, bv de pasta koken terwijl we met de saus bezig zijn"). It changes an approved component
// (research/audhd-recepten/cook), so it comes back through the review dialog with a plain "What changed" text (DEMO_RULES ch. 7 and 9).
// Formal only (the lanes use the theme's own buttons, bar and plates); each option is a component option with a default.
//
//   1. tracks      the composition: the step on 2fr, the lanes on 1fr; switching, Back/Next per track
//   2. waiting     a step that waits for another (waitFor), with the time left and the button to the track that can go on
//   3. attention   a timer ends on another track: the band above the step (js/attention.js)
//   4. finished    a track with no step left: the plate offers the track that can use you
//   5. phone       the lanes above the step on a 390 px screen
//   6. states      loading, no steps and failed as full plates with a Retry
//
// Run: node research/focus-tracks-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'focus-tracks-1019';
const THEMES = ['formal'];

/** One look-at line per theme asked. @param {string} text */
const looks = (text) => THEMES.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/** A group of state buttons: `opt` names what it drives, the first value is pressed. @param {string} label @param {string} opt @param {[string, string][]} buttons */
const group = (label, opt, buttons) =>
    `<div role="group" aria-label="${label}"><b>${label}:</b>\n${buttons
        .map(
            ([value, text], i) =>
                `<button type="button" class="kp-button kp-button--sm" data-opt="${opt}" data-value="${value}" aria-pressed="${i === 0}">${text}</button>`,
        )
        .join('\n')}\n</div>`;

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, components: string, controls: string, body: string, choices?: unknown[] }} s
 */
const section = (s) => `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-topic="${s.id}"
    data-review-topic-title="${s.title}"
    data-review-themes="formal"${s.choices ? `\n    data-review-choices='${JSON.stringify(s.choices).replaceAll("'", '&#39;')}'` : ''}
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
    <div data-review-controls data-review-controls-for="${s.id}-component">
${s.controls}
    </div>
${s.body}
</section>`;

/** The cook-mode component and the timer list it runs its timers in. @param {string} prefix @param {string} extra attributes of the focus-steps root */
const cook = (prefix, extra = '') => `
<div class="ft-stage" id="${prefix}-component">
    <div class="ft-stage__steps">
        <div class="kp-focus-steps" data-kp-focus-steps data-kp-focus-steps-timers="${prefix}-timers" data-kp-state="loading" id="${prefix}-steps"
             aria-label="Spaghetti with tomato sauce and meatballs" data-kp-focus-steps-empty="This recipe has no steps yet." ${extra}></div>
    </div>
    <div class="ft-stage__timers">
        <h3 class="ft-part">Timers running</h3>
        <p class="ft-note">Every timer you start stays here, whatever track you are on. <span data-ft-speed-line>Demo clock: fast, 1 minute lasts 3 seconds.</span></p>
        <div class="kp-timers" data-kp-timers id="${prefix}-timers" aria-label="Kitchen timers" data-kp-timers-empty="No timer running. Start one from a step."></div>
    </div>
</div>`;

const SPEED = group('Timers', 'speed', [['fast', 'Fast'], ['real', 'Real time']]);

const sections = [
    section({
        id: 'tracks',
        title: 'Cook mode with tracks: pasta and sauce side by side',
        intro: 'The spaghetti recipe in three tracks. The step of the track you are on is large; every track stands in a lane beside it with its place, what it is doing and its clock.',
        changed:
            'Cook mode had one line of steps, so cooking the pasta while the sauce was made meant remembering which timer belonged to which step. Now a step can belong to a track (Pasta, Sauce). The lanes show every track at once, one tap switches, and Back and Next move only the track you are on.',
        expect: [
            'Beside the step stand three lanes, <b>Pasta</b>, <b>Sauce</b> and <b>Together</b>. The lane you are on has a coloured edge; each lane says <b>Step 1 of 3</b> and what it is doing.',
            'Press <b>Start a timer</b> on <b>Boil the water</b>, then <b>Next</b>: the Pasta lane keeps the clock running and says it is waiting. Tap <b>Sauce</b> (or press <b>T</b>): the sauce steps appear, large, where the Sauce track stood.',
            'Back and Next move only the track you are on. <b>Together</b> stays locked until Pasta and Sauce are finished.',
            'The clocks of the lanes stand in one column and do not jump while they count; the bar under each lane is that track&rsquo;s own place.',
            'The three buttons under <b>Lanes</b> and <b>Detail</b> are options of the component: they change the lanes at once.',
        ],
        look: 'the active lane has a primary edge, the three lanes share one height, their clocks line up in one column, and nothing is cut or touches an edge.',
        components: 'focus-steps timer',
        choices: [
            { id: 'lanes', label: 'Where the lanes stand', default: 'auto', options: [{ value: 'auto', label: 'Beside the step when there is room' }, { value: 'side', label: 'Always beside the step' }, { value: 'top', label: 'Always above the step' }] },
            { id: 'detail', label: 'What a lane says', default: 'full', options: [{ value: 'full', label: 'Words, clock and place' }, { value: 'compact', label: 'Words and clock' }] },
        ],
        controls: [
            group('Lanes', 'lanes', [['auto', 'Auto'], ['side', 'Beside'], ['top', 'Above']]),
            group('Detail', 'detail', [['full', 'Full'], ['compact', 'Compact']]),
            SPEED,
            `<div role="group" aria-label="Start again"><b>Recipe:</b>\n<button type="button" class="kp-button kp-button--sm" data-act="restart" data-value="tracks">Start again</button></div>`,
        ].join('\n'),
        body: cook('tracks'),
    }),
    section({
        id: 'waiting',
        title: 'A step that waits for another',
        intro: 'Adding the spaghetti must wait until the water boils. The step says what it waits for and how long, and offers the track that can go on.',
        changed:
            'A step could not depend on another: nothing stopped you from adding the pasta before the water had boiled, and nothing said what to do meanwhile. Now a step can wait for another step or a whole track, and the wait is shown instead of the step&rsquo;s buttons.',
        expect: [
            'Press <b>Put the water on</b>: the timer starts and Next moves on to <b>Cook the spaghetti</b>, which waits. It shows <b>Waiting for Boil the water</b> with the time left counting down, and Next is off.',
            '<b>Go to Sauce</b> takes you to the sauce at once; the Pasta lane says <b>Waiting for Boil the water</b> and keeps the clock.',
            'When the water&rsquo;s time is up the step opens by itself (the sentence changes to the step and Next works).',
            'The option <b>When a track waits</b> decides whether the page offers the other track (Suggest, the default) or goes there by itself (Switch).',
        ],
        look: 'the waiting step keeps its sentence readable, the plate names what it waits for with the clock in figures that do not jump, and the button to the other track is as large as the other buttons.',
        components: 'focus-steps',
        choices: [{ id: 'follow', label: 'When a track waits or is finished', default: 'suggest', options: [{ value: 'suggest', label: 'Offer the track that can go on' }, { value: 'auto', label: 'Go to it by itself' }] }],
        controls: [
            `<div role="group" aria-label="Scenario"><b>Scenario:</b>\n<button type="button" class="kp-button kp-button--sm" data-act="water-on" data-value="waiting">Put the water on</button></div>`,
            group('When a track waits', 'follow', [['suggest', 'Offer'], ['auto', 'Switch']]),
            SPEED,
            `<div role="group" aria-label="Start again"><b>Recipe:</b>\n<button type="button" class="kp-button kp-button--sm" data-act="restart" data-value="waiting">Start again</button></div>`,
        ].join('\n'),
        body: cook('waiting'),
    }),
    section({
        id: 'attention',
        title: 'A timer ends on a track you are not on',
        intro: 'The sauce simmers while you cook the pasta. When its timer ends, the band above the step names the track and gives the button that goes there.',
        changed:
            'A timer that ended only turned its own card into a done plate in the timer list; if you looked at the step, you did not see it. Now the track whose timer ended asks for you on the attention band above the step, and its lane turns to a warning plate.',
        expect: [
            'Press <b>Simmer the sauce, go to Pasta</b>: the sauce timer starts (about 8 seconds) and the Pasta track opens.',
            'When it ends, the band above the step says <b>Simmer is done (Sauce)</b> with <b>Next: Warm the meatballs</b> and a <b>Go to Sauce</b> button; the Sauce lane turns to a warning plate that says <b>Time is up</b>.',
            '<b>Go to Sauce</b> clears the band and the plate and shows the sauce step. The timer card in the list keeps ringing until you stop it there.',
            'The option <b>The band</b> turns the band off; the lane still says <b>Time is up</b>.',
        ],
        look: 'the band is the package&rsquo;s own attention band, worst first, with its fix button in one fixed place, and the ringing lane is a warning plate with its words, not only a colour.',
        components: 'focus-steps attention',
        choices: [{ id: 'band', label: 'The band above the step', default: 'on', options: [{ value: 'on', label: 'Show it' }, { value: 'off', label: 'Leave it out' }] }],
        controls: [
            `<div role="group" aria-label="Scenario"><b>Scenario:</b>\n<button type="button" class="kp-button kp-button--sm" data-act="simmer-on" data-value="attention">Simmer the sauce, go to Pasta</button></div>`,
            group('The band', 'band', [['on', 'On'], ['off', 'Off']]),
            `<div role="group" aria-label="Start again"><b>Recipe:</b>\n<button type="button" class="kp-button kp-button--sm" data-act="restart" data-value="attention">Start again</button></div>`,
        ].join('\n'),
        body: cook('attention', 'data-ft-factor="75"'),
    }),
    section({
        id: 'finished',
        title: 'A track with no step left',
        intro: 'The pasta track is finished. The step area says so and offers the track that can use you, instead of a dead end.',
        changed:
            'There was one end, the last step. With tracks, one track finishes while the others go on, so a finished track needs a place to say so and a way on.',
        expect: [
            'The Pasta track is already through its three steps: a plate in the size of the step says <b>Pasta is done</b>, <b>Sauce is ready for you.</b> and has the button <b>Go to Sauce</b>.',
            '<b>Back</b> gives the last step of Pasta again, to do it again; <b>Done</b> is off while the track has nothing left.',
            'The Pasta lane says <b>Done</b> with a tick and a full bar; <b>Together</b> still waits for Sauce.',
        ],
        look: 'the plate fills the step area, centred, at heading size, with a normal-size button, and the Done lane keeps the height of the others.',
        components: 'focus-steps',
        controls: `<div role="group" aria-label="Start again"><b>Recipe:</b>\n<button type="button" class="kp-button kp-button--sm" data-act="restart" data-value="finished">Start again</button></div>`,
        body: cook('finished'),
    }),
    section({
        id: 'phone',
        title: 'On a phone: the lanes above the step',
        intro: 'The same recipe on a 390 px screen. The lanes become short rows between the head and the step; the step keeps the room.',
        changed: 'Cook mode on a phone had no room for a second line of work. The lanes now stand as short rows above the step, each with its words and clock, and a tap switches.',
        expect: [
            'Three short lanes one under the other: name, words, clock and bar, each tall enough for a finger.',
            'Tap <b>Sauce</b>: the step changes, the lane you are on has the coloured edge, Back and Next stay at the foot.',
            'Nothing is cut with an ellipsis or breaks per letter; long words wrap.',
        ],
        look: 'the lanes share one height and one grid of columns, the step is large under them, and the buttons at the foot keep their place.',
        components: 'focus-steps timer',
        controls: [group('Detail', 'detail', [['full', 'Full'], ['compact', 'Compact']]), SPEED].join('\n'),
        body: `<div class="ft-phone" id="phone-component">
    <div class="kp-focus-steps" data-kp-focus-steps data-kp-focus-steps-timers="phone-timers" data-kp-state="loading" id="phone-steps" aria-label="Spaghetti with tomato sauce and meatballs"></div>
    <p class="ft-note" data-ft-speed-line>Demo clock: fast, 1 minute lasts 3 seconds.</p>
    <div class="kp-timers" data-kp-timers id="phone-timers" aria-label="Kitchen timers" data-kp-timers-empty="No timer running. Start one from a step."></div>
</div>`,
    }),
    section({
        id: 'states',
        title: 'Loading, no steps and failed',
        intro: 'The recipe loading, with no steps, and not loadable. Each state fills the whole size of the component, with a normal-size Retry.',
        changed:
            'Cook mode drew its empty and failed states as a small line; the check-in beside it already used a full plate. Now both use the same plate, centred at heading size with a normal button, and loading shows the busy card over the whole step area.',
        expect: [
            'Press <b>Loading</b>: the busy card stands centred over the step area; the lanes are not drawn while there is nothing to show.',
            '<b>No steps</b> and <b>Failed</b> fill the step area with a plate at heading size; <b>Retry</b> on the failed plate loads the recipe again.',
            'The component keeps its height in every state: nothing around it moves.',
        ],
        look: 'the plate is as tall as the loaded step area, its words are centred, and the Retry button is the size of the Next button.',
        components: 'focus-steps',
        controls: group('State', 'state', [['ready', 'Ready'], ['loading', 'Loading'], ['empty', 'No steps'], ['error', 'Failed']]),
        body: cook('states'),
    }),
];

const body = sections.join('\n');
const pairs = sections.length * THEMES.length;

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^focustracks-[0-9a-f]{8}-/.test(current) ? current : `focustracks-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cook mode with tracks: pasta and sauce at the same time</title>
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
                <h1>Cook mode with tracks</h1>
                <p class="cat-intro">
                    You asked to cook the pasta while the sauce is made. A step can now belong to a track; the step of the track you are on stays
                    large and every track stands in a lane with its place and its clock. ${sections.length} sections, ${pairs} pairs (formal only: the
                    lanes use the theme&rsquo;s own buttons, bar and plates). Every option here only asks for its default. The recipe and the
                    clock are mock data: the timers run about 20 times fast so a minute lasts 3 seconds.
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
