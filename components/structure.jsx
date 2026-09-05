import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { REORDER_EVENT, SPLIT_EVENT } from '../js/structure.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// Tree, reorder and split pane, React [TH45, TH46, TH55].
//
// Same contract as js/structure.js, and the same principle: each of these
// is trivial with a mouse, so the code is mostly about the keyboard.
//
// Since 3.0.0 [KT6]: every state is controllable — expanded and selected
// on the tree, the order of the list, the split's value — with a React
// callback beside the DOM event; ids are scoped to the instance, so two
// trees on a page no longer fight over focus; the items re-sync when the
// props change instead of freezing at mount; the reorder moves by pointer
// too; the split runs horizontally; and every fixed glyph or number is a
// prop.

/** @typedef {{ id: string, label: import('react').ReactNode, children?: TreeNode[], disabled?: boolean, icon?: import('react').ReactNode }} TreeNode */

/**
 * @typedef {object} TreeProps
 * @property {TreeNode[]} nodes
 * @property {string} label
 * @property {string[]} [expanded]          Controlled.
 * @property {string[]} [defaultExpanded]
 * @property {(expanded: string[]) => void} [onExpandedChange]
 * @property {string | null} [selected]      Controlled.
 * @property {string | null} [defaultSelected]
 * @property {(id: string | null) => void} [onSelectedChange]
 * @property {(id: string) => void} [onSelect]      Kept from 1.x: called on a leaf (or any node when `selectable`).
 * @property {boolean} [selectable]        Branches can be selected too, and Enter selects rather than toggles. Default false.
 * @property {'toggle' | 'select'} [clickBranch]  What a click on a branch does. Default toggle.
 * @property {boolean} [typeahead]         Default true.
 * @property {number} [typeaheadMs]        Default 500.
 * @property {string} [indent]             Per level. Default 1rem.
 * @property {(node: TreeNode, state: { depth: number, expanded: boolean, selected: boolean }) => import('react').ReactNode} [renderNode]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {TreeProps & Omit<import('react').HTMLAttributes<HTMLUListElement>, 'onSelect'>} props
 * @param {import('react').ForwardedRef<HTMLUListElement>} ref
 */
