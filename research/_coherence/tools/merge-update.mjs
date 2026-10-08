// Applies one update round to a character demo's data (the designer's side of
// an update, research/_review/README.md "An update after a verdict"):
//   node research/_coherence/tools/merge-update.mjs <theme> <path to a module>
// The module exports:
//   UPDATE   the round's number (update.json "update")
//   ROUND    the new data-review-round id, e.g. '2026-10-09-r2'
//   PICKS    { <question id>: <option key> } the questions he approved
//   COMMENTS { <question id>: <his comment, verbatim> } the questions it reopens
//   REPLY    what changed, shown beside every comment
//   patch(aspects) -> aspects   the new data for the reopened questions
//   STORY    (optional) a replacement for the intro's `STORY`
// It rewrites aspects.js (the header comment kept, a note added), writes
// update.json and bumps the round in demo.html. Run prettier afterwards.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [theme, modPath] = process.argv.slice(2);
const dir = `research/${theme}-character`;
const cur = await import(pathToFileURL(resolve(`${dir}/aspects.js`)).href + `?t=${Date.now()}`);
const upd = await import(pathToFileURL(resolve(modPath)).href);

const aspects = upd.patch(structuredClone(cur.ASPECTS));
const ids = new Set(aspects.map((a) => a.id));
for (const id of [...Object.keys(upd.PICKS), ...Object.keys(upd.COMMENTS)]) if (!ids.has(id)) throw new Error(`unknown question ${id}`);
for (const a of aspects) if (!(a.id in upd.PICKS) && !(a.id in upd.COMMENTS)) throw new Error(`question ${a.id} is neither picked nor reopened`);
for (const [id, key] of Object.entries(upd.PICKS))
    if (!aspects.find((a) => a.id === id).options.some((o) => o.key === key)) throw new Error(`pick ${id}=${key} has no option`);

const old = readFileSync(`${dir}/aspects.js`, 'utf8');
const header = old
    .split('\n')
    .slice(
        0,
        old.split('\n').findIndex((l) => !l.startsWith('//')),
    )
    .join('\n');
const story = upd.STORY ?? cur.STORY;
const out = `${header}
// Update ${upd.UPDATE} (${upd.ROUND}): the questions Kenny did not approve are redrawn (his comments are in update.json); his picks stay as they were.

export const THEME = ${JSON.stringify(cur.THEME)};
export const LABEL = ${JSON.stringify(cur.LABEL)};
export const TITLE = ${JSON.stringify(cur.TITLE)};
export const STORY = ${JSON.stringify(story, null, 4)};

/**
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
export const ASPECTS = ${JSON.stringify(aspects, null, 4)};
`;
writeFileSync(`${dir}/aspects.js`, out);

const questions = {};
for (const [id, comment] of Object.entries(upd.COMMENTS)) questions[id] = { comment, reply: upd.REPLY[id] ?? upd.REPLY._ };
writeFileSync(
    `${dir}/update.json`,
    JSON.stringify({ update: upd.UPDATE, picks: { [theme]: upd.PICKS }, questions: { [theme]: questions } }, null, 4) + '\n',
);

const html = readFileSync(`${dir}/demo.html`, 'utf8');
const bumped = html.replace(/\{ "round": "[^"]*", "reopen": \[[^\]]*\] \}/, `{ "round": "${upd.ROUND}", "reopen": [] }`);
if (bumped === html) throw new Error('round marker not found');
writeFileSync(`${dir}/demo.html`, bumped);
console.log(theme, 'update', upd.UPDATE, upd.ROUND, 'reopened:', Object.keys(upd.COMMENTS).join(', '));
