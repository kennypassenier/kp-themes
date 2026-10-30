/**
 * A key chord as written on the panel: `Control+b`, `Mod+Shift+k`, `Alt+n`.
 * `Control` and `Mod` are the platform's command key: Meta on a Mac.
 *
 * @param {string} chord
 * @param {boolean} mac
 */
export declare function parseChord(chord: string, mac: boolean): {
    key: string;
    ctrl: boolean;
    meta: boolean;
    alt: boolean;
    shift: boolean;
    /** The same chord as `aria-keyshortcuts` writes it. */
    aria: string;
};
/** Whether a key press belongs to a text field rather than to the page. @param {EventTarget | null} target */
export declare function typing(target: EventTarget | null): boolean;
/**
 * The time, curve and delay the panel moves its `translate` on, as its
 * computed style says right now (so after a state flip, the curve of the
 * state it goes to: a theme's own close curve, or the opening's turned
 * around). A panel with no transition on it gives `0s`.
 *
 * @param {Element} panel
 */
export declare function slideTiming(panel: Element): {
    duration: string;
    ease: string;
    delay: string;
};
export type Sidenav = {
    element: HTMLElement;
    open: (options?: {
        remember?: boolean;
    }) => void;
    /**
     * `{ remember: false }` for a close the reader did not ask for — a layout adapting to the room it has
     */
    close: (options?: {
        remember?: boolean;
    }) => void;
    toggle: (options?: {
        remember?: boolean;
    }) => void;
    setMode: (mode: 'over' | 'side' | 'push') => void;
    setSlim: (collapsed?: boolean) => void;
    isOpen: () => boolean;
    destroy: () => void;
};
/**
 * @typedef {object} Sidenav
 * @property {HTMLElement} element
 * @property {(options?: { remember?: boolean }) => void} open
 * @property {(options?: { remember?: boolean }) => void} close  `{ remember: false }` for a close the reader did not ask for — a layout adapting to the room it has
 * @property {(options?: { remember?: boolean }) => void} toggle
 * @property {(mode: 'over' | 'side' | 'push') => void} setMode
 * @property {(collapsed?: boolean) => void} setSlim
 * @property {() => boolean} isOpen
 * @property {() => void} destroy
 */
/**
 * The handle for one panel, or undefined when it was never attached.
 *
 * @param {Element | null} element
 * @returns {Sidenav | undefined}
 */
export declare function sidenavOf(element: Element | null): Sidenav | undefined;
/**
 * Whether a toggler has no name of its own, so the module gives it one.
 *
 * A toggler that already carries `aria-label` is renamed as the state
 * changes; one with words in it keeps them. What counts as words is what a
 * screen reader would read: a button holding only an `aria-hidden` glyph —
 * the arrow a rail toggle usually is — has text content and no name, and
 * was left as a bare "button" [scope-48].
 *
 * @param {Element} toggler
 */
export declare function wantsName(toggler: Element): boolean;
export declare const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
