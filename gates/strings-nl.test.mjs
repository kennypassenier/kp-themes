// kp's Dutch dictionary against the English it translates [habits-1101].
//
// Habits, 2026-11-02: a Dutch page showed "Undo", "On" / "Off" and "Cancel",
// because kp shipped no Dutch and every consumer kept its own copy of the words
// of parts it did not write. js/strings-nl.js is that copy, once.
//
// Two rules, of different weight:
//   - an English key with no Dutch is REPORTED, never a failure: other work adds
//     English keys every day, and the report is how they show up here;
//   - a Dutch value of the wrong shape FAILS: a string where the components call
//     a function (or the other way round) throws or prints source text on a
//     Dutch page, and only there.
// Plus the layering the runtime promises: English, then the dictionary, then the
// app's own setStrings(), which always wins.
//
// Red first (standing rule 7d): `undoToastClock: '5 s'` in
// js/strings/nl/selection-undo-newpill.js failed the shape test with
// "undoToastClock: English is function, Dutch is string".
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_STRINGS } from '../js/strings/defaults.js';
import { NL_KEPT_ENGLISH, NL_STRINGS } from '../js/strings-nl.js';
import { getLanguage, getStrings, registerDictionary, setLanguage, setStrings } from '../js/strings/runtime.js';

/** @param {unknown} value @returns {string} */
const shape = (value) => (Array.isArray(value) ? 'array' : typeof value);

test('every English key without a Dutch word is listed, as a report [habits-1101]', (t) => {
    const english = Object.keys(DEFAULT_STRINGS);
    const kept = english.filter((key) => NL_KEPT_ENGLISH.includes(key));
    const missing = english.filter((key) => !(key in NL_STRINGS) && !NL_KEPT_ENGLISH.includes(key));
    const translated = english.length - missing.length - kept.length;
    t.diagnostic(`nl: ${translated} of ${english.length} keys translated, ${kept.length} kept English on purpose (console messages)`);
    if (missing.length > 0) t.diagnostic(`nl: ${missing.length} still English: ${missing.join(', ')}`);
    assert.ok(translated > 0, 'the Dutch dictionary is empty');
});

test('a Dutch value has the shape of the English it replaces [habits-1101]', () => {
    const wrong = Object.entries(NL_STRINGS)
        .filter(([key, value]) => key in DEFAULT_STRINGS && shape(value) !== shape(DEFAULT_STRINGS[/** @type {keyof typeof DEFAULT_STRINGS} */ (key)]))
        .map(([key, value]) => `${key}: English is ${shape(DEFAULT_STRINGS[/** @type {keyof typeof DEFAULT_STRINGS} */ (key)])}, Dutch is ${shape(value)}`);
    assert.deepEqual(wrong, []);
});

test('the Dutch names no key the English does not have [habits-1101]', () => {
    const unknown = Object.keys(NL_STRINGS).filter((key) => !(key in DEFAULT_STRINGS));
    assert.deepEqual(unknown, []);
});

test('a kept-English key is not translated as well [habits-1101]', () => {
    assert.deepEqual(
        NL_KEPT_ENGLISH.filter((key) => key in NL_STRINGS),
        [],
    );
});

test('the arrays keep their length: seven weekdays, twelve months [habits-1101]', () => {
    for (const [key, value] of Object.entries(NL_STRINGS)) {
        const english = DEFAULT_STRINGS[/** @type {keyof typeof DEFAULT_STRINGS} */ (key)];
        if (Array.isArray(english)) assert.equal(/** @type {unknown[]} */ (value).length, english.length, key);
    }
});

test('the dictionary sits between the English and setStrings(), and nl-BE finds nl [habits-1101]', async () => {
    await registerDictionary('nl', NL_STRINGS);
    assert.equal(getLanguage(), 'en', 'no document and no choice: English');
    await setLanguage('nl-BE');
    assert.equal(getLanguage(), 'nl');
    assert.equal(getStrings().undoToastUndo, 'Ongedaan maken');
    assert.equal(getStrings().confirmCancel, 'Annuleren');
    setStrings({ confirmCancel: 'Laat maar' });
    assert.equal(getStrings().confirmCancel, 'Laat maar', "the app's own word wins over the dictionary");
    await setLanguage('en');
    assert.equal(getStrings().undoToastUndo, 'Undo');
    assert.equal(getStrings().confirmCancel, 'Laat maar', "and survives a change of language");
    await setLanguage(null);
});

test('a dictionary given as a loader is read when its language is asked for [habits-1101]', async () => {
    let loads = 0;
    await registerDictionary('xx', async () => {
        loads++;
        return { switchOn: 'ON-XX' };
    });
    assert.equal(loads, 0, 'not loaded while nobody speaks it');
    await setLanguage('xx');
    assert.equal(loads, 1);
    assert.equal(getStrings().switchOn, 'ON-XX');
    assert.equal(getStrings().switchOff, 'Off', 'a key the dictionary leaves out stays English');
    await setLanguage(null);
});
