// Guards for Kenny's two rejections of the Medicine Cabinet demo (2026-10-31): the words of a button that follows a quantity,
// and the choices of a chip group tied to a field. Both are pure, so no browser is needed.
//
// Run: node --test gates/accept-follows.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acceptState, amountMakesSense } from '../js/accept-follows-words.js';
import { chipCount, choiceNamed, fieldNeeded, mostUsed, uniqueChoices } from '../js/segmented/link-choices.js';

const BOXES = { unit: 'boxes', unitMany: 'boxes' };

test('the button says what will happen with the amount, in the unit of the amount', () => {
    assert.deepEqual(acceptState({ amount: 3, amountText: '3', ...BOXES }), { valid: true, label: 'Add 3 boxes', reason: '' });
    assert.equal(acceptState({ amount: 1, amountText: '1', unit: 'box', unitMany: 'boxes' }).label, 'Add 1 box');
    assert.equal(acceptState({ amount: 2.5, amountText: '2,5', ...BOXES, verb: 'Take' }).label, 'Take 2,5 boxes');
});

test('an amount that makes no sense turns the button off and says why', () => {
    for (const amount of [0, -2, Number.NaN]) {
        const state = acceptState({ amount, amountText: '', ...BOXES });
        assert.equal(state.valid, false);
        assert.equal(state.label, 'Add boxes');
        assert.equal(state.reason, 'Choose how many boxes first.');
    }
});

test('a quantity with no unit still reads well', () => {
    assert.equal(acceptState({ amount: 4, amountText: '4', unit: '', unitMany: '' }).label, 'Add 4');
    assert.equal(acceptState({ amount: 0, amountText: '', unit: '', unitMany: '' }).reason, 'Choose an amount first.');
});

test('a page can name its own minimum and words', () => {
    assert.equal(amountMakesSense(0.5, 1), false);
    assert.equal(amountMakesSense(1, 1), true);
    const dutch = { acceptFollowsLabel: (/** @type {string} */ verb, /** @type {string} */ amount, /** @type {string} */ unit) => `${amount} ${unit} ${verb}`, acceptVerb: 'toevoegen' };
    assert.equal(acceptState({ amount: 3, amountText: '3', ...BOXES, strings: dutch }).label, '3 boxes toevoegen');
});

const SYMPTOMS = [
    { value: 'headache', label: 'Headache', uses: 14 },
    { value: 'rash', label: 'Rash', uses: 2 },
    { value: 'fever', label: 'Fever', uses: 11 },
    { value: 'cough', label: 'Cough', uses: 11 },
];

test('the chips are the most used choices, equal uses keep the list order', () => {
    assert.deepEqual(mostUsed(SYMPTOMS, 3).map((c) => c.value), ['headache', 'fever', 'cough']);
    assert.deepEqual(mostUsed(SYMPTOMS, 9).map((c) => c.value), ['headache', 'rash', 'fever', 'cough']);
});

test('the number of chips is configurable and refuses nonsense', () => {
    assert.equal(chipCount(null, 9), null);
    assert.equal(chipCount('4', 9), 4);
    assert.equal(chipCount('12', 9), 9);
    assert.equal(chipCount('all', 9), 9);
    for (const bad of ['0', '-1', '2.5', 'few', '']) assert.throws(() => chipCount(bad, 9), RangeError);
});

test('the field is there only while some choice has no chip', () => {
    const chips = (/** @type {number} */ n) => new Set(mostUsed(SYMPTOMS, n).map((c) => c.value));
    assert.equal(fieldNeeded(SYMPTOMS, chips(3), null), true);
    assert.equal(fieldNeeded(SYMPTOMS, chips(4), null), false);
    assert.equal(fieldNeeded(SYMPTOMS, chips(4), 'auto'), false);
    assert.equal(fieldNeeded(SYMPTOMS, chips(4), 'always'), true);
});

test('words typed in a field name a choice by label or value in any case', () => {
    assert.equal(choiceNamed(SYMPTOMS, ' FEVER ')?.value, 'fever');
    assert.equal(choiceNamed(SYMPTOMS, 'rash')?.label, 'Rash');
    assert.equal(choiceNamed(SYMPTOMS, 'fev'), null);
    assert.equal(choiceNamed(SYMPTOMS, ''), null);
});

test('a list drawn twice while it closes still gives each choice once', () => {
    assert.deepEqual(uniqueChoices([...SYMPTOMS, ...SYMPTOMS]).map((c) => c.value), ['headache', 'rash', 'fever', 'cough']);
});
