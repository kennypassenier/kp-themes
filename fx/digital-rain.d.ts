/** The default glyph set: binary plus half-width katakana. A default, not a decision. */
export declare const RAIN_GLYPHS = "01\uFF71\uFF72\uFF73\uFF76\uFF77\uFF78\uFF7B\uFF7C\uFF7D\uFF80\uFF81\uFF82\uFF85\uFF86\uFF87\uFF8A\uFF8B\uFF8C";
export type DigitalRainProps = {
    when?: import('./when.js').When;
    glyphs?: string;
    fontSize?: number;
    intervalMs?: number;
    colourToken?: string;
    trailToken?: string;
    trailAlpha?: number;
    alpha?: number;
    respawn?: number;
    maxDevicePixelRatio?: number;
    font?: string;
    className?: string;
    style?: import('react').CSSProperties;
} & Record<string, unknown>;
declare const DigitalRain: import("react").ForwardRefExoticComponent<Omit<DigitalRainProps, "ref"> & import("react").RefAttributes<HTMLCanvasElement>>;
export default DigitalRain;
