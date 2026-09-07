// The one stylesheet list, by role [TH130].
//
// Every CSS gate used to keep its own list of the files it read, and a
// stylesheet that joined the package could be missing from one of them
// without anybody noticing — check-motion read three files, check-layers
// seven, the bundle six, each typed by hand. gates/config.json now holds
// one list with the roles a file plays, this module reads it, and a unit
// test refuses a css/ file in the manifest that has no entry there.

import { readFileSync } from 'node:fs';

const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));

/** @type {Record<string, string[]>} */
export const STYLESHEET_ROLES = Object.fromEntries(Object.entries(CONFIG.stylesheets).filter(([key]) => key !== '//'));

/**
 * The stylesheets that play a role, repository-relative, in config order.
 *
 * @param {string} role
 * @returns {string[]}
 */
export function stylesheets(role) {
    return Object.entries(STYLESHEET_ROLES)
        .filter(([, roles]) => roles.includes(role))
        .map(([file]) => file);
}
