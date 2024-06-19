import { HistoryTestPipeline } from '@tests/editor/slate/operations/history/HistoryTestPipeline';
import { Descendant, RemoveTextOperation } from 'slate';
import { NodeInsert } from '@domain/editor/fugue/types';
import { BlockStyles } from '@notespace/shared/src/document/types/styles';

let pipeline: HistoryTestPipeline;

beforeEach(() => {
  pipeline = new HistoryTestPipeline();
});

describe('Undo delete text', () => {
  describe('Start of line', () => {
    describe('No block style', () => {
      describe('No inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 0, text: 'H' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 1 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('Inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
          );
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 0, text: 'H' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 1 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
    });
    describe('Block style', () => {
      describe('No inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 0, text: 'H' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 1 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('Inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
          );
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 0, text: 'H' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 1 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
    });
  });
  describe('Middle of line', () => {
    describe('No block style', () => {
      describe('No inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 5, text: ' ' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 6 }, end: { line: 0, column: 7 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('Inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
          );
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 5, text: ' ' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 6 }, end: { line: 0, column: 7 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
    });
    describe('Block style', () => {
      describe('No inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 5, text: ' ' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 6 }, end: { line: 0, column: 7 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('Inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
          );
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 5, text: ' ' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 6 }, end: { line: 0, column: 7 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
    });
  });
  describe('End of line', () => {
    describe('No block style', () => {
      describe('No inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('Inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
          );
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
    });
    describe('Block style', () => {
      describe('No inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('Inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Setup editor
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
          );
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply operations
          const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
          pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
          pipeline.applyOperations(slateOperation);

          secondSnapshot = pipeline.takeSnapshot();
          // Get undo operations
          const batch = pipeline.extractUndoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(firstSnapshot);
        });
        it('should redo', () => {
          const batch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...batch.operations);
          const afterSnapshot = pipeline.takeSnapshot();
          // Compare
          expect(afterSnapshot).toEqual(secondSnapshot);
        });
      });
    });
  });
});
