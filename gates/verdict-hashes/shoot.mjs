// Photographing blocks in a Playwright page: the preparation step, the shooter and the print shell.

/**
 * Runs inside the review page: puts one theme on and waits until the page is
 * at rest, the way IN_PAGE does before it reads, and returns the blocks there
 * are, each with the selectors of the parts that are the component (its
 * stages, or the block itself without its heading and reading aids).
 * @param {{ base: string, theme: string, only?: string[] | null }} options
 */
export const PREPARE = async ({ base, theme, only = null }) => {
    const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const core = await import(`${base}js/theme-core.js`);
    /** @type {{ COMPONENT_PAGES: { href: string }[] }} */
    const { COMPONENT_PAGES } = await import(`${base}catalogue/pages.js`);
    const here = decodeURIComponent(location.pathname).slice(new URL(base).pathname.length);
    const component = COMPONENT_PAGES.find((page) => page.href === here);
    const slug = (here.split('/').pop() ?? '').replace(/\.html$/, '');
    if (core.currentTheme() !== theme) core.applyTheme(theme);
    for (let i = 0; i < 400; i += 1) {
        const sheets = [...document.querySelectorAll('link[rel="stylesheet"]')].every((link) => /** @type {HTMLLinkElement} */ (link).sheet);
        if (core.currentTheme() === theme && sheets) break;
        await sleep(50);
    }
    if (core.currentTheme() !== theme) throw new Error(`${here}: the theme ${theme} never applied`);
    const busy = () => [...document.querySelectorAll('[data-cat-approval-state]')].some((el) => /Checking|…/.test(el.textContent ?? ''));
    await sleep(200);
    for (let i = 0; i < 300 && busy(); i += 1) await sleep(100);
    // A block still building itself (a data table on a mock server) is given
    // up to three seconds, as the hash reading gives it.
    // Only a data table: a busy button or a busy table wrap is a demo that
    // stays busy by design, and waiting on those cost three seconds on every
    // page in every theme, most of a run's time (measured 2026-09-30).
    for (let i = 0; i < 60 && document.querySelector('[data-kp-datatable][aria-busy="true"]:not([data-kp-state="loading"])'); i += 1) await sleep(50);
    await document.fonts?.ready;
    await sleep(300);
    /** @type {HTMLElement[]} */
    let sections = [...document.querySelectorAll('.cat-block[id]')].map((el) => /** @type {HTMLElement} */ (el));
    if (!sections.length) sections = [...document.querySelectorAll('main section[id]')].map((el) => /** @type {HTMLElement} */ (el));
    const blocks = sections
        .map((section) => ({
            key: component ? `${slug}--${section.id}` : `${here}#${section.id}`,
            id: section.id,
            stages: section.querySelectorAll('.cat-stage').length,
        }))
        .filter((block) => !only || only.includes(block.key));
    for (const section of sections) section.hidden = false;
    // Nothing the reviewer's panel draws, and no caret or focus ring left over.
    const style = document.createElement('style');
    style.textContent =
        '.cat-look, .cat-feedback-field, .cat-approval, .cat-judge { visibility: hidden !important } * { caret-color: transparent !important }';
    document.head.append(style);
    // Nor the page's own sticky or fixed chrome (the review bar and its
    // count): a stage taller than the window is photographed in parts, and
    // that chrome, which says how many blocks are left, lay over it.
    for (const el of document.body.querySelectorAll('*')) {
        if (el.closest('.cat-stage')) continue;
        const { position } = getComputedStyle(el);
        if (position === 'sticky' || position === 'fixed') /** @type {HTMLElement} */ (el).style.setProperty('visibility', 'hidden', 'important');
    }
    /** @type {HTMLElement | null} */ (document.activeElement)?.blur?.();
    return blocks;
};

/**
 * The pixels of blocks on one review page, in each theme asked for: every
 * stage of a block photographed twice, a short pause apart, so a block that
 * does not hold still says so rather than reading as changed [scope-138].
 * @param {import('@playwright/test').Page} page
 * @param {{ base: string, href: string, themes: string[], width: number, height?: number, only?: string[] | null, repeat?: boolean }} options
 * @returns {Promise<Map<string, { first: string, second: string }>>} `key|theme` -> the two readings' digests
 */
