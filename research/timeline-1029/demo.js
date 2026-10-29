// research/timeline-1029: the page's own wiring. The sequencers are the package's (attached by js/auto.js from data-kp-sequencer); this file gives each
// Kitchen's recipe in Kitchen's own step shape (track, mins, start, with; Kitchen docs/agent/DATA.md) and wires the controls of each section by its
// own elements. The keyboard buttons press the real keys on the real bars (a synthetic keydown), so what they show is what the keyboard does.
// Nothing here reads the clock: the plan is minutes from the start of cooking.

import { getSequencerItems, getSequencerTotal, setSequencerItems, setSequencerNow, setSequencerState, setSequencerZoom } from '../../js/sequencer.js';

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

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group (unless it is a set of actions) and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
// A button that presses a key must not take the focus from the bar it presses it on.
document.addEventListener('mousedown', (event) => {
    if (event.target instanceof Element && event.target.closest('button[data-pg-momentary]')) event.preventDefault();
});
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const handler = HANDLERS[button.dataset.pg ?? ''];
    if (!handler) return;
    if (!button.hasAttribute('data-pg-momentary'))
        for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};

/** One recipe in Kitchen's step shape: a track, minutes, a start (minutes from the start of cooking) and `with` (starts together with that step). */
const STEPS = [
    { id: 's1', track: 'sauce', text: 'Chop the onion, carrot and celery', mins: 10, start: 0 },
    { id: 's2', track: 'sauce', text: 'Brown the mince', mins: 11, start: 10 },
    { id: 's3', track: 'sauce', text: 'Simmer with the tomatoes', mins: 30, start: 21 },
    { id: 's4', track: 'sauce', text: 'Season and rest', mins: 5, start: 51 },
    { id: 's5', track: 'pasta', text: 'Boil the water', mins: 8, start: 10, with: 's2' },
    { id: 's6', track: 'pasta', text: 'Cook the spaghetti', mins: 10, start: 46 },
    { id: 's7', track: 'pasta', text: 'Drain and plate', mins: 5, start: 56 },
];
const OVEN = { id: 's8', track: 'oven', text: 'Warm the plates', mins: 10, start: 46 };
const REST = { id: 's9', track: 'sauce', text: 'Let the sauce rest', mins: 10, start: 61 };
const TWO = [
    { id: 'sauce', label: 'Sauce' },
    { id: 'pasta', label: 'Pasta' },
];
const THREE = [...TWO, { id: 'oven', label: 'Oven' }];
const ALL = [...STEPS, OVEN, REST];
const nameOf = (/** @type {string} */ id) => ALL.find((s) => s.id === id)?.text ?? id;

/** Kitchen's steps as the sequencer's items; `scale` turns minutes into the sequencer's unit. */
const toItems = (/** @type {any[]} */ steps, scale = 1) =>
    steps.map((s) => ({ id: s.id, lane: s.track, label: s.text, start: s.start * scale, duration: s.mins * scale, with: s.with ?? null }));
const minutes = (/** @type {number} */ value, scale = 1) => Math.round((value / scale) * 100) / 100;
/** What Kitchen would write back for the steps that changed (its own fields, in minutes). */
const kitchenLines = (/** @type {any[]} */ items, /** @type {string[]} */ ids, scale = 1) =>
    ids
        .map((id) => items.find((i) => i.id === id))
        .filter(Boolean)
        .map((i) => `${nameOf(i.id)}: track ${i.lane}, start ${minutes(i.start, scale)}, mins ${minutes(i.duration, scale)}${i.with ? `, with ${nameOf(i.with)}` : ', with none'}`);

const say = (/** @type {string} */ id, /** @type {string} */ text) => {
    $(id).textContent = text;
};
const bar = (/** @type {HTMLElement} */ el, /** @type {string} */ id) => /** @type {HTMLElement | null} */ (el.querySelector(`.kp-sequencer__item[data-kp-id="${id}"]`));

/** Press a real key on a real bar: "shift+ArrowLeft", "alt+ArrowUp", "ctrl+ArrowRight", "Enter", "l". */
const press = (/** @type {HTMLElement} */ el, /** @type {string} */ id, /** @type {string} */ spec) => {
    const target = bar(el, id);
    if (!target) return;
    const parts = spec.split('+');
    const key = parts.pop() ?? '';
    target.focus();
    target.dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey: parts.includes('shift'), altKey: parts.includes('alt'), ctrlKey: parts.includes('ctrl'), bubbles: true, cancelable: true }),
    );
};
/** Pick a step up, press `spec` `times` times, drop it: one edit, as a person would make it. */
const nudge = (/** @type {HTMLElement} */ el, /** @type {string} */ id, /** @type {string} */ spec, times = 1) => {
    press(el, id, 'Enter');
    for (let i = 0; i < times; i += 1) press(el, id, spec);
    press(el, id, 'Enter');
};

/** Hand a sequencer Kitchen's steps and leave loading. */
const fill = (/** @type {HTMLElement} */ el, /** @type {any[]} */ steps, lanes = TWO, scale = 1) => {
    setSequencerItems(el, toItems(steps, scale), lanes);
    setSequencerState(el, 'ready');
};

