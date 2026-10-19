// research/audhd-recepten/wheel: what this page does that the package does not.
//   1. the sample dishes (Belgian home cooking), the fixed clock and the rules that decide which dish fits;
//   2. the answer card beside the wheel (what was chosen, why, when to start) and the buttons that act on it;
//   3. the buttons that drive a state, and the options the review dialog switches.
// Everything drawn is drawn by the package: js/wheel.js, js/segmented.js (three-way chips), js/toggle.js, js/card-state.js,
// js/art.js, js/calm.js and the kp-switch.
import { attachWheels, setWheelItems, spinWheel, WHEEL_RESULT_EVENT, WHEEL_SPIN_EVENT } from '../../../js/wheel.js';
import { setCardState, CARD_RETRY_EVENT } from '../../../js/card-state.js';
import { SEGMENTED_EVENT, getSegmentedTri, setSegmentedTri, setSegmentedCounts, resetSegmented } from '../../../js/segmented.js';
import { toggle } from '../../../js/toggle.js';
import { attachArt } from '../../../js/art.js';
import { attachDisabledReasons } from '../../../js/reason.js';
import { setCalm } from '../../../js/calm.js';

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

// ---- 1 · the dishes and the clock ----------------------------------------------------------------------------------
const NOW = new Date(2026, 9, 18, 17, 10);
const NOW_MIN = 17 * 60 + 10;
const EAT_MIN = 18 * 60 + 30;
const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
const hhmm = (/** @type {number} */ m) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
const dmy = (/** @type {Date} */ d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const daysBefore = (/** @type {number} */ n, sign = -1) => {
    const d = new Date(NOW);
    d.setDate(d.getDate() + sign * n);
    return d;
};
const minutesText = (/** @type {number} */ m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
const plural = (/** @type {number} */ n, one, many = `${one}es`) => `${n} ${n === 1 ? one : many}`;

/**
 * @typedef {object} Dish
 * @property {string} id @property {string} label @property {string} [short] @property {string[]} meals @property {number} minutes
 * @property {string[]} ing the ingredients the chips know about @property {number} days days since it was last cooked
 * @property {boolean} safe a favourite that always works @property {number} freezer portions in the freezer
 * @property {'none' | 'light' | 'full'} prep how much preparing it needs
 */
/** @type {Dish[]} */
const DISHES = [
    { id: 'stoofvlees', short: 'Stoofvlees', label: 'Flemish beef stew with fries', meals: ['dinner'], minutes: 150, ing: ['beef', 'potato'], days: 24, safe: false, freezer: 2, prep: 'full' },
    { id: 'waterzooi', short: 'Waterzooi', label: 'Chicken waterzooi', meals: ['dinner'], minutes: 55, ing: ['chicken', 'potato'], days: 31, safe: false, freezer: 0, prep: 'full' },
    { id: 'spaghetti', short: 'Pasta', label: 'Spaghetti bolognese', meals: ['dinner'], minutes: 35, ing: ['beef', 'tomato'], days: 3, safe: true, freezer: 0, prep: 'light' },
    { id: 'stoemp', short: 'Stoemp', label: 'Stoemp with sausage', meals: ['dinner'], minutes: 45, ing: ['potato'], days: 12, safe: false, freezer: 0, prep: 'full' },
    { id: 'witloof', short: 'Witloof', label: 'Chicory in ham and cheese', meals: ['dinner'], minutes: 50, ing: ['cheese', 'potato'], days: 40, safe: false, freezer: 0, prep: 'full' },
    { id: 'balletjes', short: 'Balletjes', label: 'Meatballs in tomato sauce', meals: ['dinner'], minutes: 20, ing: ['beef', 'tomato'], days: 9, safe: true, freezer: 6, prep: 'none' },
    { id: 'curry', short: 'Curry', label: 'Chicken curry with rice', meals: ['dinner'], minutes: 40, ing: ['chicken'], days: 17, safe: false, freezer: 0, prep: 'full' },
    { id: 'soup', short: 'Soup', label: 'Tomato soup', meals: ['lunch', 'dinner'], minutes: 10, ing: ['tomato'], days: 6, safe: true, freezer: 4, prep: 'none' },
    { id: 'croque', short: 'Croque', label: 'Croque monsieur', meals: ['lunch', 'dinner'], minutes: 15, ing: ['cheese'], days: 2, safe: true, freezer: 0, prep: 'light' },
    { id: 'americain', short: 'Américain', label: 'Filet américain on toast', meals: ['lunch'], minutes: 5, ing: ['beef'], days: 15, safe: false, freezer: 0, prep: 'none' },
    { id: 'pancakes', short: 'Pancakes', label: 'Pancakes', meals: ['breakfast'], minutes: 25, ing: ['egg'], days: 20, safe: false, freezer: 0, prep: 'full' },
    { id: 'yoghurt', short: 'Yoghurt', label: 'Yoghurt with granola', meals: ['breakfast'], minutes: 2, ing: [], days: 1, safe: true, freezer: 0, prep: 'none' },
    { id: 'omelette', short: 'Eggs', label: 'Cheese omelette', meals: ['breakfast', 'lunch', 'dinner'], minutes: 10, ing: ['egg', 'cheese'], days: 5, safe: true, freezer: 0, prep: 'light' },
];
const BY_ID = new Map(DISHES.map((d) => [d.id, d]));
const MEALS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
const BANDS = { quick: 'up to 20 min', mid: '21 to 45 min', long: 'over 45 min' };
const ING = { chicken: 'chicken', beef: 'beef', egg: 'egg', cheese: 'cheese', tomato: 'tomato', potato: 'potato' };
const KINDS = { safe: 'Safe favourites', freezer: 'Freezer portions', noprep: 'No prep' };
const band = (/** @type {number} */ m) => (m <= 20 ? 'quick' : m <= 45 ? 'mid' : 'long');
const isKind = (/** @type {Dish} */ d, /** @type {string} */ k) => (k === 'safe' ? d.safe : k === 'freezer' ? d.freezer > 0 : d.prep === 'none');
const isEasy = (/** @type {Dish} */ d) => d.safe || d.freezer > 0 || d.prep === 'none';
/** The days after which a dish gets a visibly bigger slice. */
const LONG_DAYS = 21;

/** The options the review dialog switches; all once for the page. */
const OPT = { odds: 'recency', spin: 'calm', repeat: 'never', skip: 'week', timeAsk: 'tri', loosen: 'smart', easyMode: 'limit', easyCalm: 'on', art: 'with' };

// ---- 2 · what fits ------------------------------------------------------------------------------------------------
/** @typedef {{ include: string[], exclude: string[] }} Tri */
/**
 * @typedef {object} Model
 * @property {Tri} meal @property {Tri} time @property {Tri} ing @property {number | null} limit
 * @property {boolean} easy @property {Set<string>} kinds @property {Map<string, true>} resting @property {string[]} order
 */
/** @returns {Model} */
const makeModel = () => ({
    meal: { include: [], exclude: [] },
    time: { include: [], exclude: [] },
    ing: { include: [], exclude: [] },
    limit: null,
    easy: false,
    kinds: new Set(['safe', 'freezer', 'noprep']),
    resting: new Map(),
    order: [],
});

/** @param {Dish} d @param {Model} m @param {Partial<Record<'filters' | 'resting' | 'easy', boolean>>} [skip] */
function fits(d, m, skip = {}) {
    if (!skip.filters) {
        if (m.meal.include.length && !m.meal.include.some((x) => d.meals.includes(x))) return false;
        if (m.meal.exclude.some((x) => d.meals.includes(x))) return false;
        if (m.time.include.length && !m.time.include.includes(band(d.minutes))) return false;
        if (m.time.exclude.includes(band(d.minutes))) return false;
        if (m.limit !== null && d.minutes > m.limit) return false;
        if (!m.ing.include.every((x) => d.ing.includes(x))) return false;
        if (m.ing.exclude.some((x) => d.ing.includes(x))) return false;
    }
    if (!skip.resting && m.resting.has(d.id)) return false;
    if (!skip.easy && m.easy && OPT.easyMode === 'limit' && ![...m.kinds].some((k) => isKind(d, k))) return false;
    return true;
}
const onWheel = (/** @type {Model} */ m) => DISHES.filter((d) => fits(d, m));

/** The slice of a dish: long not eaten, bigger. @param {Dish} d @param {Model} m */
function weight(d, m) {
    let w = OPT.odds === 'equal' ? 1 : Math.min(5, Math.max(0.6, 0.6 + d.days / 8));
    if (OPT.odds === 'freezer' && d.freezer > 0) w *= 3;
    if (m.easy && OPT.easyMode === 'weight' && [...m.kinds].some((k) => isKind(d, k))) w *= 4;
    return Math.round(w * 10) / 10;
}

/**
 * Everything that holds dishes back right now, each with how to let it go.
 * @param {Model} m
 * @returns {{ key: string, label: string, release: () => void }[]}
 */
function constraints(m) {
    /** @type {{ key: string, label: string, release: () => void }[]} */
    const out = [];
    /** @param {'meal' | 'time' | 'ing'} group @param {Record<string, string>} names */
    const tri = (group, names) => {
        for (const [state, list] of /** @type {const} */ ([['include', m[group].include], ['exclude', m[group].exclude]])) {
            for (const value of list) {
                const name = names[value];
                const label =
                    group === 'ing' ? (state === 'include' ? `with ${name}` : `without ${name}`) : state === 'include' ? name : `not ${name}`;
                out.push({ key: `${group}:${value}`, label, release: () => (m[group][state] = m[group][state].filter((x) => x !== value)) });
            }
        }
    };
    tri('meal', MEALS);
    tri('time', BANDS);
    tri('ing', ING);
    if (m.limit !== null) out.push({ key: 'limit', label: `up to ${m.limit} min`, release: () => (m.limit = null) });
    for (const id of m.resting.keys())
        out.push({ key: `rest:${id}`, label: `resting: ${BY_ID.get(id)?.label ?? id}`, release: () => m.resting.delete(id) });
    if (m.easy && OPT.easyMode === 'limit')
        for (const k of Object.keys(KINDS))
            if (!m.kinds.has(k)) out.push({ key: `kind:${k}`, label: `not counting ${KINDS[/** @type {'safe'} */ (k)].toLowerCase()}`, release: () => m.kinds.add(k) });
    if (!out.length && m.easy) out.push({ key: 'easy', label: 'no energy today', release: () => (m.easy = false) });
    return out;
}

/**
 * Let go of one thing that holds dishes back, and say which.
 * @param {Model} m
 * @returns {string | null} the sentence, or null when nothing holds anything back
 */
function loosen(m) {
    const all = constraints(m);
    if (!all.length) return null;
    /** The dishes on the wheel if this one thing were let go (tried on a copy). @param {string} key */
    const countAfter = (key) => {
        const copy = makeModel();
        Object.assign(copy, {
            meal: structuredClone(m.meal),
            time: structuredClone(m.time),
            ing: structuredClone(m.ing),
            limit: m.limit,
            easy: m.easy,
            kinds: new Set(m.kinds),
            resting: new Map(m.resting),
        });
        constraints(copy)
            .find((c) => c.key === key)
            ?.release();
        return onWheel(copy).length;
    };
    let pick = all[all.length - 1];
    if (OPT.loosen === 'last') {
        const rank = (/** @type {{ key: string }} */ c) => m.order.lastIndexOf(c.key);
        pick = [...all].sort((a, b) => rank(a) - rank(b)).pop() ?? pick;
    } else {
        let best = -1;
        for (const c of all) {
            const n = countAfter(c.key);
            if (n >= best) {
                best = n;
                pick = c;
            }
        }
    }
    pick.release();
    m.order = m.order.filter((k) => k !== pick.key);
    const n = onWheel(m).length;
    return `Let go of “${pick.label}”: ${n === 1 ? '1 dish fits' : `${n} dishes fit`} again.`;
}

/** @param {Model} m */
const blockText = (m) => {
    const all = constraints(m);
    return all.length ? `No dish fits all of: ${all.map((c) => c.label).join(', ')}.` : 'No dish is left on the wheel.';
};

/** Remember the order a constraint was set in. @param {Model} m @param {string} key @param {boolean} on */
function track(m, key, on) {
    m.order = m.order.filter((k) => k !== key);
    if (on) m.order.push(key);
}

// ---- 3 · a card with a state ----------------------------------------------------------------------------------------
/** @param {string} id @returns {HTMLElement | null} */
const byId = (id) => document.getElementById(id);
/** @type {Set<{ refresh: () => void, skip: () => void, wheel: () => void }>} */
const views = new Set();

/**
 * One kp-card whose data is a wheel and its answer, or a list of the dishes that fit; its state follows the model.
 * @param {HTMLElement} card
 * @param {Model} model
 * @param {{ kind: 'wheel' | 'list', afterLoosen?: () => void, countText?: (n: number) => string, say?: (text: string) => void }} how
 */
function mountView(card, model, how) {
    const data = /** @type {HTMLElement} */ (card.querySelector('.kp-card__data'));
    const badge = card.querySelector('[data-wl-fitcount], #wl-fits-count');
    /** @type {'loading' | 'error' | null} */
    let forced = null;
    /** @type {string | null} */
    let chosen = null;
    /** @type {string | null} */
    let decided = null;
    let spinning = false;
    let shownKey = '';
    let cardKey = '';
    /** @type {string[]} */
    let items = [];
    /** @type {Record<string, HTMLElement>} */
    const part = {};
    /** @type {HTMLElement | null} */
    let wheel = null;

    const say = (/** @type {string} */ text) => {
        if (how.say) how.say(text);
        else if (part.live) part.live.textContent = text;
    };

    // ---- the markup this view owns
    if (how.kind === 'wheel') {
        data.innerHTML = `
            <div class="wl-screen">
                <div class="wl-wheelcol"><div class="kp-wheel" data-kp-wheel aria-label="Tonight’s dinner"></div></div>
                <div class="wl-result" role="group" aria-label="The wheel’s answer">
                    <p class="wl-result__kicker" data-wl="kicker"></p>
                    <p class="wl-result__name" data-wl="name"></p>
                    <div class="wl-result__facts" data-wl="facts"></div>
                    <p class="wl-result__why" data-wl="why"></p>
                    <p class="wl-result__timing" data-wl="timing"></p>
                    <div class="wl-actions">
                        <div class="wl-action">
                            <button type="button" class="kp-button kp-button--primary" data-wl="yes" disabled data-kp-disabled-reason="Spin first: the wheel has not chosen yet">Yes, cook this</button>
                            <p>Fix this as tonight’s dinner and count back to when to start.</p>
                        </div>
                        <div class="wl-action">
                            <button type="button" class="kp-button" data-wl="again" data-kp-disabled-reason="The wheel is turning">Spin again</button>
                            <p>Let the wheel choose another dish.</p>
                        </div>
                        <div class="wl-action" data-wl="skip-row">
                            <button type="button" class="kp-button" data-wl="skip" disabled data-kp-disabled-reason="Spin first: there is no dish to set aside yet"></button>
                            <p data-wl="skip-says"></p>
                        </div>
                    </div>
                    <div class="wl-resting">
                        <p class="wl-resting__label" data-wl="rest"></p>
                        <div class="wl-resting__list" data-wl="resting"></div>
                    </div>
                    <p class="wl-live" role="status" data-wl="live"></p>
                </div>
            </div>`;
        for (const el of data.querySelectorAll('[data-wl]')) part[/** @type {HTMLElement} */ (el).dataset.wl ?? ''] = /** @type {HTMLElement} */ (el);
        wheel = /** @type {HTMLElement} */ (data.querySelector('.kp-wheel'));
        wheel.id = `${card.id}-wheel`;
        attachWheels(card);
        attachDisabledReasons(card);
    } else {
        data.innerHTML = '<ul class="wl-fits" data-wl="list"></ul>';
        part.list = /** @type {HTMLElement} */ (data.querySelector('[data-wl="list"]'));
    }

    // ---- the wheel's own options
    const wheelOptions = () => {
        if (!wheel) return;
        const spec = { calm: [3600, 3, 6], quick: [1500, 1, 2], slow: [6000, 6, 9] }[/** @type {'calm'} */ (OPT.spin)];
        wheel.setAttribute('data-kp-wheel-duration', String(spec[0]));
        wheel.setAttribute('data-kp-wheel-turns-min', String(spec[1]));
        wheel.setAttribute('data-kp-wheel-turns-max', String(spec[2]));
        wheel.setAttribute('data-kp-wheel-repeat', OPT.repeat === 'allow' ? 'true' : 'false');
    };

    // ---- the answer card
    const badgeOf = (/** @type {string} */ text, tone = '') => {
        const b = document.createElement('span');
        b.className = `kp-badge${tone ? ` kp-badge--${tone}` : ''}`;
        b.textContent = text;
        return b;
    };
    const setReason = (/** @type {HTMLElement} */ button, /** @type {boolean} */ off, /** @type {string} */ why) => {
        /** @type {HTMLButtonElement} */ (button).disabled = off;
        button.setAttribute('data-kp-disabled-reason', why);
    };
    const paintAnswer = () => {
        if (!wheel) return;
        const d = chosen ? BY_ID.get(chosen) : undefined;
        const only = items.length === 1;
        part.facts.replaceChildren();
        if (spinning) {
            part.kicker.textContent = 'The wheel is turning';
            part.name.textContent = '…';
            part.why.textContent = 'Hold on a moment: it will stop by itself.';
            part.timing.textContent = '';
        } else if (!d) {
            part.kicker.textContent = 'Not chosen yet';
            part.name.textContent = 'Press Spin';
            part.facts.append(badgeOf(`${plural(items.length, 'dish', 'dishes')} on the wheel`));
            part.why.textContent = `A dish you have not cooked for ${LONG_DAYS} days or more gets a bigger slice.`;
            part.timing.textContent = '';
        } else {
            part.kicker.textContent = decided === d.id ? 'Decided for tonight' : only ? 'Only one dish fits' : 'The wheel chose';
            part.name.textContent = d.label;
            for (const m of d.meals) part.facts.append(badgeOf(MEALS[/** @type {'dinner'} */ (m)]));
            part.facts.append(badgeOf(minutesText(d.minutes)));
            if (d.safe) part.facts.append(badgeOf('Safe favourite', 'success'));
            if (d.freezer > 0) part.facts.append(badgeOf(`Freezer, ${plural(d.freezer, 'portion', 'portions')}`, 'info'));
            if (d.prep === 'none') part.facts.append(badgeOf('No prep', 'success'));
            if (d.days >= LONG_DAYS) part.facts.append(badgeOf('Bigger slice', 'warning'));
            part.why.textContent =
                d.days >= LONG_DAYS
                    ? `Last cooked ${dmy(daysBefore(d.days))}, ${d.days} days ago: its slice was bigger.`
                    : `Last cooked ${dmy(daysBefore(d.days))}, ${d.days === 1 ? 'yesterday' : `${d.days} days ago`}: a smaller slice.`;
            if (decided === d.id) {
                const start = EAT_MIN - d.minutes;
                part.timing.textContent =
                    start >= NOW_MIN
                        ? `Start at ${hhmm(start)} to eat at 18:30 (${minutesText(d.minutes)}).`
                        : `Dinner at 18:30 is too soon for this one: start now and eat at ${hhmm(NOW_MIN + d.minutes)}.`;
            } else part.timing.textContent = 'Press Yes to count back from 18:30 to when to start.';
        }
        setReason(part.yes, !d || spinning || decided === d?.id, spinning ? 'The wheel is turning' : decided && d ? 'Already decided: spin again to change your mind' : 'Spin first: the wheel has not chosen yet');
        setReason(part.again, spinning || items.length < 2, spinning ? 'The wheel is turning' : 'Only one dish is on the wheel: there is nothing to spin');
        setReason(part.skip, !d || spinning, spinning ? 'The wheel is turning' : 'Spin first: there is no dish to set aside yet');
        const week = OPT.skip === 'week';
        part['skip-row'].hidden = OPT.skip === 'off';
        part.skip.textContent = week ? 'Not this one, not again this week' : 'Not this one, not tonight';
        part['skip-says'].textContent = week
            ? `Take this dish off the wheel until ${dmy(daysBefore(7, 1))}.`
            : 'Take this dish off the wheel for tonight.';
        const rest = [...model.resting.keys()];
        part.rest.textContent = rest.length
            ? week
                ? `Resting until ${dmy(daysBefore(7, 1))}:`
                : 'Resting for tonight:'
            : 'Nothing is resting: every dish that fits is on the wheel.';
        part.resting.replaceChildren(
            ...rest.map((id) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'kp-button kp-button--sm';
                b.textContent = `Bring back ${BY_ID.get(id)?.label ?? id}`;
                b.title = 'Put this dish back on the wheel';
                b.addEventListener('click', () => {
                    model.resting.delete(id);
                    track(model, `rest:${id}`, false);
                    how.afterLoosen?.();
                    refresh();
                    say(`${BY_ID.get(id)?.label ?? id} is back on the wheel.`);
                });
                return b;
            }),
        );
    };

    // ---- the list of dishes that fit
    const paintList = () => {
        part.list.replaceChildren(
            ...items.map((id) => {
                const d = /** @type {Dish} */ (BY_ID.get(id));
                const li = document.createElement('li');
                li.className = 'wl-fit';
                const text = document.createElement('span');
                text.className = 'wl-fit__text';
                const name = document.createElement('b');
                name.textContent = d.label;
                const meta = document.createElement('span');
                meta.textContent = `${d.meals.map((m) => MEALS[/** @type {'dinner'} */ (m)]).join(', ')} · ${minutesText(d.minutes)} · last cooked ${dmy(daysBefore(d.days))}`;
                text.append(name, meta);
                const tags = document.createElement('span');
                tags.className = 'wl-fit__tags';
                if (d.days >= LONG_DAYS) tags.append(badgeOf('Bigger slice', 'warning'));
                li.append(text, tags);
                return li;
            }),
        );
    };

    // ---- state of the card
    const syncCard = () => {
        const n = items.length;
        if (badge) badge.textContent = how.countText ? how.countText(n) : plural(n, 'dish', 'dishes');
        const key = forced ?? (n === 0 ? `empty:${blockText(model)}` : 'ready');
        if (key === cardKey) return;
        cardKey = key;
        if (forced === 'loading') setCardState(card, 'loading', { words: 'Reading your dishes' });
        else if (forced === 'error')
            setCardState(card, 'error', { title: 'The dishes could not be read', text: 'The list did not answer. Nothing was lost.' });
        else if (n === 0) {
            const action = document.createElement('button');
            action.type = 'button';
            action.className = 'kp-button kp-button--primary';
            action.textContent = 'Loosen a filter';
            action.title = 'Let go of the one thing that holds the most dishes back';
            action.addEventListener('click', () => {
                const said = loosen(model);
                how.afterLoosen?.();
                forced = null;
                cardKey = '';
                refresh();
                press(card.id, 'ready');
                if (said) say(said);
            });
            setCardState(card, 'empty', {
                title: 'No dish matches these filters',
                text: `${blockText(model)} Loosen a filter and the wheel is back.`,
                action,
            });
        } else setCardState(card, 'ready');
        // The empty note is the package's state plate: heading size, centred in the whole stage, a normal-size action.
        for (const empty of card.querySelectorAll('.kp-card__empty:not(.kp-stateplate)')) {
            empty.classList.add('kp-stateplate', 'kp-stateplate--empty');
            empty.querySelector('.kp-card__state-title')?.classList.add('kp-stateplate__title');
            empty.querySelector('.kp-card__state-text')?.classList.add('kp-stateplate__text');
        }
        const box = card.querySelector('.kp-card__empty:not([data-kp-art]), .kp-card__failure:not([data-kp-art])');
        if (box) {
            box.setAttribute('data-kp-art', box.classList.contains('kp-card__failure') ? 'error' : 'nomatch');
            attachArt(card);
        }
    };

    // ---- the whole view, again, from the model
    const refresh = () => {
        const dishes = onWheel(model);
        items = dishes.map((d) => d.id);
        syncCard();
        if (how.kind === 'list') {
            paintList();
            return;
        }
        // The wheel gets the short name: the package cuts a long label in a thin slice; the answer card says the whole name.
        const next = dishes.map((d) => ({ id: d.id, label: d.short ?? d.label, weight: weight(d, model) }));
        const key = JSON.stringify(next);
        if (key !== shownKey && wheel) {
            shownKey = key;
            chosen = null;
            decided = null;
            setWheelItems(wheel, next);
        }
        paintAnswer();
    };

    if (wheel) {
        wheelOptions();
        wheel.addEventListener(WHEEL_SPIN_EVENT, () => {
            spinning = true;
            chosen = null;
            decided = null;
            paintAnswer();
        });
        wheel.addEventListener(WHEEL_RESULT_EVENT, (event) => {
            spinning = false;
            chosen = /** @type {CustomEvent} */ (event).detail.item.id;
            paintAnswer();
            say(`The wheel chose ${BY_ID.get(/** @type {string} */ (chosen))?.label}.`);
        });
        part.yes.addEventListener('click', () => {
            if (!chosen) return;
            decided = chosen;
            paintAnswer();
            say(`Decided: ${BY_ID.get(chosen)?.label} is tonight’s dinner.`);
        });
        part.again.addEventListener('click', () => void spinWheel(/** @type {HTMLElement} */ (wheel)));
        part.skip.addEventListener('click', () => {
            if (!chosen) return;
            const id = chosen;
            model.resting.set(id, true);
            track(model, `rest:${id}`, true);
            how.afterLoosen?.();
            refresh();
            say(`${BY_ID.get(id)?.label} is set aside and off the wheel.`);
        });
    }

    const view = {
        card,
        model,
        refresh,
        skip: paintAnswer,
        wheel: () => {
            wheelOptions();
            refresh();
        },
        spin: () => (wheel ? spinWheel(wheel) : null),
        reset: () => {
            model.resting.clear();
            model.order = [];
            chosen = null;
            decided = null;
            shownKey = '';
            refresh();
        },
        /** @param {'ready' | 'loading' | 'error'} state */
        force: (state) => {
            forced = state === 'ready' ? null : state;
            refresh();
        },
        retry: () => {
            forced = 'loading';
            refresh();
            setTimeout(() => {
                forced = null;
                refresh();
                press(card.id, 'ready');
            }, 1200);
        },
        say,
    };
    card.addEventListener(CARD_RETRY_EVENT, view.retry);
    views.add(view);
    refresh();
    return view;
}

/** Press one state button of a card's group: exactly one is pressed. @param {string} cardId @param {string} state */
function press(cardId, state) {
    const group = document.querySelector(`[data-wl-states="${cardId}"]`);
    if (!group) return;
    for (const b of group.querySelectorAll('[data-wl-state]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-wl-state') === state));
}

