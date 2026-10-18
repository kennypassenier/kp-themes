// Checks, in Firefox, that the review kit keeps every verdict Kenny gives on a demo page (Kenny, 2026-10-17: "ik moet
// altijd honderd procent absoluut zeker zijn dat mijn beoordelingen vastgelegd worden, wat ik ook doe op die site, tot
// het moment dat ik effectief mijn beoordelingen hier paste"; correction lost-answer-1017).
//
// It is a measuring script, not a test: it runs before a round is put on the Agenda, next to measure-gaps.mjs, and
// prints one line per fault (exit code 1), or `clear`.
//
// 1. Every step of the dialog: one row per shown section, every row belongs to a shown section, every row has its
//    "Not approved" box and its note, and its choice ticks when the section asks a choice; the kit's own integrity
//    banner stays hidden.
//    The tools bar (previous version, play open and close) is absent, taking no space, when nothing in it applies.
// 2. A "Not approved" with a note on the first and the last row of the first step, the page reloaded: both still there.
// 3. The page republished with a new round id that lists the old one as received (the page is intercepted, nothing
//    on disk changes): the journal still holds both notes, and the Agenda says the answer was received.
//
// Run (a static server on the repository root first):
//   node research/_review/check-kit.mjs <port> <research/topic/demo.html>
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const [port, path] = process.argv.slice(2);
if (!port || !path) {
    console.error('usage: node research/_review/check-kit.mjs <port> <research/topic/demo.html>');
    process.exit(2);
}
const ORIGIN = `http://127.0.0.1:${port}`;
const URL_ = `${ORIGIN}/${path}`;
/** @type {string[]} */
const faults = [];
const fault = (/** @type {string} */ line) => faults.push(line);

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
const context = await browser.newContext({ viewport: { width: 1600, height: 950 } });
const page = await context.newPage();
/** True while the page is left for another: a module still loading then is cut off, which is no fault of the page. */
let leaving = false;
page.on('pageerror', (error) => {
    if (leaving && /dynamically imported module/.test(error.message)) return;
    fault(`page error: ${error.message}`);
});
/** Goes to `url`, the page left behind allowed to cut its loading short. @param {string} url */
async function go(url) {
    leaving = true;
    const response = await page.goto(url);
    // A page that is not there must never read as clear: another server on the same port once answered 404 and
    // every measurement said clear [port-1017].
    // 304 is the server saying the cached copy stands (the second visit of a page), not a missing page.
    if (!response || !(response.ok() || response.status() === 304))
        throw new Error(`${url} answered ${response ? response.status() : 'nothing'}; is this worktree's server on that port?`);
    await page.waitForLoadState('load');
    leaving = false;
}

/** Opens the page and its dialog at the first open step. */
async function openDialog() {
    await go(URL_);
    await page.waitForSelector('[data-rv-open]');
    await page.waitForTimeout(800);
    await page.click('[data-rv-open]');
    await page.waitForSelector('dialog.rv-dialog[open] [data-rv-list] .rv-row', { timeout: 15000 });
    await page.waitForTimeout(800);
}

