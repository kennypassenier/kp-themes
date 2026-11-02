// The review database's export for the browser (build output, like catalogue/agenda-index.json): the static review site
// on GitHub Pages cannot open data/kp-themes.sqlite, so the catalogue and the demo pages read these generated files.
//
//   catalogue/review-data.json    the verdict register and the review notes (catalogue/judgements.js)
//   catalogue/review-pixels.json  the pixel checks (judgements.js; the Agenda reads the few that reopen from its index)
//   catalogue/review-demos.json   per demo folder its decision, update and previous version (waiting.js, review.js,
//                                 block-tools.js and the archived character demos)
//
// Three files and not one: the Agenda never loads the 700 KB of pixel checks, and a demo page loads neither the
// register nor the checks, as before the move. Never edited by hand; every tool that writes the database writes them.
//
//   node gates/generate-review-data.mjs          write them from the database
//   node gates/generate-review-data.mjs --check  refuse when one is stale (in npm run gates)

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import * as prettier from 'prettier';
import { EXPORTS, ROOT, loadDemoFacts, loadNotes, loadPixelChecks, loadRegister, reading, usesRepositoryDatabase } from './db/index.mjs';

const GENERATED =
    'Generated from the review database (data/kp-themes.sqlite) by node gates/generate-review-data.mjs; never edit it by hand, ' +
    'the gate refuses a commit that leaves it stale. Change the database with the tools in gates/verdicts.mjs and gates/review-db.mjs.';

/**
 * Per demo folder ("research/<folder>/") what stands beside it. A previous version is offered only while its frozen copy
 * (research/<folder>/_previous/) is there: archiving a demo removes the copy, and with it the link to it.
 * @param {import('node:sqlite').DatabaseSync} db
 */
function demoFacts(db) {
    /** @type {Record<string, Record<string, any>>} */
    const demos = {};
    for (const kind of /** @type {const} */ (['decided', 'update', 'previous']))
        for (const [folder, record] of Object.entries(loadDemoFacts(db, kind))) {
            if (kind === 'previous' && !existsSync(join(ROOT, 'research', folder, '_previous'))) continue;
            (demos[`research/${folder}/`] ??= {})[kind] = record;
        }
    return Object.fromEntries(Object.entries(demos).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/** The three documents, keyed by their path. @param {import('node:sqlite').DatabaseSync} db */
export function reviewDocuments(db) {
    const register = loadRegister(db);
    const { $comment: about, ...pixels } = /** @type {Record<string, any>} */ (loadPixelChecks(db) ?? { checks: {} });
    return {
        [EXPORTS.data]: { $comment: GENERATED, hashVersion: register.hashVersion, verdicts: register.verdicts, notes: loadNotes(db) },
        [EXPORTS.pixels]: { $comment: GENERATED, ...(about ? { about } : {}), ...pixels },
        [EXPORTS.demos]: { $comment: GENERATED, demos: demoFacts(db) },
    };
}

/** A document as prettier writes JSON, so --check and prettier --write agree. @param {string} path @param {unknown} document */
async function formatted(path, document) {
    const options = (await prettier.resolveConfig(join(ROOT, path))) ?? {};
    return prettier.format(JSON.stringify(document), { ...options, parser: 'json' });
}

/** Every export as it should read now. @returns {Promise<[string, string][]>} */
async function wanted() {
    const documents = reading(reviewDocuments);
    return Promise.all(Object.entries(documents).map(async ([path, document]) => /** @type {[string, string]} */ ([path, await formatted(path, document)])));
}

/** Write the exports; a line saying what was written. */
export async function writeReviewData() {
    // A test or a trial run on another database must not rewrite the repository's exports with its rows.
    if (!usesRepositoryDatabase()) return 'review data: not written, KP_THEMES_DB names another database than data/kp-themes.sqlite.';
    const files = await wanted();
    for (const [path, text] of files) writeFileSync(join(ROOT, path), text);
    return `review data: ${files.map(([path]) => path).join(', ')} written from the review database.`;
}

async function main() {
    if (!process.argv.includes('--check')) return console.log(await writeReviewData());
    const stale = (await wanted()).filter(([path, text]) => !existsSync(join(ROOT, path)) || readFileSync(join(ROOT, path), 'utf8') !== text);
    if (stale.length) {
        console.error(`${stale.map(([path]) => path).join(', ')} stale against data/kp-themes.sqlite; run node gates/generate-review-data.mjs and commit them with the change`);
        process.exit(1);
    }
    console.log(`review data: ${Object.values(EXPORTS).join(', ')} current.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(`generate-review-data: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    });
}
