// No key literal buried in a handler under js/ [keys-1103].
//
// Kenny, 2026-11-03: a keyboard shortcut is an option with a default in one named constant, never a literal in a
// handler. This gate reads every key comparison (`event.key === 'r'`, `event.code === 'KeyU'`, `case 'g':` in a key
// switch) and refuses one that names a key outside the standard widget keys (Escape, Enter, Space, the arrows, Home,
// End, Page Up/Down, Tab, Backspace, Delete, the context-menu keys): those are the WAI-ARIA keyboard semantics and stay
// as they are. Every other key is a default in the component's constants file (a string such as `'Mod+Enter'`) and is read
// through `resolveKeySpec` / `matchesKeySpec` (js/key-spec.js, the one parser and the only exempt file). There is no
// hand-kept list of exempt modules: the class-B set is the standard-key set in this file.
//
// Usage: node gates/check-key-literals.mjs

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { stale } from './key-table.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
/** The keys whose meaning a widget pattern fixes (WAI-ARIA authoring practices); never configurable. */
export const STANDARD_KEYS = new Set([
    'Escape', 'Enter', ' ', 'Tab', 'Backspace', 'Delete', 'Home', 'End', 'PageUp', 'PageDown',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ContextMenu', 'F10', 'F2', 'Dead', 'Shift', 'Control', 'Alt', 'Meta',
    'Unidentified', 'Process',
]);
/** The one file that may hold keys: the parser. A component's default key lives in its constants file as a string and is never compared. */
/** @param {string} path */
const ALLOWED = (path) => path === 'js/key-spec.js';
const SOURCE = /\.(js|mjs)$/;
/** A keyboard event's own name in this code base. */
const EVENT = String.raw`\b(?:event|e|ev|evt)`;

/** @param {string} dir @returns {string[]} */
function sources(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return sources(path);
        return SOURCE.test(entry.name) && !entry.name.endsWith('.d.ts') ? [path] : [];
    });
}

/** @param {string} text @returns {{ line: number, key: string }[]} the non-standard key comparisons outside comments */
export function findings(text) {
    /** @type {{ line: number, key: string }[]} */
    const out = [];
    // `const key = event.key;` then `key === 'x'`: the alias is the event's key too.
    const aliases = [...text.matchAll(new RegExp(String.raw`(?:const|let)\s+(\w+)\s*=\s*${EVENT}\.(?:key|code)\b`, 'g'))].map((m) => m[1]);
    const names = [String.raw`${EVENT}\.(?:key|code)`, ...aliases.map((a) => String.raw`\b${a}`)].map((n) => String.raw`${n}(?:\.toLowerCase\(\)|\.toUpperCase\(\))?`);
    const left = new RegExp(String.raw`(?:${names.join('|')})\s*[!=]==?\s*(['"])(.*?)\1`, 'g');
    const right = new RegExp(String.raw`(['"])(.*?)\1\s*[!=]==?\s*(?:${names.join('|')})`, 'g');
    const inSwitch = new RegExp(String.raw`switch\s*\(\s*(?:${names.join('|')})`).test(text);
    text.split('\n').forEach((line, index) => {
        if (/^\s*(\*|\/\/|\/\*)/.test(line)) return;
        const keys = [...line.matchAll(left), ...line.matchAll(right)].map((m) => m[2]);
        if (inSwitch) keys.push(...[...line.matchAll(/^\s*case\s+(['"])(.*?)\1\s*:/g)].map((m) => m[2]));
        for (const key of keys) if (!STANDARD_KEYS.has(key)) out.push({ line: index + 1, key });
    });
    return out.concat(tableFindings(text));
}

/**
 * A shortcut registered with a key typed into the call (`registerShortcuts(root, [{ keys: 's', … }])`) is a literal in a handler as much as
 * `event.key === 's'`: the key must come from an option (resolveEngineKeys). The standard widget keys stay exempt.
 * Reported as a warning until the components that still register a literal key have an option (the list below is printed, not kept). @param {string} text
 */
export function registeredFindings(text) {
    /** @type {{ line: number, key: string }[]} */
    const out = [];
    text.split('\n').forEach((line, index) => {
        if (/^\s*(\*|\/\/|\/\*)/.test(line)) return;
        for (const [, , keys] of line.matchAll(/\bkeys:\s*(['"])(.*?)\1/g)) {
            if (keys.split(/\s+/).some((k) => k !== '' && !STANDARD_KEYS.has(k === 'Space' ? ' ' : k) && !/^(mod|alt|shift)$/i.test(k))) out.push({ line: index + 1, key: keys });
        }
    });
    return out;
}

/** A table read by the event's key (`TABLE[event.key]`): its non-standard keys are shortcuts too. @param {string} text */
function tableFindings(text) {
    /** @type {{ line: number, key: string }[]} */
    const out = [];
    for (const [, name] of text.matchAll(new RegExp(String.raw`(\w+)\[\s*${EVENT}\.key(?:\.toLowerCase\(\))?\s*\]`, 'g'))) {
        const one = new RegExp(String.raw`const ${name}\s*=\s*(?:/\*\*[^\n]*?\*/\s*\()?\{([^}\n]*)\}`).exec(text);
        if (!one) continue;
        const line = text.slice(0, one.index).split('\n').length;
        for (const [, , key] of one[1].matchAll(/(?:^|,)\s*(['"]?)([^'":,\s]+)\1\s*:/g)) if (!STANDARD_KEYS.has(key)) out.push({ line, key });
    }
    return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const files = sources(join(ROOT, 'js')).map((f) => f.replace(ROOT, '')).filter((f) => !ALLOWED(f));
    const failures = files.flatMap((file) =>
        findings(readFileSync(join(ROOT, file), 'utf8')).map(
            ({ line, key }) => `[key-literals] ${file}:${line} compares the key ${JSON.stringify(key)} in a handler — make it an option: a default in the component's constants file, read with resolveKeySpec (js/key-spec.js).`,
        ),
    );
    // Registered keys (`keys: 's'`): the hole that let the focus-steps keys through [keys3-1104]; a warning while others remain.
    const registered = files.flatMap((file) => registeredFindings(readFileSync(join(ROOT, file), 'utf8')).map(({ line, key }) => `${file}:${line} registers the key ${JSON.stringify(key)}`));
    for (const w of registered) console.warn(`[key-literals] WARN ${w}: make it an option (resolveEngineKeys).`);
    const table = stale();
    if (table) failures.push(`[key-literals] ${table}`);
    if (failures.length > 0) {
        for (const failure of failures) console.error(failure);
        console.error(`\n${failures.length} key literal(s) over ${files.length} files.`);
        process.exit(1);
    }
    console.log(`key literals: ${files.length} files under js/ compare only the standard widget keys; every other key is an option (${registered.length} registered literal(s) warned about above).`);
}
