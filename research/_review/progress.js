// How far a research demo's review has come, read from outside the demo: the
// hub (catalogue/changed.html) lists every demo waiting for Kenny's verdict
// with its state, without opening it (Kenny, 2026-10-05: "dingen bundelen
// zodat ik vanuit één centrale locatie/pagina verder kan").
//
// One store, one key: review.js keeps its verdicts under storeKey(), and this
// module reads the same entry. What counts as open mirrors review.js: a pair
// (section × theme, or a catalogue block) is open while it has no verdict, and a round the demo announces
// (`data-review-round`) reopens its rejected and named pairs. Here that
// reopening is only read, never written: the demo writes it when it opens.
import { THEMES } from '../../js/theme-registry.js';

/** Where review.js keeps a demo's verdicts, notes and picks (localStorage). */
export const storeKey = (demo) => `kp-demo-review:${demo}`;

/**
 * @typedef {object} DemoShape
 * @property {string} id         the demo id (`data-review` on <html>)
 * @property {string} ask        what the demo asks, from its own header
 * @property {string[]} themes   the themes it walks, in order
 * @property {string[]} items    its judged sections (`data-review-item`)
 * @property {Record<string, string[] | null>} [itemThemes]  per section, the themes it names for itself
 *   (`data-review-themes` on the section), null when it is asked in every theme the demo walks
 * @property {string[]} extras   the keys of the catalogue pairs it carries along
 * @property {{ round?: string, reopen?: string[], received?: string[] } | null} round
 * @property {string | null} [fingerprint]  see fingerprintOf, once read
 * @property {DemoUpdate | null} [update]   see loadUpdate, once read
 */

const parseJson = (text, fallback) => {
    try {
        return JSON.parse(text || '') ?? fallback;
    } catch {
        return fallback;
    }
};

const words = (node) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();

/**
 * What a demo asks, in a line: the last two sentences of its header's first
 * paragraph, where every character-round demo states its question ("Here
 * every theme gets two … Pick one of the three per theme."). A demo can say
 * it itself with `data-review-ask` on <html>.
 * @param {Document} doc
 */
function askOf(doc) {
    const own = doc.documentElement.getAttribute('data-review-ask');
    if (own) return own;
    const text = words(doc.querySelector('main header p, header p, main p'));
    const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [text];
    return sentences.slice(-2).join('').trim();
}

/**
 * Read a demo's shape from its markup, or null when it does not carry the
 * review kit (no `data-review`, or no judged section).
 * @param {Document} doc
 * @returns {DemoShape | null}
 */
export function shapeOf(doc) {
    const root = doc.documentElement;
    const id = root.getAttribute('data-review');
    const sections = [...doc.querySelectorAll('[data-review-item]')];
    const items = sections.map((section) => section.getAttribute('data-review-item') ?? '');
    // A section that names its own themes is asked in those only, as review.js builds its steps; counted in every
    // theme, a demo of what differs per theme never read as decided.
    /** @type {Record<string, string[] | null>} */
    const itemThemes = Object.fromEntries(
        sections.map((section) => {
            const own = section.getAttribute('data-review-themes');
            return [section.getAttribute('data-review-item') ?? '', own ? own.split(/[\s,]+/).filter(Boolean) : null];
        }),
    );
    if (!id || !items.length) return null;
    const listed = (root.getAttribute('data-review-themes') ?? '')
        .split(',')
        .map((s) => s.trim())
        // A theme dropped since the demo was made is never asked for.
        .filter((name) => THEMES.some((t) => t.name === name));
    /** @type {{ page: string, block: string, theme: string, engine?: string }[]} */
    const extras = parseJson(doc.querySelector('script[data-review-extra]')?.textContent, []);
    return {
        id,
        ask: askOf(doc),
        themes: listed.length ? listed : THEMES.map((t) => t.name),
        items,
        itemThemes,
        extras: extras.map((extra) => {
            const slug = extra.page.replace(/^.*\//, '').replace(/\.html$/, '');
            return `catalogue|${slug}--${extra.block}|${extra.theme}|${extra.engine || 'firefox'}`;
        }),
        round: parseJson(doc.querySelector('script[data-review-round]')?.textContent, null),
    };
}

/** The stored verdicts of a demo, as review.js keeps them. */
export function storedFor(id) {
    try {
        return JSON.parse(localStorage.getItem(storeKey(id)) || '{}') || {};
    } catch {
        return {};
    }
}

/**
 * @typedef {object} DemoUpdate
 * @property {number} update  the update's number: 1 for the first redo after a verdict, then 2, …
 * @property {Record<string, Record<string, string>>} picks  per theme, per question: the option Kenny approved
 * @property {Record<string, Record<string, { comment?: string, reply?: string }>>} questions
 *   per theme, per question the update opens again: Kenny's comment and the session's reply
 */

/**
 * A demo's update, the one convention a theme session fills in when it
 * republishes a demo after Kenny's verdict: `update.json` beside demo.html,
 *
 *     { "update": 1,
 *       "picks": { "<theme>": { "<question>": "<option key>" } },
 *       "questions": { "<theme>": { "<question>": { "comment": "<his words>", "reply": "<what changed, or the proposal>" } } } }
 *
 * The next update raises the number and lists only what it opens again.
 * Null when the demo has none.
 * @param {string | URL} url
 * @returns {Promise<DemoUpdate | null>}
 */
export async function loadUpdate(url) {
    try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) return null;
        const data = await response.json();
        const update = Number(data?.update);
        if (!update) return null;
        return { update, picks: data.picks || {}, questions: data.questions || {} };
    } catch {
        return null;
    }
}

