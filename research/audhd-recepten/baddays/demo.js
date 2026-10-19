// research/audhd-recepten/baddays: the sample content, the pretend server and the buttons that drive a state or an option.
// Everything drawn is drawn by the package's own functions and attributes; this file only fills the lists and answers the buttons.
import { setCardState } from '../../../js/card-state.js';
import { setActionBusy } from '../../../js/action-tiles.js';
import { dataTable } from '../../../js/datatable.js';
import { agoMoment, attachAgo } from '../../../js/freshness.js';
import { undoToast } from '../../../js/undo-toast.js';
import { setFocusSteps, setFocusStepsState } from '../../../js/focus-steps.js';
import { setCalendarDays, setCalendarState, setCalendarLegend, calendarMonth } from '../../../js/calendar.js';

/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement | null} */
const $ = (sel, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement[]} */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);
const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const DAY = 86_400_000;
const NOW = Date.now();
/** Wait until a module has attached to an element (auto.js attaches after this file runs). @param {() => unknown} ready */
async function until(ready) {
    for (let i = 0; i < 80 && !ready(); i += 1) await sleep(50);
}

/** A node with attributes and children. @param {string} tag @param {Record<string, string> | null} [attrs] @param {...(Node | string | null)} kids */
const h = (tag, attrs = null, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs ?? {})) el.setAttribute(k, v);
    for (const kid of kids) if (kid !== null) el.append(kid);
    return el;
};
/** @param {...(Node | string | null)} parts */
const meta = (...parts) => h('span', { class: 'kp-action-list__meta' }, ...parts.map((p) => (typeof p === 'string' ? h('span', null, p) : p)));
/** dd/mm/yyyy from a moment. @param {number} ms */
const dmy = (ms) => agoMoment(ms).slice(0, 10);
/** dd/mm/yyyy HH:mm from a moment. @param {number} ms */
const dmyhm = (ms) => agoMoment(ms);

/** Press one button of a group (aria-pressed): it is on, its siblings are off. @param {HTMLElement} button */
function pressOnly(button) {
    for (const other of $$('button[aria-pressed]', button.closest('[role="group"]') ?? document)) other.setAttribute('aria-pressed', String(other === button));
}

/** @param {string} id @returns {HTMLElement} */
const section = (id) => /** @type {HTMLElement} */ (document.getElementById(id));

// The options of every section: one place that applies a value and keeps the buttons and the dialog's ticks in step.
/** @type {Record<string, string>} */
const opts = {};
/** @type {Record<string, (value: string) => void>} */
const apply = {};
/** @param {string} name @param {string} value */
function setOpt(name, value) {
    opts[name] = value;
    apply[name]?.(value);
    for (const button of $$(`[data-bd-opt="${name}"]`)) button.setAttribute('aria-pressed', String(button.dataset.value === value));
}
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-bd-opt]')) : null;
    if (button) setOpt(button.dataset.bdOpt ?? '', button.dataset.value ?? '');
});
// What is ticked in the review dialog is what the page shows.
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    setOpt(id, value);
});

/** A section's state buttons: each one runs `show(state)`; the pressed one is the group's. @param {string} id @param {(state: string) => void} show */
function stateButtons(id, show) {
    for (const button of $$('[data-bd-state]', section(id))) {
        button.addEventListener('click', () => {
            pressOnly(button);
            show(button.dataset.bdState ?? 'ready');
        });
    }
}

