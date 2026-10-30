// Page descriptor for the "gallery" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const galleryDescriptor = {
        id: 'gallery',
        title: 'Gallery',
        group: 'Content',
        classes: ['kp-gallery'],
        aliases: ['lightbox', 'caption', 'lazy', 'hash', 'chrome', 'zoom'],
        exports: [],
        intro: 'A grid of pictures that open large. The lightbox steps with the arrows and the keys, zooms to full size, plays a clip, and stops at the last picture (looping is an option). A picture that fails to load becomes a state tile with Retry, never a broken icon.',
        whenToUse: 'Photos of a trip, a product, a recipe. For two versions of one picture, the compare slider.',
        examples: [
            {
                title: 'A gallery',
                why: 'The markup is the empty box; `setGallery(el, { items })` gives it its pictures: `{ id, src, thumb, width, height, alt, caption, kind, poster, uploader, at, bytes }`. A press opens the picture large in the viewer with previous and next; the arrows stop at the last picture (looping is `data-kp-lightbox-loop="on"`); the position is an exact count (“4 of 9”), the keys are listed in the shortcut sheet, and the address carries the open picture (`#photo-3`), so the back button closes it first. `galleryItems(el)` and `galleryLast(el)` read what is there and the last opened picture. The pictures here are drawn by the script, so nothing is fetched.',
                markup: `
<div class="kp-gallery" id="doc-gallery" data-kp-gallery data-kp-lightbox-actions="download copy-link" aria-label="Photos of the trip"></div>
<p class="kp-text-muted" id="doc-gallery-said" role="status">No picture opened.</p>
`,
                script: `
import { attachGalleries, setGallery } from '@kp-soft/themes/js/gallery';

const gallery = document.getElementById('doc-gallery');
attachGalleries(gallery.parentElement);
const hues = [12, 48, 96, 150, 200, 250, 290, 330, 24];
const picture = (hue, wide) => {
    const w = wide ? 1200 : 900;
    const h = wide ? 800 : 1200;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
        '<rect width="100%" height="100%" fill="hsl(' + hue + ' 55% 62%)"/><circle cx="' + w * 0.7 + '" cy="' + h * 0.3 + '" r="' + h * 0.12 + '" fill="hsl(' + hue + ' 80% 88%)"/>' +
        '<path d="M0 ' + h + 'L' + w * 0.35 + ' ' + h * 0.55 + 'L' + w * 0.6 + ' ' + h * 0.8 + 'L' + w * 0.8 + ' ' + h * 0.6 + 'L' + w + ' ' + h + 'Z" fill="hsl(' + hue + ' 45% 32%)"/></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
const captions = ['Arrival', 'The tent', 'Breakfast', 'The ridge', 'Campfire', 'Lake at dusk', 'Map reading', 'The way back', 'Last evening'];
setGallery(gallery, {
    label: 'Photos of the trip',
    items: hues.map((hue, index) => ({
        id: String(index + 1),
        src: picture(hue, index % 3 !== 1),
        thumb: picture(hue, index % 3 !== 1),
        width: index % 3 !== 1 ? 1200 : 900,
        height: index % 3 !== 1 ? 800 : 1200,
        alt: captions[index] + ', drawn',
        caption: captions[index],
        uploader: index % 2 ? 'Anna' : 'Tom',
        at: Date.UTC(2026, 9, 10 + (index % 3), 12),
        bytes: 2400000 + index * 130000,
    })),
});
gallery.addEventListener('kp-gallery-open', (event) => {
    document.getElementById('doc-gallery-said').textContent = 'Opened ' + event.detail.item.caption + '.';
});
`,
            },
            {
                title: 'Rows that keep their shape, fixed columns, and the states',
                why: '`data-kp-tile-shape="ratio"` lets each picture keep its own shape in rows, `data-kp-grid-columns` fixes 2 to 8 columns (`auto` makes tiles of at least 9rem, two columns on a phone), `data-kp-caption` is `hover`, `always` or `none`, and `data-kp-lightbox-info` is `caption`, `details` (adds the size) or `off`. `setGallery(el, { add: true })` shows an Add pictures tile, which fires `kp-gallery-add` with `{ files }`; `setGalleryUploading(el, reason)` turns it off while a file goes up. The other lightbox options are `-zoom`, `-chrome`, `-preload` and `-hash` (with `data-kp-hash-prefix`); `data-kp-lazy` and `data-kp-remember` (the last opened picture, with “Continue where you were”). A state is `loading` (the busy card over the whole gallery), `empty` or `error` (plates over the whole footprint); a picture that fails to load becomes a tile and a stage with Retry.',
                markup: `
<div class="kp-gallery" id="doc-gallery-ratio" data-kp-gallery data-kp-tile-shape="ratio" data-kp-grid-columns="3" data-kp-caption="always" data-kp-lightbox-info="details" data-kp-lightbox-loop="on" aria-label="Rows that keep their shape"></div>
<div class="kp-gallery" id="doc-gallery-ratio-loading" data-kp-gallery aria-label="Loading"></div>
<div class="kp-gallery" id="doc-gallery-ratio-empty" data-kp-gallery aria-label="Empty"></div>
<div class="kp-gallery" id="doc-gallery-ratio-failed" data-kp-gallery aria-label="Failed"></div>
`,
                script: `
import { attachGalleries, setGallery } from '@kp-soft/themes/js/gallery';

const ratio = document.getElementById('doc-gallery-ratio');
attachGalleries(ratio.parentElement);
const picture = (hue, w, h) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><rect width="100%" height="100%" fill="hsl(' + hue + ' 55% 62%)"/></svg>',
);
const sizes = [[1200, 800], [900, 1200], [1200, 800], [1000, 1000], [900, 1200], [1200, 800]];
setGallery(ratio, {
    add: true,
    items: sizes.map(([w, h], index) => ({ id: 'r' + index, src: picture(index * 50, w, h), thumb: picture(index * 50, w, h), width: w, height: h, alt: 'Picture ' + (index + 1), caption: 'Picture ' + (index + 1), bytes: 1800000 })),
});
setGallery(document.getElementById('doc-gallery-ratio-loading'), { state: 'loading', skeleton: 4 });
setGallery(document.getElementById('doc-gallery-ratio-empty'), { state: 'empty', message: 'No pictures yet. Add the first one.' });
setGallery(document.getElementById('doc-gallery-ratio-failed'), { state: 'error', message: 'The pictures could not be read.' });
`,
            },
            {
                title: 'Photos in a grid, opened large',
                why: '`setGallery(el, { items })` draws the tiles from items `{ id, src, thumb, width, height, alt, caption, uploader, at, bytes }`; give width and height so each tile’s box is reserved before it loads (`data-kp-lazy`). `data-kp-grid-columns="4"` fixes the columns, `data-kp-tile-shape="ratio"` lets each picture keep its own shape, `data-kp-caption="always"` writes the captions on the tiles, and `data-kp-lightbox-info="details"` adds the size in the lightbox. The lightbox steps with the arrows, Home and End, zooms with `z` and stops at the last picture (`data-kp-lightbox-loop="on"` wraps round). `actions` gives each picture its foot buttons and `add` shows an Add pictures tile that fires `kp-gallery-add` with `{ files }`. `kp-gallery-open` and `kp-gallery-close` say what was looked at.',
                markup: `
<div class="kp-stack">
<div class="kp-gallery" id="doc-gallery-photos" data-kp-gallery data-kp-grid-columns="4" data-kp-tile-shape="ratio" data-kp-caption="always" data-kp-lightbox-info="details" data-kp-lightbox-actions="open download copy-link" data-kp-lightbox-hash="off" aria-label="Trip photos"></div>
<p class="kp-text-muted" id="doc-gallery-log" aria-live="polite">Press a photo to open it.</p>
</div>
`,
                script: `
import { setGallery } from '@kp-soft/themes/js/gallery';

const picture = (hue, width, height) =>
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
            '<rect width="100%" height="100%" fill="hsl(' + hue + ' 45% 80%)"/>' +
            '<circle cx="' + width / 2 + '" cy="' + height / 2 + '" r="' + Math.min(width, height) * 0.22 + '" fill="hsl(' + hue + ' 55% 35%)"/></svg>',
    );
const shapes = [[1200, 800], [800, 1200], [1200, 800], [1200, 800], [800, 1200], [1200, 800], [1200, 800], [1200, 800], [800, 1200], [1200, 800], [1200, 800]];
const items = shapes.map(([width, height], i) => ({
    id: 'p' + (i + 1),
    src: picture(i * 40, width, height),
    width,
    height,
    alt: 'Photo ' + (i + 1) + ' of the trip',
    caption: ['Station', 'Harbour', 'Market', 'Roof terrace', 'Old bridge', 'Museum steps', 'Night walk', 'Breakfast', 'Stairs', 'Square', 'Departure'][i],
    uploader: ['Kenny', 'Lies', 'Tom'][i % 3],
    at: Date.UTC(2026, 5, 19 + i, 12, 0),
    bytes: 180000 + i * 41000,
}));
const box = document.getElementById('doc-gallery-photos');
const log = document.getElementById('doc-gallery-log');
setGallery(box, { items, add: true, actions: (item) => [{ label: 'Remove', tone: 'destructive', confirm: 'Remove ' + item.caption + '?', run: () => { log.textContent = 'Removed ' + item.id; } }] });
box.addEventListener('kp-gallery-open', (event) => { log.textContent = 'Opened ' + event.detail.item.caption + '.'; });
box.addEventListener('kp-gallery-close', () => { log.textContent = 'Closed the lightbox.'; });
box.addEventListener('kp-gallery-add', (event) => { log.textContent = event.detail.files.length + ' picture(s) chosen to add.'; });
`,
            },
            {
                title: 'Loading, empty, failed and a picture that does not load',
                why: 'The state of a gallery is `loading` (the busy card over the whole gallery, with `skeleton` waiting tiles that keep the loaded tiles’ square footprint in every theme), `empty` or `error` (the package’s plates over the whole footprint, `message` their words), or `ready`; a call with items after it is ready. A Retry on the failed plate fires `kp-gallery-retry`. A single picture that fails to load turns its tile, and the stage when opened, into a plate with Retry, and fires `kp-gallery-picture-failed` with `{ id }`.',
                markup: `
<div class="kp-stack">
<div class="kp-gallery" id="doc-gallery-loading" data-kp-gallery aria-label="Photos being fetched"></div>
<div class="kp-gallery" id="doc-gallery-empty" data-kp-gallery aria-label="No photos yet"></div>
<div class="kp-gallery" id="doc-gallery-failed" data-kp-gallery aria-label="Photos that could not be read"></div>
<div class="kp-gallery" id="doc-gallery-broken" data-kp-gallery data-kp-lightbox-hash="off" aria-label="Photos, one of them broken"></div>
</div>
`,
                script: `
import { setGallery } from '@kp-soft/themes/js/gallery';

setGallery(document.getElementById('doc-gallery-loading'), { state: 'loading', skeleton: 4 });
setGallery(document.getElementById('doc-gallery-empty'), { state: 'empty', message: 'No photos have been added yet.' });
const failed = document.getElementById('doc-gallery-failed');
setGallery(failed, { state: 'error', message: 'The photos could not be read.' });
failed.addEventListener('kp-gallery-retry', () => setGallery(failed, { state: 'loading', skeleton: 4 }));
setGallery(document.getElementById('doc-gallery-broken'), {
    items: [
        { id: 'ok', src: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27400%27%3E%3Crect width=%27400%27 height=%27400%27 fill=%27%23b9c8e6%27/%3E%3C/svg%3E', width: 400, height: 400, alt: 'A plain blue square', caption: 'Fine' },
        { id: 'gone', src: 'missing/gone.jpg', width: 400, height: 400, alt: 'A photo that is not there', caption: 'Gone' },
    ],
});
`,
            },
            {
                title: 'Holding its height in a state',
                why: 'Loaded, the component is as high as its rows. Loading, empty or failed it keeps that height as a minimum, so the page under it does not jump twice; the first load has nothing remembered and is left alone. A very tall list holds a screen, not its full length (the cap is set on the host or any ancestor; it is 12 rem here to show it). Press the states.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-fp-gallery">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
</div>
<div class="kp-gallery" data-kp-gallery id="doc-fp-gallery-host" aria-label="Photos" style="--kp-footprint-max: 14rem"></div>
</div>
`,
                script: `
import { attachGalleries, setGallery } from '@kp-soft/themes/js/gallery';
const root = document.getElementById('doc-fp-gallery');
const host = document.getElementById('doc-fp-gallery-host');
attachGalleries(root);
const picture = (hue) => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="hsl(' + hue + ' 40% 60%)"/></svg>');
const items = [20, 80, 140, 200, 260, 320].map((hue, i) => ({ id: 'p' + i, src: picture(hue), thumb: picture(hue), alt: 'Colour ' + (i + 1), caption: 'Colour ' + (i + 1) }));
const draw = (state) => setGallery(host, state === 'ready' ? { items, label: 'Photos' } : { items: [], state, message: state === 'empty' ? 'No pictures yet.' : 'The pictures could not be loaded.', label: 'Photos' });
for (const button of root.querySelectorAll('[data-doc-state]')) {
    button.addEventListener('click', () => draw(button.dataset.docState));
}
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'setGallery / openGalleryItem', what: '`setGallery(el, spec)` draws the grid (`items`, `state`, `message`, `label`, `actions`, `add`, `skeleton`); `openGalleryItem(el, id)` opens a picture from the page and `openGalleryFromHash(el)` the one the address names. `setGalleryUploading(el, reason)` turns the Add tile off, with the reason.' },
            { name: 'actions', what: '`setGallery(el, { actions: (item) => [{ label, tone, run, confirm }] })` adds buttons to a picture’s foot; a `confirm` question is asked first in the package’s confirmation dialog.' },
            { name: 'kp-gallery events', what: '`kp-gallery-open` `{ id, item }`, `kp-gallery-close`, `kp-gallery-retry` (the failed list), `kp-gallery-add` `{ files }` and `kp-gallery-picture-failed` `{ id }`.' },
            { name: 'data-kp-grid-columns', what: '`auto` (default: tiles of at least 9rem, two columns on a phone) or 2 to 8.' },
            { name: 'data-kp-tile-shape', what: '`square` (default) or `ratio`: each picture keeps its own shape.' },
            { name: 'data-kp-caption', what: '`hover` (default; always on touch), `always` or `none`.' },
            { name: 'data-kp-lightbox-loop', what: '`off` (default: the end is the end) or `on`.' },
            { name: 'data-kp-lightbox-preload', what: 'Originals fetched beside the open one: 0, 1 (default) or 2.' },
            { name: 'data-kp-lightbox-zoom', what: '`on` (default) or `off`.' },
            { name: 'data-kp-lightbox-chrome', what: '`fade` (default: after 3 s without movement, never when calm) or `always`.' },
            { name: 'data-kp-lightbox-info', what: '`caption` (default), `details` (adds size) or `off`.' },
            { name: 'data-kp-lightbox-actions', what: 'More foot buttons: `open`, `download`, `copy-link`.' },
            { name: 'data-kp-lightbox-hash', what: '`on` (default): the address carries the open picture and the back button closes it first; `off`.' },
            { name: 'data-kp-hash-prefix', what: 'The word before the id in the address (`photo`).' },
            { name: 'data-kp-lazy', what: '`on` (default) or `off`: lazy pictures with a box reserved from their size.' },
            { name: 'data-kp-state', what: '`loading` (busy card over the grid), `empty`, `error` or `ready`.' },
            { name: 'data-kp-remember', what: 'A name: the last opened picture is kept, with "Continue where you were".' },
        ],
        accessibility: [
            'Built in — every tile is a button named after its picture; the lightbox is a native modal dialog with an exact, announced position; keys are listed in the shortcut sheet and need no AltGr.',
            'Yours — give every picture an `alt` that says what is in it.',
        ],
    };
