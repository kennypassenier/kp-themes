// research/kpadopt4-recipes · 2, one step at a time (mock recipe; the view is js/focus-steps.js).
import { byId, say } from './kit.js';
import {
    FOCUS_STEPS_DONE_EVENT,
    FOCUS_STEPS_EVENT,
    FOCUS_STEPS_WAKE_EVENT,
    attachFocusSteps,
    setFocusSteps,
    setFocusStepsState,
} from '../../js/focus-steps.js';

/** @type {import('../../js/focus-steps.js').FocusStep[]} */
const CURRY = [
    { text: 'Rinse the rice in a sieve under cold water until the water runs clear.', ingredients: [{ amount: '300 g', name: 'basmati rice' }] },
    {
        text: 'Cut the chicken into pieces the size of a thumb and the onion into thin half rings.',
        ingredients: [
            { amount: '600 g', name: 'chicken thighs' },
            { amount: '1', name: 'onion' },
        ],
    },
    {
        text: 'Put the rice in a pan with the water and the salt, bring it to the boil, then put the lid on and turn the heat to its lowest.',
        ingredients: [
            { amount: '300 g', name: 'rinsed rice' },
            { amount: '450 ml', name: 'water' },
            { amount: '1 tsp', name: 'salt' },
        ],
        timer: { seconds: 600, name: 'Rice' },
        note: 'Do not lift the lid while the rice cooks: the steam does the work.',
        noteTone: 'warning',
    },
    {
        text: 'Fry the onion in the oil over a medium heat until soft and golden, about eight minutes, stirring now and then so it does not catch on the bottom of the pan. Add the curry paste and fry it for one more minute, until it smells fragrant.',
        ingredients: [
            { amount: '2 tbsp', name: 'oil' },
            { amount: '3 tbsp', name: 'curry paste' },
        ],
        timer: { seconds: 480, name: 'Onion' },
    },
    {
        text: 'Add the chicken and the coconut milk, stir, and let it simmer without a lid.',
        ingredients: [{ amount: '400 ml', name: 'coconut milk' }],
        timer: { seconds: 900, name: 'Curry' },
    },
    {
        text: 'Taste, add lime juice and coriander, and serve with the rice.',
        ingredients: ['1 lime', 'a handful of coriander'],
        note: 'Leftovers keep two days in the fridge.',
    },
];

const cook = byId('k4-cook');
const phone = byId('k4-cook-phone');
attachFocusSteps(byId('cook'));
setFocusSteps(cook, CURRY, { start: 2 });
setFocusSteps(phone, CURRY);

byId('k4-cook-load').addEventListener('click', () => {
    setFocusStepsState(cook, 'loading');
    setTimeout(() => {
        setFocusSteps(cook, CURRY, { start: 2 });
        setFocusStepsState(cook, 'ready');
    }, 2500);
});
byId('k4-cook-fail').addEventListener('click', () =>
    setFocusStepsState(cook, 'error', 'The recipe could not be read. Check the connection and press Load again.'),
);
byId('k4-cook-empty').addEventListener('click', () => {
    setFocusStepsState(cook, 'ready');
    setFocusSteps(cook, []);
});
byId('k4-cook-reset').addEventListener('click', () => {
    setFocusStepsState(cook, 'ready');
    setFocusSteps(cook, CURRY, { start: 2 });
});

const log = byId('k4-cook-log');
const section = byId('cook');
section.addEventListener(FOCUS_STEPS_EVENT, (event) => {
    const { index, from, total } = /** @type {CustomEvent} */ (event).detail;
    say(log, `kp-focus-steps-change · ${from + 1} → ${index + 1} of ${total}`);
});
section.addEventListener(FOCUS_STEPS_DONE_EVENT, () => say(log, 'kp-focus-steps-done'));
section.addEventListener(FOCUS_STEPS_WAKE_EVENT, (event) => say(log, `kp-focus-steps-wake · ${/** @type {CustomEvent} */ (event).detail.state}`));
