// Wires one secret input: reveal, copy, mask and clear.
import { getStrings } from '../strings.js';
import { watchOptions } from '../live-options.js';
import { clearClipboardLater } from './clipboard.js';
import { COPY_EVENT, COPY_FAILED_EVENT, SECRET_EVENT, SECRET_TTL, clearDelay } from './constants.js';
import { secretInputs, secrets } from './secret-api.js';

/**
 * @param {HTMLElement} field
 * @param {{ copiedMs: number, clearAfterMs: number | false }} options
 * @returns {() => void} detach
 */
export function wireSecretInput(field, { copiedMs, clearAfterMs }) {
    const doc = field.ownerDocument;
    const s = getStrings();
    const make = (/** @type {string} */ tag, /** @type {string} */ className) => {
        const el = doc.createElement(tag);
        el.className = className;
        return el;
    };
    field.classList.add('kp-secret');
    if (!field.hasAttribute('role')) field.setAttribute('role', 'group');
    const name = field.getAttribute('aria-label') ?? field.dataset.kpSecretLabel ?? s.secretLabel;
    if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) field.setAttribute('aria-label', name);

    const built = /** @type {Element[]} */ ([]);
    let entry = /** @type {HTMLElement | null} */ (field.querySelector(':scope > .kp-secret__entry'));
    if (!entry) {
        entry = make('div', 'kp-secret__entry');
        field.prepend(entry);
        built.push(entry);
    }
    let input = /** @type {HTMLInputElement | null} */ (entry.querySelector('input'));
    const authored = input !== null;
    if (!input) {
        input = /** @type {HTMLInputElement} */ (make('input', 'kp-field__input kp-secret__input'));
        entry.append(input);
    }
    input.classList.add('kp-secret__input');
    input.type = 'password';
    input.spellcheck = false;
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocorrect', 'off');
    if (!input.hasAttribute('autocomplete')) input.setAttribute('autocomplete', field.dataset.kpSecretAutocomplete ?? 'off');
    if (!input.name && field.dataset.kpSecretName) input.name = field.dataset.kpSecretName;
    if (!input.placeholder && field.dataset.kpSecretPlaceholder) input.placeholder = field.dataset.kpSecretPlaceholder;
    if (!input.hasAttribute('aria-label') && !input.id) input.setAttribute('aria-label', name);
    secretInputs.set(field, input);

    let actions = /** @type {HTMLElement | null} */ (field.querySelector(':scope > .kp-secret__actions'));
    if (!actions) {
        actions = make('div', 'kp-secret__actions');
        entry.after(actions);
        built.push(actions);
    }
    const button = (/** @type {string} */ className, /** @type {string} */ marker) => {
        const el = /** @type {HTMLButtonElement} */ (make('button', className));
        el.type = 'button';
        el.setAttribute(marker, '');
        actions.append(el);
        return el;
    };
    const reveal = button('kp-button kp-secret__reveal', 'data-kp-secret-reveal');
    const paste = field.dataset.kpSecretPaste === 'false' ? null : button('kp-button kp-secret__paste', 'data-kp-secret-paste-button');
    const copy = field.dataset.kpSecretCopy === 'false' ? null : button('kp-button kp-copyable__button kp-secret__copy', 'data-kp-secret-copy');
    for (const part of [reveal, paste, copy]) if (part) built.push(part);
    let line = /** @type {HTMLElement | null} */ (field.querySelector(':scope > .kp-secret__line'));
    if (!line) {
        line = make('p', 'kp-secret__line');
        field.append(line);
        built.push(line);
    }
    const words = make('span', 'kp-secret__words');
    const drain = make('span', 'kp-secret__drain');
    drain.setAttribute('aria-hidden', 'true');
    line.replaceChildren(words, drain);
    const spoken = make('span', 'kp-sr-only kp-secret__live');
    spoken.setAttribute('role', 'status');
    spoken.setAttribute('aria-live', 'polite');
    field.append(spoken);
    built.push(spoken);
    const lineId = line.id || `kp-secret-line-${Math.random().toString(36).slice(2, 9)}`;
    line.id = lineId;
    input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), lineId].filter(Boolean).join(' '));
    if (!input.id) input.id = `kp-secret-input-${Math.random().toString(36).slice(2, 9)}`;
    reveal.setAttribute('aria-controls', input.id);

    let shown = false;
    let seconds = SECRET_TTL;
    let left = 0;
    let timer = 0;
    let copiedTimer = 0;
    let cancelClear = () => {};
    /** The words of the last failed paste, until the next key. */
    let pasteProblem = '';
    const readOptions = () => {
        const ms = clearDelay(field.dataset.kpSecretTtl, SECRET_TTL * 1000);
        seconds = Math.round(ms / 1000);
    };
    readOptions();
    const hidesOnBlur = () => !['false', 'off'].includes(field.dataset.kpSecretHideOnBlur ?? '');
    const disabledWhy = () => field.dataset.kpSecretDisabled;
    const invalidWhy = () => field.dataset.kpSecretInvalid;
    /** @param {string} text */
    const say = (text) => {
        spoken.textContent = '';
        window.setTimeout(() => (spoken.textContent = text), 30);
    };
    const stop = () => {
        window.clearInterval(timer);
        timer = 0;
    };
    const paint = () => {
        const why = disabledWhy();
        const bad = invalidWhy();
        const empty = input.value === '';
        field.dataset.kpSecretState = why !== undefined ? 'disabled' : bad !== undefined || pasteProblem ? 'error' : shown ? 'shown' : 'hidden';
        input.type = shown ? 'text' : 'password';
        input.disabled = why !== undefined;
        if (bad !== undefined) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
        reveal.textContent = shown ? s.secretHide : s.secretReveal;
        reveal.setAttribute('aria-pressed', String(shown));
        reveal.disabled = why !== undefined || empty;
        if (paste) {
            paste.textContent = s.secretPaste;
            paste.disabled = why !== undefined;
        }
        if (copy && !copy.hasAttribute('data-kp-copied')) copy.textContent = s.secretCopy;
        if (copy) copy.disabled = why !== undefined || empty;
        const text =
            why !== undefined
                ? why
                : bad !== undefined
                  ? bad
                  : pasteProblem ||
                    (shown
                        ? seconds === 0
                            ? s.secretStaysShown
                            : s.secretHidesIn(left)
                        : empty
                          ? s.secretInputHint
                          : s.secretInputCount(input.value.length));
        words.textContent = text;
    };
    /** @param {string} [reason] */
    const hide = (reason = 'press') => {
        if (!shown) return;
        shown = false;
        stop();
        paint();
        say(s.secretHidden);
        field.dispatchEvent(new CustomEvent(SECRET_EVENT, { bubbles: true, detail: { shown: false, reason } }));
    };
    const tick = () => {
        left -= 1;
        if (left === 10 && seconds > 10) say(s.secretHidesIn(10));
        if (left <= 0) hide('timer');
        else paint();
    };
    /** @param {string} [reason] */
    const show = (reason = 'press') => {
        if (shown || disabledWhy() !== undefined || input.value === '') return;
        shown = true;
        left = seconds;
        drain.style.animation = 'none';
        void drain.offsetWidth;
        drain.style.removeProperty('animation');
        paint();
        say(s.secretShown(seconds));
        field.dispatchEvent(new CustomEvent(SECRET_EVENT, { bubbles: true, detail: { shown: true, reason } }));
        if (seconds > 0) timer = window.setInterval(tick, 1000);
    };
    const onReveal = () => {
        if (shown) hide('press');
        else show('press');
        input.focus();
    };
    const onInput = () => {
        pasteProblem = '';
        if (input.value === '' && shown) hide('call');
        else paint();
    };
    const onPaste = async () => {
        if (!paste) return;
        let text = '';
        try {
            text = await navigator.clipboard.readText();
        } catch {
            pasteProblem = s.secretPasteBlocked;
            paint();
            say(pasteProblem);
            input.focus();
            return;
        }
        pasteProblem = '';
        const from = input.selectionStart ?? input.value.length;
        const to = input.selectionEnd ?? from;
        input.setRangeText(text, from, to, 'end');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        say(s.secretPasted(text.length));
        input.focus();
    };
    const onCopy = async () => {
        if (!copy || input.value === '') return;
        const text = input.value;
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            copy.dataset.kpCopyFailed = '';
            copy.dispatchEvent(new CustomEvent(COPY_FAILED_EVENT, { bubbles: true, detail: { text: '', error } }));
            say(s.copyBlockedAnnouncement);
            return;
        }
        delete copy.dataset.kpCopyFailed;
        copy.textContent = s.copied;
        copy.dataset.kpCopied = '';
        // The value itself is never put in the event or the announcement.
        copy.dispatchEvent(new CustomEvent(COPY_EVENT, { bubbles: true, detail: { text: '' } }));
        say(s.copiedAnnouncement(name));
        window.clearTimeout(copiedTimer);
        copiedTimer = window.setTimeout(() => {
            delete copy.dataset.kpCopied;
            paint();
        }, copiedMs);
        cancelClear();
        const wait = clearDelay(field.dataset.kpSecretClear, clearAfterMs);
        if (wait > 0) cancelClear = clearClipboardLater(field, text, wait, say);
    };
    /** @param {FocusEvent} event */
    const onFocusOut = (event) => {
        if (!shown || !hidesOnBlur()) return;
        const next = event.relatedTarget;
        if (next instanceof Node && field.contains(next)) return;
        hide('away');
    };
    const onAway = () => {
        if (doc.visibilityState === 'hidden' && hidesOnBlur()) hide('away');
    };
    input.addEventListener('input', onInput);
    reveal.addEventListener('click', onReveal);
    paste?.addEventListener('click', onPaste);
    copy?.addEventListener('click', onCopy);
    field.addEventListener('focusout', onFocusOut);
    doc.addEventListener('visibilitychange', onAway);
    paint();
    const watch = new MutationObserver(() => {
        if (disabledWhy() !== undefined) hide('call');
        paint();
    });
    watch.observe(field, { attributes: true, attributeFilter: ['data-kp-secret-disabled', 'data-kp-secret-invalid'] });
    const stopOptions = watchOptions(field, ['data-kp-secret-ttl'], () => {
        readOptions();
        if (shown) {
            stop();
            left = seconds;
            if (seconds > 0) timer = window.setInterval(tick, 1000);
        }
        paint();
    });
    secrets.set(field, { reveal: (reason) => show(reason), hide: (reason) => hide(reason) });
    return () => {
        watch.disconnect();
        stopOptions();
        stop();
        window.clearTimeout(copiedTimer);
        input.removeEventListener('input', onInput);
        reveal.removeEventListener('click', onReveal);
        paste?.removeEventListener('click', onPaste);
        copy?.removeEventListener('click', onCopy);
        field.removeEventListener('focusout', onFocusOut);
        doc.removeEventListener('visibilitychange', onAway);
        shown = false;
        input.value = '';
        input.type = 'password';
        for (const part of built) part.remove();
        if (authored) input.classList.remove('kp-secret__input');
        delete field.dataset.kpSecretState;
        secrets.delete(field);
        secretInputs.delete(field);
    };
}
