// research/wishes-1028: the page's own wiring. Every component is the package's (attached by js/auto.js from its data-kp-* attributes, or built
// here where a section needs its own storage or its own data); this file gives each its mock data and wires the controls of each section by
// its own elements. The data is the apps' own, with mock times and counts: Almanac's deliveries and mapping profile, homelab's stacks,
// Kitchen's dishes and cooking steps. A gantt is live by nature: its bars are laid out against the real clock, in minutes before and after now.

import { setCode } from '../../js/code.js';
import { newPill } from '../../js/newpill.js';
import { dataTable } from '../../js/datatable.js';
import { refreshOf, refreshDone } from '../../js/auto-refresh.js';
import { setSecretInputValue, secretInputValue } from '../../js/patterns.js';
import { attachUnsaved } from '../../js/unsaved.js';
import { setGanttRuns, setGanttState, setGanttWindow } from '../../js/gantt.js';
import { form } from '../../js/forms.js';
import { getStepsPassed, getSteps, goToStep, setFocusSteps, setFocusStepsState } from '../../js/focus-steps.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = document.documentElement.hasAttribute('data-kp-auto-ready')
    ? Promise.resolve()
    : new Promise((resolve) => {
          new MutationObserver((_, watch) => {
              if (document.documentElement.hasAttribute('data-kp-auto-ready')) {
                  watch.disconnect();
                  resolve(undefined);
              }
          }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
      });

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const name = button.dataset.pg ?? '';
    const handler = HANDLERS[name];
    if (!handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};

const MIN = 60_000;
/** @param {string} id @param {string} text */
const say = (id, text) => {
    $(id).textContent = text;
};

// ---------------------------------------------------------------- pill-tbody
{
    const SOURCES = [
        ['home-assistant', 'Almanac · Huishouden', 'Kitchen light left on'],
        ['grafana', 'Almanac · Infra', 'Disk space low on CT 106'],
        ['energy-prices', 'Almanac · Energie', 'Cheap power 02:00 to 05:00'],
        ['uptime-kuma', 'Almanac · Infra', 'Prometheus did not answer for 1 min'],
    ];
    let count = 12;
    let clock = 12 * 60 + 20;
    const feed = $('pg-feed');
    const body = $('pg-feed-body');
    const table = $('pg-feed-table');
    const report = () => {
        const handle = newPill(feed);
        const unseen = handle?.unseen() ?? 0;
        say(
            'pg-feed-log',
            `${body.querySelectorAll('tr[data-kp-row-key]').length} deliveries · ${handle?.following() ? 'following the newest' : 'reading older rows'} · ${unseen === 1 ? '1 delivery' : `${unseen} deliveries`} not seen yet`,
        );
    };
    const add = (/** @type {number} */ n) => {
        for (let i = 0; i < n; i += 1) {
            count += 1;
            clock += 7;
            const [source, calendar, event] = SOURCES[count % SOURCES.length] ?? SOURCES[0];
            const row = document.createElement('tr');
            row.dataset.kpRowKey = `d${count}`;
            const time = `${String(Math.floor(clock / 60) % 24).padStart(2, '0')}:${String(clock % 60).padStart(2, '0')}`;
            for (const text of [time, source, calendar, event]) row.append(Object.assign(document.createElement('td'), { textContent: text }));
            body.append(row);
        }
    };
    on('feed-add', (value) => add(value === 'one' ? 1 : 3));
    on('feed-read', (value) => {
        if (value === 'older') feed.scrollTop = 0;
        else newPill(feed)?.jump();
    });
    on('feed-sort', (value) => {
        const handle = dataTable(table);
        handle?.sort(value === 'source' ? { column: 1, direction: 'ascending' } : null);
        window.setTimeout(report, 50);
    });
    feed.addEventListener('kp-follow-change', report);
    ready.then(() => {
        // The box opens at the newest row, as a log does.
        feed.scrollTop = feed.scrollHeight;
        report();
    });
}

// ---------------------------------------------------------------- filter-field
{
    const table = $('pg-stacks');
    let mode = 'id';
    /** What each choice sets, written the new way (a column id) and the old way (a number: the toggle column is 0). */
    const SHOW = {
        running: { id: 'status', index: 3, value: ['running'] },
        stopped: { id: 'status', index: 3, value: ['stopped'] },
        six: { id: 'containers', index: 2, value: { from: '6' } },
        none: { id: 'status', index: 3, value: ['paused'] },
    };
    const readout = () => {
        const view = dataTable(table)?.view();
        say('pg-stacks-filters', JSON.stringify(view?.filters ?? {}));
        say('pg-stacks-fields', JSON.stringify(view?.filtersByField ?? {}));
        const rows = dataTable(table)?.rows('view').length ?? 0;
        say('pg-stacks-log', `${rows === 1 ? '1 stack' : `${rows} stacks`} shown`);
    };
    let shown = 'running';
    const apply = () => {
        const handle = dataTable(table);
        if (!handle) return;
        const value = shown;
        handle.clearFilters();
        if (value === 'all') say('pg-stacks-call', 'clearFilters()');
        else {
            const set = SHOW[/** @type {'running'} */ (value)];
            const column = mode === 'id' ? set.id : set.index;
            handle.filter(column, set.value);
            say('pg-stacks-call', `filter(${JSON.stringify(column)}, ${JSON.stringify(set.value)})`);
        }
        readout();
    };
    // Both choices end in the same filter, but the call differs: switching the way it is written writes it again at once.
    on('stack-mode', (value) => {
        mode = value;
        apply();
    });
    on('stack-show', (value) => {
        shown = value;
        apply();
    });
    on('stack-state', (value) => {
        const handle = dataTable(table);
        if (value === 'loading') {
            handle?.busy({ overlay: true });
            handle?.state('loading');
        }
        else if (value === 'failed') handle?.fail('The host did not answer in time.');
        else handle?.state('ready');
    });
    table.addEventListener('kp-datatable-retry', () => {
        for (const b of document.querySelectorAll('button[data-pg="stack-state"]')) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === 'ready'));
        dataTable(table)?.state('ready');
    });
    ready.then(apply);
}