/*
 * A demo republished under the same round: a theme session redid options,
 * scenes or styles and kept `data-review-round` (Kenny, 2026-10-07: the new
 * cyberpunk and terminal rounds were "judged in every theme" on his page).
 * Every verdict is stamped with the demo's fingerprint, a hash of its page
 * and of the scripts and sheets in its own folder, and with the round it was
 * given in; a "not approved" of this round on other files is open again
 * (an approval stands, as it does across rounds).
 */

/** A section's topic (`data-review-topic`, `-title`), left out of the fingerprint. */
const TOPIC_ATTRIBUTES = /\s+data-review-topic(?:-title)?="[^"]*"/g;

/**
 * The fingerprint of the demo at `url`: its page and the scripts and sheets
 * in its own folder, hashed. Null when it cannot be read or hashed.
 * @param {string | URL} url
 * @param {string} [html] the page's text, when it is already fetched
 * @returns {Promise<string | null>}
 */
export async function fingerprintOf(url, html) {
    try {
        const page = new URL(url);
        page.search = page.hash = '';
        const folder = new URL('.', page).href;
        const text = html ?? (await (await fetch(page, { cache: 'no-cache' })).text());
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const own = [...doc.querySelectorAll('script[src], link[rel="stylesheet"][href]')]
            .map((el) => new URL(el.getAttribute('src') || el.getAttribute('href') || '', page))
            .filter((file) => file.href.startsWith(folder))
            .map((file) => file.href)
            .sort();
        // A section's topic only groups the review dialog's steps: setting it is no new version of the demo, and reopens
        // nothing (Kenny, 2026-10-16, topic steps added to rounds already under way).
        const shown = text.replace(TOPIC_ATTRIBUTES, '');
        const parts = [shown, ...(await Promise.all(own.map(async (file) => (await fetch(file, { cache: 'no-cache' })).text())))];
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(parts.join('\u0000')));
        return [...new Uint8Array(digest).slice(0, 8)].map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
        return null;
    }
}

/**
 * Verdicts given before fingerprints were stamped (2026-10-07) carry none:
 * for the demos still waiting then, a verdict older than the last commit
 * that changed the demo's own files is open again. Read once, never added
 * to: every later verdict carries its fingerprint.
 */
const UNSTAMPED_BEFORE = {
    'cyberpunk-character': '2026-10-07T19:24:52Z',
    'solstice-character': '2026-10-07T15:17:44Z',
    'brutalism-character': '2026-10-07T14:24:39Z',
    'synthwave-character': '2026-10-07T19:22:41Z',
    'grotesk-character': '2026-10-07T14:24:39Z',
    'nostromo-character': '2026-10-07T15:17:26Z',
    'blueprint-character': '2026-10-07T14:24:39Z',
};

