// Measuring a stamp pseudo-element's text, once [G4].
//
// A register prints the dossier's stamp with `content: attr(data-kp-label)`
// on a `::before`. Chromium resolves that in the computed style and hands
// back the quoted string; firefox reports the `attr()` function
// unevaluated. Eleven register suites therefore accepted the literal
// `attr(data-kp-label)` as a valid answer — which is exactly what firefox
// also reports for a rule naming the WRONG attribute, for one on an
// element that carries no such attribute, and for one whose stamp is
// never painted at all. In firefox those assertions proved nothing.
//
// This file exists for the same reason tests/ring.mjs does: eleven copies
// of a fiddly browser-difference workaround drift apart, and AR30 is
// about that one layer down.
//
// The firefox answer is taken from the paint rather than the declaration
// [KT13]: the attribute is removed and put back, and the geometry the
// pseudo-element occupies has to collapse and return. Two footprints are
// measured because a register may lay its stamp out either way — its own
// used width and height (a `display: block` or absolutely positioned
// stamp reports them; an inline one reports `auto`), and the host's
// layout around it (the card's height and where its first child sits,
// which is what moves when an inline stamp appears and disappears).
//
// Measured 2026-09-08: firefox does not re-evaluate `attr()` when the
// attribute's VALUE changes, only when it is added or removed — so
// lengthening the value is not a usable signal there, and removal is.

/**
 * What a stamp pseudo-element actually prints, and whether the paint
 * proves it.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector the element carrying the pseudo-element
 * @param {string} pseudo `'::before'` or `'::after'`
 * @param {string} attribute the attribute the register's `attr()` names
 * @returns {Promise<{ text: string|null, resolved: boolean, painted: boolean, raw: string, footprint: number[], without: number[] }>}
 */
export function stampContent(page, selector, pseudo, attribute) {
    return page.evaluate(
        async ([sel, part, attr]) => {
            const el = /** @type {HTMLElement} */ (document.querySelector(sel));
            if (!el) throw new Error(`no element matches ${sel}`);
            const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            /** Everything the stamp's own box can move, in one vector. */
            const footprint = () => {
                const style = getComputedStyle(el, part);
                const host = el.getBoundingClientRect();
                const first = el.firstElementChild?.getBoundingClientRect();
                return [
                    Number.parseFloat(style.width) || 0,
                    Number.parseFloat(style.height) || 0,
                    Math.round(host.width),
                    Math.round(host.height),
                    first ? Math.round(first.top - host.top) : 0,
                    first ? Math.round(first.left - host.left) : 0,
                ];
            };
            const unquote = (/** @type {string} */ value) => value.replace(/^"/, '').replace(/"$/, '');
            const raw = getComputedStyle(el, part).content;
            const resolved = Boolean(raw) && raw !== 'none' && raw !== 'normal' && !raw.includes('attr(');

            // The rule has to name THIS attribute before its value can be
            // the answer; anything else is a failure the caller must see.
            const names = new RegExp(`attr\\(\\s*${attr}\\s*[),]`).test(raw);
            const value = el.getAttribute(attr);
            if (!resolved && (!names || value === null)) {
                return { raw, text: resolved ? unquote(raw) : null, resolved, painted: false, footprint: footprint(), without: [] };
            }

            const differs = (/** @type {number[]} */ a, /** @type {number[]} */ b) => a.some((n, i) => Math.abs(n - b[i]) > 1);
            /** Change the attribute, measure, put it back, measure again. */
            const perturb = async (/** @type {string|null} */ to) => {
                if (to === null) el.removeAttribute(attr);
                else el.setAttribute(attr, to);
                await frame();
                const changed = footprint();
                el.setAttribute(attr, /** @type {string} */ (value ?? ''));
                await frame();
                return { changed, back: footprint() };
            };

            await frame();
            const present = footprint();
            // A longer value first: it moves the pseudo-element's own used
            // width wherever the register gives it one. Then removal, which
            // is the only signal an inline stamp offers (its own width is
            // `auto`) and the only one firefox honours for the host's
            // layout.
            const longer = await perturb(`${value} WIDERWIDERWIDERWIDERWIDER`);
            const followed = (/** @type {{ changed: number[], back: number[] }} */ run) =>
                differs(present, run.changed) && !differs(present, run.back);
            if (followed(longer)) {
                return { raw, text: resolved ? unquote(raw) : value, resolved, painted: true, footprint: present, without: longer.changed };
            }
            const gone = await perturb(null);
            return { raw, text: resolved ? unquote(raw) : value, resolved, painted: followed(gone), footprint: present, without: gone.changed };
        },
        [selector, pseudo, attribute],
    );
}

/**
 * The one assertion the eleven suites want: the word the stamp prints,
 * proved to be painted and proved to come from `attribute`.
 *
 * Throws with what was measured, so a failure says whether the rule is
 * missing, names another attribute, or paints nothing.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} pseudo
 * @param {string} attribute
 * @returns {Promise<string>}
 */
export async function stampWord(page, selector, pseudo, attribute) {
    const found = await stampContent(page, selector, pseudo, attribute);
    if (!found.painted || found.text === null) {
        throw new Error(
            `${selector}${pseudo} paints no stamp driven by ${attribute}: content=${found.raw}, ` +
                `with=[${found.footprint}], without=[${found.without}], text=${found.text}`,
        );
    }
    return found.text;
}