// ---------------------------------------------------------------- 1 · safe dishes
{
    const root = document.getElementById('safe-dishes');
    const card = $('#bd-safe-card');
    const list = $('[data-bd-safe]');
    const readout = $('[data-bd-safe-readout]');
    if (root && card && list && readout) {
        // [title, sentence, minutes, pans, days since it was last made, at hour:minute]
        const DISHES = [
            ['Pasta with butter and cheese', 'Boil, drain, stir in butter and grated cheese. One pot.', 10, '1 pot', 4, [18, 40]],
            ['Rice with a fried egg', 'Rice from the cooker, an egg in a pan, a splash of soy sauce.', 12, '1 pan', 9, [19, 5]],
            ['Tomato soup and toast', 'Soup from the carton, warmed up, with buttered toast.', 8, '1 pot', 13, [18, 15]],
            ['Omelette with cheese', 'Three eggs, a pinch of salt, grated cheese, folded over.', 7, '1 pan', 2, [20, 10]],
            ['Oven pizza, upgraded', 'The pizza from the freezer with extra cheese on top.', 15, 'the oven', 21, [18, 55]],
            ['Stoemp from the bag with a sausage', 'Mashed vegetables from the supermarket bag, a sausage in the pan.', 14, '2 pans', 6, [19, 20]],
        ];
        const lastMade = (/** @type {number} */ daysAgo, /** @type {number[]} */ [hour = 18, minute = 0]) => {
            const d = new Date(NOW - daysAgo * DAY);
            d.setHours(hour, minute, 0, 0);
            return d.getTime();
        };
        const draw = () => {
            list.replaceChildren(
                ...DISHES.map(([title, text, minutes, pans, days, at]) => {
                    const tile = h(
                        'button',
                        { type: 'button', class: 'kp-action', 'data-bd-dish': String(title) },
                        h('strong', { class: 'kp-action__title' }, String(title)),
                        h('span', { class: 'kp-action__mark', 'aria-hidden': 'true' }),
                        h('span', { class: 'kp-action__text' }, String(text)),
                        h(
                            'span',
                            { class: 'kp-action__meta' },
                            h('span', null, `${minutes} min, ${pans}`),
                            h('span', { class: 'bd-lastmade' }, `last made ${dmyhm(lastMade(Number(days), /** @type {number[]} */ (at)))}`),
                        ),
                    );
                    return h('li', null, tile);
                }),
            );
        };
        draw();
        apply['safe-size'] = (value) => card.setAttribute('data-bd-size', value);
        apply['safe-meta'] = (value) => card.setAttribute('data-bd-meta', value);
        opts['safe-press'] = 'recipe';
        list.addEventListener('click', async (event) => {
            const tile = event.target instanceof Element ? event.target.closest('.kp-action') : null;
            if (!tile || tile.getAttribute('aria-busy') === 'true') return;
            const dish = tile.getAttribute('data-bd-dish') ?? '';
            setActionBusy(tile, true);
            readout.textContent = opts['safe-press'] === 'tonight' ? `Writing down ${dish}…` : `Opening the mini version of ${dish}…`;
            await sleep(900);
            setActionBusy(tile, false);
            readout.textContent =
                opts['safe-press'] === 'tonight'
                    ? `Tonight: ${dish}. That is the whole decision; nothing else to pick.`
                    : `Opened the mini recipe of ${dish}: the three steps are under "A mini version of a recipe".`;
        });
        const show = async (/** @type {string} */ state) => {
            if (state === 'loading') setCardState(card, 'loading');
            else if (state === 'empty')
                setCardState(card, 'empty', {
                    title: 'No safe dishes yet',
                    text: 'Pick three dishes that work even on your worst day. They will wait here, in this exact place, and never move.',
                    action: h('button', { type: 'button', class: 'kp-button kp-button--primary', 'data-bd-pick': '' }, 'Pick from my recipes'),
                });
            else if (state === 'error')
                setCardState(card, 'error', {
                    title: 'Could not open your safe dishes',
                    text: 'Nothing is lost: the dishes are still saved, the list just did not load. Try again, or use the zero-prep shelf.',
                });
            else setCardState(card, 'ready');
        };
        stateButtons('safe-dishes', show);
        const reset = () => {
            for (const b of $$('[data-bd-state]', root)) b.setAttribute('aria-pressed', String(b.dataset.bdState === 'ready'));
        };
        card.addEventListener('kp-card-retry', async () => {
            setCardState(card, 'loading');
            await sleep(900);
            setCardState(card, 'ready');
            reset();
        });
        card.addEventListener('click', (event) => {
            if (!(event.target instanceof Element) || !event.target.closest('[data-bd-pick]')) return;
            setCardState(card, 'ready');
            reset();
        });
        // The first frame is loading (a data area shows it from the start); the dishes arrive a moment later.
        void sleep(900).then(() => {
            if (card.getAttribute('data-kp-state') === 'loading' && $('[data-bd-state][aria-pressed="true"]', root)?.dataset.bdState === 'ready') setCardState(card, 'ready');
        });
    }
}

