// research/kpadopt6-media: the page's own drivers. The components are the package's (js/auto.js attaches them); this file only
// gives them their sample data, writes each section's event readout and drives the states a section shows.

/**
 * Write the last event a component fired into the readout beside it.
 * @param {string} selector a component root
 * @param {string} type the event name
 * @param {string} log the readout's id
 * @param {(detail: any) => string} [say]
 */
export function readout(selector, type, log, say = (detail) => JSON.stringify(detail)) {
    const out = document.getElementById(log);
    if (!out) return;
    for (const el of document.querySelectorAll(selector)) {
        el.addEventListener(type, (event) => {
            out.textContent = `${type}\n${say(/** @type {CustomEvent} */ (event).detail)}`;
        });
    }
}

/** Resolves once js/auto.js has attached everything the page carries. */
export const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/** Press a state button: exactly one of the group is pressed. @param {string} attribute the data attribute on the buttons @param {(value: string) => void} apply */
export function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}

/** Press the button of a group without a click (a state the page sets itself). @param {string} attribute @param {string} value */
function pressed(attribute, value) {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}

/** The picks Kenny ticks in the review dialog arrive on the section. @param {string} id the section @param {(choice: string, value: string) => void} apply */
function onChoice(id, apply) {
    const section = document.getElementById(id);
    section?.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
        if (detail) apply(detail.id, detail.value);
    });
}

await ready;

// ── what uses what ──────────────────────────────────────────────────────────────────────────────────────────────
{
    const { setMatrix } = await import('../../../../js/heat.js');
    const { rememberedView } = await import('../../../../js/uses-map.js');
    /** @type {import('../../../../js/uses-map.js').UsesNode[]} */
    const cvs = [
        { key: 'cv-nl', label: 'CV Developer NL', sub: 'generic master, made 06/2026', glyph: 'pdf', href: '#cv-nl' },
        { key: 'cv-en', label: 'CV Developer EN', sub: 'generic master, made 06/2026', glyph: 'pdf', href: '#cv-en' },
        { key: 'bespoke', label: 'Bespoke CV', sub: 'written per application, no file', ghost: true, dashed: true },
        { key: 'none', label: 'No CV', sub: 'applications sent without one', ghost: true, dashed: true },
        { key: 'cv-2024', label: 'CV Developer 2024', sub: 'generic master, made 03/2024', glyph: 'pdf', href: '#cv-2024' },
    ];
    /** @type {import('../../../../js/uses-map.js').UsesNode[]} */
    const apps = [
        { key: 'deloitte', label: 'Deloitte', href: '#app-deloitte' },
        { key: 'takto', label: 'Takto', href: '#app-takto' },
        { key: 'colruyt', label: 'Colruyt Group', href: '#app-colruyt' },
        { key: 'proximus', label: 'Proximus', href: '#app-proximus' },
        { key: 'delaware', label: 'Delaware', href: '#app-delaware' },
        { key: 'fps', label: 'Federal Public Service Policy and Support', href: '#app-fps' },
        { key: 'sopra', label: 'Sopra Steria', href: '#app-sopra' },
    ];
    /** @type {Record<string, string>} */
    const uses = { deloitte: 'cv-nl', takto: 'cv-nl', sopra: 'cv-nl', colruyt: 'cv-en', fps: 'cv-en', proximus: 'bespoke', delaware: 'none' };
    const spec = {
        corner: 'CV ↓ application →',
        rows: cvs,
        columns: apps,
        cell: (/** @type {string} */ row, /** @type {string} */ column) => (uses[column] === row ? { tone: 'ok', label: 'uses it' } : { tone: 'none' }),
        countLabel: (/** @type {number} */ n) => `${n} ${n === 1 ? 'application' : 'applications'}`,
        sourcesLabel: 'CVs',
        usersLabel: 'Applications',
    };
    const main = /** @type {HTMLElement} */ (document.getElementById('km-uses'));
    let view = /** @type {'lines' | 'grid'} */ (rememberedView(main) ?? 'lines');
    const draw = () => {
        setMatrix(main, { ...spec, view });
        pressed('data-km-uses-view', view);
    };
    draw();
    stateButtons('data-km-uses-view', (value) => {
        view = value === 'grid' ? 'grid' : 'lines';
        draw();
    });
    onChoice('uses-lines', (id, value) => {
        if (id !== 'shape') return;
        main.setAttribute('data-kp-lines-shape', value);
        document.getElementById('km-uses-live')?.setAttribute('data-kp-lines-shape', value);
        draw();
    });
    readout('#km-uses', 'kp-uses-pin', 'km-uses-log', (d) => JSON.stringify({ key: d.key, side: d.side, pinned: d.pinned, related: d.related }));
    readout('#km-uses', 'kp-matrix-pick', 'km-uses-log');

    const live = /** @type {HTMLElement} */ (document.getElementById('km-uses-live'));
    const phone = /** @type {HTMLElement} */ (document.getElementById('km-uses-phone'));
    /** @type {number} */
    let timer = 0;
    const show = (/** @type {string} */ state) => {
        window.clearTimeout(timer);
        if (state === 'ready') setMatrix(live, { ...spec, view: 'lines' });
        else if (state === 'loading') setMatrix(live, { ...spec, view: 'lines', state: 'loading', skeleton: 5 });
        else if (state === 'empty') setMatrix(live, { view: 'lines', rows: [], columns: [], state: 'empty', message: 'No CV is in use yet' });
        else setMatrix(live, { view: 'lines', rows: [], columns: [], state: 'error', message: 'The CVs could not be read' });
    };
    show('ready');
    setMatrix(phone, { ...spec, view: 'lines' });
    stateButtons('data-km-uses-state', show);
    live.addEventListener('kp-uses-retry', () => {
        show('loading');
        pressed('data-km-uses-state', 'loading');
        timer = window.setTimeout(() => {
            show('ready');
            pressed('data-km-uses-state', 'ready');
        }, 1400);
    });
}

