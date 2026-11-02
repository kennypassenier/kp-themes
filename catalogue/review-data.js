// The review database's export, as the browser reads it [db-1102]. The verdicts, notes, pixel checks and the demos'
// decisions, updates and previous versions live in data/kp-themes.sqlite; the static review site cannot open that, so
// gates/generate-review-data.mjs writes three JSON files beside this module and every page reads them through here:
//
//   review-data.json    { hashVersion, verdicts, notes }               every catalogue page (judgements.js)
//   review-pixels.json  { hashVersion, commit, checked, checks, … }    catalogue pages but the Agenda (it has its index)
//   review-demos.json   { demos: { "research/<folder>/": { decided, update, previous } } }   the demo pages
//
// Each file is fetched once per page and shared by every module that asks. A file that is missing or does not parse
// reads as null; the callers say what that means for them (no verdicts yet, no decision), as they did for the JSON
// files this replaces.

/** The site's root: the folder above catalogue/. */
const ROOT = new URL('../', import.meta.url);

const FILES = /** @type {const} */ ({
    data: './review-data.json',
    pixels: './review-pixels.json',
    demos: './review-demos.json',
});

/** @type {Map<string, Promise<any>>} */
const reads = new Map();

/**
 * One export, parsed, or null when it is missing or broken. Never rejects.
 * @param {keyof typeof FILES} name
 * @returns {Promise<Record<string, any> | null>}
 */
export function readExport(name) {
    let read = reads.get(name);
    if (!read) {
        read = (async () => {
            try {
                const response = await fetch(new URL(FILES[name], import.meta.url), { cache: 'no-cache' });
                if (!response.ok) return null;
                const data = await response.json();
                return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
            } catch {
                return null;
            }
        })();
        reads.set(name, read);
    }
    return read;
}

/** The demo folder a page sits in, as the export keys it ("research/kpadopt-nav/"). @param {string | URL} page */
export function demoKey(page) {
    const folder = new URL('.', new URL(String(page), ROOT));
    return folder.href.startsWith(ROOT.href) ? decodeURIComponent(folder.href.slice(ROOT.href.length)) : '';
}

/**
 * What the database holds beside a demo page: its decision, its update and its previous version, each or undefined.
 * @param {string | URL} page the demo page's address (or any address inside its folder)
 * @returns {Promise<{ decided?: Record<string, any>, update?: Record<string, any>, previous?: Record<string, any> }>}
 */
export async function demoFacts(page) {
    const demos = (await readExport('demos'))?.demos;
    const facts = demos && typeof demos === 'object' ? demos[demoKey(page)] : undefined;
    return facts && typeof facts === 'object' ? facts : {};
}
