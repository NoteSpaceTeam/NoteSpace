import { UserData } from '@notespace/shared/src/users/types';
import { HttpCommunication } from '@services/communication/http/httpCommunication';

function authService(http: HttpCommunication) {
  async function registerUser(id: string, data: UserData) {
    await http.post('/users', { id, ...data });
  }

  async function getUser(id: string) {
    return await http.get(`/users/${id}`);
  }

  async function updateUser(id: string, newProps: Partial<UserData>) {
    await http.put(`/users/${id}`, { id, ...newProps });
  }

  async function deleteUser(id: string) {
    await http.delete(`/users/${id}`);
  }

  return {
    registerUser,
    getUser,
    updateUser,
    deleteUser,
  };
}

export default authService;
