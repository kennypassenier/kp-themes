// The React channel of the example pages, mounted for the browser tests.
//
// Bundled by esbuild in the Playwright global setup rather than shipped:
// this package has no build step of its own (T5), and a fixture is not a
// reason to grow one. Which page is asked for in the query string, so one
// bundle serves all ten.

import { createRoot } from 'react-dom/client';
import { ExamplePage } from '../../showcase/examples-react.jsx';

const id = new URLSearchParams(window.location.search).get('example') ?? 'app-shell';
const mount = document.getElementById('react-mount');
if (mount) createRoot(mount).render(<ExamplePage id={id} />);
