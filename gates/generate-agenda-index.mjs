// catalogue/agenda-index.json: everything the Agenda needs to know on its first view, in one file (Kenny,
// 2026-10-19 05:19: "247 is nog altijd belachelijk veel?" — the Agenda read every demo page, its scripts, its sheet
// and its update, every component page and every theme register, about 250 requests, to draw one list).
//
//   demos    per research demo the Agenda lists (pages.js "Research to look at", not in rework): the facts of its
//            markup (progress.js factsOf, read here by gates/html-facts.mjs), its fingerprint (progress.js
//            fingerprintOf, the same function over the same texts) and its update.json as loadUpdate reads it.
//            A demo the scanner cannot read exactly is left out, and the Agenda reads that one live.
//   decided  per archived demo, its decided.json as waiting.js readDecided reads it.
//   pixels   the pixel checks that can reopen a pair (judgements.js pixelsReopened): the run's commit and time and
//            the checks whose state is reopened or unstable. A carried check never reopens anything.
//   blocks   per catalogue block its verdict key, its hash, the theme it fixes for itself and its title (open-pairs.js
//            gatherBlocks), read in Firefox, since the hash is the browser's serialisation of the markup. `inputs`
//            is a digest of the files that decide them; while it holds, the list is kept and no browser starts.
//
// The Agenda falls back to the live read for anything the index does not hold. The gate keeps it current:
//
//   node gates/generate-agenda-index.mjs            write catalogue/agenda-index.json (Firefox only when blocks moved)
//   node gates/generate-agenda-index.mjs --blocks   the same, reading the blocks in Firefox again in any case
//   node gates/generate-agenda-index.mjs --check    refuse when it is stale (no browser)
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import * as prettier from 'prettier';
import { factsFromHtml } from './html-facts.mjs';
// The browser's own modules, imported by address as the other gates import pages.js (check-verdicts.mjs), so the type
// check of gates/ does not take them in.
/** @type {{ PAGES: { group: string, pages: { href: string, label: string, rework?: string }[] }[], COMPONENT_PAGES: { href: string, label: string }[] }} */
const { PAGES, COMPONENT_PAGES } = await import(new URL('../catalogue/pages.js', import.meta.url).href);
/** @type {{ fingerprintFrom: (text: string, files: string[]) => Promise<string>, ownFilesOf: (links: string[], page: string | URL) => string[] }} */
const { fingerprintFrom, ownFilesOf } = await import(new URL('../research/_review/progress.js', import.meta.url).href);

const root = new URL('../', import.meta.url);
export const AGENDA_INDEX = 'catalogue/agenda-index.json';
/** A base the page addresses resolve against, as the browser resolves them against the site. */
const SITE = 'http://index.invalid/';

/** A file's text as fetch().text() gives it (UTF-8, without a byte order mark), or null when there is none. */
function text(/** @type {string} */ path) {
    const file = new URL(path, root);
    if (!existsSync(file) || !statSync(file).isFile()) return null;
    return readFileSync(file, 'utf8').replace(/^﻿/, '');
}

/** The repository path of an address on the site, or null outside it. @param {string} href */
const pathOf = (href) => {
    const url = new URL(href);
    return url.origin === new URL(SITE).origin ? decodeURIComponent(url.pathname.slice(1)) : null;
};

/** loadUpdate's reading of a demo's update.json. @param {string} path */
function updateOf(path) {
    const raw = text(path);
    if (raw === null) return null;
    try {
        const data = JSON.parse(raw);
        const update = Number(data?.update);
        if (!update) return null;
        return { update, picks: data.picks || {}, questions: data.questions || {} };
    } catch {
        return null;
    }
}

/** readDecided's reading of an archived demo's decided.json. @param {string} path */
function decidedOf(path) {
    const raw = text(path);
    if (raw === null) return '';
    try {
        return String(JSON.parse(raw)?.decided || 'Decided; see its decided.json.');
    } catch {
        return '';
    }
}

