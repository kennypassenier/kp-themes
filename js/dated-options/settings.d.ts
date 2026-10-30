/**
 * The settings of one picker.
 * @param {HTMLElement} el
 * @param {(() => number) | undefined} nowOption the page's clock
 */
export declare function readSettings(el: HTMLElement, nowOption: (() => number) | undefined): {
    id: string;
    name: string;
    mode: 'radio' | 'combobox' | 'auto';
    inlineMax: number;
    latestOn: boolean;
    order: 'newest' | 'oldest' | 'given';
    column: boolean;
    preselect: boolean;
    zone: string;
    now: () => number;
    label: string;
    rowsWanted: number;
};
