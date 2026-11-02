// A demo's build script reads Kenny's verdicts on it from the review database (data/kp-themes.sqlite, gates/db/), where
// `node gates/verdicts.mjs round` records them; research/<demo>/VERDICTS.json is gone [db-1102]. Node only: the review
// kit in the browser never reads the verdicts.
//
//   const { verdicts, received } = demoVerdicts(here, { demo: ID });
//
// verdicts  the demo's record, { demo, rounds: [{ round, page, allJudged, approved, notApproved, … }], reopened, bundledInto }
// received  the page round ids the rounds answer, in order: the page's data-review-round "received"
//
// A demo without a record gets one with no rounds (and `bundledInto` when the defaults say so), as the build scripts
// wrote an empty VERDICTS.json before; an existing record is only read, so a rebuild leaves the database untouched.
import { fileURLToPath } from 'node:url';
import { relative, sep } from 'node:path';
import { loadDemoVerdicts, reading, saveDemoVerdicts, writing } from '../../gates/db/index.mjs';

const RESEARCH = fileURLToPath(new URL('../', import.meta.url));

/**
 * @param {URL | string} dir the demo's folder (a build script's `here`)
 * @param {{ demo: string, bundledInto?: string }} defaults the record a demo without one starts with
 * @returns {{ verdicts: { demo: string, rounds: any[], reopened?: any[], bundledInto?: string }, received: string[] }}
 */
export function demoVerdicts(dir, defaults) {
    const folder = relative(RESEARCH, fileURLToPath(dir)).split(sep).join('/');
    if (!folder || folder.startsWith('..')) throw new Error(`${dir} is not a folder under research/`);
    let verdicts = reading((db) => loadDemoVerdicts(db, folder));
    if (!verdicts) {
        verdicts = { ...defaults, rounds: [] };
        writing((db) => saveDemoVerdicts(db, folder, /** @type {any} */ (verdicts)));
    }
    const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
    return { verdicts: /** @type {any} */ (verdicts), received };
}
