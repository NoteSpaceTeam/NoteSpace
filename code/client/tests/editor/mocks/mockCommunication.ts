import { Communication } from '@editor/domain/communication';

export function mockCommunication(): Communication {
  return {
    emit: () => {},
    emitChunked: () => {},
    on: () => {},
    off: () => {},
  };
}
