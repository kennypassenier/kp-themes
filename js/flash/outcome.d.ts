/**
 * Run the work and read its answer.
 * @param {HTMLElement} button
 * @param {() => Promise<import('../flash.js').FlashAnswer> | import('../flash.js').FlashAnswer} work
 * @returns {Promise<{ ok: boolean, word: string, line: string }>}
 */
export declare function settle(button: HTMLElement, work: () => Promise<import('../flash.js').FlashAnswer> | import('../flash.js').FlashAnswer): Promise<{
    ok: boolean;
    word: string;
    line: string;
}>;
