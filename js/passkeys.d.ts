export { PASSKEYS, PASSKEYS_REGISTER_EVENT, PASSKEYS_RETRY_EVENT, PASSKEYS_REMOVE_EVENT, PASSKEYS_RENAME_EVENT, PASSKEY_KINDS, } from './passkeys/constants.js';
export { passkeyOptions, sortPasskeys, unusedDays } from './passkeys/options.js';
export { setPasskeys, attachPasskeys } from './passkeys/api.js';
export type PasskeyKind = import('./passkeys/constants.js').PasskeyKind;
export type PasskeyRow = import('./passkeys/constants.js').PasskeyRow;
export type PasskeysSpec = import('./passkeys/constants.js').PasskeysSpec;
/** @typedef {import('./passkeys/constants.js').PasskeyKind} PasskeyKind */
/** @typedef {import('./passkeys/constants.js').PasskeyRow} PasskeyRow */
/** @typedef {import('./passkeys/constants.js').PasskeysSpec} PasskeysSpec */