/**
 * The verdicts given on another version of this round of the demo.
 * @param {{ id: string, round: DemoShape['round'], fingerprint?: string | null }} shape
 * @param {Record<string, any>} stored
 * @returns {string[]}
 */
export function staleKeys(shape, stored) {
    const round = shape.round?.round || '';
    // A round not yet opened in this browser is read by the round's own rules.
    if (round && (stored.__round || '') !== round) return [];
    const before = UNSTAMPED_BEFORE[/** @type {keyof typeof UNSTAMPED_BEFORE} */ (shape.id)];
    return Object.entries(stored)
        .filter(([key, entry]) => {
            if (key.startsWith('__') || entry?.verdict !== 'rejected') return false;
            if (entry.fingerprint) return (entry.round || '') === round && Boolean(shape.fingerprint) && entry.fingerprint !== shape.fingerprint;
            return Boolean(before) && (entry.at || '') < before;
        })
        .map(([key]) => key);
}

/**
 * @typedef {object} DemoProgress
 * @property {'decided' | 'updated' | 'partly' | 'new'} state
 *   `new` only while the demo never had a verdict in this browser; `updated`
 *   while a later round (or redrawn sections) left pairs open that were judged
 *   before (Kenny, 2026-10-07: "dan weet ik in welke ronde ik zit")
 * @property {number} themes       themes the demo walks
 * @property {number} themesLeft   themes with a section still open
 * @property {boolean} extrasLeft  catalogue blocks the demo carries, still open
 * @property {string[]} updated    themes open again since an earlier verdict
 * @property {boolean} extrasUpdated  the catalogue blocks are open again too
 * @property {number} update       the update's number (update.json), 0 without one
 * @property {number} pairs
 * @property {number} pairsLeft
 */

/**
 * How far a demo's review has come, from its shape and its stored verdicts.
 * @param {DemoShape} shape
 * @param {Record<string, any>} [stored]
 * @returns {DemoProgress}
 */
export function progressOf(shape, stored = storedFor(shape.id)) {
    /** The sections asked in a theme: all of them, or the ones that name it. */
    const askedIn = (theme) => shape.items.filter((item) => !shape.itemThemes?.[item] || shape.itemThemes[item]?.includes(theme));
    /** Pairs a round not yet opened in this browser will reopen on load (review.js): open, whatever their verdict. */
    const pending = new Set();
    if (shape.round?.round && stored.__round !== shape.round.round) {
        for (const [key, entry] of Object.entries(stored)) if (entry?.verdict === 'rejected') pending.add(key);
        for (const key of shape.round.reopen ?? []) pending.add(key);
    }
    // The pairs the round reopened, pending or already reopened (review.js
    // lists those under `__reopened`): they name the themes an update is in,
    // and a verdict given on one since closes it like any other pair.
    // A verdict on another version of this round: open, as review.js reopens it on load.
    for (const key of staleKeys(shape, stored)) pending.add(key);
    // An update not yet opened in this browser: the themes it asks again.
    if (shape.update && (Number(stored.__update) || 0) < shape.update.update)
        for (const theme of shape.themes)
            if (Object.keys(shape.update.questions[theme] || {}).length) for (const item of askedIn(theme)) pending.add(`${theme}|${item}`);
    const reopened = new Set(pending.size ? pending : Array.isArray(stored.__reopened) ? stored.__reopened : []);
    const open = (key) => !stored[key]?.verdict || pending.has(key);
    const steps = shape.themes.map((theme) => askedIn(theme).map((item) => `${theme}|${item}`));
    if (shape.extras.length) steps.push(shape.extras);
    const pairs = steps.flat();
    const pairsLeft = pairs.filter(open).length;
    const themeSteps = steps.slice(0, shape.themes.length);
    // A theme with no section asked in it is no step, nor a theme of this round.
    const themesLeft = themeSteps.filter((step) => step.some(open)).length;
    const extrasLeft = shape.extras.length > 0 && shape.extras.some(open);

    // Judged before: any verdict kept, or a round that reopened some.
    const judgedBefore = reopened.size > 0 || Object.values(stored).some((entry) => entry?.verdict);
    // Open again: reopened by a round, or, when the demo was redrawn under new
    // section names and nothing it shows has a verdict, every open pair.
    const redrawn = judgedBefore && pairsLeft === pairs.length;
    const again = (key) => open(key) && (redrawn || reopened.has(key));
    const updated = shape.themes.filter((_, i) => themeSteps[i].some(again));
    const extrasUpdated = shape.extras.some(again);
    let state = 'partly';
    if (pairsLeft === 0) state = 'decided';
    else if (updated.length || extrasUpdated) state = 'updated';
    else if (pairsLeft === pairs.length) state = 'new';
    return {
        state,
        themes: themeSteps.filter((step) => step.length).length,
        themesLeft,
        extrasLeft,
        updated,
        extrasUpdated,
        update: shape.update?.update || 0,
        pairs: pairs.length,
        pairsLeft,
    };
}

