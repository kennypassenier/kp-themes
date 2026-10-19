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
//    Every toggle of every control group, pressed in its lane, changes the component it drives (checkPresses).
//    Every picker keeps what is picked in sight, and every sample shown opened stays open half in view (checkPickers).
// 2. A "Not approved" with a note on the first and the last row of the first step, the page reloaded: both still there.
// 3. The page republished with a new round id that lists the old one as received (the page is intercepted, nothing
//    on disk changes): the journal still holds both notes, and the Agenda says the answer was received.
//
// 4. The dialog's layout (Kenny, 2026-10-18 15:15 to 16:27: "Kijk naar de screenshot en zeg me dat dat 99% schermvullend
//    is die dialoog?"), measured at 1920x965, 1280x800 and 390x844 on the first open step: the dialog is at most 6 px from
//    every window edge on a desktop and 0 on a phone; it has ONE header row, at most 44 px on a desktop; the verdict panel
//    is at most 320 px wide; the first lane's frame starts within 120 px of the dialog's top on a desktop; the components'
//    frames on screen together are the largest area, each horizontally centred in the stage (within 8 px), and nothing of
//    the kit lies over them; every component carries exactly ONE toolbar, its groups on one row, on the frame's top edge (within 8 px),
//    and never a toolbar inside another box of controls; no region of 120 by 120 px or more is empty, in the dialog or in
//    a frame; no dialog is shown inside the dialog (no nested preview); the look-at paragraph stands once per step; and
//    nothing scrolls sideways.
//
// 6. "Every theme" (Kenny, 2026-10-18 19:08: "een kleine checkbox bij die note input ... dat dit voor elk thema telt"), on a
//    page that asks one section in more than one theme, in a fresh profile: ticking it on a rejected section and giving
//    the verdict puts the same verdict and note on the same section in every other theme, as journal entries of kind
//    "all-themes"; a topic of that section alone is skipped; the answer names the group once; a copied row opened again
//    shows the copy and changes on its own; W undoes the whole group.
//
// Run (a static server on the repository root first):
//   node research/_review/check-kit.mjs <port> <research/topic/demo.html> [--only-every]
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const [port, path, ...flags] = process.argv.slice(2);
const ONLY_EVERY = flags.includes('--only-every');
if (!port || !path) {
    console.error('usage: node research/_review/check-kit.mjs <port> <research/topic/demo.html>');
    process.exit(2);
}
/** The dialog's measurable layout (Kenny, 2026-10-18 16:27; DEMO_RULES ch. 7). */
const LAYOUT = {
    insetDesktop: 6,
    insetPhone: 0,
    headerMax: 44,
    panelMax: 320,
    frameTopMax: 120,
    centreMax: 8,
    toolbarEdgeMax: 8,
    rowSpreadMax: 4,
    emptyMin: 120,
};
/** The most control groups one component may carry in the dialog (Kenny, 2026-10-18 07:11); more means split the section. */
const MAX_GROUPS = 4;
/** How far under its section's top the component may start, and how far under its controls (px). */
const MAX_COMPONENT_TOP = 480;
const MAX_CONTROLS_GAP = 48;
const ORIGIN = `http://127.0.0.1:${port}`;
const URL_ = `${ORIGIN}/${path}`;
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
    // Attached, not visible: on a phone the rows wait in the closed bottom sheet.
    await page.waitForSelector('dialog.rv-dialog[open] [data-rv-list] .rv-row', { state: 'attached', timeout: 15000 });
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
            for (const el of dialog.querySelectorAll('[data-rv-stage] .rv-lane > [data-review-item]'))
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
                    fault(
                        `${where}: the controls of ${name} are not at their component #${c.forId} (gap ${c.gap} px, overlap ${c.overlapX} px; at most ${MAX_CONTROLS_GAP} px, directly above)`,
                    );
                if (c.targetTop !== null && c.targetTop > MAX_COMPONENT_TOP)
                    fault(
                        `${where}: in ${name} the component #${c.forId} starts ${c.targetTop} px under the section's top (at most ${MAX_COMPONENT_TOP}): the component is not first on screen`,
                    );
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
    // A press that navigates a frame away ends the walk of that step; what was measured before it stands.
    await checkPresses(where).catch((error) => {
        if (!/context was destroyed|detached|navigat/i.test(String(error))) throw error;
    });
    await checkPickers(where).catch((error) => {
        if (!/context was destroyed|detached|navigat/i.test(String(error))) throw error;
    });
    await checkHoverCards(where).catch((error) => {
        if (!/context was destroyed|detached|navigat/i.test(String(error))) throw error;
    });
    return step;
}

/**
 * 7 · A hover card opens drawn, whole and under its anchor, in the lane (Kenny, 2026-10-19, app-hsb-hover-1019: the section
 * "hover" was rejected [broken]: the card opened - `hidden` false, the name focused - and was never drawn, because the
 * lane's isolation set the card's host (a child of <body>) aside with `data-rv-off`; and the frame, as tall as its
 * content, had no room for a card hanging under the last row). In every lane, the first visible anchor
 * `[data-kp-hovercard]` of the section is focused and then pointed at: the card must be displayed with a box, lie wholly
 * inside the frame's window, stand under (or above) its anchor with its start edge within 24 px of the anchor's, and not
 * be squeezed into a scrolling sliver.
 * @param {string} where
 */
