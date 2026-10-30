// Reading block hashes in a Playwright page: the in-page function and its driver.

/** @typedef {import('./types.mjs').Measure} Measure */
/** @typedef {import('./types.mjs').Reading} Reading */
/** @typedef {import('./types.mjs').PageReading} PageReading */

/**
 * Runs inside the review page. Serialised as source, so it must stay
 * self-contained. Reads every block of the page in each theme, exactly as
 * catalogue.js mounts them: `.cat-block[id]`, or a demo's `main section[id]`.
 * @param {{ base: string, themes: string[], withLines?: boolean, only?: string[] | null }} options
 * @returns {Promise<PageReading>}
 */
export const IN_PAGE = async ({ base, themes, withLines = false, only = null }) => {
    const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const hashes = await import(`${base}catalogue/block-hash.js`);
    const core = await import(`${base}js/theme-core.js`);
    /** @type {{ COMPONENT_PAGES: { href: string }[] }} */
    const { COMPONENT_PAGES } = await import(`${base}catalogue/pages.js`);
    const here = decodeURIComponent(location.pathname).slice(new URL(base).pathname.length);
    const component = COMPONENT_PAGES.find((page) => page.href === here);
    const slug = (here.split('/').pop() ?? '').replace(/\.html$/, '');
    /** @type {HTMLElement[]} */
    let sections = [...document.querySelectorAll('.cat-block[id]')].map((el) => /** @type {HTMLElement} */ (el));
    if (!sections.length) sections = [...document.querySelectorAll('main section[id]')].map((el) => /** @type {HTMLElement} */ (el));
    const raw = new DOMParser().parseFromString(await (await fetch(location.href)).text(), 'text/html');
    const headingOf = (/** @type {HTMLElement} */ section) => {
        const heading = section.querySelector('h2, h3');
        if (!heading) return section.id;
        const copy = /** @type {Element} */ (heading.cloneNode(true));
        for (const tag of copy.querySelectorAll('[class*="-tag"]')) tag.remove();
        return copy.textContent?.trim() || section.id;
    };
    let items = sections.map((section) => ({
        key: component ? `${slug}--${section.id}` : `${here}#${section.id}`,
        title: headingOf(section),
        root: section,
        source: raw.getElementById(section.id)?.outerHTML ?? section.outerHTML,
    }));
    if (only) items = items.filter((item) => only.includes(item.key));
    const busy = () => [...document.querySelectorAll('[data-cat-approval-state]')].some((el) => /Checking|…/.test(el.textContent ?? ''));
    /** @type {Record<string, Reading[]>} */
    const out = {};
    for (const theme of themes) {
        if (core.currentTheme() !== theme) core.applyTheme(theme);
        for (let i = 0; i < 400; i += 1) {
            const sheets = [...document.querySelectorAll('link[rel="stylesheet"]')].every((link) => /** @type {HTMLLinkElement} */ (link).sheet);
            if (core.currentTheme() === theme && sheets) break;
            await sleep(50);
        }
        if (core.currentTheme() !== theme) throw new Error(`${here}: the theme ${theme} never applied`);
        await sleep(200);
        // The page's own panels read the blocks after a theme change; two
        // readings at once release each other's held animations.
        for (let i = 0; i < 300 && busy(); i += 1) await sleep(100);
        await sleep(300);
        for (const item of items) item.root.hidden = false;
        /** @type {{ hash: string, lines?: string[] }[]} */
        const read = await hashes.readBlocks(items, { lines: withLines });
        out[theme] = items.map((item, i) => ({ key: item.key, title: item.title, ...read[i] }));
    }
    return { page: here, hashVersion: hashes.HASH_VERSION ?? null, engine: navigator.userAgent, width: innerWidth, results: out };
};

/**
 * One review page, every theme asked for, in a Playwright page.
 * @param {import('@playwright/test').Page} page
 * @param {Measure} measure
 * @returns {Promise<PageReading>}
 */
export async function measurePlaywright(page, { base, href, themes, width, height = 1000, withLines = false, only = null }) {
    await page.setViewportSize({ width, height });
    await page.goto(new URL(href, base).href, { waitUntil: 'load' });
    return page.evaluate(IN_PAGE, { base, themes, withLines, only });
}
