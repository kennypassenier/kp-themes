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
//    Controls stand AT their component (Kenny, 2026-10-18 07:09: "Die controls moeten niet gewoon meer boven staan, maar
//    enkel de geschikte control per component zoals die tevoorschijn komt"): there is no controls bar on top; every
//    control group the dialog shows belongs to a shown section and names the component of that section it drives
//    (`data-review-controls-for`); it stands directly above that component (a gap of at most 48 px, the same
//    column), and the component starts within 480 px of the section's top, so the component is the first thing on
//    screen; a component has at most MAX_GROUPS control groups (Kenny, 2026-10-18 07:11: "als er zoveel rijen zijn,
//    dan is het ook een indicator dat er teveel items op die pagina staan"): more means the section is split; and a
//    control group outside every section, or in a section that is not shown, is shown nowhere.
// 2. A "Not approved" with a note on the first and the last row of the first step, the page reloaded: both still there.
// 3. The page republished with a new round id that lists the old one as received (the page is intercepted, nothing
//    on disk changes): the journal still holds both notes, and the Agenda says the answer was received.
//
// 4. The dialog's layout (Kenny, 2026-10-18 15:15: "99% fullscreen ... maximum coverage and use of the screen"). At every
//    width (1920x1080, 1280x800, 390x844) the dialog and the page have no horizontal scroll. With the layout options on
//    (`--rvui all`, or a list such as `--rvui fill,look`; they are off by default, so a live part is judged as before):
//    `fill`: the dialog uses at least 97% of the viewport's width and height; `look`: no look-at paragraph appears twice
//    in a step's rows; and at 1920x1080 the component of the first section starts within the first 40% of the dialog's
//    height, so the component is what the reviewer sees first.
//
// Run (a static server on the repository root first):
//   node research/_review/check-kit.mjs <port> <research/topic/demo.html> [--rvui all|fill,look,...]
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const args = process.argv.slice(2);
const flagAt = args.indexOf('--rvui');
const RVUI = flagAt >= 0 ? args.splice(flagAt, 2)[1] || '' : '';
const [port, path] = args;
if (!port || !path) {
    console.error('usage: node research/_review/check-kit.mjs <port> <research/topic/demo.html> [--rvui all|fill,look,...]');
    process.exit(2);
}
/** The layout options that are on for this run (the link forces them for the visit, the page keeps nothing). */
const ON = new Set(RVUI.split(',').flatMap((part) => (part === 'all' ? ['fill', 'titles', 'look', 'controls', 'intro', 'rail', 'jump'] : [part.trim()])).filter(Boolean));
/** The least share of the viewport the dialog uses with `fill` on, and how high the component starts (Kenny, 2026-10-18 15:15). */
const MIN_FILL = 0.97;
const MAX_COMPONENT_SHARE = 0.4;
/** The most control groups one component may carry in the dialog (Kenny, 2026-10-18 07:11); more means split the section. */
const MAX_GROUPS = 4;
/** How far under its section's top the component may start, and how far under its controls (px). */
const MAX_COMPONENT_TOP = 480;
const MAX_CONTROLS_GAP = 48;
const ORIGIN = `http://127.0.0.1:${port}`;
const URL_ = `${ORIGIN}/${path}${RVUI ? `${path.includes('?') ? '&' : '?'}rvui=${RVUI}` : ''}`;
/** @type {string[]} */
const faults = [];
const fault = (/** @type {string} */ line) => faults.push(line);
/** A fault of a section's own markup is the same in every theme: said once, under the section's id. */
const onceKeys = new Set();
const faultOnce = (/** @type {string} */ key, /** @type {string} */ line) => {
    if (onceKeys.has(key)) return;
    onceKeys.add(key);
    fault(line);
};

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

/**
 * The control groups the step shows and where they stand: every shown section (a frame of a topic step, or a section on
 * the stage), its control containers, the component each names, their boxes in the section's own document.
 */
