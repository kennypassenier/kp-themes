// The React channel of the W4 assembly page.
//
// The same shape as the framework-free half of dashboard.html — a data
// table, a row-actions menu on the popover layer, a destructive item in
// that menu — so one journey drives both and compares what they DO
// rather than what they contain [AR7].
//
// The rows are state, because that is how a React consumer holds them:
// the delete handler drops one and the row is gone. Nothing here
// re-implements a package behaviour; the confirmation, the menu and the
// focus return all come from the package.

import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import DataTable from '../../components/datatable.jsx';
import Button from '../../components/button.jsx';
import { DropdownMenu } from '../../components/overlays.jsx';

const CLIENTS = [
    { id: 'r0', name: 'Acme', amount: 100, reference: 'a3f92b71c4d85e6f09ab12cd34ef5678' },
    { id: 'r1', name: 'Bakker', amount: 20, reference: 'b7c41d09e2f6a85b31cd47ef09ab6512' },
    { id: 'r2', name: 'Cerise', amount: 1284.5, reference: 'c1d84fa20b96e37c58ad12bf46ef9034' },
];

function Dashboard() {
    const [rows, setRows] = useState(CLIENTS);
    const remove = (/** @type {string} */ id) => {
        window.__acts?.push(`react:${id}`);
        setRows((current) => current.filter((row) => row.id !== id));
    };

    const columns = [
        { key: 'name', label: 'Name', kind: 'text' },
        { key: 'amount', label: 'Amount', kind: 'number' },
        {
            key: 'reference',
            label: 'Reference',
            // A long identifier with no break opportunity in it, because that is what a real
            // reference column holds and it is what pushed kyu's dashboard
            // sideways [TH113, AR32].
            render: (/** @type {unknown} */ value, /** @type {Record<string, unknown>} */ row) => (
                <span className="kp-tag" data-test={`react-ref-${row.id}`}>
                    {/** @type {string} */ (value)}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (/** @type {unknown} */ _value, /** @type {Record<string, unknown>} */ row) => {
                const id = /** @type {string} */ (row.id);
                return (
                    <DropdownMenu
                        id={`react-menu-${id}`}
                        label="Row actions"
                        data-test={`react-menu-${id}`}
                        items={[
                            { id: 'edit', label: 'Edit' },
                            { id: 'delete', destructive: true, label: 'Delete' },
                        ]}
                        renderTrigger={(props) => (
                            <Button variant="ghost" size="sm" data-test={`react-menu-trigger-${id}`} {...props}>
                                Row actions
                            </Button>
                        )}
                        renderItem={(item) =>
                            item.destructive ? (
                                <Button
                                    variant="destructive"
                                    confirm={`Delete ${row.name}?`}
                                    role="menuitem"
                                    className="kp-menu__item kp-menu__item--destructive"
                                    data-test={`react-delete-${id}`}
                                    onClick={() => remove(id)}
                                >
                                    {item.label}
                                </Button>
                            ) : (
                                <button type="button" role="menuitem" className="kp-button kp-menu__item" data-test={`react-edit-${id}`}>
                                    {item.label}
                                </button>
                            )
                        }
                    />
                );
            },
        },
    ];

    return <DataTable columns={columns} rows={rows} rowKey={(row) => /** @type {string} */ (row.id)} searchable={false} paginated={false} />;
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-dashboard'))).render(<Dashboard />);
