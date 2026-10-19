// Builds research/align-grid-1019/demo.html: the form grid (`.kp-formgrid`), the package's one layout for forms, settings,
// key-value panels and button groups (Kenny, 2026-10-19 06:43, after seven settings sections were rejected for
// misalignment: "Gebruik het grid en align deftig verticaal!"). Every section is a composition on that one named grid:
//
//     label | control | value | actions
//
//   1. settings   a settings list, five kinds of control on one edge, the options switched live
//   2. form       a form with help under the fields and its buttons on the field edge
//   3. facts      a key-value panel and a form in one grid: the facts start where the fields start
//   4. request    a request editor: Send test on the line of Format and Minify, in the actions column
//   5. tools      tool rows of one height, the refresh bar on the tracks (HTTPSwitchboard gaps 23 to 25)
//   6. phone      the settings list at phone width: one column, top to bottom
//
// Formal only: the grid is theme-neutral (DEMO_RULES ch. 6). The content is realistic and made up (an offsite photo
// backup, a mail relay, a webhook); it copies no project's page.
//
// Run: node research/align-grid-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'align-grid-1019';
const PAGE_THEMES = ['formal'];

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, grid: string, expect: string[], look: string, body: string, components: string, controls?: string, choices?: string }} s
 */
const section = (s) => `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="formal"
    data-review-topic="${s.id}"
    data-review-topic-title="${s.title}"${s.choices ? `\n    data-review-choices='${s.choices}'` : ''}
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What changed:</b> ${s.changed}</p><p><b>The grid:</b> ${s.grid}</p></div>
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
        <p data-for="formal">${s.look}</p>
    </div>
${s.controls ?? ''}
${s.body}
</section>`;

/** A control group of the review dialog. @param {string} label @param {string} opt @param {[string, string][]} options */
const group = (label, opt, options) =>
    `<div role="group" aria-label="${label}"><b>${label}</b>${options
        .map(
            ([value, words], i) =>
                `<button type="button" class="kp-button kp-button--sm" aria-pressed="${i === 0}" data-ag-opt="${opt}" data-ag-value="${value}">${words}</button>`,
        )
        .join('')}</div>`;

const reset = (/** @type {string} */ what) =>
    `<div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm" data-ag-reset>Reset ${what}</button></div>`;
const noActions = '<div class="kp-formgrid__actions"></div>';

/** The settings list of the offsite photo backup, used by sections 1 and 5. @param {string} p id prefix */
const settingsRows = (p) => `
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="${p}-target">Upload target<small>Where the snapshots of the photo library go.</small></label>
        <div class="kp-formgrid__control"><input class="kp-field__input" id="${p}-target" value="b2:family-photos/offsite" /></div>
        <p class="kp-formgrid__value">changed 12/10/2026 21:14</p>
        ${reset('target')}
    </div>
    <div class="kp-formgrid__row" data-kp-changed>
        <span class="kp-formgrid__label" id="${p}-time-l">Snapshot time</span>
        <div class="kp-formgrid__control"><div class="kp-time" data-kp-time data-kp-value="03:30" data-kp-label="Snapshot time" data-kp-time-step="30"></div></div>
        <p class="kp-formgrid__value">default 02:00, host time</p>
        ${reset('time')}
    </div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label">Parallel uploads</span>
        <div class="kp-formgrid__control"><div class="kp-quantity" data-kp-quantity data-kp-quantity-min="1" data-kp-quantity-max="16" data-kp-quantity-unit="files" data-kp-quantity-unit-one="file" data-kp-quantity-label="Parallel uploads"><input class="kp-quantity__input" value="4" /></div></div>
        <p class="kp-formgrid__value">1 to 16; more is faster on fibre</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="${p}-zip">Compression</label>
        <div class="kp-formgrid__control"><select class="kp-field__input" id="${p}-zip"><option>zstd, level 3</option><option>zstd, level 9</option><option>None</option></select></div>
        <p class="kp-formgrid__value">applies to new snapshots only</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label">Verify after upload</span>
        <div class="kp-formgrid__control"><label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked /><span>On</span></label></div>
        <p class="kp-formgrid__value">reads every file back: about 20 min longer</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="${p}-cap">Bandwidth cap (MB/s)</label>
        <div class="kp-formgrid__control"><input class="kp-field__input" type="number" id="${p}-cap" value="40" min="0" /></div>
        <p class="kp-formgrid__value">0 is no cap</p>
        ${reset('cap')}
    </div>
    <div class="kp-formgrid__row kp-formgrid__row--buttons">
        <span class="kp-formgrid__label"></span>
        <div class="kp-formgrid__control"><div class="kp-formgrid__buttons"><button type="button" class="kp-button kp-button--primary">Save 2 changes</button><button type="button" class="kp-button">Discard</button></div></div>
        <p class="kp-formgrid__value">2 changes not saved yet</p>
        ${noActions}
    </div>`;