// ---------------------------------------------------------------- code-toml
{
    const samples = /** @type {{ toml: string, bash: string }} */ (JSON.parse($('pg-samples').textContent ?? '{}'));
    const code = $('pg-code');
    const spec = { text: 'toml', colour: true, state: 'ready' };
    const draw = () => {
        const toml = spec.text === 'toml';
        setCode(code, {
            title: toml ? 'home-assistant.toml' : 'check-version.sh',
            language: toml ? 'TOML' : 'bash',
            text: samples[toml ? 'toml' : 'bash'],
            lines: true,
            highlight: spec.colour,
            maxLines: 0,
            state: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (spec.state),
            ...(spec.state === 'empty' ? { message: 'This profile has no text yet' } : {}),
            ...(spec.state === 'error' ? { message: 'Could not read the profile' } : {}),
            loadingWords: 'Reading the profile',
        });
    };
    on('code-text', (value) => {
        spec.text = value;
        draw();
    });
    on('code-colour', (value) => {
        spec.colour = value === 'on';
        draw();
    });
    on('code-state', (value) => {
        spec.state = value;
        draw();
    });
    code.addEventListener('kp-code-retry', () => {
        spec.state = 'ready';
        for (const b of document.querySelectorAll('button[data-pg="code-state"]')) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === 'ready'));
        draw();
    });
    ready.then(draw);
}

// ---------------------------------------------------------------- refresh-title
{
    const one = $('pg-rt-one');
    const two = $('pg-rt-two');
    const grid = $('pg-rt-grid');
    let outcome = 'ok';
    const titles = new Map([
        [one, 'Almanac · Huishouden'],
        [two, 'Almanac · Infra'],
    ]);
    for (const el of [one, two, grid])
        el.addEventListener('kp-refresh', (event) => {
            const detail = /** @type {CustomEvent<{ done: (ok: boolean) => void }>} */ (event).detail;
            window.setTimeout(() => detail.done(outcome === 'ok'), 700);
        });
    on('rt-title', (value) => {
        for (const [el, words] of titles) {
            if (value === 'on') el.setAttribute('data-kp-refresh-title', words);
            else el.removeAttribute('data-kp-refresh-title');
        }
    });
    on('rt-label', (value) => {
        for (const el of [one, two]) {
            if (value === 'on') el.setAttribute('data-kp-refresh-label', 'Auto-refresh');
            else el.removeAttribute('data-kp-refresh-label');
        }
    });
    on('rt-outcome', (value) => {
        outcome = value;
        // Press once, and the bars try right away so the outcome is seen.
        for (const el of [one, two, grid]) refreshOf(el)?.now('now');
    });
    ready.then(() => {
        for (const el of [one, two, grid]) refreshOf(el)?.now('now');
        void refreshDone;
    });
}

