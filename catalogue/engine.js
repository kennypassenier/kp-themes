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

/* ------------------------------------------------------------ pixel ratio */

// The device pixel ratio a block is read at (fix-34, Kenny 2026-09-15: his
// browser's zoom by default is not 100%, and his verdicts stay valid). Gecko
// resolves a border width to whole device pixels, so a 3px border computes to
// 2.4px at a ratio of 1.25 and the block's hash follows the ratio; the
// verdict keeps the ratio it was read at, and the tools read it there
// (gates/verdicts.mjs, `layout.css.devPixelsPerPx`).
//
// What the hash sees decides, so a probe reads it: a border narrower than a
// device pixel is drawn one device pixel wide, and its computed width is one
// over the ratio. In Gecko the probe decides, also where `devicePixelRatio`
// is pinned to 1 (a fingerprinting guard). Blink draws such a border one CSS
// pixel wide at any ratio; there `devicePixelRatio` stands in. Rounded to three decimals: Gecko
// keeps a ratio as 60 app units over a whole number of them (110% zoom is
// 60/55, 1.091), and three decimals give that number back.

/** A ratio as the register writes it: three decimals. */
export const roundRatio = (ratio) => Math.round(Number(ratio) * 1000) / 1000;

/** The device pixel ratio a block's borders resolve at in this document, now. */
export function readPixelRatio(doc = document) {
    const probe = doc.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;border:0 solid;border-left-width:0.01px';
    doc.body.append(probe);
    const width = parseFloat(getComputedStyle(probe).borderLeftWidth);
    probe.remove();
    if (ENGINE === 'firefox') return roundRatio(width > 0 ? 1 / width : 1);
    return roundRatio(typeof devicePixelRatio === 'number' && devicePixelRatio > 0 ? devicePixelRatio : 1);
}
