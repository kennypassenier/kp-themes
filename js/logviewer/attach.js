// Attaches the log viewers of a page.
import { getStrings } from '../strings.js';
import { FOLLOW_EVENT, attachNewPills, newPill } from '../newpill.js';
import { attachSegmented } from '../segmented.js';
import { attachDisabledReasons } from '../reason.js';
import { registerShortcuts } from '../shortcuts.js';
import { runFlashButton } from '../flash.js';
import { logViewerText, stepLogMatch, syncOptions } from './api.js';
import { LOGVIEWER, LOGVIEWER_RETRY_EVENT } from './constants.js';
import { attr, stateOf } from './model.js';
import { ensureParts } from './parts.js';
import { logOf, queryOf, say } from './reads.js';
import { matchWords } from './rows.js';

/**
 * Give every `[data-kp-logviewer]` under `root` its bar, its buffer and its states.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachLogViewers(root = document) {
    /** @type {(() => void)[]} */
    const undo = [];
    const found = /** @type {HTMLElement[]} */ ([
        ...(root instanceof HTMLElement && root.matches(LOGVIEWER) ? [root] : []),
        ...root.querySelectorAll(LOGVIEWER),
    ]);
    for (const viewer of found) {
        if (stateOf(viewer).off.length) continue;
        const st = stateOf(viewer);
        ensureParts(viewer);
        const log = logOf(viewer);
        const stage = /** @type {HTMLElement} */ (viewer.querySelector('.kp-logviewer__stage'));
        const bar = /** @type {HTMLElement} */ (viewer.querySelector('.kp-logviewer__bar'));
        const stopPills = attachNewPills(stage);
        const stopSegmented = attachSegmented(viewer);
        const stopReasons = attachDisabledReasons(bar);
        if (attr(viewer, 'follow', 'live') === 'paused') newPill(log)?.pause();
        st.sig = '';
        syncOptions(viewer);

        const find = /** @type {HTMLInputElement} */ (bar.querySelector('.kp-logviewer__find'));
        const onInput = () => {
            if (find.value.trim() === '') viewer.removeAttribute('data-kp-log-search');
            else viewer.setAttribute('data-kp-log-search', find.value);
            syncOptions(viewer);
            if (stateOf(viewer).matches.length > 0) say(viewer, matchWords(viewer));
            else if (queryOf(viewer) !== '') say(viewer, getStrings().logviewerSearchNone);
        };
        /** @param {KeyboardEvent} event */
        const onFindKey = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                stepLogMatch(viewer, event.shiftKey ? -1 : 1);
            } else if (event.key === 'Escape' && find.value !== '') {
                event.preventDefault();
                find.value = '';
                onInput();
            }
        };
        /** @param {Event} event */
        const onChange = (event) => {
            const target = /** @type {Element} */ (event.target);
            if (target.closest('.kp-logviewer__level')) {
                const value = /** @type {HTMLSelectElement} */ (target).value;
                if (value === 'debug') viewer.removeAttribute('data-kp-log-level');
                else viewer.setAttribute('data-kp-log-level', value);
                syncOptions(viewer);
            }
        };
        /** @param {Event} event */
        const onSegment = (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            const group = /** @type {Element} */ (event.target).closest('[data-kp-logviewer-time]');
            const value = detail?.value ?? detail?.item?.getAttribute('data-value');
            if (group && value) {
                viewer.setAttribute('data-kp-log-time', value);
                syncOptions(viewer);
            }
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const t = event.target instanceof Element ? event.target : null;
            if (!t) return;
            const step = t.closest('[data-kp-logviewer-step]');
            if (step) return void stepLogMatch(viewer, Number(step.getAttribute('data-kp-logviewer-step')) < 0 ? -1 : 1);
            if (t.closest('[data-kp-logviewer-only]')) {
                viewer.setAttribute('data-kp-log-search-only', attr(viewer, 'search-only', 'off') === 'on' ? 'off' : 'on');
                return void syncOptions(viewer);
            }
            if (t.closest('[data-kp-logviewer-wrap]')) {
                viewer.setAttribute('data-kp-log-wrap', attr(viewer, 'wrap', 'on') === 'off' ? 'on' : 'off');
                return void syncOptions(viewer);
            }
            if (t.closest('[data-kp-logviewer-clear]')) {
                viewer.removeAttribute('data-kp-log-search');
                viewer.removeAttribute('data-kp-log-level');
                find.value = '';
                return void syncOptions(viewer);
            }
            if (t.closest('[data-kp-logviewer-retry]')) return void viewer.dispatchEvent(new CustomEvent(LOGVIEWER_RETRY_EVENT, { bubbles: true }));
            const copy = /** @type {HTMLButtonElement | null} */ (t.closest('[data-kp-logviewer-copy]'));
            if (copy) {
                const s = getStrings();
                void runFlashButton(copy, async () => {
                    const text = logViewerText(viewer);
                    try {
                        await navigator.clipboard.writeText(text);
                        return s.logviewerCopied;
                    } catch {
                        return { error: s.logviewerNotCopied, word: s.logviewerNotCopied };
                    }
                });
                return;
            }
            if (t.closest('[data-kp-logviewer-download]')) {
                const blob = new Blob([`${logViewerText(viewer)}\n`], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${attr(viewer, 'filename', 'log')}.txt`;
                document.body.append(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        };
        find.addEventListener('input', onInput);
        find.addEventListener('keydown', onFindKey);
        viewer.addEventListener('change', onChange);
        viewer.addEventListener('kp-segmented-change', onSegment);
        viewer.addEventListener('click', onClick);

        // Every option is live: change the attribute and the viewer is drawn again.
        const observer = new MutationObserver(() => syncOptions(viewer));
        observer.observe(viewer, {
            attributes: true,
            attributeFilter: [
                'data-kp-state',
                'data-kp-log-hint',
                ...['max', 'wrap', 'time', 'level', 'search', 'search-only', 'tools'].map((n) => `data-kp-log-${n}`),
            ],
        });
        // The follow state on the root, for the page and for the stylesheet.
        const onFollow = () => viewer.setAttribute('data-kp-log-following', String(newPill(log)?.following() ?? true));
        // Rows change height after they are drawn (a font that arrives late, the width of the window): a reader at the newest line
        // stays at it.
        const stick = () => {
            if (newPill(log)?.following()) log.scrollTop = log.scrollHeight;
        };
        const watcher = typeof ResizeObserver === 'function' ? new ResizeObserver(stick) : null;
        watcher?.observe(log);
        void document.fonts?.ready.then(stick);

        log.addEventListener(FOLLOW_EVENT, onFollow);
        onFollow();

        const s = getStrings();
        const focusKey = attr(viewer, 'focus-key', '/');
        const stopKeys =
            focusKey !== 'false' && focusKey !== ''
                ? registerShortcuts(
                      viewer,
                      [
                          {
                              keys: focusKey,
                              what: s.logviewerKeySearch,
                              group: s.logviewerKeyGroup,
                              when: () => !find.disabled && !find.hidden && !bar.hidden,
                              reason: s.logviewerNothing,
                              run: () => find.focus(),
                          },
                      ],
                      { layoutGuard: 'off' },
                  )
                : () => undefined;

        st.off = [
            () => find.removeEventListener('input', onInput),
            () => find.removeEventListener('keydown', onFindKey),
            () => viewer.removeEventListener('change', onChange),
            () => viewer.removeEventListener('kp-segmented-change', onSegment),
            () => viewer.removeEventListener('click', onClick),
            () => log.removeEventListener(FOLLOW_EVENT, onFollow),
            () => observer.disconnect(),
            () => watcher?.disconnect(),
            stopKeys,
            stopPills,
            stopSegmented,
            stopReasons,
        ];
        undo.push(() => {
            for (const stop of st.off) stop();
            st.off = [];
        });
    }
    return () => undo.forEach((u) => u());
}
