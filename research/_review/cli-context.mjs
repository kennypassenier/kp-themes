// Shared command-line context of the measuring CLIs (measure-gaps.mjs, measure-states.mjs, measure-align.mjs): where the page
// is, how to log in and which served assets to swap for this checkout [measure-login-1019, gap http-switchboard 37]. An app
// behind a login, or one that serves its own old copy of kp-themes, is measured without a hand-written wrapper.
//
// Options (any CLI that imports this; values as `--name value` or `--name=value`):
//   --url <page url>          The page to measure, full URL (https://host/path/page.html). Replaces the `<port> <page>`
//                             pair: the remaining positionals are then [themes] [widths] (measure-align: and ids).
//                             `?theme=<t>` is appended to it.
//   --cookie name=value       A cookie sent with every request (repeatable), set on the page's origin.
//   --login-form url,userField,passField,submitSelector
//                             Log in once through a form before measuring: the login page (absolute, or relative to the page's
//                             origin), the user and password fields (a name, an id, or a CSS selector) and the submit button's
//                             selector (it may hold commas). The credentials come from the environment, never from argv:
//                             KP_LOGIN_USER and KP_LOGIN_PASS, or the variables named by --login-env USERVAR,PASSVAR. Neither
//                             is printed.
//   --storage-state <file>    A Playwright storageState file (cookies + localStorage) every page starts from, so a login can
//                             be reused. With --login-form the file is written after the login (mode 600) instead, and read
//                             by the next run: pass both and the form is only used while the file is absent.
//   --assets-from <prefix>=<dir>
//                             Serve every request whose path starts with <prefix> from <dir> (repeatable), through
//                             context.route, with the right content type: `/static/kp=$HOME/Projects/kp-themes`
//                             measures the app against this checkout. A path with no such file falls through to the app.
//   --ignore-https-errors     Accept a self-signed certificate.
//   --no-drive                (measure-states only) skip the driven half.
// No eval is used anywhere: only the page's own CSP-safe scripts run in the page.
import { createRequire } from 'node:module';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const require = createRequire(`${process.env.HOME}/Projects/kp-themes/node_modules/`);

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.txt': 'text/plain; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.wasm': 'application/wasm',
};

const VALUE_OPTIONS = ['url', 'cookie', 'login-form', 'login-env', 'storage-state', 'assets-from', 'items'];
const FLAG_OPTIONS = ['ignore-https-errors', 'no-drive'];

/**
 * Splits argv into positionals and the shared options.
 * @param {string[]} argv
 * @returns {{ positional: string[], opts: { url: string, cookies: string[], loginForm: string, loginEnv: string, storageState: string,
 *   assets: string[], items: string, ignoreHttpsErrors: boolean, noDrive: boolean } }}
 */
export function parseArgs(argv) {
    /** @type {string[]} */
    const positional = [];
    /** @type {Record<string, string[]>} */
    const values = {};
    const flags = new Set();
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (!a.startsWith('--')) {
            positional.push(a);
            continue;
        }
        const eq = a.indexOf('=');
        const name = a.slice(2, eq < 0 ? undefined : eq);
        if (FLAG_OPTIONS.includes(name)) flags.add(name);
        else if (VALUE_OPTIONS.includes(name)) {
            const v = eq < 0 ? argv[++i] : a.slice(eq + 1);
            if (v === undefined) throw new Error(`--${name} needs a value`);
            (values[name] ??= []).push(v);
        } else throw new Error(`unknown option --${name}`);
    }
    return {
        positional,
        opts: {
            url: values.url?.[0] ?? '',
            cookies: values.cookie ?? [],
            loginForm: values['login-form']?.[0] ?? '',
            loginEnv: values['login-env']?.[0] ?? 'KP_LOGIN_USER,KP_LOGIN_PASS',
            storageState: values['storage-state']?.[0] ?? '',
            assets: values['assets-from'] ?? [],
            items: values.items?.[0] ?? '',
            ignoreHttpsErrors: flags.has('ignore-https-errors'),
            noDrive: flags.has('no-drive'),
        },
    };
}

/**
 * The page's address for a theme, and the positionals left after the page itself.
 * @param {string[]} positional
 * @param {ReturnType<typeof parseArgs>['opts']} opts
 * @returns {{ page: string, rest: string[], label: string, urlFor: (theme: string) => string }}
 */
export function locate(positional, opts) {
    let page;
    let rest;
    let label;
    if (opts.url) {
        page = opts.url;
        rest = positional;
        label = opts.url;
    } else {
        const [port, path, ...more] = positional;
        if (!port || !path) return { page: '', rest: [], label: '', urlFor: () => '' };
        page = `http://127.0.0.1:${port}/${path}`;
        rest = more;
        label = `${path} on port ${port}`;
    }
    const urlFor = (/** @type {string} */ theme) => `${page}${page.includes('?') ? '&' : '?'}theme=${theme}`;
    return { page, rest, label, urlFor };
}

