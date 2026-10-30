// Page descriptor for the "job-line" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const jobLineDescriptor = {
        id: 'job-line',
        title: 'Job line',
        group: 'Feedback',
        classes: ['kp-jobline'],
        exports: [],
        aliases: [],
        intro: 'One sentence for a run that has steps and moves data: “Step 3 of 35 · 1.2 of 4 GB · about 2 min left”. The step comes from the step list it names, the bytes and the time left from the numbers a transfer already takes.',
        whenToUse: 'A backup, an import or an update that is a list of steps in which some steps copy data. For a single file use the transfer; for the steps alone use the step list.',
        examples: [
            {
                title: 'A backup in 35 steps',
                why: 'The line names its step list with `data-kp-jobline-for`; `setJobLine(line, { done, total, etaSeconds })` adds the bytes and the time left (or `rate`, bytes per second, and the time left is worked out). A part that is not known is left out with its separator.',
                markup: `
<ol class="kp-steplist" id="doc-job-steps" aria-label="Backup progress"></ol>
<p class="kp-jobline" id="doc-job-line" data-kp-jobline data-kp-jobline-for="#doc-job-steps"></p>
`,
                script: `
import { buildSteplist } from '@kp-soft/themes/js/steplist';
import { attachJobLines, setJobLine } from '@kp-soft/themes/js/job-line';

const rows = Array.from({ length: 35 }, (_, i) => ({ title: 'Step ' + (i + 1), state: i < 2 ? 'done' : i === 2 ? 'running' : 'pending' }));
document.getElementById('doc-job-steps').replaceWith(buildSteplist(rows, { label: 'Backup progress' }));
attachJobLines(document);
setJobLine(document.getElementById('doc-job-line'), { done: 1200000000, total: 4000000000, etaSeconds: 120 });
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachJobLines(root)` wires every `[data-kp-jobline]` and follows the step list it names; `setJobLine(line, { step, steps, done, total, etaSeconds, rate })` reports (a `null` takes a part back out); `buildJobLine({ label, steplist })` makes one; `jobLineText(report)` and `stepPosition(list)` are the two calculations. `JOBLINE` is the selector.' },
            { name: 'data-kp-jobline', what: 'The line. Its step position is the running step of the list named by `data-kp-jobline-for` (a selector), else the first step still waiting.' },
            { name: 'data-kp-bytes-base', what: '`1000` (default) or `1024`, as on the transfer.' },
            { name: 'kp-jobline', what: 'The event, bubbling from the line, when its text changed: `{ text }` (`JOBLINE_EVENT`).' },
            { name: 'states', what: 'Nothing reported yet says “Waiting to start”; a part that is not known is left out; the line is a status region that does not speak on every report, the step list announces the steps.' },
        ],
        accessibility: [
            'Built in — the line is `role="status"` with `aria-live="off"`, so it never talks over the step list; the digits are tabular; the words wrap anywhere.',
            'Yours — pass real numbers and name the step list, so the step position is the list’s own.',
        ],
    };
