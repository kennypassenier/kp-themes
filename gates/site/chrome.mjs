// The site's own furniture [AR23].
//
// Every class here carries the `sc-` prefix, the same one the showcase
// uses, so the site can restyle itself without touching the `kp-` names
// the package promises its consumers. Nothing in this file styles a bare
// element: the pages are built out of the package's own layout layer and
// utility API, which is the point -- a documentation site that needed a
// stylesheet of its own to look right would be evidence against the
// thing it documents.

/** @typedef {{ href: string, label: string }} Link */

/**
 * One page of the site.
 *
 * The measure lives on a wrapper INSIDE the main column, never on the
 * column itself. Sharing one element makes .kp-page's cap fight
 * .kp-sidebar__main's growth: the main column stops at its measure, the
 * free space has nowhere else to go, and the aside — which grows too —
 * swallows it. Measured at a 1585px viewport: the navigation was 481px
 * wide instead of its 16rem, and the reading column started 272px past
 * the end of the links.
 *
 * @param {{ title: string, description: string, depth: number, nav: {group: string, links: Link[]}[], current: string, body: string }} page
 * @returns {string}
 */
export function shell(page) {
    const up = '../'.repeat(page.depth);
    const nav = page.nav
        .map(
            (section) => `                    <div class="sc-nav__group">
                        <h2 class="sc-nav__title kp-tt-upper kp-fw-semibold">${section.group}</h2>
                        <ul class="sc-nav__list">
${section.links
    .map(
        (link) =>
            `                            <li><a class="sc-nav__link" href="${up}${link.href}"${
                link.href === page.current ? ' aria-current="page"' : ''
            }>${link.label}</a></li>`,
    )
    .join('\n')}
                        </ul>
                    </div>`,
        )
        .join('\n');

    return `<!doctype html>
<html lang="en" data-theme="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${page.title} — kp-themes</title>
        <meta name="description" content="${page.description}" />
        <link rel="stylesheet" href="${up}css/themes.css" />
        <link rel="stylesheet" href="${up}css/components.css" />
        <link rel="stylesheet" href="${up}css/layout.css" />
        <link rel="stylesheet" href="${up}css/utilities.css" />
        <!-- Every register, from 2026-09-07. They are opt-in for a consumer,
             and leaving them off here was an omission rather than a
             decision: a component page where you pick cyberpunk and see a
             button that does not look like cyberpunk shows something that
             is not that theme, which is what KT8 is about. The showcase
             loaded them all along; these pages did not. -->
        <link rel="stylesheet" href="${up}css/cyberpunk-register.css" />
        <link rel="stylesheet" href="${up}css/retro-register.css" />
        <link rel="stylesheet" href="${up}css/synthwave-register.css" />
        <link rel="stylesheet" href="${up}css/phantom-register.css" />
        <link rel="stylesheet" href="${up}css/terminal-register.css" />
        <link rel="stylesheet" href="${up}css/brutalism-register.css" />
        <link rel="stylesheet" href="${up}css/light-register.css" />
        <link rel="stylesheet" href="${up}css/grotesk-register.css" />
        <link rel="stylesheet" href="${up}css/blueprint-register.css" />
        <link rel="stylesheet" href="${up}css/nostromo-register.css" />
        <link rel="stylesheet" href="${up}css/dark-register.css" />
        <link rel="stylesheet" href="${up}css/academia-register.css" />
        <link rel="stylesheet" href="${up}css/formal-register.css" />
        <link rel="stylesheet" href="${up}css/sepia-register.css" />
        <link rel="stylesheet" href="${up}css/solstice-register.css" />
        <link rel="stylesheet" href="${up}css/mono-register.css" />
        <link rel="stylesheet" href="${up}css/high-contrast-register.css" />
        <link rel="stylesheet" href="${up}css/tazhib-register.css" />
        <link rel="stylesheet" href="${up}css/shade-dark-register.css" />
        <link rel="stylesheet" href="${up}site/site.css" />
    </head>
    <body>
        <a class="sc-skip" href="#main">Skip to content</a>
        <div class="kp-sidebar">
            <nav class="kp-sidebar__aside sc-nav" aria-label="Documentation">
                <a class="sc-brand kp-fw-bold" href="${up}site/index.html">kp-themes</a>
                <div class="sc-nav__sections kp-stack">
${nav}
                </div>
            </nav>
            <main class="kp-sidebar__main" id="main">
                <div class="kp-page sc-measure">
${page.body}
                </div>
            </main>
        </div>
        <script type="module" src="${up}js/auto.js"></script>
    </body>
</html>
`;
}

/**
 * A section heading with a stable anchor, so a page can be linked into.
 * @param {string} id
 * @param {string} title
 * @param {string} body
 */
export function section(id, title, body) {
    return `                <section class="kp-section" data-sc-section="${id}" id="${id}">
                    <h2 class="kp-fw-semibold">${title}</h2>
${body}
                </section>`;
}

/**
 * Text that came from a source file, escaped for HTML.
 * @param {unknown} text
 */
export function escape(text) {
    return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

/** Elements HTML closes for you, so a line opening one changes no depth. */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/**
 * Re-indent a descriptor's markup so the snippet reads as a tree.
 *
 * The descriptors write markup flat, one tag per line at column zero,
 * because that is pleasant to write inside a template literal and
 * unpleasant to read on a page: a field's label and input sat level with
 * the div that holds them. This walks the lines and indents by depth.
 *
 * The SAME string is rendered live and printed as the snippet (AR19), so
 * this runs once and both use its result. Whitespace between block
 * elements does not change what the browser draws.
 *
 * @param {string} markup
 * @returns {string}
 */
export function indent(markup) {
    let depth = 0;
    return markup
        .trim()
        .split('\n')
        .map((raw) => {
            const line = raw.trim();
            if (line === '') return '';
            // A line that closes before it opens dedents itself first:
            // `</div>` and `</li><li>` alike.
            if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
            const out = '    '.repeat(depth) + line;
            // Count what this line leaves open. A tag that opens and
            // closes on the same line is a wash, and so is a void element.
            for (const tag of line.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g)) {
                const [, closing, name, selfClosing] = tag;
                if (selfClosing || VOID.has(name.toLowerCase())) continue;
                if (closing) {
                    // The dedent for a line that STARTS with a close was
                    // already taken above; only later closes count here.
                    if (line.indexOf(tag[0]) > 0) depth = Math.max(0, depth - 1);
                } else depth += 1;
            }
            return out;
        })
        .join('\n');
}
