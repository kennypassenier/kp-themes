// The React channel's tables, mounted for the table suite [R3].
//
// The same five specimens as the framework-free half of tables.html, in
// the same order and with the same data-test names, so one suite drives
// both channels rather than comparing what they contain [AR7].

import { createRoot } from 'react-dom/client';
import Table from '../../components/table.jsx';
import DataTable from '../../components/datatable.jsx';

const IDENTIFIER = 'a3f92b71c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809125';
const NOTE = 'A note long enough that no column can hold it, which is the whole point of a truncated cell.';

function Cases() {
    return (
        <div>
            <div data-test="react-region">
                <button type="button" className="kp-button" data-test="react-region-before">
                    Before the table
                </button>
                <div style={{ inlineSize: '300px' }}>
                    <Table
                        caption="Quarterly revenue"
                        columns={['Customer', 'First quarter', 'Second quarter', 'Third quarter', 'Fourth quarter']}
                        rows={[['Acme', '1284.50', '998.00', '1102.25', '1471.00']]}
                    />
                </div>
            </div>

            <div data-test="react-break">
                <Table
                    caption="Identifiers"
                    columns={[
                        { key: 'field', label: 'Field' },
                        { key: 'value', label: 'Value', className: 'kp-cell-break' },
                    ]}
                    rows={[{ field: 'Key', value: IDENTIFIER }]}
                />
            </div>

            <div data-test="react-truncate">
                <Table
                    caption="Notes"
                    columns={[
                        { key: 'field', label: 'Field' },
                        // truncate sets the class and carries the full value
                        // into the title, so a pointer can still read it.
                        { key: 'value', label: 'Note', truncate: true },
                    ]}
                    rows={[{ field: 'Note', value: NOTE }]}
                />
            </div>

            <div data-test="react-priority">
                <Table
                    caption="Invoices"
                    columns={[
                        { key: 'customer', label: 'Customer' },
                        { key: 'updated', label: 'Updated', className: 'kp-col-low' },
                        { key: 'amount', label: 'Amount' },
                    ]}
                    rows={[{ customer: 'Acme', updated: '2026-09-01', amount: '100' }]}
                />
            </div>

            <div data-test="react-cards" style={{ inlineSize: '400px' }}>
                <Table
                    cards
                    caption="Contacts"
                    columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'role', label: 'Role' },
                    ]}
                    rows={[{ name: 'Acme', role: 'Customer' }]}
                />
            </div>

            <div data-test="react-datatable-cards" style={{ inlineSize: '400px' }}>
                <DataTable
                    caption="Orders"
                    columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'amount', label: 'Amount', kind: 'number' },
                    ]}
                    rows={[
                        { name: 'Acme', amount: '100' },
                        { name: 'Bakker', amount: '20' },
                    ]}
                    rowKey={(_, i) => `r${i}`}
                    pageSize={3}
                />
            </div>
        </div>
    );
}

createRoot(document.getElementById('react-tables')).render(<Cases />);