// ---------------------------------------------------------------- 2 · the freezer
{
    const root = document.getElementById('freezer');
    const table = $('#bd-freezer');
    const body = $('[data-bd-rows]');
    const frame = $('.bd-freezer');
    const bed = $('[data-bd-bed]');
    if (root && table && body && frame && bed) {
        /** @type {{ key: string, dish: string, portions: number, days: number }[]} */
        const FREEZER = [
            { key: 'chili', dish: 'Chili con carne', portions: 4, days: 3 },
            { key: 'pancakes', dish: 'Pannenkoeken', portions: 3, days: 15 },
            { key: 'bolognese', dish: 'Bolognese sauce', portions: 6, days: 9 },
            { key: 'soup', dish: 'Vegetable soup', portions: 2, days: 24 },
            { key: 'stoofvlees', dish: 'Stoofvlees with a slice of bread', portions: 3, days: 41 },
            { key: 'curry', dish: 'Chicken curry with rice', portions: 2, days: 68 },
            { key: 'pea', dish: 'Pea and mint soup', portions: 1, days: 97 },
        ];
        const frozenAt = (/** @type {number} */ days) => {
            const d = new Date(NOW - days * DAY);
            d.setHours(19, 15, 0, 0);
            return d.getTime();
        };
        const handle = () => dataTable(table);
        const row = (/** @type {typeof FREEZER[number]} */ item) => {
            const at = frozenAt(item.days);
            const tr = h('tr', { 'data-key': item.key });
            const cell = (/** @type {Record<string, string> | null} */ attrs, /** @type {Node | string} */ content) => h('td', attrs, content);
            tr.append(
                cell(null, h('strong', null, item.dish)),
                cell({ 'data-kp-sort-value': String(item.portions) }, String(item.portions)),
                cell({ 'data-kp-sort-value': String(at) }, dmy(at)),
                cell(
                    null,
                    h('time', { class: 'kp-ago', 'data-kp-ago': '', 'data-kp-ago-verb': 'frozen', datetime: new Date(at).toISOString() }, ''),
                ),
                cell(null, h('span', item.days >= 60 ? { class: 'kp-badge bd-hint' } : { class: 'kp-badge bd-hint bd-hint--none', 'aria-hidden': 'true' }, item.days >= 60 ? 'Use these next' : 'Fine')),
                cell(
                    null,
                    h(
                        'div',
                        { class: 'kp-row-actions' },
                        h('button', { type: 'button', class: 'kp-button kp-button--sm', 'data-bd-take': item.key, 'aria-label': `Take one portion of ${item.dish}` }, 'Take one portion'),
                    ),
                ),
            );
            return tr;
        };
        const render = () => {
            body.replaceChildren(...FREEZER.map(row));
            handle()?.refresh();
        };
        apply['fr-hint'] = (value) => frame.setAttribute('data-bd-hint', value);
        opts['fr-clock'] = 'ring';
        opts['fr-ms'] = '10000';
        body.addEventListener('click', (event) => {
            const button = event.target instanceof Element ? event.target.closest('[data-bd-take]') : null;
            if (!button) return;
            const item = FREEZER.find((f) => f.key === button.getAttribute('data-bd-take'));
            if (!item || item.portions < 1) return;
            item.portions -= 1;
            const last = item.portions === 0;
            const index = FREEZER.indexOf(item);
            if (last) FREEZER.splice(index, 1);
            render();
            undoToast(last ? `Took the last portion of ${item.dish}. It leaves the list.` : `Took 1 portion of ${item.dish}. ${item.portions} left.`, {
                region: bed,
                ms: Number(opts['fr-ms']),
                clock: /** @type {any} */ (opts['fr-clock']),
                max: 2,
                commit: () => Promise.resolve(),
                undo: () => {
                    item.portions += 1;
                    if (last) FREEZER.splice(index, 0, item);
                    render();
                },
            });
        });
        const sortOldest = () => handle()?.sort({ column: 2, direction: 'ascending' });
        const ready = () => {
            render();
            handle()?.state('ready');
            sortOldest();
        };
        const resetButtons = () => {
            for (const b of $$('[data-bd-state]', root)) b.setAttribute('aria-pressed', String(b.dataset.bdState === 'ready'));
        };
        /** @param {string} state */
        const show = (state) => {
            const t = handle();
            if (!t) return;
            if (state === 'loading') {
                t.state('ready');
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                        t.busy({ text: 'Looking in the freezer…', since: Date.now() - 2000, overlay: true });
                        t.state('loading');
                    }),
                );
            } else if (state === 'empty') {
                FREEZER.length = 0;
                t.state('ready');
                render();
            } else if (state === 'error') {
                t.fail('The freezer list could not be read. Nothing was changed: your portions are still counted.');
            } else {
                restore();
            }
        };
        const restore = () => {
            FREEZER.length = 0;
            FREEZER.push(
                { key: 'chili', dish: 'Chili con carne', portions: 4, days: 3 },
                { key: 'pancakes', dish: 'Pannenkoeken', portions: 3, days: 15 },
                { key: 'bolognese', dish: 'Bolognese sauce', portions: 6, days: 9 },
                { key: 'soup', dish: 'Vegetable soup', portions: 2, days: 24 },
                { key: 'stoofvlees', dish: 'Stoofvlees with a slice of bread', portions: 3, days: 41 },
                { key: 'curry', dish: 'Chicken curry with rice', portions: 2, days: 68 },
                { key: 'pea', dish: 'Pea and mint soup', portions: 1, days: 97 },
            );
            ready();
        };
        stateButtons('freezer', show);
        table.addEventListener('kp-datatable-retry', async () => {
            handle()?.state('loading');
            await sleep(900);
            restore();
            resetButtons();
        });
        table.addEventListener('click', (event) => {
            if (!(event.target instanceof Element) || !event.target.closest('[data-bd-add]')) return;
            FREEZER.length = 0;
            FREEZER.push({ key: 'leftover', dish: 'Leftover soup', portions: 2, days: 0 });
            ready();
            resetButtons();
        });
        // The first frame is loading; the rows arrive a moment later.
        void until(() => handle()).then(async () => {
            render();
            attachAgo(frame);
            const t = handle();
            t?.busy({ text: 'Looking in the freezer…', since: Date.now(), overlay: true });
            t?.state('loading');
            await sleep(900);
            if ($('[data-bd-state][aria-pressed="true"]', root)?.dataset.bdState === 'ready') ready();
        });
    }
}

