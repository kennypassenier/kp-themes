// The release go: recording refuses a tagged or not-newer version, a go is active only above the latest tag and
// spends itself when its tag appears, and the git tag reader agrees with git (a temporary repository).
//
// Run: node --test gates/release-go.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { withDatabase } from './db/index.mjs';
import { gitTags, list, record, status } from './release-go.mjs';
import { activeGos, compareVersions, refusal } from './release-go-logic.mjs';

/** Fake tags: `latest` and the set that exist. @param {string[]} tagged */
const fake = (tagged) => ({
    latest: () => tagged.map((t) => t).sort(compareVersions).pop() ?? null,
    has: (/** @type {string} */ v) => tagged.includes(v),
});

/** Run `body` with KP_THEMES_DB pointing at a fresh database. @param {(dir: string) => void} body */
function withScratchDb(body) {
    const dir = mkdtempSync(join(tmpdir(), 'kp-release-go-test-'));
    const before = process.env.KP_THEMES_DB;
    process.env.KP_THEMES_DB = join(dir, 'test.sqlite');
    try {
        withDatabase(() => {}, { path: process.env.KP_THEMES_DB, write: true, create: true }); // a migrated, empty fixture
        body(dir);
    } finally {
        if (before === undefined) delete process.env.KP_THEMES_DB;
        else process.env.KP_THEMES_DB = before;
        rmSync(dir, { recursive: true, force: true });
    }
}

const gives = (/** @type {string} */ v) => ['--by', 'Kenny', '--source', 'form: yes', '--at', '2026-11-03T22:17:41Z'].reduce((a, x) => [...a, x], [v]);

test('versions compare numerically, not as text', () => {
    assert.ok(compareVersions('12.10.0', '12.9.9') > 0);
    assert.equal(compareVersions('1.2.3', '1.2.3'), 0);
    assert.throws(() => compareVersions('12.5', '1.0.0'), /not a version/);
});

test('recording refuses a tagged version, an older one and a duplicate', () =>
    withScratchDb(() => {
        const tags = fake(['12.4.0', '12.5.0']);
        assert.match(refusal('12.5.0', tags) ?? '', /already tagged/);
        assert.match(refusal('12.4.1', tags) ?? '', /not greater/);
        assert.equal(refusal('12.5.1', tags), null);
        assert.throws(() => record(gives('12.5.0'), tags), /already tagged/);
        assert.match(record(gives('12.6.0'), tags), /recorded the go for 12.6.0/);
        assert.throws(() => record(gives('12.6.0'), tags), /already recorded/);
        assert.throws(() => record(['12.7.0'], tags), /usage/);
    }));

test('a go is active above the latest tag and spends itself when its tag exists', () =>
    withScratchDb(() => {
        assert.equal(status(fake(['12.5.0'])).active, false);
        record(gives('12.6.0'), fake(['12.5.0']));
        assert.deepEqual([status(fake(['12.5.0'])).active, status(fake(['12.5.0'])).text.includes('12.6.0')], [true, true]);
        assert.equal(status(fake(['12.5.0', '12.6.0'])).active, false);
        assert.match(list(fake(['12.5.0', '12.6.0'])), /12\.6\.0\tspent/);
        assert.match(list(fake(['12.5.0'])), /12\.6\.0\tactive/);
    }));

test('a go at or below the latest tag is stale even when its own tag is missing', () => {
    const gos = [{ version: '12.4.0', given_at: 'x', given_by: 'K', source: 's' }];
    assert.equal(activeGos(gos, { latest: () => '12.5.0', has: () => false }).length, 0);
    assert.equal(activeGos(gos, { latest: () => null, has: () => false }).length, 1);
});

test('the git reader finds the latest v-tag and tells tagged from untagged', () => {
    const dir = mkdtempSync(join(tmpdir(), 'kp-release-go-git-'));
    try {
        const git = (/** @type {string[]} */ ...a) => execFileSync('git', a, { cwd: dir, stdio: 'pipe' });
        git('init', '-q');
        git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'x');
        const tags = gitTags(dir);
        assert.equal(tags.latest(), null);
        git('tag', 'v1.2.0');
        assert.equal(tags.latest(), '1.2.0');
        assert.equal(tags.has('1.2.0'), true);
        assert.equal(tags.has('1.3.0'), false);
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
});

test('an unreadable database is an error, never "no go"', () =>
    withScratchDb((dir) => {
        process.env.KP_THEMES_DB = join(dir, 'missing.sqlite');
        assert.throws(() => status(fake([])), /does not exist/);
    }));
