// The review notes beside the verdict register (Kenny, 2026-09-14): written
// with `node gates/verdicts.mjs note`, cleared by `record` when the block is
// approved in that theme, left by a rejection, and refused by the gate when
// they name a block or theme that does not exist or say nothing.
//
// Red run first, on 2738d1c: every test here failed on its import —
// check-verdicts.mjs exported no notesFaults, verdicts.mjs no recordPrompt,
// putNote or clearApprovedNotes, and `note` was not a command.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { notesFaults } from './check-verdicts.mjs';
import { clearApprovedNotes, putNote, recordPrompt, sortedNotes } from './verdicts.mjs';

const HASH = 'a'.repeat(64);
const context = {
    hashVersion: 2,
    known: new Set(['button--variants', 'button--sizes']),
    themes: ['formal', 'nostromo'],
    commit: 'abc1234',
    given: '2026-09-14',
};
const note = (extra = {}) => ({
    rejected: 'the ghost button has no edge',
    change: 'The ghost variant now draws its border in the strong border colour, so its edge shows on the card ground.',
    commit: 'abc1234',
    given: '2026-09-14',
    ...extra,
});

/**
 * A register and a notes file in a temporary directory.
 * @param {any} notes
 */
function files(notes) {
    const dir = mkdtempSync(join(tmpdir(), 'kp-review-notes-'));
    const registerFile = join(dir, 'verdicts.json');
    const notesFile = join(dir, 'review-notes.json');
    writeFileSync(registerFile, JSON.stringify({ hashVersion: 2, verdicts: {} }));
    writeFileSync(notesFile, JSON.stringify(notes));
    return { dir, registerFile, notesFile, read: () => JSON.parse(readFileSync(notesFile, 'utf8')) };
}

const prompt = (/** @type {string[]} */ ...lines) => ['Verdict lines (hash version 2):', ...lines, ''].join('\n');

test('record clears the note of a block approved in that theme, in any engine, and says so', () => {
    const f = files({ 'button--variants': { formal: note(), nostromo: note() } });
    try {
        const result = recordPrompt(prompt(`button--variants · formal · chromium · approved · ${HASH}`), { ...context, ...f });
        assert.equal(result.ok, true);
        assert.ok(result.out.includes('note cleared: button--variants · formal'), result.out.join('\n'));
        assert.deepEqual(f.read(), { 'button--variants': { nostromo: note() } });

        const last = recordPrompt(prompt(`button--variants · nostromo · firefox · approved · ${HASH}`), { ...context, ...f });
        assert.ok(last.out.includes('note cleared: button--variants · nostromo'));
        assert.deepEqual(f.read(), {});
    } finally {
        rmSync(f.dir, { recursive: true, force: true });
    }
});

test('record leaves the note of a block rejected again, and a note in another theme', () => {
    const f = files({ 'button--variants': { formal: note() }, 'button--sizes': { nostromo: note() } });
    try {
        const result = recordPrompt(
            prompt(`button--variants · formal · firefox · rejected · ${HASH}`, `button--sizes · formal · firefox · approved · ${HASH}`),
            { ...context, ...f },
        );
        assert.equal(result.ok, true);
        assert.equal(result.out.filter((line) => line.startsWith('note cleared')).length, 0);
        assert.deepEqual(f.read(), { 'button--variants': { formal: note() }, 'button--sizes': { nostromo: note() } });
    } finally {
        rmSync(f.dir, { recursive: true, force: true });
    }
});

test('a refused prompt records nothing and clears no note', () => {
    const f = files({ 'button--variants': { formal: note() } });
    try {
        const result = recordPrompt(
            prompt(`button--variants · formal · firefox · approved · ${HASH}`, `button--gone · formal · firefox · approved · ${HASH}`),
            { ...context, ...f },
        );
        assert.equal(result.ok, false);
        assert.deepEqual(f.read(), { 'button--variants': { formal: note() } });
    } finally {
        rmSync(f.dir, { recursive: true, force: true });
    }
});

test('record prints the command that compares what it recorded with the test browser [fix-28]', () => {
    const f = files({});
    try {
        const result = recordPrompt(prompt(`button--variants · formal · firefox · approved · ${HASH}`), { ...context, ...f });
        const line = 'Whether the test browser reads the same hashes [fix-28]: node gates/verdicts.mjs compare --against-browser --commit abc1234';
        assert.ok(result.out.includes(line), result.out.join('\n'));
    } finally {
        rmSync(f.dir, { recursive: true, force: true });
    }
});

