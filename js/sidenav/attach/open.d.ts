export type SidenavContext = import('./context.js').SidenavContext;
export type OpenFields = {
    ask: (name: string, detail: Record<string, unknown>, reason: string) => 'prevented' | 'asked' | 'told';
    close: (arg0?: {
        remember?: boolean | undefined;
    }) => void;
    open: (arg0?: {
        remember?: boolean | undefined;
    }) => void;
    refuse: () => void;
    set: (open: boolean, moveFocus?: boolean, save?: boolean, reason?: string) => void;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the opening, closing and refusing: the one place the open state changes part adds to the table's context.
 *
 * @typedef {{
 *     ask: (name: string, detail: Record<string, unknown>, reason: string) => 'prevented' | 'asked' | 'told';
 *     close: (arg0?: { remember?: boolean | undefined; }) => void;
 *     open: (arg0?: { remember?: boolean | undefined; }) => void;
 *     refuse: () => void;
 *     set: (open: boolean, moveFocus?: boolean, save?: boolean, reason?: string) => void;
 * }} OpenFields
 */
/**
 * Opening, closing and refusing: the one place the open state changes.
 *
 * @param {SidenavContext} c
 */
export declare function installOpen(c: SidenavContext): void;