/** The model that makes a card empty in every section: no dish has both chicken and beef. @param {Model} m */
const makeEmpty = (m) => {
    m.ing = { include: ['chicken', 'beef'], exclude: [] };
};

/**
 * Wire a card's state buttons: ready, loading, no dish fits, failed.
 * @param {ReturnType<typeof mountView>} view @param {(empty: boolean) => void} [onEmpty] what 'No dish fits' / Ready do to the filters
 */
function wireStates(view, onEmpty) {
    const group = document.querySelector(`[data-wl-states="${view.card.id}"]`);
    if (!group) return;
    for (const button of /** @type {NodeListOf<HTMLElement>} */ (group.querySelectorAll('[data-wl-state]'))) {
        button.addEventListener('click', () => {
            const state = /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (button.getAttribute('data-wl-state'));
            press(view.card.id, state);
            if (state === 'empty') {
                makeEmpty(view.model);
                onEmpty?.(true);
                view.force('ready');
            } else {
                if (constraints(view.model).some((c) => c.key.startsWith('ing:'))) {
                    view.model.ing = { include: [], exclude: [] };
                    onEmpty?.(false);
                }
                view.force(state);
            }
        });
    }
}

await ready;

// ---- the options the review dialog switches --------------------------------------------------------------------------
/** @param {string} id @param {(value: string) => void} apply */
const onChoice = (id, apply) =>
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });

