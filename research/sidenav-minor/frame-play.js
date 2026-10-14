// research/sidenav-minor: makes a frame play by itself. It opens and closes the
// page's side navigation on a loop, through the same handle a page would use
// (sidenavOf), and between rounds switches the way the panel meets the page
// (pushes it, keeps a gutter, lies over it), so each option is seen in the
// three modes without a click. The scene's name is shown in the frame.
//
// It plays one round each time the page asks (rounds.js): nothing moves
// until the section's "Play once" is pressed, by the reader or by the review
// dialog's "Play open and close".
//
// Attributes on <body>:
//   data-play-scenes   "push,gutter,over" (default), the modes to cycle
//   data-play-extra    optional steps run while the panel is open, see STEPS
import { sidenavOf } from '../../js/sidenav.js';
import { nextRound } from './rounds.js';

const OPEN_HOLD = 2300;
const SHUT_HOLD = 1500;
const SETTLE = 900;

const LABELS = { push: 'The panel pushes the page', gutter: 'The page keeps a gutter for the panel', over: 'The panel lies over the page' };

/** @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nav = document.querySelector('.kp-sidenav');
const label = document.querySelector('.mn-scene');
if (window.parent !== window) document.documentElement.setAttribute('data-mn-framed', '');
const wanted = (document.body.dataset.playScenes ?? 'push,gutter,over').split(',').map((s) => s.trim());
const extras = (document.body.dataset.playExtra ?? '').split(',').filter(Boolean);
// A window can ask for a variation through its address: ?density=compact, ?narrow=13rem.
const asked = new URLSearchParams(location.search);
if (nav instanceof HTMLElement) {
    const density = asked.get('density');
    if (density && density !== 'default') nav.setAttribute('data-kp-sidenav-density', density);
    const narrow = asked.get('narrow');
    if (narrow && narrow !== 'none') nav.style.setProperty('--kp-sidenav-width-narrow', narrow);
}
// ?plain takes every option away again, to compare a frame with itself without them.
if (nav instanceof HTMLElement && asked.has('plain')) {
    nav.removeAttribute('data-kp-sidenav-variant');
    nav.removeAttribute('data-kp-sidenav-density');
    nav.style.removeProperty('--kp-sidenav-peek');
    nav.style.removeProperty('--kp-sidenav-width-narrow');
}
/** @param {string} scene */
function arrange(scene) {
    if (!(nav instanceof HTMLElement)) return;
    const handle = sidenavOf(nav);
    if (!handle) return;
    const gutter = scene === 'gutter';
    nav.toggleAttribute('data-kp-sidenav-reserve', gutter);
    handle.setMode(scene === 'over' ? 'over' : 'push');
    const words = LABELS[/** @type {keyof typeof LABELS} */ (scene)] ?? scene;
    if (label) label.textContent = words;
    // Inside the demo page the scene is named under the window (look.js); on its own, in the frame.
    if (window.parent !== window) window.parent.postMessage({ type: 'mn-scene', words }, '*');
}

const STEPS = {
    // The keyboard reaches the action beside a link, which draws its own ring; pressing it does not follow the link.
    async action() {
        const button = nav?.querySelector('.kp-sidenav__action');
        const said = document.querySelector('.mn-said');
        if (!(button instanceof HTMLElement)) return;
        await wait(500);
        // preventScroll: a focus inside a window must not scroll the page that holds it.
        button.focus({ preventScroll: true, focusVisible: true });
        await wait(900);
        button.click();
        if (said) said.textContent = 'The action was pressed; the link beside it did not open.';
        await wait(700);
        button.blur();
        if (said) said.textContent = '';
    },
};

async function loop() {
    while (!(nav instanceof HTMLElement) || !sidenavOf(nav)) await wait(100);
    await wait(SETTLE);
    for (let round = 0; ; round += 1) {
        // On a phone (`data-kp-sidenav-over-below`) the panel lies over the page whatever the scene says.
        const scenes = nav.hasAttribute('data-kp-sidenav-narrow') ? ['over'] : wanted;
        const scene = scenes[round % scenes.length];
        await nextRound();
        const handle = sidenavOf(/** @type {HTMLElement} */ (nav));
        if (!handle) return;
        if (handle.isOpen()) {
            handle.close({ remember: false });
            await wait(SHUT_HOLD);
        }
        arrange(scene);
        await wait(SETTLE);
        handle.open({ remember: false });
        const started = Date.now();
        for (const name of extras) await STEPS[/** @type {keyof typeof STEPS} */ (name)]?.();
        await wait(Math.max(0, OPEN_HOLD - (Date.now() - started)));
        handle.close({ remember: false });
        await wait(SHUT_HOLD);
    }
}

// ?still keeps a frame from playing, for a screenshot.
if (!asked.has('still')) void loop();
