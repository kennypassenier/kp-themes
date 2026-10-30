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