async function readControls() {
    // The frames of a topic step load as they come near the view: walk the step once so every one has its section.
    const lanes = await page.evaluate(() => document.querySelectorAll('dialog.rv-dialog .rv-lane').length);
    for (let i = 0; i < lanes; i++) {
        await page.evaluate((n) => document.querySelectorAll('dialog.rv-dialog .rv-lane')[n]?.scrollIntoView({ block: 'start' }), i);
        await page
            .waitForFunction(
                (n) => {
                    const lane = document.querySelectorAll('dialog.rv-dialog .rv-lane')[n];
                    const doc = /** @type {HTMLIFrameElement | null} */ (lane?.querySelector('iframe'))?.contentDocument;
                    return Boolean(doc?.querySelector('[data-review-item]') && lane?.querySelector('.rv-tools, .rv-lane__head'));
                },
                i,
                { timeout: 8000 },
            )
            .catch(() => {});
        await page.waitForTimeout(350);
    }
    return page.evaluate(
        ({ max }) => {
            const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('dialog.rv-dialog'));
            /** @type {{ doc: Document, section: HTMLElement | null, key: string }[]} */
            const units = [];
            for (const lane of dialog.querySelectorAll('.rv-lane')) {
                const key = /** @type {HTMLElement} */ (lane).dataset.rvPair || '';
                const item = key.split('|')[1] ?? '';
                const doc = /** @type {HTMLIFrameElement | null} */ (lane.querySelector('iframe'))?.contentDocument;
                if (doc) units.push({ doc, key, section: doc.querySelector(`[data-review-item="${CSS.escape(item)}"]`) });
                else units.push({ doc: document, key, section: null });
            }
            for (const el of dialog.querySelectorAll('[data-rv-stage] > [data-review-item]'))
                units.push({ doc: document, key: /** @type {HTMLElement} */ (el).dataset.rvPair || '', section: /** @type {HTMLElement} */ (el) });
            const shown = (/** @type {Element} */ el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
            const out = {
                bar: Boolean(dialog.querySelector('[data-rv-controls], .rv-controls')),
                sections: /** @type {any[]} */ ([]),
            };
            for (const { doc, section, key } of units) {
                if (!section) {
                    out.sections.push({ key, missing: true, containers: [], foreign: 0 });
                    continue;
                }
                const top = section.getBoundingClientRect().top;
                const containers = [...section.querySelectorAll('[data-review-controls]')].filter(shown).map((box) => {
                    const forId = box.getAttribute('data-review-controls-for') || '';
                    const target = forId ? section.querySelector(`#${CSS.escape(forId)}`) : null;
                    const b = box.getBoundingClientRect();
                    const t = target?.getBoundingClientRect();
                    return {
                        forId,
                        hasTarget: Boolean(target),
                        targetShown: Boolean(target && shown(target)),
                        groups: [...box.querySelectorAll('[role="group"]')].filter(shown).length,
                        gap: t ? Math.round(t.top - b.bottom) : null,
                        overlapX: t ? Math.min(b.right, t.right) - Math.max(b.left, t.left) : 0,
                        targetTop: t ? Math.round(t.top - top) : null,
                    };
                });
                // A control container visible in the frame that is not this section's.
                const foreign = [...doc.querySelectorAll('[data-review-controls]')].filter((box) => shown(box) && !section.contains(box)).length;
                out.sections.push({ key, missing: false, containers, foreign });
            }
            return out;
        },
        { max: MAX_GROUPS },
    );
}

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
    const controls = await readControls();
    if (controls.bar) fault(`${where}: the dialog still carries a controls bar on top; controls stand at their component`);
    for (const section of controls.sections) {
        const name = section.key;
        if (section.missing) {
            fault(`${where}: the frame of ${name} has no section, so its controls cannot be checked`);
            continue;
        }
        if (section.foreign) fault(`${where}: ${name} shows ${section.foreign} control container(s) that are not its own`);
        /** @type {Map<string, number>} */
        const perComponent = new Map();
        for (const c of section.containers) {
            if (!c.forId) {
                fault(`${where}: ${name} shows a control group that names no component (data-review-controls-for)`);
                continue;
            }
            if (!c.hasTarget) fault(`${where}: ${name} shows controls for #${c.forId}, which is not in that section`);
            else if (!c.targetShown) fault(`${where}: ${name} shows controls for #${c.forId}, which is not visible in this step`);
            else {
                if (c.overlapX <= 0 || c.gap === null || c.gap < -4 || c.gap > MAX_CONTROLS_GAP)
                    fault(`${where}: the controls of ${name} are not at their component #${c.forId} (gap ${c.gap} px, overlap ${c.overlapX} px; at most ${MAX_CONTROLS_GAP} px, directly above)`);
                if (c.targetTop !== null && c.targetTop > MAX_COMPONENT_TOP)
                    fault(`${where}: in ${name} the component #${c.forId} starts ${c.targetTop} px under the section's top (at most ${MAX_COMPONENT_TOP}): the component is not first on screen`);
            }
            perComponent.set(c.forId, (perComponent.get(c.forId) ?? 0) + c.groups);
        }
        for (const [id, groups] of perComponent)
            if (groups > MAX_GROUPS)
                faultOnce(
                    `groups|${name.split('|')[1]}|${id}`,
                    `${name.split('|')[1]}: the component #${id} carries ${groups} control groups (at most ${MAX_GROUPS}); too many rows means too many things in one section, so split it into smaller sections (first seen: ${where})`,
                );
    }
    if (step.banner) fault(`${where}: the dialog's integrity banner says: ${step.banner}`);
    return step;
}