/*
 * A demo's answer, kept beside its verdicts (Kenny, 2026-10-13). Whoever leaves a demo without copying its answer
 * finds it again on the Agenda, which offers every answer not yet copied in one press. Copying stays Kenny's:
 * nothing is sent anywhere.
 */

/** Where review.js keeps a demo's latest answer: `{ text, at, judged, copied }`, `copied` the `at` it was copied at. */
export const answerKey = (demo) => `${storeKey(demo)}:answer`;

/**
 * @typedef {object} DemoAnswer
 * @property {string} text    the answer as the demo's "Copy answer" gives it
 * @property {string} at      when it last changed (ISO)
 * @property {number} judged  pairs judged when it was written
 * @property {string} [copied] the `at` of the text last copied
 * @property {string} [carried] an earlier answer, not copied, whose words a reopening wiped (carryAnswer)
 * @property {string} [round] the page's round id when the answer was written (keepAnswer); absent on older answers
 * @property {string} [carriedRound] the round id the carried words were written in
 */

/** A demo's stored answer, or null. @returns {DemoAnswer | null} */
export function answerOf(id) {
    try {
        const data = JSON.parse(localStorage.getItem(answerKey(id)) || 'null');
        return data && typeof data.text === 'string' ? data : null;
    } catch {
        return null;
    }
}

/** Keep a demo's answer; a text unchanged since it was copied stays copied, an answer carried along stays with it. */
export function keepAnswer(id, text, judged, round = '') {
    const before = answerOf(id);
    if (before?.text === text && before.round !== undefined) return;
    const carried = before?.carried ? { carried: before.carried, carriedRound: before.carriedRound ?? before.round ?? '' } : {};
    try {
        const same =
            before?.text === text ? { at: before.at, ...(before.copied ? { copied: before.copied } : {}) } : { at: new Date().toISOString() };
        localStorage.setItem(answerKey(id), JSON.stringify({ text, judged, round, ...same, ...carried }));
    } catch {
        /* storage refused: the demo's own Copy answer still works */
    }
}

/** Fired on the document when a demo's answer is passed on, so a page that lists waiting answers draws again. */
export const ANSWER_EVENT = 'kp-demo-answer-copied';

/** Mark a demo's answer as copied, as it stands now. */
export function markAnswerCopied(id) {
    const answer = answerOf(id);
    if (!answer) return;
    try {
        const { carried, ...rest } = answer;
        localStorage.setItem(answerKey(id), JSON.stringify({ ...rest, copied: answer.at }));
    } catch {
        /* nothing to mark */
    }
    globalThis.document?.dispatchEvent(new CustomEvent(ANSWER_EVENT, { detail: { id } }));
}

/**
 * An answer not yet copied, carried along when the demo opens its questions again (a republish, a round, an update)
 * and wipes the words it held (Kenny, 2026-10-14: a demo finished with two notes reopened, and its answer then read
 * "2 open" without them). review.js puts the carried text before its own until the answer is copied.
 */
export function carryAnswer(id) {
    const answer = answerOf(id);
    if (!answer || !answerWaiting(id)) return;
    try {
        localStorage.setItem(answerKey(id), JSON.stringify({ ...answer, carried: answer.text, carriedRound: answer.round ?? '' }));
    } catch {
        /* storage refused: nothing to carry */
    }
}

