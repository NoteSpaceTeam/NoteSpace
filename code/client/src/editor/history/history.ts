import Stack from '@editor/history/stack';
import { Operation } from '@notespace/shared/crdt/types/operations';

class History {
  private undoStack = new Stack<Operation[]>();
  private redoStack = new Stack<Operation[]>();
  private undoArray: Operation[] = [];

  register(operations: Operation[]) {
    this.undoArray.push(...operations);
  }

  save() {
    this.undoStack.push(this.undoArray);
    this.undoArray = [];
    this.redoStack.clear();
  }

  undo(): Operation[] | undefined {
    const operations = this.undoStack.isEmpty() ? this.undoArray : this.undoStack.pop();
    if (operations) {
      this.redoStack.push(operations);
    }
    return operations;
  }

  redo(): Operation[] | undefined {
    const operations = this.redoStack.pop();
    if (operations) {
      this.undoStack.push(operations);
    }
    return operations;
  }
}

export default History;
