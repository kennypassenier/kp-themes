// File drop and upload, framework-free [TH44].
//
// The appearance and the states; the sending stays the consumer's. What
// this owns is the drop zone, the list, and the per-file state — what it
// deliberately does not own is the request, because every application
// sends files differently and a component that also owned that would have
// to know the endpoint, the auth and the retry policy.
//
//   <div class="kp-upload" data-kp-upload>
//     <input type="file" multiple data-kp-upload-input class="kp-sr-only" id="files" />
//     <label class="kp-upload__zone" for="files" data-kp-upload-zone>
//       Sleep bestanden hierheen of kies ze
//     </label>
//     <ul class="kp-upload__list" data-kp-upload-list></ul>
//   </div>
//
// The zone is a <label> pointing at a real file input, which is the whole
// accessibility story: Tab reaches the input, Enter opens the picker, and
// a screen reader announces a file field rather than a mysterious box.
// The dropping is added on top and is nobody's only route in.
//
// Each file is announced as `kp-upload-file` with its own element, and
// the consumer sets `data-state` to `uploading`, `done` or `error` and
// `data-error` to a reason. Progress is written as a percentage on
// `--kp-progress`, so the bar needs no second element.

import { getStrings } from './strings.js';
const UPLOAD = '[data-kp-upload]';

/** Fired for each accepted file. A contract value [TH26]: the detail carries the File and its row. */
export const FILE_EVENT = 'kp-upload-file';

/** Fired for a file the zone refused, with the reason. */
export const REJECT_EVENT = 'kp-upload-reject';

/** @param {number} bytes */
function readableSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachUploads(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(UPLOAD)) {
        const upload = /** @type {HTMLElement} */ (element);
        if (upload.dataset.kpUploadAttached !== undefined) continue;
        const input = /** @type {HTMLInputElement | null} */ (upload.querySelector('[data-kp-upload-input]'));
        const zone = /** @type {HTMLElement | null} */ (upload.querySelector('[data-kp-upload-zone]'));
        const list = /** @type {HTMLElement | null} */ (upload.querySelector('[data-kp-upload-list]'));
        if (input === null || zone === null || list === null) continue;
        upload.dataset.kpUploadAttached = '';

        const maxBytes = Number.parseInt(upload.dataset.kpMaxBytes ?? '', 10) || Infinity;

        /** @param {File} file */
        const row = (file) => {
            const item = document.createElement('li');
            item.className = 'kp-upload__file';
            item.dataset.kpUploadFile = file.name;
            item.dataset.state = 'waiting';

            const name = document.createElement('span');
            name.className = 'kp-upload__name';
            name.textContent = file.name;

            const size = document.createElement('span');
            size.className = 'kp-upload__size';
            size.textContent = readableSize(file.size);

            // A progress bar that is also a number: a bar alone tells a
            // screen reader nothing, and aria-valuenow is what makes it
            // a measurement rather than a decoration.
            const bar = document.createElement('span');
            bar.className = 'kp-upload__bar';
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
            bar.setAttribute('aria-valuenow', '0');
            bar.setAttribute('aria-label', getStrings().uploadProgress(file.name));

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'kp-button kp-button--ghost';
            // Named, not a bare ×: a column of identical buttons is
            // useless to anyone who cannot see which row they are in.
            remove.setAttribute('aria-label', getStrings().removeNamed(file.name));
            remove.textContent = '×';
            remove.addEventListener('click', () => item.remove());

            const message = document.createElement('span');
            message.className = 'kp-upload__message';
            message.setAttribute('role', 'status');
            message.setAttribute('aria-live', 'polite');

            item.append(name, size, bar, message, remove);
            return item;
        };

        /** @param {FileList | File[]} files */
        const take = (files) => {
            for (const file of files) {
                if (file.size > maxBytes) {
                    // Refused per file, with the reason on the row rather
                    // than in one message about "some files": a list that
                    // says which one is wrong is the whole point of a list.
                    const item = row(file);
                    item.dataset.state = 'error';
                    item.dataset.error = getStrings().uploadTooLarge(readableSize(maxBytes));
                    /** @type {HTMLElement | null} */ (item.querySelector('.kp-upload__message'))?.replaceChildren(item.dataset.error);
                    list.append(item);
                    upload.dispatchEvent(new CustomEvent(REJECT_EVENT, { bubbles: true, detail: { file, reason: 'too-large', item } }));
                    continue;
                }
                const item = row(file);
                list.append(item);
                upload.dispatchEvent(new CustomEvent(FILE_EVENT, { bubbles: true, detail: { file, item } }));
            }
        };

        const onChange = () => {
            if (input.files !== null) take(input.files);
            // Cleared so the same file can be chosen twice: without this,
            // picking a file, removing it, and picking it again does
            // nothing at all.
            input.value = '';
        };

        /** @param {DragEvent} event */
        const onDragOver = (event) => {
            event.preventDefault();
            zone.dataset.kpDragging = '';
        };
        const onDragLeave = () => delete zone.dataset.kpDragging;
        /** @param {DragEvent} event */
        const onDrop = (event) => {
            event.preventDefault();
            delete zone.dataset.kpDragging;
            const files = event.dataTransfer?.files;
            if (files !== undefined && files.length > 0) take(files);
        };

        input.addEventListener('change', onChange);
        zone.addEventListener('dragover', onDragOver);
        zone.addEventListener('dragleave', onDragLeave);
        zone.addEventListener('drop', onDrop);

        cleanups.push(() => {
            input.removeEventListener('change', onChange);
            zone.removeEventListener('dragover', onDragOver);
            zone.removeEventListener('dragleave', onDragLeave);
            zone.removeEventListener('drop', onDrop);
            delete upload.dataset.kpUploadAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

/**
 * Set a file row's progress. Exported because the consumer owns the
 * request and therefore owns the numbers.
 *
 * @param {HTMLElement} item
 * @param {number} percent
 */
export function setProgress(item, percent) {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    item.dataset.state = value >= 100 ? 'done' : 'uploading';
    item.style.setProperty('--kp-progress', `${value}%`);
    /** @type {HTMLElement | null} */ (item.querySelector('[role="progressbar"]'))?.setAttribute('aria-valuenow', String(value));
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachUploads());
    else attachUploads();
}
