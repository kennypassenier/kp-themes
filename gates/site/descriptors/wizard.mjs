// Page descriptor for the "wizard" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const wizardDescriptor = {
        id: 'wizard',
        title: 'Wizard',
        group: 'Forms',
        classes: ['kp-wizard'],
        exports: ['Wizard'],
        aliases: ['step', 'step-label', 'navigable', 'finish', 'validate', 'focus-step', 'next'],
        intro: 'A form in steps, with an indicator that says where you are and what is still coming. It borrows the form’s validation rather than repeating it, so a step that will not validate does not advance.',
        whenToUse:
            'When a long form has a natural order and the later parts depend on the earlier ones. Not to hide the length of a form the reader could have filled in one screen — steps make a short form feel long. Not for anything the reader may want to fill in out of order either: that is a page with sections.',
        examples: [
            {
                title: 'Two steps, a back and a next',
                why: 'The indicator is an ordered list rather than a row of dots: the steps have names and a number, which is what “step two of four” needs in order to be said out loud.',
                markup: `
<div class="kp-wizard" data-kp-wizard>
<ol class="kp-wizard__steps">
<li data-kp-step-label>Details</li>
<li data-kp-step-label>Review</li>
</ol>
<p data-kp-wizard-status role="status" aria-live="polite"></p>
<section data-kp-step>
<div class="kp-field">
<label class="kp-field__label" for="doc-wizard-name">Name</label>
<input class="kp-field__input" id="doc-wizard-name" required />
</div>
</section>
<section data-kp-step hidden>Ready to send.</section>
<div class="kp-wizard__actions">
<button type="button" class="kp-button" data-kp-wizard-back>Back</button>
<button type="button" class="kp-button kp-button--primary" data-kp-wizard-next>Next</button>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-wizard__steps', what: 'The indicator. Each step is numbered by the stylesheet rather than by markup, so inserting one renumbers the rest.' },
            { name: 'current step', what: 'Marked by weight, by a filled circle, and by the current-step attribute — three carriers, one of which survives without colour.' },
            { name: 'done step', what: 'Its number becomes a check in the success colour.' },
            { name: 'navigable labels', what: 'The step labels can be made clickable, for a wizard whose earlier steps stay open.' },
            { name: '.kp-wizard__actions', what: 'The back and next pair, at the end of the current step.' },
            { name: '--kp-wizard-padding', what: 'The room between the frame a theme draws and what is inside it, 1rem by default.' },
            { name: 'held transition', what: 'A step change can be refused or delayed by a listener or an async check, which is what a step that needs a server answer was missing.' },
            { name: 'pastel', what: 'In pastel a wizard is stuck to the page with a strip of washi tape across its top-start corner.' },
        ],
        accessibility: [
            'Built in — the current step is marked with the attribute that exists for exactly this, which is what a screen reader announces on arrival.',
            'Built in — the status line says which step you are on out loud when it changes.',
            'Built in — the step that becomes visible takes focus, so the keyboard does not stay behind on the previous panel.',
            'Yours — validate on the server as well; a wizard that will not advance is a courtesy, not a guard.',
            'Yours — name each step in a word or two. “Step 2” tells the reader nothing about what is in it.',
            'Yours — let people go back. A step that cannot be revisited turns a typo into a restart.',
        ],
    };
