// The review database: the one module every tool reads and writes the review stores through. No other file holds SQL.
//
//   reading((db) => loadRegister(db))            read-only, the configured database
//   writing((db) => saveRegister(db, register))  one transaction, all or nothing
//
// The configured database is data/kp-themes.sqlite unless KP_THEMES_DB names another (gates/db/config.mjs).

export { DB_FILE, EXPORTS, ROOT, databasePath, usesRepositoryDatabase } from './config.mjs';
export { SCHEMA_VERSION, openDatabase, reading, withDatabase, writing } from './connection.mjs';
export { loadNotes, loadRegister, saveNotes, saveRegister } from './register-store.mjs';
export { loadHashReadings, loadPixelChecks, loadRound, saveHashReadings, savePixelChecks, saveRound } from './checks-store.mjs';
export { PAIR_LISTS, addRound, ensureDemo, loadDemoVerdicts, receivedPages, saveDemoVerdicts, verdictDemos } from './demo-store.mjs';
export { FACTS, deleteDemoFact, loadDemoFact, loadDemoFacts, saveDemoFact } from './demo-facts-store.mjs';
export { listGos, recordGo } from './release-go-store.mjs';
