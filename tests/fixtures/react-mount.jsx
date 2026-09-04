// The React channel, mounted the way a consumer mounts it.
//
// Bundled by esbuild in the Playwright global setup rather than shipped:
// this package has no build step of its own (T5), and a fixture is not a
// reason to grow one.

import { createRoot } from 'react-dom/client';
import ThemeSwitcher from '../../components/theme-switcher.jsx';

createRoot(document.getElementById('react-mount')).render(<ThemeSwitcher />);
