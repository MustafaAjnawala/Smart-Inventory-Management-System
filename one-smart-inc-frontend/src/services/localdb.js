import { openDB } from "idb";

const DB_NAME = "onesmart-inventory";
const DB_VERSION = 1;
const STORE_NAMES = ["products", "purchases", "bills", "returns"];

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      for (const store of STORE_NAMES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "_id", autoIncrement: false });
        }
      }
    },
  });
}

export async function getAll(store) {
  const db = await getDB();
  return db.getAll(store);
}

export async function put(store, value) {
  const db = await getDB();
  return db.put(store, value);
}

export async function putBulk(store, values) {
  const db = await getDB();
  const tx = db.transaction(store, "readwrite");
  for (const v of values) {
    tx.store.put(v);
  }
  await tx.done;
}

export async function clear(store) {
  const db = await getDB();
  return db.clear(store);
}

export async function deleteDB() {
  return (await getDB()).close();
}
