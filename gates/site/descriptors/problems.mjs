// Page descriptor for the "problems" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const problemsDescriptor = {
        id: 'problems',
        title: 'Problem alert',
        group: 'Feedback',
        classes: ['kp-problem', 'kp-problems'],
        exports: [],
        aliases: ['remedy-label', 'sig'],
        intro: 'An alert with three fixed parts: what is wrong, why, and what to do now, with the fix beside them. It has the shape of an error and its remedy. A container updates its problems by key, so one that is still true is the same element, is not announced again and keeps the focus on its fix.',
        whenToUse: 'Something is wrong and the person can fix it: a calendar that is not shared, a setting that is missing. For a passing message use the toast; for a plain note use the alert.',
        examples: [
            {
                title: 'One alert with the three parts',
                why: 'Plain markup, no script needed.',
                markup: `
<div class="kp-alert kp-alert--warning" role="alert">
<strong class="kp-alert__what">The calendar is not shared</strong>
<span class="kp-alert__why">Almanac cannot read it.</span>
<span class="kp-alert__remedy">Share it with the service account.</span>
</div>
`,
            },
            {
                title: 'Several problems in a container',
                why: '`setProblems` takes the items; `data-kp-problems-mode` chooses `each`, `list` or `fold`.',
                markup: `
<div class="kp-problems" data-kp-problems data-kp-problems-mode="each"></div>
`,
                script: `
import { attachProblems, setProblems } from '@kp-soft/themes/js/problems';

const box = document.querySelector('[data-kp-problems]');
attachProblems(box.parentElement);
setProblems(box, [
    { key: 'calendar', what: 'The calendar is not shared', why: 'Almanac cannot read it.', remedy: 'Share it with the service account.' },
    { key: 'token', what: 'The API token has expired', why: 'Requests are refused.', remedy: 'Create a new one.', command: 'chassis token renew', severity: 'critical' },
]);
`,
            },
            {
                title: 'The parts, the severities and a command to copy',
                why: 'An alert is three fixed parts in the theme’s own plate: `.kp-alert__what` (the line the eye reads first), `__why` and `__remedy` (with `__remedy-label`, “What now”). `__actions` holds the fix beside the text, and under it on a narrow container. A `__command` is a command with its Copy button; `data-kp-remedy-label` changes the word before the remedy. The severity is the alert’s tone: `kp-alert--destructive`, `--warning` or `--info`.',
                markup: `
<div class="kp-stack">
<div class="kp-alert kp-alert--destructive" role="alert">
<strong class="kp-alert__what">The API token has expired</strong>
<span class="kp-alert__why">Every request is refused since 03:00.</span>
<span class="kp-alert__remedy"><span class="kp-alert__remedy-label">What now</span> Create a new token and paste it in Settings.</span>
<span class="kp-alert__actions"><button class="kp-button kp-button--primary" type="button">Open Settings</button></span>
</div>
<div class="kp-alert kp-alert--info" role="status">
<strong class="kp-alert__what">The disk will be full in nine days</strong>
<span class="kp-alert__why">It grows by 4 GB a day.</span>
<span class="kp-alert__remedy"><span class="kp-alert__remedy-label">Free some space</span> Remove old snapshots.</span>
</div>
</div>
`,
            },
            {
                title: 'Each mode, dismissing and the problem layout',
                why: '`data-kp-problems-mode` is `each` (an alert per problem, the worst first), `list` (one alert holding every problem, in the tone of the worst, as `__summary` and `__list` of `__item`s) or `fold` (from `data-kp-problems-fold-from` problems the worst stays open and “Show the other N” holds the rest). `data-kp-problem-layout="inline"` runs what, why and remedy into one paragraph. A problem is `dismissible` only when the page says so, and a dismissal fires `kp-problem-dismiss` with the problem’s key. An item takes `severity`, `command` (set in code, with its Copy), `action` and `dismissible`. The container keeps its place when it holds none, so the page does not jump. Knobs: `--kp-problem-gap`, `--kp-problem-tint` and `--kp-problem-icon`.',
                markup: `
<div class="kp-stack">
<div class="kp-problems" id="doc-problems-list" data-kp-problems data-kp-problems-mode="list" aria-label="Problems in a list"></div>
<div class="kp-problems" id="doc-problems-fold" data-kp-problems data-kp-problems-mode="fold" data-kp-problems-fold-from="3" data-kp-remedy-label="Fix" aria-label="Problems folded"></div>
<div class="kp-problems" id="doc-problems-each" data-kp-problems data-kp-problems-mode="each" data-kp-problem-layout="inline" aria-label="Problems that can be dismissed"></div>
<p class="kp-text-muted" id="doc-problems-log" aria-live="polite"></p>
</div>
`,
                script: `
import { setProblems } from '@kp-soft/themes/js/problems';

const items = [
    { key: 'token', what: 'The API token has expired', why: 'Requests are refused.', remedy: 'Create a new one.', command: 'chassis token renew', severity: 'critical' },
    { key: 'calendar', what: 'The calendar is not shared', why: 'Almanac cannot read it.', remedy: 'Share it with the service account.', severity: 'warning', dismissible: true },
    { key: 'disk', what: 'The disk is 91 % full', why: 'Backups may fail.', remedy: 'Remove old snapshots.', severity: 'info', dismissible: true },
    { key: 'cert', what: 'A certificate runs out in 9 days', why: 'Browsers will warn.', remedy: 'Renew it.', severity: 'warning' },
];
setProblems(document.getElementById('doc-problems-list'), items.slice(0, 3));
setProblems(document.getElementById('doc-problems-fold'), items);
setProblems(document.getElementById('doc-problems-each'), items.slice(1, 3));
document.addEventListener('kp-problem-dismiss', (event) => {
    document.getElementById('doc-problems-log').textContent = 'Dismissed: ' + event.detail.key;
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-problems-mode', what: '`each` (default: one alert per problem, the worst first), `list` (one alert holding every problem, the tone of the worst) or `fold`.' },
            { name: 'data-kp-problems-fold-from', what: 'With `fold`: from this count (5 by default, at least 2) one alert holds the worst open and “Show the other N”. Change it at any time, like the mode.' },
            { name: 'data-kp-remedy-label', what: 'The word before the remedy; “What now” by default.' },
            { name: 'data-kp-problem-layout', what: '`stacked` (default) or `inline`, which runs what, why and remedy into one paragraph.' },
            { name: 'per item', what: '`severity` (`critical`, `warning` default, `info`), `command` (set in code with a Copy button), `action`, `dismissible` (default off: a real problem is not closable until it is fixed).' },
            { name: 'shared columns', what: 'Alerts of one `.kp-problems` share four columns (icon, text, fix, close) from 34rem, so every text ends and every fix starts on one edge. A `data-kp-subgrid` list shares the form grid’s columns and a list directly in a form grid spans its tracks.' },
        ],
        accessibility: [
            'Built in — an alert that is still true is not announced again, and the focus stays on its fix; a command has a Copy button that says it copied.',
            'Yours — write the three parts as sentences a person can act on, and give each problem a stable key.',
        ],
    };
