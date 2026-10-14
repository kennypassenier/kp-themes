// research/sidenav-opener: says so when the system asks for reduced motion.
const note = document.querySelector('[data-so-motion]');
if (note instanceof HTMLElement && matchMedia('(prefers-reduced-motion: reduce)').matches) note.hidden = false;
