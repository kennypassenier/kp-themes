/**
 * CP-A3: heading text deciphers itself - random glyphs settle into the
 * real characters left to right, once. Plain text in every other theme
 * and under prefers-reduced-motion. Screen readers always get the real
 * text via aria-label.
 * @param {{ text: string; delay?: number }} props
 */
export default function DecipherText({ text, delay }: {
    text: string;
    delay?: number;
}): import("react").JSX.Element;
