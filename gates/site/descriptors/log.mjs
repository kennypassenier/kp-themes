// Page descriptor for the "log" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const logDescriptor = {
        id: 'log',
        title: 'Log',
        group: 'Data',
        classes: ['kp-log'],
        exports: [],
        aliases: ['source', 'severity', 'current'],
        intro: 'A stream of lines with the time, the source, the level and the message, in four columns that do not move. The shape homelab writes three times by hand and kp-tui carries as `LogPane`; what the web was missing was the component, not the colours.',
        whenToUse:
            'When a reader scans lines as they arrive — a deploy, a job, a service. Not for a table of records, which sorts and filters and belongs in the data table. Not for one message about one action, which is an alert or a toast.',
        examples: [
            {
                title: 'Four columns that do not move',
                why: 'The list is the grid and every line hands its parts to it, so the message of each line begins in the same column whatever the source before it is called [fix-64]. The level is a word before it is a colour: a log read without colour must still say which line failed.',
                markup: `
<div class="kp-log">
<p class="kp-log__line" data-kp-severity="info">
<time class="kp-log__time">09:41:02</time>
<span class="kp-log__source" data-kp-source="media">media</span>
<span class="kp-log__level">info</span>
<span class="kp-log__message">jellyfin: transcode worker ready</span>
</p>
<p class="kp-log__line" data-kp-severity="error">
<time class="kp-log__time">09:41:06</time>
<span class="kp-log__source" data-kp-source="backup">backup</span>
<span class="kp-log__level">error</span>
<span class="kp-log__message">restic: snapshot failed, the lock is 41 minutes old</span>
</p>
</div>
`,
            },
            {
                title: 'A name keeps its own colour',
                why: '`attachLogs` in js/log.js hashes the name into the register\'s five chart colours — FNV-1a, the same arithmetic kp-tui uses — and writes `--kp-source-colour`. So `media` is the third chart colour in the terminal and the third here, in all twenty-two themes, and no page picks a hue by hand [gap-15]. Without the script the name is simply ink.',
                markup: `
<span class="kp-log__source" data-kp-source="prometheus">prom</span>
`,
            },
        ],
        variants: [
            { name: '.kp-log', what: 'The list: the grid whose four columns every line shares.' },
            { name: '.kp-log__line', what: 'One line; it hands its four parts to the grid and paints nothing itself.' },
            { name: '.kp-log__time, .kp-log__source, .kp-log__level, .kp-log__message', what: 'The four parts, in that order — the first three stay put and the fourth takes what is left.' },
            { name: 'data-kp-severity', what: 'debug, info, notice, warning, error or critical: the ink of the level and, for the loud three, of the message.' },
            { name: 'data-kp-source', what: 'The name to hash into a chart colour. Its value is the full name, so a shortened label can still carry the right hue.' },
            { name: 'data-kp-current', what: 'The line the reader is pointed at: the muted ground, and no second colour.' },
        ],
        accessibility: [
            'Built in — the level is a word in a column of its own, so colour is never the only carrier [fix-1].',
            'Built in — the columns are the list\'s, so a long message wraps inside its own column instead of pushing the ones before it.',
            'Yours — give the list a name and say whether it follows the tail, where a reader can scroll it.',
            'Yours — announce a line that demands attention; a stream nobody is watching is silent by design.',
        ],
    };
