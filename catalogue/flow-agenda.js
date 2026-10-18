// The Agenda's flow panel (kit-flow-1018): the three options of the review flow and the "Tonight" entry. It draws into
// the slot `[data-flow-slot]`, publishes the Agenda's open parts for the part pages (flow.js) and starts a run. The
// Agenda hands it the open parts on every render; it reads nothing of the verdicts itself.
import { THEMES } from '../js/theme-registry.js';
import { endAll, loadStyle, onOptions, options, publishAgenda, setOption, startRun } from '../research/_review/flow.js';

const slot = document.querySelector('[data-flow-slot]');
/** @type {import('../research/_review/flow.js').Entry[]} */
let parts = [];
let reading = true;

/** @type {HTMLElement | null} */
let tonight = null;

if (slot) {
    loadStyle();
    // The Agenda is where every run and chain ends.
    endAll();
    slot.innerHTML = `
        <details class="kf-panel">
            <summary class="agenda__fold-summary">Review flow options</summary>
            <p class="cat-intro">Per viewer, kept in this browser. Verdicts and the journal are never touched by these.</p>
            <div class="kf-panel__grid">
                <div class="kp-field">
                    <label class="kp-field__label" for="kf-after">After the last open step of a part</label>
                    <select class="kp-field__input" id="kf-after" data-kf-after>
                        <option value="agenda">Back to the Agenda</option>
                        <option value="next">On to the next part</option>
                    </select>
                </div>
                <div class="kp-field kp-field--check">
                    <input class="kp-field__check" type="checkbox" id="kf-tonight" data-kf-tonight-on />
                    <label class="kp-field__label" for="kf-tonight">Tonight playlist: one entry that walks every open part</label>
                </div>
                <div class="kp-field">
                    <label class="kp-field__label" for="kf-order">Tonight order</label>
                    <select class="kp-field__input" id="kf-order" data-kf-order>
                        <option value="part">By part</option>
                        <option value="theme">By theme</option>
                    </select>
                </div>
                <div class="kp-field kp-field--check">
                    <input class="kp-field__check" type="checkbox" id="kf-chips" data-kf-chips />
                    <label class="kp-field__label" for="kf-chips">Reason chips under "Not approved" (keys 1 to 6)</label>
                </div>
            </div>
        </details>
        <div class="kf-panel__tonight" data-kf-tonight hidden>
            <p data-kf-tonight-text></p>
            <button type="button" class="kp-button kp-button--primary" data-kf-tonight-start>Start Tonight</button>
        </div>`;
    tonight = slot.querySelector('[data-kf-tonight]');
    const $ = (/** @type {string} */ s) => /** @type {any} */ (slot.querySelector(s));
    $('[data-kf-after]').addEventListener('change', (/** @type {any} */ e) => setOption('after', e.target.value));
    $('[data-kf-order]').addEventListener('change', (/** @type {any} */ e) => setOption('order', e.target.value));
    $('[data-kf-tonight-on]').addEventListener('change', (/** @type {any} */ e) => setOption('tonight', e.target.checked));
    $('[data-kf-chips]').addEventListener('change', (/** @type {any} */ e) => setOption('chips', e.target.checked));
    $('[data-kf-tonight-start]').addEventListener('click', () => {
        const href = startRun(
            parts,
            options().order,
            THEMES.map((t) => t.name),
        );
        if (href) location.assign(href);
    });
    onOptions(paint);
    paint();
}

function paint() {
    if (!slot || !tonight) return;
    const o = options();
    const $ = (/** @type {string} */ s) => /** @type {any} */ (slot.querySelector(s));
    $('[data-kf-after]').value = o.after;
    $('[data-kf-order]').value = o.order;
    $('[data-kf-order]').disabled = !o.tonight;
    $('[data-kf-tonight-on]').checked = o.tonight;
    $('[data-kf-chips]').checked = o.chips;
    tonight.hidden = !o.tonight;
    const visits = o.order === 'theme' ? parts.reduce((n, p) => n + p.themes.length, 0) : parts.length;
    const text = reading
        ? 'Reading what waits…'
        : parts.length
          ? `Tonight walks ${parts.length} open ${parts.length === 1 ? 'part' : 'parts'} ${o.order === 'theme' ? `in ${visits} theme visits, theme by theme` : 'in Agenda order'}. Each page keeps its own round and verdicts; Esc goes back here.`
          : 'Nothing waits, so there is nothing to walk tonight.';
    $('[data-kf-tonight-text]').textContent = text;
    $('[data-kf-tonight-start]').disabled = reading || !parts.length;
}

/**
 * The Agenda's render hands over what waits: the demos, in order, as `{ id, label, href, themes }` (themes with a pair
 * still open). Parts still being read are left out and `reading` says so. @param {import('../research/_review/flow.js').Entry[]} entries
 * @param {boolean} stillReading
 */
export function updateFlow(entries, stillReading) {
    parts = entries;
    reading = stillReading;
    // A list still being read must not shrink what the part pages know: publish only a complete one.
    if (!stillReading) publishAgenda(entries);
    paint();
}
