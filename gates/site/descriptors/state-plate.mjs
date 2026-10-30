// Page descriptor for the "state-plate" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const statePlateDescriptor = {
        id: 'state-plate',
        title: 'State plate',
        group: 'Feedback',
        classes: ['kp-stateplate'],
        exports: [],
        intro: 'How every data component draws an empty or failed area: one plate, the title at the heading size over an optional picture, a sentence, and a normal-size action. `statePlate(doc, options)` in js/state-plate.js builds one; `hostStatePlate(host, options)` is the data component’s version, which also fires the component’s own `kp-<component>-retry` on the host.',
        whenToUse: 'When a component of your own shows nothing or has failed: use the plate instead of a sentence in a corner, so the area keeps its size and the reader gets a Retry. The packaged data components already use it; reach for it directly only for an area they do not own.',
        examples: [
            {
                title: 'Empty and failed, with a drawing',
                why: '`kind: "empty"` is the package’s empty plate, `kind: "error"` the destructive alert; both carry `.kp-stateplate`, which centres the words in the whole box it is given. `art` is a node (an inline SVG) or a glyph, aria-hidden either way, shown over the title. The action is a normal-size button, never a strip.',
                markup: `
<div class="kp-stack kp-gap-md">
<div id="doc-sp-empty" style="display: grid; min-block-size: 10rem"></div>
<div id="doc-sp-error" style="display: grid; min-block-size: 10rem"></div>
</div>
`,
                script: `
import { statePlate } from '@kp-soft/themes/js/state-plate';

document.getElementById('doc-sp-empty').append(
    statePlate(document, { kind: 'empty', title: 'No secrets yet', text: 'Add the first one and it appears here.', actionLabel: 'Add a secret', art: '∅' }),
);
document.getElementById('doc-sp-error').append(
    statePlate(document, { kind: 'error', title: 'Could not read the secrets', text: 'The vault did not answer.', actionLabel: 'Retry', onAction: () => {}, art: '!' }),
);
`,
            },
            {
                title: 'A data component’s host: Retry as an event',
                why: '`hostStatePlate(host, { kind, title, text, art, retryEvent })` puts the plate where the data was and fires the event on the host, so a page listens to `kp-heat-retry`, `kp-matrix-retry`, `kp-gantt-retry`, `kp-week-retry` or `kp-graph-retry` as it does on every other component (the data table keeps `kp-datatable-retry`).',
                markup: `
<div id="doc-sp-host" style="display: grid; min-block-size: 10rem"></div>
<p class="kp-text-muted" id="doc-sp-host-note" role="status"></p>
`,
                script: `
import { hostStatePlate } from '@kp-soft/themes/js/state-plate';

const host = document.getElementById('doc-sp-host');
host.addEventListener('kp-doc-retry', () => {
    document.getElementById('doc-sp-host-note').textContent = 'Retry pressed.';
});
host.replaceChildren(hostStatePlate(host, { kind: 'error', title: 'The grid did not load', text: 'Try again in a moment.', retryEvent: 'kp-doc-retry' }));
`,
            },
        ],
        variants: [
            { name: '.kp-stateplate', what: 'The plate: the title at the heading size, a normal-size action, centred in the whole box it is given. A component with a loaded height holds it while a plate shows; one without one takes the plate’s least height.' },
            { name: 'art', what: 'A node (an inline SVG) or a glyph over the title; hidden from a screen reader either way.' },
            { name: 'covered tables and boards', what: 'A failed table and a table with nothing to show cover their rows and the plate fills the height the table had; the rows stay in the document. The heat grid, matrix, run timeline, week agenda, network graph, pipeline, uptime strip, checklist, timers and the sequencer draw their empty and failed areas with it.' },
            { name: 'setHeat, setMatrix and the state setters', what: '`setHeat` and `setMatrix` take `message`, `text` and `art`; `setGraphState`, `setGanttState` and `setWeekState` take `{ text, art }` as a fourth argument.' },
            { name: 'strings', what: 'The words are in the dictionary (Retry, the failed sentence, the graph’s empty and failed lines), so a locale changes them in one place.' },
        ],
        accessibility: [
            'Built in — the title and sentence are real text in reading order, the action is a real button with the visible words as its name, the picture is hidden from a screen reader.',
            'Yours — write a title that says what is missing or what failed, a sentence that says what to do, and answer the Retry event by loading again.',
        ],
    };
