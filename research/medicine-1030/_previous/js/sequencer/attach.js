// Attaches the sequencer to its element.
import { resolveStrings } from '../strings.js';
import { watchOptions } from '../live-options.js';
import { SEQUENCER } from './constants.js';
import { announce, readOptions, sequencers } from './instance.js';
import { build } from './build.js';
import { sequencerClampZoom } from './timeline.js';
import { paint } from './paint.js';
import { afterLayout, select, setZoom } from './edit.js';
import { cancelEdit, startLink, stopLink, unlink } from './drag.js';
import { onKey } from './keyboard.js';
import { onCancel, onDown, onMove, onUp } from './pointer.js';
/** @typedef {import('./units.js').SequencerAttachOptions} SequencerAttachOptions */

/**
 * Attach every `[data-kp-sequencer]` under `root`. Returns a detach.
 * @param {ParentNode} [root]
 * @param {SequencerAttachOptions} [options]
 * @returns {() => void}
 */
export function attachSequencers(root = document, options = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(SEQUENCER)])) {
        if (sequencers.has(el)) continue;
        const c = build(el, resolveStrings(options.strings));
        sequencers.set(el, c);
        readOptions(c);
        c.zoom = sequencerClampZoom(Number(el.dataset.kpSequencerZoom) || 1);
        const now = Number(el.dataset.kpSequencerNow);
        c.nowAt = el.dataset.kpSequencerNow !== undefined && Number.isFinite(now) ? now : null;
        if (el.dataset.kpState === 'loading') c.state = 'loading';
        paint(c);

        /** @param {Event} e */
        const onClick = (e) => {
            const target = /** @type {HTMLElement} */ (e.target);
            const zoomButton = target.closest?.('[data-kp-sequencer-zoom]');
            if (zoomButton instanceof HTMLElement) {
                if (zoomButton.getAttribute('aria-disabled') === 'true') return;
                const key = zoomButton.dataset.kpSequencerZoom;
                if (setZoom(c, key === 'fit' ? 1 : c.zoom * (key === 'in' ? 1.25 : 0.8)))
                    announce(c, `${c.strings.sequencerZoomLabel} ${c.strings.sequencerZoomValue(Math.round(c.zoom * 100))}`);
                return;
            }
            const action = target.closest?.('[data-kp-sequencer-action]');
            if (action instanceof HTMLElement && c.selected) {
                const which = action.dataset.kpSequencerAction;
                if (which === 'link') startLink(c, c.selected);
                else if (which === 'unlink') unlink(c, c.selected);
                else if (which === 'cancel') stopLink(c);
                return;
            }
            if (!target.closest?.('.kp-sequencer__item') && target.closest?.('.kp-gantt__track, .kp-gantt__lane, .kp-sequencer__items')) {
                if (c.linking) stopLink(c);
                else select(c, null);
            }
        };
        /** @param {KeyboardEvent} e */
        const keydown = (e) => onKey(c, e);
        /** @param {PointerEvent} e */
        const down = (e) => onDown(c, e);
        /** @param {PointerEvent} e */
        const move = (e) => onMove(c, e);
        /** @param {PointerEvent} e */
        const up = (e) => onUp(c, e);
        /** @param {PointerEvent} e */
        const cancel = (e) => onCancel(c, e);
        /** @param {FocusEvent} e */
        const focusin = (e) => {
            const bar = /** @type {HTMLElement} */ (e.target).closest?.('.kp-sequencer__item');
            if (bar instanceof HTMLElement && bar.dataset.kpId && !c.press) {
                c.focusId = bar.dataset.kpId;
                select(c, bar.dataset.kpId);
            }
        };
        /** @param {FocusEvent} e */
        const focusout = (e) => {
            const bar = /** @type {HTMLElement} */ (e.target).closest?.('.kp-sequencer__item');
            if (c.kb && bar instanceof HTMLElement && bar.dataset.kpId === c.kb.id && !c.el.contains(/** @type {Node | null} */ (e.relatedTarget)))
                cancelEdit(c, 'blur');
        };
        /** @param {WheelEvent} e */
        const wheel = (e) => {
            if (!e.ctrlKey) return;
            e.preventDefault();
            setZoom(c, c.zoom * Math.exp(-e.deltaY * 0.01), e.clientX);
        };
        el.addEventListener('click', onClick);
        el.addEventListener('keydown', keydown);
        el.addEventListener('pointerdown', down);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', cancel);
        el.addEventListener('focusin', focusin);
        el.addEventListener('focusout', focusout);
        c.scroll.addEventListener('wheel', wheel, { passive: false });
        const stopOptions = watchOptions(
            el,
            [
                'data-kp-sequencer-unit',
                'data-kp-sequencer-snap',
                'data-kp-sequencer-snap-items',
                'data-kp-sequencer-overlap',
                'data-kp-sequencer-lanes',
                'data-kp-sequencer-editable',
                'data-kp-sequencer-span',
                'data-kp-sequencer-toolbar',
                'data-kp-sequencer-hint',
                'data-kp-sequencer-zoom',
            ],
            (names) => {
                readOptions(c);
                if (names.includes('data-kp-sequencer-zoom')) c.zoom = sequencerClampZoom(Number(el.dataset.kpSequencerZoom) || 1);
                if (!c.press && !c.kb) {
                    c.tickKey = '';
                    paint(c);
                }
            },
        );
        if (typeof ResizeObserver !== 'undefined') {
            let last = 0;
            c.observer = new ResizeObserver(() => {
                const width = c.plot.clientWidth;
                if (width === last) return;
                last = width;
                window.cancelAnimationFrame(c.frameTimer);
                c.frameTimer = window.requestAnimationFrame(() => {
                    if (!c.press?.moved) afterLayout(c);
                });
            });
            c.observer.observe(c.plot);
        }
        undo.push(() => {
            el.removeEventListener('click', onClick);
            el.removeEventListener('keydown', keydown);
            el.removeEventListener('pointerdown', down);
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerup', up);
            el.removeEventListener('pointercancel', cancel);
            el.removeEventListener('focusin', focusin);
            el.removeEventListener('focusout', focusout);
            c.scroll.removeEventListener('wheel', wheel);
            window.clearTimeout(c.scrollTimer);
            window.cancelAnimationFrame(c.frameTimer);
            stopOptions();
            c.observer?.disconnect();
            c.busy?.close();
            sequencers.delete(el);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}
