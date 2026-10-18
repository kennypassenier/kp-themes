// research/almanac-calendars: the page's own wiring. The components are the package's (js/auto.js attaches them); this file gives them
// the sample data of data.js, drives the states the review controls press, and plays the server (a mock that accepts or refuses).
import { CALENDARS, SOURCES, UNSERVED, calendarOf, calendarRow, servedRow, sourcesOf, usesNodes, usesGraph, newDialogInner, kpiStrip } from './data.js';
import { attachKpiToggles } from '../../js/kpi.js';
import { attachCharts } from '../../js/chart.js';
import { statePlate } from '../../js/state-plate.js';
import { toast } from '../../js/overlays.js';
import { runFlashButton } from '../../js/flash.js';
import { setAttention } from '../../js/attention.js';
import { setProblems } from '../../js/problems.js';
import { setCardState } from '../../js/card-state.js';
import { openMenu, closeMenu } from '../../js/menu-button.js';
import { dataTable } from '../../js/datatable.js';
import { attachDisabledReasons } from '../../js/reason.js';
import { attachCodes } from '../../js/code.js';
import { attachArt } from '../../js/art.js';
import { buildTypeConfirm } from '../../js/components.js';
import { form as formOf, VALID_EVENT, INVALID_EVENT } from '../../js/forms.js';
import { setMatrix, setMatrixLit } from '../../js/heat.js';
import { setUsesPin } from '../../js/uses-map.js';
import { setGraphData, setGraphState, graphSelect } from '../../js/graph.js';
import { setSegmentedValues } from '../../js/segmented.js';

const $ = (/** @type {string} */ s, /** @type {ParentNode} */ r = document) => /** @type {HTMLElement | null} */ (r.querySelector(s));
const wait = (/** @type {number} */ ms) => new Promise((done) => setTimeout(done, ms));

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

// ── the review controls: one pressed button per group, then the section's handler ──────────────────────────────────────────────────
/** @type {Record<string, Record<string, (value: string) => void>>} */
const handlers = {};
/** What each group holds now, so a handler can read another group's value. @type {Record<string, string>} */
const current = {};

/** Press a button of a group without a click. @param {string} section @param {string} group @param {string} value */
function press(section, group, value) {
    const buttons = [...document.querySelectorAll(`[data-ac-ctl="${section}:${group}"]`)];
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.getAttribute('data-ac-v') === value));
    current[`${section}:${group}`] = value;
}

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-ac-ctl]') : null;
    if (!button) return;
    const [section, group] = (button.getAttribute('data-ac-ctl') ?? '').split(':');
    const value = button.getAttribute('data-ac-v') ?? '';
    press(section, group, value);
    handlers[section]?.[group]?.(value);
});
for (const b of document.querySelectorAll('button[data-ac-ctl][aria-pressed="true"]')) {
    current[b.getAttribute('data-ac-ctl') ?? ''] = b.getAttribute('data-ac-v') ?? '';
}

/** Width of a component: the lane's own width or a phone's. @param {string} id @param {string} value */
const setWidth = (id, value) => document.getElementById(id)?.setAttribute('data-ac-width', value === 'phone' ? 'phone' : 'full');

await ready;

/** A toast of one flavour (success, info, warning, error, destructive): its class comes from the page's own toast templates when it has them. */
function flavour(/** @type {string} */ name, /** @type {string} */ words) {
    const template = /** @type {HTMLTemplateElement | null} */ (document.querySelector('template[data-ac-toasts]'));
    const sample = template?.content.querySelector(`[data-ac-toast="${name}"]`);
    return toast(words, { className: sample?.className.replace(/\bkp-toast\b/, '').trim() || `kp-toast--${name}`, ...(name === 'error' || name === 'destructive' ? { live: /** @type {const} */ ('assertive') } : {}) });
}

