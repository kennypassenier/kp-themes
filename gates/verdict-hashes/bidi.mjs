// A WebDriver-BiDi client for Gecko, and the first-difference reporter used to explain mismatches.

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { IN_PAGE } from './measure.mjs';
/** @typedef {import('./types.mjs').Measure} Measure */
/** @typedef {import('./types.mjs').PageReading} PageReading */

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