// ---------------------------------------------------------------- secret-input
{
    const field = $('pg-secret');
    const TOKEN = 'cfut_8Qm2vT0xK1h9LwR4aZ7pYb3NcJdE6sUoX5q';
    const log = (/** @type {string} */ text) => say('pg-sec-log', text);
    on('sec-value', (value) => setSecretInputValue(field, value === 'token' ? TOKEN : ''));
    on('sec-problem', (value) => {
        field.removeAttribute('data-kp-secret-invalid');
        field.removeAttribute('data-kp-secret-disabled');
        if (value === 'invalid') field.setAttribute('data-kp-secret-invalid', 'This is not a Cloudflare API token: it should be 40 characters.');
        if (value === 'disabled') field.setAttribute('data-kp-secret-disabled', 'Only an administrator can change the token.');
    });
    on('sec-ttl', (value) => field.setAttribute('data-kp-secret-ttl', value));
    field.addEventListener('kp-secret', (event) => {
        const detail = /** @type {CustomEvent<{ shown: boolean, reason: string }>} */ (event).detail;
        log(detail.shown ? 'Shown: the box reads as text.' : `Hidden again (${detail.reason}).`);
    });
    field.addEventListener('kp-secret-clipboard', (event) => {
        const detail = /** @type {CustomEvent<{ cleared: boolean, reason: string }>} */ (event).detail;
        log(detail.cleared ? 'The clipboard was emptied again.' : `The clipboard was left alone (${detail.reason}).`);
    });
    field.addEventListener('input', () => log(secretInputValue(field) === '' ? 'Nothing typed.' : `${secretInputValue(field).length} characters typed.`));
}

// ---------------------------------------------------------------- unsaved-storage
{
    /** A Storage-shaped store this page keeps in memory: the "own store" a consumer would hand in. */
    const store = new Map();
    const own = {
        getItem: (/** @type {string} */ key) => store.get(key) ?? null,
        setItem: (/** @type {string} */ key, /** @type {string} */ value) => void store.set(key, String(value)),
        removeItem: (/** @type {string} */ key) => void store.delete(key),
        clear: () => store.clear(),
        key: (/** @type {number} */ i) => [...store.keys()][i] ?? null,
        get length() {
            return store.size;
        },
    };
    const slot = $('pg-unsaved-slot');
    const settings = /** @type {HTMLFormElement} */ ($('pg-settings'));
    let choice = 'session';
    /** @type {(() => void) | null} */
    let detach = null;
    /** @param {Storage | { getItem: (k: string) => string | null, key: (i: number) => string | null, length: number }} s */
    const keptIn = (s) => {
        const keys = [];
        for (let i = 0; i < s.length; i += 1) {
            const key = s.key(i);
            if (key?.startsWith('kp-unsaved:') && key.endsWith(':pg-settings-1028')) keys.push(`${s.getItem(key)}`);
        }
        return keys.length ? keys.join(' ') : 'nothing';
    };
    const readout = () => {
        say('pg-uns-session', keptIn(window.sessionStorage));
        say('pg-uns-local', keptIn(window.localStorage));
        say('pg-uns-own', keptIn(/** @type {any} */ (own)));
    };
    const forget = () => {
        for (const s of [window.sessionStorage, window.localStorage, own]) {
            for (let i = s.length - 1; i >= 0; i -= 1) {
                const key = s.key(i);
                if (key?.startsWith('kp-unsaved:') && key.endsWith(':pg-settings-1028')) s.removeItem(key);
            }
        }
    };
    /** Put the settings back to what was saved and attach the bar again with the chosen storage. */
    const attach = () => {
        detach?.();
        settings.reset();
        slot.replaceChildren();
        const bar = document.createElement('div');
        bar.className = 'kp-unsaved';
        bar.id = 'pg-unsaved';
        for (const [name, value] of Object.entries({
            'data-kp-unsaved': '',
            'data-kp-unsaved-for': '#pg-settings',
            'data-kp-name': 'pg-settings-1028',
            'data-kp-placement': 'header',
            'data-kp-warn-leave': 'off',
            ...(choice === 'local' ? { 'data-kp-keep': 'local' } : {}),
        }))
            bar.setAttribute(name, value);
        slot.append(bar);
        const storage = choice === 'own' ? /** @type {any} */ (own) : choice === 'none' ? null : undefined;
        detach = attachUnsaved(slot, storage === undefined ? {} : { storage });
        window.setTimeout(readout, 50);
    };
    on('uns-store', (value) => {
        choice = value;
        forget();
        attach();
    });
    on('uns-act', (value) => {
        if (value === 'reload') {
            attach();
            return;
        }
        const set = (/** @type {string} */ name, /** @type {string} */ to) => {
            const input = /** @type {HTMLInputElement} */ (settings.elements.namedItem(name));
            input.value = to;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        };
        set('pg-window', '04:30');
        set('pg-keep', '30');
        window.setTimeout(readout, 50);
    });
    slot.addEventListener('kp-unsaved-change', () => window.setTimeout(readout, 50));
    slot.addEventListener('kp-unsaved-discard', () => window.setTimeout(readout, 50));
    ready.then(() => {
        forget();
        attach();
    });
}

