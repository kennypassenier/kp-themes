// research/kpadopt2: writes demo.html, the ONE page for round 2 of the dashboard adoption (Kenny's rule of 2026-10-04: one
// central page, every section judged in one review dialog). The sections come from parts/:
//   parts/tiles.mjs  action tiles, status rows, the facet list   (parts/looks.mjs holds their per-theme look-at lines)
//   parts/grids.html heat grid, matrix, bar in a table cell      (hand-written markup)
//   parts/time.mjs   week agenda, run timeline                   (five sections)
// Edit those, demo-*.css and demo-*.js, not demo.html.
//
//   node research/kpadopt2/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { sections as time } from './parts/time.mjs';

const grids = readFileSync(new URL('./parts/grids.html', import.meta.url), 'utf8');

// Round 2 (2026-10-16) shows only the sections Kenny has not approved (research/kpadopt2/VERDICTS.json; gates/check-rereview.mjs
// refuses a page that offers an approved pair): the matrix, the bar in a table cell, the week agenda and its states. The other
// seven sections stay in parts/ for the record and leave the page.
const OPEN = ['matrix', 'barcell', 'week', 'week-states'];
/** Keep only the open sections of a run of sections. @param {string} html */
const openOnly = (html) =>
    html.replace(/[ \t]*<section\b[\s\S]*?<\/section>\n?/g, (block) =>
        OPEN.includes(/\bdata-review-item="([^"]+)"/.exec(block)?.[1] ?? '') ? block : '',
    );

const html = `<!doctype html>
<!-- Written by research/kpadopt2/build.mjs; edit build.mjs, parts/, demo-*.css and demo-*.js, not this file. -->
<html lang="en" data-theme="formal" data-review="kpadopt2" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Round 2 of the dashboard adoption, the four still open · kp-themes research demo</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <script>
            (function () {
                var d = document.documentElement;
                var t = new URLSearchParams(location.search).get('theme');
                try {
                    // A theme in the link is kept, so the catalogue's own
                    // boot, which reads the stored theme, does not undo it.
                    if (t) localStorage.setItem('theme', t);
                    t = t || localStorage.getItem('theme');
                } catch (e) {}
                if (t) d.setAttribute('data-theme', t);
                var theme = d.getAttribute('data-theme') || 'formal';
                document.write('<link rel="stylesheet" href="../../css/' + theme + '-register.css" data-kp-register="' + theme + '">');
            })();
        </script>
        <link rel="stylesheet" href="../../catalogue/catalogue.css" />
        <link rel="stylesheet" href="demo.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main r2-page">
            <header class="r2-intro">
                <h1>Round 2 of the dashboard adoption: the four still open</h1>
                <p class="cat-intro">
                    Round 2. Kenny approved seven of the eleven sections in formal (the action tiles, the status rows, the facet list, the heat grid, the
                    crowded week and both run timeline sections), so only the four still open are on this page, each rebuilt from the package’s own
                    parts: the <b>matrix</b> (every name the same room from its mark and its edges; the state picked with the package’s segmented
                    control), the <b>bar in a table cell</b> (loading in the theme’s own loading picture, the table’s busy panel over the rows), the
                    <b>week agenda</b> (its steps one control in the theme’s segmented track, a new week waits and its items arrive the theme’s way)
                    and the <b>week agenda’s states</b> (the loading agenda loads, then its items arrive). Everything with a <code>kp-</code> class and
                    every script under <code>js/</code> is the package; the sample data and the buttons that drive a demo are this page’s. Every
                    section says what you should see under <b>Expected</b>. Formal only, judged in the review dialog (“Review in a dialog” at the top).
                </p>
            </header>
${openOnly(grids)}
${openOnly(time)}
        </main>
        <script type="module" src="demo-grids.js"></script>
        <script type="module" src="demo-time.js"></script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="application/json" data-review-round>
            { "round": "2026-10-16-r2", "received": ["2026-10-16-r1"], "reopen": ["formal|matrix", "formal|barcell", "formal|week", "formal|week-states"] }
        </script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

writeFileSync(new URL('demo.html', import.meta.url), html);
console.log('demo.html', html.length, 'bytes');
