// research/sidenav-edge: says so when the system asks for reduced motion.
const note = document.querySelector('[data-se-motion]');
if (note instanceof HTMLElement && matchMedia('(prefers-reduced-motion: reduce)').matches) note.hidden = false;