test('clearApprovedNotes drops an emptied block', () => {
    const notes = { 'button--variants': { formal: note() } };
    assert.deepEqual(clearApprovedNotes(notes, [{ key: 'button--variants', theme: 'formal', verdict: 'approved' }]), ['button--variants · formal']);
    assert.deepEqual(notes, {});
});

test('note writes a note with the commit and date, and replaces an older one', () => {
    /** @type {any} */
    const notes = {};
    assert.deepEqual(putNote(notes, { key: 'button--variants', theme: 'formal', rejected: 'first', change: 'one' }, context), []);
    assert.deepEqual(notes['button--variants'].formal, { rejected: 'first', change: 'one', commit: 'abc1234', given: '2026-09-14' });
    assert.deepEqual(putNote(notes, { key: 'button--variants', theme: 'formal', rejected: 'second', change: 'two', commit: 'def5678' }, context), []);
    assert.equal(notes['button--variants'].formal.commit, 'def5678');
    assert.equal(notes['button--variants'].formal.rejected, 'second');
    assert.deepEqual(Object.keys(sortedNotes(notes)['button--variants'].formal), ['rejected', 'change', 'commit', 'given']);
});

test('note refuses an unknown block, an unknown theme and an empty text, and writes nothing', () => {
    /** @type {any} */
    const notes = {};
    const faults = putNote(notes, { key: 'button--gone', theme: 'plaid', rejected: ' ', change: 'x', commit: 'nope' }, context);
    assert.ok(faults.some((f) => /button--gone · plaid: not a block/.test(f)));
    assert.ok(faults.some((f) => /not a theme/.test(f)));
    assert.ok(faults.some((f) => /--rejected/.test(f)));
    assert.ok(faults.some((f) => /--commit nope/.test(f)));
    assert.deepEqual(notes, {});
});

test('the note command refuses an unknown block or theme with exit code 1, and writes a known one', () => {
    const f = files({});
    const script = fileURLToPath(new URL('./verdicts.mjs', import.meta.url));
    const run = (/** @type {string[]} */ args) =>
        spawnSync(process.execPath, [script, 'note', ...args], { encoding: 'utf8', env: { ...process.env, KP_REVIEW_NOTES: f.notesFile } });
    try {
        const block = run(['button--gone', 'formal', '--rejected', 'x', '--change', 'y', '--commit', 'abc1234']);
        assert.equal(block.status, 1);
        assert.match(block.stderr, /button--gone · formal: not a block any review page shows/);
        const theme = run(['button--variants', 'plaid', '--rejected', 'x', '--change', 'y', '--commit', 'abc1234']);
        assert.equal(theme.status, 1);
        assert.match(theme.stderr, /button--variants · plaid: not a theme/);
        assert.deepEqual(f.read(), {});

        const ok = run(['button--variants', 'formal', '--rejected', 'too quiet', '--change', 'Louder now.', '--commit', 'abc1234']);
        assert.equal(ok.status, 0, ok.stderr);
        assert.equal(f.read()['button--variants'].formal.rejected, 'too quiet');
    } finally {
        rmSync(f.dir, { recursive: true, force: true });
    }
});

test('the gate refuses a note on an unknown block or theme, an empty field and an unknown field', () => {
    const faults = notesFaults(
        {
            'button--gone': { formal: note() },
            'button--variants': { plaid: note(), formal: note({ change: '  ', given: '14-09-2026', extra: 1 }) },
            'button--sizes': {},
        },
        context,
    );
    assert.ok(faults.some((f) => /^button--gone: not a block/.test(f)));
    assert.ok(faults.some((f) => /button--variants · plaid: not a theme/.test(f)));
    assert.ok(faults.some((f) => /button--variants · formal: change is missing or empty/.test(f)));
    assert.ok(faults.some((f) => /given is not a YYYY-MM-DD/.test(f)));
    assert.ok(faults.some((f) => /unknown field\(s\) extra/.test(f)));
    assert.ok(faults.some((f) => /button--sizes: no theme holds a note/.test(f)));
    assert.deepEqual(notesFaults([], context), ['the review notes are not a JSON object']);
    assert.deepEqual(notesFaults({ 'button--variants': { formal: note() } }, context), []);
    const { commit, ...withoutCommit } = note();
    assert.ok(commit);
    assert.deepEqual(notesFaults({ 'button--variants': { formal: withoutCommit } }, context), []);
});
