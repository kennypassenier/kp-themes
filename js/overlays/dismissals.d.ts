/**
 * Make `.kp-alert__close` and `.kp-toast__close` close what they sit in,
 * without a framework [gap-11].
 *
 * Before this only the React components did anything with those buttons;
 * a server-rendered alert kept a close button that did nothing, which is
 * worse than no button at all. Delegated from `root`, so a toast raised
 * after attach is covered too.
 *
 * An alert leaves the theme's way (js/motion.js leave(), its space folding
 * shut) and is then hidden (`hidden`, which the base layer holds above
 * every layout class), after ALERT_DISMISS_EVENT, which a consumer may
 * cancel to keep it or to animate it out itself — setting `hidden = false`
 * brings it back. A toast leaves through its own `dismiss()` when `toast()` made it,
 * so TOAST_HIDE_EVENT fires as it does on a timeout; otherwise it
 * leaves the theme's way (js/motion.js leave()) and the same event is
 * dispatched on its region once it is gone.
 *
 * `data-kp-remember="name"` on an alert [wish-1120, homelab 119]: a dismissal is kept (js/remember.js, component `alert`, slot
 * `dismissed`), and the alert is hidden again on the next visit, before the first paint where js/auto.js restores. showAlertAgain(alert)
 * forgets it and shows the alert, for a note whose reason came back.
 *
 * @param {ParentNode} root
 * @param {{ ownedBy?: string }} [options] `ownedBy: ''` wires even the buttons another channel marked
 * @returns {() => void} detach
 */
export declare function attachDismissals(root?: ParentNode, { ownedBy }?: {
    ownedBy?: string;
}): () => void;
/**
 * Open a remembered alert again: forget that it was dismissed and show it. For a page that has a reason to say it once more (a new
 * version of the note it explained).
 * @param {HTMLElement} alert a `.kp-alert[data-kp-remember]`
 */
export declare function showAlertAgain(alert: HTMLElement): void;