/**
 * Whether an answer written in `answerRound` belongs to a round Claude has already received and recorded
 * (VERDICTS.json; the page lists those page round ids as `"received"` in its round script, and gates/check-rereview.mjs
 * keeps the list in step). An answer with no round id was written before round ids were kept: it belongs to the round
 * before the current one, so it is received as soon as the page lists any received round.
 * @param {string | undefined} answerRound
 * @param {{ received?: string[] } | null | undefined} round the page's round
 */
export const roundReceived = (answerRound, round) => {
    const received = round?.received;
    if (!Array.isArray(received) || !received.length) return false;
    return !answerRound || received.includes(answerRound);
};

/**
 * Drop what Claude already holds (Kenny, 2026-10-16: a new round started with his round-2 answer, which he had
 * delivered through a form, and the Agenda said it was not copied). An answer of a received round is removed; words
 * carried from a received round are removed from an answer of the current one. An answer of a round not received stays.
 * @returns {boolean} whether anything was dropped
 */
export function dropReceivedAnswer(id, round) {
    const answer = answerOf(id);
    if (!answer) return false;
    // An answer of the page's own round is never received, whatever the page lists (lost-answer-1017: a part republished
    // under the id of a round already received dropped Kenny's fresh answer the moment he gave it).
    const own = round?.round || '';
    try {
        if (!(own && answer.round === own) && roundReceived(answer.round, round)) {
            keepInJournal(id, answer.round || '', answer.text, answer.judged);
            localStorage.removeItem(answerKey(id));
            noteReceived(id, answer.round || '');
            return true;
        }
        if (answer.carried && !(own && answer.carriedRound === own) && roundReceived(answer.carriedRound, round)) {
            keepInJournal(id, answer.carriedRound || '', answer.carried, 1);
            const { carried, carriedRound, ...rest } = answer;
            localStorage.setItem(answerKey(id), JSON.stringify(rest));
            noteReceived(id, answer.carriedRound || '');
            return true;
        }
    } catch {
        /* storage refused: nothing to drop */
    }
    return false;
}

/** The answer carried along for a demo, or ''. */
export const carriedAnswer = (id) => answerOf(id)?.carried || '';

/** Whether a demo has an answer with a verdict in it that was not copied since it last changed. */
export const answerWaiting = (id) => {
    const answer = answerOf(id);
    return Boolean(answer && answer.judged > 0 && answer.copied !== answer.at);
};

/**
 * Every demo answer in this browser that waits to be passed on, in a stable order: what the one "Copy prompt" puts
 * before the catalogue's verdicts (Kenny, 2026-10-13: the bar's Copy prompt and the Agenda's own copy button gave
 * different things; "Dat moet gelijk getrokken worden").
 * @returns {{ id: string, text: string }[]}
 */
export function waitingAnswers() {
    const found = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i) ?? '';
            const match = /^kp-demo-review:(.+):answer$/.exec(key);
            if (match && answerWaiting(match[1])) found.push({ id: match[1], text: /** @type {DemoAnswer} */ (answerOf(match[1])).text });
        }
    } catch {
        /* storage refused: nothing waits */
    }
    return found.sort((a, b) => a.id.localeCompare(b.id));
}

/*
 * The journal (Kenny, 2026-10-17: "ik moet altijd honderd procent absoluut zeker zijn dat mijn beoordelingen vastgelegd
 * worden, wat ik ook doe op die site, tot het moment dat ik effectief mijn beoordelingen hier paste"; correction
 * lost-answer-1017). Every verdict, note and tick Kenny sets in a demo's dialog is appended here, per demo, and no code
 * path removes an entry: not a new round, not "Clear all verdicts", not an answer dropped as received. The verdicts
 * under storeKey() and the answer under answerKey() may be cleared; the journal keeps everything, and the Agenda's
 * "Saved verdicts" rebuilds a full answer from it for any demo and round.
 *
 * It grows by about 200 bytes per change (a note is written after a pause in the typing, and an entry that repeats the
 * pair's last one is not written again); a whole review of 100 pairs with notes stays under 40 KB.
 */

