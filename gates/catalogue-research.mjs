// What the catalogue gate reads from research/ (gates/check-catalogue.mjs): the demos offered as review pages, and each topic's README.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { loadDemoVerdicts, openDatabase } from './db/index.mjs';

/**
 * The research demos that are review pages of their own. A demo that is only the source of a bundled review page (Kenny,
 * 2026-10-19: demos of one project are bundled into one page) says so in its verdict record in the review database
 * (`bundledInto`, `node gates/verdicts.mjs bundle`) and is not offered on its own; the bundle must exist.
 * @param {URL} root
 * @returns {string[]}
 */
export function researchDemoPages(root) {
    const research = new URL('research/', root);
    /** @type {string[]} */
    const pages = [];
    if (!existsSync(research)) return pages;
    const db = openDatabase();
    try {
        for (const topic of readdirSync(research)) {
            if (!existsSync(new URL(`research/${topic}/demo.html`, root))) continue;
            const into = loadDemoVerdicts(db, topic)?.bundledInto;
            if (into && existsSync(new URL(`research/${into}/demo.html`, root))) continue;
            pages.push(`research/${topic}/demo.html`);
        }
    } finally {
        db.close();
    }
    return pages;
}

/** @param {URL} root @returns {Record<string, string>} topic to README text */
export function researchReadmes(root) {
    const research = new URL('research/', root);
    /** @type {Record<string, string>} */
    const readmes = {};
    if (!existsSync(research)) return readmes;
    for (const topic of readdirSync(research)) {
        const readme = new URL(`research/${topic}/README.md`, root);
        if (existsSync(readme)) readmes[topic] = readFileSync(readme, 'utf8');
    }
    return readmes;
}
