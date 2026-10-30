// A split module is its facade `js/<name>.js` plus every file under `js/<name>/`.
//
// Kenny, 2026-10-30: no source file may grow huge again, so the biggest modules
// became a short facade over a folder of single-purpose files (see js/README.md).
// A gate that reads "the module" to ask what it imports, which attributes it
// reads or which events it names must read the facade and the parts together;
// this is the one place that knows how to gather them.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** Folders under `js/` that are not the parts of a module. */
const SEPARATE = new Set(['effects', 'vendor']);

/**
 * Facades whose parts sit in a folder of another name, because the folder of their own name holds something else:
 * `js/effects/` is the hooks, each scanned as a module of its own, so the parts of `js/effects.js` are in `js/effects-core/`.
 */
const PARTS_FOLDER = new Map([['effects', 'effects-core']]);

/**
 * Every `.js` file under `dir`, relative to it, sorted.
 *
 * @param {string} dir absolute path
 * @param {string} [prefix]
 * @returns {string[]}
 */
export function jsFilesUnder(dir, prefix = '') {
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
        .sort()
        .flatMap((name) => {
            const rel = prefix === '' ? name : `${prefix}/${name}`;
            if (statSync(join(dir, name)).isDirectory()) return jsFilesUnder(join(dir, name), rel);
            return name.endsWith('.js') ? [rel] : [];
        });
}

/**
 * The files of a module: its facade, then the parts in the order the imports reach them, which is the order the
 * code was written in before it was split.
 *
 * @param {string} jsDir absolute path of the `js/` folder
 * @param {string} file the facade's file name, `datatable.js`
 * @returns {string[]} paths relative to `jsDir`
 */
export function moduleFiles(jsDir, file) {
    const name = file.replace(/\.js$/, '');
    const folder = PARTS_FOLDER.get(name) ?? name;
    // `js/effects/` holds the hooks of js/effects.js, scanned as modules of their own; `js/vendor/` is not ours.
    if (SEPARATE.has(folder)) return [file];
    const own = new Set(jsFilesUnder(join(jsDir, folder), folder));
    /** @type {string[]} */
    const order = [file];
    const visit = (/** @type {string} */ at) => {
        const text = readFileSync(join(jsDir, at), 'utf8');
        for (const m of text.matchAll(/^(?:import|export)\b[^;]*?from\s+'(\.{1,2}\/[^']+)';/gm)) {
            const target = join(dirname(at), m[1]).split('\\').join('/');
            if (own.has(target) && !order.includes(target)) {
                order.push(target);
                visit(target);
            }
        }
    };
    visit(file);
    return [...order, ...[...own].filter((part) => !order.includes(part))];
}

/**
 * The source of a module as one text: the facade, then every part.
 *
 * @param {string} jsDir absolute path of the `js/` folder
 * @param {string} file the facade's file name, `datatable.js`
 * @returns {string}
 */
export function moduleSource(jsDir, file) {
    return moduleFiles(jsDir, file)
        .map((part) => readFileSync(join(jsDir, part), 'utf8').replace(/^\/\*\* @typedef \{import\('[^']+'\)\.\w+\} \w+ \*\/\n/gm, ''))
        .join('\n');
}

/**
 * The folders under `js/` that hold the parts of a split module, as `js/<name>/`.
 *
 * @param {string | URL} jsDir the `js/` folder
 * @returns {string[]}
 */
export function splitFolders(jsDir) {
    return readdirSync(jsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !SEPARATE.has(entry.name))
        .map((entry) => `js/${entry.name}/`)
        .sort();
}

/**
 * Which module a file belongs to for the loader's selector table: a part under `js/<name>/` belongs to `js/<name>.js`
 * when the loader attaches that one by selector, anything else to itself.
 *
 * @param {string} file `js/…`
 * @param {Map<string, string>} attached the loader's `js/<name>.js` to selector table
 * @returns {[string, string | undefined]} the owner and the selector that brings it in
 */
export function selectorOwner(file, attached) {
    const folder = /^js\/([^/]+)\/[^/]+\.js$/.exec(file)?.[1];
    const owner = folder !== undefined && attached.has(`js/${folder}.js`) ? `js/${folder}.js` : file;
    return [owner, attached.get(owner)];
}
