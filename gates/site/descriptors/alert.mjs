// Page descriptor for the "alert" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const alertDescriptor = {
        id: 'alert',
        title: 'Alert',
        group: 'Feedback',
        classes: ['kp-alert'],
        exports: ['Alert'],
        aliases: ['semantic', 'dismiss'],
        intro: 'A message on a coloured plate that also says, in words, what kind of message it is. Four flavours, no hover and no active state: an alert is a message, not a control.',
        whenToUse:
            'For something the reader has to know about the page or their last action, in place, where it happened. Not for a message about a single field — that belongs under the field, where the eye already is. Not for something that can be missed either: an alert appears in the page rather than announcing itself, so a passing confirmation is a toast.',
        examples: [
            {
                title: 'The four flavours',
                why: 'Each names itself in text as well as in colour: four coloured plates are one plate to somebody who sees them all the same. The contract enforcer disarms a semantic alert that carries no words.',
                markup: `
<div class="kp-alert kp-alert--success" role="status" data-kp-semantic><span><span class="kp-alert__label">Success: </span>The application was sent.</span></div>
<div class="kp-alert kp-alert--warning" role="status" data-kp-semantic><span><span class="kp-alert__label">Warning: </span>Two attachments were larger than the limit.</span></div>
<div class="kp-alert kp-alert--info" role="status" data-kp-semantic><span><span class="kp-alert__label">Note: </span>Applications are kept for twelve months.</span></div>
<div class="kp-alert kp-alert--destructive" role="alert" data-kp-semantic><span><span class="kp-alert__label">Error: </span>The server refused the file.</span></div>
`,
            },
            {
                title: 'With an icon and a way out',
                why: 'The icon is decorative — the word beside it is what carries the meaning — and the close button is a named control rather than a bare glyph.',
                markup: `
<div class="kp-alert kp-alert--warning" role="status" data-kp-semantic>
<span class="kp-alert__icon" aria-hidden="true">!</span>
<span class="kp-alert__body"><span class="kp-alert__label">Warning: </span>Your session ends in five minutes.</span>
<button type="button" class="kp-icon-button kp-alert__close" aria-label="Dismiss this message">×</button>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-alert', what: 'The neutral plate, for a message with no flavour at all.' },
            { name: '.kp-alert--success / --warning / --info / --destructive', what: 'The four semantic plates. Each takes its own ground and the ink that is measured against it.' },
            { name: '.kp-alert__label', what: 'The word that names the flavour, in bold, before the message.' },
            { name: '.kp-alert__icon', what: 'A decorative glyph at the leading edge, sized so it does not stretch with the text.' },
            { name: '.kp-alert__body', what: 'The message itself, taking the remaining width — a bare span here leaves the close button in the middle of the plate.' },
            { name: '.kp-alert__close', what: 'The dismiss control, pushed to the trailing edge.' },
            { name: 'pastel', what: 'In pastel an alert draws its own plate and pass and is stuck on as everything is; its label sits on its tone’s plate and its close button is pastel’s button. An alert shown again arrives as its leave backwards.' },
        ],
        accessibility: [
            'Built in — a semantic alert with no words is refused by the contract enforcer, which is DI4 made mechanical rather than remembered.',
            'Built in — every ground and ink pair on these plates is in the contrast gate; no alert invents a colour.',
            'Yours — choose the role: a status for something the reader can finish reading first, an alert only for what interrupts.',
            'Yours — an alert added after the page has loaded needs a live region, or it appears silently.',
            'Yours — name the dismiss button, and leave the reader a way back to what the message was about.',
        ],
    };
