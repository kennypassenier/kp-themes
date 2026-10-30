// Attaches the consoles of a page.
import { getStrings } from '../strings.js';
import { registerShortcuts } from '../shortcuts.js';
import { attachNewPills } from '../newpill.js';
import { attachDisabledReasons } from '../reason.js';
import { clearConsole, useTool } from './api.js';
import { drawBar } from './bar.js';
import { blockNode, drawAll, drawBody } from './blocks.js';
import { CONSOLE, CONSOLE_RETRY_EVENT } from './constants.js';
import { loadHistory } from './history.js';
import { attr, el, say, stateOf } from './model.js';
import { startTicker, submit } from './run.js';
/** @typedef {import('./types.js').ConsoleRun} ConsoleRun */

/**
 * Wire every console under `root`.
 * @param {ParentNode} [root]
 * @param {{ run?: ConsoleRun, complete?: (prefix: string) => string[] | Promise<string[]> }} [options]
 * @returns {() => void} detach
 */
export function attachConsoles(root = document, options = {}) {
    const roots = /** @type {HTMLElement[]} */ ([
        ...(root instanceof HTMLElement && root.matches(CONSOLE) ? [root] : []),
        ...root.querySelectorAll(CONSOLE),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el_ of roots) {
        const st = stateOf(el_);
        if (st.off.length) continue;
        if (options.run) st.run = options.run;
        if (options.complete) st.complete = options.complete;
        st.history = loadHistory(el_);
        drawAll(el_);
        const body = /** @type {HTMLElement} */ (el_.querySelector('.kp-console__body'));
        const stopPill = body ? attachNewPills(body.parentElement ?? el_) : () => {};
        const stopReasons = attachDisabledReasons(el_);
        const form = /** @type {HTMLFormElement} */ (el_.querySelector('.kp-console__form'));
        const input = /** @type {HTMLInputElement} */ (el_.querySelector('.kp-console__input'));
        const select = /** @type {HTMLSelectElement} */ (el_.querySelector('.kp-console__context'));
        const complete = /** @type {HTMLElement} */ (el_.querySelector('.kp-console__complete'));
        /** @param {SubmitEvent} event */
        const onSubmit = (event) => {
            event.preventDefault();
            void submit(el_);
        };
        /** @param {KeyboardEvent} event */
        const onKey = async (event) => {
            if (event.isComposing) return;
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                if (st.history.length === 0) return;
                event.preventDefault();
                if (st.at === -1) st.draft = input.value;
                if (event.key === 'ArrowUp') st.at = st.at === -1 ? st.history.length - 1 : Math.max(0, st.at - 1);
                else st.at = st.at === -1 ? -1 : st.at + 1 >= st.history.length ? -1 : st.at + 1;
                input.value = st.at === -1 ? st.draft : st.history[st.at];
                input.setSelectionRange(input.value.length, input.value.length);
            } else if (event.key === 'Escape') {
                if (!complete.hidden) {
                    complete.hidden = true;
                    return;
                }
                if (input.value !== '') {
                    event.preventDefault();
                    input.value = '';
                    st.at = -1;
                    st.pending = null;
                    drawBar(el_);
                }
            } else if (
                event.key === 'Tab' &&
                attr(el_, 'tab', 'none') === 'complete' &&
                st.complete &&
                input.value.trim() !== '' &&
                !event.shiftKey
            ) {
                event.preventDefault();
                const found = await st.complete(input.value);
                if (found.length === 1) {
                    input.value = found[0];
                    complete.hidden = true;
                } else if (found.length > 1) {
                    complete.replaceChildren();
                    complete.setAttribute('role', 'group');
                    complete.setAttribute('aria-label', getStrings().consoleCompletions);
                    for (const f of found.slice(0, 12)) {
                        const b = /** @type {HTMLButtonElement} */ (el('kp-button kp-button--ghost kp-button--sm', 'button'));
                        b.type = 'button';
                        b.setAttribute('data-kp-console-complete', f);
                        b.textContent = f;
                        complete.append(b);
                    }
                    complete.hidden = false;
                    say(el_, getStrings().consoleMatches(found.length));
                }
            } else if (st.pending !== null && event.key.length === 1) {
                st.pending = null;
                drawBar(el_);
            }
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const t = event.target instanceof Element ? event.target : null;
            if (!t) return;
            const tool = /** @type {HTMLButtonElement | null} */ (t.closest('[data-kp-console-tool]'));
            if (tool) {
                const block = t.closest('.kp-console__block');
                const b = st.blocks.find((x) => x.id === block?.getAttribute('data-id'));
                if (b) void useTool(el_, tool.getAttribute('data-kp-console-tool') ?? '', b, tool);
                return;
            }
            const pickC = t.closest('[data-kp-console-complete]');
            if (pickC) {
                input.value = pickC.getAttribute('data-kp-console-complete') ?? '';
                complete.hidden = true;
                input.focus();
                return;
            }
            if (t.closest('[data-kp-console-retry]')) return void el_.dispatchEvent(new CustomEvent(CONSOLE_RETRY_EVENT, { bubbles: true }));
            if (t.closest('[data-kp-console-earlier]')) {
                st.showAll = true;
                drawBody(el_);
            }
        };
        const onContext = () => {
            st.context.value = select.value;
        };
        form.addEventListener('submit', onSubmit);
        input.addEventListener('keydown', onKey);
        el_.addEventListener('click', onClick);
        select.addEventListener('change', onContext);
        let order = attr(el_, 'order', 'newest-last');
        let stopPillNow = stopPill;
        const observer = new MutationObserver(() => {
            // Every option is live: change the attribute and the console is drawn again.
            const now = attr(el_, 'order', 'newest-last');
            if (now !== order) {
                order = now;
                const stage = /** @type {HTMLElement} */ (el_.querySelector(':scope > .kp-console__stage'));
                const barEl = /** @type {HTMLElement} */ (el_.querySelector(':scope > .kp-console__bar'));
                if (stage && barEl) {
                    if (now === 'newest-first') el_.prepend(barEl);
                    else el_.append(barEl);
                }
                stopPillNow();
                body.setAttribute('data-kp-follow', now === 'newest-first' ? 'head' : 'tail');
                stopPillNow = attachNewPills(body.parentElement ?? el_);
            }
            drawBar(el_);
            drawBody(el_);
            for (const b of st.blocks) {
                const node = el_.querySelector(`.kp-console__block[data-id="${CSS.escape(b.id)}"]`);
                if (node instanceof HTMLElement) blockNode(el_, b, node);
            }
        });
        observer.observe(el_, {
            attributes: true,
            attributeFilter: [
                'disabled',
                'data-kp-disabled',
                'data-kp-disabled-reason',
                ...['hint', 'prompt', 'order', 'status', 'timer', 'cancel', 'max-lines', 'max-blocks', 'context', 'confirm'].map(
                    (n) => `data-kp-console-${n}`,
                ),
            ],
        });
        // The keys, through the engine: the clear key, and the one that jumps to the prompt from anywhere.
        const s = getStrings();
        /** @type {import('../shortcuts.js').Shortcut[]} */
        const keys = [{ keys: 'Mod L', what: s.consoleKeyClear, group: s.consoleKeyGroup, run: () => clearConsole(el_) }];
        const focusKey = attr(el_, 'focus-key', ':');
        if (focusKey !== 'false' && focusKey !== '') {
            keys.push({
                keys: focusKey,
                what: s.consoleKeyFocus,
                group: s.consoleKeyGroup,
                when: () => !input.disabled,
                reason: s.consoleKeyFocusReason,
                run: () => input.focus(),
            });
        }
        const stopKeys = registerShortcuts(el_, keys, { layoutGuard: 'off' });
        startTicker(el_);
        st.off = [
            () => form.removeEventListener('submit', onSubmit),
            () => input.removeEventListener('keydown', onKey),
            () => el_.removeEventListener('click', onClick),
            () => select.removeEventListener('change', onContext),
            () => observer.disconnect(),
            stopKeys,
            () => stopPillNow(),
            stopReasons,
            () => window.clearInterval(st.tick),
        ];
        undo.push(() => {
            for (const stop of st.off) stop();
            st.off = [];
        });
    }
    return () => undo.forEach((u) => u());
}
