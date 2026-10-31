// Page descriptor for the "switch" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const switchDescriptor = {
        id: 'switch',
        title: 'Switch',
        group: 'Forms',
        classes: ['kp-switch'],
        exports: ['Switch'],
        intro: 'A checkbox that says on and off instead of ticked: a native checkbox with role="switch", drawn as a track and a thumb, with the state in a word beside it. It submits with a form, reads its state from checked and flips with Space, with no script of its own.',
        whenToUse:
            'For a setting that takes effect as it is flipped — alarms on, a live view on. For a choice that only counts once a form is sent, a checkbox says that better; for more than two states, use a radio group or a select.',
        examples: [
            {
                title: 'Off, on, disabled, and invalid',
                why: 'The thumb’s position and the word both carry the state, so it never rests on colour alone. The state span starts empty: attachSwitches() fills it from the dictionary, so a consumer’s setStrings() reaches the words.',
                markup: `
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Night alarms</span>
</label>
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" checked />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Weekly summary</span>
</label>
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" checked disabled />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Audit log (always on)</span>
</label>
<div class="kp-field kp-field--check kp-field--invalid">
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" aria-invalid="true" aria-describedby="doc-switch-error" />
<span class="kp-switch__state" aria-hidden="true"></span>
<span>Line locked out</span>
</label>
<span class="kp-field__error" id="doc-switch-error">Lock the line out before you start the repair.</span>
</div>
`,
            },
            {
                title: 'Without a state word, where the row already says it',
                why: '`data-kp-switch-state="none"` leaves the On and Off word out and gives up its track, so the knob and its label stand one gap apart: for a switch whose label is the state (“Active”) or whose row says it. A state element left empty, or holding only empty words, gives up its track the same way.',
                markup: `
<label class="kp-switch" data-kp-switch-state="none">
<input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Active: Ibuprofen 400 mg" />
<span>Active</span>
</label>
<label class="kp-switch" data-kp-switch-state="none">
<input class="kp-switch__input" type="checkbox" role="switch" aria-label="Active: Amoxicillin 500 mg" />
<span>Active</span>
</label>
`,
            },
        ],
        variants: [
            { name: '.kp-switch', what: 'The row: a label, so the track, the word and the text are one target.' },
            { name: '.kp-switch__input', what: 'The track, with the thumb drawn on it; checked moves the thumb to the end and fills the track the theme’s way.' },
            { name: '.kp-switch__state', what: 'The On or Off word beside the track, from the dictionary; aria-hidden, because the role already announces the state.' },
            { name: 'data-kp-switch-state="none"', what: 'No state word and no room kept for one: the knob and its label stand one gap apart. An empty state element does the same.' },
            { name: 'disabled', what: 'The row fades and refuses the pointer; a disabled switch that is on still reads as on.' },
            { name: 'aria-invalid', what: 'The outline an invalid checkbox takes, in the alarm colour; the message under it says what is wrong.' },
        ],
        accessibility: [
            'Built in — role="switch" on a real checkbox: a screen reader says “switch, on”, Space flips it and Enter does not.',
            'Built in — the state is carried three ways: the thumb’s position, the paint, and the word.',
            'Built in — with reduced motion asked for, the thumb jumps instead of sliding.',
            'Yours — label every switch with what it turns on, not with “on” or “enable”.',
            'Yours — a switch acts at once; if flipping it needs a save button, use a checkbox.',
        ],
    };
