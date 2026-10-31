import { SidenavOpen } from './open.js';
export declare class SidenavSlim extends SidenavOpen {
    /**
     * The buttons that collapse and expand this rail without a line of script [gap-12]: `data-kp-sidenav-slim-toggle`, pointed at
     * the panel by `aria-controls` — or at every rail, when it names none, the way `data-kp-sidenav-toggle` does.
     * @returns {Element[]}
     */
    slimTogglers(): Element[];
    /** @param {boolean} collapsed */
    saySlim(collapsed: boolean): void;
    /** @param {boolean} [collapsed] @param {boolean} [save] @param {string} [reason] see `set` */
    setSlim(collapsed?: boolean, save?: boolean, reason?: string): void;
    /** Float the groups out in the collapsed rail and fold them back outside it: SidenavFlyout does it; the slim part has none. */
    syncRail(): void;
    /** @param {'over' | 'side' | 'push'} next */
    setMode(next: 'over' | 'side' | 'push'): void;
    /** Whether the rail stands collapsed to its icons, not expanded by the pointer or the focus. */
    isRail(): boolean;
    /** Whether the rail's groups float out beside it. */
    flying(): boolean;
}