export async function shootPlaywright(page, { base, href, themes, width, height = 1000, only = null, repeat = true }) {
    const { createHash } = await import('node:crypto');
    await page.setViewportSize({ width, height });
    // The page's clock stands still at one moment, its timers still run: a
    // block that counts or dates by itself (the data table's busy clock,
    // table.html#datatable-states, "42 s so far" and ticking; a date picker's
    // today) reads the same in every photograph, at every commit, on every
    // day. Nothing in the package changes; only the photograph's Date does.
    await page.clock.setFixedTime(new Date('2026-10-04T10:00:00Z'));
    await page.goto(new URL(href, base).href, { waitUntil: 'load' });
    /** @type {Map<string, { first: string, second: string }>} */
    const out = new Map();
    for (const theme of themes) {
        const blocks = await page.evaluate(PREPARE, { base, theme, only });
        for (const block of blocks) {
            // The block alone on the page and the page at its top, so it sits
            // where it sat on the other side of the comparison: a theme's
            // texture is drawn against the page, and a block that moved down
            // because another was added above it would read as changed.
            // The page's head goes as well (its title, intro and list of
            // blocks): a block added to a page adds a line to that list, and
            // every block under it moved down by a line, which read as changed
            // in the themes whose texture is drawn against the page and, by a
            // device pixel of rounding, in others (2026-10-04: field.html in
            // cyberpunk, retro and synthwave; table.html in 16 themes; every
            // older block of data.html and page.html).
            await page.evaluate((id) => {
                for (const section of document.querySelectorAll('.cat-block[id], main section[id]'))
                    /** @type {HTMLElement} */ (section).hidden = section.id !== id && !section.contains(document.getElementById(id));
                const own = document.getElementById(id);
                const main = own?.closest('main');
                if (main && own)
                    for (const el of main.children)
                        if (!el.matches('section') && !el.contains(own))
                            /** @type {HTMLElement} */ (el).style.setProperty('display', 'none', 'important');
                window.scrollTo(0, 0);
            }, block.id);
            const parts = block.stages > 0 ? page.locator(`[id="${block.id}"] .cat-stage`) : page.locator(`[id="${block.id}"]`);
            const shot = async () => {
                const hash = createHash('sha256');
                const count = await parts.count();
                for (let i = 0; i < count; i += 1) {
                    const part = parts.nth(i);
                    // From the top every time, so a stage is scrolled to the
                    // same place in each reading: a tooltip or a dialog is
                    // placed against the window, not the page.
                    await page.evaluate(() => window.scrollTo(0, 0));
                    await part.scrollIntoViewIfNeeded().catch(() => {});
                    hash.update(await part.screenshot({ animations: 'disabled', caret: 'hide', timeout: 15_000 }));
                }
                return hash.digest('hex');
            };
            const first = await shot();
            // The second reading only when asked: a pair whose two sides
            // already agree has shown it holds still [scope-138].
            let second = first;
            if (repeat) {
                await page.waitForTimeout(250);
                second = await shot();
            }
            out.set(`${block.key}|${theme}`, { first, second });
        }
    }
    return out;
}

/**
 * What the review shell (catalogue/*.css and *.js, the frame every block sits
 * in) does to each block, as one digest per block: the block's markup once
 * its page's scripts ran, its size, and every rule of a shell stylesheet that
 * matches the block, anything inside it, or any element around it, with the
 * at-rules it sits in. Rules that match no element (keyframes, faces) count
 * for every block. A shell file that moved without changing a block's print
 * cannot have changed its pixels, so the block is not photographed for it
 * (Kenny, 2026-10-03: a release photographed every pair, 12 min 42 s,
 * because the navigation list and the review dialog moved).
 * @param {import('@playwright/test').Page} page
 * @param {{ base: string, href: string, theme: string, width: number, height?: number, only?: string[] | null }} options
 * @returns {Promise<Map<string, string>>} block key -> digest
 */
