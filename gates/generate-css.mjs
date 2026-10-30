// The CSS source generator.
//
// css/components.css and the twelve css/<theme>-register.css files are
// GENERATED. Their source is the part files under css/components/ and
// css/registers/<theme>/, joined in the fixed order each folder's
// index.json lists. Nobody edits the generated files by hand; `--check`
// fails when one has drifted from its parts, which is also the gate that
// refuses a hand edit.
//
// A manifest (index.json) is { output, items }, and an item is either
//   { "file": "button.css" }                      a part copied as is, or
//   { "open": "...", "files": [...], "close": "..." }
//                                                 a layer block split over
//                                                 several parts: the exact
//                                                 opening text (a lead
//                                                 comment and the `@layer`
//                                                 line), the parts inside it,
//                                                 and the exact closing text.
// The output is the items concatenated, nothing added between them.
//
// Every part starts with one header line, `/* @part: <what it styles> */`.
// It is for the reader and the generator STRIPS it, so the generated output
// is byte-identical to what it was before the split.
//
// Usage:
//   node gates/generate-css.mjs           write the generated files
//   node gates/generate-css.mjs --check   exit 1 on drift, orphans or a
//                                         missing header

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const HEADER = /^\/\* @part: [^\n]*\*\/\n/;

/** @param {string} dir @returns {string[]} */
function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}

/** The manifests, in a fixed order: components first, then the registers by theme name. */
function manifestDirs() {
    const dirs = ['css/components'];
    for (const e of readdirSync(join(ROOT, 'css/registers'), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (e.isDirectory()) dirs.push(`css/registers/${e.name}`);
    }
    return dirs;
}

/** @returns {{ output: string, text: string, problems: string[] }[]} */
export function build() {
    return manifestDirs().map((dir) => {
        const problems = [];
        const manifest = JSON.parse(readFileSync(join(ROOT, dir, 'index.json'), 'utf8'));
        const used = new Set();
        const part = (/** @type {string} */ name) => {
            used.add(name);
            const path = join(ROOT, dir, name);
            if (!existsSync(path)) {
                problems.push(`${dir}/${name} is listed in index.json but does not exist`);
                return '';
            }
            const raw = readFileSync(path, 'utf8');
            if (!HEADER.test(raw)) problems.push(`${dir}/${name} has no \`/* @part: ... */\` header line`);
            return raw.replace(HEADER, '');
        };
        let text = '';
        for (const item of manifest.items) {
            if (item.file) text += part(item.file);
            else text += item.open + item.files.map(part).join('') + item.close;
        }
        for (const f of walk(join(ROOT, dir))) {
            const rel = relative(join(ROOT, dir), f);
            if (rel !== 'index.json' && !used.has(rel)) problems.push(`${dir}/${rel} is not listed in index.json (an orphan part is never built)`);
        }
        return { output: manifest.output, text, problems };
    });
}

function main() {
    const check = process.argv.includes('--check');
    const failures = [];
    let written = 0;
    for (const { output, text, problems } of build()) {
        failures.push(...problems);
        const path = join(ROOT, output);
        const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
        if (current === text) continue;
        if (check)
            failures.push(
                `${output} differs from its parts: edit the part files under ${output === 'css/components.css' ? 'css/components/' : 'css/registers/'}, then run \`npm run generate:css\`; never edit ${output} by hand`,
            );
        else {
            writeFileSync(path, text);
            written++;
        }
    }
    // css/README.md is the index of the part files: every top-level entry of css/components/ appears in it ...
    const readme = existsSync(join(ROOT, 'css/README.md')) ? readFileSync(join(ROOT, 'css/README.md'), 'utf8') : '';
    for (const e of readdirSync(join(ROOT, 'css/components'), { withFileTypes: true })) {
        const entry = e.isDirectory() ? `${e.name}/` : e.name;
        if (e.name !== 'index.json' && !readme.includes(`\`${entry}\``)) failures.push(`css/README.md does not index css/components/${entry}`);
    }
    // ... and so does every top-level entry of every css/registers/<theme>/, under that theme's `### <theme>` heading.
    for (const t of readdirSync(join(ROOT, 'css/registers'), { withFileTypes: true })) {
        if (!t.isDirectory()) continue;
        const at = readme.indexOf(`\n### ${t.name}\n`);
        const section = at < 0 ? '' : readme.slice(at + 1).split(/\n#{2,3} /)[0];
        if (at < 0) failures.push(`css/README.md has no \`### ${t.name}\` section for css/registers/${t.name}/`);
        for (const e of readdirSync(join(ROOT, 'css/registers', t.name), { withFileTypes: true })) {
            const entry = e.isDirectory() ? `${e.name}/` : e.name;
            if (at >= 0 && e.name !== 'index.json' && !section.includes(`\`${entry}\``)) failures.push(`css/README.md does not index css/registers/${t.name}/${entry}`);
        }
    }
    if (failures.length) {
        console.error(failures.map((f) => `generate-css: ${f}`).join('\n'));
        process.exit(1);
    }
    console.log(check ? 'generate-css: generated CSS matches its parts' : `generate-css: ${written} file(s) written`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
