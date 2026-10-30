// Page descriptor for the "pipeline" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const pipelineDescriptor = {
        id: 'pipeline',
        title: 'Pipeline',
        group: 'Data',
        classes: ['kp-pipeline'],
        aliases: ['dimmed', 'lane'],
        exports: [],
        intro: 'Where each item stands, a lane per stage: a read-only board, not a drag-and-drop one. `attachPipelines(root)` in js/pipeline.js fills `section.kp-pipeline[data-kp-pipeline]`; the page gives the lanes and the cards with `setPipeline(el, { lanes, cards })` and the state of the whole with `setPipelineState`. Each lane has a plate with its name and exact count in the stage’s colour (`tone` 1 to 5), its share of all, and its cards (a link with `href`, else a button; `mark`, `sub` and `meta` under the title). A lane marked `closed` stands under the board across its width. `data-kp-pipeline-limit="4"` keeps four cards per lane behind “+N more”; `data-kp-pipeline-share="false"` leaves the share out. Under 40rem of its own width the lanes turn to rows.',
        whenToUse:
            'When a reader asks how many items stand at each stage of one process and which: applications from draft to offer, deployments from queued to live. Not for moving items between stages (that is a form), and not for counts alone (use key figures).',
        examples: [
            {
                title: 'Applications by stage',
                why: 'The markup is the empty board; the script hands over the lanes and the cards. `tone` 1 to 5 is the stage’s colour on its plate, a card with `href` is a link and one without is a button, and `data-kp-pipeline-limit="4"` keeps four cards per lane behind “+N more” while the counts stay exact. Press a card: the page hears `kp-pipeline-open`, marks it with `setPipelineSelected` and says which in the line under the board.',
                markup: `
<section class="kp-pipeline" data-kp-pipeline data-kp-pipeline-limit="4" id="doc-pipeline" aria-label="Applications by stage"></section>
<p class="kp-text-muted" id="doc-pipeline-said" role="status">Nothing opened yet.</p>
`,
                script: `
import { attachPipelines, setPipeline, setPipelineSelected } from '@kp-soft/themes/js/pipeline';

const board = document.getElementById('doc-pipeline');
attachPipelines(board.parentElement);
setPipeline(board, {
    lanes: [
        { key: 'draft', label: 'Draft', tone: 1 },
        { key: 'sent', label: 'Sent', tone: 2 },
        { key: 'interview', label: 'Interview', tone: 3 },
        { key: 'offer', label: 'Offer', tone: 4 },
        { key: 'closed', label: 'Closed · no status', closed: true },
    ],
    cards: [
        { id: 'a1', lane: 'draft', title: 'Platform engineer', sub: 'Northwind', mark: 'NW' },
        { id: 'a2', lane: 'draft', title: 'Rust developer', sub: 'Contoso', mark: 'CO' },
        { id: 'a3', lane: 'sent', title: 'Frontend developer', sub: 'Acme', meta: '02/10/2026', mark: 'AC', href: '#acme' },
        { id: 'a4', lane: 'sent', title: 'Backend developer', sub: 'Globex', meta: '05/10/2026', mark: 'GL' },
        { id: 'a5', lane: 'sent', title: 'DevOps engineer', sub: 'Initech', meta: '07/10/2026', mark: 'IN' },
        { id: 'a6', lane: 'sent', title: 'Site reliability engineer', sub: 'Umbrella', meta: '08/10/2026', mark: 'UM' },
        { id: 'a7', lane: 'sent', title: 'Tooling developer', sub: 'Hooli', meta: '09/10/2026', mark: 'HO' },
        { id: 'a8', lane: 'interview', title: 'Full-stack developer', sub: 'Corvid', meta: '16/10/2026', mark: 'CV' },
        { id: 'a9', lane: 'offer', title: 'Software engineer', sub: 'Vandelay', meta: '12/10/2026', mark: 'VA' },
        { id: 'a10', lane: 'closed', title: 'Web developer', sub: 'Pied Piper', meta: '21/09/2026', mark: 'PP' },
    ],
});
const said = document.getElementById('doc-pipeline-said');
board.addEventListener('kp-pipeline-open', (event) => {
    setPipelineSelected(board, event.detail.id);
    said.textContent = 'Opened ' + event.detail.card.title + ' (' + event.detail.source + ').';
});
board.addEventListener('kp-pipeline-more', (event) => {
    said.textContent = 'The ' + event.detail.lane + ' lane shows ' + (event.detail.open ? 'every card' : 'four cards') + '.';
});
`,
            },
            {
                title: 'Loading, empty and failed: the lanes stay',
                why: '`setPipelineState(el, state, words)` takes `loading`, `ready`, `empty` or `error`. Loading keeps the lanes and lays the data table’s loading card over them, the cards are drawn once it has gone; empty shows every lane with “none” and one sentence on a plate above the lanes; error says why and offers Try again, which fires `kp-pipeline-retry`. Press Try again on the third board: it loads and then fills. `data-kp-pipeline-share="false"` leaves the share of all out of every lane here.',
                markup: `
<section class="kp-pipeline" data-kp-pipeline data-kp-pipeline-share="false" id="doc-pipeline-loading" aria-label="Applications, loading"></section>
<section class="kp-pipeline" data-kp-pipeline data-kp-pipeline-share="false" id="doc-pipeline-empty" aria-label="Applications, empty"></section>
<section class="kp-pipeline" data-kp-pipeline data-kp-pipeline-share="false" id="doc-pipeline-failed" aria-label="Applications, failed"></section>
`,
                script: `
import { attachPipelines, setPipeline, setPipelineState } from '@kp-soft/themes/js/pipeline';

const lanes = [
    { key: 'draft', label: 'Draft', tone: 1 },
    { key: 'sent', label: 'Sent', tone: 2 },
    { key: 'interview', label: 'Interview', tone: 3 },
    { key: 'offer', label: 'Offer', tone: 4 },
];
const loading = document.getElementById('doc-pipeline-loading');
const empty = document.getElementById('doc-pipeline-empty');
const failed = document.getElementById('doc-pipeline-failed');
attachPipelines(loading.parentElement);
setPipeline(loading, { lanes, cards: [] });
setPipelineState(loading, 'loading');
setPipeline(empty, { lanes, cards: [] });
setPipelineState(empty, 'empty', 'No applications yet. They appear here once you start one.');
setPipeline(failed, { lanes, cards: [] });
setPipelineState(failed, 'error', 'The database did not answer in 10 seconds.');
failed.addEventListener('kp-pipeline-retry', () => {
    setPipelineState(failed, 'loading');
    setTimeout(() => {
        setPipeline(failed, {
            lanes,
            cards: [
                { id: 'r1', lane: 'sent', title: 'Frontend developer', sub: 'Acme', mark: 'AC' },
                { id: 'r2', lane: 'interview', title: 'Full-stack developer', sub: 'Corvid', mark: 'CV' },
            ],
        });
        setPipelineState(failed, 'ready');
    }, 1500);
});
`,
            },
        ],
        variants: [
            { name: 'setPipelineState', what: '`setPipelineState(el, state, words)` with `loading`, `ready`, `empty` or `error`; `words` is the sentence of the empty and the failed plate.' },
            { name: 'setPipelineSelected', what: 'Marks the open card with `aria-current`, or none; answer `kp-pipeline-open` with it.' },
            { name: 'data-kp-pipeline', what: 'Marks the board; `attachPipelines` fills it.' },
            { name: 'data-kp-pipeline-limit', what: 'Cards per lane before “+N more” (a toggle, `aria-expanded`; `data-kp-pipeline-more` names its lane); 0 or none shows every card.' },
            { name: 'data-kp-pipeline-share', what: '`false`: no share of all under the lane’s plate.' },
            { name: 'data-kp-pipeline-more', what: 'On a lane’s “+N more” button: the lane it opens.' },
            { name: 'data-kp-lane', what: 'On a lane: its key.' },
            { name: 'data-kp-tone', what: 'On a lane and its cards: the stage’s colour, 1 to 5.' },
            { name: 'data-kp-dimmed', what: 'On a card filtered out but kept in its place: quieter ink and a dashed edge.' },
            { name: 'data-kp-state', what: 'On the board: `loading` (the lanes kept, the table’s loading card over them, cards drawn once it has gone), `ready`, `empty` (every lane says none, one sentence on a plate above the lanes) or `error` (the reason with Try again).' },
            { name: 'kp-pipeline-open', what: 'A card was opened: `{ id, card, source }`; a link is still followed.' },
            { name: 'kp-pipeline-retry', what: 'Try again on a failed board was pressed.' },
            { name: 'kp-pipeline-more', what: 'A lane shows more or fewer: `{ lane, open }`.' },
            { name: 'setPipelineSelected', what: 'Marks the open card (`aria-current`), or none.' },
            { name: 'empty and failed', what: 'The plate stands over the whole board (a footprint host, `data-kp-state="empty"`), and Retry fires `kp-pipeline-retry`.' },
            { name: 'danger', what: 'A lane field: marks the lane as one that needs attention (`.kp-pipeline__flag`, string `pipelineDanger`). Lane names wrap and the lanes share rows (a subgrid).' },
        ],
        accessibility: [
            'Built in — the board is a list of lanes named by their plates, each a list of cards; a count is the exact number.',
            'Built in — one tab stop: left and right to the neighbouring lane, up and down along a lane, Home and End to its first and last; Enter follows a link or presses a button.',
            'Yours — name the board (`aria-label`), and give a card a title that says what it is without its colour.',
        ],
    };
