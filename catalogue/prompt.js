// The prompt controls on every review page: a compact bar at the top and the
// whole prompt at the foot, both over the one prompt that gathers every note
// and verdict from every page (review-state.js). A reviewer judges page after
// page and copies once at the end (Kenny, 2026-09-13).
import { THEME_EVENT } from '../js/theme-core.js';
import { JUDGEMENT_EVENT } from './judgements.js';
import { buildPrompt, clearPrompt, markCopied, NOTES_EVENT, STORAGE_KEYS } from './review-state.js';

/**
 * @param {{ bar: HTMLElement, main: HTMLElement }} where
 *   bar: the page's header, the top bar goes right after it; main: the foot goes at its end
 */
export function mountPrompt({ bar, main }) {
    const top = document.createElement('div');
    top.className = 'cat-prompt-bar';
    top.setAttribute('data-cat-prompt-bar', '');
    top.innerHTML = `
        <div class="cat-prompt-bar__row">
            <span class="cat-prompt-bar__count" data-cat-prompt-count></span>
            <span class="cat-bar__spacer"></span>
            <button type="button" class="kp-button kp-button--ghost kp-button--sm" aria-expanded="false" aria-controls="cat-prompt-top" data-cat-prompt-show>Show prompt</button>
            <button type="button" class="kp-button kp-button--sm" data-cat-prompt-copy>Copy prompt</button>
            <button type="button" class="kp-button kp-button--ghost kp-button--sm" data-cat-prompt-clear>Clear prompt</button>
            <span class="cat-note cat-prompt-bar__status" role="status" aria-live="polite" data-cat-prompt-status></span>
        </div>
        <pre class="cat-feedback-prompt" id="cat-prompt-top" data-cat-prompt hidden></pre>`;
    bar.after(top);

    const foot = document.createElement('section');
    foot.className = 'cat-feedback';
    foot.setAttribute('aria-labelledby', 'cat-feedback-title');
    foot.innerHTML = `
        <h2 id="cat-feedback-title">The prompt, across every page</h2>
        <p class="cat-note">Every note and verdict from every review page that was not in a prompt copied before, grouped per page, per theme and per browser engine, as one prompt to paste into the conversation. Notes stay in this browser; a verdict is kept in this browser until the prompt is pasted and recorded into the register in the repository, and from then on counts as judged in every browser of its engine.</p>
        <pre class="cat-feedback-prompt" data-cat-prompt></pre>
        <div class="cat-feedback-actions">
            <div class="kp-field kp-field--check">
                <input class="kp-field__check" type="checkbox" id="cat-include-copied" data-cat-include-copied />
                <label class="kp-field__label" for="cat-include-copied">Include what was already copied</label>
            </div>
            <button type="button" class="kp-button" data-cat-prompt-copy>Copy prompt</button>
            <button type="button" class="kp-button kp-button--ghost" data-cat-prompt-clear>Clear prompt</button>
            <span class="cat-note" role="status" aria-live="polite" data-cat-prompt-status></span>
        </div>`;
    main.append(foot);

    const includeCopied = /** @type {HTMLInputElement} */ (foot.querySelector('[data-cat-include-copied]'));
    const texts = [...document.querySelectorAll('[data-cat-prompt]')];
    const counter = top.querySelector('[data-cat-prompt-count]');
    const show = top.querySelector('[data-cat-prompt-show]');
    const topText = top.querySelector('[data-cat-prompt]');

    function render() {
        const { text, items, pages, total } = buildPrompt({ includeCopied: includeCopied.checked });
        const empty = total
            ? 'Nothing new since the last copied prompt. Tick "Include what was already copied" at the foot of the page to see all of it again.'
            : 'No notes or verdicts yet, on any page. Judge a block or write a note under it; both belong to the theme on screen.';
        for (const pre of texts) pre.textContent = text || empty;
        counter.textContent = items
            ? `${items} ${includeCopied.checked ? '' : 'new '}item(s) for the prompt, from ${pages} page(s)`
            : `Nothing new for the prompt${total ? ' since the last copy' : ''}`;
        for (const button of document.querySelectorAll('[data-cat-prompt-copy]')) button.disabled = !text;
        for (const button of document.querySelectorAll('[data-cat-prompt-clear]')) button.disabled = !total;
    }

    const say = (message) => {
        for (const status of document.querySelectorAll('[data-cat-prompt-status]')) status.textContent = message;
    };

    show.addEventListener('click', () => {
        topText.hidden = !topText.hidden;
        show.setAttribute('aria-expanded', String(!topText.hidden));
        show.textContent = topText.hidden ? 'Show prompt' : 'Hide prompt';
    });

    for (const copy of document.querySelectorAll('[data-cat-prompt-copy]')) {
        copy.addEventListener('click', async () => {
            const { text } = buildPrompt({ includeCopied: includeCopied.checked });
            const pre = copy.closest('[data-cat-prompt-bar]') ? topText : foot.querySelector('[data-cat-prompt]');
            // Everything now counts as passed on; the next prompt starts from
            // what changes after this.
            markCopied();
            try {
                await navigator.clipboard.writeText(text);
                say('Copied. Paste it into the conversation.');
                // Only once it is on the clipboard: when the text is selected for
                // a manual Ctrl+C instead, it must stay on screen.
                setTimeout(render, 1500);
            } catch {
                // Without clipboard permission the text is selected instead, so
                // one Ctrl+C still does it.
                pre.hidden = false;
                if (pre === topText) {
                    show.setAttribute('aria-expanded', 'true');
                    show.textContent = 'Hide prompt';
                }
                const range = document.createRange();
                range.selectNodeContents(pre);
                const selection = getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
                say('Selected. Press Ctrl+C to copy.');
            }
        });
    }

    for (const clear of document.querySelectorAll('[data-cat-prompt-clear]')) {
        clear.addEventListener('click', () => {
            // Destructive, so it asks first (standing rule 31).
            if (
                !confirm(
                    'Clear the prompt? Every note on every page, in every theme, is removed, and every verdict counts as passed on. The verdicts themselves stay.',
                )
            )
                return;
            clearPrompt();
            render();
            say('Cleared.');
        });
    }

    includeCopied.addEventListener('change', render);
    document.addEventListener(JUDGEMENT_EVENT, render);
    document.addEventListener(NOTES_EVENT, render);
    // Another tab, or a compare column in this page, wrote a note or a verdict.
    window.addEventListener('storage', (event) => {
        if (event.key === null || STORAGE_KEYS.includes(event.key)) render();
    });
    document.documentElement.addEventListener(THEME_EVENT, () => setTimeout(render, 400));
    render();
    return { render };
}
