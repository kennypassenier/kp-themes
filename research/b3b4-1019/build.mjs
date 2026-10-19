// Builds research/b3b4-1019/demo.html: the datatable faults B3 (kp-gaps homelab 33 and 34, kyu 28, almanac 8) and the disabled-reason
// wrapper fault B4 (almanac 13, kyu 16). They change components Kenny had approved, so each comes back through the review dialog with a
// plain "What changed" text. Formal only: none of the faults differs per theme. The page is bundled into round-2-1019 afterwards
// (VERDICTS.json "bundledInto"), so there is no catalogue/pages.js entry.
//
//   1. table-removed-rows   a removed row stayed in the count and the pager     (js/datatable.js)
//   2. table-held-row       refresh() un-hid a row the page held for an Undo   (js/datatable.js)
//   3. table-date-pills     date pills printed ISO; page() zero-based, undocumented (js/datatable.js)
//   4. table-expand-single  data-kp-expand-single read once; toggle column      (js/datatable.js)
//   5. reason-columns       a disabled button split its actions column         (js/reason.js, css/components.css)
//
// Run: node research/b3b4-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'b3b4-1019';
const PAGE_THEMES = ['formal'];

/** One look-at line per theme asked. @param {string[]} themes @param {string} text */
const looks = (themes, text) => themes.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, body: string, components: string, themes?: string[], topic?: string, topicTitle?: string }} s
 */
const section = (s) => {
    const themes = s.themes ?? ['formal'];
    const topic = s.topic ? ` data-review-topic="${s.topic}"${s.topicTitle ? ` data-review-topic-title="${s.topicTitle}"` : ''}` : '';
    return `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="${themes.join(',')}"${topic}
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What changed since you approved it:</b> ${s.changed}</p></div>
    <div class="kc-sec__head">
        <h2 id="h-${s.id}">${s.title}</h2>
        <p>${s.intro}</p>
    </div>
    <div class="kc-expected">
        <p><b>Expected:</b></p>
        <ul>
${s.expect.map((e) => `            <li>${e}</li>`).join('\n')}
        </ul>
    </div>
    <div data-review-look>
${looks(themes, s.look)}
    </div>
${s.body}
</section>`;
};

const JOBS = [
    ['media', 'Nightly', '2026-10-01', 'ok'],
    ['photos', 'Nightly', '2026-10-02', 'ok'],
    ['docs', 'Weekly', '2026-10-03', 'ok'],
    ['mail', 'Nightly', '2026-10-04', 'failed'],
    ['vault', 'Hourly', '2026-10-05', 'ok'],
    ['git', 'Nightly', '2026-10-06', 'ok'],
    ['wiki', 'Weekly', '2026-10-07', 'ok'],
    ['home', 'Hourly', '2026-10-08', 'ok'],
    ['music', 'Weekly', '2026-10-09', 'failed'],
    ['books', 'Weekly', '2026-10-10', 'ok'],
    ['news', 'Nightly', '2026-10-11', 'ok'],
    ['feeds', 'Hourly', '2026-10-12', 'ok'],
    ['notes', 'Nightly', '2026-10-13', 'ok'],
    ['tasks', 'Nightly', '2026-10-14', 'ok'],
    ['maps', 'Weekly', '2026-10-15', 'ok'],
    ['radio', 'Weekly', '2026-10-16', 'failed'],
    ['print', 'Weekly', '2026-10-17', 'ok'],
    ['cloud', 'Nightly', '2026-10-18', 'ok'],
    ['sync', 'Hourly', '2026-10-19', 'ok'],
    ['lab', 'Nightly', '2026-10-20', 'ok'],
    ['scans', 'Weekly', '2026-10-21', 'ok'],
    ['tax', 'Weekly', '2026-10-22', 'ok'],
    ['proxy', 'Hourly', '2026-10-23', 'ok'],
    ['dns', 'Hourly', '2026-10-24', 'ok'],
    ['dev', 'Nightly', '2026-10-25', 'ok'],
    ['arch', 'Weekly', '2026-10-26', 'ok'],
    ['pi', 'Nightly', '2026-10-27', 'ok'],
];

/** @param {string} s */
const cap = (s) => s[0].toUpperCase() + s.slice(1);

