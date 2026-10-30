import { Controller } from '../controller.js';
/** Follows the theme of one root: fetches the register of every theme worn, and holds a change back until its register is there. */
export declare class LazyRegisters extends Controller {
    hold: boolean;
    prune: boolean;
    doc: Document;
    loadOptions: {
        pattern: string;
        doc: Document;
    };
    /**
     * @param {HTMLElement} host the element that wears the theme (default: theme-core's root)
     * @param {{ pattern?: string, hold?: boolean, prune?: boolean }} [options]
     */
    constructor(host: HTMLElement, options?: {
        pattern?: string;
        hold?: boolean;
        prune?: boolean;
    });
    connect(): void;
    /**
     * Before a change: when the new register is not here yet, refuse the
     * change, mark it held, fetch, then ask again. The second ask finds the
     * register loaded and goes through, so the root never wears a theme
     * ahead of its register. A choice made in the meantime removes the
     * mark (applyTheme does), and the stale load then applies nothing.
     * @param {Event} e
     */
    onBefore(e: Event): void;
    /** The register has arrived: the held change goes through unless a later choice superseded it. @param {Element} element @param {string} theme */
    land(element: Element, theme: string): void;
    /** The register failed: the held change is dropped and the error reported. @param {Element} element @param {string} theme @param {unknown} error */
    giveUp(element: Element, theme: string, error: unknown): void;
    /** A theme was worn: fetch its register, and prune the previous one when asked to. @param {string} theme @param {string | null | undefined} previous */
    onChange(theme: string, previous: string | null | undefined): void;
    /** A held change is dropped rather than left to land after detach. */
    dropHeld(): void;
}
/**
 * Keep the document's registers in step with its theme (the body of attachLazyRegisters()).
 * @param {{ pattern?: string, hold?: boolean, prune?: boolean, root?: Element }} options
 * @returns {() => void} detach
 */
export declare function followRegisters({ pattern, hold, prune, root }: {
    pattern?: string;
    hold?: boolean;
    prune?: boolean;
    root?: Element;
}): () => void;
