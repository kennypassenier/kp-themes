// The React half of the shrinking-header fixture [scope-48 wave 2, AR7].
//
// The same bar as tests/fixtures/nav-sticky.html, the same test hooks, so
// one suite drives both channels and a difference between them fails
// rather than passes quietly.

import { createRoot } from 'react-dom/client';
import NavBar from '../../components/nav-bar.jsx';

const LINKS = [
    { href: '#target', label: 'Target' },
    { href: '#b', label: 'Two' },
];

createRoot(document.getElementById('react-nav')).render(
    <NavBar
        brand="kp-themes"
        links={LINKS}
        sticky
        skipTo="#target"
        skipLabel="Skip to the content"
        data-test="nav"
        wrapClassName="react-wrap"
        classNames={{ skip: 'react-skip' }}
    />,
);
