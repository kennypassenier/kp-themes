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
export type BasicsFields = import('./basics.js').BasicsFields;
export type GeometryFields = import('./geometry.js').GeometryFields;
export type ShiftFields = import('./shift.js').ShiftFields;
export type LaunchersFields = import('./launchers.js').LaunchersFields;
export type BackdropFields = import('./backdrop.js').BackdropFields;
export type OpenFields = import('./open.js').OpenFields;
export type SlimFields = import('./slim.js').SlimFields;
export type TipFields = import('./tip.js').TipFields;
export type FlyoutFields = import('./flyout.js').FlyoutFields;
export type PeekFields = import('./peek.js').PeekFields;
export type ControlsFields = import('./controls.js').ControlsFields;
export type NarrowFields = import('./narrow.js').NarrowFields;
export type ResizerFields = import('./resizer.js').ResizerFields;
export type RailFields = import('./rail.js').RailFields;
export type Strings = import('../../strings/types.js').Strings;
export type BaseFields = {
    cleanups: (() => void)[];
    ownedBy: string;
    panel: HTMLElement;
    store: Storage | null | undefined;
    strings: Partial<Strings> | undefined;
};
export type SidenavContext = BaseFields & BasicsFields & GeometryFields & ShiftFields & LaunchersFields & BackdropFields & OpenFields & SlimFields & TipFields & FlyoutFields & PeekFields & ControlsFields & NarrowFields & ResizerFields & RailFields;
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
