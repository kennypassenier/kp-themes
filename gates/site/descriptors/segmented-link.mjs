// The segmented page's example of chips tied to a combobox [mc-1030, mc-r2], kept apart so segmented.mjs stays one page long.

/** @type {import('./types.mjs').Example} */
export const linkedChipsExample = {
    title: 'Chips tied to a field: the most used as chips, the field for the rest',
    why: '`data-kp-segmented-for` names a combobox, and the chips and the field then hold the same values both ways: choosing in the field lights the chip, a press on a chip puts its value in the field. `data-kp-segmented-top="4"` makes the chips from the field’s four most used options (`data-kp-uses` on each option, the list’s order otherwise), and the field, still there for the other five, says “Search all 9”. `all` makes every choice a chip, so the Form field is left out altogether; `data-kp-segmented-field="always"` would keep it. Form is `single-or-none`: one form or none, and a press on the chosen chip lets it go.',
    markup: `
<div class="kp-formgrid" aria-label="A new medicine">
<div class="kp-formgrid__row">
<label class="kp-formgrid__label" for="doc-seg-form-input">Form</label>
<div class="kp-formgrid__control">
<div class="kp-combobox" id="doc-seg-form" data-kp-combobox>
<input class="kp-field__input kp-combobox__input" id="doc-seg-form-input" role="combobox" type="text" aria-expanded="false" aria-controls="doc-seg-form-list" autocomplete="off" />
<ul class="kp-combobox__list" id="doc-seg-form-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="tablet" data-kp-uses="12">Tablet</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="capsule" data-kp-uses="7">Capsule</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="syrup" data-kp-uses="3">Syrup</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="drops" data-kp-uses="4">Drops</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="cream" data-kp-uses="5">Cream</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
<div class="kp-segmented kp-segmented--chips" id="doc-seg-form-chips" data-kp-segmented="single-or-none" data-kp-segmented-for="doc-seg-form" data-kp-segmented-top="all" role="radiogroup" aria-label="Form"></div>
</div>
<p class="kp-formgrid__value">or none</p>
<div class="kp-formgrid__actions"></div>
</div>
<div class="kp-formgrid__row">
<label class="kp-formgrid__label" for="doc-seg-sym-input">Symptoms</label>
<div class="kp-formgrid__control">
<div class="kp-combobox" id="doc-seg-sym" data-kp-combobox data-kp-tags>
<div data-kp-tag-list></div><input class="kp-field__input kp-combobox__input" id="doc-seg-sym-input" role="combobox" type="text" aria-expanded="false" aria-controls="doc-seg-sym-list" autocomplete="off" />
<ul class="kp-combobox__list" id="doc-seg-sym-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="headache" data-kp-uses="14">Headache</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="fever" data-kp-uses="11">Fever</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="hay-fever" data-kp-uses="9">Hay fever</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="sore-throat" data-kp-uses="8">Sore throat</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="cough" data-kp-uses="7">Cough</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="nausea" data-kp-uses="5">Nausea</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="back-pain" data-kp-uses="4">Back pain</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="dizziness" data-kp-uses="3">Dizziness</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="rash" data-kp-uses="2">Rash</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
<div class="kp-segmented kp-segmented--chips" id="doc-seg-sym-chips" data-kp-segmented="multi" data-kp-segmented-for="doc-seg-sym" data-kp-segmented-top="4" role="group" aria-label="Common symptoms"></div>
</div>
<p class="kp-formgrid__value">pick or type</p>
<div class="kp-formgrid__actions"></div>
</div>
</div>
<p class="kp-text-muted" id="doc-seg-link-said" role="status">Form: none chosen · Symptoms: none</p>
`,
    script: `
import { combobox } from '@kp-soft/themes/js/combobox';
import { getSegmentedValues } from '@kp-soft/themes/js/segmented';

const said = document.getElementById('doc-seg-link-said');
const report = () => {
    const form = getSegmentedValues(document.getElementById('doc-seg-form-chips'))[0] ?? 'none chosen';
    const symptoms = combobox(document.getElementById('doc-seg-sym'))?.values() ?? [];
    said.textContent = 'Form: ' + form + ' · Symptoms: ' + (symptoms.join(', ') || 'none');
};
document.addEventListener('kp-segmented-change', report);
document.addEventListener('kp-combobox-change', report);
`,
};
