// @ts-nocheck: scratch audit tooling, not shipped
// Reads out/<theme>/identity.txt (identity.mjs) and classifies every part's open and close by what
// they animate on the part itself (the trigger's own hover transitions are left out):
//   OWN   the theme's keyframes (kp-sig-<theme>...) or a scripted effect on more than opacity
//   FADE  only opacity: the package's generic fade, not the theme's language
//   NONE  nothing runs
// and marks a pair whose close animates a different family than its open (ASYM).
//   node research/all-themes/_audit/identity-summary.mjs [theme,theme]
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const dir = new URL('./out/', import.meta.url);
const want = (process.argv[2] ?? '').split(',').filter(Boolean);
const TRIGGER = /@(button|a)\.kp-(button|icon-button|nav__link|nav__toggle|sidenav__toggle)\b/;
// the page's own boot and heading loops, and the trigger's pointer effects, still running when the pair starts
const PAGE = /@(div\.kp-boot|h1\b|button\.kp-(button|icon-button)::)/;
const parse = (line) =>
    line === 'NO ANIMATION'
        ? []
        : line
              .split('; ')
              .map((s) => s.trim())
              .filter((s) => s && !(s.startsWith('transition:') && TRIGGER.test(s)) && !PAGE.test(s));
const props = (list) =>
    new Set(
        list.flatMap((s) => {
            const m = /^script\[([^\]]*)\]/.exec(s);
            if (m) return m[1].split(',');
            const t = /^transition:([a-z-]+)/.exec(s);
            if (t) return [t[1]];
            return [s.split('@')[0].replace(/(-back|-rtl|-\d+)+$/, '')];
        }),
    );
for (const t of readdirSync(dir).filter((x) => (want.length ? want.includes(x) : true))) {
    const f = new URL(`./${t}/identity.txt`, dir);
    if (!existsSync(f)) continue;
    const lines = readFileSync(f, 'utf8').split('\n');
    const out = [];
    for (let i = 0; i < lines.length; i++) {
        const head = /^(ok  |FAIL) (\S+)/.exec(lines[i]);
        if (!head) continue;
        const open = parse(lines[i + 1].replace(/^\s*open\s+->\s*/, ''));
        const close = parse(lines[i + 2].replace(/^\s*close\s+->\s*/, ''));
        const kind = (l) => {
            if (!l.length) return 'NONE';
            if (l.some((s) => s.startsWith(`kp-sig-${t}`))) return 'OWN';
            // A plain slide or fade (the package's translate / opacity / scale transitions or scripted copies) is not the
            // theme's effect: it read OWN here once and hid dark's sliding side navigation (2026-10-13).
            const p = props(l);
            for (const plain of ['opacity', 'translate', 'transform', 'scale', 'kp-sidenav-backdrop']) p.delete(plain);
            return p.size ? 'OWN' : 'PLAIN';
        };
        const ko = kind(open);
        const kc = kind(close);
        const po = [...props(open)].sort().join(',');
        const pc = [...props(close)].sort().join(',');
        const asym = ko !== kc || po !== pc;
        out.push(`  ${head[2].padEnd(17)} open ${ko.padEnd(4)} close ${kc.padEnd(4)}${asym ? `  ASYM open[${po}] close[${pc}]` : ''}`);
    }
    console.log(`\n## ${t}`);
    console.log(out.join('\n'));
}
