// Page descriptor for the "timer" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const timerDescriptor = {
        id: 'timer',
        title: 'Kitchen timers',
        group: 'Feedback',
        classes: ['kp-timers', 'kp-timer'],
        exports: [],
        intro: 'Named countdowns that keep running side by side, each a card with its name, the time left large, the theme’s progress bar, Pause or Resume, +1 min and Remove. `data-kp-timers` on the list; js/timer.js (`startTimer`, `pauseTimer`, `resumeTimer`, `addTimerTime`, `stopTimer`, `getTimers`, `restoreTimers`, `askTimerNotifications`, `attachTimers`) counts from each end time, so a page in the background or a phone that locked shows the right time again, and ends a timer with the done plate, a soft chime, a buzz and a system notification when allowed. A button with `data-kp-timer-start="10m"` anywhere in the page starts one.',
        whenToUse: 'For clocks a person starts and keeps an eye on (cooking, a break, a session). For a notice that closes by itself use the alarm in its timed mode.',
        examples: [
            {
                title: 'A list and a starter in a sentence',
                why: 'The list draws its cards; a starter anywhere in the page names the duration (`10m`, `1h30m`, `90s`, `10:00` or seconds) and the timer. Pressed again while its timer runs it starts no second one: the focus goes to the one that runs. Each card has its name, a state word, the time left in figures of one width, the theme’s progress bar, Pause or Resume, +1 min and Remove, and nothing in it changes size as the clock runs. It counts from the moment it ends, so a page in the background shows the right time again. `startTimer(list, { name, seconds })` starts one from the page; the events are `kp-timer-start`, `kp-timer-change` (pause, resume, add, stop-ring), `kp-timer-done` and `kp-timer-stop`.',
                markup: `
<div class="kp-timers" data-kp-timers id="doc-timers" aria-label="Kitchen timers"></div>
<p>Let the sauce simmer for <button type="button" class="kp-button kp-button--sm" data-kp-timer-start="10m" data-kp-timer-name="Sauce" data-kp-timer-for="doc-timers">10 minutes</button>, then the rice <button type="button" class="kp-button kp-button--sm" data-kp-timer-start="90s" data-kp-timer-name="Rice" data-kp-timer-for="doc-timers">90 seconds</button>.</p>
<p class="kp-text-muted" id="doc-timers-said" role="status">No timer has run out.</p>
`,
                script: `
import { attachTimers, startTimer, addTimerTime } from '@kp-soft/themes/js/timer';

const timers = document.getElementById('doc-timers');
attachTimers(timers.parentElement);
startTimer(timers, { name: 'Eggs', seconds: 7 * 60 });
const said = document.getElementById('doc-timers-said');
timers.addEventListener('kp-timer-done', (event) => { said.textContent = event.detail.timer.name + ' is done.'; });
timers.addEventListener('kp-timer-change', (event) => { said.textContent = event.detail.timer.name + ': ' + event.detail.action + '.'; });
`,
            },
            {
                title: 'A timer that is about to ring, and the options of the list',
                why: 'This one ends in 4 seconds: the card turns to the done plate with the name large (“Toast is done”) and one big Stop; a soft two-note chime plays every few seconds, the phone buzzes where it can and the system shows a notification when the page has the permission (`askTimerNotifications()` asks, from a press). The list here has the sound off, so only the card tells. `data-kp-timers-ring` is how long it rings in seconds (60; 0 is once), `data-kp-timers-sound` is `chime`, `bell`, `buzzer` or `off`, `data-kp-timers-speak="on"` says the message aloud, `data-kp-timers-notify="false"` sends no notification and `data-kp-timers-empty` is the sentence of an empty list (the second list below).',
                markup: `
<div class="kp-timers" data-kp-timers data-kp-timers-sound="off" id="doc-timers-ring" aria-label="A timer that rings"></div>
<div class="kp-timers" data-kp-timers data-kp-timers-empty="Nothing is cooking. Press a duration to start a timer." id="doc-timers-empty" aria-label="Timers, none running"></div>
`,
                script: `
import { attachTimers, startTimer } from '@kp-soft/themes/js/timer';

const ring = document.getElementById('doc-timers-ring');
attachTimers(ring.parentElement);
startTimer(ring, { name: 'Toast', seconds: 4 });
`,
            },
        ],
        variants: [
            { name: 'data-kp-timers-sound', what: '`chime` (default, the soft two-note chime), `bell` (a wind-up kitchen timer’s hammer on two bells), `buzzer` (a harsher electronic beep) or `off`. All are made with Web Audio, no file; `playTimerSound()` plays one for a picker’s preview, from a press.' },
            { name: 'data-kp-timers-speak', what: '`on` says the timer’s message aloud with speech synthesis once the sound has played, again at every ring. The message is `data-kp-timer-say` on a starter, else “<name> is done”. Nothing is said, and nothing fails, where speech synthesis is missing.' },
            { name: 'data-kp-timer-start', what: 'On any button: the duration it starts (`10m`, `1h30m`, `90s`, `10:00` or seconds), with `-name`, `-for` (the list’s id; else the page’s first) and `-id`. `data-kp-timer-running` is written on it while its timer runs.' },
            { name: 'parseDuration', what: 'Re-exported from js/countdown.js; the clock is the countdown’s `formatCountdown`.' },
            { name: 'data-kp-timers-ring', what: 'How long an ended timer chimes, in seconds (60; 0 is once).' },
            { name: 'data-kp-timers-sound="off"', what: 'No chime.' },
            { name: 'data-kp-timers-notify="false"', what: 'No system notification even with the permission.' },
            { name: 'data-kp-timers-empty', what: 'The sentence of an empty list.' },
            { name: 'setTimersState(list, state, message)', what: '`loading`, `error` or `ready`; Retry fires `kp-timers-retry`. `data-kp-timers-empty` is now on the empty plate, and the least height of a state is one card’s.' },
        ],
        accessibility: [
            'Built in — each card is named by its timer; the time is a `timer` region that is read on demand, never every second.',
            'Built in — a start and the last minute are said politely, the end at once.',
            'Yours — ask for notifications from a press, and keep what getTimers() gives across a reload.',
        ],
    };
