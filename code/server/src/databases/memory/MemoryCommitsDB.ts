import { NotFoundError } from '@domain/errors/errors';
import { CommitsRepository } from '@databases/types';
import { Commit, CommitMeta } from '@notespace/shared/src/document/types/commits';

export class MemoryCommitsDB implements CommitsRepository {
  private readonly commits: Record<string, Record<string, Commit>> = {};

  async getCommit(id: string, commitId: string): Promise<Commit> {
    if (!this.commits[id]) throw new NotFoundError(`Document not found`);
    const commit = this.commits[id][commitId];
    if (!commit) throw new NotFoundError(`Commit not found`);
    return commit;
  }

  async getCommits(id: string): Promise<CommitMeta[]> {
    if (!this.commits[id]) return [];
    return Object.values(this.commits[id])
      .map(({ id, timestamp, author }) => ({ id, timestamp, author }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  async saveCommit(id: string, commit: Commit): Promise<void> {
    if (!this.commits[id]) {
      this.commits[id] = {};
    }
    this.commits[id][commit.id] = commit;
  }

  async deleteCommits(id: string): Promise<void> {
    delete this.commits[id];
  }
}
