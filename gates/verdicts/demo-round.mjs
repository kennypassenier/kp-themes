// The demo commands: Kenny's verdicts on a research demo and its decision, written into the review database instead of
// a hand-edited research/<demo>/VERDICTS.json or decided.json (Kenny, 2026-11-02: no separate JSON files any more).
//
//   node gates/verdicts.mjs round --demo <folder> [--round <name>] [--page <page round id>] [--all-judged]
//        [--approved item:theme,item:theme] [--not-approved "item:theme:his words"]… [--reopened-for-round "item:theme:why"]…
//        [--comment "<his general comment>"] [--general-note "<a note of Claude's>"]
//   node gates/verdicts.mjs decide --demo <folder> --decided "<the decision>" [--by Kenny] [--note "…"] [--attributes "…"] [--picks '<json>']
//   node gates/verdicts.mjs reopen --demo <folder> --pair "item:theme:why the component changed"
//   node gates/verdicts.mjs bundle --demo <folder> --into <folder of the bundled page>
//   node gates/verdicts.mjs received --demo <folder>      the page round ids recorded, for the page's "received"
//
// <folder> is the demo's folder under research/ ("kpadopt-nav", "audhd-recepten/cook"). `round` defaults --round to the
// next number. Every command refuses a demo folder without a demo.html and a theme that does not exist.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { addRound, ensureDemo, loadDemoVerdicts, reading, receivedPages, saveDemoFact, saveDemoVerdicts, writing } from '../db/index.mjs';
import { optionsOf, parseNoted, roundFromArgs, unknownThemes } from './demo-args.mjs';
import { ROOT } from './paths.mjs';

/** The theme names, from the registry the review pages use. */
const themeNames = async () => (await import('../../js/theme-registry.js')).THEMES.map((/** @type {{ name: string }} */ t) => t.name);

/** The demo folder an option names, refused unless research/<folder>/demo.html exists. @param {string[]} args */
function demoOf(args) {
    const demo = optionsOf(args).one('--demo');
    if (!demo || !/^[a-z0-9][a-z0-9/-]*$/.test(demo) || demo.includes('..')) throw new Error(`--demo <folder under research/> is missing or malformed: ${demo}`);
    if (!existsSync(join(ROOT, 'research', demo, 'demo.html'))) throw new Error(`research/${demo}/demo.html does not exist`);
    return demo;
}

/** @param {string[]} faults */
function refuse(faults) {
    if (faults.length) throw new Error(`nothing written:\n  ${faults.join('\n  ')}`);
}

/** @param {string[]} args */
async function round(args) {
    const demo = demoOf(args);
    /** @type {Record<string, any>[]} */
    const rounds = reading((db) => loadDemoVerdicts(db, demo))?.rounds ?? [];
    const { round: record, faults } = roundFromArgs(args, { themes: await themeNames(), nextRound: String(rounds.length + 1) });
    if (rounds.some((r) => r.round === record.round)) faults.push(`research/${demo} already has a round "${record.round}"; pass --round <a new name>`);
    refuse(faults);
    const seq = writing((db) => addRound(db, demo, record));
    const count = (/** @type {string} */ key) => (Array.isArray(record[key]) ? record[key].length : 0);
    console.log(
        `research/${demo}: round ${record.round} recorded (#${seq + 1}): ${count('approved')} approved, ${count('notApproved')} not approved` +
            `${record.allJudged ? ', every other pair of the page approved' : ''}${record.page ? `, answering page round ${record.page}` : ''}.`,
    );
}

/** @param {string[]} args */
async function decide(args) {
    const demo = demoOf(args);
    const o = optionsOf(args);
    const decided = o.one('--decided')?.trim();
    if (!decided) throw new Error('--decided "<the decision, with its date and who gave it>" is missing or empty');
    /** @type {Record<string, unknown>} */
    const record = { decided, by: o.one('--by') ?? 'Kenny' };
    for (const key of ['note', 'attributes']) if (o.one(`--${key}`)) record[key] = o.one(`--${key}`);
    const picks = o.one('--picks');
    if (picks) {
        try {
            record.picks = JSON.parse(picks);
        } catch (error) {
            throw new Error(`--picks is not JSON: ${error instanceof Error ? error.message : error}`);
        }
    }
    writing((db) => saveDemoFact(db, 'decided', demo, record));
    console.log(`research/${demo}: decision recorded. ${await exportsLine()}`);
}

/** @param {string[]} args */
async function reopen(args) {
    const demo = demoOf(args);
    /** @type {string[]} */
    const faults = [];
    const pairs = parseNoted(optionsOf(args).all('--pair'), faults, 'reason');
    faults.push(...unknownThemes(pairs, await themeNames()));
    if (!pairs.length) faults.push('--pair "item:theme:why the component changed" is missing');
    refuse(faults);
    writing((db) => {
        const record = loadDemoVerdicts(db, demo) ?? { demo, rounds: [] };
        saveDemoVerdicts(db, demo, { ...record, reopened: [...(record.reopened ?? []), ...pairs] });
    });
    console.log(`research/${demo}: ${pairs.length} pair(s) reopened.`);
}

/** @param {string[]} args */
function bundle(args) {
    const demo = demoOf(args);
    const into = optionsOf(args).one('--into');
    if (!into || !existsSync(join(ROOT, 'research', into, 'demo.html'))) throw new Error(`--into: research/${into}/demo.html does not exist`);
    writing((db) => {
        ensureDemo(db, demo, demo);
        saveDemoVerdicts(db, demo, { .../** @type {any} */ (loadDemoVerdicts(db, demo)), bundledInto: into });
    });
    console.log(`research/${demo}: bundled into research/${into}.`);
}

/** The exports regenerated after a write the browser reads. */
async function exportsLine() {
    const { writeReviewData } = await import('../generate-review-data.mjs');
    return `${await writeReviewData()} An archived demo's decision is also in the Agenda's index: run node gates/generate-agenda-index.mjs.`;
}

/**
 * Run one demo command; false when `command` is not one of them.
 * @param {string} command @param {string[]} args
 */
export async function demoCommand(command, args) {
    if (command === 'round') await round(args);
    else if (command === 'decide') await decide(args);
    else if (command === 'reopen') await reopen(args);
    else if (command === 'bundle') bundle(args);
    else if (command === 'received') console.log(JSON.stringify(reading((db) => receivedPages(db, demoOf(args)))));
    else return false;
    return true;
}
