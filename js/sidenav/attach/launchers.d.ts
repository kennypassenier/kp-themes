export type SidenavContext = import('./context.js').SidenavContext;
export type LaunchersFields = {
    launchers: () => HTMLElement[];
    light: (open: boolean, now: boolean) => void;
    lightTurn: number;
    say: (open: boolean) => void;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the launchers, the light turn and the live-region sentence part adds to the table's context.
 *
 * @typedef {{
 *     launchers: () => HTMLElement[];
 *     light: (open: boolean, now: boolean) => void;
 *     lightTurn: number;
 *     say: (open: boolean) => void;
 * }} LaunchersFields
 */
/**
 * The launchers, the light turn and the live-region sentence.
 *
 * @param {SidenavContext} c
 */
export declare function installLaunchers(c: SidenavContext): void;
