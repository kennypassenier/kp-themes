// @ts-nocheck
// node research/cyberpunk-applied/_audit/summarize.mjs <engine> <timing|running|corners|fonts|prefix|pointing|flows>
import { readFileSync, readdirSync, statSync } from 'node:fs';
const eng = process.argv[2] ?? 'firefox';
const what = process.argv[3] ?? 'timing';
const read = (f) => JSON.parse(readFileSync(new URL(`./out/${f}.json`, import.meta.url)));
const merged = {};
if (what === 'flows') {
    const d = read(`flows-${eng}`);
    for (const f of readdirSync(new URL('./out/', import.meta.url)).filter((x) => x.startsWith(`flows-${eng}-`)))
        Object.assign(d, JSON.parse(readFileSync(new URL(`./out/${f}`, import.meta.url))));
    const brief = (a) =>
        Object.entries(a)
            .filter(([k]) => !['pageErrors', 'ERROR', 'before', 'during', 'shift', 'toggleVisible', 'buttons'].includes(k))
            .map(([k, v]) => [k, v]);
    for (const [id, r] of Object.entries(d)) {
        console.log(
            `\n## ${id}${r.ERROR ? '  ERROR ' + r.ERROR : ''}${r.pageErrors?.length ? '  pageErrors ' + r.pageErrors.length : ''}${r.shift !== undefined ? '  targetShift=' + r.shift : ''}${r.toggleVisible !== undefined ? '  toggleVisible=' + r.toggleVisible : ''}`,
        );
        const walk = (name, st) => {
            if (!st || typeof st !== 'object') return;
            for (const [sel, v] of Object.entries(st)) {
                if (!v || typeof v !== 'object' || !('movesMs' in v)) continue;
                if (!v.present) {
                    console.log(`  ${name} ${sel}: absent`);
                    continue;
                }
                console.log(
                    `  ${name} ${sel.slice(0, 48)}: moves ${v.movesMs} ms (start ${v.startMs}), poses ${v.poses}, w ${v.w.join('..')}, h ${v.h.join('..')}, op ${v.op.join('..')}, maxJump ${v.maxJump}, gaps ${v.gapsMs.slice(0, 8).join(',')}, anims ${v.anims.join(' ; ') || '-'}`,
                );
            }
        };
        for (const [k, v] of Object.entries(r)) {
            if (k === 'mirror' || k.startsWith('mirror') || k.endsWith('Mirror')) {
                for (const [sel, m] of Object.entries(v))
                    console.log(
                        `  ${k} ${sel.slice(0, 40)}: open ${m.openPoses} poses ${m.openMs} ms, close ${m.closePoses} poses ${m.closeMs} ms, same ${m.samePoses}/${Math.max(m.openPoses, m.closePoses)}`,
                    );
            } else if (k === 'react') {
                for (const [kk, vv] of Object.entries(v))
                    kk === 'mirror'
                        ? Object.entries(vv).forEach(([s, m]) =>
                              console.log(
                                  `  react.mirror ${s.slice(0, 40)}: open ${m.openPoses}/${m.openMs} ms close ${m.closePoses}/${m.closeMs} ms same ${m.samePoses}`,
                              ),
                          )
                        : walk('react.' + kk, vv);
            } else walk(k, v);
        }
    }
} else if (what === 'pointing') {
    const newer = (a, b) =>
        statSync(new URL(`./out/${a}.json`, import.meta.url)).mtimeMs >= statSync(new URL(`./out/${b}.json`, import.meta.url)).mtimeMs;
    const d = read(
        readdirSync(new URL('./out/', import.meta.url)).includes(`pointing-${eng}.json`) && newer(`pointing-${eng}`, eng) ? `pointing-${eng}` : eng,
    );
    const rows = [];
    for (const [sig, r] of Object.entries(d.pointing)) {
        const s = sig.split('|');
        const name = `${s[0]}${s[1] ? '.' + s[1].replace(/kp-/g, '') : ''}${s[2] ? '[' + s[2] + ']' : ''}${s[3] ? '(' + s[3] + ')' : ''}${s[4] ? ' in ' + s[4].replace('kp-', '') : ''}`;
        if (r.error) {
            rows.push(`ERR ${name} ${r.error.slice(0, 60)}`);
            continue;
        }
        const h = r.covered ? 'COVERED' : r.hoverSplit ? 'SPLIT' : r.hoverDiff.length ? 'other(' + r.hoverDiff.slice(0, 3).join(',') + ')' : 'NONE';
        const a = r.covered
            ? '-'
            : (r.activeGrid?.length
                  ? 'circuit(' + r.activeGrid.slice(0, 2).join(',') + ')'
                  : r.activeDiff.length
                    ? 'chg(' + r.activeDiff.slice(0, 2).join(',') + ')'
                    : 'same') +
              (r.activeLift?.length ? ' LIFT' : '') +
              (r.activeContrast && r.activeContrast < 4.5 ? ' C' + r.activeContrast : '');
        const f =
            (r.focusBrackets ? 'BRACKETS' : r.focusVisible ? 'ring(' + r.focusOutline + ',' + r.focusChannels + 'ch)' : 'NOFV') +
            (r.focusDiff.length ? '' : ' nodiff');
        rows.push(`${name} | ${r.page} | hover ${h}${r.hoverMove?.length ? ' MOVES' : ''} | press ${a} | focus ${f}`);
    }
    console.log(rows.sort().join('\n'));
    const cnt = (re) => rows.filter((x) => re.test(x)).length;
    console.log(
        `\n${rows.length} parts; hover SPLIT ${cnt(/hover SPLIT/)}, NONE ${cnt(/hover NONE/)}, other ${cnt(/hover other/)}, COVERED ${cnt(/COVERED/)}; press circuit ${cnt(/press circuit/)}, same ${cnt(/press same/)}, LIFT ${cnt(/LIFT/)}; focus BRACKETS ${cnt(/focus BRACKETS/)}, ring ${cnt(/focus ring/)}, NOFV ${cnt(/NOFV/)}`,
    );
} else {
    const d = read(eng);
    if (what === 'timing') {
        for (const [pg, p] of Object.entries(d.pages))
            for (const t of p.timing) {
                const loop = t.iter === 'infinite';
                const bad = !t.onGrid || (t.curve !== 'steps' && !(loop && t.curve === 'linear'));
                if (!bad) continue;
                const k = `${t.part}|${t.kind}|${t.prop}|${t.ms}|${t.curve.slice(0, 30)}${loop ? '|loop' : ''}`;
                (merged[k] ??= { pages: new Set(), n: 0 }).pages.add(pg);
                merged[k].n += t.n;
            }
        for (const [k, v] of Object.entries(merged).sort()) console.log(k, [...v.pages].slice(0, 4).join(','), v.n);
    } else if (what === 'running') {
        const m = {};
        for (const [pg, r] of Object.entries(d.running)) for (const x of r) (m[x.k] ??= new Set()).add(pg);
        for (const [k, v] of Object.entries(m).sort()) console.log(k, [...v].slice(0, 4).join(','));
    } else if (what === 'corners') {
        for (const [pg, p] of Object.entries(d.pages))
            for (const c of p.corners) {
                const k = `${c.part}|${c.kind}|r${c.radii.join('/')}|clip:${c.clip}|notch:${c.notches.join('/') || '-'}${c.ancestorCut ? '|ancestorCut' : ''}`;
                (merged[k] ??= { pages: new Set(), size: c.size, n: 0 }).pages.add(pg);
                merged[k].n += c.n;
            }
        for (const [k, v] of Object.entries(merged).sort()) console.log(k, v.size, v.n, [...v.pages].slice(0, 3).join(','));
    } else if (what === 'fonts') {
        console.log(JSON.stringify(Object.values(d.pages)[0].tokens));
        for (const [pg, p] of Object.entries(d.pages))
            for (const f of p.fonts) {
                const tag =
                    f.mono && f.prose
                        ? 'PROSE-IN-MONO'
                        : !f.mono && /label|badge|tag|tooltip|timestamp|th$|microlabel|mono|id$|kbd|code/.test(f.part + f.tag)
                          ? 'LABEL-NOT-MONO'
                          : null;
                if (!tag) continue;
                const k = `${tag}|${f.family}|${f.part}|${f.tag}|${f.caps}`;
                (merged[k] ??= { pages: new Set(), s: f.sample, n: 0 }).pages.add(pg);
                merged[k].n += f.n;
            }
        for (const [k, v] of Object.entries(merged).sort()) console.log(k, JSON.stringify(v.s), v.n, [...v.pages].slice(0, 3).join(','));
        const fams = new Set();
        for (const p of Object.values(d.pages)) p.fams.forEach((f) => fams.add(f));
        console.log([...fams]);
    } else if (what === 'prefix') {
        const seen = {};
        for (const [pg, p] of Object.entries(d.pages)) for (const [sel, v] of Object.entries(p.prefix ?? {})) seen[sel] ??= { ...v, pg };
        for (const [sel, v] of Object.entries(seen)) console.log(sel, JSON.stringify(v));
    }
}
