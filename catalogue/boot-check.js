// A classic script, not a module, on purpose: when the catalogue's module
// graph fails to load (a missing export, a file that does not answer), no
// module code runs at all and the page is left without its navigation and
// its blocks, silently. This one runs regardless, remembers the first error
// the browser reports, and if the shell has not appeared a few seconds
// later it says so on the page, with that error — so a broken review page
// explains itself instead of looking half empty (Kenny, 2026-09-13).
(function () {
    var first = null;
    function remember(message) {
        if (first === null && message) first = String(message);
    }
    window.addEventListener(
        'error',
        function (event) {
            var target = event.target;
            if (target && target !== window && (target.src || target.href)) remember('Could not load ' + (target.src || target.href));
            else remember(event.message + (event.filename ? ' (' + event.filename + ':' + event.lineno + ')' : ''));
        },
        true,
    );
    window.addEventListener('unhandledrejection', function (event) {
        remember(event.reason && event.reason.message ? event.reason.message : event.reason);
    });
    window.addEventListener('load', function () {
        setTimeout(function () {
            if (document.querySelector('.cat-nav')) return;
            var banner = document.createElement('div');
            banner.setAttribute('role', 'alert');
            banner.style.cssText =
                'position:fixed;inset-inline:0;inset-block-start:0;z-index:2147483647;padding:12px 16px;background:#8b0000;color:#fff;font:14px/1.5 system-ui,sans-serif';
            banner.textContent =
                'The catalogue script did not start, so the navigation and the blocks are missing. ' +
                (first ? 'The browser reported: ' + first + '. ' : 'The browser reported no error; open the console (F12) for more. ') +
                'A hard reload (Ctrl+Shift+R) rules out a stale copy.';
            document.body.prepend(banner);
        }, 4000);
    });
})();
