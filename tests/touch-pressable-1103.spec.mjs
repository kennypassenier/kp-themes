// HTTPSwitchboard, 03/11/2026 [touch-1103]: what a finger can PRESS, not what the box measures. Under a coarse pointer the skip link
// (40 px when it shows on focus) stands 44 px high (touch-target.css) and a share bar's segments (8-20 px high) take an invisible 44 px high area (touch-hit-small.css);
// a plain segmented item keeps the 44 px it already had. Measured as the points of the part's middle lines that
// `document.elementFromPoint` lands on the part (or its descendants), in five registers.

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
