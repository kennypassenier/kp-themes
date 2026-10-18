// Rebuilds research/kpadopt56/src/<demo>/ from git: for each of the nine formal demos of the fifth and sixth adoption
// rounds (research/kpadopt5-*, research/kpadopt6-*), the LATEST version of every judged section, with the page's scripts
// and styles that wire it.
//
// Why this exists (Kenny, 2026-10-13: "toon je geen al goedgekeurde elementen meer"): every re-review round of those
// demos removed the sections Kenny had approved, so a demo's page today holds only its last round's sections. Kenny now
// asks the same 79 sections in the eleven other themes. Each section is taken from the last commit in which it was
// shown (an item re-reviewed in round 2 or 3 takes its round 2 or 3 markup; one approved in round 1 takes round 1).
// The scripts are the demo's fullest script with the blocks of re-reviewed sections replaced by their latest version, and
// the wiring a later round dropped for an approved section restored (the patches below, each asserted to apply).
//
// The result is committed (research/kpadopt56/src/); research/kpadopt56/build-parts.mjs reads only that. Run this again
// only to re-derive the sources from the history; it needs the git history of this repository:
//   node research/kpadopt56/extract-sources.mjs
//
// What it changes in a section, besides choosing the version:
// - `data-review-choices` is dropped: Kenny decided every default in formal (2026-10-17 and 2026-10-18), and a default
//   is a property of the component, not of a theme, so the other themes are not asked for it again.
// - the page's class/id/data prefix is renamed where two demos used the same one (k6 in calm, social and ops, kt in time
//   and media), so the sections of different demos can stand on one page without their styles meeting.
// - relative paths: imports of ../../js become ../../../../js (the sources sit two folders deeper), and the media demo's
//   files/ folder is read from its place under src/.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const OUT = fileURLToPath(new URL('research/kpadopt56/src/', root));
/** The last commit of the formal demos' history (the worktree this was built in started here). */
const HEAD = '13465dff';

/** @param {string} commit @param {string} path */
const git = (commit, path) => execFileSync('git', ['show', `${commit}:${path}`], { cwd: fileURLToPath(root), maxBuffer: 1 << 28 }).toString();

/** Every `<section … data-review-item="x">` of a page, balanced against nested sections. @param {string} html */
function sectionsOf(html) {
    /** @type {{ id: string, text: string }[]} */
    const out = [];
    const start = /<section\b[^>]*?data-review-item="([^"]+)"/g;
    for (let m; (m = start.exec(html)); ) {
        const open = html.lastIndexOf('<section', m.index + 1);
        const tag = /<(\/?)section\b/g;
        tag.lastIndex = open;
        let depth = 0;
        for (let t; (t = tag.exec(html)); ) {
            depth += t[1] ? -1 : 1;
            if (depth === 0) {
                out.push({ id: m[1], text: html.slice(open, t.index + '</section>'.length) });
                break;
            }
        }
    }
    return out;
}

/**
 * Splits a script at its block markers into [head, ...blocks]; each block starts at its marker line.
 * @param {string} js @param {RegExp} marker a line that opens a block
 */
function blocksOf(js, marker) {
    const lines = js.split('\n');
    /** @type {{ key: string, text: string }[]} */
    const parts = [{ key: 'head', text: '' }];
    for (const line of lines) {
        if (marker.test(line)) parts.push({ key: line.trim(), text: '' });
        parts[parts.length - 1].text += `${line}\n`;
    }
    return parts;
}
/** @param {{ key: string, text: string }[]} parts */
const join = (parts) => parts.map((p) => p.text).join('').replace(/\n+$/, '\n');
/** The block whose marker line matches. @param {{ key: string, text: string }[]} parts @param {RegExp} re */
const find = (parts, re) => {
    const hit = parts.find((p) => re.test(p.key));
    if (!hit) throw new Error(`no block matching ${re}`);
    return hit;
};
/** Replaces text that must be there exactly once. @param {string} text @param {string} from @param {string} to */
const patch = (text, from, to) => {
    if (text.split(from).length !== 2) throw new Error(`patch does not apply exactly once: ${from.slice(0, 80)}`);
    return text.replace(from, to);
};

