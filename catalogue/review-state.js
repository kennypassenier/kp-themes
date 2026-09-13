// What a reviewer leaves behind, across every review page: the notes, the
// titles of the blocks they belong to, which verdicts and notes were already
// passed on in a copied prompt, and the one prompt built from all of it.
// No DOM here beyond what a prompt needs to know about the page on screen;
// the panels (judging.js) and the prompt bars (prompt.js) sit on top.
//
// Kenny, 2026-09-13: "Ik wil van pagina naar pagina kunnen gaan en toch die
// prompts behouden" — so the prompt covers every page, not the one on screen.
import { THEMES } from '../js/theme-registry.js';
import { currentTheme } from '../js/theme-core.js';
import { COMPONENT_PAGES, PAGES } from './pages.js';
import { JUDGEMENTS_KEY, loadJudgements, verdictOf } from './judgements.js';
import { HASH_VERSION } from './block-hash.js';
import { ENGINE, engineLabel } from './engine.js';

export const FEEDBACK_KEY = 'kp-catalogue-feedback:v1';
/** The titles of blocks, stored as a page mounts them: { page: { block: title } }. */
export const TITLES_KEY = 'kp-catalogue-titles:v1';
/** Every signature that was in a copied prompt, one set for every page. */
export const COPIED_KEY = 'kp-catalogue-copied:v2';
const COPIED_LEGACY = 'kp-catalogue-copied:v1';
/** Where every component block's notes live: the review page's keys. */
export const REVIEW_PAGE = 'catalogue/index.html';
export const NOTES_EVENT = 'cat-notes-change';
export const STORAGE_KEYS = [FEEDBACK_KEY, TITLES_KEY, COPIED_KEY, JUDGEMENTS_KEY];

const ROOT = new URL('../', import.meta.url);

/* ------------------------------------------------------------- storage */

// Every read and write is guarded: a private window or a browser that
// blocks site data must still get a working page, only without memory.
export function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

/** This document's path from the repository root, e.g. `catalogue/table.html`. */
export function pagePath() {
    return decodeURIComponent(location.pathname).slice(decodeURIComponent(ROOT.pathname).length);
}

export const slugOf = (href) =>
    href
        .split('/')
        .pop()
        .replace(/\.html$/, '');

export const themeLabel = (name) => THEMES.find((t) => t.name === name)?.label ?? name;

/* --------------------------------------------------------------- notes */

// A component page's notes used to be stored under its own path, and the
// review page's under `catalogue/index.html` with `slug--block`: the same
// block, two notes. Since 2026-09-13 all three places (component page,
// review page, compare column) share the review page's key, and a note left
// under the old key moves there on the first read.
function migrateNotes(all) {
    let moved = false;
    for (const page of COMPONENT_PAGES) {
        const old = all[page.href];
        if (!old) continue;
        const target = (all[REVIEW_PAGE] ??= {});
        for (const [block, themes] of Object.entries(old)) {
            const entry = (target[`${slugOf(page.href)}--${block}`] ??= {});
            for (const [theme, text] of Object.entries(themes)) {
                const here = entry[theme];
                // Neither note carries a time, so which is newer cannot be told.
                // Nothing is thrown away: one that contains the other is the
                // later edit of it; two different notes are kept both.
                if (!here?.trim() || text.includes(here)) entry[theme] = text;
                else if (!here.includes(text)) entry[theme] = `${here}\n${text}`;
            }
        }
        delete all[page.href];
        moved = true;
    }
    return moved;
}

/** @returns {Record<string, Record<string, Record<string, string>>>} page → block → theme → text */
export function allNotes() {
    const all = load(FEEDBACK_KEY, {});
    if (migrateNotes(all)) save(FEEDBACK_KEY, all);
    return all;
}

export const noteFor = (page, block, theme) => allNotes()[page]?.[block]?.[theme] ?? '';

