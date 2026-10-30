// Page descriptor for the "kv" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const kvDescriptor = {
        id: 'kv',
        title: 'Key-value grid',
        group: 'Data',
        classes: ['kp-kv'],
        exports: [],
        intro: 'A read-only list of facts: `dl.kp-kv` with `div.kp-kv__row` rows of a `dt` and a `dd`. The label column is as wide as the longest label and every value starts on one edge.',
        whenToUse: 'The facts about one thing: a host, a release, a message. For editable settings use the form rows.',
        examples: [
            {
                title: 'With lines',
                why: 'Values reuse the package: `.kp-id`, `.kp-copyable`, `.kp-badge`, `.kp-ago`.',
                markup: `
<dl class="kp-kv kp-kv--lines">
<div class="kp-kv__row"><dt>Host</dt><dd>pve-01</dd></div>
<div class="kp-kv__row" data-kp-changed><dt>Retention</dt><dd>30 days</dd></div>
<div class="kp-kv__row"><dt>Image digest</dt><dd><span class="kp-kv__none">—<span class="kp-sr-only">not known</span></span></dd></div>
</dl>
`,
            },
            {
                title: 'Rich values, a failed row, a waiting row',
                why: 'A value is any inline part of the package: a copyable id, a badge, a timestamp, an ago line. `data-kp-changed` puts a dot after a label that has an unsaved value, `data-kp-state="error"` a rule on the row’s start edge with the reason as its value, and `.kp-kv__wait` (a skeleton inside) holds the place of a value that has not arrived, one text line high so the row does not grow when the value comes. `.kp-kv__none` is a value that is not known, with its words for a screen reader.',
                markup: `
<dl class="kp-kv kp-kv--lines">
<div class="kp-kv__row"><dt>Release</dt><dd>4.0.1 <span class="kp-badge kp-badge--info">signed</span></dd></div>
<div class="kp-kv__row"><dt>Container id</dt><dd><span class="kp-copyable"><span class="kp-copyable__value" id="doc-kv-id">ct-109-kyu-4f2a9c</span><button type="button" class="kp-button kp-button--sm" data-kp-copy="doc-kv-id">Copy</button></span></dd></div>
<div class="kp-kv__row" data-kp-changed><dt>Retention</dt><dd>30 days (was 14, not saved yet)</dd></div>
<div class="kp-kv__row" data-kp-state="error"><dt>Checksum</dt><dd>Could not be read: the release has no checksum file.</dd></div>
<div class="kp-kv__row"><dt>Last backup</dt><dd><span class="kp-timestamp">16/10/2026 03:12</span></dd></div>
<div class="kp-kv__row"><dt>Disk</dt><dd><span class="kp-kv__wait" aria-hidden="true"><span class="kp-skeleton"></span></span><span class="kp-sr-only">Loading</span></dd></div>
</dl>
`,
            },
            {
                title: 'Lists side by side, and each label over its value',
                why: '`kp-kv--columns` lays rows in as many columns as fit (each at least a set width) with the label column a set width, the same in every list; `kp-kv--stack` puts each label over its value, for a narrow card or a long value such as an address.',
                markup: `
<div class="kp-stack">
<dl class="kp-kv kp-kv--columns kp-kv--lines">
<div class="kp-kv__row"><dt>CPU</dt><dd><span class="kp-numeric">4 cores, 12 %</span></dd></div>
<div class="kp-kv__row"><dt>Memory</dt><dd><span class="kp-numeric">3.1 GB of 8 GB</span></dd></div>
<div class="kp-kv__row"><dt>Uptime</dt><dd>12 days 4 h</dd></div>
<div class="kp-kv__row"><dt>Kernel</dt><dd><span class="kp-id">6.8.12-2-pve</span></dd></div>
</dl>
<dl class="kp-kv kp-kv--stack">
<div class="kp-kv__row"><dt>Topic</dt><dd><span class="kp-id">backup.done</span></dd></div>
<div class="kp-kv__row"><dt>Address</dt><dd><span class="kp-url">https://grafana.home.example.net/d/host-overview/proxmox-node-pve-01</span></dd></div>
</dl>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-kv--lines / --stack / --columns', what: 'A hairline between rows; each label over its value; lists side by side where there is room.' },
            { name: 'data-kp-changed / data-kp-state="error"', what: 'A dot after the label; a red rule on the row’s start edge.' },
            { name: '.kp-kv__wait', what: 'A waiting line one text line high with the theme’s skeleton in it.' },
        ],
        accessibility: ['Built in — a real description list.', 'Yours — give an unknown value its words for a screen reader.'],
    };
