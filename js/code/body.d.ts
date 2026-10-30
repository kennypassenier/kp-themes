export type CodeBlock = import('./controller.js').CodeBlock;
/** @typedef {import('./controller.js').CodeBlock} CodeBlock */
/**
 * The lines past the fold are out of sight, so they are out of the layout of what can be seen: `data-kp-code-beyond`
 * hides them while the block is folded.
 * @param {CodeBlock} ctl
 */
export declare function markBeyond(ctl: CodeBlock): void;
/** Draw the body from the block's state. @param {CodeBlock} ctl */
export declare function drawBody(ctl: CodeBlock): void;
