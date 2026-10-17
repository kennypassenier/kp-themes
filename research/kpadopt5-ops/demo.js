// research/kpadopt5-ops: the demo's own wiring. The transfer rows are the package's (js/transfer.js); this file only feeds them
// sample reports on a fast clock.

import { resetTransfer, setTransfer } from '../../js/transfer.js';

// ---------------------------------------------------------------- transfer
function initTransfer() {
    const groups = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ko-xfers]')]);
    if (!groups.length) return;
    const MB = 1_000_000;
    /** The demo's own clock: five simulated seconds for each real second. */
    let sim = Date.now();
    let timer = 0;
    let t = 0;
    /** The total the second transfer learns when the button is pressed; null while its size is unknown. */
    let learned = /** @type {number | null} */ (null);
    const note = document.querySelector('[data-ko-xfer-note]');
    /** @param {string} text */
    const say = (text) => {
        if (note) note.textContent = text;
    };
    /** @param {HTMLElement[]} rows */
    const frame = (rows) => {
        const now = () => sim;
        const [a, b, c] = rows;
        if (!a || !b || !c) return;
        if (t <= 50) {
            // A steady 12 MB/s with a little wobble, counted up so the bytes only ever grow.
            const done = Math.min(600 * MB, Math.round(12 * MB * (t + 0.35 * Math.sin(t / 2))));
            setTransfer(a, { done: Math.max(done, a.dataset.koDone ? Number(a.dataset.koDone) : 0), total: 600 * MB, at: sim }, { now });
            a.dataset.koDone = String(done);
        }
        if (t === 51) setTransfer(a, { done: 600 * MB, total: 600 * MB, at: sim }, { now });
        // The second one reports bytes and, until it learns its size, no total. Left alone it ends at 30 ticks, when the app
        // learns the total as the bytes it sent.
        if (learned === null && t <= 29) setTransfer(b, { done: Math.round(40 * MB * t), at: sim }, { now });
        if (learned === null && t === 30) setTransfer(b, { done: 40 * MB * 30, total: 40 * MB * 30, at: sim }, { now });
        if (learned !== null) setTransfer(b, { done: Math.min(learned, Math.round(40 * MB * t)), total: learned, at: sim }, { now });
        if (t <= 8) setTransfer(c, { done: 3 * MB * t, total: 900 * MB, at: sim }, { now });
        if (t === 28) setTransfer(c, { failed: 'The connection was reset by the host.', at: sim }, { now });
    };
    const reset = () => {
        window.clearInterval(timer);
        timer = 0;
        t = 0;
        learned = null;
        say('Press Play once. The second transfer has no known size until you press the button.');
        for (const group of groups) for (const row of group.querySelectorAll('[data-kp-transfer]')) resetTransfer(/** @type {HTMLElement} */ (row));
    };
    const play = () => {
        reset();
        sim = Date.now();
        say('Playing: the second transfer reports its bytes but no total, so it shows “size unknown”.');
        timer = window.setInterval(() => {
            t += 1;
            sim += 1000;
            if (t === 12 && pendingLearn) learn();
            for (const group of groups) frame([...group.querySelectorAll('[data-kp-transfer]')].map((r) => /** @type {HTMLElement} */ (r)));
            if (t >= 60) window.clearInterval(timer);
        }, 200);
    };
    let pendingLearn = false;
    const learn = () => {
        pendingLearn = false;
        learned = 1600 * MB;
        say('The second transfer learned its size (1.6 GB): the stripes settle into a normal bar that shrinks to the real share and fills.');
    };
    for (const button of document.querySelectorAll('[data-ko-xfer]'))
        button.addEventListener('click', () => {
            const kind = /** @type {HTMLElement} */ (button).dataset.koXfer;
            if (kind === 'reset') {
                pendingLearn = false;
                reset();
            } else if (kind === 'play') {
                pendingLearn = false;
                play();
            } else if (timer && learned === null && t > 0 && t < 60) learn();
            else {
                // Pressed while nothing runs: play, and let the second one learn its size after about two seconds.
                play();
                pendingLearn = true;
            }
        });
    for (const group of groups)
        group.addEventListener('kp-transfer-retry', (e) => {
            const row = /** @type {HTMLElement} */ (e.target);
            setTransfer(row, { done: 0, total: 900 * MB, at: sim }, { now: () => sim });
        });
}

initTransfer();
