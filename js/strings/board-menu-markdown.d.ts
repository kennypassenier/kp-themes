export type BoardMenuMarkdownStrings = {
    /**
     * What is said when an item went to another list of its group (js/structure.js) [habits-1101]
     */
    reorderMovedTo: (name: string, list: string, at: number, of: number) => string;
    /**
     * What is said when there is no list further that way (js/structure.js) [habits-1101]
     */
    reorderGroupEnd: string;
    /**
     * The keys of a handle in a list that shares its items, as its description (js/structure.js) [habits-1101]
     */
    reorderGroupKeys: string;
    /**
     * A lane's count as a screen reader hears it; `limit` 0 when the lane has none (js/board.js) [habits-1101]
     */
    boardCountLabel: (count: number, limit: number) => string;
    /**
     * The word on a lane's plate that holds more than its limit (js/board.js) [habits-1101]
     */
    boardOver: string;
    /**
     * What is said when a lane goes over its limit (js/board.js) [habits-1101]
     */
    boardOverSaid: (lane: string, count: number, limit: number) => string;
    /**
     * The line in a lane with no cards, where one can be dropped (js/board.js) [habits-1101]
     */
    boardLaneEmpty: string;
    /**
     * The name of the switcher over a narrow board, a button per lane (js/board.js) [habits-1101]
     */
    boardLanes: string;
    /**
     * The words on a board's loading card (js/board.js) [habits-1101]
     */
    boardLoading: string;
    /**
     * The sentence over a board with no lanes, when the page gives none (js/board.js) [habits-1101]
     */
    boardEmpty: string;
    /**
     * The sentence over a board that could not be read (js/board.js) [habits-1101]
     */
    boardFailed: (reason: string) => string;
    /**
     * Its Try again button (js/board.js) [habits-1101]
     */
    boardRetry: string;
    /**
     * A lane's button in a narrow board's switcher, as a screen reader hears it (js/board.js) [uxtouch1101]
     */
    boardTabLabel: (lane: string, count: number, limit: number, over: boolean) => string;
    /**
     * The heading of the lanes a card's menu can send it to (js/board.js) [uxtouch1101]
     */
    boardMoveTo: string;
    /**
     * The line under a lane in that menu: what it holds now (js/board.js) [uxtouch1101]
     */
    boardMoveHint: (count: number, limit: number) => string;
    /**
     * What is said when a card was sent to another lane from its menu (js/board.js) [uxtouch1101]
     */
    boardMovedSaid: (name: string, lane: string, count: number, limit: number) => string;
    /**
     * The name of a context menu whose element gives none (js/context-menu.js) [habits-1101]
     */
    contextMenuLabel: string;
    /**
     * The name of the Markdown editor's toolbar (js/markdown-editor.js) [habits-1101]
     */
    mdToolbar: string;
    /**
     * Its bold button (js/markdown-editor.js) [habits-1101]
     */
    mdBold: string;
    /**
     * Its italic button (js/markdown-editor.js) [habits-1101]
     */
    mdItalic: string;
    /**
     * Its heading button (js/markdown-editor.js) [habits-1101]
     */
    mdHeading: string;
    /**
     * Its bulleted list button (js/markdown-editor.js) [habits-1101]
     */
    mdList: string;
    /**
     * Its checklist button (js/markdown-editor.js) [habits-1101]
     */
    mdChecklist: string;
    /**
     * Its link button (js/markdown-editor.js) [habits-1101]
     */
    mdLink: string;
    /**
     * The words a new link gets when nothing was selected, selected so typing replaces them (js/markdown-editor.js) [habits-1101]
     */
    mdLinkText: string;
    /**
     * A button's tooltip with its shortcut (js/markdown-editor.js) [habits-1101]
     */
    mdWithKeys: (action: string, keys: string) => string;
    /**
     * The tab that shows the text on a narrow editor (js/markdown-editor.js) [habits-1101]
     */
    mdWrite: string;
    /**
     * The tab and the pane that show the text as it will read (js/markdown-editor.js) [habits-1101]
     */
    mdPreview: string;
    /**
     * The preview of an empty text (js/markdown-editor.js) [habits-1101]
     */
    mdPreviewEmpty: string;
    /**
     * The check's name on an open task (js/task-row.js) [habits-1101]
     */
    taskRowDone: (title: string) => string;
    /**
     * The check's name on a done task (js/task-row.js) [habits-1101]
     */
    taskRowReopen: (title: string) => string;
    /**
     * The drag handle's name (js/task-row.js) [habits-1101]
     */
    taskRowMove: (title: string) => string;
    /**
     * The more button's name (js/task-row.js) [habits-1101]
     */
    taskRowMore: (title: string) => string;
};
/**
 * @typedef {object} BoardMenuMarkdownStrings
 * @property {(name: string, list: string, at: number, of: number) => string} reorderMovedTo  What is said when an item went to another list of its group (js/structure.js) [habits-1101]
 * @property {string} reorderGroupEnd  What is said when there is no list further that way (js/structure.js) [habits-1101]
 * @property {string} reorderGroupKeys  The keys of a handle in a list that shares its items, as its description (js/structure.js) [habits-1101]
 * @property {(count: number, limit: number) => string} boardCountLabel  A lane's count as a screen reader hears it; `limit` 0 when the lane has none (js/board.js) [habits-1101]
 * @property {string} boardOver  The word on a lane's plate that holds more than its limit (js/board.js) [habits-1101]
 * @property {(lane: string, count: number, limit: number) => string} boardOverSaid  What is said when a lane goes over its limit (js/board.js) [habits-1101]
 * @property {string} boardLaneEmpty  The line in a lane with no cards, where one can be dropped (js/board.js) [habits-1101]
 * @property {string} boardLanes  The name of the switcher over a narrow board, a button per lane (js/board.js) [habits-1101]
 * @property {string} boardLoading  The words on a board's loading card (js/board.js) [habits-1101]
 * @property {string} boardEmpty  The sentence over a board with no lanes, when the page gives none (js/board.js) [habits-1101]
 * @property {(reason: string) => string} boardFailed  The sentence over a board that could not be read (js/board.js) [habits-1101]
 * @property {string} boardRetry  Its Try again button (js/board.js) [habits-1101]
 * @property {(lane: string, count: number, limit: number, over: boolean) => string} boardTabLabel  A lane's button in a narrow board's switcher, as a screen reader hears it (js/board.js) [uxtouch1101]
 * @property {string} boardMoveTo  The heading of the lanes a card's menu can send it to (js/board.js) [uxtouch1101]
 * @property {(count: number, limit: number) => string} boardMoveHint  The line under a lane in that menu: what it holds now (js/board.js) [uxtouch1101]
 * @property {(name: string, lane: string, count: number, limit: number) => string} boardMovedSaid  What is said when a card was sent to another lane from its menu (js/board.js) [uxtouch1101]
 * @property {string} contextMenuLabel  The name of a context menu whose element gives none (js/context-menu.js) [habits-1101]
 * @property {string} mdToolbar  The name of the Markdown editor's toolbar (js/markdown-editor.js) [habits-1101]
 * @property {string} mdBold  Its bold button (js/markdown-editor.js) [habits-1101]
 * @property {string} mdItalic  Its italic button (js/markdown-editor.js) [habits-1101]
 * @property {string} mdHeading  Its heading button (js/markdown-editor.js) [habits-1101]
 * @property {string} mdList  Its bulleted list button (js/markdown-editor.js) [habits-1101]
 * @property {string} mdChecklist  Its checklist button (js/markdown-editor.js) [habits-1101]
 * @property {string} mdLink  Its link button (js/markdown-editor.js) [habits-1101]
 * @property {string} mdLinkText  The words a new link gets when nothing was selected, selected so typing replaces them (js/markdown-editor.js) [habits-1101]
 * @property {(action: string, keys: string) => string} mdWithKeys  A button's tooltip with its shortcut (js/markdown-editor.js) [habits-1101]
 * @property {string} mdWrite  The tab that shows the text on a narrow editor (js/markdown-editor.js) [habits-1101]
 * @property {string} mdPreview  The tab and the pane that show the text as it will read (js/markdown-editor.js) [habits-1101]
 * @property {string} mdPreviewEmpty  The preview of an empty text (js/markdown-editor.js) [habits-1101]
 * @property {(title: string) => string} taskRowDone  The check's name on an open task (js/task-row.js) [habits-1101]
 * @property {(title: string) => string} taskRowReopen  The check's name on a done task (js/task-row.js) [habits-1101]
 * @property {(title: string) => string} taskRowMove  The drag handle's name (js/task-row.js) [habits-1101]
 * @property {(title: string) => string} taskRowMore  The more button's name (js/task-row.js) [habits-1101]
 */
/** @type {BoardMenuMarkdownStrings} */
export declare const BOARD_MENU_MARKDOWN_STRINGS: BoardMenuMarkdownStrings;
