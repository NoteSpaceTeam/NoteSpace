import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { Commit } from '@notespace/shared/src/document/types/commits';

function commitsService(http: HttpCommunication, wid: string, id: string) {
  async function commit() {
    return await http.post(`/workspaces/${wid}/${id}/commit`);
  }

  async function getCommits(): Promise<Commit[]> {
    return await http.get(`/workspaces/${wid}/${id}/commits`);
  }

  async function rollback(commitId: string) {
    return await http.post(`/workspaces/${wid}/${id}/rollback`, { commitId });
  }

  async function fork(commitId: string) {
    return await http.post(`/workspaces/${wid}/${id}/fork`, { commitId });
  }

  return {
    commit,
    getCommits,
    rollback,
    fork,
  };
}

export default commitsService;