export function setNote(page, block, theme, text) {
    const all = allNotes();
    const notes = (all[page] ??= {});
    const entry = (notes[block] ??= {});
    if (text.trim()) entry[theme] = text;
    else delete entry[theme];
    if (!Object.keys(entry).length) delete notes[block];
    if (!Object.keys(notes).length) delete all[page];
    const ok = save(FEEDBACK_KEY, all);
    document.dispatchEvent(new CustomEvent(NOTES_EVENT));
    return ok;
}

/* -------------------------------------------------------------- titles */

/** Remember the titles of the blocks a page mounted, so another page's prompt can name them. */
export function rememberTitles(page, titles) {
    const all = load(TITLES_KEY, {});
    const known = (all[page] ??= {});
    let changed = false;
    for (const [block, title] of Object.entries(titles)) {
        if (known[block] !== title) {
            known[block] = title;
            changed = true;
        }
    }
    if (changed) save(TITLES_KEY, all);
}

/* ---------------------------------------------------------- the prompt */

/** Which page and block a verdict key belongs to. */
export function verdictPlace(key) {
    const hash = key.indexOf('#');
    return hash === -1 ? { page: REVIEW_PAGE, block: key } : { page: key.slice(0, hash), block: key.slice(hash + 1) };
}

function copiedSignatures() {
    const current = load(COPIED_KEY, null);
    if (Array.isArray(current)) return new Set(current.map(withEngine));
    // One set per page before 2026-09-13. A note's signature then carried no
    // page, so the page is written into it; a component page's note moved to
    // the review page's key, and its signature moves with it.
    const legacy = load(COPIED_LEGACY, {});
    const set = new Set();
    for (const [page, signatures] of Object.entries(legacy)) {
        if (!Array.isArray(signatures)) continue;
        const component = COMPONENT_PAGES.find((p) => p.href === page);
        for (const signature of signatures ?? []) {
            if (!signature.startsWith('note|')) {
                set.add(signature);
                continue;
            }
            const rest = signature.slice('note|'.length);
            if (component) set.add(`note|${REVIEW_PAGE}|${slugOf(page)}--${rest}`);
            else set.add(`note|${page}|${rest}`);
        }
    }
    save(COPIED_KEY, [...set]);
    try {
        localStorage.removeItem(COPIED_LEGACY);
    } catch {
        /* nothing to tidy in a browser without storage */
    }
    return set;
}

// A verdict's signature carries its engine since verdicts are per engine
// (2026-09-13); one written before was this browser's, so it gains this
// browser's engine and a verdict already passed on is not passed on again.
function withEngine(signature) {
    const parts = signature.split('|');
    if (parts[0] !== 'verdict' || parts.length !== 5) return signature;
    return ['verdict', parts[1], parts[2], ENGINE, parts[3], parts[4]].join('|');
}

/**
 * Everything the prompt could say, from every page, each with the signature
 * that tells whether it was already in a copied prompt.
 * A verdict already in the register is not: it is recorded.
 * @returns {{ page: string, block: string, kind: 'note' | 'approved' | 'rejected', theme: string, engine?: string, text: string, signature: string, line?: string }[]}
 */
export function promptItems() {
    const titles = load(TITLES_KEY, {});
    const titleOf = (page, block) => titles[page]?.[block] ?? block;
    const items = [];
    for (const [page, blocks] of Object.entries(allNotes())) {
        for (const [block, themes] of Object.entries(blocks)) {
            for (const [theme, text] of Object.entries(themes)) {
                const line = text.trim().replace(/\n+/g, ' / ');
                items.push({
                    page,
                    block,
                    kind: 'note',
                    theme,
                    text: `- ${titleOf(page, block)} (#${block}): ${line}`,
                    signature: `note|${page}|${block}|${theme}|${line}`,
                });
            }
        }
    }
    const stored = loadJudgements();
    for (const [key, themes] of Object.entries(stored)) {
        const { page, block } = verdictPlace(key);
        // A panel on screen knows whether its block still looks as judged; in
        // the theme on screen a verdict on a block that changed since is stale.
        const panel = document.querySelector(`.cat-judge[data-cat-block="${CSS.escape(key)}"]`);
        for (const [theme, engines] of Object.entries(themes)) {
            for (const [engine, entry] of Object.entries(engines ?? {})) {
                const { verdict, hash, v } = entry;
                if (engine === ENGINE && panel?.getAttribute('data-cat-state') === 'changed' && theme === currentTheme()) continue;
                // Already kept in the register, or overruled by it: nothing to pass on.
                if (verdictOf(key, theme, engine, stored)?.source !== 'browser') continue;
                items.push({
                    page,
                    block,
                    kind: verdict === 'rejected' ? 'rejected' : 'approved',
                    theme,
                    engine,
                    text: titleOf(page, block),
                    signature: `verdict|${key}|${theme}|${engine}|${verdict}|${hash}`,
                    // Only a verdict taken with the recipe of now can be recorded.
                    line: v === HASH_VERSION ? [key, theme, engine, verdict, hash].join(' · ') : undefined,
                });
            }
        }
    }
    return items;
}

