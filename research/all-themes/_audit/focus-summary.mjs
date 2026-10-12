// @ts-nocheck: scratch audit tooling, not shipped
// Reads out/<theme>/pointing-firefox.json (audit.mjs --pointing-only) and lists, per theme,
// the pointable signatures whose keyboard focus changes nothing visible (NOMARK), and the
// ones that move on hover or press (LIFT).
//   node research/all-themes/_audit/focus-summary.mjs [theme,theme]
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const dir = new URL('./out/', import.meta.url);
const want = (process.argv[2] ?? '').split(',').filter(Boolean);
const themes = readdirSync(dir).filter((t) => (want.length ? want.includes(t) : true));
// properties whose change a person does not see as a focus mark
const SILENT = /^(::before\.|::after\.|next\.)?(cursor|transform|translate|scale|opacity)$/;
for (const t of themes) {
    const f = new URL(`./${t}/pointing-firefox.json`, dir);
    if (!existsSync(f)) continue;
    const d = JSON.parse(readFileSync(f));
    const rows = Object.values(d.pointing);
    const nomark = [];
    const lift = [];
    const errors = [];
    for (const r of rows) {
        if (r.error) {
            errors.push(r.sig);
            continue;
        }
        const seen = (r.focusDiff ?? []).filter((p) => !SILENT.test(p));
        // an outline that turns on in a transparent colour paints nothing: the audit's channel count knows
        const onlyOutline = seen.length > 0 && seen.every((p) => /outline/.test(p)) && r.focusChannels === 0;
        if (r.focusVisible && (seen.length === 0 || onlyOutline)) nomark.push(`${r.sig} (${r.page})`);
        if (!r.focusVisible) nomark.push(`${r.sig} (${r.page}) [not :focus-visible]`);
        if ((r.hoverMove ?? []).length || (r.activeLift ?? []).length) lift.push(`${r.sig} (${r.page}) hover ${r.hoverMove?.join(',') || '-'} press ${r.activeLift?.join(',') || '-'}`);
    }
    console.log(`\n## ${t}: ${rows.length} signatures, focus without a mark ${nomark.length}, moves on hover/press ${lift.length}, unreachable ${errors.length}`);
    for (const n of nomark) console.log(`  NOMARK ${n}`);
    for (const n of lift) console.log(`  LIFT   ${n}`);
}
