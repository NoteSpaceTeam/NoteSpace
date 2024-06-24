import { User, UserData } from '@notespace/shared/src/users/types';
import { HttpCommunication } from '@services/communication/http/httpCommunication';

function authService(http: HttpCommunication, publishError: (error: Error) => void) {
  async function sessionLogin(idToken: string) {
    http.post('/users/login', { idToken }).catch(publishError);
  }

  async function sessionLogout() {
    http.post('/users/logout').catch(publishError);
  }

  async function getUser(id: string): Promise<User> {
    return http.get(`/users/${id}`).catch(publishError);
  }

  async function updateUser(id: string, newProps: Partial<UserData>) {
    http.put(`/users/${id}`, { id, ...newProps }).catch(publishError);
  }

  async function deleteUser(id: string) {
    http.delete(`/users/${id}`).catch(publishError);
  }

  return {
    sessionLogin,
    sessionLogout,
    getUser,
    updateUser,
    deleteUser,
  };
}

export default authService;
