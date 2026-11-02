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

// ---- strfix-1102: the runtime's failure paths and the Dutch call shapes ----

import { languageReady } from '../js/strings/runtime.js';

/** A stand-in root for the runtime to read attributes from; `events` collects what it announces. @param {Record<string, string>} attributes */
function fakeDocument(attributes) {
    /** @type {Event[]} */
    const events = [];
    const style = { setProperty() {} };
    const root = { style, getAttribute: (/** @type {string} */ name) => attributes[name] ?? null };
    Object.assign(globalThis, { document: { documentElement: root, dispatchEvent: (/** @type {Event} */ event) => events.push(event) } });
    return { events, attributes, restore: () => Reflect.deleteProperty(globalThis, 'document') };
}

/** Quiet console.error while a test makes a loader fail on purpose. @returns {() => void} the restore function */
function muteErrors() {
    const original = console.error;
    console.error = () => {};
    return () => {
        console.error = original;
    };
}

test('a rejecting loader is kept, retried on the next ask, and never leaves a rejection behind [strfix-1102]', async () => {
    const unmute = muteErrors();
    let loads = 0;
    let fail = true;
    await registerDictionary('ra', async () => {
        loads++;
        if (fail) throw new Error('network down');
        return { switchOn: 'ON-RA' };
    });
    await setLanguage('ra');
    assert.equal(loads, 1);
    assert.equal(getLanguage(), 'en', 'a failed load stays English');
    fail = false;
    await setLanguage('ra');
    assert.equal(loads, 2, 'the loader survived the failure and is retried');
    assert.equal(getLanguage(), 'ra');
    assert.equal(getStrings().switchOn, 'ON-RA');
    unmute();
    await setLanguage(null);
});

test('a loader that throws synchronously, or hands back a broken dictionary, does not escape [strfix-1102]', async () => {
    const unmute = muteErrors();
    await registerDictionary('rs', () => {
        throw new Error('sync boom');
    });
    await setLanguage('rs');
    assert.equal(getLanguage(), 'en');
    const page = fakeDocument({});
    try {
        await registerDictionary('rb', async () => ({ loadingWord: undefined }));
        await setLanguage('rb');
        assert.equal(getLanguage(), 'en', 'a dictionary the strings cannot be laid out from is refused');
        await languageReady();
    } finally {
        page.restore();
    }
    unmute();
    await setLanguage(null);
});

test('overlapping asks share one load, and a late failure cannot delete a good dictionary [strfix-1102]', async () => {
    const unmute = muteErrors();
    let loads = 0;
    await registerDictionary('ov', () => {
        loads++;
        return new Promise((resolve) => setTimeout(() => resolve({ switchOn: 'ON-OV' }), 10));
    });
    await Promise.all([setLanguage('ov'), setLanguage('ov'), setLanguage('ov')]);
    assert.equal(loads, 1, 'three asks, one load');
    assert.equal(getStrings().switchOn, 'ON-OV');

    /** @type {Array<(value: Partial<import('../js/strings/types.js').Strings>) => void>} */
    const settle = [];
    /** @type {Array<(reason: Error) => void>} */
    const reject = [];
    let calls = 0;
    await registerDictionary('ov2', () => {
        calls++;
        return new Promise((resolve, rej) => {
            settle.push(resolve);
            reject.push(rej);
        });
    });
    const first = setLanguage('ov2');
    const second = setLanguage('ov2');
    await new Promise((resolve) => setTimeout(resolve, 5));
    reject[0]?.(new Error('late failure'));
    await first;
    await second;
    assert.equal(calls, 1, 'the second ask joined the first load');
    unmute();
    await setLanguage(null);
});

test('registering an object while its loader is in flight wins over the loader [strfix-1102]', async () => {
    let release = () => {};
    await registerDictionary('rg', () => new Promise((resolve) => (release = () => resolve({ switchOn: 'FROM-LOADER' }))));
    const pending = setLanguage('rg');
    await registerDictionary('rg', { switchOn: 'FROM-APP' });
    release();
    await pending;
    await languageReady();
    assert.equal(getLanguage(), 'rg');
    assert.equal(getStrings().switchOn, 'FROM-APP');
    await setLanguage(null);
});

test('a loader failing after the app registered an object does not delete that object [strfix-1102]', async () => {
    const unmute = muteErrors();
    let fail = () => {};
    await registerDictionary('rf', () => new Promise((_, reject) => (fail = () => reject(new Error('late')))));
    const pending = setLanguage('rf');
    await new Promise((resolve) => setTimeout(resolve, 5));
    await registerDictionary('rf', { switchOn: 'FROM-APP' });
    fail();
    await pending;
    await setLanguage('rf');
    assert.equal(getLanguage(), 'rf', 'the registered dictionary is still there');
    assert.equal(getStrings().switchOn, 'FROM-APP');
    unmute();
    await setLanguage(null);
});

