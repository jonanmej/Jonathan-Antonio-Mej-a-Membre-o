import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
try {
  const db = getFirestore(app, config.firestoreDatabaseId);
  console.log("Success:", db !== null);
} catch (e) {
  console.error("Error creating firestore:", e.message);
}
