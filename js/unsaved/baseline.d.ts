/** The baseline of one bar. A plain field keeps its value in the map; a tracked control in its attribute (and the map). */
export declare class Baseline extends Map {
    /** @param {HTMLElement} c @returns {string | undefined} */
    get(c: HTMLElement): string | undefined;
    /**
     * Keep a control's saved value. A tracked control that says nothing yet (its own script has not run) has no saved value to
     * write: the map holds the empty value until the control writes its first one.
     * @param {HTMLElement} c @param {string} value
     */
    set(c: HTMLElement, value: string): this;
}