/** Wiring that a later round dropped for sections Kenny had approved in an earlier one. */
const RESTORE = {
    /** The palette's states and phone width (intent-states), dropped when only the palette was asked again. */
    palette(/** @type {string} */ now) {
        let b = now;
        b = patch(
            b,
            "    const main = document.getElementById('k6-intent-pal');\n",
            "    const main = document.getElementById('k6-intent-pal');\n    const states = document.getElementById('k6-intent-states');\n    const phone = document.getElementById('k6-intent-phone');\n",
        );
        b = patch(
            b,
            "        b.addEventListener('click', () => typeInto(main, b.getAttribute('data-k6-query') ?? ''));\n",
            "        b.addEventListener('click', () => typeInto(main, b.getAttribute('data-k6-query') ?? ''));\n    for (const b of document.querySelectorAll('[data-k6-query2]'))\n        b.addEventListener('click', () => typeInto(states, b.getAttribute('data-k6-query2') ?? ''));\n",
        );
        b = patch(b, '        for (const el of [main]) {', '        for (const el of [main, states, phone]) {');
        b = patch(
            b,
            "    onChoice('intent-mark', setMarkLook);\n}",
            `    onChoice('intent-mark', setMarkLook);

    /** @param {string} state */
    const setState = (state) => {
        if (!states) return;
        palette(states)?.setState(/** @type {'ready' | 'loading' | 'error'} */ (state), { message: 'The host did not answer.' });
        for (const b of document.querySelectorAll('[data-k6-intent-state]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-intent-state') === state));
    };
    stateButtons('data-k6-intent-state', setState);
    states?.addEventListener('kp-palette-retry', () => setState('ready'));
    stateButtons('data-k6-cap', (cap) => {
        states?.setAttribute('data-kp-max-shown', cap);
        if (states) palette(states)?.refresh();
    });
}`,
        );
        return b;
    },
    /** The entity card's cards, states and phone width (entity-states). */
    entity(/** @type {string} */ now) {
        let b = now;
        b = patch(b, "const { setEntityGrid } = await import('../../js/entity-card.js');", "const { setEntityGrid, setEntityGridState } = await import('../../js/entity-card.js');");
        // The block ends with its closing brace; the restored wiring goes before it.
        const end = b.lastIndexOf('\n}');
        b =
            b.slice(0, end) +
            `

    const cards = document.getElementById('k6-entity-cards');
    const three = make().slice(0, 3);
    const drawCards = (/** @type {string} */ mode) => {
        if (!cards) return;
        const list = three.map((d) => ({ ...d }));
        if (mode === 'states') {
            list[0] = { ...list[0], status: 'loading' };
            list[1] = { ...list[1], status: 'empty' };
            list[2] = { ...list[2], status: 'error', error: 'The host did not answer' };
        }
        setEntityGrid(cards, list);
        for (const b of document.querySelectorAll('[data-k6-entity-card]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-entity-card') === mode));
    };
    drawCards('ready');
    stateButtons('data-k6-entity-card', drawCards);
    cards?.addEventListener('kp-entity-retry', () => drawCards('ready'));

    const gs = document.getElementById('k6-entity-gstates');
    const four = make().slice(0, 4);
    if (gs) setEntityGrid(gs, four);
    const phone = document.getElementById('k6-entity-phone');
    if (phone) setEntityGrid(phone, make().slice(0, 2));
    stateButtons('data-k6-entity-gstate', (state) => {
        if (!gs) return;
        if (state === 'ready') setEntityGrid(gs, four);
        else
            setEntityGridState(gs, /** @type {'loading' | 'empty' | 'error'} */ (state), {
                count: 4,
                message: state === 'error' ? 'The host did not answer.' : undefined,
            });
    });
    gs?.addEventListener('kp-entity-grid-retry', () => {
        setEntityGrid(gs, four);
        for (const b of document.querySelectorAll('[data-k6-entity-gstate]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-entity-gstate') === 'ready'));
    });` +
            b.slice(end);
        return b;
    },
};

const MARK_DASH = /^\/\/ ── .* ──$/;

/**
 * The nine demos. `items`: the commit each section is taken from. `fullest`: the commit of the fullest page. `js`
 * builds the merged script from `at(commit)`, the demo's script at a commit.
 * @type {Record<string, { items: Record<string, string>, fullest: string, jsFile: string, cssFile: string, rename?: [string, string], js: (at: (commit: string) => string) => string }>}
 */
