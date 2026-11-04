/** The keys for the shortcut engine behind an attribute. @param {Element} root @param {Record<string, unknown>} options @param {string} attribute @param {string} fallback */
export declare const engineKeysOf: (root: Element, options: Record<string, unknown>, attribute: string, fallback: string) => string | null;
/** The keys of the flow, as the engine's `inFields`-less listener reads them. @param {Element} root @param {Record<string, unknown>} options */
export declare function flowKeys(root: Element, options: Record<string, unknown>): {
    next: import("../key-spec.js").KeySpec;
    previous: import("../key-spec.js").KeySpec;
};
/** Whether a key goes in the direction asked; right to left the two arrows trade places. @param {KeyboardEvent} event @param {import('../key-spec.js').KeySpec} spec @param {boolean} rtl */
export declare function pressesFlow(event: KeyboardEvent, spec: import('../key-spec.js').KeySpec, rtl: boolean): boolean;
export declare const KEY_DEFAULTS: {
    sameYesterday: string[];
    sameUsual: string[];
    skip: string[];
    trackNext: string[];
    trackPrevious: string[];
};
