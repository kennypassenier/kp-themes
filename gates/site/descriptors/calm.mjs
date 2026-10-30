// Page descriptor for the "calm" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const calmDescriptor = {
        id: 'calm',
        title: 'Calm mode',
        group: 'Theming',
        classes: [],
        exports: [],
        aliases: ['calm'],
        intro: 'One page-level switch that turns movement and effects off. A flag on the root element answers every transition, entrance, glow, flicker and glitch; loading stays soft and breathes. A system that asks for less motion wins: the switch shows on, disabled, with the reason.',
        whenToUse: 'Any application that wants to give the reader a quiet page. It does not replace reduced motion; it extends it to a choice made in the page.',
        examples: [
            {
                title: 'A calm switch',
                why: 'The attribute marks the switch; the choice is kept per device and applied before the first frame.',
                markup: `
<label class="kp-switch">
<input class="kp-switch__input" type="checkbox" role="switch" data-kp-calm-switch>
<span>Calm mode</span>
</label>
`,
            },
            {
                title: 'Calm for part of the page, and set from a script',
                why: '`data-kp-calm` on `<html>` makes the whole page calm; `data-kp-calm-scope` is `motion` (transitions only), `effects` (the default: also entrances, glow, flicker and glitch) or `all` (loading holds still too); `data-kp-calm-loading` is `slow` (a loading part breathes as one slow pulse, its length is `--kp-calm-pulse`, 2400 ms) or `still`; `data-kp-calm-remember="false"` stops the choice being kept. `setCalm(on)` and `isCalm()` read and write the flag, `calmScope()` gives its scope, `motionAllowed(el)` is the question every script asks instead of the media query, `systemReduced()` says whether the system asks for less motion (and then wins), and `kp-calm-change` fires with the new state. `applyStoredCalm()` puts the remembered choice back before the first frame.',
                markup: `
<div class="kp-stack">
<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" data-kp-calm-switch><span>Calm mode</span></label>
<div class="kp-row">
<button class="kp-button" type="button" data-doc-calm="motion">Calm: motion only</button>
<button class="kp-button" type="button" data-doc-calm="all">Calm: everything, loading still</button>
<button class="kp-button" type="button" data-doc-calm="off">Back to normal</button>
</div>
<div class="kp-progressbar" role="progressbar" aria-label="Waiting for the export" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<p class="kp-text-muted" id="doc-calm-log" aria-live="polite"></p>
</div>
`,
                script: `
import { calmScope, isCalm, motionAllowed, setCalm, systemReduced } from '@kp-soft/themes/js/calm';

const log = document.getElementById('doc-calm-log');
const say = () => {
    log.textContent = 'Calm: ' + (isCalm() ? 'on, scope ' + calmScope() : 'off') +
        '. Motion allowed: ' + motionAllowed(log) + '. The system asks for less motion: ' + systemReduced() + '.';
};
say();
for (const button of document.querySelectorAll('[data-doc-calm]')) {
    button.addEventListener('click', () => {
        const choice = button.dataset.docCalm;
        if (choice === 'off') setCalm(false, { remember: false });
        else setCalm(true, { scope: choice, loading: choice === 'all' ? 'still' : 'slow', remember: false });
    });
}
document.addEventListener('kp-calm-change', say);
`,
            },
        ],
        variants: [
            { name: 'data-kp-calm', what: 'On the root element: the page is calm.' },
            { name: 'data-kp-calm-scope', what: '`motion` (transitions only), `effects` (default: also entrances, glow, flicker and glitch) or `all` (and loading holds still).' },
            { name: 'data-kp-calm-loading', what: '`slow` (default: a loading part breathes as one slow pulse) or `still`.' },
            { name: 'data-kp-calm-remember', what: '`false` keeps the choice from being remembered; by default it is kept per device.' },
        ],
        accessibility: [
            'Built in — every change is announced once, politely; a system preference for reduced motion wins and is said.',
            'Yours — ask `motionAllowed(el)` instead of the media query in your own scripts, so calm mode reaches them too.',
        ],
    };
