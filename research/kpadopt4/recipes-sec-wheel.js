// research/kpadopt4 (recipes sections) · 1, the wheel (mock dishes and weights; the wheel is js/wheel.js).
import { byId, say } from './recipes-kit.js';
import { WHEEL_RESULT_EVENT, WHEEL_SPIN_EVENT, attachWheels, setWheelItems, setWheelState } from '../../js/wheel.js';
import { attachSegmented, SEGMENTED_EVENT } from '../../js/segmented.js';

/** The weight is how long ago a dish was eaten: long ago, larger. */
const DISHES = [
    { id: 'curry', label: 'Chicken curry', weight: 3, veg: false },
    { id: 'soup', label: 'Lentil soup', weight: 5, veg: true },
    { id: 'pesto', label: 'Pasta pesto', weight: 0.5, veg: true },
    { id: 'tacos', label: 'Fish tacos', weight: 2, veg: false },
    { id: 'stew', label: 'Flemish beef stew with fries and a green salad on the side', weight: 2, veg: false },
    { id: 'omelette', label: 'Omelette', weight: 1.5, veg: true },
    { id: 'risotto', label: 'Mushroom risotto', weight: 2.5, veg: true },
    { id: 'wraps', label: 'Falafel wraps', weight: 1, veg: true },
];
/** How the chances are divided: by how long ago a dish was eaten, evenly, or leaning hard on one dish. */
const WEIGHTINGS = {
    recency: (/** @type {typeof DISHES[number]} */ d) => d.weight,
    equal: () => 1,
    soup: (/** @type {typeof DISHES[number]} */ d) => (d.id === 'soup' ? 12 : 1),
};
let weighting = 'recency';
let filter = 'all';
const as = (/** @type {typeof DISHES} */ list) => list.map((d) => ({ id: d.id, label: d.label, weight: WEIGHTINGS[weighting](d) }));

const wheel = byId('kc-wheel');
const phone = byId('kc-wheel-phone');
attachWheels(byId('wheel'));
attachSegmented(byId('wheel'));
setWheelItems(wheel, as(DISHES));
setWheelItems(phone, as(DISHES.slice(0, 6)));

/** @type {Record<string, () => typeof DISHES>} */
const FILTERS = {
    all: () => DISHES,
    veg: () => DISHES.filter((d) => d.veg),
    one: () => DISHES.filter((d) => d.id === 'soup'),
    none: () => [],
};
byId('kc-wheel-filter').addEventListener(SEGMENTED_EVENT, (event) => {
    filter = /** @type {CustomEvent} */ (event).detail.value;
    setWheelState(wheel, 'ready');
    setWheelItems(wheel, as(FILTERS[filter]()));
});
byId('kc-wheel-weights').addEventListener(SEGMENTED_EVENT, (event) => {
    weighting = /** @type {CustomEvent} */ (event).detail.value;
    setWheelState(wheel, 'ready');
    setWheelItems(wheel, as(FILTERS[filter]()));
});
byId('kc-wheel-turns').addEventListener(SEGMENTED_EVENT, (event) => {
    const [least, most] = /** @type {CustomEvent} */ (event).detail.value.split('-');
    for (const w of [wheel, phone]) {
        w.setAttribute('data-kp-wheel-turns-min', least);
        w.setAttribute('data-kp-wheel-turns-max', most);
    }
});
byId('kc-wheel-load').addEventListener('click', () => {
    setWheelState(wheel, 'loading');
    setTimeout(() => setWheelState(wheel, 'ready'), 2500);
});
byId('kc-wheel-fail').addEventListener('click', () => setWheelState(wheel, 'error', 'The dishes could not be read. Press Load again.'));

const log = byId('kc-wheel-log');
const section = byId('wheel');
section.addEventListener(WHEEL_SPIN_EVENT, (event) => {
    const { item, turns } = /** @type {CustomEvent} */ (event).detail;
    say(log, `kp-wheel-spin · drawn first: ${item.label} (weight ${item.weight}) · will travel ${turns.toFixed(2)} turns`);
});
section.addEventListener(WHEEL_RESULT_EVENT, (event) => {
    const { item, source } = /** @type {CustomEvent} */ (event).detail;
    say(log, `kp-wheel-result · ${item.label} (${source})`);
});
