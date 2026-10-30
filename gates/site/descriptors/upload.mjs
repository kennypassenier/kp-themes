// Page descriptor for the "upload" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const uploadDescriptor = {
        id: 'upload',
        title: 'File upload',
        group: 'Forms',
        classes: ['kp-upload'],
        exports: ['Upload'],
        aliases: ['drop', 'max-bytes', 'max-files', 'max-total', 'remove-glyph', 'locale', 'dragging'],
        intro: 'A drop zone that is a label over a real file input, a list of the chosen files, and a per-file state the consumer drives: progress, done, or an error with its reason. The sending stays yours.',
        whenToUse:
            'Wherever a person attaches files. Not as an upload client — the request, the retry and the endpoint are the application’s, and a component that owned them would have to know your auth. Not for a single hidden image swap either, where a plain file input with a label is the whole story.',
        examples: [
            {
                title: 'A drop zone with a size limit',
                why: 'The zone is a label pointing at a real file input: Tab reaches it, Enter opens the picker, and a screen reader announces a file field rather than a mysterious box. Dropping is added on top and is nobody’s only route in.',
                markup: `
<div class="kp-upload" data-kp-upload data-kp-max-bytes="5000000" data-kp-max-files="5">
<input type="file" multiple class="kp-sr-only" id="doc-upload-files" data-kp-upload-input />
<label class="kp-upload__zone" for="doc-upload-files" data-kp-upload-zone>Drop files here or choose them</label>
<ul class="kp-upload__list" data-kp-upload-list></ul>
</div>
`,
            },
            {
                title: 'What a row looks like while it is sending, and when it failed',
                why: 'The rows are normally written by the module as files arrive; printed here so the states can be seen at rest. The bar is one element filled by a gradient stop rather than a second element kept in step by hand.',
                markup: `
<ul class="kp-upload__list">
<li class="kp-upload__file" data-state="uploading">
<span>quarterly-report.pdf</span><span class="kp-upload__size">1.2 MB</span>
<span class="kp-upload__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" aria-label="Uploading quarterly-report.pdf"></span>
</li>
<li class="kp-upload__file" data-state="error">
<span>holiday.mov</span><span class="kp-upload__size">210 MB</span>
<span class="kp-upload__message">Larger than the 5 MB limit.</span>
</li>
</ul>
`,
            },
        ],
        variants: [
            { name: '.kp-upload__zone', what: 'The target. It is a label, which is what makes it operable without a pointer.' },
            { name: 'dragging', what: 'While files are over the zone it takes the primary boundary and the page’s full ink.' },
            { name: '.kp-upload__file', what: 'One row: name, size, and room underneath for a bar or a message.' },
            { name: '.kp-upload__bar', what: 'Progress, as a fill across the row rather than a separate element.' },
            { name: '.kp-upload__message', what: 'Why a file was refused, or what is happening to it, in words under the row.' },
            { name: 'error', what: 'A refused or failed row takes the destructive boundary and its message the destructive colour.' },
        ],
        accessibility: [
            'Built in — the real file input stays in the tab order under the zone, so the keyboard route is the same one the pointer uses.',
            'Built in — a refusal is a sentence in the row, and sizes are printed in the page’s locale rather than in one hard-coded format.',
            'Built in — removing a file is a button with a name, and the removal is an event a consumer can refuse.',
            'Yours — send the files and report back what happened; the component shows the outcome you give it.',
            'Yours — say what is allowed before the reader picks: the types, the size and how many.',
            'Yours — keep the file input in the markup even though it is visually hidden. Hiding it with display none takes it out of the tab order.',
        ],
    };
