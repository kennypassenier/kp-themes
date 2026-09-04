import { useId, useRef, useState } from 'react';
import { REORDER_EVENT, SPLIT_EVENT } from '../js/structure.js';

// Tree, reorder and split pane, React [TH45, TH46, TH55].
//
// Same contract as js/structure.js, and the same principle: each of these
// is trivial with a mouse, so the code is mostly about the keyboard.

/** @typedef {{ id: string, label: string, children?: TreeNode[] }} TreeNode */

/**
 * @param {{ nodes: TreeNode[], label: string, onSelect?: (id: string) => void }} props
 */
export function Tree({ nodes, label, onSelect }) {
    const [open, setOpen] = useState(/** @type {string[]} */ ([]));
    const [at, setAt] = useState(/** @type {string | null} */ (null));

    /** Every node a reader can see, flattened — collapsed branches excluded. */
    const visible = () => {
        /** @type {{ node: TreeNode, depth: number, parent: string | null }[]} */
        const out = [];
        /** @param {TreeNode[]} list @param {number} depth @param {string | null} parent */
        const walk = (list, depth, parent) => {
            for (const node of list) {
                out.push({ node, depth, parent });
                // Down goes to the next thing you can SEE: walking into a
                // closed folder is the bug that makes a tree feel broken.
                if (node.children && open.includes(node.id)) walk(node.children, depth + 1, node.id);
            }
        };
        walk(nodes, 0, null);
        return out;
    };

    const flat = visible();
    const current = at ?? flat[0]?.node.id ?? null;

    /** @param {string} id */
    const toggle = (id) => setOpen((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

    /** @param {import('react').KeyboardEvent} event @param {{node: TreeNode, parent: string | null}} entry */
    const onKeyDown = (event, entry) => {
        const index = flat.findIndex((f) => f.node.id === entry.node.id);
        const expandable = Boolean(entry.node.children?.length);
        const isOpen = open.includes(entry.node.id);
        const go = (/** @type {number} */ next) => {
            const target = flat[next];
            if (target !== undefined) {
                setAt(target.node.id);
                document.getElementById(`tree-${target.node.id}`)?.focus();
            }
        };

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                go(index + 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                go(index - 1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                // Two jobs for one key: open a closed branch, step into an
                // open one.
                if (expandable && !isOpen) toggle(entry.node.id);
                else go(index + 1);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (expandable && isOpen) toggle(entry.node.id);
                else if (entry.parent !== null) {
                    setAt(entry.parent);
                    document.getElementById(`tree-${entry.parent}`)?.focus();
                }
                break;
            case 'Home':
                event.preventDefault();
                go(0);
                break;
            case 'End':
                event.preventDefault();
                go(flat.length - 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (expandable) toggle(entry.node.id);
                else onSelect?.(entry.node.id);
                break;
            default: {
                if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
                // Typeahead: in a tree of forty folders this is the
                // difference between usable and theoretical.
                const letter = event.key.toLowerCase();
                const after = [...flat.slice(index + 1), ...flat.slice(0, index + 1)];
                const found = after.find((f) => f.node.label.toLowerCase().startsWith(letter));
                if (found !== undefined) {
                    event.preventDefault();
                    setAt(found.node.id);
                    document.getElementById(`tree-${found.node.id}`)?.focus();
                }
            }
        }
    };

    return (
        <ul className="kp-tree" role="tree" aria-label={label} data-kp-tree>
            {flat.map((entry) => (
                <li
                    key={entry.node.id}
                    id={`tree-${entry.node.id}`}
                    role="treeitem"
                    aria-expanded={entry.node.children?.length ? open.includes(entry.node.id) : undefined}
                    aria-level={entry.depth + 1}
                    // One tab stop for the whole tree: otherwise a keyboard
                    // user presses Tab forty times to get past a folder list.
                    tabIndex={entry.node.id === current ? 0 : -1}
                    style={{ paddingInlineStart: `${entry.depth}rem` }}
                    onClick={(event) => {
                        event.stopPropagation();
                        setAt(entry.node.id);
                        if (entry.node.children?.length) toggle(entry.node.id);
                        else onSelect?.(entry.node.id);
                    }}
                    onKeyDown={(event) => onKeyDown(event, entry)}
                >
                    {entry.node.label}
                </li>
            ))}
        </ul>
    );
}

/**
 * A list that reorders from the keyboard [TH46].
 *
 * @param {{ items: { id: string, label: string }[], onChange?: (order: string[]) => void }} props
 */
export function Reorder({ items, onChange }) {
    const [order, setOrder] = useState(items.map((i) => i.id));
    const byId = new Map(items.map((i) => [i.id, i]));
    const list = useRef(/** @type {HTMLUListElement | null} */ (null));

    /** @param {number} from @param {number} to */
    const move = (from, to) => {
        if (to < 0 || to >= order.length) return;
        const next = [...order];
        const [taken] = next.splice(from, 1);
        if (taken !== undefined) next.splice(to, 0, taken);
        setOrder(next);
        onChange?.(next);
        // The DOM event as well as the callback: the framework-free half
        // announces on the element, and a consumer that listens for it
        // should not have to care which channel rendered the list. The
        // contract suite caught this channel announcing nothing.
        list.current?.dispatchEvent(new CustomEvent(REORDER_EVENT, { bubbles: true, detail: { order: next } }));
    };

    return (
        <ul className="kp-reorder" data-kp-reorder ref={list}>
            {order.map((id, i) => (
                <li key={id} data-kp-item={id}>
                    <button
                        type="button"
                        data-kp-handle
                        aria-label={`Verplaats ${byId.get(id)?.label ?? id}`}
                        onKeyDown={(event) => {
                            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
                            event.preventDefault();
                            move(i, event.key === 'ArrowUp' ? i - 1 : i + 1);
                            // Focus follows the item, not the position:
                            // losing it after every move is what makes
                            // keyboard reordering unusable.
                            requestAnimationFrame(() => {
                                // Scoped to this list, not the document: a
                                // page with two reorder lists — which is
                                // exactly what the contract fixture is —
                                // otherwise moves focus into the wrong one.
                                /** @type {HTMLElement | null | undefined} */
                                const handle = list.current?.querySelector(`[data-kp-item="${CSS.escape(id)}"] [data-kp-handle]`);
                                handle?.focus();
                            });
                        }}
                    >
                        ⠿
                    </button>
                    {byId.get(id)?.label ?? id}
                </li>
            ))}
        </ul>
    );
}

/**
 * Two panes and a separator that moves with the arrow keys [TH55].
 *
 * @param {{ start: import('react').ReactNode, end: import('react').ReactNode, label?: string, min?: number, max?: number, initial?: number }} props
 */
export function SplitPane({ start, end, label = 'Panelen verdelen', min = 10, max = 90, initial = 50 }) {
    const [value, setValue] = useState(initial);
    const id = useId();

    const pane = useRef(/** @type {HTMLDivElement | null} */ (null));

    /** @param {number} next */
    const clamp = (next) => {
        const value = Math.max(min, Math.min(max, Math.round(next)));
        setValue(value);
        pane.current?.dispatchEvent(new CustomEvent(SPLIT_EVENT, { bubbles: true, detail: { value } }));
    };

    return (
        <div
            className="kp-split"
            data-kp-split
            // A custom property, which React's CSSProperties does not model;
            // the cast is the honest way to say so rather than widening the
            // whole style object to `any`.
            style={/** @type {import('react').CSSProperties} */ ({ '--kp-split': `${value}%` })}
            id={id}
            ref={pane}
        >
            <div className="kp-split__pane">{start}</div>
            <div
                className="kp-split__separator"
                role="separator"
                tabIndex={0}
                aria-orientation="vertical"
                aria-label={label}
                aria-valuemin={min}
                aria-valuemax={max}
                // The position lives here, not only in the style: a
                // separator that moves silently is one only a mouse can use.
                aria-valuenow={value}
                onKeyDown={(event) => {
                    const step = event.shiftKey ? 10 : 2;
                    if (event.key === 'ArrowLeft') clamp(value - step);
                    else if (event.key === 'ArrowRight') clamp(value + step);
                    else if (event.key === 'Home') clamp(min);
                    else if (event.key === 'End') clamp(max);
                    else return;
                    event.preventDefault();
                }}
                onPointerDown={(event) => {
                    const separator = event.currentTarget;
                    separator.setPointerCapture(event.pointerId);
                    const box = separator.parentElement?.getBoundingClientRect();
                    /** @param {PointerEvent} moved */
                    const onMove = (moved) => {
                        if (box === undefined) return;
                        clamp(((moved.clientX - box.left) / box.width) * 100);
                    };
                    const onUp = () => {
                        separator.removeEventListener('pointermove', onMove);
                        separator.removeEventListener('pointerup', onUp);
                    };
                    separator.addEventListener('pointermove', onMove);
                    separator.addEventListener('pointerup', onUp);
                }}
            />
            <div className="kp-split__pane">{end}</div>
        </div>
    );
}
