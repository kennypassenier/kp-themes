// The signature advice [scope-97]: what it counts as an answer, and that it
// never refuses. Run by `npm test` (node --test gates/).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { answersIn, assess, report, rootsInSelector, setsMotion } from './advice-signature.mjs';
import { proofProblems, readSchema, readSignature, signedThemes, styleRules, validate } from './signature.mjs';

const PACKAGE = `
@layer kp.components {
    .kp-button { padding: 1rem; }
    .kp-dialog { border: 1px solid; }
    .kp-toast { border: 1px solid; }
    .kp-alert { border: 1px solid; }
    @media (prefers-reduced-motion: no-preference) {
        .kp-nav__menu { transition: opacity 150ms; }
        @starting-style { .kp-nav__links > li:hover > .kp-nav__menu { opacity: 0; } }
    }
    .kp-nav { display: flex; }
}`;

const VERBS = {
    components: {
        'kp-button': ['press', 'hover'],
        'kp-dialog': ['enter', 'leave'],
        'kp-toast': ['attention'],
        'kp-alert': ['attention'],
        'kp-nav': ['enter'],
        'kp-gone': ['hover'],
    },
};

test('a root is read from its parts and variants', () => {
    assert.deepEqual([...rootsInSelector("[data-theme='x'] .kp-nav__menu a:hover, .kp-button--primary")], ['kp-nav', 'kp-button']);
});

test('motion is a non-none animation, transition or transform', () => {
    assert.equal(setsMotion('transition: transform 1s'), true);
    assert.equal(setsMotion(' translate: 0 -2px;'), true);
    assert.equal(setsMotion('transform: none; animation: none'), false);
    assert.equal(setsMotion('color: red'), false);
});

test('hover, press and motion are told apart per root', () => {
    const answers = answersIn(`
        [data-theme='x'] .kp-button:hover:not(:disabled) { color: red; }
        [data-theme='x'] .kp-button:active { color: blue; }
        @media (prefers-reduced-motion: no-preference) { [data-theme='x'] .kp-dialog { transition: opacity 1s; } }
        @keyframes kp-thing { 0% { transform: none; } 100% { opacity: 1; } }
    `);
    assert.deepEqual([...(answers.get('kp-button') ?? [])].sort(), ['hover', 'press']);
    assert.deepEqual([...(answers.get('kp-dialog') ?? [])].sort(), ['attention', 'enter', 'leave', 'load']);
    assert.equal(answers.has('kp-thing'), false, 'a keyframe stop is not a style rule');
});

test('register, then signature, then package; open rows carry their proposal', () => {
    const findings = assess({
        registerCss: "[data-theme='x'] .kp-button:hover { translate: 0 -1px; }",
        packageCss: PACKAGE,
        signature: {
            recipe: [
                { verb: 'attention', components: ['kp-alert'], open: false },
                { verb: 'enter', components: ['kp-dialog'], open: true, proposal: 'fade it' },
            ],
        },
        verbs: VERBS,
    });
    const by = Object.fromEntries(findings.map((f) => [`${f.component}·${f.verb}`, f]));
    assert.equal(by['kp-button·hover'].source, 'register');
    assert.equal(by['kp-button·press'].source, 'missing');
    assert.equal(by['kp-alert·attention'].source, 'signature');
    assert.equal(by['kp-nav·enter'].source, 'package');
    assert.equal(by['kp-dialog·enter'].source, 'open');
    assert.equal(by['kp-dialog·enter'].proposal, 'fade it');
    assert.equal(by['kp-dialog·leave'].source, 'missing');
    assert.equal(by['kp-toast·attention'].source, 'missing');
    assert.equal('kp-gone·hover' in by, false, 'a root the package no longer defines is not asked about');
    const lines = report('x', findings);
    assert.match(lines[0], /3 of 7 component verbs answered \(register 1, signature 1, package 1\)/);
    assert.equal(lines.filter((l) => l.includes('· ')).length, 4);
});

test('the advice exits 0 and prints a line per signed theme', () => {
    const script = fileURLToPath(new URL('./advice-signature.mjs', import.meta.url));
    const out = execFileSync(process.execPath, [script], { encoding: 'utf8' });
    for (const theme of signedThemes()) assert.match(out, new RegExp(`^  ${theme}: `, 'm'));
});

test('the style rule scanner splits selector lists outside parentheses', () => {
    const [rule] = styleRules("/* c */ [data-theme='x'] :is(.a, .b) .c,\n [data-theme='x'] .d { color: red; }");
    assert.deepEqual(rule.selectors, ["[data-theme='x'] :is(.a, .b) .c", "[data-theme='x'] .d"]);
});

test('every signature validates and its proof exists', () => {
    const schema = readSchema();
    for (const theme of signedThemes()) {
        const signature = readSignature(theme);
        assert.equal(signature.theme, theme);
        assert.deepEqual(validate(signature, schema), [], `${theme} against the schema`);
        assert.deepEqual(proofProblems(signature), [], `${theme}'s proof`);
    }
});

test('proof that does not exist is refused', () => {
    const problems = proofProblems({
        theme: 'formal',
        x: {
            proof: [
                { file: 'css/formal-register.css', selector: "[data-theme='formal'] .kp-not-here" },
                { file: 'css/formal-register.css', keyframes: 'kp-not-here' },
                { file: 'themes/formal/tokens.json', token: 'not-here' },
                { file: 'css/formal-register.css', property: '--kp-not-here' },
            ],
        },
    });
    assert.equal(problems.length, 4);
});
