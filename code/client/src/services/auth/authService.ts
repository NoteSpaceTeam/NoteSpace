import { User } from '@notespace/shared/src/users/types';
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

  async function deleteUser(id: string) {
    return errorHandler(async () => await http.delete(`/users/${id}`));
  }

  return {
    sessionLogin,
    sessionLogout,
    getUser,
    deleteUser,
  };
}

export default authService;