// ── a mock server: accepts, or refuses with the words a person needs ───────────────────────────────────────────────────────────────
/** @param {string} id */
const refusalFor = (id) => ({
    error: `${id} cannot be deleted: a source started writing to it a moment ago.`,
    remedy: 'Delete that source first, on the Sources page.',
});

// ── 1 · page header and counts ─────────────────────────────────────────────────────────────────────────────────────────────────────
{
    const strip = /** @type {HTMLElement} */ ($('[data-ac-kpis]'));
    const wrapper = /** @type {HTMLElement} */ ($('#page-top [data-kp-menu-button]'));
    const waiting = (/** @type {string} */ label) =>
        `<div class="kp-kpi" aria-busy="true"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value"><span class="kp-skeleton" style="--kp-skeleton-height: 1.75rem; inline-size: 3ch"></span></span><span class="kp-kpi__trend"><span class="kp-skeleton" style="inline-size: 80%"></span></span></div>`;
    const line = /** @type {HTMLElement} */ ($('[data-ac-filter-line]'));
    const WORDS = {
        none: 'Showing every row. Press a count to show only the rows it counts.',
        calendars: `Showing the ${CALENDARS.length} calendars only.`,
        sources: `Showing the ${SOURCES.length} sources only.`,
        unserved: `Showing the ${UNSERVED.slice(0, 1).length} profile file that is not served only.`,
    };
    const wire = () => {
        attachKpiToggles(strip);
        attachCharts(strip);
        line.textContent = WORDS.none;
    };
    const draw = (/** @type {string} */ state) => {
        strip.removeAttribute('aria-busy');
        if (state === 'loading') {
            strip.setAttribute('aria-busy', 'true');
            strip.innerHTML = waiting('Calendars') + waiting('Sources') + waiting('Profile files not served') + waiting('Events delivered');
            line.textContent = 'Reading the counts.';
        } else if (state === 'failed') {
            const plate = statePlate(document, {
                kind: 'error',
                title: 'The counts could not be read',
                text: 'Almanac could not ask Google or read the profiles folder.',
                actionLabel: 'Try again',
                onAction: () => {
                    press('page-top', 'state', 'loading');
                    draw('loading');
                    setTimeout(() => {
                        press('page-top', 'state', 'ready');
                        draw('ready');
                    }, 1400);
                },
            });
            strip.replaceChildren(plate);
            line.textContent = 'Nothing to filter.';
        } else {
            strip.innerHTML = kpiStrip(state === 'empty' ? 'empty' : 'ready');
            wire();
        }
    };
    handlers['page-top'] = {
        state: draw,
        menu: (value) => (value === 'open' ? openMenu(wrapper, { focus: false }) : closeMenu(wrapper, { focus: false })),
        width: (value) => setWidth('page-top-component', value),
    };
    // A count is a toggle that filters the rows it counts: one at a time, and the line under the strip says which rows are shown.
    strip.addEventListener('click', (event) => {
        const tile = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-ac-kpi]')) : null;
        if (!tile) return;
        setTimeout(() => {
            const on = tile.getAttribute('aria-pressed') === 'true';
            for (const other of strip.querySelectorAll('[data-ac-kpi]')) if (other !== tile) other.setAttribute('aria-pressed', 'false');
            line.textContent = on ? WORDS[/** @type {keyof typeof WORDS} */ (tile.getAttribute('data-ac-kpi') ?? 'none')] : WORDS.none;
            document.dispatchEvent(new CustomEvent('ac:filter', { detail: { key: on ? tile.getAttribute('data-ac-kpi') : null } }));
        }, 0);
    });
    wrapper.addEventListener('kp-menu-select', () => {
        flavour('success', `Profile files read again: ${SOURCES.length} served, 1 not served.`);
    });
}

