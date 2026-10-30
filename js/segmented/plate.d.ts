/**
 * Note which sides of a scrolling track have more segments out of sight, so the
 * stylesheet fades only those edges (a label at a side with nothing beyond it
 * stays whole).
 * @param {HTMLElement} group
 */
export declare function reach(group: HTMLElement): void;
/**
 * Place the plate under the chosen segment (single, segmented look) and note
 * whether the segments overflow the group.
 * @param {Element} group
 */
export declare function layout(group: Element): void;
