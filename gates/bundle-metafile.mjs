// The export names of every published module, read from esbuild's own module graph [superset-1103].
//
// gates/bundle-names.mjs reads each module's text for `export function|class|const|…` and for re-exports from its own
// parts folder. A form it does not know (a re-export from a sibling file, from a folder of another name) drops the name
// from the bundle's flat exports without a word: acceptState, amountMakesSense and NL_KEPT_ENGLISH went that way, and
// getQuantity before them. esbuild resolves every form (`export *`, `export { a as b } from`, import-then-export), so
// its metafile is the authority on WHICH names a module exports; the text reader stays the authority on which module
// DECLARES a name, and this file reconciles the two.

import { join } from 'node:path';
import * as esbuild from 'esbuild';

/**
 * The names each module exports, from the metafile of one bundling run.
 * @param {string} root the package root
 * @param {string[]} modules `./js/<name>.js` paths
 * @returns {Promise<Map<string, string[]>>} module → its export names (`default` included), sorted
 */
export async function moduleExports(root, modules) {
    const result = await esbuild.build({
        entryPoints: modules.map((m) => m.slice(2)),
        absWorkingDir: root,
        bundle: true,
        splitting: true,
        format: 'esm',
        target: 'es2022',
        write: false,
        metafile: true,
        outdir: join(root, '.bundle-metafile-unused'),
    });
    /** @type {Map<string, string[]>} */
    const out = new Map();
    for (const output of Object.values(result.metafile.outputs)) {
        // A dynamically imported file is an output with an entryPoint too; only the asked modules count.
        if (output.entryPoint && modules.includes(`./${output.entryPoint}`)) out.set(`./${output.entryPoint}`, [...output.exports].sort());
    }
    for (const module of modules) if (!out.has(module)) throw new Error(`esbuild reported no exports for ${module}`);
    return out;
}

/**
 * Complete a declaration map with the names esbuild finds that the text reader missed.
 *
 * A name some module's text declares is left as the reader has it. A name no module declares but exactly one exports is
 * that module's own (it is declared in a part file that is not itself published). A name no module declares and several
 * export cannot be told apart from two bindings, so it fails the build rather than guessing.
 * A name the reader claims for a module that esbuild does not see exported is a reader fault and fails too.
 * @param {Map<string, string[]>} declared name → declaring modules, mutated
 * @param {Map<string, string[]>} exportsOf module → names esbuild sees exported
 * @returns {string[]} the names added, as `name (module)`
 */
export function completeDeclarations(declared, exportsOf) {
    for (const [name, modules] of declared) {
        for (const module of modules) {
            if (!exportsOf.get(module)?.includes(name)) throw new Error(`${module} is read as declaring \`${name}\`, which esbuild does not see it export`);
        }
    }
    /** @type {Map<string, string[]>} */
    const orphans = new Map();
    for (const [module, names] of exportsOf) {
        for (const name of names) {
            if (name !== 'default' && !declared.has(name)) orphans.set(name, [...(orphans.get(name) ?? []), module]);
        }
    }
    const added = [];
    for (const [name, modules] of orphans) {
        if (modules.length > 1) throw new Error(`\`${name}\` is exported by ${modules.join(', ')} and declared by none of them: the bundle cannot tell one binding from several`);
        declared.set(name, modules);
        added.push(`${name} (${modules[0]})`);
    }
    return added;
}
