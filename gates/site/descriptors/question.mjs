// Page descriptor for the "question" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const questionDescriptor = {
        id: 'question',
        title: 'Question card',
        group: 'Feedback',
        classes: ['kp-question'],
        exports: [],
        aliases: ['asked', 'frozen', 'questions', 'title'],
        intro: 'A card for a question the host is waiting on: the question, what each answer sets in motion, and how long it still waits. The app asks, the person answers, the app sends and says whether it worked; the card shows every step: waiting, urgent, sending, answered, refused, expired.',
        whenToUse: 'An automated process needs a human decision before a deadline. For a decision that waits for ever use a dialog; for a plain confirmation use the confirm button.',
        examples: [
            {
                title: 'Remove the old backups?',
                why: 'The container holds the cards. At zero the default answer happens; a finished card stays with its outcome and a Dismiss button.',
                markup: `
<div data-kp-questions></div>
`,
                script: `
import { askQuestion, attachQuestions } from '@kp-soft/themes/js/question-card';

const container = document.querySelector('[data-kp-questions]');
attachQuestions(container.parentElement);
askQuestion(container, {
    id: 'op-42',
    question: 'Remove the old backups?',
    text: 'The host asks before it deletes 14 backups.',
    deadline: Date.now() + 90000,
    answers: [
        { value: 'allow', label: 'Allow', consequence: 'Deletes 14 backups (3.2 GB) and goes on.', outcome: 'Allowed. The operation goes on.' },
        { value: 'stop', label: 'Stop', consequence: 'Keeps everything and stops the operation.', outcome: 'Stopped. Nothing was deleted.', tone: 'destructive' },
    ],
    defaultAnswer: 'stop',
});
container.addEventListener('kp-question-answer', (event) => event.detail.respond(true));
`,
            },
            {
                title: 'The bar clock, the urgent card and the ones that finished',
                why: '`measure: \'bar\'` (JS option `countdown`) drains a rule instead of the ring. From `urgentAt` seconds the card is stronger and its time bold; the last card has `expired: \'remove\'`. The clock is frozen here (the second argument of `askQuestion`) so the page does not change under you; a card that is answered, refused or expired keeps its outcome with a Dismiss button.',
                markup: `
<div data-kp-questions id="doc-questions-more" data-kp-title="off"></div>
`,
                script: `
import { askQuestion, attachQuestions } from '@kp-soft/themes/js/question-card';

const container = document.getElementById('doc-questions-more');
attachQuestions(container.parentElement);
const answers = [
    { value: 'allow', label: 'Allow', consequence: 'Updates the stack now.', outcome: 'Allowed. The update goes on.' },
    { value: 'later', label: 'Later', consequence: 'Asks again tomorrow.', outcome: 'Postponed until tomorrow.' },
];
const now = Date.now();
askQuestion(container, { id: 'q-bar', question: 'Update media tonight?', deadline: now + 600000, answers, defaultAnswer: 'later', countdown: 'bar' }, { now: () => now, frozen: true });
askQuestion(container, { id: 'q-urgent', question: 'Restart the gateway?', deadline: now + 20000, answers, defaultAnswer: 'later', urgentAt: 30 }, { now: () => now, frozen: true });
askQuestion(container, { id: 'q-expired', question: 'Clean the cache?', deadline: now - 1000, answers, defaultAnswer: 'later', expired: 'keep' }, { now: () => now, frozen: true });
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`askQuestion(container, spec, { now, frozen })` adds a card and answers its handle; `attachQuestions(root)` wires every `[data-kp-questions]` container and returns a detach; `questionOf(el)` answers the handle of a card. `QUESTIONS` is the selector and `QUESTION_URGENT_AT` (30) the default behind `urgentAt`. The spec’s fields are `id`, `question`, `text`, `deadline`, `answers`, `defaultAnswer`, `urgentAt`, `expired` and `countdown`.' },
            { name: 'events', what: '`kp-question-answer` `{ id, value, respond(ok, why) }`, `kp-question-expire` `{ id, defaultAnswer }` and `kp-question-dismiss` `{ id }` (`QUESTION_ANSWER_EVENT`, `QUESTION_EXPIRE_EVENT`, `QUESTION_DISMISS_EVENT`).' },
            { name: '.kp-question__head / __title / __text / __time / __left / __default', what: 'The card’s head: the question, its sentence, the time left (“1 min 30 s”) and the line that says what happens at zero, “If nobody answers: stops”.' },
            { name: '.kp-question__bar / __fill / __ring', what: 'The three clocks: the draining rule (`bar`) and the ring (`ring`, the default); `text` draws the time alone.' },
            { name: '.kp-question__answers / __answer / __button / __consequence', what: 'One answer: a button with what it sets in motion under it, tied to the button as its description. On a phone the buttons are full width.' },
            { name: '.kp-question__outcome / __dismiss', what: 'What a finished card says (“Allowed. The operation goes on.”) and its Dismiss button.' },
            { name: 'deadline', what: 'An ISO string or epoch milliseconds; required. The card counts to it.' },
            { name: 'data-kp-asked', what: 'When it was asked (now by default); the countdown bar is measured from it.' },
            { name: 'default-answer', what: 'The value that happens at zero, said on the card (“If nobody answers: stops”).' },
            { name: 'urgent-at', what: 'Seconds (30): from here the card is stronger and its time bold, announced once.' },
            { name: 'expired', what: '`keep` (default, the card stays with the outcome) or `remove`.' },
            { name: 'data-kp-measure', what: 'How the time left is drawn: `ring` (default), `bar` or `text`.' },
            { name: 'data-kp-title', what: '`off` on the container leaves the tab title alone; by default it carries “(1) waiting”.' },
            { name: 'data-kp-frozen', what: 'Present: the clock stands still, for a demo or a test.' },
        ],
        accessibility: [
            'Built in — each button’s consequence is in its `aria-describedby`; the keys 1 to n answer when the card has the focus; on a phone the buttons are full width with their consequences under them.',
            'Yours — send the answer on `kp-question-answer` and call `respond(ok, why)`; a refusal needs its reason.',
        ],
    };
