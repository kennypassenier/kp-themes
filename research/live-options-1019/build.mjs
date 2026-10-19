// Builds research/live-options-1019/demo.html: component options that were read once, when the component attached, and now follow
// their attribute at runtime (DEMO_RULES ch. 2: "a variant that could be a setting is a component option with a default,
// switchable at runtime"; Kenny, 2026-10-17 22:09), and the one refresh bug found beside them. Each section changes an approved
// component, so it comes back through the review dialog (ch. 7 and 9) with a plain "What changed" text. Formal only: nothing here
// looks different per theme.
//
//   1. refresh-look       the refresh chooser as segments or a menu                (js/auto-refresh.js)
//   2. refresh-paused     Refresh now, R and Retry now while the refresh is paused  (js/auto-refresh.js)
//   3. newpill-placement  the "N new lines" pill at the bottom or the top           (js/newpill.js)
//   4. sort-multi         sorting by several columns: off, Shift + click, every click (js/datatable.js)
//   5. filter-mode        filters as a panel or added one at a time                  (js/datatable.js)
//   6. lede-options       the lede's fold and its Learn more link                    (js/lede.js)
//   7. secret-options     a secret's time, reveal gesture and mask                   (js/patterns.js)
//   8. palette-match      how the palette matches what is typed                      (js/palette.js)
//   9. qr-retry           Retry on a code that could not be made                     (js/qr.js)
//  10. segmented-mode     one value or several in a segmented control                (js/segmented.js)
//
// Run: node research/live-options-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'live-options-1019';
const THEMES = ['formal'];

