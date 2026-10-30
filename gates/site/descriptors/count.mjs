// Page descriptor for the "count" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const countDescriptor = {
        id: 'count',
        title: 'Counting number',
        group: 'Feedback',
        classes: [],
        exports: [],
        aliases: ['count', 'counter', 'odometer', 'tick'],
        intro: 'A number that counts up to what it already says. The page writes the final figure; the effects module reads it, counts to it and puts the same string back — so a page that never loads the module, and a reader who asked for less movement, both simply see the number.',
        whenToUse:
            'For one or two figures that are the point of a page — a total, a score, a count of things done. Not for a table of numbers, where the movement makes the column unreadable, and not for anything a reader needs at once. The final number is authored in the HTML, so nothing is ever hidden behind the animation.',
        examples: [
            {
                title: 'A number that counts up to itself',
                why: 'The text is the truth. The module reads the number out of it, counts, and restores exactly what was written — separators, currency and all.',
                markup: `
<span data-kp-count>1204</span>
`,
            },
            {
                title: 'The page decides which separator is which',
                why: '`1.204` is one thousand two hundred and four in Dutch and one-point-two-oh-four in English, and the string alone does not say. The nearest `lang` decides, so the module never has to guess.',
                markup: `
<p lang="nl"><span data-kp-count>1.118.204,75</span></p>
<p lang="en"><span data-kp-count>1,204.50</span></p>
`,
            },
            {
                title: 'The two knobs, and the state a test or a consumer can read',
                why: 'How long the count takes and where it starts, both as custom properties. `--kp-count: 0` means no counting at all. The state attribute is written by the module and readable at any moment, so nothing has to have been listening.',
                markup: `
<span data-kp-count style="--kp-count: 1200; --kp-count-from: 100" data-kp-count-state="done">640</span>
`,
            },
            {
                title: 'A live number that ticks when its text changes',
                why: '`[data-kp-count]` counts once, when a number first arrives. A live counter changes after that: mark it with `data-kp-tick`, write the new number the way you always do (or let the framework re-render it), and the module counts from the number shown to the new one, ending on exactly the text that was written, never a rounded or shortened one. It writes into the element’s own text node, so a framework that owns that node still finds it. `tickTo(el, text, { from, duration })` is the same by call, and down counts too. While it runs the element carries `aria-busy="true"` and `data-kp-tick-state="running"` (`done` after), so a live region speaks only the number it lands on, and `kp-tick` fires when it lands with `{ value }`. The nearest `lang` says which separator groups: `1.204` is a thousand two hundred and four in Dutch.',
                markup: `
<div class="kp-stack">
<p><strong class="kp-kpi__value" id="doc-tick-open" data-kp-tick>12</strong> open items</p>
<p lang="nl"><strong class="kp-kpi__value" id="doc-tick-nl" data-kp-tick>1.204</strong> bestanden</p>
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="Change the numbers">
<button type="button" class="kp-button" id="doc-tick-up">The next poll says 15</button>
<button type="button" class="kp-button" id="doc-tick-down">Back down to 12</button>
<button type="button" class="kp-button" id="doc-tick-call">Tick by call, over 2 s</button>
</div>
<pre class="kp-code-block" id="doc-tick-log" aria-live="polite">Press a button.</pre>
</div>
`,
                script: `
import { TICK_EVENT, attachTicks, tickTo } from '@kp-soft/themes/js/tick';

const open = document.getElementById('doc-tick-open');
const dutch = document.getElementById('doc-tick-nl');
attachTicks(open.closest('.kp-stack'));
document.getElementById('doc-tick-up').addEventListener('click', () => {
    open.textContent = '15'; // written the way a poll would; the module notices
    dutch.textContent = '1.210';
});
document.getElementById('doc-tick-down').addEventListener('click', () => {
    open.textContent = '12';
    dutch.textContent = '1.204';
});
document.getElementById('doc-tick-call').addEventListener('click', () => tickTo(dutch, '1.500', { from: 1204, duration: 2000 }));
document.addEventListener(TICK_EVENT, (event) => (document.getElementById('doc-tick-log').textContent = 'kp-tick { value: ' + event.detail.value + ' }'));
`,
            },
        ],
        variants: [
            { name: 'data-kp-tick', what: 'Marks a number that ticks to its new value when its text is changed by anyone but the module. The first text is the number shown; after that every change counts from the last number shown to the new one.' },
            { name: 'data-kp-tick-state', what: 'Written by the module: `running` while it counts (with `aria-busy="true"` on the element, so a live region speaks only the number it lands on), `done` after, and from the first moment it is attached.' },
            { name: 'kp-tick', what: 'Fires on the element, bubbling, when a tick lands: `{ value }`, the number it landed on (`null` when the text held no number and was written at once).' },
            { name: 'tickTo(el, text, { from, duration })', what: 'The same by call. `text` left out means the element’s own text is the target; `from` is the number to start at (the one last shown by default) and `duration` the length in ms. Without a number in either, `text` is written at once.' },
            { name: 'parseTick(text, locale)', what: 'The first number in a text in the shape the locale writes numbers, with a `render(value)` that writes another value back in the same shape (the same text around it, the same grouping and decimals); `null` when the text holds no number.' },
            { name: 'attachTicks(root) and TICK_MS', what: '`attachTicks(root)` watches every `[data-kp-tick]` under it, including those added later, and returns a detach that makes every running tick land on its number. `TICK_MS` is the default length, 600 ms.' },
            { name: 'a jump too long to follow', what: 'More than 400 steps of the number’s precision is drawn as 400, ending on the real number; a reader who asked for less motion, and a tick length of 0, see the new number at once.' },
        ],
        accessibility: [
            'The final number is written in the HTML, so a page without the module and a reader with reduced motion both see the real figure — the count is decoration over content that is already there.',
            'At the reduced-motion setting the number never changes at all: it is not counted quickly, it is not counted.',
            'The number is not announced while it counts. A screen reader reads the element once, with the figure the page authored.',
            'The nearest `lang` decides which separator groups and which one is the decimal point, so a number never counts through the wrong notation.',
        ],
    };
