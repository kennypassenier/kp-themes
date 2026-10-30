import { NavFoldCore } from './core.js';
export declare class NavFold extends NavFoldCore {
    connect(): void;
    /** Takes the More item and the marks the bar added off it again. */
    unfold(): void;
    /** Fit again when the list, an item or the More item changes size. */
    watchSizes(): void;
    /** The items whose natural width the fit reads: a font that loads, a counter that grows. */
    watchItems(): void;
    /** The list changing (a render adds a link, a router moves aria-current) is a reason to fit again; the More item's own menu is not. */
    watchList(): void;
    /** @param {MouseEvent} event */
    onPick(event: MouseEvent): void;
}