const PAGE_ORDER = PAGES.flatMap((group) => group.pages);

/** @returns {{ text: string, items: number, pages: number, total: number }} */
export function buildPrompt({ includeCopied = false } = {}) {
    const all = promptItems();
    const copied = copiedSignatures();
    const items = all.filter((item) => includeCopied || !copied.has(item.signature));
    const rank = (page) => {
        const i = PAGE_ORDER.findIndex((p) => p.href === page);
        return i === -1 ? PAGE_ORDER.length : i;
    };
    const pages = [...new Set(items.map((i) => i.page))].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
    const order = THEMES.map((t) => t.name);
    const lines = [];
    if (items.length) lines.push('Catalogue feedback');
    for (const page of pages) {
        const label = PAGE_ORDER.find((p) => p.href === page)?.label;
        lines.push('', `== ${label ? `${label} (${page})` : page}`);
        const onPage = items.filter((i) => i.page === page);
        const themes = [...new Set(onPage.map((i) => i.theme))].sort((a, b) => order.indexOf(a) - order.indexOf(b));
        for (const theme of themes) {
            const inTheme = onPage.filter((i) => i.theme === theme);
            lines.push('', `Theme ${themeLabel(theme)}:`);
            const engines = [...new Set(inTheme.filter((i) => i.engine).map((i) => i.engine))].sort();
            for (const engine of engines) {
                const of = (kind) => inTheme.filter((i) => i.engine === engine && i.kind === kind).map((i) => i.text);
                const [approved, rejected] = [of('approved'), of('rejected')];
                lines.push(`In ${engineLabel(engine)}:`);
                if (approved.length) lines.push(`Approved (${approved.length}): ${approved.join('; ')}`);
                if (rejected.length) lines.push(`Not approved (${rejected.length}): ${rejected.join('; ')}`);
            }
            const notes = inTheme.filter((i) => i.kind === 'note').map((i) => i.text);
            if (notes.length) lines.push('Notes:', ...notes);
        }
    }
    // What `node gates/verdicts.mjs record` reads: one verdict per line, in full.
    const recordable = items
        .filter((i) => i.line)
        .map((i) => i.line)
        .sort();
    if (recordable.length) lines.push('', `Verdict lines (hash version ${HASH_VERSION}):`, ...recordable);
    return { text: lines.join('\n'), items: items.length, pages: pages.length, total: all.length };
}

/** Everything now in the prompt counts as passed on; the next prompt starts after it. */
export function markCopied() {
    const set = copiedSignatures();
    for (const item of promptItems()) set.add(item.signature);
    return save(COPIED_KEY, [...set]);
}

/** Clear prompt: every note on every page goes, every verdict counts as passed on. */
export function clearPrompt() {
    const set = copiedSignatures();
    for (const item of promptItems()) if (item.kind !== 'note') set.add(item.signature);
    save(COPIED_KEY, [...set]);
    save(FEEDBACK_KEY, {});
    document.dispatchEvent(new CustomEvent(NOTES_EVENT));
}
