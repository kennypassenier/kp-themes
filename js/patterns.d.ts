export { SECRET, SECRET_TTL, SECRET_MASK, SECRET_CLIPBOARD_EVENT, SECRET_EVENT, SECRET_REQUEST_EVENT, UNDO_MS, COPIED_MS, COMMIT_EVENT, UNDO_EVENT, CLEAR_AFTER_MS, COPY_EVENT, COPY_FAILED_EVENT, } from './patterns/constants.js';
export { attachPatterns } from './patterns/copy.js';
export { revealSecret, hideSecret, secretInputValue, setSecretInputValue } from './patterns/secret-api.js';
export { attachSecrets } from './patterns/secrets.js';
export type ActionDetail = import('./patterns/types.js').ActionDetail;
export type SecretLoad = import('./patterns/types.js').SecretLoad;
export type SecretState = import('./patterns/types.js').SecretState;
/** @typedef {import('./patterns/types.js').ActionDetail} ActionDetail */
/** @typedef {import('./patterns/types.js').SecretLoad} SecretLoad */
/** @typedef {import('./patterns/types.js').SecretState} SecretState */