// ---- section 1 and 4: the wheel card ------------------------------------------------------------------------------------
for (const id of ['wl-card-a', 'wl-card-d']) {
    const card = byId(id);
    if (!card) continue;
    const view = mountView(card, makeModel(), { kind: 'wheel' });
    wireStates(view);
}
{
    const a = [...views].find((v) => v.card.id === 'wl-card-a');
    for (const button of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-wl-try]'))) {
        button.addEventListener('click', () => {
            if (!a) return;
            if (button.dataset.wlTry === 'spin') void /** @type {any} */ (a).spin();
            else {
                /** @type {any} */ (a).reset();
                /** @type {any} */ (a).force('ready');
                press('wl-card-a', 'ready');
            }
        });
    }
}

// ---- section 2: the filters -------------------------------------------------------------------------------------------
if (byId('wl-filters') && byId('wl-fits')) {
    const model = makeModel();
    const groups = { meal: byId('wl-f-meal'), time: byId('wl-f-time'), ing: byId('wl-f-ing') };
    const limitGroup = byId('wl-f-limit');
    const live = byId('wl-f-live');
    const total = DISHES.length;
    /** @type {Record<string, Record<string, number>>} */
    const counts = { meal: {}, time: {}, ing: {} };
    for (const m of Object.keys(MEALS)) counts.meal[m] = DISHES.filter((d) => d.meals.includes(m)).length;
    for (const b of Object.keys(BANDS)) counts.time[b] = DISHES.filter((d) => band(d.minutes) === b).length;
    for (const i of Object.keys(ING)) counts.ing[i] = DISHES.filter((d) => d.ing.includes(i)).length;
    const paintCounts = (/** @type {boolean} */ loading) => {
        for (const [g, el] of Object.entries(groups)) {
            if (!el) continue;
            el.toggleAttribute('aria-busy', loading);
            const shown = loading ? Object.fromEntries(Object.keys(counts[g]).map((k) => [k, null])) : counts[g];
            setSegmentedCounts(el, shown);
        }
    };
    paintCounts(false);

    const describe = () => {
        if (!live) return;
        const all = constraints(model);
        const n = onWheel(model).length;
        live.textContent = all.length
            ? `${all.map((c) => c.label).join(', ')}: ${n} of ${total} dishes fit.`
            : 'Nothing is filtered: every dish is on the list.';
    };
    const view = mountView(/** @type {HTMLElement} */ (byId('wl-fits')), model, {
        kind: 'list',
        countText: (n) => `${n} of ${total}`,
        afterLoosen: () => paintChips(),
        say: (text) => {
            if (live) live.textContent = text;
        },
    });
    const origRefresh = view.refresh;
    const refreshAll = () => {
        origRefresh();
        if (!byId('wl-fits')?.matches('[data-kp-state="loading"]')) describe();
    };
    function paintChips() {
        if (groups.meal) setSegmentedTri(groups.meal, model.meal);
        if (groups.time) setSegmentedTri(groups.time, model.time);
        if (groups.ing) setSegmentedTri(groups.ing, model.ing);
        if (limitGroup) {
            for (const b of limitGroup.querySelectorAll('[data-kp-toggle]'))
                toggle(/** @type {HTMLElement} */ (b))?.set(Number(/** @type {HTMLElement} */ (b).dataset.kpToggleValue) === model.limit, { silent: true });
        }
        refreshAll();
    }
    /** @param {'meal' | 'time' | 'ing'} group */
    const readChips = (group) => {
        const el = groups[group];
        if (!el) return;
        const now = getSegmentedTri(el);
        for (const state of /** @type {const} */ (['include', 'exclude']))
            for (const v of now[state]) if (!model[group][state].includes(v)) track(model, `${group}:${v}`, true);
        for (const state of /** @type {const} */ (['include', 'exclude']))
            for (const v of model[group][state]) if (!now.include.includes(v) && !now.exclude.includes(v)) track(model, `${group}:${v}`, false);
        model[group] = now;
        refreshAll();
    };
    for (const group of /** @type {const} */ (['meal', 'time', 'ing'])) groups[group]?.addEventListener(SEGMENTED_EVENT, () => readChips(group));
    limitGroup?.addEventListener('kp-toggle-changed', (event) => {
        const keys = /** @type {CustomEvent} */ (event).detail.pressedKeys;
        model.limit = keys.length ? Number(keys[0]) : null;
        track(model, 'limit', model.limit !== null);
        refreshAll();
    });
    byId('wl-f-clear')?.addEventListener('click', () => {
        model.meal = { include: [], exclude: [] };
        model.time = { include: [], exclude: [] };
        model.ing = { include: [], exclude: [] };
        model.limit = null;
        model.order = [];
        paintChips();
        if (live) live.textContent = 'Every filter is let go: every dish is on the list.';
    });
    for (const button of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-wl-preset]'))) {
        button.addEventListener('click', () => {
            model.meal = { include: [], exclude: [] };
            model.time = { include: [], exclude: [] };
            model.ing = { include: [], exclude: [] };
            model.limit = null;
            model.order = [];
            if (button.dataset.wlPreset === 'quick') {
                model.meal.include = ['dinner'];
                if (OPT.timeAsk === 'limit') model.limit = 20;
                else model.time.include = ['quick'];
                model.ing.exclude = ['cheese'];
                model.order = ['meal:dinner', OPT.timeAsk === 'limit' ? 'limit' : 'time:quick', 'ing:cheese'];
            } else {
                makeEmpty(model);
                model.order = ['ing:chicken', 'ing:beef'];
            }
            paintChips();
        });
    }
    // The states: the chips stay usable; only the list is loading, failed or ready.
    const states = document.querySelector('[data-wl-states="wl-fits"]');
    for (const button of /** @type {NodeListOf<HTMLElement>} */ (states?.querySelectorAll('[data-wl-state]') ?? [])) {
        button.addEventListener('click', () => {
            const state = /** @type {'ready' | 'loading' | 'error'} */ (button.getAttribute('data-wl-state'));
            press('wl-fits', state);
            paintCounts(state === 'loading');
            view.force(state);
            if (state !== 'loading') describe();
        });
    }
    byId('wl-fits')?.addEventListener(CARD_RETRY_EVENT, () => {
        paintCounts(true);
        setTimeout(() => paintCounts(false), 1200);
    });
    const asks = () => {
        const limit = OPT.timeAsk === 'limit';
        const tri = groups.time;
        if (tri) tri.hidden = limit;
        if (limitGroup) limitGroup.hidden = !limit;
        model.time = { include: [], exclude: [] };
        model.limit = null;
        model.order = model.order.filter((k) => !k.startsWith('time:') && k !== 'limit');
        paintChips();
    };
    onChoice('time-ask', (value) => {
        OPT.timeAsk = value;
        asks();
    });
    onChoice('loosen', (value) => (OPT.loosen = value));
    void resetSegmented;
    describe();
}

