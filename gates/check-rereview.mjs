// A re-review shows only the pairs Kenny has not approved [Kenny, 2026-10-13 and 2026-10-16].
//
// His rule, repeated: "toon je geen al goedgekeurde elementen meer en wis je de vorige commentaar".
// Round 3 of research/kpadopt-nav reopened three sections in all 16 themes and still showed the approved
// tab bar, and round 2 of three demos did the same, because nothing refused it.
//
// Every research demo can record Kenny's verdicts in `research/<topic>/VERDICTS.json`
// (documented in research/_review/README.md):
//
//   { "demo": "<topic>",
//     "rounds": [ { "round": "1", "allJudged": true|false,
//                   "page": "<id of the page round it answers>",   // optional: kept in step with the page's "received"
//                   "approved": [{ "item", "theme" }],          // pairs approved in a round that judged only some
//                   "notApproved": [{ "item", "theme", "note" }] } ],
//     "reopened": [{ "item", "theme", "reason" }] }             // a pair offered again because the component changed
//
// The latest round that says anything about a pair wins: with `allJudged` every pair of the page that is
// not in `notApproved` was approved in that round.
//
// The gate refuses a demo whose page still offers (section × theme, from the page's and the sections'
// `data-review-themes`, default the 16 themes of js/theme-registry.js) a pair whose latest verdict is
// approved, unless the pair is in `reopened` with a written reason. A demo whose every pair is approved
// has to be Decided: filed under "Archived research" in catalogue/pages.js, not offered again.
//
// Run: node gates/check-rereview.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { THEMES } from '../js/theme-registry.js';

const root = new URL('../', import.meta.url);
/** @type {string[]} */
const ALL = THEMES.map((t) => t.name);

/** @param {string | undefined} value */
const split = (value) => (value ? value.split(/[\s,]+/).filter((s) => ALL.includes(s)) : null);

/**
 * The pairs a demo page offers.
 * @param {string} html
 * @returns {{ item: string, theme: string }[]}
 */
export function offeredPairs(html) {
    const page = split(/<html\b[^>]*\bdata-review-themes="([^"]*)"/.exec(html)?.[1]) ?? ALL;
    const pairs = [];
    for (const match of html.matchAll(/<section\b[^>]*>/g)) {
        const item = /\bdata-review-item="([^"]*)"/.exec(match[0])?.[1];
        if (!item) continue;
        const own = split(/\bdata-review-themes="([^"]*)"/.exec(match[0])?.[1]);
        for (const theme of own ?? page) pairs.push({ item, theme });
    }
    return pairs;
}

/**
 * The latest recorded verdict per pair.
 * @param {{ rounds?: { allJudged?: boolean, approved?: { item: string, theme: string }[], notApproved?: { item: string, theme: string }[] }[] }} verdicts
 * @param {{ item: string, theme: string }[]} offered every pair the page offers (what an `allJudged` round covered)
 * @returns {Map<string, 'approved' | 'not approved'>} keyed `theme|item`
 */
export function latestVerdicts(verdicts, offered) {
    const latest = new Map();
    for (const round of verdicts.rounds ?? []) {
        if (round.allJudged) for (const p of offered) latest.set(`${p.theme}|${p.item}`, 'approved');
        for (const p of round.approved ?? []) latest.set(`${p.theme}|${p.item}`, 'approved');
        for (const p of round.notApproved ?? []) latest.set(`${p.theme}|${p.item}`, 'not approved');
    }
    return latest;
}

/**
 * What is wrong with a demo page next to its verdicts.
 * @param {string} topic
 * @param {string} html the demo page
 * @param {any} verdicts the parsed VERDICTS.json
 * @param {boolean} archived whether catalogue/pages.js files the demo under "Archived research"
 * @returns {string[]}
 */
export function rereviewFaults(topic, html, verdicts, archived) {
    const faults = [];
    const offered = offeredPairs(html);
    for (const r of verdicts.reopened ?? []) {
        if (!r.item || !r.theme || !String(r.reason ?? '').trim()) {
            faults.push(`research/${topic}/VERDICTS.json: a reopened pair needs item, theme and a written reason`);
        }
    }
    // The page's round lists the page rounds Claude has recorded (the review kit drops their answers, progress.js).
    const declared = [...(JSON.parse(/<script\b[^>]*data-review-round[^>]*>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? 'null')?.received ?? [])].sort();
    const recorded = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))].sort();
    if (declared.join('|') !== recorded.join('|')) {
        faults.push(
            `research/${topic}: the page's data-review-round "received" [${declared.join(', ')}] must equal the "page" ids of the rounds in VERDICTS.json [${recorded.join(', ')}], ` +
                `or the review kit carries an answer Claude already received as "not copied yet"`,
        );
    }
    if (archived) return faults;
    const latest = latestVerdicts(verdicts, offered);
    const reopened = new Set(
        (verdicts.reopened ?? [])
            .filter((/** @type {any} */ r) => String(r.reason ?? '').trim())
            .map((/** @type {any} */ r) => `${r.theme}|${r.item}`),
    );
    const approvedOffered = offered.filter((p) => latest.get(`${p.theme}|${p.item}`) === 'approved' && !reopened.has(`${p.theme}|${p.item}`));
    const open = offered.filter((p) => latest.get(`${p.theme}|${p.item}`) !== 'approved' || reopened.has(`${p.theme}|${p.item}`));
    if (approvedOffered.length && !open.length) {
        faults.push(
            `research/${topic}: every pair is approved, so the demo is Decided: add its decided.json and README "**Decided (" line and file it under "Archived research" in catalogue/pages.js; do not offer it again`,
        );
    } else if (approvedOffered.length) {
        faults.push(
            `research/${topic}: a re-review shows only the pairs Kenny has not approved, but the page still offers ${approvedOffered.length} approved pair(s). ` +
                `Remove those sections, or restrict them with data-review-themes, or list a pair under "reopened" in VERDICTS.json with the reason the component changed:\n    ` +
                approvedOffered.map((p) => `${p.item} · ${p.theme}`).join('\n    '),
        );
    }
    return faults;
}

/** The topics catalogue/pages.js files under "Archived research". @param {string} shell */
export function archivedTopics(shell) {
    const archive = shell.split(/group:\s*'Archived research'/)[1] ?? '';
    return new Set([...archive.matchAll(/href:\s*'research\/([^/']+)\//g)].map((m) => m[1]));
}

function main() {
    const path = (/** @type {string} */ p) => fileURLToPath(new URL(p, root));
    const archived = archivedTopics(readFileSync(path('catalogue/pages.js'), 'utf8'));
    const faults = [];
    let checked = 0;
    for (const topic of readdirSync(path('research'))) {
        const file = `research/${topic}/VERDICTS.json`;
        if (!existsSync(path(file))) continue;
        checked++;
        const demo = `research/${topic}/demo.html`;
        if (!existsSync(path(demo))) {
            faults.push(`${file}: no ${demo} beside it`);
            continue;
        }
        faults.push(...rereviewFaults(topic, readFileSync(path(demo), 'utf8'), JSON.parse(readFileSync(path(file), 'utf8')), archived.has(topic)));
    }
    if (faults.length) {
        console.error(
            `check-rereview: ${faults.length} fault(s) (Kenny, 2026-10-13 and 2026-10-16: a re-review shows only what is not approved yet)\n  ${faults.join('\n  ')}`,
        );
        process.exit(1);
    }
    console.log(`check-rereview: ${checked} demo(s) with recorded verdicts offer no approved pair.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
