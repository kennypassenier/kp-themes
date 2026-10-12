// @ts-nocheck
import { readFileSync } from 'node:fs';
const eng = process.argv[2];
const d = JSON.parse(readFileSync(new URL(`./out/pointing-${eng}.json`, import.meta.url)));
for (const [sig, r] of Object.entries(d.pointing)) {
  const s = sig.split('|'); const name = `${s[0]}${s[1] ? '.' + s[1].replace(/kp-/g, '') : ''}${s[2] ? '[' + s[2] + ']' : ''}${s[3] ? '(' + s[3] + ')' : ''}${s[4] ? ' in ' + s[4].replace('kp-', '') : ''}`;
  if (r.error) { console.log('ERR', name, r.error.slice(0, 60)); continue; }
  const h = r.covered ? 'COVERED' : r.hoverBlaze ? 'blaze' : r.hoverDiff.length ? 'other:' + r.hoverDiff.slice(0, 3).join(',') : 'NONE';
  const a = r.covered ? '-' : (r.activeSolid ? 'solid' : r.activeDiff.length ? 'chg:' + r.activeDiff.slice(0, 3).join(',') : 'same') + (r.activeBgChanged ? ' bg:' + r.rest + '>' + r.activeBg : '') + (r.activeContrast && r.activeContrast < 4.5 ? ' C' + r.activeContrast : '');
  console.log(`${name} | ${r.page} | hover ${h} | press ${a} | focus ${r.focusVisible ? '' : 'NOFV '}${r.focusChannels}ch ${r.focusDiff.length ? '' : 'nodiff'}`);
}
