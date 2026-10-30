export type CodeBlock = import('./controller.js').CodeBlock;
/** @typedef {import('./controller.js').CodeBlock} CodeBlock */
/** The segmented control chose Pretty or Raw. @param {CodeBlock} ctl @param {Event} event */
export declare function onLayoutChange(ctl: CodeBlock, event: Event): void;
/** A click on one of the head's tools or the fold. @param {CodeBlock} ctl @param {MouseEvent} event */
export declare function onToolClick(ctl: CodeBlock, event: MouseEvent): Promise<void>;
