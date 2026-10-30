export type EffectsContext = import('../effects.js').EffectsContext;
export type EffectsEngine = import('./engine.js').EffectsEngine;
/** @typedef {import('../effects.js').EffectsContext} EffectsContext */
/** @typedef {import('./engine.js').EffectsEngine} EffectsEngine */
/**
 * @param {EffectsEngine} e the engine, once it has decided its arrival
 * @returns {EffectsContext}
 */
export declare function buildContext(e: EffectsEngine): EffectsContext;