// ---------------------------------------------------------------- the gantts (legend, rest, phone)
{
    const lanes = [
        { id: 'sauce', label: 'Sauce' },
        { id: 'pasta', label: 'Pasta' },
    ];
    /** The plan, in minutes from now: Kitchen's spaghetti bolognese on two tracks. */
    const bolognese = () => {
        const now = Date.now();
        const at = (/** @type {number} */ m) => now + m * MIN;
        return [
            { id: 'b1', lane: 'sauce', label: 'Chop the onion, carrot and celery', start: at(-42), end: at(-32), state: 'ok' },
            { id: 'b2', lane: 'sauce', label: 'Brown the mince', start: at(-32), end: at(-21), state: 'ok' },
            { id: 'b3', lane: 'sauce', label: 'Simmer with the tomatoes', start: at(-20), state: 'running' },
            { id: 'b4', lane: 'sauce', label: 'Season and rest', start: at(25), end: at(30), state: 'planned' },
            { id: 'b5', lane: 'pasta', label: 'Boil the water', start: at(-14), end: at(-6), state: 'ok' },
            { id: 'b6', lane: 'pasta', label: 'Cook the spaghetti', start: at(17), end: at(27), state: 'planned' },
            { id: 'b7', lane: 'pasta', label: 'Drain and plate', start: at(28), end: at(33), state: 'planned' },
        ];
    };
    /** A window that holds the plan: 50 minutes back, 40 ahead. */
    const planWindow = () => ({ span: 90 * 60, live: false, to: Date.now() + 40 * MIN });
    /** @param {HTMLElement} el @param {string} value */
    const stateOf = (el, value) => {
        if (value === 'loading') setGanttState(el, 'loading');
        else if (value === 'empty') setGanttState(el, 'empty', 'No plan yet', { text: 'Choose a dish and its steps are laid out here.' });
        else if (value === 'error') setGanttState(el, 'error', 'Could not read the plan', { text: 'The kitchen did not answer.' });
        else setGanttState(el, 'ready');
    };

    // legend
    {
        const el = $('pg-gl');
        on('gl-legend', (value) => {
            if (value === 'all') el.removeAttribute('data-kp-gantt-legend');
            else el.setAttribute('data-kp-gantt-legend', value === 'list' ? 'ok running planned' : value);
        });
        on('gl-state', (value) => stateOf(el, value));
        el.addEventListener('kp-gantt-retry', () => {
            for (const b of document.querySelectorAll('button[data-pg="gl-state"]')) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === 'ready'));
            stateOf(el, 'ready');
        });
        ready.then(() => {
            setGanttWindow(el, planWindow());
            setGanttRuns(
                el,
                bolognese(),
                lanes,
            );
        });
    }

    // rest
    {
        const el = $('pg-gr');
        let plan = 'soon';
        const runs = () => {
            const now = Date.now();
            const at = (/** @type {number} */ m) => now + m * MIN;
            const end = plan === 'later' ? at(40) : plan === 'over' ? at(-3) : at(25);
            return [
                { id: 'r1', lane: 'ragu', label: 'Brown the mince', start: at(-32), end: at(-21), state: 'ok' },
                { id: 'r2', lane: 'ragu', label: 'Simmer the ragù', start: at(-20), plannedEnd: end, state: 'running' },
                { id: 'r3', lane: 'pasta', label: 'Boil the water', start: at(-14), end: at(-6), state: 'ok' },
                { id: 'r4', lane: 'pasta', label: 'Cook the spaghetti', start: at(18), end: at(23), state: 'planned' },
            ];
        };
        const rows = [
            { id: 'ragu', label: 'Ragù' },
            { id: 'pasta', label: 'Pasta' },
        ];
        on('gr-rest', (value) => {
            if (value === 'off') el.setAttribute('data-kp-gantt-rest', 'off');
            else el.removeAttribute('data-kp-gantt-rest');
        });
        on('gr-plan', (value) => {
            plan = value;
            setGanttRuns(el, runs(), rows);
        });
        on('gr-state', (value) => stateOf(el, value));
        el.addEventListener('kp-gantt-retry', () => {
            for (const b of document.querySelectorAll('button[data-pg="gr-state"]')) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === 'ready'));
            stateOf(el, 'ready');
        });
        ready.then(() => setGanttRuns(el, runs(), rows));
    }

    // phone
    {
        const el = $('pg-gp');
        const box = $('pg-gp-box');
        on('gp-width', (value) => box.setAttribute('data-pg-width', value));
        on('gp-scroll', (value) => {
            if (value === 'auto') el.removeAttribute('data-kp-gantt-scroll');
            else el.setAttribute('data-kp-gantt-scroll', value);
        });
        on('gp-min', (value) => el.style.setProperty('--kp-gantt-min-width', value === '0' ? '0px' : value));
        ready.then(() => {
            setGanttWindow(el, planWindow());
            setGanttRuns(el, bolognese(), lanes);
        });
    }
}

