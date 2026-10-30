// The changed files since a base commit, as the selection reads them.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, git } from './repo.mjs';

/**
 * The changes to read.
 *
 * @param {{ files?: string[], commit?: string, base?: string }} options
 *   `commit`: what that commit changed; `files`: those paths, working tree
 *   against HEAD; neither: everything since `git merge-base HEAD main`, plus
 *   uncommitted and untracked files
 */
export function changes({ files, commit, base } = {}) {
    const show = (/** @type {string} */ ref, /** @type {string} */ file) => {
        try {
            return git(['show', `${ref}:${file}`]);
        } catch {
            return null;
        }
    };
    const disk = (/** @type {string} */ file) => (existsSync(join(ROOT, file)) ? readFileSync(join(ROOT, file), 'utf8') : null);

    if (commit) {
        const listed = git(['diff', '--name-only', `${commit}^`, commit])
            .split('\n')
            .filter(Boolean);
        return listed.map((file) => ({
            file,
            before: show(`${commit}^`, file),
            after: show(commit, file),
            diff: git(['diff', '-U0', `${commit}^`, commit, '--', file]),
        }));
    }
    const ref = files ? 'HEAD' : (base ?? git(['merge-base', 'HEAD', 'main']).trim());
    const listed =
        files ??
        [...new Set([...git(['diff', '--name-only', ref]).split('\n'), ...git(['ls-files', '--others', '--exclude-standard']).split('\n')])].filter(
            Boolean,
        );
    return listed.map((file) => {
        const before = show(ref, file);
        const after = disk(file);
        let diff = '';
        if (before !== null) diff = git(['diff', '-U0', ref, '--', file]);
        // A path named with --files but not changed is read as changed whole:
        // the question then is what that file reaches, not what moved in it.
        const whole = after !== null && (before === null || (files !== undefined && diff === ''));
        if (whole) diff = `@@ -0,0 +1,${after.split('\n').length} @@`;
        return { file, before: whole ? null : before, after, diff };
    });
}
