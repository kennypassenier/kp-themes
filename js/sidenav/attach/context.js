// The context the parts of one side navigation share.
/** @typedef {import('./basics.js').BasicsFields} BasicsFields */
/** @typedef {import('./geometry.js').GeometryFields} GeometryFields */
/** @typedef {import('./shift.js').ShiftFields} ShiftFields */
/** @typedef {import('./launchers.js').LaunchersFields} LaunchersFields */
/** @typedef {import('./backdrop.js').BackdropFields} BackdropFields */
/** @typedef {import('./open.js').OpenFields} OpenFields */
/** @typedef {import('./slim.js').SlimFields} SlimFields */
/** @typedef {import('./tip.js').TipFields} TipFields */
/** @typedef {import('./flyout.js').FlyoutFields} FlyoutFields */
/** @typedef {import('./peek.js').PeekFields} PeekFields */
/** @typedef {import('./controls.js').ControlsFields} ControlsFields */
/** @typedef {import('./narrow.js').NarrowFields} NarrowFields */
/** @typedef {import('./resizer.js').ResizerFields} ResizerFields */
/** @typedef {import('./rail.js').RailFields} RailFields */
/** @typedef {import('../../strings/types.js').Strings} Strings */

/**
 * What exists before any part runs: the arguments, the guards' bindings and what the enclosing function holds.
 *
 * @typedef {{
 *     cleanups: (() => void)[];
 *     ownedBy: string;
 *     panel: HTMLElement;
 *     store: Storage | null | undefined;
 *     strings: Partial<Strings> | undefined;
 * }} BaseFields
 */

/**
 * What the parts of one side navigation share: its panel, its state and the functions that move it.
 *
 * @typedef {BaseFields &
 *     BasicsFields &
 *     GeometryFields &
 *     ShiftFields &
 *     LaunchersFields &
 *     BackdropFields &
 *     OpenFields &
 *     SlimFields &
 *     TipFields &
 *     FlyoutFields &
 *     PeekFields &
 *     ControlsFields &
 *     NarrowFields &
 *     ResizerFields &
 *     RailFields} SidenavContext
 */

export {};
