// Page descriptor for the "qr" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const qrDescriptor = {
        id: 'qr',
        title: 'QR code',
        group: 'Content',
        classes: ['kp-qr'],
        exports: [],
        intro: 'A link shown as a QR code a phone can scan, with the link as text under it and a Copy button. The code is drawn on the page; the link never goes to a service. The plate stays light in every theme, because dark modules on a light ground are read by every camera.',
        whenToUse: 'An invitation, a pairing link or a Wi-Fi string handed from one screen to another. For a link that only needs copying use the copyable value.',
        examples: [
            {
                title: 'An invitation link',
                why: 'The value is the text to encode; the module draws the code, the caption and Copy.',
                markup: `
<div class="kp-qr" data-kp-qr data-kp-qr-value="https://example.com/invite/7Hq2-nT9a"></div>
`,
            },
            {
                title: 'Size, strength, look and what sits under the code',
                why: '`data-kp-qr-ecc` is the error correction (`H` survives a logo or a scratch, at the cost of a denser code), `data-kp-qr-size` the width (`lg` is 16rem), `data-kp-qr-modules="round"` rounds the modules while the three corner marks stay square so it still scans, `data-kp-qr-look="theme"` uses the theme’s ink on its surface only where the contrast is 7 to 1 or better, `data-kp-qr-caption` replaces the link by words (or `none`) and `data-kp-qr-download` adds a Download of `png` or `svg`.',
                markup: `
<div class="kp-stack">
<div class="kp-qr" data-kp-qr data-kp-qr-value="https://example.com/invite/7Hq2-nT9a" data-kp-qr-ecc="H" data-kp-qr-size="lg" data-kp-qr-download="png" data-kp-qr-label="Invitation to the Rome trip"></div>
<div class="kp-qr" data-kp-qr data-kp-qr-value="WIFI:T:WPA;S:Guests;P:correct-horse-battery;;" data-kp-qr-modules="round" data-kp-qr-look="theme" data-kp-qr-caption="Join the guest network" data-kp-qr-copy="false" data-kp-qr-label="Guest Wi-Fi"></div>
<div class="kp-qr" data-kp-qr data-kp-qr-value="https://example.com/pair/48213" data-kp-qr-size="8rem" data-kp-qr-quiet="2" data-kp-qr-caption="none" data-kp-qr-render="canvas" data-kp-qr-narrow="link" data-kp-qr-label="Pairing code"></div>
</div>
`,
            },
            {
                title: 'Hidden until asked, withdrawn when it runs out',
                why: '`data-kp-qr-reveal="click"` keeps the code behind Show QR code (and Hide again) and fires `kp-qr-reveal` with `{ shown }`. `data-kp-qr-expires` is an ISO moment: after it the code is withdrawn, not covered, and `kp-qr-expired` fires once. `data-kp-qr-max` is the size in bytes above which a warning says the code will be hard to scan. `kp-qr-copy` carries `{ value }` when the link was copied.',
                markup: `
<div class="kp-stack">
<div class="kp-qr" id="doc-qr-secret" data-kp-qr data-kp-qr-value="https://example.com/join/9fK2-xx81" data-kp-qr-reveal="click" data-kp-qr-label="Join link"></div>
<div class="kp-qr" id="doc-qr-expiring" data-kp-qr data-kp-qr-value="https://example.com/one-time/5521" data-kp-qr-label="One-time link"></div>
<div class="kp-qr" data-kp-qr data-kp-qr-value="https://example.com/a-very-long-address/with/many/segments/and?query=values&and=more&and=still-more&token=0123456789abcdef0123456789abcdef" data-kp-qr-max="64" data-kp-qr-label="A long link"></div>
<p class="kp-text-muted" id="doc-qr-log" aria-live="polite">Show the code, copy a link, or wait for the one-time link to run out.</p>
</div>
`,
                script: `
import { setQr } from '@kp-soft/themes/js/qr';

const log = document.getElementById('doc-qr-log');
const soon = document.getElementById('doc-qr-expiring');
soon.setAttribute('data-kp-qr-expires', new Date(Date.now() + 8000).toISOString());
setQr(soon, {});
soon.addEventListener('kp-qr-expired', () => { log.textContent = 'The one-time link ran out and the code was withdrawn.'; });
document.getElementById('doc-qr-secret').addEventListener('kp-qr-reveal', (event) => {
    log.textContent = event.detail.shown ? 'The code is showing.' : 'The code is hidden again.';
});
document.addEventListener('kp-qr-copy', (event) => { log.textContent = 'Copied ' + event.detail.value; });
`,
            },
            {
                title: 'Making the link, and a link that could not be made',
                why: '`setQr(el, { state })` is `loading` (the busy card at the final size of the code, while the page asks for a link), `empty`, `error` (a plate with `message`) or `ready`; a call with a `value` after it draws the code. With `data-kp-qr-retry` the error plate offers Retry and fires `kp-qr-retry`, so the page can ask for another link.',
                markup: `
<div class="kp-stack">
<div class="kp-qr" id="doc-qr-making" data-kp-qr data-kp-qr-label="Invitation being made"></div>
<div class="kp-qr" id="doc-qr-failed" data-kp-qr data-kp-qr-retry data-kp-qr-label="Invitation that failed"></div>
</div>
`,
                script: `
import { setQr } from '@kp-soft/themes/js/qr';

const making = document.getElementById('doc-qr-making');
const failed = document.getElementById('doc-qr-failed');
setQr(making, { state: 'loading' });
setTimeout(() => setQr(making, { value: 'https://example.com/invite/new-3J8d' }), 2500);
setQr(failed, { state: 'error', message: 'No invitation link could be made.' });
failed.addEventListener('kp-qr-retry', () => {
    setQr(failed, { state: 'loading' });
    setTimeout(() => setQr(failed, { value: 'https://example.com/invite/second-try' }), 1200);
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-qr-ecc', what: 'Error correction `L`, `M` (default), `Q` or `H`.' },
            { name: 'data-kp-qr-size', what: 'A CSS length (12rem); `lg` is 16rem.' },
            { name: 'data-kp-qr-quiet', what: 'The quiet zone in modules (4).' },
            { name: 'data-kp-qr-look', what: '`plate` (default) or `theme`, which falls back to the plate below a 7 to 1 contrast.' },
            { name: 'data-kp-qr-modules', what: '`square` (default) or `round`; the corner marks stay square.' },
            { name: 'data-kp-qr-render', what: '`svg` (default) or `canvas`.' },
            { name: 'data-kp-qr-caption', what: '`link` (default), `none`, or words to show instead.' },
            { name: 'data-kp-qr-copy', what: '`false` hides Copy.' },
            { name: 'data-kp-qr-download', what: '`false` (default), `png` or `svg`.' },
            { name: 'data-kp-qr-reveal', what: '`shown` (default) or `click`, hidden behind Show QR code.' },
            { name: 'data-kp-qr-expires', what: 'An ISO moment after which the code is withdrawn.' },
            { name: 'data-kp-qr-max', what: 'Bytes above which a warning shows (512).' },
            { name: 'data-kp-qr-narrow', what: '`code` (default) or `link`: the link and Copy first on a narrow screen.' },
            { name: 'data-kp-qr-retry', what: 'A code that could not be made offers Retry.' },
            { name: 'switchable at runtime', what: 'Switchable at runtime: changing `data-kp-qr-retry` redraws the code.' },
        ],
        accessibility: [
            'Built in — the code is an image named by `data-kp-qr-label` and described by the link, focusable so a screen reader can read the link; Shift+C copies; the result of Copy is announced.',
            'Yours — a link is never the only way: the caption always shows it as text.',
        ],
    };
