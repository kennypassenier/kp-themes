export { LOGVIEWER, LOGVIEWER_EVENT, LOGVIEWER_RETRY_EVENT, LOGVIEWER_MAX, LOG_LEVELS } from './logviewer/constants.js';
export { logLevel } from './logviewer/levels.js';
export { appendLogLines, logViewerLines, logViewerText, clearLogViewer, searchLogViewer, stepLogMatch, setLogViewer } from './logviewer/api.js';
export { attachLogViewers } from './logviewer/attach.js';
export type LogLine = import('./logviewer/types.js').LogLine;
export type LogViewerSpec = import('./logviewer/types.js').LogViewerSpec;
export type Kept = import('./logviewer/types.js').Kept;
export type ViewerState = import('./logviewer/types.js').ViewerState;
/** @typedef {import('./logviewer/types.js').LogLine} LogLine */
/** @typedef {import('./logviewer/types.js').LogViewerSpec} LogViewerSpec */
/** @typedef {import('./logviewer/types.js').Kept} Kept */
/** @typedef {import('./logviewer/types.js').ViewerState} ViewerState */