async function checkHoverCards(where) {
    const lanes = await page.$$('dialog.rv-dialog .rv-lane');
    for (const lane of lanes) {
        const key = (await lane.getAttribute('data-rv-pair')) || '';
        const frame = await (await lane.$('iframe'))?.contentFrame();
        if (!frame || frame.isDetached()) continue;
        const anchor = await frame.evaluateHandle(() => {
            const section = [...document.querySelectorAll('[data-review-item]')].find((el) => el.getClientRects().length > 0);
            const all = /** @type {HTMLElement[]} */ ([...(section?.querySelectorAll('[data-kp-hovercard]') ?? [])]);
            return all.find((el) => el.getClientRects().length > 0 && !el.closest('[hidden], [data-review-controls]')) ?? null;
        });
        const element = anchor.asElement();
        if (!element) continue;
        // A pointer-only anchor (a plain span) is not asked to open on focus.
        const focusable = await element.evaluate((el) => /** @type {HTMLElement} */ (el).tabIndex >= 0);
        for (const how of focusable ? ['focus', 'pointer'] : ['pointer']) {
            await frame.evaluate(() => /** @type {HTMLElement | null} */ (document.activeElement)?.blur());
            await page.mouse.move(2, 2);
            await page.waitForTimeout(400);
            if (how === 'focus') await element.evaluate((el) => /** @type {HTMLElement} */ (el).focus());
            else await element.hover({ timeout: 4000 }).catch(() => {});
            // The room a demo gives the card is followed by the frame, then the card is placed again.
            await page.waitForTimeout(1100);
            const seen = await element.evaluate((el) => {
                const card = /** @type {HTMLElement | null} */ (document.querySelector('[data-kp-hovercard-card]'));
                if (!card) return { missing: true };
                const a = el.getBoundingClientRect();
                const r = card.getBoundingClientRect();
                return {
                    hidden: card.hidden,
                    display: getComputedStyle(card).display,
                    off: card.closest('[data-rv-off]') !== null,
                    w: Math.round(r.width),
                    h: Math.round(r.height),
                    top: Math.round(r.top),
                    bottom: Math.round(r.bottom),
                    left: Math.round(r.left),
                    anchorTop: Math.round(a.top),
                    anchorBottom: Math.round(a.bottom),
                    anchorLeft: Math.round(a.left),
                    view: document.documentElement.clientHeight,
                    clipped: card.scrollHeight > card.clientHeight + 1,
                };
            });
            if ('missing' in seen) continue;
            const why = [];
            if (seen.hidden) why.push('never opened');
            else if (seen.display === 'none' || seen.w === 0 || seen.h === 0)
                why.push(`opened (hidden=false) but not drawn (display ${seen.display}${seen.off ? ', set aside by the lane with data-rv-off' : ''}, ${seen.w}x${seen.h})`);
            else {
                if (seen.top < -1 || seen.bottom > seen.view + 1) why.push(`cut off by the frame (card ${seen.top}..${seen.bottom}, window ${seen.view})`);
                if (seen.clipped) why.push('squeezed into a scrolling sliver');
                const beside = seen.top >= seen.anchorBottom - 2 || seen.bottom <= seen.anchorTop + 2;
                if (!beside || Math.abs(seen.left - seen.anchorLeft) > 24) why.push('not standing at its anchor');
            }
            if (why.length) fault(`${where}: ${key}: the hover card (${how} on the first anchor) ${why.join('; ')}`);
        }
        await frame.evaluate(() => /** @type {HTMLElement | null} */ (document.activeElement)?.blur());
    }
}

/**
 * 6 · Pickers keep what is picked and opened samples stay open (Kenny, 2026-10-18 18:42 on kpadopt56-choose: "MIJN SELECTIES
 * KOMEN NIET IN DE LIJST TEVOORSCHIJN", and "de twee laatste die open zijn ... zitten die heel de tijd te openen/sluiten. Dit
 * gedrag is enkel als het geopende menu niet volledig in beeld is"). In every lane of the step, in every theme:
 * - every combobox shown opened is scrolled so that only the top half of it (its input down to the foot of its open list)
 *   is on screen, and its list must stay open, without one close, for 2 s;
 * - every enabled combobox is used with the mouse: a click in its field, then a click on two options; each pick must appear,
 *   as a visible tag (a tag input, the usual picker's symptoms) or as the field's text (a single choice).
 * @param {string} where
 */
