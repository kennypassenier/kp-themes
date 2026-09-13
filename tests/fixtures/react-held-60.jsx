// The React channel of held-60.html, for tests/held-60.spec.mjs.
//
// The same six reorder rows and the same two palettes as the
// framework-free half, in the same order, so one suite drives both
// channels [AR7].

import { createRoot } from 'react-dom/client';
import { Reorder } from '../../components/structure.jsx';
import { CommandPalette } from '../../components/palette.jsx';

const ITEMS = [
    { id: 'time', label: 'Time' },
    { id: 'pressure', label: 'Pressure' },
    { id: 'flow', label: 'Flow rate' },
    { id: 'note', label: 'Note' },
    { id: 'signed', label: 'Signed by' },
    { id: 'shift', label: 'Shift' },
];

const COMMANDS = [
    { value: 'report', label: 'Report an incident' },
    { value: 'lockout', label: 'Lock out a line' },
    { value: 'readings', label: 'Readings for line 2' },
    { value: 'handover', label: 'Handover notes' },
];

function Cases() {
    return (
        <>
            <section style={{ maxInlineSize: '28rem' }} data-test="react-reorder-long">
                <h2>Reorder, React</h2>
                <Reorder items={ITEMS} aria-label="Columns" />
            </section>
            <section data-test="react-palette-default">
                <CommandPalette commands={COMMANDS} hotkey={null} />
            </section>
            <section data-test="react-palette-subsequence">
                <CommandPalette commands={COMMANDS} hotkey={null} match="subsequence" />
            </section>
        </>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-held-60'))).render(<Cases />);