/** One demo's entry, or null when the scanner does not read it exactly (the Agenda then reads it live). */
async function demoEntry(/** @type {string} */ href) {
    const html = text(href);
    if (html === null) return null;
    const read = factsFromHtml(html);
    if (!read) return null;
    const page = new URL(href, SITE);
    const own = ownFilesOf(read.links, page);
    const files = own.map((file) => {
        const path = pathOf(file);
        return path === null ? null : text(path);
    });
    // A linked file that is not there reads as the server's error page in the browser: left to the live read.
    if (files.some((file) => file === null)) return null;
    return {
        facts: read.facts,
        fingerprint: await fingerprintFrom(html, /** @type {string[]} */ (files)),
        update: updateOf(/** @type {string} */ (pathOf(new URL('update.json', page).href))),
    };
}

/** The pixel checks that can reopen a pair, as judgements.js reads them. */
function pixelsOf() {
    const raw = text('catalogue/pixel-checks.json');
    /** @type {{ commit?: string, checked?: string, checks: Record<string, any> }} */
    const out = { checks: {} };
    if (raw === null) return out;
    let data;
    try {
        data = JSON.parse(raw);
    } catch {
        return out;
    }
    if (!data || typeof data.checks !== 'object') return out;
    if (data.commit !== undefined) out.commit = data.commit;
    if (data.checked !== undefined) out.checked = data.checked;
    for (const [key, themes] of Object.entries(data.checks ?? {}))
        for (const [theme, engines] of Object.entries(themes ?? {}))
            for (const [engine, check] of Object.entries(engines ?? {}))
                if (['reopened', 'unstable'].includes(check?.state ?? '')) ((out.checks[key] ??= {})[theme] ??= {})[engine] = check;
    return out;
}

/** The files that decide the catalogue blocks' keys and hashes. */
export function blockInputs() {
    const hash = createHash('sha256');
    const parts = [
        JSON.stringify(COMPONENT_PAGES.map((page) => [page.href, page.label])),
        ...COMPONENT_PAGES.map((page) => `${page.href}\0${text(page.href)}`),
        ...['catalogue/block-hash.js', 'catalogue/review.js', 'catalogue/review-state.js', 'catalogue/open-pairs.js'].map((f) => `${f}\0${text(f)}`),
    ];
    for (const part of parts) hash.update(`${part}\n`);
    return hash.digest('hex').slice(0, 16);
}

/** Every catalogue block read the way the Agenda reads it (open-pairs.js gatherBlocks), in Firefox. */
async function readBlocksInFirefox() {
    const { firefox } = await import('playwright');
    const { serve } = await import('./verdict-hashes.mjs');
    const page = 'catalogue/__agenda-index.html';
    const server = await serve(fileURLToPath(root), {
        [page]: `<!doctype html><html><head><meta charset="utf-8"></head><body><script type="module">
            import { gatherBlocks } from './open-pairs.js';
            import { ENGINE } from './engine.js';
            const { blocks } = await gatherBlocks();
            window.__blocks = { engine: ENGINE, list: blocks.map((b) => [b.id, b.hash, b.fixed, b.title]) };
        </script></body></html>`,
    });
    const browser = await firefox.launch();
    try {
        const tab = await browser.newPage();
        await tab.goto(`${server.base}${page}`);
        await tab.waitForFunction(() => /** @type {any} */ (window).__blocks, null, { timeout: 120000 });
        return /** @type {{ engine: string, list: [string, string, string | null, string][] }} */ (
            await tab.evaluate(() => /** @type {any} */ (window).__blocks)
        );
    } finally {
        await browser.close();
        await server.close();
    }
}

/** The pages the Agenda reads. */
function agendaPages() {
    const listed = PAGES.find((group) => group.group === 'Research to look at')?.pages ?? [];
    const archived = PAGES.find((group) => group.group === 'Archived research')?.pages ?? [];
    return { waiting: listed.filter((page) => !page.rework), archived };
}

