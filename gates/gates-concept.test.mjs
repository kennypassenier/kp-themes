// Tests for the concept pages and showcase registers [S46, S49, Phase 7, readout-words].

import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { CONCEPT_COPY, DEFAULT_COPY_THEME } from '../showcase/concept-copy.mjs';
import { themes } from './check-invariants.mjs';

/** @typedef {import('./check-invariants.mjs').Theme} Theme */

// ── S46: the concept page is the approved demo, element for element ─────────

test('S46: every element of the approved demo is on the concept page [correction L4]', () => {
    const inventory = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8'));
    const html = readFileSync(new URL('../examples/concept.html', import.meta.url), 'utf8');
    assert.ok(inventory.elements.length >= 25, `only ${inventory.elements.length} elements inventoried`);
    for (const { what, marker } of inventory.elements) {
        assert.ok(html.includes(marker), `the concept page lacks ${what} (no "${marker}" in examples/concept.html)`);
    }
    // Drill [L7]: the laurels removed from the descriptor and the page
    // regenerated → "lacks the laurels", red (2026-09-07).
});

test('S49: every theme with an approved demo has its own concept page, whole and in its own words [A1]', () => {
    const inventory = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8'));
    const slots = Object.keys(CONCEPT_COPY[DEFAULT_COPY_THEME]);

    // Phase 7: this swept the opt-in list, so a theme absent from
    // concept-copy.mjs was not unchecked-and-reported but unchecked-and-
    // silent. titanium was covered because someone remembered. The list
    // to sweep is themes/order.json; anything it holds that has no copy
    // is named here with its reason, the way the other exception lists
    // in this project are.
    const NO_CONCEPT_PAGE = ['synthwave']; // the twenty-fifth theme arrived without a demo of its own [S46]
    const themes = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
    const names = Array.isArray(themes) ? themes : Object.keys(themes);
    assert.deepEqual(
        names.filter((t) => !(t in CONCEPT_COPY)).sort(),
        [...NO_CONCEPT_PAGE].sort(),
        'a theme has no concept copy and no reason recorded for having none',
    );

    for (const [theme, copy] of Object.entries(CONCEPT_COPY)) {
        // The same slots for every theme: that is what makes the pages
        // comparable, and what stops a demo's words from going missing.
        assert.deepEqual(Object.keys(copy).sort(), [...slots].sort(), `${theme}'s copy has different slots`);
        for (const [slot, text] of Object.entries(copy)) {
            assert.equal(typeof text, 'string', `${theme}.${slot} is not a string`);
            // The slots that may be empty, each for a stated reason. An
            // empty one is not a blank on the page: the renderer leaves
            // the element out entirely, so the difference is between a
            // theme having the thing and not having it.
            //
            // `readout` joined them in Phase 7: only the two registers
            // that style the small reading above a control have words for
            // it, and the others would otherwise carry text no theme ever
            // paints. gates.test.mjs holds the two lists together further
            // down, in both directions.
            const MAY_BE_EMPTY = ['arrivalLine', 'arrivalReady', 'brandTag', 'readout'];
            if (!MAY_BE_EMPTY.includes(slot)) assert.notEqual(text.trim(), '', `${theme}.${slot} is empty`);
        }
        if (theme === DEFAULT_COPY_THEME) continue;
        const page = readFileSync(new URL(`../examples/concept-${theme}.html`, import.meta.url), 'utf8');
        for (const { what, marker } of inventory.elements) {
            assert.ok(page.includes(marker), `the ${theme} concept page lacks ${what} (no "${marker}")`);
        }
        // And it says its own words, not the default theme's.
        assert.ok(page.includes(copy.headline), `the ${theme} concept page does not carry its own headline`);
        assert.ok(
            !page.includes(CONCEPT_COPY[DEFAULT_COPY_THEME].headline),
            `the ${theme} concept page still carries ${DEFAULT_COPY_THEME}'s headline`,
        );
        assert.ok(page.includes(`data-theme="${theme}"`), `the ${theme} concept page does not wear its own theme`);
    }
    // Drill [KT3]: phantom's entry pointed at cyberpunk's headline →
    // "still carries cyberpunk's headline", red (2026-09-08).
});

