// The React half of the nav-toggle fixture [AR7, rule 7g].
//
// The same bar as the framework-free half, with the same two links and
// the same test names prefixed `react-`, so one suite drives both and a
// difference between the channels fails rather than passes quietly.
//
// The component wires its own button and marks it `data-kp-nav-owner`
// [AR29], so js/auto.js leaves it alone — the fault this guards against
// shipped once already, when two channels re-armed each other's state.

import { createRoot } from 'react-dom/client';
import NavBar from '../../components/nav-bar.jsx';

const LINKS = [
    { href: '#a', label: 'One' },
    { href: '#b', label: 'Two' },
];

createRoot(document.getElementById('react-nav')).render(
    <NavBar
        brand="kp-themes"
        links={LINKS}
        collapsible
        skipLink={false}
        data-test="react-nav"
        classNames={{ list: 'react-links', toggle: 'react-toggle' }}
    />,
);
