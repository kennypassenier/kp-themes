// Reading the command line of the demo commands (gates/verdicts/demo-round.mjs) into records, refusing what is malformed.
// Pure functions: nothing here touches the database.

/**
 * Every value of a repeatable option, and whether a flag is there.
 * @param {string[]} args
 */
export function optionsOf(args) {
    /** @param {string} name */
    const all = (name) => args.flatMap((arg, i) => (arg === name && i + 1 < args.length ? [args[i + 1]] : []));
    return {
        all,
        /** @param {string} name */
        one: (name) => all(name).at(-1),
        /** @param {string} name */
        flag: (name) => args.includes(name),
    };
}

/**
 * `item:theme` pairs from comma lists ("keys:formal,toolbar:dark").
 * @param {string[]} lists
 * @param {string[]} faults
 * @returns {{ item: string, theme: string }[]}
 */
export function parsePairs(lists, faults) {
    const pairs = [];
    for (const raw of lists.flatMap((list) => list.split(',')).map((s) => s.trim()).filter(Boolean)) {
        const [item, theme, ...rest] = raw.split(':');
        if (!item || !theme || rest.length) faults.push(`"${raw}" is not item:theme`);
        else pairs.push({ item, theme });
    }
    return pairs;
}

/**
 * `item:theme:words` entries; the words may hold colons of their own.
 * @param {string[]} entries
 * @param {string[]} faults
 * @param {'note' | 'reason'} wordsKey
 * @returns {{ item: string, theme: string, note?: string, reason?: string }[]}
 */
export function parseNoted(entries, faults, wordsKey) {
    const out = [];
    for (const raw of entries) {
        const match = /^([^:]+):([^:]+):([\s\S]*)$/.exec(raw);
        const words = match?.[3].trim();
        if (!match || !words) faults.push(`"${raw}" is not item:theme:<${wordsKey}> with the ${wordsKey} written out`);
        else out.push({ item: match[1].trim(), theme: match[2].trim(), [wordsKey]: words });
    }
    return out;
}

/**
 * Themes a pair names that are not themes, one fault each.
 * @param {{ item: string, theme: string }[]} pairs
 * @param {string[]} themes
 */
export const unknownThemes = (pairs, themes) => pairs.filter((p) => !themes.includes(p.theme)).map((p) => `${p.item}:${p.theme}: "${p.theme}" is not a theme (${themes.join(', ')})`);

/**
 * The round record a `round` command line describes, or the faults that stop it.
 * @param {string[]} args
 * @param {{ themes: string[], nextRound: string }} context
 */
export function roundFromArgs(args, { themes, nextRound }) {
    const o = optionsOf(args);
    /** @type {string[]} */
    const faults = [];
    const approved = parsePairs(o.all('--approved'), faults);
    const notApproved = parseNoted(o.all('--not-approved'), faults, 'note');
    const reopened = parseNoted(o.all('--reopened-for-round'), faults, 'reason');
    faults.push(...unknownThemes([...approved, ...notApproved, ...reopened], themes));
    const allJudged = o.flag('--all-judged');
    if (!allJudged && !approved.length && !notApproved.length) faults.push('a round names at least one --approved or --not-approved pair, or says --all-judged');
    /** @type {Record<string, unknown>} */
    const round = { round: o.one('--round') ?? nextRound, allJudged };
    const page = o.one('--page');
    if (page) round.page = page;
    if (approved.length) round.approved = approved;
    round.notApproved = notApproved;
    if (reopened.length) round.reopenedForThisRound = reopened;
    const comment = o.one('--comment');
    if (comment) round.comment = comment;
    const note = o.one('--general-note');
    if (note) round.generalNote = note;
    return { round, faults };
}
