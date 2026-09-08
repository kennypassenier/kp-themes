// The React channel of the example pages, mounted for the browser tests.
//
// Bundled by esbuild in the Playwright global setup rather than shipped:
// this package has no build step of its own (T5), and a fixture is not a
// reason to grow one. Which page is asked for in the query string, so one
// bundle serves all ten.

import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ExamplePage } from '../../showcase/examples-react.jsx';
import { attachAll } from '../../js/auto.js';

const query = new URLSearchParams(window.location.search);
const id = query.get('example') ?? 'app-shell';
// Which theme's words the concept demo wears [S49, A1]: the
// framework-free channel has one file per theme, this one takes a query.
const copy = query.get('copy') ?? undefined;
const mount = document.getElementById('react-mount');
if (mount) {
    const root = createRoot(mount);
    // flushSync, not requestAnimationFrame: a frame is not a promise that
    // React has committed, and under load it is not one either -- that
    // read as a flake in chromium once. This renders synchronously, so the
    // tree exists on the next line.
    flushSync(() => root.render(<ExamplePage id={id} copy={copy} />));
    // The descriptors are markup, not React components, so the behaviour
    // on these pages comes from the framework-free modules in both
    // channels — a React consumer using the CSS shapes attaches them the
    // same way. js/auto.js runs on DOMContentLoaded, which is before
    // React has rendered anything, so this page attaches again once the
    // tree exists. Without it the wizard example had no aria-current in
    // the React channel and AR20 scored the two channels as different
    // [2026-09-07].
    attachAll(mount);
}
