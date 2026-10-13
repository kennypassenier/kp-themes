// @ts-nocheck: scratch: one line per pair, one column per theme, from out/<theme>/pairs.txt
//   "."  passes · "O0" the open runs nothing · "C0" the close runs nothing · "T" open and close differ in length · n = worst % off
import { readFileSync, existsSync } from 'node:fs';
const th = JSON.parse(readFileSync(new URL('../../../themes/order.json', import.meta.url)));
const rows = {};
for (const t of th) {
    const f = new URL(`./out/${t}/pairs.txt`, import.meta.url);
    if (!existsSync(f)) continue;
    for (const l of readFileSync(f, 'utf8').split('\n')) {
        const m = /^(ok  |FAIL) (\S+)\s+open (\d+) ms, close (\d+) ms, worst ([\d.]+)/.exec(l);
        if (!m) continue;
        const [, ok, id, o, c, w] = m;
        (rows[id] ??= {})[t] = ok === 'ok  ' ? '.' : +o === 0 ? 'O0' : +c === 0 ? 'C0' : (Math.abs(o - c) > o * 0.06 ? 'T' : '') + Math.round(w);
    }
}
console.log('pair'.padEnd(21) + th.map((x) => x.slice(0, 5).padEnd(6)).join(''));
for (const [p, r] of Object.entries(rows)) console.log(p.padEnd(21) + th.map((x) => (r[x] ?? '?').padEnd(6)).join(''));