test('an empty language attribute counts as absent, and nl_BE and long tags fall back [strfix-1102]', async () => {
    await registerDictionary('nl', NL_STRINGS);
    await registerDictionary('zh-hant', { switchOn: 'ON-ZH' });
    const page = fakeDocument({ 'data-kp-lang': '', lang: 'nl' });
    try {
        await setLanguage(null);
        assert.equal(getLanguage(), 'nl', 'data-kp-lang="" does not hide lang="nl"');
        await setLanguage('');
        assert.equal(getLanguage(), 'nl', 'setLanguage("") hands the choice back');
        await setLanguage('nl_BE');
        assert.equal(getLanguage(), 'nl', 'nl_BE reads as nl-be, then nl');
        await setLanguage('zh-Hant-TW');
        assert.equal(getLanguage(), 'zh-hant', 'progressively shorter prefixes');
        await setLanguage(null);
        page.attributes.lang = 'nl_BE';
        page.attributes['data-kp-lang'] = '  ';
        await setLanguage(null);
        assert.equal(getLanguage(), 'nl');
    } finally {
        page.restore();
    }
    await setLanguage(null);
});

test('re-registering the active language announces it; asking again for the same one does not [strfix-1102]', async () => {
    const page = fakeDocument({});
    try {
        await registerDictionary('rr', { switchOn: 'ONE' });
        await setLanguage('rr');
        const base = page.events.length;
        assert.equal(getStrings().switchOn, 'ONE');
        await setLanguage('rr');
        await setLanguage('RR');
        assert.equal(page.events.length, base, 'nothing changed: no republish, no event');
        await registerDictionary('rr', { switchOn: 'TWO' });
        assert.equal(getStrings().switchOn, 'TWO');
        assert.equal(page.events.length, base + 1, 'a new dictionary for the active language is announced');
    } finally {
        page.restore();
    }
    await setLanguage(null);
});

test('verbLast keeps the app\'s own letters [strfix-1102]', () => {
    const acceptFollowsNone = /** @type {(verb: string, unit?: string) => string} */ (NL_STRINGS.acceptFollowsNone);
    const acceptFollowsLabel = /** @type {(verb: string, amount: string, unit: string) => string} */ (NL_STRINGS.acceptFollowsLabel);
    assert.equal(acceptFollowsNone('Toevoegen', 'kg'), 'kg toevoegen');
    assert.equal(acceptFollowsNone('Toevoegen', 'kWh'), 'kWh toevoegen');
    assert.equal(acceptFollowsLabel('Print PDF', '3', 'kg'), '3 kg print PDF');
    assert.equal(acceptFollowsLabel('Voeg toe', '3', 'dozen'), '3 dozen voeg toe');
    assert.equal(acceptFollowsLabel('Toevoegen', '3', 'eieren'), '3 eieren toevoegen');
    assert.equal(acceptFollowsNone('Toevoegen', undefined), 'Toevoegen', 'no unit: the verb starts the line');
});

test('every Dutch function takes the English call sites\' arguments without throwing [strfix-1102]', () => {
    const values = ['x', 3, 0, -1, 1.5, undefined];
    /** @param {number} n @returns {unknown[][]} */
    const combos = (n) => (n === 0 ? [[]] : combos(n - 1).flatMap((rest) => values.map((value) => [value, ...rest])));
    const problems = [];
    for (const [key, dutch] of Object.entries(NL_STRINGS)) {
        const english = DEFAULT_STRINGS[/** @type {keyof typeof DEFAULT_STRINGS} */ (key)];
        if (typeof english !== 'function' || typeof dutch !== 'function') continue;
        if (dutch.length !== english.length) problems.push(`${key}: English takes ${english.length}, Dutch ${dutch.length}`);
        for (const args of combos(english.length)) {
            /** @type {(...a: unknown[]) => unknown} */
            const callEnglish = /** @type {(...a: unknown[]) => unknown} */ (/** @type {unknown} */ (english));
            /** @type {(...a: unknown[]) => unknown} */
            const callDutch = /** @type {(...a: unknown[]) => unknown} */ (/** @type {unknown} */ (dutch));
            let expected;
            try {
                expected = callEnglish(...args);
            } catch {
                continue;
            }
            try {
                const got = callDutch(...args);
                if (typeof expected !== 'string') continue;
                if (typeof got !== 'string') problems.push(`${key}(${args.map(String)}): returned ${typeof got}`);
                else if (!expected.includes('undefined') && got.includes('undefined')) problems.push(`${key}(${args.map(String)}): leaks undefined`);
            } catch (error) {
                problems.push(`${key}(${args.map(String)}): throws ${String(error)}`);
            }
        }
    }
    assert.deepEqual(problems.slice(0, 20), []);
});
