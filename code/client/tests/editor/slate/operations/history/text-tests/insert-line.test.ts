import { HistoryTestPipeline } from '@tests/editor/slate/operations/history/HistoryTestPipeline';
import { SplitNodeOperation } from 'slate';

let pipeline: HistoryTestPipeline;

beforeEach(() => {
  pipeline = new HistoryTestPipeline();
});

describe('Undo new line', () => {
  // TODO - Add redo tests
  it('Start of line', () => {
    const beforeSnapshot = pipeline.takeSnapshot();
    // Apply the operation
    const slateOperations: SplitNodeOperation[] = [
      {
        type: 'split_node',
        path: [0, 0],
        position: 0,
        properties: {},
      }, // This operation is not needed, but it is added to make the test more realistic
      {
        type: 'split_node',
        path: [0],
        position: 1,
        properties: { type: 'paragraph' },
      },
    ];
    pipeline.fugue.insertLocal({ line: 0, column: 0 }, '\n');
    pipeline.applyOperations(slateOperations);
    // Extract the undo operations
    const { operations } = pipeline.extractUndoOperations();
    // Apply the undo operations
    pipeline.applyHistoryOperations(...operations);
    const afterSnapshot = pipeline.takeSnapshot();
    // Compare
    expect(afterSnapshot).toEqual(beforeSnapshot);
  });
  describe('Middle of line', () => {
    it('no inline styles', () => {
      // Setup the editor
      pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello'.split(''));
      pipeline.setupEditor();
      const beforeSnapshot = pipeline.takeSnapshot();
      // Apply the operation
      const slateOperations: SplitNodeOperation[] = [
        {
          type: 'split_node',
          path: [0, 0],
          position: 3,
          properties: {},
        },
        {
          type: 'split_node',
          path: [0],
          position: 1,
          properties: { type: 'paragraph' },
        },
      ];
      pipeline.fugue.insertLocal({ line: 0, column: 3 }, '\n');
      pipeline.applyOperations(slateOperations);
      // Extract the undo operations
      const { operations } = pipeline.extractUndoOperations();
      // Apply the undo operations
      pipeline.applyHistoryOperations(...operations);
      const afterSnapshot = pipeline.takeSnapshot();
      // Compare
      expect(afterSnapshot).toEqual(beforeSnapshot);
    });
    it('inline styles', () => {
      // Setup the editor
      pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello'.split(''));
      pipeline.fugue.updateInlineStyleLocal(
        {
          start: { line: 0, column: 0 },
          end: { line: 0, column: 5 },
        },
        'bold',
        true
      );
      pipeline.setupEditor();
      const beforeSnapshot = pipeline.takeSnapshot();
      // Apply the operation
      const slateOperations: SplitNodeOperation[] = [
        {
          type: 'split_node',
          path: [0, 0],
          position: 3,
          properties: {},
        },
        {
          type: 'split_node',
          path: [0],
          position: 1,
          properties: { type: 'paragraph' },
        },
      ];
      pipeline.fugue.insertLocal({ line: 0, column: 3 }, '\n');
      pipeline.applyOperations(slateOperations);
      // Extract the undo operations
      const { operations } = pipeline.extractUndoOperations();
      // Apply the undo operations
      pipeline.applyHistoryOperations(...operations);
      const afterSnapshot = pipeline.takeSnapshot();
      // Compare
      expect(afterSnapshot).toEqual(beforeSnapshot);
    });
  });
  describe('End of line', () => {
    it('no inline styles', () => {
      // Setup the editor
      pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello'.split(''));
      pipeline.setupEditor();
      const beforeSnapshot = pipeline.takeSnapshot();
      // Apply the operation
      const slateOperations: SplitNodeOperation[] = [
        {
          type: 'split_node',
          path: [0, 0],
          position: 5,
          properties: {},
        },
        {
          type: 'split_node',
          path: [0],
          position: 1,
          properties: { type: 'paragraph' },
        },
      ];
      pipeline.fugue.insertLocal({ line: 0, column: 5 }, '\n');
      pipeline.applyOperations(slateOperations);
      // Extract the undo operations
      const { operations } = pipeline.extractUndoOperations();
      // Apply the undo operations
      pipeline.applyHistoryOperations(...operations);
      const afterSnapshot = pipeline.takeSnapshot();
      // Compare
      expect(afterSnapshot).toEqual(beforeSnapshot);
    });
    it('inline styles', () => {
      // Setup the editor
      pipeline.fugue.insertLocal({ line: 0, column: 0 }, ...'Hello'.split(''));
      pipeline.fugue.updateInlineStyleLocal(
        {
          start: { line: 0, column: 0 },
          end: { line: 0, column: 5 },
        },
        'bold',
        true
      );
      pipeline.setupEditor();
      const beforeSnapshot = pipeline.takeSnapshot();
      // Apply the operation
      const slateOperations: SplitNodeOperation[] = [
        {
          type: 'split_node',
          path: [0, 0],
          position: 5,
          properties: {},
        },
        {
          type: 'split_node',
          path: [0],
          position: 1,
          properties: { type: 'paragraph' },
        },
      ];
      pipeline.fugue.insertLocal({ line: 0, column: 5 }, '\n');
      pipeline.applyOperations(slateOperations);
      // Extract the undo operations
      const { operations } = pipeline.extractUndoOperations();
      // Apply the undo operations
      pipeline.applyHistoryOperations(...operations);
      const afterSnapshot = pipeline.takeSnapshot();
      // Compare
      expect(afterSnapshot).toEqual(beforeSnapshot);
    });
  });
});