async function checkPickers(where) {
    const lanes = await page.$$('dialog.rv-dialog .rv-lane');
    for (const lane of lanes) {
        const key = (await lane.getAttribute('data-rv-pair')) || '';
        const frame = await (await lane.$('iframe'))?.contentFrame();
        if (!frame || frame.isDetached()) continue;
        const boxes = await frame.evaluate(() =>
            [...document.querySelectorAll('[data-review-item] [data-kp-combobox]')]
                .filter((box) => box.getClientRects().length > 0 && box.closest('[data-review-item]')?.getClientRects().length)
                .map((box) => {
                    const input = /** @type {HTMLInputElement | null} */ (box.querySelector('input[role="combobox"]'));
                    const list = box.querySelector('[role="listbox"]');
                    return {
                        id: box.id,
                        input: input?.id || '',
                        disabled: !input || input.disabled,
                        opened: Boolean(list && !(/** @type {HTMLElement} */ (list).hidden) && list.getClientRects().length),
                    };
                })
                .filter((b) => b.id && b.input),
        );
        /** Scrolls the dialog so that `y` (in the frame) stands at `at` (in the window). @param {number} y @param {number} at */
        const bring = (y, at) =>
            page.evaluate(
                ({ pair, y, at }) => {
                    const card = document.querySelector(`dialog.rv-dialog .rv-lane[data-rv-pair="${CSS.escape(pair)}"]`);
                    const frameTop = card?.querySelector('iframe')?.getBoundingClientRect().top ?? 0;
                    const stage = /** @type {HTMLElement} */ (document.querySelector('dialog.rv-dialog [data-rv-stage]'));
                    const view = /** @type {HTMLElement | null} */ (stage.closest('.rv-dialog__view'));
                    const scroller = stage.scrollHeight > stage.clientHeight + 1 ? stage : (view ?? stage);
                    scroller.scrollTop += frameTop + y - at;
                },
                { pair: key, y, at },
            );
        // A sample a demo opens only once it is on screen: each picker is brought to the middle of the window first.
        for (const box of boxes.filter((b) => !b.opened)) {
            const middle = await frame.evaluate((id) => {
                const r = /** @type {HTMLElement} */ (document.getElementById(id)).getBoundingClientRect();
                return (r.top + r.bottom) / 2;
            }, box.id);
            await bring(middle, (page.viewportSize()?.height ?? 900) / 2);
            await page.waitForTimeout(700);
            box.opened = await frame.evaluate((id) => {
                const list = /** @type {HTMLElement | null} */ (document.getElementById(id)?.querySelector('[role="listbox"]'));
                return Boolean(list && !list.hidden && list.getClientRects().length);
            }, box.id);
        }
        // Opened samples first: the picks below may close a single-choice list.
        for (const box of boxes.filter((b) => b.opened)) {
            const span = await frame.evaluate((id) => {
                const el = /** @type {HTMLElement} */ (document.getElementById(id));
                const input = /** @type {HTMLElement} */ (el.querySelector('input[role="combobox"]'));
                const list = /** @type {HTMLElement} */ (el.querySelector('[role="listbox"]'));
                return {
                    top: input.getBoundingClientRect().top,
                    bottom: Math.max(list.getBoundingClientRect().bottom, input.getBoundingClientRect().bottom),
                };
            }, box.id);
            // The window's bottom edge through the middle of the sample: its top half on screen, its lower half below.
            await bring((span.top + span.bottom) / 2, page.viewportSize()?.height ?? 900);
            await page.waitForTimeout(300);
            const watched = await frame.evaluate(
                (id) =>
                    new Promise((resolve) => {
                        const list = /** @type {HTMLElement} */ (document.getElementById(id)?.querySelector('[role="listbox"]'));
                        let closes = 0;
                        const watch = new MutationObserver(() => {
                            if (list.hidden) closes++;
                        });
                        watch.observe(list, { attributes: true, attributeFilter: ['hidden'] });
                        setTimeout(() => {
                            watch.disconnect();
                            resolve({ closes, open: !list.hidden && list.getClientRects().length > 0 });
                        }, 2000);
                    }),
                box.id,
            );
            if (watched.closes || !watched.open)
                fault(
                    `${where}: ${key}: the sample #${box.id} shown opened closed ${watched.closes} time(s) in 2 s while only its top half was on screen${watched.open ? '' : ', and ended closed'}; an opened sample stays open wherever the lane is scrolled`,
                );
        }
        for (const box of boxes.filter((b) => !b.disabled)) {
            const input = frame.locator(`#${box.input}`);
            /** @type {string[]} */
            const picked = [];
            for (let n = 0; n < 2; n++) {
                await input.click({ timeout: 4000 }).catch(() => {});
                // A first click into a frame can focus only the frame's document (Firefox under automation): click again.
                if ((await input.getAttribute('aria-expanded')) !== 'true') await input.click({ timeout: 4000 }).catch(() => {});
                await page.waitForTimeout(250);
                // The option itself, never by its id: a list's closing copy (js/motion.js) can carry the same ids for a moment.
                const option = await frame.evaluateHandle((id) => {
                    const list = document.getElementById(id)?.querySelector('[role="listbox"]');
                    if (!list || /** @type {HTMLElement} */ (list).hidden) return null;
                    const options = /** @type {HTMLElement[]} */ ([...list.querySelectorAll('[data-kp-option][data-value]')]).filter(
                        (o) =>
                            !o.hidden &&
                            o.getClientRects().length &&
                            o.getAttribute('aria-disabled') !== 'true' &&
                            !o.hasAttribute('data-kp-disabled'),
                    );
                    return (
                        options.find((o) => o.hasAttribute('data-kp-band')) ?? options.find((o) => o.dataset.value !== 'none') ?? options[0] ?? null
                    );
                }, box.id);
                const element = option.asElement();
                if (!element) {
                    if (n === 0) fault(`${where}: ${key}: the picker #${box.id} shows no option to pick after a click in its field`);
                    break;
                }
                const choice = {
                    label: await element.evaluate((o) => (o.firstChild?.textContent || o.textContent || '').replace(/\s+/g, ' ').trim()),
                };
                await element.click({ timeout: 4000 }).catch((error) =>
                    fault(
                        `${where}: ${key}: the option "${choice.label}" of #${box.id} cannot be clicked (${String(error)
                            .split('\n')
                            .filter((l) => /element|waiting|intercept/.test(l))
                            .slice(-2)
                            .join('; ')
                            .trim()})`,
                    ),
                );
                await page.waitForTimeout(300);
                picked.push(choice.label);
                const shown = await frame.evaluate(
                    ({ id, label }) => {
                        const el = /** @type {HTMLElement} */ (document.getElementById(id));
                        const field = /** @type {HTMLInputElement} */ (el.querySelector('input[role="combobox"]'));
                        const tags = [...el.querySelectorAll('.kp-tag')].filter(
                            (t) => t.getClientRects().length > 0 && t.getBoundingClientRect().height > 0,
                        );
                        return tags.some((t) => (t.textContent || '').includes(label)) || field.value.trim() === label;
                    },
                    { id: box.id, label: choice.label },
                );
                if (!shown)
                    fault(
                        `${where}: ${key}: "${choice.label}" picked in #${box.id} appears nowhere (no visible tag, not in the field); what is picked must show`,
                    );
            }
            // Closed by leaving the field, never by Escape: an Escape with nothing open in a frame closes the dialog.
            await input.evaluate((el) => /** @type {HTMLElement} */ (el).blur()).catch(() => {});
            await page.waitForTimeout(100);
        }
    }
}

/** The sections whose control buttons were pressed already: the wiring is the page's, the same in every theme. */
const pressedItems = new Set();

/**
 * 5 · Every control button does something (Kenny, 2026-10-18 17:45: "bij sommige stappen werkte de states knoppen niet, bv
 * in formal star rating step 12/14"): in each lane of the step, every toggle (aria-pressed) of every control group is
 * pressed in the frame, as a reader presses it, and the component it drives (`data-review-controls-for`) must change: its
 * markup, a `data-kp-state`, an attribute or its size. A demo script that wired a section only when a sibling section of
 * its source demo was on the page (`if (document.getElementById('kc-rate-a'))`) left every button of a part page that
 * holds the section alone dead; this finds it on every page. A toggle whose effect shows only after a further action
 * (the next save is refused) carries `data-review-latent` and is pressed but not measured. Once per section.
 * @param {string} where
 */
