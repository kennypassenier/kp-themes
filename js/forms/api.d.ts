/** The handle for an attached form, for code that did not call attach. @param {Element} element @returns {import('./constants.js').FormHandle | null} */
export declare function form(element: Element): import('./constants.js').FormHandle | null;
/**
 * Attach every form under `root`.
 *
 * @param {ParentNode} root
 * @param {import('./constants.js').FormOptions} [options]
 *   Defaults, each also settable per form as `data-kp-validate-on`, `data-kp-revalidate-on`, `data-kp-focus-summary`, `data-kp-form-native-submit`.
 *   A valid submit is NOT sent by the browser: the form fires `kp-form-valid` and the page sends the data itself (`preventDefault()`),
 *   so a handler that saves with `fetch` is not followed by a reload of the page [wish-1028, Kitchen 5]. `nativeSubmit: true` (or
 *   `data-kp-form-native-submit` on the form) lets the browser submit a valid form as well, for a form whose `action` does the work.
 * @returns {(() => void) & { handles: import('./constants.js').FormHandle[] }} detach
 */
export declare function attachForms(root?: ParentNode, options?: import('./constants.js').FormOptions): (() => void) & {
    handles: import('./constants.js').FormHandle[];
};
/**
 * Form grids that share rows [gapform-1019; HTTPSwitchboard 31]. In a `[data-kp-formgrid-stage]`, a `.kp-formgrid` with
 * `data-kp-formgrid-rows="subgrid"` takes its rows from the stage, so "Source" in one card stands beside "Source" in
 * the next with one height. A subgrid has to say how many rows it spans, and a count kept by hand drifts the day a row
 * is added: this writes `--kp-formgrid-rows` on each stage, the row count of its longest card, and writes it again when
 * a card gains or loses a row or one is hidden.
 *
 *   <div data-kp-formgrid-stage>
 *     <section class="kp-card kp-formgrid" data-kp-formgrid-rows="subgrid">…</section>
 *     <section class="kp-card kp-formgrid" data-kp-formgrid-rows="subgrid">…</section>
 *   </div>
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach: stops watching and removes the counts it wrote
 */
export declare function attachFormgridStages(root?: ParentNode): () => void;
/**
 * Groups side by side [formgrid-columns-1019]. A `.kp-formgrid` whose children are all `.kp-formgrid__group` (facts and
 * settings, say) stands them in a row when the panel holds all of them: this puts `data-kp-formgrid-wide` on it while each
 * group, laid on tracks of its own, fits beside the others with `--kp-formgrid-group-gap` between. Without the attribute
 * the groups stand under each other on the grid's shared tracks (one label edge for all). `data-kp-formgrid-columns="never"`,
 * a row-sharing card (`data-kp-formgrid-rows="subgrid"`) and a stacked grid (`data-kp-formgrid-stack="always"`) are left alone.
 * Measured on the grid's own width, so a panel in a dialog or a column answers the same as a page.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach: stops watching and removes the attribute it wrote
 */
export declare function attachFormgridColumns(root?: ParentNode): () => void;