/**
 * A table of backup jobs.
 * @param {{ id: string, rows?: number, attrs?: string, actions?: 'remove' | 'hold' | 'none', detail?: boolean, caption: string }} o
 */
const jobsTable = (o) => {
    const rows = JOBS.slice(0, o.rows ?? JOBS.length);
    const act = o.actions ?? 'none';
    const head = `<tr>
<th scope="col" data-kp-sort="text" data-kp-column-locked>Job</th>
<th scope="col" data-kp-sort="text" data-kp-filter="choice">Schedule</th>
<th scope="col" data-kp-sort="date" data-kp-filter="date">Last run</th>
<th scope="col" data-kp-sort="text" data-kp-filter="choice">Result</th>${act === 'none' ? '' : '\n<th scope="col">Actions</th>'}
</tr>`;
    const body = rows
        .map(
            ([name, every, day, result]) => `<tr data-kp-row-key="${name}">
<td>${cap(name)}</td><td>${every}</td><td>${day}</td><td>${cap(result)}</td>${
                act === 'none'
                    ? ''
                    : `\n<td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm kp-button--danger" data-bb-${act}="${name}">${act === 'remove' ? 'Remove' : 'Delete'}</button></div></td>`
            }
</tr>${
                o.detail
                    ? `\n<tr data-kp-row-detail><td colspan="4"><p class="bb-detail">${cap(name)} runs ${every.toLowerCase()}; the last run was on ${day} and its result was ${result}.</p></td></tr>`
                    : ''
            }`,
        )
        .join('\n');
    return `<div class="kp-datatable" data-kp-datatable id="${o.id}" ${o.attrs ?? ''}>
<div class="kp-datatable__bar"><input class="kp-datatable__search" data-kp-datatable-search type="search" aria-label="Search the jobs" placeholder="Search the jobs" /></div>
<div class="kp-table-wrap"><table class="kp-table"><caption class="kp-sr-only">${o.caption}</caption>
<thead>${head}</thead>
<tbody>
${body}
</tbody></table></div>
<div class="kp-empty" data-kp-datatable-empty hidden>No job matches.</div>
<div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p><div class="kp-datatable__pager" data-kp-datatable-pager></div></div>
</div>`;
};

const sections = [
    section({
        id: 'table-removed-rows',
        title: 'Table: a removed row leaves the count',
        intro: 'Twenty-seven backup jobs, ten to a page. The page removes a job with its own code (it takes the row out of the table) and does nothing else.',
        topic: 'datatable',
        topicTitle: 'Data table',
        changed:
            'When a page took a row out of the table, the table went on counting it: after 14 shown rows became 13 the line still said <b>of 27</b>, and the pager kept the pages the row had filled, until the page called <code>refresh()</code>. Now the table notices rows that come and go in its body by itself: the count, the &ldquo;filtered from&rdquo; total and the pages follow at once, and the reader stays on the page they were on instead of being sent back to page 1. Sorting, searching, the pager and the look are as you approved them.',
        expect: [
            'Press <b>Remove</b> on a job: the row goes and the line under the table counts one fewer, both in <b>Showing 1&ndash;10 of 26</b> and after a search (<b>of 3 (filtered from 26)</b>).',
            'Go to page 2 and remove a job there: you stay on page 2. Remove jobs until the last page is empty: the pager moves back one page.',
        ],
        look: 'the line under the table and the pager always agree with the rows on screen.',
        components: 'datatable',
        body: `<div class="bb-stack">${jobsTable({ id: 'bb-removed', attrs: 'data-kp-page-size="10" data-kp-page-sizes="none"', actions: 'remove', caption: 'Backup jobs; remove one with its button' })}</div>`,
    }),
    section({
        id: 'table-held-row',
        title: 'Table: a deleted row waits for Undo',
        intro: 'Delete hides the job and offers Undo for a few seconds before it is gone for good. The row is held, not taken out of the page.',
        topic: 'datatable',
        changed:
            'A page that wants an Undo window had to take the row out of the table and put it back, because every redraw and every <code>refresh()</code> set <code>hidden</code> on every row again and could not keep one hidden. Now a row marked <code>data-kp-row-hidden</code> is held out of the table: it is not counted, not paged, not searched and never shown by the table, whatever the table redraws; taking the attribute off gives it back, in its place. The rows the page does not hold behave as you approved.',
        expect: [
            'Press <b>Delete</b>: the job disappears, the count drops by one, and a line offers <b>Undo</b>. Search and sort while it waits: the job stays hidden.',
            'Press <b>Undo</b>: the job is back in its place and the count is as before. Let the time run out and the job is gone.',
        ],
        look: 'a held job is nowhere: not in the rows, not in the count, not in a search.',
        components: 'datatable',
        body: `<div class="bb-stack">${jobsTable({ id: 'bb-held', attrs: 'data-kp-page-size="8" data-kp-page-sizes="none"', rows: 12, actions: 'hold', caption: 'Backup jobs; delete one and undo it' })}
<p class="bb-line" id="bb-held-line" role="status" aria-live="polite">Nothing deleted yet.</p></div>`,
    }),
    section({
        id: 'table-date-pills',
        title: 'Table: dates in a filter pill, and the page number',
        intro: 'A date filter on the Last run column, set to 5 to 12 October, and two buttons that go to a page by number.',
        topic: 'datatable',
        changed:
            'The pill of a date filter printed the stored form of its bounds (<b>Last run: 2026-10-05 to 2026-10-12</b>), and the refusal of a backwards range did the same, while the field it came from showed the date the way the page writes it. Now a pill and a refusal write a date in the locale of the table, the way the date field does (<b>05/10/2026</b>). The handle&rsquo;s <code>page()</code> counts from 0, the pager prints from 1; that is now written down, and <code>view().pageNumber</code> gives the number the pager prints. Nothing else about the filters changed.',
        expect: [
            'The pill reads <b>Last run: 05/10/2026 to 12/10/2026</b>, not the ISO form; pressing its words opens the editor with the same dates.',
            'The two buttons go to page 1 and page 2 (<code>page(0)</code> and <code>page(1)</code>); the line says both numbers: the handle&rsquo;s and the pager&rsquo;s.',
        ],
        look: 'the pill writes the dates the way the date fields of the editor do.',
        components: 'datatable',
        body: `<div class="bb-stack">${jobsTable({ id: 'bb-dates', attrs: 'data-kp-filter-mode="add" data-kp-page-size="5" data-kp-page-sizes="none" data-kp-locale="en-GB"', rows: 20, caption: 'Backup jobs with a date filter' })}
<div class="bb-row"><button type="button" class="kp-button kp-button--sm" data-bb-page="0">page(0)</button><button type="button" class="kp-button kp-button--sm" data-bb-page="1">page(1)</button><p class="bb-line" id="bb-page-line" role="status" aria-live="polite"></p></div></div>`,
    }),
    section({
        id: 'table-expand-single',
        title: 'Table: one row open at a time, switchable',
        intro: 'An expandable table of jobs; a checkbox turns the rule on and off while the table is on screen.',
        topic: 'datatable',
        changed:
            'The rule <code>data-kp-expand-single</code> was read once, when the table was attached, so changing the attribute later did nothing. Now the table follows it: switching it on closes all but the last row that was open, switching it off lets several stay open. It is also written down that the toggle button is a column of its own, the first, so the column numbers the handle takes and gives count it (the first data column of an expandable table is 1). The rows, their details and the keys are as you approved them.',
        expect: [
            'Open two jobs with the rule off: both stay open. Tick <b>One row at a time</b>: only the last one you opened stays open; opening another closes it.',
            'Untick it: opening a job no longer closes the others.',
        ],
        look: 'the toggle column and the details line up with the headers, open or closed.',
        components: 'datatable',
        body: `<div class="bb-stack"><label class="kp-field__option bb-check"><input type="checkbox" class="kp-field__check" data-bb-single /> <span>One row at a time</span></label>
${jobsTable({ id: 'bb-expand', attrs: 'data-kp-expandable data-kp-page-size="8" data-kp-page-sizes="none"', rows: 8, detail: true, caption: 'Backup jobs; open a row for its details' })}</div>`,
    }),
    section({
        id: 'reason-columns',
        title: 'Buttons that say why they are off, in a column of actions',
        intro: 'The same Edit and Delete buttons on every row of a table and of a list; Delete is off on some rows and says why when you hover or focus it.',
        topic: 'actions',
        topicTitle: 'Row actions',
        changed:
            'A disabled button that carries its reason is wrapped in a span so that its tooltip can show. The span lost the button&rsquo;s column role (<code>data-kp-action</code>), so on a row with an off Delete the column was a different one from the Delete of its neighbours and the Delete column split in two, with the off buttons at another width and edge. Now the wrapper wears the role and the button fills it: an off Delete has the same column, the same width and the same edge as an enabled one, and turning a button off or on moves nothing. The reasons, the tooltips and the buttons are as you approved them.',
        expect: [
            'In the table and in the list, every <b>Delete</b> starts at one edge and has one width, off or on; <b>Edit</b> likewise.',
            'Hover or focus an off Delete: its reason shows. Press <b>Turn off Family&rsquo;s Delete</b>: that button goes off and shows its reason, and no column moves; press it again and it comes back.',
        ],
        look: 'one Edit column and one Delete column, every button in a column on one edge and one width.',
        components: 'disabled-reason actions',
        body: `<div class="bb-stack">
<div class="kp-table-wrap"><table class="kp-table" id="bb-reason-table"><caption class="kp-sr-only">Calendars with edit and delete buttons</caption>
<thead><tr><th scope="col">Calendar</th><th scope="col">Events</th><th scope="col">Actions</th></tr></thead>
<tbody>
<tr><td>Family</td><td>214</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--danger" data-kp-action="delete" data-kp-disabled-reason="A sync is running on this calendar; wait for it to finish">Delete</button></div></td></tr>
<tr><td>Work, shared with the whole team</td><td>1021</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--danger" disabled data-kp-action="delete" data-kp-disabled-reason="This is the default calendar; make another one the default first">Delete</button></div></td></tr>
<tr><td>Birthdays</td><td>38</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--danger" data-kp-action="delete">Delete</button></div></td></tr>
<tr><td>Holidays</td><td>96</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--danger" disabled data-kp-action="delete" data-kp-disabled-reason="A subscribed calendar can only be unsubscribed">Delete</button></div></td></tr>
</tbody></table></div>
<ul class="kp-action-list" id="bb-reason-list" aria-label="Calendars as a list">
<li><div>Family</div><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--danger" data-kp-action="delete" data-kp-disabled-reason="A sync is running on this calendar; wait for it to finish">Delete</button></div></li>
<li><div>Work, shared with the whole team</div><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--danger" disabled data-kp-action="delete" data-kp-disabled-reason="This is the default calendar; make another one the default first">Delete</button></div></li>
<li><div>Birthdays</div><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--danger" data-kp-action="delete">Delete</button></div></li>
</ul>
<p><button type="button" class="kp-button" data-bb-flip>Turn off Family&rsquo;s Delete</button></p></div>`,
    }),
];

const body = sections.join('\n');
const pairs = sections.reduce((n, s) => n + (/data-review-themes="([^"]+)"/.exec(s)?.[1].split(',').length ?? 1), 0);

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, bundledInto: 'round-2-1019', rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^b3b4-[0-9a-f]{8}-/.test(current) ? current : `b3b4-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Data table and disabled-reason fixes: removed rows, held rows, date pills, one row open, action columns</title>
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
        <link rel="stylesheet" href="../kpadopt56/part.css" />
        <link rel="stylesheet" href="../kpadopt56/src/kpadopt6-calm/page.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>Data table and disabled-reason fixes</h1>
                <p class="cat-intro">
                    The project threads (homelab, kyu, almanac) found five faults in components you had approved: a data table that went on counting a
                    row the page had taken out, one that un-hid a row the page held for an Undo, date pills that printed the stored form of a date, a
                    one-row-open rule read only once, and a disabled button that split its column of actions. ${pairs} pairs in all, every one in
                    formal (none differs per theme). Each section says under <b>What changed since you approved it</b> what was wrong and what is
                    different now.
                </p>
            </header>
${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
console.log(`${ID}: ${sections.length} sections, ${pairs} pairs, round ${roundId}`);
