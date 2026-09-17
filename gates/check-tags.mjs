// No untagged test, and no file the tag map does not know [scope-33].
//
// `npm run test:tags` selects tests by tag, so a test without one is a test
// no change ever runs short of a release, and a file without a rule is a
// change the map answers with "everything" in silence. This gate reads the
// sources — no browser — and refuses:
//
//   1. a test or describe with no tag of its own and none from a describe
//      around it;
//   2. a tag that is not `@sweep`, `@component:<a component in
//      tests/tags.json>` or `@theme:<a theme in themes/order.json>`;
//   3. a test whose own body walks every theme (THEMES, THEME_NAMES, the
//      registry, order.json, a showcase/themes/${…} page) without `@sweep`
//      — the commit level runs sweeps, and this one would be missed;
//   4. a tracked file no rule in tests/tags.json matches;
//   5. a component in the vocabulary that no test carries, and a `.kp-*`
//      class in css/components.css that `selectors` cannot place — the two
//      ways the map drifts from the code it maps.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { ROOT, declarations, loadMap, ruleFor, specFiles, tagProblem, vocabularyOf } from './tags.mjs';

const SWEEPY = /\bTHEMES\b|\bTHEME_NAMES\b|\bREGISTRY\b|order\.json|showcase\/themes\/\$\{/;

/**
 * @param {{ file: string, source: string }[]} specs
 * @param {string[]} tracked
 * @param {any} map
 * @returns {Promise<{ problems: string[], tests: number, carried: Map<string, number> }>}
 */
export async function audit(specs, tracked, map) {
    const vocabulary = vocabularyOf(map);
    const problems = [];
    /** @type {Map<string, number>} tag as written → declarations carrying it */
    const carried = new Map();
    let tests = 0;
    for (const { file, source } of specs) {
        const decls = await declarations(source);
        if (decls.length === 0) problems.push(`${file} declares no test the gate can read`);
        decls.forEach((d) => {
            const inherited = [];
            for (let p = d.parent; p !== -1; p = decls[p].parent) inherited.push(...decls[p].tags);
            for (const tag of d.tags) {
                const problem = tagProblem(tag, vocabulary);
                if (problem) problems.push(`${file}:${d.line} ${problem}`);
                carried.set(tag, (carried.get(tag) ?? 0) + 1);
            }
            if (d.kind !== 'test') return;
            tests++;
            const all = [...d.tags, ...inherited];
            if (all.length === 0) problems.push(`${file}:${d.line} ${d.title.slice(0, 80)} carries no tag`);
            if (SWEEPY.test(d.text) && !all.includes('@sweep')) problems.push(`${file}:${d.line} walks every theme and carries no @sweep`);
        });
    }
    for (const file of tracked) if (!ruleFor(file, map, vocabulary)) problems.push(`${file} matches no rule in tests/tags.json`);
    for (const rule of map.rules)
        for (const tag of [...(rule.tags ?? []), ...(rule.fallback ?? [])])
            for (const m of tag.matchAll(/\{(\w+)\}/g))
                if (!rule.path.includes(`{${m[1]}}`))
                    problems.push(`tests/tags.json: the rule for ${rule.path} writes {${m[1]}} and its path captures none`);
    for (const component of vocabulary.components)
        if (![...carried.keys()].some((t) => t === `@component:${component}`))
            problems.push(`@component:${component} is in the vocabulary and no test carries it`);
    return { problems, tests, carried };
}

/** @param {string} css @param {Record<string, string[]>} selectors @returns {string[]} classes no selector key places */
export function unplaced(css, selectors) {
    const roots = new Set([...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\.(kp-[a-z0-9]+(?:-[a-z0-9]+)*)/g)].map((m) => m[1]));
    return [...roots].filter((root) => {
        const segments = root.split('-');
        for (let n = segments.length; n >= 2; n--) if (selectors[segments.slice(0, n).join('-')]) return false;
        return true;
    });
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const map = loadMap();
    const specs = specFiles().map((file) => ({ file, source: readFileSync(join(ROOT, file), 'utf8') }));
    const tracked = execFileSync('git', ['-C', ROOT, 'ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
        .split('\n')
        // node_modules is a symlink in a worktree, which the directory-only ignore rule does not cover
        .filter((f) => f && f !== 'node_modules');
    const { problems, tests, carried } = await audit(specs, tracked, map);
    for (const root of unplaced(readFileSync(join(ROOT, 'css/components.css'), 'utf8'), map.selectors))
        problems.push(`css/components.css: .${root} has no entry in the selectors of tests/tags.json`);
    for (const p of problems) console.error(p);
    if (problems.length) {
        console.error(`\n${problems.length} tag problem(s).`);
        process.exit(1);
    }
    if (tests < 100) {
        console.error(`gate broke: only ${tests} test declarations read, which cannot be right.`);
        process.exit(1);
    }
    console.log(
        `Tags: ${tests} test declarations in ${specs.length} spec files, every one tagged; ${carried.size} distinct tags as written; ${tracked.length} files, every one under a rule.`,
    );
}
