// Play: press a block's try-buttons for the reviewer, one after another
// (Kenny, 2026-10-05: "zoek een manier om het mij makkelijker te maken om
// demo's te testen"). Every judged block with buttons to try gets a Play
// button beside Approve; the review dialog gets one for the block on its
// stage. Each button is highlighted while its step runs, a caption under the
// block says what was pressed and what to see, and the pause between steps
// follows the theme's own motion (js/motion.js themeMotion), so a slow theme
// is given the time its movement takes. At the end the buttons that were
// pressed in at the start are pressed again: the block is back where it was.
//
// The steps are found, not listed: every button in a `.cat-live__bar` or a
// `.cat-options` group, and every button carrying a `data-cat-*` hook, in
// document order. A block that needs another order, or fewer steps, says so
// on its section with `data-cat-play="sel, sel, …"` (each selector's buttons
// in that order, nothing else), or `data-cat-play="none"`.
//
// A second press of Play, or Escape, stops it.
import { themeMotion } from '../js/motion.js';
import { blockButtons, buttonLabel, checklistOf, effectIn } from './checklist.js';

const CONTROLS = '.cat-live__bar button, .cat-options button';
/** Hooks of the reviewer's own chrome, never a step. */
const CHROME = /^data-cat-(dialog|verdict|play|check|undo|show-judged|prompt|devtools)/;

/**
 * The buttons Play presses in `block`, in order.
 * @param {Element} block
 * @returns {HTMLButtonElement[]}
 */
export function stepsOf(block) {
    const own = block.getAttribute('data-cat-play');
    const candidates = blockButtons(block);
    let steps;
    if (own !== null) {
        if (own.trim() === 'none') return [];
        steps = [];
        for (const selector of own
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)) {
            for (const button of candidates) if (button.matches(selector) && !steps.includes(button)) steps.push(button);
        }
    } else {
        steps = candidates.filter(
            (button) => button.matches(CONTROLS) || [...button.attributes].some((a) => a.name.startsWith('data-cat-') && !CHROME.test(a.name)),
        );
    }
    return /** @type {HTMLButtonElement[]} */ (steps.filter((button) => !button.closest('[data-cat-frozen], [inert]')));
}

/** The pause after each step: longer in a theme whose dialog takes longer to arrive. */
export function pause() {
    let open = 0;
    try {
        open = themeMotion().open;
    } catch {
        /* no motion reading: the base pause */
    }
    const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kp-motion-scale')) || 1;
    return Math.round(Math.min(4500, 1600 + 1.5 * open) * scale);
}

/** @type {{ block: Element, stopped: boolean, wake: () => void } | null} */
let run = null;

/** The caption under a block, made on first use. @param {Element} block */
function captionOf(block) {
    let caption = block.querySelector(':scope > .cat-play-caption');
    if (!caption) {
        caption = document.createElement('p');
        caption.className = 'cat-note cat-play-caption';
        caption.setAttribute('role', 'status');
        caption.setAttribute('aria-live', 'polite');
        const panel = block.querySelector(':scope > .cat-judge');
        if (panel) panel.before(caption);
        else block.append(caption);
    }
    return caption;
}

/** Say `text` under the block and, if it is on the dialog's stage, in the dialog. */
function say(block, text) {
    captionOf(block).textContent = text;
    const dialog = document.getElementById('cat-review-dialog');
    if (dialog?.querySelector('[data-cat-dialog-stage] > .cat-block') === block) {
        const line = dialog.querySelector('[data-cat-play-dialog-caption]');
        if (line) line.textContent = text;
    }
}

function markPlaying(block, on) {
    block.toggleAttribute('data-cat-playing', on);
    for (const button of document.querySelectorAll(`[data-cat-play-for="${CSS.escape(block.id)}"]`)) {
        button.textContent = on ? '■ Stop' : '▶ Play';
        button.setAttribute('aria-pressed', String(on));
    }
}

/** Close what a step opened inside the block: a popover, a modal dialog. */
function tidy(block) {
    for (const open of block.querySelectorAll(':popover-open')) /** @type {HTMLElement} */ (open).hidePopover?.();
    for (const inner of block.querySelectorAll('dialog')) if (inner.matches(':modal')) inner.close();
}

const visible = (el) => el.isConnected && el.getClientRects().length > 0 && !(/** @type {HTMLButtonElement} */ (el).disabled);

/** Stop the run in progress, if any. */
export function stop() {
    if (!run) return;
    run.stopped = true;
    run.wake();
}

/** Whether a run is in progress. */
export const playing = () => Boolean(run);

/**
 * Play `block`'s try-buttons; a second call for the same block stops it.
 * @param {Element} block
 */
