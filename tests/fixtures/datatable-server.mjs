// A pretend server for the data table's server rows, shared by both channels
// of tests/fixtures/datatable-more.html [Kenny's form of 2026-09-13].
//
// It searches, sorts and pages the rows it is given and answers late: after
// the next delay a test pushed onto `delays`, or 30 ms. `failNext` makes the
// next answer a failure. Every request is written to `log` with what the
// table sent and what became of it, so a test reads which answers were
// thrown away without looking inside the table.

/**
 * @template {Record<string, unknown>} Row
 * @param {Row[]} rows
 */
export function createServer(rows) {
    /** @type {{ query: string, sort: string, page: number, pageSize: number, outcome: string }[]} */
    const log = [];
    const server = {
        log,
        /** @type {number[]} */
        delays: [],
        failNext: false,
        /**
         * @param {{ query: string, sort: { field: string, direction: string }[], page: number, pageSize: number, signal?: AbortSignal }} request
         * @returns {Promise<{ rows: Row[], total: number }>}
         */
        load(request) {
            const entry = {
                query: request.query,
                sort: request.sort.map((key) => `${key.direction === 'descending' ? '-' : ''}${key.field}`).join(','),
                page: request.page,
                pageSize: request.pageSize,
                outcome: 'pending',
            };
            log.push(entry);
            const ms = server.delays.shift() ?? 30;
            const fail = server.failNext;
            server.failNext = false;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (request.signal?.aborted) entry.outcome = 'aborted';
                    if (fail) {
                        if (entry.outcome === 'pending') entry.outcome = 'failed';
                        reject(new Error('503'));
                        return;
                    }
                    const needle = request.query.trim().toLowerCase();
                    const found = rows.filter((row) => needle === '' || Object.values(row).join(' ').toLowerCase().includes(needle));
                    found.sort((a, b) => {
                        for (const key of request.sort) {
                            const left = a[key.field];
                            const right = b[key.field];
                            const c =
                                typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right));
                            if (c !== 0) return key.direction === 'descending' ? -c : c;
                        }
                        return 0;
                    });
                    if (entry.outcome === 'pending') entry.outcome = 'answered';
                    resolve({ rows: found.slice(request.page * request.pageSize, (request.page + 1) * request.pageSize), total: found.length });
                }, ms);
            });
        },
    };
    return server;
}
