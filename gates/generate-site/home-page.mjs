// The site's index page: theme stories, swatches and portrait links.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderMarkdown } from '../site/markdown.mjs';
import { section, shell } from '../site/chrome.mjs';
import { highlight } from '../site/highlight.mjs';
import { ORDER, REVIEW_SITE, ROOT, SWATCH_TOKENS } from './config.mjs';
/** @typedef {import('./types.mjs').Nav} Nav */

/** The `## The idea` section of a theme's anatomy, rendered. */
/** @param {string} theme */
function story(theme) {
    const file = `themes/${theme}/anatomy.md`;
    const source = readFileSync(join(ROOT, file), 'utf8');
    // The story is the theme's own reason for existing, which is what
    // `## The idea` and `## What is load-bearing` say. Rendering the
    // whole document would put the invariant answers and the L3 notes on
    // a page meant to introduce a theme -- and would make the page a copy
    // of the file rather than a reading of it [TH102].
    const wanted = ['The idea', 'What is load-bearing'];
    const blocks = [];
    for (const heading of wanted) {
        const start = source.indexOf(`\n## ${heading}\n`);
        if (start === -1) throw new Error(`${file} has no "## ${heading}" section`);
        const after = source.indexOf('\n## ', start + 1);
        blocks.push(source.slice(start + heading.length + 5, after === -1 ? undefined : after).trim());
    }
    return renderMarkdown(blocks.join('\n\n'), { file }).html;
}

/**
 * The swatch strip beside a story: the theme's live tokens, not an image.
 *
 * The `data-theme` sits on the whole card, not on this list, so the card
 * itself is painted by the theme it describes -- and so the labels keep
 * the contrast the gates guarantee. With the attribute on the list only,
 * a dark theme's muted-foreground landed on a light card.
 */
function swatches() {
    const tokens = SWATCH_TOKENS;
    return `                        <ul class="sc-swatches kp-row kp-gap-xs kp-mb-md">
${tokens
    .map(
        (t) =>
            `                            <li class="sc-swatch" data-sc-token="${t}"><span class="sc-swatch__chip" data-sc-swatch="${t}"></span><span class="sc-swatch__name">${t}</span></li>`,
    )
    .join('\n')}
                        </ul>`;
}

/**
 * The link to a theme's portrait, for a theme with a signature [scope-97]. The
 * portraits live on the review site (research/, published under /review/ by
 * .github/workflows/pages.yml), not on this one, so the link is absolute.
 * @param {string} theme
 */
function portraitLink(theme) {
    if (!existsSync(join(ROOT, `themes/${theme}/signature.json`))) return '';
    return `                        <p class="kp-mt-md"><a href="${REVIEW_SITE}research/theme-portraits/${theme}.html">See the ${theme} portrait: its colours in their roles, type, shape, motion and the recipe for a new component</a></p>\n`;
}

/** @param {Nav} nav */
export function indexPage(nav) {
    const stories = ORDER.map(
        (theme) => `                    <article class="kp-card sc-story" data-sc-story="${theme}" data-theme="${theme}">
                        <h3 class="kp-fw-semibold kp-mb-sm">${theme}</h3>
${swatches()}
                        <div class="kp-prose">
${story(theme)}
                        </div>
${portraitLink(theme)}                    </article>`,
    ).join('\n');

    const body = [
        `                <header class="kp-section">
                    <h1 class="kp-fw-bold">kp-themes</h1>
                    <p class="kp-prose">One design system, ${ORDER.length} themes, two delivery channels and no runtime dependencies. Every page on this site is generated from the package's own sources, so nothing here can drift from what ships.</p>
                </header>`,
        section(
            'install',
            'Install',
            `                    <pre class="kp-code-block"><code>${highlight('npm install @kp-soft/themes', 'js')}</code></pre>
                    <pre class="kp-code-block"><code>${highlight('<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/themes.css" />\n<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/components.css" />\n<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/layout.css" />\n<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/utilities.css" />', 'html')}</code></pre>`,
        ),
        section(
            'themes',
            `The ${ORDER.length} themes`,
            `                    <p class="kp-prose">Each theme answers the same questions differently. What follows is why each one exists, taken from its own anatomy document, with its live tokens beside it.</p>
                    <div class="kp-autogrid kp-gap-lg">
${stories}
                    </div>`,
        ),
    ].join('\n');

    return shell({
        title: 'Start',
        description: `The kp-themes design system: ${ORDER.length} themes, two delivery channels, no runtime dependencies.`,
        depth: 1,
        nav,
        current: 'site/index.html',
        body,
    });
}
