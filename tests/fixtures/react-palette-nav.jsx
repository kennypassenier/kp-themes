// The React half of the palette-as-navigation fixture [AR7, rule 7g, scope-48].
//
// The same bar and the same three commands as the framework-free half,
// under test names prefixed `react-`, so one suite drives both and a
// difference between the channels fails rather than passes quietly.

import { createRoot } from 'react-dom/client';
import NavBar from '../../components/nav-bar.jsx';
import * as palette from '../../components/palette.jsx';

// A namespace import, so the fixture still bundles against a palette.jsx
// without PaletteTrigger: the suite is red on the old code, not unbuildable.
const { CommandPalette } = palette;
const PaletteTrigger = /** @type {any} */ (palette).PaletteTrigger ?? (() => null);

const COMMANDS = [
    { value: 'reports', label: 'Reports', href: '#reports' },
    { value: 'settings', label: 'Settings', href: '#settings' },
    { value: 'theme', label: 'Change theme' },
];

createRoot(document.getElementById('react')).render(
    <>
        <NavBar
            brand="kp-themes"
            links={[{ href: '#top', label: 'Home' }]}
            skipLink={false}
            search={<PaletteTrigger palette="react-palette" data-test="react-trigger" />}
        />
        <CommandPalette
            id="react-palette"
            data-test="react-palette"
            label="Go to"
            hotkey={null}
            commands={COMMANDS}
            onRun={(value) => /** @type {any} */ (window).runs.react.push(value)}
        />
    </>,
);