// ── the gallery ─────────────────────────────────────────────────────────────────────────────────────────────────
{
    const { setGallery, setGalleryUploading, galleryItems } = await import('../../../../js/gallery.js');
    const at = (/** @type {string} */ v) => Date.parse(v);
    const names = ['Mila', 'Jonas', 'Noor', 'Lars', 'Fien'];
    const notes = [
        'Sunrise over the lake before anyone was up.',
        'Fog on the pine ridge; the path is just visible.',
        'The harbour an hour after the last ferry.',
        'A dune after a day of wind, with our footprints still in it.',
        'The field behind the house, first snow.',
        'The market stall with the best waffles, which we visited twice.',
        'The old bridge, which is much older than the town says.',
        'Roofs of the old town from the tower.',
        'The cliff path, seen from the way down.',
        'The night train, a long exposure from the platform.',
        'Tulip rows near the dyke, a very windy afternoon in April when nothing would stay still.',
        'The quiet canal behind the market.',
    ];
    const dims = [
        [3200, 2133],
        [2400, 1600],
        [3200, 2133],
        [2400, 1600],
        [1600, 2400],
        [3200, 2133],
        [2400, 1600],
        [3200, 2133],
        [2400, 1600],
        [3200, 2133],
        [2400, 1600],
        [3200, 2133],
    ];
    /** @type {import('../../../../js/gallery.js').GalleryItem[]} */
    const all = notes.map((caption, i) => ({
        id: String(i + 1),
        src: `../kpadopt56/src/kpadopt6-media/files/photo-${String(i + 1).padStart(2, '0')}.svg`,
        width: dims[i][0],
        height: dims[i][1],
        alt: caption.split('.')[0].split(';')[0],
        caption,
        uploader: names[i % names.length],
        at: at(`2026-10-${String(5 + (i % 12)).padStart(2, '0')}T${String(8 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00+02:00`),
    }));
    all.push({
        id: '13',
        src: '../kpadopt56/src/kpadopt6-media/files/harbour-clip.webm',
        poster: '../kpadopt56/src/kpadopt6-media/files/photo-03.svg',
        kind: 'video',
        width: 3200,
        height: 2133,
        alt: 'The harbour clip',
        caption: 'A boat crossing the harbour, filmed from the quay.',
        uploader: 'Lars',
        at: at('2026-10-16T19:20:00+02:00'),
    });

    const main = /** @type {HTMLElement} */ (document.getElementById('km-gal'));
    /** @type {import('../../../../js/gallery.js').GalleryItem[]} */
    let items = all.map((i) => ({ ...i }));
    const draw = () =>
        setGallery(main, {
            items,
            add: true,
            actions: (item) => [
                {
                    label: 'Delete',
                    tone: 'destructive',
                    confirm: 'Remove this picture from the gallery?',
                    run: () => {
                        items = items.filter((i) => i.id !== item.id);
                        document.querySelector('dialog.kp-gallery__lightbox')?.dispatchEvent(new Event('cancel'));
                        /** @type {HTMLDialogElement | null} */ (document.querySelector('dialog.kp-gallery__lightbox'))?.close();
                        draw();
                    },
                },
            ],
        });
    draw();
    main.addEventListener('kp-gallery-add', (event) => {
        const files = /** @type {CustomEvent<{ files: File[] }>} */ (event).detail.files;
        setGalleryUploading(main, `Uploading ${files.length} ${files.length === 1 ? 'picture' : 'pictures'}…`);
        window.setTimeout(() => {
            for (const file of files) {
                if (!file.type.startsWith('image/')) continue;
                const url = URL.createObjectURL(file);
                items.push({ id: `u${Date.now()}${items.length}`, src: url, thumb: url, alt: file.name, caption: file.name, uploader: 'You', at: Date.now() });
            }
            setGalleryUploading(main, null);
            draw();
        }, 1200);
    });
    readout('#km-gal', 'kp-gallery-open', 'km-gal-log', (d) => JSON.stringify({ id: d.id, caption: d.item?.caption }));
    onChoice('gallery-grid', (id, value) => {
        if (id !== 'tiles') return;
        main.setAttribute('data-kp-tile-shape', value);
        draw();
    });
    main.setAttribute('data-kp-tile-shape', 'square');

    const loop = /** @type {HTMLElement} */ (document.getElementById('km-gal-loop'));
    setGallery(loop, { items: all.slice(0, 4) });

    // The states.
    const live = /** @type {HTMLElement} */ (document.getElementById('km-gal-live'));
    /** @type {number} */
    let timer = 0;
    const show = (/** @type {string} */ state) => {
        window.clearTimeout(timer);
        setGalleryUploading(live, null);
        if (state === 'ready') setGallery(live, { items: all.slice(0, 8), state: 'ready', add: true });
        else if (state === 'loading') setGallery(live, { state: 'loading', add: true, skeleton: 8 });
        else if (state === 'empty') setGallery(live, { items: [], add: true, state: 'empty', message: 'No pictures yet' });
        else if (state === 'error') setGallery(live, { state: 'error', message: 'The pictures could not be loaded' });
        else {
            setGallery(live, { items: all.slice(0, 8), state: 'ready', add: true });
            setGalleryUploading(live, 'Uploading 3 pictures…');
        }
    };
    show('ready');
    stateButtons('data-km-gal-state', show);
    live.addEventListener('kp-gallery-retry', () => {
        show('loading');
        pressed('data-km-gal-state', 'loading');
        timer = window.setTimeout(() => {
            show('ready');
            pressed('data-km-gal-state', 'ready');
        }, 1400);
    });

    const broken = /** @type {HTMLElement} */ (document.getElementById('km-gal-broken'));
    setGallery(broken, {
        items: [
            all[0],
            all[1],
            { id: 'x', src: '../kpadopt56/src/kpadopt6-media/files/missing-picture.svg', width: 3200, height: 2133, alt: 'A picture whose file is gone', caption: 'This file is gone from the server.', uploader: 'Noor' },
            all[3],
            all[4],
            all[5],
        ],
    });
    const phone = /** @type {HTMLElement} */ (document.getElementById('km-gal-phone'));
    phone.setAttribute('data-kp-caption', 'always');
    setGallery(phone, { items: all.slice(0, 6) });
    void galleryItems;
}

