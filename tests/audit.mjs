// The three faults a rendered page is audited for, in one place [TH99].
//
// Extracted so two suites can measure the same three things and mean the
// same three things by them: tests/overflow.spec.mjs walks the eleven
// example pages under no theme at all, and tests/reflow.spec.mjs walks
// the twenty-five concept pages with their registers loaded, at the two
// narrow widths. Two copies of this audit would drift, and a drifted
// copy reports a fault the other suite would have called clean.
//
// The drills that won each of the three checks are recorded where they
// were run, in tests/overflow.spec.mjs.

/**
 * The containers whose children are the page's own blocks.
 *
 * Not every element with two children: a card's header and its body
 * touch on purpose, and a table row's cells are not blocks. The rhythm
 * rule is about what a page AUTHOR stacks — which is what the chassis kit
 * got wrong — so it is measured on the layout containers a page author
 * composes with, and nowhere else. A component's internals are that
 * component's business.
 */
export const BLOCK_CONTAINERS = 'main, article, form, .kp-page, .kp-stack, .kp-section, .kp-prose';

/**
 * Audit one rendered document. Returns a flat list of findings, each
 * naming its fault so a red run says which of the three it is.
 *
 * The three faults are switchable, and that is not decoration: each one
 * has to be shown able to fail ON ITS OWN, and a page broken badly enough
 * to scroll sideways usually trips all three at once. The gate always
 * runs all three; a drill runs one.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{minGap: number, containers: string, faults?: string[]}} options
 * @returns {Promise<Array<{fault: string, where: string, detail: string}>>}
 */
export const audit = (page, { faults = ['page-scroll', 'overflow', 'rhythm'], ...rest }) =>
    page.evaluate(
        ({ minGap, containers, faults }) => {
            const on = new Set(faults);
            /** @type {Array<{fault: string, where: string, detail: string}>} */
            const found = [];

            /** @param {Element} el */
            const name = (el) => {
                const classes = typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
                return `${el.tagName.toLowerCase()}${classes}`;
            };

            /** @param {Element} el */
            const scrolls = (el) => {
                const overflow = getComputedStyle(el).overflowX;
                return overflow === 'auto' || overflow === 'scroll' || overflow === 'hidden';
            };

            /** @param {Element} el */
            const laidOut = (el) => {
                const style = getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden') return false;
                if (style.position === 'fixed' || style.position === 'absolute') return false;
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            };

            // (a) The document itself must not scroll sideways.
            const doc = document.documentElement;
            if (on.has('page-scroll') && doc.scrollWidth > doc.clientWidth + 1) {
                found.push({
                    fault: 'page-scroll',
                    where: 'document',
                    detail: `scrollWidth ${doc.scrollWidth} against clientWidth ${doc.clientWidth}`,
                });
            }

            // (b) Nothing wider than the box that holds it, and nothing whose
            //     own content spills out of it. A scroll region is exempt in
            //     both directions: that is what it is for.
            for (const el of on.has('overflow') ? document.body.querySelectorAll('*') : []) {
                if (['SCRIPT', 'STYLE', 'TEMPLATE', 'BR', 'HEAD'].includes(el.tagName)) continue;
                if (el.closest('[popover], dialog')) continue;
                if (!laidOut(el)) continue;

                const parent = el.parentElement;
                if (parent && parent !== document.documentElement && !scrolls(parent)) {
                    const rect = el.getBoundingClientRect();
                    const box = parent.getBoundingClientRect();
                    const over = Math.max(rect.right - box.right, box.left - rect.left);
                    if (over > 1) {
                        found.push({
                            fault: 'overflow',
                            where: `${name(el)} inside ${name(parent)}`,
                            detail: `wider than its container by ${Math.round(over)}px`,
                        });
                    }
                }
                if (!scrolls(el) && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
                    found.push({
                        fault: 'overflow',
                        where: name(el),
                        detail: `content ${el.scrollWidth} wide in a box of ${el.clientWidth}`,
                    });
                }
            }

            // (c) Two consecutive blocks may not touch.
            for (const container of on.has('rhythm') ? document.querySelectorAll(containers) : []) {
                // Blocks only: two inline siblings that wrap onto consecutive
                // lines (the concept lede's two marks, on CI's fonts at 320px)
                // are the line box's business, not a rhythm fault.
                const children = [...container.children].filter(
                    (child) =>
                        !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(child.tagName) &&
                        laidOut(child) &&
                        !getComputedStyle(child).display.startsWith('inline') &&
                        getComputedStyle(child).display !== 'contents',
                );
                for (let i = 1; i < children.length; i++) {
                    const above = children[i - 1].getBoundingClientRect();
                    const below = children[i].getBoundingClientRect();
                    // Only a stacked pair: two controls side by side in a row
                    // overlap vertically and are not a rhythm question.
                    if (below.top < above.bottom - 0.5) continue;
                    // A divider between surfaces IS the rhythm there (a tear that
                    // touches both grounds, or a step of space under a quiet
                    // theme); the pair on either side of it is not a fault.
                    if (children[i - 1].hasAttribute('data-kp-divider') || children[i].hasAttribute('data-kp-divider')) continue;
                    const gap = below.top - above.bottom;
                    if (gap < minGap) {
                        found.push({
                            fault: 'rhythm',
                            where: `${name(children[i - 1])} above ${name(children[i])} in ${name(container)}`,
                            detail: `${gap.toFixed(1)}px between them, under ${minGap}`,
                        });
                    }
                }
            }

            return found;
        },
        { ...rest, faults },
    );

/** @param {Array<{fault: string, where: string, detail: string}>} found */
export const report = (found) => found.map((f) => `  [${f.fault}] ${f.where}: ${f.detail}`).join('\n');