// ---------------------------------------------------------------- steps-getter
{
    const fs = $('pg-fs');
    /** Flemish beef stew (Stoofvlees), the way Kitchen writes a recipe: one step per action, a time per step. */
    const STEPS = [
        { id: 's1', title: 'Cut and dry the beef', mins: 10, text: 'Cut 800 g of beef chuck into 4 cm cubes and pat them dry.', ingredients: [{ amount: '800 g', name: 'beef chuck' }] },
        { id: 's2', title: 'Brown the beef', mins: 15, text: 'Brown the beef in batches in a hot pan with butter. Set it aside.', ingredients: [{ amount: '30 g', name: 'butter' }] },
        { id: 's3', title: 'Soften the onions', mins: 10, text: 'Soften 3 sliced onions in the same pan with the thyme and a bay leaf.', ingredients: [{ amount: '3', name: 'onions' }] },
        { id: 's4', title: 'Add mustard and gingerbread', mins: 5, text: 'Stir in 2 tbsp of mustard and put 2 slices of gingerbread on top.', ingredients: [{ amount: '2 tbsp', name: 'mustard' }] },
        { id: 's5', title: 'Pour in the beer', mins: 5, text: 'Pour in 500 ml of dark beer and 250 ml of stock. Bring to the boil.', ingredients: [{ amount: '500 ml', name: 'dark beer' }] },
        { id: 's6', title: 'Stew in the oven', mins: 150, text: 'Cover and stew in the oven at 160 °C.', timer: { seconds: 9000, name: 'Stew', id: 'stew' }, note: 'Check after 90 minutes that it does not boil dry.' },
        { id: 's7', title: 'Season and serve', mins: 5, text: 'Season with a splash of vinegar and a pinch of sugar. Serve with fries.' },
    ];
    /** Minutes as a person says them: 150 is "2 h 30 min". @param {number} mins */
    const human = (mins) => (mins < 60 ? `${mins} min` : mins % 60 === 0 ? `${mins / 60} h` : `${Math.floor(mins / 60)} h ${mins % 60} min`);
    const list = $('pg-ss-list');
    const draw = () => {
        const passed = getStepsPassed(fs);
        const steps = getSteps(fs);
        const here = Math.min(steps.length - 1, passed.count);
        say('pg-ss-count', `${passed.count} of ${passed.total} done`);
        list.replaceChildren(
            ...steps.map((step, i) => {
                const li = document.createElement('li');
                const state = passed.indexes.includes(i) ? 'passed' : i === here ? 'current' : 'waiting';
                li.dataset.state = state;
                if (state === 'current') li.setAttribute('aria-current', 'step');
                const mark = Object.assign(document.createElement('span'), { className: 'pg-passed__mark', textContent: state === 'passed' ? '✓' : String(i + 1) });
                mark.setAttribute('aria-hidden', 'true');
                const name = Object.assign(document.createElement('span'), { textContent: step.title ?? step.text });
                const time = Object.assign(document.createElement('span'), { className: 'pg-passed__time', textContent: human(/** @type {any} */ (step).mins) });
                li.append(mark, name, time);
                return li;
            }),
        );
    };
    fs.addEventListener('kp-focus-steps-change', draw);
    on('ss-jump', (value) => goToStep(fs, value === 'start' ? 0 : value === 'middle' ? 3 : STEPS.length - 1));
    on('ss-state', (value) => {
        if (value === 'loading') setFocusStepsState(fs, 'loading');
        else if (value === 'error') setFocusStepsState(fs, 'error', 'Could not read the recipe');
        else setFocusStepsState(fs, 'ready');
    });
    fs.addEventListener('kp-focus-steps-retry', () => {
        for (const b of document.querySelectorAll('button[data-pg="ss-state"]')) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === 'ready'));
        setFocusStepsState(fs, 'ready');
    });
    ready.then(() => {
        setFocusSteps(fs, STEPS);
        draw();
    });
}

