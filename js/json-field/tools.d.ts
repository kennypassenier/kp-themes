/**
 * A press inside the tools.
 * @param {import('./controller.js').JsonFieldController} c
 * @param {MouseEvent} event
 */
export declare function handleTool(c: import('./controller.js').JsonFieldController, event: MouseEvent): Promise<void>;
/** Still the tools while the field is disabled or read-only; Copy stays. @param {import('./controller.js').JsonFieldController} c */
export declare function lockTools(c: import('./controller.js').JsonFieldController): void;