/** Where a demo's journal lives: an array of JournalEntry, oldest first. */
export const journalKey = (demo) => `${storeKey(demo)}:journal`;

/**
 * @typedef {object} JournalEntry
 * @property {string} at      when it was set (ISO)
 * @property {string} demo
 * @property {string} round   the page's round id then ('' without one)
 * @property {string} pair    `<theme>|<item>`, `catalogue|<block>|<theme>|<engine>`, or `once|<item>|<choice>`
 * @property {'approved' | 'rejected' | null} verdict  null for a tick or a note alone
 * @property {string} note
 * @property {{ id: string, value: string, label?: string, changed?: boolean, removed?: boolean } | null} choice  a choice ticked, with the option's label
 * @property {string} [label]  the pair as the answer names it (`<item> · <theme>`)
 */

/** A demo's journal, oldest first. @returns {JournalEntry[]} */
export function journalOf(demo) {
    try {
        const list = JSON.parse(localStorage.getItem(journalKey(demo)) || '[]');
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

/** Fired on the document when the journal could not be written (storage full or refused), so the page can say so. */
export const JOURNAL_FAILED_EVENT = 'kp-demo-journal-failed';

/**
 * Appends one entry to a demo's journal. Nothing here ever removes one.
 * @param {string} demo
 * @param {Omit<JournalEntry, 'at' | 'demo'> & { at?: string }} entry
 * @returns {boolean} whether it is on file
 */
export function journal(demo, entry) {
    const list = journalOf(demo);
    const full = { at: entry.at || new Date().toISOString(), demo, round: entry.round || '', pair: entry.pair, verdict: entry.verdict ?? null, note: entry.note || '', choice: entry.choice ?? null, ...(entry.label ? { label: entry.label } : {}) };
    const last = [...list].reverse().find((e) => e?.pair === full.pair && e?.round === full.round);
    const same = (/** @type {JournalEntry} */ e) =>
        e.verdict === full.verdict && e.note === full.note && JSON.stringify(e.choice ?? null) === JSON.stringify(full.choice);
    if (last && same(last)) return true;
    try {
        localStorage.setItem(journalKey(demo), JSON.stringify([...list, full]));
        return true;
    } catch {
        globalThis.document?.dispatchEvent(new CustomEvent(JOURNAL_FAILED_EVENT, { detail: { demo } }));
        return false;
    }
}

/** Every demo with a journal in this browser, sorted. */
export function journalDemos() {
    const found = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const match = /^kp-demo-review:(.+):journal$/.exec(localStorage.key(i) ?? '');
            if (match) found.push(match[1]);
        }
    } catch {
        /* storage refused */
    }
    return found.sort();
}

/** The journal's pair for a whole answer text kept when the answer itself is dropped as received. */
export const ANSWER_PAIR = '__answer';

/** A pair key as the answer names it. */
const labelOfKey = (/** @type {string} */ key) => {
    const parts = key.split('|');
    if (parts[0] === 'catalogue') return `${parts[1]} · ${parts[2]} · ${parts[3]}`;
    if (parts[0] === 'once') return `${parts[1]}`;
    return `${parts[1]} · ${parts[0]}`;
};

/**
 * A full answer rebuilt from the journal, for one demo and one round: per pair the latest verdict, note and ticks
 * Kenny set in that round, in the shape of the dialog's own answer. '' when the round has no entry.
 * @param {string} demo @param {string} round
 */
