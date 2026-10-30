// The code-version document itself: digests per family, module, component, base and theme.

import { loadMap, ruleFor, vocabularyOf } from '../tags.mjs';
import { selectorOwner, splitFolders } from '../js-parts.mjs';
import { digest, files, read, withoutTheVersion } from './sources.mjs';
import { ruleBucketsOf } from './selectors.mjs';
import { ATTACHED_BY_SELECTOR, MARKERS, NOT_A_BLOCK_INPUT, root } from './config.mjs';
import { componentsOf, familiesIn } from './families.mjs';

/** The digests catalogue/block-hash.js reads, version 6 [scope-116]. */
export function codeVersion() {
    const map = loadMap();
    const vocabulary = vocabularyOf(map);
    const themes = /** @type {string[]} */ (JSON.parse(read('themes/order.json')));

    /** @type {Map<string, string[]>} */
    const ruleLines = new Map();
    /** @type {Map<string, string[]>} */
    const keyframeLines = new Map();
    /** @type {{ family: string, lines: string[] }[]} */
    const allFaces = [];
    /** @type {string[]} */
    const base = [];
    /** @type {Record<string, string[]>} */
    const themeBase = Object.fromEntries(themes.map((t) => [t, [read(`themes/${t}/tokens.json`)]]));

    for (const file of files('css/', (name) => name.endsWith('.css'))) {
        if (ruleFor(file, map, vocabulary)?.rule.none) continue;
        const theme = /^css\/(.+)-register\.css$/.exec(file)?.[1];
        const buckets = ruleBucketsOf(read(file));
        for (const [key, lines] of buckets.rules) {
            const [named, condition, right] = key.split('||');
            // A register's rules are its theme's even where the selector
            // carries no `[data-theme]`: the file is only served with it.
            const full = `${named || theme || ''}||${condition}||${right}`;
            ruleLines.set(full, [...(ruleLines.get(full) ?? []), `${file}\0`, ...lines]);
        }
        for (const [name, lines] of buckets.keyframes) keyframeLines.set(name, [...(keyframeLines.get(name) ?? []), `${file}\0`, ...lines]);
        allFaces.push(...buckets.faces);
        if (theme && themeBase[theme]) themeBase[theme].push(`${file}\0`, ...buckets.page);
        else if (!theme) base.push(`${file}\0`, ...buckets.page);
        for (const [named, lines] of buckets.themed) {
            if (themeBase[named]) themeBase[named].push(`${file}\0`, ...lines);
            else base.push(`${file}\0`, ...lines);
        }
    }

    // A keyframe belongs to the rules that run it [scope-137]: the frames
    // move with whoever animates them, and one nobody runs is everyone's.
    const runs = (/** @type {string} */ text, /** @type {string} */ name) => new RegExp(`(^|[\\s,:])${name}([\\s,;)]|$)`).test(text);
    const unrun = new Set(keyframeLines.keys());
    for (const [key, lines] of ruleLines) {
        const text = lines.join('\n');
        for (const [name, frames] of keyframeLines) {
            if (!runs(text, name)) continue;
            unrun.delete(name);
            ruleLines.set(key, [...lines, `@keyframes ${name}\0`, ...frames]);
        }
    }
    for (const name of unrun) base.push(`@keyframes ${name}\0`, ...(keyframeLines.get(name) ?? []));

    // A face belongs to the themes that ask for it by name [scope-137]:
    // measured 2026-09-20, 47 of 62 are named by exactly one theme.
    for (const face of allFaces) {
        const wanted = themes.filter((t) => {
            const tokens = JSON.parse(read(`themes/${t}/tokens.json`));
            return tokens.entries.some(
                (/** @type {{ token?: string, value?: string }} */ entry) =>
                    entry.token?.startsWith('theme-font-') &&
                    new RegExp(`(^|[,'"\\s])${face.family.replace(/[.*+?^$()|[\]\\]/g, '\\$&')}([,'"\\s]|$)`).test(entry.value ?? ''),
            );
        });
        if (wanted.length === 0) base.push(`@font-face ${face.family}\0`, ...face.lines);
        else for (const t of wanted) themeBase[t].push(`@font-face ${face.family}\0`, ...face.lines);
    }

    /** @type {Record<string, { modules: string[], families: Set<string> }>} */
    const components = {};
    /** @type {Record<string, string[]>} */
    const selectorParts = {};
    for (const file of [
        ...files('js/', (n) => n.endsWith('.js')),
        ...['js/effects/', ...splitFolders(new URL('js/', root))].flatMap((dir) => files(dir, (n) => n.endsWith('.js'))),
        ...files('components/', (n) => n.endsWith('.jsx')),
    ]) {
        if (NOT_A_BLOCK_INPUT.has(file)) continue;
        const hit = ruleFor(file, map, vocabulary);
        if (!hit || hit.rule.none) continue;
        const source = withoutTheVersion(read(file));
        if (hit.rule.all) {
            base.push(`${file}\0`, source);
            continue;
        }
        const named = (hit.rule.tags ?? [])
            .filter((/** @type {string} */ t) => t.startsWith('@component:'))
            .map((/** @type {string} */ t) => t.slice('@component:'.length));
        // A module that no component claims is everyone's.
        if (named.length === 0) base.push(`${file}\0`, source);
        // A module the loader attaches by selector is its own input: the
        // block that matches the selector is the block that loads it, and no
        // other block of the component pays for it [scope-136].
        const [owner, when] = selectorOwner(file, ATTACHED_BY_SELECTOR);
        if (when !== undefined) (selectorParts[owner] ??= []).push(`${file}\0`, source);
        for (const name of named) {
            components[name] ??= { modules: [], families: new Set() };
            if (when === undefined) components[name].modules.push(`${file}\0`, source);
            for (const f of familiesIn(source)) components[name].families.add(f);
        }
    }

    return {
        $comment:
            'What a block is made of [scope-114, scope-116]: per CSS family and per component, the code that shapes it, as digests. ' +
            'catalogue/block-hash.js reads the families a block names, the components those belong to and the modules its markup asks the loader for, so a change asks only about the blocks it touches. ' +
            'Written by gates/generate-code-version.mjs.',
        base: digest(base),
        modules: Object.fromEntries(
            Object.keys(selectorParts)
                .sort()
                .map((file) => [file, { digest: digest(selectorParts[file]), when: ATTACHED_BY_SELECTOR.get(file) }]),
        ),
        themes: Object.fromEntries(themes.map((t) => [t, digest(themeBase[t])])),
        rules: Object.fromEntries([...ruleLines.keys()].sort().map((key) => [key, digest(/** @type {string[]} */ (ruleLines.get(key)))])),
        components: Object.fromEntries(
            Object.keys(components)
                .sort()
                .map((name) => [
                    name,
                    {
                        modules: components[name].modules.length ? digest(components[name].modules) : '-',
                        // Only what the module draws of its own: a family another
                        // component owns (the confirm dialog's `kp-button`) is that
                        // component's, and a block carrying it pays for it there.
                        families: [...components[name].families]
                            .filter((f) => {
                                const owners = componentsOf(f, map.selectors);
                                return owners.length === 0 || owners.includes(name);
                            })
                            .sort(),
                    },
                ]),
        ),
        selectors: map.selectors,
        markers: MARKERS,
    };
}
