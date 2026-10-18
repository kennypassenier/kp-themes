// Builds research/almanac-calendars/demo.html. Run: node research/almanac-calendars/build.mjs
// The page is generated so the table rows, the templates and the sample data come from data.js, the file demo.js also reads.
import { writeFileSync } from 'node:fs';
import { CALENDARS, SOURCES, SAMPLE, calendarRow, servedRow, losesTemplates, newDialogInner, kpiStrip, toastTemplates, esc } from './data.js';

const here = new URL('.', import.meta.url).pathname;

/** One control group: a label for a screen reader and buttons, the first pressed unless another says so. */
function group(section, name, label, options, { latent = false } = {}) {
    return `<div role="group" aria-label="${esc(label)}"${latent ? ' data-review-latent' : ''}>${options
        .map(
            ([value, text, pressed], i) =>
                `<button type="button" class="kp-button" aria-pressed="${pressed ?? i === 0}" data-ac-ctl="${section}:${name}" data-ac-v="${value}">${esc(text)}</button>`,
        )
        .join('')}</div>`;
}

/** @param {{id:string, topic:string, topicTitle?:string, title:string, components:string, intro:string, expected:string[], look:string, choices?:string, groups:string[], body:string}} s */
function section(s) {
    return `
            <section
                class="ac-sec"
                id="${s.id}"
                data-review-item="${s.id}"
                data-review-topic="${s.topic}"${s.topicTitle ? `\n                data-review-topic-title="${esc(s.topicTitle)}"` : ''}
                data-review-title="${esc(s.title)}"
                data-review-components="${s.components}"${s.choices ? `\n                data-review-choices='${s.choices}'` : ''}
                aria-labelledby="h-${s.id}"
            >
                <div class="ac-sec__head">
                    <h2 id="h-${s.id}">${s.title}</h2>
                    <p>${s.intro}</p>
                </div>
                <div class="ac-expected">
                    <p><b>Expected:</b></p>
                    <ul>
${s.expected.map((e) => `                        <li>${e}</li>`).join('\n')}
                    </ul>
                </div>
                <div data-review-look>
                    <p data-for="formal">${s.look}</p>
                </div>
                <div data-review-controls data-review-controls-for="${s.id}-component">
${s.groups.map((g) => '                    ' + g).join('\n')}
                </div>
${s.body}
            </section>`;
}

const sample = `<p class="ac-sample kp-text-muted">${esc(SAMPLE)}</p>`;

