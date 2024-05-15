import { Operation } from '@notespace/shared/src/document/types/operations';
import { isEmpty, range } from 'lodash';
import { Socket } from 'socket.io-client';

/**
 * Buffers operations and emits them in chunks to the server.
 */
export class OperationEmitter {
  private readonly socket: Socket;
  private readonly operationBuffer: Operation[] = [];
  private readonly timeoutDuration;
  private readonly chunkSize = 300;
  private readonly maxBufferedOperations = 20;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(socket: Socket, operationDelay: number) {
    this.socket = socket;
    this.timeoutDuration = operationDelay;
  }

  addOperation(...operations: Operation[]) {
    this.operationBuffer.push(...operations);
    this.resetTimeout();
    if (this.operationBuffer.length >= this.maxBufferedOperations) this.emitOperations();
  }

  private resetTimeout() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.emitOperations(), this.timeoutDuration);
  }

  private emitOperations() {
    if (isEmpty(this.operationBuffer)) return;
    if (this.operationBuffer.length > this.chunkSize) {
      this.emitChunked();
    } else {
      this.socket.emit('operations', this.operationBuffer);
    }
    this.operationBuffer.length = 0;
  }

  private emitChunked() {
    const chunks = range(0, this.operationBuffer.length, this.chunkSize).map(i =>
      this.operationBuffer.slice(i, this.chunkSize + i)
    );
    let chunkIndex = 0;
    const onAcknowledge = () => {
      if (chunkIndex < chunks.length) {
        this.socket.emit('operations', chunks[chunkIndex++]);
        return;
      }
      this.socket.off('ack', onAcknowledge);
    };
    this.socket.emit('operations', chunks[chunkIndex++]);
    this.socket.on('ack', onAcknowledge);
  }
}
