// The React channel's drawn select, for tests/select.spec.mjs [scope-54].
//
// The same cases as the framework-free half of select.html, in the same
// order — a select that asks for the drawn list, one drawn by default, the
// `native` opt-out and a multiple select — so one suite drives both [AR7]. The drawn one is controlled, so the suite also proves
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
                data-test="react-default"
            />
            <Field
                label="Shift"
                name="shift"
                drawn={false}
                options={[
                    { value: 'Day', label: 'Day' },
                    { value: 'Night', label: 'Night' },
                ]}
                data-test="react-native"
            />
            <Field
                label="Crews"
                name="crews"
                multiple
                options={[
                    { value: 'Red', label: 'Red' },
                    { value: 'Blue', label: 'Blue' },
                ]}
                data-test="react-multiple"
            />
        </form>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-select'))).render(<Cases />);