// ── 2 · attention band ────────────────────────────────────────────────────────────────────────────────────────────────────────────
{
    const band = /** @type {HTMLElement} */ ($('[data-ac-attention]'));
    const fix = (/** @type {string} */ key, /** @type {string} */ label) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'kp-button kp-button--sm';
        b.setAttribute('data-ac-fix', key);
        b.textContent = label;
        return b;
    };
    const ITEMS = {
        google: () => ({
            key: 'google',
            severity: /** @type {const} */ ('critical'),
            title: 'Google Calendar cannot be reached',
            text: 'Calendars cannot be listed or made, and new events wait in the journal until Google answers again.',
            action: fix('google', 'Check again'),
        }),
        file: () => ({
            key: 'file',
            severity: /** @type {const} */ ('warning'),
            title: '1 profile file is not being served',
            text: `${UNSERVED[0].file}: the source it describes receives nothing, and a post to it answers 401.`,
            action: fix('file', 'Reload profiles from disk'),
        }),
    };
    /** @type {string[]} */
    let shown = ['google', 'file'];
    const draw = () => setAttention(band, shown.map((k) => ITEMS[/** @type {'google' | 'file'} */ (k)]()));
    draw();
    handlers.attention = {
        problems: (value) => {
            shown = value === 'both' ? ['google', 'file'] : value === 'google' ? ['google'] : value === 'file' ? ['file'] : [];
            draw();
        },
    };
    band.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-ac-fix]')) : null;
        if (!button) return;
        const key = button.getAttribute('data-ac-fix') ?? '';
        runFlashButton(
            button,
            async () => {
                await wait(700);
                const mode = current['attention:fix'];
                if (mode === 'refused') {
                    return key === 'google'
                        ? { error: 'Google did not answer within 10 seconds.', remedy: 'Almanac keeps the events and tries again by itself.' }
                        : { error: `${UNSERVED[0].file} still says schema_version = 1.`, remedy: 'Edit the file first, then reload.' };
                }
                if (mode === 'same') return { word: 'Same' };
                if (mode === 'partly') return { word: 'Partly' };
                return 'Done';
            },
            { refusal: 'toast', busyLabel: key === 'google' ? 'Checking' : 'Reloading', width: 'keep' },
        ).then((result) => {
            const mode = current['attention:fix'];
            if (mode === 'refused') return;
            if (mode === 'same') return void flavour('info', key === 'google' ? 'Checked again: Google still answers the same, nothing was changed.' : 'Reloaded: the same files are served, nothing was changed.');
            if (mode === 'partly') return void flavour('warning', key === 'google' ? 'Google answers now, but only for reading: making calendars still fails.' : 'Reloaded, but weekly-report.toml is still not served.');
            if (!result?.ok) return;
            flavour('success', key === 'google' ? 'Google Calendar answers again; the waiting events are being delivered.' : `Profile files read again: ${SOURCES.length} served, 0 not served.`);
            setTimeout(() => {
                shown = shown.filter((k) => k !== key);
                press('attention', 'problems', shown.length === 2 ? 'both' : shown[0] ?? 'none');
                draw();
            }, 500);
        });
    });
}

