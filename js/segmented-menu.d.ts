export { CHIP_MENU, RENAME_ENTRY, RENAMING, RENAME_EVENT } from './segmented-menu/constants.js';
export { ChipRename } from './segmented-menu/rename.js';
/**
 * Wire every chip menu under `root`. The group itself is the segmented control's (attachSegmented).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachChipMenus(root?: ParentNode): () => void;
