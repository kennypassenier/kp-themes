// The `pixels` command: which approvals still stand after a change, by comparing what they draw with.

import { knownBlocks, REGISTER } from '../check-verdicts.mjs';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, git } from './paths.mjs';
import { ratioOf, readRegister, writeRegister } from './register.mjs';
import { narrowing, shootAt } from './pixel-shoot.mjs';
/** @typedef {import('./types.mjs').Entry} Entry */

/** Where the pixel verdicts live [scope-138]. */
export const PIXELS = 'catalogue/pixel-checks.json';

/**
 * Judge by pixels what the markup hash cannot see [scope-138].
 *
 * Kenny, 2026-09-29: the block hash is the markup alone, and what CSS and
 * scripts do to a block is read from its pixels. Every approved entry is
 * photographed at the commit it was approved (or last carried) at and in the
 * working tree, in one browser of its engine at its ratio, each twice. Both
 * pairs of photographs steady and equal: the approval stands, and the entry is
 * carried to HEAD so the next run compares from here. Steady and different:
 * the pair comes back to Kenny. Not steady in either place: it comes back as
 * well, marked unstable. A block that no longer exists at HEAD comes back.
 * The outcome is written to catalogue/pixel-checks.json, which the review
 * page reads beside the register.
 * @param {string[]} args
 */
