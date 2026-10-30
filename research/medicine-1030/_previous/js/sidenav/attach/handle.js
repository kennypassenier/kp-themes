// The handle a page gets back and the detach that undoes everything.
import { OPTIONS } from '../options.js';
import { INSET_KNOBS, handles } from '../constants.js';
/** @typedef {import('../helpers.js').Sidenav} Sidenav */
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * The handle a page gets back and the detach that undoes everything.
 *
 * @param {SidenavContext} c
 */
export function installHandle(c) {
    const {
        cleanups,
        close,
        contentEl,
        doc,
        dropBackdrop,
        flyTimers,
        glyphs,
        hiddenAtAttach,
        hideTip,
        isOpen,
        launchedByMarkup,
        launchers,
        narrowWatch,
        offsetContent,
        on,
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
        open,
        ownedBy,
        panel,
        read,
        set,
        setMode,
        setSlim,
        slimTogglers,
        syncRail,
        tabs,
        togglers,
        turnEase,
    } = c;

    /** @type {Sidenav} */
    const handle = {
        element: panel,
        open,
        close,
        toggle: ({ remember = true } = {}) => set(!isOpen(), true, remember),
        setMode,
        setSlim: (collapsed) => setSlim(collapsed),
        isOpen,
        destroy: () => {},
    };
    const detach = () => {
        narrowWatch?.disconnect();
        if (c.grip !== null) {
            c.grip.remove();
            c.grip = null;
            panel.removeAttribute(OPTIONS.resizing);
            if (c.wroteWidth) panel.style.removeProperty('--kp-sidenav-width');
        }
        if (c.declared !== null) {
            panel.removeAttribute(OPTIONS.narrow);
            if (c.declared.mode === null) panel.removeAttribute(OPTIONS.mode);
            else panel.setAttribute(OPTIONS.mode, c.declared.mode);
            panel.toggleAttribute(OPTIONS.slimCollapsed, c.declared.slim);
            c.declared = null;
        }
        for (const [control, hidden] of hiddenAtAttach) control.toggleAttribute('hidden', hidden);
        doc.removeEventListener('click', onToggleClick);
        doc.removeEventListener('click', onSlimClick);
        panel.removeEventListener('click', onCategory);
        doc.removeEventListener('keydown', /** @type {EventListener} */ (onEsc));
        panel.removeEventListener('keydown', /** @type {EventListener} */ (onTrap));
        panel.removeEventListener('pointerenter', turnEase);
        panel.removeEventListener('keydown', /** @type {EventListener} */ (onRailKey));
        panel.removeEventListener('pointerenter', onPeekEnter);
        panel.removeEventListener('pointerleave', onPeekLeave);
        panel.removeEventListener('focusin', onPeekFocusIn);
        panel.removeEventListener('focusout', /** @type {EventListener} */ (onPeekFocusOut));
        panel.removeEventListener('pointerover', /** @type {EventListener} */ (onTipOver));
        panel.removeEventListener('pointerout', /** @type {EventListener} */ (onTipOut));
        panel.removeEventListener('focusin', /** @type {EventListener} */ (onTipFocus));
        panel.removeEventListener('focusout', hideTip);
        panel.removeEventListener('pointerover', /** @type {EventListener} */ (onFlyOver));
        panel.removeEventListener('pointerout', /** @type {EventListener} */ (onFlyOut));
        panel.removeEventListener('focusout', /** @type {EventListener} */ (onFlyFocusOut));
        doc.removeEventListener('keydown', /** @type {EventListener} */ (onShortcut));
        clearTimeout(c.peekTimer);
        clearTimeout(c.tipTimer);
        for (const timer of flyTimers.values()) clearTimeout(timer);
        panel.removeAttribute(OPTIONS.peek);
        if (c.held !== null) panel.style.transition = c.heldTransition;
        // Fold the floating groups back into the panel as they were.
        const wasSlim = c.slimHeld ?? panel.hasAttribute(OPTIONS.slimCollapsed);
        c.slimHeld = null;
        panel.removeAttribute(OPTIONS.slimCollapsed);
        syncRail();
        panel.toggleAttribute(OPTIONS.slimCollapsed, wasSlim);
        c.tip?.remove();
        c.tip = null;
        panel.inert = false;
        for (const tab of tabs()) {
            tab.removeAttribute('data-kp-sidenav-shift');
            tab.removeAttribute('data-kp-sidenav-tab-edge');
            tab.style.marginInlineStart = tab.style.marginInlineEnd = '';
        }
        for (const toggler of togglers()) toggler.removeAttribute('aria-keyshortcuts');
        panel.style.removeProperty('--kp-sidenav-ease-back');
        dropBackdrop();
        offsetContent(false);
        c.strip?.remove();
        c.strip = null;
        const target = contentEl();
        if (target) {
            target.removeAttribute('data-kp-sidenav-shift');
            target.removeAttribute(OPTIONS.inset);
            for (const name of INSET_KNOBS) target.style.removeProperty(name);
            for (const name of ['--kp-sidenav-shift-duration', '--kp-sidenav-shift-ease', '--kp-sidenav-shift-delay'])
                target.style.removeProperty(name);
            target.style.marginInlineStart = '';
        }
        c.lightTurn += 1;
        for (const box of launchers()) box.removeAttribute(OPTIONS.lit);
        for (const glyph of glyphs) glyph.remove();
        if (!launchedByMarkup) panel.removeAttribute(OPTIONS.launched);
        for (const box of [...launchers(), ...tabs()]) {
            box.removeAttribute(OPTIONS.openerOff);
            box.removeAttribute(OPTIONS.openerOn);
        }
        if (on(OPTIONS.lockScroll, false)) doc.documentElement.style.overflow = '';
        panel.removeAttribute(OPTIONS.open);
        for (const toggler of togglers()) {
            toggler.removeAttribute('aria-expanded');
            toggler.removeAttribute('aria-label');
        }
        if (read(OPTIONS.slim) !== null) {
            for (const toggler of slimTogglers()) {
                if (ownedBy !== '' && toggler.matches(ownedBy)) continue;
                toggler.removeAttribute('aria-expanded');
                toggler.removeAttribute('aria-label');
            }
        }
        delete panel.dataset.kpSidenavAttached;
        handles.delete(panel);
    };
    handle.destroy = detach;
    handles.set(panel, handle);
    cleanups.push(detach);
}
