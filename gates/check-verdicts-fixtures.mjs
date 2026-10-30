// Shared fixtures of the verdict register tests: a hash, a record context, an entry and a block map.

export const HASH = 'a'.repeat(64);

export const context = (overrides = {}) => ({
    hashVersion: 2,
    known: new Set(['button--variants', 'research/navbar/demo.html#current']),
    themes: ['formal', 'nostromo'],
    ...overrides,
});

export const entry = (extra = {}) => ({ verdict: 'approved', hash: HASH, commit: '2a32791', given: '2026-09-13', ...extra });

// A Map, the way knownBlocks returns one, so the gate can tell a component
// block from a research demo and a theme intro from a block in every theme.
/** @type {(overrides?: Record<string, { page: string, label: string, block: string, component: boolean, theme?: string }>) => Map<string, { page: string, label: string, block: string, component: boolean, theme?: string }>} */
export const blocks = (overrides = {}) =>
    new Map([
        ['button--variants', { page: 'catalogue/buttons.html', label: 'Buttons', block: 'variants', component: true }],
        ['research/navbar/demo.html#current', { page: 'research/navbar/demo.html', label: 'Navbar', block: 'current', component: false }],
        ...Object.entries(overrides),
    ]);
