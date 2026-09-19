import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    await getDocFromServer(doc(db, 'test/connection'));
    console.log("Success");
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
