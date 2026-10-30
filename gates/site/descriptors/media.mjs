// Page descriptor for the "media" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const mediaDescriptor = {
        id: 'media',
        title: 'Media',
        group: 'Content',
        classes: ['kp-media', 'kp-media-figure'],
        exports: [],
        intro: 'A frame for a picture or a video that has its final shape before the picture arrives, so the text below it does not jump when the bytes land.',
        whenToUse:
            'Wherever a page shows an image whose size it does not control — a hero, a card’s thumbnail, an avatar. Not for a decorative background, which is a background. Not for an icon, which has one size and needs no frame.',
        examples: [
            {
                title: 'A hero that holds its space',
                why: 'The ratio is on the frame and the fit is on the image, so the page is the right shape at the first paint and the picture fills that shape rather than stretching to it. The caption over the picture has a darkening ground under it, because the picture belongs to you and can be any brightness.',
                markup: `
<figure class="kp-media-figure">
<div class="kp-media kp-media--wide">
<img src="/hero.jpg" alt="" />
<p class="kp-media__overlay">Where this was taken</p>
</div>
<figcaption>And what it shows</figcaption>
</figure>
`,
            },
        ],
        variants: [
            { name: '.kp-media--wide', what: '21/9, for a hero that spans the page.' },
            { name: '.kp-media--square', what: '1/1, for a grid of thumbnails.' },
            { name: '.kp-media--portrait', what: '3/4, for a person.' },
            { name: '--kp-media-ratio', what: 'Any other shape. Default 16/9.' },
            { name: '--kp-media-fit', what: 'cover by default — the picture fills the frame and is cropped. `contain` fits it whole, with the frame’s ground showing around it.' },
            { name: '--kp-media-position', what: 'Which part survives the crop. Default the middle; `50% 20%` keeps heads in the frame.' },
            { name: '.kp-media__overlay', what: 'Text on the picture, with a gradient under it. Its ink and its ground are knobs for a consumer who knows their own picture.' },
        ],
        accessibility: [
            'Yours — every image needs alt text, and a decorative one needs an empty alt rather than none.',
            'Yours — a caption that repeats the alt text is read twice. Say different things, or leave one out.',
            'Built in — the frame keeps its shape before and after loading, so nothing the reader is looking at moves under them.',
        ],
    };
