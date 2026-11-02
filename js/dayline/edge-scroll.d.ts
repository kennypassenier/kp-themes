/**
 * @param {HTMLElement} box the scrolling box
 * @param {() => void} onScroll called after every frame that moved the box
 * @returns {{ at: (clientY: number | null) => void, stop: () => void }} `at(null)`: the pointer left the box
 */
export declare function edgeScroller(box: HTMLElement, onScroll: () => void): {
    at: (clientY: number | null) => void;
    stop: () => void;
};
