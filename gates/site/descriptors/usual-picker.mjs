// Page descriptor for the "usual-picker" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const usualPickerDescriptor = {
        id: 'usual-picker',
        title: 'Picker with the usual on top',
        group: 'Forms',
        classes: ['kp-usual'],
        exports: [],
        aliases: ['hint', 'order', 'pinned', 'all', 'multiple', 'preselect', 'not-today', 'add', 'near', 'group', 'more', 'band', 'rest', 'panel', 'synth', 'kind'],
        intro: 'The combobox with the choices a person uses most standing first in a band, the rest alphabetical beneath, and a guard against a near-duplicate when a new name is typed. The band is given by the application and changes slowly; it is never re-sorted per tap. Every behaviour is an option with a default and can be switched at run time: the usual choices lead while typing (or step aside), a near name asks (or selects the closest, or is off), the full list sits behind “Show all N” (or is fully shown). “Show all 38” keeps a phone screen short with the exact number on the control; typing a name identical to an existing one selects it, a near one offers “Did you mean Hoofdpijn?” and always “Add ‘hoofdpjn’ as new”, with Undo. js/usual-picker.js (`attachUsualPickers`, `usualPicker`, `setUsual`, `setUsualState`, `usualNotToday`, `nearNames`, `similarity`) stands on the combobox, which it attaches itself.',
        whenToUse: 'A choice from a long list where the same few are picked again and again (symptoms, meals, strategies). For a short fixed list use radio buttons or the segmented control; for a list with no habit use the plain combobox.',
        examples: [
            {
                title: 'Symptoms with the usual on top',
                why: 'The band is `data-kp-usual`; `data-kp-add="inline"` lets a new name be added at the point of use; `data-kp-multiple` makes it a tag input.',
                markup: `
<div class="kp-combobox" data-kp-combobox data-kp-usual='["headache","fatigue"]' data-kp-add="inline" data-kp-pinned='[{"value":"none","label":"Nothing to log"}]'>
<input class="kp-combobox__input" type="text" role="combobox" aria-expanded="false" aria-controls="doc-usual-list" aria-label="Symptom" />
<ul class="kp-combobox__list" id="doc-usual-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="fatigue">Fatigue</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="headache">Headache</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="nausea">Nausea</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
`,
            },
            {
                title: 'The check under the field: Had it, Not today, and the guard',
                why: 'A usual choice is something logged nearly every day, so “it did not happen today” is an answer of its own, different from “not filled in yet”. `data-kp-not-today` (a bare attribute is `rows`) gives the usual choices their own check under the field: a heading, one line saying what Not today means, and one row per choice with the segmented pair Had it / Not today (neither pressed: not answered). Had it is the same as picking the item, Not today takes its tag away; the check and the tags are one state. `data-kp-not-today-label` words the heading. Try the guard: typing “Fatigu” puts “Did you mean Fatigue?” first, Enter lights it and a second Enter takes it; a name already picked says so in the list and lights its tag; an added name is announced under the field with Undo.',
                markup: `
<div class="kp-combobox" data-kp-combobox id="doc-usual-check" data-kp-usual='["headache","fatigue","nausea","neck"]' data-kp-multiple data-kp-add="inline" data-kp-not-today data-kp-not-today-label="Your usual today" data-kp-hint="Last time you wrote: tired and a stiff neck" data-kp-pinned='[{"value":"none","label":"Nothing to log"}]'>
<label class="kp-field__label" for="doc-usual-check-input">Symptoms today</label>
<div data-kp-tag-list hidden></div>
<input class="kp-combobox__input kp-field__input" id="doc-usual-check-input" type="text" role="combobox" aria-expanded="false" aria-controls="doc-usual-check-list" autocomplete="off" />
<ul class="kp-combobox__list" id="doc-usual-check-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="headache">Headache</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="fatigue">Fatigue</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="nausea">Nausea</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="dizziness">Dizziness</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="neck">Neck pain</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="back">Back pain</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="stomach">Stomach ache</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="cramps">Cramps</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="anxiety">Anxiety</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="brainfog">Brain fog</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="cough">Cough</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="chills">Chills</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="rash">Rash</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="insomnia">Insomnia</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
<pre class="kp-code-block" id="doc-usual-check-log" aria-live="polite">Pick, add or press Not today.</pre>
`,
                script: `
import { USUAL_ADD_EVENT, USUAL_NOT_TODAY_EVENT, USUAL_PICK_EVENT, usualNotToday } from '@kp-soft/themes/js/usual-picker';

const picker = document.getElementById('doc-usual-check');
const log = document.getElementById('doc-usual-check-log');
const say = (name, detail) => (log.textContent = name + ' ' + JSON.stringify(detail) + '\\nNot today: ' + JSON.stringify(usualNotToday(picker)));
picker.addEventListener(USUAL_PICK_EVENT, (event) => say(USUAL_PICK_EVENT, event.detail));
picker.addEventListener(USUAL_NOT_TODAY_EVENT, (event) => say(USUAL_NOT_TODAY_EVENT, event.detail));
picker.addEventListener(USUAL_ADD_EVENT, (event) => say(USUAL_ADD_EVENT, { label: event.detail.label, nearTo: event.detail.nearTo }));
`,
            },
            {
                title: 'The same check as three-way chips, and the Undo as a toast',
                why: '`data-kp-not-today="chips"` draws the check as one row of the package’s three-way chips: one press is had it (a tick), a second is not today (a cross, struck through), a third clears. `data-kp-usual-undo="toast"` moves the Undo after an added name from the line under the field to the Undo toast; `field` is the default. `off` takes the check away, so the picker is only a picker.',
                markup: `
<div class="kp-combobox" data-kp-combobox id="doc-usual-chips" data-kp-usual='["headache","fatigue","nausea","neck"]' data-kp-multiple data-kp-add="inline" data-kp-not-today="chips" data-kp-usual-undo="toast" data-kp-pinned='[{"value":"none","label":"Nothing to log"}]'>
<label class="kp-field__label" for="doc-usual-chips-input">Symptoms today (chips)</label>
<div data-kp-tag-list hidden></div>
<input class="kp-combobox__input kp-field__input" id="doc-usual-chips-input" type="text" role="combobox" aria-expanded="false" aria-controls="doc-usual-chips-list" autocomplete="off" />
<ul class="kp-combobox__list" id="doc-usual-chips-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="headache">Headache</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="fatigue">Fatigue</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="nausea">Nausea</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="dizziness">Dizziness</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="neck">Neck pain</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="back">Back pain</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="stomach">Stomach ache</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="cramps">Cramps</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="anxiety">Anxiety</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="brainfog">Brain fog</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="cough">Cough</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="chills">Chills</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="rash">Rash</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="insomnia">Insomnia</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-usual and data-kp-usual-source', what: 'The band: a comma list, a JSON array, or `{ value, uses }` with the source `counts` (ranked by uses, ties alphabetical; `given` is the default).' },
            { name: 'data-kp-usual-max, data-kp-usual-label and data-kp-usual-while-typing', what: 'The band holds 1 to 7 (5); its heading (“Usual”); `first` (matching usual items still lead while typing, the default) or `hide`.' },
            { name: 'data-kp-order', what: '`alphabetical` (the default) or `given` for the list under the band.' },
            { name: 'data-kp-pinned', what: 'JSON `[{ "value", "label" }]`: “Nothing to log” and “Not sure” stand first and are never usual.' },
            { name: 'data-kp-all', what: '`open` or `fold` (the default for more than 12 items): the band and “Show all 38”.' },
            { name: 'data-kp-multiple and data-kp-preselect', what: 'Tag mode; `usual` pre-ticks the band (`none` is the default: a stock picker never answers for a person).' },
            { name: 'data-kp-not-today and data-kp-not-today-label', what: 'The usual choices’ own check under the field: `rows` (the default; a bare attribute is rows: one line per usual choice with the segmented pair “Had it” / “Not today”), `chips` (the three-way chips) or `off`. The tags carry no Not today button; the check is where it is answered, distinct from unset (`usualNotToday(el)`). The label words the check’s heading (“Your usual today”).' },
            { name: 'data-kp-usual-undo', what: '`field` (the default: “Added ‘hoofdpjn’ as new” with Undo under the field) or `toast` (the Undo toast).' },
            { name: 'data-kp-add, data-kp-near, data-kp-near-threshold and data-kp-near-max', what: '`inline` adds at the point of use (`off`); `ask`, `select` or `off` for the near-match guard; similarity from 0.5 to 1 (0.8); up to 5 names (3).' },
            { name: 'data-kp-reason', what: 'On an option: it cannot be picked, and the sentence is written under its label (and is its description for a screen reader).' },
            { name: 'data-kp-hint, data-kp-remember and data-kp-undo-ms', what: 'The app’s line under the input once something is chosen; the folded list is remembered per picker; the Undo window after an add (6000).' },
            { name: 'data-kp-state', what: '`loading` (the busy card in the place of the list), `empty` (a plate, with Add where adding is on) or `error` (a plate with Retry, `kp-usual-retry`).' },
            { name: 'kp-usual-pick, kp-usual-add and kp-usual-not-today', what: '`{ value, from: usual | all | pinned | typed }`; cancelable `{ label, nearTo }` (the app keeps the vocabulary and may refuse); `{ value, on }`.' },
            { name: '.kp-usual__check and its parts', what: 'The check: `__check-title` and `__check-what` (the heading and the one line that says what Not today means), `__check-rows` with a `__check-name` and a `__check-pair` (the segmented pair) per usual choice, or `__check-chips` for the three-way look (`.kp-usual__check--rows` or `--chips` on the check). Made by the module.' },
            { name: '.kp-usual__note, __note-text and __undo', what: 'The line under the field after an add (“Added ‘hoofdpjn’ as new”) and the Undo in it; Undo takes the name out again and says so.' },
            { name: '.kp-usual__already and .kp-tag[data-kp-usual-flash]', what: 'The row of the list that says a name is already picked, and the tag it lights for about a second so nothing typed is answered by silence.' },
            { name: 'segmented words', what: 'The three-way chips read `data-kp-segmented-words` on their group (`{ include, exclude, any }`), so the check’s own words, “had it”, “not today”, “not answered”, are spoken by the chips without a second dictionary.' },
            { name: 'usualAlreadyPicked and the other `usual…` strings', what: 'Every word the picker adds is in the dictionary: `usualAlreadyPicked`, `usualPicked`, `usualTookClosest`, `usualAsk`, `usualAddedNote`, `usualUndo`, `usualUndoName`, `usualAddUndone`, `usualCheckTitle`, `usualCheckWhat`, `usualCheckWhatChips`, `usualHadIt`, `usualHadItWord`, `usualUnanswered` and `usualUnansweredWord`.' },
            { name: 'normaliseName, similarity and nearNames', what: 'The guard on its own: `normaliseName(text)` ignores case, accents and spacing, `similarity(a, b)` is 0 to 1, and `nearNames(typed, names, threshold, max)` lists the close ones, also by the start of a name (“Fatigu”).' },
            { name: 'combobox handle extend(hook)', what: 'How this layer stands on the combobox: `combobox(el).extend(hook)` lets a layer decide which options show, what the status line says and what a choice does. One layer per combobox; `null` takes it off.' },
            { name: 'marks the module writes', what: '`data-kp-usual-ready`, `data-kp-band`, `data-kp-rest`, `data-kp-group` (a heading), `data-kp-more`, `data-kp-near-value`, `data-kp-panel`, `data-kp-synth` (a row the module added), `data-kp-usual-add-button` and `data-kp-usual-retry`.' },
        ],
        accessibility: [
            'Built in — the combobox’s listbox with virtual focus; the status line says “5 usual, 33 more” and, after an add, “Hoofdpijn added”; options are 48 px and their words wrap.',
            'Built in — Alt U jumps to the first usual choice while the field is empty (a bare `u` would take the first letter of a name); it is on the `?` sheet. No digit key is bound.',
            'Yours — keep the vocabulary: answer `kp-usual-add` (cancel it to refuse) and merge duplicates in your own data.',
        ],
    };
