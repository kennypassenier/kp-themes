export type Sidenav = import('../helpers.js').Sidenav;
export type SidenavContext = import('./context.js').SidenavContext;
/** @typedef {import('../helpers.js').Sidenav} Sidenav */
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * The handle a page gets back and the detach that undoes everything.
 *
 * @param {SidenavContext} c
 */
export declare function installHandle(c: SidenavContext): void;