export async function play(block) {
    if (run) {
        const same = run.block === block;
        stop();
        if (same) return;
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const steps = stepsOf(block);
    if (!steps.length) {
        say(block, 'Nothing to play: this block has no try-buttons.');
        return;
    }
    const lines = checklistOf(block);
    const effectOf = (button) => effectIn(lines, button);
    const pressedAtStart = steps.filter((button) => button.getAttribute('aria-pressed') === 'true');
    /** @type {NonNullable<typeof run>} */
    const current = { block, stopped: false, wake: () => {} };
    run = current;
    markPlaying(block, true);
    let done = 0;
    try {
        for (const [index, button] of steps.entries()) {
            if (current.stopped) break;
            if (!visible(button)) continue;
            button.classList.add('cat-play-step');
            button.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            button.click();
            done += 1;
            const effect = effectOf(button);
            say(block, `Step ${index + 1} of ${steps.length} · Pressed ${buttonLabel(button)}${effect ? ` → ${effect}` : '.'}`);
            await new Promise((resolve) => {
                const timer = setTimeout(resolve, pause());
                current.wake = () => {
                    clearTimeout(timer);
                    resolve(undefined);
                };
            });
            button.classList.remove('cat-play-step');
            tidy(block);
        }
        // Back to the first state: the options pressed in at the start, pressed again.
        for (const button of pressedAtStart) if (button.isConnected && button.getAttribute('aria-pressed') !== 'true') button.click();
        tidy(block);
        say(
            block,
            current.stopped
                ? `Stopped after ${done} step(s); the block is back at its first state.`
                : `Played ${done} step(s); the block is back at its first state. Press Play to watch again.`,
        );
    } finally {
        for (const button of steps) button.classList.remove('cat-play-step');
        if (run === current) run = null;
        markPlaying(block, false);
    }
}

/* --------------------------------------------------------------- mounting */

function playButton(block) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kp-button kp-button--sm cat-play';
    button.setAttribute('data-cat-play-for', block.id);
    button.setAttribute('aria-pressed', 'false');
    button.title = 'Press every try-button of this block in turn (P); press again or Escape to stop';
    button.textContent = '▶ Play';
    button.addEventListener('click', () => play(block));
    return button;
}

/** A Play button beside Approve on every judged block with try-buttons. */
export function mountPlay(root = document) {
    for (const block of root.querySelectorAll('.cat-block[id]')) {
        const actions = block.querySelector(':scope > .cat-judge .cat-judge__actions');
        if (!actions || actions.querySelector('[data-cat-play-for]') || !stepsOf(block).length) continue;
        const approve = actions.querySelector('[data-cat-verdict="approved"]');
        const button = playButton(block);
        if (approve) approve.before(button);
        else actions.prepend(button);
    }
}

/** The dialog's Play, for whichever block is on its stage. */
function mountDialogPlay() {
    const dialog = document.getElementById('cat-review-dialog');
    const footer = dialog?.querySelector('.cat-review-dialog__footer');
    if (!dialog || !footer || footer.querySelector('[data-cat-play-dialog]')) return;
    const row = document.createElement('div');
    row.className = 'cat-play-dialog';
    row.setAttribute('data-cat-dialog-chrome', '');
    row.innerHTML = `
        <button type="button" class="kp-button kp-button--sm cat-play" data-cat-play-dialog aria-pressed="false">▶ Play</button>
        <p class="cat-play-dialog__caption" role="status" aria-live="polite" data-cat-play-dialog-caption></p>`;
    footer.prepend(row);
    const button = /** @type {HTMLButtonElement} */ (row.querySelector('[data-cat-play-dialog]'));
    const caption = /** @type {HTMLElement} */ (row.querySelector('[data-cat-play-dialog-caption]'));
    const onStage = () => dialog.querySelector('[data-cat-dialog-stage] > .cat-block');
    button.addEventListener('click', () => {
        const block = onStage();
        if (block) play(block);
    });
    // A new block on the stage: its own state, its own caption.
    const sync = () => {
        const block = onStage();
        if (run && run.block !== block) stop();
        button.setAttribute('data-cat-play-for', block?.id ?? '');
        const steps = block ? stepsOf(block) : [];
        button.disabled = !steps.length;
        button.textContent = run && run.block === block ? '■ Stop' : '▶ Play';
        caption.textContent =
            block?.querySelector(':scope > .cat-play-caption')?.textContent ||
            (steps.length ? `${steps.length} try-button(s): Play presses them in turn.` : 'No try-buttons in this block.');
    };
    const stage = dialog.querySelector('[data-cat-dialog-stage]');
    if (stage) new MutationObserver(sync).observe(stage, { childList: true });
    dialog.addEventListener('close', () => stop());
    sync();
}

// Escape stops a run before it closes anything; a second Escape closes.
window.addEventListener(
    'keydown',
    (event) => {
        if (event.key !== 'Escape' || !run) return;
        event.preventDefault();
        event.stopPropagation();
        stop();
    },
    true,
);

document.addEventListener('cat-composed', () => {
    mountPlay();
    mountDialogPlay();
});
