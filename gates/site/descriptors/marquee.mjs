// Page descriptor for the "marquee" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const marqueeDescriptor = {
        id: 'marquee',
        title: 'Marquee',
        group: 'Feedback',
        classes: ['kp-marquee'],
        exports: ['Marquee'],
        aliases: ['marquee', 'paused'],
        intro: 'A row of short items that a theme may run across the page — a tape of figures, a strip of headlines, a band of names. The consumer writes the items once; the theme decides whether they move at all.',
        whenToUse:
            'For a row of small, equal things nobody has to read in order: prices, statuses, credits. Not for anything a reader must act on or find again — a moving target is the hardest thing on a page to click — and not as a substitute for a heading. A theme that has no answer leaves the row standing still, which must still make sense.',
        examples: [
            {
                title: 'A row a theme may run',
                why: 'The consumer writes the items once. The effects module builds the track, doubles the row so the pass is seamless and hides the copy from a screen reader; a page without the module shows the row standing still.',
                markup: `
<div class="kp-marquee" data-kp-marquee>
    <span>KP 412.75 +1.9%</span>
    <span>THEME 98.20 -0.4%</span>
    <span>REG25 1 240.00 +3.2%</span>
</div>
`,
            },
            {
                title: 'What the module builds from it',
                why: 'Written out so a consumer who renders it server-side, or who does not load the module at all, can produce the same thing by hand. The second run is the copy; it carries aria-hidden so the items are announced once.',
                markup: `
<div class="kp-marquee" data-kp-marquee data-kp-marquee-ready data-kp-marquee-runs="2">
    <div data-kp-marquee-track>
        <div data-kp-marquee-run><span>KP 412.75 +1.9%</span></div>
        <div data-kp-marquee-run aria-hidden="true"><span>KP 412.75 +1.9%</span></div>
    </div>
</div>
`,
            },
            {
                title: 'A consumer overriding the speed',
                why: 'The two knobs ride as custom properties, so overriding one leaves the theme’s value for the other: one is the time a full pass takes, the other is whether the row rests while it is off screen.',
                markup: `
<div class="kp-marquee" data-kp-marquee style="--kp-marquee: 20000ms">
    <span>Slower or faster, without leaving the theme</span>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-marquee', what: 'The row itself. Everything else is written by the module, or by a consumer who renders the same markup server-side.' },
            { name: 'data-kp-marquee-track', what: 'The element that moves: both runs sit inside it, so one -50% pass lands exactly where it started.' },
            { name: 'data-kp-marquee-run', what: 'One run of the items. There are two; the second carries aria-hidden.' },
            { name: 'data-kp-marquee-ready', what: 'Written on the row once the module has built it. A theme keys its animation on this, so a page without the module never shows a half-built band.' },
            { name: 'data-kp-marquee-runs', what: 'How many runs the track holds. Two today; a theme that needs a different pass distance can read it.' },
            { name: 'data-kp-paused', what: 'Written while the row sits outside the viewport, so the animation rests and resumes where it stood. A theme that asks never to rest never sees it.' },
        ],
        accessibility: [
            'Built in — the copy of the row is aria-hidden, so a screen reader announces the items once, not twice.',
            'Built in — the whole band stands still under `prefers-reduced-motion: reduce`, in every theme.',
            'Built in — the loop rests while the band is off screen, unless the theme asks it never to.',
            'Yours — keep the items short and repeat nothing a reader must act on. A moving row is scenery, not navigation.',
            'Yours — give the band a label only if it means something on its own; unlabelled scenery is better than a landmark nobody wants.',
        ],
    };
