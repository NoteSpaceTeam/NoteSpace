import { SERVER_URL } from '@config';

export interface HttpCommunication {
  post: (url: string, data?: any, withAuth?: boolean) => Promise<any>;
  get: (url: string, withAuth?: boolean) => Promise<any>;
  put: (url: string, data?: any, withAuth?: boolean) => Promise<any>;
  delete: (url: string, data?: any, withAuth?: boolean) => Promise<any>;
}

async function get(url: string, withAuth: boolean = false) {
  return request(url, 'GET', undefined, withAuth);
}

async function post(url: string, body: any, withAuth: boolean = false) {
  return request(url, 'POST', body, withAuth);
}

async function put(url: string, body: any, withAuth: boolean = false) {
  return request(url, 'PUT', body, withAuth);
}

async function del(url: string, body: any, withAuth: boolean = false) {
  return request(url, 'DELETE', body, withAuth);
}

const request = async (url: string, method: string, body: any, withAuth: boolean) => {
  const requestInit: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) requestInit.body = JSON.stringify(body);
  if (withAuth) requestInit.credentials = 'include';

  console.log('requestInit:', requestInit);

  const response = await fetch(SERVER_URL + url, requestInit);
  const noBody = response.status === 204 || response.headers.get('content-length') === '0';
  if (noBody) return;
  const result = await response.json();
  if (response.ok) return result;
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }
  if (response.status === 403) {
    throw new Error('Forbidden');
  }
  throw new Error(result.error || 'Failed to fetch');
};

export const httpCommunication: HttpCommunication = {
  post,
  get,
  put,
  delete: del,
};
