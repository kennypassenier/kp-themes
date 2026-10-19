// research/almanac-align-1019: the page's own wiring. Every component is the package's (js/auto.js attaches them); this file
// presses the Now / Fixed controls (a pressed button sets `data-aa-version` on the section's stage, CSS shows one variant), fills
// the month and the attention band with the approved sample data, and gives the typed confirm, the new-calendar form and the
// editor their behaviour in both variants alike, so Now and Fixed differ in layout only.
import { setCalendarDays, setCalendarLegend, setCalendarCaption } from '../../js/calendar.js';
import { setAttention } from '../../js/attention.js';
import { runFlashButton } from '../../js/flash.js';
import { toast } from '../../js/overlays.js';
import { buildTypeConfirm } from '../../js/components.js';
import { form as formOf, VALID_EVENT, INVALID_EVENT } from '../../js/forms.js';
import { FIRST_DAY, TODAY, deliveredOn, human } from '../almanac-calendar-views/sample.js';
import { UNSERVED, calendarOf } from '../almanac-calendars/data.js';

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
/** @param {string} section @param {string} group @param {string} value */
function press(section, group, value) {
    for (const b of document.querySelectorAll(`[data-aa-ctl="${section}:${group}"]`)) b.setAttribute('aria-pressed', String(b.getAttribute('data-aa-v') === value));
}
/** @param {string} section @param {string} name @param {string} value */
const stageAttr = (section, name, value) => document.getElementById(`${section}-component`)?.setAttribute(name, value);

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-aa-ctl]') : null;
    if (!button) return;
    const [section = '', group = ''] = (button.getAttribute('data-aa-ctl') ?? '').split(':');
    const value = button.getAttribute('data-aa-v') ?? '';
    press(section, group, value);
    if (group === 'version') stageAttr(section, 'data-aa-version', value);
    if (group === 'width') stageAttr(section, 'data-aa-width', value);
    handlers[section]?.[group]?.(value);
});

await ready;

// ── 1 · the editor: Try it answers in both variants ────────────────────────────────────────────────────────────────────────────────
for (const form of document.querySelectorAll('[data-aa-editor]')) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const answer = $('[data-aa-answer]', form);
        if (!answer) return;
        answer.className = 'kp-alert kp-alert--info';
        answer.innerHTML = '<span><span class="kp-alert__label">Asking: </span>Almanac is checking the call.</span>';
        setTimeout(() => {
            answer.className = 'kp-alert kp-alert--success';
            answer.innerHTML =
                '<span><span class="kp-alert__label">Accepted (200): </span>Would write &quot;Wasmachine klaar&quot; to Almanac · Huishouden. Nothing was written.</span>';
        }, 500);
    });
}

// ── 2 · the month ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
/** @type {Record<string, import('../../js/calendar.js').CalendarDay>} */
const days = {};
for (let d = new Date(Date.UTC(2026, 7, 1)); d <= new Date(Date.UTC(2026, 9, 19)); d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    if (iso < FIRST_DAY) days[iso] = { tone: 'before', label: `${human(iso)}: before Almanac started` };
    else if (iso <= TODAY) {
        const rows = deliveredOn(iso);
        const failed = rows.filter((r) => r.result === 'failed').length;
        const delivered = rows.length - failed;
        days[iso] = {
            tone: failed ? 'bad' : rows.length ? 'ok' : 'muted',
            count: `${delivered}/${rows.length}`,
            label: `${human(iso)}: ${delivered} of ${rows.length} events delivered${failed ? `, ${failed} failed` : ''}`,
        };
    }
}
for (const calendar of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-aa-calendar]')])) {
    setCalendarDays(calendar, days);
    setCalendarLegend(calendar, [
        { tone: 'ok', label: 'Every event delivered' },
        { tone: 'bad', label: 'At least one failed' },
        { tone: 'before', label: 'Before Almanac started' },
        { tone: 'future', label: 'Still to come' },
    ]);
    setCalendarCaption(calendar, 'Under each day: events delivered of events accepted. Sample data.');
}

