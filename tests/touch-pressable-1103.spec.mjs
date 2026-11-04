// HTTPSwitchboard, 03/11/2026 [touch-1103]: what a finger can PRESS, not what the box measures. Under a coarse pointer the skip link
// (40 px when it shows on focus) stands 44 px high (touch-target.css) and a share bar's segments (8-20 px high) take an invisible 44 px high area (touch-hit-small.css);
// a plain segmented item keeps the 44 px it already had. Measured as the points of the part's middle lines that
// `document.elementFromPoint` lands on the part (or its descendants), in five registers.
// [touch-1104] adds the brand of a folding bar (chassis-rs shell: it ellipsizes, so it clips, which cut its area to the 30 px box) and the tab, in all 12 themes.
// The brand's area is anchored from outside its clip, so its look is clipped exactly as before: its overflow stays `hidden` and the area paints nothing.

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
const ALL_THEMES = ['blueprint', 'brutalism', 'cyberpunk', 'dark', 'deco', 'forest', 'formal', 'nostromo', 'pastel', 'solstice', 'synthwave', 'titanium'];
const SHELL_BAR = '<div class="kp-nav-wrap"><nav class="kp-nav" data-kp-nav-fold aria-label="Shell"><a class="kp-nav__brand" id="shell-brand" href="/">Kitchen</a><ul class="kp-nav__links"></ul></nav></div>';
const TABS_ROW = '<div class="kp-tabs"><div class="kp-tablist" role="tablist"><a class="kp-tab" id="shell-tab" role="tab" aria-selected="true" href="#a">Overview</a><a class="kp-tab" role="tab" aria-selected="false" href="#b">Logs</a></div></div>';

/** Put a fixture over the documentation's own header, which stands over the top of the page. */
async function lift(page, theme, html) {
    await page.evaluate(({ name, markup }) => {
        document.documentElement.dataset.theme = name;
        document.body.insertAdjacentHTML('afterbegin', `<div id="lifted">${markup}</div>`);
        const box = document.getElementById('lifted');
        box.style.setProperty('position', 'relative');
        box.style.setProperty('z-index', '9999');
        box.style.setProperty('padding-block', '60px');
    }, { name: theme, markup: html });
}

for (const theme of ALL_THEMES) {
    for (const width of [390, 700]) {
        test(`the brand of a folding bar presses 44 px high under a coarse pointer and keeps its clip in ${theme} at ${width} px [touch-1104]`, { tag: ['@component:navigation'] }, async ({ browser }) => {
            const context = await browser.newContext({ viewport: { width, height: 800 }, hasTouch: true, isMobile: true });
            const page = await context.newPage();
            await page.goto('/site/components/nav-bar.html');
            await lift(page, theme, SHELL_BAR);
            const brand = await pressableOf(page, '#shell-brand');
            expect(brand.boxH).toBeLessThan(40);
            expect(brand.h).toBeGreaterThanOrEqual(43.5);
            // The look is the clipped one: overflow stays hidden with no clip margin, and the area paints nothing (the bar with and without it is the same picture).
            const clip = await page.evaluate(() => { const style = getComputedStyle(document.getElementById('shell-brand')); return { overflow: style.overflow, margin: style.overflowClipMargin }; });
            expect(clip.overflow).toBe('hidden');
            expect(clip.margin).toBe('0px');
            const bar = page.locator('#lifted');
            const withArea = await bar.screenshot();
            await page.addStyleTag({ content: '#shell-brand::after { content: none !important; }' });
            expect((await bar.screenshot()).equals(withArea)).toBe(true);
            await context.close();
        });
    }

    test(`a tab, button or anchor, presses 44 px high under a coarse pointer and its own box under a mouse in ${theme} [touch-1104]`, { tag: ['@component:navigation'] }, async ({ browser }) => {
        const touch = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
        const page = await touch.newPage();
        await page.goto('/site/components/tabs.html');
        await lift(page, theme, TABS_ROW);
        const anchor = await pressableOf(page, '#shell-tab');
        const button = await pressableOf(page, '#doc-tab-0');
        for (const tab of [anchor, button]) {
            expect(tab.h).toBeGreaterThanOrEqual(43.5);
        }
        await touch.close();
        const mouse = await browser.newContext({ viewport: { width: 390, height: 800 } });
        const fine = await mouse.newPage();
        await fine.goto('/site/components/tabs.html');
        await lift(fine, theme, TABS_ROW);
        for (const id of ['#shell-tab', '#doc-tab-0']) {
            const plain = await pressableOf(fine, id);
            expect(plain.h).toBeLessThanOrEqual(plain.boxH + 1);
        }
        await mouse.close();
    });
}
