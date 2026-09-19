import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const config = (firebaseConfig as any).default || firebaseConfig;
const app = initializeApp(config);
let dbInstance;
try {
  dbInstance = getFirestore(app, config.firestoreDatabaseId || '(default)');
} catch (e) {
  console.error("Error init firestore:", e);
}
export const db = dbInstance;
export const auth = getAuth(app);

export { config as firebaseConfig };
