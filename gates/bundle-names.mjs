// The names a module of js/ declares, for the bundle's flat exports (gates/generate-bundle.mjs). Its own module so a test
// can import it: the generator runs on import.

import { PARTS_FOLDER } from './js-parts.mjs';

/**
 * The names a module declares: its own `export function|class|const|let|var`, and, for a facade over its own folder
 * (js/<name>.js over js/<name>/, or the folder gates/js-parts.mjs names), the names it re-exports from that folder. Those are declared in the
 * module's own parts, so they are the module's declarations and keep their flat export after the split; a name passed on
 * from another module (`export { THEMES } from './theme-registry.js'`) still is not.
 * @param {string} module the module's path, `./js/<name>.js`
 * @param {string} source its text
 * @returns {string[]}
 */
export function declaredNames(module, source) {
    const names = [...source.matchAll(/^export\s+(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z0-9_$]+)/gm)].map((m) => m[1]);
    const name = module.replace(/^\.\/js\//, '').replace(/\.js$/, '');
    // A facade whose parts live in a folder of another name (js/effects.js over js/effects-core/).
    const folder = PARTS_FOLDER.get(name) ?? name;
    for (const block of source.matchAll(/^export\s*\{([^}]*)\}\s*from\s*['"]\.\/([\w-]+)\//gm)) {
        if (block[2] !== folder) continue;
        for (const item of block[1].split(',')) {
            const name = item.trim().split(/\s+as\s+/).pop()?.trim();
            if (name && !name.startsWith('type ')) names.push(name);
        }
    }
    return names.filter(Boolean);
}


/**
 * The flat name a bundle gives a name that more than one module declares, so it stays importable by name: the module's
 * own prefix in the name's own case. `setProgress` from js/progressbar.js is `progressbarSetProgress`, `OPEN_EVENT` from
 * js/palette.js is `PALETTE_OPEN_EVENT` [bundle-alias-1031, homelab 2026-10-31].
 * @param {string} module the module's path, `./js/<name>.js`
 * @param {string} name the name it declares
 * @returns {string}
 */
export function aliasFor(module, name) {
    const base = module.replace(/^\.\/js\//, '').replace(/\.js$/, '');
    if (/^[A-Z0-9_]+$/.test(name)) return `${base.replace(/-/g, '_').toUpperCase()}_${name}`;
    const prefix = base.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return prefix + name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * The aliases for every name declared by more than one module. Throws when an alias would itself collide with a declared
 * name or another alias, so a collision fails the build instead of dropping a name silently (esbuild leaves out an
 * ambiguous star export without a word).
 * @param {Map<string, string[]>} declared name → the modules that declare it
 * @returns {{ module: string, name: string, alias: string }[]}
 */
export function aliases(declared) {
    const out = [];
    const taken = new Set(declared.keys());
    for (const [name, modules] of declared) {
        if (modules.length < 2) continue;
        for (const module of modules) {
            const alias = aliasFor(module, name);
            if (taken.has(alias)) throw new Error(`the bundle alias \`${alias}\` for ${name} from ${module} collides with another export`);
            taken.add(alias);
            out.push({ module, name, alias });
        }
    }
    return out;
}
