import { Controller } from '../controller.js';
export type VersionLevel = import('../version-delta.js').VersionLevel;
export type ChipSettings = {
    from: string;
    to: string;
    state: string | null;
    digest: 'short' | 'full';
    /**
     * `both`, `to` or `level`
     */
    show: string | null;
    arrow: string;
    level: VersionLevel;
};
/** @typedef {import('../version-delta.js').VersionLevel} VersionLevel */
/**
 * What a chip's attributes ask for.
 * @typedef {object} ChipSettings
 * @property {string} from
 * @property {string} to
 * @property {string | null} state
 * @property {'short' | 'full'} digest
 * @property {string | null} show `both`, `to` or `level`
 * @property {string} arrow
 * @property {VersionLevel} level
 */
/** @param {string} version @param {'short' | 'full'} digest */
export declare const shown: (version: string, digest: 'short' | 'full') => string;
/** @param {string | undefined} text @returns {Record<string, string>} */
export declare function toneMap(text: string | undefined): Record<string, string>;
export declare class ChipCore extends Controller {
    /** The page's defaults for every chip. @type {{ bigMinorApps?: readonly string[], href?: string | null }} */
    defaults: {
        bigMinorApps?: readonly string[];
        href?: string | null;
    };
    doc: Document;
    /** The chip's classes before it was drawn, put back on detach. */
    before: string;
    /**
     * @param {HTMLElement} host
     * @param {{ bigMinorApps?: readonly string[], href?: string | null }} [options]
     */
    constructor(host: HTMLElement, options?: {
        bigMinorApps?: readonly string[];
        href?: string | null;
    });
    /** A span (or another tag) with a class. @param {string} className @param {string} [tag] */
    part(className: string, tag?: string): HTMLElement;
    /** One version as text parts a long value may break between (after a dot, a hyphen or an underscore). @param {string} text */
    breakable(text: string): DocumentFragment;
    /** The word for a level. @param {VersionLevel} level */
    levelWord(level: VersionLevel): string;
    /** Read the chip's attributes. @returns {ChipSettings} */
    settings(): ChipSettings;
}
