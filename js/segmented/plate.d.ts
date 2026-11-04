/**
 * Note which sides of a scrolling track have more segments out of sight, so the
 * stylesheet fades only those edges (a label at a side with nothing beyond it
 * stays whole).
 * @param {HTMLElement} group
 */
export declare function reach(group: HTMLElement): void;
/**
 * Everything `applyLayout` needs, read without writing a thing: whether the segments overflow, the marks of a scrolling track and
 * the chosen segment's box. The reads of every group of a pass are made together, so the pass costs one layout, not one per group
 * [attach-1104]. Null for what is not an element.
 * @param {Element} group
 */
export declare function measureLayout(group: Element): {
    overflow: boolean;
    sides: string[];
    placed: boolean;
    x: number;
    w: number;
} | null;
/**
 * Write what `measureLayout` read. When the overflow mark changes, the reads that depend on it are made again after the write, as
 * they always were; with a mark that stays, the reads stand.
 * @param {Element} group
 * @param {NonNullable<ReturnType<typeof measureLayout>>} measured
 */
export declare function applyLayout(group: Element, measured: NonNullable<ReturnType<typeof measureLayout>>): void;
/**
 * Place the plate under the chosen segment (single, segmented look) and note
 * whether the segments overflow the group.
 * @param {Element} group
 */
export declare function layout(group: Element): void;
/**
 * Place the plates of several groups: every read first, then every write.
 * @param {Element[]} groups
 */
export declare function layoutGroups(groups: Element[]): void;
