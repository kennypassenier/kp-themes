// Tests that the project documents state what the code does [Phase 8].

import { test } from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

test('the README states the gate count the hook actually runs [Phase 8]', () => {
    // Phase 8's honesty pass found the README saying "Thirty gates" and
    // "some 2500 tests" while the hook ran thirty-four. A number a person
    // has to keep true will drift, so this reads both ends: the hook is
    // the source, the README is the claim, and they have to agree.
    const hook = readFileSync(new URL('../.claude/hooks/gates.sh', import.meta.url), 'utf8');
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

    // Until 2026-09-16 the hook announced each check with `echo "→ …"`
    // and this counted those. gate-cache turned the announcements into
    // comments — an echo printed whether or not the check ran, which is
    // the one thing the runner now has to be honest about — so the
    // countable thing is the `gate` line itself.
    const ran = hook.split('\n').filter((line) => /^gate(_glob)? /.test(line)).length;
    assert.ok(ran >= 25, `only ${ran} gate lines in the hook, which cannot be right`);

    /** @type {Record<string, number>} */
    const WORDS = {
        twenty: 20,
        'twenty-five': 25,
        'twenty-six': 26,
        'twenty-seven': 27,
        'twenty-eight': 28,
        'twenty-nine': 29,
        thirty: 30,
        'thirty-one': 31,
        'thirty-two': 32,
        'thirty-three': 33,
        'thirty-four': 34,
        'thirty-five': 35,
        'thirty-six': 36,
        'thirty-seven': 37,
        'thirty-eight': 38,
        'thirty-nine': 39,
        'forty-one': 41,
        'forty-two': 42,
        'forty-three': 43,
        forty: 40,
    };
    const stated = /\b([A-Za-z-]+) gates run in seconds\b/.exec(readme);
    assert.ok(stated, 'the README no longer says how many gates run — put the sentence back, or this check has nothing to hold');
    const claimed = WORDS[stated[1].toLowerCase()];
    assert.ok(claimed !== undefined, `the README says "${stated[1]} gates" and this check does not know that number — add it to WORDS`);
    assert.equal(claimed, ran, `the README claims ${claimed} gates and .claude/hooks/gates.sh runs ${ran}`);
});

test('the architecture reference names every module the package ships [Phase 8]', () => {
    // It describes the system AS BUILT, so a module it does not mention is
    // a hole in the map rather than a small omission. Phase 8 found it
    // naming five of twenty-four: everything added since the reference was
    // written — the side navigation, the strings dictionary, the locale,
    // the no-flash snippet, twelve widgets — was simply absent.
    const reference = readFileSync(new URL('../docs/ARCHITECTURE_REFERENCE.md', import.meta.url), 'utf8');
    const modules = readdirSync(new URL('../js/', import.meta.url)).filter((f) => f.endsWith('.js'));
    assert.ok(modules.length >= 20, `only ${modules.length} modules found, which cannot be right`);

    const unnamed = modules.filter((f) => !reference.includes(`js/${f}`));
    assert.deepEqual(unnamed, [], 'the reference does not name these modules, so its map of the system is incomplete');
});

test("the project's own document index names every document, and nothing that is gone [Phase 8]", () => {
    // CLAUDE.md carries a table of what each document is for, and it is
    // the first thing a session reads. Phase 8 found it missing two and
    // still pointing at two that had moved. An index a person maintains
    // will drift; this reads both ends.
    const claude = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8') + readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8');
    const dir = new URL('../docs/', import.meta.url);
    const docs = readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith('.md'))
        .map((e) => `docs/${e.name}`);
    assert.ok(docs.length >= 15, `only ${docs.length} documents found, which cannot be right`);

    const unlisted = docs.filter((d) => !claude.includes(d));
    assert.deepEqual(unlisted, [], "these documents are not in CLAUDE.md's table, so a session starting fresh does not know they exist");

    // And the other direction: a row naming a file that is not there.
    const rows = [...claude.matchAll(/^\| (docs\/[A-Za-z_0-9/-]+\.md)\s*\|/gm)].map((m) => m[1]);
    const gone = rows.filter((r) => !existsSync(new URL(`../${r}`, import.meta.url)));
    assert.deepEqual(gone, [], 'these rows name a document this repository does not have');
});
