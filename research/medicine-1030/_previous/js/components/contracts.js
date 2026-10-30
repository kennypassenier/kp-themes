// Checks the confirmation contracts of a page and attaches its confirmations.
import { getStrings } from '../strings.js';
import { CONFIRM_OWNED, CONFIRM_WINDOW_MS, VIOLATION_EVENT } from './type-confirm.js';
import { openConfirmation } from './confirm-dialog.js';
/** @typedef {import('./type-confirm.js').Rule} Rule */
/** @typedef {import('./type-confirm.js').Violation} Violation */

/**
 * The one-shot lock AR27 is about.
 *
 * After Confirm the click is re-fired on the button, so a consumer
 * listening for an ordinary click needs to change nothing. Re-firing
 * naively does not work, and this was measured before it was decided:
 * the listener that opened the dialog catches the re-fired click and
 * opens it again — `["open", "confirm", "open"] posts: 0` — and re-firing
 * synchronously is worse, because the browser's in-flight-click flag
 * turns it into a silent no-op with no error and no clue.
 *
 * So the handler names the element here, the listener sees it, clears it,
 * and lets that one click through untouched. It is cleared on the tick it
 * is consumed and never on a timer: a lock that outlives its click leaves
 * that button unguarded for the rest of the page, and that failure is
 * invisible until someone deletes the wrong row.
 *
 * @type {Element | null}
 */
let unlocked = null;
/** Markup the consumer excludes from enforcement: `data-kp-contract-ignore`. */
export const EXEMPT = '[data-kp-contract-ignore]';
/**
 * @param {ParentNode} root
 * @param {{ rules?: Rule[], exempt?: string }} [options]
 * @returns {Violation[]}
 */
export function findViolations(root = document, { rules = ['DI10', 'DI4'], exempt = EXEMPT } = {}) {
    /** @type {Violation[]} */
    const violations = [];
    const s = getStrings();

    if (rules.includes('DI10'))
        for (const el of root.querySelectorAll('[data-kp-destructive]')) {
            if (el.matches(exempt)) continue;
            if (!el.hasAttribute('data-kp-confirm') && !el.hasAttribute('data-kp-undo')) {
                violations.push({ rule: 'DI10', element: el, message: s.contractDestructive });
            }
        }

    if (rules.includes('DI4'))
        for (const el of root.querySelectorAll('[data-kp-semantic]')) {
            if (el.matches(exempt)) continue;
            // Text, or an image with an accessible name. An icon that is
            // aria-hidden carries nothing, which is the usual mistake.
            const text = (el.textContent ?? '').trim();
            const named = el.querySelector('[aria-label], [aria-labelledby], title');
            if (text === '' && named === null) {
                violations.push({ rule: 'DI4', element: el, message: s.contractSemantic });
            }
        }

    return violations;
}
/** What enforcement changed on an element, so detach can put it back. */
const changed = new WeakMap();
/**
 * Report the violations and disarm what they point at.
 *
 * Idempotent: calling it again first restores everything it changed
 * before and then looks afresh, so markup completed after the first
 * pass comes back to life. Returns a detach that restores without
 * re-evaluating. The list is also available on the return value, so a
 * test asserts on it rather than on console output.
 *
 * @param {ParentNode} root
 * @param {{ disable?: boolean, rules?: Rule[], exempt?: string, log?: ((message: string, element: Element) => void) | null }} [options]
 * @returns {(() => void) & { violations: Violation[] }}
 */
export function enforceContracts(
    root = document,
    { disable = true, rules, exempt, log = (message, element) => console.error(message, element) } = {},
) {
    // Restore first: a second pass over a repaired page must not carry
    // the marks of the first.
    for (const el of root.querySelectorAll('[data-kp-contract-error]')) restore(el);

    const violations = findViolations(root, { rules, exempt });
    for (const v of violations) {
        /** @type {{ disabled?: boolean }} */
        const before = {};
        if (disable && v.rule === 'DI10' && 'disabled' in v.element) {
            const button = /** @type {HTMLButtonElement} */ (v.element);
            before.disabled = button.disabled;
            button.disabled = true;
        }
        changed.set(v.element, before);
        v.element.setAttribute('data-kp-contract-error', v.rule);
        log?.(`[kp-themes ${v.rule}] ${v.message}`, v.element);
        v.element.dispatchEvent(new CustomEvent(VIOLATION_EVENT, { bubbles: true, detail: v }));
    }

    const detach = () => {
        for (const v of violations) restore(v.element);
    };
    return Object.assign(detach, { violations });
}
/** @param {Element} el */
function restore(el) {
    const before = changed.get(el);
    if (before !== undefined && 'disabled' in el) /** @type {HTMLButtonElement} */ (el).disabled = before.disabled ?? false;
    changed.delete(el);
    el.removeAttribute('data-kp-contract-error');
}
/**
 * Give every destructive button that asked for a confirmation its
 * obstacle [TH107, DI10, AR27, AR29].
 *
 * Default `dialog`: the click is swallowed, a modal `<dialog>` opens
 * carrying the attribute's phrase, Escape and Cancel do nothing, and
 * Confirm re-fires the click behind the one-shot lock above, so the
 * consumer's own handler runs exactly once. `inline` is the arm-then-act
 * of 3.x, kept as a variant rather than deleted; `data-kp-confirm-mode`
 * chooses per element.
 *
 * @param {ParentNode} root
 * @param {{ mode?: 'dialog' | 'inline', windowMs?: number, disarmOnBlur?: boolean, strings?: Partial<import('../strings.js').Strings>, ownedBy?: string, dialogClassName?: string }} [options]
 * @returns {() => void} detach
 */
