// Page descriptor for the "code" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const codeDescriptor = {
        id: 'code',
        title: 'Code block',
        group: 'Data',
        classes: ['kp-code'],
        exports: [],
        aliases: ['binary-size', 'download', 'truncated'],
        intro: 'A payload, a request or a snippet: a head with its title, what it is and its tools (Pretty and Raw for JSON, Wrap, Copy), and the text in the mono face. js/code.js (`setCode`, `prettyJson`, `attachCodes`) fills every `[data-kp-code]`; loading lays the busy card, empty, binary and failed say so at the body’s height.',
        whenToUse: 'A message body, an HTTP request, a command to copy. For a running log use the log; for a change use the diff.',
        examples: [
            {
                title: 'A JSON payload',
                why: '`data-kp-code-max` folds a long block with “Show all N lines”; `data-kp-code-lines` adds line numbers.',
                markup: `
<figure class="kp-code" data-kp-code data-kp-code-title="Payload" data-kp-code-language="JSON" data-kp-code-lines><pre class="kp-code__body"><code>{"topic":"backup.done","ok":true,"volumes":["media","photos"]}</code></pre></figure>
`,
            },
            {
                title: 'Pretty and Raw, folded, wrapped, and cut off',
                why: 'JSON that parses gets Pretty and Raw (`data-kp-code-layout="raw"` starts raw, and a layout the reader picks stays); anything else has no such control. `data-kp-code-max` folds a long block to that many lines with “Show all N lines” under it, `data-kp-code-wrap` wraps from the start (the reader can still toggle Wrap), and `data-kp-code-size` is the size said in the head. Copy copies the whole text, folded or not. A page that only received the start says so in the foot with `setCode(el, { truncated: { shown, total } })`.',
                markup: `
<div class="kp-stack">
<figure class="kp-code" data-kp-code data-kp-code-title="Request" data-kp-code-language="JSON" data-kp-code-max="6"><pre class="kp-code__body"><code>{"id":"01J9ZK","topic":"backup.done","ok":true,"volumes":["media","photos","documents","music"],"took_ms":18204,"host":"backup-1","retries":0,"notes":"nightly run, all volumes, no warnings"}</code></pre></figure>
<figure class="kp-code" id="doc-code-cut" data-kp-code data-kp-code-title="Response" data-kp-code-language="JSON" data-kp-code-wrap data-kp-code-size="4 kB"><pre class="kp-code__body"><code>{"items":[{"id":1,"name":"media"},{"id":2,"name":"photos"},{"id":3,"name":"documents"},{"id":4,"name":"music"}</code></pre></figure>
</div>
`,
                script: `
import { attachCodes, setCode } from '@kp-soft/themes/js/code';

const block = document.getElementById('doc-code-cut');
attachCodes(block.parentElement);
setCode(block, { text: block.querySelector('code').textContent, title: 'Response', language: 'JSON', wrap: true, size: '4 kB', truncated: { shown: '1 kB', total: '4 kB' } });
`,
            },
            {
                title: 'The states and the events',
                why: '`setCode(el, { state })` is `loading` (the body keeps its height under the busy card; the tools wait, disabled), `empty`, `binary` (with `size`) or `error` (with `message`), each a sentence in the body’s place at its height, with the tools where they were. The block fires `kp-code-copy` with `{ text }` (and `kp-code-copy-failed`), `kp-code-wrap` with `{ wrap }`, `kp-code-layout` with `{ layout }` and `kp-code-fold` with `{ folded }`; “Copied” stays for `CODE_COPIED_MS` (1500 ms) in the width of the longest word, so nothing beside it moves. `loadingWords` words the busy card, `copy: false` takes Copy away, and `prettyJson(text)` is the two-space layout on its own (`null` when the text does not parse).',
                markup: `
<div class="kp-stack">
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="States">
<button type="button" class="kp-button" data-doc-code-state="ready">Ready</button>
<button type="button" class="kp-button" data-doc-code-state="loading">Loading</button>
<button type="button" class="kp-button" data-doc-code-state="empty">Empty</button>
<button type="button" class="kp-button" data-doc-code-state="binary">Binary</button>
<button type="button" class="kp-button" data-doc-code-state="error">Could not read</button>
</div>
<figure class="kp-code" id="doc-code-states" data-kp-code></figure>
<pre class="kp-code-block" id="doc-code-log" aria-live="polite">Press Copy, Wrap or Raw.</pre>
</div>
`,
                script: `
import { CODE_COPIED_MS, attachCodes, setCode } from '@kp-soft/themes/js/code';

const block = document.getElementById('doc-code-states');
const log = document.getElementById('doc-code-log');
attachCodes(block.parentElement);
const text = '{"topic":"backup.done","ok":true,"volumes":["media","photos"],"took_ms":18204}';
const draw = (state) =>
    setCode(block, {
        text: state === 'empty' ? '' : text,
        title: 'Payload',
        language: 'JSON',
        size: '86 B',
        state,
        message: state === 'error' ? 'The payload could not be read. Try again in a minute.' : undefined,
        loadingWords: 'Reading the payload',
    });
draw('ready');
for (const button of document.querySelectorAll('[data-doc-code-state]')) {
    button.addEventListener('click', () => draw(button.getAttribute('data-doc-code-state')));
}
for (const name of ['kp-code-copy', 'kp-code-copy-failed', 'kp-code-wrap', 'kp-code-layout', 'kp-code-fold']) {
    block.addEventListener(name, (event) => (log.textContent = name + ' ' + JSON.stringify(event.detail ?? {}) + ' (Copied stays ' + CODE_COPIED_MS + ' ms)'));
}
`,
            },
            {
                title: 'In a table cell',
                why: '`.kp-code--cell` is the block for a cell: no title, the words wrap so a row never scrolls sideways, three lines show and “Show all 40 lines” opens the rest in place (`data-kp-code-open="inline"`, the default) or in a dialog (`"dialog"`). `data-kp-code-language="auto"` makes it JSON only when the text parses. `data-kp-binary-size` (bytes) with `data-kp-download` gives the one muted line “binary, 2.1 kB” and its link; `data-kp-truncated="1024/4096"` (bytes shown / bytes in all) gives the foot line; `data-kp-copy="false"` takes Copy away. Empty is the muted line “empty payload”.',
                markup: `
<div class="kp-table-wrap"><table class="kp-table">
<caption class="kp-sr-only">Dead letters with their payload</caption>
<thead><tr><th scope="col">Topic</th><th scope="col">Payload</th></tr></thead>
<tbody>
<tr><th scope="row">backup.done</th><td><figure class="kp-code kp-code--cell" data-kp-code data-kp-code-language="auto"><pre class="kp-code__body"><code>{"ok":true,"volumes":["media","photos","documents","music","video","archive"],"took_ms":18204,"host":"backup-1","retries":0,"notes":"nightly run, all volumes"}</code></pre></figure></td></tr>
<tr><th scope="row">scan.result</th><td><figure class="kp-code kp-code--cell" data-kp-code data-kp-code-open="dialog" data-kp-truncated="1024/4096"><pre class="kp-code__body"><code>scan started, 120 files read, 4 files skipped, report written, scan finished, nothing left to do, waiting for the next run, then the same again tomorrow night</code></pre></figure></td></tr>
<tr><th scope="row">thumbnail</th><td><figure class="kp-code kp-code--cell" data-kp-code data-kp-binary-size="2150" data-kp-download="#thumbnail.png"><pre class="kp-code__body"><code></code></pre></figure></td></tr>
<tr><th scope="row">ping</th><td><figure class="kp-code kp-code--cell" data-kp-code data-kp-copy="false"><pre class="kp-code__body"><code></code></pre></figure></td></tr>
</tbody></table></div>
`,
            },
            {
                title: 'A payload in a table row',
                why: '`.kp-code--cell` is the same block as a table cell: no title, the words wrap so a row never scrolls sideways, three lines show and “Show all N lines” opens the rest in place (`data-kp-code-open="dialog"` opens a dialog instead). `data-kp-code-language="auto"` makes it JSON only when the text parses. A binary payload is one muted line with its size and a download link; `data-kp-truncated="1024/4096"` says only the start was sent.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Dead letters</caption>
<thead><tr><th scope="col">Topic</th><th scope="col">Payload</th></tr></thead>
<tbody>
<tr><td>backup.done</td><td><figure class="kp-code kp-code--cell" data-kp-code data-kp-code-language="auto"><pre class="kp-code__body"><code>{
  "topic": "backup.done",
  "ok": true,
  "volumes": ["media", "photos"],
  "bytes": 4100000000,
  "took": "3 min 12 s"
}</code></pre></figure></td></tr>
<tr><td>upload.cover</td><td><figure class="kp-code kp-code--cell" data-kp-code data-kp-binary-size="2150" data-kp-download="cover.png"></figure></td></tr>
<tr><td>export.big</td><td><figure class="kp-code kp-code--cell" data-kp-code data-kp-code-language="auto" data-kp-truncated="1024/4096" data-kp-copy="false"><pre class="kp-code__body"><code>{"rows":[1,2,3,4,5,6,7,8,9,10,11,12</code></pre></figure></td></tr>
<tr><td>ping</td><td><figure class="kp-code kp-code--cell" data-kp-code></figure></td></tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'TOML and a shell command, coloured',
                why: 'The language names the colouring; `data-kp-code-highlight="off"` leaves one block plain. Colour is never the only carrier of meaning: nothing here depends on it.',
                markup: `
<div class="kp-stack kp-gap-md">
<div class="kp-code" id="doc-code-toml" data-kp-code></div>
<div class="kp-code" id="doc-code-sh" data-kp-code></div>
<div class="kp-code" id="doc-code-off" data-kp-code data-kp-code-highlight="off"></div>
</div>
`,
                script: `
import { attachCodes, setCode } from '@kp-soft/themes/js/code';

attachCodes(document.getElementById('doc-code-toml').parentElement);
setCode(document.getElementById('doc-code-toml'), { title: 'host.toml', language: 'toml', text: '# the host\\n[firewall]\\nadmit = ["10.10.10.10"]\\nenabled = true\\nport = 8443\\nname = "edge"' });
setCode(document.getElementById('doc-code-sh'), { title: 'Backup', language: 'bash', text: '# nightly copy\\nDEST="/mnt/nas/$HOST"\\nrsync -a --delete "$HOME/photos" "$DEST" && echo "done"' });
setCode(document.getElementById('doc-code-off'), { title: 'Plain', language: 'toml', text: '[firewall]\\nenabled = true' });
`,
            },
        ],
        variants: [
            { name: '.kp-code--cell', what: 'The block as a table cell: no title, wrapped words, three lines shown. Copy copies the whole value, folded or not; `data-kp-copy="false"` takes it away. An empty payload is the muted line “empty payload”; a loading one is a skeleton line, because the table around it lays the busy card.' },
            { name: 'data-kp-code-open', what: '`inline` (default: “Show all 40 lines” opens the rest in the cell) or `dialog`.' },
            { name: 'data-kp-binary-size / data-kp-download', what: 'The size in bytes of a payload that is not text, and the link to fetch it: the cell shows “binary, 2.1 kB” and the link, never the bytes.' },
            { name: 'data-kp-truncated', what: '`shown/total` in bytes, “1024/4096”: the foot line says only the start was sent.' },
            { name: 'data-kp-code-wrap / -max / -layout', what: 'Wrapped from the start; folded past N lines; Raw instead of Pretty.' },
            { name: 'state', what: '`loading`, `empty`, `binary` (with `size`) and `error`.' },
            { name: 'truncated', what: '`{ shown, total }`: the foot says only the start was sent.' },
            { name: 'data-kp-code-title, -language, -size and -lines', what: 'The head’s title, the language it names (`JSON` offers Pretty and Raw when the text parses), the size it states, and line numbers in a gutter outside the text, which a copy or a selection never takes.' },
            { name: 'setCode options', what: '`setCode(el, { text, title, language, size, lines, wrap, maxLines, layout, copy, truncated, state, message, loadingWords })`: `maxLines` folds past that many lines (0 never), `layout` is `pretty` or `raw`, `copy: false` leaves Copy out, and a page that draws later calls it again to redraw in place.' },
            { name: '.kp-code--cell and its attributes', what: 'The table-cell block: `data-kp-code-open` (`inline` or `dialog`), `data-kp-code-language="auto"`, `data-kp-binary-size`, `data-kp-download`, `data-kp-truncated` (`shown/total` in bytes) and `data-kp-copy="false"`. Loading is a skeleton line, since the table around it lays the busy card.' },
            { name: 'kp-code-copy, -copy-failed, -wrap, -layout and -fold', what: '`{ text }` (the whole value, folded or not), nothing, `{ wrap }`, `{ layout }` and `{ folded }`.' },
            { name: 'prettyJson and CODE_COPIED_MS', what: '`prettyJson(text)` is the JSON laid out with two-space indents, or `null` when it does not parse; `CODE_COPIED_MS` is how long “Copied” stays, 1500 ms.' },
            { name: 'codeLabel … codeCopiedAnnouncement strings', what: 'Every word of the block is in the dictionary: `codeLabel`, `codeWrap`, `codePretty`, `codeRaw`, `codeFormat`, `codeShowAll`, `codeShowLess`, `codeLines`, `codeEmpty`, `codeBinary`, `codeTruncated`, `codeLoading`, `codeError` and `codeCopiedAnnouncement`.' },
            { name: 'TOML and shell colouring', what: 'A block whose language is `toml`, `bash`, `sh`, `shell` or `zsh` colours its parts: sections (`.kp-code__section`), strings, values (numbers and booleans), comments and, in a shell, variables (`__var`). The colour is a word-shape as well as a hue (bold section names, italic comments), so it reads without it.' },
            { name: 'data-kp-code-highlight', what: '`off` turns the colouring off for a block that should read as plain text.' },
        ],
        accessibility: [
            'Built in — the body is a named region that takes focus, so a keyboard can scroll it; a copy is announced.', 'Built in — line numbers are never copied or read.',
            'Built in — a long line scrolls inside the plate’s padding, and the scroller that takes focus is the `code` element, so a keyboard can reach the end of a line.',
        ],
    };