// ── 3 · calendars table ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const tableWrap = /** @type {HTMLElement} */ ($('[data-ac-table]'));
const tbody = /** @type {HTMLElement} */ (tableWrap.querySelector('tbody'));
/** The calendars the table holds now (a delete takes one away until Filled is pressed again). */
let rows = [...CALENDARS];
{
    const handle = /** @type {import('../../js/datatable.js').DataTableHandle} */ (dataTable(tableWrap));
    const slot = /** @type {HTMLElement} */ (tableWrap.querySelector('[data-kp-datatable-empty]'));
    const plate = statePlate(document, {
        kind: 'empty',
        title: 'No calendars yet',
        text: 'The service account sees none. Make the first one and Almanac shares it with you.',
        actionLabel: 'New calendar',
        onAction: () => $('[data-ac-open-dialog]')?.click(),
    });
    plate.setAttribute('data-kp-art', 'none');
    slot.className = plate.className;
    slot.setAttribute('data-kp-art', 'none');
    slot.replaceChildren(...plate.childNodes);
    attachArt(slot.parentElement ?? document);

    const paint = () => {
        tbody.innerHTML = rows.map(calendarRow).join('\n');
        attachDisabledReasons(tbody);
        attachCodes(tbody);
        handle.refresh();
    };
    const show = (/** @type {string} */ state) => {
        if (state === 'ready') {
            rows = [...CALENDARS];
            paint();
            handle.busy(null);
            handle.state('ready');
        } else if (state === 'loading') {
            handle.busy({ text: 'Reading the calendars', overlay: true });
            handle.state('loading');
        } else if (state === 'empty') {
            rows = [];
            paint();
            handle.busy(null);
            handle.state('ready');
        } else {
            handle.busy(null);
            handle.fail('Google did not answer, so the calendars could not be listed.');
        }
    };
    tableWrap.addEventListener('kp-datatable-retry', () => {
        press('calendars-table', 'state', 'loading');
        show('loading');
        setTimeout(() => {
            press('calendars-table', 'state', 'ready');
            show('ready');
        }, 1400);
    });
    handlers['calendars-table'] = {
        state: show,
        server: () => {},
        width: (value) => setWidth('calendars-table-component', value),
        card: (value) => {
            const tag = /** @type {HTMLElement | null} */ ($('[data-kp-hovercard^="home-assistant"]', tbody));
            if (value === 'open') tag?.focus();
            else if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        },
    };
    // A delete that was confirmed (the package's typed confirmation re-fires the click): the server accepts or refuses.
    tbody.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLButtonElement | null} */ (event.target.closest('[data-ac-delete]')) : null;
        if (!button || button.disabled) return;
        const key = button.getAttribute('data-ac-delete') ?? '';
        const c = calendarOf(key);
        runFlashButton(
            button,
            async () => {
                await wait(700);
                if (current['calendars-table:server'] === 'refuses') return refusalFor(c.name);
                return { word: 'Deleted' };
            },
            { refusal: 'button', busyLabel: 'Deleting' },
        ).then((result) => {
            if (result && !result.ok) return void flavour('destructive', `${c.name} was not deleted: a source started writing to it a moment ago. Delete that source first, on the Sources page.`);
            if (!result?.ok) return;
            rows = rows.filter((r) => r.key !== key);
            paint();
            flavour('success', `Deleted ${c.name} and every event on it (${c.events} events).`);
        });
    });
}

// ── 4 · typed delete confirmation ──────────────────────────────────────────────────────────────────────────────────────────────────
{
    const dialog = /** @type {HTMLElement} */ ($('[data-ac-delete-dialog]'));
    const blockEl = /** @type {HTMLElement} */ ($('[data-ac-type-block]', dialog));
    const go = /** @type {HTMLButtonElement} */ ($('[data-ac-del-go]', dialog));
    const result = /** @type {HTMLElement} */ ($('[data-ac-result]', dialog));
    const title = /** @type {HTMLElement} */ ($('.kp-dialog__title', dialog));
    let key = 'test';
    let built = /** @type {ReturnType<typeof buildTypeConfirm>} */ (/** @type {unknown} */ (null));
    const build = () => {
        const c = calendarOf(key);
        title.textContent = `Delete the calendar ${c.name}?`;
        result.textContent = '';
        go.disabled = true;
        built = buildTypeConfirm(document, {
            name: c.name,
            loses: [`Every event on it: ${c.events} events`, 'The calendar itself, for everyone it is shared with'],
            block: blockEl,
            onChange: (matched) => {
                go.disabled = !matched;
            },
        });
    };
    build();
    const type = (/** @type {string} */ value) => {
        const c = calendarOf(key);
        built.input.value = value === 'right' ? c.name : value === 'wrong' ? c.name.toLowerCase().replace('almanac', 'almanak') : '';
        built.input.dispatchEvent(new Event('input', { bubbles: true }));
        result.textContent = '';
    };
    handlers['calendar-delete'] = {
        calendar: (value) => {
            key = value;
            build();
            press('calendar-delete', 'typed', 'nothing');
        },
        typed: type,
        server: () => {},
    };
    dialog.querySelector('[data-ac-del-cancel]')?.addEventListener('click', () => {
        press('calendar-delete', 'typed', 'nothing');
        type('nothing');
    });
    go.addEventListener('click', () => {
        const c = calendarOf(key);
        runFlashButton(
            go,
            async () => {
                await wait(700);
                if (current['calendar-delete:server'] === 'refuses') return refusalFor(c.name);
                result.textContent = `Deleted ${c.name} and its ${c.events} events.`;
                return { word: 'Deleted' };
            },
            { refusal: 'toast', busyLabel: 'Deleting' },
        );
    });
}

