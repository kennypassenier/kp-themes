// What the verdict gate shares (gates/check-verdicts.mjs): the repository root, where the register lives, the verdicts and the fields of an entry.

export const root = new URL('../', import.meta.url);
export const REGISTER = 'catalogue/verdicts.json';
export const VERDICTS = ['approved', 'rejected'];
export const ENTRY_FIELDS = ['commit', 'given', 'hash', 'verdict'];
