export type TaskFact = {
    /**
     * what it says
     */
    text: string;
    /**
     * `plain` (default) a muted word; `badge` the package's badge (a deadline);
     * `project` a categorical dot before the name; `tag` a categorical chip
     */
    kind?: 'plain' | 'badge' | 'project' | 'tag';
    /**
     * a badge's tone (overdue is `destructive`, today `warning`)
     */
    tone?: 'warning' | 'destructive' | 'success' | 'info';
    /**
     * 1 to 12, the categorical colour of a project or a tag
     */
    cat?: number;
    /**
     * a link (a tag's page)
     */
    href?: string;
    /**
     * what a screen reader hears instead of `text` (a glyph's meaning)
     */
    label?: string;
};
/**
 * One fact as its element.
 * @param {Document} doc @param {TaskFact | string | Node} fact
 * @returns {Node}
 */
export declare function factNode(doc: Document, fact: TaskFact | string | Node): Node;
