// Page descriptor for the "alarm" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const alarmDescriptor = {
        id: 'alarm',
        title: 'Alarm',
        group: 'Feedback',
        classes: ['kp-alarm'],
        exports: ['Alarm', 'useAlarm'],
        intro: 'A full-screen dramatic alert: a code line, one huge word, the reason under it and one way out, over a plate that takes the whole window. It opens as a modal dialog in the top layer, so the page behind it cannot be clicked or tabbed to until it is dealt with. Either only its button closes it, or it closes by itself after a number of seconds. Every theme draws it in its own colours and faces.',
        whenToUse:
            'For the rare event that must stop everything: access refused, a lockout, a connection to something critical lost. Not for an error beside a field, which is a field message; not for a result the reader may ignore, which is a toast; and not for a question with two answers, which is a dialog. An alarm that fires often teaches people to press through it.',
        examples: [
            {
                title: 'A button that raises an alarm',
                why: 'The trigger describes the alarm in its attributes and the module raises it on a press: the value of the first attribute is the headline, the others the code line, the reason and the mode. When it closes, the close event is dispatched on the button with the reason, and focus is back on it. The same alarm from a script is one call to showAlarm() with the same words, which resolves with the reason.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-alarm="Access denied" data-kp-alarm-code="Security protocol 7 · lockout" data-kp-alarm-detail="Three failed attempts on terminal 4. This console is locked for ten minutes.">Test the lockout</button>
<button type="button" class="kp-button" data-kp-alarm="Connection lost" data-kp-alarm-code="Telemetry" data-kp-alarm-detail="The link to pump house 4 dropped. Readings shown are the last known values." data-kp-alarm-mode="auto" data-kp-alarm-seconds="6">Test the timed alarm</button>
`,
            },
            {
                title: 'The parts, held open in the page',
                why: 'Printed in the flow of the page so the pieces can be seen at rest, the way a style guide shows it: the plate, the frame and the hazard bars, the code line, the headline, the reason and the one button. A held-open frame is inert, because its button is a picture.',
                markup: `
<div class="kp-alarm" data-kp-alarm-inline data-kp-alarm-mode="ack" data-kp-alarm-motion="still" inert>
<div class="kp-alarm__scan" aria-hidden="true"></div>
<div class="kp-alarm__bars" aria-hidden="true"></div>
<div class="kp-alarm__panel">
<p class="kp-alarm__code">Special order 937</p>
<div class="kp-alarm__title" role="heading" aria-level="2"><span class="kp-alarm__glyphs" data-text="Request denied">Request denied</span></div>
<p class="kp-alarm__detail">Crew override is not accepted at this level of clearance.</p>
<div class="kp-alarm__actions">
<button type="button" class="kp-button kp-alarm__ack">Acknowledge</button>
<span class="kp-alarm__hint" aria-hidden="true">Press Enter</span>
</div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: 'ack', what: 'The default: only the button closes it, with a click, Enter or Space. Escape and a click on the plate do nothing, and so does time.' },
            { name: 'ack with escape', what: 'The same, and Escape closes it too, with the reason escape.' },
            { name: 'auto', what: 'Closes by itself after its seconds, with a bar that shrinks towards the start and the whole seconds under it. Escape closes it. Keep open stops the clock and turns it into ack.' },
            { name: '.kp-alarm__code / __title / __detail', what: 'The small line above, the headline in the display face, and the reason in the mono face.' },
            { name: '.kp-alarm__ack / __keep', what: 'The one way out, in the theme’s button shape and the alarm’s paint; and the quiet button that keeps a timed alarm open.' },
            { name: 'data-kp-alarm-inline', what: 'A frame held open in the flow of a page instead of raised over it, for a style guide.' },
            { name: 'data-kp-alarm-motion="still"', what: 'A frame that shows what a reader who asked for reduced motion sees, whatever the reader asked for.' },
            { name: 'pastel', what: 'In pastel the alarm draws its own plate on the pass’s clock, lands as pastel’s dialog does and leaves as that backwards; its buttons are pastel’s button.' },
        ],
        accessibility: [
            'Built in — an alertdialog opened as a modal: the page behind is inert, focus stays inside, and it returns to the trigger when the alarm closes.',
            'Built in — the headline is its accessible name and the reason its description; a sentence read once says how it goes away, instead of a number every second.',
            'Built in — the acknowledged alarm focuses its button; the timed one focuses itself, so an Enter meant for the page presses nothing.',
            'Built in — with reduced motion asked for, nothing moves: the words are there at once and the bar steps a whole second at a time.',
            'Built in — the flicker, the decode and the glow stay under two flashes a second, measured from rendered frames; WCAG allows three.',
            'Yours — keep the headline to a few words and put what happens next in the reason.',
            'Yours — give a timed alarm enough seconds to read the reason twice, and repeat what matters somewhere that stays.',
        ],
    };