const esc = (/** @type {string} */ s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');

/**
 * One control group: buttons that set one attribute on the component (the very thing a page or the console does).
 * `value: null` takes the attribute away; a string sets it (the empty string sets it present and empty).
 * @param {{ label: string, target: string, attr: string, latent?: boolean, options: [string, string | null][] , on: number }} g
 */
const group = (g) =>
    `<div role="group" aria-label="${esc(g.label)}"${g.latent ? ' data-review-latent' : ''}><b>${g.label}:</b> ${g.options
        .map(
            ([label, value], i) =>
                `<button type="button" class="kp-button kp-button--sm" data-lo-target="${g.target}" data-lo-attr="${g.attr}"${value === null ? ' data-lo-remove' : ` data-lo-value="${esc(value)}"`} aria-pressed="${i === g.on}">${label}</button>`,
        )
        .join(' ')}</div>`;

/**
 * One section.
 * @param {{ id: string, topic: string, topicTitle?: string, title: string, intro: string, changed: string, expect: string[], look: string, components: string, stage: string, target: string, groups: Parameters<typeof group>[0][], after?: string }} s
 */
const section = (s) => `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-topic="${s.topic}"${s.topicTitle ? `\n    data-review-topic-title="${esc(s.topicTitle)}"` : ''}
    data-review-components="${s.components}"
    data-review-title="${esc(s.title)}"
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
        <p data-for="formal">${s.look}</p>
    </div>
    <div data-review-controls data-review-controls-for="${s.target}">
        ${s.groups.map(group).join('\n        ')}
    </div>
${s.stage}
${s.after ? `<p class="lo-readout" role="status">${s.after}</p>` : ''}
</section>`;

const LONG_LINK = `https://kp-soft.dev/invite/${'7Hq2xKd9'.repeat(250)}`;

const sections = [
    section({
        id: 'refresh-look',
        topic: 'refresh',
        topicTitle: 'Automatic refresh: look and Refresh now',
        title: 'Automatic refresh: segments or a menu',
        intro: 'The small control that says how often a page reloads its data, with &ldquo;updated 12 s ago&rdquo; beside it. It can show its choices as segments or as a menu.',
        changed:
            'Whether the choices were segments or a menu was decided once, when the control appeared; changing <code>data-kp-look</code> afterwards did nothing, so a page could not offer the person the other look. Now the control is drawn again with the look the attribute names, with the chosen interval, the countdown and the &ldquo;updated&rdquo; line kept. The choices (<code>data-kp-refresh-choices</code>), the stale time and a new <code>data-kp-refresh</code> follow their attributes the same way. Segments stay the default.',
        expect: [
            'The control opens as segments: <b>Paused</b>, <b>Every 15 s</b>, <b>Every 30 s</b> (chosen), <b>Every 1 min</b>, <b>Every 5 min</b>, <b>Other…</b>.',
            'Press <b>Menu</b> in the control group above the component: the same control is a single button <b>Every 30 s ▾</b> that opens the list; press <b>Segments</b> and the segments are back, still on 30 s.',
            'Press <b>Long choices</b>: the choices become 1, 5 and 15 minutes (30 s stays because it is the chosen one). The count under the component goes up by one every time the control asks for data (every 30 s, or at <b>Refresh now</b>).',
        ],
        look: 'the control keeps its width and height when it changes between segments and a menu, and the chosen interval is marked in both.',
        components: 'auto-refresh',
        target: 'lo-refresh',
        groups: [
            { label: 'Look', target: 'lo-refresh', attr: 'data-kp-look', options: [['Segments', 'segmented'], ['Menu', 'menu']], on: 0 },
            { label: 'Choices', target: 'lo-refresh', attr: 'data-kp-refresh-choices', options: [['Short', '0,15,30,60,300'], ['Long', '0,60,300,900']], on: 0 },
        ],
        stage: `<div class="kp-refresh" id="lo-refresh" data-kp-refresh="30" data-kp-look="segmented" data-kp-refresh-choices="0,15,30,60,300" data-lo-answers="refresh-look"></div>`,
        after: 'Data read <b data-lo-reads="refresh-look">0</b> times.',
    }),
    section({
        id: 'refresh-paused',
        topic: 'refresh',
        title: 'Automatic refresh: Refresh now while paused',
        intro: 'Paused means no refresh by itself. Pressing <b>Refresh now</b>, pressing R, or pressing <b>Retry now</b> after a failed refresh is the person asking, so it always refreshes.',
        changed:
            '<b>Refresh now</b>, the R key and <b>Retry now</b> did nothing while the control was paused: the refresh was skipped because no interval was set, so the person pressed a button that looked dead. Now a refresh the person asks for always runs, paused or not, and it no longer waits for an open dialog or a field you are typing in. Paused still means that nothing refreshes by itself. If such a refresh fails while paused, the note says only that it failed (&ldquo;Last refresh failed.&rdquo;) instead of promising a retry that will not come, and <b>Retry now</b> stays.',
        expect: [
            'The control opens on <b>Paused</b>. Press <b>Refresh now</b>: &ldquo;updating…&rdquo;, then &ldquo;updated just now&rdquo; and the count under the component goes up by one. Nothing else refreshes by itself.',
            'Press the R key (the focus not in a field): the same. Press <b>Every 30 s</b> in the group above the component and the control counts down by itself; press <b>Paused</b> and it stops.',
            'Press <b>Fails</b> and then <b>Refresh now</b>: the yellow note &ldquo;Last refresh failed.&rdquo; with <b>Retry now</b> under it. <b>Retry now</b> asks again (press <b>Answers</b> first to see it succeed).',
        ],
        look: 'the control shows updating and then updated while paused, and the failure note and Retry now keep their place in the control.',
        components: 'auto-refresh',
        target: 'lo-refresh-paused',
        groups: [
            { label: 'Interval', target: 'lo-refresh-paused', attr: 'data-kp-refresh', options: [['Paused', '0'], ['Every 30 s', '30']], on: 0 },
            { label: 'The app', target: 'lo-refresh-paused', attr: 'data-lo-app', latent: true, options: [['Answers', 'ok'], ['Fails', 'fail']], on: 0 },
        ],
        stage: `<div class="kp-refresh" id="lo-refresh-paused" data-kp-refresh="0" data-lo-app="ok" data-lo-answers="refresh-paused"></div>`,
        after: 'Data read <b data-lo-reads="refresh-paused">0</b> times. Last asked because: <b data-lo-why="refresh-paused">nothing yet</b>.',
    }),
    section({
        id: 'newpill-placement',
        topic: 'newpill',
        topicTitle: 'New lines pill',
        title: 'New lines pill: at the bottom or at the top',
        intro: 'A log that grows while it is read. When the reader has scrolled away from the newest line, a pill counts the lines that arrived and jumps back with one press.',
        changed:
            'Where the pill stood (the bottom edge, or the top for a list that grows at the top) was read once; changing <code>data-kp-pill-placement</code> afterwards left the pill where it was. Now the pill moves as soon as the attribute changes. With no attribute it still stands at the end the rows arrive at.',
        expect: [
            'The log is scrolled to its oldest line; three lines have arrived out of sight and the pill says <b>3 new lines</b> with &ldquo;back to the tail&rdquo; at the bottom of the log.',
            'Press <b>Top</b>: the same pill stands at the top edge of the log, with the same words. Press <b>Bottom</b> to move it back. Press <b>Add 3 lines</b> under the log: the count goes up to 6 in whichever place the pill stands.',
            'Press the pill: the log jumps to its newest line and the pill goes away.',
        ],
        look: 'the pill sits on the edge the attribute names, fully inside the log, clear of the lines under it.',
        components: 'newpill',
        target: 'lo-newpill',
        groups: [{ label: 'Pill', target: 'lo-log', attr: 'data-kp-pill-placement', options: [['Bottom', 'bottom'], ['Top', 'top']], on: 0 }],
        stage: `<div id="lo-newpill" data-kp-newpill-host class="lo-logbox"><ol class="lo-log" id="lo-log" tabindex="0" aria-label="Log" data-kp-follow="tail" data-kp-pill-placement="bottom" data-kp-pill-unit="line,lines"></ol></div>`,
        after: '<button type="button" class="kp-button kp-button--sm" data-lo-add-lines>Add 3 lines</button>',
    }),
    section({
        id: 'sort-multi',
        topic: 'datatable',
        topicTitle: 'Data table: sorting and filters',
        title: 'Data table: sorting by several columns',
        intro: 'A table sorted on one column. It can also sort on several: the header numbers the sort keys, and a summary line says which they are.',
        changed:
            'Sorting by several columns (<code>data-kp-sort-multi</code>: off, Shift + click adds a key, or every click adds a key) was read once when the table appeared; changing the attribute afterwards did nothing. Now the table follows it: the sort summary and the numbers on the headers appear or go, and a click works the way the attribute says. The table keeps its sort, search, filters, page and selection while it switches (the keys beyond the first are dropped when it goes to off). It still starts with one sort key and no summary unless the page asks.',
        expect: [
            'The table opens sorted by <b>Status</b> and then by <b>Size</b>: the headers carry the numbers 1 and 2, and the line above the rows says <b>Sorted by Status low to high, then Size (GB) high to low</b>, with <b>Reset the sort</b> beside it.',
            'Press <b>Off</b>: the numbers go and the line says <b>Sorted by Status low to high</b>; the table stays sorted by Status. Press <b>Every click</b>: a plain click on a header adds that column as a key (the numbers and the line follow); <b>Shift + click</b> sorts on it alone. Press <b>Shift + click</b>: only Shift adds a key.',
        ],
        look: 'the sort numbers sit clear of the header words, and the summary line keeps the table in place while it appears and goes.',
        components: 'datatable',
        target: 'lo-sort',
        groups: [{ label: 'Several columns', target: 'lo-sort', attr: 'data-kp-sort-multi', options: [['Off', 'false'], ['Shift + click', ''], ['Every click', 'click']], on: 1 }],
        stage: `<div class="kp-datatable" id="lo-sort" data-kp-datatable data-kp-sort-multi data-kp-page-size="10" data-kp-page-sizes="none" data-lo-table="sort">
    <div class="kp-table-wrap">
        <table class="kp-table">
            <caption class="kp-sr-only">Stacks</caption>
            <thead><tr>
                <th scope="col" data-kp-sort="text">Stack</th>
                <th scope="col" data-kp-sort="text" data-kp-sort-order="Healthy,Degraded,Stopped">Status</th>
                <th scope="col" data-kp-sort="number">Size (GB)</th>
            </tr></thead>
            <tbody>
                <tr><td>jellyfin</td><td>Healthy</td><td>48</td></tr>
                <tr><td>immich</td><td>Degraded</td><td>212</td></tr>
                <tr><td>gateway</td><td>Healthy</td><td>2</td></tr>
                <tr><td>vault</td><td>Stopped</td><td>9</td></tr>
                <tr><td>grafana</td><td>Healthy</td><td>14</td></tr>
                <tr><td>kuma</td><td>Degraded</td><td>1</td></tr>
                <tr><td>loki</td><td>Healthy</td><td>96</td></tr>
            </tbody>
        </table>
    </div>
</div>`,
    }),
    section({
        id: 'filter-mode',
        topic: 'datatable',
        title: 'Data table: filters as a panel or added one at a time',
        intro: 'A table with filters on two columns. The filters can sit in a panel that shows all of them, or be added one by one with &ldquo;+ Add filter&rdquo; and shown as pills.',
        changed:
            'How the filters are set (<code>data-kp-filter-mode</code>: a <b>panel</b> of every filter, or <b>add</b>, one pill per filter) was read once when the table appeared; changing the attribute afterwards did nothing. Now the table follows it and keeps the filters, the search, the sort and the page it had, so a filter set in the panel is a pill after the switch and the other way round. The panel stays the default.',
        expect: [
            'The table opens with the panel: a <b>Filters</b> button, the panel open with the Status and Site checkboxes, and <b>Status: Healthy</b> ticked; the table shows the healthy stacks.',
            'Press <b>Added one at a time</b>: the panel goes, a <b>+ Add filter</b> button and a pill <b>Status: Healthy</b> take its place; the same rows show. Remove the pill with its ×, or open <b>+ Add filter</b> and add Site.',
            'Press <b>Panel</b> again: the panel is back with the boxes as the pills left them.',
        ],
        look: 'the filter bar changes in place without the table jumping, and the rows shown stay the same through the switch.',
        components: 'datatable',
        target: 'lo-filter',
        groups: [{ label: 'Filters', target: 'lo-filter', attr: 'data-kp-filter-mode', options: [['Panel', 'panel'], ['Added one at a time', 'add']], on: 0 }],
        stage: `<div class="kp-datatable" id="lo-filter" data-kp-datatable data-kp-filter-mode="panel" data-kp-filters-open data-kp-page-size="10" data-kp-page-sizes="none">
    <div class="kp-table-wrap">
        <table class="kp-table">
            <caption class="kp-sr-only">Stacks</caption>
            <thead><tr>
                <th scope="col" data-kp-sort="text">Stack</th>
                <th scope="col" data-kp-sort="text" data-kp-filter="choice" data-kp-filter-options="Healthy,Degraded,Stopped" data-kp-filter-value="Healthy">Status</th>
                <th scope="col" data-kp-sort="text" data-kp-filter="choice" data-kp-filter-options="CT 106,CT 109,CT 112">Site</th>
            </tr></thead>
            <tbody>
                <tr><td>jellyfin</td><td>Healthy</td><td>CT 106</td></tr>
                <tr><td>immich</td><td>Degraded</td><td>CT 106</td></tr>
                <tr><td>gateway</td><td>Healthy</td><td>CT 109</td></tr>
                <tr><td>vault</td><td>Stopped</td><td>CT 112</td></tr>
                <tr><td>grafana</td><td>Healthy</td><td>CT 109</td></tr>
                <tr><td>kuma</td><td>Degraded</td><td>CT 112</td></tr>
                <tr><td>loki</td><td>Healthy</td><td>CT 106</td></tr>
            </tbody>
        </table>
    </div>
</div>`,
    }),
    section({
        id: 'lede-options',
        topic: 'lede',
        topicTitle: 'Lede',
        title: 'Lede: fold a long text and add a Learn more link',
        intro: 'The short paragraph under a heading. A long one can fold behind <b>More</b>, and a link adds <b>Learn more</b> at its end.',
        changed:
            'Whether a lede folds (<code>data-kp-lede-collapsible</code>) and whether it carries a Learn more link (<code>data-kp-lede-link</code>) was read once when the page loaded; changing either afterwards did nothing. Now the lede is drawn again as soon as an attribute changes: it folds or unfolds, and the link appears at the end, after the folded part, or goes. The text itself is never changed.',
        expect: [
            'The lede opens folded: the first two sentences, a <b>More</b> button under it. <b>More</b> opens the rest and becomes <b>Less</b>.',
            'Press <b>Learn more link</b>: <b>Learn more</b> stands at the very end of the text (after the folded part). Press <b>No fold</b>: the whole text shows with the link at its end and no More button. Press <b>Fold</b> to fold it again.',
            'Press <b>No link</b>: the link goes and the text is as it was.',
        ],
        look: 'the lede keeps its place under the heading; the More button and the link stand on their own lines or at the end of the text, with air round them.',
        components: 'lede',
        target: 'lo-lede',
        groups: [
            { label: 'Fold', target: 'lo-lede-text', attr: 'data-kp-lede-collapsible', options: [['Fold', '100'], ['No fold', null]], on: 0 },
            { label: 'Link', target: 'lo-lede-text', attr: 'data-kp-lede-link', options: [['No link', null], ['Learn more link', 'https://example.com/help/backups']], on: 0 },
        ],
        stage: `<div id="lo-lede"><h3 class="kp-fw-semibold" id="lo-lede-h">Backups</h3><p class="kp-lede" id="lo-lede-text" data-kp-lede-collapsible="100">Backups are made every night at 03:00 and kept for thirty days. A backup that fails is tried again an hour later, and a second failure sends a message to the person on duty. Restoring is always done from the newest backup that passed its check, never from one that was only copied.</p></div>`,
    }),
    section({
        id: 'secret-options',
        topic: 'secret',
        topicTitle: 'Secret field',
        title: 'Secret field: how long, how to reveal, how long the mask',
        intro: 'A token shown as dots. Reveal shows it for a few seconds and then hides it again; Copy copies it without showing it.',
        changed:
            'How long a revealed secret stays (<code>data-kp-secret-ttl</code>), whether it shows by a press or only while the button is held (<code>data-kp-secret-reveal-on</code>) and how long the mask of dots is (<code>data-kp-secret-mask</code>) were read once when the field appeared; changing them afterwards did nothing. Now they apply at once: a new time restarts the count of a shown value, a change of gesture hides a shown value first (so a held reveal never stays open), and a new mask is drawn at once while the value is hidden. The value is still never in the page while hidden.',
        expect: [
            'The field opens as 16 dots with <b>Reveal</b> and <b>Copy</b>. Press <b>Reveal</b>: the token shows and the line under it counts down from 30 s.',
            'While it shows, press <b>10 s</b>: the count starts again from 10. Press <b>Until hidden</b>: no count, the token stays until <b>Hide</b> is pressed.',
            'Press <b>Hold</b>: the button says <b>Hold to reveal</b> and the token shows only while the button is held. Press <b>8 dots</b> or <b>16 dots</b>: the mask changes length at once.',
        ],
        look: 'the mask, the token and the buttons keep their place when the options change, and the countdown line keeps its height.',
        components: 'secret',
        target: 'lo-secret',
        groups: [
            { label: 'Time shown', target: 'lo-secret', attr: 'data-kp-secret-ttl', options: [['10 s', '10'], ['30 s', '30'], ['Until hidden', '0']], on: 1 },
            { label: 'Reveal', target: 'lo-secret', attr: 'data-kp-secret-reveal-on', options: [['Press', null], ['Hold', 'hold']], on: 0 },
            { label: 'Mask', target: 'lo-secret', attr: 'data-kp-secret-mask', options: [['8 dots', '8'], ['16 dots', '16']], on: 1 },
        ],
        stage: `<div class="kp-secret" id="lo-secret" data-kp-secret data-kp-secret-label="API token of home-assistant" data-kp-secret-ttl="30" data-kp-secret-mask="16" data-kp-secret-value="kp_live_9f3c7a1d52b84e60a7c1"></div>`,
    }),
    section({
        id: 'palette-match',
        topic: 'palette',
        topicTitle: 'Command palette',
        title: 'Command palette: how typing is matched',
        intro: 'The list of commands under the search field. It can find words in any order, a piece from the middle of a name, the start of a name, or letters in order.',
        changed:
            'How a palette matches what is typed (<code>data-kp-match</code>: words in any order, a piece of the name, the start of the name, or letters in order) was read once when the palette appeared; changing the attribute afterwards did nothing. Now the palette follows it at once: the commands, their order and the marks are given back and drawn again for what is already typed. Words in any order stays the default.',
        expect: [
            'The palette opens on <b>Words in any order</b> with <b>gate rest</b> typed: <b>Restart gateway</b> is the only answer, its words ruled under.',
            'Press <b>Middle of the name</b> in the Match group and then the query <b>tart gate</b>: only that match finds <b>Restart gateway</b>. Press <b>Letters in order</b> with the query <b>rgw</b>: it finds it too, but words in any order and the start of the name do not.',
            'The line under the search says how many commands match, and shows nothing but the empty message when none do.',
        ],
        look: 'the list and the status line change in place for the same typed text, the marks appear only with words in any order, and the palette keeps its size.',
        components: 'palette',
        target: 'lo-palette-stage',
        groups: [
            { label: 'Match', target: 'lo-palette', attr: 'data-kp-match', options: [['Words in any order', 'intent'], ['Middle of the name', 'substring'], ['Start of the name', 'prefix'], ['Letters in order', 'subsequence']], on: 0 },
            { label: 'Typed', target: 'lo-palette', attr: 'data-lo-query', options: [['gate rest', 'gate rest'], ['tart gate', 'tart gate'], ['rgw', 'rgw'], ['Rest', 'Rest']], on: 0 },
        ],
        stage: `<div class="lo-stage lo-stage--palette" id="lo-palette-stage">
    <dialog class="kp-palette" id="lo-palette" data-kp-palette data-kp-match="intent" data-kp-nomatch="plate" data-kp-hotkey="none" data-kp-close-on-run="false" aria-label="Commands" open>
        <input class="kp-palette__input" type="text" role="combobox" aria-label="Commands" aria-expanded="true" aria-controls="lo-palette-list" autocomplete="off" placeholder="Type a command or a page…" />
        <ul class="kp-palette__list" id="lo-palette-list" role="listbox" aria-label="Commands">
            <li role="presentation" class="kp-palette__group" data-kp-group>
                <span class="kp-palette__group-label">Do</span>
                <ul role="group" aria-label="Do">
                    <li class="kp-palette__option" role="option" data-kp-option data-value="restart-gateway">Restart gateway<span class="kp-palette__description">Stop and start every container</span></li>
                    <li class="kp-palette__option" role="option" data-kp-option data-value="restart-jellyfin">Restart jellyfin<span class="kp-palette__description">Stop and start every container</span></li>
                    <li class="kp-palette__option" role="option" data-kp-option data-value="update-gateway">Update gateway<span class="kp-palette__description">Pull the newest images</span></li>
                </ul>
            </li>
            <li role="presentation" class="kp-palette__group" data-kp-group>
                <span class="kp-palette__group-label">Go to</span>
                <ul role="group" aria-label="Go to">
                    <li class="kp-palette__option" role="option" data-kp-option data-value="go-overview">Overview</li>
                    <li class="kp-palette__option" role="option" data-kp-option data-value="go-backups">Backups</li>
                    <li class="kp-palette__option" role="option" data-kp-option data-value="go-gateway">Open the page of gateway</li>
                </ul>
            </li>
        </ul>
        <p class="kp-palette__status kp-sr-only" role="status" data-kp-palette-status></p>
    </dialog>
</div>`,
    }),
    section({
        id: 'qr-retry',
        topic: 'qr',
        topicTitle: 'QR code',
        title: 'QR code: Retry when the code could not be made',
        intro: 'A link shown as a QR code. A link that is too long cannot be made into a code; the code can then offer <b>Retry</b> so the app can give a shorter link.',
        changed:
            'Whether a code that could not be made offers <b>Retry</b> (<code>data-kp-qr-retry</code>) was read once, on the first drawing, because that one attribute was missing from the list the code watches; adding or taking it away did nothing until the page called <code>setQr</code> again. Now it is drawn again as soon as the attribute changes, like every other option of the code.',
        expect: [
            'The link here is too long for a code: the plate says so, with no button on it.',
            'Press <b>Offered</b>: <b>Retry</b> appears on the plate. Press it: the line under the component counts it, and this page answers with a short link, so the code is drawn. Press <b>Make it too long again</b> to start over.',
            'Press <b>Not offered</b>: the button goes again (the code must be in its error state to show it).',
        ],
        look: 'the plate keeps its size when Retry appears and goes, and Retry is a normal-size button centred under the words.',
        components: 'qr',
        target: 'lo-qr',
        groups: [{ label: 'Retry', target: 'lo-qr', attr: 'data-kp-qr-retry', options: [['Not offered', null], ['Offered', '']], on: 0 }],
        stage: `<div class="kp-qr" id="lo-qr" data-kp-qr data-kp-qr-ecc="H" data-kp-qr-label="Invitation link" data-kp-qr-value="${LONG_LINK}"></div>`,
        after: 'Retry pressed <b data-lo-retries>0</b> times. <button type="button" class="kp-button kp-button--sm" data-lo-qr-reset>Make it too long again</button>',
    }),
    section({
        id: 'segmented-mode',
        topic: 'segmented',
        topicTitle: 'Segmented control',
        title: 'Segmented control: one value or several',
        intro: 'A row of choices. In one mode a single value is on, like radio buttons; in the other any number can be on, and none on means all.',
        changed:
            'Whether a segmented control chooses one value or several (<code>data-kp-segmented</code>: <code>single</code> or <code>multi</code>) was read once when the control appeared; changing the attribute afterwards left the roles and states of the single mode in place. Now the control is written the way the new mode reads it: the group and the segments get the right roles and states, the values that were on stay on (a single control keeps the first of several), and in the several mode the All segment is pressed while nothing else is.',
        expect: [
            'The control opens in one-value mode with <b>All</b> chosen. Press <b>Running</b>: only Running is on, as a radio button.',
            'Press <b>Several values</b> in the group above: Running stays on, and All is no longer pressed. Press <b>Failed</b> as well: both are on; press <b>All</b> and both go off. The line under the control lists what is on.',
            'Press <b>One value</b> again: with several on, the first stays; with none on, All is chosen. The arrow keys move and choose in this mode, and only move in the other.',
        ],
        look: 'the plate under the chosen segment follows the choice in one-value mode and goes in several-value mode; the segments keep their width.',
        components: 'segmented',
        target: 'lo-seg',
        groups: [{ label: 'Choose', target: 'lo-seg', attr: 'data-kp-segmented', options: [['One value', 'single'], ['Several values', 'multi']], on: 0 }],
        stage: `<div class="kp-segmented" id="lo-seg" data-kp-segmented="single" role="radiogroup" aria-label="Show stacks">
    <button type="button" class="kp-segmented__item" role="radio" aria-checked="true" data-value="all" data-kp-segmented-all><span class="kp-segmented__label">All</span></button>
    <button type="button" class="kp-segmented__item" role="radio" aria-checked="false" data-value="running"><span class="kp-segmented__label">Running</span></button>
    <button type="button" class="kp-segmented__item" role="radio" aria-checked="false" data-value="stopped"><span class="kp-segmented__label">Stopped</span></button>
    <button type="button" class="kp-segmented__item" role="radio" aria-checked="false" data-value="failed"><span class="kp-segmented__label">Failed</span></button>
</div>`,
        after: 'On now: <b data-lo-values="lo-seg">All</b>',
    }),
];

const body = sections.join('\n');

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^live-options-[0-9a-f]{8}-/.test(current) ? current : `live-options-${randomUUID()}`;
const pairs = THEMES.length * sections.length;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Options that follow their attribute at runtime, and Refresh now while paused</title>
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
                <h1>Options that follow their attribute at runtime</h1>
                <p class="cat-intro">
                    A choice a page could make with an attribute (segments or a menu, where a pill stands, how a table sorts, how a palette matches)
                    was read once, when the component appeared, so changing the attribute later did nothing. Your rule (17/10) is that such a
                    variant is an option with a default that switches at runtime. These ten components now do, and the refresh control also stops
                    ignoring <b>Refresh now</b>, the R key and <b>Retry now</b> while it is paused. ${pairs} pairs in all, formal only. In each section the
                    buttons above the component set the very attribute a page would set; the component follows at once, and the line under it
                    shows the effect. Each section says under <b>What changed since you approved it</b> what was wrong and what is different now.
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
