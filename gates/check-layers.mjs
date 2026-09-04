// DI9: theme colour stays in the token layer [L3-EXIT].
//
// This was the last row of the compliance table that read "not gated",
// and the reason was that nobody had looked. When someone did, on
// 2026-09-04, the authored stylesheets held 42 colour literals that
// duplicated tokens — cyberpunk's scrollbar was written as
// `hsl(315 95% 64%)`, which is `--primary` spelled out a second time.
// Three of those copies had already drifted from the token they came
// from, by 0.3 to 1.8 units. That is the failure DI9 predicts, found in
// the wild: change the palette and the button moves while the scrollbar
// keeps the old colour, with no error anywhere.
//
// So: a colour in an authored stylesheet must come from a token. The
// relative colour syntax makes that expressible even where a literal was
// carrying an alpha — `hsl(from var(--primary) h s l / 0.55)` — and
// AR15's baseline (modern Chrome and Firefox only) is what allows it.
//
// Since KT3 this file also guards the scaffolding. The showcase's own
// stylesheet is inlined into every fixture page the browser tests open,
// so a rule there that targets a bare element overrides the package on
// exactly the pages that are supposed to be measuring the package. That
// is how the TH12 test came to measure showcase.css: it asserted the
// theme's typeface was applied, and stayed green with the package's own
// rule deleted.
//
// Usage: node gates/check-layers.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';

/** The stylesheets a human writes. The generated one is not one of them. */
const AUTHORED = ['../css/_rules.css', '../css/_header.css', '../css/components.css', '../css/cyberpunk-register.css', '../css/tailwind-bridge.css'];

/**
 * Colours that are deliberately not theme colours, each with its reason.
 *
 * Not exceptions to DI9 so much as outside it: DI9 is about a theme's
 * colour leaking out of the token layer, and none of these is a theme's
 * colour. They are listed rather than pattern-matched away, so that
 * adding one is a decision somebody makes on purpose.
 */
/** @type {Record<string, string>} */
const NOT_THEME_COLOUR = {
    'rgb(0 0 0 / 0.5)':
        'the backdrop behind a modal dialog. A backdrop dims what is behind it; a theme colour there would tint the page instead of darkening it.',
    'hsl(0, 0%, 100%)': 'the print stylesheet. Paper has no theme: the ground is white.',
    'hsl(0, 0%, 0%)': 'the print stylesheet. Paper has no theme: the ink is black.',
};

const COLOUR = /#[0-9a-fA-F]{3,8}\b|hsla?\([^)]*\)|rgba?\([^)]*\)|\boklch\([^)]*\)/g;

/**
 * Stylesheets that are scaffolding rather than package: inlined into the
 * fixture pages, never installed by a consumer. They may style their own
 * furniture and may not style the document.
 */
const SCAFFOLDING = ['../showcase/showcase.css'];

/**
 * Bare-element rules the scaffolding is allowed, each with its reason.
 *
 * Listed rather than pattern-matched, so adding one is a decision
 * somebody makes on purpose — the same shape as NOT_THEME_COLOUR above.
 */
/** @type {Record<string, string>} */
const SCAFFOLDING_MAY_STYLE = {
    body: 'margin and line-height only: page furniture the package deliberately leaves to the consumer. It may not set a colour, a font or anything else a theme decides.',
};

/** Declarations the allowed bare-element rules may carry. */
const FURNITURE_PROPERTIES = ['margin', 'line-height'];

/**
 * @param {string} source
 * @returns {{line: number, colour: string}[]}
 */