// ---------------------------------------------------------------- 1 · every step
await openDialog();
const demo = await page.evaluate(() => document.documentElement.dataset.review || '');
// A control container outside every section drives no component the dialog could show it at.
const stray = await page.evaluate(() => [...document.querySelectorAll('[data-review-controls]')].filter((el) => !el.closest('[data-review-item]')).length);
if (stray) fault(`the page holds ${stray} control container(s) outside every judged section; they drive no component and the dialog shows them nowhere`);
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

// ---------------------------------------------------------------- 4 · the layout at three widths
for (const [width, height] of [
    [1920, 1080],
    [1280, 800],
    [390, 844],
]) {
    await page.setViewportSize({ width, height });
    await openDialog();
    // The first section's frame must have loaded to measure its component.
    await page.waitForFunction(() => document.querySelector('dialog.rv-dialog .rv-lane iframe')?.contentDocument?.querySelector('[data-review-item]'), null, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const layout = await page.evaluate(() => {
        const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('dialog.rv-dialog'));
        const box = dialog.getBoundingClientRect();
        const norm = (/** @type {string} */ t) => t.replace(/\s+/g, ' ').trim();
        const looks = [...dialog.querySelectorAll('[data-rv-list] .rv-row__look')].map((el) => norm(el.textContent || ''));
        const lane = dialog.querySelector('.rv-lane iframe');
        const doc = /** @type {HTMLIFrameElement | null} */ (lane)?.contentDocument;
        const section = doc?.querySelector('[data-review-item]');
        const forId = section?.querySelector('[data-review-controls]')?.getAttribute('data-review-controls-for');
        const component = forId ? section?.querySelector(`#${CSS.escape(forId)}`) : null;
        const top = component && lane ? lane.getBoundingClientRect().top + component.getBoundingClientRect().top - box.top : null;
        // The component is the most important part of the screen (Kenny, 2026-10-18 15:26): its frame is the largest area of
        // the dialog, it is centred in the stage, and no chrome of the kit lies over it.
        const view = /** @type {HTMLElement} */ (dialog.querySelector('.rv-dialog__view')).getBoundingClientRect();
        const clip = (/** @type {DOMRect} */ r) => ({
            left: Math.max(r.left, view.left),
            right: Math.min(r.right, view.right),
            top: Math.max(r.top, view.top),
            bottom: Math.min(r.bottom, view.bottom),
        });
        const frameBox = lane ? clip(lane.getBoundingClientRect()) : null;
        const area = (/** @type {{ left: number, right: number, top: number, bottom: number } | null} */ r) => (r ? Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top) : 0);
        const chrome = ['.rv-dialog__head', '.rv-dialog__side'].map((sel) => {
            const r = dialog.querySelector(sel)?.getBoundingClientRect();
            return r ? r.width * r.height : 0;
        });
        let centred = null;
        let covered = false;
        if (component && lane) {
            const c = component.getBoundingClientRect();
            const l = lane.getBoundingClientRect();
            const outer = { left: l.left + c.left, right: l.left + c.right, top: l.top + c.top, bottom: l.top + c.bottom };
            const shown = clip(/** @type {DOMRect} */ (/** @type {unknown} */ (outer)));
            centred = Math.abs((outer.left + outer.right) / 2 - (view.left + view.right) / 2) / view.width;
            if (area(shown) > 0) {
                const hit = document.elementFromPoint((shown.left + shown.right) / 2, (shown.top + shown.bottom) / 2);
                covered = hit !== lane;
            }
        }
        return {
            frameArea: area(frameBox),
            chromeArea: Math.max(...chrome),
            centred,
            covered,
            width: box.width / innerWidth,
            height: box.height / innerHeight,
            dialogScroll: dialog.scrollWidth - dialog.clientWidth,
            pageScroll: document.documentElement.scrollWidth - innerWidth,
            duplicates: looks.length - new Set(looks).size,
            componentShare: top === null ? null : top / box.height,
            componentTop: top === null ? null : Math.round(top),
        };
    });
    const at = `at ${width}x${height}`;
    if (layout.dialogScroll > 1 || layout.pageScroll > 1) fault(`${at}: the dialog scrolls sideways (${layout.dialogScroll} px in the dialog, ${layout.pageScroll} px on the page)`);
    if (ON.has('fill') && (layout.width < MIN_FILL || layout.height < MIN_FILL))
        fault(`${at}: the dialog uses ${(layout.width * 100).toFixed(1)}% of the width and ${(layout.height * 100).toFixed(1)}% of the height (at least ${MIN_FILL * 100}%)`);
    if (ON.has('look') && layout.duplicates > 0) fault(`${at}: ${layout.duplicates} look-at paragraph(s) repeat inside one step; it is shown once for the theme`);
    if (RVUI && layout.frameArea < layout.chromeArea)
        fault(`${at}: the component's frame shows ${Math.round(layout.frameArea)} px² and the kit's own chrome ${Math.round(layout.chromeArea)} px²; the component must be the largest area`);
    if (layout.centred !== null && layout.centred > 0.05) fault(`${at}: the component is ${(layout.centred * 100).toFixed(1)}% of the stage's width off its centre`);
    if (layout.covered) fault(`${at}: something of the kit's chrome lies over the component`);
    if (width === 1920 && RVUI && layout.componentShare !== null && layout.componentShare > MAX_COMPONENT_SHARE)
        fault(`${at}: the component of the first section starts ${layout.componentTop} px under the dialog's top (${(layout.componentShare * 100).toFixed(0)}% of its height, at most ${MAX_COMPONENT_SHARE * 100}%)`);
}
await page.setViewportSize({ width: 1600, height: 950 });

// ---------------------------------------------------------------- 2 · a reload keeps a note on the first and last row
await openDialog();
const first = await readStep();
const ends = [...new Set([first.rows[0]?.id, first.rows.at(-1)?.id])].filter(Boolean);
const NOTE = (/** @type {number} */ i) => `check-kit note ${i + 1} ${Date.now() % 100000}`;
/** @type {Record<string, string>} */
const written = {};
for (const [i, id] of ends.entries()) {
    const row = page.locator(`dialog.rv-dialog [data-rv-list] .rv-row:has(#rv-${id})`);
    // Like a reader, scroll the row into the middle of its column first: at the very end of a scrolled column Firefox moves it by
    // a few px when the focus changes, and the press then misses.
    await row.evaluate((el) => el.scrollIntoView({ block: 'center' }));
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
