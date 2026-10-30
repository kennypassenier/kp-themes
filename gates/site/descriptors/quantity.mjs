// Page descriptor for the "quantity" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const quantityDescriptor = {
        id: 'quantity',
        title: 'Quantity',
        group: 'Forms',
        classes: ['kp-quantity'],
        exports: [],
        intro: 'A number between a minus and a plus button with its unit after it, for servings and amounts. `data-kp-quantity` on the root with `-min`, `-max`, `-step`, `-unit`, `-unit-one`, `-label` and `-locale`; js/quantity.js (`attachQuantities`, `setQuantity`, `getQuantity`) writes the buttons, the field box and the unit, and fires `kp-quantity-change` with `{ value, previous, source }`. The number is a spin button that can be typed in the page’s language, with a comma or a point.',
        whenToUse: 'For a small whole or stepped amount a person nudges up and down: portions, pieces, grams in steps. For a free number use a field; for a share of a range use a slider.',
        examples: [
            {
                title: 'Portions, from 1 to 12',
                why: 'The module writes the two buttons, the field box and the unit around the `input`; the unit follows the number (“1 portion”, “2 portions”). The number is a spin button: type 2,5 or 2.5, use the arrows, PageUp and PageDown (ten steps), Home and End. A press at a bound does nothing and keeps the focus; a button held down repeats, slowly first. `kp-quantity-change` tells `{ value, previous, source }`; `getQuantity` and `setQuantity` read and write it from the page.',
                markup: `
<div class="kp-quantity" id="doc-quantity" data-kp-quantity data-kp-quantity-min="1" data-kp-quantity-max="12" data-kp-quantity-unit="portions" data-kp-quantity-unit-one="portion" data-kp-quantity-label="Portions">
<input class="kp-quantity__input" value="2" />
</div>
<p class="kp-text-muted" id="doc-quantity-said" role="status">2 portions.</p>
<button type="button" class="kp-button kp-button--sm" id="doc-quantity-set">Set 8 from the page</button>
`,
                script: `
import { attachQuantities, getQuantity, setQuantity } from '@kp-soft/themes/js/quantity';

const quantity = document.getElementById('doc-quantity');
attachQuantities(quantity.parentElement);
const said = document.getElementById('doc-quantity-said');
quantity.addEventListener('kp-quantity-change', (event) => {
    said.textContent = event.detail.value + ' (was ' + event.detail.previous + ', by ' + event.detail.source + ').';
});
document.getElementById('doc-quantity-set').addEventListener('click', () => {
    setQuantity(quantity, 8);
    said.textContent = 'Set from the page: ' + getQuantity(quantity) + '.';
});
`,
            },
            {
                title: 'Steps of 0.5, larger, and disabled',
                why: 'The step’s decimals are the number’s decimals, so `data-kp-quantity-step="0.5"` shows one; `data-kp-quantity-locale` sets the decimal mark (the nearest `lang` otherwise). `.kp-quantity--lg` makes the buttons and the number larger, for a screen at arm’s length, and `data-kp-quantity-disabled` dims the whole control and takes it out of reach. Text that is not a number marks the field invalid while it stands and the last value is put back when you leave it.',
                markup: `
<div class="kp-quantity kp-quantity--lg" id="doc-quantity-lg" data-kp-quantity data-kp-quantity-min="0" data-kp-quantity-max="5" data-kp-quantity-step="0.5" data-kp-quantity-unit="kg" data-kp-quantity-locale="nl-BE" data-kp-quantity-label="Rice">
<input class="kp-quantity__input" value="1,5" />
</div>
<div class="kp-quantity" data-kp-quantity data-kp-quantity-min="1" data-kp-quantity-max="12" data-kp-quantity-unit="portions" data-kp-quantity-unit-one="portion" data-kp-quantity-label="Portions, fixed" data-kp-quantity-disabled>
<input class="kp-quantity__input" value="4" />
</div>
`,
                script: `
import { attachQuantities } from '@kp-soft/themes/js/quantity';

attachQuantities(document.getElementById('doc-quantity-lg').parentElement);
`,
            },
        ],
        variants: [
            { name: 'data-kp-quantity-step', what: 'The step a press moves by; its decimals are the number’s decimals (0.5 shows one).' },
            { name: 'data-kp-quantity-disabled', what: 'The whole control dimmed and out of reach.' },
            { name: '.kp-quantity--lg', what: 'Larger buttons and number, for a screen at arm’s length.' },
        ],
        accessibility: [
            'Built in — the number is a spin button with its value and unit in words; ArrowUp, ArrowDown, PageUp, PageDown, Home and End move it; the buttons are named after the label.',
            'Built in — a button at a bound is marked `aria-disabled` and keeps the focus.',
            'Yours — give it a label (`data-kp-quantity-label` or a `<label>` for the input).',
        ],
    };
