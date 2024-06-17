import { HistoryTestPipeline } from '@tests/editor/slate/operations/history/HistoryTestPipeline';
import { RemoveTextOperation } from 'slate';
import { NodeInsert } from '@domain/editor/fugue/types';
import { BlockStyles } from '@notespace/shared/src/document/types/styles';

let pipeline: HistoryTestPipeline;

beforeEach(() => {
  pipeline = new HistoryTestPipeline();
});

describe('Undo delete text', () => {
  describe('Start of line', () => {
    describe('No block style', () => {
      it('No inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [
          { type: 'remove_text', path: [0, 0], offset: 0, text: 'Hello World' },
        ];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });

      it('Inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [
          { type: 'remove_text', path: [0, 0], offset: 0, text: 'Hello World' },
        ];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
    describe('Block style', () => {
      it('No inline style', () => {
        // Setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [
          { type: 'remove_text', path: [0, 0], offset: 0, text: 'Hello World' },
        ];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('Inline style', () => {
        // Setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [
          { type: 'remove_text', path: [0, 0], offset: 0, text: 'Hello World' },
        ];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 0 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
  });
  describe('Middle of line', () => {
    describe('No block style', () => {
      it('No inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 6, text: 'World' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 7 }, end: { line: 0, column: 12 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('Inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 6, text: 'World' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 7 }, end: { line: 0, column: 12 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
    describe('Block style', () => {
      it('No inline style', () => {
        // Setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 6, text: 'World' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 7 }, end: { line: 0, column: 12 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('Inline style', () => {
        // Setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 6, text: 'World' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 7 }, end: { line: 0, column: 12 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
  });
  describe('End of line', () => {
    describe('No block style', () => {
      it('No inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('Inline style', () => {
        // Setup editor
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
    describe('Block style', () => {
      it('No inline style', () => {
        // Setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello World'.split(''));
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
      it('Inline style', () => {
        // Setup editor
        pipeline.fugue.updateBlockStyleLocal(0, BlockStyles.h1);
        pipeline.fugue.insertLocal(
          { line: 0, column: 0 },
          ...'Hello World'.split('').map(value => ({ value, styles: ['bold'] }) as NodeInsert)
        );
        pipeline.setupEditor();
        const beforeSnapshot = pipeline.takeSnapshot();
        // Apply operations
        const slateOperation: RemoveTextOperation[] = [{ type: 'remove_text', path: [0, 0], offset: 10, text: 'd' }];
        pipeline.fugue.deleteLocal({ start: { line: 0, column: 11 }, end: { line: 0, column: 11 } });
        pipeline.applyOperations(slateOperation);
        // Get undo operations
        const batch = pipeline.extractUndoOperations();
        pipeline.applyHistoryOperations(...batch.operations);
        const afterSnapshot = pipeline.takeSnapshot();
        // Compare
        expect(afterSnapshot).toEqual(beforeSnapshot);
      });
    });
  });
});