// 1 · Page header and KPI strip ---------------------------------------------------------------------------------------
const pageTop = section({
    id: 'page-top',
    topic: 'page',
    topicTitle: 'Top of the Calendars page',
    title: 'Calendars page: header and counts',
    components: 'page-header kpi menu-button',
    intro: 'The page says what it is in one sentence, offers one main action (New calendar) and keeps the rare one (Reload profiles from disk) in an overflow menu; three counts under it each lead to the rows they count.',
    expected: [
        '<b>Header:</b> the title <b>Calendars</b>, one sentence of what the page is for, the primary <b>New calendar</b> and a <b>More</b> menu holding <b>Reload profiles from disk</b> (with a line saying what it does). Nothing else competes with the primary button.',
        '<b>Counts:</b> <b>Calendars 3</b>, <b>Sources 4</b>, <b>Profile files not served 1</b>, exact numbers, tiles of one height. Each count is a toggle that filters the rows it counts (press it: it reads <b>Filtering ×</b> and the line under the strip says which rows are shown; press again to clear); the not-served tile is the only warning tone. The fourth tile is a trend: events delivered per hour over 24 hours as a sample sparkline (sample data); point at it to read one hour. Press <b>Nothing yet</b> and all three read 0 with no warning.',
        '<b>States:</b> <b>Loading</b> keeps the three tiles with a waiting value; <b>Failed</b> is one plate over the strip&rsquo;s whole footprint with a normal Retry (it reloads). <b>Menu: Open</b> shows the menu open at its button.',
        '<b>Phone (390):</b> the actions move under the sentence, the tiles stack, nothing scrolls sideways and no label is cut.',
    ],
    look: 'One header row, the primary button in formal&rsquo;s navy, the menu on an opaque plate at its button, three equal tiles with the number large and the words wrapping instead of cutting.',
    groups: [
        group('page-top', 'state', 'State of the counts', [['ready', 'Loaded'], ['loading', 'Loading'], ['empty', 'Nothing yet'], ['failed', 'Failed']]),
        group('page-top', 'menu', 'Overflow menu', [['closed', 'Menu closed'], ['open', 'Menu open']]),
        group('page-top', 'width', 'Width', [['full', 'Full width (1280)'], ['phone', 'Phone (390)']]),
    ],
    body: `                <div id="page-top-component" class="ac-stage" data-ac-width="full" data-ac-state="ready">
                    <header class="kp-page-header">
                        <div class="kp-page-header__inner">
                            <div>
                                <h1 class="kp-page-header__title">Calendars</h1>
                                <p class="kp-page-header__description">
                                    The Google calendars Almanac writes into, which source writes to which, and the profile files that make that so.
                                </p>
                            </div>
                            <div class="kp-page-header__actions">
                                <button type="button" class="kp-button kp-button--primary" data-ac-open-dialog>New calendar</button>
                                <div class="kp-menu-button" data-kp-menu-button data-kp-key="ac-page-more">
                                    <button type="button" class="kp-button">More ▾</button>
                                    <div class="kp-menu kp-menu--rich" role="menu" aria-label="Other actions on this page" hidden>
                                        <button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-labelledby="ac-mi-l1" aria-describedby="ac-mi-h1" data-kp-value="reload"><span class="kp-menu__label" id="ac-mi-l1">Reload profiles from disk</span><span class="kp-menu__hint" id="ac-mi-h1">Read every profile file again, without restarting the service</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div class="kp-kpis" role="group" aria-label="Calendars at a glance" data-kp-kpis-columns="all 2 1" data-ac-kpis>${kpiStrip('ready')}</div>
                    <p class="ac-filter-line kp-text-muted" role="status" data-ac-filter-line>Showing every row. Press a count to show only the rows it counts.</p>
                    ${sample}
                </div>`,
});

// 2 · Attention band ---------------------------------------------------------------------------------------------------
const attention = section({
    id: 'attention',
    topic: 'page',
    title: 'Attention band: what needs a person',
    components: 'attention flash-button toast',
    intro: 'Standing problems sit in one band under the counts, worst first, each with the action that fixes it; an action Almanac refuses answers with a toast and leaves the problem where it is.',
    expected: [
        '<b>Both:</b> <b>Google Calendar cannot be reached</b> (critical, destructive tone) first, then <b>1 profile file is not being served</b> (warning). Each has one fix button at its end: <b>Check again</b> and <b>Reload profiles from disk</b>.',
        '<b>Press a fix button</b> with <b>Fix works</b> chosen: the button shows busy, then a short <b>Done</b>, and the problem leaves the band (the Problems row follows). Each answer raises its own toast flavour: <b>Fix works</b> a success toast, <b>Nothing changed</b> an info toast, <b>Partly done</b> a warning toast (the problem stays), <b>Fix is refused</b> an error toast saying why and what to do. A refused <b>Delete</b> in the Calendars table raises the destructive flavour.',
        '<b>Google only / File only / None:</b> the band holds one problem or nothing; with none, the band takes no space and the line under it moves up.',
    ],
    look: 'Formal&rsquo;s alert plates: red for critical with its icon, amber for the warning; the button sits at the end of each plate and text keeps air from the plate&rsquo;s edge. The toast is an opaque plate.',
    groups: [
        group('attention', 'problems', 'Problems', [['both', 'Both'], ['google', 'Google only'], ['file', 'File only'], ['none', 'None']]),
        group('attention', 'fix', 'What the fix buttons get back', [['works', 'Fix works'], ['same', 'Nothing changed'], ['partly', 'Partly done'], ['refused', 'Fix is refused']], { latent: true }),
    ],
    body: `                <div id="attention-component" class="ac-stage">
                    <div class="kp-attention" role="region" aria-label="Needs attention" data-ac-attention></div>
                    <p class="ac-below kp-text-muted">The calendars card follows here.</p>
                    ${toastTemplates()}
                    ${sample}
                </div>`,
});

