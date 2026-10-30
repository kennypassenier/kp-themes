/**
 * @param {HTMLElement} el
 * @param {{ locale?: string, weekStartsOn?: number }} given the page's defaults
 */
export declare function readWeekdaysOptions(el: HTMLElement, { locale: localeOption, weekStartsOn: weekOption }: {
    locale?: string;
    weekStartsOn?: number;
}): {
    month: boolean;
    locale: string;
    firstDay: number;
    narrow: boolean;
    min: number;
    showSummary: boolean;
    presets: string[];
    disabled: boolean;
};
