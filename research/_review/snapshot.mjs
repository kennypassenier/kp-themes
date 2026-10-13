#!/usr/bin/env node
// Keep the version of a demo Kenny judged, so the next round can show it beside the new one ("Previous version" in
// the review dialog, Kenny 2026-10-13: "voor/na … onmisbaar").
//
//   node research/_review/snapshot.mjs <topic> [--from <git ref>] [--round <name>]
//
// Writes research/<topic>/_previous/: the demo's own folder, the package's stylesheets and the modules the demo
// loads, all as they stood at <ref> (default HEAD, the round about to be replaced), in the same relative layout, so
// the copy runs on the static review site as it ran then:
//
//   _previous/previous.json             { round, from, commit, made }
//   _previous/research/<topic>/…        the demo, without the review kit and the catalogue shell
//   _previous/css/*.css                 every stylesheet of the package root (the registers too)
//   _previous/js/…                      the modules the demo imports, followed through their imports
//
// The fonts are not copied: the copy's fonts.css points at the live fonts/ folder. The review kit and the catalogue
// shell are left out on purpose: the copy is only looked at, it must never read or write the verdicts.
//
// One snapshot per demo: the next round replaces it, and the demo's archiving removes it.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, normalize, posix } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
const topic = args[0]?.startsWith('--') ? undefined : args[0];
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const ref = option('--from', 'HEAD');
if (!topic || !/^[a-z0-9-]+$/.test(topic)) {
    console.error('usage: node research/_review/snapshot.mjs <topic> [--from <git ref>] [--round <name>]');
    process.exit(2);
}

const git = (...rest) => execFileSync('git', rest, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
const show = (path) => git('show', `${ref}:${path}`);
const listAt = (path) =>
    git('ls-tree', '-r', '--name-only', ref, '--', path)
        .toString()
        .split('\n')
        .filter(Boolean);

const commit = git('rev-parse', ref).toString().trim();
const demoDir = `research/${topic}`;
const demoFiles = listAt(`${demoDir}/`).filter((path) => !path.includes('/_previous/') && !path.includes('/_audit/'));
if (!demoFiles.includes(`${demoDir}/demo.html`)) {
    console.error(`${demoDir}/demo.html does not exist at ${ref}`);
    process.exit(1);
}

const out = join(ROOT, demoDir, '_previous');
rmSync(out, { recursive: true, force: true });
/** @param {string} path @param {Buffer | string} body */
const write = (path, body) => {
    const target = join(out, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, body);
};

// The demo, with the review kit and the catalogue shell taken out.
const LEFT_OUT = /<script\b[^>]*\bsrc="[^"]*(?:_review\/review\.js|catalogue\/[^"]*)"[^>]*><\/script>\s*/g;
const imports = new Set();
for (const path of demoFiles) {
    let body = show(path);
    if (path.endsWith('.html')) body = Buffer.from(body.toString().replace(LEFT_OUT, ''));
    write(path, body);
    if (/\.(html|js|mjs)$/.test(path)) for (const spec of specifiers(body.toString())) imports.add(posix.join(posix.dirname(path), spec));
}

// Every stylesheet of the package root; fonts.css pointed at the live fonts.
for (const path of listAt('css/').filter((p) => /^css\/[^/]+\.css$/.test(p))) {
    let body = show(path);
    if (path === 'css/fonts.css') body = Buffer.from(body.toString().replaceAll("url('../fonts/", `url('${posix.relative(posix.join(demoDir, '_previous/css'), 'fonts')}/`));
    write(path, body);
}

// The modules the demo loads, followed through their own imports.
const seen = new Set();
const queue = [...imports].map((p) => normalize(p).replaceAll('\\', '/')).filter((p) => p.startsWith('js/'));
queue.push('js/auto.js');
while (queue.length) {
    const path = /** @type {string} */ (queue.pop());
    if (seen.has(path)) continue;
    seen.add(path);
    let body;
    try {
        body = show(path);
    } catch {
        continue; // a module that did not exist then
    }
    write(path, body);
    for (const spec of specifiers(body.toString())) {
        const next = posix.normalize(posix.join(posix.dirname(path), spec));
        if (next.startsWith('js/')) queue.push(next);
    }
}

const round = option('--round', roundOf(show(`${demoDir}/demo.html`).toString()));
write('previous.json', `${JSON.stringify({ round, from: ref, commit, made: new Date().toISOString() }, null, 4)}\n`);
console.log(`research/${topic}/_previous: ${demoFiles.length} demo file(s) and ${seen.size} module(s) at ${commit.slice(0, 8)}${round ? `, round ${round}` : ''}`);

/** The relative module specifiers in a source: static imports, re-exports and dynamic imports. */
function specifiers(text) {
    const found = [];
    for (const m of text.matchAll(/(?:import|export)\s[^'"]*?from\s*['"](\.{1,2}\/[^'"]+)['"]|import\s*\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)|<script\b[^>]*\bsrc="(\.{1,2}\/[^"]+\.m?js)"/g))
        found.push(m[1] || m[2] || m[3]);
    return found;
}

/** The round a demo announces (`data-review-round`), or ''. */
function roundOf(html) {
    const match = html.match(/<script[^>]*data-review-round[^>]*>([\s\S]*?)<\/script>/);
    try {
        return match ? String(JSON.parse(match[1]).round || '') : '';
    } catch {
        return '';
    }
}
