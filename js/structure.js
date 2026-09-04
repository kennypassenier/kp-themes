// Tree, reorder and split pane, framework-free [TH45, TH46, TH55].
//
// Three structural controls that share one property: each is trivial with
// a mouse and each is where keyboard access usually stops. So the
// keyboard is what the code is mostly about.
//
//   TH45  tree     arrows walk and open, Home/End jump, typeahead finds
//   TH46  reorder  a grab handle that moves an item with the arrow keys
//   TH55  split    a separator that resizes with the arrow keys
//
// None of them uses a drag library. Pointer dragging is the easy half and
// the platform gives it away; what a library would also give away is a
// keyboard story, and the ones that do it well do it exactly like this.

const TREE = '[data-kp-tree]';
const REORDER = '[data-kp-reorder]';
const SPLIT = '[data-kp-split]';

/** Fired on a reorder list when the order changed. A contract value [TH26]. */
export const REORDER_EVENT = 'kp-reorder';

/** Fired on a split pane when the divider moved; the detail carries the percentage. */
export const SPLIT_EVENT = 'kp-split';

/**
 * The tree's visible items, in the order a reader meets them.
 *
 * Collapsed branches are excluded, because Down should go to the next
 * thing you can see — walking into a closed folder is the bug that makes
 * a tree feel broken rather than merely awkward.
 *
 * @param {HTMLElement} tree
 */
function visibleItems(tree) {
    return /** @type {HTMLElement[]} */ (
        [...tree.querySelectorAll('[role="treeitem"]')].filter((item) => {
            /** @type {HTMLElement | null} */
            let parent = item.parentElement;
            while (parent !== null && parent !== tree) {
                if (parent.getAttribute('role') === 'group' && parent.parentElement?.getAttribute('aria-expanded') === 'false') return false;
                parent = parent.parentElement;
            }
            return true;
        })
    );
}

