// Hashing review blocks outside a reviewer's browser: a static server over a
// checkout, a browser page per review page, and the block hash of
// catalogue/block-hash.js read exactly the way the review pages read it.
//
// Used by gates/verdicts.mjs (rehash, and the browser comparison). The
// server takes overrides, so a checkout of an old commit can be served with
// the CURRENT block-hash.js in place of its own: the hash of a block as it
// looked then, under the recipe of now.
import { createServer } from 'node:http';
import { readFile, stat, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/**
 * @typedef {{ base: string, href: string, themes: string[], width: number, height?: number, withLines?: boolean, only?: string[] | null }} Measure
 * @typedef {{ key: string, title: string, hash: string, lines?: string[] }} Reading
 * @typedef {{ page: string, hashVersion: number | null, engine: string, width: number, results: Record<string, Reading[]> }} PageReading
 */

/** @type {Record<string, string>} */
const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.woff2': 'font/woff2',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
};

/**
 * Serve `root` read-only on a free port of 127.0.0.1.
 * @param {string} root an absolute directory
 * @param {Record<string, string>} [overrides] repository path (`catalogue/block-hash.js`) -> content served instead
 * @returns {Promise<{ base: string, close: () => Promise<void> }>}
 */
export async function serve(root, overrides = {}) {
    const clean = root.replace(/\/$/, '');
    const server = createServer(async (req, res) => {
        const relative = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^\/+/, '');
        const path = join(clean, relative);
        if (!path.startsWith(clean)) {
            res.writeHead(403).end('forbidden');
            return;
        }
        const type = TYPES[extname(path)] ?? 'application/octet-stream';
        if (relative in overrides) {
            res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }).end(overrides[relative]);
            return;
        }
        try {
            if ((await stat(path)).isDirectory()) throw new Error('directory');
            res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }).end(await readFile(path));
        } catch {
            res.writeHead(404).end('not found');
        }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
    const address = /** @type {import('node:net').AddressInfo} */ (server.address());
    return {
        base: `http://127.0.0.1:${address.port}/`,
        close: () =>
            new Promise((resolve) => {
                server.closeAllConnections?.();
                server.close(() => resolve(undefined));
            }),
    };
}

/**
 * The review pages that judge blocks of their own, at a checkout: every
 * component page and every research demo in its catalogue/pages.js.
 * @param {string} root
 * @returns {Promise<{ href: string, label: string, component: boolean }[]>}
 */
export async function blockPages(root) {
    /** @type {{ PAGES: { pages: { href: string, label: string, component?: boolean }[] }[] }} */
    const { PAGES } = await import(`${pathToFileURL(join(root, 'catalogue/pages.js')).href}?t=${Date.now()}`);
    return PAGES.flatMap((group) => group.pages)
        .filter((page) => page.component || page.href.startsWith('research/'))
        .map((page) => ({ href: page.href, label: page.label, component: Boolean(page.component) }));
}

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
                        if (!el.matches('section') && !el.contains(own)) /** @type {HTMLElement} */ (el).style.setProperty('display', 'none', 'important');
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
                rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule || rule instanceof CSSLayerBlockRule || rule instanceof CSSContainerRule;
            // A selector made testable: pseudo-elements dropped (a rule on
            // ::before reaches the element that carries it). State
            // pseudo-classes stay: the photograph is taken at rest.
            const testable = (/** @type {string} */ selector) =>
                selector
                    .split(/,(?![^(]*\))/)
                    .map((one) => one.replace(/::?(before|after|marker|placeholder|backdrop|selection|first-line|first-letter|file-selector-button|-[a-z-]+)(\([^)]*\))?/g, '').trim() || '*');
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
                    ...els.map((el, i) => `${i}:${rules.filter((r) => r.test && matches(el, r.test)).map((r) => r.text).join('\n')}`),
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

/**
 * A Gecko build Playwright cannot drive with its own protocol (FireDragon:
 * Playwright's BiDi launcher opens a window, which the remote agent refuses
 * outside Firefox proper), driven over WebDriver BiDi directly: the tab the
 * browser starts with, navigated, sized and evaluated in. A temporary
 * profile, the browser's own defaults otherwise; stopped by its own PID.
 */