export async function printShell(page, { base, href, theme, width, height = 1000, only = null }) {
    const { createHash } = await import('node:crypto');
    await page.setViewportSize({ width, height });
    await page.goto(new URL(href, base).href, { waitUntil: 'load' });
    const blocks = await page.evaluate(PREPARE, { base, theme, only });
    const prints = await page.evaluate(
        ({ ids }) => {
            const isShell = (/** @type {CSSStyleSheet} */ sheet) => !!sheet.href && /\/catalogue\/[^/]+\.css$/.test(new URL(sheet.href).pathname);
            /** @type {{ text: string, test: string[] | null }[]} */
            const rules = [];
            const grouping = (/** @type {CSSRule} */ rule) =>
                rule instanceof CSSMediaRule ||
                rule instanceof CSSSupportsRule ||
                rule instanceof CSSLayerBlockRule ||
                rule instanceof CSSContainerRule;
            // A selector made testable: pseudo-elements dropped (a rule on
            // ::before reaches the element that carries it). State
            // pseudo-classes stay: the photograph is taken at rest.
            const testable = (/** @type {string} */ selector) =>
                selector
                    .split(/,(?![^(]*\))/)
                    .map(
                        (one) =>
                            one
                                .replace(
                                    /::?(before|after|marker|placeholder|backdrop|selection|first-line|first-letter|file-selector-button|-[a-z-]+)(\([^)]*\))?/g,
                                    '',
                                )
                                .trim() || '*',
                    );
            const walk = (/** @type {CSSRuleList} */ list, /** @type {string} */ around, /** @type {string} */ parent) => {
                for (const rule of list) {
                    if (rule instanceof CSSStyleRule) {
                        const selector = parent ? rule.selectorText.replace(/&/g, `:is(${parent})`) : rule.selectorText;
                        rules.push({ text: `${around}${rule.cssText}`, test: testable(selector) });
                        if (rule.cssRules?.length) walk(rule.cssRules, `${around}${rule.selectorText}{`, selector);
                    } else if (grouping(rule)) {
                        const head = rule.cssText.slice(0, rule.cssText.indexOf('{'));
                        walk(/** @type {CSSGroupingRule} */ (rule).cssRules, `${around}${head}{`, parent);
                    } else rules.push({ text: `${around}${rule.cssText}`, test: null });
                }
            };
            for (const sheet of [...document.styleSheets].filter(isShell)) walk(sheet.cssRules, '', '');
            const everyone = rules.filter((r) => r.test === null).map((r) => r.text);
            const matches = (/** @type {Element} */ el, /** @type {string[]} */ test) =>
                test.some((one) => {
                    try {
                        return el.matches(one);
                    } catch {
                        return true;
                    }
                });
            /** @type {Record<string, string[]>} */
            const out = {};
            // The reviewer's panel is hidden in the photographs (PREPARE), and
            // it reads the verdicts, which differ between any two commits.
            const PANEL = '.cat-look, .cat-feedback-field, .cat-approval, .cat-judge';
            for (const id of ids) {
                const block = document.getElementById(id);
                if (!block) continue;
                /** @type {Element[]} */
                const around = [];
                for (let up = block.parentElement; up; up = up.parentElement) around.push(up);
                const els = [block, ...[...block.querySelectorAll('*')].filter((el) => !el.closest(PANEL)), ...around];
                const rect = block.getBoundingClientRect();
                const copy = /** @type {Element} */ (block.cloneNode(true));
                for (const el of copy.querySelectorAll(PANEL)) el.remove();
                out[id] = [
                    copy.outerHTML,
                    `${Math.round(rect.width * 100)}x${Math.round(rect.height * 100)}`,
                    ...around.map((el) => `${el.tagName}${[...el.attributes].map((a) => ` ${a.name}=${a.value}`).join('')}`),
                    ...els.map(
                        (el, i) =>
                            `${i}:${rules
                                .filter((r) => r.test && matches(el, r.test))
                                .map((r) => r.text)
                                .join('\n')}`,
                    ),
                    ...everyone,
                ];
            }
            return out;
        },
        { ids: blocks.map((b) => b.id) },
    );
    /** @type {Map<string, string>} */
    const out = new Map();
    for (const block of blocks) {
        const parts = prints[block.id];
        if (!parts) continue;
        const hash = createHash('sha256');
        for (const part of parts) hash.update(`${part}\n`);
        out.set(block.key, hash.digest('hex'));
    }
    return out;
}
