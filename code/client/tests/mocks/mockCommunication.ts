import { Communication } from '@domain/communication/communication';

export function mockCommunication(): Communication {
  return {
    socket: {
      emit: () => {},
      on: () => {},
      off: () => {},
      connect: () => {},
      disconnect: () => {},
    },
    http: {
      get: async () => ({ nodes: [], title: '' }),
      post: async () => {},
      put: async () => {},
      delete: async () => {},
    },
  };
}
