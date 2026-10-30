/** @param {HTMLElement} button */
export declare function post(button: HTMLElement): Promise<{
    error: any;
    remedy: any;
    line?: undefined;
} | {
    error?: undefined;
    remedy?: undefined;
    line: any;
} | undefined>;
