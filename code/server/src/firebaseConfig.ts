import { config } from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

config();

// decode the base64 encoded service account json
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccountBuffer = Buffer.from(serviceAccountBase64!, 'base64');
const serviceAccount = JSON.parse(serviceAccountBuffer.toString('utf8'));

// initialize firebase admin sdk
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// initialize firestore
const db = getFirestore();

export default db;
