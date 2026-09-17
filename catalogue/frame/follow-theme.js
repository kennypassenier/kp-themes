// A frame that shows a component in a window of its own size wears the theme
// of the page it sits in, and follows it when that page switches. It reads the
// parent's root attribute rather than storage: a compare column wears its own
// theme, which it never stores (compare.js), and the frame inside it must wear
// that one. Nothing is written back.
const own = document.documentElement;
let parent = null;
try {
    parent = window.parent !== window ? window.parent.document.documentElement : null;
} catch {
    parent = null; // another origin: the frame keeps the theme it was written with
}
if (parent) {
    const follow = () => {
        const theme = parent.getAttribute('data-theme');
        if (theme && own.getAttribute('data-theme') !== theme) own.setAttribute('data-theme', theme);
    };
    follow();
    new MutationObserver(follow).observe(parent, { attributes: true, attributeFilter: ['data-theme'] });
}
