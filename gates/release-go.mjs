// Kenny's release go, kept in the project database (table release_gos) and read by the hook
// .claude/hooks/release-tests.sh before a browser test runs.
//
//   node gates/release-go.mjs record <version> --by <name> --source "<form item and answer>" [--at <ISO time>]
//   node gates/release-go.mjs status      is a go active, and for which version (exit 0 active, 3 none)
//   node gates/release-go.mjs active      same test, silent: exit 0 active, 3 none, 2 or 1 database or git unreadable
//   node gates/release-go.mjs list        every recorded go and whether it is active, spent or stale
//
// A go is active while its version is greater than the latest tag (git describe) and `v<version>` does not exist.
// The database is data/kp-themes.sqlite unless KP_THEMES_DB names another.

import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { reading, writing, listGos, recordGo, ROOT } from './db/index.mjs';
import { activeGos, refusal } from './release-go-logic.mjs';

/** The tags of a git checkout. @param {string} cwd @returns {import('./release-go-logic.mjs').TagReader} */
export function gitTags(cwd) {
    const git = (/** @type {string[]} */ ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    return {
        latest() {
            try {
                return git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*').replace(/^v/, '');
            } catch (error) {
                const text = String(/** @type {{ stderr?: unknown }} */ (error).stderr ?? '');
                if (/No names found|No tags can describe/.test(text)) return null;
                throw new Error(`cannot read the latest release tag in ${cwd}: ${text.trim() || error}`);
            }
        },
        has(version) {
            try {
                git('rev-parse', '-q', '--verify', `refs/tags/v${version}`);
                return true;
            } catch (error) {
                if (/** @type {{ status?: number }} */ (error).status === 1) return false;
                throw new Error(`cannot read the tags in ${cwd}: ${error}`);
            }
        },
    };
}

/** Exit code of status/active when no go is active; 1 is reserved for a crash, 2 for an unreadable database. */
const NO_ACTIVE_GO = 3;

/** @param {string[]} args @param {string} name */
const option = (args, name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

/** @param {string[]} args @param {import('./release-go-logic.mjs').TagReader} tags */
export function record(args, tags) {
    const [version] = args;
    const by = option(args, '--by');
    const source = option(args, '--source');
    if (!version || version.startsWith('--') || !by || !source) throw new Error('usage: record <version> --by <name> --source "<text>" [--at <ISO time>]');
    const given_at = option(args, '--at') ?? new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    if (Number.isNaN(Date.parse(given_at))) throw new Error(`--at ${given_at} is not a time`);
    const why = refusal(version, tags);
    if (why) throw new Error(why);
    writing((db) => recordGo(db, { version, given_at, given_by: by, source }));
    return `recorded the go for ${version} (${by}, ${given_at})`;
}

/** @param {import('./release-go-logic.mjs').TagReader} tags */
export function status(tags) {
    const active = activeGos(reading(listGos), tags);
    if (!active.length) return { active: false, text: `no release go is active (latest tag: v${tags.latest() ?? 'none'})` };
    const [go] = active;
    return { active: true, text: `release go active for ${go.version} (${go.given_by}, ${go.given_at}; ${go.source})` };
}

/** @param {import('./release-go-logic.mjs').TagReader} tags */
export function list(tags) {
    const gos = reading(listGos);
    const live = new Set(activeGos(gos, tags).map((g) => g.version));
    return gos.map((g) => `${g.version}\t${live.has(g.version) ? 'active' : 'spent'}\t${g.given_at}\t${g.given_by}\t${g.source}`).join('\n') || '(no go recorded)';
}

function main() {
    const [command = '', ...args] = process.argv.slice(2);
    const tags = gitTags(ROOT);
    try {
        if (command === 'record') console.log(record(args, tags));
        else if (command === 'list') console.log(list(tags));
        else if (command === 'status' || command === 'active') {
            const result = status(tags);
            if (command === 'status') console.log(result.text);
            process.exit(result.active ? 0 : NO_ACTIVE_GO);
        } else throw new Error('usage: node gates/release-go.mjs record|status|active|list (see the header of this file)');
    } catch (error) {
        console.error(`release-go: ${error instanceof Error ? error.message : error}`);
        process.exit(2);
    }
}

// The entry-point check (gates-register-faults: an imported gate must not run on import). realpath: the hook may reach
// this file through a symlinked project directory, while import.meta.url is already the resolved path.
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) main();
