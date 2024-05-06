import { Operation } from '@notespace/shared/crdt/types/operations';
import { isEmpty, range } from 'lodash';
import { socket } from '@domain/communication/socket/socketCommunication';

/**
 * Buffers operations and emits them in chunks to the server.
 */
export class OperationEmitter {
  private readonly operationBuffer: Operation[] = [];
  private readonly timeoutDuration = 100;
  private readonly chunkSize = 100;
  private readonly maxBufferedOperations = 20;
  private timeoutId: NodeJS.Timeout | null = null;

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
      socket.emit('operation', this.operationBuffer);
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
        socket.emit('operation', chunks[chunkIndex++]);
        return;
      }
      socket.off('ack', onAcknowledge);
    };
    socket.emit('operation', chunks[chunkIndex++]);
    socket.on('ack', onAcknowledge);
  }

  get timeout() {
    return this.timeoutDuration;
  }
}