/** What the step on screen shows: its sections, its rows and what each row carries. */
const readStep = () =>
    page.evaluate(() => {
        const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('dialog.rv-dialog'));
        const stage = /** @type {HTMLElement} */ (dialog.querySelector('[data-rv-stage]'));
        const keyOf = (/** @type {string} */ key) => key.replace(/[^a-z0-9-]/gi, '-');
        const shown = [...stage.querySelectorAll('[data-rv-pair]')]
            .filter((el) => !el.parentElement?.closest('[data-rv-pair]'))
            .map((el) => /** @type {HTMLElement} */ (el).dataset.rvPair || '');
        const aspect = !(/** @type {HTMLElement} */ (dialog.querySelector('[data-rv-flip-bar]')).hidden);
        const rows = [...dialog.querySelectorAll('[data-rv-list] .rv-row')].map((row) => {
            const box = /** @type {HTMLInputElement | null} */ (row.querySelector('input[type="checkbox"][data-rv-reject]'));
            const at = box?.getBoundingClientRect();
            const name = row.querySelector('[data-rv-jump]')?.getBoundingClientRect();
            return {
                key: /** @type {HTMLElement} */ (row).dataset.rvKey ?? null,
                boxX: at ? Math.round(at.left) : null,
                underName: Boolean(at && name && at.top >= name.bottom - 1),
                id: box?.id.replace(/^rv-/, '') || '',
                title: row.querySelector('[data-rv-jump]')?.textContent?.trim() || '',
                box: Boolean(box),
                note: Boolean(row.querySelector('textarea[data-rv-row-note]')),
                choices: Object.fromEntries(
                    [...row.querySelectorAll('fieldset[data-rv-choice]')].map((set) => [
                        /** @type {HTMLElement} */ (set).dataset.rvChoice,
                        set.querySelectorAll('input[type="radio"]').length,
                    ]),
                ),
            };
        });
        /** The choices a section asks in a theme, from its own markup: id → number of options. */
        const asked = (/** @type {string} */ key) => {
            const [theme, item] = key.split('|');
            const section = document.querySelector(`[data-review-item="${CSS.escape(item ?? '')}"]`);
            if (!section || theme === 'catalogue' || aspect) return {};
            let choices = [];
            try {
                choices = JSON.parse(/** @type {HTMLElement} */ (section).dataset.reviewChoices || '[]');
            } catch {
                // A choice set that is not valid JSON would silently show no choices (defaults-1017).
                return { '__invalid-json': -1 };
            }
            const fixed = (/** @type {any} */ c) => (typeof c.fixed === 'object' && c.fixed ? Boolean(c.fixed[theme]) : Boolean(c.fixed));
            return Object.fromEntries(choices.filter((c) => !fixed(c)).map((c) => [c.id, c.options.length]));
        };
        const banner = /** @type {HTMLElement | null} */ (dialog.querySelector('[data-rv-integrity]'));
        // The tools bar (block-tools.js) shows only what applies: a bar with nothing in it is absent and takes no space
        // (Kenny, 2026-10-18 00:28).
        const bars = [...dialog.querySelectorAll('.rv-tools')].map((bar) => {
            const box = bar.getBoundingClientRect();
            const shownButtons = [...bar.querySelectorAll('[data-rv-previous], [data-rv-loop]')].filter((b) => b.getClientRects().length > 0);
            return {
                hidden: /** @type {HTMLElement} */ (bar).hidden,
                height: Math.round(box.height),
                parts: shownButtons.length,
                label: bar.getAttribute('aria-label') || '',
            };
        });
        return {
            bars,
            title: dialog.querySelector('[data-rv-title]')?.textContent || '',
            position: dialog.querySelector('[data-rv-position]')?.textContent || '',
            shown: shown.map((key) => ({ key, id: keyOf(key), asked: asked(key) })),
            rows,
            banner: banner && !banner.hidden ? banner.textContent : '',
        };
    });

/** Every fault of the step on screen. */
async function checkStep() {
    const step = await readStep();
    const where = step.title || step.position;
    const rowIds = step.rows.map((row) => row.id);
    for (const section of step.shown) {
        const count = rowIds.filter((id) => id === section.id).length;
        if (count !== 1) fault(`${where}: section ${section.key} has ${count} rows`);
        const keyed = step.rows.filter((row) => row.key !== null);
        if (keyed.length && keyed.filter((row) => row.key === section.key).length !== 1)
            fault(`${where}: section ${section.key} has no row filed under its own key`);
        const row = step.rows.find((r) => r.id === section.id);
        if (!row) continue;
        if (!row.box) fault(`${where}: the row of ${section.key} has no "Not approved" box`);
        if (!row.note) fault(`${where}: the row of ${section.key} has no note`);
        for (const [choice, options] of Object.entries(section.asked)) {
            if (choice === '__invalid-json') {
                fault(`${where}: the data-review-choices of ${section.key} is not valid JSON, so the dialog shows no choices`);
                continue;
            }
            if (row.choices[choice] !== options)
                fault(`${where}: the row of ${section.key} shows ${row.choices[choice] ?? 0} of the ${options} ticks of choice ${choice}`);
        }
    }
    for (const row of step.rows)
        if (!step.shown.some((section) => section.id === row.id)) fault(`${where}: row "${row.title}" belongs to no shown section`);
    if (step.rows.length !== step.shown.length) fault(`${where}: ${step.rows.length} rows for ${step.shown.length} shown sections`);
    // Every row's "Not approved" box under its own section's name, in one column: a box beside a short name and under a
    // long one made a neighbour's box read as this row's (kpadopt4-cooking, 2026-10-17: a note meant for the timers was
    // typed in the checklist's row).
    const xs = step.rows.map((row) => row.boxX).filter((x) => x !== null);
    if (xs.length > 1 && Math.max(...xs) - Math.min(...xs) > 2)
        fault(
            `${where}: the "Not approved" boxes do not stand in one column (x ${Math.min(...xs)} to ${Math.max(...xs)} px), so a box can read as another row's`,
        );
    for (const row of step.rows) if (row.box && !row.underName) fault(`${where}: the "Not approved" box of "${row.title}" is not under its name`);
    for (const bar of step.bars) {
        if (bar.hidden && bar.height > 0) fault(`${where}: the hidden tools bar "${bar.label}" still takes ${bar.height} px`);
        if (!bar.hidden && bar.parts === 0) fault(`${where}: the tools bar "${bar.label}" is shown with nothing in it`);
    }
    if (step.banner) fault(`${where}: the dialog's integrity banner says: ${step.banner}`);
    return step;
}

// ---------------------------------------------------------------- 1 · every step
await openDialog();
const demo = await page.evaluate(() => document.documentElement.dataset.review || '');
const total = Number((await readStep()).position.match(/Step \d+\/(\d+)/)?.[1] || 1);
for (let at = 0; at < total; at++) {
    const before = (await readStep()).position;
    await checkStep();
    if (at === total - 1) break;
    await page.click('dialog.rv-dialog [data-rv-go="1"]');
    await page.waitForFunction((was) => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent !== was, before, {
        timeout: 15000,
    });
    await page.waitForTimeout(700);
}

