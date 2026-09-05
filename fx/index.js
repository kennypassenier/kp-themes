// Effects, React. Each one renders plainly (or not at all) under
// prefers-reduced-motion, and — since 3.0.0 — where the consumer says,
// with the cyberpunk theme as the default.
//
// BootSequence is not in this barrel [KT6]. It needs the optional
// `motion` peer, and a barrel that imports it makes the peer mandatory
// for everyone who wants a DigitalRain. Import it from its own subpath:
// '@kp-soft/themes/fx/boot-sequence'.
export { default as DecipherText } from './decipher-text.jsx';
export { default as DigitalRain } from './digital-rain.jsx';
export { default as ScrambleNumber } from './scramble-number.jsx';
export { useReducedMotion } from './use-reduced-motion.js';