const DEMOS = {
    'kpadopt5-basics': {
        fullest: 'b9fad73b',
        jsFile: 'demo.js',
        cssFile: 'demo.css',
        items: { 'calm-mode': 'b9fad73b', 'shortcut-engine': 'b9fad73b', 'explain-lede': 'b9fad73b', 'result-flash-button': 'b9fad73b', 'problem-alert': HEAD },
        js(at) {
            const marker = /^\/\* -{5,}.* \*\/$/;
            const parts = blocksOf(at('b9fad73b'), marker);
            find(parts, /problem alert/).text = find(blocksOf(at(HEAD), marker), /problem alert/).text;
            return join(parts);
        },
    },
    'kpadopt5-people': {
        fullest: '767709e1',
        jsFile: 'people.js',
        cssFile: 'people.css',
        items: { avatar: '767709e1', 'passkey-list': '767709e1', 'chart-annotations': '767709e1', 'conversation-thread': HEAD },
        js(at) {
            const marker = /^\/\/ ---- (\d · )?[a-z].* -+$/;
            const parts = blocksOf(at('767709e1'), marker);
            find(parts, /3 · conversation/).text = find(blocksOf(at(HEAD), marker), /^\/\/ ---- conversation/).text;
            return join(parts);
        },
    },
    'kpadopt5-time': {
        fullest: '709b44df',
        jsFile: 'demo.js',
        cssFile: 'page.css',
        items: Object.fromEntries([
            ...['weekdays', 'runs', 'snooze', 'dated', 'unsaved'].flatMap((i) => [[i, '709b44df'], [`${i}-states`, '709b44df']]),
            ...['sentence', 'slider'].flatMap((i) => [[i, HEAD], [`${i}-states`, HEAD]]),
        ]),
        js(at) {
            const parts = blocksOf(at('709b44df'), /^\/\/ ── .* ──$/);
            const now = blocksOf(at(HEAD), /^\/\/ ── .* ──$/);
            for (const key of ['sentence form', 'slider']) find(parts, new RegExp(key)).text = find(now, new RegExp(key)).text;
            return join(parts);
        },
    },
    'kpadopt5-rows': {
        fullest: '7957a5ce',
        jsFile: 'rows.js',
        cssFile: 'rows.css',
        items: {
            'row-keyboard-select': '7957a5ce',
            'selection-bar': '7957a5ce',
            'undo-toast': '7957a5ce',
            'new-items-pill': 'dbeac68c',
            'payload-cell': '7957a5ce',
            'json-textarea': HEAD,
            'request-inspector': '7957a5ce',
        },
        js(at) {
            const marker = /^\/\/ -{10,} .*$/;
            const parts = blocksOf(at('7957a5ce'), marker);
            const pill = find(blocksOf(at('dbeac68c'), marker), /the log \(the pill\)/);
            const json = find(blocksOf(at(HEAD), marker), /the JSON box/);
            find(parts, /the log \(the pill\)/).text = pill.text;
            // HEAD's script ends with the calls of what it still wired; the full list stays at the end of the old one.
            find(parts, /the JSON box/).text = json.text.replace(/\nwireLogs\(\);\nwireJson\(\);\s*$/, '\n\n');
            return join(parts);
        },
    },
    'kpadopt5-ops': {
        fullest: '8a04c6ad',
        jsFile: 'demo.js',
        cssFile: 'page.css',
        items: {
            'ops-page': '8a04c6ad',
            'master-detail': '8a04c6ad',
            'auto-refresh': '8a04c6ad',
            connection: 'babe78c3',
            transfer: HEAD,
            question: '8a04c6ad',
            notices: 'babe78c3',
        },
        js(at) {
            const marker = /^\/\/ -{10,} .*$/;
            const parts = blocksOf(at('8a04c6ad'), marker);
            find(parts, /-- connection$/).text = find(blocksOf(at('babe78c3'), marker), /-- connection$/).text;
            find(parts, /-- notices$/).text = find(blocksOf(at('babe78c3'), marker), /-- notices$/).text;
            find(parts, /-- transfer$/).text = find(blocksOf(at(HEAD), marker), /-- transfer$/).text;
            return join(parts);
        },
    },
    'kpadopt6-calm': {
        fullest: 'e0f8e76c',
        jsFile: 'demo.js',
        cssFile: 'page.css',
        rename: ['k6', 'kc'],
        items: Object.fromEntries([
            ['usual', HEAD],
            ['usual-states', 'e0f8e76c'],
            ...['focus', 'today', 'quote', 'calm-tones', 'rating'].flatMap((i) => [[i, HEAD], [`${i}-states`, HEAD]]),
        ]),
        js: (at) => at(HEAD),
    },
    'kpadopt6-social': {
        fullest: '77cabb06',
        jsFile: 'social.js',
        cssFile: 'social.css',
        rename: ['k6', 'ks'],
        items: { 'claim-row': '77cabb06', 'availability-grid': HEAD, 'qr-code': '77cabb06', 'time-field': '77cabb06', 'interactive-console': HEAD },
        js: (at) => at(HEAD),
    },
    'kpadopt6-media': {
        fullest: 'cfc2da2b',
        jsFile: 'demo.js',
        cssFile: 'page.css',
        rename: ['kt', 'km'],
        items: Object.fromEntries(
            ['uses-lines', 'uses-states', 'gallery-grid', 'gallery-states', 'docpreview-open', 'docpreview-states', 'autosize-grow', 'autosize-states', 'anchors-headings', 'anchors-rows', 'print-checklist'].map((i) => [i, HEAD]),
        ),
        js: (at) => at(HEAD),
    },
    'kpadopt6-ops': {
        fullest: 'a3c71370',
        jsFile: 'demo.js',
        cssFile: 'page.css',
        rename: ['k6', 'kv'],
        items: Object.fromEntries([
            ...['toggle', 'intent', 'entity'].map((i) => [i, HEAD]),
            ...['toggle', 'intent', 'entity'].map((i) => [`${i}-states`, 'a3c71370']),
            ...['version', 'ack', 'deplist', 'trace'].flatMap((i) => [[i, 'a3c71370'], [`${i}-states`, 'a3c71370']]),
        ]),
        js(at) {
            const parts = blocksOf(at('a3c71370'), MARK_DASH);
            const now = blocksOf(at(HEAD), MARK_DASH);
            find(parts, /toggle button/).text = find(now, /toggle button/).text;
            find(parts, /palette/).text = RESTORE.palette(find(now, /palette/).text);
            find(parts, /entity card/).text = RESTORE.entity(find(now, /entity card/).text);
            // The head (helpers) is the newer one.
            parts[0].text = now[0].text;
            return join(parts);
        },
    },
};

