import { User, UserData } from '@notespace/shared/src/users/types';
import { HttpCommunication } from '@services/communication/http/httpCommunication';
import Cookies from 'js-cookie';

function authService(http: HttpCommunication) {
  async function registerUser(id: string, data: UserData) {
    await http.post('/users', { id, ...data });
  }

  async function getUser(id: string): Promise<User> {
    return await http.get(`/users/${id}`);
  }

  async function updateUser(id: string, newProps: Partial<UserData>) {
    await http.put(`/users/${id}`, { id, ...newProps });
  }

  async function deleteUser(id: string) {
    await http.delete(`/users/${id}`);
    Cookies.remove('token');
  }

  return {
    registerUser,
    getUser,
    updateUser,
    deleteUser,
  };
}

export default authService;
