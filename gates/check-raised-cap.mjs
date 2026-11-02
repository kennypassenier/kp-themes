// A raised surface never caps itself to a shell [forms-1102 r2, Kenny 2026-11-02].
//
// Kenny, on the chip menu in the review dialog: "right now I see a menu without items in them, just the shell, it's got a
// bit of width but only a sliver of height". The menu button's menu capped its height at calc(100dvh - 12rem); in a window
// 177 px tall (the review lane's frame, an embed, a phone on its side) that is below zero, so the open menu was its border
// and padding alone, 10 px, and the script could not place what the stylesheet had already cut away.
//
// This gate reads the generated components and every register and refuses a height cap on a raised surface (a menu, a
// popover, a listbox) that follows the window's height (vh, dvh, svh, lvh) without a floor: the value must sit inside
// max() or clamp(), so that a short window still leaves room for the surface's rows (the script then fits it in the room
// it really has, js/menu-button/placement.js).
//
// Usage: node gates/check-raised-cap.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** The subject of a raised surface: what floats over the page and holds rows. */
const RAISED = /\.kp-menu\b|\.kp-popover\b|\[popover\]|\.kp-context-menu\b|\.kp-theme-menu__list\b|\.kp-combobox__list\b|\[role=['"]?listbox/;
/** A height cap. */
const CAP = /(?:^|;)\s*(max-block-size|max-height)\s*:\s*([^;]+)/g;
/** A length that follows the window's height. */
const WINDOW = /\b100[dsl]?vh\b/;
/** A floor around it. */
const FLOOR = /\b(?:max|clamp)\(/;

/** Every innermost rule of a stylesheet, comments stripped. @param {string} css */
function rules(css) {
    const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
    return [...bare.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), body: m[2] }));
}

/** @param {string} file */
function check(file) {
    const found = [];
    for (const { selector, body } of rules(readFileSync(ROOT + file, 'utf8'))) {
        if (!RAISED.test(selector)) continue;
        for (const [, prop, value] of body.matchAll(CAP)) {
            if (WINDOW.test(value) && !FLOOR.test(value)) found.push(`${file}: ${selector.replace(/\s+/g, ' ')} { ${prop}: ${value.trim()} }`);
        }
    }
    return found;
}

const files = ['css/components.css', ...readdirSync(ROOT + 'css').filter((f) => f.endsWith('-register.css')).map((f) => `css/${f}`)];
const faults = files.flatMap(check);
if (faults.length) {
    console.error(`check-raised-cap: ${faults.length} height cap(s) on a raised surface follow the window without a floor; wrap them in max(…, min(16rem, 100dvh - 1rem)):`);
    for (const f of faults) console.error(`  ${f}`);
    process.exit(1);
}
console.log(`check-raised-cap: ok (${files.length} stylesheets, every raised surface's window cap has a floor)`);
