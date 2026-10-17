// research/kpadopt4 (recipes sections) · 3, kitchen timers (mock data; the timers are js/timer.js).
import { byId, say } from './recipes-kit.js';
import { SEGMENTED_EVENT } from '../../js/segmented.js';
import {
    TIMER_CHANGE_EVENT,
    TIMER_DONE_EVENT,
    TIMER_START_EVENT,
    TIMER_STOP_EVENT,
    askTimerNotifications,
    attachTimers,
    getTimers,
    pauseTimer,
    playTimerSound,
    startTimer,
} from '../../js/timer.js';

const section = byId('timers');
const list = byId('kc-timers');
attachTimers(section);

startTimer(list, { name: 'Rice', seconds: 12 * 60 + 30, id: 'rice' });
startTimer(list, { name: 'Preheat the oven', seconds: 8 * 60, id: 'oven' });
pauseTimer(list, 'oven');
startTimer(list, { name: 'Sweet potato wedges, turned once halfway through', seconds: 35 * 60, id: 'wedges' });
startTimer(byId('kc-timers-phone'), { name: 'Pasta', seconds: 9 * 60, id: 'pasta' });

byId('kc-t-five').addEventListener('click', () => startTimer(list, { name: 'Soft-boiled egg', seconds: 5 }));
const log = byId('kc-t-log');
// The sound picker and the speak switch only write the list's own two attributes.
byId('kc-t-sound').addEventListener(SEGMENTED_EVENT, (event) => {
    const { value } = /** @type {CustomEvent} */ (event).detail;
    list.setAttribute('data-kp-timers-sound', value);
    playTimerSound(value);
});
byId('kc-t-preview').addEventListener('click', () => {
    const picked = list.getAttribute('data-kp-timers-sound') ?? 'chime';
    say(log, `preview · ${picked} · ${playTimerSound(picked).toFixed(1)} s`);
});
byId('kc-t-speak').addEventListener('change', (event) =>
    list.setAttribute('data-kp-timers-speak', /** @type {HTMLInputElement} */ (event.target).checked ? 'on' : 'off'),
);
byId('kc-t-allow').addEventListener('click', async () => say(log, `notification permission: ${await askTimerNotifications()}`));
byId('kc-t-state').addEventListener('click', () => {
    say(
        log,
        `getTimers: ${getTimers(list)
            .map((t) => `${t.name} ${t.state} ${t.remaining}s`)
            .join(' · ')}`,
    );
});
for (const type of [TIMER_START_EVENT, TIMER_CHANGE_EVENT, TIMER_DONE_EVENT, TIMER_STOP_EVENT]) {
    section.addEventListener(type, (event) => {
        const { timer, action } = /** @type {CustomEvent} */ (event).detail;
        say(log, `${type} · ${timer.name}${action ? ` · ${action}` : ''} · ${timer.remaining}s left`);
    });
}
