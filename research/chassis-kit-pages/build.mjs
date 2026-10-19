// research/chassis-kit-pages/build.mjs: writes demo.html, the review page of the redesigned chassis-rs kit pages.
// Run: node research/chassis-kit-pages/build.mjs   (after build-data.mjs when the captured JSON changes)
//
// The page is built from one list of sections. Each section is one judged pair in formal (DEMO_RULES ch. 6: theme-neutral
// components are demoed in formal alone). demo.js renders each stage from the same functions a chassis-rs template will become.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

/** @typedef {{ key: string, label: string, options: [string, string][] }} Group */
/**
 * @typedef {object} Section
 * @property {string} id @property {string} topic @property {string} [topicTitle] @property {string} title @property {string} components
 * @property {string} about the heading's sentence @property {string[]} expect @property {string} look
 * @property {Group[]} controls @property {object[]} [choices]
 */

/** @type {Section[]} */
const SECTIONS = [
    {
        id: 'shell-bar',
        topic: 'shell',
        topicTitle: 'The shell around every page',
        title: 'The navigation bar, the search palette and the shortcuts',
        components: 'nav-bar, command-palette, shortcut-sheet, connection',
        about: 'Every page of the kit stands in this shell. The bar folds links that do not fit, Search opens a palette (Ctrl K) that reaches every page and the things you do most, and one sheet lists the keys.',
        expect: [
            '<b>The bar:</b> brand, the four pages, <b>Search</b> with its <b>Ctrl K</b> hint, the theme menu and <b>Log out</b>, on one row. Press <b>Narrow</b>: the links that do not fit fold behind <b>More</b>, nothing wraps to a second row.',
            '<b>The palette</b> (open, left) groups places and actions, each with a description and its keys; <b>Typed</b> fills it with “rev ho”: words in any order find “Manage home-assistant”’s relatives and mark the matched words. <b>The sheet</b> (right) lists the chords the page registers (<b>g s</b>, <b>g c</b>).',
            '<b>The banner</b> under the bar says when the connection is gone or the service refuses, with the exact number of changes waiting, and takes no room while all is well.',
        ],
        look: 'The bar is one row with the Ctrl K hint visible; the palette and the sheet stand side by side at the same height, every row has its description and key in its own column; the banner appears under the bar and pushes the page down.',
        controls: [
            { key: 'width', label: 'Width', options: [['wide', 'Wide'], ['narrow', 'Narrow']] },
            { key: 'query', label: 'Palette', options: [['empty', 'Empty'], ['typed', 'Typed']] },
            { key: 'connection', label: 'Connection', options: [['online', 'Online'], ['reconnecting', 'Reconnecting'], ['refused', 'Refused'], ['offline', 'Offline']] },
        ],
    },
    {
        id: 'shell-phone',
        topic: 'shell',
        title: 'The phone: a tab bar with exact counts',
        components: 'tabbar, drawer, nav-bar',
        about: 'On a phone the pages are four tabs at the thumb; the rest and the session live behind More. A count on a tab is the exact number.',
        expect: [
            '<b>Top:</b> only the brand, Search and the theme menu. <b>Bottom:</b> Messages, Status, Clients and <b>More</b>; the current page is marked by more than colour.',
            '<b>Count on Clients:</b> 3 shows 3, 1534 shows <b>1534</b> whole, never “99+”. <b>More open</b> shows the drawer with Passkeys, theme and Log out.',
        ],
        look: 'The tab bar sits at the foot of the phone frame with its four tabs equal in width; the count badge shows every digit without growing the bar; the More drawer opens from the bar and holds three entries with a hint each.',
        controls: [
            { key: 'count', label: 'Count on Clients', options: [['none', 'None'], ['3', '3'], ['1534', '1534']] },
            { key: 'more', label: 'More', options: [['closed', 'Closed'], ['open', 'Open']] },
        ],
    },
    {
        id: 'login',
        topic: 'login',
        topicTitle: 'Login',
        title: 'Log in: a passkey first, the token as the way that always works',
        components: 'card, switch, health, freshness',
        about: 'The page says what the service is and that it is healthy before anyone is in; the passkey is the primary way, the pasted token the fallback, and “keep me signed in” is a switch.',
        expect: [
            '<b>No navigation links</b> before login, only the brand and the theme menu. The service’s health, version and age are on the page (the open <code>/healthz</code> already says them).',
            '<b>Ready:</b> “Log in with a passkey” is the primary button, the token field below it with <b>Show</b>, a switch for 30 days and the secondary Log in. <b>Wrong token</b> says what is wrong, why and what to do, in the alert plate. <b>Busy</b> keeps the button’s width.',
            '<b>Passkeys not offered:</b> the card is only the token form and its Log in becomes primary. <b>Phone:</b> one column, nothing scrolls sideways.',
        ],
        look: 'Two columns at the wide width (intro left, card right), one column on the phone; the passkey button is the only primary button on the card; the wrong-token alert is a red plate with three parts and the field is marked invalid.',
        controls: [
            { key: 'state', label: 'State', options: [['ready', 'Ready'], ['wrong', 'Wrong token'], ['busy', 'Busy']] },
            { key: 'passkeys', label: 'Passkeys', options: [['on', 'Offered'], ['off', 'Not offered']] },
            { key: 'width', label: 'Width', options: [['full', 'Full'], ['phone', 'Phone']] },
        ],
    },
    {
        id: 'status-page',
        topic: 'status',
        topicTitle: 'Status',
        title: 'The status page as an operations page',
        components: 'ops-page, problems, status-row, version-delta, uptime, refresh, freshness, connection',
        about: 'One page header with the freshness line, four key figures, what needs a person (one alert per problem, with its fix), then the cards: service, health per part, updates and the last 48 hours.',
        expect: [
            '<b>Healthy:</b> header, “updated 12 s ago” with the refresh control (every 30 s, remembered), four figures that include <b>Up for</b> and the client count, no attention band (it takes no room), three cards and the availability strip.',
            '<b>Degraded:</b> the Health figure turns red, two problems appear (what, why, what now, with a Copy command), and the failing part is a red row. <b>Problems as</b> (choice) is <b>One alert each</b> by default; the other two modes are real options.',
            '<b>Retry failed deliveries</b> (a service’s own section action) is a button with a spinner, then “Retried”, and a toast says <b>Retried 12 entries</b>: the page does not reload and keeps its place. <b>Update found</b> shows the version chip <b>0.1.0 → 0.2.0</b> with its size in words and a link to the release; <b>Failed</b> is one plate with Try again; <b>Loading</b> keeps the final geometry.',
        ],
        look: 'The figures strip is one row of equal tiles; the three cards share one height; the availability strip spans the whole width with its summary above; Degraded is readable without colour (words and shapes).',
        controls: [
            { key: 'state', label: 'State', options: [['healthy', 'Healthy'], ['degraded', 'Degraded'], ['loading', 'Loading'], ['failed', 'Failed']] },
            { key: 'update', label: 'Updates', options: [['off', 'Off (captured)'], ['current', 'Up to date'], ['available', 'Update found']] },
            { key: 'width', label: 'Width', options: [['full', 'Full'], ['phone', 'Phone']] },
        ],
        choices: [
            {
                id: 'problems-mode',
                label: 'How several problems are shown',
                default: 'each',
                options: [
                    { value: 'each', label: 'One alert each', hint: 'Every problem its own alert, the worst first.' },
                    { value: 'list', label: 'One alert with a list', hint: 'One alert, in the tone of the worst, holding every problem.' },
                    { value: 'fold', label: 'The worst, the rest folded', hint: 'The worst stays open, “Show the other N” holds the rest.' },
                ],
            },
        ],
    },
    {
        id: 'status-sections',
        topic: 'status',
        title: 'A service’s own sections: a table, key figures and a card that reads its own data',
        components: 'datatable, status-row, card-state, kv, health',
        about: 'What a service adds to the status page is no longer only rows of text: a section can be a sortable table, key figures with checks, or a card that fetches its own JSON and shows loading, empty and failed by itself.',
        expect: [
            '<b>Messages</b> is the capture’s own section as a data table (sort, search, remembered); <b>Delivery</b> is key figures and two check rows; <b>Store, read live</b> is a card that reads <code>/healthz</code> and shows its state.',
            'Press <b>Loading</b>, <b>Empty</b>, <b>Failed</b>: each card keeps its place and size, shows the theme’s busy card, the empty plate or the failed plate with Try again, and the other cards stay as they are.',
        ],
        look: 'In every state the three cards keep their footprint; loading is the busy card centred over the card, empty and failed fill the card with a heading-size plate and a normal Try again.',
        controls: [{ key: 'state', label: 'Cards', options: [['ready', 'Ready'], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']] }],
    },
    {
        id: 'clients-list',
        topic: 'clients',
        topicTitle: 'Clients',
        title: 'Clients: the list, with what needs a look first',
        components: 'ops-page, problems, datatable, idmark, hovercard, combobox',
        about: 'The four figures are filters (a click toggles, “Show all” resets), idle clients are called out with their fix, and the table sorts, searches and remembers its sort. The first 3 rows are captured from the running example service; the other 8 have the same shape and sample values.',
        expect: [
            '<b>Ready:</b> four figures (In use, Idle, Never used, Revoked) with exact counts; one alert says how many clients have not called in 30 days and names them, with <b>Show them</b>. Each row: identity mark, name (hover for its details), state, last used as <b>dd/mm/yyyy HH:mm</b> and how long ago, requests, topic, messages, <b>Manage</b> in its own column.',
            '<b>Idle only</b> is the Idle figure pressed: the table shows just those rows and the figure stays pressed until you press it again. <b>Empty</b> is a plate with <b>Issue a client</b>; <b>Loading</b> and <b>Failed</b> fill the table’s footprint.',
            'The choice <b>List as</b> is <b>Table</b> by default; <b>Cards</b> is a real option and the table always becomes cards on a phone.',
        ],
        look: 'The Manage buttons stand in one column, the dates in one column with the ago words under or beside them; the pressed figure has a primary border; on Phone every row is a card with its name and state first.',
        controls: [
            { key: 'state', label: 'State', options: [['ready', 'Ready'], ['idle', 'Idle only'], ['empty', 'Empty'], ['loading', 'Loading'], ['error', 'Failed']] },
            { key: 'width', label: 'Width', options: [['full', 'Full'], ['phone', 'Phone']] },
        ],
        choices: [
            {
                id: 'list-look',
                label: 'List as',
                default: 'table',
                options: [
                    { value: 'table', label: 'Table', hint: 'Columns that sort; cards only on a phone.' },
                    { value: 'cards', label: 'Cards', hint: 'One card per client at every width, with a sort control.' },
                ],
            },
        ],
    },
    {
        id: 'clients-issue',
        topic: 'clients',
        title: 'Issue a client: a form that ends with the token in your hand',
        components: 'dialog, form, combobox, flash, secret, command',
        about: 'The name is checked as you leave the field, the topic offers the ones already used, and the new token appears in the same dialog with a ready command, instead of a reload and a hunt through the table.',
        expect: [
            '<b>Form:</b> Name and Topic with a help line each; Topic opens a list with <b>Used before</b> on top and lets you type a new one. <b>Name taken</b> shows the error under the field in words and keeps what you typed.',
            '<b>Issued:</b> the token is in a secret field that stays shown until you hide it, with Copy; a first command is under it, and Done closes. Issue token is one button with a spinner and then “Issued”, never changing width.',
        ],
        look: 'The dialog is one column with its sections in a fixed order; the Topic list opens at its field with the opaque menu plate; the error is a line under the field in the destructive colour with words.',
        controls: [{ key: 'step', label: 'Step', options: [['form', 'Form'], ['taken', 'Name taken'], ['issued', 'Issued']] }],
    },
    {
        id: 'clients-manage',
        topic: 'clients',
        title: 'Manage a client: token, command, test and what it sent',
        components: 'dialog, secret, command, json-field, flash, request-inspector, type-confirm, idmark',
        about: 'Everything about one client in one dialog, in the order you use it: reveal or copy the token, copy a command, send a test with a body of your choosing, read what it sent, and the dangerous things last behind a typed name.',
        expect: [
            '<b>Token:</b> the field is masked; Reveal shows it for 10 s with a countdown and Copy never shows it. <b>Use it:</b> the command block never holds the token (safe to paste in a chat); the button copies the same command with the token in it.',
            '<b>Test it:</b> the body is a JSON box that says what is wrong and where; Send test shows a spinner, then “Sent”. <b>Requests</b> are the inspector: method, path and status in words, headers with <code>authorization</code> masked, the body, and Copy as curl. Press the four request states.',
            '<b>Danger zone:</b> Delete asks for the exact name <b>home-assistant</b> before Confirm turns on; Revoke and Re-issue ask once and say what happens. <b>Revoked</b> shows only the history and Delete.',
        ],
        look: 'The dialog is wide with one heading per section and a note under each; the secret line keeps its height while it counts down; the inspector’s states keep one height; the danger section is last and marked.',
        controls: [
            { key: 'client', label: 'Client', options: [['active', 'Active'], ['revoked', 'Revoked']] },
            { key: 'requests', label: 'Requests', options: [['ready', 'Ready'], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']] },
        ],
    },
    {
        id: 'clients-first',
        topic: 'clients',
        title: 'The first client: the page walks you through it and notices the first call',
        components: 'steplist, empty-state, card, freshness',
        about: 'A new service has no clients, which is the moment people need most help. Three steps, the last one finishes by itself when the first request arrives.',
        expect: [
            'Press <b>1</b> to <b>4</b>: each step shows its state (done, running with the theme’s spinner, waiting) with a note that says what happens, and the right card changes from “No clients yet” to “Connected”.',
            'Nothing moves between steps: notes are all present from the start, so a note arriving later shifts nothing.',
        ],
        look: 'The step list has one fixed row height per step with its mark in one column; the running step has a spinner; step 4 ends with a primary button to the list.',
        controls: [{ key: 'step', label: 'Step', options: [['1', '1 Issue'], ['2', '2 Give the token'], ['3', '3 Waiting'], ['4', '4 Connected']] }],
    },
    {
        id: 'passkeys-list',
        topic: 'passkeys',
        topicTitle: 'Passkeys',
        title: 'Ways to sign in: this device marked, rename in place, remove behind a question',
        components: 'passkeys, card, dialog, type-confirm, disabled-reason',
        about: 'One list of the passkeys that open the dashboard: a “This device” badge on the one in use, a passkey unused for 90 days flagged, Rename and Remove in two fixed columns. The login token always works as the fallback. The rows are sample values: a passkey needs HTTPS and a real authenticator.',
        expect: [
            '<b>Several:</b> “Work laptop, Firefox” has the <b>This device</b> badge and comes first; <b>Rename</b> turns the name into a field in place (Enter saves, Esc cancels); “Old tablet” is flagged as unused for 90 days; <b>Remove</b> asks first and says what happens.',
            '<b>One</b> passkey is removable too: the login token still works, and the page says so under the list. <b>Not HTTPS</b> shows one alert with what, why and the fix, and the primary button is off with its reason on hover. <b>Empty</b> is a plate with the register button.',
        ],
        look: 'Rename and Remove line up in two columns from row to row; the badge and the flagged state use words as well as colour; the confirmation names the passkey.',
        controls: [
            { key: 'state', label: 'State', options: [['list', 'Several'], ['one', 'One'], ['empty', 'Empty'], ['http', 'Not HTTPS']] },
            { key: 'width', label: 'Width', options: [['full', 'Full'], ['phone', 'Phone']] },
        ],
        choices: [
            {
                id: 'remove-confirm',
                label: 'Removing a passkey',
                default: 'dialog',
                options: [
                    { value: 'dialog', label: 'A question', hint: 'A confirmation names the passkey and says the login token still works.' },
                    { value: 'type-name', label: 'Type its name', hint: 'The exact name of the passkey must be typed before Remove turns on.' },
                ],
            },
        ],
    },
    {
        id: 'passkeys-qr',
        topic: 'passkeys',
        title: 'Register on another device: a code to scan',
        components: 'qr, steplist, card',
        about: 'A passkey belongs to the device that makes it. The page draws a code of its own address, so a phone can open it, log in once and register itself.',
        expect: [
            'The code stands on a light plate in every theme (it is read by a camera), with the address under it and a Copy button; <b>Loading</b> shows the code being made, <b>Expired</b> withdraws it with a reason.',
            'The three steps on the right say what happens on the phone, so nobody wonders what to do after scanning.',
        ],
        look: 'The code and the steps are two cards of one height; the code never shrinks below a size a camera can read; the address wraps instead of scrolling.',
        controls: [{ key: 'code', label: 'Code', options: [['ready', 'Ready'], ['loading', 'Loading'], ['expired', 'Expired']] }],
    },
    {
        id: 'error-page',
        topic: 'error',
        topicTitle: 'Errors',
        title: 'An error page: one plate, the way out and a request to quote',
        components: 'empty-state, copyable, kv',
        about: 'The kit’s error and its remedy, as a page in the shell with the navigation around it: what is wrong in plain words, why, what to do, two ways out, and the request number to copy into a report.',
        expect: [
            'Press <b>403</b>, <b>404</b>, <b>500</b>, <b>503</b>: each has its own drawing in the theme’s hand, a heading in plain words (no ids, no raw errors), the reason and the remedy under it.',
            'The request number sits in a copyable value with a Copy button; <b>Go back</b> and <b>Open the status page</b> are normal-size buttons, and Back to the dashboard is the one primary button.',
        ],
        look: 'The plate is centred in the card at heading size; the two buttons are normal size; the facts below it use one label column.',
        controls: [{ key: 'status', label: 'Status', options: [['403', '403'], ['404', '404'], ['500', '500'], ['503', '503']] }],
    },
];

const esc = (/** @type {string} */ s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');

/** @param {Section} s */
function section(s) {
    const first = s.controls.map((g) => g.options[0][0]);
    const stageAttrs = s.controls.map((g, i) => `data-ck-${g.key}="${first[i]}"`).join(' ');
    const groups = s.controls
        .map(
            (g, gi) =>
                `<div role="group" aria-label="${g.label}"><b>${g.label}:</b> ${g.options
                    .map(
                        ([v, label], i) =>
                            `<button type="button" class="kp-button kp-button--sm" data-ck-set="${g.key}" data-ck-value="${v}" aria-pressed="${i === 0}">${label}</button>`,
                    )
                    .join(' ')}</div>`,
        )
        .join('\n                    ');
    const choices = s.choices ? ` data-review-choices='${esc(JSON.stringify(s.choices))}'` : '';
    return `            <section
                class="ck-sec"
                id="${s.id}"
                data-review-item="${s.id}"
                data-review-topic="${s.topic}"${s.topicTitle ? `\n                data-review-topic-title="${esc(s.topicTitle)}"` : ''}
                data-review-components="${s.components.replace(/[,()]/g, '').replace(/\s+/g, ' ')}"
                data-review-title="${esc(s.title)}"${choices}
                aria-labelledby="h-${s.id}"
            >
                <div class="ck-sec__head">
                    <h2 id="h-${s.id}">${s.title}</h2>
                    <p>${s.about}</p>
                </div>
                <div class="ck-expected">
                    <p><b>Expected:</b></p>
                    <ul>
${s.expect.map((e) => `                        <li>${e}</li>`).join('\n')}
                    </ul>
                </div>
                <div data-review-look>
                    <p data-for="formal">${s.look}</p>
                </div>
                <div data-review-controls data-review-controls-for="${s.id}-component">
                    ${groups}
                </div>
                <div id="${s.id}-component" class="ck-stage" data-ck-view="${s.id}" ${stageAttrs}></div>
            </section>`;
}

/** The five parts, each its own review (Kenny's coordinator, 2026-10-19): the shared kit stays here, every part gets its own page. */
const PARTS = [
    { dir: 'chassis-kit-shell', name: 'shell', round: '0a03b1be-8fc4-4ad2-a1f1-928e31093dd7', title: 'The shell and the error page', ids: ['shell-bar', 'shell-phone', 'error-page'], about: 'The bar, the search palette, the shortcuts, the phone’s tab bar and the error page: what stands around every page of the kit.' },
    { dir: 'chassis-kit-status', name: 'status', round: '8f4d47e7-df65-436b-8b67-6254caf06077', title: 'The status page', ids: ['status-page', 'status-sections'], about: 'The status page as an operations page, and the sections a service adds to it.' },
    { dir: 'chassis-kit-clients', name: 'clients', round: '7904a752-e0d6-4bd7-91c1-e278ce9246bc', title: 'The clients page', ids: ['clients-list', 'clients-issue', 'clients-manage', 'clients-first'], about: 'The list of clients, issuing one, managing one, and the first client’s walk-through.' },
    { dir: 'chassis-kit-login', name: 'login', round: 'ad2c2843-1d5d-4dce-a21a-ebd268059fa4', title: 'The login page', ids: ['login'], about: 'The page in front of the dashboard: a passkey first, the token as the fallback.' },
    { dir: 'chassis-kit-passkeys', name: 'passkeys', round: 'd279180e-25d8-48e8-8c9a-09ba1d76960f', title: 'The passkeys page', ids: ['passkeys-list', 'passkeys-qr'], about: 'The ways to sign in, and registering from another device.' },
];

for (const part of PARTS) {
    const secs = SECTIONS.filter((s) => part.ids.includes(s.id));
    const html = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${part.dir}" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>chassis-rs kit pages: ${part.title}</title>
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
        <link rel="stylesheet" href="../chassis-kit-pages/page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main ck-page">
            <header class="ck-intro">
                <h1>chassis-rs kit pages on kp-themes 11.0.0: ${part.title}</h1>
                <p class="cat-intro">
                    ${part.about} In formal. ${secs.length} ${secs.length === 1 ? 'section' : 'sections'}, ${secs.length} ${secs.length === 1 ? 'pair' : 'pairs'}. The pages are
                    rendered from data the running example service answered (clients, requests, status, health); rows it did not have are more rows of
                    the same shape and say so on the page.
                </p>
            </header>
${secs.map(section).join('\n')}
        </main>
        <script type="application/json" data-review-round>
            { "round": "${part.dir}-${part.round}" }
        </script>
        <script type="module" src="../chassis-kit-pages/demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
    mkdirSync(join(here, '..', part.dir), { recursive: true });
    writeFileSync(join(here, '..', part.dir, 'demo.html'), html);
    console.log(`${part.dir}/demo.html: ${secs.length} sections`);
}
