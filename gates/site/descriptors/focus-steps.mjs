// Page descriptor for the "focus-steps" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const focusStepsDescriptor = {
        id: 'focus-steps',
        title: 'One step at a time',
        group: 'Navigation',
        classes: ['kp-focus-steps'],
        aliases: ['tracks', 'lanes', 'lane', 'track', 'focus-mode', 'advance', 'same', 'skip', 'pinned-first', 'back', 'choice-layout', 'choice-height', 'progress', 'resume', 'resume-until', 'summary', 'wake', 'speak', 'text-optional', 'value', 'pinned', 'chosen', 'done', 'current', 'layout'],
        exports: [],
        intro: 'Cook mode: one step of a recipe large on the screen, with what that step needs, a timer button and a note, the count and the theme’s progress bar on top, and two big buttons at the foot. `data-kp-focus-steps` on the root; js/focus-steps.js (`setFocusSteps`, `goToStep`, `getStepIndex`, `setFocusStepsState`, `attachFocusSteps`) keeps the screen on with the Wake Lock API while it is attached, turns the step with the arrows, PageUp/PageDown, Space and a swipe, reads it aloud on request and fires `kp-focus-steps-change` so the page can remember where a person stopped.',
        whenToUse: 'For instructions followed with the hands busy: a recipe, a repair, an exercise. For a form filled in parts use the wizard; for the steps of a running process use the step list.',
        examples: [
            {
                title: 'A recipe',
                why: 'The module draws the head (“Step 3 of 8”, the theme’s progress bar, Read aloud when the browser can, the screen line), the step with what it needs, a timer button, a note and the two big buttons from the steps it is given; the root needs a height. While it is attached the screen stays on where the Wake Lock API allows (`data-kp-focus-steps-wake="false"` does not ask); the arrows, PageUp and PageDown, Space and a swipe turn the step. A step’s timer button starts a timer in the list named by `data-kp-focus-steps-timers`. `kp-focus-steps-change` carries `{ index, from, total, step }` so the page can remember where a person stopped, and `kp-focus-steps-done` fires on Done.',
                markup: `
<div class="kp-focus-steps" id="doc-focus" data-kp-focus-steps data-kp-focus-steps-timers="doc-focus-timers" style="block-size: 30rem" aria-label="Chicken curry"></div>
<div class="kp-timers" id="doc-focus-timers" data-kp-timers aria-label="Timers of this recipe"></div>
<p class="kp-text-muted" id="doc-focus-said" role="status">At the first step.</p>
`,
                script: `
import { attachFocusSteps, setFocusSteps, goToStep } from '@kp-soft/themes/js/focus-steps';

const root = document.getElementById('doc-focus');
attachFocusSteps(root.parentElement);
setFocusSteps(root, [
    { text: 'Rinse the rice until the water runs clear, then leave it to drain.', ingredients: [{ amount: '300 g', name: 'basmati rice' }] },
    { text: 'Cook the rice with the lid on. Do not lift the lid.', ingredients: [{ amount: '600 ml', name: 'water' }, { amount: '1 tsp', name: 'salt' }], timer: { seconds: 600, name: 'Rice' }, note: 'Do not walk away: it catches fast.' },
    { text: 'Brown the chicken in the pan, then add the curry paste and stir for a minute.', ingredients: [{ amount: '600 g', name: 'chicken thighs' }, { amount: '2 tbsp', name: 'curry paste' }] },
    { text: 'Pour in the coconut milk, simmer, and serve over the rice.', ingredients: [{ amount: '400 ml', name: 'coconut milk' }], timer: { seconds: 900, name: 'Curry' } },
]);
const said = document.getElementById('doc-focus-said');
root.addEventListener('kp-focus-steps-change', (event) => { said.textContent = 'Now at step ' + (event.detail.index + 1) + ' of ' + event.detail.total + '.'; });
root.addEventListener('kp-focus-steps-done', (event) => { said.textContent = 'Done: ' + event.detail.total + ' steps.'; goToStep(root, 0); });
`,
            },
            {
                title: 'Answering one question per screen',
                why: '`data-kp-focus-mode="answer"` and steps that carry an `answer`: big answer buttons, “Same as yesterday: Ok” and “Same as usual: Good” with their value in the label, and Not today. One tap on a choice moves on after `data-kp-advance-ms` (350, the read-back of what you hit); a `multi` pick and a `text` box use Next. The page hears `kp-focus-steps-answer` for each answer (`{ index, id, value, source, same?, previous }`) and Done carries `{ total, answers, startedAt, finishedAt }`. The other options are `data-kp-same`, `data-kp-skip`, `data-kp-back`, `data-kp-pinned-first`, `data-kp-choice-layout` and `-height`, `data-kp-progress`, `data-kp-summary`, and `data-kp-resume` with `data-kp-remember` to pick up where a person stopped.',
                markup: `
<div class="kp-focus-steps" id="doc-focus-answer" data-kp-focus-steps data-kp-focus-mode="answer" data-kp-pinned-first='[{"value":"none","label":"Nothing to log"}]' data-kp-summary="on" style="block-size: 40rem" aria-label="Daily check-in"></div>
<p class="kp-text-muted" id="doc-focus-answer-said" role="status">No answer yet.</p>
`,
                script: `
import { attachFocusSteps, setFocusSteps } from '@kp-soft/themes/js/focus-steps';

const root = document.getElementById('doc-focus-answer');
attachFocusSteps(root.parentElement);
setFocusSteps(root, [
    { text: 'How was your energy?', answer: { id: 'energy', kind: 'choice', previous: 'ok', usual: 'good', choices: [{ value: 'low', label: 'Low' }, { value: 'ok', label: 'Ok' }, { value: 'good', label: 'Good' }] } },
    { text: 'What did you eat today?', answer: { id: 'meals', kind: 'multi', choices: [{ value: 'breakfast', label: 'Breakfast' }, { value: 'lunch', label: 'Lunch' }, { value: 'dinner', label: 'Dinner' }] } },
    { text: 'Anything else to note?', answer: { id: 'note', kind: 'text', placeholder: 'A few words' } },
]);
const said = document.getElementById('doc-focus-answer-said');
root.addEventListener('kp-focus-steps-answer', (event) => {
    said.textContent = event.detail.id + ': ' + [].concat(event.detail.value ?? 'skipped').join(', ') + ' (' + event.detail.source + ').';
});
`,
            },
            {
                title: 'Loading, no steps and a failed recipe',
                why: '`setFocusStepsState(root, "loading" | "error" | "save-error" | "ready", message)`: loading lays the busy card over the body, error says the message where the step was, `save-error` keeps the answers and says “Could not save your answers” with Try again (`kp-focus-steps-save-retry`; `kp-focus-steps-retry` is the failed plate’s button). No steps says `data-kp-focus-steps-empty`, else the dictionary’s sentence.',
                markup: `
<div class="kp-focus-steps" id="doc-focus-loading" data-kp-focus-steps style="block-size: 14rem" aria-label="Loading recipe"></div>
<div class="kp-focus-steps" id="doc-focus-empty" data-kp-focus-steps data-kp-focus-steps-empty="This recipe has no steps yet." style="block-size: 14rem" aria-label="Recipe without steps"></div>
<div class="kp-focus-steps" id="doc-focus-failed" data-kp-focus-steps style="block-size: 14rem" aria-label="Failed recipe"></div>
`,
                script: `
import { attachFocusSteps, setFocusSteps, setFocusStepsState } from '@kp-soft/themes/js/focus-steps';

const loading = document.getElementById('doc-focus-loading');
const empty = document.getElementById('doc-focus-empty');
const failed = document.getElementById('doc-focus-failed');
attachFocusSteps(loading.parentElement);
setFocusSteps(loading, []);
setFocusStepsState(loading, 'loading');
setFocusSteps(empty, []);
setFocusSteps(failed, []);
setFocusStepsState(failed, 'error', 'The recipe could not be read.');
`,
            },
            {
                title: 'A check-in that runs: choice, several, a written line, and the plates',
                why: 'Each step carries `answer: { id, kind, choices, previous, usual, placeholder }`: `kind` is `choice` (one tap picks and the flow moves on), `multi` (several taps, then Next) or `text` (a box, whose `placeholder` is its hint; Not today passes it). `previous` and `usual` are the application’s memory and are written into the buttons, “Same as yesterday: Matig”. `data-kp-pinned-first` puts “Nothing to log” first in every question. Every answer fires `kp-focus-steps-answer`, and Done carries all of them; the page here refuses to save, so `setFocusStepsState(el, \'save-error\')` shows the plate that keeps the answers and offers Try again.',
                markup: `
<div class="kp-focus-steps" id="doc-checkin" data-kp-focus-steps data-kp-focus-mode="answer" data-kp-pinned-first='[{"value":"none","label":"Nothing to log"}]' aria-label="Daily check-in"></div>
<pre class="kp-code-block" id="doc-checkin-log" aria-live="polite">Answer a question.</pre>
`,
                script: `
import { FOCUS_STEPS_ANSWER_EVENT, FOCUS_STEPS_DONE_EVENT, FOCUS_STEPS_SAVE_RETRY_EVENT, attachFocusSteps, setFocusSteps, setFocusStepsState } from '@kp-soft/themes/js/focus-steps';

const root = document.getElementById('doc-checkin');
const log = document.getElementById('doc-checkin-log');
attachFocusSteps(root.parentElement);
setFocusSteps(root, [
    {
        text: 'How is your mood today?',
        answer: {
            id: 'mood',
            kind: 'choice',
            previous: 'matig',
            usual: 'good',
            choices: [
                { value: 'rough', label: 'Rough' },
                { value: 'matig', label: 'Matig' },
                { value: 'good', label: 'Good' },
            ],
        },
    },
    {
        text: 'What got in the way of sleep?',
        answer: {
            id: 'sleep',
            kind: 'multi',
            previous: ['noise'],
            choices: [
                { value: 'noise', label: 'Noise' },
                { value: 'thoughts', label: 'Thoughts' },
                { value: 'pain', label: 'Pain' },
            ],
        },
    },
    { text: 'One sentence about today, if you like.', answer: { id: 'line', kind: 'text', placeholder: 'Write what you want, or press Not today' } },
]);
root.addEventListener(FOCUS_STEPS_ANSWER_EVENT, (event) => {
    const { id, value, source } = event.detail;
    log.textContent = 'kp-focus-steps-answer { id: ' + id + ', value: ' + JSON.stringify(value) + ', source: ' + source + ' }';
});
root.addEventListener(FOCUS_STEPS_DONE_EVENT, (event) => {
    log.textContent = 'Done: ' + Object.keys(event.detail.answers).length + ' answers kept in the page; the save is refused.';
    setFocusStepsState(root, 'save-error');
});
root.addEventListener(FOCUS_STEPS_SAVE_RETRY_EVENT, () => (log.textContent = 'kp-focus-steps-save-retry: the page tries to save again'));
`,
            },
        ],
        variants: [

            { name: 'data-kp-focus-steps-wake="false"', what: 'Do not ask for the screen to stay on.' },
            { name: 'data-kp-focus-steps-timers', what: 'The id of the timer list a step’s timer button starts in.' },
            { name: 'data-kp-focus-steps-empty', what: 'The sentence of a recipe with no steps.' },
            { name: 'data-kp-focus-steps-screen', what: 'Written: on, off or unsupported, and said in the head.' },
            { name: 'data-kp-focus-mode', what: '`read` (the default; a step with `answer` is a question by itself) or `answer` (also draws empty, failed and save-failed as centred plates).' },
            { name: 'data-kp-advance and data-kp-advance-ms', what: '`auto` (a tap on a choice moves on after 350 ms, the read-back of what you hit) or `button`; multi and text always use Next.' },
            { name: 'data-kp-same', what: '`both` (the default: two buttons), `yesterday`, `usual` or `off`.' },
            { name: 'data-kp-skip', what: '`off` leaves out Not today (present by default; a skip is an answer, `source: skip`).' },
            { name: 'data-kp-pinned-first', what: 'JSON `[{ "value": "none", "label": "Nothing to log" }]`: choices that stand first in every question.' },
            { name: 'data-kp-back', what: '`off` hides Back (present by default; going back keeps every answer).' },
            { name: 'data-kp-choice-layout and data-kp-choice-height', what: '`auto`, `stack` or `row` (a row for up to three short labels, never on a phone); `lg` (56 px, the default) or `md`.' },
            { name: 'data-kp-progress', what: '`count` (“Question 3 of 7” and the bar, the default) or `off`; never a timer, never a streak.' },
            { name: 'data-kp-resume and data-kp-resume-until', what: '`auto`, `ask` or `off` with `data-kp-remember`; `midnight` (the default), `hours:N` or `never`.' },
            { name: 'data-kp-summary', what: '`on` adds a summary screen after the last question (off by default).' },
            { name: 'data-kp-wake, data-kp-speak and data-kp-text-optional', what: 'The screen is not kept on and Read aloud is off in answer mode (`true` turns them on); a written answer can always be passed with Not today.' },
            { name: 'kp-focus-steps-answer and related events', what: '`kp-focus-steps-before-answer` (cancelable), `kp-focus-steps-answer` `{ index, id, value, source, same?, previous }`, `kp-focus-steps-resume`, `kp-focus-steps-retry`, `kp-focus-steps-save-retry`; Done carries `{ total, answers, startedAt, finishedAt }`. `setFocusStepsState(el, "save-error")` keeps the answers.' },
            { name: 'marks the module writes', what: '`data-kp-value` and `data-kp-chosen` on an answer, `data-kp-pinned`, `data-kp-layout` on the answers, `data-kp-done` and `data-kp-current` on a dot.' },
            { name: 'getStepsPassed(root) / getSteps(root)', what: 'Read the steps back: `getSteps` gives the steps with their state, `getStepsPassed` the ones the reader has gone through.' },
            { name: 'tracks: track, id, title, waitFor / after, timer.id', what: 'Step fields for a recipe that runs in parallel: `track` puts the step in a lane, `id` and `title` name it, `waitFor` or `after` says which step must be done first, and `timer.id` names the timer the step starts. The lanes sit in a band; a step that waits shows the waiting plate.' },
            { name: 'data-kp-tracks / -lanes / -lane-detail', what: '`data-kp-tracks` turns the lanes on, `data-kp-lanes` chooses how they show, `data-kp-lane-detail` how much a lane says about its step.' },
            { name: 'data-kp-track-follow / -attention / -shared', what: '`data-kp-track-follow` makes the view follow the lane that needs the reader, `-attention` says how a lane that needs them is called out, `-shared` how a step shared between lanes shows.' },
            { name: 'keys T and Shift T', what: 'T goes to the next lane and Shift T to the one before; the events `kp-focus-steps-track` and `kp-focus-steps-track-attention` say which lane the view is on and which one wants attention.' },
            { name: 'read mode', what: 'The empty and failed plates are the state plate (there is no more `kp-focus-steps__message`), and `data-kp-wake` is read live.' },
            { name: 'narrow columns', what: 'In a column too narrow for the head, Back and Next stand one under the other when two do not fit side by side; neither breaks a word.' },
        ],
        accessibility: [
            'Built in — every change says “Step 3 of 8” and the step; the buttons are real buttons, a step boundary is `aria-disabled` and keeps the focus.',
            'Built in — keys and a swipe do what the buttons do; Read aloud uses the browser’s own voice.',
            'Yours — give the view a name and a height, and remember the index the event gives.',
        ],
    };
