// Forest's skeleton, five pictures (Kenny, 2026-10-07: the diagonal stripes
// "do not give forest vibes"; the planted tree line he likes).
//
// A review-kit demo in aspect mode, forest only, ONE aspect: which picture
// the skeleton's shapes (block, circle, lines) are drawn with. Five options,
// the recommendation first, one of them exactly what the package draws today.
// Every option shows the same scene with the package's own markup: a block, an
// avatar circle, three text lines, a chart that is loading (its frame, legend
// stubs and the state box, as js/chart.js writes them) and a datatable row of
// three loading cells (as js/datatable.js writes them). options.css draws
// the pictures, keyed on the card's `data-sk-fx`; this file writes the cards
// and the demo's tools (restart, speed, reduced-motion preview). Nothing here
// moves anything: every loop is CSS.

/**
 * @typedef {{ fx: string, name: string, see: string, picture: string, appears: string, time: string, leaves: string, reads: string, verdict: string }} Option
 * @type {Option[]}
 */
const OPTIONS = [
    {
        fx: 'treeline',
        name: 'The treeline fills in',
        see: 'A landscape in the ground: two ridges rise from the foot, the far one first, and then the tree line walks across their foot, whole trees only, start to end. Block, avatar and chart show ridges and trees; a text line or a cell is too low for a ridge and shows the tree line with a hint of hill.',
        picture: 'two ridges and a tree line',
        appears: 'ridges rise, trees walk start → end',
        time: '3200 ms',
        leaves: 'trees walk back, ridges sink',
        reads: 'every shape; the trees are what you already like',
        verdict:
            'Recommended: it keeps what you like, the tree line of whole trees walking start to end, and gives the block, the avatar and the chart a ground to stand in (two ridges rising behind it), so every shape is a piece of one landscape and loading is still planting (G9). Honest limit: a text line or a cell is too low for a ridge, so there it is the tree line with a hint of hill.',
    },
    {
        fx: 'rings',
        name: 'Growth rings',
        see: 'The cut end of a log: twelve rings drawn outward from an off-centre pith, one at a time, in two tones of wood, with a bark rim. The rings scale with the shape, so the avatar is a whole log and the block a stump’s end; a text line shows a few rings across.',
        picture: 'twelve growth rings, bark, pith',
        appears: 'ring by ring from the pith, outward',
        time: '3200 ms, twelve steps in and out',
        leaves: 'the outer ring goes first',
        reads: 'avatar and block best; thin lines show only a few bands',
        verdict:
            'Not recommended as the first: the best-looking picture on its own (a log’s end, rings counted one by one, the wood to the tree line’s map), and in grammar (rings are a round count, G14). But it shows the wood after the tree, where G9 says loading is planting, and on a text line or a cell it is a few thin ellipses that read as grain.',
    },
    {
        fx: 'leaf',
        name: 'A leaf',
        see: 'Every shape is a green-tinged leaf (the leaf corner is its tip): a midrib is drawn from the start to the end and the veins branch off it, forward and outward, alternate, up and down, as the front passes.',
        picture: 'a leaf: midrib and alternate veins',
        appears: 'the midrib walks, the veins grow off it',
        time: '3200 ms',
        leaves: 'veins withdraw into the midrib, then it recedes',
        reads: 'block, avatar and chart; a line is a thin leaf',
        verdict:
            'Not recommended: the calmest and cleanest of the five, and the leaf corner finally does something. But its veins are sparse on a small shape (a text line holds three or four), a leaf is a second motif next to the trees, and G14 gives the trees to loading.',
    },
    {
        fx: 'survey',
        name: 'The survey',
        see: 'A map being drawn: seven irregular contour loops round one summit, the surveyor working from the outer loop inward, thin lines on the ground, every third one heavier; when the last loop is closed a clay trig point is set on the summit. The drawing stretches to the shape, so a wide block holds long flat loops and an avatar a small hill.',
        picture: 'contour loops and a trig point',
        appears: 'loops drawn outside in, then the trig point',
        time: '3200 ms',
        leaves: 'the trig point first, then the loops from the inside out',
        reads: 'block, avatar and chart; a line shows two or three loops',
        verdict:
            'Not recommended: the most map of the five and the only one that uses the clay (a trig point is a mark on the map, G5, G14). But its loops are the page’s own contour texture, so the skeleton partly dissolves into the card it stands on, and a text line is a few flat ellipses.',
    },
    {
        fx: 'plot',
        name: 'A plot being planted (today)',
        see: 'What the package draws now: cleared ground in a dashed leaf-cornered boundary with a ground line under every row of seedlings, and the grove of whole trees walking each row start to end. Its loop is the bar’s own breath, 6600 ms (fill 3000, stand 600, empty 3000), not 3200.',
        picture: 'rows of seedlings and a walking grove',
        appears: 'whole trees walk every row, start → end',
        time: '6600 ms',
        leaves: 'the grove walks back',
        reads: 'every shape; rows are counted from the foot',
        verdict:
            'The current version, unchanged. Right for a line (it is the bar’s own row); on a block it is five or six identical rows, so the block reads as a field of the same stripe repeated, and it is the one option whose loop is not 3200 ms.',
    },
];

