// Page descriptor for the "slider" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const sliderDescriptor = {
        id: 'slider',
        title: 'Slider',
        group: 'Forms',
        classes: ['kp-slider'],
        exports: [],
        aliases: ['default', 'format', 'thumb', 'ticks', 'unit', 'vertical'],
        intro: 'One value, or a range with two thumbs, on the native range input drawn by the package, with the number in a small box beside it that you can type in. Marks, a bubble over the thumb, a unit, a size or duration format and a vertical form are options.',
        whenToUse: 'A number in a range where the exact value matters less than the feel: a temperature, a volume, a price range. For an exact figure only, use a number field.',
        examples: [
            {
                title: 'Temperature',
                why: 'The markup is the empty box; the script builds the track, the thumb and the box from the attributes.',
                markup: `
<div class="kp-slider" data-kp-slider data-kp-min="10" data-kp-max="30" data-kp-step="0.5" data-kp-value="21" data-kp-unit="°C" aria-label="Temperature"></div>
`,
            },
            {
                title: 'A price range with two thumbs',
                why: '`data-kp-slider="range"` takes two values (`data-kp-value="100,300"`) that never cross; `data-kp-min-gap` is the least between them. `data-kp-slider-value="both"` shows the number in the box and in a bubble over the thumb, `data-kp-ticks` draws marks (a `:Label` names one), and `data-kp-name` gives the two inputs the names `price-min` and `price-max` for a form.',
                markup: `
<div class="kp-slider" data-kp-slider="range" data-kp-min="0" data-kp-max="500" data-kp-step="10" data-kp-value="100,300" data-kp-default="100,300" data-kp-min-gap="50" data-kp-unit="€" data-kp-slider-value="both" data-kp-ticks="0,250:Half,500" data-kp-name="price" aria-label="Price"></div>
`,
            },
            {
                title: 'Formats and a vertical slider',
                why: '`data-kp-format` writes the value as a percentage, a size (`bytes`) or a duration (the value is seconds); `data-kp-orientation="vertical"` stands the track up, 10rem high unless `--kp-slider-length` says otherwise.',
                markup: `
<div class="kp-stack">
<div class="kp-slider" data-kp-slider data-kp-min="0" data-kp-max="100" data-kp-value="60" data-kp-format="percent" aria-label="Volume"></div>
<div class="kp-slider" data-kp-slider data-kp-min="0" data-kp-max="3600" data-kp-step="60" data-kp-value="900" data-kp-format="duration" aria-label="Snooze for"></div>
<div class="kp-slider" data-kp-slider data-kp-min="0" data-kp-max="1073741824" data-kp-step="1048576" data-kp-value="268435456" data-kp-format="bytes" aria-label="Upload limit"></div>
<div class="kp-slider" data-kp-slider data-kp-orientation="vertical" data-kp-min="0" data-kp-max="10" data-kp-value="4" data-kp-commit="input" aria-label="Brightness"></div>
</div>
`,
            },
            {
                title: 'Off with a reason, and loading',
                why: '`data-kp-disabled` turns every control off and `data-kp-disabled-reason` is the sentence that says why, shown under the slider. `data-kp-state="loading"` draws the package’s skeleton at the final size of the track and the box, so nothing moves when the value arrives.',
                markup: `
<div class="kp-stack">
<div class="kp-slider" data-kp-slider data-kp-min="10" data-kp-max="30" data-kp-value="21" data-kp-unit="°C" data-kp-disabled data-kp-disabled-reason="The thermostat is on a schedule until 18:00." aria-label="Target temperature"></div>
<div class="kp-slider" data-kp-slider data-kp-min="10" data-kp-max="30" data-kp-value="21" data-kp-unit="°C" data-kp-state="loading" aria-label="Current temperature"></div>
</div>
`,
            },
            {
                title: 'Doing the work on commit, and setting a value from the page',
                why: '`kp-slider-change` carries `{ values, value, thumb, text }` and fires on release; `kp-slider-input` fires on every move and is for drawing, not for sending. `setSliderValues(el, [..])` moves the thumbs and `sliderValues(el)` reads them.',
                markup: `
<div class="kp-stack">
<div class="kp-slider" id="doc-slider-volume" data-kp-slider data-kp-min="0" data-kp-max="100" data-kp-value="30" data-kp-unit="%" aria-label="Speaker volume"></div>
<p class="kp-text-muted" id="doc-slider-log" aria-live="polite">Release the thumb to commit.</p>
<button class="kp-button" type="button" id="doc-slider-reset">Back to 30 %</button>
</div>
`,
                script: `
import { setSliderValues, sliderValues } from '@kp-soft/themes/js/slider';

const box = document.getElementById('doc-slider-volume');
const log = document.getElementById('doc-slider-log');
box.addEventListener('kp-slider-change', (event) => {
    log.textContent = 'Committed ' + event.detail.text + ' (values: ' + sliderValues(box).join(', ') + ')';
});
document.getElementById('doc-slider-reset').addEventListener('click', () => setSliderValues(box, [30]));
`,
            },
        ],
        variants: [
            { name: 'data-kp-slider', what: '`single` (default) or `range`: two thumbs that never cross.' },
            { name: 'data-kp-slider-value', what: '`field` (default), `bubble`, `both` or `none`: how the number is shown.' },
            { name: 'data-kp-format', what: '`number` (default), `percent`, `bytes` or `duration`.' },
            { name: 'data-kp-ticks', what: '`auto` or a list, `0,25,50:Half,100`.' },
            { name: 'data-kp-commit', what: '`change` (default, on release) or `input`.' },
            { name: 'data-kp-orientation', what: '`horizontal` (default) or `vertical`.' },
            { name: 'data-kp-state', what: '`loading` shows the skeleton over track and box.' },
            { name: 'data-kp-min, data-kp-max, data-kp-step', what: 'The range and the step (0, 100 and 1). A typed value is snapped to the step and refused with a line under the slider when it is not in range.' },
            { name: 'data-kp-value / data-kp-default', what: 'The value at first (`20,60` for a range) and the one a double-click on a thumb goes back to.' },
            { name: 'data-kp-unit', what: 'Text after the number (`°C`, `%`, `min`); it is part of `aria-valuetext`.' },
            { name: 'data-kp-min-gap', what: 'On a range: the least distance between the two thumbs; the step by default.' },
            { name: 'data-kp-name', what: 'The inputs’ name for a form; a range uses `name-min` and `name-max`.' },
            { name: 'data-kp-disabled', what: 'Every control is off; with `data-kp-disabled-reason` the sentence that says why is written under the slider.' },
        ],
        accessibility: [
            'Built in — the native range input: arrows, Shift+arrows, Page Up and Down, Home and End, `aria-valuetext` with the unit; the box is a labelled field; a refused value is described by the line under the slider.',
            'Yours — name the slider (`aria-label`) after what it sets, and do the work on `kp-slider-change`, not on every `kp-slider-input`.',
        ],
    };
