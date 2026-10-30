// The types of the copy buttons and the secret fields.

/** @typedef {{ target: HTMLElement, button: HTMLElement, key: string | null, restore: () => void }} ActionDetail */

/** @typedef {(field: HTMLElement, purpose: 'reveal' | 'copy') => string | Promise<string>} SecretLoad */
/** @typedef {'hidden' | 'loading' | 'shown' | 'error' | 'disabled'} SecretState */

export {};
