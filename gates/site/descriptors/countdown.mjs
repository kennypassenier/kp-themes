// Page descriptor for the "countdown" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const countdownDescriptor = {
        id: 'countdown',
        title: 'Countdown',
        group: 'Feedback',
        classes: ['kp-countdown'],
        exports: [],
        intro: 'A named timer in digits, mm:ss or h:mm:ss, with Start, a minute more and Reset, and a gentle signal at the end. `attachCountdowns(root)` in js/countdown.js draws it; every digit stands in a cell one `ch` wide and only the digits that change are written, so the time never moves the layout in any theme’s face. The format follows the timer’s length and changes only on a press (a minute more past the hour). The time shown is rounded up: 0:00 is the end. The clock is the end moment minus now, so a hidden tab never loses time; `countdownClock()` is that clock on its own.',
        whenToUse:
            'When the exact time left matters: a tea, an oven, a call that has to end, a step that must wait so many minutes. For a span to feel rather than read, use the visual timer.',
        examples: [
            {
                title: 'Tea, three minutes',
                why: '`data-kp-countdown` takes a length; `data-kp-countdown-step` sets what “a minute more” adds.',
                markup: `
<div class="kp-countdown" data-kp-countdown="3:00" data-kp-countdown-name="Tea"></div>
`,
            },
            {
                title: 'A long timer, a step and a timer that is off',
                why: 'The format follows the length: `1:30:00` is h:mm:ss, `3:00` is m:ss, and it changes only when a press changes the length. `data-kp-countdown-step` is what the “more” button adds (60 seconds by default, written in seconds), and `data-kp-countdown-disabled` turns every button off. The digits stand in cells one `ch` wide, so no time ever moves the layout.',
                markup: `
<div class="kp-stack">
<div class="kp-countdown" data-kp-countdown="1:30:00" data-kp-countdown-name="Oven" data-kp-countdown-step="300"></div>
<div class="kp-countdown" data-kp-countdown="25m" data-kp-countdown-name="Focus"></div>
<div class="kp-countdown" data-kp-countdown="45s" data-kp-countdown-name="Not now" data-kp-countdown-disabled></div>
</div>
`,
            },
            {
                title: 'Running, and the end',
                why: '`countdownOf(el)` is the clock of an attached timer: `start()`, `pause()`, `reset(seconds)` and `add(seconds)`, with `remaining()` and `state()`. `data-kp-countdown-state` on the element follows it: `idle`, `running`, `paused` or `ended`. `kp-countdown-change` carries `{ state, remaining, total }` when a timer starts, pauses, resets or gains time, and `kp-countdown-end` carries `{ total }` when it is up; the plate then breathes three times and the line says “Time is up”.',
                markup: `
<div class="kp-countdown" id="doc-countdown-run" data-kp-countdown="0:08" data-kp-countdown-name="Eight seconds"></div>
<p class="kp-text-muted" id="doc-countdown-log" aria-live="polite">Starting in a moment.</p>
`,
                script: `
import { attachCountdowns, countdownOf } from '@kp-soft/themes/js/countdown';

const timer = document.getElementById('doc-countdown-run');
const log = document.getElementById('doc-countdown-log');
attachCountdowns(timer.parentElement);
timer.addEventListener('kp-countdown-change', (event) => {
    log.textContent = 'State: ' + event.detail.state + ', ' + Math.ceil(event.detail.remaining / 1000) + ' s left of ' + event.detail.total / 1000 + ' s.';
});
timer.addEventListener('kp-countdown-end', () => { log.textContent = 'The time is up.'; });
setTimeout(() => countdownOf(timer)?.start(), 800);
`,
            },
        ],
        variants: [
            { name: 'data-kp-countdown', what: 'The length: `3:00`, `1:30:00`, `25m`, `90` (seconds).' },
            { name: 'data-kp-countdown-name', what: 'The timer’s name, over the digits.' },
            { name: 'data-kp-countdown-step', what: 'What the add button adds; 60 seconds by default.' },
            { name: 'data-kp-countdown-disabled', what: 'Every button is off.' },
            { name: 'data-kp-countdown-state', what: 'Set by the script: `idle`, `running`, `paused` or `ended`.' },
        ],
        accessibility: [
            'Built in — the digits are a timer (`role="timer"`, not announced every second) with the time left in words for a screen reader; a status region says when it starts, pauses, goes on and ends, with the timer’s name.',
            'Built in — Start keeps one width for Start, Pause and Resume; the end is a word and a ring as well as a breath, still under reduced motion.',
            'Yours — name the timer, and keep one countdown per task: several running at once need their names to be told apart.',
        ],
    };
