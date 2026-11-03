/** Whether leaving the screen would lose unsaved work (a guarded region, a guarded dialog or a registered editor). */
export declare function pageChanged(): boolean;
/**
 * Run `go` at once when nothing unsaved is held, else save what can save itself, ask once, and run `go` on Discard.
 * @param {() => void} go
 * @returns {boolean} whether `go` ran at once
 */
export declare function whenPageFree(go: () => void): boolean;
