// The React channel's drawn select, for tests/select.spec.mjs [scope-54].
//
// The same two cases as the framework-free half of select.html, in the
// same order — a drawn select and a native one beside it — so one suite
// drives both [AR7]. The drawn one is controlled, so the suite also proves
// the change reaches React's own state.

import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Field from '../../components/field.jsx';

const SEVERITIES = [
    { value: 'low', label: 'Low' },
    { value: 'high', label: 'High' },
    { value: 'blocked', label: 'Blocked', disabled: true },
    { value: 'critical', label: 'Critical — wake the on-call engineer' },
];

function Cases() {
    const [severity, setSeverity] = useState('high');
    return (
        <form data-test="react-form">
            <Field
                label="Severity"
                name="severity"
                options={SEVERITIES}
                drawn
                value={severity}
                onChange={(event) => setSeverity(/** @type {HTMLSelectElement} */ (event.target).value)}
                data-test="react-select"
            />
            <output data-test="react-state">{severity}</output>
            <Field
                label="Region"
                name="region"
                options={[
                    { value: 'North', label: 'North' },
                    { value: 'South', label: 'South' },
                ]}
                data-test="react-native"
            />
        </form>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-select'))).render(<Cases />);
