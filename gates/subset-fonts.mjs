// Subset the shipped fonts from their upstream TTFs [T19, AR39].
//
// Not a gate: a build step run by hand when a family joins or a source
// moves, and the record of how every file under fonts/ was made.
// `fonts/families.json` is the plan — one entry per family with its
// licence, its Reserved Font Name status, the themes that name it, the
// scripts it ships and its files — and this script turns a directory of
// upstream TTFs (google/fonts, `ofl/<slug>/`) into the woff2 subsets the
// plan names, with `pyftsubset` (fonttools), one file per face and script.
//
//   node gates/subset-fonts.mjs --from <dir with <slug>/*.ttf> [--only <slug>]
//
// Why subsets: a latin face is 9–18 kB as woff2 where the upstream TTF is
// 50–900 kB, and a Japanese face is 2–9 MB whole; the per-theme budget
// (`fontsBudgetBytes`, 1.5 MB) is what a chassis-rs dashboard under
// `font-src 'self'` should have to carry. Why not the six families with a
// Reserved Font Name: a subset is a Modified Version under the OFL and may
// not carry the reserved name; R6-Q1 is Kenny's decision on those.
//
// The unicode ranges are Google Fonts' own for latin and latin-ext, the
// Arabic blocks plus presentation forms, and for Japanese the kana, the
// punctuation and symbols CJK pages, and the JIS X 0208 level 1 kanji
// (the 2,965 most used) — the same trade the web has made for a decade.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const FONTS = new URL('fonts/', root);

/** @type {Record<string, string>} script → unicode ranges, in pyftsubset's form */
export const SCRIPTS = {
    latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    'latin-ext':
        'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
    arabic: 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC',
    // Kana, CJK symbols and punctuation and the fullwidth forms; the JIS X
    // 0208 level 1 kanji come from fonts/jis-level-1.txt (2,965 code
    // points, not a contiguous range), passed as --unicodes-file below.
    japanese: 'U+3000-303F,U+3040-309F,U+30A0-30FF,U+FF00-FFEF',
};

/**
 * @typedef {{ file: string, source: string, weight: string, style: 'normal' | 'italic', scripts: string[] }} Face
 * @typedef {{ family: string, licence: string, reservedFontName: boolean, renamed?: string, reservedWord?: string, subset: boolean, themes: string[], scripts: string[], upstream: string, faces: Face[] }} Family
 */

/**
 * @param {string} from
 * @param {string | null} only
 */
export function subsetAll(from, only) {
    /** @type {Record<string, Family>} */
    const families = JSON.parse(readFileSync(new URL('families.json', FONTS), 'utf8'));
    delete (/** @type {Record<string, unknown>} */ (families)['//']);
    const made = [];
    for (const [slug, family] of Object.entries(families)) {
        if (only && slug !== only) continue;
        // A family with a Reserved Font Name ships as a renamed subset
        // (R6-Q1, Kenny 2026-09-07): the OFL lets a Modified Version exist
        // under another name, and gates/rename-font.py rewrites the name
        // records after the subset so the reserved word is gone from the
        // file. A reserved entry without a renamed name ships nothing.
        if (family.reservedFontName && !family.renamed) {
            console.log(`${slug}: Reserved Font Name and no renamed delivery — not subset`);
            continue;
        }
        const dir = new URL(`${slug}/`, FONTS);
        mkdirSync(dir, { recursive: true });
        const licence = `${from}/${slug}/OFL.txt`;
        if (existsSync(licence)) copyFileSync(licence, new URL('LICENSE', dir));
        for (const face of family.faces) {
            const source = `${from}/${slug}/${face.source}`;
            if (!existsSync(source)) throw new Error(`${slug}: ${face.source} not found under ${from}`);
            for (const script of face.scripts) {
                const target = new URL(`${face.file}${face.scripts.length > 1 ? `-${script}` : ''}.woff2`, dir);
                const args = [source, `--unicodes=${SCRIPTS[script]}`];
                // Japanese: the kana and punctuation ranges above plus the
                // JIS X 0208 level 1 kanji list, generated into fonts/.
                if (script === 'japanese') args.push(`--unicodes-file=${new URL('jis-level-1.txt', FONTS).pathname}`);
                execFileSync('pyftsubset', [
                    ...args,
                    '--flavor=woff2',
                    '--layout-features=*',
                    '--no-hinting',
                    '--desubroutinize',
                    `--output-file=${target.pathname}`,
                ]);
                if (family.renamed) {
                    execFileSync('python3', [
                        new URL('rename-font.py', import.meta.url).pathname,
                        target.pathname,
                        family.family,
                        family.renamed,
                        family.reservedWord ?? family.family,
                    ]);
                }
                made.push(`${slug}/${target.pathname.split('/').pop()} ${statSync(target).size}`);
            }
        }
    }
    return made;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const at = process.argv.indexOf('--from');
    if (at === -1) {
        console.error('usage: node gates/subset-fonts.mjs --from <dir> [--only <slug>]');
        process.exit(2);
    }
    const from = process.argv[at + 1];
    const onlyAt = process.argv.indexOf('--only');
    const only = onlyAt === -1 ? null : process.argv[onlyAt + 1];
    if (!existsSync(from) || !statSync(from).isDirectory() || readdirSync(from).length === 0) {
        console.error(`${from} is not a directory of upstream fonts`);
        process.exit(2);
    }
    const made = subsetAll(from, only);
    for (const line of made) console.log(line);
    console.log(`wrote ${made.length} file(s) under fonts/.`);
}
