export type SidenavContext = import('./context.js').SidenavContext;
export type RailFields = {
    glyphs: HTMLElement[];
    onRailKey: (event: KeyboardEvent) => void;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the rail glyphs, the start state and the rail keys part adds to the table's context.
 *
 * @typedef {{
 *     glyphs: HTMLElement[];
 *     onRailKey: (event: KeyboardEvent) => void;
 * }} RailFields
 */
/**
 * The rail glyphs, the start state and the rail keys.
 *
 * @param {SidenavContext} c
 */
export declare function installRail(c: SidenavContext): void;