// ── the growing text box ────────────────────────────────────────────────────────────────────────────────────────
{
    const { setAutosizeState } = await import('../../../../js/autosize.js');
    const mail = /** @type {HTMLTextAreaElement} */ (document.getElementById('km-auto-mail'));
    const line = (/** @type {number} */ n) => `Line ${n} of the mail: the dispatch dashboard is slower on Mondays, can you look at the first query?`;
    const lines = (/** @type {number} */ n) => Array.from({ length: n }, (_, i) => line(i + 1)).join('\n');
    const put = (/** @type {HTMLTextAreaElement} */ box, /** @type {string} */ text) => {
        box.value = text;
        box.dispatchEvent(new Event('input', { bubbles: true }));
    };
    document.getElementById('km-auto-paste40')?.addEventListener('click', () => put(mail, lines(40)));
    document.getElementById('km-auto-paste5')?.addEventListener('click', () => put(mail, lines(5)));
    document.getElementById('km-auto-paste-long')?.addEventListener('click', () => put(mail, `${'Hello, this is a long mail. '.repeat(130)}`.slice(0, 3700)));
    document.getElementById('km-auto-clear')?.addEventListener('click', () => put(mail, ''));
    document.getElementById('km-auto-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const sent = document.getElementById('km-auto-sent');
        if (sent) sent.textContent = 'Sent';
        window.setTimeout(() => {
            if (sent) sent.textContent = '';
        }, 2000);
    });
    mail.addEventListener('kp-autosize-resize', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        const log = document.getElementById('km-auto-log');
        if (log) log.textContent = `kp-autosize-resize\n${JSON.stringify({ height: d.height, lines: d.lines, capped: d.capped })}`;
    });

    const live = /** @type {HTMLTextAreaElement} */ (document.getElementById('km-auto-live'));
    /** @type {number} */
    let timer = 0;
    stateButtons('data-km-auto-state', (state) => {
        window.clearTimeout(timer);
        if (state === 'ready') setAutosizeState(live, 'ready');
        else if (state === 'loading') {
            setAutosizeState(live, 'loading');
            timer = window.setTimeout(() => {
                setAutosizeState(live, 'ready');
                pressed('data-km-auto-state', 'ready');
            }, 2600);
        } else setAutosizeState(live, 'error', 'This reply could not be saved. Your text is still here.');
    });
    const ro = /** @type {HTMLTextAreaElement} */ (document.getElementById('km-auto-ro'));
    ro.value = lines(30);
    const phoneBox = /** @type {HTMLTextAreaElement} */ (document.getElementById('km-auto-phone'));
    document.getElementById('km-auto-phone-fill')?.addEventListener('click', () => put(phoneBox, lines(40)));
}

