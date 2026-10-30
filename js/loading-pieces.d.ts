export { PIECES_PROPERTY, PIECES_ATTRIBUTE, PIECE_CARRIERS } from './loading-pieces/values.js';
/**
 * Watch `root` for parts that wait and give each the pieces its theme
 * names, for as long as it waits; a theme switch, a part that starts or
 * stops waiting and a part that changes size are followed.
 * @param {ParentNode} [root]
 * @returns {() => void} detach: every piece goes, the parts are as they came
 */
export declare function attachLoadingPieces(root?: ParentNode): () => void;
