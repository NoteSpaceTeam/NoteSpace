import { Communication } from '@communication/communication.ts';

export function mockCommunication(): Communication {
  return {
    socket: {
      emit: () => {},
      emitChunked: () => {},
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