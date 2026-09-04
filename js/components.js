// The component contracts, framework-free [L7, DI4, DI10].
//
// Kenny's standing rule 31, and DI10's own wording: drive it from
// attributes rather than per-button code, so a new button gets the
// behaviour by declaring it instead of by someone remembering.
//
// Two contracts are enforced here, both of them the kind that a review
// catches once and then stops catching:
//
//   1. A destructive button must offer an undo or a confirmation
//      (SC 3.3.4 Error Prevention, AA). It is an OR, not an AND.
//   2. A badge or alert carrying a semantic colour must also say what it
//      means in text (DI4). Seven pale plates are one plate to someone
//      who cannot tell the colours apart.
//
// A violation is reported, loudly, and the offending control is disarmed
// rather than left to delete something. It is not thrown: one bad button
// on a dashboard should not take the page down with it.

const VIOLATION_EVENT = 'kp-contract-violation';

/** @typedef {{ rule: string, element: Element, message: string }} Violation */

/**
 * The confirmation obstacle.
 *
 * DI10's evidence, which is not the folklore: "undo beats confirmation"
 * has no controlled study behind it, while confirmations carrying a small
 * obstacle still worked for 44-74% of users after some twenty exposures,
 * against 20% or less for purely visual ones. So the first click does not
 * act — it arms, changes the label to the phrase the consumer chose, and
 * disarms itself again after a few seconds if nothing follows.
 *
 * Configurable rather than hard-coded, because it is an operational knob:
 * a dashboard whose users delete all day wants a longer window than a
 * settings page.
 */
export const CONFIRM_WINDOW_MS = 4000;

/**
 * @param {ParentNode} root
 * @returns {Violation[]}
 */
export function findViolations(root = document) {
    /** @type {Violation[]} */
    const violations = [];

    for (const el of root.querySelectorAll('[data-kp-destructive]')) {
        if (!el.hasAttribute('data-kp-confirm') && !el.hasAttribute('data-kp-undo')) {
            violations.push({
                rule: 'DI10',
                element: el,
                message:
                    'a destructive action must offer an undo (data-kp-undo) or a confirmation (data-kp-confirm="phrase"). ' +
                    'SC 3.3.4 accepts either; it accepts neither of them missing.',
            });
        }
    }

    for (const el of root.querySelectorAll('[data-kp-semantic]')) {
        // Text, or an image with an accessible name. An icon that is
        // aria-hidden carries nothing, which is the usual mistake.
        const text = (el.textContent ?? '').trim();
        const named = el.querySelector('[aria-label], [aria-labelledby], title');
        if (text === '' && named === null) {
            violations.push({
                rule: 'DI4',
                element: el,
                message: 'a control carrying a semantic colour must also say what it means: colour is never the only carrier.',
            });
        }
    }

    return violations;
}

/**
 * Report the violations and disarm what they point at. Returns them, so a
 * test can assert on the list rather than on console output.
 *
 * @param {ParentNode} root
 * @returns {Violation[]}
 */
export function enforceContracts(root = document) {
    const violations = findViolations(root);
    for (const v of violations) {
        v.element.setAttribute('data-kp-contract-error', v.rule);
        if (v.rule === 'DI10' && 'disabled' in v.element) {
            /** @type {HTMLButtonElement} */ (v.element).disabled = true;
        }
        console.error(`[kp-themes ${v.rule}]`, v.message, v.element);
        v.element.dispatchEvent(new CustomEvent(VIOLATION_EVENT, { bubbles: true, detail: v }));
    }
    return violations;
}

/**
 * Arm-then-act on every destructive button that asked for a confirmation.
 *
 * @param {ParentNode} root
 * @param {{ windowMs?: number }} [options]
 * @returns {() => void} detach
 */
export function attachConfirmations(root = document, { windowMs = CONFIRM_WINDOW_MS } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll('[data-kp-confirm]')) {
        const button = /** @type {HTMLButtonElement} */ (el);
        if (button.dataset.kpConfirmAttached === '1') continue;
        button.dataset.kpConfirmAttached = '1';

        const original = button.textContent ?? '';
        const phrase = button.dataset.kpConfirm || 'Bevestigen';
        let armed = false;
        let timer = 0;

        const disarm = () => {
            armed = false;
            button.textContent = original;
            button.removeAttribute('data-kp-armed');
            clearTimeout(timer);
        };

        /** @param {Event} event */
        const onClick = (event) => {
            if (armed) {
                disarm();
                return; // the real handler runs: this click is the deliberate one
            }
            // The first click is the obstacle, so it must not reach
            // anything else — capture and stop, rather than trust that no
            // other listener acts.
            event.preventDefault();
            event.stopImmediatePropagation();
            armed = true;
            button.textContent = phrase;
            button.setAttribute('data-kp-armed', 'true');
            timer = window.setTimeout(disarm, windowMs);
        };

        button.addEventListener('click', onClick, { capture: true });
        button.addEventListener('blur', disarm);
        cleanups.push(() => {
            button.removeEventListener('click', onClick, { capture: true });
            button.removeEventListener('blur', disarm);
            delete button.dataset.kpConfirmAttached;
            disarm();
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

export { VIOLATION_EVENT };

if (typeof document !== 'undefined') {
    const start = () => {
        enforceContracts();
        attachConfirmations();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
}
