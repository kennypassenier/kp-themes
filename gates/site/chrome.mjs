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
            <main class="kp-sidebar__main kp-page" id="main">
${page.body}
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
