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

// Round 3 (2026-10-16) shows only the section Kenny has not approved (research/kpadopt2/VERDICTS.json; gates/check-rereview.mjs
// refuses a page that offers an approved pair): the week agenda's states. The other ten sections stay in parts/ for the record
// and leave the page.
const OPEN = ['week-states'];
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
        <title>Round 2 of the dashboard adoption, the one still open · kp-themes research demo</title>
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
                <h1>Round 2 of the dashboard adoption: the one still open</h1>
                <p class="cat-intro">
                    Review round 3. Kenny approved ten of the eleven sections in formal, so only the <b>week agenda’s states</b> is on this page. While
                    it loads, the week is now formal’s own loading picture, the ledger being ruled: every day holds unwritten entries of a pill’s
                    shape and size, and a navy rule is ruled along them one after the other across the week. A week that loads again takes all of
                    its items out first, so no old item stays under or beside the new ones and no words are drawn twice. Everything with a
                    <code>kp-</code> class and every script under <code>js/</code> is the package; the sample data and the button that drives the
                    demo are this page’s. The section says what you should see under <b>Expected</b>. Formal only, judged in the review dialog
                    (“Review in a dialog” at the top).
                </p>
            </header>
${openOnly(grids)}
${openOnly(time)}
        </main>
${openOnly(grids).trim() ? '        <script type="module" src="demo-grids.js"></script>\n' : ''}        <script type="module" src="demo-time.js"></script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="application/json" data-review-round>
            { "round": "2026-10-16-r3", "received": ["2026-10-16-r1", "2026-10-16-r2"], "reopen": ["formal|week-states"] }
        </script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

writeFileSync(new URL('demo.html', import.meta.url), html);
console.log('demo.html', html.length, 'bytes');
