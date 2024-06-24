import { NotFoundError } from '@domain/errors/errors';
import { VersionsRepository } from '@databases/types';
import { DocumentVersion } from '@notespace/shared/src/document/types/versions';

export class MemoryVersionsDB implements VersionsRepository {
  private readonly versions: Record<string, Record<string, DocumentVersion>> = {};

  async getVersion(id: string, versionId: string): Promise<DocumentVersion> {
    if (!this.versions[id]) throw new NotFoundError(`Document not found`);
    const version = this.versions[id][versionId];
    if (!version) throw new NotFoundError(`Version not found`);
    return version;
  }

  async getVersions(id: string): Promise<DocumentVersion[]> {
    return Object.values(this.versions[id]);
  }

  async saveVersion(id: string, version: DocumentVersion): Promise<void> {
    if (!this.versions[id]) {
      this.versions[id] = {};
    }
    this.versions[id][version.id] = version;
  }
}
