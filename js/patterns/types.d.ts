export type ActionDetail = {
    target: HTMLElement;
    button: HTMLElement;
    key: string | null;
    restore: () => void;
};
export type SecretLoad = (field: HTMLElement, purpose: 'reveal' | 'copy') => string | Promise<string>;
export type SecretState = 'hidden' | 'loading' | 'shown' | 'error' | 'disabled';
/** @typedef {{ target: HTMLElement, button: HTMLElement, key: string | null, restore: () => void }} ActionDetail */
/** @typedef {(field: HTMLElement, purpose: 'reveal' | 'copy') => string | Promise<string>} SecretLoad */
/** @typedef {'hidden' | 'loading' | 'shown' | 'error' | 'disabled'} SecretState */
export {};
