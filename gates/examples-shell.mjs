// The head of every generated example page (gates/generate-examples.mjs): the stylesheets in cascade order and the review site's shell on request.

/* The head script: the stored theme before the stylesheet (TH23) and the
 * effects armed before first paint (AR34), in one inline snippet. */
/** The stylesheets a page loads, in cascade order [AR17]. */
// The two registers are opt-in for a consumer (README) and were left off
// these pages by omission rather than by decision -- no generator said a
// word about them either way. The consequence was that picking cyberpunk
// or retro here showed a theme that was not that theme, which is KT8
// verbatim. Kenny found it on the published site on 2026-09-07 and chose
// to load them: a page that exists to show what a theme looks like shows
// it whole.
// fonts.css joined at round six's C4 (T19): a page that exists to show a
// theme shows it in its own face.
export const SHEETS = [
    'fonts.css',
    'themes.css',
    'components.css',
    'layout.css',
    'utilities.css',
    'cyberpunk-register.css',
    'synthwave-register.css',
    'brutalism-register.css',
    'titanium-register.css',
    'pastel-register.css',
    'forest-register.css',
    'deco-register.css',
    'blueprint-register.css',
    'nostromo-register.css',
    'dark-register.css',
    'formal-register.css',
    'solstice-register.css',
];

/**
 * The review site's shell, on request [scope-31]. The ten pages are fixed pages
 * of the catalogue's navigation, which links them with `?review`; opened that
 * way they carry what a research demo carries — the side navigation, the
 * theme menu and the prompt bars — so a reviewer can move on from them. Opened
 * without it they are the documentation site's pages as before: that site does
 * not publish catalogue/, and a page that loaded it unasked would report a
 * broken shell there, and would no longer write the classes its React twin
 * writes (tests/examples.spec.mjs, AR20). Classic, so it runs before the
 * module scripts; the three files load after the page's own.
 */
export const REVIEW_SHELL = `<script>
            if (new URLSearchParams(location.search).has('review')) {
                var sheet = document.createElement('link');
                sheet.rel = 'stylesheet';
                sheet.href = '../catalogue/catalogue.css';
                document.head.append(sheet);
                var check = document.createElement('script');
                check.src = '../catalogue/boot-check.js';
                document.body.append(check);
                var shell = document.createElement('script');
                shell.type = 'module';
                shell.src = '../catalogue/catalogue.js';
                document.body.append(shell);
            }
        </script>`;
