export type Shell = {
    prompt: string;
    continues: readonly string[];
    windows: boolean;
};
/**
 * The head: the terminal, the admin or sudo badge, the copy button.
 * @param {HTMLElement} el the command block
 * @param {{ id: string, key: string, shell: Shell, codeId: string }} how
 * @returns {{ head: HTMLElement, name: HTMLElement }}
 */
export declare function buildHead(el: HTMLElement, { id, key, shell, codeId }: {
    id: string;
    key: string;
    shell: Shell;
    codeId: string;
}): {
    head: HTMLElement;
    name: HTMLElement;
};
/**
 * The note under the code: where it runs, or null when the block says nothing.
 * @param {HTMLElement} el
 * @returns {HTMLElement | null}
 */
export declare function buildWhere(el: HTMLElement): HTMLElement | null;