/** The line under a sequencer says what the last edit was, in Kitchen's own fields. */
const report = (/** @type {HTMLElement} */ el, /** @type {string} */ logId, scale = () => 1) => {
    el.addEventListener('kp-sequencer-change', (event) => {
        const { items, changed, source } = /** @type {CustomEvent} */ (event).detail;
        say(logId, `Kitchen would save (${source}): ${kitchenLines(items, changed, scale()).join(' · ')}`);
    });
    el.addEventListener('kp-sequencer-refuse', (event) => {
        const { id, blocker } = /** @type {CustomEvent} */ (event).detail;
        say(logId, `Refused: ${nameOf(id)} would overlap ${blocker ? nameOf(blocker) : 'the edge'}; nothing moved.`);
    });
};

await ready;

// ---------------------------------------------------------------- drag-resize
{
    const el = $('tl-drag');
    const state = { snap: 1, scale: 1 };
    const scales = /** @type {Record<string, number>} */ ({ minute: 1, hour: 1 / 60, second: 60 });
    fill(el, STEPS);
    say('tl-drag-log', 'Nothing dragged yet. Kitchen keeps minutes whatever the unit of the sequencer is.');
    const apply = () => el.setAttribute('data-kp-sequencer-snap', String(state.snap * state.scale));
    apply();
    report(el, 'tl-drag-log', () => state.scale);
    on('dr-snap', (value) => {
        state.snap = Number(value);
        apply();
    });
    on('dr-edges', (value) => el.setAttribute('data-kp-sequencer-snap-items', value));
    on('dr-unit', (value) => {
        const next = scales[value] ?? 1;
        const ratio = next / state.scale;
        const items = getSequencerItems(el).map((i) => ({ ...i, label: nameOf(i.id), start: i.start * ratio, duration: i.duration * ratio }));
        state.scale = next;
        el.setAttribute('data-kp-sequencer-unit', value);
        apply();
        setSequencerItems(el, items, TWO);
        say('tl-drag-log', `Counting in ${value}s now: every number the sequencer holds and reports is in ${value}s; Kitchen's minutes are unchanged.`);
    });
}

// ---------------------------------------------------------------- lanes
{
    const el = $('tl-lanes');
    let three = false;
    const draw = () => fill(el, three ? [...STEPS, OVEN] : STEPS, three ? THREE : TWO);
    draw();
    say('tl-lanes-log', 'Drag a step onto another lane.');
    report(el, 'tl-lanes-log');
    on('ln-move', (value) => el.setAttribute('data-kp-sequencer-lanes', value));
    on('ln-count', (value) => {
        three = value === 'three';
        draw();
        say('tl-lanes-log', three ? 'The Oven lane is there, with Warm the plates.' : 'Two lanes again; the plan is as Kitchen has it.');
    });
}

// ---------------------------------------------------------------- keyboard
{
    const el = $('tl-keys');
    fill(el, STEPS);
    const steps = /** @type {Record<string, string>} */ ({ cook: 's6', plate: 's7', chop: 's1' });
    let target = 's6';
    const heard = $('tl-keys-heard');
    const status = el.querySelector('.kp-gantt__announce[role="status"]');
    if (status) new MutationObserver(() => (heard.textContent = status.textContent || heard.textContent)).observe(status, { childList: true, characterData: true, subtree: true });
    const picked = () => bar(el, target)?.hasAttribute('data-kp-grabbed') ?? false;
    const run = (/** @type {string} */ spec) => {
        const moving = spec !== 'Enter' && spec !== 'Escape';
        if (!picked() && !moving) {
            heard.textContent = 'Nothing is picked up. Pick a step up first.';
            return;
        }
        if (!picked()) press(el, target, 'Enter');
        press(el, target, spec);
    };
    on('kb-pick', (value) => {
        target = steps[value] ?? target;
        press(el, target, 'Enter');
    });
    on('kb-key', (value) => run(value));
    on('kb-end', (value) => run(value));
    on('kb-overlap', (value) => el.setAttribute('data-kp-sequencer-overlap', value));
}

// ---------------------------------------------------------------- linked
{
    const el = $('tl-linked');
    fill(el, STEPS);
    say('tl-linked-log', 'Boil the water runs alongside Brown the mince. Select a step to see it in the line under the sequencer.');
    report(el, 'tl-linked-log');
    on('lk-move', (value) => nudge(el, 's2', Number(value) === 10 ? 'ctrl+ArrowRight' : 'ArrowRight', Number(value) === 10 ? 1 : 5));
    on('lk-link', (value) => {
        if (value === 'link') {
            press(el, 's6', 'l');
            press(el, 's3', 'Enter');
        } else press(el, 's6', 'u');
    });
    on('lk-reset', () => {
        fill(el, STEPS);
        say('tl-linked-log', 'The plan is as Kitchen has it.');
    });
}

