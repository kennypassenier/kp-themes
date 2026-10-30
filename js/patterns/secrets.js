// Attaches the secrets of a page.
import { getStrings } from '../strings.js';
import { watchOptions } from '../live-options.js';
import { clearClipboardLater } from './clipboard.js';
import {
    CLEAR_AFTER_MS,
    COPIED_MS,
    COPY_EVENT,
    COPY_FAILED_EVENT,
    SECRET,
    SECRET_EVENT,
    SECRET_MASK,
    SECRET_REQUEST_EVENT,
    SECRET_TTL,
    clearDelay,
} from './constants.js';
import { secrets } from './secret-api.js';
import { wireSecretInput } from './secret-input.js';
/** @typedef {import('./types.js').SecretLoad} SecretLoad */
/** @typedef {import('./types.js').SecretState} SecretState */

/**
 * Attach every secret field under `root`.
 * @param {ParentNode} [root]
 * @param {{ load?: SecretLoad, copiedMs?: number, clearAfterMs?: number | false }} [options]
 * @returns {() => void} detach
 */
export function attachSecrets(root = document, { load, copiedMs = COPIED_MS, clearAfterMs = CLEAR_AFTER_MS } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    const fields = /** @type {HTMLElement[]} */ ([
        ...(root instanceof Element && root.matches(SECRET) ? [root] : []),
        ...root.querySelectorAll(SECRET),
    ]);
    for (const field of fields) {
        if (secrets.has(field)) continue;
        if (field.dataset.kpSecretMode === 'input') {
            cleanups.push(wireSecretInput(field, { copiedMs, clearAfterMs }));
            continue;
        }
        const doc = field.ownerDocument;
        const s = getStrings();
        const make = (/** @type {string} */ tag, /** @type {string} */ className) => {
            const el = doc.createElement(tag);
            el.className = className;
            return el;
        };
        field.classList.add('kp-secret');
        if (!field.hasAttribute('role')) field.setAttribute('role', 'group');
        if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby'))
            field.setAttribute('aria-label', field.dataset.kpSecretLabel ?? s.secretLabel);
        // The three options are read again when their attribute changes [live-options-1019]; `readOptions()` is the one place
        // that reads them.
        let hold = false;
        let seconds = SECRET_TTL;
        let mask = '';
        const readOptions = () => {
            hold = field.dataset.kpSecretRevealOn === 'hold';
            const ttl = Math.max(0, Number.parseInt(field.dataset.kpSecretTtl ?? '', 10));
            seconds = Number.isFinite(ttl) ? ttl : SECRET_TTL;
            const maskLength = Math.max(1, Number.parseInt(field.dataset.kpSecretMask ?? '', 10) || SECRET_MASK);
            mask = (field.dataset.kpSecretMaskChar ?? '•').repeat(maskLength);
        };
        readOptions();

        // The parts, built where the markup has none.
        const built = /** @type {Element[]} */ ([]);
        let value = /** @type {HTMLElement | null} */ (field.querySelector(':scope > .kp-secret__value'));
        if (!value) {
            value = make('code', 'kp-secret__value');
            field.prepend(value);
            built.push(value);
        }
        value.classList.add('kp-masked');
        value.textContent = mask;
        let actions = /** @type {HTMLElement | null} */ (field.querySelector(':scope > .kp-secret__actions'));
        if (!actions) {
            actions = make('div', 'kp-secret__actions');
            value.after(actions);
            built.push(actions);
        }
        let reveal = /** @type {HTMLButtonElement | null} */ (actions.querySelector('[data-kp-secret-reveal]'));
        if (!reveal) {
            reveal = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-secret__reveal'));
            reveal.type = 'button';
            reveal.setAttribute('data-kp-secret-reveal', '');
            actions.append(reveal);
            built.push(reveal);
        }
        let copy = /** @type {HTMLButtonElement | null} */ (actions.querySelector('[data-kp-secret-copy]'));
        if (!copy && field.dataset.kpSecretCopy !== 'false') {
            copy = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-copyable__button kp-secret__copy'));
            copy.type = 'button';
            copy.setAttribute('data-kp-secret-copy', '');
            copy.textContent = s.secretCopy;
            actions.append(copy);
            built.push(copy);
        }
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
        const valueId = value.id || `kp-secret-${Math.random().toString(36).slice(2, 9)}`;
        value.id = valueId;
        reveal.setAttribute('aria-controls', valueId);
        field.style.setProperty('--kp-secret-ttl', `${seconds}s`);
        const lines = Number.parseInt(field.dataset.kpSecretLines ?? '', 10);
        if (lines > 0) field.style.setProperty('--kp-secret-lines', String(lines));

        /** @type {SecretState} */
        let state = 'hidden';
        let left = seconds;
        let timer = 0;
        let paused = false;
        let ticket = 0;
        let copiedTimer = 0;
        let cancelClear = () => {};
        /** @param {string} text */
        const say = (text) => {
            spoken.textContent = '';
            window.setTimeout(() => (spoken.textContent = text), 30);
        };
        const disabledWhy = () => field.dataset.kpSecretDisabled;
        const label = () => (state === 'shown' ? s.secretHide : state === 'error' ? s.secretRetry : hold ? s.secretHold : s.secretReveal);
        /** @param {SecretState} next */
        const setState = (next) => {
            state = next;
            field.dataset.kpSecretState = next;
            const why = disabledWhy();
            reveal.textContent = label();
            reveal.disabled = why !== undefined || next === 'loading';
            reveal.setAttribute('aria-expanded', String(next === 'shown'));
            if (hold) reveal.setAttribute('aria-pressed', String(next === 'shown'));
            else reveal.removeAttribute('aria-pressed');
            if (copy) copy.disabled = why !== undefined;
            value.setAttribute('aria-busy', String(next === 'loading'));
            if (next !== 'shown') {
                // Taken out of the page, not only covered.
                field.removeAttribute('data-kp-secret-overflow');
                value.textContent = mask;
                value.classList.add('kp-masked');
                value.removeAttribute('tabindex');
            }
        };
        const writeLine = () => {
            const why = disabledWhy();
            if (why !== undefined) {
                field.dataset.kpSecretState = 'disabled';
                words.textContent = why;
                return;
            }
            if (state === 'loading') {
                words.replaceChildren();
                const spinner = make('span', 'kp-spinner kp-secret__spinner');
                spinner.setAttribute('aria-hidden', 'true');
                words.append(spinner, doc.createTextNode(s.secretReading));
            } else if (state === 'shown') words.textContent = seconds === 0 ? s.secretStaysShown : paused ? s.secretPaused : s.secretHidesIn(left);
            else if (state !== 'error') words.textContent = '';
        };
        const stop = () => {
            window.clearInterval(timer);
            timer = 0;
        };
        /** @param {string} [reason] */
        const hide = (reason = 'press') => {
            if (state !== 'shown' && state !== 'loading') return;
            ticket += 1;
            stop();
            paused = false;
            field.removeAttribute('data-kp-secret-paused');
            const was = state;
            setState('hidden');
            writeLine();
            if (was === 'shown') {
                say(s.secretHidden);
                field.dispatchEvent(new CustomEvent(SECRET_EVENT, { bubbles: true, detail: { shown: false, reason } }));
            }
        };
        /** @param {'reveal' | 'copy'} purpose @returns {Promise<string>} */
        const read = (purpose) =>
            new Promise((resolve, reject) => {
                let answered = false;
                const respond = (/** @type {string} */ v) => {
                    if (answered) return;
                    answered = true;
                    resolve(String(v));
                };
                const fail = (/** @type {unknown} */ why) => {
                    if (answered) return;
                    answered = true;
                    reject(why);
                };
                const event = new CustomEvent(SECRET_REQUEST_EVENT, { bubbles: true, cancelable: true, detail: { respond, fail, purpose } });
                field.dispatchEvent(event);
                if (event.defaultPrevented) return;
                if (load) {
                    Promise.resolve()
                        .then(() => load(field, purpose))
                        .then(respond, fail);
                    return;
                }
                const inline = field.dataset.kpSecretValue;
                if (inline !== undefined) respond(inline);
                else fail(new Error(s.secretNoSource));
            });
        /** @param {unknown} error */
        const reasonOf = (error) => (error instanceof Error ? error.message : typeof error === 'string' ? error : s.secretNoSource);
        const tick = () => {
            if (paused) return;
            left -= 1;
            if (left === 10 && seconds > 10) say(s.secretHidesIn(10));
            if (left <= 0) {
                hide('timer');
                return;
            }
            writeLine();
        };
        /** @param {string} [reason] */
        const show = async (reason = 'press') => {
            if (disabledWhy() !== undefined || state === 'loading' || state === 'shown') return;
            const mine = (ticket += 1);
            setState('loading');
            writeLine();
            let text = '';
            try {
                text = await read('reveal');
            } catch (error) {
                if (mine !== ticket) return;
                setState('error');
                words.textContent = s.secretFailed(reasonOf(error));
                say(words.textContent);
                return;
            }
            if (mine !== ticket) return;
            const shown = make('span', 'kp-secret__text');
            shown.textContent = text;
            value.replaceChildren(shown);
            value.classList.remove('kp-masked');
            value.tabIndex = 0;
            // A value longer than its box scrolls inside it; the fade at its end says there is more.
            field.toggleAttribute('data-kp-secret-overflow', value.scrollWidth > value.clientWidth + 1);
            left = seconds;
            paused = false;
            setState('shown');
            // The drain restarts with every showing.
            drain.style.animation = 'none';
            void drain.offsetWidth;
            drain.style.removeProperty('animation');
            writeLine();
            say(s.secretShown(seconds));
            field.dispatchEvent(new CustomEvent(SECRET_EVENT, { bubbles: true, detail: { shown: true, reason } }));
            if (seconds > 0 && !hold) timer = window.setInterval(tick, 1000);
        };
        /** @param {boolean} on */
        const pause = (on) => {
            if (state !== 'shown' || paused === on || seconds === 0) return;
            paused = on;
            field.toggleAttribute('data-kp-secret-paused', on);
            writeLine();
        };

        const onReveal = () => {
            if (hold) return;
            if (state === 'shown') hide('press');
            else void show('press');
        };
        /** @param {PointerEvent} event */
        const onHoldDown = (event) => {
            if (!hold || event.button !== 0) return;
            reveal.setPointerCapture?.(event.pointerId);
            void show('hold');
        };
        const onHoldUp = () => {
            if (hold) hide('hold');
        };
        /** @param {KeyboardEvent} event */
        const onHoldKey = (event) => {
            if (!hold || (event.key !== ' ' && event.key !== 'Enter')) return;
            event.preventDefault();
            if (event.type === 'keydown' && !event.repeat) void show('hold');
            if (event.type === 'keyup') hide('hold');
        };
        const onCopy = async () => {
            if (!copy || disabledWhy() !== undefined) return;
            const idle = s.secretCopy;
            let text = '';
            try {
                // The value already shown is copied as it stands; a hidden one is read, copied and never drawn.
                text = state === 'shown' ? (value.textContent ?? '') : await read('copy');
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
            say(s.copiedAnnouncement(field.getAttribute('aria-label') ?? s.secretLabel));
            window.clearTimeout(copiedTimer);
            copiedTimer = window.setTimeout(() => {
                copy.textContent = idle;
                delete copy.dataset.kpCopied;
            }, copiedMs);
            scheduleClear(text);
        };
        /** Empty the clipboard again some seconds after a copy [wish-1120, homelab 108]. @param {string} secret */
        const scheduleClear = (secret) => {
            cancelClear();
            const wait = clearDelay(field.dataset.kpSecretClear, clearAfterMs);
            if (!(wait > 0)) return;
            cancelClear = clearClipboardLater(field, secret, wait, say);
        };
        const onFocusIn = (/** @type {FocusEvent} */ event) => {
            if (event.target === value) pause(true);
        };
        const onFocusOut = (/** @type {FocusEvent} */ event) => {
            if (event.target === value && !selected()) pause(false);
        };
        const selected = () => {
            const selection = doc.getSelection();
            return selection !== null && !selection.isCollapsed && value.contains(selection.anchorNode);
        };
        const onSelection = () => {
            if (state === 'shown') pause(selected() || doc.activeElement === value);
        };
        const onAway = () => {
            if (doc.visibilityState === 'hidden') hide('away');
        };

        reveal.addEventListener('click', onReveal);
        reveal.addEventListener('pointerdown', onHoldDown);
        reveal.addEventListener('pointerup', onHoldUp);
        reveal.addEventListener('pointercancel', onHoldUp);
        reveal.addEventListener('lostpointercapture', onHoldUp);
        reveal.addEventListener('keydown', onHoldKey);
        reveal.addEventListener('keyup', onHoldKey);
        reveal.addEventListener('blur', onHoldUp);
        copy?.addEventListener('click', onCopy);
        field.addEventListener('focusin', onFocusIn);
        field.addEventListener('focusout', onFocusOut);
        doc.addEventListener('selectionchange', onSelection);
        doc.addEventListener('visibilitychange', onAway);
        setState(disabledWhy() !== undefined ? 'disabled' : 'hidden');
        writeLine();
        // A later change of the reason (the page grants or takes the right) is followed.
        const watch = new MutationObserver(() => {
            if (disabledWhy() !== undefined) hide('call');
            setState(disabledWhy() !== undefined ? 'disabled' : state === 'disabled' ? 'hidden' : state);
            writeLine();
        });
        watch.observe(field, { attributes: true, attributeFilter: ['data-kp-secret-disabled'] });
        const stopOptions = watchOptions(
            field,
            ['data-kp-secret-ttl', 'data-kp-secret-reveal-on', 'data-kp-secret-mask', 'data-kp-secret-mask-char'],
            (names) => {
                const wasHold = hold;
                // A value shown the old way is hidden first: a held reveal has no timer, a timed one has no button to hold.
                if (names.includes('data-kp-secret-reveal-on') && (state === 'shown' || state === 'loading')) hide('call');
                readOptions();
                field.style.setProperty('--kp-secret-ttl', `${seconds}s`);
                if (hold !== wasHold) setState(state);
                if (names.includes('data-kp-secret-mask') || names.includes('data-kp-secret-mask-char')) {
                    if (state !== 'shown') value.textContent = mask;
                }
                if (state === 'shown' && names.includes('data-kp-secret-ttl')) {
                    // The new time starts now, and the drain with it.
                    stop();
                    left = seconds;
                    paused = false;
                    field.removeAttribute('data-kp-secret-paused');
                    drain.style.animation = 'none';
                    void drain.offsetWidth;
                    drain.style.removeProperty('animation');
                    if (seconds > 0 && !hold) timer = window.setInterval(tick, 1000);
                    writeLine();
                }
            },
        );
        secrets.set(field, { reveal: (reason) => void show(reason), hide: (reason) => hide(reason) });

        cleanups.push(() => {
            watch.disconnect();
            stopOptions();
            stop();
            window.clearTimeout(copiedTimer);
            reveal.removeEventListener('click', onReveal);
            reveal.removeEventListener('pointerdown', onHoldDown);
            reveal.removeEventListener('pointerup', onHoldUp);
            reveal.removeEventListener('pointercancel', onHoldUp);
            reveal.removeEventListener('lostpointercapture', onHoldUp);
            reveal.removeEventListener('keydown', onHoldKey);
            reveal.removeEventListener('keyup', onHoldKey);
            reveal.removeEventListener('blur', onHoldUp);
            copy?.removeEventListener('click', onCopy);
            field.removeEventListener('focusin', onFocusIn);
            field.removeEventListener('focusout', onFocusOut);
            doc.removeEventListener('selectionchange', onSelection);
            doc.removeEventListener('visibilitychange', onAway);
            ticket += 1;
            value.textContent = mask;
            for (const part of built) part.remove();
            delete field.dataset.kpSecretState;
            secrets.delete(field);
        });
    }
    return () => {
        for (const c of cleanups.splice(0)) c();
    };
}
