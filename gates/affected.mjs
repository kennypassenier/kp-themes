// Which suites a change actually needs [Kenny, 2026-09-09].
//
// The suite grew to 2466 tests and every push ran all of them, whatever
// had changed: 254 CI runs in five days, 35.9 hours of waiting. Kenny's
// instruction is that a change runs what it touches, and that a tag runs
// everything.
//
// Two rules decide, and both are deliberately blunt, because a map that
// is subtle is a map that is wrong in silence:
//
//   1. A file that no browser can load — anything under `docs/`, the
//      project's own notes, the mini-round queue — needs no browser test
//      at all. This is not a guess about coupling; it is a claim that no
//      byte the browser reads has changed, and `git diff --name-only`
//      settles it.
//   2. A stylesheet whose only change is comment needs no browser test
//      either. The two gates that read stylesheets mask comments before
//      they look (check-layers.mjs, selectors.mjs), so a comment cannot
//      change a verdict, and the minified twin a page loads has no
//      comments in it at all. Kenny asked whether the comments should
//      move to their own files for this reason; they should not — the
//      reasoning belongs beside the rule — so the comparison ignores
//      them instead.
//
// Everything else falls back to the whole suite, on purpose. A change to
// js/effects.js reaches 71% of the tests and a change to one component
// 61%, because the React page every register suite loads bundles them
// all; and `@keyframes kp-dialog-in` is declared in five registers, of
// which shade-dark loads last, so it governs academia's dialog. A map
// clever enough to split those would be wrong exactly where nobody looks.
// The narrow answer is for one register's own CSS and for its own spec.
//
// Usage:
//   node gates/affected.mjs                 what a working-tree change needs
//   node gates/affected.mjs <ref>           what has changed since <ref>
//   node gates/affected.mjs --spec-args     the same, as arguments for playwright
//
// It prints one of: `none`, `all`, or a list of spec files.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** Paths whose change no browser can observe. */
const NO_BROWSER = [/^docs\//, /^CLAUDE\.md$/, /^HANDOFF\.md$/, /^\.claude\//, /^reports\//, /^README\.md$/, /^CHANGELOG\.md$/, /^MIGRATION\.md$/];

/** @param {string} css @returns {string} the stylesheet with its comments blanked */
export const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** @param {string[]} args @returns {string} */
const git = (args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8' });

/**
 * The files a change touches, and for each stylesheet whether anything
 * but comment moved.
 *
 * @param {string | null} ref
 * @returns {{ file: string, commentOnly: boolean }[]}
 */
export function changes(ref) {
    const range = ref ? [ref, 'HEAD'] : ['HEAD'];
    const listed = new Set(
        [
            ...git(['diff', '--name-only', ...range]).split('\n'),
            ...(ref
                ? []
                : git(['status', '--porcelain'])
                      .split('\n')
                      .map((l) => l.slice(3))),
        ]
            .map((f) => f.trim())
            .filter(Boolean),
    );
    return [...listed].map((file) => {
        if (!file.endsWith('.css') || !existsSync(join(ROOT, file))) return { file, commentOnly: false };
        let before = '';
        try {
            before = git(['show', `${ref ?? 'HEAD'}:${file}`]);
        } catch {
            return { file, commentOnly: false };
        }
        const after = readFileSync(join(ROOT, file), 'utf8');
        return { file, commentOnly: withoutComments(before).replace(/\s+/g, ' ') === withoutComments(after).replace(/\s+/g, ' ') };
    });
}

/**
 * What those changes need run.
 *
 * @param {{ file: string, commentOnly: boolean }[]} touched
 * @returns {'none' | 'all' | string[]}
 */
export function affected(touched) {
    const relevant = touched.filter(({ file, commentOnly }) => !commentOnly && !NO_BROWSER.some((rule) => rule.test(file)));
    if (relevant.length === 0) return 'none';
    /** @type {Set<string>} */
    const specs = new Set();
    for (const { file } of relevant) {
        // A register and its own spec: the one narrow case that holds.
        const register = file.match(/^css\/([a-z-]+)-register\.css$/);
        const spec = file.match(/^tests\/([a-z-]+\.spec\.mjs)$/);
        const anatomy = file.match(/^themes\/([a-z-]+)\/anatomy\.md$/);
        if (register) specs.add(`tests/register-${register[1]}.spec.mjs`);
        else if (spec) specs.add(`tests/${spec[1]}`);
        else if (anatomy) specs.add(`tests/register-${anatomy[1]}.spec.mjs`);
        else return 'all';
    }
    return [...specs].filter((s) => existsSync(join(ROOT, s)));
}

const ref = process.argv.find((a) => !a.startsWith('--') && a !== process.argv[0] && a !== process.argv[1]) ?? null;
const result = affected(changes(ref));
if (process.argv.includes('--spec-args')) console.log(result === 'all' ? '' : result === 'none' ? '--grep=$^' : result.join(' '));
else console.log(result === 'all' || result === 'none' ? result : result.join('\n'));