// ---------------------------------------------------------------- overlap
{
    const el = $('tl-overlap');
    fill(el, STEPS);
    say('tl-overlap-log', 'Refuse is the default. Move the cook later and see what the rule does.');
    report(el, 'tl-overlap-log');
    on('ov-rule', (value) => {
        el.setAttribute('data-kp-sequencer-overlap', value);
        say('tl-overlap-log', `Overlap rule: ${value}.`);
    });
    on('ov-try', (value) => {
        if (value === 'reset') {
            fill(el, STEPS);
            say('tl-overlap-log', 'The plan is as Kitchen has it.');
        } else nudge(el, 's6', value === 'later' ? 'ArrowRight' : 'ArrowLeft', 5);
    });
}

// ---------------------------------------------------------------- total and now
{
    const el = $('tl-total');
    let now = /** @type {number | null} */ (null);
    const draw = () => {
        const total = getSequencerTotal(el);
        say('tl-total-log', `The plan ends at ${total} min${now === null ? '; no line for now.' : `; now is at ${now} min (${Math.max(0, total - now)} min to go).`}`);
    };
    fill(el, STEPS);
    draw();
    el.addEventListener('kp-sequencer-change', draw);
    on('tn-now', (value) => {
        now = value === 'off' ? null : value === 'advance' ? (now ?? 0) + 5 : Number(value);
        setSequencerNow(el, now);
        draw();
    });
    on('tn-plan', (value) => {
        fill(el, value === 'add' ? [...STEPS, REST] : STEPS);
        draw();
    });
}

// ---------------------------------------------------------------- events
{
    const el = $('tl-events');
    const log = $('tl-events-log');
    let n = 0;
    let focus = 0;
    const add = (/** @type {string} */ kind, /** @type {string} */ words) => {
        n += 1;
        const row = document.createElement('li');
        for (const [cls, text] of /** @type {[string, string][]} */ ([
            ['pg-events__n', `#${n}`],
            ['pg-events__kind', kind],
            ['pg-events__words', words],
        ])) {
            const cell = document.createElement('span');
            cell.className = cls;
            cell.textContent = text;
            row.append(cell);
        }
        log.prepend(row);
        while (log.children.length > 6) log.lastElementChild?.remove();
    };
    fill(el, STEPS);
    el.addEventListener('kp-sequencer-change', (event) => {
        const { items, changed, source, total } = /** @type {CustomEvent} */ (event).detail;
        const parts = changed.map((/** @type {string} */ id) => {
            const i = items.find((/** @type {any} */ x) => x.id === id);
            return `{ id: ${id}, lane: ${i.lane}, start: ${i.start}, duration: ${i.duration}, with: ${i.with ?? 'null'} }`;
        });
        add('change', `${source}, total ${total} min: ${parts.join(', ')}`);
    });
    el.addEventListener('kp-sequencer-select', (event) => {
        const { id } = /** @type {CustomEvent} */ (event).detail;
        add('select', id ? nameOf(id) : 'nothing');
    });
    el.addEventListener('kp-sequencer-refuse', (event) => {
        const { id, reason, blocker } = /** @type {CustomEvent} */ (event).detail;
        add('refuse', `${nameOf(id)}: ${reason}${blocker ? `, in the way: ${nameOf(blocker)}` : ''}`);
    });
    on('ev-cause', (value) => {
        if (value === 'move') nudge(el, 's7', 'ArrowRight', 5);
        else if (value === 'refuse') nudge(el, 's6', 'alt+ArrowUp', 1);
        else if (value === 'select') {
            focus = (focus + 1) % STEPS.length;
            bar(el, /** @type {{ id: string }} */ (STEPS[focus]).id)?.focus();
        } else add('get', `getSequencerItems: ${getSequencerItems(el).length} items, total ${getSequencerTotal(el)} min`);
    });
    on('ev-log', () => log.replaceChildren());
}

// ---------------------------------------------------------------- phone
{
    const el = $('tl-phone');
    const box = $('tl-phone-box');
    const draw = (/** @type {number} */ scale) => {
        fill(el, STEPS, TWO, scale);
        say('tl-phone-log', scale === 1 ? 'The recipe: 61 minutes.' : `A long afternoon: ${61 * scale} minutes.`);
    };
    draw(1);
    on('ph-width', (value) => box.setAttribute('data-pg-width', value));
    on('ph-zoom', (value) => {
        setSequencerZoom(el, Number(value));
        say('tl-phone-log', `Zoom ${Math.round(Number(value) * 100)}%.`);
    });
    on('ph-plan', (value) => draw(value === 'long' ? 3 : 1));
}

// ---------------------------------------------------------------- states
{
    const el = $('tl-states');
    fill(el, STEPS);
    on('st-state', (value) => {
        if (value === 'error') setSequencerState(el, 'error', '', { text: 'Kitchen did not answer. Nothing was lost.' });
        else setSequencerState(el, /** @type {'ready' | 'loading' | 'empty'} */ (value));
    });
    el.addEventListener('kp-sequencer-retry', () => {
        setSequencerState(el, 'ready');
        for (const b of document.querySelectorAll('button[data-pg="st-state"]')) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === 'ready'));
    });
}
