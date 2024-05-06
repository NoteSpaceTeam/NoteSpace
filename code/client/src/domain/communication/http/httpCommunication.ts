import config from '@/config';

export const BASE_URL = config.HTTP_SERVER_URL;

export interface HttpCommunication {
  post: (url: string, data?: any) => Promise<any>;
  get: (url: string) => Promise<any>;
  put: (url: string, data?: any) => Promise<any>;
  delete: (url: string) => Promise<any>;
}

async function get(url: string) {
  return request(url, 'GET');
}

async function post(url: string, body: any) {
  return request(url, 'POST', body);
}

async function put(url: string, body: any) {
  return request(url, 'PUT', body);
}

async function del(url: string) {
  return request(url, 'DELETE');
}

const request = async (url: string, method: string, body?: any) => {
  const requestInit: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) requestInit.body = JSON.stringify(body);

  const response = await fetch(BASE_URL + url, requestInit);
  if (response.headers.get('content-length') === '0') return;

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
