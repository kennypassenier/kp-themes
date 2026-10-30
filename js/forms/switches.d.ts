/**
 * Give every switch under `root` its two words [gap-11, KT5].
 *
 * The switch itself needs no script — it is a checkbox, and Space flips
 * it natively. What a server cannot write is the dictionary: the On and
 * Off beside the track come from `js/strings.js`, so a consumer's
 * `setStrings()` (or `strings` here) reaches them like every other word.
 * A state element that already has content is left alone — a server that
 * wrote its own words has decided. The stylesheet shows the word that
 * applies; nothing here listens to the checkbox.
 *
 *   <label class="kp-switch">
 *     <input class="kp-switch__input" type="checkbox" role="switch" />
 *     <span class="kp-switch__state" aria-hidden="true"></span>
 *     <span>Night alarms</span>
 *   </label>
 *
 * @param {ParentNode} [root]
 * @param {{ strings?: Partial<import('../strings.js').Strings> }} [options]
 * @returns {() => void} detach: removes the words this call put in
 */
export declare function attachSwitches(root?: ParentNode, { strings }?: {
    strings?: Partial<import('../strings.js').Strings>;
}): () => void;
