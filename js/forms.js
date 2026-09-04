// Forms, framework-free [TH38].
//
// The browser validates; this makes what it found reachable. Constraint
// validation already knows a field is invalid and why — what it does not
// do is put the message where a screen reader will read it, gather the
// errors into a summary, or move focus to the first one. That is the work
// here, and it is the work every hand-written form skips.
//
//   <form class="kp-form" data-kp-form novalidate>
//     <div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
//     <div class="kp-field">
//       <label class="kp-field__label" for="naam">Naam <span class="kp-field__required">verplicht</span></label>
//       <input class="kp-field__input" id="naam" name="naam" required />
//       <span class="kp-field__error" data-kp-field-error hidden></span>
//     </div>
//     <button class="kp-button kp-button--primary" data-kp-submit>Opslaan</button>
//   </form>
//
// `novalidate` on purpose: the browser's own bubbles disappear on the next
// keystroke, show one error at a time, and cannot be styled or read back.
// Turning them off and using `checkValidity()` keeps the validation and
// loses the popup.
//
// Three rules this enforces, each because leaving it to care is how it
// gets skipped:
//
//   1. A message is announced, not only coloured. `aria-invalid` and
//      `aria-describedby` point at the text.
//   2. The summary is focused, not just rendered. A message that appears
//      above the fold is invisible to someone whose focus is at the
//      bottom of a long form.
//   3. Validation reports on blur, never on every keystroke. Telling
//      someone their email is invalid while they type the third character
//      is technically true and practically hostile.

import { getStrings } from './strings.js';
const FORM = '[data-kp-form]';
const SUMMARY = '[data-kp-form-summary]';
const FIELD_ERROR = '[data-kp-field-error]';
const SUBMIT = '[data-kp-submit]';

/**
 * Fired when a form passes validation. A contract value [TH26]: the
 * detail carries the FormData and, since KT6, a `done()` that ends the
 * busy state. A consumer may call it, or return nothing and dispatch
 * `DONE_EVENT` on the form themselves — same effect.
 */
export const VALID_EVENT = 'kp-form-valid';

/**
 * Ends the busy state the submit button took on `VALID_EVENT` [KT6].
 * Dispatched on the form by `detail.done()`, or by the consumer directly.
 * Nothing dispatches it on its own: a consumer who navigates away on
 * submit must not get back a button that double-sends.
 */
export const DONE_EVENT = 'kp-form-done';

/** What the browser's own message becomes when the field says nothing better. */
const fallback = () => getStrings().formInvalid;

/**
 * The name a summary line uses for a field: its label, its
 * `aria-label`, or as a last resort its name attribute.
 *
 * @param {HTMLElement} field
 */
function nameOf(field) {
    // A radio's own label names one option; the legend names the
    // question, which is what somebody left unanswered.
    if (field.getAttribute('type') === 'radio') {
        const legend = field.closest('fieldset')?.querySelector('legend')?.textContent?.trim();
        if (legend !== undefined && legend !== '') return legend;
    }
    const id = field.getAttribute('id');
    const label = id === null ? null : field.ownerDocument.querySelector(`label[for="${CSS.escape(id)}"]`);
    const text = label?.textContent?.trim();
    if (text !== undefined && text !== '') return text;
    return field.getAttribute('aria-label') ?? field.getAttribute('name') ?? getStrings().fieldFallbackName;
}

/**
 * What carries the state for this control.
 *
 * For everything except a radio that is the control itself. A radio
 * belongs to a group, and `aria-invalid` on one button says the wrong
 * thing about the other three, so the group carries it.
 *
 * @param {HTMLElement} field
 * @returns {HTMLElement}
 */
function stateHolder(field) {
    if (field.getAttribute('type') !== 'radio') return field;
    return /** @type {HTMLElement | null} */ (field.closest('[role="radiogroup"], fieldset')) ?? field;
}

