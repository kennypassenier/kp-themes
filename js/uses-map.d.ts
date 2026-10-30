export { USES_MAP, USES_PIN_EVENT, USES_RETRY_EVENT, USES_COLLAPSE_BELOW } from './uses-map/constants.js';
export { rememberedView, rememberView } from './uses-map/memory.js';
export { usesRelation, usesPath } from './uses-map/relation.js';
export { drawUsesMap, setUsesPin, leaveUsesMap } from './uses-map/draw.js';
export type UsesNode = {
    key: string;
    label: string;
    /**
     * a line under the label
     */
    sub?: string;
    /**
     * a document mark before the label
     */
    glyph?: 'pdf' | 'doc' | 'sheet' | 'image' | 'text' | 'unknown';
    /**
     * a link to the thing itself
     */
    href?: string;
    /**
     * `ok` `warn` `bad` `muted`
     */
    tone?: string;
    /**
     * not a real thing but still a group (a faint node)
     */
    ghost?: boolean;
    /**
     * its lines are dashed
     */
    dashed?: boolean;
    /**
     * the node cannot be opened, and why
     */
    disabledReason?: string;
    /**
     * kept from a matrix row: a colour
     */
    mark?: string;
};
export type UsesLine = {
    /**
     * the line's colour (and its pattern)
     */
    tone?: 'ok' | 'warn' | 'bad' | 'muted';
    /**
     * the words on the line
     */
    label?: string;
};
export type Context = {
    replaceKeepingCard: (el: HTMLElement, nodes: Node[]) => void;
    syncCard: (el: HTMLElement, loading: boolean, words: string, area: () => readonly (Element | {
        top: number;
        right: number;
        bottom: number;
        left: number;
    })[], className: string) => void;
    markDrawn: (el: HTMLElement) => void;
};
/**
 * @typedef {object} UsesNode
 * @property {string} key
 * @property {string} label
 * @property {string} [sub] a line under the label
 * @property {'pdf' | 'doc' | 'sheet' | 'image' | 'text' | 'unknown'} [glyph] a document mark before the label
 * @property {string} [href] a link to the thing itself
 * @property {string} [tone] `ok` `warn` `bad` `muted`
 * @property {boolean} [ghost] not a real thing but still a group (a faint node)
 * @property {boolean} [dashed] its lines are dashed
 * @property {string} [disabledReason] the node cannot be opened, and why
 * @property {string} [mark] kept from a matrix row: a colour
 */
/**
 * What a line carries [r3r5-1019 line-tone].
 * @typedef {object} UsesLine
 * @property {'ok' | 'warn' | 'bad' | 'muted'} [tone] the line's colour (and its pattern)
 * @property {string} [label] the words on the line
 */
/**
 * The helpers heat.js hands over: the busy card's bookkeeping lives there.
 * @typedef {object} Context
 * @property {(el: HTMLElement, nodes: Node[]) => void} replaceKeepingCard
 * @property {(el: HTMLElement, loading: boolean, words: string, area: () => readonly (Element | { top: number, right: number, bottom: number, left: number })[], className: string) => void} syncCard
 * @property {(el: HTMLElement) => void} markDrawn
 */