async function checkPresses(where) {
    const lanes = await page.$$('dialog.rv-dialog .rv-lane');
    for (const lane of lanes) {
        const key = (await lane.getAttribute('data-rv-pair')) || '';
        const item = key.split('|')[1] ?? '';
        if (!item || pressedItems.has(item)) continue;
        const frame = await (await lane.$('iframe'))?.contentFrame();
        if (!frame) continue;
        pressedItems.add(item);
        /** The component's state as a reader would see it: its markup with every attribute, and its size. */
        const signature = (/** @type {string} */ forId) =>
            frame.evaluate((id) => {
                const target = document.getElementById(id);
                if (!target) return '';
                const r = target.getBoundingClientRect();
                const sizes = [...target.querySelectorAll('*')]
                    .slice(0, 400)
                    .map((el) => {
                        const b = el.getBoundingClientRect();
                        return `${Math.round(b.width)}x${Math.round(b.height)}`;
                    })
                    .join(',');
                // Where its scrolling boxes stand: a control may scroll the component (the header scrolled away).
                const scrolls = [target, ...target.querySelectorAll('*')]
                    .filter((el) => el.scrollTop || el.scrollLeft)
                    .map((el) => `${Math.round(el.scrollTop)},${Math.round(el.scrollLeft)}`)
                    .join(';');
                return `${Math.round(r.width)}x${Math.round(r.height)}|${target.outerHTML}|${sizes}|${scrolls}`;
            }, forId);
        const buttons = await frame.$$('[data-review-item] [data-review-controls][data-review-controls-for] [role="group"] button[aria-pressed]');
        /** @type {Map<string, import('playwright-core').ElementHandle>} */
        const restore = new Map();
        for (const button of buttons) {
            // A press that loads the frame again (a demo's own reload) ends this lane's walk: the press did change it.
            if (frame.isDetached()) break;
            const info = await button.evaluate((b) => {
                const group = b.closest('[role="group"]');
                return {
                    forId: b.closest('[data-review-controls]')?.getAttribute('data-review-controls-for') || '',
                    group: group?.getAttribute('aria-label') || group?.textContent?.trim().slice(0, 30) || '',
                    label: (b.textContent || '').replace(/\s+/g, ' ').trim(),
                    pressed: b.getAttribute('aria-pressed') === 'true',
                    latent: Boolean(b.closest('[data-review-latent]')),
                    shown: b.getClientRects().length > 0,
                };
            });
            if (!info.shown) continue;
            if (info.pressed) {
                if (!restore.has(info.group)) restore.set(info.group, button);
                continue;
            }
            const before = await signature(info.forId);
            await button
                .click({ timeout: 4000 })
                .catch(() => fault(`${where}: ${item}: the button "${info.label}" (${info.group}) cannot be pressed`));
            if (info.latent) continue;
            if (frame.isDetached()) break;
            /** Waits up to 1.2 s for the component to differ from `from`. @param {string} from */
            const changed = async (from) => {
                for (let wait = 0; wait < 8; wait++) {
                    await page.waitForTimeout(150);
                    if ((await signature(info.forId)) !== from) return true;
                }
                return false;
            };
            let moved = await changed(before);
            // A state can equal the one the section opened in (a console with nothing run is already empty): then the button
            // is pressed again from each other state of its group, and it is wired when it changes the component from one.
            if (!moved) {
                const others = await button.evaluate((b) => {
                    const group = b.closest('[role="group"]');
                    return [...(group?.querySelectorAll('button[aria-pressed]') ?? [])].map((o, i) => (o === b ? -1 : i)).filter((i) => i >= 0);
                });
                const group = await button.evaluateHandle((b) => b.closest('[role="group"]'));
                for (const i of others.slice(0, 4)) {
                    const other = (await /** @type {any} */ (group).$$('button[aria-pressed]'))[i];
                    await other?.click({ timeout: 4000 }).catch(() => {});
                    await page.waitForTimeout(500);
                    const from = await signature(info.forId);
                    await button.click({ timeout: 4000 }).catch(() => {});
                    if ((moved = await changed(from))) break;
                }
            }
            if (!moved)
                fault(
                    `${where}: ${item}: pressing "${info.label}" (${info.group}) changes nothing in its component #${info.forId}; the button is not wired, or it drives another component and belongs in that component's own toolbar`,
                );
        }
        // Put every group back on the button it started on, so the step is judged as it opened.
        for (const button of restore.values()) await button.click({ timeout: 4000 }).catch(() => {});
        await page.waitForTimeout(300);
    }
}

