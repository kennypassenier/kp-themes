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

createRoot(document.getElementById('react-container')).render(
    <>
        <div className="kp-grid-wrap" data-test="react-grid-wide-wrap">
            <GridLayout tiles={TILES} data-test="react-grid-wide" />
        </div>
        <div style={{ inlineSize: '300px' }}>
            <div className="kp-grid-wrap" data-test="react-grid-narrow-wrap">
                <GridLayout tiles={TILES} data-test="react-grid-narrow" />
            </div>
        </div>
        <div className="kp-nav-wrap">
            <NavBar brand="kp" links={LINKS} skipLink={false} label="Wide navigation" data-test="react-nav-wide" />
        </div>
        <div style={{ inlineSize: '300px' }}>
            <div className="kp-nav-wrap">
                <NavBar brand="kp" links={LINKS} skipLink={false} label="Narrow navigation" data-test="react-nav-narrow" />
            </div>
        </div>
    </>,
);
