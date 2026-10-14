// research/sidenav-minor: says so when the system asks for reduced motion.
const note = document.querySelector('[data-mn-motion]');
if (note instanceof HTMLElement && matchMedia('(prefers-reduced-motion: reduce)').matches) note.hidden = false;

// A frame names the scene it is playing; it is shown under that frame's window.
addEventListener('message', (event) => {
    if (event.data?.type !== 'mn-scene') return;
    for (const frame of document.querySelectorAll('iframe.mn-window')) {
        if (!(frame instanceof HTMLIFrameElement) || frame.contentWindow !== event.source) continue;
        const now = frame.closest('figure')?.querySelector('[data-mn-now]');
        if (now) now.textContent = String(event.data.words);
    }
});
