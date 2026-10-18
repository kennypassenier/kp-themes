// Writes demo.html from demo.template.html and options.mjs, so the control buttons and the dialog's choice sets come from one list.
//   node research/kyu-11-topic-subs/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { controlsHtml, choicesJson, GROUPS } from './options.mjs';

const here = new URL('.', import.meta.url);
let html = readFileSync(new URL('demo.template.html', here), 'utf8');
html = html.replace(/\{\{controls:(\w+)\}\}/g, (_, section) => controlsHtml(section));
// A section with no option group asks no choice: its attribute leaves the markup.
html = html.replace(/\s*data-review-choices='\{\{choices:(\w+)\}\}'/g, (_, section) =>
    GROUPS[section].some((g) => g.kind === 'option') ? `\n                data-review-choices='${choicesJson(section)}'` : '',
);
writeFileSync(new URL('demo.html', here), html);
console.log('demo.html written');
