import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '@/firestore-key-5cddf-472039f8dbb6.json';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

export default db;
