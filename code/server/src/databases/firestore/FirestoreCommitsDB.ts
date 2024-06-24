import db from '@src/firebaseConfig';
import { CommitsRepository } from '@databases/types';
import { Commit } from '@notespace/shared/src/document/types/commits';
import { NotFoundError } from '@domain/errors/errors';

export class FirestoreCommitsDB implements CommitsRepository {
  async saveCommit(id: string, commit: Commit): Promise<void> {
    const doc = db.collection('commits').doc(id);
    const data = { [commit.id]: { content: commit.content, timestamp: commit.timestamp } };
    await doc.set(data, { merge: true });
  }

  async getCommit(id: string, commitId: string): Promise<Commit> {
    const doc = db.collection('commits').doc(id);
    const snapshot = await doc.get();
    const data = snapshot.data();
    if (!data) throw new NotFoundError(`Commit not found`);
    const commitData = data[commitId];
    if (!commitData) throw new NotFoundError(`Commit not found`);
    return { id: commitId, content: commitData.content, timestamp: commitData.timestamp };
  }

  async getCommits(id: string): Promise<Commit[]> {
    const doc = db.collection('commits').doc(id);
    const snapshot = await doc.get();
    const data = snapshot.data();
    if (!data) throw new NotFoundError(`Commits not found`);
    return Object.entries(data)
      .map(([id, { content, timestamp }]) => ({ id, content, timestamp }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}
