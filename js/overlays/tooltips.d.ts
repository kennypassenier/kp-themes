/**
 * Framework-free tooltips on `.kp-tooltip-anchor` [gap-11].
 *
 *   <span class="kp-tooltip-anchor">
 *     <button type="button" class="kp-button">Recalibrate</button>
 *     <span role="tooltip" class="kp-popover kp-tooltip">Takes about two minutes</span>
 *   </span>
 *
 * The same contract as the React Tooltip: hidden at rest, shown after a
 * short delay under the pointer and at once on focus, gone when the
 * pointer or focus leaves, and gone on Escape (WCAG 1.4.13). The trigger
 * is described by the tooltip — an id is given where there was none, and
 * `aria-describedby` gains it rather than losing what it held. The anchor
 * names itself for anchor positioning, as the React channel does. Detach
 * puts back the attributes, the styles and the hidden state it found.
 *
 * The tooltip is drawn on the top layer (a manual popover, js/overlays/tooltip-layer.js), so a box round the anchor that
 * clips or contains (a table's scroll box, a card, a dialog's body) never cuts it [tip-1102]; `layer: 'inline'` keeps it in
 * the anchor's layer.
 *
 * @param {ParentNode} root
 * @param {{ openDelayMs?: number, closeDelayMs?: number, closeOnEscape?: boolean, ownedBy?: string, layer?: 'top' | 'inline' }} [options]
 *   Per anchor: `data-kp-open-delay`, `data-kp-close-delay`, `data-kp-close-on-escape="false"`, `data-kp-tooltip-layer`.
 * @returns {() => void} detach
 */
export declare function attachTooltips(root?: ParentNode, { openDelayMs, closeDelayMs, closeOnEscape, ownedBy, layer }?: {
    openDelayMs?: number;
    closeDelayMs?: number;
    closeOnEscape?: boolean;
    ownedBy?: string;
    layer?: 'top' | 'inline';
}): () => void;
