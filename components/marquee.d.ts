export type MarqueeProps = {
    /**
     * Each item becomes one cell of the row.
     */
    items?: import('react').ReactNode[];
    /**
     * One pass, e.g. '42000ms'. Default: the theme's own.
     */
    duration?: string;
    /**
     * Rest while off screen. Default 'offscreen'.
     */
    pause?: 'offscreen' | 'never';
    /**
     * The accessible name of the band. Default: none, so it is unlabelled scenery.
     */
    label?: string;
    /**
     * Default 'div'.
     */
    as?: import('react').ElementType;
    className?: string;
    style?: import('react').CSSProperties;
    children?: import('react').ReactNode;
};
declare const Marquee: import("react").ForwardRefExoticComponent<MarqueeProps & import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
export default Marquee;
