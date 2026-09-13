// What a block looks like, in the theme on screen, as a hash — shared by the
// review page, the component pages, the research demos and the compare
// columns. The block's markup as written plus the computed style of the
// component under review and its two pseudo elements, over properties that do
// not depend on the window's width — so resizing the browser does not mark a
// block changed, and a colour, a border, a font or a spacing that moved does.
//
// Only the component, not the block around it (2026-09-13): the compare
// column lays a block out as separate rows with its own wrappers, and a hash
// over headings, look text and stage container could never match the review
// page's. So the reviewed elements are the descendants of the block's
// `.cat-stage` elements, in document order; a block with no stage (a research
// demo) gives every descendant but its own heading, look text and panel.
const PROPS = [
    'color',
    'background-color',
    'background-image',
    'opacity',
    'visibility',
    'display',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'outline-style',
    'outline-width',
    'outline-color',
    'box-shadow',
    'text-shadow',
    'filter',
    'clip-path',
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'letter-spacing',
    'line-height',
    'text-transform',
    'text-decoration-line',
    'text-align',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin-top',
    'margin-bottom',
    'row-gap',
    'column-gap',
    'transform',
    'content',
];
const MAX_ELEMENTS = 400; // a 200-row table repeats one rule; the first rows say it

async function sha256(text) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Hold every animation still while reading, so a glitch mid-frame is not a change. */
export function stillAnimations() {
    const held = [];
    for (const animation of document.getAnimations()) {
        const timing = animation.effect?.getComputedTiming();
        if (timing && Number.isFinite(Number(timing.endTime))) animation.finish();
        else {
            held.push([animation, animation.playState]);
            animation.pause();
            animation.currentTime = 0;
        }
    }
    return () => {
        for (const [animation, state] of held) if (state === 'running') animation.play();
    };
}

/** Not the component: the block's reading aids and the reviewer's own panel. */
const AROUND = '.cat-look, .cat-feedback-field, .cat-approval, .cat-judge';

/** The descendants of every outermost stage in `stages`, in document order. */
export function stageElements(stages) {
    return stages
        .filter((stage) => !stages.some((other) => other !== stage && other.contains(stage)))
        .flatMap((stage) => [...stage.querySelectorAll('*')]);
}

/** The elements of a block that are the component under review. */
export function reviewedElements(block) {
    const stages = [...block.querySelectorAll('.cat-stage')];
    if (stages.length) return stageElements(stages);
    const headings = [...block.querySelectorAll(':scope > h2, :scope > h3')];
    return [...block.querySelectorAll('*')].filter((el) => !el.closest(AROUND) && !headings.some((h) => h.contains(el)));
}

/**
 * @param {Element} block the block as it stands on this page
 * @param {string} source the block's markup as written
 * @param {Element[]} [reviewed] the component's elements, where the block is not one element (a compare column)
 */
export async function fingerprint(block, source, reviewed = reviewedElements(block)) {
    const lines = [source];
    const elements = reviewed.slice(0, MAX_ELEMENTS);
    // A control whose look follows the scroll position rather than the theme
    // (back-to-top shows itself past a threshold) would mark its block changed
    // whenever the page was scrolled differently. Its state attribute is
    // lifted while reading, so the block is compared at rest.
    const volatile = reviewed.filter((el) => el.hasAttribute('data-kp-to-top-shown'));
    for (const el of volatile) el.removeAttribute('data-kp-to-top-shown');
    // Lifting the attribute starts the control's own fade; a reading taken now
    // would catch the first frame of it, so the fade is run to its end first.
    for (const el of volatile) for (const animation of el.getAnimations({ subtree: true })) animation.finish();
    for (const el of elements) {
        for (const pseudo of [null, '::before', '::after']) {
            const cs = getComputedStyle(el, pseudo);
            if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
            lines.push(PROPS.map((prop) => cs.getPropertyValue(prop)).join('|'));
        }
    }
    for (const el of volatile) el.setAttribute('data-kp-to-top-shown', '');
    return sha256(lines.join('\n'));
}
