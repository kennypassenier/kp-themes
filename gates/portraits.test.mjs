// The theme portraits match their signatures [scope-97]. Held here, in
// `npm test`, rather than as a check script of its own: the generated page
// is bound to its source the way scope-76 folded the other generated files
// into targets that already run, so the chain, the hook and verify need no
// new line. `npm run generate:portraits` writes them.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { page, partsOf, SECTIONS, SNIPPETS } from './generate-portraits.mjs';
import { readSignature, signedThemes } from './signature.mjs';

const dir = new URL('../research/theme-portraits/', import.meta.url);

test('every portrait page matches its signature, and no page is left without one', () => {
    const themes = signedThemes();
    assert.ok(themes.length >= 3, 'the pilot has three signatures');
    for (const theme of themes) {
        const written = readFileSync(new URL(`${theme}.html`, dir), 'utf8');
        assert.ok(
            written === page(theme, readSignature(theme)),
            `research/theme-portraits/${theme}.html does not match; run npm run generate:portraits`,
        );
    }
    const pages = readdirSync(dir).filter((name) => name.endsWith('.html'));
    assert.deepEqual(pages.sort(), themes.map((t) => `${t}.html`).sort());
});

test('a portrait carries the nine sections in order, each a judged block', () => {
    for (const theme of signedThemes()) {
        const html = page(theme, readSignature(theme));
        const ids = [...html.matchAll(/<section class="cat-block" id="([a-z]+)">/g)].map((m) => m[1]);
        assert.deepEqual(
            ids,
            SECTIONS.map((s) => s.id),
            theme,
        );
        assert.equal((html.match(/class="cat-look"/g) ?? []).length, 9, `${theme}: a Look-at text per section`);
        assert.match(html, /data-cat-theme-fixed/);
    }
});

test('every example a signature names has a snippet', () => {
    for (const theme of signedThemes()) {
        const text = JSON.stringify(readSignature(theme));
        for (const [, name] of text.matchAll(/"example":"([a-z0-9-]+)"/g)) assert.ok(SNIPPETS[name], `${theme} names example "${name}"`);
    }
});

test('the worked banner uses parts the package defines', () => {
    const known = new Set(['microlabel']);
    for (const name of readdirSync(new URL('../css/', import.meta.url)).filter((n) => n.endsWith('.css'))) {
        for (const m of readFileSync(new URL(`../css/${name}`, import.meta.url), 'utf8').matchAll(/\.(kp-[a-z0-9_-]+)/g)) known.add(m[1]);
    }
    for (const theme of signedThemes()) {
        const { classes } = partsOf(readSignature(theme).banner.markup);
        assert.deepEqual(
            classes.filter((c) => !known.has(c)),
            [],
            `${theme}'s banner uses classes no stylesheet defines`,
        );
    }
});
