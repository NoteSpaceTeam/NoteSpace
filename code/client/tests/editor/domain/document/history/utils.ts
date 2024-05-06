import { vitest } from 'vitest';

import { Communication } from '@domain/communication/communication';

export const mockSocket: Communication = {
  socket: {
    emit: vitest.fn(),
    on: vitest.fn(),
    off: vitest.fn(),
    connect: vitest.fn(),
    disconnect: vitest.fn(),
  },
  http: {
    get: vitest.fn(),
    post: vitest.fn(),
    put: vitest.fn(),
    delete: vitest.fn(),
  },
};
