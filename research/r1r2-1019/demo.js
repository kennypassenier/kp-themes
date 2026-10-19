// research/r1r2-1019: the page's own wiring. The components and their states are the package's (js/auto.js attaches them); this file gives
// each one sample data and wires the state buttons by the section's own elements.
import { setCalendarDays, setCalendarState, setCalendarLegend, CALENDAR_RETRY_EVENT } from '../../js/calendar.js';
import { setPipeline, setPipelineState, PIPELINE_RETRY_EVENT } from '../../js/pipeline.js';

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
await ready;

/** How long the "read it again" after a Retry takes, in ms. */
const READ_MS = 1400;

const $ = (/** @type {string} */ sel, /** @type {ParentNode} */ root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));

/**
 * A section's state buttons: `data-sp-set="<key>"` with `data-sp-value`. `apply(key, value)` draws; the pressed one follows.
 * @param {string} id the section's id
 * @param {(key: string, value: string) => void} apply
 */
function wire(id, apply) {
    const section = document.getElementById(id);
    if (!section) return () => {};
    const set = (/** @type {string} */ key, /** @type {string} */ value) => {
        for (const b of section.querySelectorAll(`[data-sp-set="${key}"]`))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-sp-value') === value));
        apply(key, value);
    };
    section.addEventListener('click', (event) => {
        const b = event.target instanceof Element ? event.target.closest('[data-sp-set]') : null;
        if (b && section.contains(b)) set(b.getAttribute('data-sp-set') ?? '', b.getAttribute('data-sp-value') ?? '');
    });
    return set;
}

// ---- 1 · the month calendar ---------------------------------------------------------------------------
{
    const el = $('[data-kp-calendar]', document.getElementById('calendar-states') ?? document);
    if (el) {
        /** @type {Record<string, { tone: 'ok' | 'warn' | 'bad', count: string, label: string }>} */
        const days = {};
        for (let d = 1; d <= 19; d += 1) {
            const iso = `2026-10-${String(d).padStart(2, '0')}`;
            const tone = d === 7 ? 'bad' : d % 6 === 0 ? 'warn' : 'ok';
            const count = tone === 'bad' ? '5/9' : tone === 'warn' ? '8/9' : '9/9';
            days[iso] = { tone, count, label: `${count} services backed up` };
        }
        let calm = false;
        let state = 'ready';
        const draw = () => {
            if (calm) el.setAttribute('data-kp-tones', 'calm');
            else el.removeAttribute('data-kp-tones');
            if (state === 'ready') {
                setCalendarState(el, 'ready');
                setCalendarDays(el, days);
            } else if (state === 'loading') setCalendarState(el, 'loading');
            else if (state === 'empty') setCalendarState(el, 'empty', calm ? '' : 'No backups were planned this month');
            else setCalendarState(el, 'error', calm ? '' : 'The backup log could not be read');
        };
        const set = wire('calendar-states', (key, value) => {
            if (key === 'tones') calm = value === 'calm';
            else if (key === 'busy') {
                el.classList.toggle('kp-calendar--busy-days', value === 'days');
                el.classList.toggle('kp-calendar--busy-whole', value === 'whole');
            } else state = value;
            draw();
        });
        el.addEventListener(CALENDAR_RETRY_EVENT, () => {
            set('state', 'loading');
            setTimeout(() => set('state', 'ready'), READ_MS);
        });
        setCalendarLegend(el, [
            { tone: 'ok', label: 'All backed up' },
            { tone: 'warn', label: 'Some missing' },
            { tone: 'bad', label: 'Most missing' },
        ]);
        draw();
    }
}

// ---- 2 · the pipeline -----------------------------------------------------------------------------------
{
    const el = $('[data-kp-pipeline]', document.getElementById('pipeline-states') ?? document);
    if (el) {
        const lanes = (/** @type {boolean} */ danger) => [
            { key: 'draft', label: 'Draft', tone: /** @type {const} */ (1) },
            { key: 'sent', label: 'Sent', tone: /** @type {const} */ (2) },
            { key: 'wait', label: 'Awaiting the reference letter', tone: /** @type {const} */ (3), ...(danger ? { danger: true } : {}) },
            { key: 'offer', label: 'Offer', tone: /** @type {const} */ (4) },
            { key: 'closed', label: 'Closed · no status', closed: true },
        ];
        const names = [
            ['Frontend developer', 'Acme Software'],
            ['Rust engineer', 'Northwind'],
            ['Platform engineer', 'Contoso'],
            ['Designer', 'Fabrikam'],
            ['Data analyst', 'Initech'],
            ['Site reliability', 'Globex'],
            ['Backend developer', 'Umbrella'],
        ];
        const keys = ['draft', 'sent', 'wait', 'offer', 'closed'];
        const cards = Array.from({ length: 11 }, (_, i) => {
            const [title, sub] = names[i % names.length] ?? ['Role', 'Company'];
            return { id: `a${i}`, lane: keys[[0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4][i] ?? 0] ?? 'draft', title, sub, meta: `0${(i % 9) + 1}/10/2026`, mark: sub.slice(0, 2).toUpperCase() };
        });
        const set = wire('pipeline-states', (_, value) => {
            if (value === 'ready' || value === 'danger') {
                setPipeline(el, { lanes: lanes(value === 'danger'), cards });
                setPipelineState(el, 'ready');
            } else if (value === 'loading') setPipelineState(el, 'loading');
            else if (value === 'empty') setPipelineState(el, 'empty', 'Nothing on the board yet');
            else setPipelineState(el, 'error', 'The host did not answer.');
        });
        el.addEventListener(PIPELINE_RETRY_EVENT, () => {
            set('state', 'loading');
            setTimeout(() => set('state', 'ready'), READ_MS);
        });
        setPipeline(el, { lanes: lanes(false), cards });
    }
}