// ── 5 · new calendar dialog ────────────────────────────────────────────────────────────────────────────────────────────────────────
{
    const section = /** @type {HTMLElement} */ ($('#new-calendar-component'));
    const inplace = /** @type {HTMLElement | null} */ ($('[data-ac-new-dialog]'));
    /** Wire one copy of the dialog (the one shown in place, or the modal the header button opens). @param {HTMLElement} dialog @param {() => void} [close] */
    const wire = (dialog, close) => {
        const f = /** @type {HTMLFormElement} */ ($('[data-ac-new-form]', dialog));
        const handle = formOf(f);
        const name = /** @type {HTMLInputElement} */ ($('input[name="name"]', f));
        f.addEventListener(VALID_EVENT, (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            const mode = current['new-calendar:form'];
            const typed = name.value.trim();
            wait(mode === 'making' ? 3500 : 800).then(() => {
                if (mode === 'refused') flavour('error', 'Google refused the request: the service account may not make calendars right now. Check how it is shared.');
                else {
                    toast(`Made ${typed} and shared it with you.`);
                    if (close) close();
                }
                detail.done();
            });
        });
        f.addEventListener(INVALID_EVENT, () => name.focus({ preventScroll: true }));
        $('[data-ac-new-cancel]', dialog)?.addEventListener('click', () => {
            if (close) close();
            else {
                press('new-calendar', 'form', 'empty');
                setForm('empty');
            }
        });
        return { f, handle, name };
    };
    /** @type {ReturnType<typeof wire> | null} */
    let live = inplace ? wire(inplace) : null;
    /** @param {string} value */
    function setForm(value) {
        if (!live) return;
        const { f, handle, name } = live;
        const go = /** @type {HTMLButtonElement} */ ($('[data-ac-new-go]', f));
        const owner = $('[data-ac-sharing]', f);
        handle?.clear();
        go.disabled = false;
        if (owner) owner.textContent = 'The calendar is shared with the owner Almanac is set up for, so it shows up in their Google Calendar at once.';
        name.disabled = false;
        name.value = value === 'empty' || value === 'blank' || value === 'owner' ? '' : 'Household';
        if (value === 'owner') {
            name.disabled = true;
            go.disabled = true;
            if (owner) owner.textContent = 'Almanac cannot make calendars: ALMANAC_CALENDAR_OWNER is not set, so a new calendar would belong to the service account and be visible to nobody.';
        }
        if (value === 'blank' || value === 'making' || value === 'refused') setTimeout(() => f.requestSubmit(), 60);
    }
    handlers['new-calendar'] = {
        form: setForm,
        dialog: (value) => section.setAttribute('data-ac-dialog', value),
    };
    attachDisabledReasons(section);
}
// The header's New calendar opens the same dialog for real, as a modal.
{
    /** @type {HTMLDialogElement | null} */
    let modal = null;
    document.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('[data-ac-open-dialog]') : null;
        if (!button) return;
        if (!modal) {
            modal = document.createElement('dialog');
            modal.className = 'kp-dialog';
            modal.setAttribute('aria-labelledby', 'ac-modal-title');
            modal.innerHTML = newDialogInner('ac-modal');
            document.body.append(modal);
            const m = modal;
            const f = /** @type {HTMLFormElement} */ (m.querySelector('form'));
            f.addEventListener(VALID_EVENT, (e) => {
                const detail = /** @type {CustomEvent} */ (e).detail;
                wait(800).then(() => {
                    toast(`Made ${/** @type {HTMLInputElement} */ (f.elements.namedItem('name')).value.trim()} and shared it with you.`);
                    m.close();
                    detail.done();
                });
            });
            m.querySelector('[data-ac-new-cancel]')?.addEventListener('click', () => m.close());
            import('../../js/forms.js').then((forms) => forms.attachForms(m));
        }
        modal.showModal();
    });
}