export class BidiGecko {
    /** @param {string} executable */
    static async launch(executable) {
        const profile = await mkdtemp(join(tmpdir(), 'kp-verdicts-gecko-'));
        await writeFile(
            join(profile, 'user.js'),
            [
                'user_pref("browser.shell.checkDefaultBrowser", false);',
                'user_pref("browser.startup.homepage_override.mstone", "ignore");',
                'user_pref("browser.aboutwelcome.enabled", false);',
                'user_pref("datareporting.policy.dataSubmissionEnabled", false);',
            ].join('\n'),
        );
        const child = spawn(executable, ['--headless', '--remote-debugging-port=0', '--no-remote', '--profile', profile], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        /** @type {string} */
        const url = await new Promise((resolve, reject) => {
            let log = '';
            const timer = setTimeout(() => reject(new Error(`no BiDi endpoint from ${executable}:\n${log}`)), 60_000);
            const onData = (/** @type {Buffer} */ chunk) => {
                log += chunk;
                const match = /WebDriver BiDi listening on (ws:\/\/\S+)/.exec(log);
                if (match) {
                    clearTimeout(timer);
                    resolve(match[1]);
                }
            };
            child.stderr.on('data', onData);
            child.stdout.on('data', onData);
            child.on('exit', (code) => reject(new Error(`${executable} exited with ${code}:\n${log}`)));
        });
        const gecko = new BidiGecko(child, profile);
        await gecko.connect(`${url}/session`);
        return gecko;
    }

    /**
     * @param {import('node:child_process').ChildProcess} child
     * @param {string} profile
     */
    constructor(child, profile) {
        this.child = child;
        this.profile = profile;
        this.next = 1;
        /** @type {Map<number, { resolve: (value: any) => void, reject: (error: Error) => void }>} */
        this.waiting = new Map();
        /** @type {WebSocket | null} */
        this.socket = null;
        this.context = '';
        this.version = '';
        this.sized = '';
    }

    /** @param {string} url */
    async connect(url) {
        const socket = new WebSocket(url);
        this.socket = socket;
        await new Promise((resolve, reject) => {
            socket.addEventListener('open', resolve, { once: true });
            socket.addEventListener('error', reject, { once: true });
        });
        socket.addEventListener('message', (event) => {
            const message = JSON.parse(String(event.data));
            const waiter = message.id && this.waiting.get(message.id);
            if (!waiter) return;
            this.waiting.delete(message.id);
            if (message.type === 'error') waiter.reject(new Error(`${message.error}: ${message.message}`));
            else waiter.resolve(message.result);
        });
        const session = await this.send('session.new', { capabilities: {} });
        this.version = `${session.capabilities.browserName} ${session.capabilities.browserVersion}`;
        const tree = await this.send('browsingContext.getTree', {});
        this.context = tree.contexts[0].context;
    }

    /**
     * @param {string} method
     * @param {object} params
     * @returns {Promise<any>}
     */
    send(method, params) {
        const id = this.next++;
        this.socket?.send(JSON.stringify({ id, method, params }));
        return new Promise((resolve, reject) => this.waiting.set(id, { resolve, reject }));
    }

    /**
     * @param {Measure} measure
     * @returns {Promise<PageReading>}
     */
    async measure({ base, href, themes, width, height = 1000, withLines = false, only = null }) {
        // The tab starts on a privileged page, where the remote agent refuses
        // to size or evaluate: an ordinary page first, then the size, then the page.
        if (this.sized !== `${width}x${height}`) {
            await this.send('browsingContext.navigate', { context: this.context, url: base, wait: 'complete' });
            await this.send('browsingContext.setViewport', { context: this.context, viewport: { width, height } });
            this.sized = `${width}x${height}`;
        }
        await this.send('browsingContext.navigate', { context: this.context, url: new URL(href, base).href, wait: 'complete' });
        const argument = JSON.stringify({ base, themes, withLines, only });
        const result = await this.send('script.evaluate', {
            expression: `(${IN_PAGE.toString()})(${argument}).then((r) => JSON.stringify(r))`,
            target: { context: this.context },
            awaitPromise: true,
            resultOwnership: 'none',
        });
        if (result.type === 'exception') throw new Error(`${href}: ${result.exceptionDetails?.text}`);
        return JSON.parse(result.result.value);
    }

    async close() {
        try {
            await Promise.race([this.send('browser.close', {}), new Promise((resolve) => setTimeout(resolve, 5000))]);
        } catch {
            /* the socket closes with the browser */
        }
        // By its own PID only, and only if it is still there.
        if (this.child.exitCode === null) this.child.kill('SIGTERM');
        await new Promise((resolve) => (this.child.exitCode === null ? this.child.on('exit', resolve) : resolve(undefined)));
        await rm(this.profile, { recursive: true, force: true });
    }
}

/**
 * The first place two readings of one block part: the markup, the element
 * count, or the element line and its properties.
 * @param {string[]} a
 * @param {string[]} b
 * @param {string[]} props
 */
export function firstDifference(a, b, props) {
    if (a[0] !== b[0]) return 'the markup';
    if (a.length !== b.length) return `the element count, ${a.length - 1} vs ${b.length - 1}`;
    for (let i = 1; i < a.length; i += 1) {
        if (a[i] === b[i]) continue;
        const x = a[i].split('|');
        const y = b[i].split('|');
        const p = props.findIndex((_, n) => x[n] !== y[n]);
        return `line ${i}, ${props[p]}: ${x[p]} vs ${y[p]}`;
    }
    return 'nothing';
}
