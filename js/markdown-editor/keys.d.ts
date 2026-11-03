/** The key spec of a tool in an editor; empty for a tool that has no key. @param {Element | null} host @param {string} id */
export declare function toolKey(host: Element | null, id: string): import("../key-spec.js").KeySpec;
/** The tool whose key this keydown presses, or undefined. @param {Element | null} host @param {KeyboardEvent} event */
export declare function toolPressed(host: Element | null, event: KeyboardEvent): string | undefined;