// ── 6 · profile files ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
{
    const card = /** @type {HTMLElement} */ ($('#profile-files-component'));
    const box = /** @type {HTMLElement} */ ($('[data-ac-problems]', card));
    const served = /** @type {HTMLElement} */ ($('[data-ac-served]', card));
    const quiet = /** @type {HTMLElement} */ ($('[data-ac-allserved]', card));
    const servedHandle = dataTable(served);
    let shown = 1;
    let files = UNSERVED.slice(0, 1);
    const losesFor = (/** @type {(typeof UNSERVED)[number]} */ u) => {
        const id = `ac-lose-file-${u.key}`;
        if (!document.getElementById(id)) {
            const t = document.createElement('template');
            t.id = id;
            t.innerHTML = `<ul class="kp-type-confirm__list"><li>The file ${u.file} from the profiles folder</li><li>Nothing else: it is not served, so no source uses it</li></ul>`;
            card.append(t);
        }
        return id;
    };
    const drawProblems = () => {
        setProblems(
            box,
            files.map((u) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'kp-button kp-button--destructive kp-button--sm';
                b.setAttribute('data-kp-destructive', '');
                b.setAttribute('data-kp-confirm', `Delete the file ${u.file}?`);
                b.setAttribute('data-kp-confirm-type', u.file);
                b.setAttribute('data-kp-confirm-loses', losesFor(u));
                b.setAttribute('data-kp-confirm-label', 'Delete file');
                b.setAttribute('data-ac-delete-file', u.key);
                b.textContent = 'Delete the file…';
                return { key: u.key, what: `${u.file} is not being served`, why: u.why, remedy: u.remedy, severity: /** @type {const} */ ('warning'), action: b };
            }),
        );
        quiet.hidden = files.length > 0;
    };
    drawProblems();
    handlers['profile-files'] = {
        state: (value) => {
            if (value === 'ready') setCardState(card, 'ready');
            else if (value === 'loading') setCardState(card, 'loading', { words: 'Reading the profile files' });
            else if (value === 'empty') {
                const add = document.createElement('a');
                add.className = 'kp-button kp-button--sm kp-button--primary';
                add.href = '#sources';
                add.textContent = 'Add a source';
                setCardState(card, 'empty', { title: 'No profile files yet', text: 'Add a source on the Sources page and Almanac writes its profile here.', action: add });
            } else setCardState(card, 'error', { title: 'The profiles folder could not be read', text: 'Almanac has no access to it right now.' });
        },
        unserved: (value) => {
            shown = value === 'one' ? 1 : value === 'three' ? 3 : 0;
            files = UNSERVED.slice(0, shown);
            drawProblems();
        },
    };
    card.addEventListener('kp-card-retry', () => {
        press('profile-files', 'state', 'loading');
        setCardState(card, 'loading', { words: 'Reading the profile files' });
        setTimeout(() => {
            press('profile-files', 'state', 'ready');
            setCardState(card, 'ready');
        }, 1400);
    });
    box.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-ac-delete-file]')) : null;
        if (!button) return;
        const key = button.getAttribute('data-ac-delete-file') ?? '';
        const u = UNSERVED.find((x) => x.key === key);
        runFlashButton(button, async () => {
            await wait(700);
            return { word: 'Deleted' };
        }, { refusal: 'toast', busyLabel: 'Deleting' }).then((result) => {
            if (!result?.ok || !u) return;
            files = files.filter((f) => f.key !== key);
            if (!files.length) press('profile-files', 'unserved', 'none');
            drawProblems();
            toast(`Deleted ${u.file}.`);
        });
    });
    void servedHandle;
    void servedRow;
}

