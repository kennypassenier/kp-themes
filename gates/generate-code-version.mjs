// What a block is made of, as a number [scope-114].
//
// Kenny, 2026-09-16: "Een component is de som van html+css+js+browserkeuze,
// daarop moet de hash gebaseerd zijn. Hoe het rendered kan mij geen fucking
// kloten schelen … Als ik iets goedkeur op 125% dan is het voor alle zoom
// levels goedgekeurd."
//
// So the block hash stops reading the paint and reads its inputs instead:
// the block's markup as written, the theme it is judged in, and this file —
// a digest of the code that shapes it. `shared` covers everything every theme
// uses (css/ without the registers, js/, components/); `themes` holds one
// digest per theme (its register and its tokens), so a change to dark's
// register asks Kenny about dark and leaves the other twenty-one alone.
//
//   node gates/generate-code-version.mjs            write catalogue/code-version.json
//   node gates/generate-code-version.mjs --check    refuse when it is stale
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const root = new URL('../', import.meta.url);
export const CODE_VERSION = 'catalogue/code-version.json';

/** @param {string[]} paths repository-relative, in a fixed order */
const digestOf = (paths) => {
    const hash = createHash('sha256');
    for (const path of [...paths].sort()) {
        hash.update(`${path}\0`);
        hash.update(readFileSync(new URL(path, root)));
        hash.update('\n');
    }
    return hash.digest('hex').slice(0, 32);
};

const files = (/** @type {string} */ dir, /** @type {(name: string) => boolean} */ keep) =>
    existsSync(new URL(dir, root))
        ? readdirSync(new URL(dir, root))
              .filter(keep)
              .map((name) => `${dir}${name}`)
        : [];

/** The digests the catalogue reads: what every theme shares, and what each theme adds. */
export function codeVersion() {
    const shared = [
        ...files('css/', (name) => name.endsWith('.css') && !name.endsWith('-register.css')),
        ...files('js/', (name) => name.endsWith('.js')),
        ...files('components/', (name) => name.endsWith('.jsx')),
    ];
    /** @type {Record<string, string>} */
    const themes = {};
    for (const name of JSON.parse(readFileSync(new URL('themes/order.json', root), 'utf8'))) {
        themes[name] = digestOf([`css/${name}-register.css`, `themes/${name}/tokens.json`].filter((path) => existsSync(new URL(path, root))));
    }
    return {
        $comment:
            'What a block is made of [scope-114]: the code that shapes it, as digests. catalogue/block-hash.js reads this instead of the paint, ' +
            'so a verdict does not follow the zoom, the window or what the reviewer typed. Written by gates/generate-code-version.mjs.',
        shared: digestOf(shared),
        themes,
    };
}

function main() {
    const wanted = `${JSON.stringify(codeVersion(), null, 4)}\n`;
    const file = new URL(CODE_VERSION, root);
    if (process.argv.includes('--check')) {
        const there = existsSync(file) ? readFileSync(file, 'utf8') : '';
        if (there !== wanted) {
            console.error(`${CODE_VERSION} is not what the code says [scope-114]; run node gates/generate-code-version.mjs`);
            process.exit(1);
        }
        const { shared, themes } = codeVersion();
        console.log(`code version: shared ${shared}, ${Object.keys(themes).length} theme digest(s), current.`);
        return;
    }
    writeFileSync(fileURLToPath(file), wanted);
    console.log(`${CODE_VERSION}: written.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
