// Colour picker, framework-free [TH57].
//
// Three sliders and a swatch, which is not interesting. What is
// interesting is the number beside it: the WCAG contrast ratio of the
// chosen colour against the current theme's own background, measured with
// the same function the contrast gate uses.
//
// That is the one thing a colour picker in a theme system can do that a
// general-purpose one cannot. A picker that shows you a colour and not
// whether anyone can read it is how the unreadable colours got into the
// themes this project spent a milestone repairing.
//
//   <div class="kp-colorpicker" data-kp-colorpicker data-kp-against="--background">
//     <input type="range" data-kp-channel="h" min="0" max="360" value="220" />
//     <input type="range" data-kp-channel="s" min="0" max="100" value="90" />
//     <input type="range" data-kp-channel="l" min="0" max="100" value="56" />
//     <span class="kp-colorpicker__swatch" data-kp-swatch></span>
//     <output data-kp-colorpicker-value></output>
//     <p data-kp-colorpicker-contrast role="status" aria-live="polite"></p>
//   </div>
//
// Sliders rather than a canvas gradient on purpose: a canvas needs a
// pointer, and three labelled ranges are operable from the keyboard, read
// aloud correctly, and give the exact numbers back.

import { contrast, formatHsl, hslToRgb, meets, tokenColour } from './contrast.js';
import { getStrings } from './strings.js';

const PICKER = '[data-kp-colorpicker]';

/** Fired when the colour changes. A contract value [TH26]. */
export const COLOR_EVENT = 'kp-color-change';

/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachColorPickers(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(PICKER)) {
        const picker = /** @type {HTMLElement} */ (element);
        if (picker.dataset.kpColorpickerAttached !== undefined) continue;
        picker.dataset.kpColorpickerAttached = '';

        const swatch = /** @type {HTMLElement | null} */ (picker.querySelector('[data-kp-swatch]'));
        const value = /** @type {HTMLElement | null} */ (picker.querySelector('[data-kp-colorpicker-value]'));
        const report = /** @type {HTMLElement | null} */ (picker.querySelector('[data-kp-colorpicker-contrast]'));
        // Read on every update rather than captured at attach: a consumer
        // may point the measurement at another token — the card instead of
        // the page — without detaching and reattaching the picker.
        const target = () => picker.dataset.kpAgainst ?? '--background';
        const level = () => /** @type {'text' | 'large' | 'non-text'} */ (picker.dataset.kpAgainstKind ?? 'text');

        /** @param {string} channel */
        const slider = (channel) => /** @type {HTMLInputElement | null} */ (picker.querySelector(`[data-kp-channel="${channel}"]`));

        const update = () => {
            const colour = {
                h: Number(slider('h')?.value ?? 0),
                s: Number(slider('s')?.value ?? 0),
                l: Number(slider('l')?.value ?? 0),
            };
            const text = formatHsl(colour);
            picker.style.setProperty('--kp-color', text);
            if (swatch !== null) swatch.style.background = text;
            if (value !== null) value.textContent = text;

            const against = target();
            const kind = level();
            const ground = tokenColour(against);
            if (report !== null) {
                if (ground === null) {
                    // Said rather than left blank: a picker that silently
                    // stops measuring looks exactly like one that says the
                    // colour is fine.
                    report.textContent = getStrings().contrastMissing(against);
                    delete picker.dataset.kpContrastOk;
                } else {
                    const ratio = contrast(hslToRgb(colour), ground);
                    const ok = meets(ratio, kind);
                    // The number AND the verdict: a bare 4.31 means nothing
                    // to anyone who does not know the thresholds by heart.
                    const s = getStrings();
                    report.textContent = s.contrastReport(ratio.toFixed(2), against, ok ? s.contrastPasses : s.contrastFails);
                    if (ok) picker.dataset.kpContrastOk = '';
                    else delete picker.dataset.kpContrastOk;
                }
            }
            picker.dispatchEvent(new CustomEvent(COLOR_EVENT, { bubbles: true, detail: { value: text, ...colour } }));
        };

        const onInput = () => update();
        for (const channel of ['h', 's', 'l']) slider(channel)?.addEventListener('input', onInput);
        // Remeasured when the document changes theme: the same colour is
        // readable on formal and invisible on terminal, which is the whole
        // reason this number is here.
        const onTheme = () => update();
        document.addEventListener('kp-theme-change', onTheme);
        update();

        cleanups.push(() => {
            for (const channel of ['h', 's', 'l']) slider(channel)?.removeEventListener('input', onInput);
            document.removeEventListener('kp-theme-change', onTheme);
            delete picker.dataset.kpColorpickerAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachColorPickers());
    else attachColorPickers();
}
