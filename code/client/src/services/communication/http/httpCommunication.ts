import { SERVER_URL } from '@config';

export interface HttpCommunication {
  post: (url: string, data?: any) => Promise<any>;
  get: (url: string, withAuth?: boolean) => Promise<any>;
  put: (url: string, data?: any) => Promise<any>;
  delete: (url: string, data?: any) => Promise<any>;
}

async function get(url: string) {
  return request(url, 'GET', undefined);
}

async function post(url: string, body?: any) {
  return request(url, 'POST', body);
}

async function put(url: string, body?: any) {
  return request(url, 'PUT', body);
}

async function del(url: string, body?: any) {
  return request(url, 'DELETE', body);
}

const request = async (url: string, method: string, body?: any) => {
  const requestInit: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  if (body) requestInit.body = JSON.stringify(body);

  const response = await fetch(SERVER_URL + url, requestInit);
  const noBody = response.status === 204 || response.headers.get('content-length') === '0';
  if (noBody) return;
  const result = await response.json();
  if (response.ok) return result;
  throw new Error(result.error || 'Failed to fetch');
};

export const httpCommunication: HttpCommunication = {
  post,
  get,
  put,
  delete: del,
};
