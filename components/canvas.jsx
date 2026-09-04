import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { contrast, formatHsl, hslToRgb, meets, parseHsl, tokenColour } from '../js/contrast.js';
import { COLUMNS } from '../js/gridlayout.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// Colour picker and movable grid, React [TH56, TH57].
//
// Same contracts as their framework-free halves, and the colour maths is
// imported rather than rewritten: a second implementation of a contrast
// ratio is a second opinion, which is the one thing a measurement may not
// have.
//
// Since 3.0.0 [KT6]: both take a controlled value beside the uncontrolled
// default, forward a ref, pass `className`, `style` and the rest to the
// root, and expose the parts a consumer might not want. The grid also
// keeps the consumer's tile name and puts the geometry in the accessible
// description — the first version overwrote `aria-label` on every move.

/** @typedef {{ h: number, s: number, l: number }} Hsl */

/**
 * @typedef {object} ColorPickerProps
 * @property {string} [against]        The token measured against. Default `--background`.
 * @property {'text' | 'large' | 'non-text'} [kind]  Which WCAG threshold applies. Default text.
 * @property {Hsl | string} [value]      Controlled colour, as an object or an hsl() string.
 * @property {Hsl | string} [defaultValue]  Initial colour when uncontrolled.
 * @property {Hsl} [initial]           Alias of defaultValue, kept from 1.x.
 * @property {(value: string, detail: { hsl: Hsl, ratio: number | null, ok: boolean | null }) => void} [onChange]
 * @property {Element | Document} [root]  Where the theme is measured. Default: the document.
 * @property {boolean} [followTheme]   Re-measure on theme change. Default true.
 * @property {number} [step]           Slider step. Default 1.
 * @property {boolean} [showSwatch]    Default true.
 * @property {boolean} [showValue]     Default true.
 * @property {boolean} [showContrast]  Default true.
 * @property {(report: { ratio: number | null, ok: boolean | null, against: string }) => import('react').ReactNode} [renderReport]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ label?: string, slider?: string, swatch?: string, value?: string, contrast?: string }} [classNames]
 */

/** @param {Hsl | string | undefined} value @param {Hsl} fallback @returns {Hsl} */
const toHsl = (value, fallback) => (value === undefined ? fallback : typeof value === 'string' ? (parseHsl(value) ?? fallback) : value);

/**
 * A colour picker that measures itself against the theme [TH57].
 *
 * @param {ColorPickerProps & Record<string, unknown>} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function ColorPickerInner(
    {
        against = '--background',
        kind = 'text',
        value,
        defaultValue,
        initial = { h: 220, s: 90, l: 56 },
        onChange,
        root,
        followTheme = true,
        step = 1,
        showSwatch = true,
        showValue = true,
        showContrast = true,
        renderReport,
        strings,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const words = useStrings(strings);
    const id = useId();
    const [colour, setColour] = useControllable(value === undefined ? undefined : toHsl(value, initial), toHsl(defaultValue, initial), undefined);
    const [ground, setGround] = useState(/** @type {[number, number, number] | null} */ (null));
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);

    // Remeasured when the document changes theme: the same colour reads on
    // formal and disappears on terminal, which is why this number exists.
    useEffect(() => {
        const read = () => setGround(tokenColour(against, root instanceof Element ? root : undefined));
        read();
        if (!followTheme) return undefined;
        document.addEventListener('kp-theme-change', read);
        return () => document.removeEventListener('kp-theme-change', read);
    }, [against, root, followTheme]);

    const text = formatHsl(colour);
    const ratio = ground === null ? null : contrast(hslToRgb(colour), ground);
    const ok = ratio === null ? null : meets(ratio, kind);

    /** @param {'h' | 's' | 'l'} channel @param {number} n */
    const set = (channel, n) => {
        const next = { ...colour, [channel]: n };
        setColour(next);
        const nextGround = ground;
        const nextRatio = nextGround === null ? null : contrast(hslToRgb(next), nextGround);
        onChange?.(formatHsl(next), { hsl: next, ratio: nextRatio, ok: nextRatio === null ? null : meets(nextRatio, kind) });
    };

    // The three channel names are the consumer's too: a picker whose
    // sliders say "Tint" on an English page is the same defect in small.
    /** @type {{ channel: 'h' | 's' | 'l', label: string, max: number }[]} */
    const channels = [
        { channel: 'h', label: words.colourHue, max: 360 },
        { channel: 's', label: words.colourSaturation, max: 100 },
        { channel: 'l', label: words.colourLightness, max: 100 },
    ];
    const report = { ratio, ok, against };

    return (
        <div
            ref={inner}
            className={`kp-colorpicker ${className}`.trim()}
            style={style}
            data-kp-colorpicker
            data-kp-against={against}
            data-kp-contrast-ok={ok ? '' : undefined}
            {...rest}
        >
            {channels.map(({ channel, label, max }) => (
                <span key={channel} className="kp-colorpicker__channel">
                    <label className={`kp-field__label ${classNames.label ?? ''}`.trim()} htmlFor={`${id}-${channel}`}>
                        {label}
                    </label>
                    {/* Sliders rather than a canvas: a canvas needs a
                        pointer, three labelled ranges do not. */}
                    <input
                        id={`${id}-${channel}`}
                        type="range"
                        className={classNames.slider}
                        data-kp-channel={channel}
                        min={0}
                        max={max}
                        step={step}
                        value={colour[channel]}
                        onChange={(event) => set(channel, Number(event.target.value))}
                    />
                </span>
            ))}
            {showSwatch && (
                <span
                    className={`kp-colorpicker__swatch ${classNames.swatch ?? ''}`.trim()}
                    data-kp-swatch
                    aria-hidden="true"
                    style={{ background: text }}
                />
            )}
            {showValue && (
                <output className={`kp-colorpicker__value ${classNames.value ?? ''}`.trim()} data-kp-colorpicker-value>
                    {text}
                </output>
            )}
            {showContrast && (
                <p
                    className={`kp-colorpicker__contrast ${classNames.contrast ?? ''}`.trim()}
                    data-kp-colorpicker-contrast
                    role="status"
                    aria-live="polite"
                >
                    {renderReport
                        ? renderReport(report)
                        : ratio === null
                          ? words.contrastMissing(against)
                          : // The number AND the verdict: a bare 4.31 means
                            // nothing to anyone who does not know the thresholds.
                            words.contrastReport(ratio.toFixed(2), against, ok ? words.contrastPasses : words.contrastFails)}
                </p>
            )}
        </div>
    );
}
export const ColorPicker = forwardRef(ColorPickerInner);

