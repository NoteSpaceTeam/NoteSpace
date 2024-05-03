const SERVER_IP = import.meta.env.VITE_SERVER_IP || 'localhost';
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || '8080';
const SOCKET_SERVER_URL = `ws://${SERVER_IP}:${SERVER_PORT}`;
const HTTP_SERVER_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

export default {
  SOCKET_SERVER_URL,
  HTTP_SERVER_URL,
};