/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachStructure(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    // --- Tree [TH45] ---------------------------------------------------
    for (const element of root.querySelectorAll(TREE)) {
        const tree = /** @type {HTMLElement} */ (element);
        if (tree.dataset.kpTreeAttached !== undefined) continue;
        tree.dataset.kpTreeAttached = '';

        /** One tab stop for the whole tree, arrows inside it — the ARIA practice. */
        const setStop = (/** @type {HTMLElement} */ item) => {
            for (const other of tree.querySelectorAll('[role="treeitem"]')) other.setAttribute('tabindex', '-1');
            item.setAttribute('tabindex', '0');
            item.focus();
        };

        const items = visibleItems(tree);
        if (items[0] !== undefined) {
            for (const item of tree.querySelectorAll('[role="treeitem"]')) item.setAttribute('tabindex', '-1');
            items[0].setAttribute('tabindex', '0');
        }

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const item = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('[role="treeitem"]'));
            if (item === null) return;
            const list = visibleItems(tree);
            const at = list.indexOf(item);
            const expandable = item.hasAttribute('aria-expanded');
            const open = item.getAttribute('aria-expanded') === 'true';

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (list[at + 1]) setStop(list[at + 1]);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (list[at - 1]) setStop(list[at - 1]);
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    // Right opens a closed branch and steps into an open
                    // one — two jobs for one key, which is what makes a
                    // tree navigable without a mouse.
                    if (expandable && !open) item.setAttribute('aria-expanded', 'true');
                    else if (list[at + 1]) setStop(list[at + 1]);
                    break;
                case 'ArrowLeft': {
                    event.preventDefault();
                    if (expandable && open) {
                        item.setAttribute('aria-expanded', 'false');
                        break;
                    }
                    const parent = /** @type {HTMLElement | null} */ (item.parentElement?.closest('[role="treeitem"]') ?? null);
                    if (parent !== null) setStop(parent);
                    break;
                }
                case 'Home':
                    event.preventDefault();
                    if (list[0]) setStop(list[0]);
                    break;
                case 'End':
                    event.preventDefault();
                    if (list[list.length - 1]) setStop(list[list.length - 1]);
                    break;
                case 'Enter':
                case ' ':
                    if (expandable) {
                        event.preventDefault();
                        item.setAttribute('aria-expanded', open ? 'false' : 'true');
                    }
                    break;
                default:
                    // Typeahead: one letter jumps to the next item that
                    // starts with it. In a tree of forty folders this is
                    // the difference between usable and theoretical.
                    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                        const letter = event.key.toLowerCase();
                        const after = [...list.slice(at + 1), ...list.slice(0, at + 1)];
                        const found = after.find((candidate) => (candidate.textContent ?? '').trim().toLowerCase().startsWith(letter));
                        if (found !== undefined) {
                            event.preventDefault();
                            setStop(found);
                        }
                    }
                    break;
            }
        };

        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const item = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('[role="treeitem"]'));
            if (item === null || !item.hasAttribute('aria-expanded')) return;
            item.setAttribute('aria-expanded', item.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            setStop(item);
        };

        tree.addEventListener('keydown', onKey);
        tree.addEventListener('click', onClick);
        cleanups.push(() => {
            tree.removeEventListener('keydown', onKey);
            tree.removeEventListener('click', onClick);
            delete tree.dataset.kpTreeAttached;
        });
    }

    // --- Reorder [TH46] ------------------------------------------------
    for (const element of root.querySelectorAll(REORDER)) {
        const list = /** @type {HTMLElement} */ (element);
        if (list.dataset.kpReorderAttached !== undefined) continue;
        list.dataset.kpReorderAttached = '';

        const announce = () => {
            const order = [...list.children].map((child) => /** @type {HTMLElement} */ (child).dataset.kpItem ?? '');
            list.dispatchEvent(new CustomEvent(REORDER_EVENT, { bubbles: true, detail: { order } }));
        };

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const handle = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('[data-kp-handle]'));
            if (handle === null) return;
            const item = handle.closest('[data-kp-item]');
            if (!(item instanceof HTMLElement)) return;
            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
            event.preventDefault();
            const sibling = event.key === 'ArrowUp' ? item.previousElementSibling : item.nextElementSibling;
            if (sibling === null) return;
            if (event.key === 'ArrowUp') item.parentElement?.insertBefore(item, sibling);
            else item.parentElement?.insertBefore(sibling, item);
            // Focus follows the item, not the position: losing focus after
            // every move is what makes keyboard reordering unusable.
            handle.focus();
            announce();
        };

        list.addEventListener('keydown', onKey);
        cleanups.push(() => {
            list.removeEventListener('keydown', onKey);
            delete list.dataset.kpReorderAttached;
        });
    }

    // --- Split pane [TH55] ---------------------------------------------
    for (const element of root.querySelectorAll(SPLIT)) {
        const split = /** @type {HTMLElement} */ (element);
        if (split.dataset.kpSplitAttached !== undefined) continue;
        split.dataset.kpSplitAttached = '';
        const separator = /** @type {HTMLElement | null} */ (split.querySelector('[role="separator"]'));
        if (separator === null) continue;

        const min = Number.parseInt(separator.getAttribute('aria-valuemin') ?? '10', 10);
        const max = Number.parseInt(separator.getAttribute('aria-valuemax') ?? '90', 10);
        let value = Number.parseInt(separator.getAttribute('aria-valuenow') ?? '50', 10);

        /** @param {number} next */
        const setValue = (next) => {
            value = Math.max(min, Math.min(max, Math.round(next)));
            split.style.setProperty('--kp-split', `${value}%`);
            // The value lives in aria-valuenow, not only in the style: a
            // separator that moves silently is a separator only a mouse
            // can use.
            separator.setAttribute('aria-valuenow', String(value));
            split.dispatchEvent(new CustomEvent(SPLIT_EVENT, { bubbles: true, detail: { value } }));
        };
        setValue(value);

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const step = event.shiftKey ? 10 : 2;
            if (event.key === 'ArrowLeft') setValue(value - step);
            else if (event.key === 'ArrowRight') setValue(value + step);
            else if (event.key === 'Home') setValue(min);
            else if (event.key === 'End') setValue(max);
            else return;
            event.preventDefault();
        };

        /** @param {PointerEvent} event */
        const onPointerDown = (event) => {
            separator.setPointerCapture(event.pointerId);
            const move = (/** @type {PointerEvent} */ moved) => {
                const box = split.getBoundingClientRect();
                setValue(((moved.clientX - box.left) / box.width) * 100);
            };
            const up = () => {
                separator.removeEventListener('pointermove', move);
                separator.removeEventListener('pointerup', up);
            };
            separator.addEventListener('pointermove', move);
            separator.addEventListener('pointerup', up);
        };

        separator.addEventListener('keydown', onKey);
        separator.addEventListener('pointerdown', onPointerDown);
        cleanups.push(() => {
            separator.removeEventListener('keydown', onKey);
            separator.removeEventListener('pointerdown', onPointerDown);
            delete split.dataset.kpSplitAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
