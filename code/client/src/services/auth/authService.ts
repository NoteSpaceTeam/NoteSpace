import { User, UserData } from '@notespace/shared/src/users/types';
import { HttpCommunication } from '@services/communication/http/httpCommunication';

function authService(http: HttpCommunication) {
  async function sessionLogin(idToken: string, csrfToken: string, id: string, data: UserData) {
    await http.post('/users/login', { idToken, csrfToken, id, ...data });
  }

  async function sessionLogout() {
    await http.post('/users/logout');
  }

  async function getUser(id: string): Promise<User> {
    return await http.get(`/users/${id}`);
  }

  async function updateUser(id: string, newProps: Partial<UserData>) {
    await http.put(`/users/${id}`, { id, ...newProps });
  }

  async function deleteUser(id: string) {
    await http.delete(`/users/${id}`);
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
