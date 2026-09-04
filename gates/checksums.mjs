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

const FILES = [
    'css/themes.css',
    'css/components.css',
    'css/cyberpunk-register.css',
    'css/tailwind-bridge.css',
    'js/theme-core.js',
    'js/theme-registry.js',
    'js/theme-picker.js',
    'js/components.js',
    'js/overlays.js',
    'js/no-flash.js',
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
