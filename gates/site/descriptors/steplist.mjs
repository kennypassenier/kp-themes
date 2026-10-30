// Page descriptor for the "steplist" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const steplistDescriptor = {
        id: 'steplist',
        title: 'Step list',
        group: 'Feedback',
        classes: ['kp-steplist'],
        exports: [],
        intro: 'The steps of one run, live: an update, an import or a deploy as a list whose items are waiting, running, done, failed or skipped. `data-state` on each item is the source; js/steplist.js keeps the rest in step with it: the spinner on the running step, a hidden state word after each title, `aria-current="step"`, and a polite status region that announces a change.',
        whenToUse:
            'For a process with named stages that a person watches or comes back to. For one measured quantity use a progress bar; for a form split in pages use the wizard.',
        examples: [
            {
                title: 'An update in flight',
                why: 'Give every step a note, so one arriving later moves nothing. Change a step with `setStep(list, id, { state })`, or set `data-state` yourself: the script follows either.',
                markup: `
<ol class="kp-steplist" aria-label="Update progress">
<li class="kp-steplist__item" data-state="done" data-kp-step-id="pull"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Pull the images</span><span class="kp-steplist__note">Fetches what changed from the registry</span></span><time class="kp-steplist__time">4 s</time></li>
<li class="kp-steplist__item" data-state="running" data-kp-step-id="restart"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Restart the stack</span><span class="kp-steplist__note">Stops, then starts every container</span></span></li>
<li class="kp-steplist__item" data-state="pending" data-kp-step-id="check"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Check it answers</span><span class="kp-steplist__note">Waits for the health check</span></span></li>
</ol>
`,
            },
            {
                title: 'Built from rows, and run live',
                why: 'The five states in one list, built by `buildSteplist` from rows (an `id`, a `title`, a `note`, a `state`, a `time`) and then driven by `setStep`. Each step the button moves announces itself once in the status region, and `kp-steplist-step` fires on the list with `{ item, id, state, previous }`. The step ids are the `data-kp-step-id` the module writes.',
                markup: `
<div id="doc-steps" class="kp-stack"></div>
<button type="button" class="kp-button" id="doc-steps-run">Run it again</button>
`,
                script: `
import { buildSteplist, setStep, attachSteplists } from '@kp-soft/themes/js/steplist';

const host = document.getElementById('doc-steps');
const list = buildSteplist(
    [
        { id: 'pull', title: 'Pull the images', note: 'Fetches what changed', state: 'done', time: '4 s' },
        { id: 'stop', title: 'Stop the stack', note: 'Waits for the containers', state: 'done', time: '2 s' },
        { id: 'migrate', title: 'Migrate the data', note: 'Nothing to migrate', state: 'skipped' },
        { id: 'start', title: 'Start the stack', note: 'The disk was full', state: 'failed', time: '9 s' },
        { id: 'check', title: 'Check it answers', note: 'Waits for the health check', state: 'pending' },
    ],
    { label: 'Update progress' },
);
host.append(list);
attachSteplists(host);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
document.getElementById('doc-steps-run').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    for (const id of ['pull', 'stop', 'migrate', 'start', 'check']) setStep(list, id, { state: 'pending', time: '' });
    for (const id of ['pull', 'stop', 'start', 'check']) {
        setStep(list, id, { state: 'running' });
        await sleep(900);
        setStep(list, id, { state: 'done', time: '1 s' });
    }
    setStep(list, 'migrate', { state: 'skipped' });
    event.currentTarget.disabled = false;
});
`,
            },
            {
                title: 'A journey: where an application stands',
                why: 'The same list laid along one path. `current` is the step it stands at now, reached steps are `done`, a closed path ends with a `failed` step; `data-kp-tone` gives a step its own colour and the time column holds the date it was reached. Under 30rem of its own width the path turns to a column.',
                markup: `
<ol class="kp-steplist kp-steplist--journey" aria-label="Where the application stands">
<li class="kp-steplist__item" data-state="done" data-kp-tone="1"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Draft</span></span><time class="kp-steplist__time">28/09</time></li>
<li class="kp-steplist__item" data-state="done" data-kp-tone="2"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Sent</span></span><time class="kp-steplist__time">02/10</time></li>
<li class="kp-steplist__item" data-state="current" data-kp-tone="3"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Interview</span></span><time class="kp-steplist__time">09/10</time></li>
<li class="kp-steplist__item" data-state="pending"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Offer</span></span><time class="kp-steplist__time"></time></li>
</ol>
`,
            },
            {
                title: 'A journey built from rows, with its dated line under it',
                why: '`buildSteplist` takes a `tone` (1 to 5) per row, which becomes `data-kp-tone`, and a `time` that in a journey is the date the step was reached. Under the stepper stands `.kp-gantt--line` (the run timeline as one dated line, see there) with the moments that led there, so the path says where the application stands and the line says when each thing happened. A closed path ends with a `failed` step. A built list becomes a journey by adding `kp-steplist--journey` to it.',
                markup: `
<div class="kp-stack">
<div id="doc-journey"></div>
<div class="kp-gantt kp-gantt--line" data-kp-gantt data-kp-gantt-points aria-label="What happened when, Delta Freight" data-doc-journey-line></div>
</div>
`,
                script: `
import { buildSteplist, attachSteplists } from '@kp-soft/themes/js/steplist';
import { attachGantts, setGanttKinds, setGanttPoints } from '@kp-soft/themes/js/gantt';

const host = document.getElementById('doc-journey');
const journey = buildSteplist(
    [
        { id: 'draft', title: 'Draft', state: 'done', tone: 1, time: '12/09' },
        { id: 'sent', title: 'Sent', state: 'done', tone: 2, time: '14/09' },
        { id: 'screening', title: 'Screening call', state: 'done', tone: 3, time: '24/09' },
        { id: 'rejected', title: 'Rejected', state: 'failed', time: '30/09' },
    ],
    { label: 'Where the application at Delta Freight stands' },
);
journey.classList.add('kp-steplist--journey');
host.append(journey);
attachSteplists(host);

const DAY = 86_400_000;
const today = new Date();
today.setHours(10, 0, 0, 0);
const at = (days) => today.getTime() + days * DAY;
const line = document.querySelector('[data-doc-journey-line]');
attachGantts(line.parentElement);
setGanttKinds(line, [
    { kind: 'applied', label: 'applied', shape: 'dot', series: 2 },
    { kind: 'contact', label: 'contact', shape: 'diamond', series: 3 },
    { kind: 'mail', label: 'mail', shape: 'square', series: 1 },
]);
setGanttPoints(
    line,
    [
        { id: 'd1', lane: 'delta', at: at(-34), kind: 'applied', label: 'Applied' },
        { id: 'd2', lane: 'delta', at: at(-24), kind: 'contact', label: 'Screening call' },
        { id: 'd3', lane: 'delta', at: at(-16), kind: 'mail', label: 'Mail: rejected' },
    ],
    [{ id: 'delta', label: 'Delta Freight' }],
);
`,
            },
        ],
        variants: [
            { name: 'data-state', what: '`pending`, `running`, `done`, `failed`, `skipped` or `current` (the step a journey stands at now: a ring with a dot, no spinner): the mark, the colour and the word follow it.' },
            { name: '.kp-steplist--journey', what: 'The steps side by side on one path, joined by a rule drawn in the step’s colour once reached; a column under 30rem of its own width.' },
            { name: 'data-kp-tone', what: 'A step’s own colour, `1` to `5` (`--chart-N`), or any value with the page’s own step colour set on the item: the reached mark and the rule into it wear it.' },
            { name: '.kp-steplist__time', what: 'How long the step took, as the page prints it; in a journey, the date it was reached.' },
            { name: '.kp-steplist__note', what: 'The one-line description under the title.' },
            { name: 'buildSteplist(rows, { label })', what: 'Builds the `ol` from rows `{ id, title, note, state, time }`; attach it afterwards. `data-kp-step-id` carries each id.' },
            { name: 'setStep(list, id, change)', what: 'Changes one step (`state`, `title`, `note`, `time`) and says so once in the status region; the id is `data-kp-step-id` or the step’s index.' },
            { name: 'the mark', what: 'Drawn from `data-state`: the theme’s spinner while running, and a glyph for done, failed and skipped (the glyph tokens are in the knobs). It is never the only carrier: the state word is there too.' },
            { name: 'the words', what: '`stepPending`, `stepRunning`, `stepDone`, `stepFailed`, `stepSkipped` and the announcement `stepAnnounce(title, state)` are in the dictionary, so `setStrings()` translates them.' },
        ],
        accessibility: [
            'Built in — each step reads “title, state”, the running one carries `aria-current="step"`, and a change is announced once through a hidden status region (a burst in one tick is one announcement).',
            'Built in — the list itself is not a live region, so it does not re-read every note on every change.',
            'Yours — name the list, and give a failed step a note that says what to do.',
        ],
    };