// ---------------------------------------------------------------- form-submit
{
    const el = /** @type {HTMLFormElement} */ ($('pg-badday'));
    const log = $('pg-bd-log');
    let server = 'accepts';
    const note = (/** @type {string} */ text) => {
        const li = document.createElement('li');
        li.textContent = text;
        log.prepend(li);
        while (log.children.length > 6) log.lastElementChild?.remove();
    };
    on('fs-native', (value) => {
        if (value === 'allowed') el.setAttribute('data-kp-form-native-submit', '');
        else el.removeAttribute('data-kp-form-native-submit');
    });
    const send = (/** @type {string} */ value) => {
        const dish = /** @type {HTMLInputElement} */ (el.elements.namedItem('dish'));
        const portions = /** @type {HTMLInputElement} */ (el.elements.namedItem('portions'));
        dish.value = value === 'valid' ? 'Shakshuka' : '';
        portions.value = value === 'valid' ? '2' : '';
        el.requestSubmit(/** @type {HTMLElement} */ (el.querySelector('[data-kp-submit]')));
    };
    // Choosing how the server answers sends a valid form at once, so the choice shows its answer on the field and in the log.
    on('fs-server', (value) => {
        server = value;
        send('valid');
    });
    on('fs-send', send);
    el.addEventListener('kp-form-valid', (event) => {
        const detail = /** @type {CustomEvent<{ data: FormData, done: () => void }>} */ (event).detail;
        note(`kp-form-valid: the handler got ${[...detail.data.entries()].map(([k, v]) => `${k} = ${v}`).join(', ')}`);
        window.setTimeout(() => {
            if (server === 'refuses') {
                form(el)?.errors({ dish: 'A dish called Shakshuka is already logged for today.' });
                note('The server refused: the message stands on the field and in the summary.');
            } else note('The server accepted it.');
            detail.done();
        }, 900);
    });
    el.addEventListener('kp-form-invalid', (event) => {
        const detail = /** @type {CustomEvent<{ names: string[] }>} */ (event).detail;
        note(`kp-form-invalid: ${detail.names.length} fields need an answer, the summary lists them`);
    });
    // The last listener in line: it sees what the form's own handler decided, says so, and stops the browser so the demo never reloads.
    document.addEventListener('submit', (event) => {
        if (event.target !== el) return;
        if (el.querySelector('[data-kp-form-summary]:not([hidden])') === null) note(event.defaultPrevented ? 'The browser submit was stopped.' : 'The browser would also have submitted this form: yes (this page stops it).');
        event.preventDefault();
    });
}
