export type AlarmReason = 'ack' | 'timeout' | 'escape';
export type AlarmProps = {
    /**
     * Raises the alarm while true. Default false.
     */
    open?: boolean;
    /**
     * The huge word(s), and the alarm's accessible name.
     */
    title: string;
    /**
     * The line under the headline.
     */
    detail?: string;
    /**
     * The small line above the headline.
     */
    code?: string;
    /**
     * 'ack': only its button closes it. 'auto': closes after `seconds`. Default 'ack'.
     */
    mode?: 'ack' | 'auto';
    /**
     * Auto only. Eight when left out (ALARM_SECONDS).
     */
    seconds?: number;
    /**
     * Ack only: Escape closes it as well. Default false.
     */
    escape?: boolean;
    /**
     * The button's label. Default: the dictionary's `alarmAction`.
     */
    action?: string;
    /**
     * Called once when it closed, with why; set `open` back to false here.
     */
    onClose?: (reason: AlarmReason) => void;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Alarm: import("react").ForwardRefExoticComponent<AlarmProps & import("react").RefAttributes<HTMLDialogElement>>;
/**
 * An alarm as a question with an answer: `show(options)` raises it and
 * resolves with why it closed, as `showAlarm()` does in the framework-free
 * channel. Render the returned element once, anywhere in the tree.
 *
 *   const [showAlarm, alarm] = useAlarm();
 *   const reason = await showAlarm({ title: 'Access denied', mode: 'auto', seconds: 6 });
 *
 * @returns {[(options: Omit<AlarmProps, 'open' | 'onClose'>) => Promise<AlarmReason>, import('react').ReactElement | null]}
 */
export declare function useAlarm(): [(options: Omit<AlarmProps, 'open' | 'onClose'>) => Promise<AlarmReason>, import('react').ReactElement | null];
