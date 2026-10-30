// Page descriptor for the "quote" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const quoteDescriptor = {
        id: 'quote',
        title: 'Quote card',
        group: 'Content',
        classes: ['kp-quote', 'kp-quote-list'],
        exports: [],
        intro: 'A card that shows your own earlier words, word for word, with who wrote them and when (“Wandelen na het eten hielp”, you, Tuesday 14/10/2026). A figure with a blockquote and a caption whose time element carries the exact moment; a long entry folds behind Show all with the whole text still in the page; Hide is one press and can be undone. It shows; choosing which words to show, and never a negative one on a rough day, is the application’s job. js/quote.js (`attachQuotes`, `setQuote`, `setQuoteState`, `quote`, `quoteWhen`) draws it; the states are the card’s (js/card-state.js).',
        whenToUse: 'To quote a person’s own notes back to them (a weekly summary, an appointment preparation). For a message from someone else in a conversation use the thread; for a plain note use the card.',
        examples: [
            {
                title: 'A quote, and why it is here',
                why: 'The words are the blockquote; the date, who and why are attributes. `data-kp-quote-lang` makes a screen reader pronounce Dutch inside an English page.',
                markup: `
<figure class="kp-quote" data-kp-quote data-kp-quote-date="2026-10-14T19:40:00+02:00" data-kp-quote-lang="nl" data-kp-quote-why="What helped last time">
<blockquote>Wandelen na het eten hielp, mijn hoofd werd rustiger.</blockquote>
</figure>
`,
            },
            {
                title: 'Hero size, a link to the day, Copy, a long entry and the date styles',
                why: '`data-kp-quote-size="lg"` is for a hero place; `-source` makes “Open that day” and the blockquote’s `cite`; `-copy` shows Copy; `-hide="off"` leaves out the hide. A long entry folds behind Show all after `-lines` lines and the whole text stays in the page. `-date-style` is `date`, `relative` or `both`, and `-now` is the moment the relative words count from, so an example does not age.',
                markup: `
<div class="kp-stack">
<figure class="kp-quote" data-kp-quote data-kp-quote-size="lg" data-kp-quote-copy data-kp-quote-hide="off" data-kp-quote-date="2026-10-12T08:15:00+02:00" data-kp-quote-source="#doc-quote-day" data-kp-quote-lang="nl">
<blockquote>Kleine stappen tellen ook.</blockquote>
</figure>
<figure class="kp-quote" data-kp-quote data-kp-quote-lines="2" data-kp-quote-lang="nl" data-kp-quote-by="You" data-kp-quote-date="2026-10-14T19:40:00+02:00" data-kp-quote-now="2026-10-17T12:00:00+02:00" data-kp-quote-date-style="relative">
<blockquote>Vandaag was een zware dag, maar ik ben toch even naar buiten gegaan. Eerst alleen tot de hoek van de straat, toen tot aan het park. Daar heb ik op een bank gezeten en niets gedaan, en dat voelde voor het eerst die week niet als falen. Thuis heb ik soep gemaakt en vroeg gegeten.</blockquote>
</figure>
<p class="kp-text-muted" id="doc-quote-day">The link above goes to this line; the day’s own page is the application’s.</p>
</div>
`,
            },
            {
                title: 'Several quotes: three, and Show all',
                why: 'A `data-kp-quote-list` holds the cards and shows `data-kp-quote-max` of them (3 by default, 1 to 5), then a button with the exact number, “Show all 5”.',
                markup: `
<div class="kp-quote-list" data-kp-quote-list>
<figure class="kp-quote" data-kp-quote data-kp-quote-hide="off" data-kp-quote-lang="nl" data-kp-quote-date="2026-10-14T19:40:00+02:00"><blockquote>Wandelen na het eten hielp.</blockquote></figure>
<figure class="kp-quote" data-kp-quote data-kp-quote-hide="off" data-kp-quote-lang="nl" data-kp-quote-date="2026-10-11T20:10:00+02:00"><blockquote>Vroeg naar bed, de ochtend was beter.</blockquote></figure>
<figure class="kp-quote" data-kp-quote data-kp-quote-hide="off" data-kp-quote-lang="nl" data-kp-quote-date="2026-10-09T18:30:00+02:00"><blockquote>Even buiten zitten met thee.</blockquote></figure>
<figure class="kp-quote" data-kp-quote data-kp-quote-hide="off" data-kp-quote-lang="nl" data-kp-quote-date="2026-10-06T09:00:00+02:00"><blockquote>Eerst de brief schrijven, daarna pas de rest.</blockquote></figure>
<figure class="kp-quote" data-kp-quote data-kp-quote-hide="off" data-kp-quote-lang="nl" data-kp-quote-date="2026-10-03T17:45:00+02:00"><blockquote>Muziek opgezet tijdens het koken.</blockquote></figure>
</div>
`,
            },
            {
                title: 'Hide with a save, and the card’s other states',
                why: 'Hide waits out the Undo window, then fires `kp-quote-hide` with `{ text, wait }`: hand `wait` the page’s save and a refusal puts the card back with the reason in the toast. `kp-quote-fold` fires with `{ expanded }` when a long entry opens or folds, and `kp-quote-retry` when Retry is pressed on a failed card. `setQuoteState(el, state)` draws `loading`, `empty` or `error` in the same footprint as the quote.',
                markup: `
<div class="kp-stack">
<figure class="kp-quote" id="doc-quote-hide" data-kp-quote data-kp-undo-ms="2500" data-kp-quote-lang="nl" data-kp-quote-why="What helped last time" data-kp-quote-date="2026-10-14T19:40:00+02:00">
<blockquote>Wandelen na het eten hielp, mijn hoofd werd rustiger.</blockquote>
</figure>
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="States">
<button type="button" class="kp-button" data-doc-quote-state="loading">Loading</button>
<button type="button" class="kp-button" data-doc-quote-state="empty">Empty</button>
<button type="button" class="kp-button" data-doc-quote-state="error">Could not read</button>
<button type="button" class="kp-button" data-doc-quote-state="ready">Ready</button>
</div>
<pre class="kp-code-block" id="doc-quote-log" aria-live="polite">Press Hide.</pre>
</div>
`,
                script: `
import { QUOTE_FOLD_EVENT, QUOTE_HIDE_EVENT, QUOTE_RETRY_EVENT, setQuoteState } from '@kp-soft/themes/js/quote';

const card = document.getElementById('doc-quote-hide');
const log = document.getElementById('doc-quote-log');
const say = (text) => (log.textContent = text);
card.addEventListener(QUOTE_HIDE_EVENT, (event) => {
    say('kp-quote-hide: saving');
    event.detail.wait(new Promise((resolve) => setTimeout(resolve, 600)).then(() => say('kp-quote-hide: saved')));
});
card.addEventListener(QUOTE_FOLD_EVENT, (event) => say('kp-quote-fold: ' + event.detail.expanded));
card.addEventListener(QUOTE_RETRY_EVENT, () => {
    say('kp-quote-retry');
    setQuoteState(card, 'loading');
    setTimeout(() => setQuoteState(card, 'ready'), 1000);
});
for (const button of document.querySelectorAll('[data-doc-quote-state]')) {
    button.addEventListener('click', () => setQuoteState(card, button.getAttribute('data-doc-quote-state')));
}
`,
            },
        ],
        variants: [
            { name: 'data-kp-quote-by', what: 'Who wrote it (“You”).' },
            { name: 'data-kp-quote-date and data-kp-quote-date-style', what: 'An ISO moment; `both` (“Wednesday 14/10/2026 (3 days ago)”, the default), `date` or `relative` (“3 days ago”). The time element’s title is the exact `dd/mm/yyyy HH:mm`.' },
            { name: 'data-kp-quote-now', what: 'An ISO moment that “now” is for the relative words, for a page with its own clock.' },
            { name: 'data-kp-quote-lines', what: 'How many lines before it folds (4), or `all`.' },
            { name: 'data-kp-quote-why', what: 'A small line saying why the words are here.' },
            { name: 'data-kp-quote-source', what: 'A link, “Open that day”, and the blockquote’s `cite`.' },
            { name: 'data-kp-quote-hide', what: '`off` leaves out “Do not show this again” (present by default; the Undo window is `data-kp-undo-ms`, 6000).' },
            { name: 'data-kp-quote-copy', what: 'Present shows Copy (off by default).' },
            { name: 'data-kp-quote-size', what: '`lg` for a hero place.' },
            { name: 'data-kp-quote-lang', what: 'The language of the words.' },
            { name: 'data-kp-quote-max', what: 'On `data-kp-quote-list`: how many quotes before “Show all 7” (1 to 5, 3).' },
            { name: 'data-kp-quote-text', what: 'The words, instead of a blockquote.' },
            { name: '.kp-quote__why / __text / __more', what: 'The small line saying why the words are here, the blockquote, and Show all (Show less once open), which exists only when the text is longer than `data-kp-quote-lines`.' },
            { name: '.kp-quote__caption / __by / __sep / __when / __source', what: 'The `figcaption`: who, a separator, the `time` element (its `datetime` is the ISO moment, its title the exact `dd/mm/yyyy HH:mm`), and the link “Open that day”.' },
            { name: '.kp-quote__actions / __hide / __copy', what: 'The row of Hide (“Do not show this again”, with Undo) and Copy; a card with both off has no row.' },
            { name: '.kp-quote__live', what: 'The visually hidden polite region that says a hide, a copy and a fold.' },
            { name: '.kp-quote--lg and the list’s __more', what: 'The hero size, written from `data-kp-quote-size`; and `.kp-quote-list__more`, the “Show all N” button of a list.' },
            { name: 'quote(el) and setQuote(el, spec)', what: 'The handle (`text()`, `set`, `setState`, `hide()`) and the way to write a quote’s words and options from a script instead of markup; `quoteWhen(ms, style, now)` is the “Wednesday 14/10/2026 (3 days ago)” sentence on its own.' },
            { name: 'data-kp-folded', what: 'Written on a folded blockquote.' },
            { name: 'data-kp-quote-list-attached and data-kp-quote-list-hidden', what: 'Written on a list and on the quotes a list folds away.' },
            { name: 'data-kp-quote-gone', what: 'Marks a quote a page took out of a list.' },
        ],
        accessibility: [
            'Built in — `figure`, `blockquote` (with `lang` and `cite`) and `figcaption` with a `time`; the key `h` hides the quote that has the focus and Mod C copies it when copy is on, both on the `?` sheet.',
            'Built in — a hide is said politely and offers Undo; the failed and empty states are the card’s, with a normal-size Retry.',
            'Yours — write `data-kp-quote-lang` whenever the words are in another language than the page, and answer `kp-quote-hide` by storing the hide.',
        ],
    };
