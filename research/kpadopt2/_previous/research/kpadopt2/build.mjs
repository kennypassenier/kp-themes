// research/kpadopt2: writes demo.html, the ONE page for round 2 of the dashboard adoption (Kenny's rule of 2026-10-04: one
// central page, every section judged in one review dialog). The sections come from parts/:
//   parts/tiles.mjs  action tiles, status rows, the facet list   (parts/looks.mjs holds their per-theme look-at lines)
//   parts/grids.html heat grid, matrix, bar in a table cell      (hand-written markup)
//   parts/time.mjs   week agenda, run timeline                   (five sections)
// Edit those, demo-*.css and demo-*.js, not demo.html.
//
//   node research/kpadopt2/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { sections as tiles } from './parts/tiles.mjs';
import { sections as time } from './parts/time.mjs';

const grids = readFileSync(new URL('./parts/grids.html', import.meta.url), 'utf8');

const html = `<!doctype html>
<!-- Written by research/kpadopt2/build.mjs; edit build.mjs, parts/, demo-*.css and demo-*.js, not this file. -->
<html lang="en" data-theme="formal" data-review="kpadopt2" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Round 2 of the dashboard adoption · kp-themes research demo</title>
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
                <h1>Round 2 of the dashboard adoption: eight components</h1>
                <p class="cat-intro">
                    Eight things the admin dashboard still draws itself, now built in the package (Kenny’s rule: a consumer draws nothing). One page,
                    eleven sections, judged one after the other in the review dialog (“Review in a dialog” at the top), formal only until it is
                    approved: <b>action tiles</b>, <b>status rows</b> and the <b>facet list</b> (<code>nx-action</code>, <code>perstack-chip</code>,
                    <code>hl-opt</code>); the <b>heat grid</b>, the <b>matrix</b> and the <b>bar in a table cell</b> with the table’s
                    <code>data-kp-sort-value</code> (<code>bk-heat</code>, <code>fw-mx</code>, <code>mp-caps</code>, <code>mp-growth</code>); the
                    <b>week agenda</b> and the <b>run timeline</b> (<code>sch-week</code>, <code>ac-tl</code>). Everything with a <code>kp-</code> class
                    and every script under <code>js/</code> is the package; the sample data, the buttons that drive a demo and the rows that stand in for
                    hover, focus and press are this page’s. Every section says what you should see under <b>Expected</b>.
                </p>
                <p class="ta-note" data-ta-mirror-note hidden>
                    <b>Hover, focus and press rows are drawn by copying the package’s own rules</b> (the page reads the stylesheets and re-writes
                    <code>:hover</code> as a class), so they show the theme’s real look. That needs the page to be served over http (as the catalogue
                    does); opened as a file, those rows show only the plain tile.
                </p>
                <p class="ta-note" data-ta-motion hidden><b>Your system asks for reduced motion</b>, so hover and press change the look but nothing moves or fades.</p>
            </header>
${tiles}
${grids}
${time}
        </main>
        <script type="module" src="demo-grids.js"></script>
        <script type="module" src="demo-time.js"></script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="demo-tiles.js"></script>
        <script type="application/json" data-review-round>
            { "round": "2026-10-16-r1", "reopen": [] }
        </script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

writeFileSync(new URL('demo.html', import.meta.url), html);
console.log('demo.html', html.length, 'bytes');