// ── link anchors ────────────────────────────────────────────────────────────────────────────────────────────────
{
    const { refreshAnchors } = await import('../../../../js/anchors.js');
    for (const button of document.querySelectorAll('[data-km-go]')) {
        button.addEventListener('click', () => {
            // From no address to the link, so the same link can be opened again.
            history.replaceState(null, '', `${location.pathname}${location.search}`);
            location.hash = button.getAttribute('data-km-go') ?? '';
        });
    }
    readout('#km-anchors-doc', 'kp-anchor-copy', 'km-anchors-log', (d) => JSON.stringify({ id: d.id, copied: d.text, ok: d.ok }));
    readout('#km-dead', 'kp-anchor-copy', 'km-dead-log', (d) => JSON.stringify({ id: d.id, copied: d.text, ok: d.ok }));
    onChoice('anchors-headings', (id, value) => {
        if (id !== 'position') return;
        const box = document.getElementById('km-anchors-doc');
        if (!box) return;
        box.setAttribute('data-kp-anchor-position', value);
        refreshAnchors(box);
    });
}

// ── printing a list ─────────────────────────────────────────────────────────────────────────────────────────────
{
    const { setChecklistItems } = await import('../../../../js/checklist.js');
    const { preparePrint } = await import('../../../../js/print.js');
    /** @type {import('../../../../js/checklist.js').ChecklistItem[]} */
    const items = [
        { id: 'shirts', label: 'T-shirts', detail: '4', group: 'Clothes', checked: true },
        { id: 'jumper', label: 'Warm jumper', group: 'Clothes', checked: true },
        { id: 'rain', label: 'Rain jacket', detail: 'it is Ghent in October', group: 'Clothes' },
        { id: 'shoes', label: 'Walking shoes', group: 'Clothes' },
        { id: 'id', label: 'Identity card', group: 'Documents', checked: true },
        { id: 'tickets', label: 'Train tickets', detail: 'printed or on the phone', group: 'Documents' },
        { id: 'hotel', label: 'Hotel booking', detail: 'check-in after 15:00, reference 8841-KP', group: 'Documents' },
        { id: 'coffee', label: 'Ground coffee', detail: '250 g', group: 'Kitchen' },
        { id: 'bread', label: 'Bread for the first morning', group: 'Kitchen' },
        { id: 'water', label: 'Water bottle', group: 'Kitchen', checked: true },
    ];
    const screenList = /** @type {HTMLElement} */ (document.getElementById('km-print-list'));
    setChecklistItems(screenList, items);

    const NOW = Date.parse('2026-10-17T14:05:00+02:00');
    /** @type {string[]} */
    let fetched = [];
    try {
        fetched = await Promise.all(['../../../../css/themes.css', '../../../../css/components.css', '../../../../css/formal-register.css', '../../../../css/fonts.css'].map((u) => fetch(u).then((r) => r.text())));
    } catch {
        // The page is being left: nothing to draw.
    }
    // The page's real print rules, with the at-rule that limits them to paper turned into "all": the sheet shows what the printer gets.
    const sheetCss = fetched.map((css) => css.replaceAll('@media print', '@media all')).join('\n');
    const sheetUrl = URL.createObjectURL(new Blob([sheetCss], { type: 'text/css' }));

    /**
     * A sheet: a frame whose document holds one checklist's markup and the print rules, with the words js/print.js adds.
     * @param {string} id @param {string} listHtml @param {Record<string, string>} [attrs]
     */
    const sheet = (id, listHtml, attrs = {}) => {
        const frame = /** @type {HTMLIFrameElement} */ (document.getElementById(id));
        const doc = /** @type {Document} */ (frame.contentDocument);
        doc.open();
        doc.write(
            `<!doctype html><html lang="en-GB" data-theme="formal"><head><meta charset="utf-8"><link rel="stylesheet" href="${sheetUrl}"><style>body{margin:0;padding:6% 7% 14%}</style></head><body>${attrs.__title === "none" ? "" : `<h1 style="margin:0 0 1rem;font-size:1.4rem">Weekend in Ghent</h1>`}${listHtml}</body></html>`,
        );
        doc.close();
        const list = doc.querySelector('[data-kp-checklist]');
        for (const [name, value] of Object.entries(attrs)) if (name !== '__title') list?.setAttribute(name, value);
        for (const box of doc.querySelectorAll('input.kp-checklist__check')) {
            if (/** @type {HTMLInputElement} */ (box).checked) box.setAttribute('checked', '');
        }
        preparePrint(doc, { now: () => NOW });
        return doc;
    };
    const draw = (/** @type {string} */ done) => {
        const clone = document.createElement('div');
        clone.innerHTML = screenList.outerHTML;
        for (const c of screenList.querySelectorAll('input.kp-checklist__check')) {
            const same = clone.querySelector(`[data-id="${CSS.escape(c.closest('[data-id]')?.getAttribute('data-id') ?? '')}"] input`);
            if (same && /** @type {HTMLInputElement} */ (c).checked) same.setAttribute('checked', '');
        }
        const html = clone.innerHTML;
        const once = (/** @type {string} */ id, /** @type {Record<string, string>} */ attrs, /** @type {string} */ markup) => {
            sheet(id, markup, attrs);
        };
        once('km-sheet-1', { 'data-kp-print-done': done }, html);
        once('km-sheet-2', { 'data-kp-print-groups': 'columns', 'data-kp-print-notes-lines': '', 'data-kp-print-done': 'show' }, html);
        once(
            'km-sheet-3',
            { 'data-kp-state': 'loading', 'aria-busy': 'true' },
            '<div class="kp-checklist" data-kp-checklist data-kp-state="loading" aria-busy="true"><div class="kp-checklist__body"></div></div>',
        );
        once(
            'km-sheet-4',
            { 'data-kp-print-title': 'Packing list: weekend in Ghent', __title: 'none' },
            '<div class="kp-checklist" data-kp-checklist><div class="kp-checklist__body"><p class="kp-checklist__empty">Nothing on this list yet.</p></div></div>',
        );
    };
    if (fetched.length > 0) draw('show');
    onChoice('print-checklist', (id, value) => {
        if (id === 'ticked') draw(value);
    });
}
