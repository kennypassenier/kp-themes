export type CodeBlock = import('./controller.js').CodeBlock;
export type Strings = import('../strings/types.js').Strings;
/** Draw (or redraw) the head from the block's state. @param {CodeBlock} ctl */
export declare function drawHead(ctl: CodeBlock): void;
