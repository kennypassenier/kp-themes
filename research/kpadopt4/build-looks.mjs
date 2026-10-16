#!/usr/bin/env node
// Fill each section's "what to look at" block of demo.html from looks/<theme>.json.
//
//   node research/kpadopt4/build-looks.mjs
//
// looks/<theme>.json is { "<item id>": "<paragraph>" }. Every section's <div data-review-look> gets one
// <p data-for="<theme>"> per theme of the page's data-review-themes, in that order. Only the content between the
// <!-- looks:start --> and <!-- looks:end --> markers inside the block is rewritten (the markers are added on the
// first run), and the file is formatted with the repository's prettier, so the script is idempotent and can be run again whenever a theme's json changes. A theme without a
// json yet, or without an entry for the section, gets a short placeholder paragraph.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';

const dir = fileURLToPath(new URL('./', import.meta.url));
const pagePath = `${dir}demo.html`;
let page = readFileSync(pagePath, 'utf8');

const themes = (/<html[^>]*data-review-themes="([^"]+)"/.exec(page)?.[1] ?? '').split(',').filter(Boolean);
if (!themes.length) throw new Error('demo.html has no data-review-themes');

/** @param {string} text */
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const title = (theme) => theme[0].toUpperCase() + theme.slice(1);

/** @type {Record<string, Record<string, string>>} */
const looks = {};
for (const theme of themes) {
    const file = `${dir}looks/${theme}.json`;
    looks[theme] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
}

const START = '<!-- looks:start -->';
const END = '<!-- looks:end -->';
const INDENT = ' '.repeat(20);
let filled = 0;
let placeholders = 0;

page = page.replace(
    /(<section\b[^>]*?data-review-item="([^"]+)"[\s\S]*?<div data-review-look>)([\s\S]*?)(<\/div>)/g,
    (whole, head, item, inner, close) => {
        const lines = themes.map((theme) => {
            const text = looks[theme][item];
            if (text) filled += 1;
            else placeholders += 1;
            const body = text
                ? escape(text)
                : `${title(theme)}: this theme's notes for this section are still being written; judge it against the Expected block.`;
            return `${INDENT}<p data-for="${theme}">${body}</p>`;
        });
        const block = `\n${INDENT}${START}\n${lines.join('\n')}\n${INDENT}${END}\n${' '.repeat(16)}`;
        if (inner.includes(START) && inner.includes(END)) {
            const before = inner.slice(0, inner.indexOf(START));
            const after = inner.slice(inner.indexOf(END) + END.length);
            return `${head}${before}${START}\n${lines.join('\n')}\n${INDENT}${END}${after}${close}`;
        }
        return `${head}${block}${close}`;
    },
);

// Written the way the repository's prettier writes it, so a re-run after a format changes nothing.
const options = (await prettier.resolveConfig(pagePath)) ?? {};
writeFileSync(pagePath, await prettier.format(page, { ...options, filepath: pagePath }));
console.log(`${themes.length} themes, ${filled} looks written, ${placeholders} placeholders`);
