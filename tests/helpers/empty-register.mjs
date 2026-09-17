// A verdict register of the test's own, in place of catalogue/verdicts.json.
//
// A catalogue page hides a block that is already judged, and the register in
// the repository fills up as Kenny judges; a test that reads a block must not
// find it gone because of a verdict given since. So a catalogue test starts
// from an empty register, or from the few verdicts it sets itself.

import { HASH_VERSION } from '../../catalogue/block-hash.js';

/**
 * Serve `verdicts` as the register for every page of the context, and
 * `notes` as its review notes (catalogue/review-notes.json): a note brings a
 * judged block back to the page, so the committed ones must not decide a
 * test either.
 *
 * @param {import('@playwright/test').BrowserContext} context
 * @param {Record<string, unknown>} [verdicts] default none
 * @param {Record<string, unknown>} [notes] default none
 */
export async function useRegister(context, verdicts = {}, notes = {}) {
    await context.route('**/catalogue/verdicts.json', (route) => route.fulfill({ json: { hashVersion: HASH_VERSION, verdicts } }));
    await context.route('**/catalogue/review-notes.json', (route) => route.fulfill({ json: notes }));
}

/**
 * Serve an empty register, so no block is hidden as already judged.
 *
 * @param {import('@playwright/test').BrowserContext} context
 */
export const useEmptyRegister = (context) => useRegister(context);
