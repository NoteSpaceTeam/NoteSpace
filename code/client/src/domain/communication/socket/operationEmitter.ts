import { Operation } from '@notespace/shared/crdt/types/operations';
import { range } from 'lodash';
import { socket } from '@/domain/communication/socket/socketCommunication';

export class OperationEmitter {
  private readonly operationBuffer: Operation[] = [];
  private readonly timeoutDuration = 250;
  private readonly chunkSize = 50;
  private readonly maxBufferedOperations = 10;
  private timeoutId: NodeJS.Timeout | null = null;

  addOperation(...operations: Operation[]): void {
    this.operationBuffer.push(...operations);
    this.resetTimeout();

    if (this.operationBuffer.length >= this.maxBufferedOperations) {
      this.emitOperations();
    }
  }

  private resetTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => this.emitOperations(), this.timeoutDuration);
  }

  private emitOperations(): void {
    if (this.operationBuffer.length > 0) {
      if (this.operationBuffer.length > this.chunkSize) {
        this.emitChunked();
      } else {
        socket.emit('operation', this.operationBuffer);
      }
      this.operationBuffer.length = 0;
    }
  }

  private emitChunked(): void {
    const chunks: any[] = range(0, this.operationBuffer.length, this.chunkSize).map(i =>
      this.operationBuffer.slice(i, this.chunkSize + i)
    );
    let chunkIndex = 0;
    const onAcknowledge = () => {
      console.log('ack');
      if (chunkIndex < chunks.length) {
        socket.emit('operation', chunks[chunkIndex++]);
      } else {
        socket.off('ack', onAcknowledge);
      }
    };
    socket.emit('operation', chunks[chunkIndex++]);
    socket.on('ack', onAcknowledge);
  }
}
