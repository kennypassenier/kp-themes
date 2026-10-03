// Depth measure behind measure.sh. For each candidate element and each of the
// 22 registers it reads every leaf rule whose selector names the element and
// sorts the register into one of three bins:
//   none   - no rule names the element
//   tint   - rules exist but only recolour / re-radius / re-border it
//   (motion, a separate column: a rule that names the element declares an animation or transition)
//   shape  - at least one rule gives it its own shape or motion: an animation,
//            a ::before/::after, clip-path, mask, transform, content or a
//            gradient / background-image
// Run: node research/signature-elements/measure.mjs
import { readFileSync } from 'node:fs';
const root = new URL('../../', import.meta.url);
const themes = JSON.parse(readFileSync(new URL('themes/order.json', root)));

function leafRules(css) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const out = [];
    const stack = [];
    let buf = '';
    for (const ch of css) {
        if (ch === '{') { stack.push(buf.trim()); buf = ''; }
        else if (ch === '}') {
            const sel = stack.pop();
            if (sel !== undefined && !buf.includes('{')) out.push({ sel, body: buf });
            buf = '';
        } else if (ch === ';' && stack.length && !buf.includes(':') ) { buf += ch; }
        else buf += ch;
    }
    // A selector in `stack` holds declarations of earlier siblings; keep only the part after the last ';' or '}'.
    return out.map(r => ({ sel: r.sel.split(/[;}]/).pop().trim(), body: r.body }));
}
const SHAPE = /animation(-name)?\s*:\s*(?!none)|clip-path\s*:|mask(-image)?\s*:|transform\s*:|content\s*:|gradient\(|background-image\s*:|var\(--kp-brush/;
const candidates = {
    progress: /kp-progress(?![-\w])/, spinner: /kp-spinner/, skeleton: /kp-skeleton/, switch: /kp-switch/,
    'checkbox / radio': /kp-field__check|checkbox|radio/, 'range slider': /type=.range.|range-thumb|slider-thumb/,
    tooltip: /kp-tooltip/, toast: /kp-toast(?!s)/, alert: /kp-alert/, dialog: /kp-dialog/, 'dialog ::backdrop': /::backdrop/,
    divider: /data-kp-divider|(^|[\s,(])hr\b/, badge: /kp-badge/, tag: /kp-tag(?![-\w])/, pagination: /kp-pagination/,
    'wizard steps': /kp-wizard/, tabs: /kp-tab(?![-\w]*le)(?![\w-]*list)/, accordion: /kp-accordion|details|summary/,
    'empty state': /kp-empty/, breadcrumb: /kp-breadcrumb/, timeline: /kp-timeline/, 'back-to-top': /kp-to-top/,
    '::selection': /::selection/, 'link (a)': /(^|[\s,(>])a(?=[:\[\s,{.]|$)/, '<mark>': /(^|[\s,(>])mark\b/,
    'card hover': /kp-card[^,]*:hover/, 'table row hover': /(kp-table|kp-datatable)[^,]*(tr|row)[^,]*:hover/, kbd: /\bkbd\b/,
    '::placeholder': /::placeholder/, caret: null, cursor: null, scrollbar: null,
};
const props = { caret: /caret-color\s*:/, cursor: /(^|[\s;{])cursor\s*:/, scrollbar: /scrollbar/ };
const rows = [];
const perTheme = Object.fromEntries(themes.map(t => [t, leafRules(readFileSync(new URL(`css/${t}-register.css`, root), 'utf8'))]));
for (const [name, re] of Object.entries(candidates)) {
    const bins = { none: [], tint: [], shape: [], motion: [] };
    for (const t of themes) {
        const rules = perTheme[t];
        let hit;
        if (re) hit = rules.filter(r => r.sel.split(',').some(s => re.test(s)));
        else hit = rules.filter(r => props[name].test(r.body) || props[name].test(r.sel));
        if (hit.some(r => /(animation(-name)?|transition)\s*:\s*(?!none)/.test(r.body))) bins.motion.push(t);
        if (!hit.length) bins.none.push(t);
        else if (hit.some(r => SHAPE.test(r.body) || /::?(before|after)/.test(r.sel))) bins.shape.push(t);
        else bins.tint.push(t);
    }
    rows.push({ name, ...bins });
}
console.log('candidate'.padEnd(20), 'any'.padStart(5), 'shape'.padStart(6), 'motion'.padStart(7), ' shape-themes');
for (const r of rows) {
    const any = r.tint.length + r.shape.length;
    console.log(r.name.padEnd(20), `${any}/22`.padStart(5), `${r.shape.length}/22`.padStart(6), `${r.motion.length}/22`.padStart(7), ' ' + (r.shape.join(' ') || '-'));
}
