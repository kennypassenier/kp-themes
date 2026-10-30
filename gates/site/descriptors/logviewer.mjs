// Page descriptor for the "logviewer" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const logviewerDescriptor = {
        id: 'logviewer',
        title: 'Log viewer',
        group: 'Data',
        classes: ['kp-logviewer', 'kp-log'],
        exports: [],
        intro: 'The log as a page reads it: lines that keep arriving, kept in a buffer with a cap, found with a marked count, wrapped or not, with or without a time column, the level in colour, copied or downloaded. Following the tail, the pause button and the "N new lines" pill are the package\'s own, not drawn again.',
        whenToUse: 'A host or stack log that grows while it is read. For a handful of static lines use the log; for commands you type and the output they print use the console. There is no virtual list: every kept line is a real row, so the cap is what keeps the page light.',
        examples: [
            {
                title: 'A host log',
                why: 'The page hands over what arrived; a line is kept once per `id`, so overlapping polls are fine.',
                markup: `
<div class="kp-logviewer" data-kp-logviewer data-kp-log-max="2000" data-kp-log-filename="host-log" aria-label="Host log"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-log-max', what: 'Lines kept (2000); the oldest are dropped first and counted.' },
            { name: 'data-kp-log-wrap', what: '`on` (default) or `off`: one line each, scrolling sideways under a time column that stays put.' },
            { name: 'data-kp-log-time', what: '`time` (default), `datetime` or `off`.' },
            { name: 'data-kp-log-level', what: 'The lowest level shown: `debug` (default), `info`, `warning` or `error`.' },
            { name: 'data-kp-log-search', what: 'The text to find; matches are marked and counted, Enter and Shift+Enter walk them.' },
            { name: 'data-kp-log-search-only', what: '`on` hides the lines without a match.' },
            { name: 'data-kp-log-follow', what: '`live` (default) or `paused`.' },
            { name: 'data-kp-log-tools', what: 'The tools shown: search, follow, wrap, time, level, copy, download.' },
            { name: 'data-kp-log-filename', what: 'The name a download gets, without `.txt`.' },
            { name: 'data-kp-log-focus-key', what: 'The key that jumps to the search (/; `false` for none).' },
            { name: 'data-kp-state', what: '`ready`, `loading` (the busy card over the viewer) or `error` (the failed plate with Retry).' },
        ],
        accessibility: [
            'Built in: the list is a log region that is not read line by line, the find count and the new-line count are said politely and not on every line, every tool is a labelled control, the level is a word before it is a colour.',
            'Yours: where the lines come from, masking secrets in them, and what a line means.',
        ],
    };