export function rebuildAnswer(demo, round) {
    const inRound = journalOf(demo).filter((e) => (e.round || '') === round);
    const entries = inRound.filter((e) => e.pair !== ANSWER_PAIR);
    // Only the answer's text was kept (an answer given before the journal existed): that text is the answer.
    if (!entries.length) return inRound.at(-1)?.note || '';
    /** @type {Map<string, { verdict: string | null, note: string, label: string, choices: Map<string, string> }>} */
    const pairs = new Map();
    for (const e of entries) {
        const now = pairs.get(e.pair) ?? { verdict: null, note: '', label: e.label || labelOfKey(e.pair), choices: new Map() };
        if (e.verdict) now.verdict = e.verdict;
        if (e.verdict || e.note || !e.choice) now.note = e.note;
        // A choice set only asks for the default: pressing back to the default clears the change (defaults-1017).
        if (e.choice && typeof e.choice.removed === 'boolean') {
            // "Remove this option" is kept per option; unticking it clears the line (defaults-1017).
            const key = `remove:${e.choice.id}:${e.choice.value}`;
            if (e.choice.removed) now.choices.set(key, `remove option ${e.choice.label || e.choice.value}`);
            else now.choices.delete(key);
        } else if (e.choice && e.choice.changed === false) now.choices.delete(e.choice.id);
        else if (e.choice) now.choices.set(e.choice.id, e.choice.changed ? `default changed to ${e.choice.label || e.choice.value}` : e.choice.label || e.choice.value);
        pairs.set(e.pair, now);
    }
    const all = [...pairs.entries()];
    const judged = all.filter(([key, p]) => !key.startsWith('once|') && p.verdict);
    const rejected = judged.filter(([, p]) => p.verdict === 'rejected');
    const approved = judged.filter(([, p]) => p.verdict === 'approved');
    const lines = [
        `Demo review · ${demo} · round ${round || '(no round id)'} · rebuilt from the saved verdicts · ${judged.length} judged, ${approved.length} approved, ${rejected.length} not approved`,
    ];
    const plain = approved.filter(([, p]) => !p.note).map(([, p]) => p.label);
    if (plain.length) lines.push('', 'Approved:', ...plain.map((label) => `- ${label}`));
    if (rejected.length) lines.push('', 'Not approved:', ...rejected.map(([, p]) => `- ${p.label}: ${p.note}`));
    const noted = approved.filter(([, p]) => p.note);
    if (noted.length) lines.push('', 'Approved, with a note:', ...noted.map(([, p]) => `- ${p.label}: ${p.note}`));
    const open = all.filter(([key, p]) => !key.startsWith('once|') && !p.verdict && p.note);
    if (open.length) lines.push('', 'A note without a verdict yet:', ...open.map(([, p]) => `- ${p.label}: ${p.note}`));
    const picked = all.filter(([key]) => !key.startsWith('once|')).flatMap(([, p]) => [...p.choices].map(([id, value]) => `- ${p.label}: ${id}${/^(default changed|remove option)/.test(value) ? ': ' : ' = '}${value}`));
    if (picked.length) lines.push('', 'Picked per theme:', ...picked);
    const once = all.filter(([key]) => key.startsWith('once|')).flatMap(([key, p]) => [...p.choices].map(([id, value]) => `- ${key.split('|')[1]}: ${id}${/^(default changed|remove option)/.test(value) ? ': ' : ' = '}${value}`));
    if (once.length) lines.push('', 'Picked once, for every theme:', ...once);
    return lines.join('\n');
}

/*
 * An answer dropped as received is never dropped in silence: its text goes into the journal whole and every drop is
 * noted here (append-only, like the journal). The log is data only; the Agenda shows no notice of it and asks for no
 * "Seen" (Kenny, 2026-10-17: what is it for, why must I click Seen).
 */

/** Where the drops of every demo are noted: an array of { at, demo, round }, oldest first. */
export const RECEIVED_KEY = 'kp-demo-review:received-log';

/** @returns {{ at: string, demo: string, round: string }[]} */
export function receivedLog() {
    try {
        const list = JSON.parse(localStorage.getItem(RECEIVED_KEY) || '[]');
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

/** The text of an answer about to be dropped, kept in the journal beside its verdicts (also an answer from before the journal). */
function keepInJournal(/** @type {string} */ demo, /** @type {string} */ round, /** @type {string} */ text, /** @type {number} */ judged) {
    if (judged > 0 && text) journal(demo, { round, pair: ANSWER_PAIR, verdict: null, note: text, choice: null });
}

function noteReceived(/** @type {string} */ demo, /** @type {string} */ round) {
    try {
        localStorage.setItem(RECEIVED_KEY, JSON.stringify([...receivedLog(), { at: new Date().toISOString(), demo, round: round || '(no round id)' }]));
    } catch {
        /* storage refused: the journal still holds the verdicts */
    }
}
