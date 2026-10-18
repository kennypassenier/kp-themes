// research/synth-alert-buttons: the page's own wiring. The components are the package's (js/auto.js attaches them); this file
// asks the two question cards (frozen: a still demonstration, no countdown) and wires the one component option.

import { askQuestion } from '../../js/question-card.js';

const component = document.getElementById('alert-buttons-component');
const controls = document.querySelector('[data-review-controls-for="alert-buttons-component"]');

/** Press an option: the component carries the choice as an attribute, the scoped rule in page.css reads it. */
function setMode(/** @type {string} */ mode) {
    component?.setAttribute('data-sab-buttons', mode);
    for (const button of controls?.querySelectorAll('[data-sab-mode]') ?? []) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-sab-mode') === mode));
    }
}

controls?.addEventListener('click', (event) => {
    const button = /** @type {Element} */ (event.target).closest('[data-sab-mode]');
    if (button) setMode(/** @type {string} */ (button.getAttribute('data-sab-mode')));
});

const answers = [
    { value: 'allow', label: 'Allow', consequence: 'Deletes 14 backups (3.2 GB) and goes on.', outcome: 'Allowed. The operation goes on.' },
    { value: 'stop', label: 'Stop', consequence: 'Keeps everything and stops the operation.', outcome: 'Stopped. Nothing was deleted.', tone: /** @type {const} */ ('destructive') },
];

const urgent = document.getElementById('sab-question-urgent');
if (urgent) {
    askQuestion(
        urgent,
        { id: 'sab-urgent', question: 'Remove the old backups?', text: 'The host asks before it deletes 14 backups.', deadline: Date.now() + 20_000, urgentAt: 30, answers, defaultAnswer: 'stop', countdown: 'text' },
        { frozen: true },
    );
}

const refused = document.getElementById('sab-question-refused');
if (refused) {
    refused.addEventListener('kp-question-answer', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        detail.respond(false, 'The host did not answer');
    });
    const card = askQuestion(
        refused,
        { id: 'sab-refused', question: 'Remove the old backups?', text: 'The host asks before it deletes 14 backups.', deadline: Date.now() + 600_000, urgentAt: 30, answers, defaultAnswer: 'stop', countdown: 'text' },
        { frozen: true },
    );
    card.answer('allow');
}
