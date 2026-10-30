import { ThreadView } from './view.js';
export type ThreadSpec = import('../thread.js').ThreadSpec;
export declare class ThreadControl extends ThreadView {
    connect(): void;
    /** Draw (or redraw) from a spec; a loading spec lays the busy card, the next spec waits for it to close. @param {ThreadSpec} spec */
    set(spec: ThreadSpec): void;
    /**
     * Every option is switchable at runtime: change its attribute and the thread redraws. The attribute then wins over the
     * option the spec carried, so a page that set both keeps working [Kenny, 2026-10-17 22:09: "some things are options that
     * the component can give, like Long messages and Order"].
     */
    watchOptions(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** A click inside one message: its fold, Copy, or one of the page's actions. @param {Element} target @param {HTMLElement} item @param {string} key */
    onMessageClick(target: Element, item: HTMLElement, key: string): void;
}
