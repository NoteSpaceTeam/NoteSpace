import { HistoryTestPipeline } from '@tests/editor/slate/operations/history/HistoryTestPipeline';
import { BaseOperation, Descendant } from 'slate';
import { BlockStyles } from '@notespace/shared/src/document/types/styles';
let pipeline: HistoryTestPipeline;

beforeEach(() => {
  pipeline = new HistoryTestPipeline();
});

describe('Undo text insertion', () => {
  describe('Start of the line', () => {
    describe('No style line', () => {
      describe('no inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 0, text: 'cd' }];
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'cd'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [
            {
              type: 'insert_node',
              path: [0, 0],
              node: { bold: true, text: 'cd' },
            },
          ];
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'cd'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
    });
    describe('Style line', () => {
      describe('no inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.setupEditor();

          firstSnapshot = pipeline.takeSnapshot();

          // Apply editor operations
          const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 0, text: 'cd' }];
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'cd'.split(''));
          pipeline.applyOperations(slateOperations);

          secondSnapshot = pipeline.takeSnapshot();

          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          // Apply block line style
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [
            { type: 'insert_node', path: [0, 0], node: { bold: true, text: 'cd' } },
          ];
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            { value: 'c', styles: ['bold'] },
            { value: 'd', styles: ['bold'] }
          );
          pipeline.applyOperations(slateOperations);

          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          // Extract redo operations
          const redoBatch = pipeline.extractRedoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...redoBatch.operations);
          // Compare snapshots
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
    });
  });
  describe('Middle of the line', () => {
    describe('No style line', () => {
      describe('no inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 1, text: 'cd' }];
          pipeline.fugue.insertLocal({ line: 0, column: 1 }, ...'cd'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [
            //{ type: 'split_node', path: [0, 0], position: 1, properties: { type: 'paragraph' } },
            { type: 'insert_node', path: [0, 1], node: { bold: true, text: 'cd' } },
          ];
          pipeline.fugue.insertLocal(
            { line: 0, column: 2 },
            { value: 'c', styles: ['bold'] },
            { value: 'd', styles: ['bold'] }
          );
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
    });
    describe('Style line', () => {
      describe('no inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 1, text: 'cd' }];
          pipeline.fugue.insertLocal({ line: 0, column: 1 }, ...'cd'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal(
            { line: 0, column: 0 },
            { value: 'a', styles: ['bold'] },
            { value: 'b', styles: ['bold'] }
          );
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [
            //{ type: 'split_node', path: [0, 0], position: 1, properties: { type: 'paragraph' } },
            { type: 'insert_text', path: [0, 0], offset: 2, text: 'cd' },
          ];
          pipeline.fugue.insertLocal(
            { line: 0, column: 2 },
            { value: 'c', styles: ['bold'] },
            { value: 'd', styles: ['bold'] }
          );
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
    });
  });
  describe('End of the line', () => {
    describe('No style line', () => {
      describe('no inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 5, text: ' World' }];
          pipeline.fugue.insertLocal({ line: 0, column: 5 }, ...' World'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [
            { type: 'insert_node', path: [0, 1], node: { bold: true, text: ' World' } },
          ];
          pipeline.fugue.insertLocal({ line: 0, column: 5 }, ...' World'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
    });
    describe('Style line', () => {
      describe('no inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
          pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello'.split(''));
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 5, text: ' World' }];
          pipeline.fugue.insertLocal({ line: 0, column: 5 }, ...' World'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
      describe('inline style', () => {
        let firstSnapshot: Descendant[], secondSnapshot: Descendant[];
        beforeEach(() => {
          pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);

          'Hello'.split('').map((value, index) => {
            pipeline.fugue.insertLocal({ line: 0, column: index }, { value, styles: ['bold'] });
          });
          pipeline.setupEditor();
          firstSnapshot = pipeline.takeSnapshot();
          // Apply editor operations
          const slateOperations: BaseOperation[] = [{ type: 'insert_node', path: [0, 1], node: { text: ' World' } }];
          pipeline.fugue.insertLocal({ line: 0, column: 5 }, ...' World'.split(''));
          pipeline.applyOperations(slateOperations);
          secondSnapshot = pipeline.takeSnapshot();
          // Extract undo operations
          const batch = pipeline.extractUndoOperations();
          // Apply history operations
          pipeline.applyHistoryOperations(...batch.operations);
        });
        it('should undo', () => {
          // Compare snapshots
          const afterSnapshot = pipeline.takeSnapshot();
          expect(afterSnapshot).toEqual(firstSnapshot as Descendant[]);
        });
        it('should redo', () => {
          const redoBatch = pipeline.extractRedoOperations();
          pipeline.applyHistoryOperations(...redoBatch.operations);
          const finalSnapshot = pipeline.takeSnapshot();
          expect(finalSnapshot).toEqual(secondSnapshot);
        });
      });
    });
  });
});
