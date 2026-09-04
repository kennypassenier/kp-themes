import { useEffect, useId, useState } from 'react';
import { contrast, formatHsl, hslToRgb, meets, tokenColour } from '../js/contrast.js';
import { COLUMNS } from '../js/gridlayout.js';
import { useStrings } from '../hooks/use-strings.jsx';

// Colour picker and movable grid, React [TH56, TH57].
//
// Same contracts as their framework-free halves, and the colour maths is
// imported rather than rewritten: a second implementation of a contrast
// ratio is a second opinion, which is the one thing a measurement may not
// have.

/**
 * A colour picker that measures itself against the theme [TH57].
 *
 * @param {{ against?: string, kind?: 'text' | 'large' | 'non-text', initial?: {h: number, s: number, l: number}, onChange?: (value: string) => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export function ColorPicker({ against = '--background', kind = 'text', initial = { h: 220, s: 90, l: 56 }, onChange, strings }) {
    const words = useStrings(strings);
    const id = useId();
    const [colour, setColour] = useState(initial);
    const [ground, setGround] = useState(/** @type {[number, number, number] | null} */ (null));

    // Remeasured when the document changes theme: the same colour reads on
    // formal and disappears on terminal, which is why this number exists.
    useEffect(() => {
        const read = () => setGround(tokenColour(against));
        read();
        document.addEventListener('kp-theme-change', read);
        return () => document.removeEventListener('kp-theme-change', read);
    }, [against]);

    const text = formatHsl(colour);
    const ratio = ground === null ? null : contrast(hslToRgb(colour), ground);
    const ok = ratio !== null && meets(ratio, kind);

    /** @param {'h' | 's' | 'l'} channel @param {number} value */
    const set = (channel, value) => {
        const next = { ...colour, [channel]: value };
        setColour(next);
        onChange?.(formatHsl(next));
    };

    // The three channel names are the consumer's too: a picker whose
    // sliders say "Tint" on an English page is the same defect in small.
    /** @type {{ channel: 'h' | 's' | 'l', label: string, max: number }[]} */
    const channels = [
        { channel: 'h', label: words.colourHue, max: 360 },
        { channel: 's', label: words.colourSaturation, max: 100 },
        { channel: 'l', label: words.colourLightness, max: 100 },
    ];

    return (
        <div className="kp-colorpicker" data-kp-colorpicker data-kp-against={against} data-kp-contrast-ok={ok ? '' : undefined}>
            {channels.map(({ channel, label, max }) => (
                <span key={channel} style={{ display: 'contents' }}>
                    <label className="kp-field__label" htmlFor={`${id}-${channel}`}>
                        {label}
                    </label>
                    {/* Sliders rather than a canvas: a canvas needs a
                        pointer, three labelled ranges do not. */}
                    <input
                        id={`${id}-${channel}`}
                        type="range"
                        data-kp-channel={channel}
                        min={0}
                        max={max}
                        value={colour[channel]}
                        onChange={(event) => set(channel, Number(event.target.value))}
                    />
                </span>
            ))}
            <span className="kp-colorpicker__swatch" data-kp-swatch aria-hidden="true" style={{ background: text }} />
            <output className="kp-colorpicker__value" data-kp-colorpicker-value>
                {text}
            </output>
            <p className="kp-colorpicker__contrast" data-kp-colorpicker-contrast role="status" aria-live="polite">
                {ratio === null
                    ? words.contrastMissing(against)
                    : // The number AND the verdict: a bare 4.31 means
                      // nothing to anyone who does not know the thresholds.
                      words.contrastReport(ratio.toFixed(2), against, ok ? words.contrastPasses : words.contrastFails)}
            </p>
        </div>
    );
}

/** @typedef {{ id: string, label: string, x: number, y: number, w: number, h: number }} Tile */

/**
 * A dashboard the reader arranges [TH56].
 *
 * @param {{ tiles: Tile[], columns?: number, onLayout?: (layout: Tile[]) => void, render?: (tile: Tile) => import('react').ReactNode, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export function GridLayout({ tiles, columns = COLUMNS, onLayout, render, strings }) {
    const words = useStrings(strings);
    const [layout, setLayout] = useState(tiles);

    /** @param {string} id @param {Partial<Tile>} next */
    const change = (id, next) => {
        const updated = layout.map((tile) => {
            if (tile.id !== id) return tile;
            // Clamped to the grid: a tile in column nine of a six-column
            // grid is one nobody can see and nobody can get back.
            const w = Math.max(1, Math.min(next.w ?? tile.w, columns));
            const h = Math.max(1, next.h ?? tile.h);
            return { ...tile, w, h, x: Math.max(0, Math.min(next.x ?? tile.x, columns - w)), y: Math.max(0, next.y ?? tile.y) };
        });
        setLayout(updated);
        onLayout?.(updated);
    };

    return (
        <div
            className="kp-grid"
            data-kp-grid
            data-kp-columns={columns}
            style={/** @type {import('react').CSSProperties} */ ({ '--kp-grid-columns': String(columns) })}
        >
            {layout.map((tile) => (
                <div
                    key={tile.id}
                    className="kp-grid__tile"
                    data-kp-tile={tile.id}
                    data-x={tile.x}
                    data-y={tile.y}
                    data-w={tile.w}
                    data-h={tile.h}
                    tabIndex={0}
                    role="group"
                    // Said in words, because a tile that announces itself
                    // only by moving is one nobody without sight can
                    // arrange.
                    aria-label={words.tileLabel(tile.label, tile.x + 1, tile.y + 1, tile.w, tile.h)}
                    style={{ gridColumn: `${tile.x + 1} / span ${tile.w}`, gridRow: `${tile.y + 1} / span ${tile.h}` }}
                    onKeyDown={(event) => {
                        const step = event.shiftKey;
                        /** @type {Partial<Tile> | null} */
                        let next = null;
                        if (event.key === 'ArrowRight') next = step ? { w: tile.w + 1 } : { x: tile.x + 1 };
                        else if (event.key === 'ArrowLeft') next = step ? { w: tile.w - 1 } : { x: tile.x - 1 };
                        else if (event.key === 'ArrowDown') next = step ? { h: tile.h + 1 } : { y: tile.y + 1 };
                        else if (event.key === 'ArrowUp') next = step ? { h: tile.h - 1 } : { y: tile.y - 1 };
                        if (next === null) return;
                        event.preventDefault();
                        change(tile.id, next);
                    }}
                >
                    {render ? render(tile) : tile.label}
                </div>
            ))}
        </div>
    );
}
