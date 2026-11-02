// The review database's persistence module (gates/db/): every store gives back what it was given, a hand-written
// record with keys no column holds survives, a reader never creates or migrates a file, a failed write leaves nothing
// behind, and the merge driver applies their rows and refuses a row both sides changed.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as store from './db/index.mjs';
import { plan } from './db/git-merge.mjs';

/** A scratch database for one test. @param {(path: string) => void} body */
function scratch(body) {
    const dir = mkdtempSync(join(tmpdir(), 'kp-review-db-test-'));
    try {
        body(join(dir, 'test.sqlite'));
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
}

const write = (/** @type {string} */ path, /** @type {(db: any) => any} */ work) => store.withDatabase(work, { path, write: true, create: true });
const read = (/** @type {string} */ path, /** @type {(db: any) => any} */ work) => store.withDatabase(work, { path });

test('the register, the notes and the checks come back as they were written', () =>
    scratch((path) => {
        const register = { hashVersion: 10, verdicts: { 'a--b': { formal: { firefox: { verdict: 'approved', hash: 'h', commit: 'c', given: '2026-11-02', ratio: 2 } } } } };
        const notes = { 'a--b': { dark: { rejected: 'no', change: 'yes', commit: 'abc1234', given: '2026-11-02' } } };
        const pixels = { $comment: 'x', hashVersion: 10, commit: 'c', checked: 't', renderer: 'r', checks: { 'a--b': { formal: { firefox: { state: 'carried', from: 'c', shot: 's' } } } } };
        const round = { $comment: 'r', open: false, commit: 'c', opened: '2026-09-17' };
        write(path, (db) => {
            store.saveRegister(db, register);
            store.saveNotes(db, notes);
            store.savePixelChecks(db, pixels);
            store.saveRound(db, round);
        });
        read(path, (db) => {
            assert.deepEqual(store.loadRegister(db), register);
            assert.deepEqual(store.loadNotes(db), notes);
            assert.deepEqual(store.loadPixelChecks(db), pixels);
            assert.deepEqual(store.loadRound(db), round);
            assert.equal(store.loadHashReadings(db), null);
        });
    }));

test('a demo record keeps every list, its order and the keys no column holds', () =>
    scratch((path) => {
        const record = {
            demo: 'audhd-cook',
            bundledInto: 'gap-round-1',
            odd: { kept: true },
            rounds: [
                { round: '1', page: 'p1', allJudged: false, approved: [{ item: 'a', theme: 'formal' }], notApproved: [{ item: 'b', theme: 'dark', note: 'words', fixedIn: 'x' }], comment: 'c' },
                { round: '2', allJudged: true, notApproved: [], choices: [{ item: 'c', theme: 'formal', picked: '2' }], reopenedForThisRound: [{ item: 'a', theme: 'formal', reason: 'redrawn' }] },
            ],
            reopened: [{ item: 'a', theme: 'formal', reason: 'redrawn' }],
        };
        write(path, (db) => store.saveDemoVerdicts(db, 'audhd-recepten/cook', record));
        read(path, (db) => {
            assert.deepEqual(store.loadDemoVerdicts(db, 'audhd-recepten/cook'), record);
            assert.deepEqual(store.receivedPages(db, 'audhd-recepten/cook'), ['p1']);
            assert.deepEqual(store.verdictDemos(db), ['audhd-recepten/cook']);
            assert.equal(store.loadDemoVerdicts(db, 'none'), null);
        });
    }));

test('a demo fact keeps its open-ended picks as JSON', () =>
    scratch((path) => {
        const decided = { decided: 'yes', by: 'Kenny', attributes: 'a', picks: { formal: { loading: '2' } } };
        write(path, (db) => store.saveDemoFact(db, 'decided', 'x', decided));
        read(path, (db) => assert.deepEqual(store.loadDemoFacts(db, 'decided'), { x: decided }));
    }));

test('a reader refuses a missing file and creates nothing', () =>
    scratch((path) => {
        assert.throws(() => read(path, () => 0), /does not exist/);
        assert.equal(existsSync(path), false);
    }));

test('a write that throws leaves the database as it was', () =>
    scratch((path) => {
        write(path, (db) => store.saveRound(db, { open: false, commit: 'c', opened: 'd' }));
        assert.throws(() =>
            write(path, (db) => {
                store.saveRound(db, { open: true, commit: 'e', opened: 'f' });
                throw new Error('stop');
            }),
        );
        read(path, (db) => assert.equal(store.loadRound(db)?.open, false));
    }));

test('the merge driver applies their changes and refuses a row both sides changed', () => {
    const t = (/** @type {[string, string][]} */ rows) => new Map([['verdicts', new Map(rows)]]);
    const base = t([['k1', 'a'], ['k2', 'b']]);
    const ok = plan(base, t([['k1', 'a2'], ['k2', 'b']]), t([['k1', 'a'], ['k2', 'b'], ['k3', 'c']]));
    assert.deepEqual(ok, { apply: [{ table: 'verdicts', key: 'k3', row: 'c' }], conflicts: [] });
    const clash = plan(base, t([['k1', 'mine'], ['k2', 'b']]), t([['k1', 'theirs'], ['k2', 'b']]));
    assert.equal(clash.conflicts.length, 1);
});
