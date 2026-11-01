// The side navigation's ten minor options as examples, each in a window of its own, each printing the string it renders [scope-143].
import { FRAME, OVER, PUSH, launcher, page, panel, row, tab } from './sidenav-minor-parts.mjs';

/** @type {import('./descriptors.mjs').Example[]} */
export const SIDENAV_MINOR_EXAMPLES = [
    {
        title: 'A narrower panel on a narrow screen',
        why: 'Added 2026-10-14 (research/sidenav-minor). `--kp-sidenav-width-narrow` is the width the panel has while data-kp-sidenav-narrow is on it, that is below the data-kp-sidenav-over-below step, when it lies over the page; unset it keeps `--kp-sidenav-width`. Here the panel is 20rem on a desk and 13rem in this phone-wide window, so the page behind it stays in view. Press the bars to open it.',
        frame: { height: '32rem', width: '22rem' },
        markup: `
${launcher('narrow-nav')}
${panel({ id: 'narrow-nav', main: 'narrow-main', attrs: `${PUSH('narrow-main')} style="--kp-sidenav-width: 20rem; --kp-sidenav-width-narrow: 13rem"`, rest: false })}
${page('narrow-main', 'On a phone the panel lies over the page, and it can be narrower than on a desk.')}
`,
    },
    {
        title: 'A floating panel',
        why: 'Added 2026-10-14 (research/sidenav-minor). `data-kp-sidenav-variant="floating"` detaches the panel from the edge: a gap all round, the theme’s radius, edge and shadow, and the page leaves room for the gap too. It works in push, over and a reserved gutter alike, and shut it leaves nothing on the screen, not even its shadow. Press the bars to shut it and open it again.',
        frame: FRAME,
        react: `
<Sidenav id="nav" label="North site sections" mode="push" contentSelector="#main" variant="floating" items={items} />
`,
        markup: `
${launcher('floating-nav')}
${panel({ id: 'floating-nav', main: 'floating-main', attrs: `${PUSH('floating-main')} data-kp-sidenav-variant="floating" data-kp-sidenav-open="true"` })}
${page('floating-main', 'The panel floats a little away from the edge of the window, as a card of its own.')}
`,
    },
    {
        title: 'An inset panel: the page is the card',
        why: 'Added 2026-10-14 (research/sidenav-minor). `data-kp-sidenav-variant="inset"` keeps the panel flush with the window and turns the content into a rounded card beside it (the module marks it data-kp-sidenav-inset). Nothing dims and nothing next to the panel covers the page. Press the bars to shut it and open it again.',
        frame: FRAME,
        react: `
<Sidenav id="nav" label="North site sections" mode="push" contentSelector="#main" variant="inset" items={items} />
`,
        markup: `
${launcher('inset-nav')}
${panel({ id: 'inset-nav', main: 'inset-main', attrs: `${PUSH('inset-main')} data-kp-sidenav-variant="inset" data-kp-sidenav-open="true"` })}
${page('inset-main', 'The page is a rounded card beside a panel that sits flush with the window.')}
`,
    },
    {
        title: 'A peek strip that stays when the panel is shut',
        why: 'Added 2026-10-14 (research/sidenav-minor). `--kp-sidenav-peek` (0px, off) gives a shut push or over panel a thin `.kp-sidenav__peek` strip at its edge, in `--kp-sidenav-peek-surface`: the page keeps that strip’s room when pushing, and an over panel lies over the page by that width only. The strip is the module’s, never moves, and is not a control. Here it is 0.75rem. Press the bars to open the panel and shut it again.',
        frame: FRAME,
        markup: `
${launcher('peek-nav')}
${panel({ id: 'peek-nav', main: 'peek-main', attrs: `${PUSH('peek-main')} style="--kp-sidenav-peek: 0.75rem"` })}
${page('peek-main', 'When the panel is shut, a thin strip of it stays at the edge of the window.')}
`,
    },
    {
        title: 'Three densities',
        why: 'Added 2026-10-14 (research/sidenav-minor). `data-kp-sidenav-density="compact"` or `"comfortable"` sets only the panel’s own spacing and size tokens (`--kp-sidenav-link-padding-block`, `-link-size`, `-icon-size` and `-pad`): rows of 29, 37 and 45 px with nothing else changed. Unset it is the middle one. The text stays readable in all three; here the three panels stand beside the page, in the flow.',
        markup: `
<div class="kp-row kp-row--start kp-gap-md">
<div class="kp-stack">
<p class="kp-text-muted">compact</p>
${panel({ id: 'density-compact', main: 'density-main', attrs: 'data-kp-sidenav-density="compact"', rest: false })}
</div>
<div class="kp-stack">
<p class="kp-text-muted">default (nothing set)</p>
${panel({ id: 'density-default', main: 'density-main', rest: false })}
</div>
<div class="kp-stack">
<p class="kp-text-muted">comfortable</p>
${panel({ id: 'density-comfortable', main: 'density-main', attrs: 'data-kp-sidenav-density="comfortable"', rest: false })}
</div>
</div>
`,
        react: `
<Sidenav id="nav" label="North site sections" density="compact" items={items} />
`,
    },
    {
        title: 'A button beside an item',
        why: 'Added 2026-10-14 (research/sidenav-minor). A `.kp-sidenav__row` is the list item that holds a link and a `.kp-icon-button.kp-sidenav__action` as siblings: the keyboard reaches the button after its link, it draws its own focus ring, and pressing it does not open the link. It follows the row’s height and hides in the collapsed rail; `--kp-sidenav-action-size` and `--kp-sidenav-action-gap` size it. What the button does is the page’s: here it only says which row it belongs to.',
        frame: FRAME,
        markup: `
${launcher('action-nav')}
${panel({ id: 'action-nav', main: 'action-main', attrs: `${PUSH('action-main')} data-kp-sidenav-open="true"`, action: true })}
${page('action-main', 'Some rows carry a small button beside the link. Pressing it does not open the link.', '\n<p class="kp-text-muted" role="status" id="action-said">Nothing pressed yet.</p>')}
<script type="module">
document.querySelector('#action-nav').addEventListener('click', (event) => {
const button = event.target instanceof Element ? event.target.closest('.kp-sidenav__action') : null;
if (button) document.querySelector('#action-said').textContent = 'Pressed: ' + button.getAttribute('aria-label') + '. The link did not open.';
});
</script>
`,
    },
    {
        title: 'A page that can refuse to close the panel',
        why: 'Added 2026-10-14 (research/sidenav-minor). `data-kp-sidenav-cancelable` makes `kp-sidenav-toggle` and `kp-sidenav-slim` fire before the change, cancelable, with `detail.reason` (`toggler`, `escape`, `backdrop`, `shortcut` or `api`). A listener that calls `preventDefault()` leaves the state as it was, and `kp-sidenav-prevented` tells who refused. Type in the draft, then press the bars or Escape: the panel stays open until the draft is saved.',
        frame: { height: '36rem' },
        react: `
<Sidenav
    id="nav"
    label="North site sections"
    mode="push"
    contentSelector="#main"
    cancelable
    items={items}
    onSidenavToggle={(event) => {
        if (!event.detail.open && unsaved) event.preventDefault();
    }}
    onSidenavPrevented={(event) => say(event.detail.reason)}
/>
`,
        markup: `
${launcher('cancel-nav')}
${panel({ id: 'cancel-nav', main: 'cancel-main', attrs: `${PUSH('cancel-main')} data-kp-sidenav-cancelable data-kp-sidenav-open="true"`, rest: false })}
<main id="cancel-main">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Incident report</h1>
<p class="kp-page-header__description">The page can refuse the menu closing while a draft is unsaved, and every event says why it was asked.</p>
</header>
<section class="kp-card" aria-labelledby="cancel-h">
<div class="kp-card__header"><h2 class="kp-card__title" id="cancel-h">Draft report</h2></div>
<div class="kp-card__body kp-stack">
<div class="kp-field"><label class="kp-field__label" for="cancel-draft">What happened</label><input class="kp-field__input" id="cancel-draft" type="text" autocomplete="off"></div>
<div class="kp-row kp-gap-sm"><span class="kp-badge kp-badge--success" id="cancel-state">Saved</span><button type="button" class="kp-button kp-button--primary" id="cancel-save">Save draft</button></div>
<p class="kp-text-muted" role="status" id="cancel-said">The menu has sent nothing yet.</p>
</div>
</section>
</main>
<script type="module">
const nav = document.querySelector('#cancel-nav');
const field = document.querySelector('#cancel-draft');
const state = document.querySelector('#cancel-state');
const said = document.querySelector('#cancel-said');
const mark = () => {
const dirty = field.value !== '';
state.className = 'kp-badge kp-badge--' + (dirty ? 'warning' : 'success');
state.textContent = dirty ? 'Unsaved changes' : 'Saved';
};
field.addEventListener('input', mark);
document.querySelector('#cancel-save').addEventListener('click', () => { field.value = ''; mark(); });
nav.addEventListener('kp-sidenav-toggle', (event) => {
if (!event.detail.open && field.value !== '') event.preventDefault();
if (event.detail.reason === 'init' || event.detail.reason === 'mode' || event.detail.reason === 'breakpoint') return;
said.textContent = 'kp-sidenav-toggle: open ' + event.detail.open + ', reason ' + event.detail.reason + (event.defaultPrevented ? ', refused by the page.' : ', allowed.');
});
nav.addEventListener('kp-sidenav-prevented', (event) => {
said.textContent = 'kp-sidenav-prevented: the ' + event.detail.reason + ' could not close it (' + event.detail.source + ').';
});
</script>
`,
    },
    {
        title: 'A width the reader sets',
        why: 'Added 2026-10-14 (research/sidenav-minor). `data-kp-sidenav-resizable` puts a `.kp-sidenav__resizer` (role separator, `aria-valuenow`) on the edge that faces the content: drag it, or focus it and use the arrow keys (16 px a press, Shift five times that, Home and End the limits). `data-kp-sidenav-min-width` (12rem) and `-max-width` (32rem) bound it; it writes `--kp-sidenav-width`, and `data-kp-remember` keeps it across a reload. A double press gives the width back to the stylesheet. `--kp-sidenav-resizer-size` sizes the strip to grab.',
        frame: FRAME,
        react: `
<Sidenav id="nav" label="North site sections" mode="push" contentSelector="#main" resizable minWidth="12rem" maxWidth="26rem" remember="docs-width" items={items} />
`,
        markup: `
${launcher('resize-nav')}
${panel({ id: 'resize-nav', main: 'resize-main', attrs: `${PUSH('resize-main')} data-kp-sidenav-open="true" data-kp-sidenav-resizable data-kp-sidenav-min-width="12rem" data-kp-sidenav-max-width="26rem" data-kp-remember="docs-sidenav-width"` })}
${page('resize-main', 'Drag the edge of the panel that faces this page, or tab to it and use the arrow keys.', '\n<p class="kp-text-muted" role="status" id="resize-said"></p>')}
<script type="module">
const nav = document.querySelector('#resize-nav');
const said = document.querySelector('#resize-said');
const show = () => { const px = Math.round(nav.getBoundingClientRect().width); said.textContent = 'The panel is ' + px + ' px (' + (px / 16).toFixed(1) + ' rem) wide.'; };
new ResizeObserver(show).observe(nav);
</script>
`,
    },
    {
        title: 'A backdrop that pulls the panel back',
        why: 'Added 2026-10-14 (research/sidenav-minor). `data-kp-sidenav-backdrop="static"` on an over panel keeps the backdrop but a click on it does not close: the panel is pulled toward the edge it came from and let go, on the theme’s own time and curve (`--kp-sidenav-refuse-travel`, `-duration`, `-ease`; it carries data-kp-sidenav-refused meanwhile, with a ring that stands without motion), and `kp-sidenav-prevented` fires with `source: "static"`. Escape and the bars still close it. Press the bars to open the panel, then click the dimmed page.',
        frame: FRAME,
        react: `
<Sidenav id="nav" label="North site sections" mode="over" backdrop="static" onSidenavPrevented={(event) => say(event.detail.source)} items={items} />
`,
        markup: `
${launcher('static-nav')}
${panel({ id: 'static-nav', main: 'static-main', attrs: `${OVER} data-kp-sidenav-backdrop="static"`, rest: false })}
${page('static-main', 'A click on the dimmed page does not close the menu: it is pulled back and let go.', '\n<p class="kp-text-muted" role="status" id="static-said">Nothing refused yet.</p>')}
<script type="module">
document.querySelector('#static-nav').addEventListener('kp-sidenav-prevented', (event) => {
document.querySelector('#static-said').textContent = 'kp-sidenav-prevented: ' + event.detail.reason + ' refused by ' + event.detail.source + '.';
});
</script>
`,
    },
    {
        title: 'A backdrop that ignores the click',
        why: 'Added 2026-10-14 (research/sidenav-minor). `data-kp-sidenav-close-on-backdrop="false"` makes a click on the backdrop do nothing at all, silently, the sibling of `data-kp-sidenav-close-on-esc="false"` for Escape: no event, no movement. It only matters where a backdrop exists, an over panel that did not turn it off; for a cue that says the click was heard, `data-kp-sidenav-backdrop="static"` is the other option. Press the bars to open the panel, then click the dimmed page.',
        frame: FRAME,
        react: `
<Sidenav id="nav" label="North site sections" mode="over" closeOnBackdrop={false} items={items} />
`,
        markup: `
${launcher('quiet-nav')}
${panel({ id: 'quiet-nav', main: 'quiet-main', attrs: `${OVER} data-kp-sidenav-backdrop="true" data-kp-sidenav-close-on-backdrop="false"`, rest: false })}
${page('quiet-main', 'A click on the dimmed page does nothing; Escape and the bars still close the menu.', '\n<p class="kp-text-muted" role="status" id="quiet-said">The backdrop has not been clicked yet.</p>')}
<script type="module">
document.addEventListener('click', (event) => {
if (event.target instanceof Element && event.target.classList.contains('kp-sidenav__backdrop')) document.querySelector('#quiet-said').textContent = 'The backdrop was clicked. The menu stays open and nothing was sent.';
}, true);
</script>
`,
    },
    {
        title: 'The edge tab is the default opener',
        why: 'Added 2026-10-15 (`sidenav-opener-1`). An over or push panel opens from the edge tab unless the panel says otherwise: with no `data-kp-sidenav-opener` the page behaves as `tab`. The markup holds a launcher and a tab, and the module draws only the tab, takes the launcher out of the tab order and the accessibility tree, and gives the header back the room kept for the launcher. A page with no tab for the panel keeps its launcher. Press the tab on the panel\u2019s edge.',
        frame: FRAME,
        markup: `
${launcher('tab-nav')}
${tab('tab-nav')}
${panel({ id: 'tab-nav', main: 'tab-main', attrs: `${PUSH('tab-main')} data-kp-sidenav-open="true"`, rest: false })}
${page('tab-main', 'Both openers are in the markup; with no choice made, only the edge tab shows.')}
`,
    },
    {
        title: 'The launcher only',
        why: 'Added 2026-10-15 (`sidenav-opener-1`). `data-kp-sidenav-opener="launcher"` on an over or push panel draws the fixed launcher at the window\u2019s start corner and not the edge tab, which is out of the tab order and the accessibility tree meanwhile. Press the bars.',
        frame: FRAME,
        react: `
<Sidenav id="nav" label="North site sections" mode="push" contentSelector="#main" opener="launcher" items={items} />
`,
        markup: `
${launcher('launcher-nav')}
${tab('launcher-nav')}
${panel({ id: 'launcher-nav', main: 'launcher-main', attrs: `${PUSH('launcher-main')} data-kp-sidenav-opener="launcher" data-kp-sidenav-open="true"`, rest: false })}
${page('launcher-main', 'The launcher is the only opener; the edge tab is not drawn.')}
`,
    },
    {
        title: 'Both openers',
        why: 'Added 2026-10-15 (`sidenav-opener-1`). `data-kp-sidenav-opener="both"` keeps the launcher and the edge tab, each driving the same panel with the same focus, `aria-controls` and `inert`. The header keeps the launcher\u2019s room. Press either.',
        frame: FRAME,
        react: `
<Sidenav id="nav" label="North site sections" mode="push" contentSelector="#main" opener="both" items={items} />
`,
        markup: `
${launcher('both-nav')}
${tab('both-nav')}
${panel({ id: 'both-nav', main: 'both-main', attrs: `${PUSH('both-main')} data-kp-sidenav-opener="both" data-kp-sidenav-open="true"`, rest: false })}
${page('both-main', 'The launcher and the edge tab both show, and either opens and shuts the panel.')}
`,
    },
];
