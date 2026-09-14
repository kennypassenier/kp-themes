// The React half of the nav-menu fixture [AR7, rule 7g, fix-27, scope-48].
//
// The same bar as the framework-free half — a mega menu second, a second
// one third and a plain dropdown last, the links pushed to the window's
// end — under test names prefixed `react-`, so one suite drives both and
// a difference between the channels fails rather than passes quietly.

import { createRoot } from 'react-dom/client';
import NavBar from '../../components/nav-bar.jsx';

const LINKS = [
    { href: '#overview', label: 'Overview' },
    {
        href: '#products',
        label: 'Products',
        groups: [
            {
                label: 'Build',
                links: [
                    { href: '#themes', label: 'Themes' },
                    { href: '#components', label: 'Components' },
                ],
            },
            {
                label: 'Run',
                links: [
                    { href: '#tables', label: 'Data tables' },
                    { href: '#forms', label: 'Forms' },
                ],
            },
            {
                label: 'Learn',
                links: [
                    { href: '#guide', label: 'User guide' },
                    { href: '#layout', label: 'Layout' },
                ],
            },
        ],
    },
    { href: '#support', label: 'Support', groups: [{ label: 'Help', links: [{ href: '#faq', label: 'Questions' }] }] },
    {
        href: '#account',
        label: 'Account',
        links: [
            { href: '#profile', label: 'Profile and preferences' },
            { href: '#sessions', label: 'Signed-in devices' },
        ],
    },
];

createRoot(document.getElementById('react')).render(
    <>
        <NavBar brand="kp-themes" links={LINKS} skipLink={false} data-test="react-nav" classNames={{ list: 'react-links' }} />
        <p>
            <a href="#outside" data-test="react-outside">
                Outside the bar
            </a>
        </p>
    </>,
);
