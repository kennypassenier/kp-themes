import { forwardRef } from 'react';

// Marquee [M1, 2026-09-08].
//
// The first shared element whose content the consumer supplies and whose
// motion the theme decides. It renders one row of items and nothing else:
// `js/effects.js` builds the track, doubles the row for a seamless pass
// and hides the copy from a screen reader, so both channels produce the
// same DOM and a page without the module shows the items standing still.
//
// Two knobs a consumer may set as inline custom properties, both also
// answerable by a theme: `--kp-marquee` (how long one pass takes) and
// `--kp-marquee-pause` (`offscreen`, the default, or `never`).

/**
 * @typedef {object} MarqueeProps
 * @property {import('react').ReactNode[]} [items]  Each item becomes one cell of the row.
 * @property {string} [duration]  One pass, e.g. '42000ms'. Default: the theme's own.
 * @property {'offscreen' | 'never'} [pause]  Rest while off screen. Default 'offscreen'.
 * @property {string} [label]  The accessible name of the band. Default: none, so it is unlabelled scenery.
 * @property {import('react').ElementType} [as]  Default 'div'.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {MarqueeProps & import('react').HTMLAttributes<HTMLElement>} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function MarqueeInner({ items, duration, pause, label, as: As = 'div', className = '', style, children, ...rest }, ref) {
    // The knobs ride as inline custom properties rather than as classes,
    // so a consumer overrides one without leaving the theme's own values
    // for the other [KT6: every state has a named way out].
    const knobs = /** @type {import('react').CSSProperties} */ ({
        ...(duration ? { '--kp-marquee': duration } : null),
        ...(pause ? { '--kp-marquee-pause': pause } : null),
        ...style,
    });
    return (
        <As ref={ref} className={`kp-marquee ${className}`.trim()} data-kp-marquee="" aria-label={label} style={knobs} {...rest}>
            {items ? items.map((item, i) => <span key={i}>{item}</span>) : children}
        </As>
    );
}

const Marquee = forwardRef(MarqueeInner);
export default Marquee;
