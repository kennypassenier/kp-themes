// Page descriptor for the "state-word" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const stateWordDescriptor = {
        id: 'state-word',
        title: 'State word',
        group: 'Data',
        classes: ['kp-state-word'],
        exports: [],
        aliases: ['words'],
        intro: 'A word that changes with its state (“Running”, “Stopped”, “in 3 min”) and keeps the width of the widest word it can show, so nothing beside it moves when it changes. `setStateWord(el, word)` in js/components.js changes it and adds a new word to the ones it keeps room for.',
        whenToUse:
            'Where a state sits in front of a control that changes it: a second click without moving the mouse must hit the same button. Not for running text, where a word may take the room it needs.',
        examples: [
            {
                title: 'A pump, its state and its button',
                why: 'The words are listed in `data-kp-words`, one per line (`&#10;` between them in markup); an invisible line of no height holds the widest.',
                markup: `
<p class="kp-row"><b>Pump 1</b> <span class="kp-state-word" data-kp-words="Running&#10;Stopped&#10;Starting in 3 min">Stopped</span> <button type="button" class="kp-button kp-button--sm">Start</button></p>
`,
            },
        ],
        variants: [
            { name: '.kp-state-word', what: 'As wide as the widest of its words, the shown word at its start.' },
            { name: '.kp-state-word--center', what: 'The shown word in the middle of that width.' },
            { name: 'data-kp-words', what: 'Every word it can show, one per line. `setStateWord()` adds a word that is new, so the width never shrinks back.' },
        ],
        accessibility: [
            'Built in — the held width is an invisible pseudo-element; a screen reader reads the shown word only.',
            'Yours — announce a state change that matters (a live region nearby); the word changing on screen is silent.',
        ],
    };
