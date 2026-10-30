// Page descriptor for the "disabled-reason" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const disabledReasonDescriptor = {
        id: 'disabled-reason',
        title: 'Disabled reason',
        group: 'Forms',
        classes: ['kp-reason'],
        exports: [],
        aliases: ['disabled-reason'],
        intro: 'A disabled control says why it is disabled. The sentence is the attribute `data-kp-disabled-reason`; the script draws it as the package’s tooltip and hands it to a screen reader as the control’s description.',
        whenToUse: 'Any disabled button or field whose reason is not obvious. For an error after a try, use the field’s own error.',
        examples: [
            {
                title: 'Nothing is selected yet',
                why: 'A disabled button gets no pointer events of its own, so the script wraps it once in an anchor that does. The tooltip shows only while the control is disabled.',
                markup: `
<button class="kp-button" type="button" disabled data-kp-disabled-reason="Nothing is selected yet">Delete</button>
`,
            },
            {
                title: 'A slider and a weekday picker that are off',
                why: 'A control that fills its line (the slider, the weekday picker, a sentence) is not shrink-wrapped by its reason anchor: the anchor takes the line and the control takes the anchor’s width, so the sentence never breaks one letter to a line. These two carry `data-kp-disabled` with the reason; hover the slider for the tooltip, and read the weekday picker’s own line under its chips.',
                markup: `
<div class="kp-stack kp-gap-md">
<div class="kp-slider" data-kp-slider data-kp-min="0" data-kp-max="100" data-kp-value="40" data-kp-unit="%" data-kp-disabled data-kp-disabled-reason="Retention is set by the backup policy" aria-label="Retention"></div>
<div class="kp-weekdays" data-kp-weekdays data-kp-value="1,4" data-kp-disabled data-kp-disabled-reason="The schedule is paused" aria-label="Run on"></div>
</div>
`,
            },
        ],
        variants: [
            { name: 'attachDisabledReasons(root)', what: 'Wires every control under `root` that carries `data-kp-disabled-reason` (js/reason.js, found by js/auto.js; `DISABLED_REASON` is the selector). Nothing runs on import; the call returns a detach that unwraps the controls again and gives back their own `aria-describedby`.' },
            { name: '.kp-reason', what: 'The anchor the script wraps round the control: it takes the pointer a disabled button does not, and carries `data-kp-reason-off` while the reason shows. A disabled slider, weekday picker or sentence in it makes the anchor take the whole line.' },
            { name: 'follows the attribute', what: 'Change or remove the sentence and the tooltip changes or goes; a control that comes back to life loses it.' },
            { name: 'aria-disabled', what: 'A control disabled with `aria-disabled="true"` carries a reason the same way.' },
            { name: 'in a row of actions', what: 'The wrapper wears the control’s `data-kp-action`, so an off button keeps its column in a `.kp-row-actions`.' },
        ],
        accessibility: [
            'Built in — the reason is the control’s `aria-describedby` while it is off, so a screen reader hears it with the control.',
            'Yours — word the reason as what to do (“Select a row first”), not as a state.',
        ],
    };
