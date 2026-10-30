export { VERSION_DELTA, VERSION_COPY_EVENT, VERSION_LEVELS, VERSION_SORT } from './version-delta/values.js';
export { versionNumbers, versionLevel, summarizeDeltas } from './version-delta/level.js';
export { githubRepo, releaseUrl } from './version-delta/links.js';
export type VersionLevel = 'same' | 'other' | 'patch' | 'minor' | 'major' | 'downgrade' | 'unknown';
export type LevelOptions = {
    scheme?: 'numbers' | 'semver' | 'calver' | 'none';
    /**
     * which number's change is a big jump
     */
    bigAt?: 'first' | 'second';
    /**
     * the app's name
     */
    app?: string;
    /**
     * apps whose second number counts as big too
     */
    bigMinorApps?: readonly string[];
    /**
     * one app's own say
     */
    level?: VersionLevel | 'auto';
};
/** @typedef {'same' | 'other' | 'patch' | 'minor' | 'major' | 'downgrade' | 'unknown'} VersionLevel */
/**
 * @typedef {object} LevelOptions
 * @property {'numbers' | 'semver' | 'calver' | 'none'} [scheme]
 * @property {'first' | 'second'} [bigAt] which number's change is a big jump
 * @property {string} [app] the app's name
 * @property {readonly string[]} [bigMinorApps] apps whose second number counts as big too
 * @property {VersionLevel | 'auto'} [level] one app's own say
 */
/**
 * Set a chip's versions and draw it again.
 * @param {HTMLElement} el
 * @param {{ from?: string | null, to?: string | null, app?: string, href?: string | null, state?: 'loading' | 'error' | 'empty' | 'ready', error?: string }} change
 */
export declare function setVersionDelta(el: HTMLElement, { from, to, app, href, state, error }?: {
    from?: string | null;
    to?: string | null;
    app?: string;
    href?: string | null;
    state?: 'loading' | 'error' | 'empty' | 'ready';
    error?: string;
}): void;
/**
 * Draw every version chip under `root` and keep it in step with its attributes.
 * @param {ParentNode} [root]
 * @param {{ bigMinorApps?: readonly string[], href?: string | null }} [options]
 * @returns {() => void} detach
 */
export declare function attachVersionDeltas(root?: ParentNode, options?: {
    bigMinorApps?: readonly string[];
    href?: string | null;
}): () => void;
