// A classic script, loaded before js/auto.js, on purpose. A compare column
// wears the theme its own menu chose, but auto.js listens for theme changes
// across tabs (js/theme-core.js onThemeChange, crossTab on by default), and
// the page around the column is another document of the same origin: when
// the top theme menu stored its choice, the `storage` event reached both
// columns and they put it on (Kenny, 2026-09-13). This listener is on window
// before any other, in the capture phase, and stops that one key there, so
// the package keeps its cross-tab behaviour for consumers and only these
// documents ignore it. Notes and verdicts still arrive; only the theme key
// (js/theme-registry.js STORAGE_KEY) is held back.
(function () {
    var THEME_KEY = 'theme';
    window.addEventListener(
        'storage',
        function (event) {
            if (event.key === THEME_KEY) event.stopImmediatePropagation();
        },
        true,
    );
})();
