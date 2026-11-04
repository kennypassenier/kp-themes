// HTTPSwitchboard, 03/11/2026 [touch-1103]: what a finger can PRESS, not what the box measures. Under a coarse pointer the skip link
// (40 px when it shows on focus) stands 44 px high (touch-target.css) and a share bar's segments (8-20 px high) take an invisible 44 px high area (touch-hit-small.css);
// a plain segmented item keeps the 44 px it already had. Measured as the points of the part's middle lines that
// `document.elementFromPoint` lands on the part (or its descendants), in five registers.
// [touch-1104] adds the brand of a folding bar (chassis-rs shell: it ellipsizes, so it clips, which cut its area to the 30 px box) and the tab.

import { test, expect } from '@playwright/test';

// titanium, cyberpunk and dark cut the bar with a clip-path, which clipped the area to the bar's own box (28 px in titanium, 12 in the other two).
const THEMES = ['formal', 'titanium', 'nostromo', 'cyberpunk', 'dark'];

/** Count the points along a line through the part's middle that land on the part. */
async function pressable(page, theme) {
    await page.goto('/site/components/stackbar.html');
    await page.evaluate((name) => { document.documentElement.dataset.theme = name; }, theme);
    return page.evaluate(async () => {
        const measure = async (el) => {
            el.scrollIntoView({ block: 'center' });
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const box = el.getBoundingClientRect();
            const onIt = (x, y) => { const hit = document.elementFromPoint(x, y); return Boolean(hit && el.contains(hit)); };
            let w = 0;
            let h = 0;
            for (let x = box.left - 40; x <= box.right + 40; x += 0.5) if (onIt(x, box.y + box.height / 2)) w += 0.5;
            for (let y = box.top - 40; y <= box.bottom + 40; y += 0.5) if (onIt(box.x + box.width / 2, y)) h += 0.5;
            return { boxW: box.width, boxH: box.height, w, h };
        };
        const seg = [...document.querySelectorAll('.kp-stackbar__seg')].find((el) => el.getBoundingClientRect().width > 100 && el.getBoundingClientRect().height <= 20);
        const link = document.createElement('a');
        link.className = 'kp-skip-link';
        link.href = '#top';
        link.textContent = 'Skip to content';
        document.body.prepend(link);
        link.focus();
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { seg: await measure(seg), skip: await measure(link) };
    });
}

for (const theme of THEMES) {
    test(`a share bar segment and the skip link press 44 px high under a coarse pointer in ${theme} [touch-1103]`, { tag: ['@component:button'] }, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
        const page = await context.newPage();
        const { seg, skip } = await pressable(page, theme);
        expect(seg.boxH).toBeLessThanOrEqual(20);
        expect(seg.h).toBeGreaterThanOrEqual(43);
        expect(seg.w).toBeLessThanOrEqual(seg.boxW + 1);
        expect(skip.boxH).toBeGreaterThanOrEqual(43.5);
        expect(skip.h).toBeGreaterThanOrEqual(43);
        await context.close();
    });

    test(`under a mouse a share bar segment presses only its own box in ${theme} [touch-1103]`, { tag: ['@component:button'] }, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: 390, height: 800 } });
        const page = await context.newPage();
        const { seg } = await pressable(page, theme);
        expect(seg.h).toBeLessThanOrEqual(seg.boxH + 1);
        await context.close();
    });
}

/** What a finger can press on `selector` at the middle of its box, along both middle lines. */
async function pressableOf(page, selector) {
    return page.evaluate(async (sel) => {
        const el = document.querySelector(sel);
        el.scrollIntoView({ block: 'center' });
        await new Promise((resolve) => setTimeout(resolve, 150));
        const box = el.getBoundingClientRect();
        const onIt = (x, y) => { const hit = document.elementFromPoint(x, y); return Boolean(hit && el.contains(hit)); };
        let h = 0;
        for (let y = box.top - 40; y <= box.bottom + 40; y += 0.5) if (onIt(box.x + box.width / 2, y)) h += 0.5;
        return { boxH: box.height, h };
    }, selector);
}

// [touch-1104] the chassis-rs shell's bar: a folding bar without a toggle, whose brand clips for its ellipsis.
const BRAND_THEMES = ['formal', 'nostromo', 'blueprint', 'forest', 'pastel'];
for (const theme of BRAND_THEMES) {
    test(`the brand of a folding bar presses 44 px high under a coarse pointer in ${theme} [touch-1104]`, { tag: ['@component:navigation'] }, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
        const page = await context.newPage();
        await page.goto('/site/components/nav-bar.html');
        await page.evaluate((name) => {
            document.documentElement.dataset.theme = name;
            document.body.insertAdjacentHTML('afterbegin', '<div class="kp-nav-wrap"><nav class="kp-nav" data-kp-nav-fold aria-label="Shell"><a class="kp-nav__brand" id="shell-brand" href="/">Kitchen</a><ul class="kp-nav__links"></ul></nav></div>');
            // The documentation's own header stands over the top of the page: lift the fixture bar over it.
            const wrap = document.querySelector('body > .kp-nav-wrap');
            wrap.style.setProperty('position', 'relative');
            wrap.style.setProperty('z-index', '9999');
        }, theme);
        const brand = await pressableOf(page, '#shell-brand');
        expect(brand.boxH).toBeLessThan(40);
        expect(brand.h).toBeGreaterThanOrEqual(43.5);
        await context.close();
    });
}

for (const theme of ['formal', 'nostromo', 'pastel', 'dark', 'deco']) {
    test(`a tab presses 44 px high under a coarse pointer and its own box under a mouse in ${theme} [touch-1104]`, { tag: ['@component:navigation'] }, async ({ browser }) => {
        const touch = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
        const page = await touch.newPage();
        await page.goto('/site/components/tabs.html');
        await page.evaluate((name) => { document.documentElement.dataset.theme = name; }, theme);
        const tab = await pressableOf(page, '#doc-tab-0');
        expect(tab.boxH).toBeLessThan(44);
        expect(tab.h).toBeGreaterThanOrEqual(43.5);
        await touch.close();
        const mouse = await browser.newContext({ viewport: { width: 390, height: 800 } });
        const fine = await mouse.newPage();
        await fine.goto('/site/components/tabs.html');
        await fine.evaluate((name) => { document.documentElement.dataset.theme = name; }, theme);
        const plain = await pressableOf(fine, '#doc-tab-0');
        expect(plain.h).toBeLessThanOrEqual(plain.boxH + 1);
        await mouse.close();
    });
}
