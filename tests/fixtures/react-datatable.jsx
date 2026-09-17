// The React channel of tests/fixtures/datatable.html [gap-13].
//
// The same two tables as the framework-free half, from the same rows, with
// the same data-test names, so one suite drives both [AR7]. The state the
// framework-free half sets through its handle, this half sets through
// props, and window.kpFixture gives the suite one door to both.

import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import DataTable from '../../components/datatable.jsx';
import { INCIDENTS, SEVERITY_ORDER } from './datatable-data.mjs';

const COLUMNS = [
    { key: 'ref', label: 'Reference' },
    { key: 'site', label: 'Site', filter: 'choice' },
    { key: 'status', label: 'Status', filter: 'choice', render: (value) => <span className="kp-badge">{String(value)}</span> },
    { key: 'severity', label: 'Severity', filter: 'choice', order: SEVERITY_ORDER },
    { key: 'hours', label: 'Hours', kind: 'number', filter: 'range' },
    { key: 'opened', label: 'Opened', kind: 'date', filter: 'date' },
    { key: 'note', label: 'Note', sortable: false },
];

const SHORT = [
    { key: 'ref', label: 'Reference' },
    { key: 'site', label: 'Site', sortable: false },
    { key: 'status', label: 'Status', sortable: false, render: (value) => <span className="kp-badge">{String(value)}</span> },
    { key: 'note', label: 'Note', sortable: false },
];

/** @param {Record<string, unknown>} row */
const rowKey = (row) => String(row.ref);

function Cases() {
    /** @type {import('react').RefObject<any>} */
    const api = useRef(null);
    const [state, setState] = useState('ready');
    window.kpFixture = {
        ...window.kpFixture,
        react: {
            rowKeys: () => api.current.rows().map(rowKey),
            pageKeys: () => api.current.rows('page').map(rowKey),
            state: setState,
        },
    };
    return (
        <div>
            <div data-test="react-datatable">
                <DataTable
                    caption="Incidents"
                    columns={COLUMNS}
                    rows={state === 'loading' ? [] : INCIDENTS}
                    rowKey={rowKey}
                    selectable
                    searchScope
                    densityChoice
                    loading={state === 'loading'}
                    error={state === 'failed'}
                    onRetry={() => window.dispatchEvent(new CustomEvent('fixture-retry'))}
                    apiRef={api}
                    actions={(keys, clear) => (
                        <button type="button" className="kp-button kp-button--ghost" data-kp-datatable-clear-selection onClick={clear}>
                            Clear selection
                        </button>
                    )}
                />
            </div>
            <div style={{ inlineSize: '34rem' }} data-test="react-squeezed">
                <DataTable
                    caption="Incidents, in a short box"
                    columns={SHORT}
                    rows={INCIDENTS}
                    rowKey={rowKey}
                    searchable={false}
                    paginated={false}
                    cards={false}
                    maxHeight="12rem"
                    data-test="react-sticky"
                />
            </div>
        </div>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-datatable'))).render(<Cases />);