/* -------------------------------------------------------------- the scene */

const place = (/** @type {string} */ name, /** @type {string} */ html, cls = '') =>
    `<div class="sk-place ${cls}"><p class="sk-place__name">${name}</p>${html}</div>`;

const BOARD = () =>
    place('Block', '<div class="kp-skeleton kp-skeleton--block" role="presentation"></div>') +
    place(
        'Circle and three lines',
        `<div class="sk-media">
            <span class="kp-skeleton kp-skeleton--circle" role="presentation"></span>
            <div class="sk-lines">
                <span class="kp-skeleton" role="presentation" style="--sk-i: 0; inline-size: 100%"></span>
                <span class="kp-skeleton" role="presentation" style="--sk-i: 1; inline-size: 84%"></span>
                <span class="kp-skeleton" role="presentation" style="--sk-i: 2; inline-size: 56%"></span>
            </div>
        </div>`,
    ) +
    place(
        'Datatable, a loading row',
        `<div class="kp-table-wrap"><table class="kp-table sk-table">
            <thead><tr><th scope="col">Station</th><th scope="col">Flow</th><th scope="col">Updated</th></tr></thead>
            <tbody><tr data-kp-skeleton-row aria-hidden="true">
                <td><span class="kp-skeleton"></span></td>
                <td><span class="kp-skeleton"></span></td>
                <td><span class="kp-skeleton"></span></td>
            </tr></tbody>
        </table></div>`,
    ) +
    place(
        'Chart, loading',
        `<figure class="kp-chart sk-chart" aria-busy="true">
            <p class="kp-chart__title">Flow, last 24 hours</p>
            <div class="kp-chart__legend" role="group" aria-hidden="true">
                <span class="kp-chart__source-stub kp-skeleton kp-skeleton--block" style="--kp-skeleton-block: auto">      </span>
                <span class="kp-chart__source-stub kp-skeleton kp-skeleton--block" style="--kp-skeleton-block: auto">      </span>
            </div>
            <div class="kp-chart__plot">
                <div class="kp-chart__state kp-skeleton kp-skeleton--block" data-kp-state="loading" style="box-sizing: border-box; block-size: 168px">
                    <span class="kp-sr-only">Loading</span>
                </div>
            </div>
        </figure>`,
        'sk-place--full',
    );

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="skeleton"]'));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'skeleton',
            label: 'The skeleton in forest',
            options: OPTIONS.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${o.see} ${o.picture}; ${o.appears}; ${o.time}; leaves: ${o.leaves}. ${o.verdict}`,
            })),
        },
    ]),
);

/* ---------------------------------------------------------------- the cards */

const row = /** @type {HTMLElement} */ (section.querySelector('[data-sk-aspect="skeleton"]'));
OPTIONS.forEach((o, at) => {
    const card = document.createElement('article');
    card.className = `sk-opt${o.fx === 'plot' ? '' : ' sk-new'}`;
    card.setAttribute('data-sk-option', String(at + 1));
    card.setAttribute('data-sk-fx', o.fx);
    card.setAttribute('aria-labelledby', `sk-h-${o.fx}`);
    card.innerHTML = `
        <header class="sk-opt__head">
            <h3 id="sk-h-${o.fx}"><span class="sk-opt__no">${at + 1}</span> <span data-sk-name></span></h3>
            ${at === 0 ? '<span class="sk-opt__rec">Recommended</span>' : ''}
            ${o.fx === 'plot' ? '<span class="sk-opt__cur">In the package today</span>' : ''}
        </header>
        <p class="sk-opt__see"></p>
        <dl class="sk-spec">
            <div><dt>Picture</dt><dd data-sk-picture></dd></div>
            <div><dt>Appears</dt><dd data-sk-appears></dd></div>
            <div><dt>Loop</dt><dd data-sk-time></dd></div>
            <div><dt>Leaves</dt><dd data-sk-leaves></dd></div>
            <div><dt>Reads on</dt><dd data-sk-reads></dd></div>
        </dl>
        <div class="sk-board">${BOARD()}</div>
        <p class="sk-opt__verdict"></p>`;
    /** @type {[string, string][]} */
    const text = [
        ['[data-sk-name]', o.name],
        ['.sk-opt__see', o.see],
        ['[data-sk-picture]', o.picture],
        ['[data-sk-appears]', o.appears],
        ['[data-sk-time]', o.time],
        ['[data-sk-leaves]', o.leaves],
        ['[data-sk-reads]', o.reads],
    ];
    for (const [selector, value] of text) /** @type {HTMLElement} */ (card.querySelector(selector)).textContent = value;
    const verdict = /** @type {HTMLElement} */ (card.querySelector('.sk-opt__verdict'));
    verdict.textContent = o.verdict;
    verdict.classList.toggle('sk-opt__verdict--rec', at === 0);
    row.append(card);
});

const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'forest');
lookLine.textContent =
    'Five pictures for the skeleton’s block, circle and lines, each on the same scene (block, avatar, three lines, a loading chart, a datatable row). Watch two or three loops of each (R restarts them); the first is the recommendation and the last is what the package draws today. Pick the one that is forest to you, or None of these with a note.';
look.append(lookLine);

/* --------------------------------------------------------------- the tools */

const root = document.documentElement;
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = /** @type {HTMLElement | null} */ (document.querySelector('[data-sk-motion-note]'));

/** A radio-like group: one pressed button. */
function radio(/** @type {string} */ attr, /** @type {(value: string) => void} */ apply) {
    const buttons = [...document.querySelectorAll(`[${attr}]`)];
    for (const b of buttons)
        b.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === b));
            apply(b.getAttribute(attr) || '');
        });
}

// Every loop starts again from its first frame: the animations are switched
// off for one frame and back on.
document.querySelector('[data-sk-restart]')?.addEventListener('click', () => {
    root.setAttribute('data-sk-restart', '');
    void root.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute('data-sk-restart')));
});
radio('data-sk-speed', (value) => {
    root.style.setProperty('--sk-slow', String(1 / (Number(value) || 1)));
});
radio('data-sk-motion', (value) => {
    if (value === 'reduced') root.setAttribute('data-sk-motion', 'reduced');
    else root.removeAttribute('data-sk-motion');
});

function syncMotion() {
    if (motionNote) motionNote.hidden = !reducedQuery.matches;
}
reducedQuery.addEventListener('change', syncMotion);
syncMotion();