// 3 · Calendars datatable ------------------------------------------------------------------------------------------------
const table = section({
    id: 'calendars-table',
    topic: 'calendars',
    topicTitle: 'Calendars table and delete',
    title: 'Calendars table',
    components: 'datatable code hovercard disabled-reason',
    intro: 'Every calendar the service account sees: its name, its id (one click copies it), the sources that write to it, and a delete that is only possible when nothing writes there.',
    expected: [
        '<b>Filled:</b> three rows. The id is a code cell with a Copy button. <b>Used by</b> shows one tag per source; point at (or Tab to) a tag and a card says its token state, when it was last used and how many events it posted. <b>Delete</b> stands in the last column on every row: enabled for <b>almanac-test</b>, disabled for the two in use, and pointing at a disabled one says <b>Used by home-assistant…</b>.',
        '<b>Delete almanac-test:</b> a dialog asks you to type the name, says what is lost (<b>every event on it</b>) and keeps Delete off until the name is exact. With <b>Server refuses</b> the row stays and a toast says why; with <b>Server accepts</b> the row leaves at once.',
        '<b>Sorting:</b> a click on a header sorts, another header adds a key; the choice is remembered. <b>Phone (390):</b> the rows become cards, the Delete button keeps its place at the foot of each.',
        '<b>States</b> fill the table&rsquo;s whole footprint: <b>Loading</b> the theme&rsquo;s busy card, <b>Empty</b> a plate with a drawing and <b>New calendar</b>, <b>Failed</b> a plate with a normal <b>Try again</b>.',
    ],
    look: 'A hairline table on formal&rsquo;s white, the id in mono on a quiet ground, tags as hairline pills, the destructive button outlined in red. The states keep the loaded height.',
    groups: [
        group('calendars-table', 'state', 'State', [['ready', 'Filled'], ['loading', 'Loading'], ['empty', 'Empty'], ['failed', 'Failed']]),
        group('calendars-table', 'server', 'What the server says to a delete', [['accepts', 'Server accepts'], ['refuses', 'Server refuses']], { latent: true }),
        group('calendars-table', 'card', 'Hover card on home-assistant', [['closed', 'Closed'], ['open', 'Open']]),
        group('calendars-table', 'width', 'Width', [['full', 'Full width (1280)'], ['phone', 'Phone (390)']]),
    ],
    body: `                <section id="calendars-table-component" class="kp-card ac-card ac-stage" data-ac-width="full" aria-labelledby="ac-cal-title">
                    <div class="kp-card__header"><h3 class="kp-card__title" id="ac-cal-title">Calendars</h3></div>
                    <div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-remember="almanac-calendars" data-kp-sort-multi="click" data-kp-page-sizes="none" data-kp-busy-overlay data-ac-table>
                        <div class="kp-datatable__bar">
                            <p class="kp-datatable__status" data-kp-datatable-status role="status"></p>
                            <button type="button" class="kp-button kp-button--ghost kp-button--sm" data-kp-datatable-sort-reset>Clear the sort</button>
                        </div>
                        <div class="kp-table-wrap">
                            <table class="kp-table">
                                <caption class="kp-sr-only">Calendars the service account can see</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" data-kp-sort="text">Name</th>
                                        <th scope="col">Calendar id</th>
                                        <th scope="col" data-kp-sort="number">Used by</th>
                                        <th scope="col"><span class="kp-sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody>
${CALENDARS.map(calendarRow).join('\n')}
                                </tbody>
                            </table>
                        </div>
                        <div class="kp-empty" data-kp-datatable-empty hidden></div>
                    </div>
${losesTemplates()}
                    ${sample}
                </section>`,
});