// ---- section 3: No energy today -------------------------------------------------------------------------------------
if (byId('wl-easy') && byId('wl-card-c')) {
    const model = makeModel();
    const switchEl = /** @type {HTMLInputElement} */ (byId('wl-easy-switch'));
    const kindsEl = /** @type {HTMLElement} */ (byId('wl-easy-kinds'));
    const live = byId('wl-easy-live');
    const view = mountView(/** @type {HTMLElement} */ (byId('wl-card-c')), model, {
        kind: 'wheel',
        afterLoosen: () => paintControls(),
        say: (text) => {
            if (live) live.textContent = text;
        },
    });
    wireStates(view, () => undefined);
    const buttons = /** @type {HTMLElement[]} */ ([...kindsEl.querySelectorAll('[data-kp-toggle]')]);
    for (const b of buttons) toggle(b)?.setCount(DISHES.filter((d) => isKind(d, b.dataset.kpToggleValue ?? '')).length);
    for (const b of buttons) b.setAttribute('data-kp-disabled-reason', 'Turn on No energy today first');
    function paintControls() {
        switchEl.checked = model.easy;
        for (const b of buttons) {
            toggle(b)?.set(model.kinds.has(b.dataset.kpToggleValue ?? ''), { silent: true });
            /** @type {HTMLButtonElement} */ (b).disabled = !model.easy;
        }
        const n = onWheel(model).length;
        if (live)
            live.textContent = model.easy
                ? `No energy today is on: ${n === 1 ? '1 dish is' : `${n} dishes are`} on the wheel.`
                : 'No energy today is off: the wheel holds every dish.';
    }
    attachDisabledReasons(kindsEl);
    const calm = () => setCalm(model.easy && OPT.easyCalm === 'on', { remember: false, announce: false });
    const apply = () => {
        paintControls();
        view.refresh();
        calm();
        paintControls();
    };
    switchEl.addEventListener('change', () => {
        model.easy = switchEl.checked;
        apply();
    });
    kindsEl.addEventListener('kp-toggle-changed', (event) => {
        const keys = /** @type {CustomEvent} */ (event).detail.pressedKeys;
        model.kinds = new Set(keys);
        for (const k of Object.keys(KINDS)) track(model, `kind:${k}`, !model.kinds.has(k));
        view.refresh();
        paintControls();
    });
    onChoice('easy-mode', (value) => {
        OPT.easyMode = value;
        apply();
    });
    onChoice('easy-calm', (value) => {
        OPT.easyCalm = value;
        calm();
    });
    paintControls();
}

// ---- the options every wheel shares ---------------------------------------------------------------------------------
onChoice('odds', (value) => {
    OPT.odds = value;
    for (const v of views) v.refresh();
});
onChoice('spin', (value) => {
    OPT.spin = value;
    for (const v of views) v.wheel();
});
onChoice('repeat', (value) => {
    OPT.repeat = value;
    for (const v of views) v.wheel();
});
onChoice('skip', (value) => {
    OPT.skip = value;
    for (const v of views) v.skip();
});
onChoice('art', (value) => {
    OPT.art = value;
    for (const card of document.querySelectorAll('.wl-card')) {
        if (value === 'with') card.removeAttribute('data-wl-art');
        else card.setAttribute('data-wl-art', 'off');
    }
});
