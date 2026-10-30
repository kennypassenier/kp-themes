export type ThemeName = import('./values.js').ThemeName;
/**
 * Say once, out loud, that a name was dropped [TH97, AR25].
 *
 * The console for a developer reading the page, the event for code that
 * wants to do something about it — a health banner, a log line, a fetch
 * to the server that served the wrong name. Both are behind the same
 * once-per-session gate: an event nobody can afford to listen to is not
 * an improvement on silence.
 *
 * @param {unknown} requested the name that was asked for
 * @param {ThemeName} applied the name that was used instead
 * @param {'stored' | 'current' | 'apply' | 'cross-tab'} source which of the four places dropped it
 * @param {Element} [root] where the event is dispatched from
 * @returns {boolean} whether this call was the one that reported it
 */
export declare function reportUnknown(requested: unknown, applied: ThemeName, source: 'stored' | 'current' | 'apply' | 'cross-tab', root?: Element): boolean;