/**
 * Words that only make sense to someone who followed the formal rounds ("changed since round 1", "your answer"): the
 * other themes' reviewer reads the section cold. Each edit must apply exactly once to the section it names.
 * @type {[string, RegExp, string][]}
 */
const WORDING = [
    ['conversation-thread', /changed since round 1: every setting below/, 'every setting below'],
    ['connection', /changed since round 1: the banner stands/, 'the banner stands'],
    ['notices', /changed since round 1: (<b>Mark read<\/b>)/, '$1'],
    ['notices', /\s+The rest is as before\./, ''],
    ['new-items-pill', /changed since round 1: in the log rows/, 'in the log rows'],
    ['new-items-pill', /\s+Everything else is as in round 1\./, ''],
    [
        'json-textarea',
        /changed since round 2: a long text scrolls again\. In round 2 the box stayed six lines high with its scrolling\s+switched off as soon as it sat inside the review dialog, so Long could not be scrolled at all\. Now the box grows/,
        'a long text scrolls: the box grows',
    ],
    ['json-textarea', /\s+Everything else is as in round 2\./, ''],
    ['calm-mode', /\(the\s+default, your answer\)/, '(the default)'],
    ['shortcut-engine', /\(your answer: warn\)/, '(warn)'],
    ['problem-alert', /changed since round 1: every problem/, 'every problem'],
    [
        'sentence',
        /changed since round 1: the list that opens from a field \(for example <b>every week<\/b>\) is on the popover&rsquo;s\s+paper surface with the ink of formal&rsquo;s other lists, no longer almost black; the underline/,
        'the list that opens from a field (for example <b>every week</b>) is on the popover&rsquo;s paper surface and readable; the underline',
    ],
    ['sentence-states', /changed since round 1: the lists that open/, 'the lists that open'],
    ['slider', /changed since round 1: the bubble over/, 'the bubble over'],
    ['slider', /Everything else is as in round 1: drag, type 23\.5 and press Enter, the arrow keys\./, 'Drag, type 23.5 and press Enter, use the arrow keys.'],
    ['slider-states', /changed since round 1: (<b>Locked)/, '$1'],
    ['autosize-grow', /then it scrolls inside \(your answer\)\./, 'then it scrolls inside.'],
    ['print-checklist', /keep their text \(your answer\)\./, 'keep their text.'],
];
/** @param {string} id @param {string} text */
function reword(id, text) {
    let out = text;
    for (const [item, from, to] of WORDING.filter(([item]) => item === id)) {
        const hits = out.match(new RegExp(from.source, `${from.flags}g`)) ?? [];
        if (hits.length !== 1) throw new Error(`${id}: the edit ${from} applies ${hits.length} times, not once`);
        out = out.replace(from, to);
        void item;
    }
    return out;
}

