export type SidenavContext = import('./context.js').SidenavContext;
export type GeometryFields = {
    contentEl: () => HTMLElement | null;
    edge: () => 'end' | 'start';
    edgeSize: () => string;
    marginAlong: () => 'marginInlineEnd' | 'marginInlineStart';
    paddingAlong: () => 'paddingInlineEnd' | 'paddingInlineStart';
    panelSize: () => string;
    peekSize: () => string;
    reserved: () => boolean;
    strip: HTMLElement | null;
    syncPeek: (open: boolean) => void;
    tabs: () => HTMLElement[];
    togglers: () => Element[];
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the panel's geometry: togglers, content, margins, sizes and the peek strip part adds to the table's context.
 *
 * @typedef {{
 *     contentEl: () => HTMLElement | null;
 *     edge: () => 'end' | 'start';
 *     edgeSize: () => string;
 *     marginAlong: () => 'marginInlineEnd' | 'marginInlineStart';
 *     paddingAlong: () => 'paddingInlineEnd' | 'paddingInlineStart';
 *     panelSize: () => string;
 *     peekSize: () => string;
 *     reserved: () => boolean;
 *     strip: HTMLElement | null;
 *     syncPeek: (open: boolean) => void;
 *     tabs: () => HTMLElement[];
 *     togglers: () => Element[];
 * }} GeometryFields
 */
/**
 * The panel's geometry: togglers, content, margins, sizes and the peek strip.
 *
 * @param {SidenavContext} c
 */
export declare function installGeometry(c: SidenavContext): void;
