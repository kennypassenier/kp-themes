export type Ctl = import('./controller.js').DatePickerController;
/** @param {Ctl} ctl @param {KeyboardEvent} event */
export declare function onPanelKey(ctl: Ctl, event: KeyboardEvent): void;
/** @param {Ctl} ctl @param {MouseEvent} event */
export declare function onPanelClick(ctl: Ctl, event: MouseEvent): void;