/** @typedef {{ id: string, label: string, x: number, y: number, w: number, h: number, static?: boolean, minW?: number, maxW?: number, minH?: number, maxH?: number }} Tile */

/**
 * @typedef {object} GridLayoutProps
 * @property {Tile[]} [tiles]           Initial layout when uncontrolled (kept from 1.x).
 * @property {Tile[]} [defaultLayout]   Same, under the 3.0.0 name.
 * @property {Tile[]} [layout]          Controlled layout.
 * @property {number} [columns]
 * @property {number} [rows]            Upper bound for `y + h`. Default unbounded.
 * @property {number} [step]            Cells per key press. Default 1.
 * @property {boolean} [pointer]        Drag with a pointer as well. Default true.
 * @property {(layout: Tile[]) => void} [onLayout]   Every change.
 * @property {(layout: Tile[]) => void} [onLayoutCommit]  Once a burst of changes settles.
 * @property {number} [commitMs]        The settle time. Default 400.
 * @property {(tile: Tile) => import('react').ReactNode} [render]
 * @property {(tile: Tile) => string} [tileClassName]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * A dashboard the reader arranges [TH56].
 *
 * @param {GridLayoutProps & Record<string, unknown>} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function GridLayoutInner(
    {
        tiles,
        defaultLayout,
        layout: layoutProp,
        columns = COLUMNS,
        rows = Infinity,
        step = 1,
        pointer = true,
        onLayout,
        onLayoutCommit,
        commitMs = 400,
        render,
        tileClassName,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const words = useStrings(strings);
    const id = useId();
    const [layout, setLayout] = useControllable(layoutProp, defaultLayout ?? tiles ?? [], onLayout);
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);
    const commitTimer = useRef(0);
    const latest = useRef(layout);
    latest.current = layout;
    useEffect(() => () => clearTimeout(commitTimer.current), []);

    /** @param {string} tileId @param {Partial<Tile>} next */
    const change = (tileId, next) => {
        const updated = latest.current.map((tile) => {
            if (tile.id !== tileId || tile.static) return tile;
            // Clamped to the grid: a tile in column nine of a six-column
            // grid is one nobody can see and nobody can get back.
            const w = Math.max(tile.minW ?? 1, Math.min(next.w ?? tile.w, tile.maxW ?? columns));
            const h = Math.max(tile.minH ?? 1, Math.min(next.h ?? tile.h, tile.maxH ?? rows));
            return { ...tile, w, h, x: Math.max(0, Math.min(next.x ?? tile.x, columns - w)), y: Math.max(0, Math.min(next.y ?? tile.y, rows - h)) };
        });
        setLayout(updated);
        if (onLayoutCommit) {
            clearTimeout(commitTimer.current);
            commitTimer.current = window.setTimeout(() => onLayoutCommit(latest.current), commitMs);
        }
    };

    /** @param {import('react').PointerEvent<HTMLDivElement>} event @param {Tile} tile */
    const onPointerDown = (event, tile) => {
        if (!pointer || tile.static || event.button !== 0) return;
        if (/** @type {HTMLElement} */ (event.target).closest('button, a, input, select, textarea')) return;
        const grid = inner.current;
        if (grid === null) return;
        const box = grid.getBoundingClientRect();
        const cell = box.width / columns;
        const rowHeight = Number.parseFloat(getComputedStyle(grid).gridAutoRows) || cell;
        const origin = { x: event.clientX, y: event.clientY };
        const start = { x: tile.x, y: tile.y };
        const target = event.currentTarget;
        target.setPointerCapture(event.pointerId);
        target.dataset.kpDragging = '';
        /** @param {PointerEvent} move */
        const onMove = (move) => {
            const dx = Math.round((move.clientX - origin.x) / cell);
            const dy = Math.round((move.clientY - origin.y) / rowHeight);
            const current = latest.current.find((t) => t.id === tile.id);
            if (current && (current.x !== start.x + dx || current.y !== start.y + dy)) change(tile.id, { x: start.x + dx, y: start.y + dy });
        };
        const onUp = () => {
            delete target.dataset.kpDragging;
            target.removeEventListener('pointermove', onMove);
            target.removeEventListener('pointerup', onUp);
            target.removeEventListener('pointercancel', onUp);
        };
        target.addEventListener('pointermove', onMove);
        target.addEventListener('pointerup', onUp);
        target.addEventListener('pointercancel', onUp);
    };

    return (
        <div
            ref={inner}
            className={`kp-grid ${className}`.trim()}
            data-kp-grid
            data-kp-columns={columns}
            style={/** @type {import('react').CSSProperties} */ ({ '--kp-grid-columns': String(columns), ...style })}
            {...rest}
        >
            {layout.map((tile) => {
                const describedBy = `${id}-${tile.id}-position`;
                return (
                    <div
                        key={tile.id}
                        className={`kp-grid__tile ${tileClassName?.(tile) ?? ''}`.trim()}
                        data-kp-tile={tile.id}
                        data-x={tile.x}
                        data-y={tile.y}
                        data-w={tile.w}
                        data-h={tile.h}
                        data-kp-static={tile.static ? '' : undefined}
                        tabIndex={tile.static ? -1 : 0}
                        role="group"
                        // The name stays the consumer's; the geometry is the
                        // description, said in words, because a tile that
                        // announces itself only by moving is one nobody
                        // without sight can arrange.
                        aria-label={tile.label}
                        aria-describedby={describedBy}
                        style={{ gridColumn: `${tile.x + 1} / span ${tile.w}`, gridRow: `${tile.y + 1} / span ${tile.h}` }}
                        onPointerDown={(event) => onPointerDown(event, tile)}
                        onKeyDown={(event) => {
                            if (tile.static) return;
                            const resize = event.shiftKey;
                            /** @type {Partial<Tile> | null} */
                            let next = null;
                            if (event.key === 'ArrowRight') next = resize ? { w: tile.w + step } : { x: tile.x + step };
                            else if (event.key === 'ArrowLeft') next = resize ? { w: tile.w - step } : { x: tile.x - step };
                            else if (event.key === 'ArrowDown') next = resize ? { h: tile.h + step } : { y: tile.y + step };
                            else if (event.key === 'ArrowUp') next = resize ? { h: tile.h - step } : { y: tile.y - step };
                            if (next === null) return;
                            event.preventDefault();
                            change(tile.id, next);
                        }}
                    >
                        <span className="kp-sr-only" id={describedBy} data-kp-tile-position>
                            {words.tileLabel(tile.label, tile.x + 1, tile.y + 1, tile.w, tile.h)}
                        </span>
                        {render ? render(tile) : tile.label}
                    </div>
                );
            })}
        </div>
    );
}
export const GridLayout = forwardRef(GridLayoutInner);
