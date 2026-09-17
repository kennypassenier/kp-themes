// The React channel's switches, for tests/switch.spec.mjs.
//
// The same three cases as the framework-free half of switch.html, in the
// same order — off, disabled, invalid — so one suite drives both and
// compares what they render [AR7]. The fourth carries replaced words.

import { createRoot } from 'react-dom/client';
import Switch from '../../components/switch.jsx';

function Cases() {
    return (
        <>
            <Switch label="Night alarms" data-test="react-off" />
            <Switch label="Vendor hotline" disabled data-test="react-disabled" />
            <Switch label="Line locked out" error="Lock the line out first." data-test="react-invalid" />
            <Switch label="Weekly summary" strings={{ switchOn: 'Aan', switchOff: 'Uit' }} data-test="react-strings" />
        </>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-switch'))).render(<Cases />);
