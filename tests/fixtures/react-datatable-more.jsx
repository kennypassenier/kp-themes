// The React channel of tests/fixtures/datatable-more.html [Kenny's form of
// 2026-09-13, "Alle zeven, nu"].
//
// The same seven tables as the framework-free half, from the same rows and
// the same pretend server, with the same data-test names, so one suite
// drives both [AR7]. What the framework-free half reads from its handle,
// this half reads from props and callbacks, and window.kpFixture gives the
// suite one door to both.

import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import DataTable from '../../components/datatable.jsx';
import { INCIDENTS } from './datatable-data.mjs';
import { createServer } from './datatable-server.mjs';

const badge = (/** @type {unknown} */ value) => <span className="kp-badge">{String(value)}</span>;
/** @param {Record<string, unknown>} row */
const rowKey = (row) => String(row.ref);
const server = createServer(INCIDENTS);
/** @type {Record<string, unknown>[]} */
const editLog = [];

function Cases() {
    const [rows, setRows] = useState(() => INCIDENTS.map((row) => ({ ...row })));
    /** @type {import('react').MutableRefObject<{ sorts: [string, string][], hidden: string[], expanded: string[], filters: Record<string, unknown>, viewFilters: Record<string, unknown> }>} */
    const seen = useRef({ sorts: [], hidden: ['Note'], expanded: ['INC-4400'], filters: {}, viewFilters: {} });
    /** @type {import('react').RefObject<import('../../components/datatable.jsx').DataTableApi | null>} */
    const serverApi = useRef(null);
    window.kpFixture = {
        ...window.kpFixture,
        reactServer: server,
        editLog: { ...window.kpFixture?.editLog, react: editLog },
        react: {
            sorts: () => seen.current.sorts,
            hidden: () => seen.current.hidden,
            expanded: () => seen.current.expanded,
            reload: () => serverApi.current?.reload(),
            filters: () => seen.current.filters,
            viewFilters: () => seen.current.viewFilters,
        },
    };
    const labels = /** @type {Record<string, string>} */ ({ ref: 'Reference', site: 'Site', status: 'Status', severity: 'Severity', note: 'Note' });
    return (
        <div>
            <DataTable
                data-test="react-multi"
                caption="Incidents, sorted on several columns"
                columns={[
                    { key: 'ref', label: 'Reference' },
                    { key: 'site', label: 'Site' },
                    { key: 'severity', label: 'Severity', order: ['Low', 'Medium', 'High', 'Critical'] },
                    { key: 'hours', label: 'Hours', kind: 'number' },
                ]}
                rows={INCIDENTS}
                rowKey={rowKey}
                searchable={false}
                cards={false}
                pageSizes={[]}
                multiSort
                onSortsChange={(sorts) => {
                    seen.current.sorts = sorts.map((key) => [key.key === 'hours' ? 'Hours' : (labels[key.key] ?? key.key), key.direction]);
                }}
            />
            <DataTable
                data-test="react-columns"
                caption="Incidents, with a choice of columns"
                columns={[
                    { key: 'ref', label: 'Reference', sortable: false },
                    { key: 'site', label: 'Site', sortable: false },
                    { key: 'status', label: 'Status', sortable: false, render: badge },
                    { key: 'severity', label: 'Severity', sortable: false },
                    { key: 'note', label: 'Note', sortable: false },
                ]}
                rows={INCIDENTS}
                rowKey={rowKey}
                searchable={false}
                cards={false}
                pageSizes={[]}
                columnMenu
                defaultHiddenColumns={['note']}
                onHiddenColumnsChange={(keys) => {
                    seen.current.hidden = keys.map((key) => labels[key] ?? key);
                }}
            />
            <DataTable
                data-test="react-expand"
                caption="Incidents, each row opens for details"
                columns={[
                    { key: 'ref', label: 'Reference' },
                    { key: 'site', label: 'Site', sortable: false },
                    { key: 'hours', label: 'Hours', kind: 'number' },
                ]}
                rows={INCIDENTS}
                rowKey={rowKey}
                searchable={false}
                cards={false}
                pageSize={10}
                pageSizes={[]}
                defaultExpanded={['INC-4400']}
                onExpandedChange={(keys) => {
                    seen.current.expanded = keys;
                }}
                renderDetail={(row) => `Note: ${row.note} Severity ${row.severity}, opened ${row.opened}.`}
            />
            <div style={{ inlineSize: '30rem' }}>
                <DataTable
                    data-test="react-fixed"
                    caption="Incidents, wider than their box"
                    columns={['ref', 'site', 'status', 'severity', 'hours', 'opened', 'note', 'again'].map((key) => ({
                        key,
                        label: key === 'again' ? 'Again' : key === 'hours' ? 'Hours' : key === 'opened' ? 'Opened' : (labels[key] ?? key),
                        sortable: false,
                        render: (/** @type {unknown} */ value, /** @type {Record<string, unknown>} */ row) => (
                            <span style={{ whiteSpace: 'nowrap' }}>{String(key === 'again' ? row.note : key === 'status' ? row.status : value)}</span>
                        ),
                    }))}
                    rows={INCIDENTS}
                    rowKey={rowKey}
                    searchable={false}
                    paginated={false}
                    cards={false}
                    maxHeight="14rem"
                    fixedColumns
                />
            </div>
            <DataTable
                data-test="react-server"
                caption="Incidents, served page by page"
                columns={[
                    { key: 'ref', label: 'Reference' },
                    { key: 'site', label: 'Site' },
                    { key: 'hours', label: 'Hours', kind: 'number' },
                ]}
                rowKey={rowKey}
                cards={false}
                pageSize={10}
                pageSizes={[]}
                load={(request) =>
                    server.load({
                        query: request.query,
                        sort: request.sorts.map((key) => ({ field: key.key, direction: key.direction })),
                        page: request.page,
                        pageSize: request.pageSize,
                        signal: request.signal,
                    })
                }
                apiRef={serverApi}
            />
            <DataTable
                data-test="react-edit"
                caption="Incidents, Site, Status, Hours and Opened can be edited in place"
                columns={[
                    { key: 'ref', label: 'Reference', sortable: false },
                    { key: 'site', label: 'Site', sortable: false, edit: 'text', editRequired: true },
                    { key: 'status', label: 'Status', sortable: false, edit: 'select', editOptions: ['Open', 'Watching', 'Closed'], render: badge },
                    { key: 'hours', label: 'Hours', sortable: false, kind: 'number', edit: 'number' },
                    { key: 'opened', label: 'Opened', sortable: false, edit: 'date' },
                ]}
                rows={rows}
                rowKey={rowKey}
                searchable={false}
                cards={false}
                pageSize={10}
                pageSizes={[]}
                onCellEdit={({ row, key, label, value, previous, undo }) => {
                    editLog.push({ key: row.ref, label, value, previous, undo });
                    if (label === 'Hours' && Number(value) > 100) return 'Hours must be 100 or fewer';
                    setRows((current) => current.map((r) => (r.ref === row.ref ? { ...r, [key]: key === 'hours' ? Number(value) : value } : r)));
                    return undefined;
                }}
            />
            <button type="button" data-test="react-before-grid">
                Before the grid
            </button>
            <DataTable
                data-test="react-grid"
                caption="Incidents, navigable with the arrow keys"
                columns={[
                    { key: 'ref', label: 'Reference' },
                    { key: 'site', label: 'Site', sortable: false },
                    { key: 'status', label: 'Status', sortable: false, edit: 'select', editOptions: ['Open', 'Watching', 'Closed'], render: badge },
                    { key: 'severity', label: 'Severity', sortable: false },
                ]}
                rows={rows}
                rowKey={rowKey}
                searchable={false}
                cards={false}
                paginated={false}
                region={false}
                grid
                onCellEdit={({ row, key, value }) => {
                    setRows((current) => current.map((r) => (r.ref === row.ref ? { ...r, [key]: value } : r)));
                }}
            />
            <button type="button" data-test="react-after-grid">
                After the grid
            </button>
            <DataTable
                data-test="react-addfilter"
                caption="Incidents, filtered one column at a time"
                columns={[
                    { key: 'ref', label: 'Reference', sortable: false },
                    { key: 'site', label: 'Site', sortable: false, filter: 'choice' },
                    { key: 'status', label: 'Status', sortable: false, filter: 'choice', order: ['Open', 'Watching', 'Closed'], render: badge },
                    { key: 'hours', label: 'Hours', sortable: false, kind: 'number', filter: 'range' },
                    { key: 'opened', label: 'Opened', sortable: false, filter: 'date' },
                ]}
                rows={INCIDENTS}
                rowKey={rowKey}
                searchable={false}
                cards={false}
                pageSizes={[]}
                pageSize={50}
                filterMode="add"
                onFiltersChange={(filters) => {
                    seen.current.filters = filters;
                }}
                onViewChange={(view) => {
                    seen.current.viewFilters = view.filters;
                }}
            />
        </div>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-datatable'))).render(<Cases />);
