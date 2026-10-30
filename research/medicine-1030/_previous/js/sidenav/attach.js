// Attaches the side navigation to its element: its closure, split into parts.
import { SIDENAV_OWNED } from './constants.js';
import { installBasics } from './attach/basics.js';
import { installGeometry } from './attach/geometry.js';
import { installShift } from './attach/shift.js';
import { installLaunchers } from './attach/launchers.js';
import { installBackdrop } from './attach/backdrop.js';
import { installOpen } from './attach/open.js';
import { installSlim } from './attach/slim.js';
import { installTip } from './attach/tip.js';
import { installFlyout } from './attach/flyout.js';
import { installPeek } from './attach/peek.js';
import { installControls } from './attach/controls.js';
import { installNarrow } from './attach/narrow.js';
import { installResizer } from './attach/resizer.js';
import { installRail } from './attach/rail.js';
import { installWire } from './attach/wire.js';
import { installHandle } from './attach/handle.js';
/** @typedef {import('./attach/context.js').SidenavContext} SidenavContext */

/**
 * Wire every `.kp-sidenav` under `root`.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, ownedBy?: string, store?: Storage | null }} [options]
 * @returns {() => void} detach
 */
export function attachSidenavs(root = document, { strings, ownedBy = SIDENAV_OWNED, store } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll('.kp-sidenav')) {
        const panel = /** @type {HTMLElement} */ (element);
        if (panel.dataset.kpSidenavAttached !== undefined) continue;
        panel.dataset.kpSidenavAttached = '';
        if (!panel.id) panel.id = `kp-sidenav-${Math.random().toString(36).slice(2, 8)}`;

        const c = /** @type {SidenavContext} */ (/** @type {unknown} */ ({ panel, store, strings, ownedBy, cleanups }));
        installBasics(c);
        installGeometry(c);
        installShift(c);
        installLaunchers(c);
        installBackdrop(c);
        installOpen(c);
        installSlim(c);
        installTip(c);
        installFlyout(c);
        installPeek(c);
        installControls(c);
        installNarrow(c);
        installResizer(c);
        installRail(c);
        installWire(c);
        installHandle(c);
    }

    return () => {
        for (const c of cleanups) c();
    };
}
