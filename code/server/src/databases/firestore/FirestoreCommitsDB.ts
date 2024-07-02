import db from '@src/firebaseConfig';
import { CommitsRepository } from '@databases/types';
import { Commit, CommitMeta } from '@notespace/shared/src/document/types/commits';
import { NotFoundError } from '@src/errors';

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
    const { content, timestamp, author } = commitData;
    return { id: commitId, content, timestamp, author };
  }

  async getCommits(id: string): Promise<CommitMeta[]> {
    const doc = db.collection('commits').doc(id);
    const snapshot = await doc.get();
    const data = snapshot.data();
    if (!data) return [];
    return Object.entries(data)
      .map(([id, { timestamp, author }]) => ({ id, timestamp, author }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  async deleteCommits(id: string): Promise<void> {
    const doc = db.collection('commits').doc(id);
    await doc.delete();
  }
}
