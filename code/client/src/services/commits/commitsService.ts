import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { Commit, CommitData } from '@notespace/shared/src/document/types/commits';

function commitsService(http: HttpCommunication, publishError: (error: Error) => void, wid: string, id: string) {
  async function commit() {
    http.post(`/workspaces/${wid}/${id}/commit`).catch(publishError);
  }

  async function rollback(commitId: string) {
    http.post(`/workspaces/${wid}/${id}/rollback`, { commitId }).catch(publishError);
  }

  async function fork(commitId: string) {
    http.post(`/workspaces/${wid}/${id}/fork`, { commitId }).catch(publishError);
  }

  async function getCommits(): Promise<Commit[]> {
    return http.get(`/workspaces/${wid}/${id}/commits`).catch(publishError);
  }

  async function getCommit(commitId: string): Promise<CommitData> {
    return http.get(`/workspaces/${wid}/${id}/commits/${commitId}`).catch(publishError);
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