/** @param {string} text @param {[string, string] | undefined} rename */
const renamed = (text, rename) => (rename ? text.replace(new RegExp(`(?<![A-Za-z0-9])${rename[0]}(?=[-_A-Z])`, 'g'), rename[1]) : text);

rmSync(OUT, { recursive: true, force: true });
/** @type {Record<string, any>} */
const provenance = {};
for (const [demo, config] of Object.entries(DEMOS)) {
    const dir = `${OUT}${demo}/`;
    mkdirSync(dir, { recursive: true });
    const pages = new Map();
    const page = (/** @type {string} */ commit) => pages.get(commit) ?? pages.set(commit, sectionsOf(git(commit, `research/${demo}/demo.html`))).get(commit);
    // The order of the demo's own page (its fullest).
    const order = page(config.fullest).map((/** @type {{ id: string }} */ s) => s.id);
    const missing = Object.keys(config.items).filter((id) => !order.includes(id));
    if (missing.length) throw new Error(`${demo}: ${missing} not on the fullest page`);
    const left = order.filter((id) => !(id in config.items));
    if (left.length) throw new Error(`${demo}: ${left} on the fullest page but without a source`);
    let html = '';
    for (const id of order) {
        const commit = config.items[id];
        const section = page(commit).find((/** @type {{ id: string }} */ s) => s.id === id);
        if (!section) throw new Error(`${demo}: ${id} is not on the page at ${commit}`);
        // The set is JSON in a single-quoted attribute; some sets hold a raw apostrophe, so the value ends at the quote that is
        // followed by the end of the tag or by another attribute.
        let text = section.text
            .replace(/\s+data-review-choices='[\s\S]*?'(?=\s*>|\s+[a-z][a-z-]*=)/g, '')
            .replace(/\s+data-review-choices="[^"]*"/g, '');
        if (/data-review-choices/.test(text)) throw new Error(`${demo}: ${id} still has a choice set`);
        text = reword(id, text);
        html += `<!-- ===== item: ${id} (from ${commit === HEAD ? 'the last round' : commit}) -->\n${text}\n\n`;
    }
    const at = (/** @type {string} */ commit) => git(commit, `research/${demo}/${config.jsFile}`);
    let js = config.js(at).replace(/(['"`])\.\.\/\.\.\//g, '$1../../../../');
    let css = git(HEAD, `research/${demo}/${config.cssFile}`);
    if (demo === 'kpadopt6-media') {
        const files = (/** @type {string} */ s) => s.replace(/(?<![\w/.-])files\//g, '../kpadopt56/src/kpadopt6-media/files/');
        html = files(html);
        js = files(js);
        cpSync(fileURLToPath(new URL(`research/${demo}/files`, root)), `${dir}files`, { recursive: true });
    }
    writeFileSync(`${dir}sections.html`, renamed(html, config.rename));
    writeFileSync(`${dir}demo.js`, renamed(js, config.rename));
    writeFileSync(`${dir}page.css`, renamed(css, config.rename));
    provenance[demo] = { items: config.items, scripts: config.jsFile, styles: config.cssFile, renamed: config.rename ? `${config.rename[0]} -> ${config.rename[1]}` : null };
}
writeFileSync(`${OUT}SOURCES.json`, `${JSON.stringify({ head: HEAD, demos: provenance }, null, 4)}\n`);
console.log(`extract-sources: ${Object.values(DEMOS).reduce((n, d) => n + Object.keys(d.items).length, 0)} sections from ${Object.keys(DEMOS).length} demos`);