function TreeInner(
    {
        nodes,
        label,
        expanded,
        defaultExpanded = [],
        onExpandedChange,
        selected,
        defaultSelected = null,
        onSelectedChange,
        onSelect,
        selectable = false,
        clickBranch = 'toggle',
        typeahead = true,
        typeaheadMs = 500,
        indent = '1rem',
        renderNode,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const base = useId().replace(/:/g, '');
    const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
    const [chosen, setChosen] = useControllable(selected, defaultSelected, onSelectedChange);
    const [at, setAt] = useState(/** @type {string | null} */ (null));
    /** @type {import('react').RefObject<HTMLUListElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLUListElement} */ (inner.current), []);
    const buffer = useRef({ text: '', timer: 0 });

    /** Every node a reader can see, flattened — collapsed branches excluded. */
    /** @type {{ node: TreeNode, depth: number, parent: string | null }[]} */
    const flat = [];
    /** @param {TreeNode[]} list @param {number} depth @param {string | null} parent */
    const walk = (list, depth, parent) => {
        for (const node of list) {
            flat.push({ node, depth, parent });
            // Down goes to the next thing you can SEE: walking into a
            // closed folder is the bug that makes a tree feel broken.
            if (node.children && open.includes(node.id)) walk(node.children, depth + 1, node.id);
        }
    };
    walk(nodes, 0, null);
    const current = at ?? flat[0]?.node.id ?? null;

    /** @param {string} id */
    const domId = (id) => `${base}-${id}`;
    /** @param {string} id */
    const focus = (id) => {
        setAt(id);
        // Scoped to this tree: two trees on a page stole each other's
        // focus in the first version.
        /** @type {HTMLElement | null | undefined} */ (inner.current?.querySelector(`#${CSS.escape(domId(id))}`))?.focus();
    };
    /** @param {string} id */
    const toggle = (id) => setOpen(open.includes(id) ? open.filter((x) => x !== id) : [...open, id]);
    /** @param {string} id */
    const select = (id) => {
        setChosen(id);
        onSelect?.(id);
    };

    /** @param {import('react').KeyboardEvent} event @param {{node: TreeNode, parent: string | null}} entry */
    const onKeyDown = (event, entry) => {
        const index = flat.findIndex((f) => f.node.id === entry.node.id);
        const expandable = Boolean(entry.node.children?.length);
        const isOpen = open.includes(entry.node.id);
        const go = (/** @type {number} */ next) => {
            const target = flat[next];
            if (target !== undefined) focus(target.node.id);
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
                else if (entry.parent !== null) focus(entry.parent);
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
                if (selectable) select(entry.node.id);
                else if (expandable) toggle(entry.node.id);
                else select(entry.node.id);
                break;
            default: {
                if (!typeahead || event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
                // Typeahead with a buffer: "do" finds Documents rather
                // than Downloads. In a tree of forty folders this is the
                // difference between usable and theoretical.
                clearTimeout(buffer.current.timer);
                buffer.current.text += event.key.toLowerCase();
                buffer.current.timer = window.setTimeout(() => (buffer.current.text = ''), typeaheadMs);
                const text = buffer.current.text;
                const after = text.length > 1 ? flat : [...flat.slice(index + 1), ...flat.slice(0, index + 1)];
                const found = after.find((f) => String(f.node.label).toLowerCase().startsWith(text));
                if (found !== undefined) {
                    event.preventDefault();
                    focus(found.node.id);
                }
            }
        }
    };

    return (
        <ul
            ref={inner}
            className={`kp-tree ${className}`.trim()}
            style={/** @type {import('react').CSSProperties} */ ({ '--kp-tree-indent': indent, ...style })}
            role="tree"
            aria-label={label}
            data-kp-tree
            {...rest}
        >
            {flat.map((entry) => {
                const expandable = Boolean(entry.node.children?.length);
                const isOpen = open.includes(entry.node.id);
                const isSelected = chosen === entry.node.id;
                return (
                    <li
                        key={entry.node.id}
                        id={domId(entry.node.id)}
                        data-kp-item={entry.node.id}
                        role="treeitem"
                        aria-expanded={expandable ? isOpen : undefined}
                        aria-selected={selectable || !expandable ? isSelected : undefined}
                        aria-level={entry.depth + 1}
                        aria-disabled={entry.node.disabled ? 'true' : undefined}
                        // One tab stop for the whole tree: otherwise a keyboard
                        // user presses Tab forty times to get past a folder list.
                        tabIndex={entry.node.id === current ? 0 : -1}
                        style={/** @type {import('react').CSSProperties} */ ({ '--kp-tree-depth': entry.depth })}
                        onClick={(event) => {
                            event.stopPropagation();
                            if (entry.node.disabled) return;
                            setAt(entry.node.id);
                            const onChevron = /** @type {HTMLElement} */ (event.target).closest('[data-kp-tree-toggle]') !== null;
                            if (expandable && (clickBranch === 'toggle' || onChevron)) toggle(entry.node.id);
                            if (!expandable || (selectable && (clickBranch === 'select' || !onChevron))) select(entry.node.id);
                        }}
                        onKeyDown={(event) => onKeyDown(event, entry)}
                    >
                        {renderNode ? (
                            renderNode(entry.node, { depth: entry.depth, expanded: isOpen, selected: isSelected })
                        ) : (
                            <>
                                {entry.node.icon}
                                {entry.node.label}
                            </>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
export const Tree = forwardRef(TreeInner);

/** @typedef {{ id: string, label: import('react').ReactNode, disabled?: boolean }} ReorderItem */

/**
 * A list that reorders from the keyboard [TH46], and with a pointer.
 *
 * @typedef {object} ReorderProps
 * @property {ReorderItem[]} items
 * @property {string[]} [order]          Controlled.
 * @property {string[]} [defaultOrder]   Default: the items' order.
 * @property {(order: string[], move: { id: string, from: number, to: number }) => void} [onChange]
 * @property {boolean} [pointer]         Drag with a pointer. Default true.
 * @property {boolean} [emitDomEvent]    Dispatch REORDER_EVENT on the list too. Default true.
 * @property {import('react').ReactNode} [handleGlyph]
 * @property {(item: ReorderItem, index: number) => import('react').ReactNode} [renderItem]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {ReorderProps & Omit<import('react').HTMLAttributes<HTMLUListElement>, 'onChange'>} props
 * @param {import('react').ForwardedRef<HTMLUListElement>} ref
 */
function ReorderInner(
    {
        items,
        order: orderProp,
        defaultOrder,
        onChange,
        pointer = true,
        emitDomEvent = true,
        handleGlyph = '⠿',
        renderItem,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const [order, setOrder] = useControllable(orderProp, defaultOrder ?? items.map((i) => i.id), undefined);
    const [announced, setAnnounced] = useState('');
    const byId = new Map(items.map((i) => [i.id, i]));
    /** @type {import('react').RefObject<HTMLUListElement | null>} */
    const list = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLUListElement} */ (list.current), []);

    // Items added or removed after mount join the order rather than
    // vanishing, which is what the first version did.
    useEffect(() => {
        if (orderProp !== undefined) return;
        const ids = items.map((i) => i.id);
        const kept = order.filter((id) => ids.includes(id));
        const added = ids.filter((id) => !kept.includes(id));
        if (kept.length !== order.length || added.length > 0) setOrder([...kept, ...added]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    /** @param {number} from @param {number} to */
    const move = (from, to) => {
        if (to < 0 || to >= order.length || from === to) return;
        const next = [...order];
        const [taken] = next.splice(from, 1);
        if (taken === undefined) return;
        next.splice(to, 0, taken);
        setOrder(next);
        onChange?.(next, { id: taken, from, to });
        // Said in words: a list that reorders silently is one a screen
        // reader user cannot arrange.
        const label = byId.get(taken)?.label;
        setAnnounced(s.reorderMoved(typeof label === 'string' ? label : taken, to + 1, next.length));
        // The DOM event as well as the callback: the framework-free half
        // announces on the element, and a consumer that listens for it
        // should not have to care which channel rendered the list.
        if (emitDomEvent)
            list.current?.dispatchEvent(new CustomEvent(REORDER_EVENT, { bubbles: true, detail: { order: next, id: taken, from, to } }));
        return taken;
    };

    /** @param {import('react').PointerEvent<HTMLButtonElement>} event @param {string} id */
    const onPointerDown = (event, id) => {
        if (!pointer || event.button !== 0) return;
        event.preventDefault();
        const handle = event.currentTarget;
        handle.setPointerCapture(event.pointerId);
        const item = handle.closest('[data-kp-item]');
        if (item instanceof HTMLElement) item.dataset.kpDragging = '';
        /** @param {PointerEvent} moved */
        const onMove = (moved) => {
            const children = [...(list.current?.children ?? [])];
            const from = children.findIndex((c) => /** @type {HTMLElement} */ (c).dataset.kpItem === id);
            for (let i = 0; i < children.length; i++) {
                if (i === from) continue;
                const box = children[i]?.getBoundingClientRect();
                if (box && moved.clientY >= box.top && moved.clientY <= box.bottom) {
                    move(from, i);
                    break;
                }
            }
        };
        const onUp = () => {
            if (item instanceof HTMLElement) delete item.dataset.kpDragging;
            handle.removeEventListener('pointermove', onMove);
            handle.removeEventListener('pointerup', onUp);
            handle.removeEventListener('pointercancel', onUp);
        };
        handle.addEventListener('pointermove', onMove);
        handle.addEventListener('pointerup', onUp);
        handle.addEventListener('pointercancel', onUp);
    };

    return (
        <>
            <ul className={`kp-reorder ${className}`.trim()} style={style} data-kp-reorder ref={list} {...rest}>
                {order.map((id, i) => {
                    const item = byId.get(id);
                    if (item === undefined) return null;
                    const label = typeof item.label === 'string' ? item.label : id;
                    return (
                        <li key={id} data-kp-item={id}>
                            <button
                                type="button"
                                data-kp-handle
                                className="kp-reorder__handle"
                                aria-label={s.reorderHandle(label)}
                                disabled={item.disabled}
                                onPointerDown={(event) => onPointerDown(event, id)}
                                onKeyDown={(event) => {
                                    /** @type {Record<string, number>} */
                                    const targets = { ArrowUp: i - 1, ArrowDown: i + 1, Home: 0, End: order.length - 1 };
                                    const to = targets[event.key];
                                    if (to === undefined) return;
                                    event.preventDefault();
                                    move(i, to);
                                    // Focus follows the item, not the position:
                                    // losing it after every move is what makes
                                    // keyboard reordering unusable.
                                    requestAnimationFrame(() => {
                                        /** @type {HTMLElement | null | undefined} */
                                        const handle = list.current?.querySelector(`[data-kp-item="${CSS.escape(id)}"] [data-kp-handle]`);
                                        handle?.focus();
                                    });
                                }}
                            >
                                {handleGlyph}
                            </button>
                            {renderItem ? renderItem(item, i) : item.label}
                        </li>
                    );
                })}
            </ul>
            <span className="kp-sr-only" role="status" aria-live="polite" data-kp-reorder-status>
                {announced}
            </span>
        </>
    );
}
export const Reorder = forwardRef(ReorderInner);

/**
 * Two panes and a separator that moves with the arrow keys [TH55].
 *
 * @typedef {object} SplitPaneProps
 * @property {import('react').ReactNode} start
 * @property {import('react').ReactNode} end
 * @property {string} [label]
 * @property {number} [min]           Default 10.
 * @property {number} [max]           Default 90.
 * @property {number} [value]         Controlled percentage.
 * @property {number} [defaultValue]  Default 50.
 * @property {number} [initial]       Alias of defaultValue, kept from 1.x.
 * @property {(value: number) => void} [onChange]
 * @property {'vertical' | 'horizontal'} [orientation]  The separator's. Default vertical (left | right).
 * @property {number} [step]          Default 2.
 * @property {number} [largeStep]     With Shift. Default 10.
 * @property {boolean} [collapseOnDoubleClick]  Default false.
 * @property {boolean} [emitDomEvent] Default true.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ pane?: string, separator?: string }} [classNames]
 */

/**
 * @param {SplitPaneProps & Omit<import('react').HTMLAttributes<HTMLDivElement>, 'onChange'>} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function SplitPaneInner(
    {
        start,
        end,
        label,
        min = 10,
        max = 90,
        value: valueProp,
        defaultValue,
        initial = 50,
        onChange,
        orientation = 'vertical',
        step = 2,
        largeStep = 10,
        collapseOnDoubleClick = false,
        emitDomEvent = true,
        strings,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const name = label ?? s.splitLabel;
    const [value, setValue] = useControllable(valueProp, defaultValue ?? initial, onChange);
    const lastOpen = useRef(value);
    const id = useId();
    const horizontal = orientation === 'horizontal';
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const pane = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (pane.current), []);

    /** @param {number} next */
    const clamp = (next) => {
        const clamped = Math.max(min, Math.min(max, Math.round(next)));
        setValue(clamped);
        if (emitDomEvent) pane.current?.dispatchEvent(new CustomEvent(SPLIT_EVENT, { bubbles: true, detail: { value: clamped } }));
    };

    return (
        <div
            className={`kp-split ${className}`.trim()}
            data-kp-split
            data-kp-orientation={orientation}
            // A custom property, which React's CSSProperties does not model;
            // the cast is the honest way to say so rather than widening the
            // whole style object to `any`.
            style={/** @type {import('react').CSSProperties} */ ({ '--kp-split': `${value}%`, ...style })}
            id={id}
            ref={pane}
            {...rest}
        >
            <div className={`kp-split__pane ${classNames.pane ?? ''}`.trim()}>{start}</div>
            <div
                className={`kp-split__separator ${classNames.separator ?? ''}`.trim()}
                role="separator"
                tabIndex={0}
                aria-orientation={orientation}
                aria-label={name}
                aria-valuemin={min}
                aria-valuemax={max}
                // The position lives here, not only in the style: a
                // separator that moves silently is one only a mouse can use.
                aria-valuenow={value}
                onKeyDown={(event) => {
                    const delta = event.shiftKey ? largeStep : step;
                    const less = horizontal ? 'ArrowUp' : 'ArrowLeft';
                    const more = horizontal ? 'ArrowDown' : 'ArrowRight';
                    if (event.key === less) clamp(value - delta);
                    else if (event.key === more) clamp(value + delta);
                    else if (event.key === 'Home') clamp(min);
                    else if (event.key === 'End') clamp(max);
                    else return;
                    event.preventDefault();
                }}
                onDoubleClick={() => {
                    if (!collapseOnDoubleClick) return;
                    if (value > min) {
                        lastOpen.current = value;
                        clamp(min);
                    } else clamp(lastOpen.current);
                }}
                onPointerDown={(event) => {
                    const separator = event.currentTarget;
                    separator.setPointerCapture(event.pointerId);
                    const box = separator.parentElement?.getBoundingClientRect();
                    /** @param {PointerEvent} moved */
                    const onMove = (moved) => {
                        if (box === undefined) return;
                        clamp(horizontal ? ((moved.clientY - box.top) / box.height) * 100 : ((moved.clientX - box.left) / box.width) * 100);
                    };
                    const onUp = () => {
                        separator.removeEventListener('pointermove', onMove);
                        separator.removeEventListener('pointerup', onUp);
                        separator.removeEventListener('pointercancel', onUp);
                    };
                    separator.addEventListener('pointermove', onMove);
                    separator.addEventListener('pointerup', onUp);
                    separator.addEventListener('pointercancel', onUp);
                }}
            />
            <div className={`kp-split__pane ${classNames.pane ?? ''}`.trim()}>{end}</div>
        </div>
    );
}
export const SplitPane = forwardRef(SplitPaneInner);