// 4 · Typed delete confirmation -------------------------------------------------------------------------------------------------
const del = section({
    id: 'calendar-delete',
    topic: 'calendars',
    title: 'Deleting a calendar: type its name',
    components: 'type-confirm dialog',
    intro: 'Deleting a calendar removes every event on it, so the dialog says that and asks for the calendar&rsquo;s exact name; the server can still refuse, and then nothing changes.',
    expected: [
        '<b>The dialog</b> shows <b>What you lose</b> (<b>every event on it</b> with its count), the name to type in code, the rule (<b>capitals count</b>) and a status line that is always there, so nothing moves. <b>Delete calendar</b> is off until the name matches.',
        '<b>Typed:</b> nothing typed leaves the status empty; <b>Wrong name</b> says it does not match (and still keeps Delete off); <b>Right name</b> shows a success badge and turns Delete on. A name with spaces and a middle dot (<b>Almanac · Huishouden</b>) must be typed exactly.',
        '<b>Delete calendar</b> with <b>Server accepts</b>: busy, then the dialog says it is deleted. With <b>Server refuses</b>: a toast says a source started using the calendar a moment ago; the dialog stays so nothing is lost by accident.',
    ],
    look: 'Formal&rsquo;s dialog plate with a hairline, the typed name in mono, a quiet rule line and a red Delete that is clearly off until the match; no text touches the plate edge.',
    groups: [
        group('calendar-delete', 'calendar', 'Calendar to delete', [['test', 'almanac-test'], ['huishouden', 'Almanac · Huishouden']]),
        group('calendar-delete', 'typed', 'What is typed', [['nothing', 'Nothing typed'], ['wrong', 'Wrong name'], ['right', 'Right name']]),
        group('calendar-delete', 'server', 'What the server says', [['accepts', 'Server accepts'], ['refuses', 'Server refuses']], { latent: true }),
    ],
    body: `                <div id="calendar-delete-component" class="ac-stage">
                    <dialog class="kp-dialog kp-confirm ac-inplace" open aria-labelledby="ac-del-title" aria-describedby="ac-del-desc" data-ac-delete-dialog>
                        <h2 class="kp-dialog__title" id="ac-del-title">Delete the calendar almanac-test?</h2>
                        <p class="kp-dialog__description" id="ac-del-desc">This cannot be undone. Cancel leaves everything as it is.</p>
                        <div data-ac-type-block></div>
                        <p class="ac-result kp-text-muted" role="status" data-ac-result></p>
                        <div class="kp-dialog__actions">
                            <button type="button" class="kp-button" data-ac-del-cancel>Cancel</button>
                            <button type="button" class="kp-button kp-button--destructive" data-ac-del-go disabled data-kp-disabled-reason="Type the calendar name first.">Delete calendar</button>
                        </div>
                    </dialog>
                    ${sample}
                </div>`,
});

// 5 · New calendar dialog ------------------------------------------------------------------------------------------------------
const newDialog = section({
    id: 'new-calendar',
    topic: 'dialog',
    topicTitle: 'New calendar dialog',
    title: 'New calendar dialog',
    components: 'dialog form',
    intro: 'Making a calendar is rare, so it lives in a dialog opened from the header: a name, a note on who it is shared with, and a refusal for a blank name.',
    expected: [
        '<b>Open:</b> a dialog with a title, one sentence, two sections (<b>Name</b> and <b>Sharing</b>), and the actions <b>Cancel</b> and <b>Make and share</b>. <b>Closed</b> shows the <b>New calendar</b> button, which opens the same dialog for real.',
        '<b>Blank name refused:</b> pressing Make with an empty name does not go on; the field gets a red error, a summary names it and the focus lands on it. <b>Filled</b> has no error. <b>Making it</b> shows the busy button; <b>Refused by Google</b> answers with a toast and leaves the name typed.',
        '<b>Owner not set:</b> Almanac cannot make calendars (nobody would see one); the form is off and the button says why when pointed at.',
    ],
    look: 'Formal&rsquo;s dialog: hairline plate, section headings in small caps weight, the required mark beside the label, the error in red under the field; no text against the edge.',
    groups: [
        group('new-calendar', 'form', 'Form', [['empty', 'Empty'], ['blank', 'Blank name refused'], ['filled', 'Filled'], ['making', 'Making it'], ['refused', 'Refused by Google'], ['owner', 'Owner not set']]),
        group('new-calendar', 'dialog', 'Dialog', [['open', 'Open'], ['closed', 'Closed']]),
    ],
    body: `                <div id="new-calendar-component" class="ac-stage" data-ac-dialog="open">
                    <div class="ac-closed"><button type="button" class="kp-button kp-button--primary" data-ac-open-dialog>New calendar</button></div>
                    <dialog class="kp-dialog ac-inplace" open aria-labelledby="ac-new-title" aria-describedby="ac-new-desc" data-ac-new-dialog>
${newDialogInner('ac-new')}
                    </dialog>
                    ${sample}
                </div>`,
});

