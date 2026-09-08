// Tests for the snippet tokenizer [T12, KT8].
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highlight, highlightCss, LANGUAGES, tokenize, TOKEN_TOKENS } from './highlight.mjs';

/** @param {string} code @param {string} language */
const kinds = (code, language) =>
    tokenize(code, language)
        .filter((t) => t.kind !== 'plain')
        .map((t) => `${t.kind}:${t.text}`);

test('T12: JavaScript — keywords, strings, numbers and both comment forms', () => {
    assert.deepEqual(kinds("import { Alert } from '@kp-soft/themes'; // one\nconst n = 12; /* two */", 'js'), [
        'keyword:import',
        'keyword:from',
        "string:'@kp-soft/themes'",
        'comment:// one',
        'keyword:const',
        'string:12',
        'comment:/* two */',
    ]);
});

test('T12: CSS — a property name is a keyword, a selector pseudo-class is not', () => {
    assert.deepEqual(kinds('@media (min-width: 40rem) {\n  a:hover { color: #fff; padding: 0.5rem; /* why */ }\n}', 'css'), [
        'keyword:@media',
        'keyword:min-width',
        'string:40rem',
        'keyword:color',
        'string:#fff',
        'keyword:padding',
        'string:0.5rem',
        'comment:/* why */',
    ]);
});

test('T12: HTML — tag and attribute names are keywords, values are strings', () => {
    assert.deepEqual(kinds('<div class="kp-alert" data-kp-semantic>\n<!-- note -->\ntext\n</div>', 'html'), [
        'keyword:div',
        'keyword:class',
        'string:="kp-alert"',
        'keyword:data-kp-semantic',
        'comment:<!-- note -->',
        'keyword:div',
    ]);
});

test('T12: a language nobody taught it is refused, not shipped as flat text', () => {
    assert.throws(() => tokenize('SELECT 1', 'sql'), /no tokenizer for "sql"\. Known: html, css, js/);
    assert.equal(LANGUAGES.length, 3);
});

test('T12: the markup escapes the snippet', () => {
    assert.equal(highlight('a < b && c', 'js'), 'a &lt; b &amp;&amp; c');
    assert.match(highlight('<b>', 'html'), /^&lt;<span class="kp-code__keyword">b<\/span>&gt;$/);
});

test('KT8: the highlighter brings no colour of its own', () => {
    // Every colour comes from a theme token, so a snippet is green in
    // terminal and gold in lapis like everything else on the page.
    const css = highlightCss();
    assert.equal(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i.test(css), false, css);
    for (const [kind, token] of Object.entries(TOKEN_TOKENS))
        assert.match(css, new RegExp(`\\.kp-code__${kind} \\{\\n {4}color: var\\(${token}\\);`));
});
