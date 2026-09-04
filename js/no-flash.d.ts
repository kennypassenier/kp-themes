/**
 * Inline this inside <script> in <head>, before the stylesheet link.
 * Plain ES5, no imports, no dependency on this package being loaded.
 */
export declare const NO_FLASH_SNIPPET = "(function () {\n    try {\n        var t = localStorage.getItem('theme');\n        if (t) document.documentElement.dataset.theme = t;\n    } catch (e) {}\n})();";
