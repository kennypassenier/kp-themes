// Strategy (b): shared stylesheets linked, the active register fetched at runtime.
//
// Nothing is generated per theme here — the files a page fetches are the
// ones the package already ships. This script measures what one page
// fetches on first paint and after one switch, and writes a sample page
// (examples/login.html with the twenty-two register links replaced by
// the snippet and the runtime module).
//
// Usage: node research/loading/build-b.mjs

import { fileURLToPath } from 'node:url';
import { bytes, gz, OUT, read, sizes, sum, write } from './measure.mjs';
import { noFlashLazySnippet } from './src/no-flash-lazy.js';

const ORDER = /** @type {string[]} */ (JSON.parse(read('themes/order.json')));
/** The stylesheets every page links whatever the theme, in load order. */
export const SHARED = ['css/fonts.css', 'css/themes.css', 'css/components.css', 'css/layout.css', 'css/utilities.css'];
/** out/b/ sits four directories under the repository root. */
const UP = '../../../../';

export default async function buildB() {
    /** @type {Record<string, import('./measure.mjs').Sizes>} */
    const shared = {};
    for (const file of SHARED) shared[file] = await sizes(read(file), 'css');
    /** @type {Record<string, import('./measure.mjs').Sizes>} */
    const registers = {};
    for (const theme of ORDER) registers[theme] = await sizes(read(`css/${theme}-register.css`), 'css');

    const runtime = await sizes(read('research/loading/src/lazy-register.js'), 'js');
    const snippet = noFlashLazySnippet({ effects: true });
    const sharedTotal = sum(Object.values(shared));

    // The snippet moves BELOW the shared links. The layer order is fixed
    // by whichever stylesheet declares the layers first, and a register
    // written above css/themes.css would declare kp.register before
    // kp.base and kp.components exist — the components would then beat
    // the register. The theme attribute still lands before first paint:
    // nothing paints while the head is being parsed.
    const login = read('examples/login.html')
        .replace(/        <script>\n[\s\S]*?<\/script>\n/, '')
        .replace(
            /(        <link rel="stylesheet" href="\.\.\/css\/[^"]+" \/>\n)+/,
            SHARED.map((f) => `        <link rel="stylesheet" href="${UP}${f}" />`).join('\n') +
                `\n        <script>\n            ${noFlashLazySnippet({ effects: true, base: `${UP}css/` }).replace(/\n/g, '\n            ')}\n        </script>\n`,
        )
        .replace(
            '<script type="module" src="../js/auto.js"></script>',
            `<script type="module">\n            import { attachLazyRegisters } from '../../src/lazy-register.js';\n            attachLazyRegisters({ base: '${UP}css/' });\n        </script>\n        <script type="module" src="${UP}js/auto.js"></script>`,
        );
    if (!login.includes('data-kp-register') || !login.includes('attachLazyRegisters'))
        throw new Error('the sample page did not take the replacements');
    write(new URL('b/login-lazy.html', OUT), login);

    const result = {
        strategy: 'b',
        shared,
        sharedTotal,
        registers,
        runtime,
        snippetBytes: bytes(snippet),
        snippetGz: gz(snippet),
        /** First paint under formal (the default) and under cyberpunk (the heaviest tokens); a register is the only per-theme part. */
        firstPaint: {
            formal: sum([sharedTotal, registers.formal]),
            cyberpunk: sum([sharedTotal, registers.cyberpunk]),
        },
        /** After one switch: exactly one more register. */
        afterSwitch: {
            'formal → cyberpunk': registers.cyberpunk,
            'cyberpunk → formal': registers.formal,
            heaviest: ORDER.reduce((a, b) => (registers[a].min >= registers[b].min ? a : b)),
            lightest: ORDER.reduce((a, b) => (registers[a].min <= registers[b].min ? a : b)),
        },
    };
    write(new URL('b/sizes.json', OUT), JSON.stringify(result, null, 4) + '\n');
    write(new URL('b/no-flash-lazy.snippet.js', OUT), snippet + '\n');
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const r = await buildB();
    console.log(`(b) sample page written to ${fileURLToPath(new URL('b/login-lazy.html', OUT))}`);
    console.log(`  shared ${r.sharedTotal.raw} raw ${r.sharedTotal.rawGz} gz | min ${r.sharedTotal.min} ${r.sharedTotal.minGz} gz`);
    console.log(
        `  first paint (formal) ${r.firstPaint.formal.raw} raw ${r.firstPaint.formal.rawGz} gz | min ${r.firstPaint.formal.min} ${r.firstPaint.formal.minGz} gz`,
    );
    console.log(`  runtime ${r.runtime.raw} raw ${r.runtime.rawGz} gz; snippet ${r.snippetBytes} raw ${r.snippetGz} gz`);
}