// ── 7 · the uses map (feat-ui-1) ────────────────────────────────────────────────────────────────────────────────────────────────────────
{
    const component = /** @type {HTMLElement} */ ($('#uses-map-component'));
    const lines = /** @type {HTMLElement} */ ($('[data-ac-lines]', component));
    const graph = /** @type {HTMLElement} */ ($('[data-ac-graph]', component));
    const switcher = /** @type {HTMLElement} */ ($('[data-ac-view-switch]', component));
    const { rows: calRows, columns: srcColumns } = usesNodes();
    const spec = {
        corner: 'Calendar ↓ source →',
        rows: calRows,
        columns: srcColumns,
        label: 'Which source writes to which calendar',
        cell: (/** @type {string} */ row, /** @type {string} */ column) =>
            SOURCES.find((s) => s.id === column)?.calendar === row ? { tone: 'ok', label: 'writes here' } : { tone: 'none' },
        countLabel: (/** @type {number} */ n) => `${n} ${n === 1 ? 'source' : 'sources'}`,
        sourcesLabel: 'Calendars',
        usersLabel: 'Sources',
        view: /** @type {const} */ ('lines'),
    };
    const draw = (/** @type {string} */ state) => {
        if (state === 'loading') {
            setMatrix(lines, { ...spec, state: 'loading', skeleton: 3 });
            setGraphState(graph, 'loading', 'Reading the set-up');
        } else if (state === 'empty') {
            setMatrix(lines, { view: 'lines', rows: [], columns: [], state: 'empty', message: 'No source writes to a calendar yet' });
            setGraphState(graph, 'empty', 'No source writes to a calendar yet');
        } else if (state === 'failed') {
            setMatrix(lines, { view: 'lines', rows: [], columns: [], state: 'error', message: 'The set-up could not be read' });
            setGraphState(graph, 'error', 'The set-up could not be read');
        } else {
            setMatrix(lines, spec);
            setGraphData(graph, usesGraph());
        }
        pin(current['uses-map:pin'] ?? 'none');
    };
    const pin = (/** @type {string} */ value) => {
        setUsesPin(lines, value === 'pinned' ? 'home-assistant' : null);
        graphSelect(graph, value === 'pinned' ? ['home-assistant'] : []);
    };
    /** @param {string} view */
    const view = (view) => {
        component.setAttribute('data-ac-view', view);
        lines.hidden = view !== 'lines';
        graph.hidden = view !== 'graph';
        setSegmentedValues(switcher, [view]);
        // A graph drawn while hidden has no size: draw it again now that it can be measured.
        if (view === 'graph' && (current['uses-map:state'] ?? 'ready') === 'ready') requestAnimationFrame(() => setGraphData(graph, usesGraph()));
    };
    draw('ready');
    view('lines');
    handlers['uses-map'] = { state: draw, pin, width: (value) => setWidth('uses-map-component', value) };
    switcher.addEventListener('kp-segmented-change', (event) => view(/** @type {CustomEvent} */ (event).detail.value));
    lines.addEventListener('kp-uses-retry', () => {
        press('uses-map', 'state', 'loading');
        draw('loading');
        setTimeout(() => {
            press('uses-map', 'state', 'ready');
            draw('ready');
        }, 1400);
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === 'uses-view') view(String(detail.value));
    });
    void setMatrixLit;
}