// 6 · Profile files --------------------------------------------------------------------------------------------------------------
const profiles = section({
    id: 'profile-files',
    topic: 'profiles',
    topicTitle: 'Profile files',
    title: 'Profile files: not served and served',
    components: 'problems health datatable card-state',
    intro: 'Each source has a mapping profile on disk; a file Almanac cannot use is a problem with its reason and fix, and the files it does serve show a health dot.',
    expected: [
        '<b>Filled (1 file):</b> a problem plate <b>weekly-report.toml is not being served</b> with <b>Why</b> and <b>What now</b> in plain words and a <b>Delete the file…</b> button that asks for the file name. Under it, four served files with a dot: three green <b>Served</b>, one amber <b>Served, token revoked</b>.',
        '<b>3 files</b> shows three problems, worst first, each with its own delete; <b>None</b> shows only the served files and a quiet line that every file is served.',
        '<b>States:</b> <b>Loading</b> the busy card over the whole card, <b>Empty</b> a plate with a drawing (no profile files yet), <b>Failed</b> a plate with a normal Try again (the folder could not be read). Each keeps the loaded height.',
    ],
    look: 'Problem plates in formal&rsquo;s amber with the label words in bold; the health dot always beside its words, never colour alone; the table in hairlines under the problems.',
    groups: [
        group('profile-files', 'state', 'State', [['ready', 'Filled'], ['loading', 'Loading'], ['empty', 'Empty'], ['failed', 'Failed']]),
        group('profile-files', 'unserved', 'Files not served', [['one', '1 file'], ['three', '3 files'], ['none', 'None']]),
    ],
    body: `                <section id="profile-files-component" class="kp-card ac-card ac-stage" data-kp-state="ready" data-kp-loading-words="Reading the profile files" aria-labelledby="ac-prof-title">
                    <div class="kp-card__header"><h3 class="kp-card__title" id="ac-prof-title">Profile files</h3></div>
                    <p class="kp-card__body">Every source has a mapping profile in the profiles folder; a profile placed there by hand is picked up on reload.</p>
                    <div class="kp-card__stage">
                        <div class="kp-card__data">
                            <div class="kp-problems" data-kp-problems data-ac-problems></div>
                            <p class="kp-text-muted" data-ac-allserved hidden>Every profile file is served.</p>
                            <div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-page-sizes="none" data-ac-served>
                                <div class="kp-table-wrap">
                                    <table class="kp-table">
                                        <caption class="kp-sr-only">Profile files that are served</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col" data-kp-sort="text">File</th>
                                                <th scope="col" data-kp-sort="text">Source</th>
                                                <th scope="col" data-kp-sort="text">Calendar</th>
                                                <th scope="col" data-kp-sort="number">Health</th>
                                            </tr>
                                        </thead>
                                        <tbody>
${SOURCES.map(servedRow).join('\n')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    ${sample}
                </section>`,
});

