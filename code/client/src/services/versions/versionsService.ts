import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { DocumentVersion } from '@notespace/shared/src/document/types/versions';

function versionsService(http: HttpCommunication, wid: string, id: string) {
  async function commitVersion() {
    return await http.post(`/workspaces/${wid}/${id}/commit`);
  }

  async function getVersions(): Promise<DocumentVersion[]> {
    return await http.get(`/workspaces/${wid}/${id}/versions`);
  }

  async function rollbackVersion(versionId: string) {
    return await http.post(`/workspaces/${wid}/${id}/rollback`, { versionId });
  }

  async function forkVersion(versionId: string) {
    return await http.post(`/workspaces/${wid}/${id}/fork`, { versionId });
  }

  return {
    commitVersion,
    getVersions,
    rollbackVersion,
    forkVersion,
  };
}

export default versionsService;
