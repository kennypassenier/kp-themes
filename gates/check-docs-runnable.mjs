// A document that states behaviour is executed, not reviewed [Phase 8].
//
// The procedure states the rule and names the case it came from: a README
// showed a positional argument the binary had refused since its previous
// major, three days and one release after the change, and every gate was
// blind to it — because a test reads the code and a reviewer reads the
// prose, and nobody ran the prose.
//
// Three kinds of claim in this project's documents can be executed, and
// all three are checked here:
//
//   1. `npm run <script>` — the script exists in package.json.
//   2. A path in backticks that looks like a file this repository ships —
//      the file is there.
//   3. `from '@kp-soft/themes/...'` — the subpath is published in the
//      export map, which is what a consumer's bundler will ask.
//
// What is deliberately NOT done is running each script: `npm run gates`
// appears forty-five times and takes minutes. Existence is what the
// HTTPSwitchboard fault was about — a command the software refuses — and
// gates/check-package.mjs already runs the export map against a packed
// tarball.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const here = new URL('.', root).pathname;

/** A path that is plainly meant as a file in this repository. */
const LOOKS_LIKE_A_FILE = /^(?:css|js|fx|hooks|components|gates|tests|themes|showcase|examples|site|docs|dist|fonts|ha)\/[\w./-]+\.\w{2,5}$/;

/**
 * The documents a person FOLLOWS, which is the set the procedure's rule
 * is about. A path in one of these is an instruction; a path in a record
 * — a correction, a gate log, a dated audit, a research note — is history,
 * and history correctly names what was there at the time. Measured on
 * 2026-09-12: checking every document flagged twenty-three paths, of which
 * twenty-one were records naming a theme or a fixture that has since gone.
 * A gate that cries about the past is a gate people learn to ignore.
 *
 * Scripts and import subpaths are still checked EVERYWHERE, because a
 * command is a command wherever a reader finds it.
 */
export const FOLLOWED = [
    'README.md',
    'HANDOFF.md',
    'MIGRATION.md',
    'docs/USER_GUIDE.md',
    'docs/TROUBLESHOOTING.md',
    'docs/DEBUGGING_GUIDE.md',
    'docs/OPERATIONS_RUNBOOK.md',
    'docs/ADOPTION_PROMPTS.md',
    'docs/ARCHITECTURE_REFERENCE.md',
    'docs/TEST_PLAN.md',
    'docs/LAYOUT.md',
    'docs/UTILITIES.md',
    // docs/THEMING.md is deliberately absent: its first line says it is a
    // verbatim copy of kp-soft's guide, so the paths in it are claims about
    // THAT repository. A reader follows it to understand where the house
    // themes came from, not to find a file here.
];

/** Paths named in prose that are examples rather than claims about this repo. */
export const NOT_OURS = [
    'css/your-theme.css', // the shape a consumer's own file takes
    'themes/your-theme/tokens.json',
];

/** @param {(f: string) => string} [read] */
export function claims(read = (f) => readFileSync(new URL(f, root), 'utf8')) {
    const files = execFileSync('git', ['-C', here, 'ls-files', '*.md'], { encoding: 'utf8' }).trim().split('\n');
    const pkg = JSON.parse(read('package.json'));
    const scripts = new Set(Object.keys(pkg.scripts ?? {}));
    const exported = new Set(Object.keys(pkg.exports ?? {}));

    /** @type {string[]} */
    const broken = [];
    let checked = 0;

    for (const file of files) {
        const text = read(file);
        const lineOf = (/** @type {number} */ i) => text.slice(0, i).split('\n').length;

        for (const m of text.matchAll(/\bnpm run ([a-z][a-z0-9:_-]*)/g)) {
            checked++;
            if (!scripts.has(m[1]))
                broken.push(`${file}:${lineOf(m.index ?? 0)} tells a reader to run \`npm run ${m[1]}\`, which package.json does not have`);
        }

        for (const m of text.matchAll(/`([^`\s]+)`/g)) {
            const path = m[1];
            if (!FOLLOWED.includes(file)) continue;
            if (!LOOKS_LIKE_A_FILE.test(path) || NOT_OURS.includes(path)) continue;
            checked++;
            if (!existsSync(new URL(path, root)))
                broken.push(`${file}:${lineOf(m.index ?? 0)} names \`${path}\`, which this repository does not have`);
        }

        for (const m of text.matchAll(/['"]@kp-soft\/themes(\/[\w./-]*)?['"]/g)) {
            const subpath = m[1] === undefined ? '.' : `.${m[1]}`;
            checked++;
            if (!exported.has(subpath))
                broken.push(`${file}:${lineOf(m.index ?? 0)} imports \`@kp-soft/themes${m[1] ?? ''}\`, which the export map does not publish`);
        }
    }
    return { files: files.length, checked, broken };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const { files, checked, broken } = claims();
    for (const line of broken) console.error(line);
    if (broken.length > 0) {
        console.error(`\n${broken.length} claim(s) the documents make that the package does not keep.`);
        process.exit(1);
    }
    if (checked === 0) {
        console.error('gate broke: no executable claim found in any document, which cannot be right.');
        process.exit(1);
    }
    console.log(`Runnable docs: ${checked} executable claim(s) across ${files} documents — every script, path and import subpath is real.`);
}
