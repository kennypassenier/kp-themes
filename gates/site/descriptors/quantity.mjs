// Page descriptor for the "quantity" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const quantityDescriptor = {
        id: 'quantity',
        title: 'Quantity',
        group: 'Forms',
        classes: ['kp-quantity', 'kp-accept-reason'],
        aliases: ['accept'],
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
            {
                title: 'Steppers that fill their cell, in a column',
                why: '`data-kp-quantity-fill` makes the number take the rest of the cell while the minus and plus keep their size, so steppers stacked in a column (list rows, a form grid, a row editor) end on one edge whatever their numbers and units. The unit keeps the width of its longest form and never breaks inside a word; the number gives way first. `data-kp-quantity-fill="false"` turns it off again on one stepper.',
                markup: `
<div class="kp-formgrid" id="doc-quantity-fill" aria-label="Stock">
<div class="kp-formgrid__row">
<span class="kp-formgrid__label">Ibuprofen 400 mg</span>
<div class="kp-formgrid__control"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Stock of Ibuprofen 400 mg"><input class="kp-quantity__input" value="14" /></div></div>
<p class="kp-formgrid__value">about 2 days</p>
<div class="kp-formgrid__actions"></div>
</div>
<div class="kp-formgrid__row">
<span class="kp-formgrid__label">Vitamin D3 25 µg</span>
<div class="kp-formgrid__control"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="capsules" data-kp-quantity-unit-one="capsule" data-kp-quantity-label="Stock of Vitamin D3 25 µg"><input class="kp-quantity__input" value="120" /></div></div>
<p class="kp-formgrid__value">about 4 months</p>
<div class="kp-formgrid__actions"></div>
</div>
<div class="kp-formgrid__row">
<span class="kp-formgrid__label">Saline nasal spray</span>
<div class="kp-formgrid__control"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="20" data-kp-quantity-unit="bottles" data-kp-quantity-unit-one="bottle" data-kp-quantity-label="Stock of Saline nasal spray"><input class="kp-quantity__input" value="1" /></div></div>
<p class="kp-formgrid__value">opened 30 days ago</p>
<div class="kp-formgrid__actions"></div>
</div>
</div>
`,
                script: `
import { attachQuantities } from '@kp-soft/themes/js/quantity';

attachQuantities(document.getElementById('doc-quantity-fill'));
`,
            },
            {
                title: 'A button that says what it will do with the amount',
                why: 'The accept button of a dialog that holds a quantity follows it: `data-kp-accept-follows` names the quantity, and the button reads “Add 3 boxes”, “Add 1 box”, and “Add boxes” at 0, where it is off and a line under the quantity says why. The unit and its plural come from the quantity; the words are in the dictionary (`acceptFollowsLabel`, `acceptFollowsNone`, `acceptFollowsReason`). `openConfirmation` takes `acceptFollows` and `acceptVerb` for the same in a confirmation.',
                markup: `
<div class="kp-field">
<div class="kp-quantity" id="doc-accept-quantity" data-kp-quantity data-kp-quantity-min="0" data-kp-quantity-max="50" data-kp-quantity-unit="boxes" data-kp-quantity-unit-one="box" data-kp-quantity-label="Boxes to add">
<input class="kp-quantity__input" value="3" />
</div>
</div>
<button type="button" class="kp-button kp-button--primary" data-kp-accept-follows="doc-accept-quantity" data-kp-accept-verb="Add">Add 3 boxes</button>
`,
                script: `
import { attachQuantities } from '@kp-soft/themes/js/quantity';
import { attachAcceptFollows } from '@kp-soft/themes/js/accept-follows';

const field = document.getElementById('doc-accept-quantity').parentElement.parentElement;
attachQuantities(field);
attachAcceptFollows(field);
`,
            },
        ],
        variants: [
            { name: 'data-kp-quantity-fill', what: 'The number track takes the rest of the cell, the buttons keep their size: steppers in a column end on one edge. The unit keeps its longest form’s width and never wraps inside a word; the number shrinks first, to a least width (a knob). `="false"` turns it off.' },
            { name: 'data-kp-accept-follows', what: 'On a button: the id of the quantity whose amount and unit its words follow (“Add 3 boxes”). At an amount that makes no sense it is disabled and a line under the quantity says why (`.kp-accept-reason`). `attachAcceptFollows(scope)` in js/accept-follows.js wires it; js/auto.js does so on its own.' },
            { name: 'data-kp-accept-verb', what: 'What the button does, “Add” (default: the dictionary’s `acceptVerb`).' },
            { name: 'data-kp-accept-min', what: 'The least amount that makes sense (default: anything above zero); under it the button is off with its reason.' },
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