// ── 3 · the attention band (two bands, one per variant, the same problems) ──────────────────────────────────────────────────────────
{
    const bands = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-aa-attention]')]);
    const fix = (/** @type {string} */ key, /** @type {string} */ label) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'kp-button kp-button--sm';
        b.setAttribute('data-aa-fix', key);
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
    const draw = () => {
        for (const band of bands) setAttention(band, shown.map((k) => ITEMS[/** @type {'google' | 'file'} */ (k)]()));
    };
    draw();
    handlers['cal-attention'] = {
        problems: (value) => {
            shown = value === 'both' ? ['google', 'file'] : value === 'google' ? ['google'] : value === 'file' ? ['file'] : [];
            draw();
        },
    };
    for (const band of bands) {
        band.addEventListener('click', (event) => {
            const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-aa-fix]')) : null;
            if (!button) return;
            const key = button.getAttribute('data-aa-fix') ?? '';
            runFlashButton(
                button,
                async () => {
                    await wait(700);
                    return 'Done';
                },
                { refusal: 'toast', busyLabel: key === 'google' ? 'Checking' : 'Reloading', width: 'keep' },
            ).then((result) => {
                if (!result?.ok) return;
                toast(
                    key === 'google'
                        ? 'Google Calendar answers again; the waiting events are being delivered.'
                        : 'Profile files read again: 4 served, 0 not served.',
                );
                setTimeout(() => {
                    shown = shown.filter((k) => k !== key);
                    press('cal-attention', 'problems', shown.length === 2 ? 'both' : (shown[0] ?? 'none'));
                    draw();
                }, 500);
            });
        });
    }
}

// ── 4 · the typed delete confirm (the same words and rule in both variants) ───────────────────────────────────────────────────────────
{
    const dialogs = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-aa-delete]')]);
    const c = calendarOf('test');
    const built = dialogs.map((dialog) => {
        const go = /** @type {HTMLButtonElement} */ ($('[data-aa-go]', dialog));
        const result = /** @type {HTMLElement} */ ($('[data-aa-result]', dialog));
        const typed = buildTypeConfirm(document, {
            name: c.name,
            loses: [`Every event on it: ${c.events} events`, 'The calendar itself, for everyone it is shared with'],
            block: /** @type {HTMLElement} */ ($('[data-aa-type-block]', dialog)),
            onChange: (/** @type {boolean} */ matched) => {
                go.disabled = !matched;
            },
        });
        go.addEventListener('click', () => {
            runFlashButton(
                go,
                async () => {
                    await wait(700);
                    result.textContent = `Deleted ${c.name} and its ${c.events} events (sample: nothing is really deleted).`;
                    return { word: 'Deleted' };
                },
                { refusal: 'toast', busyLabel: 'Deleting' },
            );
        });
        $('[data-aa-cancel]', dialog)?.addEventListener('click', () => {
            press('cal-delete', 'typed', 'nothing');
            set('nothing');
        });
        return typed;
    });
    /** @param {string} value */
    function set(value) {
        for (const typed of built) {
            typed.input.value = value === 'right' ? c.name : value === 'wrong' ? c.name.toLowerCase().replace('almanac', 'almanak') : '';
            typed.input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        for (const r of document.querySelectorAll('[data-aa-result]')) r.textContent = '';
    }
    handlers['cal-delete'] = { typed: set };
}

// ── 5 · the new-calendar form ───────────────────────────────────────────────────────────────────────────────────────────────────────────
{
    const forms = /** @type {HTMLFormElement[]} */ ([...document.querySelectorAll('[data-aa-new]')]);
    for (const f of forms) {
        const handle = formOf(f);
        const name = /** @type {HTMLInputElement} */ ($('input[name="name"]', f));
        f.addEventListener(VALID_EVENT, (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            const typed = name.value.trim();
            wait(800).then(() => {
                toast(`Made ${typed} and shared it with you.`);
                detail.done();
            });
        });
        f.addEventListener(INVALID_EVENT, () => name.focus({ preventScroll: true }));
        $('[data-aa-new-cancel]', f)?.addEventListener('click', () => {
            handle?.clear();
            for (const input of forms.map((x) => /** @type {HTMLInputElement} */ ($('input[name="name"]', x)))) input.value = '';
            press('cal-new', 'form', 'empty');
        });
    }
    handlers['cal-new'] = {
        form: (value) => {
            stageAttr('cal-new', 'data-aa-form', value);
            for (const f of forms) {
                formOf(f)?.clear();
                /** @type {HTMLInputElement} */ ($('input[name="name"]', f)).value = value === 'filled' ? 'Household' : '';
            }
        },
    };
}

// ── 6 · the phone cards: a confirmed delete answers like the table of the approved page ─────────────────────────────────────────────────
for (const tbody of document.querySelectorAll('#cal-cards-component tbody')) {
    tbody.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLButtonElement | null} */ (event.target.closest('[data-ac-delete]')) : null;
        if (!button || button.disabled) return;
        const c = calendarOf(button.getAttribute('data-ac-delete') ?? '');
        runFlashButton(
            button,
            async () => {
                await wait(700);
                return { word: 'Deleted' };
            },
            { refusal: 'button', busyLabel: 'Deleting' },
        ).then((result) => {
            if (result?.ok) toast(`Sample data: ${c.name} is not really deleted.`);
        });
    });
}