test("every showcase page carries its own theme's register [Phase 7]", () => {
    // showcase/themes/<name>.html is the page fifteen every-theme sweeps
    // read. The generator used to carry a hand-written list of link tags,
    // and dark — added in round seven — was never added to it. So dark's
    // page was styled by twenty-one other themes' registers and none of
    // its own, and every sweep over it had been measuring the theme
    // undressed: the pointer bus it declares, the quirk it presses with,
    // the whole register. Found in Phase 7 by a pointer test that asked
    // dark for a knob dark's own register declares.
    const dir = new URL('../showcase/themes/', import.meta.url);
    const pages = readdirSync(dir).filter((f) => f.endsWith('.html'));
    const shipped = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
    assert.ok(pages.length >= shipped.length, `only ${pages.length} showcase pages for ${shipped.length} shipped themes, which cannot be right`);

    const registers = readdirSync(new URL('../css/', import.meta.url)).filter((f) => f.endsWith('-register.css'));
    const missing = [];
    for (const page of pages) {
        const theme = page.slice(0, -'.html'.length);
        if (!registers.includes(`${theme}-register.css`)) continue; // a theme with no register of its own
        const html = readFileSync(new URL(page, dir), 'utf8');
        if (!html.includes(`/${theme}-register.css"`)) missing.push(theme);
    }
    assert.deepEqual(missing, [], 'these showcase pages do not load the register of the theme they exist to show');
});

test('the frozen list does not describe a theme the package no longer ships [Phase 7, gone-themes]', () => {
    // Four themes left at scope-11 and four rows kept describing them,
    // three of those as Essential — so the list the package is measured
    // against had stopped describing the package. One frozen test bar
    // named `mono` and became unreachable with it: a bar that can never
    // be met can never fail either, which is the shape Phase 7 exists to
    // find. A row may still name a departed theme — the history is worth
    // keeping — but it says so in the row.
    const features = readFileSync(new URL('../docs/FEATURES.md', import.meta.url), 'utf8');
    const order = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
    const live = new Set(Array.isArray(order) ? order : Object.keys(order));
    // 12 themes remain since 2026-10-17 (terminal, phantom, light and grotesk left, retro earlier);
    // the floor guards against an empty or truncated list, not against a theme leaving again.
    assert.ok(live.size >= 12, `only ${live.size} themes, which cannot be right`);

    const unmarked = [];
    for (const line of features.split('\n')) {
        if (!line.startsWith('|')) continue;
        for (const [, name] of line.matchAll(/Theme `([a-z-]+)`/g)) {
            if (live.has(name)) continue;
            if (!line.includes('Removed 2026-')) unmarked.push(`${name}: ${line.slice(0, 60)}`);
        }
    }
    assert.deepEqual(unmarked, [], 'these rows describe a theme the package does not ship, with no note saying so');

    // And no test bar may rest on a theme that is gone — that is the half
    // that silently stops being measurable.
    const bars = [];
    for (const line of features.split('\n')) {
        const bar = /Test bar:(.*)$/.exec(line);
        if (!bar) continue;
        // An amendment explains why a bar moved and names the theme it
        // moved off, which is the record working as intended — the bar
        // itself is what has to be measurable, so read only up to it.
        const stated = bar[1].split(/\*\*Amended /)[0];
        for (const [, name] of stated.matchAll(/`([a-z-]+)`/g)) {
            if (!live.has(name) && /^(academia|mono|ticker|woodblock)$/.test(name)) bars.push(`${name} in: ${bar[1].slice(0, 60)}`);
        }
    }
    assert.deepEqual(bars, [], 'a frozen test bar names a theme the package does not ship, so it can never fail');
});

test('a register that styles the readout has words to put in it [readout-words, Phase 7]', () => {
    // Phase 7 found `.kp-button__readout` styled in full by two registers
    // — fifteen rules each, including a hover reveal — and rendered by no
    // page in the package, because nothing supplied the text. Inert CSS
    // for an element that never existed. Kenny chose the words on
    // 2026-09-12; this holds the two halves together, in both directions.
    const registers = readdirSync(new URL('../css/', import.meta.url)).filter((f) => f.endsWith('-register.css'));
    const styles = registers
        .filter((f) => readFileSync(new URL(f, new URL('../css/', import.meta.url)), 'utf8').includes('.kp-button__readout'))
        .map((f) => f.slice(0, -'-register.css'.length))
        .sort();

    const speaks = Object.entries(CONCEPT_COPY)
        .filter(([, copy]) => (copy.readout ?? '') !== '')
        .map(([theme]) => theme)
        .sort();

    assert.ok(styles.length > 0, 'no register styles the readout, which cannot be right after Phase 7');
    assert.deepEqual(speaks, styles, 'a register styles the readout with no words to put in it, or gives words no register paints');
});
