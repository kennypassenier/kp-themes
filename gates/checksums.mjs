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
    'css/woodblock-register.css',
    'css/pastel-register.css',
    'css/shade-light-register.css',
    'css/ticker-register.css',
    'css/forest-register.css',
    'css/deco-register.css',
    'css/light-register.css',
    'css/grotesk-register.css',
    'css/blueprint-register.css',
    'css/nostromo-register.css',
    'css/dark-register.css',
    'css/academia-register.css',
    'css/formal-register.css',
    'css/sepia-register.css',
    'css/solstice-register.css',
    'css/mono-register.css',
    'css/high-contrast-register.css',
    'css/lapis-register.css',
    'css/shade-dark-register.css',
    'css/tailwind-bridge.css',
    'css/fonts.css',
    'css/themes.css',
    'css/utilities.css',
    'dist/kp-themes.css',
    'dist/kp-themes.js',
    // The minified build, one twin and one source map per shipped
    // stylesheet plus the bundle's two halves [2026-09-08].
    'dist/css/_rules.min.css',
    'dist/css/_rules.min.css.map',
    'dist/css/academia-register.min.css',
    'dist/css/academia-register.min.css.map',
    'dist/css/blueprint-register.min.css',
    'dist/css/blueprint-register.min.css.map',
    'dist/css/brutalism-register.min.css',
    'dist/css/brutalism-register.min.css.map',
    'dist/css/components.min.css',
    'dist/css/components.min.css.map',
    'dist/css/cyberpunk-register.min.css',
    'dist/css/cyberpunk-register.min.css.map',
    'dist/css/dark-register.min.css',
    'dist/css/dark-register.min.css.map',
    'dist/css/deco-register.min.css',
    'dist/css/deco-register.min.css.map',
    'dist/css/fonts.min.css',
    'dist/css/fonts.min.css.map',
    'dist/css/forest-register.min.css',
    'dist/css/forest-register.min.css.map',
    'dist/css/formal-register.min.css',
    'dist/css/formal-register.min.css.map',
    'dist/css/grotesk-register.min.css',
    'dist/css/grotesk-register.min.css.map',
    'dist/css/high-contrast-register.min.css',
    'dist/css/high-contrast-register.min.css.map',
    'dist/css/lapis-register.min.css',
    'dist/css/lapis-register.min.css.map',
    'dist/css/layout.min.css',
    'dist/css/layout.min.css.map',
    'dist/css/light-register.min.css',
    'dist/css/light-register.min.css.map',
    'dist/css/mono-register.min.css',
    'dist/css/mono-register.min.css.map',
    'dist/css/nostromo-register.min.css',
    'dist/css/nostromo-register.min.css.map',
    'dist/css/pastel-register.min.css',
    'dist/css/pastel-register.min.css.map',
    'dist/css/phantom-register.min.css',
    'dist/css/phantom-register.min.css.map',
    'dist/css/retro-register.min.css',
    'dist/css/retro-register.min.css.map',
    'dist/css/sepia-register.min.css',
    'dist/css/sepia-register.min.css.map',
    'dist/css/shade-dark-register.min.css',
    'dist/css/shade-dark-register.min.css.map',
    'dist/css/shade-light-register.min.css',
    'dist/css/shade-light-register.min.css.map',
    'dist/css/solstice-register.min.css',
    'dist/css/solstice-register.min.css.map',
    'dist/css/synthwave-register.min.css',
    'dist/css/synthwave-register.min.css.map',
    'dist/css/terminal-register.min.css',
    'dist/css/terminal-register.min.css.map',
    'dist/css/themes.min.css',
    'dist/css/themes.min.css.map',
    'dist/css/ticker-register.min.css',
    'dist/css/ticker-register.min.css.map',
    'dist/css/utilities.min.css',
    'dist/css/utilities.min.css.map',
    'dist/css/woodblock-register.min.css',
    'dist/css/woodblock-register.min.css.map',
    'dist/kp-themes.min.css',
    'dist/kp-themes.min.css.map',
    'dist/kp-themes.min.js',
    'dist/kp-themes.min.js.map',
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
    'js/sidenav.js',
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
