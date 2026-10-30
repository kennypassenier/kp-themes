// Attaches the diffs of a page.
import { getStrings } from '../strings.js';
import { copyPath, fileOf, toggleFile } from './actions.js';
import { DIFF, DIFF_EXPAND_EVENT, DIFF_RETRY_EVENT } from './constants.js';
import { fillBody } from './lines.js';
import { stateOf } from './model.js';
import { say } from './read.js';
import { render } from './render.js';

/**
 * Wire every diff under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachDiffs(root = document) {
    const roots = /** @type {HTMLElement[]} */ ([
        ...(root instanceof HTMLElement && root.matches(DIFF) ? [root] : []),
        ...root.querySelectorAll(DIFF),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el_ of roots) {
        const st = stateOf(el_);
        if (st.off.length) continue;
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const t = event.target instanceof Element ? event.target : null;
            if (!t) return;
            const s = getStrings();
            const toggle = t.closest('.kp-diffview__toggle');
            if (toggle) {
                const section = toggle.closest('.kp-diffview__file');
                const path = section?.getAttribute('data-kp-diff-path') ?? '';
                return toggleFile(el_, path, toggle.getAttribute('aria-expanded') !== 'true');
            }
            const all = t.closest('[data-kp-diff-all]');
            if (all instanceof HTMLButtonElement) {
                if (all.disabled) return;
                const open = all.getAttribute('data-kp-diff-all') === 'expand';
                for (const section of el_.querySelectorAll('.kp-diffview__file')) {
                    const path = section.getAttribute('data-kp-diff-path') ?? '';
                    if ((section.getAttribute('data-kp-diff-file-open') === 'true') !== open) toggleFile(el_, path, open);
                }
                return;
            }
            const fold = t.closest('.kp-diff__fold');
            if (fold instanceof HTMLElement) {
                const key = fold.getAttribute('data-kp-diff-fold-key') ?? '';
                const lines = Number(fold.getAttribute('data-kp-diff-fold-lines'));
                const path = key.split('|')[0];
                const open = !st.folds.has(key);
                if (open) st.folds.add(key);
                else st.folds.delete(key);
                const found = fileOf(el_, path);
                if (!found) return;
                fillBody(el_, st, found.file, /** @type {HTMLElement} */ (found.section.querySelector('.kp-diffview__body')));
                /** @type {HTMLElement | null} */ (el_.querySelector(`[data-kp-diff-fold-key="${CSS.escape(key)}"]`))?.focus();
                say(el_, open ? s.diffUnchangedShown(lines) : s.diffUnchangedHidden(lines));
                el_.dispatchEvent(new CustomEvent(DIFF_EXPAND_EVENT, { bubbles: true, detail: { path, lines, open } }));
                return;
            }
            const more = t.closest('[data-kp-diff-more]');
            if (more) {
                const path = more.closest('.kp-diffview__file')?.getAttribute('data-kp-diff-path') ?? '';
                const found = fileOf(el_, path);
                if (!found) return;
                st.all.add(path);
                const body = /** @type {HTMLElement} */ (found.section.querySelector('.kp-diffview__body'));
                fillBody(el_, st, found.file, body);
                body.focus({ preventScroll: true });
                return;
            }
            const copy = t.closest('.kp-diffview__copy');
            if (copy instanceof HTMLButtonElement) return void copyPath(el_, copy);
            if (t.closest('[data-kp-diff-retry-action]')) el_.dispatchEvent(new CustomEvent(DIFF_RETRY_EVENT, { bubbles: true }));
        };
        el_.addEventListener('click', onClick);
        // Every option is live: change the attribute and the diff is drawn again.
        let queued = 0;
        const watcher = new MutationObserver(() => {
            window.cancelAnimationFrame(queued);
            queued = window.requestAnimationFrame(() => render(el_));
        });
        watcher.observe(el_, {
            attributes: true,
            attributeFilter: ['open', 'context', 'words', 'bar', 'copy', 'max-lines', 'label'].map((name) => `data-kp-diff-${name}`),
        });
        st.off = [() => el_.removeEventListener('click', onClick), () => watcher.disconnect(), () => window.cancelAnimationFrame(queued)];
        undo.push(() => {
            for (const stop of st.off) stop();
            st.off = [];
        });
        render(el_);
    }
    return () => undo.forEach((u) => u());
}