/** Section 6: the "Every theme" tick, in a profile of its own (nothing the other sections wrote counts). */
async function checkEveryTheme() {
    await context.unroute(URL_).catch(() => {});
    await go(URL_);
    await page.evaluate(() => localStorage.clear());
    await openDialog();
    const demoId = await page.evaluate(() => document.documentElement.dataset.review || '');
    const sections = await page.evaluate(() => {
        const themes = (document.documentElement.dataset.reviewThemes || '').split(',').filter(Boolean);
        const topics = new Map();
        for (const el of document.querySelectorAll('[data-review-item]')) {
            const topic = /** @type {HTMLElement} */ (el).dataset.reviewTopic || `item:${/** @type {HTMLElement} */ (el).dataset.reviewItem}`;
            topics.set(topic, [...(topics.get(topic) || []), el]);
        }
        const lone = [...topics.values()].find((members) => members.length === 1)?.[0];
        return {
            themes: themes.length,
            lone: lone
                ? {
                      item: /** @type {HTMLElement} */ (lone).dataset.reviewItem,
                      title:
                          /** @type {HTMLElement} */ (lone).dataset.reviewTopicTitle || /** @type {HTMLElement} */ (lone).dataset.reviewTitle || '',
                  }
                : null,
        };
    });
    if (sections.themes < 2) {
        console.log('  every theme: the page asks one theme, nothing to check');
        return;
    }
    // Walk to the step of a section that is a topic of its own (else the first step).
    if (sections.lone) {
        for (let i = 0; i < 200; i++) {
            const title = await page.evaluate(() => document.querySelector('dialog.rv-dialog [data-rv-title]')?.textContent || '');
            if (title.includes(sections.lone.title)) break;
            const was = await page.evaluate(() => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent);
            await page.click('dialog.rv-dialog [data-rv-go="1"]');
            await page.waitForFunction((w) => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent !== w, was, {
                timeout: 15000,
            });
            await page.waitForTimeout(250);
        }
    }
    const stepTitle = await page.evaluate(() => document.querySelector('dialog.rv-dialog [data-rv-title]')?.textContent || '');
    const row = page.locator('dialog.rv-dialog [data-rv-list] .rv-row').first();
    const key = (await row.getAttribute('data-rv-key')) || '';
    const [sourceTheme, item] = key.split('|');
    const NOTE_EVERY = `every-theme check ${Date.now() % 100000}`;
    const everyBox = row.locator('[data-rv-every]');
    if (await everyBox.isVisible()) fault(`every theme: the tick shows before the section is rejected`);
    await row.locator('[data-rv-reject]').check();
    if (!(await everyBox.isVisible())) {
        fault(`every theme: no "Every theme" tick beside the note of ${key}`);
        return;
    }
    await row.locator('[data-rv-row-note]').fill(NOTE_EVERY);
    await row.locator('[data-rv-row-note]').dispatchEvent('input');
    await everyBox.check();
    const before = await page.evaluate(() => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent);
    await page.click('dialog.rv-dialog [data-rv-approve]');
    await page
        .waitForFunction((w) => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent !== w, before, { timeout: 15000 })
        .catch(() => {});
    await page.waitForTimeout(900);
    // A page whose open pairs are all in the group (one section asked again, as in a later round): the copies judge the
    // last open pair and the kit leaves for the Agenda by itself; the demo is opened again to look at what was kept.
    const ended = await page.evaluate(() => !document.querySelector('dialog.rv-dialog[open]')).catch(() => true);
    if (ended) {
        await page.waitForLoadState('load').catch(() => {});
        await openDialog();
    }
    const read = () =>
        page.evaluate(
            ({ id, it }) => {
                const state = JSON.parse(localStorage.getItem(`kp-demo-review:${id}`) || '{}');
                const journal = JSON.parse(localStorage.getItem(`kp-demo-review:${id}:journal`) || '[]');
                const keys = Object.keys(state).filter((k) => k.endsWith(`|${it}`));
                return {
                    state: Object.fromEntries(
                        keys.map((k) => [k, { verdict: state[k].verdict, note: state[k].note, copiedFrom: state[k].copiedFrom }]),
                    ),
                    journal: journal
                        .filter((/** @type {any} */ e) => e.pair.endsWith(`|${it}`))
                        .map((/** @type {any} */ e) => ({ pair: e.pair, verdict: e.verdict, note: e.note, kind: e.kind, source: e.source })),
                    answer: document.querySelector('[data-rv-answer]')?.textContent || '',
                    position: document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent || '',
                    title: document.querySelector('dialog.rv-dialog [data-rv-title]')?.textContent || '',
                };
            },
            { id: demoId, it: item },
        );
    let now = await read();
    const themesOfItem = Object.keys(now.state).map((k) => k.split('|')[0]);
    if (themesOfItem.length !== sections.themes)
        fault(`every theme: ${item} has ${themesOfItem.length} verdicts, the page asks ${sections.themes} themes`);
    for (const [k, v] of Object.entries(now.state)) {
        if (v.verdict !== 'rejected' || v.note !== NOTE_EVERY)
            fault(`every theme: ${k} reads "${v.verdict}: ${v.note}", not the source's verdict and note`);
        if (k.split('|')[0] !== sourceTheme && v.copiedFrom !== sourceTheme)
            fault(`every theme: ${k} does not say it was copied from ${sourceTheme}`);
    }
    const copies = now.journal.filter((e) => e.kind === 'all-themes');
    if (copies.length !== sections.themes - 1 || copies.some((e) => e.source !== sourceTheme || e.verdict !== 'rejected' || e.note !== NOTE_EVERY))
        fault(
            `every theme: the journal holds ${copies.length} entries of kind "all-themes" for ${item}, expected ${sections.themes - 1} from ${sourceTheme}`,
        );
    const lines = now.answer.split('\n').filter((l) => l.includes(`${item} · every theme: ${NOTE_EVERY}`));
    if (lines.length !== 1) fault(`every theme: the answer names the group ${lines.length} times, not once`);
    if (now.answer.split('\n').some((l) => l.startsWith(`- ${item} · `) && !l.includes('every theme') && l.includes(NOTE_EVERY)))
        fault(`every theme: the answer still lists ${item} per theme`);
    if (!ended && sections.lone && stepTitle.includes(sections.lone.title) && now.title.includes(sections.lone.title))
        fault(`every theme: the steps of ${item}'s topic in the other themes were not skipped (still on "${now.title}")`);
    // A copied row opened again shows the copy and can be changed on its own.
    const target = Object.keys(now.state).find((k) => k.split('|')[0] !== sourceTheme) || '';
    const pairRow = `dialog.rv-dialog [data-rv-list] .rv-row[data-rv-key="${target}"]`;
    // Previous first (the copies are behind the step on screen); on a page opened again, also Next.
    for (const dir of ended ? ['-1', '1'] : ['-1'])
        for (let i = 0; i < 200 && !(await page.locator(pairRow).count()); i++) {
            const was = await page.evaluate(() => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent);
            const button = page.locator(`dialog.rv-dialog [data-rv-go="${dir}"]`);
            if (!(await button.isEnabled().catch(() => false))) break;
            await button.click();
            const moved = await page
                .waitForFunction((w) => document.querySelector('dialog.rv-dialog [data-rv-position]')?.textContent !== w, was, {
                    timeout: ended ? 3000 : 15000,
                })
                .then(() => true)
                .catch(() => false);
            if (!moved) {
                if (!ended) throw new Error('every theme: Previous did not move');
                break;
            }
            await page.waitForTimeout(250);
        }
    const copyRow = page.locator(pairRow);
    if (!(await copyRow.count())) fault(`every theme: the copy ${target} cannot be opened again with Previous`);
    else {
        if (!(await copyRow.locator('[data-rv-reject]').isChecked()) || (await copyRow.locator('[data-rv-row-note]').inputValue()) !== NOTE_EVERY)
            fault(`every theme: the copy ${target} shows another verdict or note than the source`);
        if (!(await copyRow.locator('[data-rv-copied]').isVisible())) fault(`every theme: the copy ${target} does not say where it came from`);
        await copyRow.locator('[data-rv-row-note]').fill(`${NOTE_EVERY} own`);
        await copyRow.locator('[data-rv-row-note]').dispatchEvent('input');
        await page.waitForTimeout(900);
        now = await read();
        if (now.state[target]?.note !== `${NOTE_EVERY} own` || now.state[target]?.copiedFrom)
            fault(`every theme: the copy ${target} cannot be changed on its own`);
        if (!now.answer.includes(`- ${item} · ${target.split('|')[0]}: ${NOTE_EVERY} own`))
            fault(`every theme: the answer lacks the changed copy ${target} as its own line`);
    }
    // W (AZERTY) undoes the whole group.
    await page.locator('dialog.rv-dialog [data-rv-approve]').focus();
    await page.keyboard.press('KeyZ');
    await page.waitForTimeout(1200);
    now = await read();
    const left = Object.entries(now.state).filter(([, v]) => v.verdict);
    if (left.length) fault(`every theme: after W ${left.length} of the group's pairs still have a verdict (${left.map(([k]) => k).join(', ')})`);
    if (now.journal.filter((e) => e.kind === 'undo').length < sections.themes - 1)
        fault(`every theme: W did not journal an undo for each pair of the group`);
    console.log(`  every theme: ${item} from ${sourceTheme}, ${sections.themes - 1} copies${sections.lone ? ', topic skipped' : ''}, undone`);
}
if (ONLY_EVERY) {
    await checkEveryTheme();
    await browser.close();
    console.log(`${path}: ${faults.length ? `${faults.length} fault(s)` : 'clear'}`);
    for (const line of [...new Set(faults)]) console.log(`  ${line}`);
    process.exit(faults.length ? 1 : 0);
}

