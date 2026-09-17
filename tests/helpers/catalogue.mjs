// Waiting for a catalogue page to finish reading its blocks [Kenny, 2026-09-14].
//
// Every judged block on a catalogue page carries a panel (catalogue/judging.js)
// whose badge reads "Checking" from the moment the panel is mounted until the
// block's hash is read in the theme on screen, and again from a theme change
// (applyTheme) until the next reading is done. While a reading runs, the page
// shows every block, holds its animations still and afterwards hides the
// judged ones again — so a test that measures, clicks or counts hidden blocks
// before the reading is done races the page. A catalogue test waits for the
// reading by default, with this, instead of a timeout or a poll on a side
// effect such as `.cat-block[hidden]`.

/** The words catalogue/judging.js puts on a badge whose block is still being read (STATES.checking). */
export const CHECKING = 'Checking';

/**
 * Resolve once every judging panel on the page has left its "checking" state.
 *
 * A theme changed through `applyTheme` puts the panels back into "checking"
 * synchronously, so calling this after the switch waits for that theme's
 * reading. Setting `data-theme` by hand does not start a reading at all.
 *
 * @param {import('@playwright/test').Page | import('@playwright/test').Frame} page
 * @param {{ timeout?: number }} [options] default 60 s; the review page reads every block and needs more
 */
export async function waitForJudging(page, { timeout = 60_000 } = {}) {
    await page.waitForFunction(
        (checking) => {
            const states = [...document.querySelectorAll('.cat-judge [data-cat-approval-state]')];
            return states.length > 0 && !states.some((el) => (el.textContent ?? '').startsWith(checking));
        },
        CHECKING,
        { timeout, polling: 100 },
    );
}
