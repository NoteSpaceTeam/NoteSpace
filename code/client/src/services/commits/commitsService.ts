import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { Commit, CommitData } from '@notespace/shared/src/document/types/commits';

function commitsService(http: HttpCommunication, wid: string, id: string) {
  async function commit() {
    return await http.post(`/workspaces/${wid}/${id}/commit`);
  }

  async function rollback(commitId: string) {
    return await http.post(`/workspaces/${wid}/${id}/rollback`, { commitId });
  }

  async function fork(commitId: string) {
    return await http.post(`/workspaces/${wid}/${id}/fork`, { commitId });
  }

  async function getCommits(): Promise<Commit[]> {
    return await http.get(`/workspaces/${wid}/${id}/commits`);
  }

  async function getCommit(commitId: string): Promise<CommitData> {
    return await http.get(`/workspaces/${wid}/${id}/commits/${commitId}`);
  }

  return {
    commit,
    rollback,
    fork,
    getCommits,
    getCommit,
  };
}

export default commitsService;