// ---------------------------------------------------------------- 1 · every step
await openDialog();
const demo = await page.evaluate(() => document.documentElement.dataset.review || '');
// A control container outside every section drives no component the dialog could show it at.
const stray = await page.evaluate(
    () => [...document.querySelectorAll('[data-review-controls]')].filter((el) => !el.closest('[data-review-item]')).length,
);
if (stray)
    fault(`the page holds ${stray} control container(s) outside every judged section; they drive no component and the dialog shows them nowhere`);
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
    [1920, 965],
    [1280, 800],
    [390, 844],
]) {
    await page.setViewportSize({ width, height });
    await openDialog();
    // The frames on screen must have loaded and laid their section out to measure the component and its toolbar.
    await page
        .waitForFunction(
            () => document.querySelector('dialog.rv-dialog .rv-lane iframe')?.contentDocument?.querySelector('[data-rv-compact]'),
            null,
            {
                timeout: 15000,
            },
        )
        .catch(() => {});
    await page.waitForTimeout(1500);
    const layout = await page.evaluate((L) => {
        const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('dialog.rv-dialog'));
        const box = dialog.getBoundingClientRect();
        const shown = (/** @type {Element} */ el) => {
            const view = el.ownerDocument.defaultView;
            for (let p = /** @type {Element | null} */ (el); p; p = p.parentElement) {
                const cs = /** @type {Window} */ (view).getComputedStyle(p);
                if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
            }
            const r = el.getBoundingClientRect();
            return r.width >= 1 && r.height >= 1;
        };
        const stage = /** @type {HTMLElement} */ (dialog.querySelector('[data-rv-stage]'));
        const view = /** @type {HTMLElement} */ (dialog.querySelector('.rv-dialog__view')).getBoundingClientRect();
        const clip = (/** @type {{ left: number, right: number, top: number, bottom: number }} */ r) => ({
            left: Math.max(r.left, view.left),
            right: Math.min(r.right, view.right),
            top: Math.max(r.top, view.top),
            bottom: Math.min(r.bottom, view.bottom),
        });
        const area = (/** @type {{ left: number, right: number, top: number, bottom: number }} */ r) =>
            Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top);
        // 1 · how far the dialog stands from each edge of the window
        const inset = Math.max(box.top, box.left, innerWidth - box.right, innerHeight - box.bottom);
        // 2 · one header row: the head is the only visible part above the body, and its height
        const head = /** @type {HTMLElement} */ (dialog.querySelector('.rv-dialog__head'));
        const rows = [...dialog.children].filter((el) => shown(el) && !el.matches('.rv-dialog__grid, [popover], .rvk-pop, .rvk-toast')).length;
        const side = /** @type {HTMLElement} */ (dialog.querySelector('.rv-dialog__side'));
        // 3 · the components' frames: the first one's top, all of them together the largest area, each centred in the stage
        const frames = /** @type {HTMLIFrameElement[]} */ ([...dialog.querySelectorAll('.rv-lane iframe')]).filter(shown);
        const ranked = frames.map((f) => ({ f, r: f.getBoundingClientRect() })).filter(({ r }) => area(clip(r)) > 0);
        const main = ranked[0];
        const st = stage.getBoundingClientRect();
        let largestOther = 0;
        let largestName = '';
        if (main)
            for (const el of dialog.querySelectorAll('*')) {
                if (el.closest('.rv-lane') || frames.some((f) => el.contains(f)) || !shown(el) || /^(script|style)$/i.test(el.tagName)) continue;
                const r = el.getBoundingClientRect();
                const a = area({
                    left: Math.max(r.left, box.left),
                    right: Math.min(r.right, box.right),
                    top: Math.max(r.top, box.top),
                    bottom: Math.min(r.bottom, box.bottom),
                });
                if (a > largestOther) {
                    largestOther = a;
                    largestName = `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`;
                }
            }
        let covered = false;
        if (main) {
            const c = clip(main.r);
            if (area(c) > 0) covered = document.elementFromPoint((c.left + c.right) / 2, (c.top + c.bottom) / 2) !== main.f;
        }
        // 4 · the toolbars: per component exactly one, one row, on the frame's top edge, never inside another box of controls
        /** @type {string[]} */
        const toolbars = [];
        for (const { f, r } of ranked) {
            const doc = f.contentDocument;
            if (!doc || area(clip(r)) <= 0) continue;
            const key = f.closest('[data-rv-pair]')?.getAttribute('data-rv-pair') || '?';
            const boxes = [...doc.querySelectorAll('[data-review-controls]')].filter(shown);
            /** @type {Map<string, number>} */
            const per = new Map();
            for (const b of boxes)
                per.set(b.getAttribute('data-review-controls-for') || '', (per.get(b.getAttribute('data-review-controls-for') || '') ?? 0) + 1);
            for (const [id, n] of per) if (n !== 1) toolbars.push(`${key}: ${n} toolbars for #${id}`);
            for (const b of boxes) {
                if (b.parentElement?.closest('[data-review-controls]')) toolbars.push(`${key}: a toolbar inside another box of controls`);
                const groups = [...b.querySelectorAll('[role="group"]')].filter(shown).filter((g) => !g.parentElement?.closest('[role="group"]'));
                const tops = groups.map((g) => g.getBoundingClientRect().top);
                const spread = tops.length ? Math.max(...tops) - Math.min(...tops) : 0;
                if (spread > L.rowSpreadMax)
                    toolbars.push(`${key}: the toolbar's ${groups.length} groups stand on more than one row (${Math.round(spread)} px apart)`);
                // Label and buttons on one line: every part of the group shares one band of height.
                const labelled = groups.filter((g) => {
                    const items = [...g.children].filter(shown).map((c) => c.getBoundingClientRect());
                    return items.length > 1 && Math.max(...items.map((i) => i.top)) >= Math.min(...items.map((i) => i.bottom));
                });
                if (labelled.length) toolbars.push(`${key}: ${labelled.length} group(s) put their label and buttons on more than one line`);
                if (boxes.length === 1 && b.getBoundingClientRect().top > L.toolbarEdgeMax)
                    toolbars.push(
                        `${key}: the toolbar stands ${Math.round(b.getBoundingClientRect().top)} px under the frame's top edge (at most ${L.toolbarEdgeMax})`,
                    );
            }
        }
        // 5 · no empty region of 120 by 120 px or more, in the dialog and in the frames
        const CONTENT = 'img,canvas,svg,video,input,select,textarea,button,iframe,picture';
        const hasText = (/** @type {Element} */ el) => {
            const walk = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            for (let n = walk.nextNode(); n; n = walk.nextNode()) if (n.nodeValue?.trim() && n.parentElement && shown(n.parentElement)) return true;
            return false;
        };
        /** Whether an element paints something of its own: a fill, a gradient or image, or a border. */
        const drawn = (/** @type {Element} */ el) => {
            const cs = /** @type {Window} */ (el.ownerDocument.defaultView).getComputedStyle(el);
            return (
                (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') ||
                cs.backgroundImage !== 'none' ||
                parseFloat(cs.borderTopWidth) > 0 ||
                parseFloat(cs.borderLeftWidth) > 0
            );
        };
        /** @type {string[]} */
        const empty = [];
        const scan = (/** @type {ParentNode} */ root, /** @type {number} */ dx, /** @type {number} */ dy, /** @type {string} */ where) => {
            /** @type {Element[]} */
            const kept = [];
            for (const el of root.querySelectorAll('*')) {
                if (/^(script|style|option|html|body|head|link|meta|title)$/i.test(el.tagName) || !shown(el)) continue;
                // Inside a drawing every part is drawing: a graph's links group is strokes, not an empty box (kyu gap 25).
                if (el.parentElement?.closest('svg')) continue;
                const r = el.getBoundingClientRect();
                const c = {
                    left: Math.max(r.left + dx, box.left),
                    right: Math.min(r.right + dx, box.right),
                    top: Math.max(r.top + dy, box.top),
                    bottom: Math.min(r.bottom + dy, box.bottom),
                };
                if (c.right - c.left < L.emptyMin || c.bottom - c.top < L.emptyMin) continue;
                if (el.matches(CONTENT) || hasText(el) || [...el.querySelectorAll(CONTENT)].some(shown) || kept.some((k) => k.contains(el))) continue;
                // A drawn layer is not empty: a gantt's hour rules are a gradient on the layer itself, its bars are painted
                // boxes inside it, both without text (homelab gap 27, 2026-10-19). A plain filled or bordered box with nothing
                // drawn inside it still counts as empty.
                if (
                    /** @type {Window} */ (el.ownerDocument.defaultView).getComputedStyle(el).backgroundImage !== 'none' ||
                    [...el.querySelectorAll('*')].some((d) => shown(d) && drawn(d))
                )
                    continue;
                kept.push(el);
                empty.push(
                    `${where}${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join('.')} ${Math.round(c.right - c.left)}x${Math.round(c.bottom - c.top)}`,
                );
            }
        };
        scan(dialog, 0, 0, '');
        for (const { f, r } of ranked) if (f.contentDocument) scan(f.contentDocument, r.left, r.top, 'in a frame: ');
        // A blank band across a frame: from top to bottom, every stretch of 120 px or more in which nothing is drawn (no
        // text, no control, no picture, no painted leaf such as a bar or a box), the body and every wrapper aside, so room
        // a demo keeps free under its component counts (Kenny, 2026-10-18 16:27: "al die rode vlakken die open zijn").
        for (const { f, r } of ranked) {
            const doc = f.contentDocument;
            if (!doc || area(clip(r)) <= 0) continue;
            const painted = (/** @type {Element} */ el) => {
                const cs = /** @type {Window} */ (doc.defaultView).getComputedStyle(el);
                return (
                    (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') ||
                    parseFloat(cs.borderTopWidth) > 0 ||
                    cs.backgroundImage !== 'none'
                );
            };
            const marks = [...doc.querySelectorAll('[data-rv-compact] *')]
                .filter((el) => shown(el) && !/^(script|style)$/i.test(el.tagName))
                .filter(
                    (el) =>
                        el.matches(CONTENT) ||
                        [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue?.trim()) ||
                        (!el.querySelector('*') && painted(el)),
                )
                .map((el) => el.getBoundingClientRect())
                .sort((a, b) => a.top - b.top);
            let reach = 0;
            for (const m of marks) {
                if (m.top - reach >= L.emptyMin)
                    empty.push(
                        `a blank band in the frame of ${f.closest('[data-rv-pair]')?.getAttribute('data-rv-pair')}, ${Math.round(reach)} to ${Math.round(m.top)} px`,
                    );
                reach = Math.max(reach, m.bottom);
            }
            if (r.height - reach >= L.emptyMin)
                empty.push(
                    `a blank band at the foot of the frame of ${f.closest('[data-rv-pair]')?.getAttribute('data-rv-pair')}, ${Math.round(reach)} to ${Math.round(r.height)} px`,
                );
        }
        // 6 · no dialog inside the dialog
        const nested =
            [...dialog.querySelectorAll('dialog[open]')].length +
            frames.filter((f) => f.contentDocument?.querySelector('dialog.rv-dialog, dialog[open].rv-dialog') || /rv-preview/.test(f.src)).length;
        // 7 · the look-at paragraph once per step
        const norm = (/** @type {string} */ t) => t.replace(/\s+/g, ' ').trim();
        const looks = [...dialog.querySelectorAll('[data-rv-look]:not([hidden]) [data-rv-look-text], [data-rv-list] .rv-row__look')]
            .map((el) => norm(el.textContent || ''))
            .filter(Boolean);
        return {
            inset,
            rows,
            headH: head.getBoundingClientRect().height,
            panelW: shown(side) ? side.getBoundingClientRect().width : 0,
            frameTop: main ? main.r.top - box.top : null,
            frameArea: ranked.reduce((sum, { r }) => sum + area(clip(r)), 0),
            largestOther,
            largestName,
            centre: ranked.length ? Math.max(...ranked.map(({ r }) => Math.abs(r.left - st.left - (st.right - r.right)))) : null,
            covered,
            toolbars,
            empty,
            nested,
            duplicates: looks.length - new Set(looks).size,
            dialogScroll: dialog.scrollWidth - dialog.clientWidth,
            pageScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            frameScroll: frames
                .map((f) => (f.contentDocument ? f.contentDocument.documentElement.scrollWidth - f.contentDocument.documentElement.clientWidth : 0))
                .reduce((a, b) => Math.max(a, b), 0),
        };
    }, LAYOUT);
    const at = `at ${width}x${height}`;
    const desktop = width > 768;
    const r1 = (/** @type {number} */ n) => Math.round(n * 10) / 10;
    console.log(
        `  ${at}: inset ${r1(layout.inset)} px, header ${layout.rows} row ${r1(layout.headH)} px, panel ${r1(layout.panelW)} px, frame top ${layout.frameTop === null ? '-' : r1(layout.frameTop)} px, frame ${Math.round(layout.frameArea)} px² vs next ${Math.round(layout.largestOther)} px², off centre ${layout.centre === null ? '-' : r1(layout.centre)} px`,
    );
    if (layout.inset > (desktop ? LAYOUT.insetDesktop : LAYOUT.insetPhone))
        fault(
            `${at}: the dialog stands ${r1(layout.inset)} px from the window's edge (at most ${desktop ? LAYOUT.insetDesktop : LAYOUT.insetPhone})`,
        );
    if (layout.rows !== 1) fault(`${at}: the dialog shows ${layout.rows} rows above its body; there is one header row`);
    if (desktop && layout.headH > LAYOUT.headerMax) fault(`${at}: the header row is ${r1(layout.headH)} px high (at most ${LAYOUT.headerMax})`);
    if (desktop && layout.panelW > LAYOUT.panelMax) fault(`${at}: the verdict panel is ${r1(layout.panelW)} px wide (at most ${LAYOUT.panelMax})`);
    if (layout.frameTop === null) fault(`${at}: no component frame is on screen`);
    else if (desktop && layout.frameTop > LAYOUT.frameTopMax)
        fault(`${at}: the component's frame starts ${r1(layout.frameTop)} px under the dialog's top (at most ${LAYOUT.frameTopMax})`);
    if (layout.frameArea < layout.largestOther)
        fault(`${at}: the components' frames are not the largest area on screen (${layout.largestName} is larger)`);
    if (layout.centre !== null && layout.centre > LAYOUT.centreMax)
        fault(`${at}: the component's frame is ${r1(layout.centre)} px off the stage's centre`);
    if (layout.covered) fault(`${at}: something of the kit's chrome lies over the component`);
    for (const line of layout.toolbars) fault(`${at}: ${line}`);
    for (const line of layout.empty) fault(`${at}: an empty region: ${line}`);
    if (layout.nested) fault(`${at}: a dialog is shown inside the dialog`);
    if (layout.duplicates > 0) fault(`${at}: ${layout.duplicates} look-at paragraph(s) repeat inside one step; it is shown once`);
    if (layout.dialogScroll > 1 || layout.pageScroll > 1 || layout.frameScroll > 1)
        fault(
            `${at}: something scrolls sideways (${layout.dialogScroll} px in the dialog, ${layout.pageScroll} px on the page, ${layout.frameScroll} px in a frame)`,
        );
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

// ---------------------------------------------------------------- 6 · "Every theme"
await checkEveryTheme();

await browser.close();
console.log(`${path}: ${faults.length ? `${faults.length} fault(s)` : 'clear'}`);
for (const line of [...new Set(faults)]) console.log(`  ${line}`);
process.exit(faults.length ? 1 : 0);
