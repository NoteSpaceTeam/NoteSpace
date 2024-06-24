import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { Commit, CommitData } from '@notespace/shared/src/document/types/commits';
import { ErrorHandler } from '@/contexts/error/ErrorContext';

function commitsService(http: HttpCommunication, errorHandler: ErrorHandler, wid: string, id: string) {
  async function commit() {
    return errorHandler(async () => await http.post(`/workspaces/${wid}/${id}/commit`));
  }

  async function rollback(commitId: string) {
    return errorHandler(async () => await http.post(`/workspaces/${wid}/${id}/rollback`, { commitId }));
  }

  async function fork(commitId: string) {
    return errorHandler(async () => await http.post(`/workspaces/${wid}/${id}/fork`, { commitId }));
  }

  async function getCommits(): Promise<Commit[]> {
    return errorHandler(async () => await http.get(`/workspaces/${wid}/${id}/commits`));
  }

  async function getCommit(commitId: string): Promise<CommitData> {
    return errorHandler(async () => await http.get(`/workspaces/${wid}/${id}/commits/${commitId}`));
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
