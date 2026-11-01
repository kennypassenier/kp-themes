/**
 * @param {HTMLElement} host A host that fails or turns up empty on its very first read has no loaded height to hold [statestwo-1019, almanac 26]. A table
 * (and any host that says so with `data-kp-footprint-rows="N"`) is held at what N rows would make it: its own frame (toolbar, head
 * and foot: the host less what stands in the rows' place) plus N rows of `--kp-footprint-row`; N is the hint, else the table's
 * `data-kp-page-size`, else DEFAULT_ROWS. A loaded height, once there is one, wins.
 */
export declare function firstLoadEstimate(host: HTMLElement): number;
