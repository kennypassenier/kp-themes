/**
 * Open the modal confirmation for `button`, and call `onAccept` if it is
 * taken [TH107, T14, AR28].
 *
 * A native `<dialog>` shown with `showModal()`: the browser does the
 * focus trap, the Escape close and the focus return, which this package
 * already relies on twice. Escape and Cancel do nothing at all.
 *
 * **Written here rather than imported from `js/overlays.js`, on purpose.**
 * chassis-rs bakes six of this package's JavaScript modules into a Rust
 * binary, and the import closure of those six is exactly those six —
 * `js/overlays.js` is not among them. One import edge makes
 * `/static/kp/overlays.js` a 404, the module graph fail, and their whole
 * `chassis.js` die: the theme picker, the contract enforcer, the
 * confirmations and the skip links with it. `gates/check-closure.mjs`
 * holds that closure at six.
 *
 * Two opt-in checks for a removal that depends on something [kpadopt4]:
 * `dependents` lists what still uses the thing under the description (a
 * heading with the exact count, then one line each); `blocked` (the sentence
 * that says what to do first) makes it a notice instead of a question, with
 * one Close button and no Confirm. Each also comes from the button:
 * `data-kp-confirm-dependents` (one name per `;`) and
 * `data-kp-confirm-blocked` (empty: the dictionary's sentence).
 *
 * With `typeName` (or `data-kp-confirm-type` on the button) the reader
 * types that name before Confirm turns on [kpadopt4-ideas]: the dialog shows
 * what will be lost (`loses`, or the element `data-kp-confirm-loses` names),
 * the field, the rule (`anyCase`, `data-kp-confirm-case="any"`) and whether it
 * matches; Confirm stays disabled until it does, Enter in the field confirms a
 * match, and the field has the focus. Confirm carries `acceptLabel`
 * (`data-kp-confirm-label`), else the button's own words. A blocked removal
 * shows no field: there is nothing to confirm.
 *
 * @param {HTMLElement} button the control the confirmation belongs to
 * @param {{ phrase?: string, strings?: Partial<import('../strings.js').Strings>, onAccept?: () => void, onCancel?: () => void, className?: string, initialFocus?: 'cancel' | 'accept', dependents?: readonly string[], blocked?: string | boolean, typeName?: string, anyCase?: boolean, loses?: Node | readonly string[] | null, acceptLabel?: string }} [options]
 * @returns {HTMLDialogElement} the dialog, so a consumer can reach the state this set [KT6]
 */
export declare function openConfirmation(button: HTMLElement, { phrase, strings, onAccept, onCancel, className, initialFocus, dependents, blocked, typeName, anyCase, loses, acceptLabel }?: {
    phrase?: string;
    strings?: Partial<import('../strings.js').Strings>;
    onAccept?: () => void;
    onCancel?: () => void;
    className?: string;
    initialFocus?: 'cancel' | 'accept';
    dependents?: readonly string[];
    blocked?: string | boolean;
    typeName?: string;
    anyCase?: boolean;
    loses?: Node | readonly string[] | null;
    acceptLabel?: string;
}): HTMLDialogElement;
/**
 * Wire every typed confirmation block a page put in its own dialog or form
 * [kpadopt4-ideas]:
 *
 *   <div data-kp-type-confirm="media" data-kp-type-confirm-for="wipe" data-kp-type-confirm-loses="wipe-list"></div>
 *   <button type="button" class="kp-button kp-button--destructive" id="wipe">Wipe media</button>
 *
 * The block is filled (what is lost, the field, the rule, the match line),
 * and the button `data-kp-type-confirm-for` names stays disabled until the
 * name is typed; `data-kp-type-confirm-case="any"` lets capitals pass. The
 * block fires `kp-type-confirm` when the answer turns. Detach empties the
 * block and gives the button back its own disabled state.
 *
 * @param {ParentNode} [root]
 * @param {{ strings?: Partial<import('../strings.js').Strings> }} [options]
 * @returns {() => void} detach
 */
export declare function attachTypeConfirms(root?: ParentNode, { strings }?: {
    strings?: Partial<import('../strings.js').Strings>;
}): () => void;
