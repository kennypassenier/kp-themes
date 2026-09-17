// The drift gate's rule, on a throwaway repository — never on this one's state [scope-35].
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { check } from './check-drift.mjs';

const SCRIPT = fileURLToPath(new URL('check-drift.mjs', import.meta.url));

/**
 * A git repository with `files` staged and a manifest over `documents`.
 * @param {Record<string, string>} files
 * @param {Record<string, string[]>} documents doc → sources
 */
function repo(files, documents) {
    const root = mkdtempSync(join(tmpdir(), 'kp-drift-'));
    execFileSync('git', ['init', '-q'], { cwd: root });
    const all = {
        ...files,
        'docs/drift.json': JSON.stringify({
            documents: Object.fromEntries(Object.entries(documents).map(([doc, sources]) => [doc, { why: 'test', sources }])),
            exempt: {},
        }),
    };
    for (const [file, content] of Object.entries(all)) write(root, file, content);
    execFileSync('git', ['add', '-A'], { cwd: root });
    return root;
}

/** @param {string} root @param {string} file @param {string} content */
function write(root, file, content) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
}

/** @param {string} root @param {...string} args */
const run = (root, ...args) => spawnSync('node', [SCRIPT, '--root', root, ...args], { encoding: 'utf8' });

test('a source that moved under an untouched document is refused, naming the document, the file and the fix', (t) => {
    const root = repo({ 'GUIDE.md': 'guide', 'js/a.js': 'one', 'js/b.js': 'two' }, { 'GUIDE.md': ['js/*.js'] });
    t.after(() => rmSync(root, { recursive: true, force: true }));
    assert.equal(run(root, '--seen', 'GUIDE.md').status, 0);
    assert.deepEqual(check(root).problems, []);

    write(root, 'js/a.js', 'one, changed');
    const { problems } = check(root);
    assert.equal(problems.length, 1);
    assert.match(problems[0], /^GUIDE\.md: 1 source file\(s\) moved and the document did not/);
    assert.match(problems[0], /js\/a\.js/);
    assert.doesNotMatch(problems[0], /js\/b\.js/);
    assert.match(problems[0], /npm run drift:seen -- GUIDE\.md/);
    assert.equal(run(root, '--check').status, 1);

    // A new file the glob now reaches counts as a moved source too.
    write(root, 'js/a.js', 'one');
    write(root, 'js/c.js', 'three');
    execFileSync('git', ['add', '-A'], { cwd: root });
    assert.match(check(root).problems.join('\n'), /js\/c\.js \(added\)/);
});

test('a document changed together with its source passes, with a reminder to record it', (t) => {
    const root = repo({ 'GUIDE.md': 'guide', 'js/a.js': 'one' }, { 'GUIDE.md': ['js/a.js'] });
    t.after(() => rmSync(root, { recursive: true, force: true }));
    run(root, '--seen', 'GUIDE.md');
    write(root, 'js/a.js', 'one, changed');
    write(root, 'GUIDE.md', 'guide, updated for the change');
    const { problems, reminders } = check(root);
    assert.deepEqual(problems, []);
    assert.equal(reminders.length, 1);
    assert.match(reminders[0], /GUIDE\.md: changed together with 1 source file\(s\); run npm run drift:seen -- GUIDE\.md/);
    const cli = run(root, '--check');
    assert.equal(cli.status, 0);
    assert.match(cli.stdout, /drift:seen -- GUIDE\.md/);
});

test('--seen rerecords the document, and the refusal clears', (t) => {
    const root = repo({ 'GUIDE.md': 'guide', 'js/a.js': 'one' }, { 'GUIDE.md': ['js/a.js'] });
    t.after(() => rmSync(root, { recursive: true, force: true }));
    assert.match(check(root).problems.join('\n'), /GUIDE\.md: never recorded/);
    run(root, '--seen', 'GUIDE.md');
    write(root, 'js/a.js', 'one, changed');
    assert.equal(run(root, '--check').status, 1);
    const seen = run(root, '--seen', 'GUIDE.md');
    assert.equal(seen.status, 0, seen.stderr);
    assert.deepEqual(check(root).problems, []);
    assert.equal(run(root, '--check').status, 0);
    assert.equal(run(root, '--seen', 'NOT-LISTED.md').status, 1);
});

test('a glob that matches no tracked file is refused, and a generated output does not count as a match', (t) => {
    const root = repo({ 'GUIDE.md': 'guide', 'js/a.js': 'one', 'dist/bundle.js': 'built' }, { 'GUIDE.md': ['js/a.js', 'src/*.js', 'dist/*.js'] });
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const problems = check(root).problems.join('\n');
    assert.match(problems, /GUIDE\.md: source glob src\/\*\.js matches no tracked file/);
    assert.match(problems, /GUIDE\.md: source glob dist\/\*\.js matches no tracked file/);
    // An untracked file is not a match either.
    write(root, 'src/new.js', 'untracked');
    assert.match(check(root).problems.join('\n'), /src\/\*\.js matches no tracked file/);
});
