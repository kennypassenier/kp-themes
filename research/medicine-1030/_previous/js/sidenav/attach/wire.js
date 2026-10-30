// Registers the panel's event listeners.
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * Registers the panel's event listeners.
 *
 * @param {SidenavContext} c
 */
export function installWire(c) {
    const {
        chord,
        doc,
        hideTip,
        onCategory,
        onEsc,
        onFlyFocusOut,
        onFlyOut,
        onFlyOver,
        onPeekEnter,
        onPeekFocusIn,
        onPeekFocusOut,
        onPeekLeave,
        onRailKey,
        onShortcut,
        onSlimClick,
        onTipFocus,
        onTipOut,
        onTipOver,
        onToggleClick,
        onTrap,
        panel,
        turnEase,
    } = c;

    doc.addEventListener('click', onToggleClick);
    doc.addEventListener('click', onSlimClick);
    panel.addEventListener('click', onCategory);
    doc.addEventListener('keydown', /** @type {EventListener} */ (onEsc));
    panel.addEventListener('keydown', /** @type {EventListener} */ (onTrap));
    panel.addEventListener('keydown', /** @type {EventListener} */ (onRailKey));
    panel.addEventListener('pointerenter', turnEase);
    panel.addEventListener('pointerenter', onPeekEnter);
    panel.addEventListener('pointerleave', onPeekLeave);
    panel.addEventListener('focusin', onPeekFocusIn);
    panel.addEventListener('focusout', /** @type {EventListener} */ (onPeekFocusOut));
    panel.addEventListener('pointerover', /** @type {EventListener} */ (onTipOver));
    panel.addEventListener('pointerout', /** @type {EventListener} */ (onTipOut));
    panel.addEventListener('focusin', /** @type {EventListener} */ (onTipFocus));
    panel.addEventListener('focusout', hideTip);
    panel.addEventListener('pointerover', /** @type {EventListener} */ (onFlyOver));
    panel.addEventListener('pointerout', /** @type {EventListener} */ (onFlyOut));
    panel.addEventListener('focusout', /** @type {EventListener} */ (onFlyFocusOut));
    if (chord !== null) doc.addEventListener('keydown', /** @type {EventListener} */ (onShortcut));
}