// ---------------------------------------------------------------- 2 · a reload keeps a note on the first and last row
await openDialog();
const first = await readStep();
const ends = [...new Set([first.rows[0]?.id, first.rows.at(-1)?.id])].filter(Boolean);
const NOTE = (/** @type {number} */ i) => `check-kit note ${i + 1} ${Date.now() % 100000}`;
/** @type {Record<string, string>} */
const written = {};
for (const [i, id] of ends.entries()) {
    const row = page.locator(`dialog.rv-dialog [data-rv-list] .rv-row:has(#rv-${id})`);
    await row.locator('[data-rv-reject]').check();
    const note = row.locator('[data-rv-row-note]');
    await note.click();
    written[id] = NOTE(i);
    await page.keyboard.type(written[id], { delay: 5 });
}
// The journal writes a note after a short pause in the typing.
await page.waitForTimeout(1500);
await openDialog();
// The dialog reopens at the first OPEN step; a step whose every row is now marked is judged, so walk back to it.
for (let i = 0; i < total && (await readStep()).position !== first.position; i++) {
    const was = (await readStep()).position;
    await page.click('dialog.rv-dialog [data-rv-go="-1"]');
    await page.waitForFunction((w) => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent !== w, was, { timeout: 15000 });
    await page.waitForTimeout(500);
}
const again = await page.evaluate(
    (ids) =>
        ids.map((id) => {
            const box = /** @type {HTMLInputElement | null} */ (document.querySelector(`dialog.rv-dialog #rv-${CSS.escape(id)}`));
            const row = box?.closest('.rv-row');
            return {
                id,
                there: Boolean(row),
                checked: Boolean(box?.checked),
                note: /** @type {HTMLTextAreaElement | null} */ (row?.querySelector('[data-rv-row-note]'))?.value ?? '',
            };
        }),
    ends,
);
for (const row of again) {
    if (!row.there) fault(`after a reload: the row ${row.id} is gone from the first step`);
    else if (!row.checked) fault(`after a reload: the row ${row.id} is no longer "Not approved"`);
    if (row.there && row.note !== written[row.id]) fault(`after a reload: the note of ${row.id} reads "${row.note}", not "${written[row.id]}"`);
}

// ---------------------------------------------------------------- 3 · a new round that lists this one as received
const round = await page.evaluate(() => {
    try {
        return JSON.parse(document.querySelector('script[data-review-round]')?.textContent || 'null');
    } catch {
        return null;
    }
});
const now = round?.round || '';
const next = { ...(round || {}), round: `${now || 'r0'}-kitcheck`, received: [...(round?.received || []), now].filter(Boolean) };
await context.route(URL_, async (route) => {
    const response = await route.fetch();
    let html = await response.text();
    const script = `<script type="application/json" data-review-round>${JSON.stringify(next)}</script>`;
    html = /<script type="application\/json" data-review-round>[\s\S]*?<\/script>/.test(html)
        ? html.replace(/<script type="application\/json" data-review-round>[\s\S]*?<\/script>/, script)
        : html.replace(/<script type="module" src="[^"]*_review\/review\.js"><\/script>/, (tag) => `${script}\n${tag}`);
    await route.fulfill({ response, body: html });
});
await go(URL_);
await page.waitForSelector('[data-rv-open]');
await page.waitForTimeout(1500);
const journal = await page.evaluate((id) => {
    try {
        return JSON.parse(localStorage.getItem(`kp-demo-review:${id}:journal`) || '[]');
    } catch {
        return [];
    }
}, demo);
for (const [id, text] of Object.entries(written)) {
    const key = first.shown.find((section) => section.id === id)?.key || id;
    if (!journal.some((entry) => entry?.pair === key && entry?.note === text)) fault(`new round ${next.round}: the journal lost the note on ${key}`);
}
await go(`${ORIGIN}/catalogue/agenda.html`);
await page.waitForTimeout(2500);
// The drop is noted as data (progress.js, noteReceived); the Agenda shows no notice and asks for no click.
const noted = await page.evaluate(() => {
    try {
        return JSON.parse(localStorage.getItem('kp-demo-review:received-log') || '[]');
    } catch {
        return [];
    }
});
if (!noted.some((entry) => entry?.demo === demo)) fault(`new round ${next.round}: the received log does not note the answer of ${demo} ${now}`);
if (await page.evaluate(() => Boolean(document.querySelector('[data-agenda-received], [data-agenda-received-seen]'))))
    fault('the Agenda shows a received notice or a Seen button');

await browser.close();
console.log(`${path}: ${faults.length ? `${faults.length} fault(s)` : 'clear'}`);
for (const line of [...new Set(faults)]) console.log(`  ${line}`);
process.exit(faults.length ? 1 : 0);
