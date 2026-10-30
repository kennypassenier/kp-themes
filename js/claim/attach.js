// Attaches the claim lists of a page.
import { getStrings } from '../strings.js';
import { CHECKLIST_RENDER_EVENT, CHECKLIST_RETRY_EVENT, getChecklistItems, setChecklistItems } from '../checklist.js';
import { MENU_SELECT_EVENT } from '../menu-button.js';
import { attachDisabledReasons } from '../reason.js';
import { registerShortcuts } from '../shortcuts.js';
import { memoryFor } from '../remember.js';
import { copyGaps, takeAll } from './bulk.js';
import { CLAIM, CLAIM_FILTERS, CLAIM_RETRY_EVENT } from './constants.js';
import { decorate, setClaimFilter } from './decorate.js';
import { attr, byOf, itemOf, stateOf } from './model.js';
import { press, request } from './request.js';
import { among, mode } from './rows.js';
import { claimState } from './state.js';

/**
 * Wire every claim checklist under `root`: the buttons, the menu, the chips, the keys. Items come from the checklist's
 * setChecklistItems() with a `claim` on each; the viewer from setClaimViewer().
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachClaims(root = document) {
    const lists = /** @type {HTMLElement[]} */ ([
        ...(root instanceof HTMLElement && root.matches(CLAIM) ? [root] : []),
        ...root.querySelectorAll(CLAIM),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const list of lists) {
        const st = stateOf(list);
        if (st.off.length) continue;
        const viewerId = list.getAttribute('data-kp-claim-viewer');
        if (viewerId && !st.viewer) st.viewer = { id: viewerId, name: list.getAttribute('data-kp-claim-viewer-name') ?? viewerId };
        const remembered = memoryFor(list, 'claim')?.read('filter', null);
        const asked = list.getAttribute('data-kp-claim-filter');
        st.filter =
            typeof remembered === 'string' && CLAIM_FILTERS.includes(remembered)
                ? remembered
                : CLAIM_FILTERS.includes(asked ?? '')
                  ? /** @type {string} */ (asked)
                  : 'all';
        const stopReasons = attachDisabledReasons(list);
        const onRender = () => decorate(list);
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;
            const button = target.closest('.kp-claim__button');
            if (button instanceof HTMLButtonElement) {
                event.preventDefault();
                const row = button.closest('.kp-checklist__item');
                if (row instanceof HTMLElement && button.getAttribute('aria-disabled') !== 'true') press(list, row);
                return;
            }
            const chip = target.closest('.kp-claim__chips [data-value]');
            if (chip) return setClaimFilter(list, chip.getAttribute('data-value') ?? 'all');
            if (target.closest('.kp-claim__take-all')) return void takeAll(list);
            if (target.closest('.kp-claim__copy')) return void copyGaps(list);
        };
        /** @param {Event} event */
        const onMenu = (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            const wrapper = event.target instanceof Element ? event.target.closest('.kp-claim__assign') : null;
            const id = wrapper?.getAttribute('data-kp-key');
            if (!id || !detail?.value) return;
            const person = [...st.people, ...byOf(itemOf(list, id) ?? {})].find((p) => p.id === detail.value) ?? null;
            if (!person) return;
            const item = itemOf(list, id);
            void request(list, id, among(person, byOf(item ?? {})) ? 'unassign' : 'assign', person);
        };
        // The shortcut engine never fires a letter while an input has the focus, and a row's tick box is one: c works there too.
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const target = event.target;
            if (event.key !== 'c' || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.repeat) return;
            if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox' || mode(list) !== 'claim') return;
            const row = target.closest('.kp-checklist__item');
            if (!(row instanceof HTMLElement) || list.getAttribute('data-kp-claim-keys') === 'false') return;
            event.preventDefault();
            press(list, row);
        };
        list.addEventListener('keydown', onKey);
        list.addEventListener(CHECKLIST_RENDER_EVENT, onRender);
        // Every option is live: change the attribute and the rows are drawn again (a page that switches a look at run time).
        let lastSort = attr(list, 'gap-sort', 'keep');
        const watcher = new MutationObserver(() => {
            const sort = attr(list, 'gap-sort', 'keep');
            if (sort !== lastSort) {
                lastSort = sort;
                // Back to the list's own order: the checklist draws it again, the claim part follows.
                setChecklistItems(list, getChecklistItems(list));
            } else decorate(list);
        });
        watcher.observe(list, {
            attributes: true,
            attributeFilter: [
                'mode',
                'gap',
                'gap-sort',
                'person',
                'count',
                'self-label',
                'max',
                'disabled',
                'disabled-reason',
                'take-all',
                'copy',
                'filter-chips',
            ].map((n) => `data-kp-claim-${n}`),
        });
        list.addEventListener('click', onClick);
        // The checklist's Retry is the claim list's Retry too [r6r8-1019].
        const onRetry = () => list.dispatchEvent(new CustomEvent(CLAIM_RETRY_EVENT, { bubbles: true }));
        list.addEventListener(CHECKLIST_RETRY_EVENT, onRetry);
        list.addEventListener(MENU_SELECT_EVENT, onMenu);
        /** @type {(() => void) | undefined} */
        let stopKeys;
        if (list.getAttribute('data-kp-claim-keys') !== 'false') {
            const here = () => list.contains(document.activeElement) && document.activeElement?.closest('.kp-checklist__item') !== null;
            stopKeys = registerShortcuts(
                list,
                [
                    {
                        keys: 'c',
                        what: getStrings().claimKeyTake,
                        group: getStrings().claimKeyGroup,
                        when: () => here() && mode(list) === 'claim' && stateOf(list).viewer !== null,
                        reason: getStrings().claimKeyReason,
                        run: () => {
                            const row = document.activeElement?.closest('.kp-checklist__item');
                            if (row instanceof HTMLElement) press(list, row);
                        },
                    },
                    {
                        keys: 'Shift C',
                        what: getStrings().claimKeyGaps,
                        group: getStrings().claimKeyGroup,
                        run: () => setClaimFilter(list, stateOf(list).filter === 'gaps' ? 'all' : 'gaps'),
                    },
                ],
                { layoutGuard: 'off' },
            );
        }
        st.off = [
            () => list.removeEventListener(CHECKLIST_RENDER_EVENT, onRender),
            () => watcher.disconnect(),
            () => list.removeEventListener('keydown', onKey),
            () => list.removeEventListener('click', onClick),
            () => list.removeEventListener(CHECKLIST_RETRY_EVENT, onRetry),
            () => list.removeEventListener(MENU_SELECT_EVENT, onMenu),
            () => stopKeys?.(),
            stopReasons,
        ];
        decorate(list);
        undo.push(() => {
            for (const stop of st.off) stop();
            st.off = [];
            claimState.serial += 1;
        });
    }
    return () => undo.forEach((u) => u());
}
