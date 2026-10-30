// Repository root and the page sets the wrapper gate walks.

import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** Page sets this gate reads. The site is included because it renders the components live, not only as escaped snippets. */
export const PAGE_SETS = ['examples', 'showcase', 'showcase/themes', 'site', 'site/components'];

/** Elements HTML closes for you: they open and close on the same tag. */
export const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

/** Elements whose contents are raw text rather than markup. */
export const RAW = new Set(['script', 'style']);
