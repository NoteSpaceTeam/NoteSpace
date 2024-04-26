import config from '@src/config.ts';

export const BASE_URL = config.HTTP_SERVER_URL;

export type HttpCommunication = {
  post: (url: string, data?: any) => Promise<any>;
  get: (url: string) => Promise<any>;
  put: (url: string, data?: any) => Promise<any>;
  delete: (url: string) => Promise<any>;
};

async function get(url: string) {
  const response = await fetch(BASE_URL + url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function post(url: string, body: any) {
  const response = await fetch(BASE_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

async function put(url: string, body: any) {
  const response = await fetch(BASE_URL + url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

async function del(url: string) {
  const response = await fetch(BASE_URL + url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export const httpCommunication: HttpCommunication = {
  post,
  get,
  put,
  delete: del,
};