// 7 · Uses map ----------------------------------------------------------------------------------------------------------------------------
const uses = section({
    id: 'uses-map',
    topic: 'uses',
    topicTitle: 'Uses map',
    title: 'Uses map: which source writes to which calendar',
    components: 'matrix graph segmented',
    intro: 'One picture of the whole set-up: calendars on the left, the sources that write to them on the right, a line for each. Switch between the lines map and a network graph; the dialog&rsquo;s choice sets which one opens first.',
    choices: `[{ "id": "uses-view", "label": "Which view the uses map opens in", "once": true, "default": "lines", "options": [
        { "value": "lines", "label": "Lines map (calendars | sources)", "hint": "Recommended. Two columns joined by lines: it reads left to right, shows a calendar nothing writes to as Not used, and stays a list of cards on a phone. Point at a card to light its lines." },
        { "value": "graph", "label": "Network graph", "hint": "A hub with the others in a ring: it shows the shape of the set-up at a glance and has kinds to filter, but a calendar no source writes to floats alone and the ring needs more room." }] }]`,
    expected: [
        '<b>Lines map:</b> three calendar cards on the left, four source cards on the right, one line per source. <b>Almanac · Infra</b> says <b>3 sources</b>, <b>Almanac · Huishouden</b> says <b>1 source</b>, <b>almanac-test</b> says <b>Not used</b> and has no line. Point at a card: its lines turn the primary colour, the rest dim. <b>Pinned</b> keeps <b>home-assistant</b> lit.',
        '<b>Graph:</b> the same relation as nodes and links; <b>Almanac · Infra</b>, with the most links, is the hub. Pick a node to light its links.',
        '<b>States</b> fill the picture&rsquo;s whole area: <b>Loading</b> the busy card, <b>Empty</b> and <b>Failed</b> a plate with a normal Retry on the lines map (the network graph in 11.0.0 shows only a one-line sentence there: see the report). <b>Phone (390):</b> the lines give way to cards with their sources as chips.',
    ],
    look: 'Formal&rsquo;s white cards with a hairline and its navy for a lit line; the segmented switch above the picture keeps its place when the view changes.',
    groups: [
        group('uses-map', 'state', 'State', [['ready', 'Filled'], ['loading', 'Loading'], ['empty', 'Empty'], ['failed', 'Failed']]),
        group('uses-map', 'pin', 'Lit card', [['none', 'Nothing lit'], ['pinned', 'home-assistant pinned']]),
        group('uses-map', 'width', 'Width', [['full', 'Full width (1280)'], ['phone', 'Phone (390)']]),
    ],
    body: `                <section id="uses-map-component" class="kp-card ac-card ac-stage" data-ac-width="full" data-ac-view="lines" aria-labelledby="ac-uses-title">
                    <div class="kp-card__header">
                        <h3 class="kp-card__title" id="ac-uses-title">Who writes where</h3>
                        <div class="kp-card__actions">
                            <div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="View" data-ac-view-switch>
                                <button type="button" class="kp-segmented__item" data-value="lines" role="radio" aria-checked="true"><span class="kp-segmented__label">Lines</span></button>
                                <button type="button" class="kp-segmented__item" data-value="graph" role="radio" aria-checked="false"><span class="kp-segmented__label">Network</span></button>
                            </div>
                        </div>
                    </div>
                    <div class="ac-uses-body">
                        <div class="kp-matrix" data-kp-matrix data-kp-view="lines" data-kp-matrix-owned aria-label="Which source writes to which calendar" data-ac-lines></div>
                        <figure class="kp-graph" data-kp-graph aria-label="Which source writes to which calendar, as a network" data-ac-graph hidden></figure>
                    </div>
                    ${sample}
                </section>`,
});

const html = `<!doctype html>
<html lang="en" data-theme="formal" data-review="almanac-calendars" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Almanac Calendars page on kp-themes 11.0.0: header, table, dialog, profile files and the uses map</title>
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
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main ac-page">
            <header class="ac-intro">
                <h1>Almanac: the redesigned Calendars page</h1>
                <p class="cat-intro">
                    Almanac turns events from Home Assistant, the homelab, kyu and AI sessions into Google Calendar entries. This is its
                    <b>Calendars</b> page rebuilt on kp-themes 11.0.0 in formal: the header and counts, the attention band, the calendars table with
                    its typed delete, the new-calendar dialog, the profile files and the uses map (feat-ui-1). 7 sections, 7 pairs. The data is
                    <b>sample data</b> apart from the version and the totals; each section says which parts are made up.
                </p>
            </header>
${[pageTop, attention, table, del, newDialog, profiles, uses].join('\n')}
        </main>
        <script type="application/json" data-review-round>
            { "round": "almanac-calendars-3b1c7e52-6a0d-4c8e-9f21-2d5b8a4e7c10", "received": [] }
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
writeFileSync(here + 'demo.html', html);
console.log('wrote demo.html', html.length, 'bytes');
