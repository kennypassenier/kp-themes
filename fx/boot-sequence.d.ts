/**
 * CP-E1: the site "boots" - a few monospace log lines, once per
 * session, skippable with a click. Cyberpunk only; other themes never
 * mount the overlay at all. Requires the optional `motion` peer.
 * @param {{ lines?: string[] }} props  kp-soft used '> INIT KP-SOFT' as the first line; pass your own.
 */
export default function BootSequence({ lines: LINES }: {
    lines?: string[];
}): import("react").JSX.Element;