export function leakedColours(source) {
    // Data URIs hold their own little SVG documents; their fills are
    // shapes, not theme colour, and a `%23` escape is not a hex colour.
    const masked = source.replace(/url\("data:[^"]*"\)/g, (m) => ' '.repeat(m.length));
    /** @type {{line: number, colour: string}[]} */
    const problems = [];
    for (const match of masked.matchAll(COLOUR)) {
        const colour = match[0];
        // `hsl(from var(--token) …)` is the point of the exercise.
        if (colour.includes('var(')) continue;
        if (NOT_THEME_COLOUR[colour] !== undefined) continue;
        problems.push({ line: masked.slice(0, match.index).split('\n').length, colour });
    }
    return problems;
}

/**
 * Rules in the scaffolding whose selector starts at a bare element, so
 * they win over the package on the pages the browser tests measure.
 *
 * `.sc-theme a` is anchored on a class and is fine; `body`, `a:hover`
 * and `table th` are not.
 *
 * @param {string} source
 * @returns {{line: number, selector: string, properties: string[]}[]}
 */
export function documentRules(source) {
    // Comments are prose, and prose contains commas and the word `body`.
    // Blanked rather than removed so the line numbers still point at the
    // rule a reader has to go and fix.
    const masked = source.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
    /** @type {{line: number, selector: string, properties: string[]}[]} */
    const problems = [];
    for (const match of masked.matchAll(/([^{}@;]+?)\s*\{([^{}]*)\}/g)) {
        const properties = [...match[2].matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
        for (const selector of match[1].split(',').map((x) => x.trim())) {
            if (selector === '') continue;
            // From where the selector itself starts, not where the match
            // does: the match swallows the blanked comment above it, and
            // a line number that points at the comment sends a reader to
            // the wrong place.
            const line = masked.slice(0, masked.indexOf(selector, match.index)).split('\n').length;
            // A compound anchored on a class, id or attribute cannot
            // reach an element the package styles without opting in.
            if (/^[.#\[]/.test(selector)) continue;
            if (/^(from|to|\d+%)$/.test(selector)) continue; // keyframe steps
            if (SCAFFOLDING_MAY_STYLE[selector] !== undefined && properties.every((prop) => FURNITURE_PROPERTIES.includes(prop))) continue;
            problems.push({ line, selector, properties });
        }
    }
    return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    let failed = 0;
    let checked = 0;

    for (const rel of AUTHORED) {
        const name = rel.replace('../', '');
        let source;
        try {
            source = readFileSync(new URL(rel, import.meta.url), 'utf8');
        } catch {
            console.error(`gate broke: ${name} is in the list and not on disk`);
            process.exit(1);
        }
        checked++;
        for (const p of leakedColours(source)) {
            failed++;
            console.error(
                `${name}:${p.line}: ${p.colour} is a colour written outside the token layer (DI9). ` +
                    'Use var(--token), or hsl(from var(--token) h s l / alpha) when it needs transparency.',
            );
        }
    }

    for (const rel of SCAFFOLDING) {
        const name = rel.replace('../', '');
        let source;
        try {
            source = readFileSync(new URL(rel, import.meta.url), 'utf8');
        } catch {
            console.error(`gate broke: ${name} is in the scaffolding list and not on disk`);
            process.exit(1);
        }
        for (const p of documentRules(source)) {
            failed++;
            console.error(
                `${name}:${p.line}: \`${p.selector}\` styles a bare element (${p.properties.join(', ')}), so it overrides the package ` +
                    'on the fixture pages the browser tests measure (KT3). Anchor it on a .sc- class, or add it to ' +
                    'SCAFFOLDING_MAY_STYLE with its reason.',
            );
        }
    }

    if (checked !== AUTHORED.length) {
        console.error(`gate broke: expected ${AUTHORED.length} stylesheets, read ${checked}`);
        process.exit(1);
    }
    if (failed > 0) {
        console.error(`\n${failed} rule(s) outside their layer.`);
        process.exit(1);
    }
    console.log(
        `Layers: ${checked} authored stylesheets carry no colour of their own ` +
            `(${Object.keys(NOT_THEME_COLOUR).length} non-theme colours listed with their reason); ` +
            `${SCAFFOLDING.length} scaffolding stylesheet styles no document element.`,
    );
}