export function attachConfirmations(
    root = document,
    { mode = 'dialog', windowMs = CONFIRM_WINDOW_MS, disarmOnBlur = true, strings, ownedBy = CONFIRM_OWNED, dialogClassName = '' } = {},
) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll('[data-kp-confirm]')) {
        const button = /** @type {HTMLButtonElement} */ (el);
        // AR29, and it is a defect shipped today rather than a risk being
        // avoided: components/button.jsx writes `data-kp-confirm` too, and
        // js/auto.js runs this over the whole document in kyu, Almanac and
        // chassis alike. Measured in both browsers before the repair: the
        // two channels re-armed each other's button forever and the action
        // never fired at any number of clicks. A consumer who wants this
        // module over a React button anyway passes `ownedBy: ''`.
        if (ownedBy !== '' && button.matches(ownedBy)) continue;
        // Only a control is confirmed. A component that takes `data-kp-confirm` as an option of its own (the passkey
        // list's `dialog` or `type-name`) is not a button: armed as one, every click inside it, Rename too, asked to
        // confirm (chassis-rs, 2026-10-19).
        if (!button.matches('button, a[href], input[type="button"], input[type="submit"], [role="button"]')) continue;
        if (button.dataset.kpConfirmAttached === '1') continue;
        button.dataset.kpConfirmAttached = '1';

        const original = button.textContent ?? '';
        const phrase = button.dataset.kpConfirm || getStrings().confirm;
        const elementMode =
            button.dataset.kpConfirmMode === 'inline' || button.dataset.kpConfirmMode === 'dialog' ? button.dataset.kpConfirmMode : mode;
        // Per element beats per call: one page mixes a two-second window
        // on a list and a ten-second one on the account deletion.
        const window_ = Number(button.dataset.kpConfirmMs) || windowMs;
        let armed = false;
        let timer = 0;
        /** @type {HTMLDialogElement | null} */
        let open = null;

        const disarm = () => {
            armed = false;
            button.textContent = original;
            button.removeAttribute('data-kp-armed');
            clearTimeout(timer);
        };
        const onBlur = () => {
            if (disarmOnBlur) disarm();
        };

        /** @param {Event} event */
        const onDialogClick = (event) => {
            if (unlocked === button) {
                // The re-fired click, let through untouched, exactly once.
                unlocked = null;
                return;
            }
            // The click is the question, not the action, so it must not
            // reach anything else — capture and stop, rather than trust
            // that no other listener acts.
            event.preventDefault();
            event.stopImmediatePropagation();
            if (open?.open) return;
            open = openConfirmation(button, {
                phrase,
                strings,
                className: dialogClassName,
                onAccept: () => {
                    unlocked = button;
                    button.click();
                },
            });
        };

        /** @param {Event} event */
        const onInlineClick = (event) => {
            if (armed) {
                disarm();
                return; // the real handler runs: this click is the deliberate one
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            armed = true;
            button.textContent = phrase;
            button.setAttribute('data-kp-armed', 'true');
            timer = window.setTimeout(disarm, window_);
        };

        const onClick = elementMode === 'inline' ? onInlineClick : onDialogClick;
        button.addEventListener('click', onClick, { capture: true });
        if (elementMode === 'inline') button.addEventListener('blur', onBlur);
        cleanups.push(() => {
            button.removeEventListener('click', onClick, { capture: true });
            if (elementMode === 'inline') button.removeEventListener('blur', onBlur);
            delete button.dataset.kpConfirmAttached;
            // Nothing this module set outlives the detach [KT6]: not the
            // armed label, not an open dialog, and not the lock.
            if (unlocked === button) unlocked = null;
            open?.close('');
            disarm();
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
