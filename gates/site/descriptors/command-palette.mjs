// Page descriptor for the "command-palette" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const commandPaletteDescriptor = {
        id: 'command-palette',
        title: 'Command palette',
        group: 'Navigation',
        classes: ['kp-palette'],
        exports: ['CommandPalette', 'PaletteTrigger'],
        aliases: ['listbox', 'option', 'disabled', 'group', 'keys', 'generated', 'primary', 'match', 'hotkey', 'clear-on-close', 'close-on-run', 'above', 'context', 'context-of', 'featured', 'highlight', 'hint', 'hint-text', 'nomatch', 'nomatch-hint', 'recent', 'static', 'subject-name', 'typo', 'verb'],
        intro: 'A dialog with a filter box and a list of commands, opened by a key from anywhere on the page. The commands are markup a server wrote, not an array this module owns, so they are there before any script runs.',
        whenToUse:
            'In an application dense enough that a reader will want to jump rather than navigate — and only as a second route, never the only one. Not as a menu for three commands; not as a search over data, which is a search field with results.',
        examples: [
            {
                title: 'A palette, grouped, left open',
                why: 'Shown open so it can be looked at; in an application it opens on its key and closes when a command runs. The hotkey is turned off here so that this page does not take a key from your browser.',
                markup: `
<dialog class="kp-palette" data-kp-palette data-kp-hotkey="none" id="doc-palette" aria-label="Commands" open>
<input class="kp-palette__input" type="text" role="combobox" aria-label="Commands" aria-expanded="true" aria-controls="doc-palette-list" autocomplete="off" placeholder="Type a command…" />
<ul class="kp-palette__list" id="doc-palette-list" role="listbox" aria-label="Commands">
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Applications</span>
<ul role="group" aria-label="Applications">
<li class="kp-palette__option" role="option" data-kp-option data-value="new">New application<span class="kp-palette__description">Start from an empty form</span><kbd class="kp-palette__keys" data-kp-keys="n">n</kbd></li>
<li class="kp-palette__option" role="option" data-kp-option data-value="import">Import from a file</li>
</ul></li>
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Account</span>
<ul role="group" aria-label="Account">
<li class="kp-palette__option" role="option" data-kp-option data-value="theme">Change theme</li>
<li class="kp-palette__option" role="option" data-kp-option data-value="signout">Sign out</li>
</ul></li>
</ul>
<p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
`,
            },
            {
                title: 'Places to go, opened from the bar',
                why: 'A hotkey alone is a secret, so the bar keeps a visible trigger in its `.kp-nav__search` slot: a `data-kp-palette-open` button the module marks as opening a dialog, whose empty key hint it fills with ⌘K or Ctrl K when the palette has a key. The commands are links: Enter and a click both follow them, `kp-palette-run` still fires first and can be cancelled by a router that navigates itself, and until the module attaches they are plain anchors that work on their own. The hotkey is off here, so the trigger prints no key.',
                markup: `
<div class="kp-nav-wrap">
<nav class="kp-nav" aria-label="Main">
<a class="kp-nav__brand" href="#command-palette">kp</a>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#command-palette" aria-current="page">Overview</a></li>
</ul>
<div class="kp-nav__search">
<button type="button" class="kp-nav__search-trigger" data-kp-palette-open="doc-places">Search <kbd class="kp-palette__keys" data-kp-palette-keys></kbd></button>
</div>
</nav>
</div>
<dialog class="kp-palette" data-kp-palette data-kp-hotkey="none" id="doc-places" aria-label="Go to">
<input class="kp-palette__input" type="text" role="combobox" aria-label="Go to" aria-expanded="true" aria-controls="doc-places-list" autocomplete="off" placeholder="Where to?" />
<ul class="kp-palette__list" id="doc-places-list" role="listbox" aria-label="Go to">
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="overview" href="#command-palette">Overview</a></li>
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="nav-bar" href="nav-bar.html">Navigation bar</a></li>
</ul>
<p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
`,
            },
            {
                title: 'Rows on shared tracks',
                why: 'The list is one grid and every row a subgrid of it, so the icon, the label, the hint and the key cap of every row start on one edge down the whole list, whatever group or link wrapper a row sits in. The label column is as wide as the longest label (at most 45% of the list, `--kp-palette-label-max`), the hint takes the rest, and a column no row uses is 0 wide. Rows with a link, with a hint, with a key and with an icon stand mixed on purpose.',
                markup: `
<dialog class="kp-palette" data-kp-palette data-kp-hotkey="none" data-kp-highlight="off" id="doc-tracks" aria-label="Commands" open>
<input class="kp-palette__input" type="text" role="combobox" aria-label="Commands" aria-expanded="true" aria-controls="doc-tracks-list" autocomplete="off" placeholder="Go to a topic or an app, or type a verb" />
<ul class="kp-palette__list" id="doc-tracks-list" role="listbox" aria-label="Commands">
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Do</span>
<ul role="group" aria-label="Do">
<li class="kp-palette__option" role="option" data-kp-option data-value="publish"><span class="kp-palette__icon" aria-hidden="true">+</span><span class="kp-palette__label">Publish a test message</span><kbd class="kp-palette__keys" data-kp-keys="p">p</kbd></li>
<li class="kp-palette__option" role="option" data-kp-option data-value="prune"><span class="kp-palette__icon" aria-hidden="true">-</span><span class="kp-palette__label">Prune dead letters</span><span class="kp-palette__description">3 waiting</span></li>
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="apps" href="#doc-tracks"><span class="kp-palette__icon" aria-hidden="true">&gt;</span><span class="kp-palette__label">Apps</span><span class="kp-palette__description">Every app with its own token</span><kbd class="kp-palette__keys" data-kp-keys="g a">g a</kbd></a></li>
</ul></li>
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Topics</span>
<ul role="group" aria-label="Topics">
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="orders" href="#doc-tracks"><span class="kp-palette__label">orders</span><span class="kp-palette__description">12,408 messages, 2 subscriptions</span></a></li>
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="notifications-and-reminders" href="#doc-tracks"><span class="kp-palette__label">notifications-and-reminders</span><span class="kp-palette__description">Quiet</span></a></li>
<li role="presentation"><a class="kp-palette__option" role="option" data-kp-option data-value="audit" href="#doc-tracks"><span class="kp-palette__label">audit</span></a></li>
</ul></li>
</ul>
<p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
`,
            },
            {
                title: 'Words in any order, marked',
                why: 'The query “upd jelly” is typed for you: every typed word has to start a word of the command, in whatever order, so “Update jellyfin” answers and “Update immich” and “Open the firewall” do not; the matched words are marked (`.kp-palette__mark`, a wash and a heavier weight, never colour alone; `data-kp-mark-look="wash"` keeps the wash in a theme that rules its marks instead) and the best answer comes first. “Upgrade” is a hidden synonym (`data-kp-words`) that counts weaker than the label. `data-kp-typo="1"` also finds a word one letter off.',
                markup: `
<dialog class="kp-palette" data-kp-palette data-kp-hotkey="none" data-kp-typo="1" id="doc-intent" aria-label="Commands" open>
<input class="kp-palette__input" type="text" role="combobox" aria-label="Commands" aria-expanded="true" aria-controls="doc-intent-list" autocomplete="off" placeholder="Type a command…" />
<ul class="kp-palette__list" id="doc-intent-list" role="listbox" aria-label="Commands">
<li class="kp-palette__option" role="option" data-kp-option data-value="open-fw">Open the firewall</li>
<li class="kp-palette__option" role="option" data-kp-option data-value="update-immich">Update immich</li>
<li class="kp-palette__option" role="option" data-kp-option data-value="update-jellyfin" data-kp-words="upgrade">Update jellyfin</li>
<li class="kp-palette__option" role="option" data-kp-option data-value="restart-jellyfin">Restart jellyfin</li>
</ul>
<p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
`,
                script: `
const input = document.querySelector('#doc-intent input');
setTimeout(() => {
    input.value = 'upd jelly';
    input.dispatchEvent(new Event('input', { bubbles: true }));
}, 300);
`,
            },
        ],
        variants: [
            { name: 'matching options', what: 'On the palette: `data-kp-fold-diacritics` (“cafe” finds “Café”, on by default), `data-kp-split-hyphen` (“kp” finds “kp-soft”, on by default), `data-kp-typo="1"` (one letter off, never for a word under four letters), `data-kp-highlight="off"` (no marks), `data-kp-mark-look="wash"` (keep the wash in a theme that rules its marks instead) and `data-kp-group-order="Inbox, Do, Go to"` (the order of the groups).' },
            { name: '.kp-palette__mark / __label / __nomatch', what: 'A matched word, the label the script wraps so the words can be marked (`__label` is generated, so a command’s own markup stays as written), and the plate of a query nothing answers (`data-kp-nomatch="plate"`), which names what a known verb works on.' },
            { name: 'palette(el).setState', what: '`setState(\'loading\' | \'error\' | \'ready\', { message })` shows the busy card over the list, or the failed plate with Retry (`kp-palette-retry`) beside the commands marked `data-kp-static`, which stay.' },
            { name: 'js/intent.js', what: 'The matcher on its own, pure and without a DOM: `matchIntent(text, query, options)`, `intentScore`, `intentRanges` (the character ranges to mark), `intentTokens` and `intentWords` (what a word is), `queryWords`, `startsWord(have, want, { typo })`, `rankCommands(commands, query, { context, maxShown, groupOrder, recent })` and `noMatchText(query, { verbs, subjects, noun, hint })`; `INTENT_MAX_SHOWN` (40) is the default behind `data-kp-max-shown`. A page that draws its own list ranks it with `rankCommands`.' },
            { name: '.kp-palette', what: 'The dialog: near the top rather than in the middle, so a list that grows downwards does not push its own input off centre.' },
            { name: '.kp-palette__input', what: 'The filter, at full width, with the list under it.' },
            { name: '.kp-palette__group / __group-label', what: 'Commands under a small heading. A group whose commands are all filtered out hides itself.' },
            { name: '.kp-palette__option', what: 'One command; is-active marks where the keyboard is. The list is one grid with four tracks (icon, label, hint, keys) and every row is a subgrid of it, so each column starts on one edge in every group, link wrapper and row; a track no row uses is 0 wide. Write `.kp-palette__label` around the words of a row that stands beside an icon.' },
            { name: '.kp-palette__icon', what: 'An optional mark before the label, on the first track; it keeps a gap to the label, and rows without one still start their label where the others do.' },
            { name: '.kp-palette__description', what: 'A hint beside the label, on the track after it, for a command whose name is not enough.' },
            { name: '.kp-palette__keys', what: 'The key hint on the last track, at the end of a row, which never competes with the label.' },
            { name: '.kp-palette__status', what: 'The live region that says how many commands are left after typing.' },
            { name: 'a link as a command', what: 'An `<a href>` carrying the option’s role and `data-kp-option`, inside a presentational list item (a command with an `href` in React). Enter and a click follow it; the module keeps it out of the Tab order so focus stays in the filter, and a page without JavaScript still has a list of working links.' },
            { name: 'matching', what: 'The filter matches by words in any order by default — every typed word has to start a word of the command, so “read” finds “Readings for line 2” and not “Report an incident”, and “line readings” finds it too. The best answer comes first in its group and the matched words are marked. `data-kp-match` (the `match` prop in React) brings back `substring`, `prefix` or `subsequence` (“nap” finds “new application”).' },
            { name: 'data-kp-words / data-kp-hint', what: 'On a command: words that are never shown (synonyms) and a hint that is; both count as a weaker match than the label.' },
            { name: 'data-kp-context / data-kp-context-of / data-kp-featured / data-kp-recent', what: 'The open subject’s commands rank higher and, with what is featured and the last few run, are all that shows before anything is typed; a palette with none of these shows every command.' },
            { name: 'data-kp-max-shown / data-kp-nomatch / data-kp-verb', what: 'At most 40 rows show and the status line says how many matched; a query nothing answers keeps the status line; `data-kp-nomatch="plate"` shows the empty plate instead, naming what a known verb works on.' },
            { name: 'pastel', what: 'In pastel the palette opens as pastel’s dialog: its pass on its ::backdrop, the landing onto it, a strip of washi tape across its corner; it closes as that opening backwards. An entry under the pointer or the keys is a sticker on its plate.' },
            { name: 'switchable at runtime', what: 'Switchable at runtime: changing `data-kp-match` redraws the palette’s results.' },
        ],
        accessibility: [
            'Built in — the dialog gives focus trapping, Escape and focus return, so the palette cannot strand the keyboard.',
            'Built in — virtual focus keeps the cursor in the input while the highlight moves, and the current command is announced.',
            'Built in — the number of matches is announced after typing.',
            'Yours — offer every command somewhere else as well. A palette is a shortcut, not an interface.',
            'Yours — write the commands as markup, with a value each, and name the groups.',
            'Built in — the trigger in the bar says it opens a dialog and which key does the same, and Escape gives focus back to it.',
            'Yours — pick a key that is not already the browser’s, and say what it is somewhere visible.',
        ],
    };
