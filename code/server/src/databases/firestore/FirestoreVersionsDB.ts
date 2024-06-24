import db from '@src/firebaseConfig';
import { VersionsRepository } from '@databases/types';
import { DocumentVersion } from '@notespace/shared/src/document/types/versions';
import { NotFoundError } from '@domain/errors/errors';

export class FirestoreVersionsDB implements VersionsRepository {
  async saveVersion(id: string, version: DocumentVersion): Promise<void> {
    const doc = db.collection('versions').doc(id);
    const data = { [version.id]: { content: version.content, timestamp: version.timestamp } };
    await doc.set(data, { merge: true });
  }

  async getVersion(id: string, versionId: string): Promise<DocumentVersion> {
    const doc = db.collection('versions').doc(id);
    const snapshot = await doc.get();
    const data = snapshot.data();
    if (!data) throw new NotFoundError(`Version not found`);
    const versionData = data[versionId];
    if (!versionData) throw new NotFoundError(`Version not found`);
    return { id: versionId, content: versionData.content, timestamp: versionData.timestamp };
  }

  async getVersions(id: string): Promise<DocumentVersion[]> {
    const doc = db.collection('versions').doc(id);
    const snapshot = await doc.get();
    const data = snapshot.data();
    if (!data) throw new NotFoundError(`Versions not found`);
    return Object.entries(data)
      .map(([id, { content, timestamp }]) => ({ id, content, timestamp }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}
