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
    'css/layout.css',
    'css/retro-register.css',
    'css/synthwave-register.css',
    'css/phantom-register.css',
    'css/terminal-register.css',
    'css/brutalism-register.css',
    'css/sepia-register.css',
    'css/solstice-register.css',
    'css/mono-register.css',
    'css/high-contrast-register.css',
    'css/tazhib-register.css',
    'css/shade-dark-register.css',
    'css/tailwind-bridge.css',
    'css/fonts.css',
    'css/themes.css',
    'css/utilities.css',
    'dist/kp-themes.css',
    'dist/kp-themes.js',
    'js/auto.js',
    'js/colorpicker.js',
    'js/combobox.js',
    'js/components.js',
    'js/contrast.js',
    'js/datatable.js',
    'js/datepicker.js',
    'js/diagnostics.js',
    'js/effects.js',
    'js/forms.js',
    'js/gridlayout.js',
    'js/listbox.js',
    'js/locale.js',
    'js/no-flash.js',
    'js/overlays.js',
    'js/palette.js',
    'js/patterns.js',
    'js/strings.js',
    'js/structure.js',
    'js/tables.js',
    'js/theme-core.js',
    'js/theme-picker.js',
    'js/theme-registry.js',
    'js/upload.js',
    'js/wizard.js',
    // The shipped fonts [T19, AR39]: every file under fonts/ that
    // fonts/families.json names — the faces, each family's LICENSE, the
    // plan itself and the kanji list — derived rather than typed, because
    // fifty-five hand-kept paths would be the 3.1.1 fault at scale.
    ...fontFiles(),
];

/**
 * @returns {string[]} the paths under fonts/ a consumer copies, in a stable order
 */
export function fontFiles() {
    /** @type {Record<string, any>} */
    const families = JSON.parse(readFileSync(new URL('../fonts/families.json', import.meta.url), 'utf8'));
    delete families['//'];
    const out = ['fonts/families.json', 'fonts/jis-level-1.txt'];
    for (const [slug, family] of Object.entries(families)) {
        if (family.reservedFontName && !family.subset) continue;
        out.push(`fonts/${slug}/LICENSE`);
        for (const face of family.faces) {
            for (const script of face.scripts) out.push(`fonts/${slug}/${face.file}${face.scripts.length > 1 ? `-${script}` : ''}.woff2`);
        }
    }
    return out;
}

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
