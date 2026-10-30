export { HEAT, MATRIX, HEAT_PICK_EVENT, HEAT_ROW_EVENT, HEAT_PAGE_EVENT, MATRIX_PICK_EVENT, HEAT_RETRY_EVENT, MATRIX_RETRY_EVENT, MATRIX_LIGHT_EVENT, } from './heat/constants.js';
export { setHeat } from './heat/draw.js';
export { setHeatPick, setHeatRows } from './heat/pick.js';
export { heatOffset, setHeatPaging, removeHeatPaging } from './heat/paging.js';
export { setHeatLegend } from './heat/legend.js';
export { attachHeats } from './heat/wire.js';
export { setMatrix, setMatrixLit, setMatrixPick } from './heat/matrix.js';
export { attachMatrices } from './heat/matrix-wire.js';
export type GridTone = import('./heat/types.js').GridTone;
export type HeatCell = import('./heat/types.js').HeatCell;
export type HeatRow = import('./heat/types.js').HeatRow;
export type HeatSpec = import('./heat/types.js').HeatSpec;
export type HeatDecorateInfo = import('./heat/types.js').HeatDecorateInfo;
export type HeatPaging = import('./heat/types.js').HeatPaging;
export type HeatLegendEntry = import('./heat/types.js').HeatLegendEntry;
export type HeatLegendOptions = import('./heat/types.js').HeatLegendOptions;
export type MatrixCell = import('./heat/types.js').MatrixCell;
export type MatrixSpec = import('./heat/types.js').MatrixSpec;
/** @typedef {import('./heat/types.js').GridTone} GridTone */
/** @typedef {import('./heat/types.js').HeatCell} HeatCell */
/** @typedef {import('./heat/types.js').HeatRow} HeatRow */
/** @typedef {import('./heat/types.js').HeatSpec} HeatSpec */
/** @typedef {import('./heat/types.js').HeatDecorateInfo} HeatDecorateInfo */
/** @typedef {import('./heat/types.js').HeatPaging} HeatPaging */
/** @typedef {import('./heat/types.js').HeatLegendEntry} HeatLegendEntry */
/** @typedef {import('./heat/types.js').HeatLegendOptions} HeatLegendOptions */
/** @typedef {import('./heat/types.js').MatrixCell} MatrixCell */
/** @typedef {import('./heat/types.js').MatrixSpec} MatrixSpec */
