// Page descriptor for the "path-trace" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const pathTraceDescriptor = {
        id: 'path-trace',
        title: 'Path of a connection',
        group: 'Feedback',
        classes: ['kp-trace'],
        aliases: ['trace', 'density'],
        exports: [],
        intro: 'The way one connection takes, hop by hop: each hop allowed (a check) or refused (a cross), the hops after the first refusal dimmed as “not reached”, a summary line over them (“Blocked at rule IoT to media”) and the deciding rule as a chip.',
        whenToUse: 'A firewall or routing question: “can this device reach that service, and where does it stop?”. It draws hops it is given; the host works out the verdicts. Not for progress over time: use the step list.',
        examples: [
            {
                title: 'A connection stopped at a rule',
                why: 'The summary says where it stopped; the hop after it is not reached.',
                markup: `
<div class="kp-trace" data-kp-trace id="doc-trace" data-kp-trace-copy></div>
`,
                script: `
import { setTrace } from '@kp-soft/themes/js/path-trace';
setTrace(document.getElementById('doc-trace'), [
    { title: 'tv', note: 'IoT network', verdict: 'allowed' },
    { title: 'Firewall', note: 'tcp 8096', verdict: 'refused', rule: 'IoT to media' },
    { title: 'Jellyfin', note: 'media network', verdict: 'allowed' },
]);
`,
            },
            {
                title: 'Every hop on its own, and the states',
                why: '`data-kp-trace-stop="all"` shows each hop’s own verdict, for a “what if”: nothing is dimmed after a refusal. `data-kp-trace-swap` adds a Swap button (and the key S) that fires `kp-trace-swap`, for a form that swaps source and target; the rule can stand inline in the note (`data-kp-trace-rule="inline"`) and the whole trace can be copied as text. A hop with no verdict is “not measured”. `trace(el).setState(state, { message })` shows the trace running (the busy card over placeholder hops), empty or failed (Retry); the last two traces below are running and failed.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-trace-more">
<div class="kp-trace" data-kp-trace id="doc-trace-all" data-kp-trace-stop="all" data-kp-trace-rule="inline" data-kp-trace-swap data-kp-trace-copy data-kp-density="compact"></div>
<div class="kp-trace" data-kp-trace id="doc-trace-running"></div>
<div class="kp-trace" data-kp-trace id="doc-trace-failed"></div>
</div>
`,
                script: `
import { attachTraces, setTrace, trace, traceSummary, traceText } from '@kp-soft/themes/js/path-trace';

attachTraces(document.getElementById('doc-trace-more'));
const hops = [
    { title: 'tv', note: 'IoT network', verdict: 'allowed' },
    { title: 'Firewall', note: 'tcp 8096', verdict: 'refused', rule: 'IoT to media' },
    { title: 'Jellyfin', note: 'media network', verdict: 'allowed' },
    { title: 'Disk', note: 'not measured' },
];
setTrace(document.getElementById('doc-trace-all'), hops);
trace(document.getElementById('doc-trace-running')).setState('running');
trace(document.getElementById('doc-trace-failed')).setState('error', { message: 'The firewall did not answer.' });
document.getElementById('doc-trace-all').addEventListener('kp-trace-swap', () => console.info(traceSummary(hops, 'all'), traceText(hops, 'all')));
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachTraces(root)` wires every `[data-kp-trace]` and returns a detach; `setTrace(el, hops)` hands over the hops (`{ title, note, verdict, rule }`); `trace(el)` answers the handle; `traceStates(hops, stop)`, `traceSummary(hops, stop)` and `traceText(hops, stop)` are the verdicts, the summary line and the copy text on their own. `TRACE` is the selector.' },
            { name: 'events', what: '`kp-trace-rule` `{ rule, hop }` when the rule chip is pressed, `kp-trace-swap` for the Swap button and the key S, `kp-trace-retry` for Retry in a failed trace (`TRACE_RULE_EVENT`, `TRACE_SWAP_EVENT`, `TRACE_RETRY_EVENT`).' },
            { name: '.kp-steplist--trace', what: 'The step list’s modifier the trace is drawn with (`.kp-steplist.kp-steplist--trace`, js/steplist.js): an allowed hop is `done` with the check, a refused one `failed` with the cross, the hops after the first refusal `skipped` (“Not reached”) and a hop with no verdict `pending` (“Not measured”).' },
            { name: '.kp-trace__summary / __stage / __foot', what: 'The summary line over the hops (“Blocked at rule IoT to media”, a polite status), the hops and the foot with the copy and swap buttons.' },
            { name: '.kp-trace__rule / __copy / __swap / __busy', what: 'The deciding rule as a keyboard-reachable chip (a `.kp-badge`), the Copy and Swap buttons and the busy card of a running trace.' },
            { name: 'data-kp-trace-layout', what: '`auto` (default: a row, a column under 30rem of its own width), `row` or `column`.' },
            { name: 'data-kp-trace-stop', what: '`first-refusal` (default) or `all`, each hop’s own verdict for a “what if”.' },
            { name: 'data-kp-trace-verdict', what: '`both` (default), `mark` or `word`; never colour alone.' },
            { name: 'data-kp-trace-rule', what: '`chip` (default, keyboard-reachable), `inline` or `off`.' },
            { name: 'data-kp-state', what: '`running` (the busy card over placeholder hops), `empty` (“Pick a source and a target”) or `error` (Retry), each as high as the trace was.' },
            { name: 'the verdict column', what: 'In a column the verdict word has one column shared by every hop (a subgrid of the list’s tracks).' },
        ],
        accessibility: [
            'Built in — an ordered list; each hop reads “title, allowed” (or refused, not reached, not measured); the summary is a polite status, so a changed pin is announced; the rule chip is a button.',
            'Yours — the verdicts: the trace does not decide, it shows what the host measured.',
        ],
    };
