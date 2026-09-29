// tokens.tar: what the theme families outside this repository build from.
//
// The desktop themes (kp-themes-windows, kp-themes-linux), the VS Code
// themes (kp-themes-vscode), the Home Assistant themes (kp-themes-ha), the
// Jellyfin theme (kp-themes-jellyfin) and the TUI palette (kp-themes-tui)
// moved out of this repository in 8.0.0. Each still derives its colours
// from the tokens here, so each vendors this one release asset, pinned by
// version and sha256 the way kp-tui already pinned its palette, and runs
// its generator against the unpacked copy. A colour change here reaches
// them only when their pin moves.
//
// The tar keeps this repository's layout, so a generator that imports
// '../vendor/kp-themes/gates/terminal.mjs' finds colour.mjs, js/contrast.js
// and the tokens where they sit here. It holds the modules those
// generators import and the files those modules read; `--check` unpacks a
// fresh build into a temporary directory and imports every entry module
// from there, so a file missing from the list fails here rather than in a
// consumer.
//
// The build is reproducible: sorted names, a fixed mtime and owner, so a
// tar rebuilt from the same tag has the same sha256 as the release asset.
//
// Usage:
//   node gates/tokens-tar.mjs           write tokens.tar
//   node gates/tokens-tar.mjs --check   build, unpack, import every entry

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const VERSION = JSON.parse(readFileSync(new URL('package.json', ROOT), 'utf8')).version;

/** The modules a consumer imports; --check imports each from the unpacked tar. */
export const ENTRIES = [
    'gates/terminal.mjs',
    'gates/palette.mjs',
    'gates/check-invariants.mjs',
    'gates/colour.mjs',
    'gates/site/highlight.mjs',
    'js/theme-registry.js',
];

/** Everything in the tar: the entries, what they import, what they read. */
export function files() {
    const themes = readdirSync(new URL('themes/', ROOT), { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => `themes/${e.name}/tokens.json`);
    return [...ENTRIES, 'js/contrast.js', 'gates/config.json', 'css/themes.css', 'css/fonts.css', 'themes/order.json', ...themes, 'VERSION'].sort();
}

/** @param {string} out absolute path of the tar to write */
export function build(out) {
    const stage = mkdtempSync(join(tmpdir(), 'kp-tokens-'));
    try {
        for (const f of files()) {
            execFileSync('install', ['-D', '-m', '0644', f === 'VERSION' ? '/dev/null' : f, join(stage, f)], { cwd: ROOT });
        }
        writeFileSync(join(stage, 'VERSION'), `${VERSION}\n`);
        execFileSync('tar', ['--sort=name', '--mtime=@0', '--owner=0', '--group=0', '--numeric-owner', '-cf', out, ...files()], {
            cwd: stage,
        });
    } finally {
        rmSync(stage, { recursive: true, force: true });
    }
}

async function check() {
    const dir = mkdtempSync(join(tmpdir(), 'kp-tokens-check-'));
    try {
        const tar = join(dir, 'tokens.tar');
        build(tar);
        const unpacked = join(dir, 'kp-themes');
        execFileSync('mkdir', [unpacked]);
        execFileSync('tar', ['-xf', tar, '-C', unpacked]);
        for (const entry of ENTRIES) await import(pathToFileURL(join(unpacked, entry)).href);
        const { terminalColors } = await import(pathToFileURL(join(unpacked, 'gates/terminal.mjs')).href);
        const { themes } = await import(pathToFileURL(join(unpacked, 'gates/check-invariants.mjs')).href);
        const list = themes();
        for (const t of list) terminalColors(t.name);
        console.log(
            `tokens.tar: ${files().length} files, ${ENTRIES.length} entry modules import from the unpacked copy, ${list.length} themes read.`,
        );
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    if (process.argv.includes('--check')) await check();
    else {
        build(new URL('tokens.tar', ROOT).pathname);
        console.log(`wrote tokens.tar (${files().length} files, kp-themes ${VERSION})`);
    }
}