// ---------------------------------------------------------------- 3 · the zero-prep shelf
{
    const root = document.getElementById('zero-prep');
    const card = $('#bd-shelf-card');
    const list = $('[data-bd-shelf]');
    const readout = $('[data-bd-shelf-readout]');
    if (root && card && list && readout) {
        // [title, sentence, level (0 open it, 1 one easy step, 2 anything), minutes, what it needs]
        const FOODS = [
            ['Yoghurt with fruit', 'A tub of yoghurt and a banana or a handful of berries.', 0, 0, ['No knife', 'Fridge']],
            ['Cereal with cold milk', 'Your usual cereal in a bowl, cold milk on top.', 0, 0, ['No knife', 'Cupboard and fridge']],
            ['Banana with peanut butter', 'Peel it, dip it, eat it off the spoon if you like.', 0, 0, ['No knife', 'Cupboard']],
            ['Crackers with cheese slices', 'Cream crackers and ready-cut cheese, straight from the packs.', 0, 0, ['No knife', 'Cupboard and fridge']],
            ['Wrap with cheese and ham', 'Lay the slices on a wrap and roll it up.', 1, 2, ['No knife', 'Fridge']],
            ['Sandwich with cheese', 'Bread, butter, a slice of cheese: the Belgian classic.', 1, 2, ['Butter knife', 'Fridge']],
            ['Hummus with carrot sticks', 'A tub of hummus and a bag of ready-cut carrot sticks.', 1, 2, ['No knife', 'Fridge']],
            ['Salad from the bag with an egg', 'Tip the bag in a bowl, add a boiled egg from the pack.', 2, 5, ['Fork', 'Fridge']],
            ['Tuna on toast', 'Toast the bread, spoon a small tin of tuna over it.', 2, 5, ['Toaster', 'Cupboard']],
        ];
        const EFFORT = ['Open', 'Easy', 'Simple'];
        let level = 2;
        let lead = 'minutes';
        const draw = () => {
            list.replaceChildren(
                ...FOODS.filter(([, , l]) => Number(l) <= level).map(([title, text, l, minutes, needs]) =>
                    h(
                        'li',
                        { 'data-key': String(title) },
                        h('span', { class: 'kp-action-list__lead' }, h('span', { class: 'kp-badge' }, lead === 'minutes' ? `${minutes} min` : EFFORT[Number(l)] ?? '')),
                        h(
                            'div',
                            { class: 'kp-action-list__main' },
                            h('strong', { class: 'kp-action-list__title' }, String(title)),
                            h('span', { class: 'kp-action-list__text' }, String(text)),
                            meta(.../** @type {string[]} */ (needs)),
                        ),
                        h('div', { class: 'kp-row-actions' }, h('button', { type: 'button', class: 'kp-button kp-button--sm', 'data-bd-pick-food': String(title) }, 'This one')),
                    ),
                ),
            );
            for (const n of $$('[data-bd-count]', root)) n.textContent = String(FOODS.filter(([, , l]) => Number(l) <= Number(n.dataset.bdCount)).length);
        };
        draw();
        apply['shelf-lead'] = (value) => {
            lead = value;
            draw();
        };
        $('[data-bd-level]', root)?.addEventListener('kp-segmented-change', (event) => {
            level = Number(/** @type {CustomEvent} */ (event).detail.value ?? 2);
            draw();
            readout.textContent = 'Nothing chosen yet.';
        });
        list.addEventListener('click', (event) => {
            const button = event.target instanceof Element ? event.target.closest('[data-bd-pick-food]') : null;
            if (button) readout.textContent = `Chosen: ${button.getAttribute('data-bd-pick-food')}. A plate and you are done.`;
        });
        stateButtons('zero-prep', (state) => {
            if (state === 'loading') setCardState(card, 'loading');
            else if (state === 'empty')
                setCardState(card, 'empty', {
                    title: 'The shelf is empty',
                    text: 'Add three foods that need no cooking, like yoghurt or crackers, and keep them in the house for the days you need them.',
                    action: h('button', { type: 'button', class: 'kp-button kp-button--primary', 'data-bd-fill': '' }, 'Add foods to the shelf'),
                });
            else if (state === 'error')
                setCardState(card, 'error', { title: 'Could not open the shelf', text: 'Nothing was changed. Try again, or pick a safe dish from the tiles above.' });
            else setCardState(card, 'ready');
        });
        const reset = () => {
            for (const b of $$('[data-bd-state]', root)) b.setAttribute('aria-pressed', String(b.dataset.bdState === 'ready'));
        };
        card.addEventListener('kp-card-retry', async () => {
            setCardState(card, 'loading');
            await sleep(900);
            setCardState(card, 'ready');
            reset();
        });
        card.addEventListener('click', (event) => {
            if (!(event.target instanceof Element) || !event.target.closest('[data-bd-fill]')) return;
            setCardState(card, 'ready');
            reset();
        });
        void sleep(900).then(() => {
            if (card.getAttribute('data-kp-state') === 'loading' && $('[data-bd-state][aria-pressed="true"]', root)?.dataset.bdState === 'ready') setCardState(card, 'ready');
        });
    }
}

