// What the verdict gate shares (gates/check-verdicts.mjs): the repository root, where the register lives, the verdicts and the fields of an entry.

export const root = new URL('../', import.meta.url);
/** How messages name the register: the `verdicts` table of the review database (gates/db/). */
export const REGISTER = 'the verdict register (data/kp-themes.sqlite)';
export const VERDICTS = ['approved', 'rejected'];
export const ENTRY_FIELDS = ['commit', 'given', 'hash', 'verdict'];
