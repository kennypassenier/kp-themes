// Tests for the story renderer [T10, TH102].
//
// One per construct, because "the seven constructs" is a claim that has
// to be checkable one at a time, and one per refusal, because the refusal
// is the reason this exists rather than a two-line regex chain.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { census, MarkdownRefusal, renderMarkdown, storyPaths } from './markdown.mjs';

/** @param {string} source @param {{ file?: string }} [options] */
const html = (source, options = {}) => renderMarkdown(source, { file: 'test.md', ...options }).html;

test('T10: a heading becomes an h element at its level', () => {
    assert.equal(html('# terminal — anatomy'), '<h1>terminal — anatomy</h1>');
    assert.equal(html('## What is load-bearing'), '<h2>What is load-bearing</h2>');
});

test('T10: bold becomes strong', () => {
    assert.equal(html('**Monochrome green.** One hue.'), '<p><strong>Monochrome green.</strong> One hue.</p>');
});

test('T10: inline code becomes code, and its contents are not markdown', () => {
    assert.equal(html('`--radius: 0` is not a style choice.'), '<p><code>--radius: 0</code> is not a style choice.</p>');
    assert.equal(html('`a **b** c`'), '<p><code>a **b** c</code></p>');
});

test('T10: an ordered list keeps its continuation lines', () => {
    assert.equal(
        html('1. **Gold acts.** `--primary`\n   carries a deep-blue ink.\n2. Second.'),
        '<ol>\n<li><strong>Gold acts.</strong> <code>--primary</code>\ncarries a deep-blue ink.</li>\n<li>Second.</li>\n</ol>',
    );
});

test('T10: bullets become a ul', () => {
    assert.equal(html('- one\n- two'), '<ul>\n<li>one</li>\n<li>two</li>\n</ul>');
});

test('T10: a block quote holds blocks, not a line each', () => {
    assert.equal(html('> How this theme answers\n> the questions.'), '<blockquote>\n<p>How this theme answers\nthe questions.</p>\n</blockquote>');
});

test('T10: a link becomes an anchor with an escaped href', () => {
    assert.equal(
        html('[DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md)'),
        '<p><a href="../../docs/DESIGN_INVARIANTS.md">DESIGN_INVARIANTS.md</a></p>',
    );
});

test('T10: text is escaped, so a story cannot inject markup', () => {
    assert.equal(html('5 < 6 & "quoted"'), '<p>5 &lt; 6 &amp; &quot;quoted&quot;</p>');
    assert.equal(html('`<span>`'), '<p><code>&lt;span&gt;</code></p>');
});

test('T10: an unknown construct is refused with the file and the line', () => {
    // The property the whole decision rests on: not passed through as
    // literal characters, and the message says where to look.
    assert.throws(
        () => html('# A story\n\nText.\n\n```js\nconst x = 1;\n```\n'),
        (error) => {
            assert.ok(error instanceof MarkdownRefusal);
            assert.match(error.message, /^test\.md:5: a fenced code block\./);
            return true;
        },
    );
});

test('T10: tables, images, raw HTML and asterisk emphasis are each refused by name', () => {
    assert.throws(() => html('| a | b |'), /test\.md:1: a table/);
    assert.throws(() => html('![alt](x.png)'), /test\.md:1: an image/);
    assert.throws(() => html('a <span>b</span>'), /test\.md:1: raw HTML/);
    assert.throws(() => html('a *b* c'), /test\.md:1: a single \*/);
    assert.throws(() => html('- - -'), /test\.md:1: a thematic break/);
    assert.throws(() => html('* bullet'), /test\.md:1: a bullet written with \* or \+/);
});

test('T10: syntax that opens and never closes is refused rather than half-rendered', () => {
    assert.throws(() => html('**bold'), /a bold span that never closes/);
    assert.throws(() => html('`code'), /an inline code span that never closes/);
    assert.throws(() => html('a [label](no-close'), /does not open a \[text\]\(url\) link/);
});

test('T10: underscore emphasis is one of the eight constructs [MR-R6-1]', () => {
    // T10 first wrote down seven, on a census that had miscounted: bold
    // 323 against a true 327, code 189 against 193, and these nine spans
    // missed altogether. Kenny corrected the decision on 2026-09-07
    // rather than rewriting nine words, because two of them are what
    // emphasis is for and bold is not -- a foreign term (_bero-ai_) and
    // contrastive stress (_is_).
    assert.equal(html('be _lighter_ than'), '<p>be <em>lighter</em> than</p>');
    assert.equal(html('the imported pigment — _bero-ai_, from Berlin'), '<p>the imported pigment — <em>bero-ai</em>, from Berlin</p>');
    // An underscore inside a word is a literal underscore, not emphasis.
    assert.equal(html('`TAB_CHANGE_EVENT` fires'), '<p><code>TAB_CHANGE_EVENT</code> fires</p>');
    assert.equal(html('read TAB_CHANGE_EVENT here'), '<p>read TAB_CHANGE_EVENT here</p>');
    // Asterisk emphasis stays refused: one spelling, not two.
    assert.throws(() => html('a *starred* word'), /a single \*/);
});

test('T10: an underscore inside a word stays a literal underscore', () => {
    assert.equal(html('the constant TAB_CHANGE_EVENT'), '<p>the constant TAB_CHANGE_EVENT</p>');
});

test('TH102: all 22 stories render, and every construct the source holds comes out', () => {
    const paths = storyPaths();
    assert.equal(paths.length, 22);
    for (const path of paths) {
        const source = readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
        const { html: rendered, counts } = renderMarkdown(source, { file: path });
        // AR26 in miniature: the census comes from the source, so a
        // renderer that dropped a construct fails here rather than
        // publishing a shorter page.
        assert.deepEqual(counts, census(source), `${path} rendered a different set of constructs than it contains`);
        assert.ok(rendered.startsWith('<h1>'), `${path} does not start with its title`);
    }
});
