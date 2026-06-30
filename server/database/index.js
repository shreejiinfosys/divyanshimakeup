/**
 * server/database
 * Lightweight JSON-file-backed datastore. No external database service
 * required — works out of the box on Render/Firebase Functions/any Node host.
 *
 * To swap in a real database later (MongoDB, PostgreSQL, Firestore),
 * replace the implementation of read()/write() below — every service
 * in server/services/* only talks to this module, never to db.json directly.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

/** In-memory write queue to avoid concurrent write corruption on a single process. */
let writeLock = Promise.resolve();

function readRaw() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeRaw(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/** Reads the full database object. */
function read() {
  return readRaw();
}

/**
 * Atomically updates the database using a mutator function.
 * @param {(data: object) => object} mutator — receives current data, returns new data
 * @returns {Promise<object>} the updated data
 */
function update(mutator) {
  writeLock = writeLock.then(() => {
    const data = readRaw();
    const next = mutator(data);
    writeRaw(next);
    return next;
  });
  return writeLock;
}

module.exports = { read, update, DB_PATH };