/**
 * The index, with the blocks part taken from `previous` while its inputs hold.
 * @param {any} previous  the index on disk, or null
 * @param {{ browser: boolean }} options  false: never start Firefox (the blocks part is then null when stale)
 */
export async function agendaIndex(previous, { browser }) {
    const { waiting, archived } = agendaPages();
    /** @type {Record<string, any>} */
    const demos = {};
    for (const page of waiting) {
        const entry = await demoEntry(page.href);
        if (entry) demos[page.href] = entry;
    }
    /** @type {Record<string, string>} */
    const decided = {};
    for (const page of archived)
        decided[page.href] = decidedOf(/** @type {string} */ (pathOf(new URL('decided.json', new URL(page.href, SITE)).href)));
    const inputs = blockInputs();
    let blocks = previous?.blocks?.inputs === inputs ? previous.blocks : null;
    if (!blocks && browser) blocks = { inputs, ...(await readBlocksInFirefox()) };
    return {
        $comment:
            'What the Agenda (catalogue/agenda.html) reads on its first view, in one file: per demo its facts, fingerprint and update, per archived demo its decision, the pixel checks that reopen, and every catalogue block with its hash. ' +
            'Written by node gates/generate-agenda-index.mjs; the gate refuses a commit that leaves it stale. Anything missing here is read live.',
        demos,
        decided,
        pixels: pixelsOf(),
        blocks,
    };
}

/** The index as it is on disk, parsed, or null. */
function onDisk() {
    const file = new URL(AGENDA_INDEX, root);
    const there = existsSync(file) ? readFileSync(file, 'utf8') : '';
    try {
        return { there, previous: there ? JSON.parse(there) : null };
    } catch {
        return { there, previous: null };
    }
}

/** The index formatted as prettier writes it, so --check and prettier --write agree. @param {any} index */
async function formatted(index) {
    const options = (await prettier.resolveConfig(fileURLToPath(new URL(AGENDA_INDEX, root)))) ?? {};
    return prettier.format(JSON.stringify(index), { ...options, parser: 'json' });
}

/**
 * Write catalogue/agenda-index.json (gates/verdicts.mjs pixels calls this after writing the pixel checks).
 * @param {{ blocks?: boolean }} [options]  blocks: read the blocks again in Firefox even when their inputs held
 * @returns {Promise<string>} a line saying what was written
 */
export async function writeAgendaIndex({ blocks = false } = {}) {
    const { previous } = onDisk();
    const index = await agendaIndex(blocks ? null : previous, { browser: true });
    writeFileSync(fileURLToPath(new URL(AGENDA_INDEX, root)), await formatted(index));
    const left = agendaPages().waiting.filter((page) => !(page.href in index.demos));
    return `${AGENDA_INDEX}: written, ${Object.keys(index.demos).length} demos, ${index.blocks?.list.length ?? 0} blocks${left.length ? `; read live: ${left.map((p) => p.href).join(', ')}` : ''}.`;
}

async function main() {
    if (!process.argv.includes('--check')) {
        console.log(await writeAgendaIndex({ blocks: process.argv.includes('--blocks') }));
        return;
    }
    const { there, previous } = onDisk();
    const index = await agendaIndex(previous, { browser: false });
    if (!index.blocks || there !== (await formatted(index))) {
        const why = !index.blocks ? 'the catalogue blocks moved' : 'a demo, an update, a decision or the pixel checks moved';
        console.error(`${AGENDA_INDEX} is stale (${why}); run node gates/generate-agenda-index.mjs and commit it with the change`);
        process.exit(1);
    }
    console.log(
        `agenda index: ${Object.keys(index.demos).length} demos, ${Object.keys(index.decided).length} decisions, ${index.blocks.list.length} blocks, current.`,
    );
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