/** @param {string} spec @param {string} origin */
function cookieOf(spec, origin) {
    const eq = spec.indexOf('=');
    if (eq < 1) throw new Error('--cookie wants name=value');
    return { name: spec.slice(0, eq), value: spec.slice(eq + 1), url: origin };
}

/** @param {string} field */
function selectorOf(field) {
    return /^[\w-]+$/.test(field) ? `[name="${field}"], #${field}` : field;
}

/**
 * Launches Firefox and returns a browser whose newPage() carries the context options: login, cookies, asset overrides and
 * the HTTPS setting. It has the parts of Browser the measures use (newPage, close); a page's close() closes its context.
 * @param {string} origin the page's origin, for cookies and a relative login url
 * @param {ReturnType<typeof parseArgs>['opts']} opts
 */
export async function launch(origin, opts) {
    const { firefox } = require('playwright-core');
    const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
    const overrides = opts.assets.map((spec) => {
        const eq = spec.indexOf('=');
        if (eq < 1) throw new Error('--assets-from wants <prefix>=<dir>');
        const dir = resolve(spec.slice(eq + 1));
        if (!existsSync(dir)) throw new Error(`--assets-from: ${dir} does not exist`);
        return { prefix: '/' + spec.slice(0, eq).replace(/^\/+|\/+$/g, ''), dir };
    });
    const served = new Map();
    /** @type {import('playwright-core').BrowserContextOptions['storageState']} */
    let state = opts.storageState && existsSync(opts.storageState) ? opts.storageState : undefined;

    async function login() {
        const [loginUrl, userField, passField, ...submit] = opts.loginForm.split(',');
        const submitSel = submit.join(',');
        if (!loginUrl || !userField || !passField || !submitSel) throw new Error('--login-form wants url,userField,passField,submitSelector');
        const [userVar, passVar] = opts.loginEnv.split(',');
        const user = process.env[userVar];
        const pass = process.env[passVar];
        if (user === undefined || pass === undefined) throw new Error(`--login-form: set ${userVar} and ${passVar} in the environment`);
        const context = await browser.newContext({ ignoreHTTPSErrors: opts.ignoreHttpsErrors });
        const page = await context.newPage();
        await page.goto(new URL(loginUrl, origin + '/').href);
        await page.locator(selectorOf(userField)).first().fill(user);
        await page.locator(selectorOf(passField)).first().fill(pass);
        await Promise.all([page.waitForLoadState('load').catch(() => undefined), page.locator(submitSel).first().click()]);
        await page.waitForLoadState('networkidle').catch(() => undefined);
        const st = await context.storageState();
        await context.close();
        if (opts.storageState) writeFileSync(opts.storageState, JSON.stringify(st), { mode: 0o600 });
        return st;
    }

    return {
        /** @param {import('playwright-core').BrowserContextOptions} [options] */
        async newPage(options = {}) {
            if (!state && opts.loginForm) state = await login();
            const context = await browser.newContext({
                ...options,
                ignoreHTTPSErrors: opts.ignoreHttpsErrors,
                ...(state ? { storageState: state } : {}),
            });
            if (opts.cookies.length) await context.addCookies(opts.cookies.map((c) => cookieOf(c, origin)));
            if (overrides.length)
                await context.route('**/*', (route) => {
                    const path = decodeURIComponent(new URL(route.request().url()).pathname);
                    for (const { prefix, dir } of overrides) {
                        if (path !== prefix && !path.startsWith(prefix + '/')) continue;
                        const file = join(dir, normalize('/' + path.slice(prefix.length)));
                        if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile()) continue;
                        served.set(path, file);
                        return route.fulfill({
                            status: 200,
                            body: readFileSync(file),
                            headers: { 'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream', 'cache-control': 'no-store' },
                        });
                    }
                    return route.fallback();
                });
            const page = await context.newPage();
            // An app has no review sections: --items '<selector>' marks every match as one (data-review-item = its id, else
            // its place), as it is drawn, so the measures run on an app's own sections.
            if (opts.items)
                await page.addInitScript((sel) => {
                    let n = 0;
                    const mark = () => {
                        for (const el of document.querySelectorAll(sel))
                            if (!el.hasAttribute('data-review-item')) el.setAttribute('data-review-item', el.id || `item-${++n}`);
                    };
                    new MutationObserver(mark).observe(document, { childList: true, subtree: true });
                    document.addEventListener('DOMContentLoaded', mark);
                }, opts.items);
            const close = page.close.bind(page);
            page.close = async (o) => {
                await close(o);
                await context.close();
            };
            return page;
        },
        /** Paths answered from a local directory so far (a proof for the report). */
        served: () => [...served.keys()],
        close: () => browser.close(),
    };
}

/** The usage line tail all three CLIs share. */
export const OPTIONS_USAGE =
    '[--url <page url>] [--cookie n=v] [--login-form url,user,pass,submit] [--storage-state f] [--assets-from /prefix=<dir>] [--items <selector>] [--ignore-https-errors]';
