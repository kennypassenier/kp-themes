export type SidenavContext = import('./context.js').SidenavContext;
export type SlimFields = {
    flying: () => boolean;
    isRail: () => boolean;
    saySlim: (collapsed: boolean) => void;
    setMode: (next: 'side' | 'over' | 'push') => void;
    setSlim: (collapsed?: boolean, save?: boolean, reason?: string) => void;
    slimTogglers: () => Element[];
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the slim and rail modes part adds to the table's context.
 *
 * @typedef {{
 *     flying: () => boolean;
 *     isRail: () => boolean;
 *     saySlim: (collapsed: boolean) => void;
 *     setMode: (next: 'side' | 'over' | 'push') => void;
 *     setSlim: (collapsed?: boolean, save?: boolean, reason?: string) => void;
 *     slimTogglers: () => Element[];
 * }} SlimFields
 */
/**
 * The slim and rail modes.
 *
 * @param {SidenavContext} c
 */
export declare function installSlim(c: SidenavContext): void;
