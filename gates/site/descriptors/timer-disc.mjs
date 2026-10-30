// Page descriptor for the "timer-disc" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const timerDiscDescriptor = {
        id: 'timer-disc',
        title: 'Visual timer',
        group: 'Feedback',
        classes: ['kp-timer-disc'],
        exports: [],
        intro: 'The time left as a shrinking disc, the Time Timer’s idea: no figures tick, a coloured disc grows smaller as the time goes, so the time left is seen at a glance. `attachTimerDiscs(root)` in js/timer-disc.js draws the face with twelve marks on its rim, the disc (drawn by one number, written only when its edge has moved a tenth of a degree), the name and length under it, one line for Paused or Time is up, and Start and Reset as the package’s buttons. Reset fills the disc in the theme’s own time and curve; at the end the face breathes three times. Under reduced motion the disc steps once a minute and nothing glides or breathes.',
        whenToUse:
            'For a span of time a person should feel rather than read: focus, a break, homework, a child’s turn. When the exact seconds matter, use the countdown in digits.',
        examples: [
            {
                title: 'Twenty-five minutes of focus',
                why: '`data-kp-timer-disc` takes a length (`25m`, `1h30m`, `90`, `25:00`); `data-kp-timer-disc-scale="60"` makes the face a 60-minute dial.',
                markup: `
<div class="kp-timer-disc" data-kp-timer-disc="25m" data-kp-timer-disc-name="Focus"></div>
`,
            },
            {
                title: 'A classic 60-minute dial, a short timer and a disabled one',
                why: 'Without `data-kp-timer-disc-scale` the whole disc is the set length, so a five-minute timer starts full and shrinks to nothing; with `scale="60"` the face is a 60-minute dial and 25 minutes is a sector of 150 degrees. A length is `25m`, `1h30m`, `45s`, `90` (seconds) or `25:00`. `data-kp-timer-disc-disabled` turns the buttons off. Reset fills the disc again in the theme’s own time and curve; under reduced motion the disc steps once a minute.',
                markup: `
<div class="kp-row">
<div class="kp-timer-disc" data-kp-timer-disc="25m" data-kp-timer-disc-scale="60" data-kp-timer-disc-name="Focus"></div>
<div class="kp-timer-disc" data-kp-timer-disc="5m" data-kp-timer-disc-name="Break"></div>
<div class="kp-timer-disc" data-kp-timer-disc="1h30m" data-kp-timer-disc-scale="120" data-kp-timer-disc-name="Homework" data-kp-timer-disc-disabled></div>
</div>
`,
            },
            {
                title: 'Running, paused and ended',
                why: '`timerDiscOf(el)` is the clock of an attached disc (`start()`, `pause()`, `reset(seconds)`, `add(seconds)`, `remaining()`), shared with the countdown. `data-kp-timer-disc-state` follows it (`idle`, `running`, `paused`, `ended`). The disc fires the countdown’s events: `kp-countdown-change` with `{ state, remaining, total }` and `kp-countdown-end` with `{ total }`, after which the face breathes three times and the line says “Time is up”.',
                markup: `
<div class="kp-timer-disc" id="doc-disc-run" data-kp-timer-disc="12s" data-kp-timer-disc-name="Twelve seconds"></div>
<p class="kp-text-muted" id="doc-disc-log" aria-live="polite">Starting in a moment.</p>
`,
                script: `
import { attachTimerDiscs, timerDiscOf } from '@kp-soft/themes/js/timer-disc';

const disc = document.getElementById('doc-disc-run');
const log = document.getElementById('doc-disc-log');
attachTimerDiscs(disc.parentElement);
disc.addEventListener('kp-countdown-change', (event) => { log.textContent = 'State: ' + event.detail.state + '.'; });
disc.addEventListener('kp-countdown-end', () => { log.textContent = 'The time is up.'; });
setTimeout(() => timerDiscOf(disc)?.start(), 800);
`,
            },
        ],
        variants: [
            { name: 'data-kp-timer-disc', what: 'The length: `25m`, `1h30m`, `45s`, `90` (seconds) or `25:00`.' },
            { name: 'data-kp-timer-disc-name', what: 'The timer’s name, under the face with its length.' },
            { name: 'data-kp-timer-disc-scale', what: 'Minutes for a whole turn of the face (`60`: the classic dial); without it the whole disc is the set length.' },
            { name: 'data-kp-timer-disc-disabled', what: 'Every button is off.' },
            { name: 'data-kp-timer-disc-state', what: 'Set by the script: `idle`, `running`, `paused` or `ended`.' },
        ],
        accessibility: [
            'Built in — the face is an image named by the time left in whole minutes, so a screen reader is not told every second; a status region says when it starts, pauses and ends.',
            'Built in — Start keeps one width for Start, Pause and Resume; Reset is off while there is nothing to reset; the end is a word and a ring as well as a breath, and nothing moves under reduced motion.',
            'Yours — name the timer, and say elsewhere what happens at the end if anything does.',
        ],
    };
