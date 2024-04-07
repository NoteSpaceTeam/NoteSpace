const SERVER_IP = import.meta.env.VITE_SERVER_IP || 'localhost';

const SOCKET_SERVER_URL = `ws://${SERVER_IP}:8080`;

export default {
  SOCKET_SERVER_URL,
};
