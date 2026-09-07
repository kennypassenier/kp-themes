// The React half of the container-query fixture [TH104, AR31].
//
// The same four hosts as the framework-free half of container.html, with
// the same data-test names prefixed `react-`, so one suite drives both
// and a difference between the channels shows up as a failure rather
// than as a shrug [AR7, standing rule 7g].

import { createRoot } from 'react-dom/client';
import NavBar from '../../components/nav-bar.jsx';
import { GridLayout } from '../../components/canvas.jsx';

const TILES = [
    { id: 'cpu', label: 'CPU', x: 0, y: 0, w: 2, h: 1 },
    { id: 'ram', label: 'RAM', x: 2, y: 0, w: 2, h: 1 },
];

const LINKS = [
    { href: '#a', label: 'One', current: true },
    { href: '#b', label: 'Two' },
];

// No `.kp-grid-wrap` or `.kp-nav-wrap` written here: both components
// render their own (`wrap`, default true), which is the difference
// between the channels — markup written by hand adds the wrapper, a
// component brings it. The assertions over the two are identical.
createRoot(document.getElementById('react-container')).render(
    <>
        <GridLayout tiles={TILES} data-test="react-grid-wide" />
        <div style={{ inlineSize: '300px' }}>
            <GridLayout tiles={TILES} data-test="react-grid-narrow" />
        </div>
        <NavBar brand="kp" links={LINKS} skipLink={false} label="Wide navigation" data-test="react-nav-wide" />
        <div style={{ inlineSize: '300px' }}>
            <NavBar brand="kp" links={LINKS} skipLink={false} label="Narrow navigation" data-test="react-nav-narrow" />
        </div>
    </>,
);
