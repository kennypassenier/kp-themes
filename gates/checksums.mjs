// SHA256SUMS for the artefacts a consumer takes [L9, TH18].
//
// Ecosystem norm N2, applied to a CSS file: someone vendoring
// css/themes.css into a Rust binary's static directory has no npm to
// verify anything for them, so the tag carries checksums they can check
// by hand. kyu and almanac both vendor rather than install.
//
// The list is what a consumer actually copies, not everything in the
// repository — a checksum for a test fixture would be noise, and noise in
// a verification file is how verification stops happening.
//
// Usage:
//   node gates/checksums.mjs           print the file
//   node gates/checksums.mjs --write   write SHA256SUMS

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

/**
 * What a consumer copies [TH103].
 *
 * Hand-kept until 3.1.1 and therefore wrong: it had missed js/strings.js
 * (2.0.0) and css/retro-register.css (3.1.0), the two files a consumer
 * overriding the dictionary or loading the retro register would take. It
 * is still written out here rather than derived, because a checksum file
 * that computes its own contents verifies nothing — but
 * gates/check-manifest.mjs now lays this list beside `exports` in
 * package.json and goes red on any difference in either direction, so a
 * new file cannot fall outside it silently again.
 */
export const FILES = [
    'css/_rules.css',
    'css/components.css',
    'css/cyberpunk-register.css',
    'css/retro-register.css',
    'css/tailwind-bridge.css',
    'css/themes.css',
    'js/auto.js',
    'js/colorpicker.js',
    'js/combobox.js',
    'js/components.js',
    'js/contrast.js',
    'js/datatable.js',
    'js/datepicker.js',
    'js/diagnostics.js',
    'js/forms.js',
    'js/gridlayout.js',
    'js/listbox.js',
    'js/no-flash.js',
    'js/overlays.js',
    'js/palette.js',
    'js/patterns.js',
    'js/strings.js',
    'js/structure.js',
    'js/theme-core.js',
    'js/theme-picker.js',
    'js/theme-registry.js',
    'js/upload.js',
    'js/wizard.js',
];

export function checksums() {
    return (
        FILES.map((f) => {
            const bytes = readFileSync(new URL(`../${f}`, import.meta.url));
            return `${createHash('sha256').update(bytes).digest('hex')}  ${f}`;
        }).join('\n') + '\n'
    );
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const text = checksums();
    if (process.argv.includes('--write')) {
        writeFileSync(new URL('../SHA256SUMS', import.meta.url), text);
        console.log(`wrote SHA256SUMS for ${FILES.length} files.`);
    } else {
        process.stdout.write(text);
    }
}
