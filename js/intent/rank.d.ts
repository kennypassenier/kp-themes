export type IntentOptions = import('../intent.js').IntentOptions;
export type IntentCommand = import('../intent.js').IntentCommand;
export type RankOptions = import('../intent.js').RankOptions;
/** @typedef {import('../intent.js').IntentOptions} IntentOptions */
/** @typedef {import('../intent.js').IntentCommand} IntentCommand */
/** @typedef {import('../intent.js').RankOptions} RankOptions */
/**
 * The rows for a query: only the commands that answer it, grouped, the best answer first in each group (the open
 * subject's before every other's), at most `maxShown`. With nothing typed it shows what is featured, what is about
 * the open subject and what was run last; when a list has none of those it shows every command, in its own order.
 *
 * @template {IntentCommand} T
 * @param {readonly T[]} commands
 * @param {string} query
 * @param {RankOptions} [options]
 * @returns {{ group: string, commands: T[] }[]}
 */
export declare function rankCommands<T extends IntentCommand>(commands: readonly T[], query: string, { context, maxShown, groupOrder, recent, ...match }?: RankOptions): {
    group: string;
    commands: T[];
}[];
/**
 * What a list says when nothing answers: when the first word is a verb it knows, which subjects that verb works on
 * ("There is no stack called jellyfin. Update works on: admin, gateway."), otherwise what to try. The words are the
 * dictionary's (`intentNoSubject`, `intentNoMatch`).
 *
 * @param {string} query
 * @param {{ verbs?: readonly string[], subjects?: readonly string[], noun?: string, hint?: string }} [known]
 * @param {IntentOptions} [options]
 * @returns {string}
 */
export declare function noMatchText(query: string, { verbs, subjects, noun, hint }?: {
    verbs?: readonly string[];
    subjects?: readonly string[];
    noun?: string;
    hint?: string;
}, options?: IntentOptions): string;
