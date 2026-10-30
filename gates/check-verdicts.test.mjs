// The verdict register's gate, without a browser: version, pairs, keys and entries.
//
// Run: node --test gates/

import { test } from 'node:test';
import { entry, context, blocks, HASH } from './check-verdicts-fixtures.mjs';
import { registerFaults, unapprovedPairs, knownBlocks, blockIds } from './check-verdicts.mjs';
import assert from 'node:assert/strict';
import { parseVerdictLines } from './verdicts.mjs';

test('a register at another hash version is refused, with the command that brings it level', () => {
    // Every pair approved: the recipe may move, and the approvals are carried.
    const level = { hashVersion: 1, verdicts: { 'button--variants': { formal: { firefox: entry() }, nostromo: { firefox: entry() } } } };
    const faults = registerFaults(level, context({ known: blocks() }));
    assert.equal(faults.length, 1);
    assert.match(faults[0], /version 1, catalogue\/block-hash\.js reads version 2: every pair is approved, so run node gates\/verdicts\.mjs carry/);
    assert.deepEqual(registerFaults({ ...level, hashVersion: 2 }, context({ known: blocks() })), []);
});

test('the recipe may not move while a pair is unapproved [fix-62]', () => {
    // Kenny, 2026-09-19: "vanaf nu kan de hash enkel nog veranderd worden als
    // alle componenten goedgekeurd zijn". One rejected pair and one never
    // judged, and the gate says which.
    const register = {
        hashVersion: 1,
        verdicts: { 'button--variants': { formal: { firefox: entry({ verdict: 'rejected' }) } } },
    };
    const faults = registerFaults(register, context({ known: blocks() }));
    assert.equal(faults.length, 1);
    assert.match(faults[0], /2 pair\(s\) are not approved, so the recipe may not move yet \[fix-62\]/);
    assert.match(faults[0], /button--variants · formal \(rejected\)/);
    assert.match(faults[0], /button--variants · nostromo \(never judged\)/);
});

test('a theme intro is one pair, not one per theme [scope-111]', () => {
    // The first draft of the fix-62 gate counted a block written for one
    // theme in all of them, and reported 84 theme intros as never judged.
    const known = blocks({
        'intros--intro-nostromo': {
            page: 'catalogue/intros.html',
            label: 'Theme intros',
            block: 'intro-nostromo',
            component: true,
            theme: 'nostromo',
        },
    });
    const register = {
        hashVersion: 1,
        verdicts: {
            'button--variants': { formal: { firefox: entry() }, nostromo: { firefox: entry() } },
            'intros--intro-nostromo': { nostromo: { firefox: entry() } },
        },
    };
    assert.match(registerFaults(register, context({ known }))[0], /every pair is approved/);
    assert.deepEqual(unapprovedPairs(register, known, ['formal', 'nostromo']), []);
});

test('knownBlocks reads the theme a block is written for', async () => {
    const known = await knownBlocks();
    const intro = [...known].find(([key]) => key.startsWith('intros--intro-'));
    assert.ok(intro, 'the catalogue has theme intros');
    assert.equal(intro[1].theme, intro[0].replace('intros--intro-', ''));
    assert.equal(known.get('button--variants')?.theme, undefined);
});

test('a key no review page shows, a theme that does not exist and a malformed entry are refused', () => {
    const faults = registerFaults(
        {
            hashVersion: 2,
            verdicts: {
                'button--gone': { formal: { firefox: entry() } },
                'button--variants': {
                    plaid: { firefox: entry() },
                    formal: { Firefox: entry({ verdict: 'fine', hash: 'abc', given: '13-09-2026' }) },
                },
            },
        },
        context(),
    );
    assert.ok(faults.some((f) => /button--gone: not a block/.test(f)));
    assert.ok(faults.some((f) => /plaid: not a theme/.test(f)));
    assert.ok(faults.some((f) => /Firefox: an engine name/.test(f)));
    assert.ok(faults.some((f) => /verdict "fine"/.test(f)));
    assert.ok(faults.some((f) => /not a full SHA-256/.test(f)));
    assert.ok(faults.some((f) => /given is not a YYYY-MM-DD/.test(f)));
    assert.deepEqual(registerFaults('[]', context()), ['the register is not a JSON object']);
    assert.ok(registerFaults({ hashVersion: 2 }, context()).includes('verdicts is missing or not an object'));
});

test('a well-formed register passes, per engine', () => {
    const register = {
        hashVersion: 2,
        verdicts: { 'button--variants': { formal: { firefox: entry(), chromium: entry({ verdict: 'rejected' }) } } },
    };
    assert.deepEqual(registerFaults(register, context()), []);
});

test('block ids are read the way the catalogue mounts them', () => {
    assert.deepEqual(blockIds('<main><section class="cat-block" id="a"></section><section id="b"></section></main>'), ['a']);
    assert.deepEqual(blockIds('<header><section id="x"></section></header><main><section id="b"><section id="c"></section></section></main>'), [
        'b',
        'c',
    ]);
    assert.deepEqual(blockIds('<main><!-- <section class="cat-block" id="gone"> --><section class="cat-block" id="kept"></section></main>'), [
        'kept',
    ]);
});

test('the repository knows its component and demo blocks by the keys the pages use', async () => {
    const known = await knownBlocks();
    assert.ok(known.has('button--variants'));
    assert.ok(known.has('table--datatable'));
    assert.ok([...known.keys()].some((key) => key.startsWith('research/navbar/demo.html#')));
});

test('a verdict block without its end line, or with a different count, is refused: the prompt was cut off [2026-10-03]', () => {
    // Twice on 2026-10-03 the last line arrived without its `@2`: the chat took
    // the tail of the message for a mention. The end line is what tells.
    const cut = parseVerdictLines(`Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH}`);
    assert.match(cut.faults.at(-1) ?? '', /no "End of verdict lines: N\." line/);
    const short = parseVerdictLines(
        `Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH}\nEnd of verdict lines: 2.`,
    );
    assert.match(short.faults.at(-1) ?? '', /says 2 line\(s\) and holds 1/);
    const whole = parseVerdictLines(
        `Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH} · @2\nEnd of verdict lines: 1.`,
    );
    assert.deepEqual(whole.faults, []);
    assert.equal(whole.lines[0].ratio, 2);
});
