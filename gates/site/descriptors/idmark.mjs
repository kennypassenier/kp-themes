// Page descriptor for the "idmark" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const idmarkDescriptor = {
        id: 'idmark',
        title: 'Identity mark',
        group: 'Data',
        classes: ['kp-idmark', 'kp-idmark-group', 'kp-idmark-name'],
        exports: [],
        aliases: ['photo'],
        intro: 'A small plate made from a name, so a company or a stack is found in a list before its name is read: two letters on a wash of one of the theme’s five chart colours, or (`--pattern`) a mirrored 5 by 5 pattern. The same name gives the same mark on every page. js/idmark.js (`idmarkFor`, `idmarkColours`, `setIdmark`, `attachIdmarks`) fills every `[data-kp-idmark]`.',
        whenToUse: 'Beside the name of a company, a stack or a person in a list, a header or a cell. It is decoration: the name always stands beside it.',
        examples: [
            {
                title: 'Letters, a pattern and a group',
                why: 'Marks inside one `data-kp-idmark-set` never share a colour while one of the five is free.',
                markup: `
<div data-kp-idmark-set>
<span class="kp-idmark-name"><span class="kp-idmark" data-kp-idmark="Acme Logistics" aria-hidden="true"></span><span>Acme Logistics</span></span>
<span class="kp-idmark-name"><span class="kp-idmark kp-idmark--sm kp-idmark--pattern" data-kp-idmark="media" aria-hidden="true"></span><span>media</span></span>
<span class="kp-idmark-group" role="img" aria-label="Acme, Contoso and 7 more"><span class="kp-idmark kp-idmark--round" data-kp-idmark="Acme" aria-hidden="true"></span><span class="kp-idmark kp-idmark--round" data-kp-idmark="Contoso" aria-hidden="true"></span><span class="kp-idmark-group__more" aria-hidden="true">+7</span></span>
</div>
`,
            },
            {
                title: 'An avatar: a photo, a photo that fails, a status, a frame',
                why: '`data-kp-idmark-src` puts a photo on the mark: the plate keeps its size and its letters underneath while the photo loads, the photo fades in, and a photo that fails leaves the letters with no error mark, because the person is still identified. `kp-idmark-photo` fires with `{ state, src }` (`data-kp-photo` is `loading`, `loaded` or `failed`). `data-kp-idmark-status` is `online`, `away` or `busy`: a dot whose shape differs too (full, ring, barred) and whose word joins the mark’s label, so the mark becomes an image called “Ada Lovelace, online”. `data-kp-idmark-alt="name"` makes a mark an image called by the name; `data-kp-idmark-loading="eager"` loads at once instead of lazily. `data-kp-idmark-frame` sets the photo’s frame: `edge` (the default), `ring` or `inset`.',
                markup: `
<ul class="kp-stack" aria-label="People">
<li class="kp-idmark-name"><span class="kp-idmark kp-idmark--round kp-idmark--lg" data-kp-idmark="Ada Lovelace" data-doc-photo data-kp-idmark-status="online" data-kp-idmark-loading="eager"></span><span>Ada Lovelace</span></li>
<li class="kp-idmark-name"><span class="kp-idmark kp-idmark--round kp-idmark--lg" data-kp-idmark="Grace Hopper" data-kp-idmark-src="missing-photo.jpg" data-kp-idmark-status="away"></span><span>Grace Hopper: the photo is gone, the letters stay</span></li>
<li class="kp-idmark-name"><span class="kp-idmark kp-idmark--round kp-idmark--lg" data-kp-idmark="Alan Turing" data-kp-idmark-status="busy" data-kp-idmark-alt="name"></span><span>Alan Turing</span></li>
<li class="kp-idmark-name"><span class="kp-idmark kp-idmark--round kp-idmark--lg" data-kp-idmark="Edsger Dijkstra" data-doc-photo data-kp-idmark-frame="ring"></span><span>Edsger Dijkstra, ring frame</span></li>
<li class="kp-idmark-name"><span class="kp-idmark kp-idmark--round kp-idmark--lg" data-kp-idmark="Barbara Liskov" data-doc-photo data-kp-idmark-frame="inset"></span><span>Barbara Liskov, inset frame</span></li>
</ul>
<pre class="kp-code-block" id="doc-idmark-log" aria-live="polite">Waiting for the photos.</pre>
`,
                script: `
import { attachIdmarks } from '@kp-soft/themes/js/idmark';

// A small drawn portrait stands in for a photo, so the example needs no network.
const portrait = (hue) =>
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="hsl(' + hue + ' 45% 72%)"/><circle cx="32" cy="25" r="11" fill="hsl(' + hue + ' 35% 38%)"/><path d="M10 64a22 22 0 0 1 44 0z" fill="hsl(' + hue + ' 35% 38%)"/></svg>',
    );
const log = document.getElementById('doc-idmark-log');
document.addEventListener('kp-idmark-photo', (event) => {
    log.textContent = 'kp-idmark-photo { state: ' + event.detail.state + ', src: ' + event.detail.src.slice(0, 24) + '… }';
});
[...document.querySelectorAll('[data-doc-photo]')].forEach((mark, n) => mark.setAttribute('data-kp-idmark-src', portrait(200 + n * 70)));
attachIdmarks(document.querySelector('[data-doc-photo]').closest('ul'));
`,
            },
            {
                title: 'A group of avatars with an exact +N that opens the names',
                why: '`setIdmarkGroup(el, people, { max, size, round, list })` draws the first `max` people and an exact “+N” (never “9+”). By default the “+N” is a button that opens the list of the names left out, each with its mark; `list: false` leaves it a plain count whose title lists the names. A group of small marks takes `.kp-idmark-group--sm` for its “+N”. Put a name that must wrap, in a heading or a list, in `.kp-idmark-name--wrap`.',
                markup: `
<div class="kp-stack">
<div id="doc-idmark-group"></div>
<div id="doc-idmark-group-count"></div>
<p class="kp-idmark-name kp-idmark-name--wrap"><span class="kp-idmark kp-idmark--round" data-kp-idmark="Ada Lovelace" aria-hidden="true"></span><span>A long name that wraps instead of being cut: Augusta Ada King, Countess of Lovelace</span></p>
</div>
`,
                script: `
import { attachIdmarks, setIdmarkGroup } from '@kp-soft/themes/js/idmark';

const people = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Edsger Dijkstra', 'Barbara Liskov', 'Donald Knuth', 'Margaret Hamilton'].map((name, n) => ({
    name,
    status: n === 0 ? 'online' : n === 2 ? 'busy' : 'none',
}));
setIdmarkGroup(document.getElementById('doc-idmark-group'), people, { max: 4 });
setIdmarkGroup(document.getElementById('doc-idmark-group-count'), people, { max: 3, size: 'sm', list: false });
attachIdmarks(document.getElementById('doc-idmark-group').parentElement);
`,
            },
        ],
        variants: [
            { name: '.kp-idmark--xs / --sm / --lg / --xl', what: 'Sizes 20, 24, 44 and 56 px around the 32 px default; extra small shows one letter.' },
            { name: '.kp-idmark--pattern / --round / --glyph', what: 'The pattern instead of letters; a round plate; a small corner shape picked by the name.' },
            { name: 'data-kp-idmark-hue="free"', what: 'A hue of its own from the name, on the lightness and strength of the first chart colour.' },
            { name: 'aria-current / data-kp-idmark-selected', what: 'The current one in a list: a ring kept off its neighbours by a halo.' },
            { name: '.kp-idmark.kp-skeleton.kp-skeleton--block', what: 'Loading: the plate’s own shape, drawn as the theme draws a waiting block.' },
            { name: 'data-kp-idmark-src and kp-idmark-photo', what: 'The photo; the letters stay under it until it has loaded and after it has failed. The event carries `{ state, src }`; `data-kp-photo` (`loading`, `loaded`, `failed`) is written on the mark.' },
            { name: 'data-kp-idmark-loading', what: '`lazy` (the default) or `eager`, as the image’s own `loading`.' },
            { name: 'data-kp-idmark-alt', what: '`decorative` (the default: hidden from a screen reader, the name stands beside it) or `name` (the mark is an image called by the name).' },
            { name: 'data-kp-idmark-status', what: '`online`, `away` or `busy` (`none` is the default): a dot at the foot corner, full, ring or barred, whose word is added to the label (“Ada Lovelace, online”). A status makes the mark an image.' },
            { name: 'data-kp-idmark-frame', what: 'The photo’s frame: `edge` (the default: the plate’s own edge in the name’s colour), `ring` (a ring held off the photo) or `inset` (the photo set into the plate like a picture in a mount).' },
            { name: 'setIdmarkGroup and IDMARK_STATUSES', what: '`setIdmarkGroup(el, people, { max, size, round, list })` with people `{ name, src, status }`; `.kp-idmark-group__more` is the “+N” (a button when `list` is on) and `.kp-idmark-group__list` the panel of the names left out, closed by Escape or a press elsewhere; `IDMARK_STATUSES` is `online`, `away`, `busy`.' },
            { name: '.kp-idmark-group--sm and .kp-idmark-name--wrap', what: 'The small group’s “+N” kept in step with its marks, and a name that wraps (for a heading or a list, not a table cell) instead of being cut.' },
            { name: 'idmarkLetters and idmarkUnknown', what: '`idmarkLetters(name, count)` is the initials of the first two words, else the first two letters, upper case. A mark with an empty name is a dashed plate with a “?”, and `idmarkUnknown` is the word a screen reader gets for it.' },
            { name: 'idmarkOnline … idmarkMoreTitle', what: 'The words of the avatar are in the dictionary: `idmarkOnline`, `idmarkAway`, `idmarkBusy`, `idmarkLabel` (“Ada, online”), `idmarkGroup` (“Acme, Contoso and 7 more”), `idmarkMore` and `idmarkMoreTitle`.' },
        ],
        accessibility: ['Built in — the mark is hidden from a screen reader.', 'Yours — always put the name beside it, and name a group in words.'],
    };