// ---------------------------------------------------------------- 4 · a mini version of a recipe
{
    const root = document.getElementById('mini-recipe');
    const steps = $('[data-bd-steps]');
    const lede = $('[data-bd-mini-lede]');
    if (root && steps && lede) {
        const MINI = [
            {
                text: 'Put a pot of water on to boil, with a pinch of salt.',
                ingredients: [{ amount: '1 l', name: 'water' }],
                timer: { seconds: 600, name: 'Water' },
                note: 'The water takes the longest. While it heats, do nothing else: that is allowed.',
            },
            { text: 'Tip the spaghetti in and stir once.', ingredients: [{ amount: '100 g', name: 'spaghetti' }], timer: { seconds: 540, name: 'Pasta' } },
            {
                text: 'Warm the jar sauce in the microwave, drain the pasta, mix, and grate cheese on top.',
                ingredients: [
                    { amount: '150 g', name: 'bolognese sauce from the jar' },
                    { amount: '1 handful', name: 'grated cheese' },
                ],
                note: 'Done. A bowl and a fork is enough.',
            },
        ];
        const FULL = [
            { text: 'Chop the onion, the carrot and the celery small.', ingredients: [{ amount: '1', name: 'onion' }, { amount: '1', name: 'carrot' }, { amount: '1 stalk', name: 'celery' }] },
            { text: 'Fry the vegetables in olive oil until soft.', ingredients: [{ amount: '2 tbsp', name: 'olive oil' }], timer: { seconds: 480, name: 'Vegetables' } },
            { text: 'Add the minced beef and fry it until brown, breaking up the lumps.', ingredients: [{ amount: '400 g', name: 'minced beef' }], timer: { seconds: 480, name: 'Mince' } },
            { text: 'Stir in the tomato paste and cook it for two minutes.', ingredients: [{ amount: '2 tbsp', name: 'tomato paste' }], timer: { seconds: 120, name: 'Paste' } },
            { text: 'Pour in the tomatoes and the red wine, add salt, pepper and the bay leaf.', ingredients: [{ amount: '400 g', name: 'chopped tomatoes' }, { amount: '1 dl', name: 'red wine' }] },
            { text: 'Let the sauce simmer with the lid half on.', timer: { seconds: 1800, name: 'Sauce' }, note: 'Stir now and then. This is the long part.' },
            { text: 'Meanwhile, boil the water for the spaghetti.', ingredients: [{ amount: '2 l', name: 'water' }], timer: { seconds: 600, name: 'Water' } },
            { text: 'Cook the spaghetti and drain it.', ingredients: [{ amount: '300 g', name: 'spaghetti' }], timer: { seconds: 540, name: 'Pasta' } },
            { text: 'Serve the sauce on the spaghetti with grated cheese.', ingredients: [{ amount: '1 handful', name: 'grated cheese' }] },
        ];
        const WORDS = {
            mini: 'Mini version: 3 steps, about 12 minutes, 1 portion, 1 pot and a microwave, nothing to chop. Left out of the full recipe: chopping, frying the mince and 30 minutes of simmering.',
            full: 'Full recipe: 9 steps, about 1 hour, 4 portions, 3 pans. Every ingredient from scratch.',
        };
        let version = /** @type {'mini' | 'full'} */ ('mini');
        const draw = () => {
            lede.textContent = WORDS[version];
            steps.setAttribute('aria-label', version === 'mini' ? 'Spaghetti bolognese, mini version' : 'Spaghetti bolognese, full recipe');
            setFocusSteps(steps, version === 'mini' ? MINI : FULL);
        };
        apply['mini-wake'] = (value) => steps.setAttribute('data-kp-focus-steps-wake', value === 'on' ? 'true' : 'false');
        $('[data-bd-version]', root)?.addEventListener('kp-segmented-change', (event) => {
            version = /** @type {CustomEvent} */ (event).detail.value === 'full' ? 'full' : 'mini';
            draw();
        });
        void until(() => steps.querySelector('.kp-focus-steps__body, .kp-focus-steps__head')).then(() => {
            draw();
            setFocusStepsState(steps, 'loading');
            void sleep(900).then(() => {
                if ($('[data-bd-state][aria-pressed="true"]', root)?.dataset.bdState === 'ready') setFocusStepsState(steps, 'ready');
            });
        });
        stateButtons('mini-recipe', (state) => {
            if (state === 'loading') setFocusStepsState(steps, 'loading', 'Opening the recipe…');
            else if (state === 'error') setFocusStepsState(steps, 'error', 'The recipe could not be opened. Nothing was lost; try again in a moment.');
            else if (state === 'empty') {
                setFocusStepsState(steps, 'ready');
                setFocusSteps(steps, []);
            } else {
                setFocusStepsState(steps, 'ready');
                draw();
            }
        });
    }
}

