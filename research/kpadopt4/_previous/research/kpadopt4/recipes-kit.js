// research/kpadopt4 (recipes sections): the page's helpers (mock).

/** @param {string} id @returns {HTMLElement} */
export const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
const stamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
/** @param {HTMLElement} log @param {string} line */
export const say = (log, line) => {
    const lines = (log.textContent ?? '').split('\n').filter(Boolean);
    lines.push(`${stamp()}  ${line}`);
    log.textContent = lines.slice(-5).join('\n');
};
