import { HistoryTestPipeline } from '@tests/editor/slate/operations/history/HistoryTestPipeline';
import { BaseOperation } from 'slate';
import { BlockStyles } from '@notespace/shared/src/document/types/styles';
let pipeline: HistoryTestPipeline;

beforeEach(() => {
  pipeline = new HistoryTestPipeline();
});

describe('Undo text insertion', () => {
  describe('Start of the line', () => {
    describe('No style line', () => {
      it('no inline style', () => {
        // Take snapshot for comparison
        const snapshot = pipeline.takeSnapshot();
        // Apply editor operations
        const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 0, text: 'cd' }];
        // Equivalent Fugue operations
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'cd'.split(''));

        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const newSnapshot = pipeline.takeSnapshot();
        expect(newSnapshot).toEqual(snapshot);
      });
      it('inline style', () => {
        // Take snapshot for comparison
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply editor operations
        const slateOperations: BaseOperation[] = [
          { type: 'insert_node', path: [0, 0], node: { type: 'bold', text: 'cd' } },
        ];
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          { value: 'c', styles: ['bold'] },
          { value: 'd', styles: ['bold'] }
        );
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
    describe('Style line', () => {
      it('no inline style', () => {
        // Apply block line style
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.setupEditor();

        const beforeSnapshot = pipeline.takeSnapshot();

        // Apply editor operations
        const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 0, text: 'cd' }];
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'cd'.split(''));
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('inline style', () => {
        // Apply block line style
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();

        // Apply editor operations
        const slateOperations: BaseOperation[] = [
          { type: 'insert_node', path: [0, 0], node: { type: 'bold', text: 'cd' } },
        ];
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          { value: 'c', styles: ['bold'] },
          { value: 'd', styles: ['bold'] }
        );
        pipeline.applyOperations(slateOperations);

        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
  });
  describe('Middle of the line', () => {
    describe('No style line', () => {
      it('No inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply editor operations
        const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 1, text: 'cd' }];
        pipeline.fugue.insertLocal({ line: 0, column: 1 }, ...'cd'.split(''));
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply editor operations
        const slateOperations: BaseOperation[] = [
          { type: 'split_node', path: [0, 0], position: 1, properties: { type: 'paragraph' } },
          { type: 'insert_node', path: [0, 1], node: { type: 'bold', text: 'cd' } },
        ];
        pipeline.fugue.insertLocal(
          { line: 0, column: 1 },
          { value: 'c', styles: ['bold'] },
          { value: 'd', styles: ['bold'] }
        );
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
    describe('Style line', () => {
      it('no inline style', () => {
        // setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();

        // Apply editor operations
        const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 1, text: 'cd' }];
        pipeline.fugue.insertLocal({ line: 0, column: 1 }, ...'cd'.split(''));
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('inline style', () => {
        // Apply block line style
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          { value: 'a', styles: ['bold'] },
          { value: 'b', styles: ['bold'] }
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();

        // Apply editor operations
        const slateOperations: BaseOperation[] = [
          { type: 'split_node', path: [0, 0], position: 1, properties: { type: 'paragraph' } },
          { type: 'insert_node', path: [0, 1], node: { type: 'bold', text: 'cd' } },
        ];
        pipeline.fugue.insertLocal(
          { line: 0, column: 1 },
          { value: 'c', styles: ['bold'] },
          { value: 'd', styles: ['bold'] }
        );
        pipeline.applyOperations(slateOperations);

        // Extract undo operations
        pipeline.extractUndoOperations();
        // ...
        // Redo the undo operations
        pipeline.extractRedoOperations(); // implicitly redoes the undo operation
        // Test
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
  });
  describe('End of the line', () => {
    describe('No style line', () => {
      it('no inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply editor operations
        const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 2, text: 'cd' }];
        pipeline.fugue.insertLocal({ line: 0, column: 2 }, ...'cd'.split(''));
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply editor operations
        const slateOperations: BaseOperation[] = [
          { type: 'insert_node', path: [0, 1], node: { type: 'bold', text: 'cd' } },
        ];
        pipeline.fugue.insertLocal(
          { line: 0, column: 2 },
          { value: 'c', styles: ['bold'] },
          { value: 'd', styles: ['bold'] }
        );
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
    describe('Style line', () => {
      it('no inline style', () => {
        // Apply block line style
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'ab'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();

        // Apply editor operations
        const slateOperations: BaseOperation[] = [{ type: 'insert_text', path: [0, 0], offset: 2, text: 'cd' }];
        pipeline.fugue.insertLocal({ line: 0, column: 2 }, ...'cd'.split(''));
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        pipeline.extractUndoOperations();
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('inline style', () => {
        // Setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          { value: 'a', styles: ['bold'] },
          { value: 'b', styles: ['bold'] }
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();

        // Apply editor operations
        const slateOperations: BaseOperation[] = [
          { type: 'insert_node', path: [0, 1], node: { type: 'bold', text: 'cd' } },
        ];
        pipeline.fugue.insertLocal(
          { line: 0, column: 2 },
          { value: 'c', styles: ['bold'] },
          { value: 'd', styles: ['bold'] }
        );
        pipeline.applyOperations(slateOperations);
        // Extract undo operations
        const batch = pipeline.extractUndoOperations();
        // Apply history operations
        pipeline.applyHistoryOperations(...batch.operations);
        // Compare snapshots
        const afterSnapshot = pipeline.takeSnapshot();
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
  });
});
