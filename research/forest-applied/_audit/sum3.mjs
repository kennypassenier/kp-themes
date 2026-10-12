// @ts-nocheck
import { readFileSync } from 'node:fs';
const eng = process.argv[2];
const d = JSON.parse(readFileSync(new URL(`./out/focus-${eng}.json`, import.meta.url)));
for (const [sig, r] of Object.entries(d.pointing)) {
  const s = sig.split('|'); const name = `${s[0]}${s[1] ? '.' + s[1].replace(/kp-/g, '') : ''}${s[2] ? '[' + s[2] + ']' : ''}${s[3] ? '(' + s[3] + ')' : ''}${s[4] ? ' in ' + s[4].replace('kp-', '') : ''}`;
  if (r.error) { console.log('ERR', name, r.error.slice(0, 60)); continue; }
  console.log(`${name} | ${r.page} | focusVisible ${r.focusVisible} viaTab ${r.viaTab} ch ${r.focusChannels} diff ${r.focusDiff.slice(0, 4).join(',')}`);
}
