// research/kpadopt4-recipes · 4, the quantity with minus and plus (mock data; the control is js/quantity.js).
import { byId, say } from './kit.js';
import { QUANTITY_EVENT, attachQuantities } from '../../js/quantity.js';

attachQuantities(byId('quantity'));

const log = byId('k4-q-log');
byId('quantity').addEventListener(QUANTITY_EVENT, (event) => {
    const { value, previous, source } = /** @type {CustomEvent} */ (event).detail;
    const label = /** @type {HTMLElement} */ (event.target).getAttribute('data-kp-quantity-label');
    say(log, `kp-quantity-change · ${label}: ${previous} → ${value} (${source})`);
});

byId('k4-q-word').addEventListener('click', () => {
    const input = /** @type {HTMLInputElement} */ (byId('k4-q-en').querySelector('input'));
    input.focus();
    input.value = 'a lot';
    input.dispatchEvent(new Event('input', { bubbles: true }));
});
