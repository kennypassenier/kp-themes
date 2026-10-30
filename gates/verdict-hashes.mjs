// Hashing review blocks outside a reviewer's browser: a static server over a
// checkout, a browser page per review page, and the block hash of
// catalogue/block-hash.js read exactly the way the review pages read it.
//
// Used by gates/verdicts.mjs (rehash, and the browser comparison). The
// server takes overrides, so a checkout of an old commit can be served with
// the CURRENT block-hash.js in place of its own: the hash of a block as it
// looked then, under the recipe of now.

export { serve, blockPages } from './verdict-hashes/server.mjs';
export { IN_PAGE, measurePlaywright } from './verdict-hashes/measure.mjs';
export { PREPARE, shootPlaywright, printShell } from './verdict-hashes/shoot.mjs';
export { BidiGecko, firstDifference } from './verdict-hashes/bidi.mjs';
