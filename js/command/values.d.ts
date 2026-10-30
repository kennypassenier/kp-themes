/** A command block. */
export declare const COMMAND = "[data-kp-command]";
/** The terminals the package knows, with their prompt and the line ends that carry a command on to the next line. */
export declare const COMMAND_SHELLS: {
    readonly wsl: {
        readonly prompt: '$';
        readonly continues: readonly ['\\', '|', '&&', '||'];
        readonly windows: false;
    };
    readonly garuda: {
        readonly prompt: '$';
        readonly continues: readonly ['\\', '|', '&&', '||'];
        readonly windows: false;
    };
    readonly bash: {
        readonly prompt: '$';
        readonly continues: readonly ['\\', '|', '&&', '||'];
        readonly windows: false;
    };
    readonly powershell: {
        readonly prompt: 'PS>';
        readonly continues: readonly ['`', '|'];
        readonly windows: true;
    };
    readonly cmd: {
        readonly prompt: '>';
        readonly continues: readonly ['^'];
        readonly windows: true;
    };
};
/** What a terminal the package does not know is given. */
export declare const OTHER_SHELL: {
    prompt: string;
    continues: readonly string[];
    windows: boolean;
};
/** How far a scrolled code block may be from an edge, in px, before that edge counts as reached. */
export declare const SCROLL_EDGE = 1;
