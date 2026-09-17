// Prototypes of options B and C for research/intro-loading [scope-85].
//
// NOT the package. A classic script (it has to run inline in <head>, before
// the module graph exists) holding a COPY of the arrival in js/effects.js —
// the same overlay classes (.kp-boot, .kp-boot__line, .kp-boot__bar,
// .kp-boot__skip, .is-off), the same words as js/strings.js, the same
// cadence (110 ms steps, 190 ms lines, 900 ms bar + 300 ms hold, 550/640 ms
// out) — changed in one way per option:
//
//   B  the overlay is built at the start of <body>, so it is in the first
//      paint, and it cannot finish before every milestone has settled: the
//      percentage is capped by the share of milestones done, the last boot
//      line waits, the card holds. Today's sequence is the minimum; maxMs
//      ends it anyway.
//   C  a veil (intro-proto.css) for every theme lifts when the milestones
//      have settled (or at maxMs); an arrival theme's intro then plays with
//      today's timers, from the lift rather than from the module attach.
//
// Milestones on a real page: every stylesheet link readable, DOMContentLoaded
// (module scripts run before it, so js/auto.js has attached), and
// document.fonts.ready read two frames after DOMContentLoaded (fonts are only
// requested once layout uses them). The demo frame passes simulated ones.
//
// Both options silence the package's own arrival by setting --kp-arrival to
// its initial value on <html>, which js/effects.js reads as quiet.
(function (global) {
    'use strict';

    var ARRIVALS = { synthwave: 'boot', terminal: 'boot', retro: 'boot', phantom: 'card' };
    // A copy of js/strings.js's arrival words (scope-84), for the prototype only.
    var WORDS = {
        line: 'Loading',
        progress: 'Progress',
        ready: 'Ready',
        skip: 'Skip',
        byTheme: { synthwave: { line: '▶ Play', progress: 'Tracking', ready: 'Press start' } },
        lines: {
            retro: ['KP Modular BIOS v4.51PG', 'kp-themes 95 — retro build', 'Memory Test : {count}K'],
            terminal: [
                'KP-THEMES BIOS v5.0.0',
                'MEMORY TEST ......... 640K OK',
                'PHOSPHOR PROFILE .... terminal',
                'CRT WARM-UP ......... OK',
                'READY.',
            ],
        },
    };
    var T = { step: 110, stepEnd: 220, line: 190, lineEnd: 320, bar: 900, hold: 300, off: 550, cardOff: 640 };

    function reduced(win) {
        return !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    /** The real milestones of the page this runs in. */
    function realMilestones(doc) {
        var win = doc.defaultView;
        function sheetsLoaded() {
            var links = doc.querySelectorAll('link[rel~="stylesheet"]');
            for (var i = 0; i < links.length; i++) {
                var s = links[i].sheet;
                if (!s) return false;
                try {
                    void s.cssRules;
                } catch (e) {
                    return false;
                }
            }
            return true;
        }
        var css = new Promise(function (resolve) {
            (function poll() {
                if (sheetsLoaded()) resolve();
                else win.setTimeout(poll, 20);
            })();
        });
        var dcl = new Promise(function (resolve) {
            if (doc.readyState !== 'loading') resolve();
            else doc.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
        var fonts = dcl.then(function () {
            return new Promise(function (resolve) {
                win.requestAnimationFrame(function () {
                    win.requestAnimationFrame(function () {
                        (doc.fonts ? doc.fonts.ready : Promise.resolve()).then(resolve, resolve);
                    });
                });
            });
        });
        return [
            { name: 'stylesheets', promise: css },
            { name: 'scripts', promise: dcl },
            { name: 'fonts', promise: fonts },
        ];
    }

    /** Settle when every milestone has, or at maxMs. onProgress(done, total). */
    function gate(win, milestones, maxMs, onProgress) {
        var done = 0;
        var total = milestones.length;
        return new Promise(function (resolve) {
            var timer = win.setTimeout(function () {
                resolve({ timedOut: true });
            }, maxMs);
            milestones.forEach(function (m) {
                m.promise.then(function () {
                    done++;
                    if (onProgress) onProgress(done, total, m.name);
                    if (done === total) {
                        win.clearTimeout(timer);
                        resolve({ timedOut: false });
                    }
                });
            });
            if (total === 0) resolve({ timedOut: false });
        });
    }

    /**
     * The arrival, copied. `ready` null plays today's timers; a promise holds
     * the end of the sequence until it settles.
     */
    function arrival(doc, theme, opts) {
        var win = doc.defaultView;
        var routine = ARRIVALS[theme];
        if (!routine || !doc.body) return null;
        var root = doc.documentElement;
        var cs = win.getComputedStyle(root);
        var own = WORDS.byTheme[theme] || {};
        var said = { line: own.line || WORDS.line, progress: own.progress || WORDS.progress, ready: own.ready || WORDS.ready };
        var lines = WORDS.lines[theme] || null;
        var total = Number(cs.getPropertyValue('--kp-arrival-count')) || 640;
        var hasBar = cs.getPropertyValue('--kp-arrival-bar').trim() === 'block';
        var share = 1; // the share of milestones settled, 0..1; 1 when not gated
        var isReady = !opts.ready;
        var onEvent = opts.onEvent || function () {};

        var overlay = doc.createElement('div');
        overlay.className = 'kp-boot';
        var line = doc.createElement('pre');
        line.className = 'kp-boot__line';
        line.setAttribute('aria-live', 'polite');
        var skip = doc.createElement('button');
        skip.type = 'button';
        skip.className = 'kp-boot__skip';
        skip.textContent = WORDS.skip;
        var bar = null;
        if (hasBar) {
            bar = doc.createElement('div');
            bar.className = 'kp-boot__bar';
            bar.setAttribute('aria-hidden', 'true');
            bar.style.setProperty('--kp-boot-progress', '0');
        }
        overlay.appendChild(line);
        if (bar) overlay.appendChild(bar);
        overlay.appendChild(skip);
        doc.body.appendChild(overlay);
        onEvent('start');

        var ended = false;
        var sequenceDone = false;
        function remove() {
            if (!overlay.parentNode) return;
            overlay.parentNode.removeChild(overlay);
            onEvent('end');
        }
        function end() {
            if (ended) return;
            ended = true;
            onEvent('off');
            if (reduced(win)) return remove();
            overlay.classList.add('is-off');
            overlay.addEventListener('animationend', remove, { once: true });
            win.setTimeout(remove, (routine === 'card' ? T.cardOff : T.off) + 50);
        }
        function maybeEnd(wait) {
            if (sequenceDone && isReady) win.setTimeout(end, wait);
        }
        if (opts.ready) {
            opts.ready.then(function () {
                isReady = true;
                share = 1;
                if (sequenceDone) end();
            });
        }
        skip.addEventListener('click', end);
        overlay.addEventListener('click', end);

        if (routine === 'card') {
            line.textContent = theme;
            win.setTimeout(function () {
                sequenceDone = true;
                maybeEnd(T.hold);
            }, T.bar);
        } else if (lines) {
            var shown = 0;
            var lineStep = function () {
                if (ended) return;
                // B: the last line is "done", so it waits for the milestones.
                if (shown === lines.length - 1 && !isReady) return win.setTimeout(lineStep, 50);
                shown++;
                line.textContent = lines
                    .slice(0, shown)
                    .map(function (text, i) {
                        return text.replace('{count}', String(i === shown - 1 ? Math.round((total * shown) / lines.length) : total));
                    })
                    .join('\n');
                if (bar) bar.style.setProperty('--kp-boot-progress', String(shown / lines.length));
                if (shown === lines.length) {
                    sequenceDone = true;
                    maybeEnd(T.lineEnd);
                } else win.setTimeout(lineStep, T.line);
            };
            lineStep();
        } else {
            var pct = 0;
            var step = function () {
                if (ended) return;
                var cap = isReady ? 100 : Math.floor(99 * share);
                pct = Math.min(cap, pct + 7 + Math.floor(Math.random() * 9));
                line.textContent = [said.line, said.progress + ' ' + pct + '%', pct === 100 ? said.ready : ''].filter(Boolean).join('\n');
                if (bar) bar.style.setProperty('--kp-boot-progress', String(pct / 100));
                if (pct === 100) {
                    sequenceDone = true;
                    maybeEnd(T.stepEnd);
                } else win.setTimeout(step, T.step);
            };
            step();
        }
        return {
            setShare: function (s) {
                share = s;
            },
            end: end,
        };
    }

    var state = { option: null, maxMs: 4000, milestones: null };

    /** Called inline at the end of <head>. */
    function head(opts) {
        var doc = document;
        var root = doc.documentElement;
        state.option = opts.option;
        state.maxMs = opts.maxMs || 4000;
        // The package's arrival stays quiet; the prototype performs it.
        root.style.setProperty('--kp-arrival', 'initial');
        state.milestones = realMilestones(doc);
        if (state.option === 'C') {
            root.setAttribute('data-kp-veil', 'on');
        }
    }

    function played(doc) {
        try {
            var key = 'kp-intro-proto:' + doc.defaultView.location.pathname;
            if (doc.defaultView.sessionStorage.getItem(key)) return true;
            doc.defaultView.sessionStorage.setItem(key, '1');
        } catch (e) {}
        return false;
    }

    /** Called inline as the first thing in <body>. */
    function body() {
        var doc = document;
        var win = window;
        var root = doc.documentElement;
        var theme = root.getAttribute('data-theme') || '';
        var wantsArrival = !!ARRIVALS[theme] && !reduced(win) && !played(doc);
        if (state.option === 'B') {
            var handle = null;
            var ready = gate(win, state.milestones, state.maxMs, function (done, total) {
                if (handle) handle.setShare(done / total);
            });
            if (wantsArrival) handle = arrival(doc, theme, { ready: ready });
        }
        if (state.option === 'C') {
            veil(doc, state.milestones, state.maxMs, function () {
                if (wantsArrival) arrival(doc, theme, { ready: null });
            });
        }
    }

    /** Option C's veil: lift when the milestones settle, then call next(). */
    function veil(doc, milestones, maxMs, next) {
        var win = doc.defaultView;
        var root = doc.documentElement;
        root.setAttribute('data-kp-veil', 'on');
        gate(win, milestones, maxMs, function (done, total) {
            root.style.setProperty('--kp-veil-progress', String(done / total));
        }).then(function () {
            root.style.setProperty('--kp-veil-progress', '1');
            root.setAttribute('data-kp-veil', 'off');
            if (next) next();
            win.setTimeout(
                function () {
                    root.removeAttribute('data-kp-veil');
                },
                reduced(win) ? 0 : 170,
            );
        });
    }

    global.kpIntroProto = { head: head, body: body, arrival: arrival, veil: veil, gate: gate, realMilestones: realMilestones, ARRIVALS: ARRIVALS };
})(window);
