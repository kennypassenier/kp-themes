// Step wizard, framework-free [TH48].
//
// A multi-step form with a progress indicator that says where you are and
// what is still coming. The superstructure on TH38, and it borrows that
// module's validation rather than repeating it: a step that will not
// validate does not advance.
//
//   <div class="kp-wizard" data-kp-wizard>
//     <ol class="kp-wizard__steps" data-kp-wizard-steps>
//       <li data-kp-step-label>Gegevens</li>
//       <li data-kp-step-label>Controle</li>
//     </ol>
//     <section data-kp-step>…</section>
//     <section data-kp-step hidden>…</section>
//     <div class="kp-wizard__actions">
//       <button type="button" data-kp-wizard-back>Terug</button>
//       <button type="button" data-kp-wizard-next>Volgende</button>
//     </div>
//   </div>
//
// The indicator is an ordered list, not a row of dots: the steps have
// names and a number, and "stap 2 van 4" is what someone needs to hear.
// `aria-current="step"` marks where you are, which is the attribute that
// exists for exactly this and is almost never used.

import { getStrings } from './strings.js';
const WIZARD = '[data-kp-wizard]';

/** Fired when the step changes. A contract value [TH26]. */
export const STEP_EVENT = 'kp-wizard-step';

/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachWizards(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(WIZARD)) {
        const wizard = /** @type {HTMLElement} */ (element);
        if (wizard.dataset.kpWizardAttached !== undefined) continue;
        wizard.dataset.kpWizardAttached = '';

        const steps = /** @type {HTMLElement[]} */ ([...wizard.querySelectorAll('[data-kp-step]')]);
        const labels = /** @type {HTMLElement[]} */ ([...wizard.querySelectorAll('[data-kp-step-label]')]);
        const back = /** @type {HTMLButtonElement | null} */ (wizard.querySelector('[data-kp-wizard-back]'));
        const next = /** @type {HTMLButtonElement | null} */ (wizard.querySelector('[data-kp-wizard-next]'));
        const status = /** @type {HTMLElement | null} */ (wizard.querySelector('[data-kp-wizard-status]'));
        let at = 0;

        const show = () => {
            steps.forEach((step, i) => {
                step.hidden = i !== at;
            });
            labels.forEach((label, i) => {
                // Three states, and each is named rather than only
                // coloured: done, current, still to come.
                label.dataset.state = i < at ? 'done' : i === at ? 'current' : 'todo';
                if (i === at) label.setAttribute('aria-current', 'step');
                else label.removeAttribute('aria-current');
            });
            if (back !== null) back.disabled = at === 0;
            const s = getStrings();
            if (next !== null) next.textContent = at === steps.length - 1 ? (next.dataset.kpFinish ?? s.finish) : (next.dataset.kpNext ?? s.next);
            if (status !== null) status.textContent = s.wizardStep(at + 1, steps.length);
            // Focus moves into the new step, or a keyboard user presses
            // Next and stays where they were with no idea anything moved.
            steps[at]?.setAttribute('tabindex', '-1');
            steps[at]?.focus();
            wizard.dispatchEvent(new CustomEvent(STEP_EVENT, { bubbles: true, detail: { step: at, of: steps.length } }));
        };

        /** @returns {boolean} whether the current step's fields are all valid */
        const stepIsValid = () => {
            const current = steps[at];
            if (current === undefined) return true;
            const fields = /** @type {HTMLInputElement[]} */ ([...current.querySelectorAll('input, select, textarea')]);
            // reportValidity, not checkValidity: the form module's own
            // handler shows the message, and this is the click that has to
            // stop rather than the submit.
            return fields.every((field) => {
                if (field.checkValidity()) return true;
                field.dispatchEvent(new Event('blur'));
                field.focus();
                return false;
            });
        };

        const onNext = () => {
            if (at >= steps.length - 1) return;
            if (!stepIsValid()) return;
            at += 1;
            show();
        };
        const onBack = () => {
            if (at === 0) return;
            at -= 1;
            show();
        };

        next?.addEventListener('click', onNext);
        back?.addEventListener('click', onBack);
        show();

        cleanups.push(() => {
            next?.removeEventListener('click', onNext);
            back?.removeEventListener('click', onBack);
            delete wizard.dataset.kpWizardAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
