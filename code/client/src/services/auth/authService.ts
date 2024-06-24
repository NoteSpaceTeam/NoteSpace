import { User, UserData } from '@notespace/shared/src/users/types';
import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { ErrorHandler } from '@/contexts/error/ErrorContext';

function authService(http: HttpCommunication, errorHandler: ErrorHandler) {
  async function sessionLogin(idToken: string) {
    return errorHandler(async () => await http.post('/users/login', { idToken }));
  }

  async function sessionLogout() {
    return errorHandler(async () => await http.post('/users/logout'));
  }

  async function getUser(id: string): Promise<User> {
    return errorHandler(async () => await http.get(`/users/${id}`));
  }

  async function updateUser(id: string, newProps: Partial<UserData>) {
    return errorHandler(async () => await http.put(`/users/${id}`, { id, ...newProps }));
  }

  async function deleteUser(id: string) {
    return errorHandler(async () => await http.delete(`/users/${id}`));
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
