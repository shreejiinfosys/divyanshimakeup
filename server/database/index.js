/**
 * server/database
 * Single source of truth for app data. Every service in server/services/*
 * only talks to this module's read()/update() functions, never to a
 * storage engine directly — so the storage engine can be swapped freely.
 *
 * - If MONGODB_URI is set: stores the whole app-data object as one document
 *   in MongoDB Atlas (free tier). This is what production/deployed
 *   environments use, since it survives redeploys and works on serverless
 *   hosts (Vercel, Render) where the local filesystem is ephemeral.
 * - If MONGODB_URI is NOT set: falls back to the local db.json file, for
 *   quick local development without needing a Mongo cluster running.
 *
 * On first connection to an empty MongoDB collection, the current
 * db.json content is used to seed it, so existing demo data carries over.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const MONGODB_URI = process.env.MONGODB_URI;
const DOC_ID = 'app-data';

function readSeedFile() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

// ── File-backed mode (local dev without MONGODB_URI) ──
let writeLock = Promise.resolve();

function readFile() {
  return readSeedFile();
}

function updateFile(mutator) {
  writeLock = writeLock.then(() => {
    const data = readSeedFile();
    const next = mutator(data);
    fs.writeFileSync(DB_PATH, JSON.stringify(next, null, 2), 'utf-8');
    return next;
  });
  return writeLock;
}

// ── MongoDB-backed mode (production) ──
let mongoClientPromise = null;
let mongoCollectionPromise = null;

function getCollection() {
  if (mongoCollectionPromise) return mongoCollectionPromise;

  const { MongoClient } = require('mongodb');
  mongoClientPromise = new MongoClient(MONGODB_URI).connect();

  mongoCollectionPromise = mongoClientPromise.then(async (client) => {
    const collection = client.db('divyanshi_studios').collection('app_data');
    const existing = await collection.findOne({ _id: DOC_ID });
    if (!existing) {
      await collection.insertOne({ _id: DOC_ID, ...readSeedFile() });
    }
    return collection;
  });

  return mongoCollectionPromise;
}

async function readMongo() {
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: DOC_ID });
  const { _id, ...data } = doc;
  return data;
}

let mongoWriteLock = Promise.resolve();

function updateMongo(mutator) {
  mongoWriteLock = mongoWriteLock.then(async () => {
    const collection = await getCollection();
    const doc = await collection.findOne({ _id: DOC_ID });
    const { _id, ...current } = doc;
    const next = mutator(current);
    await collection.replaceOne({ _id: DOC_ID }, { _id: DOC_ID, ...next });
    return next;
  });
  return mongoWriteLock;
}

// ── Public API ──
const read = MONGODB_URI ? readMongo : readFile;
const update = MONGODB_URI ? updateMongo : updateFile;

module.exports = { read, update, DB_PATH };