// ---------------------------------------------------------------- 5 · when things went into the freezer
{
    const root = document.getElementById('freezer-month');
    const cal = $('#bd-cal');
    if (root && cal) {
        const iso = (/** @type {number} */ ms) => new Date(ms).toISOString().slice(0, 10);
        const today = new Date(NOW);
        const month = { year: today.getFullYear(), month: today.getMonth() + 1 };
        const first = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
        const lastDay = Math.max(1, today.getDate() - 1);
        /** The days something went in, as [day of the month, portions]. */
        const WENT_IN = [[1, 4], [4, 2], [9, 6], [15, 3], [19, 2], [24, 5]].filter(([d]) => Number(d) <= lastDay);
        const days = () => {
            /** @type {Record<string, import('../../../js/calendar.js').CalendarDay>} */
            const out = {};
            for (const [d, n] of WENT_IN) {
                out[iso(first + (Number(d) - 1) * DAY + 12 * 3_600_000)] = {
                    tone: 'logged',
                    count: String(n),
                    label: `${n} ${n === 1 ? 'portion' : 'portions'} went into the freezer`,
                };
            }
            return out;
        };
        /** @param {string} value */
        apply['cal-busy'] = (value) => {
            cal.classList.toggle('kp-calendar--busy-days', value === 'days');
            cal.classList.toggle('kp-calendar--busy-whole', value !== 'days');
        };
        apply['cal-fill'] = (value) => {
            if (value === 'success') cal.setAttribute('data-kp-logged-fill', 'success');
            else cal.removeAttribute('data-kp-logged-fill');
        };
        apply['cal-pause'] = (value) => {
            const from = iso(first + 5 * DAY + 12 * 3_600_000);
            const to = iso(first + 11 * DAY + 12 * 3_600_000);
            if (value === 'holiday') cal.setAttribute('data-kp-paused-range', `${from}/${to}`);
            else cal.removeAttribute('data-kp-paused-range');
        };
        const draw = () => {
            setCalendarDays(cal, days());
            setCalendarState(cal, 'ready');
        };
        void until(() => cal.querySelector('.kp-calendar__grid')).then(async () => {
            calendarMonth(cal, month);
            setCalendarLegend(cal, [
                { tone: 'logged', label: 'Something went in' },
                { tone: 'quiet', label: 'Nothing went in, and that is fine' },
                { tone: 'paused', label: 'Away' },
            ]);
            setCalendarState(cal, 'loading');
            await sleep(900);
            if ($('[data-bd-state][aria-pressed="true"]', root)?.dataset.bdState === 'ready') draw();
        });
        stateButtons('freezer-month', (state) => {
            if (state === 'loading') setCalendarState(cal, 'loading', 'Reading the month…');
            else if (state === 'empty') setCalendarState(cal, 'empty', 'Nothing was frozen this month. That is fine.');
            else if (state === 'error') setCalendarState(cal, 'error', 'The month could not be read. Nothing was changed.');
            else draw();
        });
        cal.addEventListener('kp-calendar-retry', async () => {
            setCalendarState(cal, 'loading', 'Reading the month…');
            await sleep(900);
            draw();
            for (const b of $$('[data-bd-state]', root)) b.setAttribute('aria-pressed', String(b.dataset.bdState === 'ready'));
        });
    }
}
