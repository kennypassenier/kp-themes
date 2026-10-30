// Page descriptor for the "page-header" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const pageHeaderDescriptor = {
        id: 'page-header',
        title: 'Page header',
        group: 'Structure',
        classes: ['kp-page-header'],
        exports: [],
        intro: 'A page’s title and its one-sentence description on the left; what acts on the whole page on the right: secondary buttons, one primary, and an overflow button that says “More ▾” for the rare things. On a narrow page it reads top to bottom, the primary first at the full width.',
        whenToUse:
            'At the top of a page that does something: a list with its actions, a record with its own. Not inside a card or a dialog, which have headers of their own, and not for more than one primary action.',
        examples: [
            {
                title: 'Title, description, three buttons and More',
                why: 'The overflow is the package’s popover and menu, hanging under its button towards the start so it stays on the page.',
                markup: `
<header class="kp-page-header">
<div class="kp-page-header__inner">
<div>
<h1 class="kp-page-header__title">Pump houses</h1>
<p class="kp-page-header__description">Fifteen pump houses on the northern network: their state, the last reading of each, and what needs a visit.</p>
</div>
<div class="kp-page-header__actions">
<button type="button" class="kp-button">Export readings</button>
<button type="button" class="kp-button kp-button--primary">Add a pump house</button>
<button type="button" class="kp-button" popovertarget="doc-page-more" aria-haspopup="menu" style="anchor-name: --doc-page-more">More ▾</button>
<div popover="auto" id="doc-page-more" class="kp-popover" style="position-anchor: --doc-page-more">
<ul class="kp-menu" role="menu">
<li role="none"><button type="button" role="menuitem" class="kp-menu__item">Import from a file…</button></li>
<li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Archive the network…</button></li>
</ul>
</div>
</div>
</div>
</header>
`,
            },
            {
                title: 'A mark before the title, a badge and the freshness line beside it',
                why: 'Wrap the title in `.kp-page-header__heading` and the header gets a heading line: `.kp-page-header__lead` holds a mark (an identity mark here), and `.kp-page-header__line` holds the title, a badge and the freshness line (`.kp-ago.kp-page-header__meta`). When the room runs out the line wraps under the title’s own words, never under the lead, and the freshness line keeps its width as it ticks, so nothing beside it moves.',
                markup: `
<header class="kp-page-header">
<div class="kp-page-header__inner">
<div>
<div class="kp-page-header__heading">
<span class="kp-page-header__lead"><span class="kp-idmark kp-idmark--lg" data-kp-idmark="Brightline Health" aria-hidden="true"></span></span>
<div class="kp-page-header__line">
<h1 class="kp-page-header__title">Brightline Health</h1>
<span class="kp-badge kp-badge--info">Interview</span>
<time class="kp-ago kp-page-header__meta" datetime="2026-10-18T12:00:00Z" data-kp-ago data-kp-ago-verb="updated">updated 4 s ago</time>
</div>
</div>
<p class="kp-page-header__description">Data engineer, Antwerp. Second interview on 21/10/2026 at 14:00.</p>
</div>
<div class="kp-page-header__actions">
<button type="button" class="kp-button">Export</button>
<button type="button" class="kp-button kp-button--primary">Log a contact</button>
</div>
</div>
</header>
`,
            },
        ],
        variants: [
            { name: '.kp-page-header__heading, __lead, __line, __meta', what: 'The opt-in heading line: a flex row of the lead (a mark, never wrapped under) and the line that holds the title, a badge and the muted `.kp-ago.kp-page-header__meta` freshness line, which does not wrap inside itself.' },
            { name: '.kp-page-header', what: 'The header; it measures its own width.' },
            { name: '.kp-page-header__inner', what: 'Two columns: the text block, and the actions against the far edge, level with the title.' },
            { name: '.kp-page-header__title, __description', what: 'The page’s heading, and one sentence under it at a readable measure in the muted ink.' },
            { name: '.kp-page-header__actions', what: 'The buttons, the primary among them, the overflow last; a popover in it hangs under its button towards the start.' },
            { name: 'on a phone', what: 'Under 40rem the title takes the width and the buttons fold under the description: the buttons form one row of equal columns, the primary first, wrapping as equal columns when they cannot fit.' },
        ],
        accessibility: [
            'Built in — the order on a phone is visual only; in the markup and the tab order the buttons keep yours.',
            'Built in — the overflow is a popover menu, so Escape and light dismiss are the browser’s.',
            'Yours — one `h1` per page, and the overflow button says what it is (“More ▾”) rather than a bare icon.',
        ],
    };
