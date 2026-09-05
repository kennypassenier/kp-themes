/** Where "once per session" is remembered. A default; two apps on one origin pass their own. */
export declare const BOOT_STORAGE_KEY = "fx-booted";
/**
 * CP-E1: the site "boots" — a few monospace log lines, once per session,
 * skippable with a click. Requires the optional `motion` peer.
 *
 * The overlay's classes are yours. The default set is the Tailwind one
 * kp-soft used, kept so that consumer sees no change; a consumer without
 * Tailwind passes `className` and `preClassName` with their own.
 *
 * @param {{
 *   lines?: string[],
 *   when?: import('./when.js').When,
 *   once?: boolean,
 *   storageKey?: string,
 *   perLineMs?: number,
 *   tailMs?: number,
 *   exitSeconds?: number,
 *   className?: string,
 *   preClassName?: string,
 *   caretClassName?: string,
 *   onDone?: () => void,
 * }} props
 */
export default function BootSequence({ lines: LINES, when, once, storageKey, perLineMs, tailMs, exitSeconds, className, preClassName, caretClassName, onDone, }: {
    lines?: string[];
    when?: import('./when.js').When;
    once?: boolean;
    storageKey?: string;
    perLineMs?: number;
    tailMs?: number;
    exitSeconds?: number;
    className?: string;
    preClassName?: string;
    caretClassName?: string;
    onDone?: () => void;
}): import("react").JSX.Element;
