// The words a Dutch page shows: the English dictionary with the Dutch one laid over it, as the runtime does.
// tests/fixtures/components.html is `lang="nl"`, so the parts attached to it speak Dutch since 12.2.0
// (CHANGELOG, "kp speaks Dutch on a Dutch page" [habits-1101 nl]).
import { DEFAULT_STRINGS } from '../../js/strings.js';
import { NL_STRINGS } from '../../js/strings-nl.js';

/** @type {typeof DEFAULT_STRINGS} */
export const NL = { ...DEFAULT_STRINGS, ...NL_STRINGS };