const sections = [
    section({
        id: 'settings',
        title: 'A settings list: five kinds of control on one edge',
        intro: 'The settings of an offsite backup of the photo library: a field, a time, a stepper, a select, a switch and a number, each with its default and, where it has one, a Reset.',
        components: 'formgrid',
        changed:
            'New in the package: <code>.kp-formgrid</code>. Before, a settings row was a label beside a control in its own flex row, so each row decided its own edges: in the rejected homelab settings the controls ended on four different edges (x 649, 686, 706 and 711), a stepper stood 4 px and a switch 6 px off its label. Here every row is a subgrid of one grid, so every control starts on one edge, ends on one of two (a field fills the track, a time, stepper or number takes one step of 14rem), and every cell stands on the label&rsquo;s first baseline. The three switches above the grid change its options live.',
        grid: 'four columns, <b>label</b> (as wide as &ldquo;Bandwidth cap (MB/s)&rdquo;) | <b>control</b> (3 parts of the width left) | <b>value</b> (2 parts) | <b>actions</b> (as wide as &ldquo;Reset target&rdquo;); seven rows, each a subgrid spanning all four; the Save row puts its two buttons in the control column and its note in the value column.',
        choices:
            '[{ "id": "settings-label", "label": "The label column", "once": true, "default": "fit", "options": [{ "value": "fit", "label": "As wide as the longest label", "hint": "The default of the grid: no room wasted." }, { "value": "wide", "label": "At least 14rem", "hint": "More air before the controls; the grid has it as data-kp-formgrid-label=\\"wide\\"." }] }]',
        expect: [
            'Every control starts on one vertical line; the field, the select end on one edge; the time, the stepper and the number end on a second, shorter edge; the switch keeps its own size.',
            '&ldquo;Snapshot time&rdquo; and 03:30, &ldquo;Parallel uploads&rdquo; and 4 files, &ldquo;Verify after upload&rdquo; and On, each value and each Reset stand on one line.',
            'The three Resets end on the right edge, one column; Save and Discard start where the fields start.',
            '<b>Label column</b>, <b>Line up</b> and <b>Rules</b> switch the grid&rsquo;s attributes (<code>data-kp-formgrid-label</code>, <code>-align</code>, <code>-lines</code>); the grid follows at once.',
        ],
        look: 'run your eye down each column: one left edge for the controls, two right edges at most, every value starting on one edge, every Reset in one column; then across each row: label, control, value and Reset on one line.',
        controls: `<div class="ag-controls" data-review-controls data-review-controls-for="ag-settings">${group('Label column', 'label', [
            ['fit', 'Longest label'],
            ['wide', 'Wide'],
        ])}${group('Line up', 'align', [
            ['baseline', 'First baseline'],
            ['center', 'Centre'],
        ])}${group('Rules', 'lines', [
            ['lines', 'Between rows'],
            ['none', 'None'],
        ])}</div>`,
        body: `<div class="kp-card ag-card"><div class="kp-formgrid" id="ag-settings" data-kp-formgrid-lines="lines" aria-label="Offsite backup settings">${settingsRows('s')}
</div></div>`,
    }),
    section({
        id: 'form',
        title: 'A form: help under the fields, buttons on the field edge',
        intro: 'Adding the mail relay that sends the alerts: name, server, port, security, user and password, with a help line under the fields that need one.',
        components: 'formgrid',
        changed:
            'New in the package: a form on <code>.kp-formgrid</code>. The help line of a field stands under it in the same column and never moves its row off the label&rsquo;s line (the label and the field share the first baseline); the port is a short field, one step wide; the buttons are a row of the grid, so &ldquo;Check the connection&rdquo; starts on the fields&rsquo; edge and &ldquo;Add the relay&rdquo; stands at the end of the actions column, on the same line.',
        grid: 'the same four columns; six field rows, the help in the control column under its field, what the field means in the value column; a last row of buttons: two in the control column, the primary one in the actions column.',
        expect: [
            'Each label stands on the line of its field&rsquo;s text; a help line under a field does not push the label down.',
            'Port and Security are one step wide; Name, Server, User and Password fill the track and end on one edge.',
            '&ldquo;Check the connection&rdquo; and &ldquo;Cancel&rdquo; start on the fields&rsquo; edge; &ldquo;Add the relay&rdquo; is on their line, at the right end.',
        ],
        look: 'the left edge of every field and of the first button is one line; the three buttons share one top and one height.',
        body: `<div class="kp-card ag-card"><form class="kp-formgrid" id="ag-form" action="#" aria-label="Add a mail relay">
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="f-name">Name</label>
        <div class="kp-formgrid__control"><input class="kp-field__input" id="f-name" value="Alerts via Fastmail" /></div>
        <p class="kp-formgrid__value">shown in the list of relays</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="f-host">Server</label>
        <div class="kp-formgrid__control"><input class="kp-field__input" id="f-host" value="smtp.fastmail.com" /><p class="kp-field__help">The name of the mail server, without smtp:// in front.</p></div>
        <p class="kp-formgrid__value">found in your mail provider&rsquo;s settings</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="f-port">Port</label>
        <div class="kp-formgrid__control"><input class="kp-field__input" type="number" id="f-port" value="587" /></div>
        <p class="kp-formgrid__value">587 for STARTTLS, 465 for TLS</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="f-sec">Security</label>
        <div class="kp-formgrid__control"><select class="kp-field__input kp-field__input--short" id="f-sec"><option>STARTTLS</option><option>TLS</option><option>None</option></select></div>
        <p class="kp-formgrid__value">STARTTLS unless the provider says TLS</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="f-user">User</label>
        <div class="kp-formgrid__control"><input class="kp-field__input" id="f-user" value="alerts@passenier.example" autocomplete="off" /></div>
        <p class="kp-formgrid__value"></p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="f-pass">App password</label>
        <div class="kp-formgrid__control"><input class="kp-field__input" type="password" id="f-pass" value="abcd-efgh-ijkl-mnop" autocomplete="off" /><p class="kp-field__help">An app password from the provider, not the password you sign in with.</p></div>
        <p class="kp-formgrid__value">stored encrypted; never shown again</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row kp-formgrid__row--buttons">
        <span class="kp-formgrid__label"></span>
        <div class="kp-formgrid__control"><div class="kp-formgrid__buttons"><button type="button" class="kp-button">Check the connection</button><button type="button" class="kp-button">Cancel</button></div></div>
        <p class="kp-formgrid__value"></p>
        <div class="kp-formgrid__actions"><button type="submit" class="kp-button kp-button--primary">Add the relay</button></div>
    </div>
</form></div>`,
    }),
    section({
        id: 'facts',
        title: 'Facts and settings in one grid',
        intro: 'A backup job&rsquo;s panel: what the last run did (a key-value list) and when it runs (two settings), with the job&rsquo;s buttons under them.',
        components: 'formgrid kv formrows',
        changed:
            'New: a <code>.kp-kv</code> and a <code>.kp-formrows</code> placed inside one <code>.kp-formgrid</code> become subgrids of it, without a class on their rows. Before, each list sized its own label column, so the facts and the settings beside each other started on two edges. Now &ldquo;Last run&rdquo; and &ldquo;Keep daily snapshots&rdquo; share one label column, the facts start on the edge where the controls start, and the buttons under them start there too.',
        grid: 'the same four columns; a heading row spanning all four, five fact rows (label | value across control and value), a second heading, a <code>.kp-formrows</code> of two rows (label | control | aside in the value column), a row of buttons (two in the control column, Pause in the actions column).',
        expect: [
            'The labels of both lists form one column; the facts (Succeeded, 19/10/2026 03:41, &hellip;) start on the same edge as the time field and the stepper.',
            'Each fact stands on its label&rsquo;s line; the badge &ldquo;Succeeded&rdquo; too.',
            '&ldquo;Run now&rdquo; starts on the control edge; &ldquo;Pause the schedule&rdquo; stands on its line at the right end.',
        ],
        look: 'one label column through both lists; the values of the facts and the controls of the settings start on one line.',
        body: `<div class="kp-card ag-card"><div class="kp-formgrid" id="ag-facts" aria-label="Photo library backup job">
    <section class="kp-formgrid__group" aria-labelledby="ag-facts-last">
        <h3 class="kp-formgrid__heading" id="ag-facts-last">Last run</h3>
        <dl class="kp-kv">
            <div class="kp-kv__row"><dt>Result</dt><dd><span class="kp-badge kp-badge--success">Succeeded</span></dd></div>
            <div class="kp-kv__row"><dt>Finished</dt><dd>19/10/2026 03:41</dd></div>
            <div class="kp-kv__row"><dt>Took</dt><dd>11 min 20 s</dd></div>
            <div class="kp-kv__row"><dt>Uploaded</dt><dd>1,204 files, 6.8 GB of 182.4 GB</dd></div>
            <div class="kp-kv__row"><dt>Next run</dt><dd>20/10/2026 03:30</dd></div>
        </dl>
    </section>
    <section class="kp-formgrid__group" aria-labelledby="ag-facts-when">
        <h3 class="kp-formgrid__heading" id="ag-facts-when">Schedule</h3>
        <div class="kp-formrows">
            <div class="kp-formrow">
                <span class="kp-formrow__label">Runs at</span>
                <div class="kp-formrow__control"><div class="kp-time" data-kp-time data-kp-value="03:30" data-kp-label="Runs at" data-kp-time-step="30"></div></div>
                <div class="kp-formrow__aside">every night, host time</div>
            </div>
            <div class="kp-formrow">
                <span class="kp-formrow__label">Keep daily snapshots</span>
                <div class="kp-formrow__control"><div class="kp-quantity" data-kp-quantity data-kp-quantity-min="1" data-kp-quantity-max="90" data-kp-quantity-unit="days" data-kp-quantity-unit-one="day" data-kp-quantity-label="Keep daily snapshots"><input class="kp-quantity__input" value="14" /></div></div>
                <div class="kp-formrow__aside">then one a week for a year</div>
            </div>
        </div>
    </section>
    <div class="kp-formgrid__row kp-formgrid__row--buttons">
        <span class="kp-formgrid__label"></span>
        <div class="kp-formgrid__control"><div class="kp-formgrid__buttons"><button type="button" class="kp-button kp-button--primary">Run now</button><button type="button" class="kp-button">Show the log</button></div></div>
        <p class="kp-formgrid__value"></p>
        <div class="kp-formgrid__actions"><button type="button" class="kp-button">Pause the schedule</button></div>
    </div>
</div></div>`,
    }),
    section({
        id: 'request',
        title: 'A request editor: Send test on the line of Format and Minify',
        intro: 'Testing the webhook that posts a finished backup to the message hub: method, address, a header and the body, with the body&rsquo;s tools and the test in one row.',
        components: 'formgrid',
        changed:
            'New: a row of buttons on the grid&rsquo;s tracks. In the rejected client editor, &ldquo;Send test&rdquo; stood 25.6 px higher than &ldquo;Format&rdquo;, &ldquo;Minify&rdquo;, &ldquo;Wrap&rdquo; and &ldquo;Copy&rdquo; beside it, in a column of its own. Here the body&rsquo;s tools are the row&rsquo;s control cell and &ldquo;Send test&rdquo; is the row&rsquo;s action: one row, so one line, and the action column it stands in is the column of every other row&rsquo;s action (Copy the address). The body under them runs from the fields&rsquo; edge to the end of the actions column, under Send test.',
        grid: 'the same four columns; Method, Address and Header rows; a Body row of buttons (Format, Minify, Wrap, Copy in the control column, the JSON check in the value column, Send test in the actions column); the body box on the next row from the control edge to the end of the actions column (<code>data-kp-formgrid-span="wide"</code>), so its right edge is the right edge of Send test; the last answer as a fact row.',
        expect: [
            '&ldquo;Send test&rdquo;, &ldquo;Format&rdquo;, &ldquo;Minify&rdquo;, &ldquo;Wrap&rdquo; and &ldquo;Copy&rdquo; share one top, one height and one line, with the label &ldquo;Body&rdquo;.',
            '&ldquo;Send test&rdquo; and &ldquo;Copy the address&rdquo; end on one edge, in the actions column.',
            'The body box starts on the edge of the fields above and ends on the right edge of Send test.',
        ],
        look: 'the row Body: five buttons on one line; the right edge of Send test under the right edge of Copy the address.',
        body: `<div class="kp-card ag-card"><div class="kp-formgrid" id="ag-request" aria-label="Test the webhook">
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="r-method">Method</label>
        <div class="kp-formgrid__control"><select class="kp-field__input kp-field__input--short" id="r-method"><option>POST</option><option>PUT</option></select></div>
        <p class="kp-formgrid__value">the hub takes POST</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="r-url">Address</label>
        <div class="kp-formgrid__control"><input class="kp-field__input kp-mono" id="r-url" value="https://hub.passenier.example/v1/messages" /></div>
        <p class="kp-formgrid__value">topic backup.done</p>
        <div class="kp-formgrid__actions"><button type="button" class="kp-button">Copy the address</button></div>
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="r-head">Header</label>
        <div class="kp-formgrid__control"><input class="kp-field__input kp-mono" id="r-head" value="Authorization: Bearer ••••••••" /></div>
        <p class="kp-formgrid__value">the token is masked; it is sent as is</p>
        ${noActions}
    </div>
    <div class="kp-formgrid__row kp-formgrid__row--buttons">
        <span class="kp-formgrid__label" id="r-body-l">Body</span>
        <div class="kp-formgrid__control"><div class="kp-formgrid__buttons" role="group" aria-label="Body tools"><button type="button" class="kp-button">Format</button><button type="button" class="kp-button">Minify</button><button type="button" class="kp-button">Wrap</button><button type="button" class="kp-button">Copy</button></div></div>
        <p class="kp-formgrid__value">Valid JSON, 3 keys</p>
        <div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--primary">Send test</button></div>
    </div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label"></span>
        <div class="kp-formgrid__control" data-kp-formgrid-span="wide"><textarea class="kp-field__input kp-mono ag-body" rows="5" aria-labelledby="r-body-l">{
  "topic": "backup.done",
  "title": "Photo library: offsite backup finished",
  "ok": true
}</textarea></div>
        ${noActions}
    </div>
    <dl class="kp-kv">
        <div class="kp-kv__row"><dt>Last answer</dt><dd><span class="kp-badge kp-badge--success">202 Accepted</span> in 84 ms, 19/10/2026 07:12</dd></div>
    </dl>
</div></div>`,
    }),
    section({
        id: 'tools',
        title: 'Three parts that now stand on the grid: tool rows, the refresh bar, a band',
        intro: 'A webhook&rsquo;s detail panel: the automatic refresh with Refresh now, the last payload in a code block and the template in a JSON field, each with its tools.',
        components: 'formgrid code json-field auto-refresh',
        changed:
            'Three package fixes the grid needed, reported by the HTTPSwitchboard and almanac threads. <b>Tool rows</b>: the code block&rsquo;s Wrap and Copy were 36 px high and the JSON field&rsquo;s tools and a command&rsquo;s Copy 28 px, so two tool rows on one page could not share a line; all three now take the small button&rsquo;s height. <b>The refresh bar</b> was a flex row, so &ldquo;Refresh now&rdquo; could not stand on a page&rsquo;s grid; it is a grid of three tracks (chooser, freshness, Refresh now), and inside the form grid it takes the control, value and actions columns. <b>A band of problems</b> (<code>.kp-attention</code>, <code>.kp-problems</code>) could not let a subgrid size through it; with <code>data-kp-subgrid</code> it can (not shown here: no problem is open).',
        grid: 'the same four columns; the refresh bar as one row (the chooser in the control column, &ldquo;updated &hellip; ago&rdquo; in the value column, Refresh now in the actions column); a Payload row and a Template row, each label in the label column and its block from the control edge to the end of the actions column (<code>data-kp-formgrid-span="wide"</code>).',
        expect: [
            '&ldquo;Refresh now&rdquo; stands in the actions column, its right edge on the right edge of the two blocks under it; the chooser starts on the control edge.',
            'The tools of the code block (Wrap, Copy) and of the JSON field are the same height.',
            'Both blocks start on the control edge and end on one right edge.',
        ],
        look: 'one right edge for Refresh now and both blocks; the two rows of tools one height.',
        body: `<div class="kp-card ag-card"><div class="kp-formgrid" id="ag-tools" aria-label="Webhook detail">
    <div class="kp-refresh" data-kp-refresh data-kp-refresh-default="30"></div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label" id="t-pay-l">Last payload</span>
        <div class="kp-formgrid__control" data-kp-formgrid-span="wide"><figure class="kp-code" data-kp-code data-kp-code-title="Payload" data-kp-code-language="JSON" aria-labelledby="t-pay-l"><pre><code>{"topic":"backup.done","title":"Photo library: offsite backup finished","ok":true,"took_s":680}</code></pre></figure></div>
    </div>
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="t-tpl">Template</label>
        <div class="kp-formgrid__control" data-kp-formgrid-span="wide"><textarea class="kp-field__input kp-mono" id="t-tpl" rows="4" data-kp-json>{"topic": "{{topic}}", "title": "{{title}}"}</textarea></div>
    </div>
</div></div>`,
    }),
    section({
        id: 'phone',
        title: 'The settings list at phone width',
        intro: 'The same settings as the first section in a frame as wide as a phone (360 px): every row reads top to bottom.',
        components: 'formgrid',
        changed:
            'New: the grid lays itself out by its own width, not the window&rsquo;s. Under 36rem every row is one column: the label, the control, the value under it and the Reset under that, all on one left edge. The controls keep their widths per kind: a field the whole width, a time, stepper or number one step.',
        grid: 'one column of 360 px; each row a stack of label, control, value, action, all starting on the frame&rsquo;s left edge; the Save row: the two buttons, then the note.',
        expect: [
            'Every label, control, value and Reset starts on one left edge; nothing scrolls sideways.',
            'The field and the select are the full width; the time, the stepper and the number end on one shorter edge.',
        ],
        look: 'one left edge for everything; the short controls end together.',
        body: `<div class="ag-phone"><div class="kp-card ag-card"><div class="kp-formgrid" id="ag-phone" data-kp-formgrid-lines="lines" aria-label="Offsite backup settings at phone width">${settingsRows('p')}
</div></div></div>`,
    }),
];

const body = sections.join('\n');
const pairs = sections.length * PAGE_THEMES.length;

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^aligngrid-[0-9a-f]{8}-/.test(current) ? current : `aligngrid-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>The form grid: forms, settings, facts and buttons on one grid</title>
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
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>The form grid: forms, settings, facts and buttons on one grid</h1>
                <p class="cat-intro">
                    You rejected seven settings sections for misalignment: a second column that was not uniform, rows off their labels, and
                    &ldquo;Send test&rdquo; off the line of &ldquo;Format&rdquo; and &ldquo;Minify&rdquo;. The package now has one layout for
                    all of these, <code>.kp-formgrid</code>: four columns, label, control, value and actions, that every row shares, so
                    things line up by construction rather than by care. ${pairs} sections, formal only; the content is made up. Every section
                    names its grid under <b>The grid</b>. The project threads move their own pages onto it once you approve it, and a new
                    measurement holds every demo to it.
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
