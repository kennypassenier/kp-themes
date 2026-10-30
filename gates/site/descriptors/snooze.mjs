// Page descriptor for the "snooze" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const snoozeDescriptor = {
        id: 'snooze',
        title: 'Snooze picker',
        group: 'Forms',
        classes: ['kp-snooze'],
        exports: [],
        aliases: ['look', 'now', 'snoozed', 'snoozed-state', 'snoozed-until'],
        intro: 'A “remind me later” picker: a button with a menu (or a row of chips) of quick choices, each over the exact moment it means, and a date and time of your own. Choices that have passed or lie too far away are left out.',
        whenToUse: 'Where a reminder, a notification or a to-do can be put off. For choosing a date only, use the date picker.',
        examples: [
            {
                title: 'The mix, as chips',
                why: 'Each choice stands over the exact moment it means, so nobody works out when “1 day” falls. The choices are `15m`, `1h`, `4h` (any number with m, h, d or w), `tonight`, `tomorrow`, `monday`, `next-week` and `pick`, the last a panel with a date and a time. A choice that has passed (tonight, after the evening hour) or lies past `data-kp-snooze-max` (7d) is left out, not greyed. `data-kp-now` fixes the clock here so the moments stay the same. The page hears `kp-snooze` with `{ until, choice }`, stores the moment and tells the picker back with `setSnoozedUntil`, while it saves with `setSnoozeBusy`. “Your last pick” is offered at the top; `data-kp-remember` keeps it across visits.',
                markup: `
<div class="kp-snooze" id="doc-snooze" data-kp-snooze data-kp-snooze-choices="1h 4h tonight tomorrow monday pick" data-kp-now="2026-10-18T15:00:00+02:00"></div>
<p class="kp-text-muted" id="doc-snooze-said" role="status">Not snoozed.</p>
`,
                script: `
import { attachSnoozes, setSnoozeBusy, setSnoozedUntil } from '@kp-soft/themes/js/snooze';

const picker = document.getElementById('doc-snooze');
attachSnoozes(picker.parentElement);
const said = document.getElementById('doc-snooze-said');
picker.addEventListener('kp-snooze', (event) => {
    setSnoozeBusy(picker, true);
    said.textContent = 'Saving ' + event.detail.choice + '...';
    setTimeout(() => {
        setSnoozeBusy(picker, false);
        setSnoozedUntil(picker, event.detail.until);
        said.textContent = 'Snoozed until ' + event.detail.until + '.';
    }, 800);
});
picker.addEventListener('kp-snooze-end', () => {
    setSnoozedUntil(picker, null);
    said.textContent = 'Snooze ended.';
});
`,
            },
            {
                title: 'As a menu, with its own hours, and already snoozed',
                why: '`data-kp-look="menu"` is a button with the package’s menu (arrow keys, Home, End, Esc) instead of the row of chips. `data-kp-snooze-morning` and `-evening` say what tomorrow, Monday and next week, and tonight, mean (09:00 and 18:00 by default); `data-kp-snooze-max` the longest a reminder may be put off. `data-kp-snoozed-until` shows “Snoozed until …” with End snooze, which fires `kp-snooze-end`; `openSnoozePanel` opens the date and time panel from the page. `data-kp-time-zone` names another zone.',
                markup: `
<div class="kp-snooze" id="doc-snooze-menu" data-kp-snooze data-kp-look="menu" data-kp-snooze-choices="15m 1h tomorrow next-week pick" data-kp-snooze-morning="07:30" data-kp-snooze-max="30d" data-kp-now="2026-10-18T15:00:00+02:00"></div>
<div class="kp-snooze" data-kp-snooze data-kp-snoozed-until="2026-10-19T09:00:00+02:00" data-kp-now="2026-10-18T15:00:00+02:00"></div>
`,
                script: `
import { attachSnoozes } from '@kp-soft/themes/js/snooze';

attachSnoozes(document.getElementById('doc-snooze-menu').parentElement);
`,
            },
        ],
        variants: [
            { name: 'snooze / snoozeChoices / dayAt', what: '`snooze(el)` is the handle of a picker (`until`, `setUntil`, `setBusy`, `choices`, `openPanel`, `closePanel`); `snoozeChoices` computes the choices and their moments for a clock; `dayAt` is a day at a time in a zone.' },
            { name: 'kp-snooze / kp-snooze-end', what: '`kp-snooze` carries `{ until, choice }` (`SNOOZE_EVENT`); End snooze fires `kp-snooze-end` (`SNOOZE_END_EVENT`).' },
            { name: 'data-kp-snooze-choices', what: 'The choices, space separated: `15m`, `1h`, `4h`, `tonight`, `tomorrow`, `monday`, `next-week`, `pick`.' },
            { name: 'data-kp-snooze-morning', what: 'What tomorrow, Monday and next week mean; 09:00.' },
            { name: 'data-kp-snooze-evening', what: 'What tonight means; 18:00.' },
            { name: 'data-kp-snooze-max', what: 'The longest a reminder may be put off; 7d.' },
            { name: 'data-kp-look', what: '`chips` (default) or `menu`.' },
            { name: 'data-kp-snoozed-until', what: 'An ISO moment: shows “Snoozed until …” with End snooze.' },
            { name: 'data-kp-remember', what: 'A name: the last custom moment is kept across visits.' },
            { name: 'width', what: 'The snooze picker takes the width of its cell, row or bar (it is no longer a size container); End snooze wraps under the button.' },
        ],
        accessibility: [
            'Built in — the menu is the package’s menu (arrow keys, Home, End, Esc); the status line is read when it changes; the panel takes the focus and gives it back and names what is wrong in a field.',
            'Yours — store the moment the event carries, and call `setSnoozedUntil` back; name the picker after what it puts off.',
        ],
    };
