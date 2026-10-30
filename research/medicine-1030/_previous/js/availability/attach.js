// Attaches the availability grids of a page.
import { getStrings } from '../strings.js';
import { attachHeats, setHeatPick } from '../heat.js';
import { registerShortcuts } from '../shortcuts.js';
import { memoryFor } from '../remember.js';
import { attachDisabledReasons } from '../reason.js';
import { ensureParts, setAvailability } from './api.js';
import { AVAILABILITY, AVAILABILITY_CHOOSE_EVENT, AVAILABILITY_RETRY_EVENT, AVAILABILITY_UNIT_EVENT } from './constants.js';
import { STATE, allowed, attr, availabilityBest, editable, stateOf } from './facts.js';
import { next, openMenu } from './menu.js';
import { render } from './paint.js';
import { request } from './request.js';
/** @typedef {import('./types.js').AvailabilityAnswer} AvailabilityAnswer */

/**
 * Wire every availability grid under `root`: presses, painting, keys, the switch, Choose.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachAvailability(root = document) {
    const roots = /** @type {HTMLElement[]} */ ([
        ...(root instanceof HTMLElement && root.matches(AVAILABILITY) ? [root] : []),
        ...root.querySelectorAll(AVAILABILITY),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el_ of roots) {
        ensureParts(el_);
        if (!STATE.has(el_)) {
            STATE.set(el_, {
                spec: {},
                set: { columns: [], answers: {} },
                unit: 'range',
                refused: new Map(),
                saving: new Set(),
                off: [],
                menu: null,
            });
        }
        const st = stateOf(el_);
        if (st.off.length) continue;
        const stopReasons = attachDisabledReasons(el_);
        /** @type {{ person: string, first: HTMLElement, answer: AvailabilityAnswer | null, keys: Set<string>, pointer: number } | null} */
        let drag = null;
        let suppress = false;
        /** @param {Event} event */
        const cellOf = (event) => {
            const t = event.target instanceof Element ? event.target : null;
            const c = /** @type {HTMLElement | null} */ (t?.closest('.kp-availability__grid .kp-heat__cell[data-col-key]') ?? null);
            return c && !c.closest('.kp-heat__row--summary') ? c : null;
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;
            if (suppress) {
                suppress = false;
                event.stopPropagation();
                event.preventDefault();
                return;
            }
            const retry = target.closest('[data-kp-availability-retry]');
            if (retry) {
                el_.dispatchEvent(
                    new CustomEvent(AVAILABILITY_RETRY_EVENT, {
                        bubbles: true,
                        detail: { action: stateOf(el_).spec.state === 'empty' ? 'add' : 'retry' },
                    }),
                );
                return;
            }
            const unit = target.closest('.kp-availability__unit [data-value]');
            if (unit) {
                const value = unit.getAttribute('data-value') === 'day' ? 'day' : 'range';
                if (value === stateOf(el_).unit) return;
                const s2 = stateOf(el_);
                setAvailability(el_, { ...s2.spec, unit: value });
                el_.dispatchEvent(new CustomEvent(AVAILABILITY_UNIT_EVENT, { bubbles: true, detail: { unit: value } }));
                return;
            }
            if (target.closest('.kp-availability__choose')) {
                el_.dispatchEvent(new CustomEvent(AVAILABILITY_CHOOSE_EVENT, { bubbles: true, detail: { keys: availabilityBest(el_) } }));
                return;
            }
            const pick = target.closest('.kp-availability__pick');
            if (pick instanceof HTMLElement) {
                const answer = /** @type {AvailabilityAnswer} */ (pick.getAttribute('data-answer'));
                const was = stateOf(el_).set.answers[pick.getAttribute('data-person') ?? '']?.[pick.getAttribute('data-column') ?? ''];
                void request(el_, pick.getAttribute('data-person') ?? '', [pick.getAttribute('data-column') ?? ''], was === answer ? null : answer);
                return;
            }
            const colHead = target.closest('.kp-availability__grid .kp-heat__col');
            if (colHead) {
                const key = colHead.getAttribute('data-col-key');
                const grid = /** @type {HTMLElement} */ (el_.querySelector('.kp-availability__grid'));
                if (key) setHeatPick(grid, grid.getAttribute('data-kp-heat-picked') === key ? null : key);
                return;
            }
            const cell = cellOf(event);
            if (!cell) return;
            event.stopPropagation();
            const person = cell.getAttribute('data-row-key') ?? '';
            const column = cell.getAttribute('data-col-key') ?? '';
            if (!editable(el_, person, column)) return;
            if (attr(el_, 'press', 'menu') === 'menu') return openMenu(el_, cell);
            void request(el_, person, [column], next(el_, stateOf(el_).set.answers[person]?.[column]));
        };
        /** @param {PointerEvent} event */
        const onDown = (event) => {
            if (event.button !== 0 || event.pointerType === 'touch' || attr(el_, 'paint', 'on') === 'false' || attr(el_, 'press', 'menu') === 'menu')
                return;
            const cell = cellOf(event);
            if (!cell) return;
            const person = cell.getAttribute('data-row-key') ?? '';
            const column = cell.getAttribute('data-col-key') ?? '';
            if (!editable(el_, person, column)) return;
            drag = {
                person,
                first: cell,
                answer: next(el_, stateOf(el_).set.answers[person]?.[column]),
                keys: new Set([column]),
                pointer: event.pointerId,
            };
        };
        /** @param {PointerEvent} event */
        const onMove = (event) => {
            if (!drag || event.buttons !== 1) return;
            const under = document.elementFromPoint(event.clientX, event.clientY);
            const cell = /** @type {HTMLElement | null} */ (under?.closest('.kp-availability__grid .kp-heat__cell[data-col-key]') ?? null);
            if (!cell || cell.getAttribute('data-row-key') !== drag.person) return;
            const column = cell.getAttribute('data-col-key') ?? '';
            if (drag.keys.has(column) || !editable(el_, drag.person, column)) return;
            drag.keys.add(column);
            cell.setAttribute('data-kp-availability-painting', '');
            drag.first.setAttribute('data-kp-availability-painting', '');
        };
        const onUp = () => {
            const d = drag;
            drag = null;
            for (const c of el_.querySelectorAll('[data-kp-availability-painting]')) c.removeAttribute('data-kp-availability-painting');
            if (!d || d.keys.size < 2) return;
            suppress = true;
            setTimeout(() => (suppress = false), 0);
            void request(el_, d.person, [...d.keys], d.answer, { stroke: true });
        };
        /** @param {Event} event */
        const onScroll = (event) => {
            const t = event.target;
            if (t instanceof HTMLElement && t.classList.contains('kp-availability__grid'))
                memoryFor(el_, 'availability')?.write('scroll', t.scrollLeft);
        };
        el_.addEventListener('click', onClick, true);
        el_.addEventListener('pointerdown', onDown);
        el_.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        el_.addEventListener('scroll', onScroll, true);
        /** @type {(() => void) | undefined} */
        let stopKeys;
        if (el_.getAttribute('data-kp-availability-keys') !== 'false') {
            const s = getStrings();
            const focused = () =>
                /** @type {HTMLElement | null} */ (
                    document.activeElement instanceof HTMLElement
                        ? document.activeElement.closest('.kp-availability__grid .kp-heat__cell[data-col-key]')
                        : null
                );
            const ownFocused = () => {
                const c = focused();
                return c !== null && el_.contains(c) && editable(el_, c.getAttribute('data-row-key') ?? '', c.getAttribute('data-col-key') ?? '');
            };
            /** @param {AvailabilityAnswer | null} answer */
            const set = (answer) => () => {
                const c = focused();
                if (c) void request(el_, c.getAttribute('data-row-key') ?? '', [c.getAttribute('data-col-key') ?? ''], answer);
            };
            stopKeys = registerShortcuts(
                el_,
                [
                    {
                        keys: 'y',
                        what: s.availabilityKeyYes,
                        group: s.availabilityKeyGroup,
                        when: ownFocused,
                        reason: s.availabilityKeyReason,
                        run: set('yes'),
                    },
                    {
                        keys: 'm',
                        what: s.availabilityKeyMaybe,
                        group: s.availabilityKeyGroup,
                        when: () => ownFocused() && allowed(el_).includes('maybe'),
                        reason: s.availabilityKeyReason,
                        run: set('maybe'),
                    },
                    {
                        keys: 'n',
                        what: s.availabilityKeyNo,
                        group: s.availabilityKeyGroup,
                        when: ownFocused,
                        reason: s.availabilityKeyReason,
                        run: set('no'),
                    },
                    {
                        keys: 'Backspace',
                        what: s.availabilityKeyClear,
                        group: s.availabilityKeyGroup,
                        when: ownFocused,
                        reason: s.availabilityKeyReason,
                        run: set(null),
                    },
                ],
                { layoutGuard: 'off' },
            );
        }
        const stopHeat = attachHeats(el_);
        // Every option is live: change the attribute and the grid is drawn again.
        const watcher = new MutationObserver(() => render(el_));
        watcher.observe(el_, {
            attributes: true,
            attributeFilter: [
                'data-kp-heat-edit',
                'data-kp-disabled-reason',
                ...[
                    'answers',
                    'press',
                    'best',
                    'best-rule',
                    'window',
                    'quorum',
                    'sort',
                    'summary',
                    'locked',
                    'narrow',
                    'density',
                    'disabled',
                    'choose',
                    'unit-switch',
                ].map((n) => `data-kp-availability-${n}`),
            ],
        });
        st.off = [
            () => el_.removeEventListener('click', onClick, true),
            () => el_.removeEventListener('pointerdown', onDown),
            () => el_.removeEventListener('pointermove', onMove),
            () => document.removeEventListener('pointerup', onUp),
            () => el_.removeEventListener('scroll', onScroll, true),
            () => stopKeys?.(),
            stopHeat,
            () => watcher.disconnect(),
            stopReasons,
        ];
        undo.push(() => {
            for (const stop of st.off) stop();
            st.off = [];
        });
        render(el_);
    }
    return () => undo.forEach((u) => u());
}
