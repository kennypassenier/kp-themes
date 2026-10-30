export { VERSION_PROPERTY, NAMES_PROPERTY, stylesheetSide, scriptSide } from './diagnostics/sides.js';
export { compareVersions } from './diagnostics/compare.js';
export { diagnose, diagnostics } from './diagnostics/report.js';
export { renderDiagnostics } from './diagnostics/render.js';
export type Side = {
    /**
     * the version this half was generated from, or null when it does not say
     */
    version: string | null;
    /**
     * the theme names this half knows
     */
    themes: string[];
    /**
     * the hook values js/effects.js reported as unknown on this page [AR44]
     */
    unknownEffects?: string[];
};
export type Report = {
    status: 'match' | 'stylesheet-behind' | 'script-behind' | 'themes-differ' | 'no-version';
    stylesheet: Side;
    script: Side;
    /**
     * themes the stylesheet has and the JavaScript does not
     */
    onlyInStylesheet: string[];
    /**
     * themes the JavaScript has and the stylesheet does not
     */
    onlyInScript: string[];
    /**
     * one sentence, from the dictionary, saying which half is behind
     */
    verdict: string;
};
/**
 * @typedef {object} Side
 * @property {string | null} version the version this half was generated from, or null when it does not say
 * @property {string[]} themes the theme names this half knows
 * @property {string[]} [unknownEffects] the hook values js/effects.js reported as unknown on this page [AR44]
 */
/**
 * @typedef {object} Report
 * @property {'match' | 'stylesheet-behind' | 'script-behind' | 'themes-differ' | 'no-version'} status
 * @property {Side} stylesheet
 * @property {Side} script
 * @property {string[]} onlyInStylesheet themes the stylesheet has and the JavaScript does not
 * @property {string[]} onlyInScript themes the JavaScript has and the stylesheet does not
 * @property {string} verdict one sentence, from the dictionary, saying which half is behind
 */
