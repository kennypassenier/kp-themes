// Which browser engine this page runs in. A verdict is given per engine as
// well as per block and theme (Kenny, 2026-09-13: "er moet ook een verschil
// zijn tussen firedragon en chrome approved, dat zijn afzonderlijke testen"),
// and it is measured, never asked ("ik moet als user daar niks voor doen").
//
//   firefox   Gecko: Firefox, FireDragon, LibreWolf …
//   chromium  Blink: Chrome, Chromium, Edge, Brave, Opera …
//   webkit    WebKit without Blink: Safari, Epiphany …
//
// Blink is told by its client hints first, which survive the reduced user
// agent string; Gecko by the `Gecko/<date>` plus `Firefox/` pair every Gecko
// browser keeps. Anything else is named for what it says it is, never lumped
// in with one of the three.

/** @type {Record<string, string>} */
export const ENGINE_LABELS = { firefox: 'Firefox', chromium: 'Chromium', webkit: 'WebKit' };

/**
 * @param {{ userAgent: string, userAgentData?: { brands?: { brand: string }[] } }} [nav]
 * @returns {string}
 */
export function detectEngine(nav = navigator) {
    const brands = nav.userAgentData?.brands?.map((b) => b.brand) ?? [];
    if (brands.some((brand) => /chromium/i.test(brand))) return 'chromium';
    const ua = nav.userAgent ?? '';
    if (/\bGecko\/\d/.test(ua) && /\bFirefox\//.test(ua)) return 'firefox';
    if (/\b(Chrome|Chromium|CriOS|Edg)\//.test(ua)) return 'chromium';
    if (/\bAppleWebKit\//.test(ua)) return 'webkit';
    // Named for what it is, so it is its own verdict rather than someone else's.
    const name =
        /^[^/\s]+/
            .exec(ua)?.[0]
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '') ?? '';
    return name && name !== 'mozilla' ? name : 'unknown';
}

export const ENGINE = detectEngine();

export const engineLabel = (engine) => ENGINE_LABELS[engine] ?? engine;