export async function pixels(args) {
    const width = (args.includes('--width') && Number(args[args.indexOf('--width') + 1])) || 1920;
    // The register and this command's own output may be dirty: a second run
    // at the same HEAD picks up where the first left them.
    const dirty = git(
        'status',
        '--porcelain',
        '--',
        'css',
        'js',
        'catalogue',
        'themes',
        'fonts',
        'components',
        'research',
        `:!${REGISTER}`,
        `:!${PIXELS}`,
    );
    if (dirty) throw new Error(`pixels compares against HEAD, and the working tree has changes:\n${dirty}`);
    const started = Date.now();
    const head = git('rev-parse', 'HEAD');
    const register = readRegister();
    /** @type {Map<string, { commit: string, engine: string, ratio: number, requests: { key: string, theme: string, entry: Entry }[] }>} */
    const groups = new Map();
    for (const [key, themes] of Object.entries(register.verdicts))
        for (const [theme, engines] of Object.entries(themes))
            for (const [engine, entry] of Object.entries(engines)) {
                if (entry.verdict !== 'approved' || entry.commit === head) continue;
                const id = `${entry.commit}|${engine}|${ratioOf(entry)}`;
                const group = groups.get(id) ?? { commit: entry.commit, engine, ratio: ratioOf(entry), requests: [] };
                group.requests.push({ key, theme, entry });
                groups.set(id, group);
            }
    if (!groups.size) {
        console.log(`${PIXELS}: every approval is already at ${head.slice(0, 12)}; nothing to compare.`);
        return;
    }
    /** @type {Record<string, Record<string, Record<string, { state: string, from: string, shot?: string }>>>} */
    let checks = {};
    // The browser the photographs are taken in: a digest is only reused in
    // the same one, since another build draws text a pixel differently.
    const { version: playwrightVersion } = JSON.parse(readFileSync(join(ROOT, 'node_modules/@playwright/test/package.json'), 'utf8'));
    // The recipe joins it: a digest taken before the page's head was hidden
    // and its clock fixed (2026-10-04) is not one to compare against.
    const renderer = `${process.platform} playwright ${playwrightVersion} width ${width} head hidden, clock fixed`;
    /** @type {any} */
    let earlier = null;
    if (existsSync(join(ROOT, PIXELS))) {
        earlier = JSON.parse(readFileSync(join(ROOT, PIXELS), 'utf8'));
        if (earlier.commit === head && earlier.hashVersion === register.hashVersion) checks = earlier.checks;
        if (earlier.hashVersion !== register.hashVersion || earlier.renderer !== renderer) earlier = null;
    }
    // The last run photographed HEAD as it then was; an approval carried to
    // that commit need not be photographed there again, only now [scope-138].
    // Kenny, 2026-09-30: runs took 28 to 38 min, nearly all of it spent
    // taking photographs, half of them of a commit already photographed.
    const cached = (/** @type {string} */ key, /** @type {string} */ theme, /** @type {string} */ engine, /** @type {string} */ commit) => {
        if (earlier === null || earlier.commit !== commit) return null;
        const shot = earlier.checks?.[key]?.[theme]?.[engine]?.shot;
        return typeof shot === 'string' ? { first: shot, second: shot } : null;
    };
    const put = (
        /** @type {string} */ key,
        /** @type {string} */ theme,
        /** @type {string} */ engine,
        /** @type {string} */ state,
        /** @type {string} */ from,
        /** @type {string | undefined} */ shot = undefined,
    ) => {
        checks[key] ??= {};
        checks[key][theme] ??= {};
        checks[key][theme][engine] = { state, from, ...(shot ? { shot } : {}) };
    };
    const tally = { carried: 0, reopened: 0, unstable: 0, gone: 0, untouched: 0 };
    const knownNow = await knownBlocks(ROOT);
    let n = 0;
    for (const { commit, engine, ratio, requests } of groups.values()) {
        n += 1;
        console.log(`[${n}/${groups.size}] ${commit.slice(0, 12)} in ${engine} at ratio ${ratio}: ${requests.length} pair(s)`);
        const here = requests.filter((r) => knownNow.has(r.key));
        for (const r of requests.filter((r) => !knownNow.has(r.key))) {
            put(r.key, r.theme, engine, 'reopened', commit);
            tally.gone += 1;
        }
        if (!here.length) continue;
        // A pair none of whose inputs moved since its approval carries
        // without a photograph: the files a page draws with are the shared
        // CSS, scripts and fonts, its theme's register and tokens, and its
        // own review page.
        const moved = git('diff', '--name-only', commit, head, '--', 'css', 'js', 'fonts', 'themes', 'components', 'catalogue', 'research')
            .split('\n')
            .filter((file) => file && !/^catalogue\/[^/]+\.json$/.test(file));
        // Finer, when every moved file is one catalogue/code-version.json
        // describes rule by rule (components.css, a register, a module the
        // loader attaches by selector): only a block naming a family of a
        // rule that changed, in its theme or in every theme, is asked about
        // [scope-116's map, used as Chromatic's TurboSnap uses its graph].
        const narrow = narrowing(commit, head, moved);
        // The review shell's own code (catalogue/*.css, *.js) is read in the
        // browser instead: a block whose shell print is the same at both
        // commits is not reached by it (printShell).
        const shell = moved.filter((file) => /^catalogue\/[^/]+\.(css|js)$/.test(file));
        const touchesPackage = (/** @type {{ key: string, theme: string }} */ r) => {
            const page = /** @type {any} */ (knownNow.get(r.key))?.page ?? '';
            return moved.some((file) => {
                if (shell.includes(file)) return false;
                const register = /^css\/(.+)-register\.css$/.exec(file) ?? /^themes\/([^/]+)\//.exec(file);
                if (register && register[1] !== r.theme) return false;
                if (/^catalogue\/[^/]+\.html$/.test(file)) return file === page;
                if (file.startsWith('research/')) return page.startsWith('research/');
                if (narrow && narrow.covers(file)) return narrow.touches(r.key, r.theme, page);
                return true;
            });
        };
        /** @type {Set<string>} */
        const shellReached = new Set();
        const rest = here.filter((r) => !touchesPackage(r));
        if (shell.length && rest.length) {
            const printed = Date.now();
            const before = await shootAt({ commit, engine, ratio, width, requests: rest, print: true });
            const after = await shootAt({ root: ROOT, engine, ratio, width, requests: rest, print: true });
            for (const r of rest) {
                const a = before.get(r.key)?.first;
                if (!a || a !== after.get(r.key)?.first) shellReached.add(r.key);
            }
            const reached = rest.filter((r) => shellReached.has(r.key)).length;
            console.log(
                `  shell (${shell.join(', ')}): ${reached} of ${rest.length} pair(s) reached, read in ${Math.round((Date.now() - printed) / 1000)} s`,
            );
        }
        const touches = (/** @type {{ key: string, theme: string }} */ r) => touchesPackage(r) || shellReached.has(r.key);
        const still = here.filter((r) => !touches(r));
        // Left where they are: nothing they draw with moved, so the next run
        // reads the same from the same commit, and a run that finds only
        // these writes nothing (a commit of its output would move HEAD and
        // give the release script a new run to ask for, forever).
        tally.carried += still.length;
        tally.untouched += still.length;
        if (still.length) console.log(`  ${still.length} of ${here.length} carried: nothing they draw with moved since ${commit.slice(0, 12)}`);
        const asked = here.filter((r) => touches(r));
        if (!asked.length) continue;
        const unseen = asked.filter((r) => cached(r.key, r.theme, engine, commit) === null);
        if (asked.length > unseen.length)
            console.log(`  ${asked.length - unseen.length} of ${asked.length} taken from the last run at ${commit.slice(0, 12)}`);
        // One photograph a side first; only a pair whose sides differ is
        // photographed again, twice a side, to tell a change from a block
        // that does not hold still.
        const then = unseen.length ? await shootAt({ commit, engine, ratio, width, requests: unseen, repeat: false }) : new Map();
        const now = await shootAt({ root: ROOT, engine, ratio, width, requests: asked, repeat: false });
        const doubt = asked.filter((r) => {
            const a = cached(r.key, r.theme, engine, commit) ?? then.get(`${r.key}|${r.theme}`);
            const b = now.get(`${r.key}|${r.theme}`);
            return !a || !b || a.first !== b.first;
        });
        if (doubt.length) {
            console.log(`  ${doubt.length} pair(s) differ: photographing them again, twice a side`);
            // In one browser, nothing else drawing beside it: under eight
            // browsers at once a block photographed steady on both sides yet
            // differently (page-effects--palette-narrow in pastel, 2026-09-30),
            // and alone it was identical.
            const thenAgain = await shootAt({ commit, engine, ratio, width, requests: doubt, parallel: 1 });
            const nowAgain = await shootAt({ root: ROOT, engine, ratio, width, requests: doubt, parallel: 1 });
            for (const [k, v] of thenAgain) then.set(k, v);
            for (const [k, v] of nowAgain) now.set(k, v);
        }
        const doubted = new Set(doubt.map((r) => `${r.key}|${r.theme}`));
        if (process.env.PIXELS_DEBUG)
            for (const r of doubt) {
                const k = `${r.key}|${r.theme}`;
                console.log(
                    `  debug ${k}: then ${JSON.stringify(then.get(k))} now ${JSON.stringify(now.get(k))} cached ${JSON.stringify(cached(r.key, r.theme, engine, commit))}`,
                );
            }
        for (const { key, theme, entry } of asked) {
            const a = doubted.has(`${key}|${theme}`)
                ? then.get(`${key}|${theme}`)
                : (cached(key, theme, engine, commit) ?? then.get(`${key}|${theme}`));
            const b = now.get(`${key}|${theme}`);
            let state = 'reopened';
            if (!a || !b) state = 'reopened';
            else if (a.first !== a.second || b.first !== b.second) state = 'unstable';
            else if (a.first === b.first) state = 'carried';
            put(key, theme, engine, state, commit, b && b.first === b.second ? b.first : undefined);
            tally[/** @type {'carried' | 'reopened' | 'unstable'} */ (state)] += 1;
            if (state === 'carried') entry.commit = head;
        }
    }
    if (tally.untouched === tally.carried && !tally.reopened && !tally.unstable && !tally.gone) {
        console.log(`${PIXELS}: ${tally.carried} approval(s) stand, nothing they draw with moved; nothing written.`);
        return;
    }
    writeRegister(register);
    writeFileSync(
        join(ROOT, PIXELS),
        `${JSON.stringify(
            {
                $comment:
                    'Pixel verdicts [scope-138]: each approved pair photographed at the commit it was approved or last carried at and at `commit`, in one browser of its engine at its ratio. carried: the same pixels, the approval stands; reopened: different pixels, or the block is gone; unstable: a photograph that did not repeat. Written by `node gates/verdicts.mjs pixels`.',
                hashVersion: register.hashVersion,
                commit: head,
                checked: new Date().toISOString(),
                renderer,
                checks,
            },
            null,
            4,
        )}\n`,
    );
    console.log(`pixels took ${Math.round((Date.now() - started) / 60000)} min`);
    // The Agenda's index carries the checks that reopen (gates/generate-agenda-index.mjs): written with them, or the
    // commit gate refuses the new pixel checks as a stale index [agenda-fast-1019].
    console.log(await (await import('../generate-agenda-index.mjs')).writeAgendaIndex());
    console.log(
        `${PIXELS}: ${tally.carried} carried, ${tally.reopened + tally.gone} reopened (${tally.gone} no longer a block), ${tally.unstable} unstable, compared against ${head.slice(0, 12)}.`,
    );
}
