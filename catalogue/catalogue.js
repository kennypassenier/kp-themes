// What every catalogue page loads: the shell (catalogue-shell.js) and the scripts the blocks' demos run on
// (demos.js, motion-demo.js). The imports keep the order the shell had when it imported the demos itself, so every
// module is evaluated exactly as before; the Agenda loads the shell alone (agenda.js brings the demo scripts when it
// lays blocks out, Kenny 2026-10-19: "247 is nog altijd belachelijk veel?").
import '../js/theme-registry.js';
import '../js/theme-core.js';
import '../js/remember.js';
import '../js/theme-picker.js';
import '../js/lazy-register.js';
import './pages.js';
import './review-state.js';
import './judging.js';
import './prompt.js';
import './demos.js';
import './motion-demo.js';
import './catalogue-shell.js';