/**
 * Attach every form under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachForms(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(FORM)) {
        const form = element;
        if (!(form instanceof HTMLFormElement) || form.dataset.kpFormAttached !== undefined) continue;
        form.dataset.kpFormAttached = '';
        // The browser's bubbles are replaced, not suppressed: checkValidity()
        // below still uses the same constraints.
        form.noValidate = true;

        const summary = /** @type {HTMLElement | null} */ (form.querySelector(SUMMARY));

        /** @returns {HTMLElement[]} */
        const fields = () =>
            /** @type {HTMLElement[]} */ (
                [...form.elements].filter((el) => el instanceof HTMLElement && 'checkValidity' in el && el.getAttribute('type') !== 'submit')
            );

        /** @param {HTMLElement} field @param {string} message */
        const showError = (field, message) => {
            const holder = /** @type {HTMLElement | null} */ (field.closest('.kp-field')?.querySelector(FIELD_ERROR) ?? null);
            const marked = stateHolder(field);
            marked.setAttribute('aria-invalid', 'true');
            field.closest('.kp-field')?.classList.add('kp-field--invalid');
            if (holder === null) return;
            if (holder.id === '') holder.id = `${field.getAttribute('id') ?? Math.random().toString(36).slice(2)}-error`;
            holder.textContent = message;
            holder.hidden = false;
            // Appended rather than replaced: a field with help text keeps
            // it, and overwriting describedby is how help disappears the
            // first time someone gets something wrong.
            const described = (marked.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
            if (!described.includes(holder.id)) marked.setAttribute('aria-describedby', [...described, holder.id].join(' '));
        };

        /** @param {HTMLElement} field */
        const clearError = (field) => {
            const holder = /** @type {HTMLElement | null} */ (field.closest('.kp-field')?.querySelector(FIELD_ERROR) ?? null);
            const marked = stateHolder(field);
            marked.removeAttribute('aria-invalid');
            field.closest('.kp-field')?.classList.remove('kp-field--invalid');
            if (holder === null) return;
            holder.hidden = true;
            holder.textContent = '';
            const described = (marked.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((id) => id !== holder.id);
            if (described.length > 0) marked.setAttribute('aria-describedby', described.join(' '));
            else marked.removeAttribute('aria-describedby');
        };

        /** @param {HTMLElement} field @returns {boolean} */
        const validate = (field) => {
            const control = /** @type {HTMLInputElement} */ (field);
            if (control.checkValidity()) {
                clearError(field);
                return true;
            }
            showError(field, control.validationMessage || fallback());
            return false;
        };

        /** @param {Event} event */
        const onBlur = (event) => {
            const field = /** @type {HTMLElement} */ (event.target);
            if (!(field instanceof HTMLElement) || !('checkValidity' in field)) return;
            // Only once someone has left the field. Reporting while they
            // type the third character of an email address is technically
            // true and practically hostile.
            validate(field);
        };

        /** @param {SubmitEvent} event */
        const onSubmit = (event) => {
            // One line per group, not per radio button: four radios in one
            // group are one thing somebody forgot to answer. Validated
            // first and deduplicated after, so every field is still
            // marked.
            /** @type {Set<string>} */
            const groups = new Set();
            const bad = fields()
                .filter((field) => !validate(field))
                .filter((field) => {
                    if (field.getAttribute('type') !== 'radio') return true;
                    const name = field.getAttribute('name') ?? '';
                    if (groups.has(name)) return false;
                    groups.add(name);
                    return true;
                });
            if (bad.length === 0) {
                if (summary !== null) summary.hidden = true;
                const done = () => form.dispatchEvent(new CustomEvent(DONE_EVENT, { bubbles: true }));
                form.dispatchEvent(new CustomEvent(VALID_EVENT, { bubbles: true, detail: { data: new FormData(form), done } }));
                return;
            }
            event.preventDefault();
            if (summary === null) {
                bad[0]?.focus();
                return;
            }
            summary.textContent = '';
            const heading = document.createElement('p');
            heading.className = 'kp-form__summary-title';
            const s = getStrings();
            heading.textContent = bad.length === 1 ? s.formSummaryOne : s.formSummaryMany(bad.length);
            const list = document.createElement('ul');
            for (const field of bad) {
                const item = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${field.getAttribute('id') ?? ''}`;
                link.textContent = nameOf(field);
                link.addEventListener('click', (click) => {
                    click.preventDefault();
                    field.focus();
                });
                item.append(link);
                list.append(item);
            }
            summary.append(heading, list);
            summary.hidden = false;
            // Focused, not merely rendered: a message above the fold is
            // invisible to someone whose focus is at the bottom of a long
            // form, which is exactly where the submit button is.
            summary.focus();
        };

        for (const field of fields()) field.addEventListener('blur', onBlur);
        form.addEventListener('submit', onSubmit);

        cleanups.push(() => {
            for (const field of fields()) field.removeEventListener('blur', onBlur);
            form.removeEventListener('submit', onSubmit);
            delete form.dataset.kpFormAttached;
        });
    }

    // A submit button that says it is working. Without it, a slow save
    // looks like a click that missed, and the second click sends the form
    // twice.
    for (const element of root.querySelectorAll(SUBMIT)) {
        const button = /** @type {HTMLButtonElement} */ (element);
        if (button.dataset.kpSubmitAttached !== undefined) continue;
        button.dataset.kpSubmitAttached = '';
        const form = button.closest('form');
        const busyText = button.dataset.kpBusy ?? getStrings().busy;
        const idleText = button.textContent ?? '';
        const onValid = () => {
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            button.textContent = busyText;
        };
        // The way back [KT6]. The first version restored the label only
        // on detach, so a failed save left the button dead for the life
        // of the page.
        const onDone = () => {
            button.disabled = false;
            button.removeAttribute('aria-busy');
            button.textContent = idleText;
        };
        form?.addEventListener(VALID_EVENT, onValid);
        form?.addEventListener(DONE_EVENT, onDone);
        cleanups.push(() => {
            form?.removeEventListener(VALID_EVENT, onValid);
            form?.removeEventListener(DONE_EVENT, onDone);
            onDone();
            delete button.dataset.kpSubmitAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachForms());
    else attachForms();
}
